# Analytics — self-hosted Aptabase

The site reports page views and link clicks to the operator's self-hosted Aptabase at
`https://analytics.sshlg.me` (DigitalOcean, Frankfurt), app **SV Lab**. The wire format and the
build-mode rule are owned by the `sshlg-analytics` repository, `docs/client-contract.md`.

## How it works

- Client: [`src/lib/aptabase.js`](../src/lib/aptabase.js), first-party, no dependencies. Loaded by
  [`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) on every page (Astro inlines it).
- No cookies, no `localStorage`, no `sessionStorage`; the session id and the growth `iid` live in
  memory and rotate together after 1 h idle.
- `POST /api/v0/events` with header `App-Key`, at most 25 events per batch, flushed after 5 s, on
  `pagehide` and when the tab is hidden (`fetch` with `keepalive`). Retries only on a network error,
  `429` or `5xx`, three attempts; any other `4xx` is dropped; nothing older than 24 h is sent.

## Build mode

`isDebug` is `false` exactly when `location.hostname === "svlab.online"` (the canonical host from
`public/CNAME` and `astro.config.mjs`; `www.svlab.online` 301-redirects to it). Every other host —
`localhost`, `www.`, `ssheleg.github.io`, a preview — sends Debug events, which the Aptabase
dashboard shows only in Debug mode. One function, `isDebugHost`, with a table test.

## Growth identity (`iid`, `environment`)

The operator's growth service reads this app (slug `svlab`) from the same Aptabase and counts an
event only when its props carry `iid` (a lowercase UUID) and `environment` (exactly `production` or
`sandbox`). Before 2026-10-21 the site sent neither, so growth's charts for SV Lab read zero.

- **Attached in one place.** `track` in `src/lib/aptabase.js` is the only sink; it sets `iid` and
  `environment` after the caller's props, and `scalarProps` drops any caller key named `iid` or
  `environment` (any letter case). No call site can set or forget them.
- **`environment`** is `production` exactly on `svlab.online` (`environmentForHost`), `sandbox` on
  every other host, and `isDebug` is derived from it, so the two always agree.
- **`iid`** is a random UUID v4 from the page's `crypto`, made for analytics only (never a user id,
  e-mail, hash or device id). It is born with the in-memory session and replaced when the session
  rotates. A page without `crypto` gets no `iid` and sends nothing.

**Decision (2026-10-21): no consent switch, `iid` per session in memory.** The site has no cookie
banner and no privacy page, and its analytics promise is "no cookies, nothing stored in the
browser". A stable install id would have to be stored (`localStorage`), which for an EU site needs
the visitor's consent and so a banner. An in-memory `iid` with the session's lifetime adds no
storage and no new linkage: it is a second random token beside the session id that already ships.
The cost: this is a multi-page site, so each page load starts a new session and a new `iid`;
growth's "installs" for SV Lab therefore count page-load sessions, not people, and a funnel joins
only events of the same page (a `page_view` and the clicks on it). If people-level counts are ever
wanted, add a consent switch first, make the `iid` on opt-in, delete it on opt-out, and describe it
on a privacy page in the same change.

## Events

Every event carries `page` (the path as a template, never a query string or hash), plus `iid` and
`environment` (above).

| Event | When | Props |
|---|---|---|
| `page_view` | each page load | `page` |
| `contact_click` | any `mailto:` link (nav, hero, contact, consulting CTAs, footer, 404) | `section` |
| `outbound_click` | a link to another host (products, GitHub, open-source repos) | `destination` (host, `www.` stripped), `section` |
| `cta_click` | an internal link styled as a CTA (`btn-primary`, `btn-secondary`, `about-cta`, `hub-card`, `fde-strip`, `cta`) | `target` (path template, or `#anchor` on the same page), `section` |

`section` is `nav`, `footer`, or the enclosing `<section>`'s id (else its first class, e.g. `cta-band`).
A `mailto:` click never sends the address, subject or body. Every prop passes one filter: scalars
only, keys that could hold personal data or free text dropped, any string with `@` or a URL dropped.

The site has no forms, no language switch, no cookie banner, no privacy page and no CSP (checked
2026-10-09); if a CSP is added, it needs `connect-src https://analytics.sshlg.me`.

## The App Key

The key is public by design (it ships in every page). Its source is the observatory vault slot
`sshlg-analytics/prod/APTABASE_APP_KEY_SVLAB`; it is written into `APP_KEY` in
`src/lib/aptabase.js` by a script that reads it from its environment, run as:

```sh
python3 "$(project-observatory full-path)/tools/use_secret.py" run --env prod --vault-only \
  sshlg-analytics APTABASE_APP_KEY_SVLAB -- python3 <inject-script> src/lib/aptabase.js
```

A client whose key is not of the form `A-XX-0000000000` sends nothing, and
`scripts/check-site.mjs` fails the build if the bundled pages lack the client or carry an
un-injected placeholder. Tests build their clients with a fake key.

## Checks

- `npm test`: 16 unit tests (`tests/aptabase.test.mjs`); part of `npm run build`. Four of them
  guard the growth identity: removing the `iid` line from `track` fails 6 tests, removing the
  `environment` line fails 5 (checked 2026-10-21).
- After a deploy: open `https://svlab.online/`, then in `sshlg-analytics` run
  `scripts/stats.sh 1 "SV Lab"`: `release.events` grows, and in growth
  `growth.analytics.events.list` for app `svlab`, environment `production`, shows `page_view` with
  installs above zero. Before the merge, on 2026-10-09 a Debug
  event sent through this client with the real key returned `200` and showed as `debug.events: 1`,
  `release.events: 0`.

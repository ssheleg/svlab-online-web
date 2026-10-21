// SV Lab — product analytics (Aptabase).
//
// Sends the site's events to the operator's self-hosted Aptabase at
// analytics.sshlg.me (EU). First-party, no dependencies, no cookies, nothing
// stored in the browser: the session id lives in memory only.
//
// Rules (sshlg-analytics docs/client-contract.md):
// - Build mode: Release only on the canonical host `svlab.online`. Every other
//   host — localhost, `www.` (it 301s to the apex), a preview — is Debug
//   (`isDebug: true`), so the dashboard's Release view counts real visitors only.
// - Growth identity: every event carries `iid` and `environment`, attached in
//   `track` and nowhere else; a caller cannot set or forget them. `environment`
//   is `production` exactly on `svlab.online` and agrees with `isDebug`. `iid` is
//   a random UUID made for analytics only, held in memory with the same
//   lifetime as the session id and replaced when the session rotates. It is
//   never stored, so the site still keeps nothing in the browser and needs no
//   consent banner (decision in docs/analytics.md, "Growth identity").
// - No personal data: props are scalars (string ≤ 180, finite number,
//   boolean); keys that could carry personal data or free text are dropped, and
//   so is any string holding `@` or a URL. Paths are sent as templates, never
//   with a query string. A mailto click sends where it was clicked, never the
//   address, subject or body.
// - Wire: POST /api/v0/events, header App-Key, at most 25 events per batch,
//   retry only on a network error, 429 or 5xx (three attempts), never on another
//   4xx; nothing older than 24 h; the session rotates after 1 h idle.
//
// The App Key is public by design (it ships in every browser). It lives in the
// observatory vault as sshlg-analytics/prod/APTABASE_APP_KEY_SVLAB and is
// written into APP_KEY below by an injection script, never typed by hand.

export const APP_KEY = "A-SH-7744594567";
export const HOST = "https://analytics.sshlg.me";
export const PRODUCTION_HOST = "svlab.online";
export const SDK_VERSION = "svlab-web@1.0.0";

const MAX_BATCH = 25;
const MAX_QUEUE = 100;
const MAX_ATTEMPTS = 3;
const FLUSH_MS = 5000;
const SESSION_IDLE_MS = 60 * 60 * 1000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PRIVATE_KEY =
  /(e?mail|phone|password|token|secret|query|prompt|message|text|content|body|subject|url|link|address|(^|_)(name|key|ip)($|_))/i;
const CTA_CLASSES = ["btn-primary", "btn-secondary", "about-cta", "hub-card", "fde-strip", "cta"];

/** Growth's environment: `production` exactly on the production host, `sandbox` anywhere else. */
export function environmentForHost(hostname) {
  return hostname === PRODUCTION_HOST ? "production" : "sandbox";
}

/** The one build-mode rule: Release (false) exactly when the environment is production. */
export function isDebugHost(hostname) {
  return environmentForHost(hostname) !== "production";
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** A random lowercase UUID v4 from the page's crypto, or null when the page has none. */
export function randomUuid(cryptoImpl) {
  try {
    if (cryptoImpl && typeof cryptoImpl.randomUUID === "function") {
      const id = String(cryptoImpl.randomUUID()).toLowerCase();
      if (UUID.test(id)) return id;
    }
    if (cryptoImpl && typeof cryptoImpl.getRandomValues === "function") {
      const b = cryptoImpl.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
      return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    }
  } catch {
    /* no usable crypto: no iid, so nothing is sent */
  }
  return null;
}

/** A path as its template: ids, hashes and long tokens become `:id`; query and hash are dropped. */
export function templatePath(path) {
  return (
    String(path || "/")
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .map((part) =>
        /^\d{2,}$/.test(part) ||
        /^[0-9a-f]{8,}(-[0-9a-f]{4,}){0,4}$/i.test(part) ||
        /^[A-Za-z0-9_-]{20,}$/.test(part)
          ? ":id"
          : part,
      )
      .join("/")
      .slice(0, 180) || "/"
  );
}

/**
 * Scalar product facts only: personal-data keys and strings with `@` or a URL
 * never leave. `iid` and `environment` belong to the sink and are dropped here.
 */
export function scalarProps(params) {
  const out = {};
  if (!params || typeof params !== "object") return out;
  for (const k of Object.keys(params)) {
    if (!k || k.length > 40 || PRIVATE_KEY.test(k) || /^(iid|environment)$/i.test(k)) continue;
    const v = params[k];
    if (typeof v === "string") {
      if (/@|https?:|\/\/|mailto:/i.test(v)) continue;
      out[k] = v.slice(0, 180);
    } else if (typeof v === "number" && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === "boolean") {
      out[k] = v;
    }
  }
  return out;
}

/** Where on the page a link sits: nav, footer, or the section's id (else its first class). */
function sectionOf(el) {
  const box = el.closest ? el.closest("footer, .nav-shell, section") : null;
  if (!box) return "page";
  if (box.tagName === "FOOTER") return "footer";
  if (box.classList && box.classList.contains("nav-shell")) return "nav";
  return box.id || (box.classList && box.classList[0]) || "section";
}

/**
 * The event a click on a link stands for, or null. `link` is an <a> element,
 * `here` the page's location. Only product facts come out: never the href itself.
 */
export function describeLinkClick(link, here) {
  if (!link) return null;
  const raw = link.getAttribute ? link.getAttribute("href") || "" : "";
  const section = sectionOf(link);
  if (/^mailto:/i.test(raw)) return { name: "contact_click", props: { section } };
  let url;
  try {
    url = new URL(raw, here.href);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.hostname !== here.hostname) {
    return { name: "outbound_click", props: { destination: url.hostname.replace(/^www\./, ""), section } };
  }
  const isCta = CTA_CLASSES.some((c) => link.classList && link.classList.contains(c));
  if (!isCta) return null;
  const samePage = templatePath(url.pathname) === templatePath(here.pathname);
  const target = samePage && url.hash ? url.hash.slice(0, 60) : templatePath(url.pathname);
  return { name: "cta_click", props: { target, section } };
}

/**
 * A client bound to one window. `appKey` is passed in so tests never touch the
 * real key; `now` and `random` are injectable for the same reason.
 */
export function createAptabase({ win, appKey, now = () => Date.now(), random = Math.random }) {
  let queue = [];
  let timer = null;
  let inflight = false;
  const session = { id: "", iid: null, last: 0 };
  let lastPath = "";
  const enabled = /^A-[A-Z]{2}-\d{10}$/i.test(String(appKey || ""));

  const hostname = () => {
    try {
      return win.location.hostname;
    } catch {
      return "";
    }
  };

  /** The current session, rotated after an hour idle; its `iid` is born and dies with it. */
  function touchSession() {
    const t = now();
    if (!session.id || t - session.last > SESSION_IDLE_MS) {
      // The SDKs' numeric form: unix seconds × 10^8 + 8 random digits.
      session.id = String(Math.floor(t / 1000)) + String(Math.floor(1e7 + random() * 9e7));
      session.iid = randomUuid(win.crypto);
    }
    session.last = t;
    return session;
  }

  function schedule() {
    if (timer) return;
    timer = win.setTimeout(() => {
      timer = null;
      flush();
    }, FLUSH_MS);
  }

  /**
   * The one sink every event passes through. `iid` and `environment` are set
   * here, after the caller's props, so no call site can set or forget them;
   * without an `iid` (no crypto) nothing is queued at all.
   */
  function track(name, params) {
    if (!name || !enabled) return;
    const current = touchSession();
    if (!current.iid) return;
    const environment = environmentForHost(hostname());
    const props = scalarProps(params);
    props.page = templatePath(win.location && win.location.pathname);
    props.iid = current.iid;
    props.environment = environment;
    queue.push({
      at: now(),
      attempts: 0,
      body: {
        timestamp: new Date(now()).toISOString(),
        sessionId: current.id,
        eventName: String(name).slice(0, 60),
        systemProps: {
          isDebug: environment !== "production",
          locale: ((win.navigator && win.navigator.language) || "").slice(0, 10),
          osName: "",
          appVersion: "",
          sdkVersion: SDK_VERSION,
        },
        props,
      },
    });
    if (queue.length > MAX_QUEUE) queue.splice(0, queue.length - MAX_QUEUE);
    if (queue.length >= MAX_BATCH) flush();
    else schedule();
  }

  function pageView() {
    const path = templatePath(win.location && win.location.pathname);
    if (path === lastPath) return;
    lastPath = path;
    track("page_view", {});
  }

  function retry(batch) {
    for (const q of batch) q.attempts += 1;
    queue = queue.filter((q) => q.attempts < MAX_ATTEMPTS);
  }

  function flush() {
    if (inflight || !queue.length) return Promise.resolve();
    const cutoff = now() - MAX_AGE_MS;
    queue = queue.filter((q) => q.at >= cutoff);
    const batch = queue.slice(0, MAX_BATCH);
    if (!batch.length) return Promise.resolve();
    inflight = true;
    return Promise.resolve()
      .then(() =>
        win.fetch(`${HOST}/api/v0/events`, {
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json", "App-Key": appKey },
          body: JSON.stringify(batch.map((q) => q.body)),
        }),
      )
      .then(
        (res) => {
          if (res.status === 429 || res.status >= 500) return retry(batch);
          // 2xx was accepted; any other 4xx can never succeed, so it is dropped too.
          queue = queue.filter((q) => !batch.includes(q));
        },
        () => retry(batch),
      )
      .then(() => {
        inflight = false;
        if (queue.length) schedule();
      });
  }

  function onClick(event) {
    const target = event && event.target;
    const link = target && target.closest ? target.closest("a[href]") : null;
    const ev = describeLinkClick(link, win.location);
    if (ev) track(ev.name, ev.props);
  }

  return { track, flush, pageView, onClick, queue: () => queue };
}

/** Wire the client into the page: a page view on load, link clicks, a flush when the page is hidden. */
export function install(win) {
  if (!win || !win.document || win.__svlabAptabase) return null;
  const client = createAptabase({ win, appKey: APP_KEY });
  win.__svlabAptabase = client;
  win.document.addEventListener("click", client.onClick, { capture: true, passive: true });
  win.addEventListener("pagehide", () => client.flush());
  win.document.addEventListener("visibilitychange", () => {
    if (win.document.visibilityState === "hidden") client.flush();
  });
  client.pageView();
  return client;
}

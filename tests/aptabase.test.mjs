// Unit tests for src/lib/aptabase.js in a fake browser. `node --test`; no network,
// and never the real App Key: every client here is built with a test key.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createAptabase,
  describeLinkClick,
  environmentForHost,
  isDebugHost,
  randomUuid,
  scalarProps,
  templatePath,
} from "../src/lib/aptabase.js";

const TEST_KEY = "A-SH-0000000000";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Storage that records every touch: the client must never use it. */
function spyStorage(touched) {
  const spy = (op) => () => {
    touched.push(op);
    return null;
  };
  return { getItem: spy("getItem"), setItem: spy("setItem"), removeItem: spy("removeItem"), clear: spy("clear") };
}

/** The growth identity props, checked and removed, so the rest can be compared exactly. */
function identity(e) {
  const { iid, environment, ...rest } = e.props;
  assert.match(iid, UUID, "every event carries a lowercase UUID iid");
  assert.ok(environment === "production" || environment === "sandbox", `environment ${environment}`);
  assert.equal(environment === "production", e.systemProps.isDebug === false, "environment agrees with isDebug");
  return { iid, environment, rest };
}

function browser({ host = "svlab.online", pathname = "/", statuses = [], appKey = TEST_KEY, crypto = globalThis.crypto } = {}) {
  const sent = [];
  const timers = [];
  const touched = [];
  let clock = Date.parse("2026-10-09T12:00:00Z");
  const win = {
    location: { hostname: host, pathname, href: `https://${host}${pathname}` },
    navigator: { language: "pl-PL" },
    crypto,
    localStorage: spyStorage(touched),
    sessionStorage: spyStorage(touched),
    setTimeout: (fn) => {
      timers.push(fn);
      return timers.length;
    },
    fetch: async (url, init) => {
      sent.push({ url, init, events: JSON.parse(init.body) });
      const s = statuses.length ? statuses.shift() : 200;
      if (s === "offline") throw new TypeError("offline");
      return { status: s };
    },
  };
  const a = createAptabase({ win, appKey, now: () => clock, random: () => 0.5 });
  return { a, sent, win, timers, touched, advance: (ms) => (clock += ms) };
}

/** A fake <a> inside a fake landmark, enough for describeLinkClick. */
function link(href, { classes = [], box = { tagName: "SECTION", id: "contact", classes: ["contact"] } } = {}) {
  const boxEl = box && { tagName: box.tagName, id: box.id || "", classList: Object.assign([...box.classes], { contains: (c) => box.classes.includes(c) }) };
  return {
    getAttribute: (n) => (n === "href" ? href : null),
    classList: { contains: (c) => classes.includes(c) },
    closest: () => boxEl || null,
  };
}

test("build mode: Release only on the canonical host svlab.online", () => {
  const table = [
    ["svlab.online", false],
    ["www.svlab.online", true],
    ["localhost", true],
    ["127.0.0.1", true],
    ["ssheleg.github.io", true],
    ["preview.svlab.online", true],
    ["svlab.online.", true],
    ["", true],
  ];
  for (const [host, debug] of table) assert.equal(isDebugHost(host), debug, host);
});

test("every event carries the host's build mode, not a constant", async () => {
  for (const [host, debug] of [["svlab.online", false], ["localhost", true], ["www.svlab.online", true]]) {
    const b = browser({ host });
    b.a.pageView();
    await b.a.flush();
    assert.equal(b.sent[0].events[0].systemProps.isDebug, debug, host);
  }
});

test("page_view: wire format, one per path, templated, no query string", async () => {
  const b = browser({ pathname: "/consulting/ai-advisory" });
  b.a.pageView();
  b.a.pageView();
  await b.a.flush();
  assert.equal(b.sent.length, 1);
  const { url, init, events } = b.sent[0];
  assert.equal(url, "https://analytics.sshlg.me/api/v0/events");
  assert.equal(init.method, "POST");
  assert.equal(init.keepalive, true);
  assert.equal(init.headers["App-Key"], TEST_KEY);
  assert.equal(init.headers["Content-Type"], "application/json");
  assert.equal(events.length, 1);
  const [e] = events;
  assert.equal(e.eventName, "page_view");
  assert.match(e.sessionId, /^\d{18}$/);
  assert.equal(e.timestamp, "2026-10-09T12:00:00.000Z");
  assert.deepEqual(e.systemProps, { isDebug: false, locale: "pl-PL", osName: "", appVersion: "", sdkVersion: "svlab-web@1.0.0" });
  const { environment, rest } = identity(e);
  assert.equal(environment, "production");
  assert.deepEqual(rest, { page: "/consulting/ai-advisory" });
  assert.equal(templatePath("/x/3f2a9c1e-4b7d-4e2a-9c1e-4b7d4e2a9c1e?email=a@b.c#top"), "/x/:id");
});

test("props: scalars only; personal-data keys, e-mails and URLs never leave", async () => {
  const b = browser();
  b.a.track("contact_click", {
    section: "contact",
    count: 2,
    first: true,
    email: "visitor@example.com",
    user_name: "Ann",
    message: "hello there",
    subject: "Book a call",
    search_query: "acme",
    ref: "https://evil.example/x",
    note: "me@example.com",
    items: [1, 2],
    nested: { a: 1 },
  });
  await b.a.flush();
  const e = b.sent[0].events[0];
  assert.deepEqual(identity(e).rest, { section: "contact", count: 2, first: true, page: "/" });
  const flat = JSON.stringify(b.sent);
  for (const planted of ["visitor@example.com", "Ann", "hello there", "Book a call", "acme", "evil.example", "me@example.com"]) {
    assert.ok(!flat.includes(planted), planted);
  }
  assert.deepEqual(scalarProps(null), {});
});

test("clicks: mailto, outbound and CTA become product facts, never the href", () => {
  const here = { hostname: "svlab.online", pathname: "/consulting", href: "https://svlab.online/consulting" };
  const mail = describeLinkClick(link("mailto:contact@svlab.online?subject=Consulting&body=Hi"), here);
  assert.deepEqual(mail, { name: "contact_click", props: { section: "contact" } });
  assert.ok(!JSON.stringify(mail).includes("svlab.online"));

  const out = describeLinkClick(link("https://www.prowl.chat/pricing?utm=x", { box: { tagName: "FOOTER", classes: ["footer"] } }), here);
  assert.deepEqual(out, { name: "outbound_click", props: { destination: "prowl.chat", section: "footer" } });

  const nav = describeLinkClick(link("mailto:contact@svlab.online", { classes: ["cta"], box: { tagName: "HEADER", classes: ["nav-shell"] } }), here);
  assert.deepEqual(nav.props, { section: "nav" });

  const cta = describeLinkClick(link("/consulting/ai-advisory", { classes: ["btn-primary"], box: { tagName: "SECTION", classes: ["hub-hero"] } }), here);
  assert.deepEqual(cta, { name: "cta_click", props: { target: "/consulting/ai-advisory", section: "hub-hero" } });

  const anchor = describeLinkClick(link("#services", { classes: ["btn-secondary"] }), here);
  assert.deepEqual(anchor.props, { target: "#services", section: "contact" });

  assert.equal(describeLinkClick(link("/about"), here), null, "plain internal links are page views, not CTA clicks");
  assert.equal(describeLinkClick(link("javascript:void(0)"), here), null);
  assert.equal(describeLinkClick(null, here), null);
});

test("onClick tracks the click through the same privacy filter", async () => {
  const b = browser();
  const a = link("mailto:contact@svlab.online?subject=Book%20a%20call");
  b.a.onClick({ target: { closest: () => a } });
  await b.a.flush();
  const e = b.sent[0].events[0];
  assert.equal(e.eventName, "contact_click");
  assert.deepEqual(identity(e).rest, { section: "contact", page: "/" });
  assert.ok(!JSON.stringify(b.sent).includes("contact@"));
});

test("an un-injected key sends nothing", async () => {
  const b = browser({ appKey: "__APTABASE_APP_KEY__" });
  b.a.pageView();
  b.a.track("contact_click", { section: "x" });
  await b.a.flush();
  assert.equal(b.sent.length, 0);
  assert.equal(b.a.queue().length, 0);
});

test("batches of at most 25; a 5xx keeps the batch, three attempts at most", async () => {
  const b = browser({ statuses: [500, 200, 200] });
  for (let i = 0; i < 29; i++) b.a.track("e" + i, {});
  await new Promise((r) => setImmediate(r));
  assert.equal(b.sent[0].events.length, 25);
  assert.equal(b.a.queue().length, 29, "the failed batch is kept");
  await b.a.flush();
  await b.a.flush();
  assert.equal(b.a.queue().length, 0);
  assert.ok(b.sent.every((s) => s.events.length <= 25));
});

test("429 is retried; a 400 or 404 is dropped", async () => {
  const r = browser({ statuses: [429] });
  r.a.track("x", {});
  await r.a.flush();
  assert.equal(r.a.queue().length, 1, "429 is kept for a retry");
  for (const s of [400, 404]) {
    const b = browser({ statuses: [s] });
    b.a.track("x", {});
    await b.a.flush();
    assert.equal(b.a.queue().length, 0, `${s} can never succeed: dropped`);
  }
});

test("network errors: three failed attempts, then dropped", async () => {
  const b = browser({ statuses: ["offline", "offline", "offline"] });
  b.a.track("x", {});
  await b.a.flush();
  await b.a.flush();
  assert.equal(b.a.queue().length, 1);
  await b.a.flush();
  assert.equal(b.a.queue().length, 0);
});

test("nothing older than 24 h is sent; the session rotates after an hour idle", async () => {
  const b = browser({ statuses: ["offline"] });
  b.a.pageView();
  await b.a.flush();
  b.advance(25 * 3600 * 1000);
  await b.a.flush();
  assert.equal(b.sent.length, 1, "the day-old page view is not sent again");

  b.a.track("a", {});
  const s1 = b.a.queue().at(-1).body.sessionId;
  b.advance(30 * 60 * 1000);
  b.a.track("b", {});
  assert.equal(b.a.queue().at(-1).body.sessionId, s1, "30 min idle keeps the session");
  b.advance(61 * 60 * 1000);
  b.a.track("c", {});
  assert.notEqual(b.a.queue().at(-1).body.sessionId, s1);
});

test("the queue is bounded at 100 events", () => {
  const b = browser();
  b.win.fetch = () => new Promise(() => {}); // a request that never answers keeps the batch in flight
  for (let i = 0; i < 130; i++) b.a.track("e" + i, {});
  assert.equal(b.a.queue().length, 100);
});

test("growth identity: every event leaves the sink with iid and environment", async () => {
  for (const [host, env] of [["svlab.online", "production"], ["localhost", "sandbox"], ["www.svlab.online", "sandbox"], ["ssheleg.github.io", "sandbox"]]) {
    assert.equal(environmentForHost(host), env, host);
    const b = browser({ host });
    b.a.pageView();
    b.a.track("contact_click", { section: "contact" });
    b.a.track("outbound_click", { destination: "prowl.chat", section: "footer" });
    await b.a.flush();
    const events = b.sent.flatMap((s) => s.events);
    assert.equal(events.length, 3, host);
    for (const e of events) {
      const { environment } = identity(e);
      assert.equal(environment, env, `${host} ${e.eventName}`);
    }
    assert.equal(new Set(events.map((e) => e.props.iid)).size, 1, "one iid per session");
  }
});

test("growth identity: a caller can neither set nor remove iid and environment", async () => {
  const b = browser({ host: "localhost" });
  b.a.track("contact_click", { iid: "00000000-0000-4000-8000-000000000000", environment: "production", IID: "x", Environment: "production", section: "nav" });
  await b.a.flush();
  const e = b.sent[0].events[0];
  const { iid, environment, rest } = identity(e);
  assert.notEqual(iid, "00000000-0000-4000-8000-000000000000");
  assert.equal(environment, "sandbox");
  assert.equal(e.systemProps.isDebug, true);
  assert.deepEqual(rest, { section: "nav", page: "/" });
  assert.deepEqual(scalarProps({ iid: "a", environment: "b", ok: 1 }), { ok: 1 });
});

test("growth identity: the iid lives with the session in memory and is never stored", async () => {
  const b = browser({ statuses: [200, 200, 200] });
  b.a.track("a", {});
  const first = b.a.queue().at(-1).body;
  b.advance(30 * 60 * 1000);
  b.a.track("b", {});
  assert.equal(b.a.queue().at(-1).body.props.iid, first.props.iid, "same session, same iid");
  b.advance(61 * 60 * 1000);
  b.a.track("c", {});
  const rotated = b.a.queue().at(-1).body;
  assert.notEqual(rotated.sessionId, first.sessionId);
  assert.notEqual(rotated.props.iid, first.props.iid, "a new session gets a new iid");
  assert.match(rotated.props.iid, UUID);
  await b.a.flush();
  assert.deepEqual(b.touched, [], "no localStorage or sessionStorage access");
  const other = browser();
  other.a.track("a", {});
  assert.notEqual(other.a.queue().at(-1).body.props.iid, first.props.iid, "another page load, another iid");
});

test("growth identity: without crypto there is no iid, and nothing is sent", async () => {
  const b = browser({ crypto: null });
  b.a.pageView();
  b.a.track("contact_click", { section: "contact" });
  await b.a.flush();
  assert.equal(b.sent.length, 0);
  assert.equal(b.a.queue().length, 0);
  assert.equal(randomUuid(undefined), null);
  const fallback = randomUuid({ getRandomValues: (a) => globalThis.crypto.getRandomValues(a) });
  assert.match(fallback, UUID);
  assert.equal(fallback[14], "4", "UUID v4");
});

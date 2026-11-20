const qt = "1.0";

function Ne(a) {
  const n = String(a || ""), t = Number(n.startsWith("seq:") ? n.slice(4) : n);
  return Number.isFinite(t) ? t : 0;
}
function dt(a) {
  return "seq:" + String(Math.max(0, Number(a) || 0));
}
function Ie(a, n) {
  return Ne(n) >= Ne(a) ? String(n || a) : String(a || "");
}
function It(a, n = {}) {
  const t = a && a.payload && typeof a.payload == "object" ? a.payload : {}, r = Number(a && (a.sequence ?? a.seq) || 0), c = String(
    a && a.cursor || (r > 0 ? dt(r) : n.cursor || dt(r))
  );
  return {
    ...a,
    protocolVersion: String(a && a.protocolVersion || qt),
    sessionId: String(a && a.sessionId || n.sessionId || ""),
    eventId: String(a && a.eventId || a && a.id || ""),
    cursor: c,
    sequence: Number.isFinite(r) && r > 0 ? r : Ne(c),
    emittedAt: String(a && a.emittedAt || a && a.at || ""),
    type: String(a && a.type || ""),
    payload: t
  };
}
function Rt(a, n) {
  return a && (!n || a.sessionId === String(n)) && !!a.eventId && !!a.type;
}
function F(a, n) {
  const t = new URL(a);
  for (const [r, c] of Object.entries(n))
    c != null && c !== "" && t.searchParams.set(r, String(c));
  return t.toString();
}
function Ht(a = {}) {
  const n = String(a.baseUrl || "").replace(/\/+$/, "");
  try {
    new URL(n);
  } catch {
    throw new Error("电脑地址无效：" + (n || "(空)"));
  }
  const t = String(a.token || ""), r = String(a.sessionId || ""), c = a.fetchImpl || fetch, d = a.EventSourceImpl || EventSource, l = Number(a.timeoutMs) || 12e3;
  function u() {
    return t ? { Authorization: "Bearer " + t } : {};
  }
  async function m({ cursor: y, reason: w, before: q, turns: N } = {}) {
    const B = { session: r, turns: Number(N) || 10 };
    y && Ne(y) > 0 && (B.after = Ne(y)), Number(q) > 0 && (B.before = Number(q)), w && (B.reason = w);
    const ee = new AbortController(), Y = setTimeout(() => ee.abort(), l);
    try {
      const W = await c(F(n + "/snapshot", B), {
        headers: u(),
        signal: ee.signal
      }), $ = await W.json();
      if (!W.ok)
        throw new Error($ && ($.error || $.message) || "snapshot " + W.status);
      return $;
    } finally {
      clearTimeout(Y);
    }
  }
  async function e({ data: y, mediaType: w, name: q }) {
    const N = await c(F(n + "/upload-image", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ data: y, mediaType: w, ...q ? { name: q } : {} })
    }), B = await N.json();
    if (!N.ok) throw new Error(B && B.error || "upload-image " + N.status);
    return B.attachment;
  }
  async function I({ data: y, name: w }) {
    const q = await c(F(n + "/upload-file", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ data: y, ...w ? { name: w } : {} })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "upload-file " + q.status);
    return N.attachment;
  }
  async function C({ text: y, images: w, files: q }) {
    r && await c(F(n + "/target", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: r })
    });
    const N = await c(F(n + "/send", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({
        text: String(y || ""),
        images: Array.isArray(w) ? w : [],
        files: Array.isArray(q) ? q : [],
        clientMessageId: typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : "v3-" + Date.now()
      })
    }), B = await N.json();
    if (!N.ok) throw new Error(B && B.error || "send " + N.status);
    return B;
  }
  async function O({ id: y, allow: w = !0 }) {
    const q = await c(F(n + "/approvals", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(y || ""), decision: w ? "allow" : "deny" })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "approval " + q.status);
    return N;
  }
  async function K({ id: y, answers: w }) {
    const q = await c(F(n + "/respond", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(y || ""), answers: Array.isArray(w) ? w : [] })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "respond " + q.status);
    return N;
  }
  async function Q() {
    const y = await c(F(n + "/stop", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: "{}"
    }), w = await y.json();
    if (!y.ok) throw new Error(w && w.error || "stop " + y.status);
    return w;
  }
  function he(y) {
    const w = String(y || "").replace(/^file:/, "");
    return n + "/image/" + encodeURIComponent(w) + (t ? "?token=" + encodeURIComponent(t) : "");
  }
    function xe(y) {
    const w = String(y || "").replace(/^file:/, "");
    return n + "/file/" + encodeURIComponent(w) + (t ? "?token=" + encodeURIComponent(t) : "");
  }
  function ye(y) {
    return n + "/workspace/file?path=" + encodeURIComponent(String(y || "")) + (t ? "&token=" + encodeURIComponent(t) : "");
  }
  function se(y, w, q) {
    return n + "/presented/file?session=" + encodeURIComponent(r) + "&seq=" + encodeURIComponent(String(y || 0)) + "&index=" + encodeURIComponent(String(w || 0)) + (q ? "&name=" + encodeURIComponent(String(q)) : "") + (t ? "&token=" + encodeURIComponent(t) : "");
  }
  async function Z() {
    const y = await c(F(n + "/sessions", {}), { headers: u() }), w = await y.json();
    if (!y.ok) throw new Error(w && w.error || "sessions " + y.status);
    return {
      sessions: Array.isArray(w.sessions) ? w.sessions : [],
      archived: Array.isArray(w.archived) ? w.archived : [],
      current: String(w.current || "")
    };
  }
  async function ie(y, w) {
    const q = await c(F(n + "/rename", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(y || ""), title: String(w || "") })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "rename " + q.status);
    return N;
  }
  async function we(y) {
    const w = await c(F(n + "/session/archive", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(y || "") })
    }), q = await w.json();
    if (!w.ok) throw new Error(q && q.error || "archive " + w.status);
    return q;
  }
  async function unarchiveSession(y) {
    const w = await c(F(n + "/session/unarchive", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(y || "") })
    }), q = await w.json();
    if (!w.ok) throw new Error(q && q.error || "unarchive " + w.status);
    return q;
  }
  async function forkSession(y, w) {
    const q = await c(F(n + "/fork", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(y || ""), ...(Number.isSafeInteger(Number(w)) ? { atSeq: Number(w) } : {}) })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "fork " + q.status);
    return N;
  }
  async function selectModel(y) {
    const q = await c(F(n + "/model", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: String(y && y.sessionId || r || ""),
        provider: String(y && y.provider || ""),
        model: String(y && y.model || ""),
        ...(y && y.reasoningEffort ? { reasoningEffort: String(y.reasoningEffort) } : {})
      })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "model " + q.status);
    return N;
  }
  async function setPermission(preset) {
    const q = await c(F(n + "/permission", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify({ preset: String(preset || "") })
    }), N = await q.json();
    if (!q.ok) throw new Error(N && N.error || "permission " + q.status);
    return N;
  }
  async function Ae() {
    const y = await c(F(n + "/options", {}), { headers: u() }), w = await y.json();
    if (!y.ok) throw new Error(w && w.error || "options " + y.status);
    return w;
  }
  async function Te(y) {
    const w = await c(F(n + "/new", {}), {
      method: "POST",
      headers: { ...u(), "Content-Type": "application/json" },
      body: JSON.stringify(y && typeof y == "object" ? y : {})
    }), q = await w.json();
    if (!w.ok) throw new Error(q && q.error || "new " + w.status);
    return q;
  }
  function Me({ cursor: y, onEvent: w, onError: q, onOpen: N, onPing: h } = {}) {
    const B = {
      session: r,
      after: Ne(y) || void 0,
      token: t || void 0
    }, ee = new d(F(n + "/events", B));
    let Y = !1;
    return ee.onopen = () => {
      Y || N && N();
    }, ee.onmessage = (W) => {
      if (!(Y || !W || !W.data))
        try {
          const $ = JSON.parse(W.data);
          if (!$) return;
          if ($.type === "heartbeat") { h && h(); return; }
          const Ue = It($, { sessionId: r, cursor: y });
          if (!Ue.eventId) return;
          w && w(Ue);
        } catch {
        }
    }, ee.onerror = () => {
      if (!Y) {
        Y = !0;
        try {
          ee.close();
        } catch {
        }
        q && q();
      }
    }, () => {
      if (!Y) {
        Y = !0;
        try {
          ee.close();
        } catch {
        }
      }
    };
  }
  return { loadSnapshot: m, connect: Me, send: C, approval: O, respond: K, stop: Q, imageUrl: he, fileUrl: xe, workspaceUrl: ye, presentedUrl: se, sessions: Z, newSession: Te, options: Ae, renameSession: ie, archiveSession: we, unarchiveSession, forkSession, selectModel, setPermission, uploadImage: e, uploadFile: I };
}
const V = {
  IDLE: "idle",
  RUNNING: "running",
  WAITING_INPUT: "waiting_input",
  ERROR: "error"
};
function Xe(a = "") {
  return {
    sessionId: String(a || ""),
    session: null,
    messages: [],
    tools: [],
    deliverables: [],
    stream: { text: "", reasoning: "", ended: !1 },
    activity: { status: V.IDLE, revision: 0, text: "" },
    prompts: { items: [], revision: 0 },
    sync: { cursor: "seq:0", seen: [], protocolVersion: "1.0", oldestSeq: 0, hasMore: !1 }
  };
}
function pt(a, n) {
  const t = String(n.id || "");
  if (!t) return a;
  if (n.role === "user") {
    const optimisticIndex = a.findIndex((m) => m && m.optimistic && m.role === "user" && m.text === n.text);
    if (optimisticIndex >= 0) {
      const replaced = a.slice();
      replaced[optimisticIndex] = n;
      replaced.sort((x, y) => (Number(x.revision) || 0) - (Number(y.revision) || 0));
      return replaced;
    }
  }
  const r = a.findIndex((l) => l.id === t);
  const c = r >= 0 ? a[r] : null;
  if (c && Number(n.revision || 0) < Number(c.revision || 0)) return a;
  const out = c ? a.slice() : [...a, n];
  if (c) out[r] = n;
  // 补历史/延迟事件可能乱序到达：按 revision（= event sequence）保持有序。
  out.sort((x, y) => (Number(x.revision) || 0) - (Number(y.revision) || 0));
  return out;
}
function Bt(a, n) {
  const t = a.sync.seen.includes(n.eventId) ? a.sync.seen : a.sync.seen.length >= 500 ? [...a.sync.seen.slice(-400), n.eventId] : [...a.sync.seen, n.eventId];
  return {
    ...a.sync,
    cursor: Ie(a.sync.cursor, n.cursor),
    seen: t
  };
}
function ut(a) {
  return [a && a.id, a && a.approvalId, a && a.callId].map((n) => String(n || "")).filter(Boolean);
}
function Ot(a, n) {
  const t = ut(n), r = a.findIndex((c) => ut(c).some((d) => t.includes(d)));
  return r < 0 ? a.concat(n) : a.map((c, d) => d === r ? { ...c, ...n, id: c.id || n.id } : c);
}
function Nt(a, n) {
  const t = [];
  return a.forEach((r, c) => {
    r && r.role === "user" && t.push(c);
  }), t.length <= n ? a : a.slice(t[t.length - n]);
}
function At(a) {
  return "v3.cache." + a;
}
// 模型胶囊的显示串单独缓存：断网/切会话时用它兜底，只存显示用的文本。
const MODEL_CACHE_PREFIX = "v3.model.";
const MODEL_CACHE_MAX = 60;
function modelCacheKey(a) {
  return MODEL_CACHE_PREFIX + String(a || "");
}
function readModelLabel(a) {
  try {
    return String(localStorage.getItem(modelCacheKey(a)) || "");
  } catch {
    return "";
  }
}
function writeModelLabel(a, n) {
  const key = modelCacheKey(a), value = String(n || "");
  if (!key || !value) return;
  try {
    if (localStorage.getItem(key) === value) return;
    localStorage.setItem(key, value);
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const name = localStorage.key(i) || "";
      if (name.startsWith(MODEL_CACHE_PREFIX)) keys.push(name);
    }
    for (let i = 0; i < keys.length - MODEL_CACHE_MAX; i += 1) localStorage.removeItem(keys[i]);
  } catch {
  }
}
  // 会话列表缓存：先渲染上次的快照，再后台刷新，避免每次打开都先空一下。
  const SESSION_CACHE_KEY = "v3.cache.sessions";
  function readSessionCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(SESSION_CACHE_KEY) || "null");
      return raw && Array.isArray(raw.items) ? raw.items : [];
    } catch {
      return [];
    }
  }
  function saveSessionCache(items) {    try {
      const trimmed = (Array.isArray(items) ? items : []).slice(0, 60).map((x) => ({
        id: x.id,
        title: x.title,
        snippet: x.snippet,
        at: x.at,
        lastMessageAt: x.lastMessageAt,
        lastSeq: x.lastSeq,
        running: !!x.running,
        online: !!x.online,
        blank: !!x.blank,
        cwd: x.cwd
      }));
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({ at: Date.now(), items: trimmed }));
      const titles = {};
      for (const item of trimmed) if (item.id && item.title) titles[item.id] = item.title;
      localStorage.setItem("v3.cache.titles", JSON.stringify(titles));
    } catch {
      /* 缓存写不进去不影响主流程 */
    }
  }
  function sessionTitleOf(id) {
    if (!id) return "";
    try {
      const raw = JSON.parse(localStorage.getItem("v3.cache.titles") || "null");
      if (raw && raw[id]) return String(raw[id]);
    } catch {
      /* fall through to the list cache */
    }
    try {
      const item = readSessionCache().find((x) => x && String(x.id) === String(id));
      return item && item.title ? String(item.title) : "";
    } catch {
      return "";
    }
  }
function We(a) {
  if (!a) return null;
  try {
    const n = JSON.parse(localStorage.getItem(At(a)) || "null");
    if (!n || !Array.isArray(n.messages)) return null;
    const cached = n.sync || {};
    return {
      ...n,
      sync: {
        ...cached,
        cursor: "seq:0",
        seen: [],
        hasMore: Boolean(cached.hasMore),
        oldestSeq: Number(cached.oldestSeq) || 0
      }
    };
  } catch {
    return null;
  }
}
let ft = 0;
function emptySessionState(id) {
  return { session: { id: String(id || ""), title: "" }, messages: [], prompts: [], deliverables: [], processes: [], activity: [], turnError: null, sync: { cursor: "seq:0", seen: [], oldestSeq: 0, hasMore: !1 } };
}
function Pt(a) {
  const n = a && a.session && a.session.id;
  if (!n || !Array.isArray(a.messages)) return;
  const write = (count) => {
    const t = {
      session: a.session,
      messages: Nt(a.messages.filter((m) => !m.optimistic), count),
      prompts: a.prompts,
      deliverables: a.deliverables,
      processes: a.processes,
      activity: a.activity,
      turnError: a.turnError || null,
      sync: a.sync
    };
    localStorage.setItem(At(n), JSON.stringify(t));
  };
  // 大对话可能撞配额：逐步减少消息，始终保住交付/过程/提示。
  for (const count of [35, 25, 15, 8]) {
    try {
      write(count);
      return;
    } catch (error) {
    }
  }
}
function _e(a) {
  window.clearTimeout(ft), ft = window.setTimeout(() => Pt(a), 500);
}
function optimisticText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
function reconcileOptimistic(list) {
  const messages = Array.isArray(list) ? list : [];
  const real = new Set(messages.filter((m) => m && m.role === "user" && !m.optimistic).map((m) => optimisticText(m.text)));
  if (!real.size) return messages;
  return messages.filter((m) => !(m && m.optimistic && real.has(optimisticText(m.text))));
}
function Ve(a, n) {
  // 快照只带最近若干轮事件；deliverable.present 很可能已经滚出窗口，
  // 合并时必须把之前拿到的交付卡片并回来，否则“过一会再点进来”卡片就丢了。
  const keeper = unionDeliverables(a && a.deliverables, n && n.deliverables);
  const processKeeper = unionProcesses(a && a.processes, n && n.processes);
  if (!a || !Array.isArray(a.messages) || !a.messages.length)
    return { ...n, messages: reconcileOptimistic(n.messages), deliverables: keeper, processes: processKeeper };
  if (!n || !Array.isArray(n.messages) || !n.messages.length)
    return { ...a, ...n, messages: reconcileOptimistic(a.messages), deliverables: keeper, processes: processKeeper };
  const t = new Set(n.messages.map((l) => l.id));
  if (!a.messages.some((l) => t.has(l.id))) return { ...n, messages: reconcileOptimistic(n.messages), deliverables: keeper, processes: processKeeper };
  const c = new Map(a.messages.map((l) => [l.id, l]));
  for (const l of n.messages) c.set(l.id, { ...c.get(l.id) || {}, ...l });
  const d = [...c.values()].sort((l, u) => Number(l.revision || 0) - Number(u.revision || 0));
  return { ...n, messages: reconcileOptimistic(Nt(d, 80)), deliverables: keeper, processes: processKeeper };
}
function Tt(a, n) {
  return {
    id: String(a && (a.id || a.approvalId || a.callId) || n),
    approvalId: String(a && a.approvalId || ""),
    callId: String(a && (a.callId || a.id) || ""),
    type: "approval",
    title: String(a && a.title || "需要审批"),
    reason: String(a && a.reason || ""),
    tool: String(a && a.tool || ""),
    status: "pending",
    at: Number(a && a.at) || (a && a.emittedAt ? Date.parse(a.emittedAt) : 0) || 0,
    seq: Number(a && (a.seq || a.sequence)) || 0
  };
}
function Mt(a, n) {
  return {
    id: String(a && (a.callId || a.id) || n),
    callId: String(a && a.callId || ""),
    type: "input",
    title: "需要回答",
    questions: Array.isArray(a && a.questions) ? a.questions : [],
    status: "pending",
    at: Number(a && a.at) || (a && a.emittedAt ? Date.parse(a.emittedAt) : 0) || 0,
    seq: Number(a && (a.seq || a.sequence)) || 0
  };
}
function Ft(a) {
  const n = [];
  for (const t of a && a.approvals || []) n.push(Tt(t, ""));
  for (const t of a && a.inputs || []) n.push(Mt(t, ""));
  return n;
}
function Ct(a, n) {
  const t = It(n, { sessionId: a.sessionId });
  if (!Rt(t, a.sessionId) || !t.type.endsWith(".result") && a.sync.seen.includes(t.eventId)) return a;
  const r = { ...a, sync: Bt(a, t) }, c = t.payload;
  if (t.type === "session.meta")
    return { ...r, session: c.session || r.session };
  if (t.type === "timeline.upsert")
    return { ...r, messages: pt(r.messages, c.message || {}) };
  if (t.type === "timeline.snapshot") {
    const d = Number(t.sequence) || 0, l = Number(a.sync.cursor.replace("seq:", "")) || 0;
    return d < l ? a : { ...r, messages: Array.isArray(c.messages) ? c.messages : [] };
  }
  if (t.type === "activity.updated") {
    const d = Number(c.revision) || 0;
    if (d < (Number(r.activity.revision) || 0)) return r;
    const l = String(c.status || V.IDLE);
    return {
      ...r,
      activity: {
        status: Object.values(V).includes(l) ? l : V.IDLE,
        revision: d,
        text: String(c.text || "")
      }
    };
  }
  if (t.type === "prompt.snapshot")
    return { ...r, prompts: { items: Array.isArray(c.items) ? c.items : [], revision: Number(c.revision) || 0 } };
  if (t.type === "prompt.updated") {
    const d = Number(c.revision) || 0;
    if (d < (Number(r.prompts.revision) || 0)) return r;
    const l = c.item, u = l ? r.prompts.items.filter((m) => m.id !== l.id).concat(l) : r.prompts.items;
    return { ...r, prompts: { items: u, revision: d } };
  }
  if (t.type === "deliverable.present") {
    const d = Array.isArray(c.files) ? c.files : [];
    return { ...r, deliverables: mergeDeliverables(r.deliverables, d, t.sequence, c.turn) };
  }
  if (t.type === "message.user" || t.type === "message.assistant") {
    const d = t.type === "message.user" ? "user" : "assistant";
    return {
      ...r,
      tools: t.type === "message.user" ? [] : r.tools,
      turnError: t.type === "message.user" ? null : r.turnError,
      stream: t.type === "message.assistant" ? { text: "", reasoning: "", ended: !0 } : r.stream,
      turnStartSeq: t.type === "message.user" ? Number(t.sequence) || 0 : r.turnStartSeq,
      messages: pt(r.messages, {
        id: t.eventId,
        role: d,
        text: String(c.text || ""),
        images: Array.isArray(c.images) ? c.images : [],
        files: Array.isArray(c.files) ? c.files : [],
        at: t.emittedAt || "",
        seq: Number(t.sequence) || 0,
        revision: Number(t.sequence) || 0
      })
    };
  }
  if (t.type === "tool.start" || t.type === "tool.update") {
    const d = String(c.callId || c.id || t.eventId), l = r.tools.find((m) => m.callId === d), u = {
      callId: d,
      name: String(c.name || l && l.name || ""),
      detail: String(c.summary || c.detail || l && l.detail || ""),
      status: "running",
      revision: Math.max(Number(l && l.revision) || 0, Number(t.sequence) || 0)
    };
    return {
      ...r,
      tools: l ? r.tools.map((m) => m.callId === d ? u : m) : [...r.tools, u],
      activity: {
        status: V.RUNNING,
        revision: (Number(r.activity.revision) || 0) + 1,
        text: u.detail
      }
    };
  }
  if (t.type === "tool.end") {
    const d = String(c.callId || c.id || ""), l = !!c.error || c.status === "error";
    return {
      ...r,
      tools: r.tools.map(
        (u) => u.callId === d ? {
          ...u,
          status: l ? "error" : "done",
          revision: Math.max(u.revision || 0, Number(t.sequence) || 0)
        } : u
      )
    };
  }
  if (t.type === "message.assistant.delta")
    return {
      ...r,
      stream: {
        text: String(c.text || r.stream.text || ""),
        reasoning: String(c.reasoning || r.stream.reasoning || ""),
        ended: !!c.ended
      },
      activity: {
        status: V.RUNNING,
        revision: (Number(r.activity.revision) || 0) + 1,
        text: String(c.reasoning || "")
      }
    };
  if (t.type === "turn.end" || t.type === "message.error") {
    const reason = String(c && c.reason && c.reason.kind || "");
    const turnError = t.type === "message.error"
      ? turnErrorText(c, t.emittedAt)
      : reason === "error" ? { message: "执行失败", code: "", at: String(t.emittedAt || "") } : r.turnError;
    // 交付属于「回合」：回合结束时把它钉在 turn.end 的 sequence 上，
    // 渲染时插到本轮内容之后，不再依赖“最后一条消息”或消息缓存。
    const closingTurn = t.type === "turn.end";
    const endSeq = Number(t.sequence) || 0;
    let deliverables = r.deliverables;
    if (closingTurn) {
      const keep = [];
      const byPath = new Map();
      for (const d of r.deliverables || []) {
        if (!d) continue;
        if (!d.pending) { keep.push(d); continue; }
        const key = String(d.path || d.name || "").toLowerCase() + "|" + (Number(d.turn) || 0);
        byPath.set(key, d);
      }
      deliverables = [
        ...keep,
        ...[...byPath.values()].map((d) => ({ ...d, endSeq, pending: false }))
      ];
    }
    const processes = closingTurn && r.turnStartSeq
      ? [...(r.processes || []), {
        turn: Number(c && c.turn) || 0,
        startSeq: Number(r.turnStartSeq) || 0,
        endSeq,
        at: Number(t.emittedAt) || 0,
        tools: (r.tools || []).map((tool) => ({ name: tool.name || "", detail: tool.detail || "", status: tool.status || "done" }))
      }].slice(-40)
      : r.processes;
    const promptsAfterEnd = {
      ...r.prompts,
      items: (r.prompts.items || []).map((item) => item && item.status === "pending" ? { ...item, status: "resolved" } : item)
    };
    return {
      ...r,
      deliverables,
      processes,
      turnStartSeq: closingTurn ? 0 : r.turnStartSeq,
      prompts: promptsAfterEnd,
      stream: { text: "", reasoning: "", ended: !0 },
      tools: r.tools.map(
        (d) => d.status === "running" ? { ...d, status: "done" } : d
      ),
      activity: {
        status: t.type === "message.error" ? V.ERROR : V.IDLE,
        revision: Math.max(Number(r.activity.revision) || 0, Number(t.sequence) || 0),
        text: ""
      },
      turnError,
      stoppedTurn: reason === "aborted" ? { turn: Number(c && c.turn) || 0, at: Number(t.emittedAt) || 0, seq: Number(t.sequence) || 0 } : r.stoppedTurn
    };
  }
  if (t.type === "input.request" || t.type === "approval.request") {
    const d = t.type === "approval.request" ? Tt(c, t.eventId) : Mt(c, t.eventId);
    return {
      ...r,
      prompts: {
        items: Ot(r.prompts.items, d),
        revision: (Number(r.prompts.revision) || 0) + 1
      },
      activity: {
        status: V.WAITING_INPUT,
        revision: (Number(r.activity.revision) || 0) + 1,
        text: ""
      }
    };
  }
  if (t.type === "input.result" || t.type === "approval.result") {
    const d = new Set(
      [c.approvalId, c.callId, c.id].map(String).filter(Boolean)
    );
    return {
      ...r,
      prompts: {
        items: r.prompts.items.map(
          (l) => d.has(String(l.id)) || d.has(String(l.approvalId || "")) ? { ...l, status: "resolved" } : l
        ),
        revision: (Number(r.prompts.revision) || 0) + 1
      },
      activity: {
        status: V.RUNNING,
        revision: (Number(r.activity.revision) || 0) + 1,
        text: ""
      }
    };
  }
  return r;
}
function shouldRestoreFocus(doc, el, keyboardOpen) {
  return !!el && doc.activeElement === el && keyboardOpen !== !1;
}
function unionProcesses(previous, incoming) {
  const map = new Map();
  for (const p of Array.isArray(previous) ? previous : []) if (p && p.startSeq) map.set(String(p.endSeq || p.startSeq), p);
  for (const p of Array.isArray(incoming) ? incoming : []) {
    if (!p || !p.startSeq) continue;
    map.set(String(p.endSeq || p.startSeq), { ...(map.get(String(p.endSeq || p.startSeq)) || {}), ...p });
  }
  return [...map.values()]
    .sort((a, b) => (Number(a.endSeq) || 0) - (Number(b.endSeq) || 0))
    .slice(-40);
}
function unionDeliverables(previous, incoming) {
  const map = new Map();
  for (const d of Array.isArray(previous) ? previous : []) if (d && d.id) map.set(String(d.id), d);
  for (const d of Array.isArray(incoming) ? incoming : []) {
    if (!d || !d.id) continue;
    const old = map.get(String(d.id));
    map.set(String(d.id), old ? { ...old, ...d } : d);
  }
  return [...map.values()]
    .sort((a, b) => (Number(a.seq) || 0) - (Number(b.seq) || 0) || (Number(a.index) || 0) - (Number(b.index) || 0))
    .slice(-20);
}
function mergeDeliverables(existing, files, seq, turn) {
  const base = Array.isArray(existing) ? existing : [];
  const list = Array.isArray(files) ? files : [];
  const stamp = Number(seq) || 0;
  const turnNo = Number(turn) || 0;
  const out = base.slice();
  const seen = new Set(out.map((x) => String(x.id)));
  list.forEach((f, index) => {
    const path = String(f && f.path || "");
    const id = path + ":" + stamp + ":" + index;
    if (seen.has(id)) return;
    seen.add(id);
    out.push({
      id,
      path,
      name: String(f && (f.name || f.path) || "文件"),
      description: String(f && f.description || ""),
      seq: stamp,
      index,
      turn: turnNo,
      endSeq: 0,
      pending: true
    });
  });
  out.sort((a, b) => (Number(a.seq) || 0) - (Number(b.seq) || 0) || (Number(a.index) || 0) - (Number(b.index) || 0));
  return out.slice(-40);
}
function groupDeliverables(list) {
  const groups = [];
  for (const d of Array.isArray(list) ? list : []) {
    const endSeq = Number(d.endSeq) || 0;
    const turn = Number(d.turn) || 0;
    const key = endSeq ? "end:" + endSeq : "turn:" + turn;
    let g = groups.find((x) => x.key === key);
    if (!g) g = { key, endSeq, turn, items: [] }, groups.push(g);
    g.items.push(d);
  }
  return groups;
}
function turnErrorText(payload, at) {
  const p = payload && typeof payload === "object" ? payload : {};
  const hint = String(p.hint || "");
  const message = String(p.message || p.error || "");
  const code = String(p.code || "");
  const status = String(p.status || "");
  let text = hint || "执行失败";
  if (code) text += "（" + code + (status ? " " + status : "") + "）";
  if (message) text += "：" + message;
  return { message: text, code, at: String(at || "") };
}
function Lt(a, n = []) {
  return n.reduce((t, r) => Ct(t, r), a);
}
function Wt(a, n) {
  const t = /* @__PURE__ */ new Map();
  for (const r of a || []) t.set(String(r.id), r);
  for (const r of n || []) {
    const c = String(r.id), d = t.get(c);
    (!d || Number(r.revision || 0) >= Number(d.revision || 0)) && t.set(c, r);
  }
  return [...t.values()].sort((r, c) => Number(r.revision || 0) - Number(c.revision || 0));
}
function _t(a, n, t) {
  const r = String(t.cursor || "seq:0"), c = r !== "seq:0" && Ie(n.cursor || "seq:0", r) !== r, d = Ie(a.sync.cursor, r) !== r, l = Xe(a.sessionId), u = Lt(l, Array.isArray(n.events) ? n.events : []), m = n.activity || (n.session && n.session.running ? { status: V.RUNNING, revision: 1, text: "" } : u.activity), e = {
    ...u,
    session: n.session || u.session,
    activity: m,
    messages: Array.isArray(n.messages) ? n.messages : u.messages,
    tools: Array.isArray(n.tools) ? n.tools : u.tools,
    deliverables: Array.isArray(n.deliverables) ? n.deliverables : u.deliverables,
    stream: n.stream || u.stream,
    prompts: n.prompts || (n.pending ? { items: Ft(n.pending), revision: 1 } : u.prompts),
    sync: {
      ...u.sync,
      cursor: Ie(u.sync.cursor, n.cursor || u.sync.cursor),
      oldestSeq: Number(n.oldestSeq) || u.sync.oldestSeq || 0,
      hasMore: !!n.hasMore
    }
  };
  return !d && !c ? { ...e, sync: { ...e.sync, cursor: Ie(e.sync.cursor, a.sync.cursor) } } : {
    ...e,
    messages: Wt(e.messages, a.messages),
    tools: a.tools.length ? a.tools : e.tools,
    deliverables: a.deliverables.length ? a.deliverables : e.deliverables,
    stream: a.stream.text || a.stream.reasoning ? a.stream : e.stream,
    activity: a.activity,
    prompts: (function () {
      const base = e.prompts || { items: [], revision: 0 };
      const cur = Ne(e.sync.cursor) || 0;
      const baseItems = Array.isArray(base.items) ? base.items : [];
      const fresh = (a.prompts && Array.isArray(a.prompts.items) ? a.prompts.items : []).filter(
        (it) => it && it.status === "pending" && Number(it.seq) > cur && !baseItems.some((x) => x && x.id === it.id)
      );
      if (!fresh.length) return base;
      return {
        items: [...baseItems, ...fresh],
        revision: Math.max(Number(base.revision) || 0, Number(a.prompts.revision) || 0)
      };
    })(),
    sync: { ...e.sync, cursor: Ie(e.sync.cursor, a.sync.cursor) }
  };
}
function Vt(a) {
  return !!(a && a.activity && a.activity.status === V.RUNNING);
}
function Yt(a = {}) {
  const {
    loadSnapshot: n,
    connect: t,
    onPing: hh,
    onState: r = () => {
    },
    onStatus: c = () => {
    },
    retryDelay: d = (attempt) => Math.min(2e3, 300 * Math.pow(2, Math.min(Number(attempt) || 0, 3))),
    setTimeout: l = setTimeout,
    clearTimeout: u = clearTimeout
  } = a;
  let m = Xe(a.sessionId || ""), e = null, I = 0, C = 0, O = !1, K = !1, Q = 0;
  function he() {
    r(m);
  }
  function xe() {
    if (e) {
      try {
        e();
      } catch {
      }
      e = null;
    }
  }
  function ye() {
    if (!O) return;
    const Z = Math.max(200, Number(d(Q)) || 1500);
    Q += 1, c({ connected: !1, recovering: !0, attempt: Q }), I && u(I), I = l(() => {
      I = 0, se("reconnect");
    }, Z);
  }
  async function se(Z) {
    if (!O || K) return;
    K = !0, C += 1;
    const ie = C;
    xe();
    const we = m.sync;
    try {
      const Ae = await n({ cursor: we.cursor, reason: Z });
      if (!O || ie !== C) return;
      m = _t(m, Ae || {}, we), he();
      const Te = m.sync.cursor;
      e = t({
        cursor: Te,
        onEvent(Me) {
          if (!O || ie !== C) return;
          const y = Ct(m, Me);
          y !== m && (m = y, Q = 0, he());
        },
        onError() {
          !O || ie !== C || ye();
        },
        onPing() {
          hh && hh();
        }
      }), c({ connected: !0, recovering: !1, attempt: Q });
    } catch {
      O && ie === C && ye();
    } finally {
      K = !1;
    }
  }
  return {
    start() {
      O || (O = !0, Q = 0, se("start"));
    },
    stop() {
      O = !1, C += 1, I && u(I), I = 0, xe();
    },
    resnapshot(Z = "manual") {
      return se(Z);
    },
    getState() {
      return m;
    }
  };
}
function Ye(a = {}) {
  const n = a.transport || Ht({
    baseUrl: a.baseUrl,
    token: a.token,
    sessionId: a.sessionId,
    fetchImpl: a.fetchImpl,
    EventSourceImpl: a.EventSourceImpl
  });
  let t = Xe(a.sessionId || "");
  const r = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), d = Yt({
    sessionId: a.sessionId,
    loadSnapshot: n.loadSnapshot,
    connect: n.connect,
    onState(l) {
      t = l;
      for (const u of r)
        try {
          u(l);
        } catch {
        }
    },
    onPing: a.onPing,
    onStatus(l) {
      for (const u of c)
        try {
          u(l);
        } catch {
        }
    },
    retryDelay: a.retryDelay,
    setTimeout: a.setTimeout,
    clearTimeout: a.clearTimeout
  });
  return {
    start: () => d.start(),
    stop: () => d.stop(),
    resnapshot: (l) => d.resnapshot(l),
    async loadOlder() {
      const l = t;
      if (!l.sync.hasMore || !l.sync.oldestSeq || l.sync.limitReached) return l;
      const u = await n.loadSnapshot({
        cursor: l.sync.cursor,
        before: l.sync.oldestSeq,
        turns: 10
      });
      let m = Lt(l, u.events || []);
      const I = m.messages.filter((C) => C.role === "user").length >= 30;
      m = {
        ...m,
        messages: [...m.messages].sort(
          (C, O) => Number(C.revision || 0) - Number(O.revision || 0)
        ),
        sync: {
          ...m.sync,
          oldestSeq: Number(u.oldestSeq) || m.sync.oldestSeq,
          hasMore: I ? !1 : !!u.hasMore,
          limitReached: I
        }
      }, t = m;
      for (const C of r)
        try {
          C(m);
        } catch {
        }
      return m;
    },
    send: (l) => n.send(l),
    uploadImage: (l) => n.uploadImage(l),
    uploadFile: (l) => n.uploadFile(l),
    approval: (l) => n.approval(l),
    respond: (l) => n.respond(l),
    interrupt: () => n.stop(),
    listSessions: () => n.sessions(),
    newSession: (l) => n.newSession(l),
    options: () => n.options(),
    renameSession: (l, u) => n.renameSession(l, u),
    archiveSession: (l) => n.archiveSession(l),
    unarchiveSession: (l) => n.unarchiveSession(l),
    forkSession: (l, u) => n.forkSession(l, u),
    selectModel: (l) => n.selectModel(l),
    setPermission: (l) => n.setPermission(l),
    imageUrl: (l) => n.imageUrl(l),
    fileUrl: (l) => n.fileUrl(l),
    workspaceUrl: (l) => n.workspaceUrl(l),
    presentedUrl: (l, u, m) => n.presentedUrl(l, u, m),
    state: () => t,
    subscribe(l) {
      return r.add(l), l(t), () => r.delete(l);
    },
    onStatus(l) {
      return c.add(l), () => c.delete(l);
    }
  };
}
function vt(a) {
  return a && a.activity || { status: V.IDLE, revision: 0, text: "" };
}
function Jt(a) {
  return Vt(a);
}
function gt(a) {
  return a && Array.isArray(a.messages) ? a.messages : [];
}
function mt(a) {
  return a && a.prompts && Array.isArray(a.prompts.items) ? a.prompts.items : [];
}
function Xt(a) {
  return a && Array.isArray(a.tools) ? a.tools : [];
}
function Gt(a) {
  return a && a.stream || { text: "", reasoning: "", ended: !0 };
}
function Kt(a) {
  return a && Array.isArray(a.deliverables) ? a.deliverables : [];
}
function qe(a) {
  return a && a.session || null;
}
function D(a) {
  return String(a ?? "").replace(/[&<>"]/g, (n) => n === "&" ? "&amp;" : n === "<" ? "&lt;" : n === ">" ? "&gt;" : "&quot;");
}
function G(a) {
  return D(a).replace(/'/g, "&#39;");
}
const Qt = /^(https?:\/\/|mailto:)/i, bt = {
  js: "const let var function return if else for while do break continue class new typeof instanceof in of this super import from export default async await try catch finally throw switch case extends static get set yield void delete",
  ts: "const let var function return if else for while do break continue class new typeof instanceof in of this super import from export export default async await try catch finally throw switch case extends static get set yield void delete interface type enum implements private public protected readonly namespace declare abstract as satisfies keyof infer",
  py: "def class return if elif else for while import from as pass break continue with try except finally raise lambda yield global nonlocal assert del in is not and or None True False async await print",
  bash: "if then else elif fi for while do done case esac function in return exit export local echo cd ls grep sed awk cat test"
}, Zt = {
  js: "js",
  javascript: "js",
  jsx: "js",
  mjs: "js",
  cjs: "js",
  ts: "ts",
  typescript: "ts",
  tsx: "ts",
  py: "py",
  python: "py",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  zsh: "bash",
  json: "json"
};
function zt(a, n) {
  if (/^docklet-file:/i.test(n)) {
    const t = n.replace(/^docklet-file:/i, "");
    return `<img class="chat-image chat-md-image" data-workspace="${G(t)}" alt="${G(a)}" />`;
  }
  return /^https?:\/\//i.test(n) ? /^https:/i.test(n) ? `<img class="chat-image chat-md-image" src="${G(n)}" alt="${G(a)}" loading="lazy" referrerpolicy="no-referrer" />` : `<img class="chat-image chat-md-image" data-remote="${G(n)}" alt="${G(a)}" />` : D(a);
}
function scanInlineParen(text, start) {
  let depth = 0, value = "";
  for (let i = start; i < text.length; i += 1) {
    const ch = text.charAt(i);
    if (/\s/.test(ch)) return null;
    if (ch === "(") { depth += 1; value += ch; continue; }
    if (ch === ")") {
      if (depth === 0) return { value, end: i + 1 };
      depth -= 1, value += ch;
      continue;
    }
    value += ch;
  }
  return null;
}
function clampViewerScale(value) {
  return Math.min(4, Math.max(1, Number(value) || 1));
}
function markLoneThumbs(html) {
  const s = String(html || "");
  // 一条消息里出现多个「孤图」（各自成块、进不了网格）时，收成缩略图，
  // 避免一组图被空行拆成一张张 320px 的大图。
  return (s.match(/chat-md-gallery is-one/g) || []).length > 1
    ? s.replace(/chat-md-gallery is-one/g, "chat-md-gallery is-one is-thumb")
    : s;
}
function parseImagePrefix(t) {
  if (t.slice(0, 2) !== "![") return null;
  const close = t.indexOf("](");
  if (close < 0) return null;
  const alt = t.slice(2, close);
  if (alt.indexOf("]") >= 0 || alt.indexOf("[") >= 0) return null;
  const parsed = scanInlineParen(t, close + 2);
  if (!parsed || !parsed.value) return null;
  return { alt, src: parsed.value, end: parsed.end };
}
function parseImageLine(line) {
  const t = String(line == null ? "" : line).trim();
  const one = parseImagePrefix(t);
  return one && one.end === t.length ? one : null;
}
function parseImageRun(line) {
  const t = String(line == null ? "" : line).trim();
  const out = [];
  let i = 0;
  while (i < t.length) {
    if (/\s/.test(t.charAt(i))) {
      i += 1;
      continue;
    }
    if (t.charAt(i) !== "!") return null;
    const one = parseImagePrefix(t.slice(i));
    if (!one) return null;
    out.push({ alt: one.alt, src: one.src }), i += one.end;
  }
  return out.length > 1 ? out : null;
}
function be(a) {
  const n = String(a == null ? "" : a).replace(/\u0000/g, "");
  const stash = [];
  let out = "", i = 0;
  while (i < n.length) {
    const img = n.charAt(i) === "!" && n.charAt(i + 1) === "[";
    const link = !img && n.charAt(i) === "[";
    if (img || link) {
      const from = i + (img ? 2 : 1);
      const close = n.indexOf("](", from);
      if (close > 0) {
        const label = n.slice(from, close);
        const parsed = scanInlineParen(n, close + 2);
        if (parsed && parsed.value && label.indexOf("]") < 0 && label.indexOf("[") < 0) {
          const token = "\u0000" + stash.length + "\u0000";
          if (img) stash.push(zt(label, parsed.value));
          else if (Qt.test(parsed.value)) stash.push('<a class="chat-link" href="' + G(parsed.value) + '" data-href="' + G(parsed.value) + '" target="_blank" rel="noreferrer noopener">' + D(label) + "</a>");
          else stash.push(D(label));
          out += token, i = parsed.end;
          continue;
        }
      }
    }
    out += n.charAt(i), i += 1;
  }
  const c = /`([^`\n]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|~~([^~]+)~~|(https?:\/\/[^\s<>"'`\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]+)/gu;
  out = out.replace(c, (m, code, bold1, bold2, em, del, url) => {
    if (code !== void 0) return '<code class="chat-inline-code">' + D(code) + "</code>";
    if (bold1 !== void 0) return "<strong>" + D(bold1) + "</strong>";
    if (bold2 !== void 0) return "<strong>" + D(bold2) + "</strong>";
    if (em !== void 0) return "<em>" + D(em) + "</em>";
    if (del !== void 0) return "<del>" + D(del) + "</del>";
    const u = url.replace(/[).,;:!?'"”’）】》]+$/gu, "");
    return '<a class="chat-link" href="' + G(u) + '" data-href="' + G(u) + '" target="_blank" rel="noreferrer noopener">' + D(u) + "</a>" + D(url.slice(u.length));
  });
  return out.replace(/\u0000(\d+)\u0000/g, (m, idx) => stash[Number(idx)] || "");
}
function ea(a, n) {
  const t = Zt[String(n || "").toLowerCase()] || "", r = String(a ?? "");
  if (t === "json" || !bt[t])
    return { html: D(r), lang: t || String(n || "").toLowerCase() };
  const c = t === "js" || t === "ts" ? String.raw`(\/\*[\s\S]*?\*\/|\/\/[^\n]*)` : String.raw`(#[^\n]*)`, d = new RegExp(
    c + String.raw`|("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|` + "`(?:\\\\[\\s\\S]|[^`\\\\])*`)",
    "g"
  ), l = [];
  let u = r.replace(d, (e) => (l.push(e), `\0${"z".repeat(l.length)}\0`));
  u = D(u);
  const m = bt[t].split(/\s+/);
  return u = u.replace(
    /\b([A-Za-z_$][\w$]*)\b/g,
    (e) => m.includes(e) ? `<span class="tk-k">${e}</span>` : e
  ), u = u.replace(/\b\d+(?:\.\d+)?\b/g, (e) => `<span class="tk-n">${e}</span>`), u = u.replace(/\u0000(z+)\u0000/g, (e, I) => {
    const C = l[I.length - 1] || "";
    return `<span class="${C.startsWith("/") || C.startsWith("#") ? "tk-c" : "tk-s"}">${D(C)}</span>`;
  }), { html: u, lang: t };
}
function ta(a, n) {
  const t = ea(a, n), r = t.lang || "code";
  return `<div class="chat-code"><div class="chat-code-head"><span class="chat-code-lang">${D(r)}</span><button type="button" class="chat-code-copy" data-action="copy-code" data-code="${G(encodeURIComponent(a))}">复制</button></div><pre><code>${t.html}</code></pre></div>`;
}
function jt(a, n) {
  if (n + 1 >= a.length || !/^\s*\|.*\|\s*$/.test(a[n])) return !1;
  const t = a[n + 1];
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(t) && t.includes("-");
}
function ht(a) {
  return a.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((n) => n.trim());
}
function aa(a, n) {
  const t = a[n];
  return /^\s*```/.test(t) || /^(#{1,6})\s+/.test(t) || /^\s*>\s?/.test(t) || /^\s*[-*+]\s+/.test(t) || /^\s*\d+[.)]\s+/.test(t) || /^\s*([-*_])(?:\s*\1){2,}\s*$/.test(t) || jt(a, n);
}
function xt(a, n, t) {
  const r = [], c = t ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/;
  let d = n;
  for (; d < a.length; ) {
    const l = c.exec(a[d]);
    if (!l) {
      if (r.length > 0 && /^\s{2,}\S/.test(a[d])) {
        r[r.length - 1] += " " + a[d].trim(), d += 1;
        continue;
      }
      break;
    }
    r.push(l[1]), d += 1;
  }
  return { items: r, next: d };
}
function na(a) {
  const n = a.length;
  return `<div class="chat-md-gallery ${n === 1 ? "is-one" : n === 2 ? "is-two" : n >= 5 ? "is-many" : "is-few"}" data-count="${n}">${a.map((t) => zt(t.alt, t.src)).join("")}</div>`;
}
function yt(a) {
  const n = String(a ?? "").replace(/\r\n?/g, `
`).split(`
`), t = [];
  let r = 0;
  for (; r < n.length; ) {
    const c = n[r];
    if (!c.trim()) {
      r += 1;
      continue;
    }
    const d = /^\s*```(.*)$/.exec(c);
    if (d) {
      const m = d[1].trim().split(/\s+/)[0] || "", e = [];
      for (r += 1; r < n.length && !/^\s*```\s*$/.test(n[r]); )
        e.push(n[r]), r += 1;
      r < n.length && (r += 1), t.push(ta(e.join(`
`), m));
      continue;
    }
    const l = /^(#{1,6})\s+(.+?)\s*$/.exec(c);
    if (l) {
      const m = l[1].length;
      t.push(`<h${m}>${be(l[2])}</h${m}>`), r += 1;
      continue;
    }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(c)) {
      t.push("<hr />"), r += 1;
      continue;
    }
    if (/^\s*>\s?/.test(c)) {
      const m = [];
      for (; r < n.length && /^\s*>\s?/.test(n[r]); )
        m.push(n[r].replace(/^\s*>\s?/, "")), r += 1;
      t.push(`<blockquote>${m.map(be).join("<br />")}</blockquote>`);
      continue;
    }
    if (/^\s*[-*+]\s+/.test(c)) {
      const m = xt(n, r, !1);
      t.push(`<ul>${m.items.map((e) => `<li>${be(e)}</li>`).join("")}</ul>`), r = m.next;
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(c)) {
      const m = xt(n, r, !0);
      t.push(`<ol>${m.items.map((e) => `<li>${be(e)}</li>`).join("")}</ol>`), r = m.next;
      continue;
    }
    if (jt(n, r)) {
      const m = ht(n[r]);
      r += 2;
      const e = [];
      for (; r < n.length && /^\s*\|.*\|\s*$/.test(n[r]); )
        e.push(ht(n[r])), r += 1;
      t.push(
        `<div class="chat-table-wrap"><table><thead><tr>${m.map((I) => `<th>${be(I)}</th>`).join("")}</tr></thead><tbody>${e.map((I) => `<tr>${I.map((C) => `<td>${be(C)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      );
      continue;
    }
    const img0 = parseImageLine(c);
    if (img0) {
      const m = [];
      for (; r < n.length; ) {
        const e = parseImageLine(n[r]);
        if (e) {
          m.push(e), r += 1;
          continue;
        }
        if (!n[r].trim()) {
          let I = r;
          for (; I < n.length && !n[I].trim(); ) I += 1;
          if (I < n.length && parseImageLine(n[I])) {
            r = I;
            continue;
          }
        }
        break;
      }
      if (m.length > 0) {
        t.push(na(m));
        continue;
      }
    }
    const run = parseImageRun(c);
    if (run) {
      t.push(na(run)), r += 1;
      continue;
    }
    const u = [];
    for (; r < n.length && n[r].trim() && !aa(n, r); )
      u.push(n[r]), r += 1;
    u.length === 0 && (u.push(n[r]), r += 1), t.push(`<p>${u.map(be).join("<br />")}</p>`);
  }
  return t.join("");
}
function wt(a, n = !1) {
  const t = String(a || "");
  if (!t) return [];
  const r = [];
  let c = [], d = !1, l = "";
  const u = (m) => {
    if (!c.length) return;
    const e = c.join(`
`);
    if (!e.trim()) {
      c = [];
      return;
    }
    r.push({
      key: "block-" + r.length,
      source: e,
      complete: m
    }), c = [];
  };
  for (const m of t.split(`
`)) {
    const e = m.match(/^\s*(```+|~~~+)/);
    if (e) {
      d ? e[1][0] === l ? (c.push(m), d = !1, l = "") : c.push(m) : (d = !0, l = e[1][0], c.push(m));
      continue;
    }
    if (!d && !m.trim()) {
      u(!0);
      continue;
    }
    c.push(m);
  }
  return c.length && u(!n && !d), r;
}
function St(a, n, t) {
  return a.map((r) => r.complete ? `<div class="md-block" data-key="${r.key}">${n(r.source)}</div>` : `<div class="md-block md-block-tail" data-key="${r.key}">${t(r.source)}</div>`).join("");
}
function oa({ appId: a, base: n, token: t, notify: r, mode: c = "turn" }) {
  const d = {
    id: a,
    endpoint: String(n || "") + "/health",
    token: t || "",
    intervalMs: 2500,
    enabled: r !== !1,
    openApp: a,
    suppressApp: a,
    title: "DSH控制台"
  };
  return c === "message" ? {
    ...d,
    mode: "change",
    field: "lastAssistantSeq",
    doneText: "收到新消息",
    failText: "收到新消息"
  } : {
    ...d,
    field: "running",
    from: !0,
    to: !1,
    failField: "lastTurnError",
    doneText: "指令已完成",
    failText: "指令执行失败"
  };
}
const ra = ``, re = "", Oe = {
  meName: "DSH用户",
  aiName: "DSH助手",
  meAvatar: "",
  aiAvatar: ""
};
function b(a) {
  return String(a ?? "").replace(/[<>&"]/g, (n) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;"
  })[n]);
}
function sa(a) {
  return a ? typeof a == "string" ? a : String(a.name || a.id || a.model || "") : "";
}
function kt(a) {
  const n = a ? new Date(a) : null;
  return !n || Number.isNaN(n.getTime()) ? "" : `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}
function ia(a) {
  const n = a ? new Date(a) : null;
  if (!n || Number.isNaN(n.getTime())) return "";
  const t = /* @__PURE__ */ new Date(), r = new Date(t.getFullYear(), t.getMonth(), t.getDate()), c = new Date(n.getFullYear(), n.getMonth(), n.getDate()), d = Math.round((r - c) / 864e5);
  return d === 0 ? "今天" : d === 1 ? "昨天" : `${n.getMonth() + 1}月${n.getDate()}日`;
}
function ca(a) {
  const n = Number(a) || 0;
  return n <= 0 ? "" : n < 1024 ? n + " B" : n < 1024 * 1024 ? (n / 1024).toFixed(1) + " KB" : (n / (1024 * 1024)).toFixed(1) + " MB";
}
function ae(a, n) {
  const t = String(a && n && n.meAvatar || !a && n && n.aiAvatar || "");
  return t && !t.startsWith("./avatars/") ? `<div class="v3av">${t.startsWith("data:") || t.startsWith("http") ? `<img src="${b(t)}" alt="">` : `<span class="v3av-emoji">${b(t)}</span>`}</div>` : `<div class="v3av"><img src="${a ? "./avatars/robot-purple.png" : "./avatars/robot-teal.png"}" alt=""></div>`;
}
function $t(a) {
  const n = String(a || "").toLowerCase().split(".").pop();
  return ["png", "jpg", "jpeg", "webp", "gif"].includes(n) ? "🖼" : ["zip", "rar", "7z", "gz"].includes(n) ? "📦" : ["mp3", "wav", "m4a", "ogg"].includes(n) ? "🎵" : ["xlsx", "xls", "csv"].includes(n) ? "📊" : n === "pdf" ? "📕" : ["md", "txt", "log"].includes(n) ? "📄" : "📎";
}
function la(a) {
  return ["png", "jpg", "jpeg", "webp", "gif"].includes(
    String(a || "").toLowerCase().split(".").pop()
  );
}
function da(a, n) {
  a.innerHTML = `<div class="v3ui" id="app"></div>`;
  const t = a.querySelector("#app"), r = /* @__PURE__ */ new Map();
  let c = 0, renderSig = "";
  window.__dockletForceRender = () => { renderSig = ""; d(); };
  window.__dockletViewInfo = () => ({
    viewTurns: Number(e.viewTurns) || 0,
    users: gt(e.state).filter((m) => m && m.role === "user").length,
    rows: document.querySelectorAll("#msgs .v3row[data-mid]").length,
    scrollTop: (document.querySelector("#list") || {}).scrollTop
  });
  function ensureViewFill() {
    // Fixed 5-turn window. Tall viewports do not auto-expand: even one-line
    // messages already fill a phone screen, and normal turns do not fit 5.
  }
  function d() {
    c || (c = window.setTimeout(() => {
      c = 0;
      if (e.route !== "chat") return;
      const sig = chatSig();
      sig === renderSig ? paintWorking() : $();
      ensureViewFill();
    }, 150));
  }
  let lastIme = 0;
  function scrollChatToBottomForIme(force) {
    const list = t.querySelector("#list");
    if (!list) return;
    if (!force && !e.stickBottom) return;
    list.scrollTop = list.scrollHeight;
  }
  const l = getComputedStyle(document.documentElement), u = Number.parseFloat(l.getPropertyValue("--safe-top")) || 0, m = Number.parseFloat(l.getPropertyValue("--safe-bottom")) || 0;
  u > 0 && t.style.setProperty("--safe-top", u + "px"), m > 0 && t.style.setProperty("--safe-bottom", m + "px"), n && n.ui && typeof n.ui.onInsetsChange == "function" && n.ui.onInsetsChange((s) => {
    if (!s) return;
    const o = Math.max(0, Number(s.top) || 0), i = Math.max(0, Number(s.bottom) || 0);
    o > 0 && t.style.setProperty("--safe-top", o + "px"), i > 0 && t.style.setProperty("--safe-bottom", i + "px"), t.style.setProperty("--safe-ime", Math.max(0, Number(s.ime) || 0) + "px");
  }), window.addEventListener("message", (s) => {
    const o = s && s.data;
    if (!o || o.type !== "docklet:insets" || !o.detail) return;
    const i = Math.max(0, Number(o.detail.top) || 0), p = Math.max(0, Number(o.detail.bottom) || 0);
    const ime = Math.max(0, Number(o.detail.ime) || 0);
    i > 0 && t.style.setProperty("--safe-top", i + "px"), p > 0 && t.style.setProperty("--safe-bottom", p + "px"), t.style.setProperty("--safe-ime", ime + "px");
    if (ime > 0 && lastIme === 0) {
      e.stickBottom = !0, e.pinBottom = !0;
      requestAnimationFrame(() => requestAnimationFrame(() => scrollChatToBottomForIme(true)));
      window.setTimeout(() => scrollChatToBottomForIme(true), 120);
    }
    lastIme = ime;
  }), window.setTimeout(() => {
    const s = getComputedStyle(document.documentElement), o = Number.parseFloat(s.getPropertyValue("--safe-top")) || 0, i = Number.parseFloat(s.getPropertyValue("--safe-bottom")) || 0;
    o > 0 && t.style.setProperty("--safe-top", o + "px"), i > 0 && t.style.setProperty("--safe-bottom", i + "px");
  }, 400);
  const e = {
    base: localStorage.getItem("v3.lan") || localStorage.getItem("v3.base") || re,
    lanBase: localStorage.getItem("v3.lan") || localStorage.getItem("v3.base") || re,
    wanBase: localStorage.getItem("v3.wan") || "",
    connectMode: localStorage.getItem("v3.mode") || "auto",
    token: localStorage.getItem("v3.token") || "",
    profile: {
      meName: localStorage.getItem("v3.name") || Oe.meName,
      aiName: localStorage.getItem("v3.aiName") && localStorage.getItem("v3.aiName") !== "DSH" ? localStorage.getItem("v3.aiName") : Oe.aiName,
      meAvatar: localStorage.getItem("v3.avatar") || "",
      aiAvatar: localStorage.getItem("v3.aiAvatar") || ""
    },
    profileDraft: null,
    notify: {
      // 默认开启：没有存过值时按开启算（用户手动关掉才记 "0"）
      enabled: localStorage.getItem("v3.notify") === null
        ? !0
        : localStorage.getItem("v3.notify") === "1",
      mode: "turn"
    },
    openSection: "",
    session: localStorage.getItem("v3.session") || "",
    client: null,
    state: null,
    connected: !1,
    attempt: 0,
    offlineHint: !1,
    sending: !1,
    turnActive: !1,
    turnStartAt: 0,
    pendingTurn: false,
    sendAfterUpload: false,
    sendAt: 0,
    lastServerAt: 0,
    lastTurnAt: 0,
    lanBackHits: 0,
    wdRestarts: 0,
    ping: { lan: null, wan: null },
    turnEnded: !1,
    error: "",
    anchorOlder: null,
    restoreScroll: null,
    expandedMessages: {},
    stickBottom: !0,
    pinBottom: !0,
    forceSetup: !1,
    streamEnded: !1,
    lastUserActionAt: 0,
    loadingOlder: !1,
    lastOlderLoad: 0,
    autoOlderBlocked: !1,
    olderLimit: !1,
    sessions: readSessionCache(),
    sessionsLoading: !1,
    sessionQuery: "",
    sessionMenu: null,
    showSessions: !1,
    showSettings: !1,
    showCreate: !1,
    route: "chat",
    createOptions: null,
    createDraft: { title: "", preset: "", permission: "", model: "" },
    createLoading: !1,
    connecting: !1,
    offline: typeof navigator !== "undefined" && navigator.onLine === false,
    draft: "",
    viewTurns: 5,
    attachments: [],
    uploading: !1,
    unsubscribe: null,
    unstatus: null,
    lastMessageCount: 0,
    lastPromptCount: 0,
    unread: 0
  }, I = String(n && n.manifest && n.manifest.id || "dsh-console");
  let C = "";
  function O() {
    return oa({
      appId: I,
      base: e.base,
      token: e.token,
      notify: e.notify.enabled,
      mode: e.notify.mode === "message" ? "message" : "turn"
    });
  }
  async function K() {
    if (!n || !n.watch || typeof n.watch.start != "function") return;
    const s = [e.base, e.token, e.notify.enabled, e.notify.mode].join("|");
    if (s !== C) {
      C = s;
      try {
        if (!e.notify.enabled) {
          await n.watch.stop(I);
          return;
        }
        if (typeof n.watch.ensurePermission == "function" && !await n.watch.ensurePermission())
          return;
        await n.watch.start(O());
      } catch {
      }
    }
  }
  function Q() {
    C = "", n && n.watch && typeof n.watch.stop == "function" && n.watch.stop(I).catch(() => {
    });
  }
  // 告诉壳当前正在看哪个会话：前台只抑制这个会话的通知，后台仍然全提醒。
  function syncActiveSession() {
    if (!n || typeof n.setActiveSession !== "function") return;
    const id = e.route === "chat" && !document.hidden ? e.session || null : null;
    n.setActiveSession(id).catch(() => {
    });
  }
  function applyTurnEvent(state) {
    if (!state) return;
    const ended = !!(state.stream && state.stream.ended);
    // 只要这一轮结束了就收掉“正在思考”，不依赖 turnEnded 的跳变：
    // 上一轮成功结束后 turnEnded 一直是 true，本轮若直接失败（TRANSPORT）
    // 就不会有任何流式事件把它重置回来，思考气泡会一直闪。
    if (ended) e.turnActive = false;
    e.turnEnded = ended;
  }
  function he() {
    var s;
    const o = e.state, i = qe(o), p = vt(o), g = Jt(o), active = e.turnActive || g;
    const olderLimit = e.olderLimit || Boolean(o && Array.isArray(o.messages) && o.messages.filter((x) => x.role === "user").length >= 30);
    if (olderLimit) e.olderLimit = !0;
    Xt(o);
    const v = mt(o), h = Kt(o), f = p.status === "running" ? "run" : p.status === "waiting_input" ? "wait" : p.status === "error" ? "err" : i ? "ok" : "", k = p.status === "running" ? "执行中" : p.status === "waiting_input" ? "等待操作" : p.status === "error" ? "出错" : "空闲";
    const mc = modelChipInfo();
    return `
      <header class="v3head">
        <h1 class="v3title">${b((i == null ? void 0 : i.title) || sessionTitleOf(i && i.id || e.session) || "DSH")}</h1>
        <button class="v3gear v3sessions" id="sessionList" aria-label="切换会话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h12M4 12h10M4 17h7"/><circle cx="17.5" cy="17" r="2.2"/></svg></button>
        <button class="v3gear v3gearset" id="settings" aria-label="连接设置"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/><circle cx="10" cy="8" r="2.3"/><circle cx="15" cy="16" r="2.3"/></svg></button>
        <div class="v3sub">${connStateHtml()}${mc.label ? `<button type="button" class="v3modelchip${mc.stale ? " stale" : ""}" id="modelChip">${b(mc.label)}</button>` : ""}</div>
      </header>
      <main class="v3list" id="list"><div id="rows">${(s = o == null ? void 0 : o.sync) != null && s.hasMore && !olderLimit ? '<div class="v3ptr" id="ptr">下拉刷新</div>' : ""}${(s = o == null ? void 0 : o.sync) != null && s.hasMore && !olderLimit ? '<div class="v3older" id="olderSentinel" hidden><span class="v3spin"></span></div>' : ""}${olderLimit ? '<div class="v3limit">已加载 30 轮 · 更多请到电脑端查看</div>' : ""}<div id="msgs">${xe()}${turnErrorHtml()}</div><div id="working"></div><div class="v3prompts" id="prompts">${B(v)}</div></div></main>
      <button class="v3jump" id="jump" aria-label="回到底部">${e.unread ? "↓ " + (e.unread > 99 ? "99+" : e.unread) : "↓"}</button>
      <div class="v3viewer" id="viewer" hidden><div class="v3viewstage" id="viewerStage"><div class="v3viewer-track" id="viewerTrack"></div></div><div class="v3viewer-bar"><span class="v3viewer-count" id="viewerCount" hidden></span><button class="v3viewer-save" id="saveViewer" aria-label="保存图片"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v10"/><path d="m7.6 10 4.4 4.4 4.4-4.4"/><path d="M5 19h14"/></svg></button><button class="v3viewer-close" id="closeViewer" aria-label="关闭">×</button></div></div>
      <div class="v3toast" id="toast" hidden></div>${connSheetHtml()}${modelSheetHtml()}
      <footer class="v3composer">
        <div class="v3net" id="netBar" hidden><span class="v3net-dot"></span><span class="v3net-text" id="netText"></span><button type="button" id="netRetry">重试</button></div>
        ${e.attachments.length ? `<div class="v3attachments">${e.attachments.map((L, z) => `<span class="v3attach" data-attach-index="${z}" data-uploading="${L.uploading ? "1" : "0"}">${L.kind === "image" && L.thumb ? `<img class="v3attach-thumb" src="${b(L.thumb)}" data-full="${b(L.full)}" data-attach-preview="${z}" alt="">` : `<span class="v3attach-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l4 4V20H7z"/><path d="M14 3.5V8h4"/></svg></span>`}<span class="v3attach-name" title="${b(L.name)}">${b(shortFileName(L.name))}</span>${L.uploading ? `<span class="v3attach-progress" data-attach-progress="${z}">${Math.round((L.progress || 0) * 100)}%</span>` : ""}<button type="button" data-remove-attach="${z}" aria-label="移除">×</button></span>`).join("")}</div>` : ""}
        <div class="v3rowline">
          <button type="button" class="v3plus" id="pickAttachment" ${e.uploading || !e.connected ? "disabled" : ""}>＋</button>
          <div class="v3textwrap"><textarea id="text" rows="1" placeholder="${e.connected ? "说点什么…" : ""}" ${e.connected ? "" : "disabled"}>${b(e.draft)}</textarea>${!e.connected && !String(e.draft || "").trim() ? `<div class="v3connhint">${b(connectionHintText())}</div>` : ""}</div>
          <button id="send" class="v3send${active ? " is-stop" : ""}${!active && e.uploading ? " is-uploading" : ""}" ${active ? "" : e.sending || !e.connected ? "disabled" : ""}>${active ? "停止" : e.uploading ? "" : e.sending ? "…" : "↑"}</button>
          <input id="attachmentFile" type="file" multiple hidden>
        </div>
      </footer>`;
  }
  function emptyChatHtml() {
    if (!e.connected && (e.offline || navigator.onLine === false || e.attempt > 0))
      return '<div class="v3empty v3empty-off"><div class="v3empty-icon">📡</div><div>连接已断开<br>也没最近缓存</div><button type="button" class="v3linkbtn" data-offline-retry>重试</button></div>';
    if (!e.connected) return '<div class="v3empty"><div class="v3empty-icon">🤖</div><div>连接中…</div></div>';
    const suggestions = ["总结一下当前项目", "列出最近的会话", "帮我写一个小脚本"];
    return `<div class="v3empty"><div class="v3empty-icon">🤖</div><div>开始和 DSH 对话</div><div class="v3suggest">${suggestions.map((text) => `<button type="button" class="v3suggest-chip" data-suggest="${b(text)}">${b(text)}</button>`).join("")}</div></div>`;
  }
  function galleryHtml(images) {
    const n = images.length;
    if (!n) return "";
    const cls = n === 1 ? "is-one" : n === 2 ? "is-two" : n >= 5 ? "is-many" : "is-few";
    return `<div class="chat-md-gallery ${cls}" data-count="${n}">${images.map((z) => `<img class="v3img" data-image-id="${b(z.id)}" alt="${b(z.id || "图片")}">`).join("")}</div>`;
  }
  function filesHtml(files) {
    if (!files.length) return "";
    return `<div class="v3files">${files.map((z) => `<a class="v3file" href="${b(e.client.fileUrl(z.id))}" data-name="${b(z.name || "文件")}" target="_blank" rel="noreferrer"><span class="v3file-icon">${$t(z.name || "")}</span><span class="v3file-name">${b(z.name || "文件")}</span>${z.size ? `<span class="v3file-size">${ca(z.size)}</span>` : ""}</a>`).join("")}</div>`;
  }
  function shouldClampMessage(role, text) {
    return role === "assistant" && String(text || "").length > 1200;
  }
  const msgHtmlCache = new Map();
  let lastRowSigs = null;
  let lastViewTurns = 0;
  function textHash(value) {
    const text = String(value || "");
    let hash = 5381;
    for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
    return hash;
  }
  function messageSig(v) {
    const profile = e.profile || {};
    return [
      String(v.id || ""),
      v.role || "",
      Number(v.seq) || 0,
      String(v.text || "").length,
      textHash(v.text),
      (v.images || []).length,
      (v.files || []).length,
      (e.expandedMessages || {})[String(v.id)] ? 1 : 0,
      profile.meName || "",
      profile.aiName || "",
      profile.meAvatar || "",
      profile.aiAvatar || ""
    ].join("|");
  }
  let lastComposerSig = "";
  function composerSig() {
    return (e.uploading ? 1 : 0) + "|" + (e.attachments || []).map((a) => a.name || a.kind || "").join("~");
  }
  function renderChatUpdate() {
    const stats = window.__v3Stats || (window.__v3Stats = { fast: 0, full: 0 });
    if (e.modelSheet || e.connSheet || e.sessionMenu) return false;
    if (composerSig() !== lastComposerSig) return false;
    // 浮层关闭、连接状态、composer 提示不在局部更新范围内：交给整页渲染。
    if (t.querySelector("#modelSheet") || t.querySelector("#connSheet") || t.querySelector("#sessionMenu")) return false;
    const textEl = t.querySelector("#text");
    if (textEl) {
      if (textEl.disabled === e.connected) return false;
      const placeholder = e.connected ? "说点什么…" : "";
      if (textEl.placeholder !== placeholder) return false;
    }
    const msgsEl = t.querySelector("#msgs");
    const list = t.querySelector("#list");
    if (!msgsEl || !list || !e.state) return false;
    if (lastViewTurns !== (Number(e.viewTurns) || 5)) {
      const stick = e.stickBottom || e.pinBottom;
      msgsEl.innerHTML = xe();
      lastRowSigs = gt(e.state).map(messageSig);
      lastViewTurns = Number(e.viewTurns) || 5;
      if (e.anchorOlder) {
        list.scrollTop = e.anchorOlder.top + (list.scrollHeight - e.anchorOlder.height);
        e.anchorOlder = null;
      } else if (e.restoreScroll !== null) {
        list.scrollTop = Math.max(0, Number(e.restoreScroll) || 0);
        e.restoreScroll = null;
      } else if (stick) {
        list.scrollTop = list.scrollHeight;
      }
      updateToTop();
      Ue();
      stats.fast += 1;
      renderSig = chatSig();
      return true;
    }
    const messages = gt(e.state);
    const sigs = messages.map(messageSig);
    const listState = e.state.sync || {};
    const canPull = !!listState.hasMore && !e.olderLimit;
    if (t.querySelector("#ptr") !== null && !canPull) return false;
    if (t.querySelector(".v3limit") !== null && !e.olderLimit) return false;
    if (canPull && !t.querySelector("#ptr")) return false;
    if (e.olderLimit && !t.querySelector(".v3limit")) return false;

    const info = qe(e.state);
    const titleEl = t.querySelector(".v3title");
    if (titleEl && info && info.title && titleEl.textContent !== info.title) titleEl.textContent = info.title;

    let lastOnly = false;
    if (lastRowSigs && sigs.length === lastRowSigs.length && sigs.length) {
      lastOnly = true;
      for (let i = 0; i < sigs.length - 1; i += 1) if (sigs[i] !== lastRowSigs[i]) { lastOnly = false; break; }
    }
    const stick = e.stickBottom || e.pinBottom;
    const before = list.scrollTop;
    if (lastOnly && sigs[sigs.length - 1] !== lastRowSigs[lastRowSigs.length - 1]) {
      const last = messages[messages.length - 1];
      const row = [...t.querySelectorAll(".v3row[data-mid]")].find((el) => el.dataset.mid === String(last.id));
      const html = messageRowHtml(last);
      if (row) row.outerHTML = html;
      else msgsEl.innerHTML = xe();
    } else if (!lastOnly || !sigs.length) {
      msgsEl.innerHTML = xe();
    }
    lastRowSigs = sigs;

    const promptsEl = t.querySelector("#prompts");
    if (promptsEl) promptsEl.innerHTML = B(mt(e.state));

    syncChatHeader();
    paintWorking();
    const jump = t.querySelector("#jump");
    if (jump) {
      jump.classList.toggle("show", !e.stickBottom && !e.pinBottom);
      jump.textContent = e.unread > 99 ? "↓ 99+" : e.unread ? "↓ " + e.unread : "↓";
    }
    observeChat();
    updateToTop();
    Ue();
    if (e.restoreScroll !== null) {
      list.scrollTop = Math.max(0, Number(e.restoreScroll) || 0);
      e.restoreScroll = null;
    } else if (e.anchorOlder) {
      list.scrollTop = e.anchorOlder.top + (list.scrollHeight - e.anchorOlder.height);
      e.anchorOlder = null;
    } else if (stick) {
      list.scrollTop = list.scrollHeight;
    } else {
      list.scrollTop = before;
    }
    stats.fast += 1;
    return true;
  }
  function messageRowHtml(v) {
    const cacheKey = String(v.id || "");
    const cacheSig = messageSig(v);
    const cached = msgHtmlCache.get(cacheKey);
    if (cached && cached.sig === cacheSig) return cached.html;
    const h = v.role === "user";
    const L = v.text ? h ? b(v.text) : markLoneThumbs(St(wt(v.text, !1), yt, D)) : "";
    const clamp = shouldClampMessage(v.role, v.text);
    const expanded = clamp && Boolean((e.expandedMessages || {})[String(v.id)]);
    const body = `<div class="v3bubble${clamp && !expanded ? " is-clamped" : ""}">${L}${galleryHtml(v.images || [])}${filesHtml(v.files || [])}</div>`;
    const expand = clamp
      ? `<button class="v3expand" data-expand-message="${b(v.id)}">${expanded ? "收起" : "展开全文"}</button>`
      : "";
    const html = `<div class="v3row ${h ? "me" : ""}" data-mid="${b(v.id)}" data-at="${Number(v.at) || 0}" data-seq="${Number(v.seq) || 0}"><div class="v3meta-row">${ae(h, e.profile)}<span class="v3who">${h ? e.profile.meName || "你" : e.profile.aiName || "DSH"}</span>${v.at ? `<span>${kt(v.at)}</span>` : ""}<button class="v3copy" data-copy-message>复制</button></div>${body}${expand}</div>`;
    msgHtmlCache.set(cacheKey, { sig: cacheSig, html });
    if (msgHtmlCache.size > 400) msgHtmlCache.delete(msgHtmlCache.keys().next().value);
    return html;
  }
  // 时间线 = 消息 + 本机注记（审批/问答/停止/交付），一次排好，不再画完再挪 DOM。
  // 注记定位：afterId 命中消息 -> 插它后面；否则 seq 落到最后一个 <= 它的消息后；
  // 两者都不命中就不渲染——上下文已不在窗口里，挂到末尾只会误导。
  function viewSlice(messages) {
    const list = Array.isArray(messages) ? messages : [];
    const turns = Math.max(1, Number(e.viewTurns) || 5);
    const users = [];
    for (let i = 0; i < list.length; i += 1) if (list[i] && list[i].role === "user") users.push(i);
    if (users.length <= turns) return list;
    return list.slice(users[users.length - turns]);
  }
  function timelineRows() {
    const allMessages = gt(e.state);
    const msgs = viewSlice(allMessages);
    const windowed = msgs.length < allMessages.length;
    const firstVisibleSeq = Number((msgs.find((m) => Number(m.seq) > 0) || {}).seq) || 0;
    const rows = [];
    let lastDate = "";
    for (const v of msgs) {
      const f = v.at ? String(v.at).slice(0, 10) : "";
      const mark = f && f !== lastDate ? `<div class="v3date"><span>${b(ia(v.at))}</span></div>` : "";
      f && (lastDate = f);
      rows.push({ kind: "message", id: String(v.id || ""), seq: Number(v.seq) || 0, at: Number(v.at) || 0, html: mark + messageRowHtml(v) });
    }
    const anns = [];
    for (const a of readActions())
      anns.push({ afterId: String(a.afterId || ""), seq: 0, at: Number(a.at) || 0, html: actionCardHtml(a) });
    for (const x of readStops())
      anns.push({ afterId: "", seq: Number(x.seq) || 0, at: Number(x.at) || 0, atAnchor: !Number(x.seq), html: stopItemHtml(x) });
    // 交付按「回合结束」定位：插到 seq <= turn.end 的最后一条消息之后。
    // 回合已经滚出窗口时收进「更早的交付」，绝不堆到对话末尾。
    const orphanGroups = [];
    for (const g of groupDeliverables((e.state && Array.isArray(e.state.deliverables) ? e.state.deliverables : []).filter((d) => d && !d.pending))) {
      const endSeq = Number(g.endSeq) || 0;
      if (windowed && endSeq && firstVisibleSeq && endSeq < firstVisibleSeq) continue;
      const inWindow = endSeq > 0 && rows.some((row) => row.kind === "message" && (row.seq || 0) > 0 && (row.seq || 0) <= endSeq);
      if (!inWindow) {
        orphanGroups.push(g);
        continue;
      }
      anns.push({ afterId: "", seq: endSeq, at: 0, html: deliverableGroupHtml(g) });
    }
    for (const a of anns) {
      let idx = -1;
      if (windowed && a.atAnchor && Number(a.at) && firstVisibleSeq) {
        const firstRow = rows.find((r) => r.kind === "message" && Number(r.at) > 0);
        if (firstRow && Number(a.at) < Number(firstRow.at)) continue;
      }
      if (a.atAnchor) {
        for (let i = rows.length - 1; i >= 0; i -= 1) {
          if (rows[i].kind === "message" && (Number(rows[i].at) || 0) > 0 && (Number(rows[i].at) || 0) <= a.at) {
            idx = i + 1;
            break;
          }
        }
        if (idx < 0) idx = 0;
      }
      if (idx < 0 && a.afterId) {
        const i = rows.findIndex((r) => r.kind === "message" && r.id === a.afterId);
        if (i >= 0) idx = i + 1;
      }
      if (idx < 0 && a.seq) {
        for (let i = rows.length - 1; i >= 0; i -= 1) {
          if (rows[i].kind === "message" && (rows[i].seq || 0) <= a.seq) {
            idx = i + 1;
            break;
          }
        }
      }
      a.idx = idx;
    }
    const byIdx = new Map();
    for (const a of anns) {
      if (a.idx < 0) continue;
      if (!byIdx.has(a.idx)) byIdx.set(a.idx, []);
      byIdx.get(a.idx).push(a);
    }
    let out = "";
    for (let i = 0; i <= rows.length; i += 1) {
      const list = byIdx.get(i);
      if (list) out += list.map((a) => a.html).join("");
      if (i < rows.length) out += rows[i].html;
    }
    if (orphanGroups.length && !windowed) out += orphanDeliverablesHtml(orphanGroups);
    return out;
  }
  function xe() {
    const out = timelineRows();
    return out || (workingState() ? "" : emptyChatHtml());
  }
  function deliverableCard(o) {
    const name = String(o.name || o.path || "");
    const stateSession = qe(e.state);
    const sid = String(stateSession && stateSession.id || e.session || "");
    const url = sid && e.base
      ? e.base + "/presented/file?session=" + encodeURIComponent(sid) +
        "&seq=" + encodeURIComponent(String(o.seq || 0)) +
        "&index=" + encodeURIComponent(String(o.index || 0)) +
        "&name=" + encodeURIComponent(name) +
        (e.token ? "&token=" + encodeURIComponent(e.token) : "")
      : e.client.presentedUrl(o.seq, o.index, name);
    const thumb = la(name)
      ? `<img class="v3deliverable-thumb" data-thumb-url="${b(url)}" alt="">`
      : `<span class="v3deliverable-icon">${$t(name)}</span>`;
    const extension = name.includes(".") ? name.split(".").pop().toUpperCase() : "";
    const hint = extension ? extension + " · 打开预览" : "打开预览";
    return `<a class="v3deliverable" href="${b(url)}" data-name="${b(name)}" target="_blank" rel="noreferrer" title="${b(o.description || name)}">${thumb}<span class="v3deliverable-body"><span class="v3deliverable-name">${b(name)}</span><span class="v3deliverable-sub">${b(hint)}</span></span><span class="v3deliverable-arrow">›</span></a>`;
  }
  function orphanDeliverablesHtml(groups) {
    // 锚点消息已经滚出窗口：合并成「更早的交付」，同名只留最新一次。
    const latest = new Map();
    for (const group of groups) {
      for (const item of group.items) {
        const key = String(item.name || item.path || "").toLowerCase();
        if (!key) continue;
        const previous = latest.get(key);
        if (!previous || Number(item.seq) > Number(previous.seq)) latest.set(key, item);
      }
    }
    const cards = [...latest.values()]
      .sort((a, b) => Number(b.seq) - Number(a.seq))
      .slice(0, 10)
      .map(deliverableCard);
    if (!cards.length) return "";
    return `<details class="v3dgroup v3dgroup-old" data-fold="d:old"><summary><span class="v3dgroup-title">更早的交付 · ${cards.length} 个文件</span><span class="v3dgroup-hint">展开</span></summary><div class="v3dgroup-body">${cards.join("")}</div></details>`;
  }
  function processHtml(process) {
    const tools = Array.isArray(process && process.tools) ? process.tools : [];
    if (!tools.length) return "";
    const failed = tools.filter((tool) => tool.status === "error").length;
    const title = "过程 · " + tools.length + " 步" + (failed ? "（" + failed + " 个失败）" : "");
    const rowsHtml = tools.map((tool) => `<div class="v3ptool"><span class="v3ptool-name">${b(tool.name || "工具")}</span><span class="v3ptool-detail">${b(tool.detail || "")}</span><span class="v3ptool-state">${tool.status === "error" ? "失败" : "完成"}</span></div>`).join("");
    return `<details class="v3process" data-fold="p:${b(String(process.turn || process.startSeq || process.endSeq || ""))}"><summary><span class="v3process-title">${b(title)}</span><span class="v3process-hint">展开</span></summary><div class="v3process-body">${rowsHtml}</div></details>`;
  }
  function deliverableGroupHtml(g) {
    // 同名文件只留一份（例如同一轮里重复引用），再按首次出现排序。
    const seen = new Set();
    const items = g.items.filter((item) => {
      const key = String(item.name || item.path || "").toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const cards = items.map(deliverableCard);
    // 4 个以内平铺；超过 4 个先露 4 个，其余折叠。
    if (cards.length <= 4) return `<div class="v3dgroup-list">${cards.join("")}</div>`;
    const head = cards.slice(0, 4).join("");
    const rest = cards.slice(4).join("");
    return `<div class="v3dgroup-list">${head}</div><details class="v3dgroup" data-fold="d:${b(String(g.endSeq || g.turn || ""))}:rest"><summary><span class="v3dgroup-title">展开其余 ${cards.length - 4} 个文件</span><span class="v3dgroup-hint">展开</span></summary><div class="v3dgroup-body">${rest}</div></details>`;
  }
  function deliverablesHtml() {
    const list = e.state && Array.isArray(e.state.deliverables) ? e.state.deliverables : [];
    return groupDeliverables(list).map(deliverableGroupHtml).join("");
  }
  // 交付卡片进时间线：优先按 present 时的最后一条消息 id 定位，
  // 拿不到 id 再退回 seq，避免全部堆到对话末尾。
  let workSig = "";
  let workTimer = 0;
  function wdLog(kind, detail) {
    try {
      const list = window.__v3wd || (window.__v3wd = []);
      list.push({ at: Date.now(), kind, ...detail });
      if (list.length > 240) list.shift();
    } catch (_) {
    }
  }
  function clearPendingTurnFor(event) {
    const type = String(event && event.type || "");
    const turnTypes = ["message.user", "message.assistant", "message.assistant.delta", "tool.start", "tool.update", "tool.end", "turn.end", "message.error"];
    if (!turnTypes.includes(type)) return;
    e.lastTurnAt = Date.now();
    if (type === "message.user") e.wdRestarts = 0;
    wdLog("turn", { type });
    if (type === "message.user" || type === "message.assistant.delta" || type === "tool.start" || type === "tool.update" || type === "tool.end") {
      e.pendingTurn = false;
      return;
    }
    // final assistant message / turn.end / message.error: this turn is over
    e.pendingTurn = false;
    e.turnActive = false;
    e.turnEnded = true;
  }
  function workingState() {
    const st = e.state;
    if (!st) return "";
    const pendingStream = Gt(st);
    const allMessages = gt(st);
    const lastMessage = allMessages[allMessages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && !lastMessage.optimistic && pendingStream.ended) return "";
    if (e.pendingTurn && !pendingStream.text && !pendingStream.reasoning) {
      const pendingTools = Array.isArray(st.tools) ? st.tools : [];
      return pendingTools.some((tool) => tool && tool.status === "running") ? "executing" : "thinking";
    }
    const status = vt(st).status;
    // 出错有红卡、等待你操作有卡片，都不再挂气泡。
    if (status === "error" || status === "waiting_input") return "";
    const stream = Gt(st);
    if (stream.text || stream.reasoning) return "streaming";
    if (!(e.turnActive || Jt(st))) return "";
    const tools = Array.isArray(st.tools) ? st.tools : [];
    // 不管最后一条是用户还是助手消息：只要还在跑，就给 loading 反馈。
    return tools.some((tool) => tool && tool.status === "running") ? "executing" : "thinking";
  }
  function formatWorkTime(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    if (total < 60) return total + "s";
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    if (minutes < 60) return minutes + "m " + (seconds ? seconds + "s" : "");
    const hours = Math.floor(minutes / 60);
    return hours + "h " + (minutes % 60 ? (minutes % 60) + "m" : "");
  }
  function updateWorkTime(row) {
    if (!row || !e.state) return;
    const node = row.querySelector("[data-work-time]");
    if (!node) return;
    if (!e.turnStartAt) {
      const msgs = Array.isArray(e.state.messages) ? e.state.messages : [];
      let at = 0;
      for (let i = msgs.length - 1; i >= 0; i -= 1) {
        if (msgs[i] && msgs[i].role === "user" && msgs[i].at) {
          at = Date.parse(msgs[i].at) || 0;
          break;
        }
      }
      e.turnStartAt = at || Date.now();
    }
    node.textContent = formatWorkTime(Date.now() - e.turnStartAt);
  }
  function startWorkTimer() {
    if (workTimer) return;
    workTimer = window.setInterval(() => {
      const row = t.querySelector(".v3work");
      if (!row) {
        window.clearInterval(workTimer);
        workTimer = 0;
        return;
      }
      const idleAfterSend = e.sendAt && (e.lastTurnAt || 0) < e.sendAt && Date.now() - e.sendAt > 25000;
      const idleWhileRunning = e.lastTurnAt && Date.now() - e.lastTurnAt > 90000;
      if ((e.turnActive || e.pendingTurn) && e.connected && (idleAfterSend || idleWhileRunning)) {
        wdLog("trigger", { reason: idleAfterSend ? "no-first-event" : "event-gap", sendAt: e.sendAt || 0, lastTurnAt: e.lastTurnAt || 0 });
        if (!e.wdRestarts) {
          // First hit: the HTTP path is alive but this turn's events are missing.
          // Rebuild the event stream once before telling the user anything.
          e.wdRestarts = 1;
          wdLog("stream-restart", { reason: idleAfterSend ? "no-first-event" : "event-gap" });
          try {
            if (e.client) {
              e.client.stop();
              e.client.start();
            }
          } catch (_) {
          }
          e.sendAt = Date.now();
          e.lastTurnAt = Date.now();
          updateWorkTime(row);
          return;
        }
        e.turnActive = !1;
        e.pendingTurn = !1;
        window.clearInterval(workTimer);
        workTimer = 0;
        U("仍在等待电脑端响应");
        d();
        return;
      }
      updateWorkTime(row);
    }, 500);
  }
  function stopWorkTimer() {
    if (!workTimer) return;
    window.clearInterval(workTimer);
    workTimer = 0;
  }
  function workingRowHtml() {
    return `<div class="v3row v3work" data-state="thinking"><div class="v3meta-row">${ae(!1, e.profile)}<span class="v3who">${b(e.profile.aiName || "DSH")}</span><span data-work-label>正在思考</span><span class="v3work-time" data-work-time></span></div><div class="v3bubble v3stream"><div class="v3work-live" data-work-live hidden><span class="v3work-dot"></span><span data-work-live-text></span></div><span class="v3thinking" data-work-dots><i></i><i></i><i></i></span><div class="v3work-body"></div></div></div>`;
  }
  function syncStopButton(active) {
    const btn = t.querySelector("#send");
    if (!btn) return;
    // 一个按钮在「发送 / 停止」之间变形，而不是插一个再删掉，避免闪。
    const stop = !!active;
    if (btn.classList.contains("is-stop") !== stop) btn.classList.toggle("is-stop", stop);
    const label = stop ? "停止" : e.sending ? "…" : "↑";
    if (btn.textContent !== label) btn.textContent = label;
    const disabled = !stop && (e.sending || !e.connected);
    if (btn.disabled !== disabled) btn.disabled = disabled;
  }
  function syncSendButton() {
    const send = t.querySelector("#send");
    if (!send) return;
    const disabled = e.sending || !e.connected;
    if (send.disabled !== disabled) send.disabled = disabled;
    const uploading = !!e.uploading && !send.classList.contains("is-stop");
    if (send.classList.contains("is-uploading") !== uploading) send.classList.toggle("is-uploading", uploading);
    const label = uploading ? "" : e.sending ? "…" : "↑";
    if (send.textContent !== label) send.textContent = label;
  }
  function syncChatHeader() {    const sub = t.querySelector(".v3sub");
    const st = e.state;
    if (!sub || !st) return;
    const p = vt(st), info = qe(st);
    const f = p.status === "running" ? "run" : p.status === "waiting_input" ? "wait" : p.status === "error" ? "err" : "ok";
    const k = p.status === "running" ? "执行中" : p.status === "waiting_input" ? "等待操作" : p.status === "error" ? "出错" : "空闲";
    const mc = modelChipInfo();
    const html = `${connStateHtml()}${mc.label ? `<button type="button" class="v3modelchip${mc.stale ? " stale" : ""}" id="modelChip">${b(mc.label)}</button>` : ""}`;
    if (sub.dataset.sync !== html) {
      sub.dataset.sync = html;
      sub.innerHTML = html;
    }
    if (e.connected) measurePing();
  }
  let chatObserver = null;
  function applyFoldState(scope) {
    if (!scope) return;
    for (const fold of scope.querySelectorAll("details[data-fold]")) {
      const key = fold.dataset.fold;
      if (key && e.openFolds && e.openFolds[key]) fold.open = true;
    }
  }
  function observeChat() {
    if (typeof ResizeObserver !== "function") return;
    const rows = t.querySelector("#rows"), list = t.querySelector("#list");
    if (!rows || !list) return;
    if (!chatObserver) {
      chatObserver = new ResizeObserver(() => {
        const l = t.querySelector("#list");
        if (l && (e.stickBottom || e.pinBottom)) l.scrollTop = l.scrollHeight;
      });
    }
    chatObserver.disconnect();
    chatObserver.observe(rows);
    chatObserver.observe(list);
  }
  // Long replies get an in-flow "back to the start" button at the bubble's
  // bottom-right. It is not a floating overlay: it must never cover text.
  function holdScrollPosition() {
    const getList = () => t.querySelector("#list");
    const first = getList();
    if (!first) return;
    const top = first.scrollTop;
    let left = 12;
    const tick = () => {
      const list = getList();
      if (list && Math.abs(list.scrollTop - top) > 1) list.scrollTop = top;
      if (left-- > 0) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function updateToTop(scope) {
    const list = t.querySelector("#list");
    if (!list) return;
    const limit = list.clientHeight * 1.2;
    if (!limit) return;
    const rows = scope ? [scope] : [...list.querySelectorAll(".v3row[data-mid]")];
    for (const row of rows) {
      if (!row || row.classList.contains("me")) continue;
      const bubble = row.querySelector(".v3bubble");
      if (!bubble) continue;
      const existing = bubble.querySelector(".v3toTop");
      if (bubble.offsetHeight > limit) {
        if (!existing) {
          bubble.classList.add("has-toTop");
          const btn = document.createElement("button");
          btn.type = "button", btn.className = "v3toTop", btn.textContent = "↑";
          btn.setAttribute("aria-label", "回到这条回复开头");
          bubble.appendChild(btn);
        }
      } else if (existing) { existing.remove(); bubble.classList.remove("has-toTop"); }
    }
  }
  function paintWorking() {
    const box = t.querySelector("#working");
    if (!box) return;
    const state = workingState();
    const active = !!(e.state && (e.turnActive || Jt(e.state)));
    syncChatHeader();
    syncSendButton();
    if (!state) {
      if (box.firstChild) box.innerHTML = "";
      workSig = "";
      stopWorkTimer();
      e.turnStartAt = 0;
      syncStopButton(active);
      return;
    }
    const stream = Gt(e.state || {});
    const text = String(stream.text || ""), reasoning = String(stream.reasoning || "");
    const list = t.querySelector("#list");
    const atBottom = !!list && list.scrollHeight - list.scrollTop - list.clientHeight < 90;
    let row = box.querySelector(".v3work");
    if (!row) {
      box.innerHTML = workingRowHtml();
      row = box.querySelector(".v3work");
      workSig = "";
    }
    if (!row) return;
    startWorkTimer();
    updateWorkTime(row);
    const label = row.querySelector("[data-work-label]");
    if (label) label.textContent = state === "streaming" ? (text ? "正在输出" : "正在思考") : state === "executing" ? "正在执行" : "正在思考";
    if (row.dataset.state !== state) row.dataset.state = state;
    const tools = e.state && Array.isArray(e.state.tools) ? e.state.tools : [];
    const runningTool = tools.filter((tool) => tool && tool.status === "running").slice(-1)[0];
    const dots = row.querySelector("[data-work-dots]");
    if (dots) dots.hidden = !!(text || reasoning);
    const live = row.querySelector("[data-work-live]");
    const liveText = row.querySelector("[data-work-live-text]");
    if (live && liveText) {
      const step = tools.length ? "第 " + tools.length + " 步 · " : "";
      const detail = runningTool ? String(runningTool.name || "工具") + (runningTool.detail ? " · " + String(runningTool.detail) : "") : "";
      const next = detail ? step + detail : "";
      if (liveText.textContent !== next) liveText.textContent = next;
      if (live.hidden !== !next) live.hidden = !next;
    }
    const key = state + "|" + text.length + "|" + reasoning.length + "|" + text.slice(-48);
    if (key !== workSig) {
      const body = row.querySelector(".v3work-body");
      if (body) {
        if (text) {
          body.innerHTML = markLoneThumbs(St(wt(text, !0), yt, D));
          const cur = document.createElement("span");
          cur.className = "v3cursor", cur.textContent = "▍";
          const last = body.lastElementChild;
          if (last && (last.tagName === "P" || last.tagName === "DIV" || last.tagName === "LI")) last.appendChild(cur);
          else body.appendChild(cur);
        } else if (reasoning) {
          body.innerHTML = '<div class="v3muted">思考中…<span class="v3cursor">▍</span></div>';
        } else body.innerHTML = "";
      }
      workSig = key;
    }
    syncStopButton(active);
    if ((atBottom || e.pinBottom) && list) list.scrollTop = list.scrollHeight;
    updateToTop(row);
  }
  function chatSig() {
    const st = e.state;
    if (!st) return "";
    const msgs = gt(st), prompts = mt(st), dels = Kt(st), acts = readActions(), sync = st.sync || {}, info = qe(st) || {};
    let msg = "";
    for (const m of msgs) msg += (m.id || "") + ":" + String(m.text || "").length + ":" + (m.images ? m.images.length : 0) + ":" + (m.files ? m.files.length : 0) + ",";
    let pr = "";
    for (const p of prompts) pr += (p.id || "") + ":" + (p.status || "") + ",";
    let de = "";
    // pending/afterId 变化也要算进签名：交付是在 present 时先挂起、turn.end 才定锚，
    // 只看 seq/name 的话 turn.end 这一下不会触发整页重绘，卡片要等下一次渲染才出现。
    for (const d of dels) de += (d.seq || 0) + ":" + (d.index || 0) + ":" + (d.name || d.path || "") + ":" + (d.pending ? 1 : 0) + ":" + (d.afterId || "") + ",";
    let ac = "";
    for (const a of acts) ac += (a.id || "") + ":" + (a.decision || "") + ":" + (a.details ? a.details.length : 0) + ",";
    return [
      info.id || "", info.title || "", info.model || "",
      e.connected ? 1 : 0, e.uploading ? 1 : 0,
      e.offline ? 1 : 0, e.error || "",
      e.olderLimit ? 1 : 0, sync.hasMore ? 1 : 0, sync.limitReached ? 1 : 0,
      st.turnError ? st.turnError.code + ":" + st.turnError.message + ":" + st.turnError.at : "",
      readStops().map((x) => x.id).join(","),
      e.attachments.map((x) => x.name || "").join("~"),
      e.unread,
      msg, pr, de, ac
    ].join("|");
  }
  async function se() {
    if (!e.client) return;
    const s = e.client;
    try {
      const o = await s.options();
      if (e.client !== s) return;
      e.createOptions = o, !e.createDraft.permission && o.defaultPermission && (e.createDraft.permission = o.defaultPermission);
    } catch (o) {
      if (e.client !== s) return;
      e.error = "读取新建选项失败：" + (o && o.message || "网络错误");
    }
    $();
  }
  async function Z() {
    const s = String(e.createDraft.title || "").trim(), o = String(e.createDraft.preset || ""), i = String(e.createDraft.permission || ""), p = String(e.createDraft.model || ""), [g, v] = p ? p.split("::") : ["", ""];
    e.createLoading = !0, $();
    try {
      const h = await e.client.newSession({
        ...s ? { title: s } : {},
        ...o ? { preset: o } : {},
        ...i ? { permission: i } : {},
        ...g && v ? { model: { provider: g, model: v } } : {}
      }), f = h && (h.current || h.id);
      if (e.createLoading = !1, e.showCreate = !1, e.route = "chat", f) Pe(f);
      else throw new Error("没有返回会话 ID");
    } catch (h) {
      e.createLoading = !1, e.error = "新建失败：" + (h && h.message || "网络错误"), $();
    }
  }
  function exitSessionSearch() {
    e.sessionQuery = "";
    const input = t.querySelector("#sessionSearch");
    if (input) {
      input.value = "";
      input.blur();
    }
    const body = t.querySelector("#sessionListBody");
    if (body) body.innerHTML = N();
    if (history.state && history.state.v3search) history.back();
  }
  function ie() {
    t.innerHTML = `<div class="v3ui v3route">
      <header class="v3head"><button class="v3gear v3back" id="backChat" aria-label="返回">‹</button><h1 class="v3title v3page-title">会话</h1></header>
      <div class="v3search"><input id="sessionSearch" value="${b(e.sessionQuery)}" placeholder="搜索会话…" autocomplete="off"><button type="button" class="v3archbtn primary" id="newSession" aria-label="新建会话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><button type="button" class="v3archbtn" id="archivedToggle" aria-label="已归档会话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16v11.5H4z"/><path d="M3 4.5h18v3H3z"/><path d="M9.5 11.5h5"/></svg></button></div>
      <div class="v3sheet-list" id="sessionListBody">${N()}</div>
    </div>`, t.querySelector("#backChat").onclick = () => (e.sessionQuery || (document.activeElement && document.activeElement.id === "sessionSearch")) ? exitSessionSearch() : H("chat"), t.querySelector("#newSession").onclick = () => H("create");
    const archivedBtn = t.querySelector("#archivedToggle");
    archivedBtn && (archivedBtn.onclick = () => {
      H("archived"), Ce();
    });
    const s = t.querySelector("#sessionSearch");
    s && (s.oninput = () => {
      if (s.value && (!history.state || !history.state.v3search)) history.pushState({ v3search: 1 }, "");
      e.sessionQuery = s.value;
      const v = t.querySelector("#sessionListBody");
      v && (v.innerHTML = N());
    });
    const o = t.querySelector("#sessionListBody");
    o && (o.onclick = (v) => {
      const r = v.target.closest("[data-restore]");
      if (r) {
        const id = r.dataset.restore;
        r.disabled = !0;
        e.client.unarchiveSession(id).then(() => Ce()).catch((x) => {
          e.error = "恢复失败：" + (x && x.message || "网络错误"), $();
        });
        return;
      }
      const h = v.target.closest(".v3session-more");
      if (h) {
        e.sessionMenu = { id: h.dataset.session, title: h.dataset.title || "" }, H("actions");
        return;
      }
      const f = v.target.closest(".v3session");
      f && Pe(f.dataset.session);
    });
    const i = t.querySelector("#closeSessionMenu");
    i && (i.onclick = () => {
      e.sessionMenu = null, $();
    });
    const p = t.querySelector("#sessionRenameSave");
    p && (p.onclick = async () => {
      const v = t.querySelector("#sessionRenameInput"), h = String(v && v.value || "").trim();
      if (!(!h || !e.sessionMenu))
        try {
          await e.client.renameSession(e.sessionMenu.id, h), e.sessionMenu = null, await Ce();
        } catch (f) {
          e.error = "重命名失败：" + (f && f.message || "网络错误"), $();
        }
    });
    const g = t.querySelector("#sessionArchive");
    g && (g.onclick = async () => {
      if (e.sessionMenu)
        try {
          await e.client.archiveSession(e.sessionMenu.id), e.sessionMenu = null, await Ce();
        } catch (v) {
          e.error = "归档失败：" + (v && v.message || "网络错误"), $();
        }
    });
  }
  function we() {
    const s = e.sessionMenu || { id: "", title: "" };
    t.innerHTML = `<div class="v3ui v3route">
      <header class="v3head"><button class="v3gear v3back" id="backSessions" aria-label="返回">‹</button><h1 class="v3title v3page-title">会话操作</h1></header>
      <div class="v3sheet-list v3actions-page">
        ${e.error ? `<div class="v3error">${b(e.error)}</div>` : ""}
        <label class="v3field"><span class="v3field-label"><span class="v3field-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L18 10l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg></span>修改标题</span><input id="sessionRenameInput" value="${b(s.title || "")}"></label>
        <button class="v3setting-action" id="sessionRenameSave">保存标题</button>
        <button class="v3setting-action" id="sessionFork">分支会话</button>
        <button class="v3setting-action danger" id="sessionArchive">归档会话</button>
      </div>
    </div>`, t.querySelector("#backSessions").onclick = () => H("sessions"), t.querySelector("#sessionRenameSave").onclick = async () => {
      const o = t.querySelector("#sessionRenameInput"), i = String(o && o.value || "").trim();
      if (i)
        try {
          await e.client.renameSession(s.id, i), e.sessionMenu = null, H("sessions");
        } catch (p) {
          e.error = "重命名失败：" + (p && p.message || "网络错误"), $();
        }
    }, t.querySelector("#sessionArchive").onclick = async () => {
      try {
        await e.client.archiveSession(s.id), e.sessionMenu = null, H("sessions");
      } catch (o) {
        e.error = "归档失败：" + (o && o.message || "网络错误"), $();
      }
    }, t.querySelector("#sessionFork").onclick = async () => {
      try {
        const o = await e.client.forkSession(s.id);
        e.sessionMenu = null, await Ce();
        const p = String(o && o.sessionId || "");
        p ? Pe(p) : H("sessions");
      } catch (o) {
        e.error = "分支失败：" + (o && o.message || "网络错误"), $();
      }
    };
  }
  // 设置页显示“实际在用哪个地址”：家里 / 外部 / 自定义。
  function currentBaseLabel() {
    const norm = (url) => String(url || "").replace(/\/+$/, "");
    const base = norm(e.base);
    if (!base) return "";
    if (e.lanBase && base === norm(e.lanBase)) return "家里";
    if (e.wanBase && base === norm(e.wanBase)) return "外部";
    return "自定义";
  }
  function Ae() {
    return e.connectMode === "wan" ? e.wanBase || e.lanBase || re : e.connectMode === "lan" ? e.lanBase || re : e.lanBase || e.wanBase || re;
  }
  // First connect has no session yet; "保存并重新连接" picks the relay's
  // current session so the chat page has something to show. A stored session
  // that the relay no longer lists is replaced the same way.
  async function pickSession() {
    try {
      const response = await fetch(String(e.base || "").replace(/\/+$/, "") + "/sessions", {
        headers: e.token ? { Authorization: "Bearer " + e.token } : {}
      });
      const body = await response.json().catch(() => ({}));
      const ids = (Array.isArray(body && body.sessions) ? body.sessions : []).map((item) => String(item && item.id || "")).filter(Boolean);
      const stored = localStorage.getItem("v3.session") || "";
      const pick = ids.includes(stored) ? stored : String((body && body.current) || ids[0] || "");
      if (pick) {
        localStorage.setItem("v3.session", pick), e.session = pick;
      }
    } catch (_) {
      /* offline: keep the stored session and let Ge() surface the error */
    }
  }
  function Te() {
    const s = n && n.manifest && n.manifest.version ? n.manifest.version : "dev", o = e.profileDraft || e.profile, i = o.meName !== e.profile.meName || o.aiName !== e.profile.aiName || o.meAvatar !== e.profile.meAvatar || o.aiAvatar !== e.profile.aiAvatar;
    const ico = {
      server: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="6.5" rx="2"/><rect x="3.5" y="13" width="17" height="6.5" rx="2"/><path d="M7 7.7h.01M7 16.2h.01"/></svg>',
      avatar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.2"/><path d="M5.5 19.2c.8-3.2 3.3-4.9 6.5-4.9s5.7 1.7 6.5 4.9"/></svg>',
      notify: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 16.5h11l-1.4-2.1V10a4.1 4.1 0 0 0-8.2 0v4.4z"/><path d="M10.2 19a1.9 1.9 0 0 0 3.6 0"/></svg>',
      reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M19 5.5V10h-4.5"/></svg>',
      about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2"/><path d="M12 7.6h.01"/></svg>'
    };
    const tint = { server: "blue", avatar: "green", notify: "orange", about: "green", reset: "pink" };
    const p = (x, M, j, E) => `<section class="v3acc ${e.openSection === x ? "open" : ""}" data-acc="${x}"><button class="v3acc-head" data-acc-toggle="${x}"><span class="v3acc-ico ${tint[x] || "blue"}">${ico[x] || ""}</span><span class="v3acc-main"><span class="v3acc-title">${M}</span><span class="v3acc-sum">${j}</span></span><span class="v3acc-chev">›</span></button><div class="v3acc-body" id="acc-${x}" ${e.openSection === x ? "" : "hidden"}>${E}</div></section>`, g = `<label class="v3field"><span class="v3field-head"><span>家里（Wi-Fi）</span><em class="v3field-state" id="lanState"></em></span><input class="v3form-input" id="setLan" value="${b(e.lanBase)}" placeholder="例如：http://192.168.1.1:8788"></label><label class="v3field"><span class="v3field-head"><span>外部（可选）</span><em class="v3field-state" id="wanState"></em></span><input class="v3form-input" id="setWan" value="${b(e.wanBase)}" placeholder="例如：http://10.126.126.1:8788"></label><div class="v3field"><span>连接方式</span><div class="v3conn-row"><div class="v3optlist">${["auto", "lan", "wan"].map((x) => `<button class="v3opt ${e.connectMode === x ? "active" : ""}" data-conn-mode="${x}"><span class="v3opt-label">${x === "auto" ? "自动" : x === "lan" ? "家里" : "外部"}</span></button>`).join("")}</div><button class="v3opt v3test-btn" id="testNetwork"><span class="v3opt-label">网络测试</span></button></div><p class="v3nethint">若自动切换不稳定，请手动测试切换！</p></div><label class="v3field"><span>访问令牌</span><div class="v3token-input"><input class="v3form-input v3masked" id="setToken" value="${b(e.token)}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="访问令牌"><button type="button" class="v3eye" id="toggleSetToken" aria-label="显示令牌"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6.7 0 10.5 7 10.5 7a17.5 17.5 0 0 1-3.2 4.1"/><path d="M6.1 6.1C3.4 8 1.5 12 1.5 12s3.8 7 10.5 7c1.5 0 2.8-.3 4-.9"/></svg></button></div></label><button class="v3setting-action" id="saveServer">保存并重新连接</button>`, v = `<div class="v3actor" data-actor="me"><button type="button" class="v3actor-avatar" id="pickMe">${ae(!0, o)}</button><input class="v3form-input" id="setMeName" value="${b(o.meName)}" placeholder="我的名字"></div><div class="v3actor" data-actor="ai"><button type="button" class="v3actor-avatar" id="pickAi">${ae(!1, o)}</button><input class="v3form-input" id="setAiName" value="${b(o.aiName)}" placeholder="助手名字"></div><div class="v3avatar-tools"><span class="v3avatar-hint">点头像可更换图片</span></div><div class="v3avatar-actions"><button type="button" class="v3action-btn" id="avatarCancel" ${i ? "" : "disabled"}>取消</button><button type="button" class="v3action-btn primary" id="avatarSave" ${i ? "" : "disabled"}>保存</button></div><input class="v3pick" type="file" accept="image/*" id="avatarMeFile" hidden><input class="v3pick" type="file" accept="image/*" id="avatarAiFile" hidden>`, f = `<div class="v3setting"><span>开启提醒</span><button class="v3switch ${e.notify.enabled ? "on" : ""}" id="notifyToggle"><i></i></button></div><p class="v3hint">开启后每轮结束会通过系统通知提醒。</p><button class="v3setting-action" id="testNotify">发送测试提醒</button>`, k = '<p class="v3hint">会删除地址、访问令牌、头像、通知设置和全部缓存，回到首次打开状态。不会删除电脑端会话。</p><button class="v3setting-action danger" id="resetApp">恢复初始化</button>';
    const about = `<p class="v3hint">看到这里，说明「DSH控制台」手机端已经安装好了。在 DeepSeek Harness 电脑客户端安装「DSH手机控制台」插件，并启用。然后在 DeepSeek Harness 左下角个人信息处，点开设置，配置你的设置信息。并根据配置信息，填写在本页面「服务器」配置里。「DSH控制台」要能正常使用，电脑端 DeepSeek Harness 不能断线。</p><p class="v3hint">手机填写电脑地址和访问令牌；家里填局域网 IP，外部填虚拟网 IP。自动切换不稳定时，请手动测试切换。</p><div class="v3about-links"><div class="v3about-row"><span>官网：<a class="chat-link" href="https://docklet.cn" target="_blank" rel="noreferrer">docklet.cn</a></span><button type="button" class="v3about-copy" data-copy-about="https://docklet.cn">复制</button></div><div class="v3about-row"><span>主仓库：<a class="chat-link" href="https://github.com/Docklet-one/docklet" target="_blank" rel="noreferrer">github.com/Docklet-one/docklet</a></span><button type="button" class="v3about-copy" data-copy-about="https://github.com/Docklet-one/docklet">复制</button></div><div class="v3about-row"><span>交流 QQ 群：558391173</span><button type="button" class="v3about-copy" data-copy-about="558391173">复制</button></div><div class="v3about-row"><span>邮箱：<a href="mailto:docklet@163.com">docklet@163.com</a></span><button type="button" class="v3about-copy" data-copy-about="docklet@163.com">复制</button></div></div>`;
    t.innerHTML = `<div class="v3ui v3route">
      <header class="v3head">${e.client ? `<button class="v3gear v3back" id="backChat" aria-label="返回">‹</button>` : ""}<h1 class="v3title v3page-title">设置</h1></header>
      <div class="v3sheet-list">
        ${e.error ? `<div class="v3error">${b(e.error)}</div>` : ""}
        ${p("server", "服务器", `${e.connected ? "已连接" : "未连接"} · ${e.connectMode === "wan" ? "外部" : e.connectMode === "lan" ? "家里" : "自动"} · ${currentBaseLabel()}`, g)}
        ${p("avatar", "头像", `${b(o.meName || "我")} / ${b(o.aiName || "DSH")}`, v)}
        ${p("notify", "通知", `${e.notify.enabled ? "开启" : "关闭"}`, f)}
        ${p("about", "应用介绍", "安装、配置与反馈", about)}
        ${p("reset", "恢复初始化", "删除全部本地数据", k)}
        <p class="v3version">v${b(s)}</p>
      </div>
    </div>`, t.querySelector("#backChat") && (t.querySelector("#backChat").onclick = () => H("chat"));
    for (const copyBtn of t.querySelectorAll("[data-copy-about]")) copyBtn.onclick = async () => {
      const value = copyBtn.getAttribute("data-copy-about") || "";
      const old = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(value);
        copyBtn.textContent = "已复制";
        copyBtn.classList.add("copied");
      } catch {
        copyBtn.textContent = "复制失败";
      }
      window.setTimeout(() => {
        copyBtn.textContent = old;
        copyBtn.classList.remove("copied");
      }, 1200);
    };
    for (const x of t.querySelectorAll("[data-acc-toggle]"))
      x.onclick = () => {
        const M = x.dataset.accToggle;
        e.openSection = e.openSection === M ? "" : M;
        for (const j of t.querySelectorAll("[data-acc]")) {
          const E = j.dataset.acc === e.openSection;
          j.classList.toggle("open", E);
          const R = j.querySelector(".v3acc-body");
          R && (R.hidden = !E);
        }
      };
    for (const x of t.querySelectorAll("[data-conn-mode]"))
      x.onclick = () => {
        e.connectMode = x.dataset.connMode;
        for (const M of t.querySelectorAll("[data-conn-mode]")) M.classList.toggle("active", M === x);
      };
    const L = t.querySelector("#setToken"), z = t.querySelector("#toggleSetToken"), ce = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>', oe = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6.7 0 10.5 7 10.5 7a17.5 17.5 0 0 1-3.2 4.1"/><path d="M6.1 6.1C3.4 8 1.5 12 1.5 12s3.8 7 10.5 7c1.5 0 2.8-.3 4-.9"/></svg>';
    z.onclick = () => {
      // 普通键盘 + CSS 遮罩：不用 password 类型，避免系统切到安全键盘。
      const hidden = L.classList.contains("v3masked");
      L.classList.toggle("v3masked", !hidden);
      z.innerHTML = hidden ? oe : ce;
      z.setAttribute("aria-label", hidden ? "显示令牌" : "隐藏令牌");
    };
    const T = t.querySelector("#testNetwork");
    T.onclick = async () => {
      const x = [
        ["lan", "家里", (t.querySelector("#setLan").value || "").trim(), t.querySelector("#lanState")],
        ["wan", "外部", (t.querySelector("#setWan").value || "").trim(), t.querySelector("#wanState")]
      ];
      if (!x.filter((j) => j[2]).length) {
        U("先填一个地址");
        return;
      }
      T.disabled = !0;
      const netStarted = Date.now();
      const netLabel = T.innerHTML;
      T.innerHTML = '<span class="v3btn-spin"></span>测试中…';
      const M = (t.querySelector("#setToken").value || "").trim();
      let netOk = 0;
      const results = [];
      for (const [, j, E, R] of x) {
        if (R.className = "v3field-state", !E) {
          R.textContent = "";
          results.push({ label: j, text: "未填", ok: false });
          continue;
        }
        R.textContent = "测试中…";
        const X = new AbortController(), $e = window.setTimeout(() => X.abort(), 1800), pe = performance.now();
        try {
          const ue = await fetch(E.replace(/\/+$/, "") + "/health", {
            headers: M ? { Authorization: "Bearer " + M } : {},
            signal: X.signal
          });
          if (!ue.ok) throw new Error(String(ue.status));
          const ge = Math.max(1, Math.round(performance.now() - pe));
          R.textContent = ge + "ms", R.className = "v3field-state ok";
          results.push({ label: j, text: ge + "ms", ok: true });
          netOk += 1;
        } catch {
          R.textContent = "连接超时", R.className = "v3field-state fail";
          results.push({ label: j, text: "连接超时", ok: false });
        } finally {
          window.clearTimeout($e);
        }
      }
      await minLoading(netStarted, 200);
      T.disabled = !1;
      T.innerHTML = netLabel;
      U(netOk ? "网络测试完成" : "网络不可用");
    };
    const Le = t.querySelector("#notifyToggle");
    Le.onclick = () => {
      e.notify.enabled = !e.notify.enabled;
      Le.classList.toggle("on", e.notify.enabled);
      localStorage.setItem("v3.notify", e.notify.enabled ? "1" : "0");
      const summary = t.querySelector('[data-acc="notify"] .v3acc-sum');
      summary && (summary.textContent = e.notify.enabled ? "开启" : "关闭");
      K();
    };
    t.querySelector("#testNotify").onclick = async () => {
      const notifyBtn = t.querySelector("#testNotify");
      if (!notifyBtn || notifyBtn.disabled) return;
      if (!n || !n.watch || typeof n.watch.test != "function") {
        U("当前壳不支持测试提醒");
        return;
      }
      const notifyStarted = Date.now();
      const notifyLabel = notifyBtn.innerHTML;
      notifyBtn.disabled = !0;
      notifyBtn.innerHTML = '<span class="v3btn-spin"></span>发送中…';
      try {
        if (typeof n.watch.ensurePermission == "function" && !await n.watch.ensurePermission()) {
          U("通知权限没开，请到系统设置里允许通知");
          return;
        }
        await n.watch.test(), U("已发送测试提醒");
      } catch (x) {
        U("发送失败：" + (x && x.message || "未知错误"));
      } finally {
        await minLoading(notifyStarted, 450);
        notifyBtn.disabled = !1;
        notifyBtn.innerHTML = notifyLabel;
      }
    }, t.querySelector("#saveServer").onclick = async () => {
      const saveBtn = t.querySelector("#saveServer");
      const saveLabel = saveBtn ? saveBtn.innerHTML : "";
      if (saveBtn) {
        saveBtn.disabled = !0;
        saveBtn.innerHTML = '<span class="v3btn-spin"></span>保存中…';
      }
      if (e.lanBase = normalizeBase(t.querySelector("#setLan").value), e.wanBase = normalizeBase(t.querySelector("#setWan").value), e.token = (t.querySelector("#setToken").value || "").trim(), !e.lanBase && !e.wanBase) {
        e.error = "至少填一个地址", $();
        return;
      }
      const saveStarted = Date.now();
      e.base = Ae(), localStorage.setItem("v3.lan", e.lanBase), localStorage.setItem("v3.wan", e.wanBase), localStorage.setItem("v3.token", e.token), localStorage.setItem("v3.mode", e.connectMode), e.error = "";
      if (!e.session || !qe(e.state)) {
        try {
          await pickSession();
        } catch (error) {
        }
      }
      await minLoading(saveStarted, 400);
      Ge();
      U("已保存，正在重新连接");
      if (saveBtn) {
        saveBtn.disabled = !1;
        saveBtn.innerHTML = saveLabel;
      }
    };
    const te = () => o.meName !== e.profile.meName || o.aiName !== e.profile.aiName || o.meAvatar !== e.profile.meAvatar || o.aiAvatar !== e.profile.aiAvatar, Se = t.querySelector("#setMeName"), ke = t.querySelector("#setAiName"), ze = () => {
      Se.value = o.meName, ke.value = o.aiName;
      const x = t.querySelector("#pickMe .v3av"), M = t.querySelector("#pickAi .v3av");
      x && (x.outerHTML = ae(!0, o)), M && (M.outerHTML = ae(!1, o)), J();
    }, J = () => {
      const x = te(), M = t.querySelector("#avatarSave"), j = t.querySelector("#avatarCancel");
      M && (M.disabled = !x), j && (j.disabled = !x);
      const E = t.querySelector('[data-acc="avatar"] .v3acc-sum');
      E && (E.textContent = `${o.meName || "我"} / ${o.aiName || "DSH"}`);
    };
    Se.oninput = () => {
      o.meName = Se.value.trim(), J();
    }, ke.oninput = () => {
      o.aiName = ke.value.trim(), J();
    };
    const je = (x, M) => {
      if (!x) return;
      const j = new FileReader();
      j.onload = () => {
        const E = new Image();
        E.onload = () => {
          const R = document.createElement("canvas"), X = 160;
          R.width = X, R.height = X;
          const $e = R.getContext("2d"), pe = Math.max(X / E.width, X / E.height), ue = E.width * pe, ge = E.height * pe;
          $e.drawImage(E, (X - ue) / 2, (X - ge) / 2, ue, ge), o[M] = R.toDataURL("image/jpeg", 0.85);
          const De = t.querySelector(M === "meAvatar" ? "#pickMe .v3av" : "#pickAi .v3av");
          De && (De.outerHTML = ae(M === "meAvatar", o)), J();
        }, E.src = String(j.result);
      }, j.readAsDataURL(x);
    };
    t.querySelector("#pickMe").onclick = () => t.querySelector("#avatarMeFile").click(), t.querySelector("#pickAi").onclick = () => t.querySelector("#avatarAiFile").click(), t.querySelector("#avatarMeFile").onchange = (x) => je(x.target.files && x.target.files[0], "meAvatar"), t.querySelector("#avatarAiFile").onchange = (x) => je(x.target.files && x.target.files[0], "aiAvatar"), t.querySelector("#avatarCancel").onclick = () => {
      Object.assign(o, e.profile), ze(), U("已恢复上次保存的值");
    }, t.querySelector("#avatarSave").onclick = async () => {
      const avatarBtn = t.querySelector("#avatarSave");
      if (!te() || !avatarBtn || avatarBtn.disabled) return;
      const avatarLabel = avatarBtn.innerHTML;
      avatarBtn.disabled = !0;
      avatarBtn.innerHTML = '<span class="v3btn-spin"></span>保存中…';
      await new Promise((resolve) => setTimeout(resolve, 350));
      e.profile = { ...o }, localStorage.setItem("v3.name", e.profile.meName), localStorage.setItem("v3.aiName", e.profile.aiName), e.profile.meAvatar ? localStorage.setItem("v3.avatar", e.profile.meAvatar) : localStorage.removeItem("v3.avatar"), e.profile.aiAvatar ? localStorage.setItem("v3.aiAvatar", e.profile.aiAvatar) : localStorage.removeItem("v3.aiAvatar"), J(), U("已保存");
      avatarBtn.disabled = !1;
      avatarBtn.innerHTML = avatarLabel;
    };
    let le = !1, Ee = 0;
    const de = t.querySelector("#resetApp");
    de.onclick = async () => {
      if (!le) {
        le = !0, de.textContent = "再点一次确认", Ee = window.setTimeout(() => {
          le = !1, de.textContent = "恢复初始化";
        }, 3e3);
        return;
      }
      window.clearTimeout(Ee);
      const resetLabel = de.innerHTML;
      de.disabled = !0;
      de.innerHTML = '<span class="v3btn-spin"></span>清理中…';
      await new Promise((resolve) => setTimeout(resolve, 650));
      for (const x of Object.keys(localStorage))
        x.startsWith("v3.") && localStorage.removeItem(x);
      e.lanBase = re, e.wanBase = "", e.base = re, e.token = "", e.profile = { ...Oe }, e.profileDraft = null, e.notify = { enabled: !0, mode: "turn" }, localStorage.setItem("v3.notify", "1"), Ke();
      U("已恢复初始化");
      window.setTimeout(() => location.reload(), 700);
    };
  }
  function Me() {
    const s = ["🤖", "🐝", "🐱", "🦊", "🐼", "🚀"];
    t.innerHTML = `<div class="v3ui v3route">
      <header class="v3head"><button class="v3gear v3back" id="backSettings" aria-label="返回">‹</button><h1 class="v3title v3page-title">个人资料</h1></header>
      <div class="v3sheet-list">
        <div class="v3profile-preview">${ae(!0, e.profile)}</div>
        <label class="v3field"><span>用户名</span><input class="v3form-input" id="profileName" value="${b(e.profile.name)}" placeholder="输入用户名"></label>
        <div class="v3field"><span>头像</span><div class="v3avatar-grid">${s.map((o) => `<button class="v3avatar-opt ${e.profile.avatar === o ? "active" : ""}" data-avatar="${o}">${o}</button>`).join("")}</div></div>
        <button class="v3setting-action" id="saveProfile">保存</button>
      </div>
    </div>`, t.querySelector("#backSettings").onclick = () => H("settings");
    for (const o of t.querySelectorAll("[data-avatar]"))
      o.onclick = () => {
        e.profile.avatar = o.dataset.avatar;
        for (const p of t.querySelectorAll("[data-avatar]")) p.classList.toggle("active", p === o);
        const i = t.querySelector(".v3profile-preview");
        i && (i.innerHTML = ae(!0, e.profile));
      };
    t.querySelector("#saveProfile").onclick = () => {
      e.profile.name = (t.querySelector("#profileName").value || "").trim(), localStorage.setItem("v3.name", e.profile.name), localStorage.setItem("v3.avatar", e.profile.avatar), H("settings");
    };
  }
  function y(s, o, i) {
    return `<div class="v3optlist">${o.map(
      (p) => `<button class="v3opt ${String(i || "") === String(p.value) ? "active" : ""}" data-create-kind="${s}" data-create-value="${b(p.value)}" data-create-desc="${b(p.description || "")}"><span class="v3opt-label">${b(p.label)}</span><span class="v3opt-check">${String(i || "") === String(p.value) ? "✓" : ""}</span></button>`
    ).join("")}</div>`;
  }
  function w(s, o, i) {
    const p = o.find((v) => String(v.value) === String(i || "")), g = p && p.description || "";
    return `<div class="v3opt-hint ${g ? "show" : ""}" data-hint="${s}">${b(g)}</div>`;
  }
  function q() {
    const s = e.createOptions || {}, o = {
      standard: { label: "标准", description: "处理代码、文件和数据，适合大多数任务。" },
      ptc: { label: "创造", description: "用对话产出界面或插件，工具会以卡片呈现。" },
      minimal: { label: "极简", description: "只带文件和终端，轻量、省 token。" },
      cordis: { label: "编排", description: "直接编辑 DSH 组合与插件，开发者用。" }
    }, i = {
      "read-only": { label: "只读", description: "只能看，不能改。" },
      "workspace-write": { label: "仅工作区", description: "只能改工作区。" },
      "danger-full-access": { label: "完全访问", description: "不再询问，直接执行。" }
    }, p = (s.presets || []).map((f) => ({
      value: f.id,
      label: o[String(f.id)] && o[String(f.id)].label || f.name || f.id,
      description: o[String(f.id)] && o[String(f.id)].description || f.description || ""
    })), g = (s.permissions || []).map((f) => ({
      value: f.value,
      label: i[String(f.value)] && i[String(f.value)].label || f.name || f.value,
      description: i[String(f.value)] && i[String(f.value)].description || f.description || ""
    })), v = [];
    for (const f of s.models && s.models.groups || [])
      for (const k of f.models || [])
        v.push({
          value: `${f.provider || f.id || ""}::${k.id || ""}`,
          label: k.name || k.id || "",
          description: f.name || f.provider || f.id || ""
        });
    if (!e.createDraft.preset && p.length) {
      const f = p.find((k) => k.value === "standard") || p[0];
      e.createDraft.preset = f.value;
    }
    if (!e.createDraft.permission && g.length && (e.createDraft.permission = s.defaultPermission || g[0].value), !e.createDraft.model && v.length) {
      const f = s.models && s.models.default && s.models.default.model, k = f && v.find((L) => L.value.endsWith("::" + f)) || v[0];
      e.createDraft.model = k.value;
    }
    t.innerHTML = `<div class="v3ui v3route">
      <header class="v3head"><button class="v3gear v3back" id="backSessions" aria-label="返回">‹</button><h1 class="v3title v3page-title">新建对话</h1></header>
      <div class="v3sheet-list">
        <div class="v3form-block"><div class="v3form-label">标题（可空）</div><input class="v3form-input" id="createTitle" value="${b(e.createDraft.title)}" placeholder="可不填，自动取第一句"></div>
        <div class="v3form-block"><div class="v3form-label">模式</div>${y("preset", p, e.createDraft.preset)}${w("preset", p, e.createDraft.preset)}</div>
        ${g.length ? `<div class="v3form-block"><div class="v3form-label">权限</div>${y("permission", g, e.createDraft.permission)}${w("permission", g, e.createDraft.permission)}</div>` : ""}
        ${v.length ? `<div class="v3form-block"><div class="v3form-label">模型</div>${y("model", v, e.createDraft.model)}${w("model", v, e.createDraft.model)}</div>` : ""}
        <button class="v3setting-action" id="createConfirm" ${e.createLoading ? "disabled" : ""}>${e.createLoading ? "创建中…" : "开始对话"}</button>
      </div>
    </div>`, t.querySelector("#backSessions").onclick = () => H("sessions");
    const h = t.querySelector("#createTitle");
    h && h.addEventListener("input", () => e.createDraft.title = h.value);
    for (const f of t.querySelectorAll(".v3opt"))
      f.onclick = () => {
        const k = f.dataset.createKind;
        e.createDraft[k] = f.dataset.createValue;
        for (const z of t.querySelectorAll(`.v3opt[data-create-kind="${k}"]`)) {
          const ce = z === f;
          z.classList.toggle("active", ce);
          const oe = z.querySelector(".v3opt-check");
          oe && (oe.textContent = ce ? "✓" : "");
        }
        const L = t.querySelector(`.v3opt-hint[data-hint="${k}"]`);
        L && (L.textContent = f.dataset.createDesc || "", L.classList.remove("show"), L.offsetWidth, L.classList.add("show"));
      };
    t.querySelector("#createConfirm").onclick = Z;
  }
  function sessionTime(at) {
    const value = Number(at) || 0;
    if (!value) return "";
    const date = new Date(value);
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const days = Math.round((startOfDay(now) - startOfDay(date)) / 864e5);
    if (days <= 0) return kt(value);
    if (days === 1) return "昨天";
    return (date.getMonth() + 1) + "月" + date.getDate() + "日";
  }
  function N() {
    if (e.sessionsLoading && !(e.sessions || []).length) {
      return `<div class="v3skel">${Array.from({ length: 6 }, () => '<div class="v3skel-row"><span class="v3skel-bar w60"></span><span class="v3skel-bar w35"></span></div>').join("")}</div>`;
    }
    const query = String(e.sessionQuery || "").trim().toLowerCase();
    const list = (e.sessions || []).filter((session) => !session.blank);
    const matched = query ? list.filter((session) => String(session.title || "").toLowerCase().includes(query)) : list;
    if (!matched.length) {
      return query
        ? '<div class="v3empty">没有匹配的会话</div>'
        : '<div class="v3empty"><div class="v3empty-icon">🗂</div><div>还没有会话</div><div class="v3empty-sub">点右上角的 ＋ 新建一个</div></div>';
    }
    const current = String(qe(e.state) && qe(e.state).id || e.session || "");
    const rows = matched.map((session) => {
      const active = String(session.id) === current;
      const running = Boolean(session.running);
      const rawSnippet = String(session.snippet || "").trim();
      const snippet = rawSnippet && rawSnippet !== String(session.title || "").trim() ? rawSnippet : "";
      return `<div class="v3session-row ${active ? "active" : ""}"><button class="v3session" data-session="${b(session.id)}"><span class="v3session-main"><span class="v3session-label"><span class="v3session-title">${b(session.title || session.id)}</span></span>${snippet ? `<span class="v3session-snippet">${b(snippet)}</span>` : ""}</span><span class="v3session-side">${running ? '<i class="v3dot run"></i>' : ""}<span class="v3session-time">${b(sessionTime(session.at))}</span></span></button><button class="v3session-more" data-session="${b(session.id)}" data-title="${b(session.title || "")}" aria-label="会话操作">⋯</button></div>`;
    }).join("");
    return `<div class="v3session-list">${rows}</div>`;
  }
  function archivePage() {
    const list = Array.isArray(e.archivedSessions) ? e.archivedSessions : [];
    const rows = list.length
      ? list.map((g) => `<div class="v3session-row v3archrow"><span class="v3session-label">${b(g.title || g.sessionId)}</span><span class="v3session-meta">${b(kt(g.at))}</span><button class="v3session-restore" data-restore="${b(g.sessionId)}">恢复</button></div>`).join("")
      : '<div class="v3empty">没有已归档的会话</div>';
    t.innerHTML = `<div class="v3ui v3route">
      <header class="v3head"><button class="v3gear v3back" id="backArchived" aria-label="返回">‹</button><h1 class="v3title v3page-title">已归档</h1></header>
      <div class="v3sheet-list" id="archivedList">${rows}</div>
    </div>`;
    t.querySelector("#backArchived").onclick = () => H("sessions");
    const box = t.querySelector("#archivedList");
    box && (box.onclick = (ev) => {
      const r = ev.target.closest("[data-restore]");
      if (!r) return;
      r.disabled = !0;
      e.client.unarchiveSession(r.dataset.restore).then(() => Ce()).catch((x) => {
        e.error = "恢复失败：" + (x && x.message || "网络错误"), $();
      });
    });
  }
  const CARD_ICONS = {
    approval: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2.6 4.8 4.7v4.6c0 3.2 2.1 6 5.2 7.1 3.1-1.1 5.2-3.9 5.2-7.1V4.7L10 2.6Z"/><path d="m7.5 9.8 1.8 1.8 3.2-3.4"/></svg>',
    question: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3.7 6.4a1.9 1.9 0 0 1 1.9-1.9h8.8a1.9 1.9 0 0 1 1.9 1.9v5a1.9 1.9 0 0 1-1.9 1.9H9.1L5.6 16.6v-3.2h-.1a1.9 1.9 0 0 1-1.8-1.9Z"/><path d="M7.1 8.4h5.8M7.1 10.8h3.4"/></svg>',
    check: '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.4 6.3 4.8 8.7 9.6 3.7"/></svg>',
    x: '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 3l6 6M9 3l-6 6"/></svg>'
  };
  function actionKey() {
    return "v3.actions." + (e.session || "");
  }
  function readActions() {
    try {
      const list = JSON.parse(localStorage.getItem(actionKey()) || "[]");
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }
  function writeActions(list) {
    try {
      localStorage.setItem(actionKey(), JSON.stringify(list.slice(-40)));
    } catch {
    }
  }
  function addAction(record) {
    if (!e.session || !record || !record.id) return;
    const list = readActions();
    if (list.some((item) => String(item.id) === String(record.id))) return;
    const messages = e.state && Array.isArray(e.state.messages) ? e.state.messages : [];
    const afterId = record.afterId || (messages.length ? messages[messages.length - 1].id : "");
    list.push({ ...record, afterId, at: record.at || Date.now() });
    writeActions(list);
  }
  function stopKey() {
    return "v3.stops." + (e.session || "");
  }
  function readStops() {
    try {
      const list = JSON.parse(localStorage.getItem(stopKey()) || "[]");
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }
  function writeStops(list) {
    try {
      localStorage.setItem(stopKey(), JSON.stringify(list.slice(-40)));
    } catch {
    }
  }
  function stopLabel(by) {
    return by === "phone" ? "你已停止本轮" : by === "pc" ? "已在电脑端停止本轮" : "本轮已停止";
  }
  function addStop(rec) {
    if (!e.session || !rec) return;
    const list = readStops();
    if (list.some((x) => String(x.id) === String(rec.id))) return;
    list.push({ ...rec, at: rec.at || Date.now() });
    writeStops(list);
  }
  function stopBy() {
    const local = e.localStopAt;
    e.localStopAt = 0;
    return local && Date.now() - local < 6e4 ? "phone" : "pc";
  }
  // 主动停止只落在本机缓存里：不进 messages、不进快照、不会发给模型。
  function noteStops(st) {
    const s = st && st.stoppedTurn;
    if (!s || !e.session) return;
    const key = "stop-" + (s.turn || s.at);
    if (e.stopNoteSig === key) return;
    e.stopNoteSig = key;
    const stampSkippedTurn = () => {
      if (!e.skipPromptId) return;
      const list = readActions();
      const index = list.findIndex((a) => String(a.id) === String(e.skipPromptId));
      if (index >= 0 && !list[index].turn) {
        list[index] = { ...list[index], turn: Number(s.turn) || 0 };
        writeActions(list);
      }
    };
    // 「不回答」结束的回合：保留未回答卡片，不生成停止记录。
    if (e.skipStopNote) {
      e.skipStopNote = !1;
      stampSkippedTurn();
      return;
    }
    if (s.turn && readActions().some((a) => a.decision === "unanswered" && Number(a.turn) === Number(s.turn))) return;
    const msgs = gt(st), last = msgs.length ? msgs[msgs.length - 1] : null;
    addStop({ id: key, turn: Number(s.turn) || 0, seq: Number(s.seq) || 0, at: Number(s.at) || Date.now(), by: stopBy(), afterId: last ? last.id : "" });
    d();
  }
  function stopItemHtml(s) {
    return `<div class="v3row v3stoprow" data-stop-id="${b(s.id)}"><div class="v3meta-row">${ae(!1, e.profile)}<span class="v3who">${b(e.profile.aiName || "DSH")}</span><span>${b(kt(s.at))}</span><button class="v3copy" data-copy-message>复制</button></div><div class="v3bubble v3stopbubble">${b(stopLabel(s.by))}</div></div>`;
  }
  function stopsHtml() {
    return readStops().map(stopItemHtml).join("");
  }
  function lastUserMessage() {
    const list = gt(e.state);
    for (let i = list.length - 1; i >= 0; i -= 1) if (list[i] && list[i].role === "user") return list[i];
    return null;
  }
  function turnErrorHtml() {
    const x = e.state && e.state.turnError;
    if (!x) return "";
    return `<div class="v3row" data-error-turn><div class="v3meta-row">${ae(!1, e.profile)}<span class="v3who">${b(e.profile.aiName || "DSH")}</span><span>${b(kt(x.at))}</span></div><div class="v3bubble">${b(x.message || "执行失败")}</div></div>`;
  }
    function actionCardHtml(a) {
    if (a.kind === "approval") {
      const allow = a.decision === "allow";
      return `<div class="v3card v3card-approval v3card-done" data-action-at="${Number(a.at) || 0}" data-action-after="${b(a.afterId || "")}">
        <div class="v3card-head v3done-head"><h3><span class="v3card-icon">${CARD_ICONS.approval}</span><span class="t">${b(a.title || "审批")}</span></h3><span class="v3done-tag${allow ? "" : " is-reject"}">${allow ? CARD_ICONS.check : CARD_ICONS.x}${allow ? "已允许" : "已拒绝"}</span></div>
        <p class="v3muted">${b(a.reason || a.tool || "")}</p>
        <div class="v3done-foot"><span class="v3done-time">${b(kt(a.at))}</span></div>
      </div>`;
    }
    return `<div class="v3card v3card-input v3card-done" data-action-at="${Number(a.at) || 0}" data-action-after="${b(a.afterId || "")}">
      <div class="v3card-head v3done-head"><h3><span class="v3card-icon">${CARD_ICONS.question}</span><span class="t">${b(a.title || "问答")}</span></h3><span class="v3done-tag${a.decision === "unanswered" ? " is-reject" : ""}">${a.decision === "unanswered" ? CARD_ICONS.x + "已拒绝" : CARD_ICONS.check + "已回答"}</span></div>
      ${Array.isArray(a.details) && a.details.length ? a.details.map((d) => `<div class="v3done-qa"><div class="k">${b(d.question)}</div><div class="v3done-answer">${b(d.answer)}</div></div>`).join("") : `<div class="v3muted">${b(a.summary || "")}</div>`}
      <div class="v3done-foot"><span class="v3done-time">${b(kt(a.at))}</span></div>
    </div>`;
  }
  function actionHtml() {
    return readActions().map(actionCardHtml).join("");
  }  function placePromptCards(list) {
    if (!list) return;
    const cards = [...list.querySelectorAll("[data-prompt-at]")];
    const rows = [...list.querySelectorAll(".v3row[data-mid][data-at]")];
    for (const card of cards) {
      const seq = Number(card.dataset.promptSeq) || 0;
      const at = Number(card.dataset.promptAt) || 0;
      let next = seq ? rows.find((row) => Number(row.dataset.seq) > seq) : null;
      if (!next && at) next = rows.find((row) => Number(row.dataset.at) > at);
      if (next) list.insertBefore(card, next);
      else list.appendChild(card);
    }
    const box = list.querySelector("#prompts");
    if (box && !box.children.length) box.remove();
  }
  function B(s) {
    return s.filter((o) => o.status === "pending").map((o) => {
      if (o.type === "approval") {
        return `<div class="v3card v3card-approval" data-prompt="${b(o.id)}" data-prompt-at="${Number(o.at) || 0}" data-prompt-seq="${Number(o.seq) || 0}">
          <div class="v3card-head"><h3><span class="v3card-icon">${CARD_ICONS.approval}</span><span class="t">${b(o.title || "需要审批")}</span></h3></div>
          <p class="v3muted">${b(o.reason || o.tool || "")}</p>
          <div class="v3card-actions"><button data-approve="1" data-id="${b(o.id)}">允许</button><button class="ghost" data-approve="0" data-id="${b(o.id)}">拒绝</button></div>
        </div>`;
      }
      return `<div class="v3card v3card-input" data-prompt="${b(o.id)}" data-prompt-at="${Number(o.at) || 0}" data-prompt-seq="${Number(o.seq) || 0}">
        <div class="v3card-head"><h3><span class="v3card-icon">${CARD_ICONS.question}</span><span class="t">需要回答</span></h3></div>
        ${(o.questions || []).map((i) => {
          const p = Array.isArray(i.options) ? i.options : [];
          const g = i.multiSelect || i.multiple;
          const v = b(i.question || i.header || i.id);
          return p.length
            ? `<div class="v3q"><div class="v3muted">${v}</div><div class="v3qoptions" data-q-options="${b(i.id)}" data-multi="${g ? "1" : "0"}">${p.map((h) => {
                const f = String(h.label || h);
                return `<button type="button" class="v3opt" aria-pressed="false" data-q-option="${b(i.id)}" data-value="${b(f)}"><span class="dot" aria-hidden="true"></span><span class="v3opt-label">${b(f)}</span></button>`;
              }).join("")}</div></div>`
            : `<div class="v3q"><div class="v3muted">${v}</div><input class="v3custom" data-q-custom="${b(i.id)}" placeholder="输入回答"></div>`;
        }).join("")}
        <div class="v3card-actions"><button class="ghost" data-respond-skip="${b(o.id)}">不回答</button><button data-respond="${b(o.id)}" class="is-wide">提交回答</button></div>
      </div>`;
    }).join("");
  }
  function Y() {
    const s = t.querySelector("#netBar");
    if (!s) return;
    // 断线本身不弹条：页头已经有「重连中」，没缓存的会话在正文里给提示。
    // 这里只显示真正的错误（发送失败、下载失败等）。
    const o = e.error || "";
    if (!o) {
      s.hidden = !0;
      return;
    }
    s.hidden = !1, s.dataset.tone = "bad";
    const i = s.querySelector("#netText");
    i && (i.textContent = o);
    const p = s.querySelector("#netRetry");
    p && (p.onclick = () => {
      if (!e.client) {
        Re();
        return;
      }
      if (e.offline) {
        navigator.onLine === false ? U(connectionHintText()) : e.client.start();
        return;
      }
      e.client.resnapshot("retry"), e.connected || rediscover("retry"), Y();
    });
  }
  function connectedLabel() {
    const label = currentBaseLabel();
    return label ? `已连接 · ${label}` : "已连接";
  }
  function currentPing() {
    const mode = e.connectMode === "wan" ? "wan" : e.connectMode === "lan" ? "lan" : (e.ping.lan != null ? "lan" : "wan");
    const value = e.ping[mode];
    return typeof value === "number" ? value : null;
  }
  const PING_PREVIEW = false;
  let pingBusy = false, pingAt = 0;
  async function measurePing() {
    if (PING_PREVIEW) return;
    if (pingBusy || !e.connected || !e.base) return;
    if (Date.now() - pingAt < 15000) return;
    pingBusy = true;
    const started = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(String(e.base).replace(/\/+$/, "") + "/health", {
        signal: controller.signal,
        headers: e.token ? { Authorization: "Bearer " + e.token } : {}
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(String(res.status));
      const mode = e.connectMode === "wan" ? "wan" : e.connectMode === "lan" ? "lan" : (e.lanBase && String(e.base).startsWith(e.lanBase) ? "lan" : "wan");
      e.ping[mode] = Math.max(1, Math.round(performance.now() - started));
      pingAt = Date.now();
      syncChatHeader();
    } catch (_) {
      clearTimeout(timer);
    } finally {
      pingBusy = false;
    }
  }
  function connStateHtml() {
    const ping = currentPing();
    const pingHtml = ping == null ? "" : `<em class="v3connping">${ping}ms</em>`;
    if (!e.connected) return '<button type="button" class="v3connchip is-reconnect" id="connChip"><i class="v3condot"></i><span class="v3conntexts"><span id="connState" class="v3conntext">重连中···</span><span class="v3conntext v3connghost" aria-hidden="true">${connectedLabel()}</span></span></button>';
    const text = connectedLabel();
    return `<button type="button" class="v3connchip" id="connChip"><i class="v3condot ok"></i><span class="v3conntexts"><span id="connState" class="v3conntext">${text}${pingHtml}</span><span class="v3conntext v3connghost" aria-hidden="true">${text}${pingHtml}</span></span></button>`;
  }
  async function switchConnectMode(mode) {
    const next = mode === "wan" ? e.wanBase : mode === "lan" ? e.lanBase : e.lanBase || e.wanBase;
    if (!next) {
      e.error = "外部地址还没填";
      dismissSheet();
      return;
    }
    e.connectMode = mode, e.base = next, e.connected = !1, e.error = "", e.connSheet = null, pingAt = 0;
    localStorage.setItem("v3.mode", mode), localStorage.setItem("v3.base", next);
    closeSheetDom();
    if (history.state && history.state.v3sheet) history.back();
    syncChatHeader();
    if (!e.session || !qe(e.state)) {
      try {
        await pickSession();
      } catch (error) {
      }
    }
    Ge();
  }
  async function testNetworks() {
    const sheet = e.connSheet;
    if (!sheet || sheet.testing) return;
    sheet.testing = !0, sheet.result = "", syncConnSheetDom();
    const probe = async (base) => {
      if (!base) return null;
      const started = performance.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      try {
        await fetch(String(base).replace(/\/+$/, "") + "/health", {
          signal: controller.signal,
          headers: e.token ? { Authorization: "Bearer " + e.token } : {}
        });
        clearTimeout(timer);
        return Math.round(performance.now() - started);
      } catch (error) {
        clearTimeout(timer);
        return null;
      }
    };
    const [lan, wan] = await Promise.all([probe(e.lanBase), probe(e.wanBase)]);
    const current = e.connSheet || sheet;
    current.testing = !1;
    current.result = "家里 " + (lan == null ? "连接超时" : lan + "ms") + " · 外部 " + (wan == null ? "连接超时" : wan + "ms");
    e.ping = { lan: lan == null ? null : lan, wan: wan == null ? null : wan };
    syncConnSheetDom();
    syncChatHeader();
  }
  function connSheetHtml() {
    const sheet = e.connSheet;
    if (!sheet) return "";
    const current = currentBaseLabel();
    const modes = [{ id: "auto", name: "自动" }, { id: "lan", name: "家里" }, { id: "wan", name: "外部" }];
    return `<div class="v3modal" id="connSheet"><div class="v3modal-card"><div class="v3modal-grabber" aria-hidden="true"></div>
      <div class="v3modal-title">网络</div>
      <div class="v3conn-row">${modes.map((mode) => `<button type="button" class="v3ms-chip${sheet.mode === mode.id ? " on" : ""}" data-conn-pick="${mode.id}" ${mode.id === "wan" && !e.wanBase ? "disabled" : ""}>${mode.name}</button>`).join("")}<button type="button" class="v3ms-chip v3conn-speed" id="connSpeed" ${sheet.testing ? "disabled" : ""}>${sheet.testing ? "测速中…" : "测速"}</button></div>
      <p class="v3ms-hint">当前连接方式：${b(current || "未连接")}${e.connectMode === "auto" ? "（自动）" : ""}</p>
       <p class="v3ms-hint v3connresult" id="connSpeedResult">${sheet.testing ? '<span class="v3skel-bar w60"></span>' : ""}</p>
       <p class="v3ms-hint">若自动切换不稳定，请手动测试切换！</p>
      <button type="button" class="v3ms-apply" id="connSave">保存</button>
      <button type="button" class="v3ms-cancel" id="connClose">取消</button>
    </div></div>`;
  }
  function modelChipLabel() {
    const info = qe(e.state) || {};
    const model = info.model;
    if (model && typeof model === "object") {
      const id = String(model.model || model.id || "");
      const effort = String(model.reasoningEffort || "");
      return effort ? (id || "模型") + " · " + effort : id || "模型";
    }
    return sa(model) || "模型";
  }
  // 胶囊显示：优先实时值，断网时回落到每个会话缓存的模型名（灰显）。
  function modelChipInfo() {
    const session = qe(e.state) || {};
    const live = modelChipLabel();
    if (session.model != null && live && live !== "模型") {
      return { label: live, stale: !e.connected };
    }
    const cached = readModelLabel(e.session || session.id || "");
    return cached ? { label: cached, stale: true } : { label: "", stale: false };
  }
  function rememberModelLabel() {
    const session = qe(e.state);
    if (!session || !session.id) return;
    const label = modelChipLabel();
    if (label && label !== "模型") writeModelLabel(session.id, label);
  }
  function openModelSheet() {
    const info = qe(e.state) || {};
    const model = info.model;
    const isObj = model && typeof model === "object";
    e.modelSheet = {
      provider: isObj ? String(model.provider || "") : "",
      model: isObj ? String(model.model || model.id || "") : String(model || ""),
      effort: isObj ? String(model.reasoningEffort || "") : "",
      permission: String(info.permission || ""),
      saving: false,
      error: ""
    };
    openSheetHistory();
    if (!e.createOptions && e.client) {
      e.client.options().then((options) => {
        e.createOptions = options;
        e.modelSheet && $();
      }).catch(() => {
      });
    }
    $();
  }
  async function applyModelSheet() {
    const sheet = e.modelSheet;
    if (!sheet || sheet.saving || !e.client) return;
    sheet.saving = true, sheet.error = "";
    const applyBtn = t.querySelector("#modelApply");
    if (applyBtn) {
      applyBtn.disabled = !0;
      applyBtn.textContent = "应用中…";
    }
    const errNode = t.querySelector("#modelError");
    if (errNode) {
      errNode.hidden = !0;
      errNode.textContent = "";
    }
    try {
      await e.client.selectModel({
        sessionId: e.session || "",
        provider: sheet.provider,
        model: sheet.model,
        reasoningEffort: sheet.effort
      });
      const info = qe(e.state) || {};
      if (sheet.permission && sheet.permission !== String(info.permission || ""))
        await e.client.setPermission(sheet.permission);
      // 先记下这次选择：万一紧接着断网、快照回不来，胶囊还有正确的值可显示。
      if (e.session) {
        const picked = [sheet.model, sheet.effort].filter(Boolean).join(" · ");
        if (picked) writeModelLabel(e.session, picked);
      }
      e.modelSheet = null, e.error = "";
      closeSheetDom();
      if (history.state && history.state.v3sheet) history.back();
      e.client.resnapshot("model");
    } catch (error) {
      const current = e.modelSheet || sheet;
      current.saving = false;
      current.error = "切换失败：" + (error && error.message || "网络错误");
      const btn = t.querySelector("#modelApply");
      if (btn) {
        btn.disabled = !1;
        btn.textContent = "应用";
      }
      const node = t.querySelector("#modelError");
      if (node) {
        node.hidden = !1;
        node.textContent = current.error;
      }
    }
  }
  function modelSheetHtml() {
    const sheet = e.modelSheet;
    if (!sheet) return "";
    const options = e.createOptions || {};
    const groups = options.models && Array.isArray(options.models.groups) ? options.models.groups : [];
    const group = groups.find((item) => item.id === sheet.provider) || groups[0] || null;
    const models = group && Array.isArray(group.models) ? group.models : [];
    const current = models.find((item) => item.id === sheet.model) || null;
    const efforts = current && current.reasoning && Array.isArray(current.reasoning.efforts) ? current.reasoning.efforts : [];
    const perms = Array.isArray(options.permissions) ? options.permissions : [];
    const permLabels = { "read-only": "仅可查看", "workspace-write": "工作区内修改", "danger-full-access": "完全权限" };
    return `<div class="v3modal" id="modelSheet"><div class="v3modal-card"><div class="v3modal-grabber" aria-hidden="true"></div>
      <div class="v3modal-title">模型与推理</div>
      <div class="v3ms-provider">模型</div>
      <div class="v3ms-row">${models.map((item) => `<button type="button" class="v3ms-chip${item.id === sheet.model ? " on" : ""}" data-ms-model="${b(item.id)}">${b(item.name || item.id)}</button>`).join("")}</div>
      ${efforts.length ? `<div class="v3ms-label">推理等级</div><div class="v3ms-row">${efforts.map((item) => `<button type="button" class="v3ms-chip${item.id === sheet.effort ? " on" : ""}" data-ms-effort="${b(item.id)}">${b(item.name || item.id)}</button>`).join("")}</div>` : ""}
      <div class="v3ms-label">权限</div>
      <div class="v3ms-row">${perms.map((item) => `<button type="button" class="v3ms-chip${item.value === sheet.permission ? " on" : ""}" data-ms-perm="${b(item.value)}">${b(permLabels[item.value] || item.name || item.value)}</button>`).join("")}</div>
      <p class="v3ms-hint">保存后下次生效</p>
      <div class="v3error" id="modelError" ${sheet.error ? "" : "hidden"}>${b(sheet.error || "")}</div>
      <button type="button" class="v3ms-apply" id="modelApply" ${sheet.saving ? "disabled" : ""}>${sheet.saving ? "应用中…" : "应用"}</button>
      <button type="button" class="v3ms-cancel" id="modelCancel">取消</button>
    </div></div>`;
  }
  function syncModelSheetDom() {
    const sheet = t.querySelector("#modelSheet");
    if (!sheet || !e.modelSheet) return;
    for (const btn of sheet.querySelectorAll("[data-ms-model]")) btn.classList.toggle("on", btn.dataset.msModel === e.modelSheet.model);
    for (const btn of sheet.querySelectorAll("[data-ms-effort]")) btn.classList.toggle("on", btn.dataset.msEffort === e.modelSheet.effort);
    for (const btn of sheet.querySelectorAll("[data-ms-perm]")) btn.classList.toggle("on", btn.dataset.msPerm === e.modelSheet.permission);
  }
  function syncConnSheetDom() {
    const sheet = t.querySelector("#connSheet");
    if (!sheet || !e.connSheet) return;
    for (const btn of sheet.querySelectorAll("[data-conn-pick]")) btn.classList.toggle("on", btn.dataset.connPick === e.connSheet.mode);
    const speed = sheet.querySelector("#connSpeed");
    if (speed) {
      speed.textContent = e.connSheet.testing ? "测速中…" : "测速";
      speed.disabled = !!e.connSheet.testing;
    }
    const resultNode = sheet.querySelector("#connSpeedResult");
    if (resultNode) {
      if (e.connSheet.testing) {
        if (resultNode.dataset.html !== "testing") {
          resultNode.dataset.html = "testing";
          resultNode.innerHTML = '<span class="v3skel-bar w60"></span>';
        }
      } else {
      const text = String(e.connSheet.result || "");
      const html = text.split(" · ").map((part) => {
        if (!part) return "";
        if (part.includes("连接超时")) return '<span class="fail">' + b(part) + "</span>";
        return '<span class="ok">' + b(part) + "</span>";
      }).join(" · ");
      if (resultNode.dataset.html !== html) {
        resultNode.dataset.html = html;
        resultNode.innerHTML = html;
      }
      }
    }
    const pingNode = sheet.querySelector("[data-conn-ping]");
    if (pingNode) {
      const mode = e.connSheet.mode === "wan" ? "wan" : e.connSheet.mode === "lan" ? "lan" : (e.ping.lan != null ? "lan" : "wan");
      const value = e.ping[mode];
      pingNode.textContent = typeof value === "number" ? value + "ms" : "";
    }
  }
  function closeSheetDom() {
    const model = t.querySelector("#modelSheet");
    if (model) model.remove();
    const conn = t.querySelector("#connSheet");
    if (conn) conn.remove();
  }
  function openSheetHistory() {
    if (!history.state || !history.state.v3sheet) history.pushState({ v3sheet: 1 }, "");
  }
  function dismissSheet() {
    e.modelSheet = null;
    e.connSheet = null;
    closeSheetDom();
    if (history.state && history.state.v3sheet) history.back();
  }
  window.addEventListener("popstate", () => {
    if (e.route === "sessions" && (e.sessionQuery || (document.activeElement && document.activeElement.id === "sessionSearch"))) {
      e.sessionQuery = "";
      const input = t.querySelector("#sessionSearch");
      if (input) { input.value = ""; input.blur(); }
      const body = t.querySelector("#sessionListBody");
      if (body) body.innerHTML = N();
      return;
    }
    if (!e.modelSheet && !e.connSheet) return;
    e.modelSheet = null;
    e.connSheet = null;
    closeSheetDom();
  });
  function openViewer(img) {
    const viewer = t.querySelector("#viewer"), track = t.querySelector("#viewerTrack"), count = t.querySelector("#viewerCount");
    if (!viewer || !track) return;
    // 作用域按「整条消息的气泡」收图：同一消息里被空行/文字拆开的孤图也能左右滑。
    const scope = img.closest(".v3attachments") || img.closest(".v3bubble") || img.closest(".chat-md-gallery") || img;
    const all = (scope ? [...scope.querySelectorAll("img")] : [img]).filter((x) => x && (x.dataset.full || x.src));
    if (!all.length) return;
    const index = Math.max(0, all.indexOf(img));
    track.innerHTML = all.map((x) => `<div class="v3viewer-page"><img src="${b(x.dataset.full || x.src)}" alt=""></div>`).join("");
    viewer.hidden = !1;
    viewerReset();
    if (count) {
      count.hidden = all.length < 2;
      count.textContent = `${index + 1} / ${all.length}`;
    }
    const sync = () => {
      if (!count || all.length < 2) return;
      const i = Math.max(0, Math.min(all.length - 1, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
      count.textContent = `${i + 1} / ${all.length}`;
    };
    track.removeEventListener("scroll", sync);
    track.addEventListener("scroll", sync, { passive: !0 });
    track.scrollLeft = index * track.clientWidth;
    requestAnimationFrame(() => {
      track.scrollLeft = index * track.clientWidth;
    });
  }
  let vz = { scale: 1, tx: 0, ty: 0, base: 1, dist: 0, sx: 0, sy: 0 };
  function viewerCurrentImg() {
    const track = t.querySelector("#viewerTrack");
    if (!track) return null;
    const pages = track.querySelectorAll(".v3viewer-page img");
    if (!pages.length) return null;
    const i = Math.max(0, Math.min(pages.length - 1, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    return pages[i];
  }
  // 缩放/平移只作用在舞台里的当前图：舞台 overflow:hidden，控件在舞台外，永远不会压住按钮。
  function viewerApply() {
    const img = viewerCurrentImg(), track = t.querySelector("#viewerTrack");
    if (img) img.style.transform = vz.scale === 1 && !vz.tx && !vz.ty ? "" : `translate(${vz.tx}px, ${vz.ty}px) scale(${vz.scale})`;
    if (track) track.style.overflowX = vz.scale > 1 ? "hidden" : "auto";
  }
  function viewerReset() {
    vz.scale = 1, vz.tx = 0, vz.ty = 0, viewerApply();
  }
  function viewerTouchStart(ev) {
    const viewer = t.querySelector("#viewer");
    if (!viewer || viewer.hidden) return;
    if (ev.touches.length === 2) {
      const a = ev.touches[0], b = ev.touches[1];
      vz.base = vz.scale;
      vz.dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
      ev.preventDefault();
    } else if (ev.touches.length === 1 && vz.scale > 1) {
      vz.sx = ev.touches[0].clientX, vz.sy = ev.touches[0].clientY;
      ev.preventDefault();
    }
  }
  function viewerTouchMove(ev) {
    const viewer = t.querySelector("#viewer");
    if (!viewer || viewer.hidden) return;
    if (ev.touches.length === 2 && vz.dist) {
      const a = ev.touches[0], b = ev.touches[1];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
      vz.scale = clampViewerScale(vz.base * d / vz.dist);
      ev.preventDefault(), viewerApply();
      return;
    }
    if (ev.touches.length === 1 && vz.scale > 1) {
      const x = ev.touches[0].clientX, y = ev.touches[0].clientY;
      const img = viewerCurrentImg();
      const w = img ? img.clientWidth : 0, hh = img ? img.clientHeight : 0;
      const maxX = Math.max(0, (w * vz.scale - w) / 2), maxY = Math.max(0, (hh * vz.scale - hh) / 2);
      vz.tx = Math.min(maxX, Math.max(-maxX, vz.tx + (x - vz.sx)));
      vz.ty = Math.min(maxY, Math.max(-maxY, vz.ty + (y - vz.sy)));
      vz.sx = x, vz.sy = y;
      ev.preventDefault(), viewerApply();
    }
  }
  function viewerTouchEnd() {
    if (vz.scale <= 1.05) viewerReset();
  }
  async function saveCurrentImage() {
    const track = t.querySelector("#viewerTrack");
    if (!track) return;
    const pages = [...track.querySelectorAll(".v3viewer-page img")];
    if (!pages.length) return;
    const i = Math.max(0, Math.min(pages.length - 1, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    const img = pages[i];
    if (!img || !img.src) return;
    try {
      const blob = await (await fetch(img.src)).blob();
      const type = blob.type || "image/jpeg";
      const ext = /png/.test(type) ? "png" : /webp/.test(type) ? "webp" : /gif/.test(type) ? "gif" : "jpg";
      const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
      const name = "dsh-" + stamp + "." + ext;
      if (n && typeof n.saveImage === "function") {
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || "").replace(/^data:[^;]+;base64,/, ""));
          reader.onerror = () => reject(reader.error || new Error("读取图片失败"));
          reader.readAsDataURL(blob);
        });
        await n.saveImage(data, name, type);
      } else if (n && typeof n.download === "function") {
        await n.download(img.src, name);
      } else {
        throw new Error("当前壳没有保存能力");
      }
      U("已保存到 Downloads/Docklet");
    } catch (error) {
      U("保存失败：" + (error && error.message || "未知错误"));
    }
  }
  function W() {
    // 连接状态只更新到 .v3sub，不能把整块 chip 塞进 #connState（会嵌套、出现两个圆点）。
    syncChatHeader(), Y();
  }
  function isConfigured() {
    return !e.forceSetup && !!e.token && !!e.session;
  }
  function trackKeyboard() {
    if (e.keyboardTracked) return;
    e.keyboardTracked = !0;
    const vv = window.visualViewport;
    if (vv) {
      const sync = () => {
        e.keyboardOpen = vv.height + 120 < window.innerHeight;
      };
      vv.addEventListener("resize", sync, { passive: !0 });
      sync();
    }
    t.addEventListener("focusin", (ev) => {
      if (ev.target && ev.target.id === "text") {
        e.keyboardOpen = !0;
        e.stickBottom = !0, e.pinBottom = !0;
        requestAnimationFrame(() => scrollChatToBottomForIme(true));
      }
    });
  }
  function $() {
    trackKeyboard();
    if (!e.client) {
      if (isConfigured()) {
        renderSig = "", t.innerHTML = '<div class="v3ui"><div class="v3loading"><span class="v3spin"></span>连接中…</div></div>';
        return;
      }
      // Not configured yet: land on the settings page, where the address and
      // token fields live, instead of a separate connect card.
      e.route = "settings", e.openSection = "", Te();
      return;
    }
    if (!e.state) {
      renderSig = "", t.innerHTML = '<div class="v3ui"><div class="v3loading"><span class="v3spin"></span>连接中…</div></div>';
      return;
    }
    if (e.route === "sessions") return ie();
    if (e.route === "archived") return archivePage();
    if (e.route === "actions") return we();
    if (e.route === "settings") return Te();
    if (e.route === "profile") return Me();
    if (e.route === "create") return q();
    const ended = !!(e.state && e.state.stream && e.state.stream.ended);
    const wasEnded = e.streamEnded;
    e.streamEnded = ended;
    const i = t.querySelector("#list"), p = !i || i.scrollHeight - i.scrollTop - i.clientHeight < 90;
    p && (e.stickBottom = !0);
    const g = t.querySelector("#text"), v = shouldRestoreFocus(document, g, e.keyboardOpen), h = g ? g.selectionStart : 0, f = g ? g.selectionEnd : 0, k = gt(e.state).length, L = mt(e.state).filter((S) => S.status === "pending").length;
    i && !p && k > e.lastMessageCount && (e.unread += k - e.lastMessageCount), i && !p && L > e.lastPromptCount && (e.unread += L - e.lastPromptCount), p && (e.unread = 0), e.lastMessageCount = k, e.lastPromptCount = L;
    const z = i ? i.scrollTop : 0, ce = i ? i.getBoundingClientRect() : null;
    let oe = null;
    if (i && !p && !e.stickBottom && ce)
      for (const S of i.querySelectorAll(".v3row[data-mid]")) {
        const A = S.getBoundingClientRect();
        if (A.bottom > ce.top + 1) {
          oe = { id: S.dataset.mid, offset: A.top - ce.top };
          break;
        }
      }
    if (renderChatUpdate()) {
      renderSig = chatSig();
      return;
    }
    (window.__v3Stats || (window.__v3Stats = { fast: 0, full: 0 })).full += 1;
    const previousList = t.querySelector("#list");
    const previousScroll = previousList ? previousList.scrollTop : 0;
    t.innerHTML = he();
    lastComposerSig = composerSig();
    applyFoldState(t);
    lastRowSigs = gt(e.state).map(messageSig);
    lastViewTurns = Number(e.viewTurns) || 5;
    const freshList = t.querySelector("#list");
    if (freshList) freshList.scrollTop = previousScroll;
    const T = t.querySelector("#list");
    renderSig = chatSig();
    paintWorking();
    observeChat();
    const Le = () => {
      if (T) {
        if (e.restoreScroll !== null) {
          T.scrollTop = Math.max(0, Number(e.restoreScroll) || 0);
          e.restoreScroll = null;
          return;
        }
        if (e.anchorOlder) {
          T.scrollTop = e.anchorOlder.top + (T.scrollHeight - e.anchorOlder.height), e.anchorOlder = null;
          return;
        }
        if (oe) {
          const S = [...T.querySelectorAll(".v3row[data-mid]")].find((A) => A.dataset.mid === oe.id);
          if (S) {
            T.scrollTop += S.getBoundingClientRect().top - T.getBoundingClientRect().top - oe.offset;
            return;
          }
        }
        T.scrollTop = p || e.stickBottom || e.pinBottom ? T.scrollHeight : z;
      }
    };
    Le(), T && requestAnimationFrame(Le), Y();
    updateToTop();
    if (ended && !wasEnded && T && (e.stickBottom || e.pinBottom) && Date.now() - e.lastUserActionAt > 800)
      requestAnimationFrame(() => {
        T.scrollTop = T.scrollHeight;
      });
    const loadOlderPage = async () => {
      if (!T || !e.client || e.loadingOlder || !(e.state && e.state.sync && e.state.sync.hasMore) || (e.state.sync && e.state.sync.limitReached) || e.olderLimit) return;
      e.loadingOlder = !0;
      e.lastOlderLoad = Date.now();
      e.autoOlderBlocked = !0;
      const sentinel = t.querySelector("#olderSentinel");
      if (sentinel) sentinel.hidden = !1;
      e.anchorOlder = { height: T.scrollHeight, top: T.scrollTop };
      e.viewTurns = (Number(e.viewTurns) || 5) + 5;
      try {
        await e.client.loadOlder();
      } catch {
        e.anchorOlder = null;
      } finally {
        const users = e.state && Array.isArray(e.state.messages)
          ? e.state.messages.filter((item) => item.role === "user").length
          : 0;
        if (users >= 30 || (e.state && e.state.sync && e.state.sync.limitReached)) {
          e.olderLimit = !0;
        }
        e.loadingOlder = !1;
        Ue();
        const current = t.querySelector("#olderSentinel");
        if (current) current.hidden = !0;
      }
    };
    const te = t.querySelector("#ptr");
    if (te && T) {
      let S = null, A = 0;
      const P = () => {
        S = null, A = 0, te.style.height = "0px";
        te.textContent = "";
      };
      T.addEventListener(
        "touchstart",
        (_) => {
          const canPull = !!(e.state && e.state.sync && e.state.sync.hasMore && !e.state.sync.limitReached && !e.olderLimit);
          canPull && T.scrollTop <= 0 && _.touches.length === 1 && (S = _.touches[0].clientY);
        },
        { passive: !0 }
      ), T.addEventListener(
        "touchmove",
        (_) => {
          if (S == null) return;
          const me = _.touches[0].clientY - S;
          const more = e.state && e.state.sync && e.state.sync.hasMore && !e.state.sync.limitReached && !e.olderLimit;
          if (!more) return;
          A = Math.max(0, Math.min(64, me * 0.45)), te.style.height = A + "px", te.textContent = "";
        },
        { passive: !0 }
      ), T.addEventListener("touchend", async () => {
        if (A < 45) {
          P();
          return;
        }
        const more = e.state && e.state.sync && e.state.sync.hasMore && !e.state.sync.limitReached && !e.olderLimit;
        if (!more) {
          P();
          return;
        }
        te.textContent = "";
        te.style.height = "32px";
        await loadOlderPage();
        window.setTimeout(P, 900);
      });
    }
    const sendBtn = t.querySelector("#send");
    sendBtn && (sendBtn.onclick = () => {
      const st = e.state;
      st && (e.turnActive || Jt(st)) ? Dt() : Ze();
    });
    if (!e.viewerTouch) {
      e.viewerTouch = !0;
      t.addEventListener("touchstart", viewerTouchStart, { passive: !1 });
      t.addEventListener("touchmove", viewerTouchMove, { passive: !1 });
      t.addEventListener("touchend", viewerTouchEnd, { passive: !0 });
      t.addEventListener("touchcancel", viewerTouchEnd, { passive: !0 });
    }
    const Se = t.querySelector("#pickAttachment");
    Se && (Se.onclick = () => t.querySelector("#attachmentFile").click());
    const ke = t.querySelector("#attachmentFile");
    ke && (ke.onchange = (S) => {
      const A = [...S.target.files || []];
      S.target.value = "", Et(A);
    });
    for (const S of t.querySelectorAll("[data-remove-attach]"))
      S.onclick = () => {
        const removed = e.attachments.splice(Number(S.dataset.removeAttach), 1)[0];
        releaseAttachment(removed), $();
      };
    const je = t.querySelector("#settings");
    je && (je.onclick = () => H("settings"));
    const le = t.querySelector("#closeSettings");
    le && (le.onclick = () => {
      e.showSettings = !1, $();
    });
    const Ee = t.querySelector("#closeCreate");
    Ee && (Ee.onclick = () => {
      e.showCreate = !1, $();
    });
    const de = (S, A, P = "change") => {
      const _ = t.querySelector(S);
      _ && _.addEventListener(P, () => {
        e.createDraft[A] = _.value;
      });
    };
    de("#createTitle", "title", "input"), de("#createPreset", "preset"), de("#createPermission", "permission"), de("#createModel", "model");
    const x = t.querySelector("#createConfirm");
    x && (x.onclick = Z), le && (le.onclick = () => {
      e.showSettings = !1, $();
    });
    const M = t.querySelector("#settingsResync");
    M && (M.onclick = () => {
      e.showSettings = !1, e.client.resnapshot("settings"), $();
    });
    const j = t.querySelector("#copySession");
    j && (j.onclick = async () => {
      const S = qe(e.state), A = S && S.id || e.session || "";
      try {
        await navigator.clipboard.writeText(A);
      } catch {
        U("复制失败");
      }
    });
    const E = t.querySelector("#settingsDisconnect");
    E && (E.onclick = () => {
      e.showSettings = !1, Ke();
    });
    const R = t.querySelector("#retryError");
    R && (R.onclick = () => {
      e.error = "", e.client.resnapshot("retry"), $();
    });
    const X = t.querySelector("#offlineRetry");
    X && (X.onclick = () => {
      e.client.resnapshot("offline"), rediscover("offline");
    });
    const $e = t.querySelector("#sessionList");
    $e && ($e.onclick = () => H("sessions"));
    const pe = t.querySelector("#sessionSearch");
    pe && (pe.oninput = () => {
      e.sessionQuery = pe.value;
      const S = t.querySelector("#sessionListBody");
      S && (S.innerHTML = N());
    });
    const ue = t.querySelector("#newSession");
    ue && (ue.onclick = () => {
      e.showCreate = !0, e.showSessions = !1, $(), se();
    });
    const ge = t.querySelector("#closeSessions");
    ge && (ge.onclick = () => {
      e.showSessions = !1, $();
    });
    const De = t.querySelector("#sessionListBody");
    De && (De.onclick = (S) => {
      const A = S.target.closest(".v3session-more");
      if (A) {
        e.sessionMenu = { id: A.dataset.session, title: A.dataset.title || "" }, H("actions");
        return;
      }
      const P = S.target.closest(".v3session");
      P && Pe(P.dataset.session);
    });
    const st = t.querySelector("#closeSessionMenu");
    st && (st.onclick = () => {
      e.sessionMenu = null, $();
    });
    const it = t.querySelector("#sessionRenameSave");
    it && (it.onclick = async () => {
      const S = t.querySelector("#sessionRenameInput"), A = String(S && S.value || "").trim();
      if (!(!A || !e.sessionMenu))
        try {
          await e.client.renameSession(e.sessionMenu.id, A), e.sessionMenu = null, e.showSessions = !1, await Ce();
        } catch (P) {
          e.error = "重命名失败：" + (P && P.message || "网络错误"), $();
        }
    });
    const ct = t.querySelector("#sessionArchive");
    ct && (ct.onclick = async () => {
      if (e.sessionMenu)
        try {
          await e.client.archiveSession(e.sessionMenu.id), e.sessionMenu = null, e.showSessions = !1, await Ce();
        } catch (S) {
          e.error = "归档失败：" + (S && S.message || "网络错误"), $();
        }
    });
    const Be = t.querySelector("#jump"), lt = t.querySelector(".v3head");
    if (Be && T) {
      T.addEventListener("touchstart", () => { e.lastUserActionAt = Date.now(); e.pinBottom = !1; }, { passive: !0 });
      T.addEventListener("touchmove", () => { e.lastUserActionAt = Date.now(); e.pinBottom = !1; }, { passive: !0 });
      T.addEventListener("wheel", () => { e.lastUserActionAt = Date.now(); e.pinBottom = !1; }, { passive: !0 });
      T.addEventListener("pointerdown", () => { e.lastUserActionAt = Date.now(); e.pinBottom = !1; }, { passive: !0 });
      const S = () => {
        const A = T.scrollHeight - T.scrollTop - T.clientHeight < 120;
        e.stickBottom = A;
        const sid = String(e.session || "");
        if (sid) e.scrollMemory = { ...(e.scrollMemory || {}), [sid]: { top: T.scrollTop, nearBottom: A } };
        Be.classList.toggle("show", !A), lt && lt.classList.toggle("scrolled", T.scrollTop > 4), A && e.unread && (e.unread = 0, Be.textContent = "↓");
        if (T.scrollTop < 80) {
          const loadedUsers = gt(e.state).filter((m) => m.role === "user").length;
          const recentlyTouched = Date.now() - (Number(e.lastUserActionAt) || 0) < 1500;
          if (recentlyTouched && !e.loadingOlder && e.viewTurns < loadedUsers) {
            e.viewTurns = Math.min(loadedUsers, e.viewTurns + 5);
            e.anchorOlder = { height: T.scrollHeight, top: T.scrollTop };
            $();
            return;
          }
          if (!e.autoOlderBlocked && !e.loadingOlder && Date.now() - e.lastOlderLoad > 1200) {
            e.autoOlderBlocked = !0;
            loadOlderPage();
          }
        } else if (T.scrollTop > 200) {
          e.autoOlderBlocked = !1;
        }
        if (A && e.viewTurns > 5 && !e.loadingOlder && Date.now() - (e.lastTrimAt || 0) > 700) {
          e.lastTrimAt = Date.now();
          e.viewTurns = 5;
          e.stickBottom = !0;
          $();
          return;
        }
      };
      T.addEventListener("scroll", S, { passive: !0 }), Be.onclick = () => {
        e.unread = 0, T.scrollTo({ top: T.scrollHeight, behavior: "smooth" });
      }, S();
    }
    const fe = t.querySelector("#text");
    if (fe) {
      const S = () => {
        fe.style.height = "auto", fe.style.height = Math.min(120, fe.scrollHeight) + "px";
      };
      if (fe.addEventListener("input", () => {
        e.draft = fe.value, S(), persistDraft(fe.value);
        if (e.stickBottom) {
          const list = t.querySelector("#list");
          list && (list.scrollTop = list.scrollHeight);
        }
      }), S(), v) {
        fe.focus();
        try {
          fe.setSelectionRange(h, f);
        } catch {
        }
      }
    }
    t.querySelector("#text").addEventListener("keydown", (S) => {
      S.key === "Enter" && !S.shiftKey && (S.preventDefault(), Ze());
    }), t.querySelector("#prompts").onclick = Ut, Ue();
  }
  // Blob URLs for message images live for the whole module session, so a long
  // conversation would keep every decoded image in memory. Keep the newest
  // IMAGE_CACHE_LIMIT entries and revoke the rest, but never revoke a blob an
  // <img> is still showing (evicting it would blank a visible picture).
  const IMAGE_CACHE_LIMIT = 24;
  function pruneImageCache(cache, limit, isLive) {
    if (!cache || !limit) return;
    for (const [key, url] of cache) {
      if (cache.size <= limit) return;
      if (isLive && isLive(url)) continue;
      cache.delete(key);
      try {
        URL.revokeObjectURL(url);
      } catch (_) {
        /* already revoked */
      }
    }
  }
  function imageStillOnScreen(url) {
    for (const img of document.images) if (img.src === url) return true;
    return false;
  }
  function Ue() {
    if (!e.client) return;
    const s = (img) => {
      const i = t.querySelector("#list");
      i && (e.stickBottom || e.pinBottom || i.scrollHeight - i.scrollTop - i.clientHeight < 140) && (i.scrollTop = i.scrollHeight);
      img && img.closest && updateToTop(img.closest(".v3row"));
    }, o = async (i, p) => {
      if (!p || i.dataset.loading === "1" || i.dataset.failed === "1") return;
      if (i.getAttribute("src")) return;
      if (r.has(p)) {
        const cached = r.get(p);
        r.delete(p), r.set(p, cached);
        i.onload = () => s(i), i.src = cached, s(i);
        return;
      }
      i.dataset.loading = "1";
      try {
        const g = await fetch(p);
        if (!g.ok) throw new Error(String(g.status));
        const v = await g.blob(), h = URL.createObjectURL(v);
        r.set(p, h), i.onload = () => s(i), i.src = h, s(i), pruneImageCache(r, IMAGE_CACHE_LIMIT, imageStillOnScreen);
        delete i.dataset.loading, delete i.dataset.retries;
      } catch {
        delete i.dataset.loading;
        // 首屏那一轮经常赶在连接就绪之前，失败不能定稿：有界重试，之后靠
        // 切前台/加载更早/切会话再补跑。
        const tried = Number(i.dataset.retries || "0") + 1;
        i.dataset.retries = String(tried);
        if (tried >= 3) {
          i.dataset.failed = "1", i.alt = "图片加载失败", i.title = p;
        } else {
          window.setTimeout(() => e.client && Ue(), 900 * tried);
        }
      }
    };
    for (const i of t.querySelectorAll("img.chat-md-image[data-workspace]")) {
      const p = i.getAttribute("data-workspace") || "";
      o(i, p ? e.client.workspaceUrl(p) : "");
    }
    for (const i of t.querySelectorAll("img.chat-md-image[data-remote]"))
      o(i, i.getAttribute("data-remote") || "");
    for (const i of t.querySelectorAll("img[data-image-id]"))
      o(i, e.client.imageUrl(i.getAttribute("data-image-id")));
    for (const i of t.querySelectorAll("img[data-thumb-url]"))
      o(i, i.getAttribute("data-thumb-url") || "");
  }
  function retryImages() {
    for (const img of t.querySelectorAll("img[data-failed]")) {
      delete img.dataset.failed;
      delete img.dataset.retries;
    }
    Ue();
  }
  async function Ce() {
    if (!e.client) return;
    const s = e.client;
    // 有缓存就先渲染缓存，不再整页显示「加载中」。
    e.sessionsLoading = !e.sessions.length, $();
    try {
      const o = await s.listSessions();
      if (e.client !== s) return;
      const list = Array.isArray(o) ? o : o && Array.isArray(o.sessions) ? o.sessions : [];
      e.sessions = list, e.archivedSessions = Array.isArray(o && o.archived) ? o.archived : [], e.error = "", saveSessionCache(list);
    } catch (o) {
      if (e.client !== s) return;
      e.sessions.length || (e.error = "会话列表失败：" + (o && o.message || "网络错误"));
    } finally {
      e.client === s && (e.sessionsLoading = !1, $());
    }
  }
  // 连接状态：attempt 用来区分「还在首次连接」和「已经失败过」，
  // 后者且没有缓存时才在对话里给离线提示，避免正常连上时闪一下。
  function onStatusUpdate(i) {
    const attempt = Number(i && i.attempt) || 0;
    // 切会话会新建连接，WAN 下首帧 connecting 要几百毫秒；这段瞬态不显示重连中。
    if (!i.connected && !e.offline && attempt === 0 && e.switchingUntil > Date.now()) return;
    if (i.connected) e.switchingUntil = 0, e.lastBeatAt = Date.now(), measurePing();
    const was = e.connected;
    e.connected = !!(i && i.connected);
    if (was && !e.connected) {
      e.connLostAt = Date.now();
      U(connectionHintText(), "dark");
    } else if (!was && e.connected && e.connLostAt) {
      e.connLostAt = 0;
      dismissBanner(connectionHintText());
      U("连接已恢复");
    }
    if (!e.connected) e.pendingTurn = false;
    e.attempt = e.connected ? 0 : Math.max(e.attempt || 0, attempt);
    e.connected ? (e.error = "", e.connReason = "", K()) : window.setTimeout(() => {
      e.client && !e.connected && rediscover("lost");
    }, 1200);
    e.route === "chat" && (W(), d());
    // 连接状态变了才整页重绘：输入框的禁用/占位、页头呼吸灯都要跟着变。
    if (was !== e.connected && e.route === "chat") {
      const hadFocus = document.activeElement && document.activeElement.id === "text";
      e.offlineHint = !e.connected && (e.offline || navigator.onLine === false || e.attempt > 0);
      $();
      if (hadFocus && e.connected && e.keyboardOpen !== !1) {
        const el = t.querySelector("#text");
        el && el.focus();
      }
      return;
    }
    // 空对话的提示只在「该显示/不该显示」切换时重渲染一次，避免每次重试都刷新。
    if (e.route === "chat" && !gt(e.state || {}).length) {
      const hint = !e.connected && (e.offline || navigator.onLine === false || e.attempt > 0);
      if (hint !== e.offlineHint) e.offlineHint = hint, $();
    }
  }
  function applySessionTitle(id) {
    if (!e.state) return;
    const title = sessionTitleOf(id);
    if (!title) return;
    if (!e.state.session) e.state.session = { id: String(id), title: "" };
    if (!e.state.session.title) e.state.session.title = title;
  }
  function sessionDraft(id) {
    try {
      return localStorage.getItem("v3.draft." + String(id || "")) || "";
    } catch (error) {
      return "";
    }
  }
  let draftTimer = 0;
  function persistDraft(value) {
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(() => {
      try {
        const id = String(e.session || "");
        if (!id) return;
        if (String(value || "").trim()) localStorage.setItem("v3.draft." + id, value);
        else localStorage.removeItem("v3.draft." + id);
      } catch (error) {
      }
    }, 250);
  }
  function scrollRestoreTarget(saved) {
    const top = Number(saved && saved.top) || 0;
    return saved && !saved.nearBottom && top > 0 ? top : null;
  }
  function Pe(s) {
    const o = String(s || "");
    if (!o) return;
    e.session = o, localStorage.setItem("v3.session", o), e.showSessions = !1, e.route = "chat", syncActiveSession();
    e.state = We(o) || emptySessionState(o);
    e.stopNoteSig = "";
    applySessionTitle(o), e.attempt = 0;
    e.turnActive = !1, e.pendingTurn = !1, e.turnEnded = !1, e.draft = sessionDraft(o), e.olderLimit = !1, e.autoOlderBlocked = !1;
    e.viewTurns = 5, e.restoreScroll = scrollRestoreTarget((e.scrollMemory || {})[o]), e.stickBottom = e.restoreScroll === null, e.pinBottom = e.restoreScroll === null, e.anchorOlder = null, e.unread = 0, e.lastMessageCount = 0, e.lastPromptCount = 0, e.switchingUntil = Date.now() + 6e3, e.lastBeatAt = Date.now();
    // 先画出来：有缓存就是缓存，没有就是空态；离线时根本不用建连接。
    $();
    if (e.offline && !e.connected) return;
    e.unsubscribe && e.unsubscribe(), e.unstatus && e.unstatus(), e.client && e.client.stop();
    e.client = Ye({
      baseUrl: e.base,
      token: e.token,
      sessionId: o,
      onPing() {
        e.lastSseAt = Date.now(), e.lastBeatAt = Date.now(), e.switchingUntil = 0;
      }
    }), e.unsubscribe = e.client.subscribe((i) => {
      e.lastSseAt = Date.now(), clearPendingTurnFor(i), e.lastBeatAt = Date.now(), e.state = Ve(e.state, i), applyTurnEvent(i), noteStops(e.state), rememberModelLabel(), _e(e.state), e.route === "chat" && d();
    }), e.unstatus = e.client.onStatus(onStatusUpdate), e.client.start(), Ue(), measurePing();
  }
  const sessionWatch = { seeded: false, running: new Map(), prompts: new Set(), timer: 0 };
  async function checkSessionPending(id, title, headers) {
    try {
      const snap = await (await fetch(e.base + "/snapshot?session=" + encodeURIComponent(id) + "&turns=1", { headers })).json();
      const pending = snap && snap.pending || {};
      const items = [];
      for (const item of pending.approvals || []) items.push({ key: "approval:" + String(item && (item.id || item.approvalId) || ""), label: "审批" });
      for (const item of pending.inputs || []) items.push({ key: "input:" + String(item && (item.id || item.callId) || ""), label: "问答" });
      for (const item of items) {
        if (!item.key || sessionWatch.prompts.has(id + item.key)) continue;
        sessionWatch.prompts.add(id + item.key);
        U({ title: title || "对话", status: "需要" + item.label }, "info", () => Pe(id));
      }
    } catch (_) {
    }
  }
  async function checkSessionStopped(item, headers) {
    let status = "执行完成";
    let kind = "info";
    try {
      const snap = await (await fetch(e.base + "/snapshot?session=" + encodeURIComponent(item.id) + "&turns=1", { headers })).json();
      const err = snap && snap.session && snap.session.lastTurnError || "";
      const act = String(snap && snap.activity && snap.activity.status || "");
      if (err || act === "error") {
        status = /interrupt|stop|cancel|abort|中止|停止/i.test(String(err)) ? "已停止" : "执行异常";
        kind = "error";
      }
    } catch (_) {
    }
    U({ title: item.title || "对话", status }, kind, () => Pe(item.id));
  }
  async function pollSessionWatch() {
    if (!e.connected || document.hidden || !e.base) return;
    try {
      const headers = { Authorization: "Bearer " + e.token };
      const res = await fetch(e.base + "/sessions", { headers });
      const data = await res.json();
      const list = Array.isArray(data && data.sessions) ? data.sessions : [];
      for (const item of list) {
        if (!item || !item.id || item.id === e.session) continue;
        const was = sessionWatch.running.get(item.id);
        if (sessionWatch.seeded && was === true && item.running === false) {
          checkSessionStopped(item, headers);
        }
        sessionWatch.running.set(item.id, !!item.running);
        if (item.running) checkSessionPending(item.id, item.title, headers);
      }
      sessionWatch.seeded = true;
    } catch (_) {
    }
  }
  function startSessionWatch() {
    if (sessionWatch.timer) return;
    sessionWatch.timer = window.setInterval(pollSessionWatch, 7000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) pollSessionWatch();
    });
  }
  window.__dockletSwitchSession = Pe;
  // Shell back gesture: handle in-app layers first, only then let the shell close
  // the module. The signature guard is what keeps an unconfigured (or otherwise
  // stuck) screen from swallowing back forever: if the handler ran but nothing
  // visible changed, we tell the shell to close the module.
  function backSignature() {
    const viewer = t.querySelector("#viewer");
    const openViewer = viewer && !viewer.hidden ? "viewer" : "";
    const sheet = e.modelSheet || e.connSheet ? "sheet" : "";
    const search = e.sessionQuery
      || (document.activeElement && document.activeElement.id === "sessionSearch")
      ? "search"
      : "";
    return [e.route || "", openViewer, sheet, search].join("|");
  }
  window.__dockletBack = () => {
    const before = backSignature();
    const viewer = t.querySelector("#viewer");
    if (viewer && !viewer.hidden) {
      viewer.hidden = true;
      const track = t.querySelector("#viewerTrack");
      if (track) track.innerHTML = "";
      try {
        viewerReset();
      } catch (_) {
      }
    } else if (e.modelSheet || e.connSheet) {
      dismissSheet();
    } else if (e.route === "sessions") {
      if (e.sessionQuery || (document.activeElement && document.activeElement.id === "sessionSearch")) {
        exitSessionSearch();
      } else {
        H("chat");
      }
    } else if (e.route === "actions" || e.route === "archived") {
      H("sessions");
    } else if (e.route !== "chat") {
      H("chat");
    }
    return backSignature() === before ? "exit" : "handled";
  };
  function H(s) {
    e.route = s, syncActiveSession(), s === "settings" && (e.profileDraft = { ...e.profile }), s === "chat" && (e.profileDraft = null, e.pinBottom = !0), s !== "sessions" && s !== "actions" && (e.sessionMenu = null), $(), s === "sessions" && Ce(), s === "create" && se();
  }
  function Ge() {
    const s = qe(e.state), o = s && s.id || e.session || "";
    e.unsubscribe && e.unsubscribe(), e.unstatus && e.unstatus(), e.client && e.client.stop(), e.client = null, e.state = null, e.connected = !1, e.attempt = 0, e.route = "chat", e.state = We(o) || (o ? emptySessionState(o) : null), applySessionTitle(o), e.client = Ye({
      baseUrl: e.base,
      token: e.token,
      sessionId: o,
      onPing() {
        e.lastSseAt = Date.now(), e.lastBeatAt = Date.now(), e.switchingUntil = 0;
      }
    }), e.unsubscribe = e.client.subscribe((i) => {
      e.lastSseAt = Date.now(), clearPendingTurnFor(i), e.lastBeatAt = Date.now(), e.state = Ve(e.state, i), applyTurnEvent(i), noteStops(e.state), rememberModelLabel(), _e(e.state), e.route === "chat" && d();
    }), e.unstatus = e.client.onStatus(onStatusUpdate), e.client.start(), $(), measurePing();
  }
  function Ke() {
    Q(), e.unsubscribe && e.unsubscribe(), e.unstatus && e.unstatus(), e.client && e.client.stop(), e.client = null, e.state = null, e.connected = !1, e.turnActive = !1, e.draft = "", e.error = "", e.sessions = [], e.sessionsLoading = !1, e.showSessions = !1, e.showSettings = !1, e.showCreate = !1, e.forceSetup = !0, $();
  }
  function normalizeBase(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const withScheme = /^https?:\/\//i.test(raw) ? raw : "http://" + raw;
    return withScheme.replace(/\/+$/, "");
  }
  function Re() {
    try {
      const s = t.querySelector("#base"), o = t.querySelector("#token"), typed = s && (s.value || s.getAttribute("value")), p = normalizeBase(typed || e.base || e.lanBase || re) || re, g = o && (o.value || o.getAttribute("value")) || e.token || "", v = String(g).trim(), h = localStorage.getItem("v3.session") || "";
      e.base = p, typed && (e.lanBase = p), e.token = v, e.session = h, e.error = "", e.connecting = !0, e.pinBottom = !0, e.forceSetup = !1;
      const f = h ? (We(h) || emptySessionState(h)) : null;
      f && (e.state = f, e.stopNoteSig = "", e.route = "chat"), applySessionTitle(h), e.attempt = 0;
      typed && localStorage.setItem("v3.lan", p), localStorage.setItem("v3.base", p), localStorage.setItem("v3.token", v), localStorage.setItem("v3.session", h), e.client = Ye({ baseUrl: p, token: v, sessionId: h }), e.connecting = !1, e.unsubscribe = e.client.subscribe((k) => {
        e.lastSseAt = Date.now(), clearPendingTurnFor(k), e.state = Ve(e.state, k), applyTurnEvent(k), noteStops(e.state), rememberModelLabel(), _e(e.state), e.route === "chat" && d();
      }), e.unstatus = e.client.onStatus(onStatusUpdate), e.client.start(), $();
    } catch (s) {
      e.connecting = !1, e.error = "连接失败：" + (s && s.message || String(s));
      e.client && e.client.stop(), e.client = null;
      // 只要令牌、会话、地址还在，就不要把用户踢回配置页：留在对话页显示错误。
      e.forceSetup = !(e.token && e.session && e.base);
      e.route = "chat", $();
    }
  }
  async function Qe(s, o) {
    const i = new AbortController(), p = window.setTimeout(() => i.abort(), o || 3e3);
    try {
      // 用 /sessions 而不是 /health：/health 不校验令牌，令牌失效时会被当成「地址可用」，
      // 导致在 LAN/WAN 之间来回切、每次 Ge() 整页重渲染，界面会像卡死。
      return (await fetch(String(s).replace(/\/+$/, "") + "/sessions", {
        headers: { Authorization: "Bearer " + e.token },
        signal: i.signal
      })).ok;
    } catch {
      return !1;
    } finally {
      window.clearTimeout(p);
    }
  }
  let He = !1, lastScan = 0, scanTimer = 0, switchTimer = 0;
  // 判断“和插件通不通”，而不是“手机有没有网”：
  // 心跳（relay 每 15s 一次）是主信号；20s 没有任何信号才探一次 /health。
  function connectionLooksStale() {
    if (!e.connected || document.hidden || !e.client || e.switchingUntil > Date.now()) return !1;
    return Date.now() - (Number(e.lastBeatAt) || 0) > 20e3;
  }
  // 断网/连不上只用一句话：分类越多越容易猜错（曾经手机没网却提示「有网，检查 relay」）。
  function connectionHintText() {
    return "连接已断开，检查网络和配置。";
  }
  // 壳的网络状态接口：第一层快速反馈（有没有网），插件是否可达仍由 /health 判断。
  function networkApi() {
    return n && n.network && typeof n.network.getState === "function" ? n.network : null;
  }
  function applyNetworkState(state) {
    if (!state) return;
    const online = state.online !== !1;
    e.netOnline = online;
    if (!online) {
      const wasOffline = e.connected;
      e.connReason = "net", e.connected = !1, e.lastBeatAt = 0;
      e.client && e.client.stop();
      if (wasOffline) {
        e.connLostAt = Date.now();
        U(connectionHintText(), "dark");
      }
      e.route === "chat" && $();
      return;
    }
    // 有网不代表插件可达：先探配置线路，探测期间不打断当前连接。
    e.client && rediscover("net-online");
  }
  async function refreshNetworkState() {
    const api = networkApi();
    if (!api) return;
    try {
      applyNetworkState(await api.getState());
    } catch (error) {
    }
  }
  async function checkConnectionFreshness(force) {
    if (e.switchingUntil > Date.now() || !e.client) return;
    if (!force && !connectionLooksStale()) return;
    const ok = await Qe(e.base, 2500);
    if (ok) {
      const sseGap = Date.now() - (Number(e.lastSseAt) || 0);
      e.lastBeatAt = Date.now(), e.connReason = "";
      if (!e.connected) {
        try {
          e.client.start();
        } catch (error) {
        }
      } else if (sseGap > 45000) {
        wdLog("sse-restart", { gap: sseGap });
        try {
          e.client.stop();
          e.client.start();
        } catch (error) {
        }
      }
      return;
    }
    if (!e.connected) return;
    e.connReason = typeof navigator !== "undefined" && navigator.onLine === !1 ? "net" : "relay";
    if (e.connected) {
      e.connLostAt = Date.now();
      U(connectionHintText(), "dark");
    }
    e.connected = !1, e.lastBeatAt = 0, e.client.stop();
    e.route === "chat" && $();
    window.setTimeout(() => e.client && rediscover("watchdog"), 800);
  }
  // 局域网优先：两个地址并行探，谁先能用选谁，但同时可达时 LAN 赢。
  async function pickBase() {
    // 用户显式选了家里/外部就只探那一条，不再“局域网优先”把人拽回去。
    if (e.connectMode === "lan") return e.lanBase && await Qe(e.lanBase, 1200) ? e.lanBase : "";
    if (e.connectMode === "wan") return e.wanBase && await Qe(e.wanBase, 2500) ? e.wanBase : "";
    const s = [[e.lanBase, 1200], [e.wanBase, 2500]].filter((x) => x[0]);
    if (!s.length) return "";
    const r = await Promise.all(s.map(([url, ms]) => Qe(url, ms)));
    for (let i = 0; i < s.length; i += 1) if (r[i]) return s[i][0];
    return "";
  }
  // 换网 / 回到前台 / 掉线后重扫地址；只有换了 base 才重建连接。
  async function rediscover(reason) {
    if (He || !e.token || !e.client) return !1;
    const now = Date.now();
    const wait = 1500 - (now - lastScan);
    if (wait > 0) {
      window.clearTimeout(scanTimer);
      scanTimer = window.setTimeout(() => {
        e.client && rediscover(reason);
      }, wait + 50);
      return !1;
    }
    lastScan = now;
    He = !0;
    try {
      // 切地址有成本（重建连接 + 整页重渲染）；两次至少隔 6 秒。
      // 冷却期内的触发排队重试，不能直接丢——否则回家要等 20s 定时器才切回 LAN。
      if (e.lastSwitchAt && Date.now() - e.lastSwitchAt < 6e3) {
        window.clearTimeout(switchTimer);
        switchTimer = window.setTimeout(() => {
          e.client && rediscover(reason);
        }, 6e3 - (Date.now() - e.lastSwitchAt) + 100);
        return !1;
      }
      const base = await pickBase();
      if (!base) {
        e.connReason = e.connectMode === "auto" ? "relay" : "line";
        return !1;
      }
      if (base === e.base) {
        if (!e.connected) {
          try {
            e.client.start();
          } catch (_) {
          }
        }
        return !1;
      }
      e.base = base, e.lastSwitchAt = Date.now(), e.lanBackHits = 0, localStorage.setItem("v3.base", base);
      U("已切换到" + (base === e.lanBase ? "家里" : "外部") + "网络"), Ge();
      return !0;
    } finally {
      He = !1;
    }
  }
  function minLoading(started, ms) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms - (Date.now() - started))));
  }
  function fitComposer(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(120, el.scrollHeight) + "px";
  }
  async function Ze() {
    const s = t.querySelector("#text"), o = s.value.trim();
    if (o || e.attachments.length) {
      if (e.uploading) {
        e.sendAfterUpload = true;
        syncSendButton();
        return;
      }
    }
    if (!(!o && !e.attachments.length || e.sending)) {
      e.sending = !0, e.turnActive = !0, e.turnEnded = !1, e.pendingTurn = !0, e.sendAt = Date.now(), e.wdRestarts = 0, e.state && (e.state = { ...e.state, stream: { text: "", reasoning: "", ended: !1 } }), s.value = "", e.draft = "", fitComposer(s);
      try {
        localStorage.removeItem("v3.draft." + String(e.session || ""));
      } catch (error) {
      }
      e.state && (e.state.turnError = null);
      const pendingId = "pending-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      let pending = null;
      if (e.state && o) {
        pending = {
          id: pendingId,
          role: "user",
          text: o,
          images: [],
          files: [],
          at: new Date().toISOString(),
          revision: Number.MAX_SAFE_INTEGER,
          optimistic: true
        };
        e.state = { ...e.state, messages: [...(Array.isArray(e.state.messages) ? e.state.messages : []), pending] };
      }
      if (pending) {
        // 只插入这一行并滚到底，不整页重绘，避免发送后闪一下。
        paintWorking();
        const listEl = t.querySelector("#list");
        const rowsEl = t.querySelector("#rows");
        const workingEl = rowsEl && rowsEl.querySelector("#working");
        const msgsEl = t.querySelector("#msgs");
        if (msgsEl) msgsEl.insertAdjacentHTML("beforeend", messageRowHtml(pending));
        else if (workingEl) workingEl.insertAdjacentHTML("beforebegin", messageRowHtml(pending));
        else if (rowsEl) rowsEl.insertAdjacentHTML("beforeend", messageRowHtml(pending));
        if (listEl) listEl.scrollTop = listEl.scrollHeight;
        lastRowSigs = gt(e.state).map(messageSig);
        syncSendButton();
      } else {
        paintWorking(), $();
      }
      const dropPending = () => {
        if (!(e.state && Array.isArray(e.state.messages))) return;
        e.state = { ...e.state, messages: e.state.messages.filter((m) => m.id !== pendingId) };
      };
      // 事件迟到时不要一直留着一个假的用户气泡。
      const pendingTimer = window.setTimeout(() => {
        if (e.state && Array.isArray(e.state.messages) && e.state.messages.some((m) => m.id === pendingId)) {
          dropPending();
          e.pendingTurn = false;
          e.client && e.client.resnapshot("pending");
          d();
        }
      }, 15000);
      try {
        await e.client.send({
          text: o,
          images: e.attachments.filter((i) => i.kind === "image").map((i) => i.attachment),
          files: e.attachments.filter((i) => i.kind !== "image").map((i) => i.attachment)
        }), e.attachments.forEach(releaseAttachment), e.attachments = [], e.error = "";
      } catch (i) {
        window.clearTimeout(pendingTimer);
        dropPending();
        e.error = "发送失败：" + (i && i.message || "网络错误"), e.draft = o, e.turnActive = !1, e.pendingTurn = !1, persistDraft(o), s.value = o, fitComposer(s);
      } finally {
        e.sending = !1, e.stickBottom = !0, d();
        requestAnimationFrame(() => requestAnimationFrame(() => scrollChatToBottomForIme()));
      }
    }
  }
  function shortFileName(name) {
    const raw = String(name || "");
    if (raw.length <= 32) return raw;
    const dot = raw.lastIndexOf(".");
    const ext = dot > 0 && raw.length - dot <= 8 ? raw.slice(dot) : "";
    const base = ext ? raw.slice(0, dot) : raw;
    const keep = Math.max(8, 32 - ext.length - 1);
    return base.slice(0, keep) + "…" + ext;
  }
  function xhrUpload(url, payload, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json");
      if (e.token) xhr.setRequestHeader("Authorization", "Bearer " + e.token);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) onProgress(event.loaded / event.total);
      };
      xhr.onload = () => {
        let data = null;
        try {
          data = JSON.parse(xhr.responseText || "{}");
        } catch (_) {
        }
        if (xhr.status >= 200 && xhr.status < 300 && data) resolve(data.attachment);
        else reject(new Error(data && data.error || "上传失败 " + xhr.status));
      };
      xhr.onerror = () => reject(new Error("网络错误"));
      xhr.send(JSON.stringify(payload));
    });
  }
  function updateAttachProgress(index, ratio) {
    const node = t.querySelector('[data-attach-progress="' + index + '"]');
    if (node) node.textContent = Math.round(ratio * 100) + "%";
  }
  function imageThumb(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const ratio = Math.min(1, 120 / Math.max(img.width || 1, img.height || 1));
          const w = Math.max(1, Math.round((img.width || 1) * ratio));
          const h = Math.max(1, Math.round((img.height || 1) * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        } catch (_) {
          resolve("");
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("");
      };
      img.src = url;
    });
  }
  function releaseAttachment(item) {
    if (item && item.full && String(item.full).startsWith("blob:")) {
      try {
        URL.revokeObjectURL(item.full);
      } catch (_) {
      }
    }
  }
  async function Et(s) {
    if (s.length) {
      e.uploading = !0;
      const started = [];
      for (const o of s) {
        const isImage = String(o.type || "").startsWith("image/");
        const item = {
          kind: isImage ? "image" : "file",
          name: o.name,
          uploading: true,
          progress: 0,
          thumb: isImage ? await imageThumb(o) : "",
          full: isImage ? URL.createObjectURL(o) : ""
        };
        e.attachments.push(item);
        started.push(item);
      }
      $();
      try {
        for (const item of started) {
          const o = s[started.indexOf(item)];
          const dataUrl = await new Promise((h, f) => {
            const k = new FileReader();
            k.onload = () => h(String(k.result || "")), k.onerror = () => f(k.error || new Error("读取文件失败")), k.readAsDataURL(o);
          });
          const data = dataUrl.slice(dataUrl.indexOf(",") + 1);
          const index = e.attachments.indexOf(item);
          const url = e.base + (item.kind === "image" ? "/upload-image" : "/upload-file");
          const payload = item.kind === "image" ? { data, mediaType: o.type, name: o.name } : { data, name: o.name };
          const attachment = await xhrUpload(url, payload, (ratio) => {
            item.progress = ratio;
            updateAttachProgress(index, ratio);
          });
          item.attachment = attachment;
          item.uploading = false;
          item.progress = 1;
          const chip = t.querySelector('[data-attach-index="' + index + '"]');
          if (chip) {
            chip.dataset.uploading = "0";
            const progress = chip.querySelector("[data-attach-progress]");
            if (progress) progress.remove();
          }
        }
        e.error = "";
      } catch (o) {
        const failed = started.find((item) => item.uploading);
        if (failed) {
          const index = e.attachments.indexOf(failed);
          if (index >= 0) e.attachments.splice(index, 1);
        }
        e.error = "上传失败：" + (o && o.message || "网络错误");
      } finally {
        e.uploading = !1;
        $();
        if (e.sendAfterUpload && e.attachments.length && !e.sending) {
          e.sendAfterUpload = false;
          Ze();
        }
      }
    }
  }
  async function Dt() {
    try {
      await e.client.interrupt(), e.error = "", e.turnActive = !1, e.pendingTurn = !1, e.localStopAt = Date.now();
    } catch (s) {
      e.error = "停止失败：" + (s && s.message || "网络错误");
    }
    $();
  }
  async function Ut(s) {
    var o;
    const i = s.target.closest("button[data-q-option]");
    if (i) {
      const v = i.closest("[data-q-options]");
      const was = i.getAttribute("aria-pressed") === "true";
      if (v && v.dataset.multi !== "1")
        for (const h of v.querySelectorAll("button[data-q-option]")) h.setAttribute("aria-pressed", "false");
      i.setAttribute("aria-pressed", was ? "false" : "true");
      return;
    }
    const p = s.target.closest("button[data-approve]");
    if (p) {
      const v = ((o = p.closest(".v3card")) == null ? void 0 : o.querySelectorAll("button")) || [];
      for (const h of v) h.disabled = !0;
      p.textContent = "处理中…";
      try {
        await e.client.approval({ id: p.dataset.id, allow: p.dataset.approve === "1" }), e.error = "";
        const prompt = mt(e.state).find((item) => String(item.id) === String(p.dataset.id)) || {};
        addAction({
          id: p.dataset.id,
          kind: "approval",
          decision: p.dataset.approve === "1" ? "allow" : "deny",
          title: prompt.title || "审批",
          tool: prompt.tool || "",
          reason: prompt.reason || ""
        });
      } catch (h) {
        e.error = "审批失败：" + (h && h.message || "网络错误");
      }
      $();
      return;
    }
    const skip = s.target.closest("button[data-respond-skip]");
    if (skip) {
      skip.disabled = !0;
      const promptId = String(skip.dataset.respondSkip || "");
      const prompt = mt(e.state).find((item) => String(item.id) === promptId) || {};
      try {
        // 协议里没有“拒绝回答”：不回答 = 结束本轮，但保留一张「未回答」卡片，
        // 不再生成“你已停止本轮”的停止记录。
        e.skipStopNote = !0;
        e.skipPromptId = promptId;
        await e.client.interrupt();
        if (e.state && e.state.prompts && Array.isArray(e.state.prompts.items))
          e.state.prompts.items = e.state.prompts.items.map((item) => String(item.id) === promptId ? { ...item, status: "resolved" } : item);
        const details = (prompt.questions || []).map((q) => ({
          question: q.question || q.header || q.id,
          answer: "未回答"
        }));
        addAction({
          id: promptId,
          kind: "question",
          decision: "unanswered",
          title: prompt.title || "需要回答",
          details,
          afterId: (e.state && Array.isArray(e.state.messages) && e.state.messages.length)
            ? e.state.messages[e.state.messages.length - 1].id
            : ""
        });
      } catch (x) {
        e.skipStopNote = !1;
        e.error = "结束失败：" + (x && x.message || "网络错误");
      }
      $();
      return;
    }
    const g = s.target.closest("button[data-respond]");
    if (g) {
      g.disabled = !0, g.textContent = "提交中…";
      const v = g.closest(".v3card"), h = /* @__PURE__ */ new Map();
      for (const k of v.querySelectorAll('button[data-q-option][aria-pressed="true"]')) {
        const L = k.dataset.qOption;
        h.has(L) || h.set(L, []), h.get(L).push(k.dataset.value);
      }
      const f = [
        ...[...h].map(([k, L]) => ({ id: k, selected: L })),
        ...[...v.querySelectorAll("input[data-q-custom]")].map((k) => ({
          id: k.dataset.qCustom,
          selected: [],
          custom: k.value.trim()
        }))
      ].filter((k) => k.selected.length || k.custom);
      if (!f.length) {
        U("请先选择或输入回答"), g.disabled = !1, g.textContent = "提交回答";
        return;
      }
      try {
        await e.client.respond({ id: g.dataset.respond, answers: f }), e.error = "";
        const prompt = mt(e.state).find((item) => String(item.id) === String(g.dataset.respond)) || {};
        const summary = f.map((item) => item.selected && item.selected.length ? item.selected.join("、") : item.custom).filter(Boolean).join("；");
        const details = (prompt.questions || []).map((q) => {
          const item = f.find((answer) => String(answer.id) === String(q.id)) || {};
          const value = item.selected && item.selected.length ? item.selected.join("、") : item.custom || "";
          return { question: q.question || q.header || q.id, answer: value };
        }).filter((item) => item.answer);
        addAction({
          id: g.dataset.respond,
          kind: "question",
          title: prompt.title || "问答",
          summary,
          details
        });
      } catch (k) {
        e.error = "回答失败：" + (k && k.message || "网络错误");
      }
      $();
    }
  }
  async function et(s, o) {
    try {
      if (!n || typeof n.download != "function")
        throw new Error("当前壳没有 download 能力");
      U("正在下载" + (o ? "：" + o : "…")), await n.download(s, o || ""), U("已开始下载" + (o ? "：" + o : "")), e.error = "";
    } catch (i) {
      e.error = "下载失败：" + (i && i.message || "网络错误"), $();
    }
  }
  function tt() {
    const s = t.querySelector("#viewer");
    if (s && !s.hidden) return s.hidden = !0, !0;
    // 没配置时 $() 会把路由固定在设置页，返回键会原地打转；这时交回壳关闭模块。
    if (!isConfigured()) return !1;
    return e.route === "profile" ? (H("settings"), !0) : e.route === "actions" || e.route === "create" || e.route === "archived" ? (H("sessions"), !0) : e.route === "sessions" || e.route === "settings" ? (H("chat"), !0) : !1;
  }
  if (window.docklet && typeof window.docklet.onBack === "function") {
    window.docklet.onBack(tt);
  }
  window.addEventListener("keydown", (s) => {
    s.key === "Escape" && tt() && s.preventDefault();
  }), document.addEventListener("visibilitychange", () => {
    // 回到前台才拉快照，且 30 秒内只拉一次：插件不支持 after，每次都是整段尾巴。
    syncActiveSession();
    if (document.visibilityState !== "visible" || !e.client) return;
    retryImages();
    if (Date.now() - (e.lastResnapshotAt || 0) < 30e3) return;
    e.lastResnapshotAt = Date.now(), e.client.resnapshot("visible");
  }), window.addEventListener("online", () => {
    e.offline = !1;
    if (!e.client) Re();
    else if (e.connected) rediscover("online");
    else e.client.start();
    W(), e.route === "chat" && $();
  }), window.addEventListener("offline", () => {
    // 手机没网不代表插件不可达（家里 Wi-Fi 没外网时 relay 还在局域网里）。
    e.offline = !0, e.connReason = "net", W(), e.route === "chat" && $();
    checkConnectionFreshness(!0);
  });
  let ve = null;
  t.addEventListener("pointerdown", (s) => {
    const o = t.querySelector("#viewer");
    if (o && !o.hidden) {
      ve = { x: s.clientX, y: s.clientY, type: "viewer" };
      return;
    }
    e.route !== "chat" && s.clientX <= 28 && (ve = { x: s.clientX, y: s.clientY, type: "sheet" });
  }), t.addEventListener("pointerup", (s) => {
    if (!ve) return;
    const o = s.clientX - ve.x, i = s.clientY - ve.y, p = ve;
    if (ve = null, p.type === "viewer" && i > 80 && Math.abs(i) > Math.abs(o)) {
      const g = t.querySelector("#viewer");
      g && (g.hidden = !0);
      return;
    }
    p.type === "sheet" && o > 70 && Math.abs(o) > Math.abs(i) && H(
      e.route === "create" || e.route === "actions" ? "sessions" : e.route === "profile" ? "settings" : "chat"
    );
  });
  let pendingBanners = [];
  document.addEventListener("visibilitychange", () => {
    if (document.hidden || !pendingBanners.length) return;
    const list = pendingBanners;
    pendingBanners = [];
    for (const item of list.slice(-2)) U(item[0], item[1]);
  });
  // 恢复连接时撤掉那条"已断开"横幅，避免一正一反同时挂在屏幕上。
  function dismissBanner(text) {
    const host = document.getElementById("v3banners");
    if (!host || !text) return;
    for (const node of [...host.children]) {
      if (node.dataset && node.dataset.text === text) node.remove();
    }
  }
  function U(s, kind, action) {
    const structured = typeof action === "function" && s && typeof s === "object";
    const title = structured ? String(s.title || "") : String(s == null ? "" : s);
    const status = structured ? String(s.status || "") : "";
    const text = structured ? title + (status ? " " + status : "") : title;
    if (document.hidden) {
      pendingBanners.push([text, kind]);
      if (pendingBanners.length > 10) pendingBanners.shift();
      return;
    }
    let host = document.getElementById("v3banners");
    if (!host) {
      host = document.createElement("div");
      host.id = "v3banners";
      host.className = "v3banners";
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    const legacy = t.querySelector("#toast");
    const dark = kind === "dark";
    const errorish = !dark && (kind === "error" || /失败|错误|不可用|超时|没开|不支持/.test(text));
    const ms = typeof action === "function" ? 8000 : errorish || dark ? 3500 : 2000;
    if (legacy) {
      legacy.textContent = text;
      legacy.hidden = !1;
      window.clearTimeout(legacy.__t);
      legacy.__t = window.setTimeout(() => {
        legacy.hidden = !0;
      }, ms);
    }
    if (!host) return;
    const header = t.querySelector(".v3head");
    if (header) host.style.top = Math.round(header.getBoundingClientRect().bottom + 30) + "px";
    for (const old of [...host.children]) {
      if (old.dataset && old.dataset.text === text) {
        window.clearTimeout(old.__timer);
        old.remove();
      }
    }
    const before = new Map([...host.children].map((el) => [el, el.getBoundingClientRect().top]));
    const node = document.createElement("div");
    node.className = "v3banner " + (dark ? "dark" : errorish ? "err" : "info") + (typeof action === "function" ? " action" : "");
    node.dataset.text = text;
    node.style.setProperty("--v3banner-ms", ms + "ms");
    node.innerHTML = '<button type="button" class="v3banner-x" aria-label="关闭">×</button><span class="v3banner-text' + (structured ? " two" : "") + '"></span><span class="v3banner-bar"></span>';
    const textEl = node.querySelector(".v3banner-text");
    if (structured) {
      textEl.innerHTML = '<span class="v3banner-title"></span><span class="v3banner-status"></span>';
      textEl.querySelector(".v3banner-title").textContent = title;
      textEl.querySelector(".v3banner-status").textContent = status;
    } else {
      textEl.textContent = text;
    }
    host.insertBefore(node, host.firstChild);
    const after = new Map([...host.children].map((el) => [el, el.getBoundingClientRect().top]));
    for (const [el, top] of before) {
      const now = after.get(el);
      if (now != null && Math.abs(now - top) > 0.5 && el.animate) {
        el.animate([{ transform: "translateY(" + (top - now) + "px)" }, { transform: "none" }], { duration: 180, easing: "ease-out" });
      }
    }
    while (host.children.length > 3) host.lastElementChild.remove();
    requestAnimationFrame(() => node.classList.add("show"));
    const close = (instant) => {
      if (node.dataset.closed) return;
      node.dataset.closed = "1";
      window.clearTimeout(node.__timer);
      if (instant) {
        node.remove();
        return;
      }
      node.classList.add("closing");
      window.setTimeout(() => node.remove(), 300);
    };
    node.querySelector(".v3banner-x").onclick = () => close(!0);
    if (typeof action === "function") {
      node.addEventListener("click", (event) => {
        if (event.target.closest(".v3banner-x")) return;
        close(!0);
        action();
      });
    }
    node.__timer = window.setTimeout(() => close(!1), ms);
  }
  let ne = 0, nt = 0, ot = 0;
  t.addEventListener("pointerdown", (s) => {
    if (s.target.closest("a,button,select,textarea,input")) return;
    const o = s.target.closest(".v3bubble");
    o && (nt = s.clientX, ot = s.clientY, window.clearTimeout(ne), ne = window.setTimeout(async () => {
      const i = o.innerText || "";
      if (i)
        try {
          await navigator.clipboard.writeText(i);
        } catch {
          U("复制失败");
        }
    }, 550));
  }), t.addEventListener("pointermove", (s) => {
    ne && (Math.abs(s.clientX - nt) > 10 || Math.abs(s.clientY - ot) > 10) && (window.clearTimeout(ne), ne = 0);
  }), t.addEventListener("pointerup", () => {
    window.clearTimeout(ne), ne = 0;
  }), t.addEventListener("pointercancel", () => {
    window.clearTimeout(ne), ne = 0;
  }), t.addEventListener("click", (event) => {
    const summary = event.target && event.target.closest && event.target.closest("summary");
    if (!summary) return;
    const list = t.querySelector("#list");
    if (!list) return;
    e.stickBottom = !1, e.pinBottom = !1;
    const before = summary.getBoundingClientRect().top;
    requestAnimationFrame(() => {
      const delta = summary.getBoundingClientRect().top - before;
      if (Math.abs(delta) > 0.5) list.scrollTop += delta;
      const fold = summary.parentElement;
      if (fold && fold.dataset && fold.dataset.fold) e.openFolds = { ...(e.openFolds || {}), [fold.dataset.fold]: !!fold.open };
      holdScrollPosition();
    });
  }, true);
  t.addEventListener("toggle", (event) => {
    const fold = event.target;
    if (!fold || !fold.dataset || !fold.dataset.fold) return;
    e.openFolds = { ...(e.openFolds || {}), [fold.dataset.fold]: !!fold.open };
  }, true);
  t.addEventListener("pointerdown", (event) => {
    const btn = event.target && event.target.closest && event.target.closest(".v3setting-action,.v3action-btn,.v3test-btn,.v3plus");
    if (!btn || btn.disabled) return;
    const rect = btn.getBoundingClientRect();
    if (!rect.width) return;
    const size = Math.max(rect.width, rect.height) * 2;
    const dot = document.createElement("span");
    dot.className = "v3press-ripple";
    dot.style.width = size + "px";
    dot.style.height = size + "px";
    dot.style.left = (event.clientX - rect.left - size / 2) + "px";
    dot.style.top = (event.clientY - rect.top - size / 2) + "px";
    btn.appendChild(dot);
    btn.classList.add("is-pressing");
    setTimeout(() => btn.classList.remove("is-pressing"), 180);
    setTimeout(() => dot.remove(), 600);
  }, { passive: true });
  t.addEventListener("click", async (s) => {
    var o;
    const retry = s.target && s.target.closest && s.target.closest("[data-retry-turn]");
    if (retry) {
      const last = lastUserMessage();
      const box = t.querySelector("#text");
      if (last && last.text && box && !e.turnActive) {
        box.value = last.text;
        e.draft = last.text;
        Ze();
      }
      return;
    }
    const expand = s.target && s.target.closest && s.target.closest("[data-expand-message]");
    if (expand) {
      const id = expand.dataset.expandMessage || "";
      const row = expand.closest(".v3row");
      const bubble = row && row.querySelector(".v3bubble");
      if (bubble) {
        const list = t.querySelector("#list");
        e.stickBottom = !1, e.pinBottom = !1;
        const before = bubble.getBoundingClientRect().top;
        const clamped = bubble.classList.toggle("is-clamped");
        e.expandedMessages = { ...(e.expandedMessages || {}), [id]: !clamped };
        expand.textContent = clamped ? "展开全文" : "收起";
        if (list) {
          // 展开只向下长，保持气泡首行不动（浏览器禁用 anchoring，这里手工补偿）。
          const delta = bubble.getBoundingClientRect().top - before;
          if (Math.abs(delta) > 0.5) list.scrollTop += delta;
          holdScrollPosition();
        }
      }
      return;
    }
    const suggest = s.target && s.target.closest && s.target.closest("[data-suggest]");
    if (suggest) {
      const text = suggest.dataset.suggest || "";
      e.draft = text, persistDraft(text);
      const box = t.querySelector("#text");
      box && (box.value = text, box.style.height = Math.min(120, box.scrollHeight) + "px", box.focus());
      $();
      return;
    }
    const connChip = s.target && s.target.closest && s.target.closest("#connChip");
    if (connChip) {
      e.connSheet = { mode: e.connectMode, testing: !1, result: "" }, openSheetHistory(), $();
      return;
    }
    if (e.connSheet) {
      const target = s.target;
      if (target === t.querySelector("#connSheet")) {
        e.connSheet = null, $();
        return;
      }
      const pick = target.closest && target.closest("[data-conn-pick]");
      if (pick) {
        e.connSheet.mode = pick.dataset.connPick, syncConnSheetDom();
        return;
      }
      if (target.closest && target.closest("#connSpeed")) {
        testNetworks();
        return;
      }
      if (target.closest && target.closest("#connSave")) {
        const mode = e.connSheet && e.connSheet.mode || e.connectMode;
        switchConnectMode(mode);
        return;
      }
      if (target.closest && target.closest("#connClose")) {
        e.connSheet = null, $();
        return;
      }
      return;
    }
    const msChip = s.target && s.target.closest && s.target.closest("#modelChip");
    if (msChip) {
      if (!e.connected) {
        U("连接后才能切换模型");
        return;
      }
      openModelSheet();
      return;
    }
    if (e.modelSheet) {
      const target = s.target;
      if (target === t.querySelector("#modelSheet")) {
        e.modelSheet = null, $();
        return;
      }
      const modelPick = target.closest && target.closest("[data-ms-model]");
      if (modelPick) {
        const groups = e.createOptions && e.createOptions.models && Array.isArray(e.createOptions.models.groups) ? e.createOptions.models.groups : [];
        const model = groups.flatMap((group) => group.models || []).find((item) => item.id === modelPick.dataset.msModel);
        e.modelSheet.model = modelPick.dataset.msModel;
        e.modelSheet.effort = model && model.reasoning && model.reasoning.defaultEffort || "";
        syncModelSheetDom();
        return;
      }
      const effortPick = target.closest && target.closest("[data-ms-effort]");
      if (effortPick) {
        e.modelSheet.effort = effortPick.dataset.msEffort, syncModelSheetDom();
        return;
      }
      const permPick = target.closest && target.closest("[data-ms-perm]");
      if (permPick) {
        e.modelSheet.permission = permPick.dataset.msPerm, syncModelSheetDom();
        return;
      }
      if (target.closest && target.closest("#modelCancel")) {
        e.modelSheet = null, $();
        return;
      }
      if (target.closest && target.closest("#modelApply")) {
        applyModelSheet();
        return;
      }
      return;
    }
    if (s.target && s.target.id === "sessionMenu") {
      e.sessionMenu = null, $();
      return;
    }
    const jt = s.target.closest(".v3toTop");
    if (jt) {
      const list = t.querySelector("#list"), row = jt.closest(".v3row");
      if (list && row) {
        e.pinBottom = !1, e.stickBottom = !1, e.lastUserActionAt = Date.now();
        const top = list.scrollTop + row.getBoundingClientRect().top - list.getBoundingClientRect().top - 8;
        list.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
      return;
    }
    const offRetry = s.target.closest("[data-offline-retry]");
    if (offRetry) {
      if (navigator.onLine === false) U(connectionHintText());
      else if (e.client) e.client.start();
      else Re();
      return;
    }
    const i = s.target.closest("button[data-copy-message]");
    if (i) {
      const f = (o = i.closest(".v3row")) == null ? void 0 : o.querySelector(".v3bubble");
      try {
        await navigator.clipboard.writeText(f && f.innerText || "");
        i.textContent = "已复制";
        i.classList.add("copied");
        window.clearTimeout(i.__copyTimer);
        i.__copyTimer = window.setTimeout(() => {
          i.textContent = "复制";
          i.classList.remove("copied");
        }, 1400);
        U("已复制消息");
      } catch {
        U("复制失败");
      }
      return;
    }
    const p = s.target.closest("a.v3deliverable, a.v3file");
    if (p) {
      s.preventDefault(), await et(p.getAttribute("href") || "", p.dataset.name || "");
      return;
    }
    const g = t.querySelector("#viewer");
    if (g) {
      const track = t.querySelector("#viewerTrack");
      // 图标不再是点击目标：点在 svg/path 上也按按钮命中处理。
      if (s.target && s.target.closest && s.target.closest("#saveViewer")) {
        saveCurrentImage();
        return;
      }
      if (s.target === g || (s.target && s.target.closest && s.target.closest("#closeViewer"))) {
        g.hidden = !0, track && (track.innerHTML = ""), viewerReset();
        return;
      }
      const f = s.target.closest("img.v3img, img.chat-md-image, img.v3attach-thumb");
      if (f && f.src) {
        openViewer(f);
        return;
      }
    }
    const v = s.target.closest('[data-action="copy-code"]');
    if (v) {
      const f = decodeURIComponent(v.dataset.code || "");
      try {
        await navigator.clipboard.writeText(f), v.textContent = "已复制", window.setTimeout(() => {
          v.textContent = "复制";
        }, 1200);
      } catch {
      }
      return;
    }
    const mail = s.target.closest('a[href^="mailto:"]');
    if (mail) {
      s.preventDefault();
      const href = mail.getAttribute("href") || "";
      if (n && typeof n.openExternal === "function") n.openExternal(href);
      else window.location.href = href;
      return;
    }
    const h = s.target.closest("a.chat-link");
    if (h) {
      const f = h.getAttribute("href") || "";
      s.preventDefault(), /^https?:\/\//i.test(f) ? n && typeof n.openExternal == "function" && n.openExternal(f) : f && await et(e.client.workspaceUrl(f), h.textContent || "");
    }
  }), isConfigured() ? Re() : $();
  // 启动先用上次的地址连上，随后立刻回扫一次：家里可达就优先局域网。
  if (isConfigured()) window.setTimeout(() => {
    e.client && e.connectMode === "auto" && e.lanBase && e.base !== e.lanBase && rediscover("boot");
  }, 1200);
  if (isConfigured() && networkApi()) {
    refreshNetworkState();
    if (typeof n.network.watch === "function") {
      try {
        e.unwatchNetwork = n.network.watch((state) => applyNetworkState(state));
      } catch (error) {
      }
    }
  }
  // 换网/回前台时立即重扫；局域网可达就切回局域网，哪怕外部地址还活着。
  const rt = (reason) => {
    if (document.hidden || !e.client) return;
    if (e.connected) rediscover(reason);
    else window.setTimeout(() => {
      e.client && rediscover(reason);
    }, 400);
  };
  window.addEventListener("online", () => rt("online")), document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshNetworkState();
    document.hidden || rt("visible");
  });
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  conn && typeof conn.addEventListener === "function" && conn.addEventListener("change", () => rt("network"));
  startSessionWatch();
  window.setInterval(() => {
    checkConnectionFreshness();
  }, 5e3);
  window.setInterval(() => {
    if (document.hidden || !e.client || e.connecting || He) return;
    if (!e.connected) {
      rediscover("timer");
      return;
    }
    // 只有 auto 才周期性回扫家里；显式锁定外部后不再自动切回。
    if (e.connectMode === "auto" && e.lanBase && e.base !== e.lanBase) Qe(e.lanBase, 1200).then((ok) => {
      if (!ok) {
        e.lanBackHits = 0;
        return;
      }
      e.lanBackHits = (Number(e.lanBackHits) || 0) + 1;
      if (e.lanBackHits >= 2) {
        e.lanBackHits = 0;
        e.client && rediscover("lan-back");
      }
    });
  }, 20e3);
}
export {
  da as default
};

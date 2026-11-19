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
const ra = ``, re = "http://192.168.2.6:8788", Oe = {
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

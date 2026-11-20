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
  
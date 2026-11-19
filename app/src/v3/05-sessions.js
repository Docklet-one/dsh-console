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
  
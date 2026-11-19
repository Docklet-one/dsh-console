function Ze() {
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

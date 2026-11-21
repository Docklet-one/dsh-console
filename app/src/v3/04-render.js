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
  let lastDeliverableSig = "";
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
  function deliverableSig() {
    const list = e.state && Array.isArray(e.state.deliverables) ? e.state.deliverables : [];
    return list.map((d) => (Number(d.seq) || 0) + ":" + (Number(d.endSeq) || 0) + ":" + (d.pending ? 1 : 0)).join(",");
  }
  function renderChatUpdate() {
    // 交付变化必须整页重建：快速路径只更新消息行，不重建交付卡片。
    if (deliverableSig() !== lastDeliverableSig) return false;
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
      lastDeliverableSig = deliverableSig();
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
  
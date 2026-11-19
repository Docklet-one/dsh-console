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
    const p = (x, M, j, E) => `<section class="v3acc ${e.openSection === x ? "open" : ""}" data-acc="${x}"><button class="v3acc-head" data-acc-toggle="${x}"><span class="v3acc-ico ${tint[x] || "blue"}">${ico[x] || ""}</span><span class="v3acc-main"><span class="v3acc-title">${M}</span><span class="v3acc-sum">${j}</span></span><span class="v3acc-chev">›</span></button><div class="v3acc-body" id="acc-${x}" ${e.openSection === x ? "" : "hidden"}>${E}</div></section>`, g = `<label class="v3field"><span class="v3field-head"><span>家里（Wi-Fi）</span><em class="v3field-state" id="lanState"></em></span><input class="v3form-input" id="setLan" value="${b(e.lanBase)}" placeholder="例如：http://192.168.1.1:8788"></label><label class="v3field"><span class="v3field-head"><span>外部（可选）</span><em class="v3field-state" id="wanState"></em></span><input class="v3form-input" id="setWan" value="${b(e.wanBase)}" placeholder="例如：http://10.126.126.1:8788"></label><div class="v3field"><span>连接方式</span><div class="v3conn-row"><div class="v3optlist">${["auto", "lan", "wan"].map((x) => `<button class="v3opt ${e.connectMode === x ? "active" : ""}" data-conn-mode="${x}"><span class="v3opt-label">${x === "auto" ? "自动" : x === "lan" ? "家里" : "外部"}</span></button>`).join("")}</div><button class="v3opt v3test-btn" id="testNetwork"><span class="v3opt-label">网络测试</span></button></div><p class="v3nethint">若自动切换不稳定，请手动测试切换！</p></div><label class="v3field"><span>访问令牌</span><div class="v3token-input"><input class="v3form-input" id="setToken" value="${b(e.token)}" type="password" placeholder="访问令牌"><button type="button" class="v3eye" id="toggleSetToken" aria-label="显示令牌"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6.7 0 10.5 7 10.5 7a17.5 17.5 0 0 1-3.2 4.1"/><path d="M6.1 6.1C3.4 8 1.5 12 1.5 12s3.8 7 10.5 7c1.5 0 2.8-.3 4-.9"/></svg></button></div></label><button class="v3setting-action" id="saveServer">保存并重新连接</button>`, v = `<div class="v3actor" data-actor="me"><button type="button" class="v3actor-avatar" id="pickMe">${ae(!0, o)}</button><input class="v3form-input" id="setMeName" value="${b(o.meName)}" placeholder="我的名字"></div><div class="v3actor" data-actor="ai"><button type="button" class="v3actor-avatar" id="pickAi">${ae(!1, o)}</button><input class="v3form-input" id="setAiName" value="${b(o.aiName)}" placeholder="助手名字"></div><div class="v3avatar-tools"><span class="v3avatar-hint">点头像可更换图片</span></div><div class="v3avatar-actions"><button type="button" class="v3action-btn" id="avatarCancel" ${i ? "" : "disabled"}>取消</button><button type="button" class="v3action-btn primary" id="avatarSave" ${i ? "" : "disabled"}>保存</button></div><input class="v3pick" type="file" accept="image/*" id="avatarMeFile" hidden><input class="v3pick" type="file" accept="image/*" id="avatarAiFile" hidden>`, f = `<div class="v3setting"><span>开启提醒</span><button class="v3switch ${e.notify.enabled ? "on" : ""}" id="notifyToggle"><i></i></button></div><p class="v3hint">开启后每轮结束会通过系统通知提醒。</p><button class="v3setting-action" id="testNotify">发送测试提醒</button>`, k = '<p class="v3hint">会删除地址、访问令牌、头像、通知设置和全部缓存，回到首次打开状态。不会删除电脑端会话。</p><button class="v3setting-action danger" id="resetApp">恢复初始化</button>';
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
      const x = L.type === "password";
      L.type = x ? "text" : "password", z.innerHTML = x ? ce : oe, z.setAttribute("aria-label", x ? "隐藏令牌" : "显示令牌");
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
      e.lanBase = re, e.wanBase = "", e.base = re, e.token = "", e.profile = { ...Oe }, e.profileDraft = null, e.notify = { enabled: !1, mode: "turn" }, Ke();
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
  // Shell back gesture: handle in-app layers first, only then let the shell close the module.
  window.__dockletBack = () => {
    const viewer = t.querySelector("#viewer");
    if (viewer && !viewer.hidden) {
      viewer.hidden = true;
      const track = t.querySelector("#viewerTrack");
      if (track) track.innerHTML = "";
      try {
        viewerReset();
      } catch (_) {
      }
      return true;
    }
    if (e.modelSheet || e.connSheet) {
      dismissSheet();
      return true;
    }
    if (e.route === "sessions") {
      if (e.sessionQuery || (document.activeElement && document.activeElement.id === "sessionSearch")) {
        exitSessionSearch();
        return true;
      }
      H("chat");
      return true;
    }
    if (e.route === "actions" || e.route === "archived") {
      H("sessions");
      return true;
    }
    if (e.route !== "chat") {
      H("chat");
      return true;
    }
    return false;
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
  async 
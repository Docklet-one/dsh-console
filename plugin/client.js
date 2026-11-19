window.__ModuleLoader__.load({
  id: '@local/phone-relay',
  // 约定：没有明确指示或事先约定，不主动修改本插件
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const PORT = 8788

    function useHealth() {
      const cached = (() => {
        try {
          const raw = window.localStorage.getItem('phone-relay.panel')
          return raw ? JSON.parse(raw) : null
        } catch {
          return null
        }
      })()
      const [state, setState] = React.useState({ loading: true, error: '', data: cached })
      React.useEffect(() => {
        let stopped = false
        const load = async () => {
          try {
            const res = await fetch('/phone-relay/health', { cache: 'no-store' })
            if (!res.ok) throw new Error('HTTP ' + res.status)
            const data = await res.json()
            try {
              window.localStorage.setItem('phone-relay.panel', JSON.stringify(data))
            } catch {
              /* 忽略 */
            }
            if (!stopped) setState({ loading: false, error: '', data })
          } catch (error) {
            if (!stopped) {
              setState((prev) => ({
                loading: false,
                error: String((error && error.message) || error),
                data: prev.data,
              }))
            }
          }
        }
        void load()
        const timer = window.setInterval(load, 5000)
        return () => {
          stopped = true
          window.clearInterval(timer)
        }
      }, [])
      return state
    }

    function CopyButton({ text }) {
      const [done, setDone] = React.useState(false)
      return h(
        'button',
        {
          type: 'button',
          onClick: async () => {
            try {
              await navigator.clipboard.writeText(text)
              setDone(true)
              window.setTimeout(() => setDone(false), 1200)
            } catch {
              /* 忽略 */
            }
          },
          style: {
            marginLeft: 8,
            padding: '2px 8px',
            fontSize: 12,
            color: 'inherit',
            cursor: 'pointer',
            background: 'transparent',
            border: '1px solid currentColor',
            borderRadius: 6,
            opacity: 0.7,
          },
        },
        done ? '已复制' : '复制',
      )
    }

    function Row({ label, children }) {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            gap: 12,
            alignItems: 'baseline',
            padding: '8px 0',
            borderBottom: '1px solid rgba(127,127,127,0.18)',
          },
        },
        h('span', { style: { flex: 'none', minWidth: 88, opacity: 0.65, fontSize: 13 } }, label),
        h('span', { style: { flex: 1, fontSize: 13, wordBreak: 'break-all' } }, children),
      )
    }

    function TokenEditor({ current }) {
      const [value, setValue] = React.useState(current || '')
      const [note, setNote] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const dirtyRef = React.useRef(false)
      React.useEffect(() => {
        if (current) setValue(current)
      }, [current])
      const save = async () => {
        setBusy(true)
        setNote('')
        try {
          const res = await fetch('/phone-relay/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: value }),
          })
          const data = await res.json()
          if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status)
          if (!data.saved) throw new Error('插件还没加载新版本，重启 DSH 后再试')
          setNote('已保存，手机端填同一个令牌')
        } catch (error) {
          setNote('保存失败：' + ((error && error.message) || error))
        } finally {
          setBusy(false)
        }
      }
      return h(
        'span',
        { style: { display: 'inline-flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
        h('input', {
          value,
          onChange: (event) => setValue(event.target.value),
          maxLength: 64,
          spellCheck: false,
          style: {
            width: 220,
            padding: '4px 8px',
            fontSize: 13,
            color: 'inherit',
            background: 'transparent',
            border: '1px solid rgba(127,127,127,0.45)',
            borderRadius: 6,
          },
        }),
        h(
          'button',
          {
            type: 'button',
            disabled: busy,
            onClick: save,
            style: {
              padding: '4px 10px',
              fontSize: 12,
              color: 'inherit',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid currentColor',
              borderRadius: 6,
            },
          },
          busy ? '保存中…' : '保存',
        ),
        note ? h('span', { style: { fontSize: 12, opacity: 0.7 } }, note) : null,
      )
    }

    function TunnelEditor({ current, detected }) {
      const [value, setValue] = React.useState(current || detected || '')
      const [note, setNote] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      React.useEffect(() => {
        setValue(current || detected || '')
      }, [current, detected])
      const save = async () => {
        setBusy(true)
        setNote('')
        try {
          const next = value.trim()
          const store = detected && next === detected ? '' : next
          const res = await fetch('/phone-relay/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tunnelUrl: store }),
          })
          const data = await res.json()
          if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status)
          if (!data.saved) throw new Error('插件还没加载新版本，重启 DSH 后再试')
          setNote(store ? '已保存' : '已恢复自动识别')
        } catch (error) {
          setNote('保存失败：' + ((error && error.message) || error))
        } finally {
          setBusy(false)
        }
      }
      return h(
        'span',
        { style: { display: 'inline-flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
        h('input', {
          value,
          placeholder: detected ? '留空自动识别' : '无法自动识别，请手动输入',
          onChange: (event) => setValue(event.target.value),
          spellCheck: false,
          style: {
            width: 280,
            padding: '4px 8px',
            fontSize: 13,
            color: 'inherit',
            background: 'transparent',
            border: '1px solid rgba(127,127,127,0.45)',
            borderRadius: 6,
          },
        }),
        h(
          'button',
          {
            type: 'button',
            disabled: busy,
            onClick: save,
            style: {
              padding: '4px 10px',
              fontSize: 12,
              color: 'inherit',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid currentColor',
              borderRadius: 6,
            },
          },
          busy ? '保存中…' : '保存',
        ),
        note ? h('span', { style: { fontSize: 12, opacity: 0.7 } }, note) : null,
      )
    }

    function Panel() {
      const { loading, error, data } = useHealth()
      const info = data || { port: PORT, bindHost: '0.0.0.0', urls: [], addresses: [], token: '' }
      const detectedLan = (info.addresses || []).find((one) => one.label === '局域网') || {}
      const detectedWan = (info.addresses || []).find((one) => one.label === '虚拟网') || {}
      const [port, setPort] = React.useState(String(info.configuredPort || info.port || PORT))
      const [bindHost, setBindHost] = React.useState(String(info.bindHost || '0.0.0.0'))
      const [lanUrl, setLanUrl] = React.useState(String(info.lanUrl || detectedLan.url || ''))
      const [wanUrl, setWanUrl] = React.useState(String(info.tunnelUrl || detectedWan.url || ''))
      const [token, setToken] = React.useState(String(info.token || ''))
      const [showToken, setShowToken] = React.useState(false)
      const [checked, setChecked] = React.useState(null)
      const [note, setNote] = React.useState('')
      const [portNote, setPortNote] = React.useState('')
      const [lanNote, setLanNote] = React.useState('')
      const [wanNote, setWanNote] = React.useState('')
      const [tokenNote, setTokenNote] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [resetting, setResetting] = React.useState(false)
      const panelRef = React.useRef(null)
      const dirtyRef = React.useRef(false)
      const markDirty = () => {
        dirtyRef.current = true
      }
      const clearFeedback = () => {
        setPortNote('')
        setLanNote('')
        setWanNote('')
        setTokenNote('')
      }
      React.useEffect(() => {
        const onDown = (event) => {
          if (!panelRef.current || panelRef.current.contains(event.target)) return
          clearFeedback()
        }
        document.addEventListener('pointerdown', onDown, true)
        return () => document.removeEventListener('pointerdown', onDown, true)
      }, [])
      React.useEffect(() => {
        if (!data || dirtyRef.current) return
        const displayPort = String(data.configuredPort || data.port || PORT)
        setPort(displayPort)
        setBindHost(String(data.configuredBindHost || data.bindHost || '0.0.0.0'))
        setLanUrl(withPort(String(data.lanUrl || ((data.addresses || []).find((one) => one.label === '局域网') || {}).url || ''), displayPort))
        setWanUrl(withPort(String(data.tunnelUrl || ((data.addresses || []).find((one) => one.label === '虚拟网') || {}).url || ''), displayPort))
        setToken(String(data.token || ''))
      }, [data])
      const withPort = (url, next) => {
        if (!url) return url
        try {
          const parsed = new URL(url)
          parsed.port = String(next)
          return parsed.toString().replace(/\/$/, '')
        } catch {
          return url
        }
      }
      const detect = async () => {
        setChecked(null)
        try {
          const res = await fetch('/phone-relay/check-port', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ port: Number(port), host: bindHost }),
          })
          const body = await res.json()
          setChecked(body.ok ? 'ok' : 'bad')
          if (body.ok) {
            markDirty()
            setLanUrl((value) => withPort(value, port))
            setWanUrl((value) => withPort(value, port))
            setPortNote('端口可用，配置完成保存后，需重启插件')
          } else {
            setPortNote('端口不可用：' + (body.code || body.error || ''))
          }
        } catch (err) {
          setChecked('bad')
          setPortNote('检测失败：' + ((err && err.message) || err))
        }
      }
      const save = async () => {
        setBusy(true)
        setNote('')
        try {
          const res = await fetch('/phone-relay/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ port: Number(port), bindHost, lanUrl: lanUrl === detectedLan.url ? '' : lanUrl, tunnelUrl: wanUrl === detectedWan.url ? '' : wanUrl, token }),
          })
          const body = await res.json()
          if (!res.ok || !body.ok) throw new Error(body.error || 'HTTP ' + res.status)
          dirtyRef.current = false
          if (body.token !== undefined) setToken(String(body.token || ''))
          if (body.configuredPort !== undefined) setPort(String(body.configuredPort))
          setPortNote('')
        } catch (err) {
          setPortNote('')
        } finally {
          setBusy(false)
        }
      }
      const identifyAddress = async (kind) => {
        try {
          const res = await fetch('/phone-relay/health', { cache: 'no-store' })
          const body = await res.json()
          if (!res.ok || !body.ok) throw new Error(body.error || 'HTTP ' + res.status)
          const displayPort = String(body.configuredPort || body.port || PORT)
          const list = body.addresses || []
          const label = kind === 'wan' ? '虚拟网' : '局域网'
          const found = (list.find((one) => one.label === label) || {}).url || ''
          if (!found) {
            ;(kind === 'wan' ? setWanNote : setLanNote)('未识别到' + label + '地址' + (kind === 'wan' ? '，请手动填写' : ''))
            return
          }
          markDirty()
          if (kind === 'wan') setWanUrl(withPort(found, displayPort))
          else setLanUrl(withPort(found, displayPort))
          ;(kind === 'wan' ? setWanNote : setLanNote)('已识别到' + label + '地址')
        } catch (err) {
          ;(kind === 'wan' ? setWanNote : setLanNote)('识别失败：' + ((err && err.message) || err))
        }
      }
      const makeToken = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
        const bytes = crypto.getRandomValues(new Uint8Array(24))
        let out = ''
        for (const b of bytes) out += chars[b % chars.length]
        return out
      }
      const reset = () => {
        markDirty()
        setResetting(true)
        setPort('8788')
        setBindHost('0.0.0.0')
        setLanUrl('')
        setWanUrl('')
        setToken(makeToken())
        setShowToken(false)
        setChecked(null)
        setPortNote('')
        setLanNote('')
        setWanNote('')
        setTokenNote('')
        window.setTimeout(() => setResetting(false), 500)
      }
      const copy = async (text, key = 'port') => {
        const value = String(text || '')
        const setter = key === 'lan' ? setLanNote : key === 'wan' ? setWanNote : key === 'token' ? setTokenNote : setPortNote
        if (!value) {
          setter('没有可复制的内容')
          return
        }
        try {
          await navigator.clipboard.writeText(value)
          setter('已复制')
          window.setTimeout(() => setter(''), 2200)
        } catch {
          setter('复制失败')
        }
      }
      const inputStyle = {
        height: 34,
        padding: '0 10px',
        fontSize: 13,
        color: 'inherit',
        background: 'transparent',
        border: '1px solid rgba(127,127,127,0.4)',
        borderRadius: 8,
        minWidth: 0,
      }
      const btnStyle = {
        height: 34,
        padding: '0 12px',
        fontSize: 13,
        color: 'inherit',
        background: 'transparent',
        border: '1px solid rgba(127,127,127,0.4)',
        borderRadius: 8,
        cursor: 'pointer',
      }
      const rowStyle = { display: 'flex', gap: 18, padding: '9px 0', borderBottom: '1px solid rgba(127,127,127,0.16)', alignItems: 'flex-start' }
      const labelStyle = { flex: '0 0 88px', paddingTop: 8, fontSize: 13, opacity: 0.62 }
      const fieldStyle = { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }
      const noteStyle = { flexBasis: '100%', margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, opacity: 0.62 }
      const row = (label, ...children) => h('div', { style: rowStyle }, h('div', { style: labelStyle }, label), h('div', { style: fieldStyle }, children))
      const external = h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style: { flex: '0 0 auto' } }, h('path', { d: 'M14 4h6v6' }), h('path', { d: 'M20 4l-9 9' }), h('path', { d: 'M19 13v6H5V5h6' }))
      const github = h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true', style: { flex: '0 0 auto' } }, h('path', { d: 'M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z' }))

      const toneOf = (text) => /失败|未识别|没有|不可用|占用|错误/.test(text) ? '#e02424' : '#1f7a3f'
      return h(
        'div',
        { ref: panelRef, onPointerDown: clearFeedback, style: { maxWidth: 760, padding: '0 2px' } },
        h('div', { style: { textAlign: 'center', fontSize: 19, fontWeight: 700, margin: '4px 0 20px' } }, 'DSH手机控制台'),
        h('style', null, '.pr-btn{transition:background .12s ease,transform .08s ease;cursor:pointer}.pr-btn:hover{background:rgba(127,127,127,.08)!important}.pr-btn:active{background:rgba(63,127,223,.18)!important;transform:scale(.97)}.pr-primary:hover{background:#346dcc!important}.pr-primary:active{background:#2b5fb5!important}'),
        row(
          '监听',
          h('input', { style: { ...inputStyle, width: 150 }, value: bindHost, onChange: (e) => { markDirty(); setBindHost(e.target.value) }, spellCheck: false, 'aria-label': '绑定地址' }),
          h('span', { style: { opacity: 0.5 } }, ':'),
          h('input', { style: { ...inputStyle, width: 100 }, inputMode: 'numeric', value: port, onChange: (e) => { markDirty(); setPort(e.target.value) }, 'aria-label': '端口' }),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: detect }, '检测'),
          h('div', { style: { flexBasis: '100%', minHeight: 69 } },
            portNote
              ? h('p', { style: { ...noteStyle, color: toneOf(portNote), fontWeight: 600 } }, portNote)
              : h('div', null,
                  h('p', { style: noteStyle }, '修改端口后，需要到顶部插件里重启本插件。'),
                  h('p', { style: noteStyle }, '点击检测按钮，下方局域网/虚拟网端口自动更新；可手动改写。'),
                  h('p', { style: noteStyle }, '绑定默认 0.0.0.0，监听所有网卡；默认端口 8788，范围 1024–65535。')
                )
          )
        ),
        row(
          '局域网',
          h('input', { style: { ...inputStyle, flex: '1 1 220px' }, value: lanUrl, placeholder: '如：http://192.168.1.1:8788', onChange: (e) => { markDirty(); setLanUrl(e.target.value) }, spellCheck: false }),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => identifyAddress('lan') }, '识别'),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => copy(lanUrl, 'lan') }, '复制'),
          h('p', { style: { ...noteStyle, minHeight: 18, fontWeight: lanNote ? 600 : undefined, color: lanNote ? toneOf(lanNote) : undefined } }, lanNote || '对应手机端家里地址；此处为自动识别，默认即可。')
        ),
        row(
          '虚拟网',
          h('input', { style: { ...inputStyle, flex: '1 1 220px' }, value: wanUrl, placeholder: '无虚拟网可不填，仅能在家里使用', onChange: (e) => { markDirty(); setWanUrl(e.target.value) }, spellCheck: false }),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => identifyAddress('wan') }, '识别'),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => copy(wanUrl, 'wan') }, '复制'),
          h('p', { style: { ...noteStyle, minHeight: 18, fontWeight: wanNote ? 600 : undefined, color: wanNote ? toneOf(wanNote) : undefined } }, wanNote || '对应手机端外部地址；外出使用需配置虚拟网地址。')
        ),
        row(
          '令牌',
          h('input', { style: { ...inputStyle, flex: '1 1 220px' }, type: showToken ? 'text' : 'password', value: token, onChange: (e) => { markDirty(); setToken(e.target.value) }, spellCheck: false }),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => setShowToken((v) => !v) }, showToken ? '隐藏' : '显示'),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => { markDirty(); setToken(makeToken()); setShowToken(true); setTokenNote('已生成新令牌，保存后生效') } }, '重新生成'),
          h('button', { type: 'button', style: btnStyle, className: 'pr-btn', onClick: () => copy(token, 'token') }, '复制'),
          h('p', { style: { ...noteStyle, minHeight: 18, fontWeight: tokenNote ? 600 : undefined, color: tokenNote ? toneOf(tokenNote) : undefined } }, tokenNote || '可手动填写，与手机端令牌一致即可；重新生成后，手机端需更新。')
        ),
        h('div', { style: { margin: '10px 0', padding: '9px 12px', border: '1px solid rgba(184,137,46,0.35)', background: 'rgba(255,250,240,0.7)', borderRadius: 10, fontSize: 12.5, lineHeight: 1.55, color: '#6e5623' } },
          h('div', null, '1. 请仔细看清对应提示，以免配置错误；保存后最好重启插件。'),
          h('div', null, '2. 尽量在路由里固定设备 IP，设备重启后，IP 可能变化；防火墙也可能拦截。'),
          h('div', null, '3. 0.0.0.0 会监听所有网卡，同网络下的其他设备也能访问此端口；请只在可信网络使用，并保持令牌复杂性。')
        ),
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(127,127,127,0.16)', flexWrap: 'wrap' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', fontSize: 12.5 } },
            h('span', { style: { color: 'inherit' } }, '官网：', h('a', { href: 'https://docklet.cn', target: '_blank', rel: 'noreferrer', style: { color: '#3f7fdf', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 } }, 'https://docklet.cn', external)),
            h('span', null, '主仓库：', h('a', { href: 'https://github.com/Docklet-one/docklet', target: '_blank', rel: 'noreferrer', style: { color: '#3f7fdf', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 } }, github, 'GitHub', external))
          ),
          h('div', { style: { display: 'flex', gap: 8 } },
            h('button', { type: 'button', style: btnStyle, className: 'pr-btn', disabled: resetting, onClick: reset }, resetting ? '重置中…' : '重置'),
            h('button', { type: 'button', style: { ...btnStyle, background: '#3f7fdf', borderColor: '#3f7fdf', color: '#fff' }, className: 'pr-btn pr-primary', disabled: busy, onClick: save }, busy ? '保存中…' : '保存')
          )
        )
      )
    }

    // 手机状态：常驻在输入框工具行，由 slot 渲染，不做 DOM 插入
    const status = { phone: false, pending: false, elsewhere: false, subs: new Set(), poke: null }
    function setStatus(next) {
      Object.assign(status, next)
      for (const fn of status.subs) {
        try {
          fn()
        } catch {
          /* 忽略单个订阅者 */
        }
      }
    }

    function snapshot() {
      return {
        phone: status.phone,
        pending: status.pending,
        elsewhere: status.elsewhere,
        pendingId: status.pendingId || '',
        pendingTool: status.pendingTool || '',
        pendingTitle: status.pendingTitle || '',
        pendingReason: status.pendingReason || '',
        pendingOther: Boolean(status.pendingOther),
        // 只有「审批所在的那个会话」自动展开；其它会话点「详情」才展开
        expanded: Boolean(status.pendingId) && (!status.pendingOther || Boolean(status.manual)),
      }
    }

    function useStatus() {
      const [snap, setSnap] = React.useState(snapshot)
      React.useEffect(() => {
        const update = () => setSnap(snapshot())
        status.subs.add(update)
        update()
        return () => status.subs.delete(update)
      }, [])
      return snap
    }

    function statusIcon(kind) {
      const common = {
        width: '18px',
        height: '15px',
        viewBox: '0 0 24 24',
        preserveAspectRatio: 'none',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        style: { flex: '0 0 auto', display: 'block' },
        'aria-hidden': 'true',
      }
      if (kind === 'clock') {
        return h('svg', common, h('circle', { cx: 12, cy: 12, r: 8 }), h('path', { d: 'M12 7v5l3.2 1.8' }))
      }
      const base = [
        h('rect', { key: 'body', x: 6.5, y: 2.5, width: 11, height: 19, rx: 2.2 }),
        h('path', { key: 'speaker', d: 'M10 5.5h4' }),
        h('circle', { key: 'home', cx: 12, cy: 18, r: 0.6, fill: 'currentColor', stroke: 'none' }),
      ]
      if (kind === 'off') base.push(h('path', { key: 'slash', d: 'M4.5 4.5l15 15' }))
      return h('svg', common, base)
    }

    function StatusPill() {
      const snap = useStatus()

      let label = '手机离线'
      let icon = 'off'
      let tone = {
        color: '#61666b',
      }
      const desktopPending = Boolean(snap.pendingId)
      if (desktopPending) {
        const name = snap.pendingTool ? '：' + snap.pendingTool : ''
        label = (snap.pendingOther ? '其它会话待审批' : '待审批') + name
        icon = 'clock'
        tone = {
          color: '#7a5a12',
          background: 'rgba(245,180,60,.16)',
          borderColor: 'rgba(217,159,48,.42)',
        }
      } else if (snap.elsewhere) {
        label = '另有会话等待审批'
        icon = 'phone'
        tone = {
          color: '#8a5a12',
          background: 'rgba(214,160,60,.14)',
          borderColor: 'rgba(200,150,60,.35)',
        }
      } else if (snap.phone) {
        label = '手机在线'
        icon = 'phone'
        tone = {
          color: '#61666b',
        }
      }

      const decide = (allow) => {
        if (!snap.pendingId) return
        void fetch('/phone-relay/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: snap.pendingId, allow }),
        }).catch(() => undefined)
      }
      const btn = (label, allow, primary) =>
        h(
          'button',
          {
            type: 'button',
            onClick: () => decide(allow),
            style: {
              marginLeft: 6,
              padding: '1px 8px',
              borderRadius: 999,
              fontSize: 11,
              lineHeight: 1.6,
              cursor: 'pointer',
              border: '1px solid ' + (primary ? 'rgba(217,139,28,.6)' : 'rgba(150,90,80,.45)'),
              background: primary ? 'rgba(245,166,35,.35)' : 'rgba(190,90,80,.12)',
              color: primary ? '#7a4a06' : '#8a4a42',
            },
          },
          label,
        )

      const toggleExpanded = () => {
        status.manual = !status.manual
        for (const fn of status.subs) fn()
      }
      const detailBtn = () =>
        h(
          'button',
          {
            type: 'button',
            onClick: toggleExpanded,
            style: {
              marginLeft: 8,
              padding: '1px 8px',
              borderRadius: 999,
              fontSize: 11,
              lineHeight: 1.6,
              cursor: 'pointer',
              color: '#6b5a3a',
              border: '1px solid rgba(120,100,70,.3)',
              background: 'rgba(255,255,255,.65)',
            },
          },
          '详情',
        )

      if (desktopPending) {
        return h(
          'span',
          {
            'data-phone-relay-pill': '1',
            style: Object.assign(
              {
                display: 'inline-flex',
                alignItems: 'center',
                margin: '0 6px',
                padding: '1px 8px',
                borderRadius: 999,
                fontSize: 11,
                lineHeight: 1.7,
                whiteSpace: 'nowrap',
                border: '1px solid transparent',
              },
              tone,
            ),
          },
          h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 1 } }, statusIcon(icon), label),
          detailBtn(),
          btn('拒绝', false, false),
          btn('允许', true, true),
        )
      }

      return h(
        'button',
        {
          'data-phone-relay-pill': '1',
          type: 'button',
          title: snap.pendingOther ? '点一下展开这条审批' : 'DSH手机控制台状态',
          onClick: () => {
            if (!snap.pendingOther) return
            status.manual = !status.manual
            for (const fn of status.subs) fn()
          },
          style: Object.assign(
            {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              margin: '0 6px',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
              border: '0',
              background: 'transparent',
              cursor: snap.pendingOther ? 'pointer' : 'default',
              pointerEvents: snap.pendingOther ? 'auto' : 'none',
            },
            tone,
          ),
        },
        h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 1 } }, statusIcon(icon), label),
      )
    }

    // 审批详情：本会话自动展开；其它会话点「详情」展开
    function ApprovalDetail() {
      const snap = useStatus()
      if (!snap.pendingId || !snap.expanded) return null
      const decide = (allow) =>
        fetch('/phone-relay/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: snap.pendingId, allow }),
        }).catch(() => undefined)
      return h(
        'div',
        {
          'data-phone-relay-card': '1',
          style: {
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: 'var(--dsh-chat-content-width, 760px)',
            margin: '4px auto 8px',
            padding: '10px 14px',
            borderRadius: 12,
            background: '#fffdf7',
            border: '1px solid rgba(217,159,48,.45)',
            boxShadow: '0 2px 8px rgba(120,85,20,.08)',
            fontSize: 12,
            lineHeight: 1.6,
            color: '#6b4a12',
          },
        },
        h('div', { style: { fontWeight: 600 } }, '来自「' + (snap.pendingTitle || '会话') + '」的授权请求 · ' + (snap.pendingTool || '未知操作')),
        snap.pendingReason ? h('div', { style: { marginTop: 2 } }, snap.pendingReason) : null,
        h(
          'div',
          { style: { marginTop: 6, display: 'flex', gap: 8 } },
          h(
            'button',
            {
              type: 'button',
              onClick: () => decide(false),
              style: {
                padding: '2px 12px',
                borderRadius: 999,
                fontSize: 12,
                cursor: 'pointer',
                border: '1px solid rgba(150,90,80,.45)',
                background: 'rgba(190,90,80,.12)',
                color: '#8a4a42',
              },
            },
            '拒绝',
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: () => decide(true),
              style: {
                padding: '2px 12px',
                borderRadius: 999,
                fontSize: 12,
                cursor: 'pointer',
                border: '1px solid rgba(217,139,28,.6)',
                background: 'rgba(245,166,35,.35)',
                color: '#7a4a06',
              },
            },
            '允许',
          ),
        ),
      )
    }

    // 输入锁定：直接禁用编辑器并换占位文案，不做浮层
    const locks = new WeakMap()
    const lockedButtons = new WeakSet()
    const LOCK_TEXT =
      '有审批等待处理：可点上方状态条里的「允许 / 拒绝」，或到手机上确认；不想用手机审批就在手机上关闭对话应用。'

    function composerScope() {
      const anchor = document.querySelector('[data-phone-relay-pill]')
      if (!anchor) return null
      let node = anchor
      for (let i = 0; i < 10 && node; i += 1) {
        if (node.querySelector && node.querySelector('textarea, [contenteditable="true"]')) return node
        node = node.parentElement
      }
      return null
    }

    function sendButtons(scope) {
      const out = []
      const root = scope || document
      for (const el of root.querySelectorAll('button, [role="button"]')) {
        const label = ((el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '')).trim()
        if (/发送|送出|Send|Submit/i.test(label)) out.push(el)
      }
      return out
    }

    function lockEditors(locked) {
      const scope = composerScope()
      const nodes = []
      for (const el of document.querySelectorAll(
        'textarea, input[type="text"], input:not([type]), [contenteditable]',
      )) {
        if (locks.has(el)) {
          nodes.push(el)
          continue
        }
        const hint = (
          (el.getAttribute('placeholder') || '') +
          ' ' +
          (el.getAttribute('aria-label') || '')
        ).trim()
        if (/搜索|Search/i.test(hint)) continue
        const inScope = scope ? scope.contains(el) : false
        const likelyComposer = /发消息|调用指令|描述你想要|创建任务/.test(hint)
        if (inScope || likelyComposer) nodes.push(el)
      }
      for (const el of nodes) {
        if (locked) {
          if (!locks.has(el)) {
            locks.set(el, {
              placeholder: el.getAttribute('placeholder'),
              readOnly: el.readOnly === true,
              editable: el.getAttribute('contenteditable'),
              outline: el.style.outline,
              outlineOffset: el.style.outlineOffset,
              opacity: el.style.opacity,
              title: el.getAttribute('title'),
            })
          }
          if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            el.readOnly = true
            try {
              el.setAttribute('placeholder', LOCK_TEXT)
            } catch {
              /* 忽略 */
            }
          } else {
            el.setAttribute('contenteditable', 'false')
            el.setAttribute('data-phone-relay-placeholder', LOCK_TEXT)
          }
          el.style.opacity = '0.72'
          el.style.outline = '2px solid rgba(198, 64, 55, 0.55)'
          el.style.outlineOffset = '2px'
          el.setAttribute('title', LOCK_TEXT)
        } else if (locks.has(el)) {
          const saved = locks.get(el)
          locks.delete(el)
          if (saved.readOnly === false) el.readOnly = false
          if (saved.editable === null) el.removeAttribute('contenteditable')
          else el.setAttribute('contenteditable', saved.editable)
          if (saved.placeholder === null) el.removeAttribute('placeholder')
          else el.setAttribute('placeholder', saved.placeholder)
          el.removeAttribute('data-phone-relay-placeholder')
          el.style.opacity = saved.opacity || ''
          el.style.outline = saved.outline || ''
          el.style.outlineOffset = saved.outlineOffset || ''
          if (saved.title === null) el.removeAttribute('title')
          else el.setAttribute('title', saved.title)
        }
      }
      for (const btn of sendButtons(scope)) {
        if (locked) {
          if (!lockedButtons.has(btn)) {
            lockedButtons.add(btn)
            btn.dataset.phoneRelayDisabled = '1'
            btn.disabled = true
            btn.setAttribute('aria-disabled', 'true')
          }
        } else if (lockedButtons.has(btn)) {
          lockedButtons.delete(btn)
          btn.disabled = false
          btn.removeAttribute('aria-disabled')
          delete btn.dataset.phoneRelayDisabled
        }
      }
    }

    function mountApprovalWatch(ctx, getSession) {
      if (typeof document === 'undefined') return
      let pending = false
      let disposed = false
      let timer = 0

      const blockKeys = (event) => {
        if (!pending) return
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'F5')) return
        event.preventDefault()
        event.stopPropagation()
      }

      const load = async () => {
        if (disposed) return
        try {
          const res = await fetch('/phone-relay/approvals', { cache: 'no-store' })
          if (!res.ok) throw new Error('HTTP ' + res.status)
          const data = await res.json()
          const list = Array.isArray(data.pending) ? data.pending : []
          const session = String(getSession() || '')
          const mine = session ? list.find((item) => item.session === session) : null
          // 点击其它地方会收起详情，这里不需要缓存
          const any = mine || list[0] || null
          pending = Boolean(mine)
          // 切换会话时收起手动展开的详情
          if (session !== status.uiSession) {
            status.uiSession = session
            status.manual = false
          }
          if (!any) status.manual = false
          setStatus({
            phone: Boolean(data.phone),
            pending,
            elsewhere: list.length > 0 && !pending,
            pendingId: any ? any.id : '',
            pendingTool: any ? any.tool || '' : '',
            pendingTitle: any ? any.title || '' : '',
            pendingReason: any ? any.reason || '' : '',
            pendingOther: Boolean(any && any.session !== session),          })
          if (pending) {
            const active = document.activeElement
            if (active && typeof active.blur === 'function') active.blur()
          }
          // 每轮都套一次，防止 React 重渲染把属性冲掉
          lockEditors(pending)
        } catch {
          /* 忽略 */
        }
      }

      // 点其它地方就收起手动展开的详情
      const onDocPointerDown = (event) => {
        if (!status.manual) return
        const target = event.target
        if (
          target instanceof Element &&
          (target.closest('[data-phone-relay-card]') || target.closest('[data-phone-relay-pill]'))
        ) {
          return
        }
        status.manual = false
        for (const fn of status.subs) fn()
      }

      timer = window.setInterval(load, 1000)
      status.poke = load
      document.addEventListener('pointerdown', onDocPointerDown, true)
      window.addEventListener('keydown', blockKeys, true)
      window.addEventListener('keypress', blockKeys, true)
      window.addEventListener('beforeinput', blockKeys, true)
      void load()

      ctx.effect(() => () => {
        disposed = true
        if (status.poke === load) status.poke = null
        window.clearInterval(timer)
        document.removeEventListener('pointerdown', onDocPointerDown, true)
        window.removeEventListener('keydown', blockKeys, true)
        window.removeEventListener('keypress', blockKeys, true)
        window.removeEventListener('beforeinput', blockKeys, true)
        lockEditors(false)
      })
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            { name: 'settings.section', id: 'phone-relay', order: 60, label: 'DSH手机控制台' },
            Panel,
          ),
        )
        const seat = { id: '' }
        mountApprovalWatch(ctx, () => seat.id)
        ctx.slots.inject('conversation.input.overlay', () =>
          ctx.slots.register(
            { name: 'conversation.input.overlay', id: 'phone-relay-seat', order: 5 },
            (props) => {
              React.useEffect(() => {
                const next = String(props.sessionId || '')
                if (next !== seat.id) {
                  seat.id = next
                  if (typeof status.poke === 'function') status.poke()
                }
              }, [props.sessionId])
              return null
            },
          ),
        )
        ctx.slots.inject('conversation.input.left', () =>
          ctx.slots.register(
            { name: 'conversation.input.left', id: 'phone-relay-status', order: 90 },
            StatusPill,
          ),
        )
        ctx.slots.inject('conversation.input.dock', () =>
          ctx.slots.register(
            { name: 'conversation.input.dock', id: 'phone-relay-detail', order: 5 },
            ApprovalDetail,
          ),
        )
      },
    }
  },
})

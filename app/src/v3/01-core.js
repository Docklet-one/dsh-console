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

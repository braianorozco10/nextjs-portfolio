export type Role = "admin" | "users";
export function validateUser(u: string, p: string): Role | null {
  const d: any = {
    admin: { p: "1234", r: "admin" },
    users: { p: "1234", r: "user" },
  };
  const e = d[u];
  if (e && e.p === p) return e.r;
  return null;
}
export function saveSession(r: Role, u: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("wt_session", JSON.stringify({ r, u, ts: Date.now() }));
}
export function getSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("wt_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("wt_session");
}

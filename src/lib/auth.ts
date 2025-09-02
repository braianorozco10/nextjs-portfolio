// src/lib/auth.ts
export type Role = 'admin' | 'users';

type Credentials = { pass: string; role: Role };
const PAIRS: Record<string, Credentials> = {
  admin: { pass: '1234', role: 'admin' },
  users: { pass: '1234', role: 'users' }, // <- ensure "users"
};

export function validateUser(username: string, password: string): Role | null {
  const entry = PAIRS[username];
  if (entry && entry.pass === password) return entry.role;
  return null;
}

export type Session = { role: Role; username: string; ts: number };

export function saveSession(role: Role, username: string) {
  if (typeof window === 'undefined') return;
  const data: Session = { role, username, ts: Date.now() };
  localStorage.setItem('wt_session', JSON.stringify(data));
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('wt_session');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('wt_session');
}
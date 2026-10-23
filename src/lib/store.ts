import { useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  academySeed, gymSeed, seedAccounts, seedAcademies, seedFollows, seedGyms, seedPosts,
  type Academy, type Account, type Gym, type Post, type Row,
} from "./data";

export interface Notice { id: string; to: string; from: string; text: string; at: number; read?: boolean }
export interface State {
  accounts: Account[];
  gyms: Gym[];
  academies: Academy[];
  posts: Post[];
  follows: { from: string; to: string; status: "accepted" | "pending" }[];
  notices: Notice[];
  partnerData: Record<string, Record<string, Row[]>>;
  sessionId: string | null;
}

const KEY = "kalawar-hub-v1";
const initial = (): State => ({
  accounts: seedAccounts,
  gyms: seedGyms,
  academies: seedAcademies,
  posts: seedPosts,
  follows: seedFollows,
  notices: [],
  partnerData: { g1: gymSeed(), a1: academySeed("Cricket") },
  sessionId: null,
});

let state: State = initial();
let hydrated = false;
const listeners = new Set<() => void>();
const serverState = state;

function emit() {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {
      toast.error("Changes couldn't be saved on this device. Free some storage and try again.");
      return false;
    }
  }
  listeners.forEach((l) => l());
  return true;
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function setState(fn: (s: State) => Partial<State>) {
  const previous = state;
  state = { ...state, ...fn(state) };
  if (!emit()) { state = previous; return false; }
  return true;
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

function shallowEq(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

export function useStore<T>(sel: (s: State) => T): T {
  const cache = useRef<{ v?: T; sv?: T; has?: boolean; shas?: boolean }>({});
  return useSyncExternalStore(
    subscribe,
    () => {
      const c = cache.current; const v = sel(state);
      if (!c.has || !shallowEq(c.v, v)) { c.v = v; c.has = true; }
      return c.v as T;
    },
    () => {
      const c = cache.current; const v = sel(serverState);
      if (!c.shas || !shallowEq(c.sv, v)) { c.sv = v; c.shas = true; }
      return c.sv as T;
    },
  );
}
export const useHydrated = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => hydrated, () => false);

export const uid = () => Math.random().toString(36).slice(2, 10);

// ---------- auth ----------
export function useMe() {
  return useStore((s) => s.accounts.find((a) => a.id === s.sessionId) ?? null);
}
export function login(email: string, password: string, types?: Account["type"][]): Account | string {
  const acc = state.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!acc || acc.password !== password) return "Incorrect email or password.";
  if (types && !types.includes(acc.type)) return "This account is not registered for this portal.";
  setState(() => ({ sessionId: acc.id }));
  return acc;
}
export function logout() { setState(() => ({ sessionId: null })); }

export function registerAccount(a: Omit<Account, "id">): Account | string {
  const email = a.email.trim().toLowerCase();
  const handle = a.handle.trim().replace(/^@/, "").toLowerCase();
  if (state.accounts.some((x) => x.email.toLowerCase() === email)) return "An account with this email already exists.";
  if (state.accounts.some((x) => x.handle.toLowerCase() === handle)) return "This username is already taken.";
  const acc: Account = { ...a, email, handle, id: "u-" + uid() };
  setState((s) => ({ accounts: [...s.accounts, acc], sessionId: acc.id }));
  return acc;
}

export function registerGym(owner: Omit<Account, "id" | "type" | "partnerId">, gym: Omit<Gym, "id" | "ownerId" | "rating">) {
  const gid = "g-" + uid();
  const res = registerAccount({ ...owner, type: "gym", partnerId: gid });
  if (typeof res === "string") return res;
  const seed = gymSeed();
  setState((s) => ({
    gyms: [{ ...gym, id: gid, ownerId: res.id, rating: 5 }, ...s.gyms],
    partnerData: { ...s.partnerData, [gid]: { ...seed, members: [], subscriptions: [], sales: [], attendance: [], expenses: [], employees: [] } },
  }));
  return res;
}
export function registerAcademy(owner: Omit<Account, "id" | "type" | "partnerId">, ac: Omit<Academy, "id" | "ownerId" | "rating" | "students">) {
  const aid = "a-" + uid();
  const res = registerAccount({ ...owner, type: "academy", partnerId: aid });
  if (typeof res === "string") return res;
  const seed = academySeed(ac.sport);
  setState((s) => ({
    academies: [{ ...ac, id: aid, ownerId: res.id, rating: 5, students: 0 }, ...s.academies],
    partnerData: { ...s.partnerData, [aid]: { batches: seed.batches, students: [], coaches: [], fees: [], attendance: [], events: [], performance: [], payments: [] } },
  }));
  return res;
}

// ---------- partner data ----------
export function upsertRow(pid: string, table: string, row: Row) {
  setState((s) => {
    const t = s.partnerData[pid]?.[table] ?? [];
    const exists = t.some((r) => r.id === row.id);
    return { partnerData: { ...s.partnerData, [pid]: { ...s.partnerData[pid], [table]: exists ? t.map((r) => (r.id === row.id ? row : r)) : [row, ...t] } } };
  });
}
export function deleteRow(pid: string, table: string, id: string) {
  setState((s) => ({ partnerData: { ...s.partnerData, [pid]: { ...s.partnerData[pid], [table]: (s.partnerData[pid]?.[table] ?? []).filter((r) => r.id !== id) } } }));
}

// ---------- media ----------
export function toggleLike(postId: string, me: string) {
  setState((s) => ({ posts: s.posts.map((p) => p.id === postId ? { ...p, likes: p.likes.includes(me) ? p.likes.filter((x) => x !== me) : [...p.likes, me] } : p) }));
}
export function toggleSubscribe(postId: string, me: string) {
  setState((s) => ({ posts: s.posts.map((p) => p.id === postId ? { ...p, subscribers: p.subscribers.includes(me) ? p.subscribers.filter((x) => x !== me) : [...p.subscribers, me] } : p) }));
}
export function addComment(postId: string, me: string, text: string) {
  if (!text.trim()) return;
  setState((s) => {
    const post = s.posts.find((p) => p.id === postId);
    if (!post) return {};
    const recipients = [...new Set([post.authorId, ...post.subscribers])].filter((id) => id !== me);
    return {
      posts: s.posts.map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: uid(), authorId: me, text: text.trim(), at: Date.now() }] } : p),
      notices: [...s.notices, ...recipients.map((to) => ({ id: uid(), to, from: me, text: "commented on a post you follow", at: Date.now() }))],
    };
  });
}
export function addPost(p: Omit<Post, "id" | "likes" | "subscribers" | "comments" | "views" | "at">) {
  return setState((s) => ({ posts: [{ ...p, id: "p-" + uid(), likes: [], subscribers: [], comments: [], views: 0, at: Date.now() }, ...s.posts] }));
}
export function deletePost(id: string) { setState((s) => ({ posts: s.posts.filter((p) => p.id !== id) })); }

export function followStatus(s: State, from: string, to: string) {
  return s.follows.find((f) => f.from === from && f.to === to)?.status ?? null;
}
/** Public accounts are followed instantly; private ones receive a follow request. */
export function follow(me: string, target: string) {
  const t = state.accounts.find((a) => a.id === target);
  if (!t || me === target || followStatus(state, me, target)) return;
  const status = t?.private ? "pending" : "accepted";
  setState((s) => ({
    follows: [...s.follows.filter((f) => !(f.from === me && f.to === target)), { from: me, to: target, status }],
    notices: [...s.notices, { id: uid(), to: target, from: me, text: status === "pending" ? "requested to follow you" : "started following you", at: Date.now() }],
  }));
}
export function unfollow(me: string, target: string) {
  setState((s) => ({ follows: s.follows.filter((f) => !(f.from === me && f.to === target)), notices: s.notices.filter((n) => !(n.from === me && n.to === target && n.text.includes("requested"))) }));
}
export function respondRequest(me: string, from: string, accept: boolean) {
  setState((s) => ({
    follows: accept ? s.follows.map((f) => (f.from === from && f.to === me ? { ...f, status: "accepted" } : f)) : s.follows.filter((f) => !(f.from === from && f.to === me)),
    notices: [...s.notices.filter((n) => !(n.to === me && n.from === from && n.text.includes("requested"))), ...(accept ? [{ id: uid(), to: from, from: me, text: "accepted your follow request", at: Date.now() }] : [])],
  }));
}
export function updateAccount(id: string, patch: Partial<Account>) {
  setState((s) => ({ accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
}

export function canViewPosts(s: State, authorId: string, viewerId: string | null) {
  const author = s.accounts.find((a) => a.id === authorId);
  return !!author && (!author.private || viewerId === authorId || (!!viewerId && followStatus(s, viewerId, authorId) === "accepted"));
}

export function markNoticesRead(to: string) {
  setState((s) => ({ notices: s.notices.map((n) => n.to === to ? { ...n, read: true } : n) }));
}

export function recordView(postId: string) {
  try {
    const key = `kalawar-view-${postId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    setState((s) => ({ posts: s.posts.map((p) => p.id === postId ? { ...p, views: p.views + 1 } : p) }));
  } catch { /* views are optional when device storage is unavailable */ }
}

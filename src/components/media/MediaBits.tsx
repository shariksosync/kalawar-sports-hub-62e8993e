import { Link } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { Heart, MessageCircle, BellRing, Eye, Trash2, Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Account, Post } from "@/lib/data";
import { addComment, deletePost, follow, followStatus, toggleLike, toggleSubscribe, unfollow, useMe, useStore } from "@/lib/store";

// ---- "please register first" gate for guests ----
let gate: string | null = null;
const gl = new Set<() => void>();
const setGate = (v: string | null) => { gate = v; gl.forEach((l) => l()); };
export function useGuard() {
  const me = useMe();
  return (action: string, fn: (meId: string) => void) => { if (!me) setGate(action); else fn(me.id); };
}
export function AuthGate() {
  const g = useSyncExternalStore((l) => { gl.add(l); return () => gl.delete(l); }, () => gate, () => null);
  return (
    <Dialog open={!!g} onOpenChange={(o) => !o && setGate(null)}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-gradient-gold"><Lock className="h-6 w-6 text-primary-foreground" /></div>
          <DialogTitle className="font-display text-3xl tracking-wide">Register first</DialogTitle>
          <DialogDescription>Create a free account to {g}. You can keep browsing and watching without one.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1 rounded-full" onClick={() => setGate(null)}><Link to="/media/register">Create account</Link></Button>
          <Button asChild variant="outline" className="flex-1 rounded-full" onClick={() => setGate(null)}><Link to="/media/login">Sign in</Link></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function typeLabel(a: Account) {
  return a.type === "kalawar" ? `Kalawar ${a.role ?? "Member"}` : a.type === "gym" ? "Gym" : a.type === "academy" ? "Academy" : "Creator";
}

export function UserChip({ a, sub }: { a: Account; sub?: string }) {
  return (
    <Link to="/media/u/$id" params={{ id: a.id }} className="flex items-center gap-3">
      <Avatar className="h-10 w-10 ring-2 ring-primary/40"><AvatarImage src={a.avatar} className="object-cover" /><AvatarFallback>{a.name[0]}</AvatarFallback></Avatar>
      <div className="leading-tight"><div className="text-sm font-semibold">{a.name}</div><div className="text-xs text-muted-foreground">{sub ?? `@${a.handle} · ${typeLabel(a)}`}</div></div>
    </Link>
  );
}

export function FollowButton({ target, size = "sm" }: { target: Account; size?: "sm" | "default" }) {
  const me = useMe();
  const guard = useGuard();
  const st = useStore((s) => (me ? followStatus(s, me.id, target.id) : null));
  const back = useStore((s) => (me ? followStatus(s, target.id, me.id) : null));
  if (me?.id === target.id) return null;
  const label = st === "accepted" ? (back === "accepted" ? "Mutual" : "Following") : st === "pending" ? "Requested" : back === "accepted" ? "Follow back" : target.private ? "Request" : "Follow";
  return (
    <Button size={size} variant={st ? "outline" : "default"} className="rounded-full" onClick={() => guard("follow athletes", (id) => {
      if (st) { unfollow(id, target.id); toast(st === "pending" ? "Request cancelled" : `Unfollowed ${target.name}`); }
      else { follow(id, target.id); toast.success(target.private ? "Follow request sent" : `You're following ${target.name}`); }
    })}>{label}</Button>
  );
}

const ago = (t: number) => { const h = Math.max(1, Math.round((Date.now() - t) / 3600000)); return h < 24 ? `${h}h` : `${Math.round(h / 24)}d`; };

export function PostCard({ post }: { post: Post }) {
  const me = useMe();
  const guard = useGuard();
  const author = useStore((s) => s.accounts.find((a) => a.id === post.authorId));
  const accounts = useStore((s) => s.accounts);
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false);
  if (!author) return null;
  const liked = !!me && post.likes.includes(me.id);
  const subbed = !!me && post.subscribers.includes(me.id);
  const comments = showAll ? post.comments : post.comments.slice(-2);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between p-4"><UserChip a={author} sub={`${typeLabel(author)} · ${ago(post.at)}`} /><div className="flex items-center gap-2"><FollowButton target={author} />{me?.id === author.id && <Button size="icon" variant="ghost" aria-label="Delete post" onClick={() => { deletePost(post.id); toast("Post deleted"); }}><Trash2 className="h-4 w-4" /></Button>}</div></div>
      {post.kind === "video" ? <video src={post.src} poster={post.poster} controls playsInline className="aspect-video w-full bg-sidebar object-cover" /> : <img src={post.src} alt={post.caption} loading="lazy" className="aspect-square w-full object-cover" />}
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => guard("like posts", (id) => toggleLike(post.id, id))} className={liked ? "text-primary" : ""}><Heart className={`mr-1 h-5 w-5 ${liked ? "fill-current" : ""}`} />{post.likes.length}</Button>
          <Button size="sm" variant="ghost" onClick={() => guard("comment", () => document.getElementById(`c-${post.id}`)?.focus())}><MessageCircle className="mr-1 h-5 w-5" />{post.comments.length}</Button>
          <Button size="sm" variant="ghost" onClick={() => guard("subscribe to posts", (id) => { toggleSubscribe(post.id, id); toast.success(subbed ? "Unsubscribed" : "Subscribed — you'll get updates"); })} className={subbed ? "text-primary" : ""}><BellRing className={`mr-1 h-5 w-5 ${subbed ? "fill-current" : ""}`} />{subbed ? "Subscribed" : "Subscribe"}</Button>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-4 w-4" />{post.views.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-sm"><span className="font-semibold">{author.handle}</span> {post.caption}</p>
        {post.comments.length > 2 && !showAll && <button className="text-xs text-muted-foreground" onClick={() => setShowAll(true)}>View all {post.comments.length} comments</button>}
        {comments.map((c) => { const a = accounts.find((x) => x.id === c.authorId); return <p key={c.id} className="text-sm"><span className="font-semibold">{a?.handle}</span> <span className="text-muted-foreground">{c.text}</span></p>; })}
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); guard("comment", (id) => { if (text.trim()) { addComment(post.id, id, text.trim()); setText(""); } }); }}>
          <Input id={`c-${post.id}`} placeholder="Add a comment…" value={text} onChange={(e) => setText(e.target.value)} onFocus={(e) => { if (!me) { e.target.blur(); setGate("comment"); } }} />
          <Button size="icon" type="submit" variant="ghost" aria-label="Post comment"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </article>
  );
}

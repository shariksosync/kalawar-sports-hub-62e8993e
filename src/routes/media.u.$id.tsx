import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, MapPin, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageShell } from "@/components/site/PageShell";
import { AuthGate, FollowButton, PostCard, UserChip, typeLabel } from "@/components/media/MediaBits";
import { updateAccount, useMe, useStore, followStatus } from "@/lib/store";

export const Route = createFileRoute("/media/u/$id")({
  head: () => ({ meta: [{ title: "Profile — Kalawar Media" }, { name: "description", content: "Athlete profile, posts, followers and following on Kalawar Media." }, { property: "og:title", content: "Profile — Kalawar Media" }, { property: "og:description", content: "Athlete profile on Kalawar Media." }] }),
  component: Profile,
});

function Profile() {
  const { id } = Route.useParams();
  const me = useMe();
  const user = useStore((s) => s.accounts.find((a) => a.id === id));
  const posts = useStore((s) => s.posts.filter((p) => p.authorId === id));
  const follows = useStore((s) => s.follows);
  const accounts = useStore((s) => s.accounts);
  const canSee = useStore((s) => !user?.private || me?.id === id || (me && followStatus(s, me.id, id) === "accepted"));
  const [list, setList] = useState<null | "followers" | "following">(null);
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  if (!user) return <PageShell><div className="py-32 text-center">Profile not found. <Link to="/media" className="text-primary">Back to Media</Link></div></PageShell>;
  const followers = follows.filter((f) => f.to === id && f.status === "accepted").map((f) => f.from);
  const following = follows.filter((f) => f.from === id && f.status === "accepted").map((f) => f.to);
  const people = (list === "followers" ? followers : following).map((x) => accounts.find((a) => a.id === x)!).filter(Boolean);
  const openPost = posts.find((p) => p.id === open);

  return (
    <PageShell>
      <AuthGate />
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <Avatar className="h-36 w-36 ring-4 ring-primary/50"><AvatarImage src={user.avatar} className="object-cover" /><AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3"><h1 className="font-display text-5xl tracking-wide">{user.name}</h1>{user.private && <Lock className="h-5 w-5 text-muted-foreground" />}</div>
            <div className="text-sm text-muted-foreground">@{user.handle} · <span className="text-primary">{typeLabel(user)}</span>{user.city && <> · <MapPin className="inline h-3.5 w-3.5" /> {user.city}</>}</div>
            {user.bio && <p>{user.bio}</p>}
            <div className="flex gap-6 text-sm"><span><b>{posts.length}</b> posts</span><button onClick={() => setList("followers")}><b>{followers.length}</b> followers</button><button onClick={() => setList("following")}><b>{following.length}</b> following</button></div>
            <div className="flex gap-2">{me?.id === id ? <Button variant="outline" className="rounded-full" onClick={() => setEditing(true)}>Edit profile</Button> : <FollowButton target={user} size="default" />}</div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          {canSee ? (
            posts.length ? <div className="grid grid-cols-3 gap-2">{posts.map((p) => <button key={p.id} onClick={() => setOpen(p.id)} className="group relative aspect-square overflow-hidden rounded-lg"><img src={p.kind === "video" ? p.poster ?? "" : p.src} alt={p.caption} loading="lazy" className="h-full w-full bg-muted object-cover transition-transform group-hover:scale-105" />{p.kind === "video" && <PlayCircle className="absolute right-2 top-2 h-6 w-6" />}</button>)}</div>
              : <p className="py-16 text-center text-muted-foreground">No posts yet.</p>
          ) : (
            <div className="py-16 text-center"><Lock className="mx-auto mb-3 h-10 w-10 text-primary" /><div className="font-display text-3xl">This account is private</div><p className="text-sm text-muted-foreground">Send a follow request to see their posts.</p></div>
          )}
        </div>
      </div>
      <Dialog open={!!list} onOpenChange={(o) => !o && setList(null)}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle className="font-display text-3xl capitalize tracking-wide">{list}</DialogTitle></DialogHeader>
          <div className="max-h-96 space-y-4 overflow-y-auto">{people.length ? people.map((a) => <div key={a.id} className="flex items-center justify-between" onClick={() => setList(null)}><UserChip a={a} /><FollowButton target={a} /></div>) : <p className="text-sm text-muted-foreground">No one yet.</p>}</div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!openPost} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg p-0">{openPost && <PostCard post={openPost} />}</DialogContent>
      </Dialog>
      {me?.id === id && <EditProfile open={editing} onOpenChange={setEditing} />}
    </PageShell>
  );
}

function EditProfile({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const me = useMe()!;
  const [f, setF] = useState({ name: me.name, bio: me.bio ?? "", city: me.city ?? "", private: !!me.private });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent><DialogHeader><DialogTitle className="font-display text-3xl tracking-wide">Edit profile</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); updateAccount(me.id, f); toast.success("Profile updated"); onOpenChange(false); }}>
          <div className="space-y-2"><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>City</Label><Input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
          <div className="space-y-2"><Label>Bio</Label><Textarea value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></div>
          <label className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">Private account — approve follow requests<Switch checked={f.private} onCheckedChange={(c) => setF({ ...f, private: c })} /></label>
          <Button type="submit" className="w-full rounded-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

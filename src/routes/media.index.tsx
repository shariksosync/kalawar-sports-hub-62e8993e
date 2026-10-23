import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, PlayCircle, Grid3x3, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import { AuthGate, FollowButton, PostCard, UserChip, useGuard } from "@/components/media/MediaBits";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useMe, useStore } from "@/lib/store";

export const Route = createFileRoute("/media/")({
  head: () => ({ meta: [{ title: "Media — Kalawar Hub" }, { name: "description", content: "Watch training clips and match highlights, follow athletes, gyms and academies." }, { property: "og:title", content: "Kalawar Media" }, { property: "og:description", content: "Videos and photos from the sports community." }] }),
  component: MediaHome,
});

function MediaHome() {
  const me = useMe();
  const guard = useGuard();
  const posts = useStore((s) => s.posts);
  const accounts = useStore((s) => s.accounts);
  const [view, setView] = useState<"feed" | "grid">("feed");
  const [filter, setFilter] = useState<"all" | "video" | "image" | "following">("all");
  const [up, setUp] = useState(false);
  const following = useStore((s) => (me ? s.follows.filter((f) => f.from === me.id && f.status === "accepted").map((f) => f.to) : []));
  const list = posts.filter((p) => filter === "all" || (filter === "following" ? following.includes(p.authorId) : p.kind === filter));
  const suggested = accounts.filter((a) => a.id !== me?.id).slice(0, 6);

  return (
    <PageShell>
      <AuthGate />
      {me && <UploadDialog open={up} onOpenChange={setUp} meId={me.id} />}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div><h1 className="font-display text-5xl tracking-wide">Media</h1><p className="text-sm text-muted-foreground">Highlights from athletes, coaches, gyms and academies.</p></div>
            <Button className="rounded-full" onClick={() => guard("upload videos and photos", () => setUp(true))}><Plus className="mr-1 h-4 w-4" />Upload</Button>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {(["all", "video", "image", "following"] as const).map((f) => <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="rounded-full capitalize" onClick={() => (f === "following" ? guard("see posts from people you follow", () => setFilter(f)) : setFilter(f))}>{f === "image" ? "Photos" : f === "video" ? "Videos" : f}</Button>)}
            <div className="ml-auto flex gap-1">
              <Button size="icon" variant={view === "feed" ? "secondary" : "ghost"} onClick={() => setView("feed")} aria-label="Feed view"><Rows3 className="h-4 w-4" /></Button>
              <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} onClick={() => setView("grid")} aria-label="Grid view"><Grid3x3 className="h-4 w-4" /></Button>
            </div>
          </div>
          {list.length === 0 && <div className="rounded-2xl border border-border p-12 text-center text-muted-foreground">Nothing here yet. Follow some athletes to fill your feed.</div>}
          {view === "feed" ? (
            <div className="mx-auto max-w-xl space-y-6">{list.map((p) => <PostCard key={p.id} post={p} />)}</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {list.map((p) => (
                <Link key={p.id} to="/media/u/$id" params={{ id: p.authorId }} className="group relative aspect-square overflow-hidden rounded-lg">
                  <img src={p.kind === "video" ? p.poster ?? "" : p.src} alt={p.caption} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  {p.kind === "video" && <PlayCircle className="absolute right-2 top-2 h-6 w-6 text-foreground" />}
                </Link>
              ))}
            </div>
          )}
        </div>
        <aside className="space-y-6">
          {me ? (
            <div className="rounded-2xl border border-border bg-card p-5"><UserChip a={me} /><Button asChild variant="outline" size="sm" className="mt-4 w-full rounded-full"><Link to="/media/u/$id" params={{ id: me.id }}>View my profile</Link></Button></div>
          ) : (
            <div className="rounded-2xl border border-primary/30 bg-card p-5"><div className="font-display text-2xl tracking-wide">Join the community</div><p className="mt-1 text-sm text-muted-foreground">Upload, like, comment and follow athletes.</p><div className="mt-4 flex gap-2"><Button asChild size="sm" className="flex-1 rounded-full"><Link to="/media/register">Register</Link></Button><Button asChild size="sm" variant="outline" className="flex-1 rounded-full"><Link to="/media/login">Sign in</Link></Button></div></div>
          )}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 text-sm font-semibold text-muted-foreground">Suggested for you</div>
            <div className="space-y-4">{suggested.map((a) => <div key={a.id} className="flex items-center justify-between gap-2"><UserChip a={a} /><FollowButton target={a} /></div>)}</div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

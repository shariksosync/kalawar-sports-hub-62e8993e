import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import { UserChip } from "@/components/media/MediaBits";
import { respondRequest, useMe, useStore } from "@/lib/store";

export const Route = createFileRoute("/media/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Kalawar Media" }, { name: "description", content: "Follow requests and activity on your Kalawar Media account." }, { property: "og:title", content: "Notifications — Kalawar Media" }, { property: "og:description", content: "Your Kalawar Media activity." }] }),
  component: Notifications,
});

function Notifications() {
  const me = useMe();
  const notices = useStore((s) => (me ? s.notices.filter((n) => n.to === me.id).sort((a, b) => b.at - a.at) : []));
  const requests = useStore((s) => (me ? s.follows.filter((f) => f.to === me.id && f.status === "pending") : []));
  const accounts = useStore((s) => s.accounts);
  if (!me) return <PageShell><div className="py-32 text-center"><p className="mb-4 text-muted-foreground">Sign in to see your notifications.</p><Button asChild className="rounded-full"><Link to="/media/login">Sign in</Link></Button></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Notifications</h1>
        {requests.length > 0 && (
          <section className="mb-8 rounded-2xl border border-primary/30 bg-card p-5">
            <div className="mb-4 font-semibold">Follow requests</div>
            <div className="space-y-4">{requests.map((r) => { const a = accounts.find((x) => x.id === r.from); return a && <div key={r.from} className="flex items-center justify-between gap-2"><UserChip a={a} /><div className="flex gap-2"><Button size="sm" className="rounded-full" onClick={() => respondRequest(me.id, r.from, true)}>Accept</Button><Button size="sm" variant="outline" className="rounded-full" onClick={() => respondRequest(me.id, r.from, false)}>Decline</Button></div></div>; })}</div>
          </section>
        )}
        <div className="space-y-3">
          {notices.filter((n) => !n.text.includes("requested")).map((n) => { const a = accounts.find((x) => x.id === n.from); return a && <div key={n.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4"><UserChip a={a} sub={n.text} /></div>; })}
          {notices.length === 0 && requests.length === 0 && <p className="text-muted-foreground">You're all caught up.</p>}
        </div>
      </div>
    </PageShell>
  );
}

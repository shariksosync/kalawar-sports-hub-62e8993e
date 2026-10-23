import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Star, Users, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/academies/$id")({
  head: () => ({ meta: [{ title: "Academy details — Kalawar Hub" }, { name: "description", content: "Programs, batches and coaches at this sports academy." }, { property: "og:title", content: "Academy details — Kalawar Hub" }, { property: "og:description", content: "Programs, batches and coaches." }] }),
  component: AcademyDetail,
});

function AcademyDetail() {
  const { id } = Route.useParams();
  const a = useStore((s) => s.academies.find((x) => x.id === id));
  const batches = useStore((s) => s.partnerData[id]?.batches ?? []);
  if (!a) return <PageShell><div className="py-32 text-center">Academy not found. <Link to="/academies" className="text-primary">Back</Link></div></PageShell>;
  return (
    <PageShell>
      <div className="relative h-[420px]"><img src={a.image} alt={a.name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-bottom" /></div>
      <div className="relative mx-auto -mt-40 max-w-7xl px-4 pb-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{a.sport}</span>
            <h1 className="font-display text-6xl tracking-wide">{a.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1 text-primary"><Star className="h-4 w-4 fill-current" />{a.rating}</span><span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{a.address}</span><span className="flex items-center gap-1"><Users className="h-4 w-4" />{a.ageGroups}</span><span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" />{a.coaches} coaches</span></div>
            <p className="text-lg text-muted-foreground">{a.about}</p>
            {batches.length > 0 && <div><h2 className="mb-3 font-display text-3xl tracking-wide">Batches</h2><div className="grid gap-4 md:grid-cols-2">{batches.map((b) => <div key={b.id} className="rounded-xl border border-border bg-card p-5"><div className="font-display text-2xl">{b.name} <span className="text-base text-primary">· {b.ageGroup}</span></div><div className="text-sm text-muted-foreground">{b.days} · {b.time}</div><div className="mt-1 text-sm">Coach: {b.coach}</div></div>)}</div></div>}
          </div>
          <aside className="glass h-fit rounded-2xl p-6">
            <div className="text-sm text-muted-foreground">Fees from</div>
            <div className="font-display text-5xl text-primary">₹{a.feeFrom.toLocaleString("en-IN")}<span className="text-base text-muted-foreground">/mo</span></div>
            <Button size="lg" className="mt-6 w-full rounded-full" onClick={() => toast.success("Admission enquiry sent! The academy will contact you.")}>Enquire for admission</Button>
            <a href={`tel:${a.phone}`} className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{a.phone}</a>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

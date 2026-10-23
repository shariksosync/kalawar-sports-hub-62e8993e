import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Star, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/gyms/$id")({
  head: () => ({ meta: [{ title: "Gym details — Kalawar Hub" }, { name: "description", content: "Facilities, timings and membership plans for this gym." }, { property: "og:title", content: "Gym details — Kalawar Hub" }, { property: "og:description", content: "Facilities, timings and membership plans." }] }),
  component: GymDetail,
});

function GymDetail() {
  const { id } = Route.useParams();
  const g = useStore((s) => s.gyms.find((x) => x.id === id));
  const plans = useStore((s) => s.partnerData[id]?.plans ?? []);
  if (!g) return <PageShell><div className="py-32 text-center">Gym not found. <Link to="/gyms" className="text-primary">Back to gyms</Link></div></PageShell>;
  return (
    <PageShell>
      <div className="relative h-[420px]"><img src={g.image} alt={g.name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-bottom" /></div>
      <div className="relative mx-auto -mt-40 max-w-7xl px-4 pb-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <h1 className="font-display text-6xl tracking-wide">{g.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1 text-primary"><Star className="h-4 w-4 fill-current" />{g.rating}</span><span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{g.address}</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />{g.timings}</span></div>
            <p className="text-lg text-muted-foreground">{g.about}</p>
            <div><h2 className="mb-3 font-display text-3xl tracking-wide">Facilities</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{g.facilities.map((f) => <div key={f} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm"><Check className="h-4 w-4 text-primary" />{f}</div>)}</div></div>
            {plans.length > 0 && <div><h2 className="mb-3 font-display text-3xl tracking-wide">Membership plans</h2><div className="grid gap-4 md:grid-cols-2">{plans.map((p) => <div key={p.id} className="rounded-xl border border-border bg-card p-5"><div className="font-display text-2xl">{p.name}</div><div className="text-sm text-muted-foreground">{p.duration} · {p.perks}</div><div className="mt-2 font-display text-3xl text-primary">₹{Number(p.price).toLocaleString("en-IN")}</div></div>)}</div></div>}
          </div>
          <aside className="glass h-fit rounded-2xl p-6">
            <div className="text-sm text-muted-foreground">Memberships from</div>
            <div className="font-display text-5xl text-primary">₹{g.priceFrom.toLocaleString("en-IN")}<span className="text-base text-muted-foreground">/mo</span></div>
            <Button size="lg" className="mt-6 w-full rounded-full" onClick={() => toast.success("Enquiry sent! The gym will call you shortly.")}>Book a free trial</Button>
            <a href={`tel:${g.phone}`} className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{g.phone}</a>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

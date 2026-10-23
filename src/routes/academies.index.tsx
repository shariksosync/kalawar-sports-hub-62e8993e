import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Search, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { IMAGES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/academies/")({
  head: () => ({ meta: [{ title: "Sports Academies — Kalawar Hub" }, { name: "description", content: "Browse registered sports academies by sport and city, or register your academy as a partner." }, { property: "og:title", content: "Sports Academies — Kalawar Hub" }, { property: "og:description", content: "Find academies with certified coaches." }] }),
  component: AcademyList,
});

function AcademyList() {
  const all = useStore((s) => s.academies);
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("All");
  const sports = ["All", ...Array.from(new Set(all.map((a) => a.sport)))];
  const list = useMemo(() => all.filter((a) => (sport === "All" || a.sport === sport) && (a.name + a.city).toLowerCase().includes(q.toLowerCase())), [all, q, sport]);
  return (
    <PageShell>
      <PageHero image={IMAGES.academy} eyebrow="Sports Academy" title={<>Where champions <span className="text-gradient-gold">begin</span></>} text="Structured coaching, age-group batches and competition pathways.">
        <Button asChild size="lg" className="rounded-full"><Link to="/academies/register">Join as a Partner</Link></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/academies/login">Partner login</Link></Button>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search academies or cities" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="flex flex-wrap gap-2">{sports.map((c) => <Button key={c} size="sm" variant={sport === c ? "default" : "outline"} className="rounded-full" onClick={() => setSport(c)}>{c}</Button>)}</div>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{list.length} registered academies</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <Link key={a.id} to="/academies/$id" params={{ id: a.id }} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-gold">
              <div className="relative aspect-[16/10] overflow-hidden"><img src={a.image} alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{a.sport}</span></div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2"><h3 className="font-display text-2xl tracking-wide">{a.name}</h3><span className="flex items-center gap-1 text-sm text-primary"><Star className="h-4 w-4 fill-current" />{a.rating}</span></div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{a.address}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-3.5 w-3.5" />{a.ageGroups} · {a.coaches} coaches</p>
                <div className="flex items-center justify-between border-t border-border pt-3"><span className="text-sm text-muted-foreground">Fees from</span><span className="font-display text-2xl text-primary">₹{a.feeFrom.toLocaleString("en-IN")}<span className="text-sm text-muted-foreground">/mo</span></span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

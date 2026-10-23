import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Search, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHero, PageShell } from "@/components/site/PageShell";
import { IMAGES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/gyms/")({
  head: () => ({ meta: [{ title: "GYM & Fitness Clubs — Kalawar Hub" }, { name: "description", content: "Browse registered gyms and fitness clubs, compare facilities and membership prices, or join as a partner." }, { property: "og:title", content: "GYM & Fitness — Kalawar Hub" }, { property: "og:description", content: "Find verified gyms and fitness clubs near you." }] }),
  component: GymList,
});

function GymList() {
  const gyms = useStore((s) => s.gyms);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const cities = ["All", ...Array.from(new Set(gyms.map((g) => g.city)))];
  const list = useMemo(() => gyms.filter((g) => (city === "All" || g.city === city) && (g.name + g.facilities.join(" ")).toLowerCase().includes(q.toLowerCase())), [gyms, q, city]);
  return (
    <PageShell>
      <PageHero image={IMAGES.gym} eyebrow="GYM & Fitness" title={<>Find your <span className="text-gradient-gold">gym</span></>} text="Verified fitness clubs with transparent plans, timings and facilities.">
        <Button asChild size="lg" className="rounded-full"><Link to="/gyms/register">Join as a Partner</Link></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/gyms/login">Partner login</Link></Button>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search gyms or facilities" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="flex flex-wrap gap-2">{cities.map((c) => <Button key={c} size="sm" variant={city === c ? "default" : "outline"} className="rounded-full" onClick={() => setCity(c)}>{c}</Button>)}</div>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{list.length} registered gyms</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <Link key={g.id} to="/gyms/$id" params={{ id: g.id }} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-gold">
              <div className="aspect-[16/10] overflow-hidden"><img src={g.image} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2"><h3 className="font-display text-2xl tracking-wide">{g.name}</h3><span className="flex items-center gap-1 text-sm text-primary"><Star className="h-4 w-4 fill-current" />{g.rating}</span></div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{g.address}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" />{g.timings}</p>
                <div className="flex flex-wrap gap-1.5">{g.facilities.slice(0, 4).map((f) => <Badge key={f} variant="secondary">{f}</Badge>)}</div>
                <div className="flex items-center justify-between border-t border-border pt-3"><span className="text-sm text-muted-foreground">From</span><span className="font-display text-2xl text-primary">₹{g.priceFrom.toLocaleString("en-IN")}<span className="text-sm text-muted-foreground">/mo</span></span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, Dumbbell, Medal, PlayCircle, Swords, Trophy, Users, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import { IMAGES, KALAWAR_URL } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalawar Hub — Martial Arts, Gyms, Academies & Athlete Media" },
      { name: "description", content: "Discover Kalawar championships, premium gyms, top sports academies and a media community for athletes." },
      { property: "og:title", content: "Kalawar Hub" },
      { property: "og:description", content: "Martial arts, gyms, sports academies and athlete media in one place." },
    ],
  }),
  component: Home,
});

const portals = [
  { title: "Kalawar", text: "Championships, rankings & certification", icon: Swords, href: KALAWAR_URL, external: true },
  { title: "GYM & Fitness", text: "Find and join premium gyms", icon: Dumbbell, to: "/gyms" as const },
  { title: "Sports Academy", text: "Train with certified coaches", icon: Medal, to: "/academies" as const },
  { title: "Media", text: "Watch, share & follow athletes", icon: PlayCircle, to: "/media" as const },
];

function PortalBox({ p }: { p: (typeof portals)[number] }) {
  const inner = (
    <>
      <p.icon className="h-7 w-7 text-primary" />
      <div className="mt-4 font-display text-2xl tracking-wide">{p.title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{p.text}</p>
      <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </>
  );
  const cls = "group glass relative block rounded-xl p-5 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-gold";
  return p.external ? <a href={p.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a> : <Link to={p.to!} className={cls}>{inner}</Link>;
}

function Slide({ image, children }: { image: string; children: React.ReactNode }) {
  return (
    <div className="relative min-w-0 flex-[0_0_100%]">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1088} />
      <div className="absolute inset-0 bg-gradient-fade" />
      <div className="absolute inset-0 bg-gradient-bottom" />
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">{children}</div>
    </div>
  );
}

function SlideText({ eyebrow, title, text, cta }: { eyebrow: string; title: React.ReactNode; text: string; cta: React.ReactNode }) {
  return (
    <div className="max-w-xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-6xl leading-[0.95] tracking-wide md:text-7xl">{title}</h2>
      <p className="mt-4 text-muted-foreground">{text}</p>
      <div className="mt-8 flex flex-wrap gap-3">{cta}</div>
    </div>
  );
}

function Hero() {
  const [ref, api] = useEmblaCarousel({ loop: true });
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!api) return;
    const on = () => setIdx(api.selectedScrollSnap());
    api.on("select", on);
    const t = setInterval(() => api.scrollNext(), 7000);
    return () => { clearInterval(t); api.off("select", on); };
  }, [api]);

  return (
    <section className="relative">
      <div ref={ref} className="overflow-hidden">
        <div className="flex h-[640px]">
          <Slide image={IMAGES.hero}>
            <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
              <SlideText eyebrow="Welcome to Kalawar Hub" title={<>Train. Compete.<br /><span className="text-gradient-gold">Get seen.</span></>} text="One platform for martial arts championships, fitness clubs, sports academies and the athletes who make them great." cta={<><Button asChild size="lg" className="rounded-full"><Link to="/media">Explore Media</Link></Button><Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/gyms/register">Become a partner</Link></Button></>} />
              <div className="grid grid-cols-2 gap-4 lg:max-w-md lg:justify-self-end">
                {portals.map((p) => <PortalBox key={p.title} p={p} />)}
              </div>
            </div>
          </Slide>
          <Slide image={IMAGES.champ}>
            <SlideText eyebrow="Kalawar Championships" title={<>State Finals<br /><span className="text-gradient-gold">this season</span></>} text="Register as a player, coach, referee or club. Track rankings, belt gradings and certificates on the official Kalawar platform." cta={<Button asChild size="lg" className="rounded-full"><a href={KALAWAR_URL} target="_blank" rel="noreferrer">Visit Kalawar <ArrowRight className="ml-1 h-4 w-4" /></a></Button>} />
          </Slide>
          <Slide image={IMAGES.gym}>
            <SlideText eyebrow="GYM & Fitness" title={<>Premium gyms<br /><span className="text-gradient-gold">near you</span></>} text="Compare facilities, timings and membership plans from verified fitness clubs across India." cta={<><Button asChild size="lg" className="rounded-full"><Link to="/gyms">Browse gyms</Link></Button><Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/gyms/register">List your gym</Link></Button></>} />
          </Slide>
          <Slide image={IMAGES.academy}>
            <SlideText eyebrow="Sports Academy" title={<>Where champions<br /><span className="text-gradient-gold">begin</span></>} text="Cricket, football, swimming, boxing and more — find academies with certified coaches and structured batches." cta={<><Button asChild size="lg" className="rounded-full"><Link to="/academies">Find an academy</Link></Button><Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/academies/register">Register academy</Link></Button></>} />
          </Slide>
          <Slide image={IMAGES.boxing}>
            <SlideText eyebrow="Media" title={<>Your highlight reel<br /><span className="text-gradient-gold">deserves fans</span></>} text="Upload training clips and match moments, follow athletes and build your following across the sports community." cta={<><Button asChild size="lg" className="rounded-full"><Link to="/media">Watch now</Link></Button><Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/media/register">Create media account</Link></Button></>} />
          </Slide>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => api?.scrollTo(i)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-primary" : "w-5 bg-muted-foreground/40"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="rounded-full" onClick={() => api?.scrollPrev()} aria-label="Previous"><ChevronLeft /></Button>
          <Button size="icon" variant="outline" className="rounded-full" onClick={() => api?.scrollNext()} aria-label="Next"><ChevronRight /></Button>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const gyms = useStore((s) => s.gyms.slice(0, 3));
  const academies = useStore((s) => s.academies.slice(0, 3));
  const posts = useStore((s) => s.posts.filter((p) => p.kind === "image").slice(0, 4));
  const stats = [
    { icon: Users, n: "25K+", l: "Registered athletes" },
    { icon: Dumbbell, n: "120+", l: "Partner gyms" },
    { icon: Medal, n: "80+", l: "Sports academies" },
    { icon: Trophy, n: "300+", l: "Championships hosted" },
  ];
  return (
    <PageShell>
      <Hero />
      <section className="border-y border-border bg-sidebar">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center gap-4">
              <s.icon className="h-8 w-8 text-primary" />
              <div><div className="font-display text-4xl tracking-wide">{s.n}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Featured gyms" title="Train at the best" to="/gyms">
        <div className="grid gap-6 md:grid-cols-3">
          {gyms.map((g) => (
            <Link key={g.id} to="/gyms/$id" params={{ id: g.id }} className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden"><img src={g.image} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
              <div className="p-5">
                <div className="flex items-center justify-between"><h3 className="font-display text-2xl tracking-wide">{g.name}</h3><span className="flex items-center gap-1 text-sm text-primary"><Star className="h-4 w-4 fill-current" />{g.rating}</span></div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{g.city} · from ₹{g.priceFrom.toLocaleString("en-IN")}/mo</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sports academies" title="Coaching that builds careers" to="/academies">
        <div className="grid gap-6 md:grid-cols-3">
          {academies.map((a) => (
            <Link key={a.id} to="/academies/$id" params={{ id: a.id }} className="group relative overflow-hidden rounded-2xl">
              <img src={a.image} alt={a.name} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-bottom" />
              <div className="absolute bottom-0 p-5"><span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{a.sport}</span><h3 className="mt-3 font-display text-3xl tracking-wide">{a.name}</h3><p className="text-sm text-muted-foreground">{a.city} · {a.ageGroups}</p></div>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Trending on Media" title="Moments from the community" to="/media">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {posts.map((p) => (
            <Link key={p.id} to="/media" className="group overflow-hidden rounded-xl"><img src={p.src} alt={p.caption} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" /></Link>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 p-10 md:p-16">
          <img src={IMAGES.gym} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-fade" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-5xl tracking-wide md:text-6xl">Run a gym or academy?</h2>
            <p className="mt-3 text-muted-foreground">Get listed and manage members, subscriptions, staff, fees and revenue from your own admin panel.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full"><Link to="/gyms/register">Register a gym</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/academies/register">Register an academy</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Section({ eyebrow, title, to, children }: { eyebrow: string; title: string; to: "/gyms" | "/academies" | "/media"; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</p><h2 className="mt-2 font-display text-5xl tracking-wide">{title}</h2></div>
        <Link to={to} className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex">View all <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {children}
    </section>
  );
}

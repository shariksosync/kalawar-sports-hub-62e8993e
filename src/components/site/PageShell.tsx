import type { ReactNode } from "react";
import { SiteFooter, SiteNav } from "./SiteNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ image, eyebrow, title, text, children }: { image: string; eyebrow: string; title: ReactNode; text: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1088} />
      <div className="absolute inset-0 bg-gradient-fade" />
      <div className="absolute inset-0 bg-gradient-bottom" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-6xl leading-none tracking-wide md:text-7xl">{title}</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{text}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function AuthCard({ title, subtitle, children, aside }: { title: string; subtitle: string; children: ReactNode; aside: string }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden px-4 py-12 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-l-2xl lg:block">
        <img src={aside} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-bottom" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-8 lg:rounded-l-none lg:p-12">
        <h1 className="font-display text-5xl tracking-wide">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

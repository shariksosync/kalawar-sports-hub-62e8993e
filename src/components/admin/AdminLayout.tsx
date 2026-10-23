import { Link, Navigate, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, BarChart3, Settings, LogOut, ExternalLink, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Logo } from "@/components/site/SiteNav";
import type { ModuleDef } from "@/lib/admin-config";
import { logout, useHydrated, useMe, useStore } from "@/lib/store";

type Base = "/gym-admin" | "/academy-admin";

export function useAdminContext(kind: "gym" | "academy") {
  const me = useMe();
  const pid = me?.type === kind ? me.partnerId ?? "" : "";
  const partner = useStore((s) => (kind === "gym" ? s.gyms.find((g) => g.id === pid) : s.academies.find((a) => a.id === pid)));
  return { me, pid, partner };
}

export function AdminLayout({ kind, modules }: { kind: "gym" | "academy"; modules: ModuleDef[] }) {
  const hydrated = useHydrated();
  const { me, partner } = useAdminContext(kind);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const base: Base = kind === "gym" ? "/gym-admin" : "/academy-admin";
  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!me || me.type !== kind) return <Navigate to={kind === "gym" ? "/gyms/login" : "/academies/login"} />;

  const item = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground";
  const active = { className: "bg-sidebar-accent !text-primary" };
  const side = (
    <div className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-2"><Logo /></div>
      <div className="mb-4 rounded-xl border border-sidebar-border p-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{kind === "gym" ? "Gym" : "Academy"}</div>
        <div className="truncate font-semibold">{partner?.name ?? me.name}</div>
      </div>
      <Link to={base} activeOptions={{ exact: true }} className={item} activeProps={active} onClick={() => setOpen(false)}><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
      {modules.map((m) => (
        <Link key={m.slug} to={`${base}/$module`} params={{ module: m.slug }} className={item} activeProps={active} onClick={() => setOpen(false)}><m.icon className="h-4 w-4" />{m.title}</Link>
      ))}
      <Link to={`${base}/reports`} className={item} activeProps={active} onClick={() => setOpen(false)}><BarChart3 className="h-4 w-4" />{kind === "gym" ? "Sales Reports" : "Revenue Reports"}</Link>
      <Link to={`${base}/settings`} className={item} activeProps={active} onClick={() => setOpen(false)}><Settings className="h-4 w-4" />Profile & Settings</Link>
      <div className="mt-auto space-y-1 border-t border-sidebar-border pt-3">
        {partner && <Link to={kind === "gym" ? "/gyms/$id" : "/academies/$id"} params={{ id: partner.id }} className={item}><ExternalLink className="h-4 w-4" />View public page</Link>}
        <button className={item + " w-full"} onClick={() => { logout(); nav({ to: "/" }); }}><LogOut className="h-4 w-4" />Sign out</button>
      </div>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-background font-sans">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar lg:block">{side}</aside>
      <Sheet open={open} onOpenChange={setOpen}><SheetContent side="left" className="w-64 bg-sidebar p-0">{side}</SheetContent></Sheet>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu"><Menu /></Button>
          <div className="text-sm text-muted-foreground">Welcome back, <span className="text-foreground">{me.name}</span></div>
          <Button asChild variant="outline" size="sm" className="rounded-full"><Link to="/">Main site</Link></Button>
        </header>
        <div className="p-4 lg:p-8"><Outlet /></div>
      </div>
    </div>
  );
}

export function AdminTitle({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-display text-5xl tracking-wide">{title}</h1>{text && <p className="text-sm text-muted-foreground">{text}</p>}</div>
      {children}
    </div>
  );
}

export function Kpi({ label, value, hint, icon: Icon }: { label: string; value: string; hint?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">{label}<Icon className="h-4 w-4 text-primary" /></div>
      <div className="mt-2 font-display text-4xl tracking-wide">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

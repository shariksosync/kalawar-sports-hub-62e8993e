import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, LogOut, LayoutDashboard, UserRound, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KALAWAR_URL } from "@/lib/data";
import { logout, useMe, useStore } from "@/lib/store";

const linkCls = "text-sm font-semibold tracking-wide text-muted-foreground transition-colors hover:text-primary";
const activeCls = { className: "text-primary" };

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold font-display text-xl text-primary-foreground">K</span>
      <span className="font-display text-2xl tracking-wider">KALAWAR <span className="text-gradient-gold">HUB</span></span>
    </Link>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link to="/" className={linkCls} activeProps={activeCls} activeOptions={{ exact: true }} onClick={onClick}>Home</Link>
      <a href={KALAWAR_URL} target="_blank" rel="noreferrer" className={linkCls} onClick={onClick}>Kalawar</a>
      <Link to="/gyms" className={linkCls} activeProps={activeCls} onClick={onClick}>GYM & Fitness</Link>
      <Link to="/academies" className={linkCls} activeProps={activeCls} onClick={onClick}>Sports Academy</Link>
      <Link to="/media" className={linkCls} activeProps={activeCls} onClick={onClick}>Media</Link>
    </>
  );
}

export function SiteNav() {
  const me = useMe();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const unread = useStore((s) => (me ? s.notices.filter((n) => n.to === me.id).length : 0));
  const panel = me?.type === "gym" ? "/gym-admin" : me?.type === "academy" ? "/academy-admin" : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex"><NavLinks /></nav>
        <div className="flex items-center gap-2">
          {me ? (
            <>
              <Button variant="ghost" size="icon" className="relative" onClick={() => nav({ to: "/media/notifications" })} aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full ring-2 ring-primary/40">
                  <Avatar className="h-9 w-9"><AvatarImage src={me.avatar} className="object-cover" /><AvatarFallback>{me.name[0]}</AvatarFallback></Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{me.name}<div className="text-xs font-normal text-muted-foreground">@{me.handle}</div></DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {panel && <DropdownMenuItem onClick={() => nav({ to: panel })}><LayoutDashboard className="mr-2 h-4 w-4" />Admin panel</DropdownMenuItem>}
                  <DropdownMenuItem onClick={() => nav({ to: "/media/u/$id", params: { id: me.id } })}><UserRound className="mr-2 h-4 w-4" />Media profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); nav({ to: "/" }); }}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" className="hidden rounded-full sm:inline-flex"><Link to="/login">Sign in</Link></Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu"><Menu /></Button></SheetTrigger>
            <SheetContent className="flex flex-col gap-6 pt-12">
              <NavLinks onClick={() => setOpen(false)} />
              {!me && <Link to="/login" className={linkCls} onClick={() => setOpen(false)}>Sign in</Link>}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">One home for martial arts, fitness clubs, sports academies and the athletes who make them great.</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="font-display text-lg tracking-wider">Explore</div>
          <a href={KALAWAR_URL} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-primary">Kalawar</a>
          <Link to="/gyms" className="block text-muted-foreground hover:text-primary">GYM & Fitness</Link>
          <Link to="/academies" className="block text-muted-foreground hover:text-primary">Sports Academy</Link>
          <Link to="/media" className="block text-muted-foreground hover:text-primary">Media</Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="font-display text-lg tracking-wider">Partners</div>
          <Link to="/gyms/register" className="block text-muted-foreground hover:text-primary">Register your gym</Link>
          <Link to="/academies/register" className="block text-muted-foreground hover:text-primary">Register your academy</Link>
          <Link to="/media/register" className="block text-muted-foreground hover:text-primary">Join Media</Link>
          <Link to="/login" className="block text-muted-foreground hover:text-primary">Sign in</Link>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 Kalawar Hub. All rights reserved.</div>
    </footer>
  );
}

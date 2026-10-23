import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Account } from "@/lib/data";
import { login } from "@/lib/store";

export function destinationFor(a: Account) {
  return a.type === "gym" ? "/gym-admin" : a.type === "academy" ? "/academy-admin" : "/media";
}

export function LoginForm({ types, sample, registerTo, registerLabel }: { types?: Account["type"][]; sample?: { email: string; password: string }; registerTo: "/gyms/register" | "/academies/register" | "/media/register"; registerLabel: string }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const r = login(email, password, types);
        if (typeof r === "string") return setErr(r);
        toast.success(`Welcome back, ${r.name}`);
        nav({ to: destinationFor(r) });
      }}
    >
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
      <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <Button type="submit" size="lg" className="w-full rounded-full">Sign in</Button>
      <p className="text-center text-sm text-muted-foreground">New here? <Link to={registerTo} className="font-semibold text-primary">{registerLabel}</Link></p>
      {sample && (
        <button type="button" onClick={() => { setEmail(sample.email); setPassword(sample.password); }} className="w-full rounded-lg border border-dashed border-border p-3 text-left text-xs text-muted-foreground hover:border-primary/50">
          Sample account: <span className="text-foreground">{sample.email}</span> / <span className="text-foreground">{sample.password}</span> — tap to fill
        </button>
      )}
    </form>
  );
}

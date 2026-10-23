import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { Field } from "@/components/site/FormBits";
import { IMAGES, KALAWAR_ROLES } from "@/lib/data";
import { registerAccount } from "@/lib/store";

export const Route = createFileRoute("/media/register")({
  head: () => ({ meta: [{ title: "Join Kalawar Media" }, { name: "description", content: "Create a Kalawar Media account to upload, like, comment and follow athletes." }, { property: "og:title", content: "Join Kalawar Media" }, { property: "og:description", content: "Create your athlete media account." }] }),
  component: MediaRegister,
});

function MediaRegister() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", handle: "", email: "", password: "", city: "", bio: "", kind: "Creator" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <PageShell>
      <AuthCard title="Join Media" subtitle="Share your journey and follow the athletes you admire." aside={IMAGES.boxing}>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const isK = f.kind !== "Creator";
          const r = registerAccount({ name: f.name, handle: f.handle.replace(/^@/, "").toLowerCase(), email: f.email, password: f.password, city: f.city, bio: f.bio, type: isK ? "kalawar" : "media", role: isK ? f.kind : undefined });
          if (typeof r === "string") return toast.error(r);
          toast.success("Welcome to Kalawar Media!");
          nav({ to: "/media" });
        }}>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Full name"><Input required value={f.name} onChange={set("name")} /></Field><Field label="Username"><Input required pattern="[A-Za-z0-9._@]+" value={f.handle} onChange={set("handle")} placeholder="@yourname" /></Field></div>
          <Field label="I am a"><Select value={f.kind} onValueChange={(v) => setF({ ...f, kind: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Creator">Fan / Creator</SelectItem>{KALAWAR_ROLES.map((r) => <SelectItem key={r} value={r}>Kalawar {r}</SelectItem>)}</SelectContent></Select></Field>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Email"><Input type="email" required value={f.email} onChange={set("email")} /></Field><Field label="Password"><Input type="password" required minLength={6} value={f.password} onChange={set("password")} /></Field></div>
          <Field label="City"><Input value={f.city} onChange={set("city")} /></Field>
          <Field label="Bio"><Textarea rows={2} value={f.bio} onChange={set("bio")} /></Field>
          <Button type="submit" size="lg" className="w-full rounded-full">Create account</Button>
          <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/media/login" className="font-semibold text-primary">Sign in</Link></p>
        </form>
      </AuthCard>
    </PageShell>
  );
}

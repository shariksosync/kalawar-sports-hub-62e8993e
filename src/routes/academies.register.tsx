import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { Field, Steps } from "@/components/site/FormBits";
import { IMAGES } from "@/lib/data";
import { registerAcademy } from "@/lib/store";

export const Route = createFileRoute("/academies/register")({
  head: () => ({ meta: [{ title: "Register your Sports Academy — Kalawar Hub" }, { name: "description", content: "List your sports academy and manage students, batches, coaches and fees from your own admin panel." }, { property: "og:title", content: "Register your Sports Academy" }, { property: "og:description", content: "Join Kalawar Hub as an academy partner." }] }),
  component: AcademyRegister,
});

const SPORTS = ["Cricket", "Football", "Swimming", "Boxing", "Kalaripayattu", "Badminton", "Tennis", "Athletics", "Basketball", "Karate"];
const imageFor = (s: string) => ({ Cricket: IMAGES.cricket, Swimming: IMAGES.swim, Boxing: IMAGES.boxing, Kalaripayattu: IMAGES.hero, Karate: IMAGES.hero }[s] ?? IMAGES.academy);

function AcademyRegister() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ owner: "", email: "", phone: "", password: "", name: "", sport: "Cricket", city: "", address: "", ageGroups: "U-10 to U-16", feeFrom: "2500", coaches: "3", about: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = () => {
    const img = imageFor(f.sport);
    const r = registerAcademy(
      { email: f.email, password: f.password, name: f.name, handle: f.name.toLowerCase().replace(/[^a-z0-9]+/g, ""), city: f.city, bio: f.about, avatar: img },
      { name: f.name, sport: f.sport, city: f.city, address: f.address, image: img, ageGroups: f.ageGroups, feeFrom: Number(f.feeFrom) || 0, coaches: Number(f.coaches) || 0, about: f.about || `${f.sport} academy in ${f.city}.`, phone: f.phone },
    );
    if (typeof r === "string") { toast.error(r); setStep(0); return; }
    toast.success("Your academy is live! Welcome to your admin panel.");
    nav({ to: "/academy-admin" });
  };
  return (
    <PageShell>
      <AuthCard title="Join as an academy partner" subtitle="Get listed and run admissions, batches and fees from one panel." aside={IMAGES.academy}>
        <Steps step={step} labels={["Owner", "Academy", "Programs"]} />
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (step < 2) setStep(step + 1); else submit(); }}>
          {step === 0 && <>
            <Field label="Director / owner name"><Input required value={f.owner} onChange={set("owner")} /></Field>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Email"><Input type="email" required value={f.email} onChange={set("email")} /></Field><Field label="Phone"><Input required value={f.phone} onChange={set("phone")} /></Field></div>
            <Field label="Create password"><Input type="password" required minLength={6} value={f.password} onChange={set("password")} /></Field>
          </>}
          {step === 1 && <>
            <Field label="Academy name"><Input required value={f.name} onChange={set("name")} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Sport"><Select value={f.sport} onValueChange={(v) => setF({ ...f, sport: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
              <Field label="City"><Input required value={f.city} onChange={set("city")} /></Field>
            </div>
            <Field label="Full address"><Input required value={f.address} onChange={set("address")} /></Field>
          </>}
          {step === 2 && <>
            <div className="grid gap-4 md:grid-cols-3"><Field label="Age groups"><Input required value={f.ageGroups} onChange={set("ageGroups")} /></Field><Field label="Fee from (₹/mo)"><Input type="number" required value={f.feeFrom} onChange={set("feeFrom")} /></Field><Field label="No. of coaches"><Input type="number" required value={f.coaches} onChange={set("coaches")} /></Field></div>
            <Field label="About your academy"><Textarea rows={3} value={f.about} onChange={set("about")} /></Field>
          </>}
          <div className="flex gap-3 pt-2">
            {step > 0 && <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(step - 1)}>Back</Button>}
            <Button type="submit" size="lg" className="flex-1 rounded-full">{step < 2 ? "Continue" : "Create academy account"}</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">Already a partner? <Link to="/academies/login" className="font-semibold text-primary">Sign in</Link></p>
        </form>
      </AuthCard>
    </PageShell>
  );
}

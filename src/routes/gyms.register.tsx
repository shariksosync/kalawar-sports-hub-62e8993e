import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Steps } from "@/components/site/FormBits";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { IMAGES } from "@/lib/data";
import { registerGym } from "@/lib/store";

export const Route = createFileRoute("/gyms/register")({
  head: () => ({ meta: [{ title: "Register your Gym — Kalawar Hub" }, { name: "description", content: "List your gym on Kalawar Hub and get your own admin panel for members, subscriptions, staff and revenue." }, { property: "og:title", content: "Register your Gym" }, { property: "og:description", content: "Join Kalawar Hub as a gym partner." }] }),
  component: GymRegister,
});

const FACILITIES = ["Strength", "Cardio", "Personal Training", "Group Classes", "Yoga", "CrossFit", "Pool", "Steam", "Sauna", "Lockers", "Parking", "Cafe"];

function GymRegister() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ owner: "", email: "", phone: "", password: "", name: "", city: "", address: "", timings: "6:00 AM – 10:00 PM", priceFrom: "1999", about: "" });
  const [fac, setFac] = useState<string[]>(["Strength", "Cardio"]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = () => {
    const r = registerGym(
      { email: f.email, password: f.password, name: f.name, handle: f.name.toLowerCase().replace(/[^a-z0-9]+/g, ""), city: f.city, bio: f.about, avatar: IMAGES.gym },
      { name: f.name, city: f.city, address: f.address, image: IMAGES.gym, priceFrom: Number(f.priceFrom) || 0, facilities: fac, timings: f.timings, phone: f.phone, about: f.about || `${f.name} in ${f.city}.` },
    );
    if (typeof r === "string") { toast.error(r); setStep(0); return; }
    toast.success("Your gym is live! Welcome to your admin panel.");
    nav({ to: "/gym-admin" });
  };

  return (
    <PageShell>
      <AuthCard title="Join as a gym partner" subtitle="Get listed and manage your entire gym from one panel." aside={IMAGES.gym}>
        <Steps step={step} labels={["Owner", "Gym details", "Facilities"]} />
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (step < 2) setStep(step + 1); else submit(); }}>
          {step === 0 && <>
            <Field label="Owner full name"><Input required value={f.owner} onChange={set("owner")} /></Field>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Email"><Input type="email" required value={f.email} onChange={set("email")} /></Field><Field label="Phone"><Input required value={f.phone} onChange={set("phone")} /></Field></div>
            <Field label="Create password"><Input type="password" required minLength={6} value={f.password} onChange={set("password")} /></Field>
          </>}
          {step === 1 && <>
            <Field label="Gym name"><Input required value={f.name} onChange={set("name")} /></Field>
            <div className="grid gap-4 md:grid-cols-2"><Field label="City"><Input required value={f.city} onChange={set("city")} /></Field><Field label="Starting price (₹/month)"><Input type="number" required value={f.priceFrom} onChange={set("priceFrom")} /></Field></div>
            <Field label="Full address"><Input required value={f.address} onChange={set("address")} /></Field>
            <Field label="Timings"><Input required value={f.timings} onChange={set("timings")} /></Field>
          </>}
          {step === 2 && <>
            <Field label="Facilities"><div className="grid grid-cols-2 gap-2 md:grid-cols-3">{FACILITIES.map((x) => <label key={x} className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"><Checkbox checked={fac.includes(x)} onCheckedChange={(c) => setFac(c ? [...fac, x] : fac.filter((y) => y !== x))} />{x}</label>)}</div></Field>
            <Field label="About your gym"><Textarea rows={3} value={f.about} onChange={set("about")} /></Field>
          </>}
          <div className="flex gap-3 pt-2">
            {step > 0 && <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(step - 1)}>Back</Button>}
            <Button type="submit" size="lg" className="flex-1 rounded-full">{step < 2 ? "Continue" : "Create gym account"}</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">Already a partner? <Link to="/gyms/login" className="font-semibold text-primary">Sign in</Link></p>
        </form>
      </AuthCard>
    </PageShell>
  );
}

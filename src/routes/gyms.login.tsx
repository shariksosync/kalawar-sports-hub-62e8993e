import { createFileRoute } from "@tanstack/react-router";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { LoginForm } from "@/components/site/LoginForm";
import { IMAGES } from "@/lib/data";

export const Route = createFileRoute("/gyms/login")({
  head: () => ({ meta: [{ title: "Gym Partner Login — Kalawar Hub" }, { name: "description", content: "Sign in to manage your gym's members, subscriptions, staff and revenue." }, { property: "og:title", content: "Gym Partner Login" }, { property: "og:description", content: "Access your gym admin panel." }] }),
  component: () => (
    <PageShell>
      <AuthCard title="Gym partner login" subtitle="Manage members, subscriptions, staff and revenue." aside={IMAGES.gym}>
        <LoginForm types={["gym"]} sample={{ email: "owner@ironforge.in", password: "ironforge123" }} registerTo="/gyms/register" registerLabel="Register your gym" />
      </AuthCard>
    </PageShell>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { LoginForm } from "@/components/site/LoginForm";
import { IMAGES } from "@/lib/data";

export const Route = createFileRoute("/academies/login")({
  head: () => ({ meta: [{ title: "Academy Partner Login — Kalawar Hub" }, { name: "description", content: "Sign in to manage students, batches, coaches, fees and events." }, { property: "og:title", content: "Academy Partner Login" }, { property: "og:description", content: "Access your academy admin panel." }] }),
  component: () => (
    <PageShell>
      <AuthCard title="Academy partner login" subtitle="Manage students, batches, coaches, fees and events." aside={IMAGES.academy}>
        <LoginForm types={["academy"]} sample={{ email: "admin@risingstars.in", password: "rising123" }} registerTo="/academies/register" registerLabel="Register your academy" />
      </AuthCard>
    </PageShell>
  ),
});

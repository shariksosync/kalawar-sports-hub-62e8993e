import { createFileRoute } from "@tanstack/react-router";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { LoginForm } from "@/components/site/LoginForm";
import { IMAGES } from "@/lib/data";

export const Route = createFileRoute("/media/login")({
  head: () => ({ meta: [{ title: "Media Login — Kalawar Hub" }, { name: "description", content: "Sign in to upload, like, comment and follow athletes on Kalawar Media." }, { property: "og:title", content: "Media Login" }, { property: "og:description", content: "Sign in to Kalawar Media." }] }),
  component: () => (
    <PageShell>
      <AuthCard title="Media login" subtitle="Any Kalawar Hub account works here — media, gym, academy or Kalawar member." aside={IMAGES.boxing}>
        <LoginForm sample={{ email: "aarav@media.in", password: "aarav123" }} registerTo="/media/register" registerLabel="Create a media account" />
      </AuthCard>
    </PageShell>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { AuthCard, PageShell } from "@/components/site/PageShell";
import { LoginForm } from "@/components/site/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMAGES } from "@/lib/data";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Kalawar Hub" }, { name: "description", content: "Sign in to your Media, GYM & Fitness, Sports Academy or Kalawar account." }, { property: "og:title", content: "Sign in — Kalawar Hub" }, { property: "og:description", content: "One login for every Kalawar Hub portal." }] }),
  component: () => (
    <PageShell>
      <AuthCard title="Sign in" subtitle="One account across Kalawar Hub. Choose your portal." aside={IMAGES.champ}>
        <Tabs defaultValue="media">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="media">Media</TabsTrigger><TabsTrigger value="gym">Gym</TabsTrigger><TabsTrigger value="academy">Academy</TabsTrigger><TabsTrigger value="kalawar">Kalawar</TabsTrigger>
          </TabsList>
          <TabsContent value="media"><LoginForm types={["media", "gym", "academy", "kalawar"]} sample={{ email: "aarav@media.in", password: "aarav123" }} registerTo="/media/register" registerLabel="Create a media account" /></TabsContent>
          <TabsContent value="gym"><LoginForm types={["gym"]} sample={{ email: "owner@ironforge.in", password: "ironforge123" }} registerTo="/gyms/register" registerLabel="Register your gym" /></TabsContent>
          <TabsContent value="academy"><LoginForm types={["academy"]} sample={{ email: "admin@risingstars.in", password: "rising123" }} registerTo="/academies/register" registerLabel="Register your academy" /></TabsContent>
          <TabsContent value="kalawar"><p className="mb-4 text-xs text-muted-foreground">Players, coaches, referees, clubs and associations.</p><LoginForm types={["kalawar"]} sample={{ email: "rohit@kalawar.in", password: "rohit123" }} registerTo="/media/register" registerLabel="Create an account" /></TabsContent>
        </Tabs>
      </AuthCard>
    </PageShell>
  ),
});

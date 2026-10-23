import { createFileRoute } from "@tanstack/react-router";
import { ModuleTable } from "@/components/admin/ModuleTable";
import { useAdminContext } from "@/components/admin/AdminLayout";
import { GYM_MODULES } from "@/lib/admin-config";

export const Route = createFileRoute("/gym-admin/$module")({ head: ({ params }) => {
    const title = GYM_MODULES.find((m) => m.slug === params.module)?.title ?? "Gym records";
    const description = `Manage ${title.toLowerCase()} for your gym on Kalawar Hub.`;
    return { meta: [{ title: `${title} — Gym Admin · Kalawar Hub` }, { name: "description", content: description }, { property: "og:title", content: `${title} — Gym Admin` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  }, component: ModulePage });

function ModulePage() {
  const { module } = Route.useParams();
  const { pid } = useAdminContext("gym");
  const def = GYM_MODULES.find((m) => m.slug === module);
  if (!def) return <p className="text-muted-foreground">Section not found.</p>;
  return <ModuleTable key={def.slug} pid={pid} def={def} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { ModuleTable } from "@/components/admin/ModuleTable";
import { useAdminContext } from "@/components/admin/AdminLayout";
import { ACADEMY_MODULES } from "@/lib/admin-config";

export const Route = createFileRoute("/academy-admin/$module")({ head: ({ params }) => {
    const title = ACADEMY_MODULES.find((m) => m.slug === params.module)?.title ?? "Academy records";
    const description = `Manage ${title.toLowerCase()} for your academy on Kalawar Hub.`;
    return { meta: [{ title: `${title} — Academy Admin · Kalawar Hub` }, { name: "description", content: description }, { property: "og:title", content: `${title} — Academy Admin` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  }, component: ModulePage });

function ModulePage() {
  const { module } = Route.useParams();
  const { pid } = useAdminContext("academy");
  const def = ACADEMY_MODULES.find((m) => m.slug === module);
  if (!def) return <p className="text-muted-foreground">Section not found.</p>;
  return <ModuleTable key={def.slug} pid={pid} def={def} />;
}

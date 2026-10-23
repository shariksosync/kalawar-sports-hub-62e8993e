import { createFileRoute } from "@tanstack/react-router";
import { ModuleTable } from "@/components/admin/ModuleTable";
import { useAdminContext } from "@/components/admin/AdminLayout";
import { ACADEMY_MODULES } from "@/lib/admin-config";

export const Route = createFileRoute("/academy-admin/$module")({ component: ModulePage });

function ModulePage() {
  const { module } = Route.useParams();
  const { pid } = useAdminContext("academy");
  const def = ACADEMY_MODULES.find((m) => m.slug === module);
  if (!def) return <p className="text-muted-foreground">Section not found.</p>;
  return <ModuleTable key={def.slug} pid={pid} def={def} />;
}

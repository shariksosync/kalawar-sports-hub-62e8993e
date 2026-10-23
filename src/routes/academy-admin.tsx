import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ACADEMY_MODULES } from "@/lib/admin-config";

export const Route = createFileRoute("/academy-admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Academy Admin Panel — Kalawar Hub" }, { name: "description", content: "Manage your academy on Kalawar Hub." }, { property: "og:title", content: "Academy Admin Panel" }, { property: "og:description", content: "Partner admin panel." }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminLayout kind="academy" modules={ACADEMY_MODULES} />,
});

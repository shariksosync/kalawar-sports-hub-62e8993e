import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GYM_MODULES } from "@/lib/admin-config";

export const Route = createFileRoute("/gym-admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Gym Admin Panel — Kalawar Hub" }, { name: "description", content: "Manage your gym on Kalawar Hub." }, { property: "og:title", content: "Gym Admin Panel" }, { property: "og:description", content: "Partner admin panel." }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminLayout kind="gym" modules={GYM_MODULES} />,
});

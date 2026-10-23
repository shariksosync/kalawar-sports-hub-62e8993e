import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/academy-admin/settings")({ head: () => ({ meta: [{ title: "Academy Profile Settings — Kalawar Hub" }, { name: "description", content: "Manage your public academy listing." }, { property: "og:title", content: "Academy Profile Settings — Kalawar Hub" }, { property: "og:description", content: "Manage your public academy listing." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: () => <SettingsPage kind="academy" /> });

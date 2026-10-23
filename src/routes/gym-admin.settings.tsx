import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/gym-admin/settings")({ head: () => ({ meta: [{ title: "Gym Profile Settings — Kalawar Hub" }, { name: "description", content: "Manage your public gym listing." }, { property: "og:title", content: "Gym Profile Settings — Kalawar Hub" }, { property: "og:description", content: "Manage your public gym listing." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: () => <SettingsPage kind="gym" /> });

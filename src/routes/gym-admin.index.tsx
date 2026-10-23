import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/gym-admin/")({ head: () => ({ meta: [{ title: "Gym Dashboard — Kalawar Hub" }, { name: "description", content: "Membership and revenue overview for your gym." }, { property: "og:title", content: "Gym Dashboard — Kalawar Hub" }, { property: "og:description", content: "Membership and revenue overview for your gym." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: () => <Dashboard kind="gym" /> });

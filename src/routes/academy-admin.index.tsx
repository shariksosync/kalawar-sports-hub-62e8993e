import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/academy-admin/")({ head: () => ({ meta: [{ title: "Academy Dashboard — Kalawar Hub" }, { name: "description", content: "Membership and revenue overview for your academy." }, { property: "og:title", content: "Academy Dashboard — Kalawar Hub" }, { property: "og:description", content: "Membership and revenue overview for your academy." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: () => <Dashboard kind="academy" /> });

import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/academy-admin/reports")({ head: () => ({ meta: [{ title: "Academy Revenue Reports — Kalawar Hub" }, { name: "description", content: "View and export academy revenue by date." }, { property: "og:title", content: "Academy Revenue Reports — Kalawar Hub" }, { property: "og:description", content: "View and export academy revenue by date." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: () => <Reports kind="academy" /> });

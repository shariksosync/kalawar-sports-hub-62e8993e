import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/gym-admin/reports")({ head: () => ({ meta: [{ title: "Gym Revenue Reports — Kalawar Hub" }, { name: "description", content: "View and export gym revenue by date." }, { property: "og:title", content: "Gym Revenue Reports — Kalawar Hub" }, { property: "og:description", content: "View and export gym revenue by date." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: () => <Reports kind="gym" /> });

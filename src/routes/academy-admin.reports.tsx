import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/academy-admin/reports")({ component: () => <Reports kind="academy" /> });

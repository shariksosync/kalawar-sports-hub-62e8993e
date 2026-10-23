import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/gym-admin/reports")({ component: () => <Reports kind="gym" /> });

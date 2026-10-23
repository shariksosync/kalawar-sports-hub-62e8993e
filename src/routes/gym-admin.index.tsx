import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/gym-admin/")({ component: () => <Dashboard kind="gym" /> });

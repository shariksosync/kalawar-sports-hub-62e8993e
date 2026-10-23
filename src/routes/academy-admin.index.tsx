import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/academy-admin/")({ component: () => <Dashboard kind="academy" /> });

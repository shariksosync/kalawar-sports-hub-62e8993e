import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/academy-admin/settings")({ component: () => <SettingsPage kind="academy" /> });

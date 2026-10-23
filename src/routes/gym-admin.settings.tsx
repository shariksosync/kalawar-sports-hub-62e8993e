import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/admin/AdminPages";

export const Route = createFileRoute("/gym-admin/settings")({ component: () => <SettingsPage kind="gym" /> });

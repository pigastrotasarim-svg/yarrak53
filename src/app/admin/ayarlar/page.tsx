import { requireAdminPage } from "@/lib/auth";
import SettingsForm from "./form";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  return <SettingsForm />;
}

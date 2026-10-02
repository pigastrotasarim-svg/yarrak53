import { requireAdminPage } from "@/lib/auth";
import NewShipmentForm from "./form";

export default async function NewShipmentPage() {
  await requireAdminPage();
  return <NewShipmentForm />;
}

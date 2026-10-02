import { requireAdminPage } from "@/lib/auth";
import AdminShipmentDetailPage from "./detail-client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  return <AdminShipmentDetailPage id={id} />;
}

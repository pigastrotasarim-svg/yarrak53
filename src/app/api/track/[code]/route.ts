import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildTrackingPayload } from "@/lib/shipment-view";

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { code } = await params;
  const normalized = code.trim().toUpperCase();
  const shipment = await prisma.shipment.findUnique({
    where: { code: normalized },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  if (!shipment) {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    tracking: buildTrackingPayload(shipment),
  });
}

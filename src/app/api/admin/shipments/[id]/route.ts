import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SHIPMENT_STATUSES, statusLabel } from "@/lib/tracking";
import { buildTrackingPayload } from "@/lib/shipment-view";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(
    SHIPMENT_STATUSES.map((s) => s.key) as [string, ...string[]]
  ),
  note: z.string().optional(),
});

export async function GET(_req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });
  if (!shipment) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({
    shipment,
    view: buildTrackingPayload(shipment),
  });
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
  }

  const shipment = await prisma.shipment.findUnique({ where: { id } });
  if (!shipment) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const status = parsed.data.status;
  const now = new Date();
  const data: {
    status: string;
    departedAt?: Date | null;
    deliveredAt?: Date | null;
  } = { status };

  if (
    (status === "YolaCikti" || status === "Yolda") &&
    !shipment.departedAt
  ) {
    data.departedAt = now;
  }
  if (status === "TeslimEdildi") {
    data.deliveredAt = now;
  }

  const location =
    status === "TeslimEdildi" || status === "Dagitimda"
      ? `${shipment.destProvince} / ${shipment.destDistrict}`
      : status === "YuklemeYapildi"
        ? `${shipment.originProvince} / ${shipment.originDistrict}`
        : `${shipment.originProvince} → ${shipment.destProvince}`;

  const updated = await prisma.shipment.update({
    where: { id },
    data: {
      ...data,
      events: {
        create: {
          status,
          title: statusLabel(status),
          location,
          note: parsed.data.note || null,
        },
      },
    },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  return NextResponse.json({
    shipment: updated,
    view: buildTrackingPayload(updated),
  });
}

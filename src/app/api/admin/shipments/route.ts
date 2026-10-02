import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findProvinceByName, getDistricts, getProvinces } from "@/lib/turkey";
import {
  generateTrackingCode,
  statusLabel,
  type ShipmentStatusKey,
} from "@/lib/tracking";
import { distanceBetween, estimateDelivery } from "@/lib/shipment-view";

const createSchema = z.object({
  customerName: z.string().min(2),
  gsm: z.string().min(10),
  originProvince: z.string().min(2),
  originDistrict: z.string().min(1),
  destProvince: z.string().min(2),
  destDistrict: z.string().min(1),
  notes: z.string().optional(),
});

async function unauthorized() {
  return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
    include: { events: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return NextResponse.json({
    shipments: shipments.map((s) => ({
      ...s,
      statusLabel: statusLabel(s.status),
    })),
  });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Eksik veya hatalı alanlar", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const origin = await findProvinceByName(data.originProvince);
  const dest = await findProvinceByName(data.destProvince);
  if (!origin || !dest) {
    return NextResponse.json(
      { error: "İl bilgisi bulunamadı" },
      { status: 400 }
    );
  }

  // Validate districts exist when API has them
  const [originDistricts, destDistricts] = await Promise.all([
    getDistricts(origin.id),
    getDistricts(dest.id),
  ]);
  const originOk =
    originDistricts.length === 0 ||
    originDistricts.some(
      (d) =>
        d.name.toLocaleLowerCase("tr") ===
        data.originDistrict.toLocaleLowerCase("tr")
    );
  const destOk =
    destDistricts.length === 0 ||
    destDistricts.some(
      (d) =>
        d.name.toLocaleLowerCase("tr") ===
        data.destDistrict.toLocaleLowerCase("tr")
    );
  if (!originOk || !destOk) {
    return NextResponse.json(
      { error: "İlçe bilgisi geçersiz" },
      { status: 400 }
    );
  }

  let code = generateTrackingCode();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.shipment.findUnique({ where: { code } });
    if (!exists) break;
    code = generateTrackingCode();
  }

  const distanceKm = distanceBetween(origin, dest);
  const status: ShipmentStatusKey = "YuklemeYapildi";
  const estimatedAt = estimateDelivery(distanceKm);

  const shipment = await prisma.shipment.create({
    data: {
      code,
      customerName: data.customerName,
      gsm: data.gsm,
      originProvince: origin.name,
      originDistrict: data.originDistrict,
      originLat: origin.lat,
      originLng: origin.lng,
      destProvince: dest.name,
      destDistrict: data.destDistrict,
      destLat: dest.lat,
      destLng: dest.lng,
      distanceKm,
      status,
      notes: data.notes,
      estimatedAt,
      events: {
        create: {
          status,
          title: statusLabel(status),
          location: `${origin.name} / ${data.originDistrict}`,
          note: "Sevkiyat kaydı oluşturuldu, yükleme tamamlandı.",
        },
      },
    },
    include: { events: true },
  });

  // Warm province list cache path
  await getProvinces();

  return NextResponse.json({ shipment }, { status: 201 });
}

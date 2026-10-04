import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findProvinceByName, getDistricts, getProvinces } from "@/lib/turkey";
import {
  generateTrackingCode,
  statusLabel,
  type ShipmentStatusKey,
} from "@/lib/tracking";
import { distanceBetween, estimateDelivery } from "@/lib/shipment-view";
import {
  buildFullAddress,
  shipmentInputSchema,
} from "@/lib/shipment-schema";

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
  const parsed = shipmentInputSchema.safeParse(body);
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
  const customerName = `${data.firstName} ${data.lastName}`.trim();
  const originAddress = buildFullAddress({
    mahalle: data.originMahalle,
    street: data.originStreet,
    buildingNo: data.originBuildingNo,
    floor: data.originFloor,
    apartment: data.originApartment,
  });
  const destAddress = buildFullAddress({
    mahalle: data.destMahalle,
    street: data.destStreet,
    buildingNo: data.destBuildingNo,
    floor: data.destFloor,
    apartment: data.destApartment,
  });

  const shipment = await prisma.shipment.create({
    data: {
      code,
      firstName: data.firstName,
      lastName: data.lastName,
      customerName,
      tcKimlik: data.tcKimlik,
      gsm: data.gsm,
      receiverName: data.receiverName || null,
      receiverGsm: data.receiverGsm || null,
      originProvince: origin.name,
      originDistrict: data.originDistrict,
      originMahalle: data.originMahalle || "",
      originStreet: data.originStreet || "",
      originBuildingNo: data.originBuildingNo || "",
      originFloor: data.originFloor || "",
      originApartment: data.originApartment || "",
      originAddress,
      originLat: origin.lat,
      originLng: origin.lng,
      destProvince: dest.name,
      destDistrict: data.destDistrict,
      destMahalle: data.destMahalle || "",
      destStreet: data.destStreet || "",
      destBuildingNo: data.destBuildingNo || "",
      destFloor: data.destFloor || "",
      destApartment: data.destApartment || "",
      destAddress,
      destLat: dest.lat,
      destLng: dest.lng,
      distanceKm,
      cargoType: data.cargoType || "Genel kargo",
      cargoWeightKg: data.cargoWeightKg ?? null,
      packageCount: data.packageCount || 1,
      vehiclePlate: data.vehiclePlate || null,
      status,
      notes: data.notes || null,
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

  await getProvinces();
  return NextResponse.json({ shipment }, { status: 201 });
}

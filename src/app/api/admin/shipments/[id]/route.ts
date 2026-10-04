import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findProvinceByName, getDistricts } from "@/lib/turkey";
import { SHIPMENT_STATUSES, statusLabel } from "@/lib/tracking";
import {
  buildTrackingPayload,
  distanceBetween,
  estimateDelivery,
} from "@/lib/shipment-view";
import {
  buildFullAddress,
  shipmentInputSchema,
} from "@/lib/shipment-schema";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z
    .enum(SHIPMENT_STATUSES.map((s) => s.key) as [string, ...string[]])
    .optional(),
  note: z.string().optional(),
  details: shipmentInputSchema.partial().optional(),
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
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const shipment = await prisma.shipment.findUnique({ where: { id } });
  if (!shipment) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const now = new Date();
  const data: Record<string, unknown> = {};

  if (parsed.data.details) {
    const d = parsed.data.details;
    const originProvince = d.originProvince || shipment.originProvince;
    const destProvince = d.destProvince || shipment.destProvince;
    const originDistrict = d.originDistrict || shipment.originDistrict;
    const destDistrict = d.destDistrict || shipment.destDistrict;

    const origin = await findProvinceByName(originProvince);
    const dest = await findProvinceByName(destProvince);
    if (!origin || !dest) {
      return NextResponse.json(
        { error: "İl bilgisi bulunamadı" },
        { status: 400 }
      );
    }

    if (d.originDistrict) {
      const ods = await getDistricts(origin.id);
      const ok =
        ods.length === 0 ||
        ods.some(
          (x) =>
            x.name.toLocaleLowerCase("tr") ===
            d.originDistrict!.toLocaleLowerCase("tr")
        );
      if (!ok) {
        return NextResponse.json(
          { error: "Çıkış ilçesi geçersiz" },
          { status: 400 }
        );
      }
    }
    if (d.destDistrict) {
      const dds = await getDistricts(dest.id);
      const ok =
        dds.length === 0 ||
        dds.some(
          (x) =>
            x.name.toLocaleLowerCase("tr") ===
            d.destDistrict!.toLocaleLowerCase("tr")
        );
      if (!ok) {
        return NextResponse.json(
          { error: "Varış ilçesi geçersiz" },
          { status: 400 }
        );
      }
    }

    const firstName = d.firstName ?? shipment.firstName;
    const lastName = d.lastName ?? shipment.lastName;
    const originMahalle = d.originMahalle ?? shipment.originMahalle;
    const originStreet = d.originStreet ?? shipment.originStreet;
    const originBuildingNo = d.originBuildingNo ?? shipment.originBuildingNo;
    const originFloor = d.originFloor ?? shipment.originFloor;
    const originApartment = d.originApartment ?? shipment.originApartment;
    const destMahalle = d.destMahalle ?? shipment.destMahalle;
    const destStreet = d.destStreet ?? shipment.destStreet;
    const destBuildingNo = d.destBuildingNo ?? shipment.destBuildingNo;
    const destFloor = d.destFloor ?? shipment.destFloor;
    const destApartment = d.destApartment ?? shipment.destApartment;

    Object.assign(data, {
      firstName,
      lastName,
      customerName: `${firstName} ${lastName}`.trim(),
      tcKimlik: d.tcKimlik ?? shipment.tcKimlik,
      gsm: d.gsm ?? shipment.gsm,
      receiverName:
        d.receiverName === undefined ? shipment.receiverName : d.receiverName,
      receiverGsm:
        d.receiverGsm === undefined ? shipment.receiverGsm : d.receiverGsm,
      originProvince: origin.name,
      originDistrict,
      originMahalle,
      originStreet,
      originBuildingNo,
      originFloor,
      originApartment,
      originAddress: buildFullAddress({
        mahalle: originMahalle,
        street: originStreet,
        buildingNo: originBuildingNo,
        floor: originFloor,
        apartment: originApartment,
      }),
      originLat: origin.lat,
      originLng: origin.lng,
      destProvince: dest.name,
      destDistrict,
      destMahalle,
      destStreet,
      destBuildingNo,
      destFloor,
      destApartment,
      destAddress: buildFullAddress({
        mahalle: destMahalle,
        street: destStreet,
        buildingNo: destBuildingNo,
        floor: destFloor,
        apartment: destApartment,
      }),
      destLat: dest.lat,
      destLng: dest.lng,
      distanceKm: distanceBetween(origin, dest),
      estimatedAt: estimateDelivery(distanceBetween(origin, dest)),
      cargoType: d.cargoType ?? shipment.cargoType,
      cargoWeightKg:
        d.cargoWeightKg === undefined
          ? shipment.cargoWeightKg
          : d.cargoWeightKg,
      packageCount: d.packageCount ?? shipment.packageCount,
      vehiclePlate:
        d.vehiclePlate === undefined ? shipment.vehiclePlate : d.vehiclePlate,
      notes: d.notes === undefined ? shipment.notes : d.notes,
    });
  }

  if (parsed.data.status) {
    const status = parsed.data.status;
    data.status = status;
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
        ? `${(data.destProvince as string) || shipment.destProvince} / ${(data.destDistrict as string) || shipment.destDistrict}`
        : status === "YuklemeYapildi"
          ? `${(data.originProvince as string) || shipment.originProvince} / ${(data.originDistrict as string) || shipment.originDistrict}`
          : `${(data.originProvince as string) || shipment.originProvince} → ${(data.destProvince as string) || shipment.destProvince}`;

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

  const updated = await prisma.shipment.update({
    where: { id },
    data,
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  return NextResponse.json({
    shipment: updated,
    view: buildTrackingPayload(updated),
  });
}

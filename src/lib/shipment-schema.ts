import { z } from "zod";

export const shipmentInputSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  tcKimlik: z.string().min(11).max(11),
  gsm: z.string().min(10),
  receiverName: z.string().optional().nullable(),
  receiverGsm: z.string().optional().nullable(),
  originProvince: z.string().min(2),
  originDistrict: z.string().min(1),
  originMahalle: z.string().optional().default(""),
  originStreet: z.string().optional().default(""),
  originBuildingNo: z.string().optional().default(""),
  originFloor: z.string().optional().default(""),
  originApartment: z.string().optional().default(""),
  destProvince: z.string().min(2),
  destDistrict: z.string().min(1),
  destMahalle: z.string().optional().default(""),
  destStreet: z.string().optional().default(""),
  destBuildingNo: z.string().optional().default(""),
  destFloor: z.string().optional().default(""),
  destApartment: z.string().optional().default(""),
  cargoType: z.string().optional().default("Genel kargo"),
  cargoWeightKg: z.coerce.number().optional().nullable(),
  packageCount: z.coerce.number().int().positive().optional().default(1),
  vehiclePlate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type ShipmentInput = z.infer<typeof shipmentInputSchema>;

export function buildFullAddress(parts: {
  mahalle?: string;
  street?: string;
  buildingNo?: string;
  floor?: string;
  apartment?: string;
}) {
  return [
    parts.mahalle,
    parts.street,
    parts.buildingNo ? `No: ${parts.buildingNo}` : "",
    parts.floor ? `Kat: ${parts.floor}` : "",
    parts.apartment ? `Daire: ${parts.apartment}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

import { haversineKm, hoursForDistance, interpolateLatLng } from "@/lib/geo";
import {
  AVG_TRUCK_KMH,
  SHIPMENT_STATUSES,
  statusLabel,
  statusProgress,
} from "@/lib/tracking";

export type ShipmentLike = {
  code: string;
  customerName: string;
  gsm: string;
  originProvince: string;
  originDistrict: string;
  originLat: number;
  originLng: number;
  destProvince: string;
  destDistrict: string;
  destLat: number;
  destLng: number;
  distanceKm: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  departedAt: Date | null;
  estimatedAt: Date | null;
  deliveredAt: Date | null;
  events: {
    status: string;
    title: string;
    location: string;
    note: string | null;
    createdAt: Date;
  }[];
};

export function computeLiveProgress(shipment: ShipmentLike) {
  const base = statusProgress(shipment.status);

  if (shipment.status === "TeslimEdildi") {
    return 1;
  }

  if (
    (shipment.status === "YolaCikti" || shipment.status === "Yolda") &&
    shipment.departedAt
  ) {
    const hours =
      (Date.now() - new Date(shipment.departedAt).getTime()) / 36e5;
    const totalHours = Math.max(
      hoursForDistance(shipment.distanceKm, AVG_TRUCK_KMH),
      0.5
    );
    const road = Math.min(0.92, hours / totalHours);
    return Math.max(base, Math.min(0.92, 0.15 + road * 0.75));
  }

  return base;
}

export function buildTrackingPayload(shipment: ShipmentLike) {
  const progress = computeLiveProgress(shipment);
  const position = interpolateLatLng(
    shipment.originLat,
    shipment.originLng,
    shipment.destLat,
    shipment.destLng,
    progress
  );
  const remainingKm = Math.max(
    0,
    Math.round(shipment.distanceKm * (1 - progress))
  );
  const remainingHours = hoursForDistance(remainingKm, AVG_TRUCK_KMH);

  return {
    code: shipment.code,
    customerName: shipment.customerName,
    gsm: maskGsm(shipment.gsm),
    status: shipment.status,
    statusLabel: statusLabel(shipment.status),
    origin: {
      province: shipment.originProvince,
      district: shipment.originDistrict,
      lat: shipment.originLat,
      lng: shipment.originLng,
    },
    destination: {
      province: shipment.destProvince,
      district: shipment.destDistrict,
      lat: shipment.destLat,
      lng: shipment.destLng,
    },
    distanceKm: Math.round(shipment.distanceKm),
    remainingKm,
    etaHours: Number(remainingHours.toFixed(1)),
    progress,
    position,
    estimatedAt: shipment.estimatedAt,
    departedAt: shipment.departedAt,
    deliveredAt: shipment.deliveredAt,
    createdAt: shipment.createdAt,
    notes: shipment.notes,
    events: shipment.events.map((e) => ({
      status: e.status,
      title: e.title,
      location: e.location,
      note: e.note,
      createdAt: e.createdAt,
    })),
    statusOptions: SHIPMENT_STATUSES.map((s) => ({
      key: s.key,
      label: s.label,
    })),
  };
}

export function maskGsm(gsm: string) {
  const digits = gsm.replace(/\D/g, "");
  if (digits.length < 7) return gsm;
  return `${digits.slice(0, 3)} *** ** ${digits.slice(-2)}`;
}

export function estimateDelivery(distanceKm: number, from = new Date()) {
  const hours = hoursForDistance(distanceKm, AVG_TRUCK_KMH);
  const cushion = Math.max(2, hours * 0.15);
  return new Date(from.getTime() + (hours + cushion) * 36e5);
}

export function distanceBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  return haversineKm(a.lat, a.lng, b.lat, b.lng);
}

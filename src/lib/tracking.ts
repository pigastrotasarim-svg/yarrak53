export const SHIPMENT_STATUSES = [
  {
    key: "YuklemeYapildi",
    label: "Yükleme yapıldı",
    progress: 0.08,
  },
  {
    key: "YolaCikti",
    label: "Yola çıktı",
    progress: 0.2,
  },
  {
    key: "Yolda",
    label: "Yolda",
    progress: 0.55,
  },
  {
    key: "Aktarmada",
    label: "Aktarmada",
    progress: 0.72,
  },
  {
    key: "Dagitimda",
    label: "Dağıtımda",
    progress: 0.9,
  },
  {
    key: "TeslimEdildi",
    label: "Teslim edildi",
    progress: 1,
  },
] as const;

export type ShipmentStatusKey = (typeof SHIPMENT_STATUSES)[number]["key"];

export function statusLabel(key: string) {
  return SHIPMENT_STATUSES.find((s) => s.key === key)?.label ?? key;
}

export function statusProgress(key: string) {
  return SHIPMENT_STATUSES.find((s) => s.key === key)?.progress ?? 0;
}

export function generateTrackingCode() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `AL${year}${rand}`;
}

/** Average highway truck speed used for ETA and road animation. */
export const AVG_TRUCK_KMH = 65;

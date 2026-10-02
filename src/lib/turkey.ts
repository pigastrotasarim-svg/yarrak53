export type Province = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

export type District = {
  id: number;
  name: string;
  provinceId: number;
};

type ApiProvince = {
  id: number;
  name: string;
  coordinates?: { latitude?: number; longitude?: number };
  districts?: { id: number; name: string }[];
};

const PROVINCE_CACHE_TTL = 1000 * 60 * 60 * 12;
let provinceCache: { at: number; data: Province[] } | null = null;
const districtCache = new Map<number, { at: number; data: District[] }>();

/** Fallback coordinates for Turkish provinces (approx. city centers). */
const FALLBACK_COORDS: Record<string, { lat: number; lng: number }> = {
  Adana: { lat: 37.0, lng: 35.3213 },
  Adıyaman: { lat: 37.7648, lng: 38.2786 },
  Afyonkarahisar: { lat: 38.7507, lng: 30.5567 },
  Ağrı: { lat: 39.7191, lng: 43.0503 },
  Amasya: { lat: 40.6499, lng: 35.8353 },
  Ankara: { lat: 39.9334, lng: 32.8597 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
  Artvin: { lat: 41.1828, lng: 41.8183 },
  Aydın: { lat: 37.856, lng: 27.8416 },
  Balıkesir: { lat: 39.6484, lng: 27.8826 },
  Bilecik: { lat: 40.0567, lng: 30.0665 },
  Bingöl: { lat: 38.8854, lng: 40.4966 },
  Bitlis: { lat: 38.4006, lng: 42.1095 },
  Bolu: { lat: 40.576, lng: 31.5788 },
  Burdur: { lat: 37.4613, lng: 30.0665 },
  Bursa: { lat: 40.1885, lng: 29.061 },
  Çanakkale: { lat: 40.1553, lng: 26.4142 },
  Çankırı: { lat: 40.6013, lng: 33.6134 },
  Çorum: { lat: 40.5506, lng: 34.9556 },
  Denizli: { lat: 37.7765, lng: 29.0864 },
  Diyarbakır: { lat: 37.9144, lng: 40.2306 },
  Edirne: { lat: 41.6818, lng: 26.5623 },
  Elazığ: { lat: 38.681, lng: 39.2264 },
  Erzincan: { lat: 39.75, lng: 39.5 },
  Erzurum: { lat: 39.9, lng: 41.27 },
  Eskişehir: { lat: 39.7767, lng: 30.5206 },
  Gaziantep: { lat: 37.0662, lng: 37.3833 },
  Giresun: { lat: 40.9128, lng: 38.3895 },
  Gümüşhane: { lat: 40.4386, lng: 39.5086 },
  Hakkari: { lat: 37.5833, lng: 43.7333 },
  Hatay: { lat: 36.4018, lng: 36.3498 },
  Isparta: { lat: 37.7648, lng: 30.5566 },
  Mersin: { lat: 36.8121, lng: 34.6415 },
  İstanbul: { lat: 41.0082, lng: 28.9784 },
  İzmir: { lat: 38.4237, lng: 27.1428 },
  Kars: { lat: 40.6167, lng: 43.1 },
  Kastamonu: { lat: 41.3887, lng: 33.7827 },
  Kayseri: { lat: 38.7312, lng: 35.4787 },
  Kırklareli: { lat: 41.7333, lng: 27.2167 },
  Kırşehir: { lat: 39.1425, lng: 34.1709 },
  Kocaeli: { lat: 40.8533, lng: 29.8815 },
  Konya: { lat: 37.8746, lng: 32.4932 },
  Kütahya: { lat: 39.4167, lng: 29.9833 },
  Malatya: { lat: 38.3552, lng: 38.3095 },
  Manisa: { lat: 38.6191, lng: 27.4289 },
  Kahramanmaraş: { lat: 37.5858, lng: 36.9371 },
  Mardin: { lat: 37.3212, lng: 40.7245 },
  Muğla: { lat: 37.2153, lng: 28.3636 },
  Muş: { lat: 38.9462, lng: 41.7539 },
  Nevşehir: { lat: 38.6939, lng: 34.6857 },
  Niğde: { lat: 37.9667, lng: 34.6833 },
  Ordu: { lat: 40.9839, lng: 37.8764 },
  Rize: { lat: 41.0201, lng: 40.5234 },
  Sakarya: { lat: 40.7569, lng: 30.3781 },
  Samsun: { lat: 41.2867, lng: 36.33 },
  Siirt: { lat: 37.9333, lng: 41.95 },
  Sinop: { lat: 42.0231, lng: 35.1531 },
  Sivas: { lat: 39.7477, lng: 37.0179 },
  Tekirdağ: { lat: 40.9833, lng: 27.5167 },
  Tokat: { lat: 40.3167, lng: 36.55 },
  Trabzon: { lat: 41.0015, lng: 39.7178 },
  Tunceli: { lat: 39.1079, lng: 39.5401 },
  Şanlıurfa: { lat: 37.1591, lng: 38.7969 },
  Uşak: { lat: 38.6823, lng: 29.4082 },
  Van: { lat: 38.4891, lng: 43.4089 },
  Yozgat: { lat: 39.8181, lng: 34.8147 },
  Zonguldak: { lat: 41.4564, lng: 31.7987 },
  Aksaray: { lat: 38.3687, lng: 34.037 },
  Bayburt: { lat: 40.2552, lng: 40.2249 },
  Karaman: { lat: 37.1759, lng: 33.2287 },
  Kırıkkale: { lat: 39.8468, lng: 33.5153 },
  Batman: { lat: 37.8812, lng: 41.1351 },
  Şırnak: { lat: 37.4187, lng: 42.4918 },
  Bartın: { lat: 41.5811, lng: 32.4609 },
  Ardahan: { lat: 41.1105, lng: 42.7022 },
  Iğdır: { lat: 39.888, lng: 44.0048 },
  Yalova: { lat: 40.65, lng: 29.2667 },
  Karabük: { lat: 41.2061, lng: 32.6204 },
  Kilis: { lat: 36.7184, lng: 37.1212 },
  Osmaniye: { lat: 37.0742, lng: 36.2478 },
  Düzce: { lat: 40.8438, lng: 31.1565 },
};

function coordsFor(name: string, api?: ApiProvince) {
  const lat = api?.coordinates?.latitude;
  const lng = api?.coordinates?.longitude;
  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }
  return FALLBACK_COORDS[name] ?? { lat: 39.0, lng: 35.0 };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 12 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Türkiye API hatası: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getProvinces(): Promise<Province[]> {
  if (provinceCache && Date.now() - provinceCache.at < PROVINCE_CACHE_TTL) {
    return provinceCache.data;
  }

  try {
    const json = await fetchJson<{ data: ApiProvince[] }>(
      "https://turkiyeapi.dev/api/v1/provinces"
    );
    const data = (json.data ?? [])
      .map((p) => {
        const c = coordsFor(p.name, p);
        return { id: p.id, name: p.name, lat: c.lat, lng: c.lng };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
    provinceCache = { at: Date.now(), data };
    return data;
  } catch {
    const data = Object.entries(FALLBACK_COORDS)
      .map(([name, c], index) => ({
        id: index + 1,
        name,
        lat: c.lat,
        lng: c.lng,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
    provinceCache = { at: Date.now(), data };
    return data;
  }
}

export async function getDistricts(provinceId: number): Promise<District[]> {
  const cached = districtCache.get(provinceId);
  if (cached && Date.now() - cached.at < PROVINCE_CACHE_TTL) {
    return cached.data;
  }

  try {
    const json = await fetchJson<{ data: ApiProvince }>(
      `https://turkiyeapi.dev/api/v1/provinces/${provinceId}`
    );
    const data = (json.data?.districts ?? [])
      .map((d) => ({
        id: d.id,
        name: d.name,
        provinceId,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
    districtCache.set(provinceId, { at: Date.now(), data });
    return data;
  } catch {
    return [
      { id: provinceId * 1000 + 1, name: "Merkez", provinceId },
    ];
  }
}

export async function findProvinceByName(name: string) {
  const provinces = await getProvinces();
  return (
    provinces.find(
      (p) => p.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr")
    ) ?? null
  );
}

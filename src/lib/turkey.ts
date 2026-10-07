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
};

type ApiDistrict = {
  id: number;
  name: string;
  provinceId?: number;
};

type ListResponse<T> = {
  data?: T[];
  meta?: { total?: number; limit?: number; offset?: number; count?: number };
};

/** TurkiyeAPI v2 — https://api.turkiyeapi.dev / gist ubeydeozdmr */
const API_BASE = "https://api.turkiyeapi.dev/v2";
const PROVINCE_CACHE_TTL = 1000 * 60 * 60 * 12;
const FETCH_TIMEOUT_MS = 8000;

let provinceCache: { at: number; data: Province[] } | null = null;
const districtCache = new Map<number, { at: number; data: District[] }>();

/** Plate-code ordered fallback (approx. city centers). */
const FALLBACK_PROVINCES: Province[] = [
  { id: 1, name: "Adana", lat: 37.0, lng: 35.3213 },
  { id: 2, name: "Adıyaman", lat: 37.7648, lng: 38.2786 },
  { id: 3, name: "Afyonkarahisar", lat: 38.7507, lng: 30.5567 },
  { id: 4, name: "Ağrı", lat: 39.7191, lng: 43.0503 },
  { id: 5, name: "Amasya", lat: 40.6499, lng: 35.8353 },
  { id: 6, name: "Ankara", lat: 39.9334, lng: 32.8597 },
  { id: 7, name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { id: 8, name: "Artvin", lat: 41.1828, lng: 41.8183 },
  { id: 9, name: "Aydın", lat: 37.856, lng: 27.8416 },
  { id: 10, name: "Balıkesir", lat: 39.6484, lng: 27.8826 },
  { id: 11, name: "Bilecik", lat: 40.0567, lng: 30.0665 },
  { id: 12, name: "Bingöl", lat: 38.8854, lng: 40.4966 },
  { id: 13, name: "Bitlis", lat: 38.4006, lng: 42.1095 },
  { id: 14, name: "Bolu", lat: 40.576, lng: 31.5788 },
  { id: 15, name: "Burdur", lat: 37.4613, lng: 30.0665 },
  { id: 16, name: "Bursa", lat: 40.1885, lng: 29.061 },
  { id: 17, name: "Çanakkale", lat: 40.1553, lng: 26.4142 },
  { id: 18, name: "Çankırı", lat: 40.6013, lng: 33.6134 },
  { id: 19, name: "Çorum", lat: 40.5506, lng: 34.9556 },
  { id: 20, name: "Denizli", lat: 37.7765, lng: 29.0864 },
  { id: 21, name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
  { id: 22, name: "Edirne", lat: 41.6818, lng: 26.5623 },
  { id: 23, name: "Elazığ", lat: 38.681, lng: 39.2264 },
  { id: 24, name: "Erzincan", lat: 39.75, lng: 39.5 },
  { id: 25, name: "Erzurum", lat: 39.9, lng: 41.27 },
  { id: 26, name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
  { id: 27, name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { id: 28, name: "Giresun", lat: 40.9128, lng: 38.3895 },
  { id: 29, name: "Gümüşhane", lat: 40.4386, lng: 39.5086 },
  { id: 30, name: "Hakkari", lat: 37.5833, lng: 43.7333 },
  { id: 31, name: "Hatay", lat: 36.4018, lng: 36.3498 },
  { id: 32, name: "Isparta", lat: 37.7648, lng: 30.5566 },
  { id: 33, name: "Mersin", lat: 36.8121, lng: 34.6415 },
  { id: 34, name: "İstanbul", lat: 41.0082, lng: 28.9784 },
  { id: 35, name: "İzmir", lat: 38.4237, lng: 27.1428 },
  { id: 36, name: "Kars", lat: 40.6167, lng: 43.1 },
  { id: 37, name: "Kastamonu", lat: 41.3887, lng: 33.7827 },
  { id: 38, name: "Kayseri", lat: 38.7312, lng: 35.4787 },
  { id: 39, name: "Kırklareli", lat: 41.7333, lng: 27.2167 },
  { id: 40, name: "Kırşehir", lat: 39.1425, lng: 34.1709 },
  { id: 41, name: "Kocaeli", lat: 40.8533, lng: 29.8815 },
  { id: 42, name: "Konya", lat: 37.8746, lng: 32.4932 },
  { id: 43, name: "Kütahya", lat: 39.4167, lng: 29.9833 },
  { id: 44, name: "Malatya", lat: 38.3552, lng: 38.3095 },
  { id: 45, name: "Manisa", lat: 38.6191, lng: 27.4289 },
  { id: 46, name: "Kahramanmaraş", lat: 37.5858, lng: 36.9371 },
  { id: 47, name: "Mardin", lat: 37.3212, lng: 40.7245 },
  { id: 48, name: "Muğla", lat: 37.2153, lng: 28.3636 },
  { id: 49, name: "Muş", lat: 38.9462, lng: 41.7539 },
  { id: 50, name: "Nevşehir", lat: 38.6939, lng: 34.6857 },
  { id: 51, name: "Niğde", lat: 37.9667, lng: 34.6833 },
  { id: 52, name: "Ordu", lat: 40.9839, lng: 37.8764 },
  { id: 53, name: "Rize", lat: 41.0201, lng: 40.5234 },
  { id: 54, name: "Sakarya", lat: 40.7569, lng: 30.3781 },
  { id: 55, name: "Samsun", lat: 41.2867, lng: 36.33 },
  { id: 56, name: "Siirt", lat: 37.9333, lng: 41.95 },
  { id: 57, name: "Sinop", lat: 42.0231, lng: 35.1531 },
  { id: 58, name: "Sivas", lat: 39.7477, lng: 37.0179 },
  { id: 59, name: "Tekirdağ", lat: 40.9833, lng: 27.5167 },
  { id: 60, name: "Tokat", lat: 40.3167, lng: 36.55 },
  { id: 61, name: "Trabzon", lat: 41.0015, lng: 39.7178 },
  { id: 62, name: "Tunceli", lat: 39.1079, lng: 39.5401 },
  { id: 63, name: "Şanlıurfa", lat: 37.1591, lng: 38.7969 },
  { id: 64, name: "Uşak", lat: 38.6823, lng: 29.4082 },
  { id: 65, name: "Van", lat: 38.4891, lng: 43.4089 },
  { id: 66, name: "Yozgat", lat: 39.8181, lng: 34.8147 },
  { id: 67, name: "Zonguldak", lat: 41.4564, lng: 31.7987 },
  { id: 68, name: "Aksaray", lat: 38.3687, lng: 34.037 },
  { id: 69, name: "Bayburt", lat: 40.2552, lng: 40.2249 },
  { id: 70, name: "Karaman", lat: 37.1759, lng: 33.2287 },
  { id: 71, name: "Kırıkkale", lat: 39.8468, lng: 33.5153 },
  { id: 72, name: "Batman", lat: 37.8812, lng: 41.1351 },
  { id: 73, name: "Şırnak", lat: 37.4187, lng: 42.4918 },
  { id: 74, name: "Bartın", lat: 41.5811, lng: 32.4609 },
  { id: 75, name: "Ardahan", lat: 41.1105, lng: 42.7022 },
  { id: 76, name: "Iğdır", lat: 39.888, lng: 44.0048 },
  { id: 77, name: "Yalova", lat: 40.65, lng: 29.2667 },
  { id: 78, name: "Karabük", lat: 41.2061, lng: 32.6204 },
  { id: 79, name: "Kilis", lat: 36.7184, lng: 37.1212 },
  { id: 80, name: "Osmaniye", lat: 37.0742, lng: 36.2478 },
  { id: 81, name: "Düzce", lat: 40.8438, lng: 31.1565 },
];

function coordsFor(name: string, api?: ApiProvince) {
  const lat = api?.coordinates?.latitude;
  const lng = api?.coordinates?.longitude;
  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }
  const fb = FALLBACK_PROVINCES.find(
    (p) => p.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr")
  );
  return fb ? { lat: fb.lat, lng: fb.lng } : { lat: 39.0, lng: 35.0 };
}

function sortedByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 12 },
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Türkiye API hatası: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const limit = 1000;
  let offset = 0;
  const all: T[] = [];

  for (;;) {
    const sep = path.includes("?") ? "&" : "?";
    const json = await fetchJson<ListResponse<T>>(
      `${API_BASE}${path}${sep}limit=${limit}&offset=${offset}`
    );
    const page = json.data ?? [];
    all.push(...page);
    const total = json.meta?.total ?? all.length;
    offset += page.length;
    if (page.length === 0 || offset >= total) break;
  }

  return all;
}

export async function getProvinces(): Promise<Province[]> {
  if (provinceCache && Date.now() - provinceCache.at < PROVINCE_CACHE_TTL) {
    return provinceCache.data;
  }

  try {
    const rows = await fetchAllPages<ApiProvince>(
      "/provinces?fields=id,name,coordinates"
    );
    if (rows.length < 70) {
      throw new Error("Eksik il listesi");
    }
    const data = sortedByName(
      rows.map((p) => {
        const c = coordsFor(p.name, p);
        return { id: p.id, name: p.name, lat: c.lat, lng: c.lng };
      })
    );
    provinceCache = { at: Date.now(), data };
    return data;
  } catch {
    const data = sortedByName(FALLBACK_PROVINCES);
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
    const rows = await fetchAllPages<ApiDistrict>(
      `/provinces/${provinceId}/districts?fields=id,name`
    );
    const data = sortedByName(
      rows.map((d) => ({
        id: d.id,
        name: d.name,
        provinceId,
      }))
    );
    if (data.length === 0) {
      throw new Error("İlçe yok");
    }
    districtCache.set(provinceId, { at: Date.now(), data });
    return data;
  } catch {
    const data = [
      { id: provinceId * 1000 + 1, name: "Merkez", provinceId },
    ];
    districtCache.set(provinceId, { at: Date.now(), data });
    return data;
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

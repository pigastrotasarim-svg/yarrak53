const EARTH_RADIUS_KM = 6371;

export function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** Interpolate a point along a great-circle-ish straight path (0..1). */
export function interpolateLatLng(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  t: number
) {
  const clamped = Math.min(1, Math.max(0, t));
  return {
    lat: lat1 + (lat2 - lat1) * clamped,
    lng: lng1 + (lng2 - lng1) * clamped,
  };
}

export function hoursForDistance(km: number, speedKmh: number) {
  if (speedKmh <= 0) return 0;
  return km / speedKmh;
}

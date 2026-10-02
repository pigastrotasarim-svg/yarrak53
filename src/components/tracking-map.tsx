"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPoint = { lat: number; lng: number; label?: string };

type Props = {
  origin: MapPoint;
  destination: MapPoint;
  position: MapPoint;
  progress: number;
  statusLabel: string;
  moving?: boolean;
};

function FitBounds({
  origin,
  destination,
  position,
}: {
  origin: MapPoint;
  destination: MapPoint;
  position: MapPoint;
}) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
      [position.lat, position.lng],
    ]);
    map.fitBounds(bounds.pad(0.25));
  }, [map, origin, destination, position]);
  return null;
}

const cityIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const truckIcon = L.divIcon({
  className: "",
  html: `<div style="width:34px;height:22px;transform:translate(-50%,-50%);filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
    <svg viewBox="0 0 64 40" width="34" height="22" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="10" width="34" height="18" rx="3" fill="#0b1f3a"/>
      <path d="M36 16h12l8 8v4H36V16z" fill="#c4a35a"/>
      <circle cx="14" cy="30" r="5" fill="#243041" stroke="#fff" stroke-width="2"/>
      <circle cx="48" cy="30" r="5" fill="#243041" stroke="#fff" stroke-width="2"/>
    </svg>
  </div>`,
  iconSize: [34, 22],
  iconAnchor: [17, 11],
});

export function TrackingMap({
  origin,
  destination,
  position,
  progress,
  statusLabel,
  moving = true,
}: Props) {
  const path = useMemo(
    () => [
      [origin.lat, origin.lng] as [number, number],
      [destination.lat, destination.lng] as [number, number],
    ],
    [origin, destination]
  );

  const traveled = useMemo(
    () => [
      [origin.lat, origin.lng] as [number, number],
      [position.lat, position.lng] as [number, number],
    ],
    [origin, position]
  );

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-navy/10 bg-white">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds
          origin={origin}
          destination={destination}
          position={position}
        />
        <Polyline positions={path} pathOptions={{ color: "#94a3b8", weight: 4 }} />
        <Polyline
          positions={traveled}
          pathOptions={{ color: "#0b1f3a", weight: 5 }}
        />
        <Marker
          position={[origin.lat, origin.lng]}
          icon={cityIcon("#c4a35a")}
        >
          <Popup>Çıkış: {origin.label}</Popup>
        </Marker>
        <Marker
          position={[destination.lat, destination.lng]}
          icon={cityIcon("#0b1f3a")}
        >
          <Popup>Varış: {destination.label}</Popup>
        </Marker>
        <Marker position={[position.lat, position.lng]} icon={truckIcon}>
          <Popup>
            {statusLabel}
            <br />
            İlerleme: %{Math.round(progress * 100)}
          </Popup>
        </Marker>
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-navy/90 px-3 py-2 text-xs text-white shadow">
        {moving && progress < 1 ? "Kamyon yolda" : statusLabel} · %
        {Math.round(progress * 100)}
      </div>
    </div>
  );
}

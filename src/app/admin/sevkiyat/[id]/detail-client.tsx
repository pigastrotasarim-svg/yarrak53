"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrackingMapClient } from "@/components/tracking-map-client";
import { Button } from "@/components/ui/button";
import { SHIPMENT_STATUSES, statusLabel } from "@/lib/tracking";

type View = {
  code: string;
  customerName: string;
  gsm: string;
  status: string;
  statusLabel: string;
  origin: { province: string; district: string; lat: number; lng: number };
  destination: {
    province: string;
    district: string;
    lat: number;
    lng: number;
  };
  distanceKm: number;
  remainingKm: number;
  progress: number;
  position: { lat: number; lng: number };
  events: {
    title: string;
    location: string;
    note: string | null;
    createdAt: string;
  }[];
};

export default function AdminShipmentDetailPage({ id }: { id: string }) {
  const [view, setView] = useState<View | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/shipments/${id}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Yüklenemedi");
      return;
    }
    setView(data.view);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function setStatus(status: string) {
    setUpdating(true);
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    setUpdating(false);
    if (!res.ok) {
      setError(data.error || "Güncellenemedi");
      return;
    }
    setView(data.view);
  }

  if (error && !view) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!view) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-ink/60">
        Sevkiyat yükleniyor…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-deep">
            Takip No
          </p>
          <h1 className="font-display text-3xl tracking-wide text-navy">
            {view.code}
          </h1>
          <p className="mt-2 text-sm text-slate-ink/70">
            {view.customerName} · {view.gsm}
          </p>
          <p className="mt-1 text-sm text-navy">
            {view.origin.district}, {view.origin.province} →{" "}
            {view.destination.district}, {view.destination.province} ·{" "}
            {view.distanceKm} km
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            render={<Link href={`/takip?q=${view.code}`} />}
            nativeButton={false}
            variant="outline"
          >
            Müşteri görünümü
          </Button>
          <Button
            render={<Link href="/admin" />}
            nativeButton={false}
            className="bg-navy text-white hover:bg-navy-deep"
          >
            Listeye dön
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <TrackingMapClient
          origin={{
            lat: view.origin.lat,
            lng: view.origin.lng,
            label: `${view.origin.province} / ${view.origin.district}`,
          }}
          destination={{
            lat: view.destination.lat,
            lng: view.destination.lng,
            label: `${view.destination.province} / ${view.destination.district}`,
          }}
          position={view.position}
          progress={view.progress}
          statusLabel={view.statusLabel}
          moving={view.status !== "TeslimEdildi"}
        />

        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <h2 className="font-display text-xl text-navy">Durum güncelle</h2>
          <p className="mt-1 text-sm text-slate-ink/65">
            Aktif: <strong>{statusLabel(view.status)}</strong> · Kalan ~{" "}
            {view.remainingKm} km
          </p>
          <div className="mt-4 grid gap-2">
            {SHIPMENT_STATUSES.map((s) => (
              <Button
                key={s.key}
                type="button"
                disabled={updating || view.status === s.key}
                variant={view.status === s.key ? "default" : "outline"}
                className={
                  view.status === s.key
                    ? "bg-navy text-white"
                    : "justify-start border-navy/15"
                }
                onClick={() => setStatus(s.key)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-5">
        <h2 className="font-display text-xl text-navy">Hareket geçmişi</h2>
        <ol className="mt-4 space-y-4">
          {view.events.map((e, i) => (
            <li
              key={`${e.createdAt}-${i}`}
              className="border-l-2 border-amber pl-4"
            >
              <p className="font-semibold text-navy">{e.title}</p>
              <p className="text-sm text-slate-ink/65">
                {e.location} · {new Date(e.createdAt).toLocaleString("tr-TR")}
              </p>
              {e.note ? (
                <p className="mt-1 text-sm text-slate-ink/70">{e.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

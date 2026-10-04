"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PackageSearch, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/components/motion";
import { TrackingMapClient } from "@/components/tracking-map-client";

type TrackingView = {
  code: string;
  firstName: string;
  lastName: string;
  customerName: string;
  tcKimlik: string;
  gsm: string;
  receiverName: string | null;
  receiverGsm: string | null;
  status: string;
  statusLabel: string;
  routeLabel: string;
  origin: {
    province: string;
    district: string;
    full: string;
    lat: number;
    lng: number;
  };
  destination: {
    province: string;
    district: string;
    full: string;
    lat: number;
    lng: number;
  };
  cargoType: string;
  cargoWeightKg: number | null;
  packageCount: number;
  vehiclePlate: string | null;
  distanceKm: number;
  remainingKm: number;
  etaHours: number;
  progress: number;
  position: { lat: number; lng: number };
  notes: string | null;
  events: {
    title: string;
    location: string;
    note: string | null;
    createdAt: string;
  }[];
};

export function TrackingForm() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("q") ?? "").trim().toUpperCase();
  const [submitted, setSubmitted] = useState(initial);
  const [tracking, setTracking] = useState<TrackingView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!submitted) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/track/${encodeURIComponent(submitted)}`,
          { credentials: "same-origin", cache: "no-store" }
        );
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setTracking(data.tracking);
          setLoading(false);
          return;
        }
        setTracking(null);
        setError("Kayıt bulunamadı");
      } catch {
        if (!cancelled) {
          setTracking(null);
          setError("Bağlantı hatası");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const t = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [submitted]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const code = String(fd.get("q") || "")
      .trim()
      .toUpperCase();
    if (!code) {
      setError("Takip numarası girin");
      return;
    }
    setError("");
    setSubmitted(code);
  }

  const livePosition = useMemo(() => tracking?.position ?? null, [tracking]);

  return (
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-navy/10 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(11,31,58,0.45)] backdrop-blur sm:p-8"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-navy p-3 text-amber">
              <PackageSearch className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-navy">
                Sevkiyat Takibi
              </h2>
              <p className="mt-1 text-sm text-slate-ink/70">
                Takip numaranızla gönderici, TC, GSM, güzergâh ve harita
                konumunu görün.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="tracking" className="text-navy">
              Takip numarası
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="tracking"
                name="q"
                defaultValue={initial}
                placeholder="Örn. AL2026695781"
                autoComplete="off"
                className="h-11 w-full rounded-lg border border-navy/15 bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button
                type="submit"
                className="h-11 bg-navy px-6 text-white hover:bg-navy-deep"
              >
                Sorgula
              </Button>
            </div>
            <p className="text-xs text-slate-ink/50">
              Örnek: AL2026695781
            </p>
          </div>
        </form>
      </FadeIn>

      {submitted ? (
        <FadeIn delay={0.08} className="mt-8">
          {loading && !tracking ? (
            <div className="rounded-2xl border border-navy/10 bg-white px-6 py-10 text-center text-sm text-slate-ink/60">
              Sorgulanıyor…
            </div>
          ) : null}

          {tracking && livePosition ? (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 bg-navy px-6 py-5 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-amber">
                      Takip No
                    </p>
                    <p className="mt-1 font-display text-2xl tracking-wide">
                      {tracking.code}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-4 py-2 text-sm font-semibold text-amber">
                    <Truck className="size-4" />
                    {tracking.statusLabel}
                  </div>
                </div>

                <div className="grid gap-4 border-b border-navy/10 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Meta label="Ad Soyad" value={tracking.customerName} />
                  <Meta label="TC Kimlik" value={tracking.tcKimlik} />
                  <Meta label="GSM" value={tracking.gsm} />
                  <Meta
                    label="Alıcı"
                    value={
                      tracking.receiverName
                        ? `${tracking.receiverName}${tracking.receiverGsm ? ` · ${tracking.receiverGsm}` : ""}`
                        : "—"
                    }
                  />
                  <Meta label="Güzergâh" value={tracking.routeLabel} />
                  <Meta
                    label="Yük"
                    value={`${tracking.cargoType}${tracking.cargoWeightKg ? ` · ${tracking.cargoWeightKg} kg` : ""} · ${tracking.packageCount} parça`}
                  />
                  <Meta
                    label="Plaka"
                    value={tracking.vehiclePlate || "—"}
                  />
                  <Meta label="Mesafe" value={`${tracking.distanceKm} km`} />
                  <Meta
                    label="Kalan / ETA"
                    value={`${tracking.remainingKm} km · ~${tracking.etaHours} sa`}
                  />
                </div>

                <div className="grid gap-4 border-b border-navy/10 px-6 py-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
                      Çıkış adresi
                    </p>
                    <p className="mt-1 text-sm font-medium text-navy">
                      {tracking.origin.full}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
                      Teslimat adresi
                    </p>
                    <p className="mt-1 text-sm font-medium text-navy">
                      {tracking.destination.full}
                    </p>
                  </div>
                  {tracking.notes ? (
                    <div className="sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
                        Not
                      </p>
                      <p className="mt-1 text-sm text-navy">{tracking.notes}</p>
                    </div>
                  ) : null}
                </div>

                <div className="px-4 py-4 sm:px-6">
                  <TrackingMapClient
                    origin={{
                      lat: tracking.origin.lat,
                      lng: tracking.origin.lng,
                      label: tracking.origin.province,
                    }}
                    destination={{
                      lat: tracking.destination.lat,
                      lng: tracking.destination.lng,
                      label: tracking.destination.province,
                    }}
                    position={livePosition}
                    progress={tracking.progress}
                    statusLabel={tracking.statusLabel}
                    moving={tracking.status !== "TeslimEdildi"}
                  />
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy/10">
                    <div
                      className="h-full rounded-full bg-amber transition-all duration-700"
                      style={{
                        width: `${Math.round(tracking.progress * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-ink/55">
                    İstikamet: {tracking.routeLabel} · İlerleme %
                    {Math.round(tracking.progress * 100)}
                  </p>
                </div>
              </div>

              <ol className="space-y-0 rounded-2xl border border-navy/10 bg-white px-6 py-6">
                {tracking.events.map((event, index) => (
                  <li
                    key={`${event.createdAt}-${index}`}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    {index < tracking.events.length - 1 ? (
                      <span className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-navy/15" />
                    ) : null}
                    <span className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-amber">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-navy">{event.title}</p>
                      <p className="mt-1 text-sm text-slate-ink/65">
                        {event.location} ·{" "}
                        {new Date(event.createdAt).toLocaleString("tr-TR")}
                      </p>
                      {event.note ? (
                        <p className="mt-1 text-sm text-slate-ink/70">
                          {event.note}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {error && !tracking ? (
            <div className="rounded-2xl border border-dashed border-navy/20 bg-white/70 px-6 py-10 text-center">
              <p className="font-display text-xl text-navy">Kayıt bulunamadı</p>
              <p className="mt-2 text-sm text-slate-ink/65">
                “{submitted}” numaralı sevkiyat sistemde yer almıyor.
              </p>
            </div>
          ) : null}
        </FadeIn>
      ) : null}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-navy">{value}</p>
    </div>
  );
}

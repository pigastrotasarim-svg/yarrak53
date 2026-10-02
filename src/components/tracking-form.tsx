"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PackageSearch, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sampleShipments } from "@/lib/site";
import { FadeIn } from "@/components/motion";

export function TrackingForm() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial.trim().toUpperCase());

  const shipment = useMemo(() => {
    if (!submitted) return null;
    return sampleShipments[submitted] ?? null;
  }, [submitted]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(query.trim().toUpperCase());
  }

  return (
    <div className="mx-auto max-w-3xl">
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
                Takip numaranızı girerek gönderinizin güncel durumunu öğrenin.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="tracking" className="text-navy">
              Takip numarası
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="tracking"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Örn. AL2026001847"
                className="h-11 border-navy/15 bg-white"
              />
              <Button
                type="submit"
                className="h-11 bg-navy px-6 text-white hover:bg-navy-deep"
              >
                Sorgula
              </Button>
            </div>
            <p className="text-xs text-slate-ink/55">
              Örnek numaralar: AL2026001847 · AL2026002291 · AL2026003105
            </p>
          </div>
        </form>
      </FadeIn>

      {submitted ? (
        <FadeIn delay={0.08} className="mt-8">
          {shipment ? (
            <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 bg-navy px-6 py-5 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-amber">
                    Takip No
                  </p>
                  <p className="mt-1 font-display text-2xl tracking-wide">
                    {shipment.code}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-4 py-2 text-sm font-semibold text-amber">
                  <Truck className="size-4" />
                  {shipment.status}
                </div>
              </div>

              <div className="grid gap-4 border-b border-navy/10 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
                <Meta label="Gönderi" value={shipment.origin} />
                <Meta label="Varış" value={shipment.destination} />
                <Meta label="Hizmet" value={shipment.service} />
                <Meta
                  label="Tahmini Teslimat"
                  value={shipment.estimatedDelivery}
                />
              </div>

              <ol className="space-y-0 px-6 py-6">
                {shipment.events.map((event, index) => (
                  <li key={`${event.date}-${event.time}`} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < shipment.events.length - 1 ? (
                      <span className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-navy/15" />
                    ) : null}
                    <span className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-amber">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-navy">{event.status}</p>
                      <p className="mt-1 text-sm text-slate-ink/65">
                        {event.location} · {event.date} {event.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-navy/20 bg-white/70 px-6 py-10 text-center">
              <p className="font-display text-xl text-navy">
                Kayıt bulunamadı
              </p>
              <p className="mt-2 text-sm text-slate-ink/65">
                “{submitted}” numaralı sevkiyat sistemde yer almıyor. Numarayı
                kontrol edip tekrar deneyin.
              </p>
            </div>
          )}
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

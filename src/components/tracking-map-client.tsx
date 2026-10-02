"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const TrackingMap = dynamic(
  () => import("@/components/tracking-map").then((m) => m.TrackingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-navy/10 bg-white text-sm text-slate-ink/60">
        Türkiye haritası yükleniyor…
      </div>
    ),
  }
);

export function TrackingMapClient(
  props: ComponentProps<typeof TrackingMap>
) {
  return <TrackingMap {...props} />;
}

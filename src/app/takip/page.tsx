import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { TrackingForm } from "@/components/tracking-form";

export const metadata: Metadata = {
  title: "Takip Sorgulama",
  description:
    "Anadolu Lojistik sevkiyat takip sorgulama. Takip numaranız ile gönderi durumunu öğrenin.",
};

export default function TrackingPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Takip Sorgulama"
        subtitle="Gönderinizin güncel konumunu ve teslimat durumunu anında görüntüleyin."
        image="/images/banner-takip.jpg"
        compact
      />
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl rounded-2xl border border-navy/10 bg-white p-8 text-sm text-slate-ink/60">
              Takip formu yükleniyor…
            </div>
          }
        >
          <TrackingForm />
        </Suspense>
      </section>
    </main>
  );
}

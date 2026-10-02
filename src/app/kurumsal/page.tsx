import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { corporatePages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kurumsal",
  description:
    "Anadolu Lojistik kurumsal yapı, etik uyum, yönetim sistemleri ve KVKK politikaları.",
};

export default function CorporatePage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Kurumsal"
        subtitle="Güven, şeffaflık ve sürdürülebilir operasyon ilkeleriyle büyüyen bir lojistik yapısı."
        image="/images/banner-kurumsal.jpg"
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="max-w-3xl font-display text-3xl tracking-wide text-navy sm:text-4xl">
            Anadolu Lojistik olarak taşımayı yalnızca bir hizmet değil, güven
            ilişkisi olarak görüyoruz.
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-ink/75">
            Antalya Korkuteli merkezli şirketimiz; karayolu taşımacılığı, proje
            lojistiği ve depolama hizmetlerinde planlı süreç yönetimi ile
            müşterilerine ölçülebilir değer sunmayı hedefler.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
          {corporatePages.map((page) => (
            <StaggerItem key={page.slug}>
              <Link
                href={`/kurumsal/${page.slug}`}
                className="group block border-l-2 border-amber bg-white/70 px-5 py-6 transition hover:bg-white"
              >
                <h3 className="font-display text-2xl tracking-wide text-navy">
                  {page.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-ink/70">
                  {page.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-deep">
                  İncele
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}

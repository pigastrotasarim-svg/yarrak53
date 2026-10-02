import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Karayolu taşımacılığı, proje taşımacılığı ve depolama hizmetleri — Anadolu Lojistik.",
};

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Hizmetler"
        subtitle="Türkiye genelinde karayolu, proje ve depolama çözümleriyle operasyonunuza güç katıyoruz."
        image="/images/banner-karayolu.jpg"
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Stagger className="grid gap-10">
          {services.map((service, index) => (
            <StaggerItem key={service.slug}>
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-deep">
                    Hizmetlerimiz
                  </p>
                  <h2 className="mt-2 font-display text-3xl tracking-wide text-navy sm:text-4xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-slate-ink/75">
                    {service.short}
                  </p>
                  <Link
                    href={`/hizmetler/${service.slug}`}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-amber-deep"
                  >
                    Detaylı incele
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn className="mt-16 border-t border-navy/10 pt-10">
          <p className="max-w-2xl text-slate-ink/70">
            Özel tonaj, güzergâh veya depo ihtiyacınız için ekibimiz teklif
            sürecini birlikte planlar.
          </p>
          <Link
            href="/iletisim"
            className="mt-4 inline-flex items-center gap-1 font-semibold text-amber-deep"
          >
            Teklif alın
            <ArrowRight className="size-3.5" />
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}

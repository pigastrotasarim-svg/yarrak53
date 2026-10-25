import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return { title: "Hizmet" };
  return {
    title: service.title,
    description: service.short,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <main className="flex-1">
      <PageHero
        title={service.title}
        subtitle={service.short}
        image={service.image}
        compact
        ctaHref="/iletisim"
        ctaLabel="Teklif İsteyin"
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <FadeIn>
          <h2 className="font-display text-3xl tracking-wide text-navy">
            Hizmet kapsamı
          </h2>
          <p className="mt-4 leading-relaxed text-slate-ink/75">
            {service.description}
          </p>
          <ul className="mt-8 space-y-3">
            {service.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-navy">
                <span className="mt-0.5 rounded-full bg-amber/20 p-1 text-amber-deep">
                  <Check className="size-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/takip"
              className="inline-flex h-10 items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Sevkiyat Takibi
            </Link>
            <Link
              href="/hizmetler"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-navy/20 px-4 text-sm font-semibold text-navy hover:bg-mist"
            >
              Tüm hizmetler
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/12] lg:aspect-[4/5]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </FadeIn>
      </section>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  image: string;
  compact?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

export function PageHero({
  title,
  subtitle,
  image,
  compact = false,
  ctaHref,
  ctaLabel,
}: PageHeroProps) {
  return (
    <section
      className={`relative isolate overflow-hidden ${
        compact ? "min-h-[42vh]" : "min-h-[58vh]"
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/75 to-navy/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30" />

      <div
        className={`relative mx-auto flex max-w-7xl flex-col justify-end px-4 sm:px-6 lg:px-8 ${
          compact ? "pb-12 pt-28" : "pb-16 pt-36"
        }`}
      >
        <FadeIn>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber">
            Anadolu Lojistik
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {ctaHref && ctaLabel ? (
            <div className="mt-8">
              <Button
                render={<Link href={ctaHref} />}
                nativeButton={false}
                size="lg"
                className="bg-amber text-navy hover:bg-amber-light"
              >
                {ctaLabel}
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}

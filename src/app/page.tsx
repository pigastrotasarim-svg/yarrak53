import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Fuel, ShieldCheck, Timer, Warehouse } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { services, site } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="relative isolate min-h-screen overflow-hidden">
        <Image
          src="/images/hero-banner.jpg"
          alt="Anadolu Lojistik filo"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/78 to-navy/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="font-display text-5xl tracking-[0.06em] text-white sm:text-6xl lg:text-7xl">
              ANADOLU
              <span className="mt-1 block text-2xl tracking-[0.35em] text-amber sm:text-3xl">
                LOJİSTİK
              </span>
            </p>
            <h1 className="mt-6 max-w-2xl text-xl font-medium leading-snug text-white/90 sm:text-2xl">
              {site.tagline}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
              Karayolu, proje taşımacılığı ve depolama hizmetleriyle sevkiyat
              süreçlerinizi uçtan uca yönetiyoruz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                render={<Link href="/takip" />}
                nativeButton={false}
                size="lg"
                className="bg-amber text-navy hover:bg-amber-light"
              >
                Takip Sorgulama
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href="/hizmetler" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                Hizmetlerimiz
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="border-b border-amber/20 bg-navy">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Fuel className="size-4 text-amber" />
            <span>Güncel Enerji Maliyetleri</span>
          </div>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-1 font-medium text-amber hover:text-amber-light"
          >
            Değişim oranlarını görmek için bize ulaşın
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden bg-mist py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(11,31,58,0.04) 0%, transparent 45%), radial-gradient(circle at 90% 10%, rgba(196,163,90,0.12), transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-deep">
              Hizmetlerimiz
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-wide text-navy sm:text-5xl">
              Hizmetler
            </h2>
            <p className="mt-3 max-w-2xl text-slate-ink/70">
              Operasyonunuza uygun taşıma ve depolama modeliyle tek çatı
              altında ilerleyin.
            </p>
          </FadeIn>

          <Stagger className="mt-12 grid gap-8 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="group block"
                >
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                  </div>
                  <h3 className="font-display text-2xl tracking-wide text-navy">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ink/70">
                    {service.short}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-deep">
                    İncele
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-navy py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber">
              Neden Anadolu
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">
              Planlı sevkiyat, görünür süreç
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              Antalya merkezli operasyonumuzla Türkiye genelinde güvenilir
              lojistik ağı kuruyor; takip, zamanlama ve saha koordinasyonunu
              aynı standartta yürütüyoruz.
            </p>
          </FadeIn>
          <Stagger className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                icon: Timer,
                title: "Zamanında teslimat",
                text: "Güzergâh planı ve filo takibiyle terminlere bağlı kalırız.",
              },
              {
                icon: ShieldCheck,
                title: "Güvenli operasyon",
                text: "Sigortalı taşıma ve süreç standartlarıyla riskleri azaltırız.",
              },
              {
                icon: Warehouse,
                title: "Depo entegrasyonu",
                text: "Stok görünürlüğü ile sevkiyatı aynı operasyonda birleştiririz.",
              },
            ].map((item) => (
              <StaggerItem
                key={item.title}
                className="border-l border-amber/40 pl-4"
              >
                <item.icon className="size-5 text-amber" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-white/65">{item.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-mist py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-wide text-navy sm:text-4xl">
              Sevkiyatınızı hemen sorgulayın
            </h2>
            <p className="mt-2 text-slate-ink/70">
              Takip numaranız ile anlık durum bilgisini görüntüleyin.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Button
              render={<Link href="/takip" />}
                nativeButton={false}
              size="lg"
              className="bg-navy text-white hover:bg-navy-deep"
            >
              Takip Sorgulama
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

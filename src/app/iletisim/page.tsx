import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { FadeIn } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { getPublicSiteContact } from "@/lib/site-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Anadolu Lojistik iletişim bilgileri. Korkuteli / Antalya ofisimize ulaşın.",
};

export default async function ContactPage() {
  const site = await getPublicSiteContact();

  return (
    <main className="flex-1">
      <PageHero
        title="İletişim"
        subtitle="Teklif, sevkiyat ve operasyon talepleriniz için bize ulaşın."
        image="/images/banner-iletisim.jpg"
        compact
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <FadeIn>
          <h2 className="font-display text-3xl tracking-wide text-navy">
            Bize Ulaşın
          </h2>
          <p className="mt-3 text-slate-ink/70">
            Güncel telefon, e-posta ve adres bilgilerimiz aşağıdadır. Form
            üzerinden de talebinizi iletebilirsiniz.
          </p>

          <ContactInfo initialSite={site} />

          <Link
            href="/takip"
            className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-amber-deep"
          >
            Sevkiyat takibine git
            <ArrowRight className="size-3.5" />
          </Link>
        </FadeIn>

        <FadeIn delay={0.08}>
          <ContactForm />
        </FadeIn>
      </section>
    </main>
  );
}

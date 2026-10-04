import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FadeIn } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { getPublicSiteContact } from "@/lib/site-settings";

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
            Ofisimiz Antalya Korkuteli’nde. Telefon, e-posta veya form üzerinden
            talebinizi iletebilirsiniz.
          </p>

          <ul className="mt-8 space-y-5">
            <li className="flex gap-3">
              <span className="mt-0.5 rounded-lg bg-navy p-2 text-amber">
                <MapPin className="size-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
                  Adres
                </p>
                <p className="mt-1 text-navy">
                  {site.address.lines[0]}
                  <br />
                  {site.address.lines[1]}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 rounded-lg bg-navy p-2 text-amber">
                <Phone className="size-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
                  Telefon / GSM
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-1 block text-navy hover:text-amber-deep"
                >
                  {site.phone}
                </a>
                <a
                  href={site.phone2Href}
                  className="block text-navy hover:text-amber-deep"
                >
                  {site.phone2}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 rounded-lg bg-navy p-2 text-amber">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-ink/45">
                  E-posta
                </p>
                <a
                  href={site.emailHref}
                  className="mt-1 block text-navy hover:text-amber-deep"
                >
                  {site.email}
                </a>
              </div>
            </li>
          </ul>

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

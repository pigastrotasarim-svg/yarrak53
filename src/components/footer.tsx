"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { corporatePages, services, site as fallback } from "@/lib/site";
import type { PublicSiteContact } from "@/lib/site-settings";

export function Footer() {
  const [site, setSite] = useState<PublicSiteContact>({
    name: fallback.name,
    tagline: fallback.tagline,
    phone: fallback.phone,
    phone2: fallback.phone,
    phoneHref: fallback.phoneHref,
    phone2Href: fallback.phoneHref,
    email: fallback.email,
    emailHref: fallback.emailHref,
    address: {
      lines: [fallback.address.lines[0], fallback.address.lines[1]],
    },
    copyrightYear: fallback.copyrightYear,
  });

  useEffect(() => {
    fetch("/api/site-contact")
      .then((r) => r.json())
      .then((d) => {
        if (d.site) setSite(d.site);
      })
      .catch(() => undefined);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(196,163,90,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 35%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt={site.name}
              width={48}
              height={48}
              className="size-12 rounded-full object-cover ring-1 ring-amber/60"
            />
            <div>
              <p className="font-display text-2xl tracking-wide">ANADOLU</p>
              <p className="text-xs uppercase tracking-[0.28em] text-amber">
                Lojistik
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Karayolu taşımacılığı, proje lojistiği ve depolama hizmetleriyle
            Türkiye genelinde güvenilir sevkiyat çözümleri.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg tracking-wide text-amber">
            İletişim
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber" />
              <span>
                {site.address.lines[0]}
                <br />
                {site.address.lines[1]}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-amber" />
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-amber" />
              <a href={site.phone2Href} className="hover:text-white">
                {site.phone2}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-amber" />
              <a href={site.emailHref} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg tracking-wide text-amber">
            Hızlı Erişim
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {corporatePages.map((page) => (
              <Link
                key={page.slug}
                href={`/kurumsal/${page.slug}`}
                className="text-white/75 hover:text-white"
              >
                {page.title}
              </Link>
            ))}
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/hizmetler/${service.slug}`}
                className="text-white/75 hover:text-white"
              >
                {service.title}
              </Link>
            ))}
            <Link href="/iletisim" className="text-white/75 hover:text-white">
              Bize Ulaşın
            </Link>
            <Link href="/takip" className="text-white/75 hover:text-white">
              Takip Sorgulama
            </Link>
            <Link href="/admin" className="text-white/75 hover:text-white">
              Yönetim Paneli
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/55 sm:px-6 lg:px-8 lg:text-left">
          Copyright © {site.copyrightYear} {site.name}.
        </p>
      </div>
    </footer>
  );
}

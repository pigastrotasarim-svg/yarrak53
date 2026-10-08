"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { site as fallback } from "@/lib/site";
import type { PublicSiteContact } from "@/lib/site-settings";

const initial: PublicSiteContact = {
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
};

export function ContactInfo({ initialSite }: { initialSite?: PublicSiteContact }) {
  const [site, setSite] = useState<PublicSiteContact>(initialSite ?? initial);
  const [loaded, setLoaded] = useState(Boolean(initialSite));

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-contact", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.site) {
          setSite(d.site);
          setLoaded(true);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className={`mt-8 space-y-5 ${loaded ? "" : "opacity-80"}`}>
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
          {site.phone2 && site.phone2 !== site.phone ? (
            <a
              href={site.phone2Href}
              className="block text-navy hover:text-amber-deep"
            >
              {site.phone2}
            </a>
          ) : null}
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
  );
}

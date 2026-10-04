import { prisma } from "@/lib/db";
import { site as defaults } from "@/lib/site";

export type PublicSiteContact = {
  name: string;
  tagline: string;
  phone: string;
  phone2: string;
  phoneHref: string;
  phone2Href: string;
  email: string;
  emailHref: string;
  address: { lines: [string, string] };
  copyrightYear: number;
};

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:+${digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`}` : "#";
}

export async function getSiteSettings() {
  const row = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      phone1: defaults.phone,
      phone2: defaults.phone,
      email: defaults.email,
      addressLine1: defaults.address.lines[0],
      addressLine2: defaults.address.lines[1],
    },
  });
  return row;
}

export async function getPublicSiteContact(): Promise<PublicSiteContact> {
  try {
    const s = await getSiteSettings();
    return {
      name: defaults.name,
      tagline: defaults.tagline,
      phone: s.phone1,
      phone2: s.phone2,
      phoneHref: telHref(s.phone1),
      phone2Href: telHref(s.phone2),
      email: s.email,
      emailHref: `mailto:${s.email}`,
      address: { lines: [s.addressLine1, s.addressLine2] },
      copyrightYear: defaults.copyrightYear,
    };
  } catch {
    return {
      name: defaults.name,
      tagline: defaults.tagline,
      phone: defaults.phone,
      phone2: defaults.phone,
      phoneHref: defaults.phoneHref,
      phone2Href: defaults.phoneHref,
      email: defaults.email,
      emailHref: defaults.emailHref,
      address: {
        lines: [defaults.address.lines[0], defaults.address.lines[1]],
      },
      copyrightYear: defaults.copyrightYear,
    };
  }
}

export function formatAddress(parts: {
  mahalle?: string | null;
  street?: string | null;
  buildingNo?: string | null;
  floor?: string | null;
  apartment?: string | null;
  address?: string | null;
  district: string;
  province: string;
}) {
  if (parts.address && parts.address.trim()) {
    return `${parts.address}, ${parts.district} / ${parts.province}`;
  }
  const bits = [
    parts.mahalle,
    parts.street,
    parts.buildingNo ? `No: ${parts.buildingNo}` : "",
    parts.floor ? `Kat: ${parts.floor}` : "",
    parts.apartment ? `Daire: ${parts.apartment}` : "",
  ].filter(Boolean);
  const line = bits.join(" ");
  return line
    ? `${line}, ${parts.district} / ${parts.province}`
    : `${parts.district} / ${parts.province}`;
}

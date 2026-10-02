import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { site } from "@/lib/site";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Karayolu, Proje ve Depolama`,
    template: `%s | ${site.name}`,
  },
  description:
    "Anadolu Lojistik — Türkiye genelinde karayolu taşımacılığı, proje lojistiği ve depolama hizmetleri. Sevkiyat takibi ve kurumsal lojistik çözümleri.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

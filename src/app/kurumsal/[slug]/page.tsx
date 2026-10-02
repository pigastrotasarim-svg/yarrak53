import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { corporatePages, site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

const content: Record<
  string,
  { intro: string; sections: { heading: string; body: string }[] }
> = {
  hakkimizda: {
    intro:
      "Anadolu Lojistik, Antalya Korkuteli merkezli bir lojistik firması olarak karayolu taşımacılığı, proje lojistiği ve depolama çözümlerini aynı operasyon disipliniyle sunar.",
    sections: [
      {
        heading: "Misyonumuz",
        body: "Müşterilerimizin ürünlerini zamanında, güvenli ve izlenebilir şekilde teslim ederek tedarik zinciri süreçlerini sadeleştirmek.",
      },
      {
        heading: "Vizyonumuz",
        body: "Türkiye genelinde güvenilen, şeffaf ve ölçülebilir hizmet kalitesiyle öne çıkan bir lojistik markası olmak.",
      },
      {
        heading: "Operasyon yaklaşımımız",
        body: "Filo planlaması, saha koordinasyonu ve müşteri bilgilendirmesini birlikte yürüterek sürprizleri azaltır, süreci görünür kılarız.",
      },
    ],
  },
  "etik-ve-uyum": {
    intro:
      "Etik ve uyum yönetimi, Anadolu Lojistik’te günlük karar alma süreçlerinin ayrılmaz parçasıdır. Yasalara, sözleşmelere ve dürüst rekabete bağlı kalırız.",
    sections: [
      {
        heading: "Dürüstlük",
        body: "Tedarikçiler, müşteriler ve çalışanlarla ilişkilerde şeffaf iletişim ve doğru bilgilendirme esas alınır.",
      },
      {
        heading: "Yasal uyum",
        body: "Taşıma, depolama ve istihdam süreçlerinde ilgili mevzuata uygunluk düzenli olarak gözden geçirilir.",
      },
      {
        heading: "Çıkar çatışması",
        body: "Kişisel çıkarların şirket kararlarını etkilemesine izin vermeyen bir yönetim anlayışı benimsenir.",
      },
    ],
  },
  "yonetim-sistemleri": {
    intro:
      "Yönetim sistemlerimiz kalite, iş sağlığı ve çevre sorumluluğunu operasyonun merkezine alır; sürekli iyileştirme kültürünü destekler.",
    sections: [
      {
        heading: "Kalite",
        body: "Sevkiyat ve depo süreçlerinde standart iş akışları, kontrol listeleri ve performans takipleriyle hizmet kalitesini güvence altına alırız.",
      },
      {
        heading: "İş sağlığı ve güvenlik",
        body: "Saha ekipleri ve depo personeli için güvenlik prosedürleri, eğitimler ve ekipman kontrolleri düzenli uygulanır.",
      },
      {
        heading: "Süreç iyileştirme",
        body: "Geri bildirimler ve operasyon verileriyle güzergâh, yükleme ve stok süreçlerini sürekli optimize ederiz.",
      },
    ],
  },
  "kisisel-verilerin-korunmasi": {
    intro:
      `${site.name}, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizi hukuka uygun, amaçla sınırlı ve güvenli şekilde işler.`,
    sections: [
      {
        heading: "Toplanan veriler",
        body: "İletişim formları, teklif talepleri ve sevkiyat süreçlerinde ad-soyad, iletişim ve sevkiyat bilgileri gibi veriler işlenebilir.",
      },
      {
        heading: "İşleme amaçları",
        body: "Veriler; teklif hazırlama, sevkiyat yönetimi, müşteri iletişimi ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır.",
      },
      {
        heading: "Haklarınız",
        body: `KVKK kapsamındaki taleplerinizi ${site.email} adresine iletebilirsiniz. Başvurular makul süre içinde değerlendirilir.`,
      },
    ],
  },
};

export function generateStaticParams() {
  return corporatePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = corporatePages.find((item) => item.slug === slug);
  if (!page) return { title: "Kurumsal" };
  return {
    title: page.title,
    description: page.summary,
  };
}

export default async function CorporateDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = corporatePages.find((item) => item.slug === slug);
  const detail = content[slug];
  if (!page || !detail) notFound();

  return (
    <main className="flex-1">
      <PageHero
        title={page.title}
        subtitle={page.summary}
        image="/images/banner-kurumsal.jpg"
        compact
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-lg leading-relaxed text-slate-ink/80">
            {detail.intro}
          </p>
        </FadeIn>

        <div className="mt-10 space-y-8">
          {detail.sections.map((section, index) => (
            <FadeIn key={section.heading} delay={index * 0.06}>
              <h2 className="font-display text-2xl tracking-wide text-navy">
                {section.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-ink/75">
                {section.body}
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 border-t border-navy/10 pt-8">
          <Link
            href="/kurumsal"
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-deep"
          >
            Kurumsal sayfaya dön
            <ArrowRight className="size-3.5" />
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}

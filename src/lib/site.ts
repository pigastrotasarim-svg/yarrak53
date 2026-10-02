export const site = {
  name: "Anadolu Lojistik",
  tagline: "Türkiye'nin her köşesine güvenli teslimat",
  phone: "+90 242 255 06 98",
  phoneHref: "tel:+902422550698",
  email: "info@anadolulojistik.com",
  emailHref: "mailto:info@anadolulojistik.com",
  address: {
    lines: ["Aşağıpazar Mahallesi 606 Sokak No: 5", "Korkuteli / Antalya"],
  },
  copyrightYear: 2026,
} as const;

export const navItems = [
  { href: "/takip", label: "Takip Sorgulama" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const services = [
  {
    slug: "karayolu-tasimaciligi",
    title: "Karayolu Taşımacılığı",
    short:
      "Türkiye'nin her bir köşesine standart taşıma ölçülerine uygun bir şekilde ürünlerinizi güvenle teslim ediyoruz.",
    description:
      "Parsiyel ve komple yük taşımacılığında geniş araç filomuz ile Türkiye genelinde zamanında, güvenli ve izlenebilir sevkiyatlar gerçekleştiriyoruz. Standart ölçü ve tonajlara uygun ekipmanlarımız sayesinde ürünleriniz yükleme noktasından teslim noktasına kadar kontrol altında ilerler.",
    image: "/images/banner-karayolu.jpg",
    highlights: [
      "Türkiye geneli parsiyel ve komple taşıma",
      "Standart ölçü ve tonaja uygun filo",
      "Canlı sevkiyat takibi",
      "Sigortalı ve güvenli teslimat",
    ],
  },
  {
    slug: "proje-tasimaciligi",
    title: "Proje Taşımacılığı",
    short:
      "Yüksek tonajlı yükleriniz için tecrübeli ekip, en uygun nakil ve ekipmanlar ile sorunsuz projeler.",
    description:
      "Ağır ve oversized yüklerde güzergâh analizi, özel ekipman seçimi ve deneyimli saha ekibiyle uçtan uca proje lojistiği sunuyoruz. Sanayi, enerji ve altyapı projelerinizde teslimat risklerini azaltır, operasyonu planlı şekilde yönetiriz.",
    image: "/images/banner-proje.jpg",
    highlights: [
      "Yüksek tonaj ve oversized yükler",
      "Özel treyler ve ekipman parkı",
      "Güzergâh ve izin planlaması",
      "Saha koordinasyonu ve eskort",
    ],
  },
  {
    slug: "depolama-hizmetleri",
    title: "Depolama Hizmetleri",
    short:
      "Doğru ve eş zamanlı stok takibi, katma değerli servisler ile operasyon maliyetlerinizin azaltılmasını sağlayan akılcı çözümler.",
    description:
      "Modern depolama alanlarımızda stok görünürlüğü, sipariş hazırlama ve katma değerli hizmetlerle tedarik zincirinizi sadeleştiriyoruz. Eş zamanlı takip sayesinde envanterinizi kontrol altında tutar, operasyon maliyetlerinizi düşürmenize yardımcı oluruz.",
    image: "/images/banner-depolama.jpg",
    highlights: [
      "Eş zamanlı stok takibi",
      "Sipariş toplama ve sevkiyat",
      "Katma değerli depo servisleri",
      "Maliyet odaklı operasyon",
    ],
  },
] as const;

export const corporatePages = [
  {
    slug: "hakkimizda",
    title: "Hakkımızda",
    summary:
      "Anadolu Lojistik olarak karayolu, proje ve depolama çözümleriyle işletmelerin lojistik yükünü hafifletiyoruz.",
  },
  {
    slug: "etik-ve-uyum",
    title: "Etik ve Uyum Yönetimi",
    summary:
      "Şeffaf iş yapış biçimi, yasal uyum ve dürüstlük ilkeleri tüm süreçlerimizin temelidir.",
  },
  {
    slug: "yonetim-sistemleri",
    title: "Yönetim Sistemleri",
    summary:
      "Kalite, iş sağlığı ve çevre odaklı yönetim yaklaşımıyla operasyonlarımızı sürekli iyileştiriyoruz.",
  },
  {
    slug: "kisisel-verilerin-korunmasi",
    title: "Kişisel Verilerin Korunması",
    summary:
      "KVKK kapsamında kişisel verilerinizi güvenli, amaçla sınırlı ve şeffaf şekilde işleriz.",
  },
] as const;

export type TrackingEvent = {
  date: string;
  time: string;
  location: string;
  status: string;
};

export type TrackingShipment = {
  code: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  service: string;
  events: TrackingEvent[];
};

export const sampleShipments: Record<string, TrackingShipment> = {
  AL2026001847: {
    code: "AL2026001847",
    status: "Dağıtımda",
    origin: "Korkuteli / Antalya",
    destination: "Keçiören / Ankara",
    estimatedDelivery: "3 Ekim 2026",
    service: "Karayolu Taşımacılığı",
    events: [
      {
        date: "2 Ekim 2026",
        time: "09:40",
        location: "Ankara Dağıtım Merkezi",
        status: "Dağıtıma çıktı",
      },
      {
        date: "1 Ekim 2026",
        time: "22:15",
        location: "Ankara Aktarma",
        status: "Aktarma merkezine ulaştı",
      },
      {
        date: "1 Ekim 2026",
        time: "06:05",
        location: "Isparta",
        status: "Yolda",
      },
      {
        date: "30 Eylül 2026",
        time: "16:20",
        location: "Korkuteli / Antalya",
        status: "Yükleme tamamlandı",
      },
    ],
  },
  AL2026002291: {
    code: "AL2026002291",
    status: "Depoda",
    origin: "Gaziemir / İzmir",
    destination: "Korkuteli / Antalya",
    estimatedDelivery: "5 Ekim 2026",
    service: "Depolama + Sevkiyat",
    events: [
      {
        date: "2 Ekim 2026",
        time: "11:00",
        location: "Anadolu Lojistik Depo",
        status: "Stok kaydı güncellendi",
      },
      {
        date: "30 Eylül 2026",
        time: "14:45",
        location: "Gaziemir / İzmir",
        status: "Depoya kabul edildi",
      },
    ],
  },
  AL2026003105: {
    code: "AL2026003105",
    status: "Teslim edildi",
    origin: "Korkuteli / Antalya",
    destination: "Nilüfer / Bursa",
    estimatedDelivery: "28 Eylül 2026",
    service: "Proje Taşımacılığı",
    events: [
      {
        date: "28 Eylül 2026",
        time: "15:30",
        location: "Nilüfer / Bursa",
        status: "Alıcıya teslim edildi",
      },
      {
        date: "27 Eylül 2026",
        time: "08:10",
        location: "Balıkesir",
        status: "Yolda",
      },
      {
        date: "26 Eylül 2026",
        time: "10:00",
        location: "Korkuteli / Antalya",
        status: "Özel ekipman ile yüklendi",
      },
    ],
  },
};

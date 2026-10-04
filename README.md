# Anadolu Lojistik

Türkiye genelinde karayolu taşımacılığı, proje lojistiği ve depolama hizmetleri sunan kurumsal lojistik web sitesi. Admin paneli ile takip kodu oluşturma, il/ilçe seçimi, mesafe hesabı ve Türkiye haritasında kamyon animasyonu içerir.

## Özellikler

- Ana sayfa ve marka odaklı hero
- Canlı sevkiyat takibi + Türkiye haritası (`/takip`)
- Admin paneli (`/admin`) — takip kodu, durum güncelleme
- Türkiye il/ilçe API (turkiyeapi.dev, offline fallback)
- Kurumsal / hizmetler / iletişim sayfaları

## Geliştirme

```bash
# Postgres (Docker)
docker compose up -d

cp .env.example .env
npm install
npm run db:setup
npm run dev -- --port 43123
```

- Site: [http://127.0.0.1:43123](http://127.0.0.1:43123)
- Admin: [http://127.0.0.1:43123/admin](http://127.0.0.1:43123/admin)
- Varsayılan giriş: `admin` / `anadolu2026`

## Admin akışı

1. `/admin` ile giriş yapın
2. **Yeni takip** → Ad Soyad, GSM, çıkış il/ilçe, teslim il/ilçe
3. Sistem takip kodu üretir, şehirler arası mesafeyi hesaplar
4. Durumu güncelleyin: Yükleme yapıldı → Yola çıktı → Yolda → …
5. Müşteri `/takip` üzerinden kodu sorgular; haritada kamyon istikamet üzerinde ilerler

## Railway’ye yükleme (önerilen)

Adım adım: [RAILWAY.md](./RAILWAY.md)

Özet:
1. GitHub’a push  
2. Railway → New Project → GitHub repo  
3. **PostgreSQL** ekle  
4. Env: `DATABASE_URL` (Postgres reference), `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`  
5. Domain üret → `/admin` ile giriş

## Netlify

Mümkün (Postgres ile). Rehber: [NETLIFY.md](./NETLIFY.md)  
Veritabanlı kullanım için **Railway daha kolay**.

## Plesk

Node.js 20 + Postgres (veya harici DB). Startup: `server.js`  
`DATABASE_URL` Postgres connection string olmalı.

## Teknoloji

Next.js, Prisma (PostgreSQL), Leaflet, Türkiye API, TypeScript, Tailwind, shadcn/ui

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
npm install
cp .env.example .env
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

## Netlify’ye yükleme

Adım adım rehber: [NETLIFY.md](./NETLIFY.md)

Özet:
1. [Neon](https://neon.tech) ile ücretsiz Postgres oluştur  
2. `prisma/schema.prisma` → `provider = "postgresql"`  
3. GitHub’a push → Netlify’den Import  
4. Env: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`  
5. Deploy (`netlify.toml` hazır)

> Netlify’de SQLite kullanılamaz; admin/takip için Postgres şart.

## Plesk’e kurulum

Next.js + SQLite/Node.js gerekir.

### Node.js ayarları
| Ayar | Değer |
|------|--------|
| Node.js | 20.x |
| Application root | `package.json` klasörü |
| Startup file | `server.js` |
| Mode | production |

### Komutlar
```bash
npm install
cp .env.example .env   # şifreleri değiştirin
npx prisma migrate deploy
npm run db:seed
npm run build
# Plesk: Restart App
```

`DATABASE_URL` örneği: `file:./prisma/prod.db`  
Plesk’te yazılabilir bir yola koyun.

## Teknoloji

Next.js, Prisma (SQLite), Leaflet, Türkiye API, TypeScript, Tailwind, shadcn/ui

# Netlify’ye yükleme (Anadolu Lojistik)

Bu proje **Next.js + PostgreSQL** kullanıyor. Netlify’de Neon/Postgres `DATABASE_URL` gerekir.

> Daha kolay yol: [RAILWAY.md](./RAILWAY.md) (Postgres tek tık).

## 1) Neon veritabanı (ücretsiz)

1. [neon.tech](https://neon.tech) → hesap aç → yeni proje
2. Connection string kopyala (`postgresql://...?...sslmode=require`)

## 2) Migration

```bash
# .env içine Neon DATABASE_URL yapıştır
npx prisma migrate deploy
npm run db:seed
```

## 3) GitHub’a push

Repoyu GitHub’a yükle (Netlify GitHub’dan çeker).

## 4) Netlify site oluştur

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. GitHub reposunu seç
3. Build ayarları (çoğu `netlify.toml` ile otomatik gelir):
   - **Build command:** `npm run build:netlify`
   - **Publish directory:** `.next` (plugin yönetir)
   - **Node version:** 20

## 5) Environment variables (Netlify)

Site → **Site configuration** → **Environment variables** → Add:

| Key | Örnek değer |
|-----|-------------|
| `DATABASE_URL` | Neon connection string |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | güçlü bir şifre |
| `AUTH_SECRET` | rastgele uzun metin |

Deploy context: **All scopes** / Production + Deploy Previews.

## 6) Deploy

**Deploy site** / push sonrası otomatik build.

İlk deploy sonrası admin:

- `https://SENIN-SITE.netlify.app/admin`
- Netlify’ye yazdığın kullanıcı/şifre

## 7) Domain (opsiyonel)

Netlify → Domain management → custom domain + HTTPS (otomatik).

## Sık hatalar

| Hata | Çözüm |
|------|--------|
| Build: SQLite / file: | `DATABASE_URL` Neon Postgres olmalı, `provider = "postgresql"` |
| Admin giriş olmuyor | `ADMIN_*` ve `AUTH_SECRET` env’leri set mi, seed çalıştı mı? |
| İl/ilçe boş | Netlify’den dış API (`turkiyeapi.dev`) çıkışına izin var; fallback il listesi yine gelir |
| Map görünmüyor | Leaflet client-side; ad blocker / network engeli kontrol et |

## Alternatif

Kalıcı SQLite istiyorsan Netlify yerine **Plesk / VPS** kullan (`README` içindeki Plesk bölümü). Netlify sunucusuz (serverless) çalışır; dosya tabanlı DB tutmaz.

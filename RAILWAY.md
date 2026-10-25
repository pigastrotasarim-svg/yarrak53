# Railway’ye yükleme (Can Lojistik)

Bu proje **Next.js + PostgreSQL** ile Railway’de çalışır.

> Node.js **20+** gerekir (`nixpacks.toml` / `.nvmrc` / `package.json` engines).

## 1) GitHub

Repoyu GitHub’a push’la (veya Railway GitHub bağla).

## 2) Railway proje

1. [railway.app](https://railway.app) → giriş → **New Project**
2. **Deploy from GitHub repo** → bu repoyu seç
3. Projede **+ New** → **Database** → **PostgreSQL** ekle

## 3) Env değişkenleri

Web servisine (Next.js) şunları ekle:

| Değişken | Değer |
|----------|--------|
| `DATABASE_URL` | Postgres servisinden **Variable** → `DATABASE_URL`’i **Reference** et |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | güçlü şifre |
| `AUTH_SECRET` | rastgele uzun metin |
| `NODE_ENV` | `production` |

`DATABASE_URL` için Railway UI’da:
**Variables** → **Add variable** → **Add a reference** → Postgres → `DATABASE_URL`

## 4) Deploy

Push veya **Deploy** ile build başlar.

`railway.toml` otomatik:
- build: `prisma generate` + `next build`
- release: `migrate deploy` + seed (healthcheck’i bloklamaz)
- start: `next start`

> `DATABASE_URL` boşsa veya Postgres’e erişilemezse release/start `SIGTERM` ile düşer. Web servisinde Postgres `DATABASE_URL` reference’ı olduğundan emin ol.

## 5) Domain

Service → **Settings** → **Networking** → **Generate Domain**  
Örn. `can-lojistik.up.railway.app`

Admin: `https://SENIN-DOMAIN/admin`

## Lokal geliştirme

```bash
# Docker ile Postgres
docker compose up -d

cp .env.example .env
npm install
npm run db:setup
npm run dev -- --port 43123
```

## CLI ile (opsiyonel)

```bash
npm i -g @railway/cli
railway login
railway init
railway add --database postgres
railway variables set ADMIN_USERNAME=admin ADMIN_PASSWORD=... AUTH_SECRET=...
railway up
```

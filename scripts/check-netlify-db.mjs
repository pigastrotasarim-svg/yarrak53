#!/usr/bin/env node
/**
 * Netlify build guard: SQLite file DB cannot persist on Netlify functions.
 */
const url = process.env.DATABASE_URL || "";

if (!url) {
  console.error("❌ DATABASE_URL eksik. Netlify → Site settings → Environment variables");
  process.exit(1);
}

if (url.startsWith("file:")) {
  console.error("❌ Netlify'de SQLite (file:...) kullanılamaz.");
  console.error("   Ücretsiz Neon Postgres alıp DATABASE_URL'i oraya bağlayın:");
  console.error("   https://neon.tech");
  console.error("   Örnek: postgresql://USER:PASS@HOST/DB?sslmode=require");
  console.error("   Sonra prisma/schema.prisma içinde provider = \"postgresql\" yapın.");
  process.exit(1);
}

console.log("✓ DATABASE_URL sunucu veritabanına işaret ediyor");

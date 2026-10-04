"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") || "").trim();
    const password = String(fd.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Giriş başarısız");
        setLoading(false);
        return;
      }
      // Hard navigate so session cookie is applied reliably behind tunnels.
      window.location.assign("/admin");
    } catch {
      setError("Bağlantı hatası, tekrar deneyin");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-deep">
          Anadolu Lojistik
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-wide text-navy">
          Admin Girişi
        </h1>
        <p className="mt-2 text-sm text-slate-ink/65">
          Takip kodu oluşturmak ve sevkiyat durumunu yönetmek için giriş yapın.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="username" className="mb-2 inline-block">
              Kullanıcı adı
            </Label>
            <input
              id="username"
              name="username"
              defaultValue="admin"
              required
              autoComplete="username"
              className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2 inline-block">
              Şifre
            </Label>
            <input
              id="password"
              name="password"
              type="password"
              required
              defaultValue="anadolu2026"
              autoComplete="current-password"
              className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-xs text-slate-ink/50">
              Varsayılan: admin / anadolu2026
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-navy text-white hover:bg-navy-deep"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş yap"}
          </Button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-amber-deep hover:underline"
        >
          Siteye dön
        </Link>
      </div>
    </main>
  );
}

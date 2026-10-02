"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Giriş başarısız");
      return;
    }
    router.push("/admin");
    router.refresh();
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
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2 inline-block">
              Şifre
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              required
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

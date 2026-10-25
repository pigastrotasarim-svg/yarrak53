"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminNav({ username }: { username: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-navy/10 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div>
          <Link href="/admin" className="font-display text-xl tracking-wide">
            Can Admin
          </Link>
          <p className="text-xs text-white/60">Oturum: {username}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="inline-flex h-9 items-center rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
          >
            Sevkiyatlar
          </Link>
          <Link
            href="/admin/yeni"
            className="inline-flex h-9 items-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber-light"
          >
            Yeni takip
          </Link>
          <Link
            href="/admin/ayarlar"
            className="inline-flex h-9 items-center rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
          >
            GSM / İletişim
          </Link>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-white hover:bg-white/10"
            onClick={logout}
          >
            Çıkış
          </button>
        </div>
      </div>
    </div>
  );
}

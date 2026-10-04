"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
            Anadolu Admin
          </Link>
          <p className="text-xs text-white/60">Oturum: {username}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            render={<Link href="/admin" />}
            nativeButton={false}
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            Sevkiyatlar
          </Button>
          <Button
            render={<Link href="/admin/yeni" />}
            nativeButton={false}
            className="bg-amber text-navy hover:bg-amber-light"
          >
            Yeni takip
          </Button>
          <Button
            render={<Link href="/admin/ayarlar" />}
            nativeButton={false}
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            GSM / İletişim
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={logout}
          >
            Çıkış
          </Button>
        </div>
      </div>
    </div>
  );
}

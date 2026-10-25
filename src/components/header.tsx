"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get("q") || "").trim();
    setSearchOpen(false);
    setOpen(false);
    router.push(q ? `/takip?q=${encodeURIComponent(q)}` : "/takip");
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-navy/95 shadow-lg backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt={site.name}
            width={52}
            height={52}
            className="size-12 rounded-full object-cover ring-2 ring-amber/80 shadow-lg"
            priority
          />
          <div className="leading-tight">
            <span className="block font-display text-xl tracking-[0.04em] text-white sm:text-2xl">
              CAN
            </span>
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-amber">
              Lojistik
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {searchOpen ? (
            <form onSubmit={onSearch} className="flex items-center gap-2">
              <input
                name="q"
                placeholder="Takip no veya ara…"
                className="h-9 w-52 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/55 focus-visible:ring-2 focus-visible:ring-amber/50"
                autoFocus
              />
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
                onClick={() => setSearchOpen(false)}
                aria-label="Aramayı kapat"
              >
                <X className="size-4" />
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber-light"
              >
                Ara
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
              onClick={() => setSearchOpen(true)}
              aria-label="Ara"
            >
              <Search className="size-4" />
            </button>
          )}
          <Link
            href="/takip"
            className="inline-flex h-9 items-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber-light"
          >
            Takip Et
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy/95 px-4 py-4 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-base font-medium text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={onSearch} className="mt-3 flex gap-2">
            <input
              name="q"
              placeholder="Takip numarası…"
              className="h-10 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/55"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-lg bg-amber px-4 text-sm font-semibold text-navy hover:bg-amber-light"
            >
              Ara
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

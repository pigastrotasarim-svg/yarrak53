"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { navItems, site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
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
              ANADOLU
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
            <form action="/takip" className="flex items-center gap-2">
              <Input
                name="q"
                placeholder="Takip no veya ara…"
                className="h-9 w-52 border-white/20 bg-white/10 text-white placeholder:text-white/55"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setSearchOpen(false)}
                aria-label="Aramayı kapat"
              >
                <X className="size-4" />
              </Button>
            </form>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setSearchOpen(true)}
              aria-label="Ara"
            >
              <Search className="size-4" />
            </Button>
          )}
          <Button
            render={<Link href="/takip" />}
                nativeButton={false}
            className="bg-amber text-navy hover:bg-amber-light"
          >
            Takip Et
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
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
          <form action="/takip" className="mt-3 flex gap-2">
            <Input
              name="q"
              placeholder="Takip numarası…"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/55"
            />
            <Button
              type="submit"
              className="bg-amber text-navy hover:bg-amber-light"
            >
              Ara
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}

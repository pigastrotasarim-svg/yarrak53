"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsForm() {
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setPhone1(d.settings.phone1);
          setPhone2(d.settings.phone2);
          setEmail(d.settings.email);
          setAddressLine1(d.settings.addressLine1);
          setAddressLine2(d.settings.addressLine2);
        }
      })
      .catch(() => setError("Ayarlar yüklenemedi"));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone1: phone1.trim(),
        phone2: phone2.trim(),
        email: email.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Kaydedilemedi");
      return;
    }
    if (data.settings) {
      setPhone1(data.settings.phone1);
      setPhone2(data.settings.phone2);
      setEmail(data.settings.email);
      setAddressLine1(data.settings.addressLine1);
      setAddressLine2(data.settings.addressLine2);
    }
    setMsg("Kaydedildi. İletişim sayfası ve footer güncellendi.");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide text-navy">
        Site iletişim / GSM
      </h1>
      <p className="mt-2 text-sm text-slate-ink/65">
        Buradaki bilgiler{" "}
        <Link href="/iletisim" className="font-semibold text-amber-deep underline">
          /iletisim
        </Link>{" "}
        sayfasında ve sitedeki footer’da görünür.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-navy/10 bg-white p-6"
      >
        <Field label="GSM / Telefon 1" value={phone1} onChange={setPhone1} />
        <Field label="GSM / Telefon 2" value={phone2} onChange={setPhone2} />
        <Field label="E-posta" value={email} onChange={setEmail} type="email" />
        <Field label="Adres satır 1" value={addressLine1} onChange={setAddressLine1} />
        <Field label="Adres satır 2" value={addressLine2} onChange={setAddressLine2} />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {msg ? (
          <p className="text-sm text-navy">
            {msg}{" "}
            <Link href="/iletisim" className="font-semibold text-amber-deep underline">
              İletişim sayfasını aç
            </Link>
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center rounded-lg bg-amber px-5 text-sm font-semibold text-navy hover:bg-amber-light disabled:opacity-50"
        >
          {loading ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label className="mb-2 inline-block">{label}</Label>
      <Input
        type={type}
        className="h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

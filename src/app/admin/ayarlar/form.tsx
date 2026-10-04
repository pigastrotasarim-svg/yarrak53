"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
    fetch("/api/admin/settings")
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
        phone1,
        phone2,
        email,
        addressLine1,
        addressLine2,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Kaydedilemedi");
      return;
    }
    setMsg("Site iletişim bilgileri güncellendi. Footer ve iletişim sayfası bu numaraları kullanır.");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide text-navy">
        Site iletişim / GSM
      </h1>
      <p className="mt-2 text-sm text-slate-ink/65">
        Sitede görünen tüm telefon ve adres bilgilerini buradan değiştirirsiniz.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-navy/10 bg-white p-6"
      >
        <Field label="GSM / Telefon 1" value={phone1} onChange={setPhone1} />
        <Field label="GSM / Telefon 2" value={phone2} onChange={setPhone2} />
        <Field label="E-posta" value={email} onChange={setEmail} />
        <Field label="Adres satır 1" value={addressLine1} onChange={setAddressLine1} />
        <Field label="Adres satır 2" value={addressLine2} onChange={setAddressLine2} />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {msg ? <p className="text-sm text-navy">{msg}</p> : null}

        <Button
          type="submit"
          disabled={loading}
          className="bg-amber text-navy hover:bg-amber-light"
        >
          {loading ? "Kaydediliyor…" : "Kaydet"}
        </Button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-2 inline-block">{label}</Label>
      <Input
        className="h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

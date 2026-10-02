"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProvinceDistrictSelect } from "@/components/province-district-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewShipmentForm() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [gsm, setGsm] = useState("");
  const [originProvince, setOriginProvince] = useState("Antalya");
  const [originDistrict, setOriginDistrict] = useState("");
  const [destProvince, setDestProvince] = useState("");
  const [destDistrict, setDestDistrict] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        gsm,
        originProvince,
        originDistrict,
        destProvince,
        destDistrict,
        notes,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Kayıt oluşturulamadı");
      return;
    }
    router.push(`/admin/sevkiyat/${data.shipment.id}`);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide text-navy">
        Yeni takip kodu
      </h1>
      <p className="mt-2 text-sm text-slate-ink/65">
        Ad soyad, GSM ve teslimat il/ilçe bilgisiyle takip numarası üretilir.
        Mesafe hesaplanır, haritada rota oluşur.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className="mb-2 inline-block">
              Ad Soyad
            </Label>
            <Input
              id="name"
              className="h-11"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="gsm" className="mb-2 inline-block">
              GSM
            </Label>
            <Input
              id="gsm"
              className="h-11"
              placeholder="05xx xxx xx xx"
              value={gsm}
              onChange={(e) => setGsm(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-navy">Çıkış noktası</p>
          <ProvinceDistrictSelect
            idPrefix="origin"
            provinceLabel="İl"
            districtLabel="İlçe"
            provinceValue={originProvince}
            districtValue={originDistrict}
            onProvinceChange={setOriginProvince}
            onDistrictChange={setOriginDistrict}
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-navy">
            Teslim edilecek yer
          </p>
          <ProvinceDistrictSelect
            idPrefix="dest"
            provinceLabel="İl"
            districtLabel="İlçe"
            provinceValue={destProvince}
            districtValue={destDistrict}
            onProvinceChange={setDestProvince}
            onDistrictChange={setDestDistrict}
          />
        </div>

        <div>
          <Label htmlFor="notes" className="mb-2 inline-block">
            Not (opsiyonel)
          </Label>
          <Textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 bg-amber px-6 text-navy hover:bg-amber-light"
        >
          {loading ? "Oluşturuluyor…" : "Takip kodu oluştur"}
        </Button>
      </form>
    </main>
  );
}

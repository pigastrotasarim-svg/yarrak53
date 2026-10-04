"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddressBlock, type AddressFields } from "@/components/address-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  randomGsm,
  randomPerson,
  randomTcKimlik,
} from "@/lib/random-tr";

export default function NewShipmentForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tcKimlik, setTcKimlik] = useState("");
  const [gsm, setGsm] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverGsm, setReceiverGsm] = useState("");
  const [origin, setOrigin] = useState<AddressFields>({
    province: "Antalya",
    district: "",
    mahalle: "",
    street: "",
    buildingNo: "",
    floor: "",
    apartment: "",
  });
  const [dest, setDest] = useState<AddressFields>({
    province: "",
    district: "",
    mahalle: "",
    street: "",
    buildingNo: "",
    floor: "",
    apartment: "",
  });
  const [cargoType, setCargoType] = useState("Genel kargo");
  const [cargoWeightKg, setCargoWeightKg] = useState("");
  const [packageCount, setPackageCount] = useState("1");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fillRandomPerson() {
    const p = randomPerson();
    setFirstName(p.firstName);
    setLastName(p.lastName);
    setTcKimlik(randomTcKimlik());
    setGsm(randomGsm());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        tcKimlik,
        gsm,
        receiverName: receiverName || null,
        receiverGsm: receiverGsm || null,
        originProvince: origin.province,
        originDistrict: origin.district,
        originMahalle: origin.mahalle,
        originStreet: origin.street,
        originBuildingNo: origin.buildingNo,
        originFloor: origin.floor,
        originApartment: origin.apartment,
        destProvince: dest.province,
        destDistrict: dest.district,
        destMahalle: dest.mahalle,
        destStreet: dest.street,
        destBuildingNo: dest.buildingNo,
        destFloor: dest.floor,
        destApartment: dest.apartment,
        cargoType,
        cargoWeightKg: cargoWeightKg ? Number(cargoWeightKg) : null,
        packageCount: Number(packageCount) || 1,
        vehiclePlate: vehiclePlate || null,
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-navy">
            Yeni takip kodu
          </h1>
          <p className="mt-2 text-sm text-slate-ink/65">
            TC, ad soyad, GSM, güzergâh ve açık adres ile sevkiyat oluşturun.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-navy/20"
          onClick={fillRandomPerson}
        >
          Rastgele kişi
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad" id="first" value={firstName} onChange={setFirstName} required />
          <Field label="Soyad" id="last" value={lastName} onChange={setLastName} required />
          <Field
            label="TC Kimlik No"
            id="tc"
            value={tcKimlik}
            onChange={setTcKimlik}
            required
            maxLength={11}
          />
          <Field label="GSM" id="gsm" value={gsm} onChange={setGsm} required placeholder="05xx xxx xx xx" />
          <Field
            label="Alıcı adı (ops.)"
            id="recv"
            value={receiverName}
            onChange={setReceiverName}
          />
          <Field
            label="Alıcı GSM (ops.)"
            id="recvgsm"
            value={receiverGsm}
            onChange={setReceiverGsm}
          />
        </div>

        <AddressBlock
          title="Çıkış adresi"
          idPrefix="origin"
          value={origin}
          onChange={setOrigin}
        />
        <AddressBlock
          title="Teslimat adresi"
          idPrefix="dest"
          value={dest}
          onChange={setDest}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Yük cinsi" id="cargo" value={cargoType} onChange={setCargoType} />
          <Field
            label="Ağırlık (kg)"
            id="weight"
            value={cargoWeightKg}
            onChange={setCargoWeightKg}
            placeholder="Örn. 450"
          />
          <Field
            label="Paket / parça adedi"
            id="pkg"
            value={packageCount}
            onChange={setPackageCount}
          />
          <Field
            label="Plaka (ops.)"
            id="plate"
            value={vehiclePlate}
            onChange={setVehiclePlate}
            placeholder="07 ABC 123"
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

function Field({
  label,
  id,
  value,
  onChange,
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 inline-block">
        {label}
      </Label>
      <Input
        id={id}
        className="h-11"
        value={value}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

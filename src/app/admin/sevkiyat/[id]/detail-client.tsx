"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AddressBlock, type AddressFields } from "@/components/address-block";
import { TrackingMapClient } from "@/components/tracking-map-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SHIPMENT_STATUSES, statusLabel } from "@/lib/tracking";

type View = {
  code: string;
  firstName: string;
  lastName: string;
  customerName: string;
  tcKimlik: string;
  gsm: string;
  receiverName: string | null;
  receiverGsm: string | null;
  status: string;
  statusLabel: string;
  routeLabel: string;
  origin: {
    province: string;
    district: string;
    mahalle: string;
    street: string;
    buildingNo: string;
    floor: string;
    apartment: string;
    full: string;
    lat: number;
    lng: number;
  };
  destination: {
    province: string;
    district: string;
    mahalle: string;
    street: string;
    buildingNo: string;
    floor: string;
    apartment: string;
    full: string;
    lat: number;
    lng: number;
  };
  cargoType: string;
  cargoWeightKg: number | null;
  packageCount: number;
  vehiclePlate: string | null;
  distanceKm: number;
  remainingKm: number;
  progress: number;
  position: { lat: number; lng: number };
  notes: string | null;
  events: {
    title: string;
    location: string;
    note: string | null;
    createdAt: string;
  }[];
};

export default function AdminShipmentDetailPage({ id }: { id: string }) {
  const [view, setView] = useState<View | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tcKimlik, setTcKimlik] = useState("");
  const [gsm, setGsm] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverGsm, setReceiverGsm] = useState("");
  const [origin, setOrigin] = useState<AddressFields | null>(null);
  const [dest, setDest] = useState<AddressFields | null>(null);
  const [cargoType, setCargoType] = useState("Genel kargo");
  const [cargoWeightKg, setCargoWeightKg] = useState("");
  const [packageCount, setPackageCount] = useState("1");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [notes, setNotes] = useState("");

  function applyView(v: View) {
    setView(v);
    setFirstName(v.firstName);
    setLastName(v.lastName);
    setTcKimlik(v.tcKimlik);
    setGsm(v.gsm);
    setReceiverName(v.receiverName || "");
    setReceiverGsm(v.receiverGsm || "");
    setOrigin({
      province: v.origin.province,
      district: v.origin.district,
      mahalle: v.origin.mahalle,
      street: v.origin.street,
      buildingNo: v.origin.buildingNo,
      floor: v.origin.floor,
      apartment: v.origin.apartment,
    });
    setDest({
      province: v.destination.province,
      district: v.destination.district,
      mahalle: v.destination.mahalle,
      street: v.destination.street,
      buildingNo: v.destination.buildingNo,
      floor: v.destination.floor,
      apartment: v.destination.apartment,
    });
    setCargoType(v.cargoType);
    setCargoWeightKg(v.cargoWeightKg != null ? String(v.cargoWeightKg) : "");
    setPackageCount(String(v.packageCount));
    setVehiclePlate(v.vehiclePlate || "");
    setNotes(v.notes || "");
  }

  async function load() {
    const res = await fetch(`/api/admin/shipments/${id}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Yüklenemedi");
      return;
    }
    applyView(data.view);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function setStatus(status: string) {
    setUpdating(true);
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    setUpdating(false);
    if (!res.ok) {
      setError(data.error || "Güncellenemedi");
      return;
    }
    applyView(data.view);
  }

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !dest) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        details: {
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
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Kaydedilemedi");
      return;
    }
    applyView(data.view);
  }

  if (error && !view) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!view || !origin || !dest) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-ink/60">
        Sevkiyat yükleniyor…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-deep">
            Takip No
          </p>
          <h1 className="font-display text-3xl tracking-wide text-navy">
            {view.code}
          </h1>
          <p className="mt-2 text-sm text-slate-ink/70">
            {view.customerName} · TC {view.tcKimlik} · {view.gsm}
          </p>
          <p className="mt-1 text-sm text-navy">
            {view.routeLabel} · {view.distanceKm} km
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            render={<Link href={`/takip?q=${view.code}`} />}
            nativeButton={false}
            variant="outline"
          >
            Müşteri görünümü
          </Button>
          <Button
            render={<Link href="/admin" />}
            nativeButton={false}
            className="bg-navy text-white hover:bg-navy-deep"
          >
            Listeye dön
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <TrackingMapClient
          origin={{
            lat: view.origin.lat,
            lng: view.origin.lng,
            label: view.origin.full,
          }}
          destination={{
            lat: view.destination.lat,
            lng: view.destination.lng,
            label: view.destination.full,
          }}
          position={view.position}
          progress={view.progress}
          statusLabel={view.statusLabel}
          moving={view.status !== "TeslimEdildi"}
        />

        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <h2 className="font-display text-xl text-navy">Durum güncelle</h2>
          <p className="mt-1 text-sm text-slate-ink/65">
            Aktif: <strong>{statusLabel(view.status)}</strong> · Kalan ~{" "}
            {view.remainingKm} km
          </p>
          <div className="mt-4 grid gap-2">
            {SHIPMENT_STATUSES.map((s) => (
              <Button
                key={s.key}
                type="button"
                disabled={updating || view.status === s.key}
                variant={view.status === s.key ? "default" : "outline"}
                className={
                  view.status === s.key
                    ? "bg-navy text-white"
                    : "justify-start border-navy/15"
                }
                onClick={() => setStatus(s.key)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={saveDetails}
        className="mt-8 space-y-6 rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h2 className="font-display text-xl text-navy">
          Nakliyat bilgilerini düzenle
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad" value={firstName} onChange={setFirstName} />
          <Field label="Soyad" value={lastName} onChange={setLastName} />
          <Field label="TC Kimlik" value={tcKimlik} onChange={setTcKimlik} />
          <Field label="GSM" value={gsm} onChange={setGsm} />
          <Field label="Alıcı adı" value={receiverName} onChange={setReceiverName} />
          <Field label="Alıcı GSM" value={receiverGsm} onChange={setReceiverGsm} />
          <Field label="Yük cinsi" value={cargoType} onChange={setCargoType} />
          <Field label="Ağırlık (kg)" value={cargoWeightKg} onChange={setCargoWeightKg} />
          <Field label="Paket adedi" value={packageCount} onChange={setPackageCount} />
          <Field label="Plaka" value={vehiclePlate} onChange={setVehiclePlate} />
        </div>

        <AddressBlock title="Çıkış adresi" idPrefix="edit-origin" value={origin} onChange={setOrigin} />
        <AddressBlock title="Teslimat adresi" idPrefix="edit-dest" value={dest} onChange={setDest} />

        <div>
          <Label className="mb-2 inline-block">Not</Label>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button
          type="submit"
          disabled={saving}
          className="bg-amber text-navy hover:bg-amber-light"
        >
          {saving ? "Kaydediliyor…" : "Bilgileri kaydet"}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-5">
        <h2 className="font-display text-xl text-navy">Hareket geçmişi</h2>
        <ol className="mt-4 space-y-4">
          {view.events.map((e, i) => (
            <li key={`${e.createdAt}-${i}`} className="border-l-2 border-amber pl-4">
              <p className="font-semibold text-navy">{e.title}</p>
              <p className="text-sm text-slate-ink/65">
                {e.location} · {new Date(e.createdAt).toLocaleString("tr-TR")}
              </p>
              {e.note ? (
                <p className="mt-1 text-sm text-slate-ink/70">{e.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
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
      <Input className="h-11" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

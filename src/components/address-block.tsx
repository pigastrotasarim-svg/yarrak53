"use client";

import { ProvinceDistrictSelect } from "@/components/province-district-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { randomAddressParts } from "@/lib/random-tr";

export type AddressFields = {
  province: string;
  district: string;
  mahalle: string;
  street: string;
  buildingNo: string;
  floor: string;
  apartment: string;
};

type Props = {
  title: string;
  idPrefix: string;
  value: AddressFields;
  onChange: (next: AddressFields) => void;
};

export function AddressBlock({ title, idPrefix, value, onChange }: Props) {
  function set<K extends keyof AddressFields>(key: K, v: AddressFields[K]) {
    onChange({ ...value, [key]: v });
  }

  function fillRandom() {
    const r = randomAddressParts();
    onChange({
      ...value,
      mahalle: r.mahalle,
      street: r.street,
      buildingNo: r.buildingNo,
      floor: r.floor,
      apartment: r.apartment,
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-navy/10 bg-mist/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">{title}</p>
        <Button
          type="button"
          variant="outline"
          className="border-navy/20"
          onClick={fillRandom}
        >
          Rastgele adres
        </Button>
      </div>

      <ProvinceDistrictSelect
        idPrefix={idPrefix}
        provinceLabel="İl"
        districtLabel="İlçe"
        provinceValue={value.province}
        districtValue={value.district}
        onProvinceChange={(province) =>
          onChange({ ...value, province, district: "" })
        }
        onDistrictChange={(district) => set("district", district)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          id={`${idPrefix}-mahalle`}
          label="Mahalle"
          value={value.mahalle}
          onChange={(v) => set("mahalle", v)}
        />
        <Field
          id={`${idPrefix}-street`}
          label="Cadde / Sokak"
          value={value.street}
          onChange={(v) => set("street", v)}
        />
        <Field
          id={`${idPrefix}-no`}
          label="Bina No"
          value={value.buildingNo}
          onChange={(v) => set("buildingNo", v)}
        />
        <Field
          id={`${idPrefix}-floor`}
          label="Kat (düzey)"
          value={value.floor}
          onChange={(v) => set("floor", v)}
          placeholder="Zemin / 1 / 2…"
        />
        <Field
          id={`${idPrefix}-apt`}
          label="Daire"
          value={value.apartment}
          onChange={(v) => set("apartment", v)}
        />
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

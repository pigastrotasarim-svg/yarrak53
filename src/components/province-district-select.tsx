"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";

type Province = { id: number; name: string; lat: number; lng: number };
type District = { id: number; name: string; provinceId: number };

type Props = {
  provinceLabel: string;
  districtLabel: string;
  provinceValue: string;
  districtValue: string;
  onProvinceChange: (name: string) => void;
  onDistrictChange: (name: string) => void;
  idPrefix: string;
};

export function ProvinceDistrictSelect({
  provinceLabel,
  districtLabel,
  provinceValue,
  districtValue,
  onProvinceChange,
  onDistrictChange,
  idPrefix,
}: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    fetch("/api/provinces")
      .then((r) => r.json())
      .then((data) => setProvinces(data.provinces ?? []))
      .catch(() => setProvinces([]));
  }, []);

  const selectedProvince = useMemo(
    () => provinces.find((p) => p.name === provinceValue) ?? null,
    [provinces, provinceValue]
  );

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      return;
    }
    let cancelled = false;
    setLoadingDistricts(true);
    fetch(`/api/provinces/${selectedProvince.id}/districts`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDistricts(data.districts ?? []);
      })
      .catch(() => {
        if (!cancelled) setDistricts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingDistricts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedProvince]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor={`${idPrefix}-province`} className="mb-2 inline-block">
          {provinceLabel}
        </Label>
        <select
          id={`${idPrefix}-province`}
          className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm"
          value={provinceValue}
          onChange={(e) => {
            onProvinceChange(e.target.value);
            onDistrictChange("");
          }}
          required
        >
          <option value="">İl seçin</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-district`} className="mb-2 inline-block">
          {districtLabel}
        </Label>
        <select
          id={`${idPrefix}-district`}
          className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm disabled:opacity-50"
          value={districtValue}
          onChange={(e) => onDistrictChange(e.target.value)}
          required
          disabled={!provinceValue || loadingDistricts}
        >
          <option value="">
            {loadingDistricts ? "İlçeler yükleniyor…" : "İlçe seçin"}
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

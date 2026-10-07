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
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    setLoadingProvinces(true);
    setProvinceError("");
    fetch("/api/provinces", { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error("İller yüklenemedi");
        return r.json();
      })
      .then((data) => {
        const list = (data.provinces ?? []) as Province[];
        setProvinces(list);
        if (list.length === 0) setProvinceError("İl listesi boş");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setProvinces([]);
        setProvinceError("İller yüklenemedi");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoadingProvinces(false);
      });
    return () => ctrl.abort();
  }, []);

  const selectedProvince = useMemo(() => {
    if (!provinceValue) return null;
    return (
      provinces.find(
        (p) =>
          p.name.toLocaleLowerCase("tr") ===
          provinceValue.toLocaleLowerCase("tr")
      ) ?? null
    );
  }, [provinces, provinceValue]);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setLoadingDistricts(false);
      setDistrictError("");
      return;
    }

    const ctrl = new AbortController();
    setLoadingDistricts(true);
    setDistrictError("");
    setDistricts([]);

    fetch(`/api/provinces/${selectedProvince.id}/districts`, {
      signal: ctrl.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("İlçeler yüklenemedi");
        return r.json();
      })
      .then((data) => {
        const list = (data.districts ?? []) as District[];
        setDistricts(list);
        if (list.length === 0) setDistrictError("Bu il için ilçe bulunamadı");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setDistricts([]);
        setDistrictError("İlçeler yüklenemedi");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoadingDistricts(false);
      });

    return () => ctrl.abort();
  }, [selectedProvince?.id]);

  // Keep district value valid after province change / reload
  useEffect(() => {
    if (!districtValue || loadingDistricts || districts.length === 0) return;
    const ok = districts.some(
      (d) =>
        d.name.toLocaleLowerCase("tr") === districtValue.toLocaleLowerCase("tr")
    );
    if (!ok) onDistrictChange("");
    // intentionally omit onDistrictChange — parent often passes inline fn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts, districtValue, loadingDistricts]);

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
            // Parent onProvinceChange must clear district itself.
            // Calling onDistrictChange here races with a stale closure and
            // overwrites the newly selected province.
            onProvinceChange(e.target.value);
          }}
          required
          disabled={loadingProvinces}
        >
          <option value="">
            {loadingProvinces ? "İller yükleniyor…" : "İl seçin"}
          </option>
          {provinces.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        {provinceError ? (
          <p className="mt-1 text-xs text-red-600">{provinceError}</p>
        ) : null}
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
          disabled={!provinceValue || loadingDistricts || loadingProvinces}
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
        {districtError ? (
          <p className="mt-1 text-xs text-red-600">{districtError}</p>
        ) : null}
      </div>
    </div>
  );
}

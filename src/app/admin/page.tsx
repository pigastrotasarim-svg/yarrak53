import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { statusLabel } from "@/lib/tracking";
import { Button } from "@/components/ui/button";

export default async function AdminHomePage() {
  await requireAdminPage();
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-navy">
            Sevkiyatlar
          </h1>
          <p className="mt-1 text-sm text-slate-ink/65">
            Takip kodları, rota ve durum yönetimi
          </p>
        </div>
        <Button
          render={<Link href="/admin/yeni" />}
          nativeButton={false}
          className="bg-amber text-navy hover:bg-amber-light"
        >
          Yeni takip kodu
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-navy text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Takip No</th>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Rota</th>
              <th className="px-4 py-3 font-medium">Mesafe</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-ink/55"
                >
                  Henüz sevkiyat yok. Yeni takip kodu oluşturun.
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id} className="border-b border-navy/5">
                  <td className="px-4 py-3 font-semibold text-navy">
                    {s.code}
                  </td>
                  <td className="px-4 py-3">
                    <div>{s.customerName}</div>
                    <div className="text-xs text-slate-ink/55">{s.gsm}</div>
                  </td>
                  <td className="px-4 py-3">
                    {s.originProvince} → {s.destProvince}
                  </td>
                  <td className="px-4 py-3">{Math.round(s.distanceKm)} km</td>
                  <td className="px-4 py-3">{statusLabel(s.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/sevkiyat/${s.id}`}
                      className="font-medium text-amber-deep hover:underline"
                    >
                      Yönet
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

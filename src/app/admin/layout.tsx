import { getAdminSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-mist">
      {session ? <AdminNav username={session.username} /> : null}
      {children}
    </div>
  );
}

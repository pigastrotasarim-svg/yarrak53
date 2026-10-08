import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";

const schema = z.object({
  phone1: z.string().trim().min(7, "Telefon en az 7 karakter olmalı"),
  phone2: z.string().trim().min(7, "Telefon 2 en az 7 karakter olmalı"),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  addressLine1: z.string().trim().min(3, "Adres satır 1 gerekli"),
  addressLine2: z.string().trim().min(3, "Adres satır 2 gerekli"),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json(
      { error: detail || "Geçersiz alanlar" },
      { status: 400 }
    );
  }
  await getSiteSettings();
  const settings = await prisma.siteSettings.update({
    where: { id: 1 },
    data: parsed.data,
  });

  // Bust cached public contact surfaces
  revalidatePath("/iletisim");
  revalidatePath("/");
  revalidatePath("/api/site-contact");

  return NextResponse.json({ settings });
}

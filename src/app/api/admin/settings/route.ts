import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";

const schema = z.object({
  phone1: z.string().min(7),
  phone2: z.string().min(7),
  email: z.string().email(),
  addressLine1: z.string().min(3),
  addressLine2: z.string().min(3),
});

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
    return NextResponse.json({ error: "Geçersiz alanlar" }, { status: 400 });
  }
  await getSiteSettings();
  const settings = await prisma.siteSettings.update({
    where: { id: 1 },
    data: parsed.data,
  });
  return NextResponse.json({ settings });
}

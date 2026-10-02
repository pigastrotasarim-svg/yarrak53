import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession, verifyPassword, createAdminSession } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({ authenticated: Boolean(session), session });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz bilgi" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { username: parsed.data.username },
  });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Kullanıcı adı veya şifre hatalı" },
      { status: 401 }
    );
  }

  await createAdminSession(user.username);
  return NextResponse.json({ ok: true, username: user.username });
}

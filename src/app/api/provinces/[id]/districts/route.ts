import { NextResponse } from "next/server";
import { getDistricts } from "@/lib/turkey";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const provinceId = Number(id);
  if (!Number.isFinite(provinceId)) {
    return NextResponse.json({ error: "Geçersiz il" }, { status: 400 });
  }
  const districts = await getDistricts(provinceId);
  return NextResponse.json({ districts });
}

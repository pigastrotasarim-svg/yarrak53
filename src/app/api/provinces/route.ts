import { NextResponse } from "next/server";
import { getProvinces } from "@/lib/turkey";

export async function GET() {
  const provinces = await getProvinces();
  return NextResponse.json({ provinces });
}

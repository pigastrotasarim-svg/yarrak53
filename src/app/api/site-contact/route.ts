import { NextResponse } from "next/server";
import { getPublicSiteContact } from "@/lib/site-settings";

export async function GET() {
  const site = await getPublicSiteContact();
  return NextResponse.json({ site });
}

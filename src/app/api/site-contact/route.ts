import { NextResponse } from "next/server";
import { getPublicSiteContact } from "@/lib/site-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const site = await getPublicSiteContact();
  return NextResponse.json(
    { site },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    }
  );
}

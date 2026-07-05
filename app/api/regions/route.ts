import { NextResponse } from "next/server";
import { getTariffMix } from "@/lib/store";

// Deprecated: the dashboard no longer has a "region" concept now that it's
// backed by real electricity-retail data. Kept as an alias to /api/tariff-mix
// so any old bookmarked calls don't 404. Prefer /api/tariff-mix going forward.
export async function GET() {
  return NextResponse.json({ tariffMix: getTariffMix() });
}

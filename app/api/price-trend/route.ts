import { NextResponse } from "next/server";
import { getPriceTrend } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ priceTrend: getPriceTrend() });
}

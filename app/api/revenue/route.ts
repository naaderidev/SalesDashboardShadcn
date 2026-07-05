import { NextResponse } from "next/server";
import { getRevenueTrend } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ revenue: getRevenueTrend() });
}

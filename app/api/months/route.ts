import { NextResponse } from "next/server";
import { getAvailablePeriods } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ periods: getAvailablePeriods() });
}

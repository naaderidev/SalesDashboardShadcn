import { NextResponse } from "next/server";
import { getTariffMix } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? undefined;
  return NextResponse.json({ tariffMix: getTariffMix(month) });
}

import { NextResponse } from "next/server";
import { getAgentSummaries } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? undefined;
  return NextResponse.json({ agents: getAgentSummaries(month) });
}

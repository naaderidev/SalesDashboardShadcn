import { NextResponse } from "next/server";
import { getCustomerFlow } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ customerFlow: getCustomerFlow() });
}

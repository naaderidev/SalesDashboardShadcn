import { NextResponse } from "next/server";
import { notifications } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { id, markAll } = body as { id?: string; markAll?: boolean };

  if (markAll) {
    notifications.forEach((n) => (n.read = true));
    return NextResponse.json({ notifications });
  }

  const target = notifications.find((n) => n.id === id);
  if (!target) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }
  target.read = true;
  return NextResponse.json({ notification: target });
}

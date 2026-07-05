import { NextResponse } from "next/server";
import { todos } from "@/lib/store";
import type { Todo } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({ todos });
}

const VALID_PRIORITIES: Todo["priority"][] = ["low", "medium", "high"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { label: rawLabel, priority: rawPriority } = body as {
    label?: string;
    priority?: string;
  };
  const label = rawLabel?.trim();

  if (!label) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }

  const priority = VALID_PRIORITIES.includes(rawPriority as Todo["priority"])
    ? (rawPriority as Todo["priority"])
    : "medium";

  const now = new Date();
  const todo: Todo = {
    id: `t${Date.now()}`,
    label,
    done: false,
    priority,
    due: formatDate(now),
    createdAt: now.toISOString(),
  };
  todos.unshift(todo);
  return NextResponse.json({ todo }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { id, done } = body as { id?: string; done?: boolean };

  const target = todos.find((t) => t.id === id);
  if (!target) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  target.done = done ?? !target.done;
  return NextResponse.json({ todo: target });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  const [removed] = todos.splice(index, 1);
  return NextResponse.json({ todo: removed });
}

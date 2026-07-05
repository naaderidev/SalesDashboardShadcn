"use client";

import * as React from "react";
import { ClipboardCheck, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Todo } from "@/lib/types";

const PRIORITY_VARIANT: Record<Todo["priority"], "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

const PRIORITY_OPTIONS: Todo["priority"][] = ["low", "medium", "high"];

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = React.useState<Todo[]>(initialTodos);
  const [draft, setDraft] = React.useState("");
  const [draftPriority, setDraftPriority] = React.useState<Todo["priority"]>("medium");
  const [submitting, setSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function toggle(todo: Todo) {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t))
    );
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, done: !todo.done }),
    });
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const label = draft.trim();
    if (!label) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, priority: draftPriority }),
      });
      const data = await res.json();
      if (data.todo) {
        setTodos((prev) => [data.todo, ...prev]);
        setDraft("");
        setDraftPriority("medium");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTodo(id: string) {
    const previous = todos;
    setDeletingId(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/todos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // Roll back if the request fails so the list stays in sync with the API.
      setTodos(previous);
    } finally {
      setDeletingId(null);
    }
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>To-do list</CardTitle>
        <CardDescription>
          {todos.length === 0
            ? "Nothing on your plate"
            : `${remaining} task${remaining === 1 ? "" : "s"} remaining`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={addTodo} className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a task…"
            className="h-8 text-sm"
          />
          <Select
            value={draftPriority}
            onValueChange={(v) => setDraftPriority(v as Todo["priority"])}
          >
            <SelectTrigger className="h-8 w-[92px] shrink-0 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="icon" className="h-8 w-8 shrink-0" disabled={submitting}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {todos.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">All caught up</p>
            <p className="max-w-[200px] text-xs text-muted-foreground">
              Add a task above to start tracking your to-dos.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-64 pr-2">
            <div className="space-y-1">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={cn(
                    "group flex items-start gap-2.5 rounded-md px-2 py-2 text-sm transition-opacity hover:bg-accent",
                    deletingId === todo.id && "pointer-events-none opacity-50"
                  )}
                >
                  <Checkbox
                    checked={todo.done}
                    onCheckedChange={() => toggle(todo)}
                    className="mt-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => toggle(todo)}
                    className="flex-1 space-y-1 text-left"
                  >
                    <span
                      className={cn(
                        "block leading-snug",
                        todo.done && "text-muted-foreground line-through"
                      )}
                    >
                      {todo.label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Badge variant={PRIORITY_VARIANT[todo.priority]} className="px-1.5 py-0 text-[10px] capitalize">
                        {todo.priority}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{todo.due}</span>
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label={`Delete "${todo.label}"`}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

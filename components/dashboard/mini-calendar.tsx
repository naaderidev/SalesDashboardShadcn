"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Todo } from "@/lib/types";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function parseDueDate(due: string, referenceYear: number): Date | null {
  const parsed = new Date(`${due}, ${referenceYear}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function MiniCalendar({ todos = [] }: { todos?: Todo[] }) {
  const today = React.useMemo(() => new Date(), []);
  const [cursor, setCursor] = React.useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dueDays = React.useMemo(() => {
    const days = new Set<number>();
    for (const todo of todos) {
      if (todo.done) continue;
      const date = parseDueDate(todo.due, year);
      if (date && date.getMonth() === month && date.getFullYear() === year) {
        days.add(date.getDate());
      }
    }
    return days;
  }, [todos, year, month]);

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(cursor)}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Previous month"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Next month"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className="text-[10px] font-medium text-muted-foreground sm:text-xs">
              {day}
            </div>
          ))}
          {cells.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 py-0.5">
              {day && (
                <>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] sm:text-xs",
                      isToday(day)
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {day}
                  </span>
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full",
                      dueDays.has(day) && !isToday(day) ? "bg-primary" : "bg-transparent"
                    )}
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-xs"
          onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
        >
          Jump to today
        </Button>
      </CardContent>
    </Card>
  );
}

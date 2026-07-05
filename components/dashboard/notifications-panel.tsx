"use client";

import * as React from "react";
import { CircleDollarSign, Info, MessageSquare, TriangleAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, React.ElementType> = {
  deal: CircleDollarSign,
  alert: TriangleAlert,
  message: MessageSquare,
  system: Info,
};

export function NotificationsPanel({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] =
    React.useState<Notification[]>(initialNotifications);

  async function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Deals, alerts, and messages</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-72">
          <div className="px-5 pb-4">
            {notifications.map((n, i) => {
              const Icon = ICONS[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className="flex w-full items-start gap-3 py-3 text-left"
                >
                  <span className="relative flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        n.type === "deal" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                        n.type === "alert" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                        n.type === "message" && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                        n.type === "system" && "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {i < notifications.length - 1 && (
                      <span className="mt-1 h-full w-px flex-1 bg-border" />
                    )}
                  </span>
                  <span className="flex-1 pb-1">
                    <span
                      className={cn(
                        "block text-sm leading-snug",
                        n.read ? "text-muted-foreground" : "font-medium text-foreground"
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">{n.description}</span>
                    <span className="block text-[11px] text-muted-foreground/70">{n.time}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

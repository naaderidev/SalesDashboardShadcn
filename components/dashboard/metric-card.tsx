import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatPercent } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  changePct: number;
  icon: LucideIcon;
  hint?: string;
}

export function MetricCard({ label, value, changePct, icon: Icon, hint }: MetricCardProps) {
  const positive = changePct >= 0;

  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
          <div className="flex items-center gap-1 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {formatPercent(changePct)}
            </span>
            <span className="text-muted-foreground">{hint ?? "vs last month"}</span>
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

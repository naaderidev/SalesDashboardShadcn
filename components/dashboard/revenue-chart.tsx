"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, formatRial } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-media-query";
import type { RevenuePoint } from "@/lib/types";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}:{" "}
          <span className="font-medium text-popover-foreground">
            {p.dataKey === "revenueRial"
              ? formatRial(p.value, true)
              : `${formatNumber(p.value, true)} kWh`}
          </span>
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const isMobile = useIsMobile();

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue &amp; volume trend</CardTitle>
        <CardDescription>Monthly invoiced revenue (Rial) vs. kWh sold, all agents</CardDescription>
      </CardHeader>
      <CardContent className="pl-1">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tick={!isMobile}
              height={isMobile ? 8 : undefined}
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              interval={2}
            />
            <YAxis
              yAxisId="revenue"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => formatRial(v, true)}
              width={isMobile ? 44 : 64}
            />
            <YAxis
              yAxisId="kwh"
              orientation="right"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => formatNumber(v, true)}
              width={isMobile ? 36 : 48}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenueRial"
              name="Revenue"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
            />
            <Line
              yAxisId="kwh"
              type="monotone"
              dataKey="kwhTotal"
              name="kWh sold"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

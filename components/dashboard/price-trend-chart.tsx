"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
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
import { formatRialPerKwh } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-media-query";
import type { PricePoint } from "@/lib/types";

function PriceTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}:{" "}
          <span className="font-medium text-popover-foreground">
            {p.value != null ? formatRialPerKwh(p.value) : "—"}
          </span>
        </p>
      ))}
    </div>
  );
}

export function PriceTrendChart({ data }: { data: PricePoint[] }) {
  const isMobile = useIsMobile();

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Price per kWh over time</CardTitle>
        <CardDescription>
          Weighted average normal vs. green tariff pricing — a real look at inflation
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-1">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
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
              yAxisId="normal"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(v)}
              width={isMobile ? 34 : 48}
            />
            <YAxis
              yAxisId="green"
              orientation="right"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(v)}
              width={isMobile ? 34 : 48}
            />
            <Tooltip content={<PriceTooltip />} />
            <Line
              yAxisId="normal"
              type="monotone"
              dataKey="avgNormalPriceRialPerKwh"
              name="Normal tariff"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              dot={false}
              connectNulls
            />
            <Line
              yAxisId="green"
              type="monotone"
              dataKey="avgGreenPriceRialPerKwh"
              name="Green tariff"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { TariffMixSlice } from "@/lib/types";

const COLORS: Record<TariffMixSlice["tariff"], string> = {
  Normal: "hsl(var(--chart-1))",
  Green: "hsl(var(--chart-3))",
  Free: "hsl(var(--chart-4))",
};

function MixTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const slice: TariffMixSlice = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-popover-foreground">{slice.tariff} tariff</p>
      <p className="text-muted-foreground">{formatNumber(slice.kwh, true)} kWh</p>
    </div>
  );
}

interface TariffMixChartProps {
  data: TariffMixSlice[];
  action?: ReactNode;
  periodLabel?: string;
}

export function TariffMixChart({ data, action, periodLabel }: TariffMixChartProps) {
  const total = data.reduce((sum, d) => sum + d.kwh, 0);
  const nonZero = data.filter((d) => d.kwh > 0);

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Energy mix</CardTitle>
          <CardDescription>kWh sold by tariff in {periodLabel ?? "the latest month"}</CardDescription>
        </div>
        {action}
      </CardHeader>
      <CardContent className="pl-1">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={nonZero}
              dataKey="kwh"
              nameKey="tariff"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {nonZero.map((slice) => (
                <Cell key={slice.tariff} fill={COLORS[slice.tariff]} />
              ))}
            </Pie>
            <Tooltip content={<MixTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1.5">
          {data.map((slice) => (
            <div key={slice.tariff} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: COLORS[slice.tariff] }}
                />
                {slice.tariff}
              </div>
              <span className="font-medium">
                {total > 0 ? Math.round((slice.kwh / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

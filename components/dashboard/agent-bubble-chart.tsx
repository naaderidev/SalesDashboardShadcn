"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, formatRial } from "@/lib/utils";
import type { AgentSummary } from "@/lib/types";

const PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function colorFor(index: number) {
  return PALETTE[index % PALETTE.length];
}

function BubbleTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const agent: AgentSummary = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2.5 text-xs shadow-md">
      <p className="mb-1.5 font-medium text-popover-foreground">{agent.name}</p>
      <div className="space-y-0.5 text-muted-foreground">
        <p>kWh sold: <span className="font-medium text-popover-foreground">{formatNumber(agent.kwhTotal, true)}</span></p>
        <p>Revenue: <span className="font-medium text-popover-foreground">{formatRial(agent.revenueRial, true)}</span></p>
        <p>Invoices: <span className="font-medium text-popover-foreground">{agent.invoicesFinalized}</span></p>
      </div>
    </div>
  );
}

interface AgentBubbleChartProps {
  agents: AgentSummary[];
  action?: ReactNode;
  periodLabel?: string;
}

export function AgentBubbleChart({ agents, action, periodLabel }: AgentBubbleChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Agent performance</CardTitle>
          <CardDescription>
            kWh sold (x) vs. revenue (y){periodLabel ? ` in ${periodLabel}` : ""} — bubble size is
            invoices finalized
          </CardDescription>
        </div>
        {action}
      </CardHeader>
      <CardContent className="pl-1">
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="kwhTotal"
              name="kWh sold"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => formatNumber(v, true)}
              label={{
                value: "kWh sold",
                position: "insideBottom",
                offset: -4,
                fontSize: 11,
                fill: "hsl(var(--muted-foreground))",
              }}
            />
            <YAxis
              type="number"
              dataKey="revenueRial"
              name="Revenue"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => formatRial(v, true)}
              width={64}
            />
            <ZAxis type="number" dataKey="invoicesFinalized" range={[100, 900]} name="Invoices" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<BubbleTooltip />} />
            <Scatter data={agents} fillOpacity={0.8}>
              {agents.map((agent, i) => (
                <Cell key={agent.id} fill={colorFor(i)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {agents.map((agent, i) => (
            <div key={agent.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: colorFor(i) }} />
              {agent.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

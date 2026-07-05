"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
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
import { formatNumber } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-media-query";
import type { CustomerFlowPoint } from "@/lib/types";

function FlowTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}:{" "}
          <span className="font-medium text-popover-foreground">
            {formatNumber(Math.abs(p.value))}
          </span>
        </p>
      ))}
    </div>
  );
}

// Recharts doesn't reliably expose the raw (signed) value to a custom Bar
// `shape`, and its own `radius` prop rounds the rectangle's geometric top/
// bottom rather than "the end away from zero" — which is wrong for a bar
// that hangs below the axis. Instead of trying to detect the sign, we use
// two dedicated shapes: the "New" series is always >= 0 (grows up from the
// axis, so the far end is the top), and the "Lost" series is pre-negated
// and always <= 0 (grows down from the axis, so the far end is the bottom).
// Coordinates are normalized defensively in case width/height come back
// negative for any reason.
function normalizeRect(x: number, y: number, width: number, height: number) {
  const left = Math.min(x, x + width);
  const right = Math.max(x, x + width);
  const top = Math.min(y, y + height);
  const bottom = Math.max(y, y + height);
  return { left, right, top, bottom, w: right - left, h: bottom - top };
}

function RoundTopBar(props: any) {
  const { x, y, width, height, fill } = props;
  const { left, right, top, bottom, w, h } = normalizeRect(x, y, width, height);
  if (w <= 0 || h <= 0) return null;
  const r = Math.min(4, w / 2, h);
  const path = `M${left},${bottom} L${left},${top + r} Q${left},${top} ${left + r},${top} L${right - r},${top} Q${right},${top} ${right},${top + r} L${right},${bottom} Z`;
  return <path d={path} fill={fill} />;
}

function RoundBottomBar(props: any) {
  const { x, y, width, height, fill } = props;
  const { left, right, top, bottom, w, h } = normalizeRect(x, y, width, height);
  if (w <= 0 || h <= 0) return null;
  const r = Math.min(4, w / 2, h);
  const path = `M${left},${top} L${right},${top} L${right},${bottom - r} Q${right},${bottom} ${right - r},${bottom} L${left + r},${bottom} Q${left},${bottom} ${left},${bottom - r} Z`;
  return <path d={path} fill={fill} />;
}

export function CustomerFlowChart({ data }: { data: CustomerFlowPoint[] }) {
  const isMobile = useIsMobile();
  const chartData = data.map((d) => ({
    ...d,
    lostCustomersNeg: -d.lostCustomers,
  }));

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Customer flow</CardTitle>
        <CardDescription>New vs. lost customers, with net growth</CardDescription>
      </CardHeader>
      <CardContent className="pl-1">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tick={!isMobile}
              height={isMobile ? 8 : undefined}
              fontSize={10}
              stroke="hsl(var(--muted-foreground))"
              interval={3}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              width={isMobile ? 24 : 32}
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <Tooltip content={<FlowTooltip />} />
            <Bar
              dataKey="newCustomers"
              name="New"
              fill="hsl(var(--chart-3))"
              shape={<RoundTopBar />}
            />
            <Bar
              dataKey="lostCustomersNeg"
              name="Lost"
              fill="hsl(var(--destructive))"
              shape={<RoundBottomBar />}
            />
            <Line
              type="monotone"
              dataKey="netCustomerGrowth"
              name="Net growth"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

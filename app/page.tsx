"use client";

import * as React from "react";
import { Activity, CircleDollarSign, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PriceTrendChart } from "@/components/dashboard/price-trend-chart";
import { AgentBubblePanel } from "@/components/dashboard/agent-bubble-panel";
import { TariffMixPanel } from "@/components/dashboard/tariff-mix-panel";
import { CustomerFlowChart } from "@/components/dashboard/customer-flow-chart";
import { AgentsTable } from "@/components/dashboard/agents-table";
import { TodoList } from "@/components/dashboard/todo-list";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { formatNumber, formatRial, formatRialPerKwh } from "@/lib/utils";
import type {
  AgentSummary,
  CustomerFlowPoint,
  Metrics,
  PricePoint,
  RevenuePoint,
  Todo,
} from "@/lib/types";

interface DashboardData {
  metrics: Metrics;
  revenue: RevenuePoint[];
  priceTrend: PricePoint[];
  agents: AgentSummary[];
  customerFlow: CustomerFlowPoint[];
  todos: Todo[];
}

async function fetchDashboardData(): Promise<DashboardData> {
  const [metricsRes, revenueRes, priceTrendRes, agentsRes, customerFlowRes, todosRes] =
    await Promise.all([
      fetch("/api/metrics"),
      fetch("/api/revenue"),
      fetch("/api/price-trend"),
      fetch("/api/agents"),
      fetch("/api/customer-flow"),
      fetch("/api/todos"),
    ]);

  const [metrics, revenue, priceTrend, agents, customerFlow, todos] = await Promise.all([
    metricsRes.json(),
    revenueRes.json(),
    priceTrendRes.json(),
    agentsRes.json(),
    customerFlowRes.json(),
    todosRes.json(),
  ]);

  return {
    metrics: metrics.metrics,
    revenue: revenue.revenue,
    priceTrend: priceTrend.priceTrend,
    agents: agents.agents,
    customerFlow: customerFlow.customerFlow,
    todos: todos.todos,
  };
}

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchDashboardData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Sales overview</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {data
              ? `Electricity retail performance for ${data.metrics.latestMonthLabel}, powered by the dashboard API.`
              : "Loading electricity retail performance…"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh data"}
        </Button>
      </div>

      {!data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total revenue"
              value={formatRial(data.metrics.totalRevenueRial, true)}
              changePct={data.metrics.revenueChangePct}
              icon={CircleDollarSign}
            />
            <MetricCard
              label="kWh sold"
              value={formatNumber(data.metrics.totalKwhSold, true)}
              changePct={data.metrics.kwhChangePct}
              icon={Zap}
            />
            <MetricCard
              label="Net customer growth"
              value={formatNumber(data.metrics.netCustomerGrowth)}
              changePct={data.metrics.customerGrowthChangePct}
              icon={Users}
            />
            <MetricCard
              label="Avg. normal price"
              value={formatRialPerKwh(data.metrics.avgNormalPriceRialPerKwh)}
              changePct={data.metrics.priceChangePct}
              icon={Activity}
              hint="vs last month"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RevenueChart data={data.revenue} />
            <TariffMixPanel />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <PriceTrendChart data={data.priceTrend} />
            <CustomerFlowChart data={data.customerFlow} />
          </div>

          <AgentBubblePanel />

          <AgentsTable agents={data.agents} limit={6} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TodoList initialTodos={data.todos} />
            <MiniCalendar todos={data.todos} />
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-[360px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
      <Skeleton className="h-[320px] rounded-xl" />
    </div>
  );
}

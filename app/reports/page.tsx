"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PriceTrendChart } from "@/components/dashboard/price-trend-chart";
import { TariffMixPanel } from "@/components/dashboard/tariff-mix-panel";
import { CustomerFlowChart } from "@/components/dashboard/customer-flow-chart";
import type { CustomerFlowPoint, PricePoint, RevenuePoint } from "@/lib/types";

export default function ReportsPage() {
  const [revenue, setRevenue] = React.useState<RevenuePoint[] | null>(null);
  const [priceTrend, setPriceTrend] = React.useState<PricePoint[] | null>(null);
  const [customerFlow, setCustomerFlow] = React.useState<CustomerFlowPoint[] | null>(null);

  React.useEffect(() => {
    fetch("/api/revenue").then((res) => res.json()).then((data) => setRevenue(data.revenue ?? []));
    fetch("/api/price-trend").then((res) => res.json()).then((data) => setPriceTrend(data.priceTrend ?? []));
    fetch("/api/customer-flow").then((res) => res.json()).then((data) => setCustomerFlow(data.customerFlow ?? []));
  }, []);

  const ready = revenue && priceTrend && customerFlow;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Reports</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Revenue, pricing, energy mix, and customer-flow trends across the full dataset.
        </p>
      </div>

      {!ready ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-[360px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[360px] rounded-xl" />
          <Skeleton className="h-[360px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[360px] rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RevenueChart data={revenue!} />
            <TariffMixPanel />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <PriceTrendChart data={priceTrend!} />
            <CustomerFlowChart data={customerFlow!} />
          </div>
        </>
      )}
    </div>
  );
}

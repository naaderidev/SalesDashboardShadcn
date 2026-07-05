"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TariffMixChart } from "@/components/dashboard/tariff-mix-chart";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { usePeriodData } from "@/lib/use-period-data";
import { cn } from "@/lib/utils";
import type { TariffMixSlice } from "@/lib/types";

export function TariffMixPanel() {
  const { periods, selectedMonth, setSelectedMonth, data, loading, periodLabel } =
    usePeriodData<TariffMixSlice[]>("/api/tariff-mix", "tariffMix");

  if (!data) {
    return <Skeleton className="h-[360px] rounded-xl" />;
  }

  return (
    <div className={cn("transition-opacity", loading && "opacity-60")}>
      <TariffMixChart
        data={data}
        periodLabel={periodLabel}
        action={
          <PeriodSelect periods={periods} value={selectedMonth} onChange={setSelectedMonth} />
        }
      />
    </div>
  );
}

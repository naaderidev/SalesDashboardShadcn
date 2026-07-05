"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AgentBubbleChart } from "@/components/dashboard/agent-bubble-chart";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { usePeriodData } from "@/lib/use-period-data";
import { cn } from "@/lib/utils";
import type { AgentSummary } from "@/lib/types";

export function AgentBubblePanel() {
  const { periods, selectedMonth, setSelectedMonth, data, loading, periodLabel } =
    usePeriodData<AgentSummary[]>("/api/agents", "agents");

  if (!data) {
    return <Skeleton className="col-span-full h-[420px] rounded-xl" />;
  }

  return (
    <div className={cn("col-span-full transition-opacity", loading && "opacity-60")}>
      <AgentBubbleChart
        agents={data}
        periodLabel={periodLabel}
        action={
          <PeriodSelect periods={periods} value={selectedMonth} onChange={setSelectedMonth} />
        }
      />
    </div>
  );
}

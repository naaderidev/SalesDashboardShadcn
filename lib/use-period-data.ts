"use client";

import * as React from "react";
import type { AvailablePeriod } from "@/lib/types";

/**
 * Fetches the list of available Jalali months once, then re-fetches a given
 * endpoint (scoped to the selected month) whenever the selection changes.
 * Used to power the Year/Month filters on the bubble chart and energy mix.
 */
export function usePeriodData<T>(endpoint: string, dataKey: string) {
  const [periods, setPeriods] = React.useState<AvailablePeriod[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/months")
      .then((res) => res.json())
      .then((res) => {
        const list: AvailablePeriod[] = res.periods ?? [];
        setPeriods(list);
        if (list.length) setSelectedMonth(list[list.length - 1].jalaliMonth);
      });
  }, []);

  React.useEffect(() => {
    if (!selectedMonth) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${endpoint}?month=${encodeURIComponent(selectedMonth)}`)
      .then((res) => res.json())
      .then((res) => {
        if (!cancelled) setData(res[dataKey] ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedMonth, endpoint, dataKey]);

  const periodLabel = periods.find((p) => p.jalaliMonth === selectedMonth)?.monthLabel;

  return { periods, selectedMonth, setSelectedMonth, data, loading, periodLabel };
}

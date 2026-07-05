"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AvailablePeriod } from "@/lib/types";

interface PeriodSelectProps {
  periods: AvailablePeriod[];
  value: string;
  onChange: (jalaliMonth: string) => void;
}

export function PeriodSelect({ periods, value, onChange }: PeriodSelectProps) {
  if (periods.length === 0) return null;

  const years = Array.from(new Set(periods.map((p) => p.year))).sort((a, b) => a - b);
  const selected = periods.find((p) => p.jalaliMonth === value) ?? periods[periods.length - 1];
  const monthsForYear = periods
    .filter((p) => p.year === selected.year)
    .sort((a, b) => a.month - b.month);

  function handleYearChange(yearStr: string) {
    const year = Number(yearStr);
    const monthsInYear = periods.filter((p) => p.year === year).sort((a, b) => a.month - b.month);
    const match =
      monthsInYear.find((p) => p.month === selected.month) ?? monthsInYear[monthsInYear.length - 1];
    onChange(match.jalaliMonth);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Select value={String(selected.year)} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[76px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selected.jalaliMonth} onValueChange={onChange}>
        <SelectTrigger className="w-[112px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {monthsForYear.map((period) => (
            <SelectItem key={period.jalaliMonth} value={period.jalaliMonth}>
              {period.monthName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import salesData from "@/lib/data/electricity-sales.json";
import { formatJalaliMonthLabel, jalaliSortKey, parseJalaliMonth } from "@/lib/jalali";
import { formatDate } from "@/lib/utils";
import type {
  AgentSummary,
  AvailablePeriod,
  CustomerFlowPoint,
  Metrics,
  Notification,
  PricePoint,
  RevenuePoint,
  SalesRecord,
  TariffMixSlice,
  Todo,
} from "@/lib/types";

// The full, real dataset: one row per sales agent per Persian-calendar month.
// See lib/data/electricity-sales.json for provenance notes.
const records = salesData as SalesRecord[];

const months = Array.from(new Set(records.map((r) => r.jalaliMonth))).sort(
  (a, b) => jalaliSortKey(a) - jalaliSortKey(b)
);

export const latestMonth = months[months.length - 1];
const previousMonth = months[months.length - 2];

function recordsForMonth(month: string | undefined): SalesRecord[] {
  if (!month) return [];
  return records.filter((r) => r.jalaliMonth === month);
}

function pctChange(current: number, previous: number): number {
  if (!previous) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}

function weightedAverage(
  rows: SalesRecord[],
  priceKey: "avgNormalPriceRialPerKwh" | "avgGreenPriceRialPerKwh",
  volumeKey: "kwhNormal" | "kwhGreen"
): number | null {
  let volume = 0;
  let weighted = 0;
  for (const row of rows) {
    const price = row[priceKey];
    const vol = row[volumeKey];
    if (price != null && vol > 0) {
      volume += vol;
      weighted += price * vol;
    }
  }
  return volume > 0 ? weighted / volume : null;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** All months present in the dataset, in chronological order, for building
 * Year / Month filter dropdowns without exposing the Jalali strings directly. */
export function getAvailablePeriods(): AvailablePeriod[] {
  return months.map((jalaliMonth) => {
    const date = parseJalaliMonth(jalaliMonth);
    return {
      jalaliMonth,
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: new Intl.DateTimeFormat("en-US", { month: "long" }).format(date),
      monthLabel: formatJalaliMonthLabel(jalaliMonth),
    };
  });
}

export function getRevenueTrend(): RevenuePoint[] {
  return months.map((month) => {
    const rows = recordsForMonth(month);
    return {
      jalaliMonth: month,
      monthLabel: formatJalaliMonthLabel(month),
      revenueRial: rows.reduce((sum, r) => sum + r.revenueRial, 0),
      kwhTotal: rows.reduce((sum, r) => sum + r.kwhTotal, 0),
    };
  });
}

export function getPriceTrend(): PricePoint[] {
  return months.map((month) => {
    const rows = recordsForMonth(month);
    return {
      jalaliMonth: month,
      monthLabel: formatJalaliMonthLabel(month),
      avgNormalPriceRialPerKwh: weightedAverage(
        rows,
        "avgNormalPriceRialPerKwh",
        "kwhNormal"
      ),
      avgGreenPriceRialPerKwh: weightedAverage(
        rows,
        "avgGreenPriceRialPerKwh",
        "kwhGreen"
      ),
    };
  });
}

export function getCustomerFlow(): CustomerFlowPoint[] {
  return months.map((month) => {
    const rows = recordsForMonth(month);
    return {
      jalaliMonth: month,
      monthLabel: formatJalaliMonthLabel(month),
      newCustomers: rows.reduce((sum, r) => sum + r.newCustomers, 0),
      returningCustomers: rows.reduce((sum, r) => sum + r.returningCustomers, 0),
      lostCustomers: rows.reduce((sum, r) => sum + r.lostCustomers, 0),
      netCustomerGrowth: rows.reduce((sum, r) => sum + r.netCustomerGrowth, 0),
    };
  });
}

export function getTariffMix(jalaliMonth?: string): TariffMixSlice[] {
  const month = jalaliMonth && months.includes(jalaliMonth) ? jalaliMonth : latestMonth;
  const rows = recordsForMonth(month);
  return [
    { tariff: "Normal", kwh: rows.reduce((sum, r) => sum + r.kwhNormal, 0) },
    { tariff: "Green", kwh: rows.reduce((sum, r) => sum + r.kwhGreen, 0) },
    { tariff: "Free", kwh: rows.reduce((sum, r) => sum + r.kwhFree, 0) },
  ];
}

export function getAgentSummaries(jalaliMonth?: string): AgentSummary[] {
  const month = jalaliMonth && months.includes(jalaliMonth) ? jalaliMonth : latestMonth;
  const rows = recordsForMonth(month);
  return rows
    .map((r) => ({
      id: slugify(r.agent),
      name: r.agent,
      invoicesFinalized: r.invoicesFinalized,
      kwhTotal: Math.round(r.kwhTotal),
      revenueRial: r.revenueRial,
      netCustomerGrowth: r.netCustomerGrowth,
      salesSharePct: r.salesSharePct,
      avgNormalPriceRialPerKwh: r.avgNormalPriceRialPerKwh,
    }))
    .sort((a, b) => b.revenueRial - a.revenueRial);
}

export function getMetrics(): Metrics {
  const current = recordsForMonth(latestMonth);
  const previous = recordsForMonth(previousMonth);

  const currentRevenue = current.reduce((sum, r) => sum + r.revenueRial, 0);
  const previousRevenue = previous.reduce((sum, r) => sum + r.revenueRial, 0);

  const currentKwh = current.reduce((sum, r) => sum + r.kwhTotal, 0);
  const previousKwh = previous.reduce((sum, r) => sum + r.kwhTotal, 0);

  const currentNetGrowth = current.reduce((sum, r) => sum + r.netCustomerGrowth, 0);
  const previousNetGrowth = previous.reduce((sum, r) => sum + r.netCustomerGrowth, 0);

  const currentPrice = weightedAverage(current, "avgNormalPriceRialPerKwh", "kwhNormal") ?? 0;
  const previousPrice = weightedAverage(previous, "avgNormalPriceRialPerKwh", "kwhNormal") ?? 0;

  return {
    totalRevenueRial: currentRevenue,
    revenueChangePct: pctChange(currentRevenue, previousRevenue),
    totalKwhSold: Math.round(currentKwh),
    kwhChangePct: pctChange(currentKwh, previousKwh),
    netCustomerGrowth: currentNetGrowth,
    customerGrowthChangePct: pctChange(currentNetGrowth, previousNetGrowth),
    avgNormalPriceRialPerKwh: Math.round(currentPrice),
    priceChangePct: pctChange(currentPrice, previousPrice),
    activeAgents: current.length,
    latestMonthLabel: formatJalaliMonthLabel(latestMonth),
  };
}

// Notifications and to-dos are lightweight demo widgets, themed to match an
// electricity-retail sales floor. They are not derived from the CSV.
export const notifications: Notification[] = [
  {
    id: "n1",
    type: "deal",
    title: "Large invoice finalized — Daniel Ford",
    description: "62,400 kWh finalized for a returning industrial customer.",
    time: "8m ago",
    read: false,
  },
  {
    id: "n2",
    type: "alert",
    title: "Churn spike: check lost customers",
    description: "Lost-customer count is trending up for two agents this month.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "message",
    title: "New message from Olivia Turner",
    description: "“Can we review green-tariff pricing before renewals?”",
    time: "3h ago",
    read: false,
  },
  {
    id: "n4",
    type: "system",
    title: "Monthly report ready",
    description: "The sales performance report for last month is ready.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "deal",
    title: "Green-tariff invoice finalized — Sofia Bennett",
    description: "458 kWh of green energy billed at premium rate.",
    time: "Yesterday",
    read: true,
  },
];

function daysFromNow(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

export const todos: Todo[] = [
  { id: "t1", label: "Review this month's price-per-kWh trend", done: false, priority: "high", due: formatDate(daysFromNow(0)), createdAt: daysFromNow(0).toISOString() },
  { id: "t2", label: "Follow up on lost customers with Chloe Whitman", done: false, priority: "high", due: formatDate(daysFromNow(0)), createdAt: daysFromNow(0).toISOString() },
  { id: "t3", label: "Send monthly performance report", done: false, priority: "medium", due: formatDate(daysFromNow(1)), createdAt: daysFromNow(-1).toISOString() },
  { id: "t4", label: "Prep green-tariff pitch deck", done: true, priority: "low", due: formatDate(daysFromNow(-2)), createdAt: daysFromNow(-3).toISOString() },
  { id: "t5", label: "1:1 with Marcus Reed", done: false, priority: "medium", due: formatDate(daysFromNow(3)), createdAt: daysFromNow(-1).toISOString() },
  { id: "t6", label: "Audit customer churn for the quarter", done: false, priority: "high", due: formatDate(daysFromNow(4)), createdAt: daysFromNow(0).toISOString() },
];

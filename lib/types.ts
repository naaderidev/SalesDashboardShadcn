// Raw shape of each record in lib/data/electricity-sales.json — one row per
// sales agent per Persian calendar month, sourced from a real electricity
// retailer's sales spreadsheet (agent names anonymized).
export interface SalesRecord {
  jalaliMonth: string; // e.g. "1402/09"
  agent: string;
  invoicesFinalized: number;
  newCustomers: number;
  returningCustomers: number;
  lostCustomers: number;
  netCustomerGrowth: number;
  salesSharePct: number;
  kwhNormal: number;
  kwhGreen: number;
  kwhFree: number;
  kwhTotal: number;
  revenueRial: number;
  avgNormalPriceRialPerKwh: number | null;
  avgGreenPriceRialPerKwh: number | null;
  growthTargetPct: number | null;
}

// Aggregated per-agent performance snapshot for a given window (e.g. the
// latest month on record).
export interface AgentSummary {
  id: string;
  name: string;
  invoicesFinalized: number;
  kwhTotal: number;
  revenueRial: number;
  netCustomerGrowth: number;
  salesSharePct: number;
  avgNormalPriceRialPerKwh: number | null;
}

export interface RevenuePoint {
  jalaliMonth: string;
  monthLabel: string;
  revenueRial: number;
  kwhTotal: number;
}

export interface PricePoint {
  jalaliMonth: string;
  monthLabel: string;
  avgNormalPriceRialPerKwh: number | null;
  avgGreenPriceRialPerKwh: number | null;
}

export interface CustomerFlowPoint {
  jalaliMonth: string;
  monthLabel: string;
  newCustomers: number;
  returningCustomers: number;
  lostCustomers: number;
  netCustomerGrowth: number;
}

export interface TariffMixSlice {
  tariff: "Normal" | "Green" | "Free";
  kwh: number;
}

/** One selectable month/year option for the bubble-chart and energy-mix
 * period filters, derived from the dataset's real Jalali months. */
export interface AvailablePeriod {
  jalaliMonth: string;
  year: number;
  month: number; // 0-11, Gregorian
  monthName: string;
  monthLabel: string;
}

export interface Metrics {
  totalRevenueRial: number;
  revenueChangePct: number;
  totalKwhSold: number;
  kwhChangePct: number;
  netCustomerGrowth: number;
  customerGrowthChangePct: number;
  avgNormalPriceRialPerKwh: number;
  priceChangePct: number;
  activeAgents: number;
  latestMonthLabel: string;
}

export type NotificationType = "deal" | "alert" | "message" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface Todo {
  id: string;
  label: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  due: string;
  createdAt: string;
}

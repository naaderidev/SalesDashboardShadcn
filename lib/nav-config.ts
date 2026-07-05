import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  LineChart,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Sales Agents", href: "/agents", icon: Users },
  { title: "Reports", href: "/reports", icon: LineChart },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function labelForSegment(segment: string): string {
  const match = navItems.find((item) => item.href === `/${segment}`);
  if (match) return match.title;
  return segment
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

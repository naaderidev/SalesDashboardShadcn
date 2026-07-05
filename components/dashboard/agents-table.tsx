"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { AgentAvatar } from "@/components/dashboard/agent-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatNumber, formatRial, formatRialPerKwh } from "@/lib/utils";
import type { AgentSummary } from "@/lib/types";

export function AgentsTable({ agents, limit }: { agents: AgentSummary[]; limit?: number }) {
  const rows = limit ? agents.slice(0, limit) : agents;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Agent leaderboard</CardTitle>
        <CardDescription>Ranked by revenue this month</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Invoices</TableHead>
              <TableHead>kWh sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Avg. price</TableHead>
              <TableHead>Net customers</TableHead>
              <TableHead className="w-28">Share of sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((agent, i) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-3 text-[10px] font-medium text-muted-foreground sm:w-4 sm:text-xs">
                      {i + 1}
                    </span>
                    <AgentAvatar name={agent.name} className="h-9 w-9 sm:h-11 sm:w-11" />
                    <p className="text-xs font-medium leading-none sm:text-sm">{agent.name}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{agent.invoicesFinalized}</TableCell>
                <TableCell className="text-xs sm:text-sm">{formatNumber(agent.kwhTotal, true)}</TableCell>
                <TableCell className="text-xs font-medium sm:text-sm">
                  {formatRial(agent.revenueRial, true)}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {agent.avgNormalPriceRialPerKwh != null
                    ? formatRialPerKwh(agent.avgNormalPriceRialPerKwh)
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={agent.netCustomerGrowth >= 0 ? "success" : "destructive"}
                    className="gap-0.5 text-[10px] sm:text-xs"
                  >
                    {agent.netCustomerGrowth >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {agent.netCustomerGrowth}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full bg-primary")}
                        style={{ width: `${Math.min(100, agent.salesSharePct)}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-[10px] text-muted-foreground sm:text-xs">
                      {agent.salesSharePct}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

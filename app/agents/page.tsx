"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AgentBubblePanel } from "@/components/dashboard/agent-bubble-panel";
import { AgentRoster } from "@/components/dashboard/agent-roster";
import { AgentsTable } from "@/components/dashboard/agents-table";
import type { AgentSummary } from "@/lib/types";

export default function AgentsPage() {
  const [agents, setAgents] = React.useState<AgentSummary[] | null>(null);

  React.useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data.agents ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Sales agents</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Full roster performance by month, sourced from{" "}
          <code className="text-[11px] sm:text-xs">/api/agents</code>.
        </p>
      </div>

      {!agents ? (
        <Skeleton className="h-[220px] rounded-xl" />
      ) : (
        <AgentRoster agents={agents} />
      )}

      <AgentBubblePanel />

      {!agents ? (
        <Skeleton className="h-[420px] rounded-xl" />
      ) : (
        <AgentsTable agents={agents} />
      )}
    </div>
  );
}

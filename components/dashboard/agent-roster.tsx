import { AgentAvatar } from "@/components/dashboard/agent-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRial } from "@/lib/utils";
import type { AgentSummary } from "@/lib/types";

export function AgentRoster({ agents }: { agents: AgentSummary[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Team roster</CardTitle>
        <CardDescription>
          Placeholder photos — these are anonymized agents, not real people
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center"
            >
              <AgentAvatar name={agent.name} className="h-16 w-16 sm:h-20 sm:w-20" />
              <div>
                <p className="text-xs font-medium leading-tight sm:text-sm">{agent.name}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  {formatRial(agent.revenueRial, true)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

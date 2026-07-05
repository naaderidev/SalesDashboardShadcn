import { cn } from "@/lib/utils";

// Shared placeholder photo used for every (anonymized, fake-named) sales
// agent and for the admin profile — see public/avatars/default-avatar.svg.
export const DEFAULT_AVATAR_SRC = "/avatars/default-avatar.svg";

interface AgentAvatarProps {
  name: string;
  className?: string;
}

export function AgentAvatar({ name, className }: AgentAvatarProps) {
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-lg", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DEFAULT_AVATAR_SRC}
        alt={`${name} (placeholder photo)`}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

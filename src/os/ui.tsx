import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface AppProps {
  payload?: unknown;
  winId: string;
}

export type StatusLike =
  | "SHIPPED"
  | "MAINTAINED"
  | "WIP"
  | "ARCHIVED"
  | "LIVE"
  | "WORKING"
  | "UNSTABLE"
  | "CLASSIFIED"
  | "COMPLETED";

const STATUS_TONE: Record<string, string> = {
  SHIPPED: "text-accent",
  MAINTAINED: "text-accent",
  LIVE: "text-accent",
  WORKING: "text-accent",
  COMPLETED: "text-accent",
  WIP: "text-warn",
  UNSTABLE: "text-warn",
  ARCHIVED: "text-faint",
  CLASSIFIED: "text-danger",
};

export function StatusChip({ status, className }: { status: StatusLike; className?: string }) {
  const tone = STATUS_TONE[status] ?? "text-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-edge2 bg-panel px-2 py-0.5 text-[10px] tracking-[0.14em]",
        tone,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", status === "WORKING" && "pulse-dot")} />
      {status}
    </span>
  );
}

export function SectionTitle({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-edge pb-2">
      <h3 className="label text-muted">{children}</h3>
      {right}
    </div>
  );
}

export function AppHeader({
  path,
  right,
}: {
  path: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 border-b border-edge bg-panel px-3">
      <span className="micro truncate text-faint">{path}</span>
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

/** Dotted leader key/value row, like a system info table. */
export function LeaderRow({ k, v, mono = true }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 py-1">
      <span className="micro shrink-0 text-muted">{k}</span>
      <span className="h-px flex-1 translate-y-[-2px] border-b border-dotted border-edge2" />
      <span className={cn("micro text-right text-ink", mono && "font-medium")}>{v}</span>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-edge2 bg-panel px-1.5 py-0.5 text-[10px] tracking-wide text-muted">
      {children}
    </span>
  );
}

export function GhostBtn({
  children,
  onClick,
  active,
  className,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "no-tap inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] tracking-wide transition-colors",
        active
          ? "border-accent/60 bg-accent/10 text-accent"
          : "border-edge2 bg-panel text-muted hover:border-edge3 hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Caret({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block w-2 text-accent", className)}>
      <span className="block">›</span>
    </span>
  );
}

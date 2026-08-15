import { useMemo, useState } from "react";
import { GITHUB_USERNAME } from "@/github/config";
import { relativeTime } from "@/github/format";
import type { GithubProject, GithubProjectStatus } from "@/github/types";
import { useGithubProjects } from "@/github/useGithubProjects";
import { useOS } from "@/os/OSContext";
import { GhostBtn, StatusChip, Tag } from "@/os/ui";
import { cn } from "@/utils/cn";
type Filter = "ALL" | GithubProjectStatus;
const FILTERS: Filter[] = ["ALL", "WIP", "COMPLETED", "ARCHIVED"];
export default function GithubProjectsPanel() {
  const os = useOS();
  const { status, projects, totalRepos, error, lastSynced, refresh, retry } = useGithubProjects();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [syncing, setSyncing] = useState(false);
  const counts = useMemo(() => {
    const c: Record<GithubProjectStatus, number> = { WIP: 0, COMPLETED: 0, ARCHIVED: 0 };
    for (const p of projects) c[p.status]++;
    return c;
  }, [projects]);
  const visible = useMemo(
    () => (filter === "ALL" ? projects : projects.filter((p) => p.status === filter)),
    [projects, filter],
  );
  const openProject = (p: GithubProject) => {
    os.openApp("ghproject", { project: p }, { title: `${p.title}.gh` });
  };
  const sync = async () => {
    setSyncing(true);
    await refresh();
    setSyncing(false);
    os.notify("GITHUB", "Repository index re-synced.", "accent");
  };
  if (status === "loading" || status === "idle") {
    return <GithubScanState />;
  }
  if (status === "error") {
    return <GithubErrorState message={error ?? "Unable to retrieve repository index."} onRetry={retry} />;
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-edge bg-panel/60 px-3 py-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5 micro text-accent">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
            GITHUB CONNECTION · ONLINE
          </span>
          <span className="micro text-faint">
            REPOSITORIES <span className="tabular-nums text-ink">{totalRepos}</span> DETECTED
          </span>
          <span className="micro text-faint">
            INDEXED <span className="tabular-nums text-ink">{projects.length}</span>
          </span>
          <span className="micro hidden text-faint sm:inline">@{GITHUB_USERNAME}</span>
          <GhostBtn className="ml-auto" onClick={sync} title="Re-fetch repository index from GitHub">
            <span className={cn(syncing && "inline-block animate-[spin_0.9s_linear_infinite]")}>⟳</span>
            SYNC GITHUB
          </GhostBtn>
        </div>
        {lastSynced && (
          <div className="micro mt-1 text-dim">last synced {relativeTime(new Date(lastSynced).toISOString())}</div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-edge px-3 py-2">
        {FILTERS.map((f) => (
          <GhostBtn key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
            <span className="tabular-nums text-faint">
              {f === "ALL" ? projects.length : counts[f as GithubProjectStatus]}
            </span>
          </GhostBtn>
        ))}
      </div>

      <div className="os-scroll min-h-0 flex-1 overflow-auto p-3">
        {visible.length === 0 ? (
          <div className="micro p-4 text-faint">▸ no repositories match this filter</div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {visible.map((p) => (
              <GithubProjectCard key={p.id} project={p} onOpen={() => openProject(p)} />
            ))}
          </div>
        )}
        <div className="mt-4 border-t border-dashed border-edge pt-2 micro text-faint">
          ▸ auto-indexed from GitHub topic <span className="text-muted">spectre-portfolio</span> — add it to a repo to
          publish it here
        </div>
      </div>
    </div>
  );
}
function GithubProjectCard({ project: p, onOpen }: { project: GithubProject; onOpen: () => void }) {
  return (
    <div className="flex flex-col border border-edge bg-panel p-3 transition-colors hover:border-edge3 hover:bg-panel2">
      <div className="micro mb-1.5 text-faint">SPECTRE.OS / PROJECT</div>

      <div className="flex items-start justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          {p.featured && (
            <span className="shrink-0 text-accent" title="Featured project">
              ★
            </span>
          )}
          <span className="truncate font-mono text-[13px] font-semibold tracking-wide text-ink">
            {p.title.toUpperCase()}
          </span>
        </span>
        <StatusChip className="shrink-0" status={p.status} />
      </div>

      <p className="mt-1.5 line-clamp-2 tiny text-muted">{p.description}</p>

      {p.technologies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {p.technologies.slice(0, 4).map((t) => (
            <Tag key={t}>{t.toUpperCase()}</Tag>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 micro text-faint">
        <span className="tabular-nums">★ {p.stars}</span>
        <span className="tabular-nums">⑂ {p.forks}</span>
        <span className="ml-auto truncate">UPDATED {relativeTime(p.pushedAt).toUpperCase()}</span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-edge pt-2.5">
        <GhostBtn onClick={onOpen}>OPEN PROJECT</GhostBtn>
        <GhostBtn onClick={() => window.open(p.githubUrl, "_blank", "noopener,noreferrer")}>SOURCE CODE</GhostBtn>
      </div>
    </div>
  );
}
function GithubScanState() {
  return (
    <div className="fade-in flex h-full min-h-0 flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm font-mono text-[12px] text-muted">
        <div className="mb-3 micro text-accent">SPECTRE.OS</div>
        <ScanLine label="GITHUB CONNECTION" value="ONLINE" tone="accent" />
        <ScanLine label="REPOSITORY SCAN" value="RUNNING" tone="warn" spin />
        <ScanLine label="PROJECT INDEX" value="LOADING" tone="faint" />
        <ScanLine label="STATUS DATABASE" value="STANDBY" tone="faint" />
        <div className="mt-3 h-1 w-full overflow-hidden bg-panel3">
          <div className="h-full bg-accent" style={{ animation: "bootbar 1.8s ease-in-out infinite alternate" }} />
        </div>
      </div>
    </div>
  );
}
function ScanLine({
  label,
  value,
  tone,
  spin,
}: {
  label: string;
  value: string;
  tone: "accent" | "warn" | "faint";
  spin?: boolean;
}) {
  const toneClass = tone === "accent" ? "text-accent" : tone === "warn" ? "text-warn" : "text-faint";
  return (
    <div className="flex items-baseline gap-2 py-0.5">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="h-px flex-1 translate-y-[-2px] border-b border-dotted border-edge2" />
      <span className={cn("inline-flex items-center gap-1 font-medium", toneClass)}>
        {spin && <span className="inline-block animate-[spin_0.9s_linear_infinite]">◌</span>}
        {value}
      </span>
    </div>
  );
}
function GithubErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="fade-in flex h-full min-h-0 flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm font-mono text-[12px]">
        <div className="mb-3 micro text-danger">GITHUB CONNECTION ........ FAILED</div>
        <p className="tiny text-muted">Unable to retrieve repository index.</p>
        <p className="micro mt-1 text-faint">{message}</p>
        <GhostBtn className="mx-auto mt-4" onClick={onRetry}>
          ⟳ RETRY
        </GhostBtn>
      </div>
    </div>
  );
}

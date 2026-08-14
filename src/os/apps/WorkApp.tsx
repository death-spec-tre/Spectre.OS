import { useState } from "react";
import { projects, workFolders } from "@/data/portfolio";
import { useOS } from "@/os/OSContext";
import { cn } from "@/utils/cn";
import { AppHeader, StatusChip, type AppProps } from "@/os/ui";
import GithubProjectsPanel from "./GithubProjectsPanel";

export default function WorkApp(_: AppProps) {
  const os = useOS();
  const [active, setActive] = useState(workFolders[0].id);
  const [selected, setSelected] = useState<string | null>(null);

  const folder = workFolders.find((f) => f.id === active)!;
  const isGithub = folder.id === "github";
  const items = projects.filter((p) => p.folderId === active);

  const openProject = (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (p) os.openApp("project", { projectId: p.id }, { title: `${p.name}.case` });
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        path={`/HOME/SPECTRE/WORK/${folder.name.toUpperCase()}`}
        right={
          !isGithub && (
            <span className="micro text-faint">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )
        }
      />
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="w-[104px] shrink-0 overflow-y-auto border-r border-edge bg-panel/50 p-1.5 sm:w-40 sm:p-2 os-scroll">
          <div className="micro mb-2 px-1 text-faint">DIRECTORIES</div>
          <ul className="space-y-0.5">
            {workFolders.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(f.id);
                    setSelected(null);
                  }}
                  className={cn(
                    "no-tap flex w-full items-center gap-2 px-1.5 py-1.5 text-left text-[12px] transition-colors",
                    active === f.id ? "bg-accent/10 text-accent" : "text-muted hover:bg-panel2 hover:text-ink"
                  )}
                >
                  <span className="text-[11px]">{f.glyph}</span>
                  <span className="truncate">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-edge pt-2">
            <div className="micro px-1 text-faint">{folder.blurb}</div>
          </div>
        </aside>

        {/* GitHub-indexed projects, or the static file grid */}
        {isGithub ? (
          <div className="min-w-0 flex-1">
            <GithubProjectsPanel />
          </div>
        ) : (
          <div className="os-scroll min-w-0 flex-1 overflow-auto p-3">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {items.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  onDoubleClick={() => openProject(p.id)}
                  className={cn(
                    "no-tap group flex items-start gap-3 border p-2.5 text-left transition-colors",
                    selected === p.id
                      ? "border-accent/50 bg-accent/5"
                      : "border-edge bg-panel hover:border-edge3 hover:bg-panel2"
                  )}
                >
                  <span className="mt-0.5 text-base">◜</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-medium text-ink">{p.name}</span>
                      <StatusChip status={p.status} />
                    </span>
                    <span className="mt-1 block truncate tiny text-muted">{p.summary}</span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className="micro text-faint">{p.year}</span>
                      <span className="micro text-dim">·</span>
                      <span className="micro truncate text-faint">{p.stack.slice(0, 3).join(" / ")}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-dashed border-edge pt-2 micro text-faint">
              ▸ double-click a file to open its case study
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

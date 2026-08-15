import { useEffect, useState } from "react";
import { fetchReadmePreview } from "@/github/githubApi";
import { relativeTime, shortDate } from "@/github/format";
import type { GithubProject } from "@/github/types";
import { AppHeader, GhostBtn, LeaderRow, StatusChip, Tag, type AppProps } from "@/os/ui";
const README_PREVIEW_CHARS = 480;
export default function GithubProjectApp({ payload }: AppProps) {
  const p = (
    payload as
      | {
          project?: GithubProject;
        }
      | undefined
  )?.project;
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeState, setReadmeState] = useState<"loading" | "ready" | "none">("loading");
  useEffect(() => {
    if (!p) return;
    let cancelled = false;
    setReadmeState("loading");
    fetchReadmePreview(p.owner, p.repoName).then((text) => {
      if (cancelled) return;
      if (text) {
        setReadme(cleanReadme(text));
        setReadmeState("ready");
      } else {
        setReadmeState("none");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [p]);
  if (!p) {
    return <div className="p-6 text-sm text-muted">No project file mounted.</div>;
  }
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        path={`/HOME/SPECTRE/WORK/GITHUB/${p.repoName.toUpperCase()}`}
        right={<StatusChip status={p.status} />}
      />

      <div className="os-scroll min-h-0 flex-1 overflow-auto">
        <div className="border-b border-edge p-5">
          <div className="micro mb-1 text-accent">// GITHUB REPOSITORY · {p.owner}</div>
          <h2 className="font-mono text-2xl font-bold tracking-tight text-ink">{p.title}</h2>
          <p className="mt-1 max-w-prose text-[13px] text-muted">{p.description}</p>
          {p.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.technologies.map((t) => (
                <Tag key={t}>{t.toUpperCase()}</Tag>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 divide-x divide-edge border-b border-edge">
          <Metric label="STARS" value={`★ ${p.stars}`} />
          <Metric label="FORKS" value={`⑂ ${p.forks}`} />
          <Metric label="OPEN ISSUES" value={String(p.openIssues)} />
        </div>

        <div className="space-y-5 p-5">
          <section>
            <div className="micro mb-2 text-faint">▸ README</div>
            {readmeState === "loading" && <p className="tiny text-faint">Fetching README from GitHub…</p>}
            {readmeState === "none" && <p className="tiny text-faint">No README found in this repository.</p>}
            {readmeState === "ready" && readme && (
              <pre className="tiny max-h-40 overflow-hidden whitespace-pre-wrap font-mono leading-relaxed text-ink/80">
                {readme.slice(0, README_PREVIEW_CHARS)}
                {readme.length > README_PREVIEW_CHARS ? "…" : ""}
              </pre>
            )}
            <GhostBtn
              className="mt-2"
              onClick={() => window.open(`${p.githubUrl}#readme`, "_blank", "noopener,noreferrer")}
            >
              READ FULL README
            </GhostBtn>
          </section>

          <section>
            <div className="micro mb-2 text-faint">▸ METADATA</div>
            <div className="max-w-md">
              <LeaderRow k="STATUS" v={p.status} />
              <LeaderRow k="LANGUAGE" v={p.language ?? "—"} />
              <LeaderRow k="CATEGORY" v={p.category} />
              <LeaderRow k="LICENSE" v={p.license ?? "None"} />
              <LeaderRow k="DEFAULT BRANCH" v={p.defaultBranch} />
              <LeaderRow k="CREATED" v={shortDate(p.createdAt)} />
              <LeaderRow k="LAST UPDATED" v={relativeTime(p.updatedAt)} />
              <LeaderRow k="LAST PUSHED" v={relativeTime(p.pushedAt)} />
              {!p.hasSpectreConfig && <LeaderRow k="CONFIG" v="GitHub metadata only" />}
            </div>
          </section>

          {p.topics.length > 0 && (
            <section>
              <div className="micro mb-2 text-faint">▸ TOPICS</div>
              <div className="flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-edge bg-panel/50 p-3">
          <GhostBtn onClick={() => window.open(p.githubUrl, "_blank", "noopener,noreferrer")}>⤓ source code</GhostBtn>
          {p.homepageUrl && (
            <GhostBtn onClick={() => window.open(p.homepageUrl!, "_blank", "noopener,noreferrer")}>
              ↗ live demo
            </GhostBtn>
          )}
          <span className="micro ml-auto text-faint">EOF · {p.repoName}</span>
        </div>
      </div>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3 text-center">
      <div className="font-mono text-lg font-bold text-accent">{value}</div>
      <div className="micro mt-0.5 text-faint">{label}</div>
    </div>
  );
}
function cleanReadme(text: string): string {
  return text
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`]{1,3}/g, "")
    .trim();
}

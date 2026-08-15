import { projectById } from "@/data/portfolio";
import { useOS } from "@/os/OSContext";
import { AppHeader, GhostBtn, StatusChip, Tag, type AppProps } from "@/os/ui";
export default function ProjectApp({ payload }: AppProps) {
  const os = useOS();
  const projectId = (
    payload as
      | {
          projectId?: string;
        }
      | undefined
  )?.projectId;
  const p = projectId ? projectById(projectId) : undefined;
  if (!p) {
    return <div className="p-6 text-sm text-muted">No project file mounted.</div>;
  }
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        path={`/HOME/SPECTRE/WORK/${p.folder.toUpperCase()}/${p.name.toUpperCase()}.case`}
        right={<StatusChip status={p.status} />}
      />

      <div className="os-scroll min-h-0 flex-1 overflow-auto">
        <div className="border-b border-edge p-5">
          <div className="micro mb-1 text-accent">// CASE STUDY · {p.folder}</div>
          <h2 className="font-mono text-2xl font-bold tracking-tight text-ink">{p.name}</h2>
          <p className="mt-1 max-w-prose text-[13px] text-muted">{p.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </div>

        {p.metrics && (
          <div className="grid grid-cols-3 divide-x divide-edge border-b border-edge">
            {p.metrics.map((m) => (
              <div key={m.label} className="px-3 py-3 text-center">
                <div className="font-mono text-lg font-bold text-accent">{m.value}</div>
                <div className="micro mt-0.5 text-faint">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-5 p-5">
          <section>
            <div className="micro mb-2 text-faint">▸ OVERVIEW</div>
            <p className="max-w-prose text-[13px] leading-relaxed text-ink/90">{p.description}</p>
          </section>

          <section>
            <div className="micro mb-2 text-faint">▸ KEY HIGHLIGHTS</div>
            <ul className="space-y-1.5">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink/90">
                  <span className="mt-0.5 text-accent">+</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="micro mb-2 text-faint">▸ METADATA</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px] sm:grid-cols-3">
              <Meta k="STATUS" v={p.status} />
              <Meta k="YEAR" v={p.year} />
              <Meta k="DOMAIN" v={p.folder} />
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-edge bg-panel/50 p-3">
          <GhostBtn onClick={() => os.notify("PROJECT", "Cloning repository...", "accent")}>⤓ clone source</GhostBtn>
          <GhostBtn onClick={() => os.openApp("contact")}>✉ discuss this</GhostBtn>
          <span className="micro ml-auto text-faint">EOF · {p.name}.case</span>
        </div>
      </div>
    </div>
  );
}
function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="micro text-faint">{k}</span>
      <span className="text-[12px] text-ink">{v}</span>
    </div>
  );
}

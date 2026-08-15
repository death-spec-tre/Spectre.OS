import { knownIssues, systemInfo } from "@/data/portfolio";
import { useOS } from "@/os/OSContext";
import { AppHeader, LeaderRow, type AppProps } from "@/os/ui";
const LOGO = String.raw`
   ▄▄▄▄▄▄▄ ▄▄▄▄ ▄▄ ▄▄
  █ ░░░░░ █  ▀▄  █░█
  █ ░░▀░░ █ ▀▀▀ █▀▀█
  █ ░░░░░ █     █  █
   ▀▀▀▀▀▀▀ ▀▀▀▀ ▀  ▀`;
export default function SystemApp(_: AppProps) {
  const os = useOS();
  return (
    <div className="flex h-full flex-col">
      <AppHeader path="/SYS/SYSTEM/about" right={<span className="micro text-accent">◉ ALL SYSTEMS NOMINAL</span>} />
      <div className="os-scroll min-h-0 flex-1 overflow-auto p-5">
        <div className="flex flex-col gap-6 sm:flex-row">
          <pre className="shrink-0 font-mono text-[11px] leading-tight text-accent/90">{LOGO}</pre>
          <div className="min-w-0 flex-1">
            <div className="micro mb-2 text-faint">SYSTEM INFORMATION</div>
            <div className="max-w-sm">
              {systemInfo.map((r) => (
                <LeaderRow key={r.k} k={r.v === "SPECTRE.OS" ? "OS" : r.k} v={r.v} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="micro mb-2 text-faint">KNOWN ISSUES</div>
          <ul className="max-w-md space-y-1">
            {knownIssues.map((iss) => (
              <li key={iss} className="flex items-start gap-2 text-[13px] text-ink/90">
                <span className="mt-px shrink-0 text-warn">[!]</span>
                <span>{iss}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-edge pt-4">
          <div className="font-mono text-[11px] text-faint">
            <div className="tabular-nums">processes: {os.windows.length + 7} · threads: ∞</div>
          </div>
          <button
            type="button"
            onClick={() => os.notify("SYSTEM", "Have you tried turning it off and on?", "warn")}
            className="no-tap border border-edge2 bg-panel px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-edge3 hover:text-ink"
          >
            ⟳ restart human
          </button>
        </div>
      </div>
    </div>
  );
}

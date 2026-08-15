import { useEffect, useRef, useState } from "react";
import { classifiedSecret, experiments } from "@/data/portfolio";
import { useOS } from "@/os/OSContext";
import { AppHeader, StatusChip, type AppProps } from "@/os/ui";
import { cn } from "@/utils/cn";
export default function LabApp(_: AppProps) {
  const os = useOS();
  const [open, setOpen] = useState<string | null>(experiments[0].id);
  const [clicks, setClicks] = useState(0);
  const [decrypting, setDecrypting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const attemptClassified = () => {
    if (revealed) return;
    const next = clicks + 1;
    setClicks(next);
    if (next === 1) os.notify("SECURITY", "ACCESS DENIED. Attempt logged.", "warn");
    if (next >= 3 && !decrypting) {
      setDecrypting(true);
      os.notify("SECURITY", "Bypass detected. Decrypting...", "accent");
      timers.current.push(
        window.setTimeout(() => {
          setDecrypting(false);
          setRevealed(true);
        }, 2600),
      );
    }
  };
  return (
    <div className="flex h-full flex-col">
      <AppHeader path="/SYS/LAB/experiments" right={<span className="micro text-faint">CLEARANCE: PUBLIC</span>} />
      <div className="border-b border-edge bg-danger/5 px-3 py-1.5 micro text-danger">
        ⚠ UNSTABLE EXPERIMENTS — DO NOT TOUCH WITHOUT SUPERVISION
      </div>

      <div className="os-scroll min-h-0 flex-1 divide-y divide-edge overflow-auto">
        {experiments.map((ex) => {
          const isOpen = open === ex.id;
          const isClassified = ex.classified;
          return (
            <div key={ex.id}>
              <button
                type="button"
                onClick={() => (isClassified ? attemptClassified() : setOpen(isOpen ? null : ex.id))}
                className={cn(
                  "no-tap flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-panel2",
                  isClassified && "hover:bg-danger/5",
                )}
              >
                <span className={cn("text-accent", isOpen && "rotate-90")}>›</span>
                <span className="font-mono text-[12px] font-semibold tracking-wide text-ink">{ex.codename}</span>
                <span className="micro flex-1 truncate text-faint">{ex.name}</span>
                <StatusChip status={ex.status} />
              </button>

              {isOpen && !isClassified && (
                <div className="fade-in px-3 pb-3 pl-8">
                  <p className="tiny leading-relaxed text-muted">{ex.desc}</p>
                </div>
              )}

              {isClassified && (
                <div className="fade-in px-3 pb-3 pl-8">
                  {!revealed && !decrypting && (
                    <p className="tiny leading-relaxed text-danger">
                      [ACCESS DENIED] {ex.desc}
                      <span className="ml-2 text-faint">
                        {clicks > 0 && clicks < 3
                          ? `(${3 - clicks} more attempt${3 - clicks === 1 ? "" : "s"}...)`
                          : "persist."}
                      </span>
                    </p>
                  )}
                  {decrypting && (
                    <div className="space-y-1">
                      <div className="tiny text-accent">[ DECRYPTING EXPERIMENT_31 ]</div>
                      <div className="h-1 w-48 overflow-hidden bg-panel3">
                        <div className="h-full bg-accent" style={{ animation: "bootbar 2.4s linear" }} />
                      </div>
                    </div>
                  )}
                  {revealed && (
                    <pre className="tiny overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed text-accent">
                      {classifiedSecret.lines.join("\n")}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

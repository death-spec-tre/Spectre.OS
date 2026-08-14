import { useEffect, useState } from "react";
import { APP_META } from "./apps/meta";
import { useOS } from "./OSContext";
import { cn } from "@/utils/cn";

export default function StatusBar() {
  const os = useOS();
  const [cpu, setCpu] = useState(31);
  const [ram, setRam] = useState(54);

  useEffect(() => {
    const t = setInterval(() => {
      setCpu((c) => Math.max(4, Math.min(96, c + Math.round((Math.random() - 0.5) * 26))));
      setRam((r) => Math.max(20, Math.min(94, r + Math.round((Math.random() - 0.5) * 14))));
    }, 1600);
    return () => clearInterval(t);
  }, []);

  const tabClick = (id: string, minimized: boolean) => {
    if (minimized) os.restoreWindow(id);
    else if (os.activeWindow?.id === id) os.minimizeWindow(id);
    else os.focusWindow(id);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100000] flex h-8 items-center gap-1.5 border-t border-edge bg-panel/85 px-2 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => os.openApp("terminal")}
        className="no-tap flex items-center gap-1.5 border border-edge2 bg-panel px-2 py-1 text-[11px] text-muted hover:border-accent/50 hover:text-accent"
        title="Open terminal"
      >
        <span>▣</span>
        <span className="hidden sm:inline">term</span>
      </button>

      <div className="mx-1 h-4 w-px bg-edge" />

      {/* task tabs */}
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {os.windows.length === 0 && <span className="micro px-1 text-dim">no processes running</span>}
        {os.windows.map((w) => {
          const m = APP_META[w.appId];
          const active = !w.minimized && os.activeWindow?.id === w.id;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => tabClick(w.id, w.minimized)}
              className={cn(
                "no-tap flex h-[22px] max-w-[150px] items-center gap-1.5 border px-2 text-[11px] transition-colors",
                active
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : w.minimized
                    ? "border-edge bg-transparent text-faint hover:text-muted"
                    : "border-edge2 bg-panel text-muted hover:text-ink"
              )}
            >
              <span className="text-[10px]">{m?.glyph ?? "▣"}</span>
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* metrics */}
      <div className="ml-auto flex items-center gap-3 pr-1">
        <Metric label="CPU" value={cpu} />
        <Metric label="RAM" value={ram} />
        <span className="flex items-center gap-1 micro text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-dot" /> NET
        </span>
        <span className="hidden text-[10px] text-faint sm:inline">v3.7</span>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5 micro text-faint">
      <span>{label}</span>
      <span className="relative h-1.5 w-7 overflow-hidden bg-panel3">
        <span className="absolute bottom-0 left-0 top-0 bg-accent/70 transition-all duration-700" style={{ width: `${value}%` }} />
      </span>
      <span className="tabular-nums text-muted">{value}</span>
    </span>
  );
}

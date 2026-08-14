import { useEffect, useRef, useState } from "react";
import { APP_META } from "./apps/meta";
import { useOS } from "./OSContext";

const LAUNCHER_APPS = ["work", "brain", "lab", "notes", "system", "contact", "terminal", "about"];

export default function MenuBar() {
  const os = useOS();
  const [now, setNow] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const date = now.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-0 z-[100000] flex h-8 items-center gap-2 border-b border-edge bg-panel/85 px-2 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="no-tap flex items-center gap-1.5 px-1 text-ink hover:text-accent"
      >
        <span className="text-accent">◆</span>
        <span className="font-mono text-[12px] font-bold tracking-tight">SPECTRE.OS</span>
        <span className="text-[9px] text-faint">▾</span>
      </button>
      <span className="text-dim">│</span>
      <span className="label truncate text-muted">{os.activeWindow?.title ?? "DESKTOP"}</span>

      <div className="ml-auto flex items-center gap-3">
        <span className="micro text-faint">{date}</span>
        <span className="font-mono text-[12px] tabular-nums text-ink">{time}</span>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[100001]" onClick={() => setMenuOpen(false)} />
          <div className="fade-in absolute left-2 top-8 z-[100002] w-56 border border-edge2 bg-panel shadow-2xl shadow-black/60">
            <div className="border-b border-edge px-3 py-1.5">
              <span className="micro text-faint">APPLICATIONS</span>
            </div>
            <div className="grid grid-cols-1 p-1">
              {LAUNCHER_APPS.map((id) => {
                const m = APP_META[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      os.openApp(id);
                      setMenuOpen(false);
                    }}
                    className="no-tap flex items-center gap-2.5 px-2 py-1.5 text-left text-[12px] text-muted hover:bg-accent/10 hover:text-accent"
                  >
                    <span className="text-[11px]">{m.glyph}</span>
                    <span className="flex-1">{m.title}</span>
                    <span className="text-[9px] text-dim">⌘</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-edge p-1">
              <button
                type="button"
                onClick={() => {
                  os.notify("SYSTEM", "Shut down cancelled. The OS refuses to sleep.", "warn");
                  setMenuOpen(false);
                }}
                className="no-tap w-full px-2 py-1.5 text-left text-[12px] text-faint hover:text-danger"
              >
                ⏻ shut down…
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

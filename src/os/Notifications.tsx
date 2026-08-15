import { useEffect } from "react";
import { notifications as POOL } from "@/data/portfolio";
import { useOS } from "./OSContext";
import { cn } from "@/utils/cn";
const TONE: Record<
  string,
  {
    dot: string;
    label: string;
  }
> = {
  info: { dot: "bg-info", label: "text-info" },
  warn: { dot: "bg-warn", label: "text-warn" },
  accent: { dot: "bg-accent", label: "text-accent" },
};
export default function Notifications() {
  const os = useOS();
  useEffect(() => {
    let alive = true;
    let timer: number;
    const schedule = () => {
      const delay = 13000 + Math.random() * 15000;
      timer = window.setTimeout(() => {
        if (!alive) return;
        const n = POOL[Math.floor(Math.random() * POOL.length)];
        os.notify(n.title, n.body, n.tone ?? "info");
        schedule();
      }, delay);
    };
    const first = window.setTimeout(schedule, 9000);
    const t4 = window.setTimeout(
      () =>
        os.notify(
          "WARNING",
          "You've been staring at this portfolio for 4 minutes. That's probably a good sign.",
          "warn",
        ),
      240000,
    );
    return () => {
      alive = false;
      clearTimeout(timer);
      clearTimeout(first);
      clearTimeout(t4);
    };
  }, [os]);
  return (
    <div className="pointer-events-none absolute inset-x-2 top-[52px] z-[100001] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-3 sm:top-12 sm:w-72">
      {os.toasts.map((t) => {
        const tone = TONE[t.tone] ?? TONE.info;
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto w-full border border-edge2 bg-panel/95 p-2.5 shadow-2xl shadow-black/60 backdrop-blur sm:w-auto",
              t.leaving ? "toast-out" : "toast-in",
            )}
          >
            <div className="flex items-start gap-2">
              <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
              <div className="min-w-0 flex-1">
                <div className={cn("label", tone.label)}>{t.title}</div>
                <div className="mt-0.5 tiny text-ink/85">{t.body}</div>
              </div>
              <button
                type="button"
                onClick={() => os.dismissToast(t.id)}
                className="no-tap -mr-1 -mt-1 px-1 text-faint transition-colors hover:text-ink"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

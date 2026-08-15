import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Rect, Toast, ToastTone, WindowInstance } from "./types";
import { APP_META } from "./apps/meta";
import { clamp, desktopBounds, topBarHeight, bottomBarHeight } from "./layout";
import { isMobileViewport } from "./useIsMobile";
interface OpenOpts {
  title?: string;
  w?: number;
  h?: number;
  payload?: unknown;
}
interface OSContextValue {
  windows: WindowInstance[];
  toasts: Toast[];
  exiting: Record<string, "closing" | "minimizing">;
  openApp: (appId: string, payload?: unknown, opts?: OpenOpts) => void;
  closeWindow: (id: string) => void;
  requestClose: (id: string) => void;
  requestMinimize: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  patchWindow: (id: string, patch: Partial<WindowInstance>) => void;
  notify: (title: string, body: string, tone?: ToastTone) => void;
  dismissToast: (id: string) => void;
  activeWindow: WindowInstance | null;
}
const OSContext = createContext<OSContextValue | null>(null);
let toastSeq = 0;
function computeCascade(index: number, w: number, h: number): Rect {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 720;
  const top = topBarHeight();
  const bottom = bottomBarHeight();
  if (isMobileViewport()) {
    const margin = 6;
    return {
      x: margin,
      y: top + margin,
      w: vw - margin * 2,
      h: vh - top - bottom - margin * 2,
    };
  }
  const fw = Math.min(w, vw - 40);
  const fh = Math.min(h, vh - top - bottom - 24);
  const step = 30;
  const off = (index % 6) * step;
  const x = clamp(Math.round((vw - fw) / 2 + off - 80), 16, Math.max(16, vw - fw - 16));
  const y = clamp(Math.round((vh - fh) / 2 + off - 60), top + 14, Math.max(top + 14, vh - fh - bottom - 14));
  return { x, y, w: fw, h: fh };
}
export function OSProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exiting, setExiting] = useState<Record<string, "closing" | "minimizing">>({});
  const zRef = useRef(10);
  const openApp = useCallback((appId: string, payload?: unknown, opts?: OpenOpts) => {
    const meta = APP_META[appId];
    if (!meta) return;
    const title = opts?.title ?? meta.title;
    const w = opts?.w ?? meta.w;
    const h = opts?.h ?? meta.h;
    setWindows((prev) => {
      if (meta.singleton) {
        const existing = prev.find((win) => win.appId === appId);
        if (existing) {
          const z = (zRef.current += 1);
          return prev.map((win) =>
            win.id === existing.id
              ? {
                  ...win,
                  minimized: false,
                  z,
                  title,
                  payload: payload ?? win.payload,
                }
              : win,
          );
        }
      }
      const z = (zRef.current += 1);
      const id = `${appId}-${Math.random().toString(36).slice(2, 8)}`;
      const pos = computeCascade(prev.length, w, h);
      const inst: WindowInstance = {
        id,
        appId,
        title,
        payload: payload ?? opts?.payload,
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
        z,
        minimized: false,
        maximized: false,
      };
      return [...prev, inst];
    });
  }, []);
  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setExiting((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);
  const requestClose = useCallback(
    (id: string) => {
      setExiting((prev) => ({ ...prev, [id]: "closing" }));
      window.setTimeout(() => closeWindow(id), 130);
    },
    [closeWindow],
  );
  const focusWindow = useCallback((id: string) => {
    const z = (zRef.current += 1);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);
  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setExiting((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);
  const requestMinimize = useCallback(
    (id: string) => {
      setExiting((prev) => ({ ...prev, [id]: "minimizing" }));
      window.setTimeout(() => minimizeWindow(id), 160);
    },
    [minimizeWindow],
  );
  const restoreWindow = useCallback((id: string) => {
    const z = (zRef.current += 1);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: false, z } : w)));
  }, []);
  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.minimized) {
          const z = (zRef.current += 1);
          return { ...w, minimized: false, z };
        }
        return { ...w, minimized: true };
      }),
    );
  }, []);
  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const r = w.prevRect ?? { x: w.x, y: w.y, w: w.w, h: w.h };
          return { ...w, maximized: false, ...r };
        }
        const b = desktopBounds();
        return {
          ...w,
          maximized: true,
          prevRect: { x: w.x, y: w.y, w: w.w, h: w.h },
          x: b.x,
          y: b.y,
          w: b.w,
          h: b.h,
        };
      }),
    );
  }, []);
  const patchWindow = useCallback((id: string, patch: Partial<WindowInstance>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 160);
  }, []);
  const notify = useCallback((title: string, body: string, tone: ToastTone = "info") => {
    const id = `t-${toastSeq++}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, body, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 160);
    }, 7000);
  }, []);
  const activeWindow = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (!visible.length) return null;
    return visible.reduce((a, b) => (a.z >= b.z ? a : b));
  }, [windows]);
  const value = useMemo<OSContextValue>(
    () => ({
      windows,
      toasts,
      exiting,
      openApp,
      closeWindow,
      requestClose,
      requestMinimize,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMinimize,
      toggleMaximize,
      patchWindow,
      notify,
      dismissToast,
      activeWindow,
    }),
    [
      windows,
      toasts,
      exiting,
      openApp,
      closeWindow,
      requestClose,
      requestMinimize,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMinimize,
      toggleMaximize,
      patchWindow,
      notify,
      dismissToast,
      activeWindow,
    ],
  );
  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}
export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}

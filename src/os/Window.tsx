import { useCallback, useRef, useState, type ReactNode } from "react";
import { useOS } from "./OSContext";
import type { WindowInstance } from "./types";
import { APP_META } from "./apps/meta";
import { clamp, desktopBounds } from "./layout";
import { useIsMobile } from "./useIsMobile";
import { cn } from "@/utils/cn";

type SnapHint = "left" | "right" | "max" | null;
type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_W = 340;
const MIN_H = 210;
const MIN_W_MOBILE = 240;
const MIN_H_MOBILE = 180;

function snapRect(kind: "left" | "right") {
  const b = desktopBounds();
  const half = Math.round(b.w / 2);
  if (kind === "left") return { x: b.x, y: b.y, w: half, h: b.h };
  return { x: b.x + half, y: b.y, w: b.w - half, h: b.h };
}

function resizeRect(
  start: WindowInstance,
  dir: Dir,
  dx: number,
  dy: number,
  minW: number,
  minH: number
) {
  let { x, y, w, h } = start;
  if (dir.includes("e")) w = start.w + dx;
  if (dir.includes("s")) h = start.h + dy;
  if (dir.includes("w")) {
    w = start.w - dx;
    x = start.x + dx;
  }
  if (dir.includes("n")) {
    h = start.h - dy;
    y = start.y + dy;
  }
  if (w < minW) {
    if (dir.includes("w")) x = start.x + (start.w - minW);
    w = minW;
  }
  if (h < minH) {
    if (dir.includes("n")) y = start.y + (start.h - minH);
    h = minH;
  }
  return { x, y, w, h };
}

const HANDLES: { dir: Dir; cls: string; cursor: string }[] = [
  { dir: "n", cls: "top-0 left-2 right-2 h-1.5", cursor: "ns-resize" },
  { dir: "s", cls: "bottom-0 left-2 right-2 h-1.5", cursor: "ns-resize" },
  { dir: "e", cls: "right-0 top-2 bottom-2 w-1.5", cursor: "ew-resize" },
  { dir: "w", cls: "left-0 top-2 bottom-2 w-1.5", cursor: "ew-resize" },
  { dir: "ne", cls: "top-0 right-0 h-3 w-3", cursor: "nesw-resize" },
  { dir: "nw", cls: "top-0 left-0 h-3 w-3", cursor: "nwse-resize" },
  { dir: "se", cls: "bottom-0 right-0 h-3 w-3", cursor: "nwse-resize" },
  { dir: "sw", cls: "bottom-0 left-0 h-3 w-3", cursor: "nesw-resize" },
];

export default function Window({ win, children }: { win: WindowInstance; children: ReactNode }) {
  const os = useOS();
  const isMobile = useIsMobile();
  const [snapHint, setSnapHint] = useState<SnapHint>(null);
  const dragging = useRef(false);
  const meta = APP_META[win.appId];
  const resizable = meta?.resizable && !win.maximized && !isMobile;
  const minW = isMobile ? MIN_W_MOBILE : MIN_W;
  const minH = isMobile ? MIN_H_MOBILE : MIN_H;

  const onFocus = useCallback(() => {
    if (!os.activeWindow || os.activeWindow.id !== win.id) os.focusWindow(win.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [os.activeWindow, win.id]);

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      onFocus();

      const b = desktopBounds();
      let originX = win.x;
      let originY = win.y;

      if (win.maximized || win.snapped) {
        const mw = Math.min(meta?.w ?? win.w, b.w - 40);
        const mh = Math.min(meta?.h ?? win.h, b.h - 40);
        const ratio = (e.clientX - win.x) / Math.max(1, win.w);
        originX = clamp(e.clientX - ratio * mw, b.x, b.x + b.w - mw);
        originY = Math.max(b.y, e.clientY - 14);
        os.patchWindow(win.id, {
          maximized: false,
          snapped: null,
          x: originX,
          y: originY,
          w: mw,
          h: mh,
        });
      }

      const startX = e.clientX;
      const startY = e.clientY;
      dragging.current = true;
      document.body.style.userSelect = "none";

      const move = (ev: PointerEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let hint: SnapHint = null;
        const m = 7;
        if (ev.clientY <= b.y + m) hint = "max";
        else if (!isMobile && ev.clientX <= b.x + m) hint = "left";
        else if (!isMobile && ev.clientX >= b.x + b.w - m) hint = "right";
        setSnapHint(hint);

        const nx = originX + dx;
        const ny = originY + dy;
        os.patchWindow(win.id, {
          x: clamp(nx, b.x - (win.w - 120), b.x + b.w - 120),
          y: clamp(ny, b.y, b.y + b.h - 36),
          snapped: null,
        });
      };

      const up = () => {
        dragging.current = false;
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        setSnapHint((h) => {
          if (h === "max") os.toggleMaximize(win.id);
          else if (h === "left" || h === "right") os.patchWindow(win.id, { ...snapRect(h), snapped: h });
          return null;
        });
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [win, meta, os, onFocus, isMobile]
  );

  const onResizeStart = useCallback(
    (dir: Dir) => (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.stopPropagation();
      onFocus();
      const startX = e.clientX;
      const startY = e.clientY;
      const start = { ...win };
      document.body.style.userSelect = "none";

      const move = (ev: PointerEvent) => {
        const r = resizeRect(start, dir, ev.clientX - startX, ev.clientY - startY, minW, minH);
        os.patchWindow(win.id, r);
      };
      const up = () => {
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [win, os, onFocus, minW, minH]
  );

  if (win.minimized) return null;

  const active = os.activeWindow?.id === win.id;

  return (
    <>
      {snapHint && snapHint !== "max" && (
        <div
          className="pointer-events-none fixed z-[5] border border-white/70 bg-white/5 transition-all duration-75"
          style={{
            left: snapRect(snapHint).x,
            top: snapRect(snapHint).y,
            width: snapRect(snapHint).w,
            height: snapRect(snapHint).h,
            clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        />
      )}
      {snapHint === "max" && (
        <div
          className="pointer-events-none fixed z-[5] border border-white/70 bg-white/5 transition-all duration-75"
          style={{
            left: desktopBounds().x,
            top: desktopBounds().y,
            width: desktopBounds().w,
            height: desktopBounds().h,
            clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        />
      )}

      <div
        className={cn(
          "win-in os-skin absolute flex flex-col overflow-hidden border bg-[#07080b]/95 text-ink backdrop-blur-[2px]",
          active ? "border-white/30" : "border-edge2/90"
        )}
        style={{
          left: win.x,
          top: win.y,
          width: win.w,
          height: win.h,
          zIndex: win.z,
          clipPath: win.maximized
            ? "none"
            : isMobile
              ? "polygon(9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px), 0 9px)"
              : "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
          boxShadow: active
            ? "0 18px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 14px 36px rgba(0,0,0,0.42)",
        }}
        onPointerDownCapture={onFocus}
      >
        <div className="pointer-events-none absolute inset-0 border border-white/[0.03]" />

        <div
          className={cn(
            "no-tap flex shrink-0 items-center gap-2 border-b px-3 font-mono sm:h-11 sm:gap-3 sm:px-4",
            isMobile ? "h-12" : "h-11",
            active ? "border-edge3/80 bg-white/[0.02]" : "border-edge/80 bg-black/20"
          )}
          onPointerDown={onDragStart}
          onDoubleClick={() => os.toggleMaximize(win.id)}
        >
          <span className="text-[16px] text-ink sm:text-[19px]">›_</span>
          <span className="truncate text-[13px] tracking-[0.1em] text-ink sm:text-[18px] sm:tracking-[0.12em]">
            {win.title}
          </span>
          <div className="ml-auto flex items-center gap-3 sm:gap-5" data-no-drag>
            <CtrlBtn label="Minimize" mobile={isMobile} onClick={() => os.minimizeWindow(win.id)}>─</CtrlBtn>
            <CtrlBtn label="Maximize" mobile={isMobile} onClick={() => os.toggleMaximize(win.id)}>□</CtrlBtn>
            <CtrlBtn label="Close" danger mobile={isMobile} onClick={() => os.closeWindow(win.id)}>✕</CtrlBtn>
          </div>
        </div>

        <div className="os-scroll relative min-h-0 flex-1 overflow-auto bg-[#050609]/75">{children}</div>

        {resizable &&
          HANDLES.map((h) => (
            <div
              key={h.dir}
              data-no-drag
              onPointerDown={onResizeStart(h.dir)}
              className={cn("absolute z-10", h.cls)}
              style={{ cursor: h.cursor }}
            />
          ))}
      </div>
    </>
  );
}

function CtrlBtn({
  children,
  onClick,
  label,
  danger,
  mobile,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
  mobile?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "flex items-center justify-center px-0.5 font-mono text-ink/85 transition-colors",
        mobile ? "h-9 min-w-9 text-[20px]" : "h-7 min-w-5 text-[19px]",
        danger ? "hover:text-danger" : "hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

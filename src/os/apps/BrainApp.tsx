import { useEffect, useRef, useState } from "react";
import { skillEdges, skills, type Skill } from "@/data/portfolio";
import { AppHeader, type AppProps } from "@/os/ui";
import { cn } from "@/utils/cn";
interface PNode extends Skill {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
}
function initNodes(w: number, h: number): PNode[] {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 70;
  return skills.map((s, i) => {
    const a = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...s,
      x: cx + Math.cos(a) * R,
      y: cy + Math.sin(a) * R,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
    };
  });
}
function step(
  nodes: PNode[],
  size: {
    w: number;
    h: number;
  },
  dragId: string | null,
): PNode[] {
  const cx = size.w / 2;
  const cy = size.h / 2;
  const next = nodes.map((n) => ({ ...n, ax: 0, ay: 0 }));
  const idx = new Map(next.map((n, i) => [n.id, i]));
  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      let dx = next[i].x - next[j].x;
      let dy = next[i].y - next[j].y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) d2 = 1;
      const d = Math.sqrt(d2);
      const f = 5400 / d2;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      next[i].ax += fx;
      next[i].ay += fy;
      next[j].ax -= fx;
      next[j].ay -= fy;
    }
  }
  for (const [a, b] of skillEdges) {
    const ia = idx.get(a);
    const ib = idx.get(b);
    if (ia == null || ib == null) continue;
    const na = next[ia];
    const nb = next[ib];
    const dx = nb.x - na.x;
    const dy = nb.y - na.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const rest = 132;
    const f = (d - rest) * 0.02;
    const fx = (dx / d) * f;
    const fy = (dy / d) * f;
    na.ax += fx;
    na.ay += fy;
    nb.ax -= fx;
    nb.ay -= fy;
  }
  const pad = 44;
  for (const n of next) {
    if (dragId && n.id === dragId) {
      n.vx = 0;
      n.vy = 0;
      continue;
    }
    n.ax += (cx - n.x) * 0.012;
    n.ay += (cy - n.y) * 0.012;
    n.vx = (n.vx + n.ax) * 0.85;
    n.vy = (n.vy + n.ay) * 0.85;
    const sp = Math.hypot(n.vx, n.vy);
    const max = 11;
    if (sp > max) {
      n.vx = (n.vx / sp) * max;
      n.vy = (n.vy / sp) * max;
    }
    n.x += n.vx;
    n.y += n.vy;
    n.x = Math.max(pad, Math.min(size.w - pad, n.x));
    n.y = Math.max(pad, Math.min(size.h - pad, n.y));
  }
  return next;
}
const GROUP_LABEL: Record<Skill["group"], string> = {
  core: "CORE",
  jvm: "JVM / MINECRAFT",
  web: "WEB",
  infra: "INFRA / TOOLS",
};
export default function BrainApp(_: AppProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 560, h: 380 });
  const [nodes, setNodes] = useState<PNode[]>(() => initNodes(560, 380));
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>("java");
  const dragRef = useRef<string | null>(null);
  const moveRef = useRef(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setNodes((prev) => step(prev, size, dragRef.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size]);
  const focusId = hover ?? sel;
  const neighbors = new Set<string>();
  if (focusId) {
    for (const [a, b] of skillEdges) {
      if (a === focusId) neighbors.add(b);
      if (b === focusId) neighbors.add(a);
    }
  }
  const localPos = (clientX: number, clientY: number) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };
  const onNodeDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    moveRef.current = false;
    dragRef.current = id;
    const { x, y } = localPos(e.clientX, e.clientY);
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y, vx: 0, vy: 0 } : n)));
    const move = (ev: PointerEvent) => {
      const { x: nx, y: ny } = localPos(ev.clientX, ev.clientY);
      moveRef.current = true;
      setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x: nx, y: ny, vx: 0, vy: 0 } : n)));
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (!moveRef.current) setSel(id);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const selected = nodes.find((n) => n.id === sel) ?? null;
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        path="/SYS/BRAIN/knowledge.graph"
        right={
          <span className="micro text-faint">
            {skills.length} nodes · {skillEdges.length} edges
          </span>
        }
      />
      <div className="flex min-h-0 flex-1">
        <div
          ref={wrapRef}
          className="relative min-w-0 flex-1 select-none overflow-hidden desktop-grid"
          style={{ cursor: "grab" }}
        >
          <svg className="pointer-events-none absolute inset-0" width={size.w} height={size.h}>
            {skillEdges.map(([a, b], i) => {
              const na = nodes.find((n) => n.id === a);
              const nb = nodes.find((n) => n.id === b);
              if (!na || !nb) return null;
              const lit = focusId && (a === focusId || b === focusId);
              return (
                <line
                  key={i}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={lit ? "#7cffb2" : "#2e2e35"}
                  strokeWidth={lit ? 1.4 : 1}
                  strokeOpacity={lit ? 0.8 : 0.7}
                />
              );
            })}
          </svg>

          {nodes.map((n) => {
            const isFocus = focusId === n.id;
            const isNeighbor = neighbors.has(n.id);
            return (
              <div
                key={n.id}
                onPointerDown={(e) => onNodeDown(e, n.id)}
                onPointerEnter={() => setHover(n.id)}
                onPointerLeave={() => setHover(null)}
                className="no-tap absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-[3px] border px-2 py-1 text-[11px] font-medium tracking-wide transition-colors"
                style={{ left: n.x, top: n.y }}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-[3px] border transition-all",
                    isFocus
                      ? "border-accent bg-accent/10"
                      : isNeighbor
                        ? "border-edge3 bg-panel2"
                        : "border-edge bg-panel/80",
                  )}
                  style={isFocus ? { boxShadow: "0 0 0 3px rgba(124,255,178,0.12)" } : undefined}
                />
                <span
                  className={cn(
                    "relative block whitespace-nowrap",
                    isFocus ? "text-accent" : isNeighbor ? "text-ink" : hover ? "text-faint" : "text-muted",
                  )}
                >
                  {n.label}
                </span>
              </div>
            );
          })}

          <div className="pointer-events-none absolute bottom-2 left-2 micro text-faint">
            ▸ drag nodes · click to inspect
          </div>
        </div>

        <aside className="w-[132px] shrink-0 overflow-auto border-l border-edge bg-panel/40 p-2.5 sm:w-60 sm:p-4 os-scroll">
          {selected ? (
            <div className="fade-in">
              <div className="micro text-accent">// SKILL_NODE</div>
              <h3 className="mt-1 font-mono text-lg font-bold text-ink">{selected.label}</h3>
              <div className="micro mt-0.5 text-faint">{GROUP_LABEL[selected.group]}</div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between micro text-faint">
                  <span>PROFICIENCY</span>
                  <span className="text-accent">{selected.level}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-panel3">
                  <div className="h-full bg-accent transition-all" style={{ width: `${selected.level}%` }} />
                </div>
              </div>

              <div className="mt-4">
                <LeaderRowLite k="YEARS" v={`${selected.years}`} />
              </div>

              <p className="mt-4 tiny leading-relaxed text-muted">{selected.blurb}</p>

              <div className="mt-5 border-t border-edge pt-3">
                <div className="micro mb-2 text-faint">CONNECTED TO</div>
                <div className="flex flex-wrap gap-1">
                  {[...neighbors].map((nid) => {
                    const nn = skills.find((s) => s.id === nid);
                    if (!nn) return null;
                    return (
                      <button
                        key={nid}
                        type="button"
                        onClick={() => setSel(nid)}
                        className="no-tap border border-edge2 bg-panel px-1.5 py-0.5 text-[10px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        {nn.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="tiny text-faint">Select a node.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
function LeaderRowLite({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="micro text-faint">{k}</span>
      <span className="h-px flex-1 translate-y-[-2px] border-b border-dotted border-edge2" />
      <span className="micro text-ink">{v}</span>
    </div>
  );
}

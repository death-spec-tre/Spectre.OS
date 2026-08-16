import { useOS } from "@/os/OSContext";
import { AppHeader, type AppProps } from "@/os/ui";
export default function AboutApp(_: AppProps) {
  const os = useOS();
  return (
    <div className="flex h-full flex-col">
      <AppHeader path="/HOME/SPECTRE/README.txt" right={<span className="micro text-faint">read-only</span>} />
      <div className="os-scroll min-h-0 flex-1 overflow-auto p-5 font-mono text-[13px] leading-relaxed">
        <div className="text-accent">// SPECTRE.OS — README</div>
        <h2 className="mt-2 text-xl font-bold text-ink">You are currently running SPECTRE.OS.</h2>
        <p className="mt-2 text-muted">
          This is not a website. It is a small operating system that happens to be a portfolio. You are logged in as{" "}
          <span className="text-ink">guest</span>. Everything you'd expect from an OS is here — and all of it is about
          one engineer.
        </p>

        <div className="mt-5 micro text-faint">QUICK START</div>
        <ul className="mt-1 space-y-1 text-ink/90">
          <li>
            <span className="text-accent">▸ WORK</span> — browse the projects, open a case study.
          </li>
          <li>
            <span className="text-accent">▸ BRAIN</span> — drag the skill graph around.
          </li>
          <li>
            <span className="text-accent">▸ LAB</span> — experiments. one is classified.
          </li>
          <li>
            <span className="text-accent">▸ CHANGELOG</span> — what's actually shipped, as it ships.
          </li>
          <li>
            <span className="text-accent">▸ TERMINAL</span> — type <span className="text-ink">help</span>. try{" "}
            <span className="text-ink">sudo hire-spectre</span>.
          </li>
        </ul>

        <div className="mt-5 micro text-faint">WINDOW CONTROLS</div>
        <p className="mt-1 text-ink/90">
          Drag title bars to move. Drag edges to resize. Double-click a title to maximise. Drop a window near a screen
          edge to snap it. Use the bottom bar to switch between apps.
        </p>

        <div className="mt-5 micro text-faint">BUILT WITH</div>
        <p className="mt-1 text-ink/90">
          React · TypeScript · Tailwind · zero UI frameworks. Every window, cursor and pixel is hand-rolled.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => os.openApp("terminal")}
            className="no-tap border border-accent/50 bg-accent/10 px-3 py-1 text-[12px] text-accent transition-colors hover:bg-accent/20"
          >
            ▸ open terminal
          </button>
          <button
            onClick={() => os.openApp("work")}
            className="no-tap border border-edge2 bg-panel px-3 py-1 text-[12px] text-muted transition-colors hover:text-ink"
          >
            ▸ view work
          </button>
        </div>

        <div className="mt-6 border-t border-dashed border-edge pt-3 micro text-faint">
          SPECTRE.OS v1.3 · bugs: unknown (featuring)
        </div>
      </div>
    </div>
  );
}

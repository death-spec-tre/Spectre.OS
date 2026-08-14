import { useEffect, useState } from "react";

const BOOT_LOG = [
  "SPECTRE BIOS v3.7 — (c) Death Spectre Systems",
  "CPU ......... HUMAN-1.0 @ ∞GHz ......... OK",
  "MEMORY TEST .. 65536K ................... OK",
  "DETECTING DRIVES ........................ OK",
  "MOUNTING /home/spectre .................. OK",
  "LOADING KERNEL MODULES .................. OK",
  "STARTING WINDOW MANAGER ................. OK",
];

type Stage = "logs" | "boot" | "done";

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [stage, setStage] = useState<Stage>("logs");
  const [progress, setProgress] = useState(0);

  const skip = () => onDone();

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= BOOT_LOG.length) {
        clearInterval(t);
        window.setTimeout(() => setStage("boot"), 380);
      }
    }, 150);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (stage !== "boot") return;
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 17 + 7;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        window.setTimeout(() => setStage("done"), 500);
      }
      setProgress(p);
    }, 130);
    return () => clearInterval(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "done") return;
    const t = window.setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [stage, onDone]);

  useEffect(() => {
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filled = Math.round(progress / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);

  return (
    <div
      onPointerDown={skip}
      className={`scanlines os-skin fixed inset-0 z-[200000] flex flex-col items-center justify-center overflow-hidden bg-void px-4 ${
        stage === "done" ? "opacity-0 transition-opacity duration-500" : ""
      }`}
    >
      {/* BIOS log */}
      {stage === "logs" && (
        <div className="fade-in w-full max-w-xl font-mono text-[12px] leading-relaxed text-accent/80">
          {BOOT_LOG.slice(0, revealed).map((l, i) => (
            <div key={i} className="whitespace-pre">
              {l}
            </div>
          ))}
          <span className="inline-block h-3 w-2 translate-y-[2px] bg-accent blink" />
        </div>
      )}

      {/* Boot panel */}
      {stage !== "logs" && (
        <div className="fade-in flex w-full max-w-md flex-col items-center text-center">
          <div className="mb-6 font-mono text-[13px] tracking-[0.3em] text-dim">SPECTRE.OS</div>
          <h1 className="flicker font-mono text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            SPECTRE<span className="text-accent">.OS</span>
          </h1>
          <div className="mt-1 font-mono text-[11px] tracking-[0.25em] text-faint">v3.7</div>

          <div className="mt-8 w-full font-mono text-[12px] text-muted">Initializing...</div>
          <div className="mt-2 w-full select-none font-mono text-[15px] tracking-tight text-accent">
            [{bar}]
          </div>
          <div className="mt-1 w-full text-right font-mono text-[12px] tabular-nums text-muted">
            {Math.round(progress)}%
          </div>

          {stage === "done" && (
            <div className="fade-in mt-8 space-y-1 font-mono">
              <div className="text-[13px] font-semibold tracking-[0.2em] text-accent">
                ▣ USER DETECTED
              </div>
              <div className="text-[18px] font-bold tracking-tight text-ink">
                Welcome<span className="blink text-accent">_</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="absolute bottom-5 font-mono text-[10px] tracking-widest text-dim">
        press any key to skip
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useOS } from "./OSContext";
import { APP_META } from "./apps/meta";
import { SPECTRE_TERMINAL_ART } from "@/data/spectreLogo";
import { SPECTRE_LOGO_IMAGE } from "@/data/spectreLogoImage";
import { skills } from "@/data/portfolio";
import { cn } from "@/utils/cn";
const MODULES = [
  { id: "work", label: "WORK", icon: <FolderIcon /> },
  { id: "brain", label: "BRAIN", icon: <BrainIcon /> },
  { id: "lab", label: "LAB", icon: <FlaskIcon /> },
  { id: "notes", label: "CHANGELOG", icon: <DocIcon /> },
  { id: "system", label: "SYSTEM", icon: <GearIcon /> },
  { id: "contact", label: "CONTACT", icon: <ContactIcon /> },
  { id: "terminal", label: "TERMINAL", icon: <TerminalIcon /> },
  { id: "about", label: "README.txt", icon: <ReadmeIcon /> },
] as const;
export default function SystemShell() {
  const os = useOS();
  const [now, setNow] = useState(new Date());
  const [cpu, setCpu] = useState(9);
  const [ram, setRam] = useState(77);
  const [focus, setFocus] = useState<string>("work");
  const [showTerminal, setShowTerminal] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const m = setInterval(() => {
      setCpu((c) => Math.max(3, Math.min(24, c + Math.round((Math.random() - 0.5) * 7))));
      setRam((r) => Math.max(61, Math.min(88, r + Math.round((Math.random() - 0.5) * 5))));
    }, 1700);
    return () => {
      clearInterval(t);
      clearInterval(m);
    };
  }, []);
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const timeShort = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "2-digit" }).toUpperCase();
  const openModule = (id: string) => {
    setFocus(id);
    os.openApp(id);
  };
  const openWindows = useMemo(
    () =>
      os.windows
        .slice()
        .sort((a, b) => b.z - a.z)
        .map((w) => ({
          id: w.id,
          appId: w.appId,
          title: w.title,
          minimized: w.minimized,
          active: !w.minimized && os.activeWindow?.id === w.id,
        })),
    [os.windows, os.activeWindow],
  );
  const handleAppTab = (id: string, minimized: boolean, active: boolean) => {
    if (minimized) os.restoreWindow(id);
    else if (active) os.requestMinimize(id);
    else os.focusWindow(id);
  };
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="os-frame h-full w-full">
        <header className="shell-topbar pointer-events-auto absolute inset-x-0 top-0 z-10 flex h-11 items-center gap-2 px-2 sm:px-5">
          <button
            type="button"
            onClick={() => openModule("about")}
            className="no-tap flex min-w-0 shrink items-center gap-1.5 text-ink transition-colors hover:text-white sm:gap-3"
          >
            <img
              src={SPECTRE_LOGO_IMAGE}
              alt="SPECTRE.OS"
              draggable={false}
              className="block h-[18px] w-[18px] shrink-0 object-contain sm:h-[22px] sm:w-[22px]"
            />
            <span className="truncate font-mono text-[10px] font-semibold tracking-[0.14em] sm:text-[12px] sm:tracking-[0.22em]">
              SPECTRE.OS
            </span>
          </button>

          <span className="hidden font-mono text-[14px] text-white/45 xs:inline sm:mx-3">/</span>
          <span className="hidden truncate font-mono text-[12px] tracking-[0.24em] text-muted xs:inline">DESKTOP</span>

          <div className="ml-auto flex h-full shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => openModule("terminal")}
              className="shell-icon-btn text-[11px] sm:text-[13px]"
              title="Open terminal"
              aria-label="Open terminal"
            >
              &gt;_
            </button>
            <button
              type="button"
              onClick={() => os.notify("AUDIO", "Sound device unavailable in browser sandbox.", "info")}
              className="hidden shell-icon-btn text-[13px] sm:inline-flex"
              title="Audio status"
              aria-label="Audio status"
            >
              ◁))
            </button>
            <button
              type="button"
              onClick={() => os.notify("NETWORK", "Connection stable. Portfolio packets flowing.", "info")}
              className="hidden shell-icon-btn text-[13px] sm:inline-flex"
              title="Network status"
              aria-label="Network status"
            >
              ≋
            </button>
            <span className="mx-1 hidden h-5 w-px bg-white/12 sm:block" />
            <span className="hidden font-mono text-[10.5px] tracking-[0.14em] text-muted sm:inline">{date}</span>

            <span className="font-mono text-[11px] font-semibold tabular-nums tracking-[0.04em] text-ink sm:hidden">
              {timeShort}
            </span>
            <span className="hidden font-mono text-[13px] font-semibold tabular-nums tracking-[0.06em] text-ink sm:inline">
              {time}
            </span>
          </div>
        </header>

        <aside className="shell-side-clip pointer-events-auto absolute left-4 top-14 z-10 hidden w-[136px] px-3 py-3 md:block">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => openModule(mod.id)}
                title={`Open ${mod.label}`}
                className="no-tap group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "shell-appicon flex h-[42px] w-[42px] items-center justify-center text-ink/85 transition-all group-hover:border-white/35 group-hover:text-white",
                    focus === mod.id && "shell-appicon-active text-white",
                  )}
                >
                  {mod.icon}
                </span>
                <span
                  className={cn(
                    "font-mono text-[8.5px] tracking-[0.08em] text-muted transition-colors group-hover:text-ink",
                    focus === mod.id && "text-ink",
                  )}
                >
                  {mod.label}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <main className="pointer-events-none absolute inset-x-4 bottom-[124px] top-[52px] flex flex-col items-center justify-center xs:inset-x-6 sm:inset-x-10 md:inset-x-[170px] md:bottom-[76px]">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
            <div className="shell-mark-wrap shrink-0 text-white">
              <img
                src={SPECTRE_LOGO_IMAGE}
                alt="SPECTRE.OS mark"
                className="block h-full w-full object-contain"
                draggable={false}
              />
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <div className="shell-hero-title font-mono font-medium text-white/95">SPECTRE.OS</div>
              <div className="mt-3 flex w-full items-center justify-center gap-3 sm:justify-start">
                <span className="hidden h-px w-6 bg-white/45 sm:block sm:w-10" />
                <span className="shell-hero-sub whitespace-nowrap font-mono text-muted">TERMINAL FOR IDEAS</span>
              </div>
            </div>
          </div>

          <TaglineRow />
        </main>

        <section className="shell-note-clip pointer-events-auto absolute bottom-[92px] left-[112px] hidden w-[268px] px-4 py-3.5 lg:block">
          <div className="flex items-center gap-4">
            <div className="h-9 w-px bg-white/80" />
            <div>
              <div className="font-mono text-[12px] tracking-[0.2em] text-ink">BUILD. TEST. CREATE.</div>
              <div className="mt-1.5 font-mono text-[9px] tracking-[0.2em] text-faint">A DEVELOPER'S WORKSPACE.</div>
            </div>
          </div>
        </section>

        {showTerminal ? (
          <TerminalPreview openTerminal={() => openModule("terminal")} hide={() => setShowTerminal(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setShowTerminal(true)}
            className="shell-widget-clip pointer-events-auto absolute right-4 top-14 z-10 hidden px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-muted transition-colors hover:text-ink xl:block"
          >
            RESTORE TERMINAL
          </button>
        )}

        <StatusWidget onContact={() => openModule("contact")} />

        <nav className="shell-dock pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex flex-col md:hidden">
          <div className="os-scroll flex items-center gap-4 overflow-x-auto px-4 pb-2 pt-2.5">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => openModule(mod.id)}
                title={`Open ${mod.label}`}
                className="no-tap flex shrink-0 flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "shell-appicon flex h-11 w-11 items-center justify-center text-ink/85 transition-all",
                    focus === mod.id && "shell-appicon-active text-white",
                  )}
                >
                  {mod.icon}
                </span>
                <span
                  className={cn("font-mono text-[8px] tracking-[0.06em] text-muted", focus === mod.id && "text-ink")}
                >
                  {mod.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/[0.06] px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5">
            <div className="os-scroll flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
              {openWindows.length === 0 ? (
                <span className="font-mono text-[9px] tracking-[0.12em] text-faint">NO PROCESSES RUNNING</span>
              ) : (
                openWindows.map((w) => {
                  const meta = APP_META[w.appId];
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleAppTab(w.id, w.minimized, w.active)}
                      className={cn(
                        "no-tap taskbar-in flex h-6 max-w-[130px] shrink-0 items-center gap-1.5 border px-2 font-mono text-[9.5px] tracking-[0.06em] transition-colors",
                        w.active
                          ? "border-white/45 bg-white/[0.08] text-ink"
                          : w.minimized
                            ? "border-white/10 bg-transparent text-faint"
                            : "border-white/[0.14] bg-white/[0.02] text-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1 w-1 shrink-0 rounded-full",
                          w.active ? "bg-white/90" : w.minimized ? "bg-white/25" : "bg-white/55",
                        )}
                      />
                      <span className="truncate uppercase">{meta?.title ?? w.title}</span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <MiniStat label="CPU" value={cpu} />
              <MiniStat label="RAM" value={ram} />
            </div>
          </div>
        </nav>

        <footer className="shell-bottombar pointer-events-auto absolute inset-x-0 bottom-0 z-10 hidden h-14 items-center gap-3 px-5 md:flex">
          <img
            src={SPECTRE_LOGO_IMAGE}
            alt="SPECTRE.OS"
            draggable={false}
            className="block h-[22px] w-[22px] shrink-0 object-contain"
          />

          <div className="os-scroll flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
            {openWindows.length === 0 ? (
              <span className="font-mono text-[11px] tracking-[0.14em] text-faint">NO PROCESSES RUNNING</span>
            ) : (
              openWindows.map((w) => {
                const meta = APP_META[w.appId];
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleAppTab(w.id, w.minimized, w.active)}
                    className={cn(
                      "no-tap taskbar-in flex h-8 max-w-[180px] shrink-0 items-center gap-2 border px-3 font-mono text-[11px] tracking-[0.06em] transition-colors",
                      w.active
                        ? "border-white/45 bg-white/[0.08] text-ink"
                        : w.minimized
                          ? "border-white/10 bg-transparent text-faint hover:text-muted"
                          : "border-white/[0.14] bg-white/[0.02] text-muted hover:text-ink",
                    )}
                    title={meta?.title ?? w.title}
                  >
                    <span className="text-[11px]">{meta?.glyph ?? "▣"}</span>
                    <span className="truncate">{meta?.title ?? w.title}</span>
                    <span
                      className={cn(
                        "h-1 w-1 shrink-0 rounded-full",
                        w.active ? "bg-white/90" : w.minimized ? "bg-white/25" : "bg-white/55",
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>

          <div className="ml-auto flex items-end gap-0">
            <BottomStat label="CPU" value={`${cpu}%`} bar={cpu} />
            <BottomStat label="RAM" value={`${ram}%`} bar={ram} />
            <BottomStat label="NET" value="v1.3" bar={22} />
          </div>
        </footer>
      </div>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.1em] text-muted">
      <span>{label}</span>
      <span className="relative h-1 w-8 overflow-hidden bg-white/[0.08]">
        <span className="absolute inset-y-0 left-0 bg-white/70" style={{ width: `${value}%` }} />
      </span>
      <span className="text-ink tabular-nums">{value}%</span>
    </span>
  );
}
const TAGLINE: {
  icon: React.ReactNode;
  label: string;
}[] = [
  { icon: <TagPrompt />, label: "CODE" },
  { icon: <TagHammer />, label: "BUILD" },
  { icon: <TagGear />, label: "ENGINEER" },
  { icon: <TagSpark />, label: "CREATE" },
];
function TaglineRow() {
  return (
    <div className="mt-5 flex w-full max-w-[720px] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-3 font-mono text-[10px] tracking-[0.16em] text-muted sm:text-[11px] sm:tracking-[0.2em]">
      {TAGLINE.map((t, i) => (
        <span key={t.label} className="flex items-center gap-2">
          <span className="text-white/85">{t.icon}</span>
          <span>{t.label}</span>
          {i < TAGLINE.length - 1 && <span className="ml-2 text-white/25">•</span>}
        </span>
      ))}
    </div>
  );
}
function TagPrompt() {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 22 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3L8 8L3 13" />
      <path d="M11 13H16" />
    </svg>
  );
}
function TagHammer() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 3.5L20.5 9.5L17.5 12.5L11.5 6.5L14.5 3.5Z" />
      <path d="M13 8L3.5 17.5C2.7 18.3 2.7 19.6 3.5 20.4C4.3 21.2 5.6 21.2 6.4 20.4L16 11" />
    </svg>
  );
}
function TagGear() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3V5.5M12 18.5V21M21 12H18.5M5.5 12H3M18.02 5.98L16.24 7.76M7.76 16.24L5.98 18.02M18.02 18.02L16.24 16.24M7.76 7.76L5.98 5.98" />
    </svg>
  );
}
function TagSpark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3L13.6 9.4L20 11L13.6 12.6L12 19L10.4 12.6L4 11L10.4 9.4L12 3Z" />
      <path d="M19 3.5L19.6 5.5L21.5 6L19.6 6.5L19 8.5L18.4 6.5L16.5 6L18.4 5.5L19 3.5Z" />
    </svg>
  );
}
function TerminalPreview({ openTerminal, hide }: { openTerminal: () => void; hide: () => void }) {
  return (
    <section className="shell-widget-clip pointer-events-auto absolute right-4 top-14 z-10 hidden w-[352px] bg-black/45 xl:block">
      <div className="shell-window-head flex h-8 items-center px-3">
        <button
          type="button"
          onClick={openTerminal}
          className="no-tap flex items-center gap-2 transition-colors hover:text-white"
        >
          <span className="text-[12px] text-ink">&gt;_</span>
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink">TERMINAL</span>
        </button>
        <div className="ml-auto flex items-center gap-3 text-[12px] text-ink">
          <button
            type="button"
            onClick={hide}
            title="Minimize preview"
            aria-label="Minimize terminal preview"
            className="no-tap transition-colors hover:text-white"
          >
            ─
          </button>
          <button
            type="button"
            onClick={openTerminal}
            title="Open terminal"
            aria-label="Open terminal app"
            className="no-tap transition-colors hover:text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={hide}
            title="Close preview"
            aria-label="Close terminal preview"
            className="no-tap transition-colors hover:text-danger"
          >
            ✕
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={openTerminal}
        className="no-tap block w-full px-3 py-2.5 text-left font-mono text-[10.5px] leading-[1.5] text-muted transition-colors hover:bg-white/[0.02]"
      >
        <div>
          <span className="text-ink">spectre@portfolio</span>:<span className="text-faint">~$</span> neofetch
        </div>

        <div className="mt-2 os-scroll flex items-center gap-3 overflow-x-auto">
          <pre className="m-0 w-max shrink-0 whitespace-pre text-[3px] leading-[1] text-white/85">
            {SPECTRE_TERMINAL_ART}
          </pre>
          <div className="shrink-0 space-y-0.5">
            <NeoRow k="OS" v="Spectre.OS v1.3" />
            <NeoRow k="Host" v="Desktop" />
            <NeoRow k="Shell" v="zsh" />
            <NeoRow k="Theme" v="Dark Minimal" />
            <NeoRow k="Res" v="2252x1024" />
          </div>
        </div>

        <div className="mt-2">
          <span className="text-ink">spectre@portfolio</span>:<span className="text-faint">~$</span>{" "}
          <span className="blink text-ink">_</span>
        </div>
      </button>
    </section>
  );
}
function StatusWidget({ onContact }: { onContact: () => void }) {
  const topSkills = useMemo(() => [...skills].sort((a, b) => b.level - a.level).slice(0, 4), []);
  return (
    <section className="shell-widget-clip pointer-events-auto absolute bottom-[92px] right-4 z-10 hidden w-[236px] bg-black/40 xl:block">
      <div className="shell-widget-head flex h-9 items-center px-3">
        <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent pulse-dot" />
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink">OPEN TO WORK</span>
      </div>

      <div className="space-y-3 px-4 py-3">
        <p className="tiny text-muted">Freelance & full-time. Remote-first.</p>

        <div className="flex flex-wrap gap-1.5">
          {topSkills.map((s) => (
            <span
              key={s.id}
              className="border border-edge2 px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.08em] text-faint"
            >
              {s.label}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onContact}
          className="no-tap flex w-full items-center justify-between border border-edge2 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <span>sudo hire-spectre</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
function NeoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-1.5">
      <span className="text-ink">{k}:</span>
      <span className="text-muted">{v}</span>
    </div>
  );
}
function BottomStat({ label, value, bar }: { label: string; value: string; bar: number }) {
  return (
    <div className="shell-stat-clip w-[86px] px-3.5 py-1.5 font-mono">
      <div className="text-[9px] tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-0.5 text-[11px] tabular-nums text-ink">{value}</div>
      <div className="mt-1 h-[3px] bg-white/[0.07]">
        <div className="h-full bg-white/75 transition-all duration-700" style={{ width: `${bar}%` }} />
      </div>
    </div>
  );
}
function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 72 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
function FolderIcon() {
  return (
    <IconFrame>
      <path d="M13 19H51V25H58V50H13Z" />
      <path d="M13 25H58" />
    </IconFrame>
  );
}
function BrainIcon() {
  return (
    <IconFrame>
      <path d="M28 49C14 47 10 36 16 28C13 19 21 12 30 15C37 9 49 13 49 25C57 28 56 42 46 45C43 53 32 55 28 49Z" />
      <path d="M27 23C35 22 38 29 34 35" />
      <path d="M42 24C37 27 38 34 44 37" />
    </IconFrame>
  );
}
function FlaskIcon() {
  return (
    <IconFrame>
      <path d="M28 13H42" />
      <path d="M33 13V29L19 53H51L37 29V13" />
      <path d="M26 43H44" />
    </IconFrame>
  );
}
function DocIcon() {
  return (
    <IconFrame>
      <path d="M20 12H44L52 20V54H20Z" />
      <path d="M44 12V20H52" />
      <path d="M27 29H45" />
      <path d="M27 38H45" />
      <path d="M27 47H39" />
    </IconFrame>
  );
}
function GearIcon() {
  return (
    <IconFrame>
      <path d="M36 18V12M36 58V52M18 36H12M60 36H54M23 23L19 19M53 53L49 49M49 23L53 19M19 53L23 49" />
      <circle cx="36" cy="36" r="14" />
      <circle cx="36" cy="36" r="6" />
    </IconFrame>
  );
}
function ContactIcon() {
  return (
    <IconFrame>
      <circle cx="29" cy="25" r="7" />
      <path d="M15 53C17 42 23 37 29 37C35 37 41 42 43 53" />
      <circle cx="47" cy="29" r="5" />
      <path d="M42 43C47 42 52 45 55 53" />
    </IconFrame>
  );
}
function TerminalIcon() {
  return (
    <IconFrame>
      <path d="M13 17H59V53H13Z" />
      <path d="M22 29L30 36L22 43" />
      <path d="M35 44H48" />
    </IconFrame>
  );
}
function ReadmeIcon() {
  return (
    <IconFrame>
      <path d="M20 12H44L52 20V54H20Z" />
      <path d="M44 12V20H52" />
      <path d="M27 28H45" />
      <path d="M27 36H45" />
      <path d="M27 44H39" />
    </IconFrame>
  );
}

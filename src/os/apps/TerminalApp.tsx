import { useEffect, useRef, useState } from "react";
import { APP_META } from "@/os/apps/meta";
import { SPECTRE_TERMINAL_ART } from "@/data/spectreLogo";
import { useOS } from "@/os/OSContext";
import { type AppProps } from "@/os/ui";
type Tone = "cmd" | "out" | "ok" | "err" | "accent" | "sys" | "dim";
interface Line {
  id: number;
  kind: "text" | "bar" | "art" | "neofetch";
  text?: string;
  info?: string[];
  tone: Tone;
}
const PROMPT = (
  <>
    <span className="text-accent">spectre@spectre-os</span>
    <span className="text-faint">:</span>
    <span className="text-info">~</span>
    <span className="text-faint">$ </span>
  </>
);
const TONE_CLASS: Record<Tone, string> = {
  cmd: "text-ink",
  out: "text-ink/85",
  ok: "text-accent",
  err: "text-danger",
  accent: "text-accent",
  sys: "text-info",
  dim: "text-faint",
};
let lineSeq = 0;
export default function TerminalApp(_: AppProps) {
  const os = useOS();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hpos, setHpos] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const push = (l: Omit<Line, "id">) => setLines((prev) => [...prev, { ...l, id: lineSeq++ }]);
  useEffect(() => {
    const banner: Omit<Line, "id">[] = [
      { kind: "text", text: "SPECTRE.OS shell [v1.3] — (c) Death Spectre. All rights reserved.", tone: "dim" },
      { kind: "text", text: "Type 'help' for available commands. Try 'sudo hire-spectre'.", tone: "dim" },
      { kind: "text", text: "", tone: "out" },
    ];
    setLines(banner.map((b) => ({ ...b, id: lineSeq++ })));
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);
  const exec = (raw: string) => {
    const cmd = raw.trim();
    push({ kind: "text", text: cmd, tone: "cmd" });
    if (cmd) setHist((h) => [...h, cmd]);
    setHpos(-1);
    if (!cmd) return;
    const [name, ...args] = cmd.split(/\s+/);
    const lower = name.toLowerCase();
    const arg = args.join(" ");
    const rest = cmd.toLowerCase();
    if (lower === "clear") return setLines([]);
    if (lower === "help") return printHelp(push);
    if (lower === "ls") {
      push({
        kind: "text",
        text: Object.values(APP_META)
          .filter((m) => m.appId !== "project")
          .map((m) => `${m.glyph}  ${m.appId}.app`)
          .join("   "),
        tone: "out",
      });
      return;
    }
    if (lower === "whoami") {
      push({
        kind: "text",
        text: "you are: guest@spectre-os (uid 1000). Death Spectre is the operator of this machine.",
        tone: "out",
      });
      return;
    }
    if (lower === "date") {
      push({ kind: "text", text: new Date().toString(), tone: "out" });
      return;
    }
    if (lower === "echo") {
      push({ kind: "text", text: arg, tone: "out" });
      return;
    }
    if (lower === "social" || lower === "socials") {
      push({ kind: "text", text: "EMAIL    hello@spectre.dev", tone: "out" });
      push({ kind: "text", text: "GITHUB   github.com/deathspectre", tone: "out" });
      push({ kind: "text", text: "DISCORD  deathspectre#0001", tone: "out" });
      return;
    }
    if (lower === "neofetch") return printNeofetch(push);
    if (lower === "cat") return cat(arg, push);
    if (lower === "about") {
      push({
        kind: "text",
        text: "Death Spectre — Java & systems engineer, Minecraft server architect, occasional web heretic.",
        tone: "out",
      });
      push({
        kind: "text",
        text: "Builds plugins, packet tools, and operating systems that are secretly portfolios.",
        tone: "dim",
      });
      push({ kind: "text", text: "→ open CHANGELOG to see what's actually shipped. open WORK for proof.", tone: "dim" });
      return;
    }
    const opener: Record<string, string> = {
      work: "work",
      projects: "work",
      brain: "brain",
      skills: "brain",
      lab: "lab",
      notes: "notes",
      system: "system",
      contact: "contact",
      terminal: "terminal",
    };
    if (opener[lower]) {
      push({ kind: "text", text: `opening ${opener[lower].toUpperCase()}...`, tone: "sys" });
      os.openApp(opener[lower]);
      return;
    }
    if (lower === "open") {
      const t = args[0]?.toLowerCase();
      if (!t) {
        push({ kind: "text", text: "usage: open <app>  (e.g. open terminal)", tone: "err" });
      } else if (APP_META[t]) {
        os.openApp(t);
        push({ kind: "text", text: `launching ${t}...`, tone: "sys" });
      } else {
        push({ kind: "text", text: `open: app '${t}' not found. type 'ls' to see installed apps.`, tone: "err" });
      }
      return;
    }
    if (lower === "sudo") {
      if (rest.includes("hire")) return hireSequence(push, os);
      push({ kind: "text", text: "spectre is not in the sudoers file. This incident will be reported.", tone: "err" });
      return;
    }
    if (rest.includes("hire")) return hireSequence(push, os);
    if (lower === "exit" || lower === "logout") {
      push({ kind: "text", text: "logout: you cannot log out — you ARE the user. (nice try.)", tone: "dim" });
      return;
    }
    push({ kind: "text", text: `command not found: ${name}. type 'help'.`, tone: "err" });
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      const p = hpos < 0 ? hist.length - 1 : Math.max(0, hpos - 1);
      setHpos(p);
      setValue(hist[p]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hpos < 0) return;
      const p = hpos + 1;
      if (p >= hist.length) {
        setHpos(-1);
        setValue("");
      } else {
        setHpos(p);
        setValue(hist[p]);
      }
    }
  };
  return (
    <div className="flex h-full flex-col bg-void2/60 font-mono" onPointerDown={() => inputRef.current?.focus()}>
      <div ref={scrollRef} className="os-scroll min-h-0 flex-1 overflow-auto px-3 py-2 text-[12.5px] leading-relaxed">
        {lines.map((l) =>
          l.kind === "bar" ? (
            <div key={l.id} className="my-1 h-1.5 w-56 overflow-hidden bg-panel3">
              <div className="h-full bg-accent" style={{ animation: "bootbar 1.6s linear" }} />
            </div>
          ) : l.kind === "art" ? (
            <div key={l.id} className="os-scroll -mx-1 my-1 overflow-x-auto px-1">
              <pre className={`whitespace-pre font-mono text-[3.5px] leading-[1] ${TONE_CLASS[l.tone]}`}>{l.text}</pre>
            </div>
          ) : l.kind === "neofetch" ? (
            <div key={l.id} className="os-scroll -mx-1 my-1 flex items-center gap-4 overflow-x-auto px-1">
              <pre className={`m-0 shrink-0 whitespace-pre font-mono text-[3.5px] leading-[1] ${TONE_CLASS[l.tone]}`}>
                {l.text}
              </pre>
              <div className={`shrink-0 whitespace-pre font-mono ${TONE_CLASS[l.tone]}`}>{l.info?.join("\n")}</div>
            </div>
          ) : l.tone === "cmd" ? (
            <div key={l.id} className="flex gap-1 break-all">
              <span className="shrink-0">{PROMPT}</span>
              <span className="text-ink">{l.text}</span>
            </div>
          ) : (
            <div key={l.id} className={`whitespace-pre-wrap break-words ${TONE_CLASS[l.tone]}`}>
              {l.text}
            </div>
          ),
        )}

        <div className="mt-0.5 flex gap-1">
          <span className="shrink-0">{PROMPT}</span>
          <input
            ref={inputRef}
            value={value}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 border-none bg-transparent text-[12.5px] text-ink outline-none"
            style={{ caretColor: "var(--color-accent)" }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
type Push = (l: Omit<Line, "id">) => void;
function printHelp(push: Push) {
  const rows: [string, string][] = [
    ["help", "show this list"],
    ["ls", "list installed applications"],
    ["about", "who Death Spectre is"],
    ["projects", "open the WORK folder"],
    ["skills", "open the BRAIN graph"],
    ["notes / system / lab / contact", "open an app"],
    ["open <app>", "launch any application"],
    ["neofetch", "system summary"],
    ["cat <file>", "read a file (try: secret.txt)"],
    ["social", "contact channels"],
    ["sudo hire-spectre", "??? "],
    ["clear", "clear the screen"],
  ];
  for (const [c, d] of rows) {
    push({ kind: "text", text: `  ${c.padEnd(28, " ")} ${d}`, tone: "out" });
  }
}
function printNeofetch(push: Push) {
  const info = [
    "spectre@spectre-os",
    "-------------------",
    "OS      : SPECTRE.OS v1.3",
    "HOST    : Desktop",
    "KERNEL  : HUMAN-1.0",
    "SHELL   : /bin/zsh",
    "THEME   : Dark Minimal",
    "LANG    : JAVA / TYPESCRIPT",
  ];
  push({ kind: "neofetch", text: SPECTRE_TERMINAL_ART, info, tone: "accent" });
}
function cat(arg: string, push: Push) {
  const f = arg.toLowerCase();
  if (f === "secret.txt" || f === "experiment_31") {
    push({ kind: "text", text: "DECRYPTING...", tone: "dim" });
    push({ kind: "text", text: "EXPERIMENT_31 :: SPECTRE_AUTOLOOM", tone: "accent" });
    push({ kind: "text", text: "An OS that writes its own portfolio. You're inside it.", tone: "out" });
    push({ kind: "text", text: "> sudo hire-spectre", tone: "dim" });
    return;
  }
  if (f === "readme.txt" || f === "readme") {
    push({ kind: "text", text: "You are currently running SPECTRE.OS.", tone: "accent" });
    push({ kind: "text", text: "Everything here is a window. Double-click the desktop icons.", tone: "out" });
    return;
  }
  if (f === "todo.txt") {
    push({ kind: "text", text: "[ ] ship experiment_31  [x] build this portfolio  [ ] sleep", tone: "out" });
    return;
  }
  push({
    kind: "text",
    text: `cat: ${arg || "(none)"}: No such file. try: secret.txt, readme.txt, todo.txt`,
    tone: "err",
  });
}
function hireSequence(push: Push, os: ReturnType<typeof useOS>) {
  push({ kind: "text", text: "Checking credentials...", tone: "accent" });
  window.setTimeout(() => push({ kind: "bar", tone: "accent" }), 500);
  window.setTimeout(() => {
    push({ kind: "text", text: "", tone: "out" });
    push({ kind: "text", text: "ACCESS GRANTED.", tone: "accent" });
    push({ kind: "text", text: "Good decision.", tone: "ok" });
    push({ kind: "text", text: "Opening a secure channel...", tone: "sys" });
    os.notify("SUDO", "ACCESS GRANTED. Good decision.", "accent");
    os.openApp("contact");
  }, 2400);
}

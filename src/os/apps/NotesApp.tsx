import { useState } from "react";
import { notes } from "@/data/portfolio";
import { AppHeader, type AppProps } from "@/os/ui";
import { cn } from "@/utils/cn";

export default function NotesApp(_: AppProps) {
  const [active, setActive] = useState(notes[0].id);
  const note = notes.find((n) => n.id === active)!;

  return (
    <div className="flex h-full flex-col">
      <AppHeader path="/HOME/SPECTRE/NOTES/devlog.md" right={<span className="micro text-faint">{notes.length} entries</span>} />
      <div className="flex min-h-0 flex-1">
        {/* Index */}
        <aside className="w-[112px] shrink-0 overflow-auto border-r border-edge bg-panel/40 p-1.5 sm:w-52 sm:p-2 os-scroll">
          <div className="micro mb-2 px-1 text-faint">DEVLOG</div>
          <ul className="space-y-0.5">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setActive(n.id)}
                  className={cn(
                    "no-tap w-full px-1.5 py-1.5 text-left transition-colors",
                    active === n.id ? "bg-accent/10" : "hover:bg-panel2"
                  )}
                >
                  <div className={cn("flex items-start gap-1.5 text-[12px] leading-snug", active === n.id ? "text-accent" : "text-ink")}>
                    <span className="text-faint">&gt;</span>
                    <span className="line-clamp-2">{n.title}</span>
                  </div>
                  <div className="micro mt-0.5 pl-3 text-faint">{n.date}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div className="os-scroll min-w-0 flex-1 overflow-auto">
          <div key={note.id} className="fade-in mx-auto max-w-2xl p-6">
            <div className="micro text-accent">// ENTRY · {note.date}</div>
            <h2 className="mt-1 font-mono text-xl font-bold tracking-tight text-ink">{note.title}</h2>
            <div className="mt-2 flex flex-wrap gap-1">
              {note.tags.map((t) => (
                <span key={t} className="border border-edge2 bg-panel px-1.5 py-0.5 text-[10px] text-faint">
                  #{t}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {note.body.split("\n").map((line, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-ink/90">
                  {line.trim() === "" ? "\u00A0" : line}
                </p>
              ))}
            </div>
            <div className="mt-8 border-t border-dashed border-edge pt-3 micro text-faint">
              — end of entry · thoughts are not git-committed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

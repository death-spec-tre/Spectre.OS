import { useRef, useState } from "react";
import { socials } from "@/data/portfolio";
import { AppHeader, type AppProps } from "@/os/ui";
import { cn } from "@/utils/cn";

type Phase = "form" | "sending" | "sent";

export default function ContactApp(_: AppProps) {
  const [phase, setPhase] = useState<Phase>("form");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState("");
  const timer = useRef<number | null>(null);

  const send = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErr("error: all fields required. transmission aborted.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setErr("error: invalid email format.");
      return;
    }
    setErr("");
    setPhase("sending");
    timer.current = window.setTimeout(() => setPhase("sent"), 1500);
  };

  const reset = () => {
    setForm({ name: "", email: "", message: "" });
    setPhase("form");
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader path="/HOME/SPECTRE/bin/contact --new" right={<span className="micro text-faint">SECURE CHANNEL</span>} />
      <div className="os-scroll min-h-0 flex-1 overflow-auto p-5">
        <div className="font-mono text-[12.5px] leading-relaxed">
          <div className="text-muted">
            <span className="text-accent">spectre@spectre-os</span>:<span className="text-info">~</span>$ contact --new
          </div>
          <div className="mt-1 text-faint">// opening secure transmission. your message ships straight to the operator.</div>
        </div>

        {phase === "form" && (
          <div className="fade-in mt-5 space-y-4 font-mono text-[13px]">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="your name" />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@domain.com" />
            <div>
              <div className="mb-1 flex items-center gap-2 text-muted">
                <span className="text-accent">&gt;</span> Message:
              </div>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="say something..."
                rows={4}
                className="os-scroll w-full resize-none border border-edge2 bg-panel px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-dim focus:border-accent/60"
              />
            </div>

            {err && <div className="tiny text-danger">{err}</div>}

            <button
              type="button"
              onClick={send}
              className="no-tap border border-accent/50 bg-accent/10 px-4 py-1.5 text-[12px] font-semibold tracking-widest text-accent hover:bg-accent/20"
            >
              ▸ [ SEND ]
            </button>
          </div>
        )}

        {phase === "sending" && (
          <div className="fade-in mt-6 font-mono text-[13px] text-muted">
            <div>transmitting packet...</div>
            <div className="mt-2 h-1 w-56 overflow-hidden bg-panel3">
              <div className="h-full bg-accent" style={{ animation: "bootbar 1.4s linear" }} />
            </div>
          </div>
        )}

        {phase === "sent" && (
          <div className="fade-in mt-6 font-mono text-[13px]">
            <div className="text-accent">✓ MESSAGE SENT.</div>
            <div className="mt-1 text-muted">Process terminated successfully.</div>
            <div className="mt-1 text-faint">exit code 0 · packet delivered to operator</div>
            <button
              type="button"
              onClick={reset}
              className="no-tap mt-4 border border-edge2 bg-panel px-3 py-1 text-[12px] text-muted hover:border-edge3 hover:text-ink"
            >
              ↺ compose another
            </button>
          </div>
        )}

        {/* alt channels */}
        <div className="mt-8 border-t border-edge pt-4">
          <div className="micro mb-2 text-faint">ALTERNATE CHANNELS</div>
          <div className="flex flex-col gap-1.5">
            {socials.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2 font-mono text-[12px]">
                <span className="w-16 text-faint">{s.label}</span>
                <span className="text-ink">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-muted">
        <span className="text-accent">&gt;</span> {label}:
      </div>
      <input
        type="text"
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full border border-edge2 bg-panel px-3 py-1.5 font-mono text-[13px] text-ink outline-none",
          "placeholder:text-dim focus:border-accent/60"
        )}
      />
    </div>
  );
}

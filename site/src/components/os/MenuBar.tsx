import { useEffect, useRef, useState } from "react";
import type { WindowManager } from "./useWindows";
import { APPS, DESKTOP_ICONS } from "./apps";

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-[12px] text-ink tabular-nums">
      {now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}{" "}
      {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

export function MenuBar({ wm }: { wm: WindowManager }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="relative z-[9999] flex items-center gap-1 h-9 px-3 bg-cream/95 backdrop-blur border-b border-hairline no-select">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/70"
        >
          <span className="size-5 grid place-items-center rounded-md bg-gradient-to-br from-brand-orange to-brand-red text-white text-[10px] font-extrabold">C</span>
          <span className="text-[13px] font-extrabold text-ink">claudient.os</span>
        </button>
        {open && (
          <div className="absolute left-0 mt-1.5 w-56 rounded-lg border border-hairline bg-white py-1.5 win-shadow">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-mute">
              Open new window
            </div>
            {DESKTOP_ICONS.map((id) => (
              <button
                key={id}
                onClick={() => { wm.open(id, true); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-body hover:bg-cream"
              >
                <span>{APPS[id].icon}</span>
                {APPS[id].title}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="hidden lg:flex items-center gap-0.5 ml-1 overflow-x-auto max-w-[55vw]">
        {(["skills", "agents", "mcp", "guides", "cli", "benchmarks", "community", "hooks", "rules", "commands", "workflows", "plugins", "personas", "showcase"] as const).map((id) => (
          <button
            key={id}
            onClick={() => wm.open(id)}
            className="rounded-md px-1.5 py-1 text-[12px] font-semibold text-body hover:bg-white/70 capitalize whitespace-nowrap"
          >
            {id === "cli" ? "CLI" : APPS[id].title.split(" ")[0]}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <a
          href="/pricing"
          className="hidden sm:flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-purple hover:underline"
        >
          💰 Pricing
        </a>
        <a
          href="https://github.com/Claudient/Claudient"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-[12.5px] font-semibold text-ink hover:text-body hover:bg-white/70 rounded-md px-2 py-1 transition"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <button
          onClick={() => wm.open("stacks")}
          className="hidden sm:flex items-center gap-1 text-[12.5px] font-semibold text-brand-purple hover:underline"
        >
          📦 Stacks
        </button>
        <Clock />
        <button
          onClick={() => wm.open("install")}
          className="rounded-md bg-brand-yellow px-3 py-1 text-[12px] font-bold text-ink border-b-2 border-[#c79700]"
        >
          Get Started — Free
        </button>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useWindows } from "./useWindows";
import { Desktop } from "./Desktop";
import { MenuBar } from "./MenuBar";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export default function ClaudientOS() {
  const wm = useWindows();

  useEffect(() => {
    wm.open("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = wm.windows.filter((w) => !w.minimized);
  const topKey = visible.length
    ? visible.reduce((a, b) => (a.z > b.z ? a : b)).key
    : undefined;

  return (
    <div className="fixed inset-0 flex flex-col desktop-bg overflow-hidden">
      <MenuBar wm={wm} />

      <div className="relative flex-1 min-h-0">
        <Desktop wm={wm} />

        {wm.windows.map((w) => (
          <Window key={w.key} win={w} wm={wm} isTop={w.key === topKey} />
        ))}

        {wm.windows.length === 0 && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center text-mute">
              <div className="text-5xl mb-2">🧠</div>
              <div className="text-[13px]">
                Double-click an icon or use the{" "}
                <span className="font-bold text-ink">claudient.os</span> menu to open a window
              </div>
            </div>
          </div>
        )}

        <Taskbar wm={wm} topKey={topKey} />

        {/* Uitbreiden branding */}
        <div className="absolute bottom-2 right-4 z-[9997] flex items-center gap-2.5 no-select">
          <a
            href="https://github.com/UitbreidenOS/Claudient"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/80 backdrop-blur border border-hairline px-3 py-1.5 hover:bg-white hover:border-olive/70 hover:-translate-y-0.5 transition shadow-sm"
          >
            <svg className="size-4 text-ink" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span className="text-[12px] font-semibold text-body">GitHub</span>
          </a>
          <span className="text-[13px] font-medium text-mute">
            by{" "}
            <a
              href="https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-brand-red tracking-tight hover:underline underline-offset-2 transition"
            >
              Uitbreiden
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

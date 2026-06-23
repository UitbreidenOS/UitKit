import { useState, useEffect } from "react";
import { DESKTOP_ICONS, APPS } from "./apps";
import type { WindowManager } from "./useWindows";
import { cn } from "../../utils/cn";

export function Desktop({ wm }: { wm: WindowManager }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Clear selection when clicking desktop background
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div 
      onClick={handleDesktopClick}
      className="absolute inset-0 p-3 pt-2"
    >
      <div className="grid grid-flow-col grid-rows-6 sm:grid-rows-7 gap-1 w-fit pointer-events-auto">
        {DESKTOP_ICONS.map((id) => {
          const meta = APPS[id];
          const isSelected = selectedId === id;
          return (
            <button
              key={id}
              onDoubleClick={() => handleIconDoubleClick(id)}
              onClick={() => handleIconClick(id)}
              className={cn(
                "group flex flex-col items-center gap-1 w-[78px] rounded-lg px-1 py-2 outline-none no-select transition",
                isSelected ? "bg-white/65 ring-1.5 ring-olive/50" : "hover:bg-white/40 focus:bg-white/60"
              )}
            >
              <span
                className="grid place-items-center size-11 rounded-xl text-2xl border border-hairline bg-white/80 group-hover:bg-white group-hover:-translate-y-0.5 transition"
                style={{ boxShadow: "0 2px 6px -2px rgba(0,0,0,0.15)" }}
              >
                {meta.icon}
              </span>
              <span className="text-[11px] font-semibold text-ink text-center leading-tight drop-shadow-sm truncate w-full px-1">
                {meta.title.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  function handleIconClick(id: string) {
    if (isMobile) {
      wm.open(id);
    } else {
      setSelectedId(id);
    }
  }

  function handleIconDoubleClick(id: string) {
    if (!isMobile) {
      wm.open(id);
    }
  }
}


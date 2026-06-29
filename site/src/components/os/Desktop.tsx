import { useState, useEffect } from "react";
import { DESKTOP_ICONS, APPS } from "./apps";
import type { WindowManager } from "./useWindows";
import { cn } from "../../utils/cn";

const CATEGORY_MAP: Record<string, string[]> = {
  Core: ["home", "graph", "skills", "agents", "mcp", "guides", "stacks", "cli", "install", "about", "sidekick-settings"],
  Workflows: ["loop-eng", "goals", "kanban", "workflows", "pipeline", "roadmap", "mastermind", "old-vs-new", "animated-flow"],
  Tools: ["oracle", "learn-eng", "jarvis", "token-saver", "fusion", "clean-slate", "takeover", "lead-gen", "search-console", "studios", "radar-feed", "benchmarks", "community", "showcase", "enterprise", "compare", "marketplace", "examples", "feature-flags", "hooks", "rules", "commands", "plugins", "personas", "toolkit", "testimonials", "ponytail"]
};

export function Desktop({ wm }: { wm: WindowManager }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

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

  const categories = ["All", "Core", "Workflows", "Tools", "Trash"];

  const filteredIcons = DESKTOP_ICONS.filter((id) => {
    if (activeCategory === "All") return id !== "trash";
    if (activeCategory === "Trash") return id === "trash";
    return CATEGORY_MAP[activeCategory]?.includes(id);
  });

  return (
    <div 
      onClick={handleDesktopClick}
      className="absolute inset-0 p-4 pt-3 flex flex-col space-y-3"
    >
      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 shrink-0 pointer-events-auto select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedId(null);
            }}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-bold border transition duration-200 active:scale-[0.97]",
              activeCategory === cat
                ? "bg-zinc-900 border-zinc-950 text-white shadow-sm"
                : "bg-white/80 border-hairline text-ink hover:bg-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Icons Grid */}
      <div className="flex-1 overflow-auto pointer-events-auto">
        <div className="grid grid-flow-col grid-rows-5 sm:grid-rows-6 md:grid-rows-7 gap-1 w-fit">
          {filteredIcons.map((id) => {
            const meta = APPS[id];
            if (!meta) return null;
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


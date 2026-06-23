import { useRef } from "react";
import type { WinState } from "./types";
import { APPS } from "./apps";
import type { WindowManager } from "./useWindows";
import { cn } from "../../utils/cn";
import { AppContent } from "./AppContent";

interface Props {
  win: WinState;
  wm: WindowManager;
  isTop: boolean;
}

const MIN_W = 360;
const MIN_H = 260;

export function Window({ win, wm, isTop }: Props) {
  const meta = APPS[win.appId];
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);

  const onTitleDown = (e: React.PointerEvent) => {
    if (win.maximized) return;
    wm.focus(win.key);
    dragRef.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTitleMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 60;
    const x = Math.min(Math.max(e.clientX - dragRef.current.dx, -win.width + 120), maxX);
    const y = Math.min(Math.max(e.clientY - dragRef.current.dy, 38), maxY);
    wm.move(win.key, x, y);
  };

  const onTitleUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const onResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    wm.focus(win.key);
    resizeRef.current = { sx: e.clientX, sy: e.clientY, sw: win.width, sh: win.height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const r = resizeRef.current;
    const w = Math.max(MIN_W, r.sw + (e.clientX - r.sx));
    const h = Math.max(MIN_H, r.sh + (e.clientY - r.sy));
    wm.resize(win.key, w, h);
  };

  const onResizeUp = (e: React.PointerEvent) => {
    resizeRef.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  if (win.minimized) return null;

  return (
    <div
      className={cn(
        "absolute flex flex-col bg-white overflow-hidden",
        win.maximized
          ? "rounded-none border-t-0 border-x-0 border-b border-hairline"
          : "rounded-xl border win-shadow",
        !win.maximized && isTop ? "border-olive/70" : "border-hairline"
      )}
      style={{ left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z }}
      onPointerDown={() => wm.focus(win.key)}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 h-10 shrink-0 no-select cursor-grab active:cursor-grabbing border-b border-hairline",
          isTop ? "bg-cream" : "bg-soft"
        )}
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onDoubleClick={() => wm.toggleMax(win.key)}
      >
        <div className="flex items-center gap-1.5 mr-1">
          <button
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => wm.close(win.key)}
            className="size-3.5 rounded-full bg-brand-red border border-black/10 hover:brightness-95 grid place-items-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-black/60">✕</span>
          </button>
          <button
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => wm.minimize(win.key)}
            className="size-3.5 rounded-full bg-brand-yellow border border-black/10 hover:brightness-95"
          />
          <button
            aria-label="Maximize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => wm.toggleMax(win.key)}
            className="size-3.5 rounded-full bg-[#3fb950] border border-black/10 hover:brightness-95"
          />
        </div>
        <span className="text-sm" aria-hidden>{meta.icon}</span>
        <span className="text-[13px] font-semibold text-ink truncate">{meta.title}</span>
        <span className="ml-auto text-[11px] font-mono text-mute hidden sm:block">claudient.os</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto bg-canvas">
        <AppContent appId={win.appId} wm={wm} />
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          className="absolute bottom-0 right-0 size-4 cursor-nwse-resize"
          style={{
            background: "linear-gradient(135deg, transparent 0 50%, #a3a489 50% 60%, transparent 60% 70%, #a3a489 70% 80%, transparent 80%)",
          }}
        />
      )}
    </div>
  );
}

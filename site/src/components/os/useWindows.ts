import { useCallback, useRef, useState } from "react";
import type { AppId, WinState } from "./types";
import { APPS } from "./apps";

let counter = 1;

export function useWindows() {
  const [windows, setWindows] = useState<WinState[]>([]);
  const [topZ, setTopZ] = useState(10);
  const openOffset = useRef(0);

  const focus = useCallback((key: string) => {
    setTopZ((z) => {
      const next = z + 1;
      setWindows((ws) =>
        ws.map((w) => (w.key === key ? { ...w, z: next, minimized: false } : w))
      );
      return next;
    });
  }, []);

  const open = useCallback(
    (appId: AppId, allowMultiple = false) => {
      setWindows((ws) => {
        if (!allowMultiple) {
          const existing = ws.find((w) => w.appId === appId);
          if (existing) {
            const next = topZ + 1;
            setTopZ(next);
            return ws.map((w) =>
              w.key === existing.key ? { ...w, z: next, minimized: false } : w
            );
          }
        }

        const meta = APPS[appId];
        const area =
          typeof window !== "undefined"
            ? { w: window.innerWidth, h: window.innerHeight }
            : { w: 1280, h: 800 };

        const isMobile = area.w < 640;

        const width = isMobile ? area.w : Math.min(meta.defaultSize.width, area.w - 40);
        const height = isMobile ? area.h - 36 : Math.min(meta.defaultSize.height, area.h - 90);

        const off = openOffset.current;
        openOffset.current = (off + 1) % 6;

        const baseX = isMobile ? 0 : Math.max(20, (area.w - width) / 2 - 60);
        const baseY = isMobile ? 36 : Math.max(46, (area.h - height) / 2 - 30);

        const next = topZ + 1;
        setTopZ(next);

        const win: WinState = {
          key: `${appId}-${counter++}`,
          appId,
          x: isMobile ? 0 : baseX + off * 28,
          y: isMobile ? 36 : baseY + off * 26,
          width,
          height,
          z: next,
          minimized: false,
          maximized: isMobile,
        };
        return [...ws, win];
      });
    },
    [topZ]
  );

  const close = useCallback((key: string) => {
    setWindows((ws) => ws.filter((w) => w.key !== key));
  }, []);

  const minimize = useCallback((key: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.key === key ? { ...w, minimized: true } : w))
    );
  }, []);

  const toggleMax = useCallback((key: string) => {
    const area = { w: window.innerWidth, h: window.innerHeight };
    const isMobile = area.w < 640;
    setWindows((ws) =>
      ws.map((w) => {
        if (w.key !== key) return w;
        if (w.maximized && w.prev) {
          if (isMobile) return w; // Don't unmaximize on mobile
          return { ...w, maximized: false, ...w.prev, prev: undefined };
        }
        return {
          ...w,
          maximized: true,
          prev: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: isMobile ? 0 : 8,
          y: isMobile ? 36 : 44,
          width: isMobile ? area.w : area.w - 16,
          height: isMobile ? area.h - 36 : area.h - 96,
        };
      })
    );
  }, []);

  const move = useCallback((key: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.key === key ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((key: string, width: number, height: number) => {
    setWindows((ws) =>
      ws.map((w) => (w.key === key ? { ...w, width, height } : w))
    );
  }, []);

  return { windows, open, close, minimize, toggleMax, move, resize, focus };
}

export type WindowManager = ReturnType<typeof useWindows>;

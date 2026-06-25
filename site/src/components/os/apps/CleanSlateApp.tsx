import { useState, useEffect } from "react";
import { Eyebrow, Card, YellowButton } from "./ui";

interface ToolConfig {
  id: string;
  name: string;
  category: "files" | "system" | "external";
  tokenCost: number;
  selected: boolean;
}

const INITIAL_TOOLS: ToolConfig[] = [
  { id: "read", name: "view_file / list_dir", category: "files", tokenCost: 3500, selected: true },
  { id: "write", name: "write_to_file / edit_content", category: "files", tokenCost: 4000, selected: true },
  { id: "grep", name: "grep_search (AST regex parser)", category: "files", tokenCost: 3000, selected: false },
  { id: "command", name: "run_command (local OS execution)", category: "system", tokenCost: 5000, selected: false },
  { id: "web", name: "search_web / read_url", category: "external", tokenCost: 4500, selected: false },
  { id: "mcp", name: "mcp_server_lookup", category: "external", tokenCost: 3000, selected: false },
];

export function CleanSlateApp() {
  const [tools, setTools] = useState<ToolConfig[]>(INITIAL_TOOLS);
  const [isBooting, setIsBooting] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("uitkit_cleanslate_tools");
    if (saved) {
      try { setTools(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  const handleToggle = (id: string) => {
    if (isLocked) return;
    const updated = tools.map(t => t.id === id ? { ...t, selected: !t.selected } : t);
    setTools(updated);
    localStorage.setItem("uitkit_cleanslate_tools", JSON.stringify(updated));
  };

  const handleBoot = () => {
    if (isBooting) return;
    setIsBooting(true);
    setIsLocked(true);
    setBootLogs([
      "[BOOT] Clean Slate Engine initializing...",
      "[BOOT] Disabling standard plugin discovery...",
      "[BOOT] Stripping secondary instruction blocks..."
    ]);

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Clean-slate agent booting..." }
    }));
  };

  useEffect(() => {
    if (!isBooting) return;

    const timer = setTimeout(() => {
      const activeTools = tools.filter(t => t.selected).map(t => t.name);
      setBootLogs(prev => [
        ...prev,
        `[BOOT] Mounting selected APIs: ${activeTools.join(", ")}`,
        `[BOOT] Lock parameters: Engaged. Clean state configuration secured.`,
        "[SYSTEM] 🎉 Agent is ONLINE. Standby for commands."
      ]);
      setIsBooting(false);

      // Celebrate with Sidekick Pet
      window.dispatchEvent(new CustomEvent("sidekick_status_change", {
        detail: { status: "done", message: "Minimal agent online!" }
      }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [isBooting, tools]);

  const handleReset = () => {
    setIsLocked(false);
    setBootLogs([]);
    const reset = INITIAL_TOOLS.map(t => ({ ...t }));
    setTools(reset);
    localStorage.setItem("uitkit_cleanslate_tools", JSON.stringify(reset));
  };

  // Calculations
  const baseSystemPromptTokens = 8000;
  const activeToolTokens = tools.filter(t => t.selected).reduce((sum, t) => sum + t.tokenCost, 0);
  const totalBootTokens = baseSystemPromptTokens + activeToolTokens;
  
  const maxPossibleTokens = baseSystemPromptTokens + tools.reduce((sum, t) => sum + t.tokenCost, 0);
  const savingsPercent = Math.round(((maxPossibleTokens - totalBootTokens) / maxPossibleTokens) * 100);

  return (
    <div className="h-full flex flex-col md:flex-row gap-5 p-5 overflow-y-auto">
      {/* Left panel: configure toggle items */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0">
        <Card className="flex flex-col gap-3">
          <Eyebrow color="#76786c">Clean Slate Engine</Eyebrow>
          <h2 className="text-[14px] font-bold text-ink">Minimal Boot Selector</h2>

          <div className="space-y-2">
            {tools.map((t) => (
              <label
                key={t.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition ${
                  isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-cream"
                } ${t.selected ? "bg-zinc-50 border-zinc-300" : "bg-white border-hairline"}`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    disabled={isLocked}
                    checked={t.selected}
                    onChange={() => handleToggle(t.id)}
                    className="accent-zinc-700 size-4 rounded"
                  />
                  <div>
                    <span className="text-[12.5px] font-bold text-ink block">{t.name}</span>
                    <span className="text-[10px] text-mute capitalize font-mono">{t.category} scope</span>
                  </div>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-zinc-500">+{t.tokenCost}t</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 mt-2 pt-2 border-t border-hairline">
            {!isLocked ? (
              <YellowButton onClick={handleBoot} className="flex-1 justify-center bg-zinc-700 border-zinc-900 text-white hover:bg-zinc-800">
                Boot Minimal Agent 🧹
              </YellowButton>
            ) : (
              <GhostButton onClick={handleReset} className="flex-1 justify-center border-zinc-300 text-zinc-700">
                Unlock/Reset 🔓
              </GhostButton>
            )}
          </div>
        </Card>
      </div>

      {/* Right panel: token metrics and logs */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Token projection meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="flex flex-col gap-1.5 justify-between">
            <div>
              <h3 className="text-[12px] font-bold text-ink">Total Boot Context Weight</h3>
              <div className="text-2xl font-extrabold text-ink mt-2">
                {totalBootTokens.toLocaleString()} <span className="text-[13px] text-mute font-normal">tokens</span>
              </div>
            </div>
            <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden border border-hairline mt-2">
              <div
                style={{ width: `${(totalBootTokens / maxPossibleTokens) * 100}%` }}
                className="bg-zinc-700 h-full transition-all duration-300"
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-1.5 justify-between bg-zinc-50 border-zinc-200">
            <div>
              <h3 className="text-[12px] font-bold text-zinc-700">Prompt Context Savings</h3>
              <div className="text-2xl font-extrabold text-emerald-600 mt-2">
                +{savingsPercent}% saved
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Reducing active tools lowers baseline system prompt weight and protects token limits.
            </p>
          </Card>
        </div>

        {/* Boot console logs */}
        <Card className="flex-1 bg-slate-900 border-none text-slate-100 p-4 font-mono text-[11.5px] min-h-[200px] overflow-y-auto">
          <h4 className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">
            🧹 Clean-Slate Boot Trace
          </h4>
          <div className="space-y-1">
            {bootLogs.length === 0 && (
              <div className="text-slate-500 italic">Select tools on the left panel and click 'Boot Minimal Agent' to trace.</div>
            )}
            {bootLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith("[SYSTEM]") ? "text-emerald-400 font-bold" : "text-zinc-300"}>
                {log}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Eyebrow, Card, YellowButton } from "./ui";

interface TrendItem {
  id: string;
  topic: string;
  source: string;
  score: number;
  impact: string;
  summary: string;
}

const INITIAL_TRENDS: TrendItem[] = [
  {
    id: "1",
    topic: "Vibe Coding & Iterative Loops Dominance",
    source: "HackerNews #1",
    score: 98,
    impact: "Extremely High (Shifts developer stack to verify-loops)",
    summary: "Developers are moving away from raw single-prompt completions to structured execution loops. Verify loops show a 4x increase in correctness.",
  },
  {
    id: "2",
    topic: "MCP server growth surge",
    source: "GitHub Trending",
    score: 92,
    impact: "High (Enables desktop filesystem & dev-tools connectivity)",
    summary: "Model Context Protocol servers are becoming standard. Local AST indexing and debugger servers are leading package downloads.",
  },
  {
    id: "3",
    topic: "DeepMind launches Antigravity 2.0 system",
    source: "TechCrunch",
    score: 89,
    impact: "Critical (Reduces agent context overhead for large repos)",
    summary: "New agentic coding assistant engine resolves repository scaling bottlenecks with automated transaction compression.",
  },
  {
    id: "4",
    topic: "Local LLMs match frontier model coding benchmark",
    source: "X/Twitter",
    score: 81,
    impact: "Medium (Enables offline, secure developer code runs)",
    summary: "Highly compressed 7B models executing in local docker containers show parity on complex syntax validation tests.",
  },
];

const SCANNING_PHASES = [
  "Broadcasting frequency search...",
  "Scraping HackerNews developer vectors...",
  "Crawling GitHub release notes...",
  "Analyzing trend scores on X (Twitter)...",
  "Compiling findings into Oracle radar...",
];

export function OracleApp() {
  const [trends, setTrends] = useState<TrendItem[]>(INITIAL_TRENDS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(-1);
  const [consoleLog, setConsoleLog] = useState<string[]>([]);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanIndex(0);
    setConsoleLog(["[ORACLE] Launching AI News Radar crawler..."]);

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Radar scanning active!" }
    }));
  };

  useEffect(() => {
    if (!isScanning || scanIndex < 0) return;

    if (scanIndex >= SCANNING_PHASES.length) {
      // Scanning complete
      setIsScanning(false);
      setTrends((prev) => [
        {
          id: Math.random().toString(),
          topic: `AI-driven AST refactoring peak trend — ${new Date().toLocaleTimeString()}`,
          source: "Dev.to Trending",
          score: 87,
          impact: "High (Increases automation levels in legacy cleanups)",
          summary: "Automating import pruning and dead code cleanup hooks shows a 30% reduction in total build cycle times.",
        },
        ...prev,
      ]);
      setConsoleLog((prevLogs) => [
        ...prevLogs,
        "[ORACLE] Complete! Found 1 new trending AI paradigm.",
        "[ORACLE] Stored in local knowledge map index.",
      ]);
      
      // Update Sidekick Pet
      window.dispatchEvent(new CustomEvent("sidekick_status_change", {
        detail: { status: "done", message: "Scan complete! Found fresh AI trends." }
      }));
      return;
    }

    const timer = setTimeout(() => {
      setConsoleLog((prev) => [...prev, `[RADAR] ${SCANNING_PHASES[scanIndex]}`]);
      setScanIndex(scanIndex + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isScanning, scanIndex]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-5 p-5 overflow-y-auto">
      {/* Left pane: Radar animation and console */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0">
        <Card className="flex flex-col items-center gap-3 relative overflow-hidden bg-zinc-950 text-white p-5 border-zinc-800">
          <div className="w-full border-b border-zinc-800 pb-2 flex justify-between items-center">
            <div>
              <Eyebrow color="#06b6d4">Oracle Radar</Eyebrow>
              <h2 className="text-[13px] font-bold">Trend Scraper</h2>
            </div>
            <span className="inline-block size-2.5 rounded-full bg-cyan-500 animate-ping"></span>
          </div>

          {/* Glowing radar sweep */}
          <div className="relative size-44 rounded-full border-2 border-cyan-500/20 bg-zinc-900 flex items-center justify-center overflow-hidden my-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            {/* Concentric rings */}
            <div className="absolute size-32 rounded-full border border-cyan-500/10" />
            <div className="absolute size-20 rounded-full border border-cyan-500/10" />
            <div className="absolute size-8 rounded-full border border-cyan-500/10" />
            
            {/* Crosshairs */}
            <div className="absolute inset-x-0 h-px bg-cyan-500/15" />
            <div className="absolute inset-y-0 w-px bg-cyan-500/15" />

            {/* Sweep arm */}
            <div 
              className={`absolute inset-0 origin-center bg-gradient-to-r from-transparent via-transparent to-cyan-500/40 rounded-full ${
                isScanning ? "animate-[spin_3s_linear_infinite]" : "rotate-45"
              }`}
            />

            {/* Tiny targets */}
            <div className="absolute top-12 left-10 size-2 rounded-full bg-cyan-400/80 animate-pulse" />
            <div className="absolute bottom-16 right-12 size-1.5 rounded-full bg-cyan-400/50 animate-pulse [animation-delay:0.5s]" />
            <div className="absolute top-20 right-20 size-2 rounded-full bg-cyan-400/60 animate-pulse [animation-delay:1.2s]" />

            <span className="text-xl z-10 select-none">📡</span>
          </div>

          <YellowButton 
            disabled={isScanning}
            onClick={handleScan}
            className="w-full justify-center bg-cyan-500 border-cyan-700 text-white hover:brightness-[1.05]"
          >
            {isScanning ? "Scanning Web..." : "Run Radar Scan"}
          </YellowButton>
        </Card>

        {/* Oracle Logs */}
        <Card className="flex-1 bg-slate-900 border-none text-slate-100 p-4 font-mono text-[11px] h-[190px] overflow-y-auto">
          <h4 className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">
            📡 Oracle Crawler Console
          </h4>
          <div className="space-y-1">
            {consoleLog.length === 0 && (
              <div className="text-slate-500 italic">Oracle idle. Trigger a scan to start fetching.</div>
            )}
            {consoleLog.map((log, idx) => (
              <div key={idx} className={log.startsWith("[ORACLE] Complete") ? "text-emerald-400 font-bold" : "text-cyan-300"}>
                {log}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right pane: trending feed */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Card className="flex-1 flex flex-col gap-3">
          <div className="border-b border-hairline pb-2 flex justify-between items-center">
            <h2 className="text-[14px] font-bold text-ink">Trending AI & Dev Ecosystem Parallels</h2>
            <span className="text-[11px] font-mono text-mute">Updates 24/7</span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1">
            {trends.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-xl border border-hairline bg-white hover:border-cyan-500/40 hover:-translate-y-0.5 transition shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      Score: {item.score}%
                    </span>
                    <span className="text-[11.5px] font-bold text-zinc-500">{item.source}</span>
                  </div>
                  <span className="text-[10px] text-mute font-mono">Radar Signal Lock</span>
                </div>

                <h3 className="text-[14px] font-bold text-ink leading-tight">{item.topic}</h3>
                <p className="text-[12.5px] text-body mt-2 leading-relaxed">{item.summary}</p>
                
                <div className="mt-3 bg-cyan-50/20 border border-cyan-100/50 p-2.5 rounded-lg text-[11px] text-cyan-800">
                  <span className="font-extrabold uppercase text-[10px] block text-cyan-700">Swarm Ecosystem Impact:</span>
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

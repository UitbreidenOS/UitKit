import { useState, useEffect } from "react";
import { Eyebrow, Card, YellowButton } from "./ui";

interface ModelResponse {
  modelName: string;
  avatar: string;
  solution: string;
  status: "idle" | "deliberating" | "done";
}

const PRESET_DELIBERATIONS = [
  {
    question: "Design database caching strategy for 10M active vectors.",
    responses: [
      {
        modelName: "Sonnet-AOS",
        avatar: "🐰",
        solution: "Deploy Redis clusters in front of SQLite metadata databases. Store raw vectors in local flat-file buffers indexed with HNSW indexes.",
        status: "done" as const,
      },
      {
        modelName: "Haiku-Lite",
        avatar: "⚡",
        solution: "Use in-memory LRU cache directly in Node runtime. Restrict cache scope to top 15% frequently queried metadata keys.",
        status: "done" as const,
      },
      {
        modelName: "Fugu-Pro",
        avatar: "🐡",
        solution: "Compile SQLite with custom WAL parameters. Cache index vectors in memory blocks aligned to system page allocations to optimize disk reads.",
        status: "done" as const,
      },
    ],
    verdict: "🏆 FUSION VERDICT: Combine Fugu-Pro page-alignment indexes with Sonnet-AOS HNSW layers. Fugu-Pro ensures fast disk reads, while Sonnet's Redis cluster handles metadata caching at scale. Reject the raw runtime LRU cache (Haiku-Lite) due to memory overflow risk with 10M entries.",
  },
];

export function FusionApp() {
  const [question, setQuestion] = useState(PRESET_DELIBERATIONS[0].question);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [responses, setResponses] = useState<ModelResponse[]>([
    { modelName: "Sonnet-AOS", avatar: "🐰", solution: "", status: "idle" },
    { modelName: "Haiku-Lite", avatar: "⚡", solution: "", status: "idle" },
    { modelName: "Fugu-Pro", avatar: "🐡", solution: "", status: "idle" },
  ]);
  const [verdict, setVerdict] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const handleDeliberate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsDeliberating(true);
    setVerdict("");
    setLogs(["[SYSTEM] Broadcasting question to Boardroom panel...", "[BOARDROOM] Sonnet-AOS, Haiku-Lite, Fugu-Pro models online."]);
    
    setResponses([
      { modelName: "Sonnet-AOS", avatar: "🐰", solution: "", status: "deliberating" },
      { modelName: "Haiku-Lite", avatar: "⚡", solution: "", status: "deliberating" },
      { modelName: "Fugu-Pro", avatar: "🐡", solution: "", status: "deliberating" },
    ]);

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Fusion deliberation active!" }
    }));
  };

  useEffect(() => {
    if (!isDeliberating) return;

    // Simulate models finishing at different times
    const t1 = setTimeout(() => {
      setResponses((prev) =>
        prev.map((r) =>
          r.modelName === "Haiku-Lite"
            ? { ...r, solution: PRESET_DELIBERATIONS[0].responses[1].solution, status: "done" }
            : r
        )
      );
      setLogs((prev) => [...prev, "[HAIKU-LITE] Proposal submitted."]);
    }, 1500);

    const t2 = setTimeout(() => {
      setResponses((prev) =>
        prev.map((r) =>
          r.modelName === "Sonnet-AOS"
            ? { ...r, solution: PRESET_DELIBERATIONS[0].responses[0].solution, status: "done" }
            : r
        )
      );
      setLogs((prev) => [...prev, "[SONNET-AOS] Proposal submitted."]);
    }, 2800);

    const t3 = setTimeout(() => {
      setResponses((prev) =>
        prev.map((r) =>
          r.modelName === "Fugu-Pro"
            ? { ...r, solution: PRESET_DELIBERATIONS[0].responses[2].solution, status: "done" }
            : r
        )
      );
      setLogs((prev) => [
        ...prev,
        "[FUGU-PRO] Proposal submitted.",
        "[SYSTEM] Deliberation complete. Summoning Judge to draft verdict..."
      ]);
    }, 4000);

    const t4 = setTimeout(() => {
      setVerdict(PRESET_DELIBERATIONS[0].verdict);
      setLogs((prev) => [...prev, "[SYSTEM] 🎉 Judge verdict compiled. Saved final merged layout."]);
      setIsDeliberating(false);

      // Celebrate with Sidekick Pet
      window.dispatchEvent(new CustomEvent("sidekick_status_change", {
        detail: { status: "done", message: "Deliberation finalized!" }
      }));
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isDeliberating]);

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex items-center gap-3">
        <span className="text-4xl">⚖️</span>
        <div>
          <Eyebrow color="#6366f1">Fusion Boardroom</Eyebrow>
          <h1 className="text-xl font-extrabold text-ink">Multi-Model Deliberation</h1>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleDeliberate} className="flex gap-2">
        <input
          disabled={isDeliberating}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a technical routing or architectural question..."
          className="flex-1 text-[13px] border border-hairline rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
        />
        <YellowButton disabled={isDeliberating} className="bg-indigo-500 border-indigo-700 text-white hover:brightness-[1.05]">
          {isDeliberating ? "Deliberating..." : "Launch Boardroom"}
        </YellowButton>
      </form>

      {/* Deliberation panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {responses.map((r, i) => (
          <Card key={i} className="flex flex-col gap-2 min-h-[140px] relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-hairline pb-1.5 mb-1.5">
              <span className="text-2xl">{r.avatar}</span>
              <div>
                <h4 className="text-[12.5px] font-bold text-ink">{r.modelName}</h4>
                <span className={`text-[9px] font-bold uppercase ${
                  r.status === "done" ? "text-emerald-600" : r.status === "deliberating" ? "text-blue-500" : "text-mute"
                }`}>
                  {r.status}
                </span>
              </div>
            </div>

            {r.status === "deliberating" ? (
              <div className="flex-1 flex flex-col justify-center items-center py-4">
                <span className="inline-block size-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-1"></span>
                <span className="text-[11px] text-mute font-mono">Deliberating...</span>
              </div>
            ) : r.solution ? (
              <p className="text-[12px] text-body leading-relaxed">"{r.solution}"</p>
            ) : (
              <div className="text-[12px] text-mute italic py-4">Waiting to start...</div>
            )}
          </Card>
        ))}
      </div>

      {/* Merging verdict line connection animation */}
      {isDeliberating && (
        <div className="h-6 relative overflow-hidden hidden md:block">
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent top-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      )}

      {/* Verdict Panel */}
      {verdict && (
        <Card className="bg-indigo-50/50 border-indigo-200 p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-[13px] font-bold text-indigo-900 flex items-center gap-1.5">
            <span>⚖️</span> Panel Verdict
          </h3>
          <p className="text-[12.5px] text-indigo-800 leading-relaxed font-semibold">
            {verdict}
          </p>
        </Card>
      )}

      {/* Console logs */}
      <Card className="bg-slate-900 border-none text-slate-100 p-4 font-mono text-[11px] h-[120px] overflow-y-auto">
        <h4 className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">
          ⚙️ Boardroom Log Stream
        </h4>
        <div className="space-y-1">
          {logs.length === 0 && (
            <div className="text-slate-500 italic">Idle. Ingest an architectural query to call the panel.</div>
          )}
          {logs.map((log, idx) => (
            <div key={idx} className={log.startsWith("[SYSTEM] 🎉") ? "text-emerald-400 font-bold" : "text-indigo-300"}>
              {log}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

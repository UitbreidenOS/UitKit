import { useState, useEffect } from "react";
import { Eyebrow, Card, YellowButton, GhostButton } from "./ui";

interface PipelineNode {
  id: string;
  name: string;
  emoji: string;
  status: "idle" | "running" | "done" | "error";
  description: string;
}

const INITIAL_NODES: PipelineNode[] = [
  { id: "n1", name: "Fetch API Docs", emoji: "📥", status: "idle", description: "Scrape external endpoint reference schemas." },
  { id: "n2", name: "Parse AST Schema", emoji: "🧠", status: "idle", description: "Generate type definitions and interface blocks." },
  { id: "n3", name: "Draft Rules payload", emoji: "📝", status: "idle", description: "Compile custom markdown rules checks." },
  { id: "n4", name: "Verify Compiler", emoji: "🧪", status: "idle", description: "Run test suite compilation triggers." },
];

export function PipelineApp() {
  const [nodes, setNodes] = useState<PipelineNode[]>(INITIAL_NODES);
  const [isRunning, setIsRunning] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveIdx(0);
    setPipelineLogs(["[SYSTEM] Launching workflow pipeline execution..."]);
    setNodes(INITIAL_NODES.map(n => ({ ...n, status: "idle" })));

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Starting pipeline execution..." }
    }));
  };

  useEffect(() => {
    if (!isRunning || activeIdx < 0) return;

    if (activeIdx >= nodes.length) {
      setIsRunning(false);
      setPipelineLogs(prev => [...prev, "[SYSTEM] 🎉 Pipeline completed successfully!"]);
      
      // Update Sidekick Pet
      window.dispatchEvent(new CustomEvent("sidekick_status_change", {
        detail: { status: "done", message: "Pipeline workflows complete!" }
      }));
      return;
    }

    const currentNode = nodes[activeIdx];
    setNodes(prev => prev.map((n, i) => i === activeIdx ? { ...n, status: "running" } : n));
    setPipelineLogs(prev => [...prev, `[WORKFLOW] Step ${activeIdx + 1}: ${currentNode.name}...`]);

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "working", message: `Pipeline: ${currentNode.name}` }
    }));

    const timer = setTimeout(() => {
      setNodes(prev => prev.map((n, i) => i === activeIdx ? { ...n, status: "done" } : n));
      setActiveIdx(activeIdx + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isRunning, activeIdx]);

  const handleAddNode = () => {
    const newNode: PipelineNode = {
      id: Math.random().toString(),
      name: "Custom Integration Node",
      emoji: "🔌",
      status: "idle",
      description: "Custom user defined logic check block.",
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔗</span>
          <div>
            <Eyebrow color="#10b981">Pipeline Builder</Eyebrow>
            <h1 className="text-xl font-extrabold text-ink">Ecosystem Workflow Connector</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <GhostButton onClick={handleAddNode} disabled={isRunning}>Add Step +</GhostButton>
          <YellowButton onClick={handleRun} disabled={isRunning} className="bg-emerald-500 border-emerald-700 text-white hover:brightness-[1.05]">
            {isRunning ? "Running Pipeline..." : "Run Pipeline 🔁"}
          </YellowButton>
        </div>
      </div>

      {/* Visual node editor layout */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 py-10 bg-slate-50/50 rounded-2xl border border-hairline overflow-x-auto p-4 min-h-[220px]">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-6 shrink-0">
            {/* Step node card */}
            <Card className={`w-48 p-4 flex flex-col gap-2 shadow-sm transition border-2 ${
              node.status === "running" ? "border-emerald-500 scale-105 ring-4 ring-emerald-100 bg-emerald-50/10" :
              node.status === "done" ? "border-emerald-500 bg-emerald-50/5" :
              "border-hairline"
            }`}>
              <div className="flex items-center justify-between border-b border-hairline pb-1.5 mb-1">
                <span className="text-xl">{node.emoji}</span>
                <span className={`text-[9px] font-bold uppercase ${
                  node.status === "done" ? "text-emerald-600" :
                  node.status === "running" ? "text-blue-500" : "text-mute"
                }`}>
                  {node.status}
                </span>
              </div>
              <h4 className="text-[12.5px] font-bold text-ink truncate">{node.name}</h4>
              <p className="text-[11px] text-mute leading-normal">{node.description}</p>
            </Card>

            {/* Connection Arrow */}
            {i < nodes.length - 1 && (
              <div className="flex items-center justify-center text-zinc-350 text-2xl relative select-none">
                <span>➔</span>
                {isRunning && activeIdx === i && (
                  <span className="absolute inset-0 text-emerald-500 animate-ping">➔</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Console logs */}
      <Card className="bg-slate-900 border-none text-slate-100 p-4 font-mono text-[11px] h-[150px] overflow-y-auto shrink-0">
        <h4 className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">
          ⚙️ Pipeline Process Logs
        </h4>
        <div className="space-y-1">
          {pipelineLogs.length === 0 && (
            <div className="text-slate-500 italic">Idle. Trigger 'Run Pipeline' above to trace sequential compilation.</div>
          )}
          {pipelineLogs.map((log, idx) => (
            <div key={idx} className={log.startsWith("[SYSTEM] 🎉") ? "text-emerald-400 font-bold" : "text-emerald-300"}>
              {log}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

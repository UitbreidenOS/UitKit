import { useState, useEffect, useRef } from "react";
import { Eyebrow, Card, YellowButton, GhostButton } from "./ui";

interface KanbanCard {
  id: string;
  title: string;
  desc: string;
  priority: "high" | "medium" | "low";
  agent: string;
  column: "backlog" | "progress" | "review" | "done";
  comments?: string;
  checklists: { text: string; done: boolean }[];
}

const INITIAL_CARDS: KanbanCard[] = [
  {
    id: "k1",
    title: "Draft CLI Router Schema",
    desc: "Map all slash command options inside agy CLI schema template.",
    priority: "medium",
    agent: "Hermes Planner",
    column: "backlog",
    checklists: [
      { text: "List all 100 commands", done: false },
      { text: "Confirm option flags", done: false },
    ],
  },
  {
    id: "k2",
    title: "Implement Token Optimizer",
    desc: "Create compact native-first code replacement system to trim file tokens.",
    priority: "high",
    agent: "Hermes Builder",
    column: "progress",
    checklists: [
      { text: "Verify HSL syntax", done: true },
      { text: "Test with large imports", done: false },
    ],
  },
  {
    id: "k3",
    title: "Design Custom Hooks API",
    desc: "Draft responsive reactive wrapper around AST hooks parser.",
    priority: "low",
    agent: "Fugu Reviewer",
    column: "review",
    comments: "Lacks error propagation handling.",
    checklists: [
      { text: "Write typings", done: true },
      { text: "Add fallback handler", done: true },
    ],
  },
  {
    id: "k4",
    title: "Initialize Swarm Sandbox",
    desc: "Create core sandbox layout with mock terminal window.",
    priority: "high",
    agent: "Hermes Planner",
    column: "done",
    checklists: [
      { text: "Add process logger", done: true },
      { text: "Build model drop-down selection", done: true },
    ],
  },
];

export function KanbanApp() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const simTimer = useRef<NodeJS.Timeout | null>(null);

  // New task form fields
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newAgent, setNewAgent] = useState("Hermes Builder");

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLog(["[SYSTEM] Initiating Agent Sprint simulation...", "[PLANNER] Scoping backlog items..."]);
    
    // Notify pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Starting Agent Kanban Sprint!" }
    }));
  };

  const stopSimulation = () => {
    if (simTimer.current) clearTimeout(simTimer.current);
    setIsSimulating(false);
    setSimLog((prev) => [...prev, "[SYSTEM] Sprint simulation halted."]);
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "idle", message: "Kanban simulation stopped." }
    }));
  };

  // Simulating step-by-step Kanban transitions
  useEffect(() => {
    if (!isSimulating) return;

    const timer = setTimeout(() => {
      setCards((prevCards) => {
        const next = [...prevCards];
        
        // 1. Move k2 (progress) to review
        const k2 = next.find(c => c.id === "k2");
        if (k2 && k2.column === "progress") {
          k2.column = "review";
          k2.checklists.forEach(ch => ch.done = true);
          setSimLog(prev => [
            ...prev,
            `[BUILDER] Complete building: "${k2.title}". Checklist verified. Sending to Review!`,
            `[SYSTEM] Card "${k2.title}" shifted to Column: Review.`
          ]);
          
          window.dispatchEvent(new CustomEvent("sidekick_status_change", {
            detail: { status: "thinking", message: `Fugu Reviewer gating: ${k2.title}` }
          }));
          return next;
        }

        // 2. Move k3 (review) to Done or back to progress on comment update
        const k3 = next.find(c => c.id === "k3");
        if (k3 && k3.column === "review") {
          k3.column = "done";
          k3.comments = "Approved after layout verification checks.";
          setSimLog(prev => [
            ...prev,
            `[REVIEWER] Approved: "${k3.title}". Checklist looks clean.`,
            `[SYSTEM] Card "${k3.title}" shifted to Column: Done.`
          ]);
          window.dispatchEvent(new CustomEvent("sidekick_status_change", {
            detail: { status: "done", message: `Card Completed: ${k3.title} ✨` }
          }));
          return next;
        }

        // 3. Move k1 (backlog) to Progress
        const k1 = next.find(c => c.id === "k1");
        if (k1 && k1.column === "backlog") {
          k1.column = "progress";
          k1.agent = "Hermes Builder";
          setSimLog(prev => [
            ...prev,
            `[PLANNER] Dispatched task card: "${k1.title}" to Builder.`,
            `[SYSTEM] Card "${k1.title}" shifted to Column: In-Progress.`
          ]);
          window.dispatchEvent(new CustomEvent("sidekick_status_change", {
            detail: { status: "working", message: `Hermes Builder coding: ${k1.title}` }
          }));
          return next;
        }

        // Complete sprint
        setSimLog(prev => [...prev, "[SYSTEM] Sprint complete. All active pipeline items compiled."]);
        setIsSimulating(false);
        return next;
      });

    }, 3500);

    simTimer.current = timer;
    return () => clearTimeout(timer);
  }, [isSimulating, cards]);

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCard: KanbanCard = {
      id: Math.random().toString(36).substring(2),
      title: newTitle,
      desc: newDesc,
      priority: newPriority,
      agent: newAgent,
      column: "backlog",
      checklists: [{ text: "Initial Setup check", done: false }],
    };

    setCards([...cards, newCard]);
    setNewTitle("");
    setNewDesc("");

    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "working", message: `Added card: ${newCard.title}` }
    }));
  };

  const moveCard = (id: string, col: KanbanCard["column"]) => {
    setCards(cards.map(c => c.id === id ? { ...c, column: col } : c));
  };

  const renderColumn = (colName: KanbanCard["column"], title: string, emoji: string) => {
    const colCards = cards.filter(c => c.column === colName);
    return (
      <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-hairline pb-2 px-1">
          <div className="flex items-center gap-1.5 font-bold text-[13px] text-ink">
            <span>{emoji}</span>
            <span>{title}</span>
          </div>
          <span className="text-[11px] font-bold text-mute bg-zinc-100 rounded-full px-2 py-0.25">
            {colCards.length}
          </span>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[380px] min-h-[150px] bg-slate-50/50 p-2 rounded-xl border border-hairline">
          {colCards.map(c => (
            <div
              key={c.id}
              className="bg-white border border-hairline rounded-xl p-3 shadow-sm hover:border-indigo-500/50 transition cursor-grab active:cursor-grabbing space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  c.priority === "high" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                  c.priority === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                  "bg-zinc-100 text-mute"
                }`}>
                  {c.priority}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.25 rounded">
                  {c.agent.split(" ")[1]}
                </span>
              </div>

              <h4 className="text-[12.5px] font-bold text-ink leading-snug">{c.title}</h4>
              <p className="text-[11.5px] text-mute leading-normal">{c.desc}</p>

              {/* Checklist progress */}
              {c.checklists.length > 0 && (
                <div className="text-[10px] text-mute flex items-center gap-1">
                  <span>📋</span>
                  <span>
                    {c.checklists.filter(i => i.done).length}/{c.checklists.length} checks done
                  </span>
                </div>
              )}

              {c.comments && (
                <div className="text-[10px] italic text-rose-500 bg-rose-50/30 p-1.5 rounded border border-rose-100/40">
                  Comment: {c.comments}
                </div>
              )}

              {/* Column quick move actions */}
              <div className="flex gap-1 pt-1 border-t border-hairline mt-2 justify-end">
                {colName !== "backlog" && (
                  <button onClick={() => moveCard(c.id, colName === "review" ? "progress" : colName === "done" ? "review" : "backlog")} className="text-[9px] font-bold border border-hairline rounded px-1.5 py-0.5 hover:bg-zinc-50">
                    ← Back
                  </button>
                )}
                {colName !== "done" && (
                  <button onClick={() => moveCard(c.id, colName === "backlog" ? "progress" : colName === "progress" ? "review" : "done")} className="text-[9px] font-bold bg-indigo-500 text-white rounded px-1.5 py-0.5 hover:brightness-105">
                    Next →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* App Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-hairline pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📋</span>
          <div>
            <Eyebrow color="#6366f1">Agent Kanban Pipeline</Eyebrow>
            <h1 className="text-xl font-extrabold text-ink">Agent Kanban Board</h1>
          </div>
        </div>

        <div className="flex gap-2">
          {!isSimulating ? (
            <YellowButton onClick={startSimulation} className="bg-indigo-500 border-indigo-700 text-white hover:brightness-[1.05]">
              Simulate Sprint 🔁
            </YellowButton>
          ) : (
            <GhostButton onClick={stopSimulation} className="text-rose-600 border-rose-400">
              Stop Sprint 🛑
            </GhostButton>
          )}
        </div>
      </div>

      {/* Kanban Board columns layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
        {renderColumn("backlog", "Backlog Pool", "📋")}
        {renderColumn("progress", "In-Progress", "🔨")}
        {renderColumn("review", "Gate/Review", "⚖️")}
        {renderColumn("done", "Completed", "✨")}
      </div>

      {/* Double section footer: Form & Simulated Sprint Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border-t border-hairline pt-4">
        {/* Left pane: Add task card */}
        <Card className="lg:col-span-1">
          <h3 className="text-[13px] font-bold text-ink mb-3">Create Kanban Task Card</h3>
          <form onSubmit={handleCreateCard} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-mute uppercase mb-1">Task Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Build authentication check"
                className="w-full text-[12px] border border-hairline rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-mute uppercase mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full text-[12px] border border-hairline rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-mute uppercase mb-1">Assign Agent</label>
                <select
                  value={newAgent}
                  onChange={(e) => setNewAgent(e.target.value)}
                  className="w-full text-[12px] border border-hairline rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Hermes Planner">Hermes Planner</option>
                  <option value="Hermes Builder">Hermes Builder</option>
                  <option value="Fugu Reviewer">Fugu Reviewer</option>
                </select>
              </div>
            </div>
            <YellowButton className="w-full justify-center bg-indigo-500 border-indigo-700 text-white hover:brightness-[1.05] text-[12px]">
              Add to Backlog +
            </YellowButton>
          </form>
        </Card>

        {/* Right pane: Console logs */}
        <Card className="lg:col-span-2 bg-slate-900 border-none text-slate-100 p-4 font-mono text-[11.5px] h-[190px] overflow-y-auto">
          <h4 className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">
            ⚙️ Sprint Pipeline Console
          </h4>
          <div className="space-y-1">
            {simLog.length === 0 && (
              <div className="text-slate-500 italic">Waiting for sprint simulation parameters...</div>
            )}
            {simLog.map((log, idx) => {
              let color = "text-slate-300";
              if (log.startsWith("[SYSTEM]")) color = "text-indigo-400 font-bold";
              else if (log.startsWith("[BUILDER]")) color = "text-cyan-400";
              else if (log.startsWith("[PLANNER]")) color = "text-amber-400";
              else if (log.startsWith("[REVIEWER]")) color = "text-emerald-400 font-bold";

              return (
                <div key={idx} className={color}>
                  {log}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

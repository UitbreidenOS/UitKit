import { useState, useEffect } from "react";
import { Eyebrow, Card, YellowButton } from "./ui";

interface GoalItem {
  id: string;
  text: string;
  completed: boolean;
  assignedAgent?: string;
  status: "idle" | "in-progress" | "verifying" | "done";
}

interface ProjectGoal {
  title: string;
  description: string;
  items: GoalItem[];
}

const PRESET_GOALS: ProjectGoal[] = [
  {
    title: "🚀 Build UitKit CLI Upgrades",
    description: "Implement priority features for the command-line interface, enabling swift setup loops.",
    items: [
      { id: "1", text: "Create custom installer shell script template", completed: true, status: "done" },
      { id: "2", text: "Wire workspace config generators", completed: true, status: "done" },
      { id: "3", text: "Implement local eval benchmark command structure", completed: false, status: "in-progress", assignedAgent: "Hermes Builder" },
      { id: "4", text: "Conduct agent OS performance test validations", completed: false, status: "idle" },
    ],
  },
  {
    title: "🎨 Complete Portfolio Site Build",
    description: "Launch the developer marketing showcase page with dark mode and active components.",
    items: [
      { id: "p1", text: "Design responsive grid system", completed: true, status: "done" },
      { id: "p2", text: "Add smooth spring page transitions", completed: false, status: "verifying", assignedAgent: "Fugu Judge" },
      { id: "p3", text: "Optimize image loads with lazy loading", completed: false, status: "idle" },
    ],
  },
];

export function GoalModeApp() {
  const [goals, setGoals] = useState<ProjectGoal[]>(PRESET_GOALS);
  const [activeIdx, setActiveIdx] = useState(0);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");

  const [newSubtask, setNewSubtask] = useState("");

  // Load from local storage if existing
  useEffect(() => {
    const saved = localStorage.getItem("uitkit_goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const saveToStorage = (updated: ProjectGoal[]) => {
    setGoals(updated);
    localStorage.setItem("uitkit_goals", JSON.stringify(updated));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newProj: ProjectGoal = {
      title: newGoalTitle,
      description: newGoalDesc || "No description provided.",
      items: [],
    };

    const updated = [...goals, newProj];
    saveToStorage(updated);
    setActiveIdx(updated.length - 1);
    setNewGoalTitle("");
    setNewGoalDesc("");

    // Notify pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: `New Goal Created: ${newProj.title}` }
    }));
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    const updated = [...goals];
    const item: GoalItem = {
      id: Math.random().toString(36).substring(2),
      text: newSubtask,
      completed: false,
      status: "idle",
    };

    updated[activeIdx].items.push(item);
    saveToStorage(updated);
    setNewSubtask("");
  };

  const handleToggleSubtask = (itemId: string) => {
    const updated = [...goals];
    const project = updated[activeIdx];
    const item = project.items.find((i) => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
      item.status = item.completed ? "done" : "idle";
      if (item.completed) {
        item.assignedAgent = undefined;
      }
      saveToStorage(updated);

      // Trigger celebrate animation on Pet if all done
      const allDone = project.items.every((i) => i.completed);
      if (allDone && project.items.length > 0) {
        window.dispatchEvent(new CustomEvent("sidekick_status_change", {
          detail: { status: "done", message: `Amazing! You completed: ${project.title}` }
        }));
      } else {
        window.dispatchEvent(new CustomEvent("sidekick_status_change", {
          detail: { status: "working", message: `Completed task: ${item.text}` }
        }));
      }
    }
  };

  const handleDeleteProject = (idx: number) => {
    const updated = goals.filter((_, i) => i !== idx);
    saveToStorage(updated);
    setActiveIdx(Math.max(0, updated.length - 1));
  };

  const project = goals[activeIdx];

  // Calculate statistics
  const totalItems = project?.items.length || 0;
  const completedItems = project?.items.filter((i) => i.completed).length || 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="h-full flex flex-col md:flex-row gap-5 p-5 overflow-y-auto">
      {/* Sidebar: Projects List & Add project */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <Eyebrow color="#f59e0b">Goal Mode</Eyebrow>
          <h2 className="text-[14px] font-bold text-ink">Active Projects</h2>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {goals.length === 0 && (
              <div className="text-[12px] text-mute italic">No active projects. Create one below.</div>
            )}
            {goals.map((g, idx) => (
              <div
                key={idx}
                className={`group flex items-center justify-between p-2 rounded-lg border text-[12.5px] font-semibold transition cursor-pointer ${
                  activeIdx === idx ? "bg-amber-50 border-amber-200 text-amber-800" : "border-hairline hover:bg-cream"
                }`}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="truncate pr-2">{g.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(idx);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Create new Goal */}
        <Card>
          <h3 className="text-[13px] font-bold text-ink mb-3">Launch New Project Goal</h3>
          <form onSubmit={handleCreateProject} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-mute uppercase mb-1">Title</label>
              <input
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="e.g. Optimize Database index"
                className="w-full text-[12px] border border-hairline rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-mute uppercase mb-1">Description</label>
              <textarea
                value={newGoalDesc}
                onChange={(e) => setNewGoalDesc(e.target.value)}
                placeholder="Brief project details..."
                className="w-full text-[12px] border border-hairline rounded-lg p-2 h-14 outline-none focus:border-amber-500 bg-white resize-none"
              />
            </div>
            <YellowButton className="w-full justify-center bg-amber-500 border-amber-700 text-white hover:brightness-[1.05]">
              Create Goal 🎯
            </YellowButton>
          </form>
        </Card>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {project ? (
          <>
            {/* Project Header card */}
            <Card className="flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-700 font-extrabold text-[11px] px-3 py-1 rounded-bl-xl border-l border-b border-amber-500/20">
                Shared Agent Awareness
              </div>
              <h2 className="text-lg font-bold text-ink">{project.title}</h2>
              <p className="text-[13px] text-body pr-36">{project.description}</p>

              {/* Progress Tracker */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px] font-bold text-ink mb-1.5">
                  <span>Target Progress</span>
                  <span>{progressPercent}% completed ({completedItems}/{totalItems} items)</span>
                </div>
                <div className="w-full bg-zinc-150 h-3.5 rounded-full overflow-hidden border border-hairline">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500 shadow-inner"
                  />
                </div>
              </div>
            </Card>

            {/* Checklist */}
            <Card className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <h3 className="text-[14px] font-bold text-ink">Checklist & Action Items</h3>
                <span className="text-[11px] text-mute font-mono">Shared Brain Context Active</span>
              </div>

              {/* Checklist items */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                {project.items.length === 0 && (
                  <div className="text-center py-10 text-mute text-[13px] italic">
                    No checklist items yet. Add subtasks below to start tracking.
                  </div>
                )}
                {project.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      item.completed
                        ? "bg-zinc-50/50 border-zinc-200/80 opacity-70"
                        : item.status === "in-progress"
                        ? "bg-blue-50/30 border-blue-200 ring-1 ring-blue-200/50"
                        : item.status === "verifying"
                        ? "bg-amber-50/30 border-amber-200 ring-1 ring-amber-200/50"
                        : "bg-white border-hairline hover:bg-zinc-50/20"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleSubtask(item.id)}
                        className="mt-0.5 size-4 accent-amber-500 rounded border-hairline"
                      />
                      <div>
                        <span className={`text-[13px] font-semibold text-ink ${item.completed ? "line-through text-mute" : ""}`}>
                          {item.text}
                        </span>
                        {item.assignedAgent && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-block size-2 rounded-full bg-blue-500 animate-ping"></span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.25 rounded">
                              Assigned Agent: {item.assignedAgent} ({item.status})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "done"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : item.status === "in-progress"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : item.status === "verifying"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-zinc-100 text-mute"
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add checklist item */}
              <form onSubmit={handleAddSubtask} className="flex gap-2 border-t border-hairline pt-3 mt-auto">
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add target subtask..."
                  className="flex-1 text-[12.5px] border border-hairline rounded-lg px-3 py-2 outline-none focus:border-amber-500 bg-white"
                />
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12.5px] px-4 py-2 rounded-lg border-b-2 border-amber-700 active:translate-y-px transition">
                  Add Item +
                </button>
              </form>
            </Card>

            {/* Agent Context Display */}
            <Card className="bg-zinc-950 text-zinc-350 p-4 font-mono text-[11.5px] border-none shadow-md">
              <h4 className="text-[11px] font-bold text-zinc-500 border-b border-zinc-900 pb-1.5 mb-2 uppercase tracking-wider">
                🤖 Agent-OS Goal Memory Stream
              </h4>
              <div className="space-y-1 text-zinc-400">
                <div>[SYSTEM] Goal context loaded to memory vectors.</div>
                <div>[VECTORS] Title: "{project.title}"</div>
                <div>[CONSTRAINTS] Completed items: {completedItems} / {totalItems}</div>
                {project.items.some((i) => i.status === "in-progress" || i.status === "verifying") ? (
                  <div className="text-amber-400 animate-pulse">
                    [ACTIVE] Agent listening... checking active subtasks in loop process.
                  </div>
                ) : (
                  <div className="text-zinc-550">[IDLE] All active tasks parsed. Waiting for next commit trigger.</div>
                )}
              </div>
            </Card>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-mute border border-hairline bg-white/50 rounded-xl p-10">
            <span className="text-5xl mb-3">🎯</span>
            <h3 className="font-bold text-ink">No Active Goal Projects</h3>
            <p className="text-[13px] mt-1 max-w-sm">
              Initialize a project target on the left panel to start tracking goals with agent context sync.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

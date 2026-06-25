import { useState, useEffect } from "react";
import type { WindowManager } from "../useWindows";
import { Eyebrow, YellowButton, GhostButton, Tag, Card } from "./ui";

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

export function HomeApp({ wm }: { wm: WindowManager }) {
  const [activeGoal, setActiveGoal] = useState<ProjectGoal | null>(null);
  const [agentStatus, setAgentStatus] = useState<string>("Active Swarm System Ready");

  useEffect(() => {
    // Sync with Goal Tracker
    const saved = localStorage.getItem("uitkit_goals");
    if (saved) {
      try {
        const goals = JSON.parse(saved);
        if (goals.length > 0) {
          setActiveGoal(goals[0]);
        }
      } catch (_) {}
    }

    // Set dynamic status changes from Sidekick status updates
    const handleStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ status: string; message?: string }>;
      if (customEvent.detail?.message) {
        setAgentStatus(customEvent.detail.message);
      }
    };
    window.addEventListener("sidekick_status_change" as any, handleStatusChange);
    return () => {
      window.removeEventListener("sidekick_status_change" as any, handleStatusChange);
    };
  }, []);

  const totalItems = activeGoal?.items.length || 0;
  const completedItems = activeGoal?.items.filter((i) => i.completed).length || 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Top Banner Dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden border border-zinc-800">
        <div className="absolute top-0 right-0 size-48 bg-gradient-to-br from-emerald-500/15 to-transparent blur-3xl rounded-full" />
        
        <div className="space-y-1 z-10">
          <Eyebrow color="#10b981">Mission Control Dashboard</Eyebrow>
          <h1 className="text-2xl font-extrabold tracking-tight">UitKit Central Hub</h1>
          <div className="flex items-center gap-2 text-[12px] text-zinc-400 mt-1">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{agentStatus}</span>
          </div>
        </div>

        <div className="flex gap-2.5 z-10 w-full md:w-auto">
          <YellowButton onClick={() => wm.open("install")} className="flex-1 md:flex-none justify-center bg-emerald-500 border-emerald-700 hover:brightness-105 text-white">
            Get Started →
          </YellowButton>
          <GhostButton onClick={() => wm.open("goals")} className="flex-1 md:flex-none justify-center border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800">
            View Goals 🎯
          </GhostButton>
        </div>
      </div>

      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Skills Ready", value: "1,000+", icon: "⚡", color: "text-blue-500" },
          { label: "Specialist Agents", value: "700+", icon: "🤖", color: "text-purple-500" },
          { label: "Workspace Stacks", value: "50", icon: "📦", color: "text-emerald-500" },
          { label: "Active Memory Hubs", value: "1 Centralized Core", icon: "🧠", color: "text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-hairline p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-mute uppercase">{stat.label}</div>
              <div className="text-xl font-extrabold text-ink mt-1">{stat.value}</div>
            </div>
            <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Main Grid: Goals integration on left, Quick launch apps on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Active Goals */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <h2 className="text-[14px] font-bold text-ink">Active Project Target Status</h2>
              <Tag color="#f59e0b">Linked Context</Tag>
            </div>

            {activeGoal ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[15px] font-extrabold text-ink">{activeGoal.title}</h3>
                  <p className="text-[12.5px] text-body mt-1">{activeGoal.description}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11.5px] font-bold text-ink">
                    <span>Progress checklist</span>
                    <span>{progressPercent}% ({completedItems}/{totalItems})</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden border border-hairline">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className="bg-amber-500 h-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Checklist preview */}
                <div className="bg-zinc-50 border border-hairline p-3 rounded-xl space-y-1.5 mt-2">
                  <span className="block text-[10px] font-bold text-mute uppercase mb-1">Upcoming milestones</span>
                  {activeGoal.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[12px]">
                      <span className={`font-medium ${item.completed ? "line-through text-mute" : "text-ink"}`}>
                        • {item.text}
                      </span>
                      <span className={`text-[10px] font-bold ${item.completed ? "text-emerald-600" : "text-amber-600"}`}>
                        {item.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-mute py-8">
                <span className="text-4xl mb-2">🎯</span>
                <h4 className="font-bold text-ink text-[13px]">No Active Project Goals</h4>
                <p className="text-[12px] max-w-xs mt-1">
                  Launch a goal project in the Goal Tracker app to sync metrics here.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Mission Control Shortcuts */}
        <Card className="space-y-3">
          <h2 className="text-[14px] font-bold text-ink border-b border-hairline pb-2">Launch Quick Tools</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Loop Engineering 🔁", desc: "Build-Verify iterative loops simulator.", app: "loop-eng" as const },
              { name: "Memory Galaxy 🧠", desc: "One Shared Brain network trace map.", app: "graph" as const },
              { name: "Goal Mode Tracker 🎯", desc: "Set target criteria checklists for agents.", app: "goals" as const },
              { name: "Agent Sidekick Pet 🐾", desc: "Configure appearance, mood and speed.", app: "sidekick-settings" as const },
              { name: "Swarm Sandbox 🤝", desc: "Spawn and audit multi-agent developers.", app: "swarm" as const },
            ].map((tool, i) => (
              <button
                key={i}
                onClick={() => wm.open(tool.app)}
                className="w-full text-left p-3 rounded-xl border border-hairline hover:border-emerald-500/50 hover:bg-cream transition group"
              >
                <div className="text-[12.5px] font-bold text-ink group-hover:text-emerald-600 transition">
                  {tool.name}
                </div>
                <div className="text-[11.5px] text-mute mt-0.5">{tool.desc}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Community Resources */}
      <h2 className="text-lg font-extrabold text-ink border-t border-hairline pt-5">Everything Claude Code Needs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { icon: "⚡", name: "1000+ Skills", desc: "Domain knowledge templates", app: "skills" as const },
          { icon: "🤖", name: "700+ Agents", desc: "Specialist role behavioral modules", app: "agents" as const },
          { icon: "📦", name: "50 Stacks", desc: "Wired developer environments", app: "stacks" as const },
          { icon: "🔌", name: "41 MCP Configs", desc: "Server extensions & file access servers", app: "mcp" as const },
          { icon: "📚", name: "117 Guides", desc: "AOS, looping, learning, news radar", app: "guides" as const },
          { icon: "📜", name: "32 Rules", desc: "Architectural rules checklist", app: "rules" as const },
        ].map((f) => (
          <button
            key={f.name}
            onClick={() => wm.open(f.app)}
            className="text-left rounded-xl border border-hairline bg-white p-3.5 hover:border-olive/70 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-[13px] font-bold text-ink">{f.name}</div>
                <div className="text-[11.5px] text-mute mt-0.5">{f.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

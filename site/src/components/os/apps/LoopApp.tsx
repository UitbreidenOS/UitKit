import { useState, useEffect, useRef } from "react";
import { Eyebrow, Card, YellowButton, GhostButton } from "./ui";

interface LoopStep {
  iteration: number;
  phase: "builder" | "judge" | "done" | "error";
  agent: string;
  action: string;
  thought: string;
  codeSnippet: string;
  status: "success" | "failure" | "pending" | "none";
}

const PRESET_TASKS = [
  {
    name: "Animated Profile Card",
    task: "Build a modern React profile card with hover effects, bio, and tag list.",
    criteria: "1. Must use HSL gradients.\n2. Must have scale-up hover animation.\n3. Must display at least 3 tag labels.",
    steps: [
      {
        iteration: 1,
        phase: "builder" as const,
        agent: "Hermes Builder",
        action: "Generating initial JSX & CSS",
        thought: "Creating standard card structure with CSS layout. Designing the profile image and basic text fields.",
        codeSnippet: `// Iteration 1 Code
const ProfileCard = () => {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <img src="avatar.png" className="w-12 h-12 rounded-full" />
      <h2>Jane Doe</h2>
      <p>Software Engineer</p>
    </div>
  );
};`,
        status: "success" as const,
      },
      {
        iteration: 1,
        phase: "judge" as const,
        agent: "Fugu Judge",
        action: "Evaluating criteria",
        thought: "Testing completion requirements. Gradient is missing (uses bg-white). Hover scale animation is not present. No tags are listed.",
        codeSnippet: `// Iteration 1 Code
const ProfileCard = () => {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <img src="avatar.png" className="w-12 h-12 rounded-full" />
      <h2>Jane Doe</h2>
      <p>Software Engineer</p>
    </div>
  );
};`,
        status: "failure" as const,
      },
      {
        iteration: 2,
        phase: "builder" as const,
        agent: "Hermes Builder",
        action: "Addressing Judge Feedback",
        thought: "I need to replace bg-white with HSL gradients, add a transform hover transition, and map a tags array.",
        codeSnippet: `// Iteration 2 Code
const ProfileCard = () => {
  const tags = ["React", "UI/UX", "Tailwind"];
  return (
    <div className="p-6 bg-gradient-to-br from-[hsl(260,80%,60%)] to-[hsl(290,70%,50%)] rounded-2xl text-white transition-all duration-300 hover:scale-105 shadow-xl">
      <img src="avatar.png" className="w-16 h-16 rounded-full border-2 border-white/50" />
      <h2 className="text-xl font-bold mt-3">Jane Doe</h2>
      <p className="opacity-90">Software Engineer</p>
      <div className="flex gap-1.5 mt-4">
        {tags.map(t => <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-semibold">{t}</span>)}
      </div>
    </div>
  );
};`,
        status: "success" as const,
      },
      {
        iteration: 2,
        phase: "judge" as const,
        agent: "Fugu Judge",
        action: "Re-evaluating criteria",
        thought: "1. Uses HSL gradient: Yes. 2. Hover scale animation: Yes (hover:scale-105). 3. 3 tag labels: Yes (React, UI/UX, Tailwind). All checks passed!",
        codeSnippet: `// Iteration 2 Code
const ProfileCard = () => {
  const tags = ["React", "UI/UX", "Tailwind"];
  return (
    <div className="p-6 bg-gradient-to-br from-[hsl(260,80%,60%)] to-[hsl(290,70%,50%)] rounded-2xl text-white transition-all duration-300 hover:scale-105 shadow-xl">
      <img src="avatar.png" className="w-16 h-16 rounded-full border-2 border-white/50" />
      <h2 className="text-xl font-bold mt-3">Jane Doe</h2>
      <p className="opacity-90">Software Engineer</p>
      <div className="flex gap-1.5 mt-4">
        {tags.map(t => <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-semibold">{t}</span>)}
      </div>
    </div>
  );
};`,
        status: "success" as const,
      },
    ],
  },
  {
    name: "Data Fetching Hook",
    task: "Create a custom React Hook for fetching JSON data with state, cache, and retry mechanism.",
    criteria: "1. Handles error state and loading state.\n2. Must cache responses by URL.\n3. Retry fetching up to 3 times on fail.",
    steps: [
      {
        iteration: 1,
        phase: "builder" as const,
        agent: "Hermes Builder",
        action: "Designing useFetch Hook",
        thought: "Writing useEffect fetch logic with loading, data, and error state. Storing results in cache memory.",
        codeSnippet: `// Iteration 1 Hook
const cache = {};
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache[url]) {
      setData(cache[url]);
      setLoading(false);
      return;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        cache[url] = data;
        setData(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
}`,
        status: "success" as const,
      },
      {
        iteration: 1,
        phase: "judge" as const,
        agent: "Fugu Judge",
        action: "Validating hook requirements",
        thought: "Loading/error states: Yes. Cache: Yes. Retry logic: Missing. When network error occurs, it instantly throws without retry.",
        codeSnippet: `// Iteration 1 Hook
// ... cache code ...`,
        status: "failure" as const,
      },
      {
        iteration: 2,
        phase: "builder" as const,
        agent: "Hermes Builder",
        action: "Adding Retry Mechanism",
        thought: "Implementing recursive retry runner that fires up to 3 times before failing the state.",
        codeSnippet: `// Iteration 2 Hook
const cache = {};
export function useFetch(url, retries = 3) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (cache[url]) {
      setData(cache[url]);
      setLoading(false);
      return;
    }
    
    const fetchWithRetry = (attempt) => {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("HTTP error");
          return res.json();
        })
        .then(data => {
          if (!active) return;
          cache[url] = data;
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          if (!active) return;
          if (attempt > 1) {
            fetchWithRetry(attempt - 1);
          } else {
            setError(err);
            setLoading(false);
          }
        });
    };

    setLoading(true);
    fetchWithRetry(retries);
    return () => { active = false; };
  }, [url, retries]);

  return { data, loading, error };
}`,
        status: "success" as const,
      },
      {
        iteration: 2,
        phase: "judge" as const,
        agent: "Fugu Judge",
        action: "Validating retry flow",
        thought: "1. States handled: Yes. 2. Cache: Yes. 3. Retry 3 times: Yes, decrementing attempts works correctly and halts on successful response. Passed!",
        codeSnippet: `// Iteration 2 Hook ...`,
        status: "success" as const,
      },
    ],
  },
];

export function LoopApp() {
  const [selectedTask, setSelectedTask] = useState(PRESET_TASKS[0]);
  const [customTask, setCustomTask] = useState("");
  const [customCriteria, setCustomCriteria] = useState("");
  const [isUsingCustom, setIsUsingCustom] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState("");
  const [activeNode, setActiveNode] = useState<"input" | "builder" | "judge" | "done" | "none">("none");

  const runTimer = useRef<NodeJS.Timeout | null>(null);

  const taskName = isUsingCustom ? "Custom Task" : selectedTask.name;
  const taskDesc = isUsingCustom ? customTask : selectedTask.task;
  const taskCrit = isUsingCustom ? customCriteria : selectedTask.criteria;

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIdx(0);
    setLogs(["[SYSTEM] Initiating Swarm Loop Engine...", `[TASK] "${taskDesc}"`]);
    setCodeOutput("");
    setActiveNode("input");

    // Clear settings and send status update to Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Starting loop execution!" }
    }));
  };

  const handleStop = () => {
    if (runTimer.current) clearTimeout(runTimer.current);
    setIsRunning(false);
    setActiveNode("none");
    setCurrentStepIdx(-1);
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "idle", message: "Loop execution stopped." }
    }));
  };

  useEffect(() => {
    if (!isRunning || currentStepIdx < 0) return;

    const steps = isUsingCustom ? generateMockSteps(customTask, customCriteria) : selectedTask.steps;

    if (currentStepIdx >= steps.length) {
      // Completed loop!
      setActiveNode("done");
      setLogs((prev) => [...prev, "[SYSTEM] 🎉 All verification criteria met. Task complete!", "[SYSTEM] Saved final build output."]);
      setIsRunning(false);
      
      // Notify Pet
      window.dispatchEvent(new CustomEvent("sidekick_status_change", {
        detail: { status: "done", message: "All checks passed! Great job." }
      }));
      return;
    }

    const step = steps[currentStepIdx];
    
    // Set active node
    setActiveNode(step.phase === "builder" ? "builder" : "judge");

    // Add status message to Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { 
        status: step.phase === "builder" ? "working" : "thinking", 
        message: `${step.agent} is processing...` 
      }
    }));

    // Perform logs update with a small delay
    const t = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${step.agent.toUpperCase()}] Phase: ${step.action}`,
        `[THOUGHT] ${step.thought}`,
        `[STATUS] ${step.status === "success" ? "✓ Done" : "✗ Criteria Missing/Failed"}`
      ]);
      setCodeOutput(step.codeSnippet);

      // Increment step
      setCurrentStepIdx(currentStepIdx + 1);
    }, 3000);

    runTimer.current = t;
    return () => clearTimeout(t);
  }, [isRunning, currentStepIdx]);

  // Fallback dynamic generator for custom task loops
  const generateMockSteps = (task: string, crit: string): LoopStep[] => {
    return [
      {
        iteration: 1,
        phase: "builder",
        agent: "Hermes Builder",
        action: "Scaffolding requirements",
        thought: `Generating base implementation for ${task.substring(0, 40)}...`,
        codeSnippet: `// Scaffolding...\nexport default function CustomApp() {\n  return <div>Stub for ${task}</div>;\n}`,
        status: "success",
      },
      {
        iteration: 1,
        phase: "judge",
        agent: "Fugu Judge",
        action: "Verifying: " + crit.split("\n")[0],
        thought: "Initial boilerplate lacks custom logic details.",
        codeSnippet: `// Scaffolding...\nexport default function CustomApp() {\n  return <div>Stub for ${task}</div>;\n}`,
        status: "failure",
      },
      {
        iteration: 2,
        phase: "builder",
        agent: "Hermes Builder",
        action: "Refining custom logic",
        thought: "Injecting UI and behavior metrics according to review feedback.",
        codeSnippet: `// Custom Build\nexport default function CustomApp() {\n  return (\n    <div className="p-8 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-750">\n      <h1 className="text-xl font-bold">Dynamic Component</h1>\n      <p className="mt-2 text-zinc-400">Created: ${task}</p>\n      <button className="mt-4 px-4 py-2 bg-emerald-500 rounded font-semibold hover:bg-emerald-600">Action</button>\n    </div>\n  );\n}`,
        status: "success",
      },
      {
        iteration: 2,
        phase: "judge",
        agent: "Fugu Judge",
        action: "Final criteria verification",
        thought: "Validating user parameters. All requirements satisfied.",
        codeSnippet: `// Custom Build\nexport default function CustomApp() {\n  return (\n    <div className="p-8 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-750">\n      <h1 className="text-xl font-bold">Dynamic Component</h1>\n      <p className="mt-2 text-zinc-400">Created: ${task}</p>\n      <button className="mt-4 px-4 py-2 bg-emerald-500 rounded font-semibold hover:bg-emerald-600">Action</button>\n    </div>\n  );\n}`,
        status: "success",
      },
    ];
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-5 p-5 overflow-y-auto">
      {/* Left panel: configurations */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0">
        <Card className="flex flex-col gap-3">
          <Eyebrow color="#ef4444">Loop Engineering</Eyebrow>
          <h2 className="text-[14px] font-bold text-ink">Choose Target Task</h2>
          
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setIsUsingCustom(false)}
              className={`flex-1 py-1 px-3 text-[11px] font-bold border rounded-lg ${!isUsingCustom ? "bg-zinc-100 border-zinc-300" : "border-hairline"}`}
            >
              Presets
            </button>
            <button
              onClick={() => setIsUsingCustom(true)}
              className={`flex-1 py-1 px-3 text-[11px] font-bold border rounded-lg ${isUsingCustom ? "bg-zinc-100 border-zinc-300" : "border-hairline"}`}
            >
              Custom
            </button>
          </div>

          {!isUsingCustom ? (
            <div className="flex flex-col gap-2">
              {PRESET_TASKS.map((t) => (
                <button
                  key={t.name}
                  disabled={isRunning}
                  onClick={() => setSelectedTask(t)}
                  className={`w-full text-left p-2.5 rounded-lg border text-[12px] font-semibold transition ${
                    selectedTask.name === t.name ? "bg-red-50 border-red-200 text-red-700" : "border-hairline hover:bg-cream"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-mute uppercase mb-1">Prompt Task</label>
                <textarea
                  disabled={isRunning}
                  value={customTask}
                  onChange={(e) => setCustomTask(e.target.value)}
                  placeholder="e.g. Build an HSL color-picker component..."
                  className="w-full text-[12px] border border-hairline rounded-lg p-2 h-20 outline-none focus:border-red-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-mute uppercase mb-1">Verify Criteria</label>
                <textarea
                  disabled={isRunning}
                  value={customCriteria}
                  onChange={(e) => setCustomCriteria(e.target.value)}
                  placeholder="e.g. 1. Includes copy button.&#10;2. Changes body color."
                  className="w-full text-[12px] border border-hairline rounded-lg p-2 h-16 outline-none focus:border-red-500 bg-white"
                />
              </div>
            </div>
          )}

          <div className="border-t border-hairline my-2 pt-2">
            <h3 className="text-[11px] font-bold text-mute uppercase">Task Detail</h3>
            <p className="text-[12px] text-body mt-1 italic">"{taskDesc}"</p>
            <h3 className="text-[11px] font-bold text-mute uppercase mt-3">Target Completion Checklist</h3>
            <pre className="text-[11.5px] font-medium text-ink mt-1 whitespace-pre-line bg-cream p-2 rounded-lg border border-hairline font-mono">
              {taskCrit}
            </pre>
          </div>

          <div className="flex gap-2 mt-2">
            {!isRunning ? (
              <YellowButton onClick={handleStart} className="flex-1 justify-center bg-red-500 border-red-700 text-white hover:brightness-[1.05]">
                Start Loop 🔁
              </YellowButton>
            ) : (
              <GhostButton onClick={handleStop} className="flex-1 justify-center text-red-600 border-red-400">
                Stop Loop 🛑
              </GhostButton>
            )}
          </div>
        </Card>
      </div>

      {/* Right panel: Visualization & Logs */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Animated Loop Diagram */}
        <Card className="flex flex-col gap-3 relative overflow-hidden bg-slate-50/50">
          <h3 className="text-[12px] font-bold text-ink">Active Swarm Loop Visualization</h3>
          
          <div className="flex items-center justify-around py-6 relative">
            {/* SVG connections overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              {/* Loop line Input -> Builder */}
              <line x1="20%" y1="50%" x2="45%" y2="50%" stroke="#e2e8f0" strokeWidth="3" />
              {/* Loop line Builder -> Judge */}
              <line x1="55%" y1="50%" x2="80%" y2="50%" stroke="#e2e8f0" strokeWidth="3" />
              
              {/* Dynamic feedback loop line (underneath arrow going back) */}
              <path d="M 80% 55% A 100 40 0 0 1 50% 55%" fill="none" stroke={activeNode === "builder" && currentStepIdx > 1 ? "#3b82f6" : "#e2e8f0"} strokeWidth="3" strokeDasharray={activeNode === "builder" ? "5,5" : "none"} className={activeNode === "builder" ? "animate-[dash_2s_linear_infinite]" : ""} />

              {/* Success glowing line to Done */}
              {activeNode === "done" && (
                <line x1="80%" y1="50%" x2="95%" y2="50%" stroke="#10b981" strokeWidth="4" className="animate-pulse" />
              )}
            </svg>

            {/* Nodes */}
            <div className={`z-10 flex flex-col items-center p-3 rounded-xl border-2 transition shadow-md bg-white ${
              activeNode === "input" ? "border-amber-500 scale-105" : "border-hairline"
            }`}>
              <span className="text-2xl">📥</span>
              <span className="text-[11px] font-bold text-ink mt-1">User Goal</span>
            </div>

            <div className={`z-10 flex flex-col items-center p-3 rounded-xl border-2 transition shadow-md bg-white w-28 text-center ${
              activeNode === "builder" ? "border-blue-500 bg-blue-50/20 scale-110 ring-4 ring-blue-100" : "border-hairline"
            }`}>
              <span className="text-2xl">🤖</span>
              <span className="text-[11px] font-bold text-ink mt-1">Hermes Builder</span>
              <span className="text-[9px] text-mute">Generating...</span>
            </div>

            <div className={`z-10 flex flex-col items-center p-3 rounded-xl border-2 transition shadow-md bg-white w-28 text-center ${
              activeNode === "judge" ? "border-amber-500 bg-amber-50/20 scale-110 ring-4 ring-amber-100" : "border-hairline"
            }`}>
              <span className="text-2xl">⚖️</span>
              <span className="text-[11px] font-bold text-ink mt-1">Fugu Judge</span>
              <span className="text-[9px] text-mute">Verifying Code</span>
            </div>

            <div className={`z-10 flex flex-col items-center p-3 rounded-xl border-2 transition shadow-md bg-white ${
              activeNode === "done" ? "border-emerald-500 bg-emerald-50/30 scale-110 animate-bounce" : "border-hairline opacity-60"
            }`}>
              <span className="text-2xl">🎉</span>
              <span className="text-[11px] font-bold text-ink mt-1">Goal Met!</span>
            </div>
          </div>
        </Card>

        {/* Double column: Logs on left, generated code on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[250px]">
          {/* Logs */}
          <Card className="flex flex-col gap-2 bg-slate-900 border-none text-slate-100 p-4 font-mono text-[12px] h-[320px] overflow-y-auto">
            <h4 className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1 mb-1 uppercase tracking-wider">Swarm Engine Console</h4>
            <div className="flex-1 space-y-1">
              {logs.length === 0 && (
                <div className="text-slate-500 italic">Waiting for loop execution to begin...</div>
              )}
              {logs.map((log, idx) => {
                let color = "text-slate-300";
                if (log.startsWith("[SYSTEM]")) color = "text-emerald-400 font-bold";
                else if (log.startsWith("[TASK]")) color = "text-blue-300";
                else if (log.startsWith("[THOUGHT]")) color = "text-slate-400 pl-4 italic";
                else if (log.startsWith("[STATUS] ✓")) color = "text-emerald-500 pl-4 font-bold";
                else if (log.startsWith("[STATUS] ✗")) color = "text-rose-400 pl-4 font-bold";

                return (
                  <div key={idx} className={color}>
                    {log}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Code Viewer */}
          <Card className="flex flex-col gap-2 bg-zinc-950 text-zinc-350 p-4 font-mono text-[12px] h-[320px] overflow-y-auto">
            <h4 className="text-[11px] font-bold text-zinc-500 border-b border-zinc-800 pb-1 mb-1 uppercase tracking-wider">Active Code Output</h4>
            {codeOutput ? (
              <pre className="text-[12px] text-zinc-100 whitespace-pre-wrap">{codeOutput}</pre>
            ) : (
              <div className="text-zinc-600 italic">No code generated yet. Run the loop engine to populate.</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

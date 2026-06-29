import { useState } from "react";
import { Eyebrow, Card } from "./ui";

interface BenchmarkMetric {
  name: string;
  unit: string;
  withoutPonytail: number;
  withPonytail: number;
  prefix?: string;
  suffix?: string;
  higherIsBetter: boolean;
}

const BENCHMARKS: BenchmarkMetric[] = [
  { name: "Code Volume Generated", unit: "lines", withoutPonytail: 382, withPonytail: 175, suffix: " lines", higherIsBetter: false },
  { name: "Context Tokens Consumed", unit: "tokens", withoutPonytail: 48500, withPonytail: 37830, suffix: " tokens", higherIsBetter: false },
  { name: "API Cost per Task", unit: "cost", withoutPonytail: 0.74, withPonytail: 0.59, prefix: "$", higherIsBetter: false },
  { name: "Task Execution Speed", unit: "seconds", withoutPonytail: 42, withPonytail: 31, suffix: "s", higherIsBetter: false }
];

const LADDER_STEPS = [
  { step: 1, title: "YAGNI Check", subtitle: "Does it need to exist?", desc: "Verify if the requested feature is actually required or if it constitutes premature optimization / scope creep.", icon: "❌" },
  { step: 2, title: "Codebase Search", subtitle: "Already in project?", desc: "AST-trace files to see if a utility, function, or configuration already matches the required logic.", icon: "🔍" },
  { step: 3, title: "Standard Library", subtitle: "Built into language?", desc: "Check standard library primitives (e.g. Node path, python itertools) before introducing external files.", icon: "📦" },
  { step: 4, title: "Platform Features", subtitle: "Native browser capabilities?", desc: "Prefer native browser tools (like HTML5 validation, simple CSS grid) over bloated JS UI libraries.", icon: "🌐" },
  { step: 5, title: "Installed Dependencies", subtitle: "Existing tool covers it?", desc: "Ensure packages already present in package.json/requirements.txt are reused fully.", icon: "🧩" },
  { step: 6, title: "The 1-Line Challenge", subtitle: "Can it be a one-liner?", desc: "Determine if the feature can be composed elegantly in a single command, hook, or functional line.", icon: "⚡" }
];

export function PonytailApp() {
  const [intensity, setIntensity] = useState<"Lite" | "Full" | "Ultra">("Full");
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = () => {
    setIsAuditing(true);
    setAuditLogs(["Initializing /ponytail-audit scan..."]);
    
    const logs = [
      "Scanning workspace files...",
      "Found static dataset in ShowcaseApp.tsx (1,059 lines) -> Flagged as over-engineered context.",
      "Recommending JSON externalization for features array (Saves ~900 lines of token context).",
      "Analyzing dependencies in package.json...",
      "Identified duplicate state sync utilities in local roadmap components.",
      "Auditing complete: 3 critical YAGNI recommendations generated.",
      "Simulated savings: 22% less token weight in subsequent task runs."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setAuditLogs((prev) => [...prev, `$ ${log}`]);
        if (index === logs.length - 1) {
          setIsAuditing(false);
          window.dispatchEvent(new CustomEvent("sidekick_status_change", {
            detail: { status: "happy", message: "YAGNI audit completed successfully! 💇" }
          }));
        }
      }, (index + 1) * 600);
    });
  };

  const getIntensityScalar = () => {
    if (intensity === "Lite") return 0.85;
    if (intensity === "Ultra") return 0.35;
    return 0.54; // Full is base
  };

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-4xl">💇</span>
          <div>
            <Eyebrow color="#a855f7">Lazy Senior Developer Skill</Eyebrow>
            <h1 className="text-xl font-extrabold text-ink">Ponytail YAGNI Optimizer</h1>
          </div>
        </div>

        {/* Intensity Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-mute uppercase">Intensity:</span>
          <div className="flex bg-zinc-100 rounded-lg p-0.5 border border-hairline">
            {(["Lite", "Full", "Ultra"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setIntensity(level)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  intensity === level
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-mute hover:text-ink"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[12px] text-mute leading-relaxed max-w-2xl">
        Inspired by the open-source **DietrichGebert/ponytail** repository. Ponytail forces coding agents to follow a 
        decision ladder to prevent code bloat, reduce tokens, and bypass over-engineering before writing any new lines.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1">
        {/* Left Side: Decision Ladder */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-[13px] font-bold text-ink mb-1">The YAGNI Decision Ladder</h3>
            <div className="grid grid-cols-2 gap-2">
              {LADDER_STEPS.map((step) => {
                const isSelected = selectedStep === step.step;
                return (
                  <button
                    key={step.step}
                    onClick={() => setSelectedStep(step.step)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-purple-50/40 border-purple-500/50 shadow-sm ring-1 ring-purple-500/20"
                        : "bg-white border-hairline hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Step 0{step.step}</span>
                      <span className="text-[14px]">{step.icon}</span>
                    </div>
                    <h4 className="text-[12.5px] font-extrabold text-ink mt-1 truncate">{step.title}</h4>
                    <p className="text-[11px] text-mute truncate mt-0.5">{step.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Detail Card */}
          {selectedStep && (
            <Card className="border border-purple-100 bg-purple-50/10 p-4">
              <h4 className="text-[12.5px] font-bold text-purple-700 flex items-center gap-1.5">
                <span>{LADDER_STEPS[selectedStep - 1].icon}</span>
                <span>Step {selectedStep}: {LADDER_STEPS[selectedStep - 1].title}</span>
              </h4>
              <p className="text-[11.5px] text-zinc-600 font-semibold mt-1 italic">
                "{LADDER_STEPS[selectedStep - 1].subtitle}"
              </p>
              <p className="text-[12px] text-body mt-2 leading-relaxed">
                {LADDER_STEPS[selectedStep - 1].desc}
              </p>
            </Card>
          )}
        </div>

        {/* Right Side: Benchmarking Dashboard & simulated Audit */}
        <div className="space-y-4 flex flex-col justify-between">
          <Card className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-hairline pb-2 mb-3">
                <h3 className="text-[13px] font-bold text-ink">Reproducible Benchmarks</h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Interactive Chart
                </span>
              </div>

              <div className="space-y-3">
                {BENCHMARKS.map((m) => {
                  const scalar = getIntensityScalar();
                  const targetVal = Math.round(m.withoutPonytail * scalar * 100) / 100;
                  const savings = Math.round(((m.withoutPonytail - targetVal) / m.withoutPonytail) * 100);

                  return (
                    <div key={m.name} className="text-[11.5px]">
                      <div className="flex justify-between text-ink font-semibold">
                        <span>{m.name}</span>
                        <span className="text-purple-600 font-bold">
                          {m.prefix}{targetVal}{m.suffix} (Saves {savings}%)
                        </span>
                      </div>
                      
                      {/* Bar comparison */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden relative">
                          {/* Baseline bar */}
                          <div className="bg-zinc-300 h-full absolute left-0 top-0 transition-all duration-300" style={{ width: "100%" }} />
                          {/* Optimized bar */}
                          <div className="bg-purple-500 h-full absolute left-0 top-0 transition-all duration-300" style={{ width: `${(targetVal / m.withoutPonytail) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-mute w-12 text-right shrink-0">
                          {m.prefix}{m.withoutPonytail}{m.suffix}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run /ponytail-audit simulation */}
            <div className="mt-4 pt-3 border-t border-hairline">
              <button
                disabled={isAuditing}
                onClick={runAudit}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-[12px] font-bold rounded-lg border-b-2 border-purple-800 transition active:scale-[0.98]"
              >
                {isAuditing ? "Auditing Repository..." : "Run Simulated /ponytail-audit"}
              </button>
            </div>
          </Card>

          {/* Audit Logs output */}
          {auditLogs.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden text-zinc-300 font-mono text-[11px] h-[130px] shrink-0">
              <div className="bg-zinc-850 px-3 py-1.5 border-b border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
                <span>Ponytail Audit Logger</span>
                {isAuditing && <span className="size-2 rounded-full bg-purple-500 animate-ping" />}
              </div>
              <div className="p-3 overflow-y-auto space-y-1 select-text">
                {auditLogs.map((log, index) => (
                  <div key={index} className={log.includes("recommending") ? "text-purple-400" : log.includes("Saving") ? "text-emerald-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

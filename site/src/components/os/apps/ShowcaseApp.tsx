import { useState } from "react";
import { Eyebrow } from "./ui";

interface Feature {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  desc: string;
  how: string;
  example: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: "night-shift",
    icon: "🌙",
    name: "Night Shift",
    tagline: "Autonomous batch processor",
    desc: "Executes massive multi-file refactors unsupervised. Manages context limits and API rate limits by processing files one by one from a queue.",
    how: "Creates a BATCH_QUEUE.md, processes each file individually, marks them done, and handles rate limits automatically. Designed for 3+ hour sessions.",
    example: "$ /night-shift Migrate all .js files in src/utils to TypeScript\n→ Creates BATCH_QUEUE.md with 50 files\n→ Processing file 1/50: auth.js ✓\n→ Processing file 2/50: helpers.js ✓\n→ ... (handles rate limits with auto-pause)",
    color: "#1d4aff",
  },
  {
    id: "shadow-compiler",
    icon: "👻",
    name: "Shadow Compiler",
    tagline: "Zero-hallucination type safety",
    desc: "Silently runs the project's compiler in the background after every edit. Catches syntax errors, missing imports, and type violations before the task is marked complete.",
    how: "PostToolUse hook fires after every file write. Runs tsc --noEmit, cargo check, ruff check, or go build depending on file extension. Feeds errors back to Claude for auto-correction.",
    example: "// Claude edits auth.ts\n// Shadow Compiler fires silently:\n//   ✗ Property 'usre' does not exist on type 'User'\n// Claude sees the error and fixes it before you notice.",
    color: "#3fb950",
  },
  {
    id: "sonar",
    icon: "📡",
    name: "Sonar",
    tagline: "Fast AST codebase cartographer",
    desc: "Maps massive codebases into condensed satellite views — classes, functions, exports — without reading full file bodies. Saves thousands of tokens on enterprise monoliths.",
    how: "Uses grep/ripgrep to extract only signatures and exports from thousands of files. Synthesizes a hierarchical CODEBASE_MAP.md for efficient navigation.",
    example: "$ /sonar\n→ Scanning 4,500 files...\n→ Extracted 12,000 signatures\n→ Created CODEBASE_MAP.md (300 lines)\n→ \"I can now navigate your monolith without blowing up context!\"",
    color: "#1078a3",
  },
  {
    id: "tribunal",
    icon: "⚖️",
    name: "Tribunal Review",
    tagline: "3-agent adversarial PR review",
    desc: "Spawns three specialized reviewers against your code: a security hacker, a performance junkie, and a senior pedant. Synthesizes all findings into one brutal review.",
    how: "Orchestrator spawns security-hacker, performance-junkie, and senior-pedant agents sequentially. Each reviews the same diff with adversarial perspective. Results synthesized into structured PR comment.",
    example: "$ /tribunal-review Check auth.js\n\n⚖️ The Tribunal Review:\n🛡️ Security: Timing attack in password compare (line 42)\n⚡ Performance: N+1 in user lookup loop\n📐 Standards: console.log left in production (line 88)",
    color: "#b62ad9",
  },
  {
    id: "bisect-bug",
    icon: "🔬",
    name: "Time-Travel Debugger",
    tagline: "Git bisect automated bug finder",
    desc: "Reports a regression, provides a good commit, and Claude autonomously bisects through git history to find the exact commit that broke it. Explains why and proposes the fix.",
    how: "Writes a deterministic test script, runs git bisect with automated binary search through history, identifies the offending commit, reads the diff, and proposes a fix.",
    example: "$ /bisect-bug Login returns 500. Was working in a1b2c3d.\n→ Writing bisect-test.sh...\n→ Running git bisect through 47 commits...\n→ Found it! Commit f9e8d7c by Jane Doe\n→ \"Removed await before database call\" — Shall I fix it?",
    color: "#f54e00",
  },
];

export function ShowcaseApp() {
  const [selected, setSelected] = useState(FEATURES[0]);

  return (
    <div className="flex h-full">
      <div className="w-[200px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#f54e00">Showcase</Eyebrow>
        <div className="mt-3 space-y-1">
          {FEATURES.map((f) => (
            <button key={f.id} onClick={() => setSelected(f)}
              className={`w-full text-left rounded-md px-2.5 py-2 text-[12px] transition ${selected.id === f.id ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}>
              <span className="mr-1.5">{f.icon}</span> {f.name}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-hairline bg-white p-3">
          <div className="text-[11px] font-bold text-ink">Why Showcase?</div>
          <p className="mt-1 text-[11px] text-mute leading-relaxed">These are Claudient's most advanced capabilities — features that combine skills, hooks, and agents into powerful workflows.</p>
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="grid place-items-center size-12 rounded-xl text-2xl" style={{ backgroundColor: selected.color + "1a" }}>
            {selected.icon}
          </div>
          <div>
            <Eyebrow color={selected.color}>{selected.tagline}</Eyebrow>
            <h2 className="text-xl font-bold text-ink">{selected.name}</h2>
          </div>
        </div>
        <p className="text-[14px] text-body leading-relaxed mb-5">{selected.desc}</p>
        <div className="mb-5">
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">How it works</div>
          <p className="text-[13px] text-body leading-relaxed">{selected.how}</p>
        </div>
        <div>
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Example</div>
          <pre className="rounded-lg bg-[#1d1f27] text-[#e6e6e6] p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {selected.example}
          </pre>
        </div>
      </div>
    </div>
  );
}

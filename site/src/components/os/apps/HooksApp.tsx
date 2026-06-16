import { useState } from "react";
import { Eyebrow } from "./ui";

interface Hook {
  name: string;
  event: string;
  desc: string;
}

const HOOKS: Hook[] = [
  // PreToolUse
  { name: "Auto-Allow Readonly", event: "PreToolUse", desc: "Auto-approves read-only operations to reduce friction." },
  { name: "Block Dangerous", event: "PreToolUse", desc: "Blocks dangerous operations (rm -rf, DROP TABLE) before execution." },
  { name: "Git Push Confirm", event: "PreToolUse", desc: "Requires explicit confirmation before pushing to remote." },
  { name: "Injection Scanner", event: "PreToolUse", desc: "Detects prompt injection attempts in tool inputs." },
  { name: "Lint Check", event: "PreToolUse", desc: "Runs linter before file writes to catch style issues early." },
  { name: "Memory Injector", event: "PreToolUse", desc: "Injects relevant context memory into tool executions." },
  { name: "Secret Scanner", event: "PreToolUse", desc: "Prevents accidental secrets in code before write." },
  { name: "WhatsApp Permission", event: "PreToolUse", desc: "Requires user approval before sending WhatsApp messages." },
  // PostToolUse
  { name: "Agent Comms", event: "PostToolUse", desc: "Logs inter-agent communication for audit trail." },
  { name: "Audit Log", event: "PostToolUse", desc: "Immutable log of every tool execution with timestamps." },
  { name: "Auto Git Stage", event: "PostToolUse", desc: "Automatically stages modified files after edits." },
  { name: "Auto TDD", event: "PostToolUse", desc: "Runs tests automatically after code changes." },
  { name: "Output Size Warn", event: "PostToolUse", desc: "Warns when tool output exceeds token budget." },
  { name: "Prettier", event: "PostToolUse", desc: "Auto-formats code after file writes." },
  { name: "Shadow Compiler", event: "PostToolUse", desc: "Silent type-checking — catches errors before task completion." },
  { name: "TDD Guard", event: "PostToolUse", desc: "Ensures tests exist before marking features complete." },
  { name: "Telegram PR Notify", event: "PostToolUse", desc: "Sends PR notifications to Telegram channel." },
  { name: "Test Runner", event: "PostToolUse", desc: "Runs relevant test suite after code modifications." },
  // Lifecycle
  { name: "Session Start", event: "Lifecycle", desc: "Loads project context and preferences at session start." },
  { name: "Session Retro", event: "Lifecycle", desc: "Generates session summary with lessons learned." },
  { name: "Daily Summary", event: "Lifecycle", desc: "End-of-day summary of all completed work." },
  { name: "Cost Tracker", event: "Lifecycle", desc: "Tracks token usage and cost per session." },
  { name: "Bug Logger", event: "Lifecycle", desc: "Auto-logs discovered bugs to issue tracker." },
  { name: "Env Injector", event: "Lifecycle", desc: "Injects environment variables into session context." },
  { name: "Keepalive Poke", event: "Lifecycle", desc: "Prevents session timeout during long operations." },
  { name: "Plannotator", event: "Lifecycle", desc: "Annotates plan files with execution status." },
  { name: "Pre-Compact Save", event: "Lifecycle", desc: "Saves critical context before compaction." },
  { name: "Session Context Loader", event: "Lifecycle", desc: "Restores context from previous sessions." },
  { name: "Transcript Backup", event: "Lifecycle", desc: "Backs up conversation transcript on session end." },
  // Notification
  { name: "Desktop Notify", event: "Notification", desc: "OS-level desktop notifications for task completion." },
  { name: "Rate Limit Handler", event: "Notification", desc: "Auto-pauses on rate limits with exponential backoff." },
  { name: "Slack Notify", event: "Notification", desc: "Posts task updates to Slack channels." },
  { name: "Sound System", event: "Notification", desc: "Audio cues for task completion and errors." },
  { name: "TTS Announcer", event: "Notification", desc: "Text-to-speech announcements for visually impaired users." },
  { name: "NTFY Push", event: "Notification", desc: "Push notifications via ntfy.sh to mobile devices." },
  // Advanced
  { name: "Agent Hook Reviewer", event: "Advanced", desc: "AI-powered review of hook outputs for quality." },
  { name: "HTTP Hook Webhook", event: "Advanced", desc: "Sends hook events as webhooks to external services." },
  { name: "Prompt Hook Guard", event: "Advanced", desc: "Validates prompt safety before agent execution." },
  // Context
  { name: "File Changed Reload", event: "Context", desc: "Auto-reloads context when external file changes detected." },
  { name: "Pre-Compact Snapshot", event: "Context", desc: "Creates context snapshot before memory compaction." },
  // Permission
  { name: "Permission Denied Alert", event: "Permission", desc: "Alerts user when tool permission is denied." },
  { name: "Permission Request Audit", event: "Permission", desc: "Audits all permission requests for security review." },
  // Subagent
  { name: "Subagent Start Logger", event: "Subagent", desc: "Logs subagent spawn events with parameters." },
  { name: "Subagent Stop Summary", event: "Subagent", desc: "Summarizes subagent results on completion." },
  // Top-level
  { name: "Audit Logger", event: "Top-level", desc: "Central audit log for compliance (SOC2/GDPR)." },
  { name: "Cost Cap Enforcer", event: "Top-level", desc: "Stops execution when cost budget is exceeded." },
  { name: "PII Scanner", event: "Top-level", desc: "Detects personally identifiable information in outputs." },
  { name: "Usage Tracker", event: "Top-level", desc: "Tracks cumulative usage across sessions." },
];

const EVENT_COLORS: Record<string, string> = {
  PreToolUse: "#1d4aff",
  PostToolUse: "#3fb950",
  Lifecycle: "#f5b800",
  Notification: "#b62ad9",
  Advanced: "#f54e00",
  Context: "#1078a3",
  Permission: "#ef4444",
  Subagent: "#76786c",
  "Top-level": "#151515",
};

export function HooksApp() {
  const events = ["All", ...new Set(HOOKS.map((h) => h.event))];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? HOOKS : HOOKS.filter((h) => h.event === filter);
  const eventCounts = events.map((e) => ({ name: e, count: e === "All" ? HOOKS.length : HOOKS.filter((h) => h.event === e).length }));

  return (
    <div className="flex h-full">
      <div className="w-[180px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow>Event Type</Eyebrow>
        <div className="mt-3 space-y-0.5">
          {eventCounts.map((e) => (
            <button
              key={e.name}
              onClick={() => setFilter(e.name)}
              className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] flex items-center justify-between transition ${filter === e.name ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}
            >
              <span>{e.name}</span>
              <span className="text-[10px] text-mute font-mono">{e.count}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-ink text-[11px] text-[#e6e6e6] p-3 font-mono leading-relaxed">
          <div className="text-brand-yellow">~/.claude/settings.json</div>
          <div className="mt-1 text-mute">{"{"}</div>
          <div className="pl-2">"hooks": {"{"}</div>
          <div className="pl-4">"PostToolUse": [...]</div>
          <div className="pl-2">{"}"}</div>
          <div className="text-mute">{"}"}</div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Eyebrow color="#1078a3">Hooks System</Eyebrow>
            <h2 className="text-lg font-bold text-ink mt-1">{filtered.length} hooks{filter !== "All" ? ` — ${filter}` : ""}</h2>
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map((h) => (
            <div key={h.name} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: EVENT_COLORS[h.event] || "#76786c" }}>
                  {h.event}
                </span>
                <span className="text-[13px] font-bold text-ink">{h.name}</span>
              </div>
              <p className="mt-1 text-[12px] text-mute leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

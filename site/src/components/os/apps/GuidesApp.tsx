import { useState, useMemo } from "react";
import { Eyebrow, Tag } from "./ui";

interface Guide {
  id: string;
  title: string;
  category: string;
  body: string;
  excerpt?: string;
}

const REPO_GUIDES_URL = "https://github.com/UitbreidenOS/UitKit/blob/main/guides";

const guides: Guide[] = [
  // Getting Started
  { id: "auto-mode", title: "Auto Mode", category: "Getting Started",
    body: "Auto Mode lets Claude Code work autonomously — executing multi-step tasks, creating files, running commands, and committing changes without requiring approval at each step.",
    excerpt: "Auto mode lets Claude operate with minimal interruptions — it auto-approves safe, non-destructive operations and only pauses for human input on actions that are irreversible or carry real risk. Use it for long-running tasks where constant approval prompts break your flow. Enable via /auto slash command or settings.json." },
  { id: "auto-mode-guide", title: "Auto Mode (Detailed)", category: "Getting Started",
    body: "Deep dive into Auto Mode configuration, allowed tools, safety controls, and best practices for autonomous sessions.",
    excerpt: "Comprehensive guide covering allowed tool lists, auto-approve patterns, safety boundaries, session persistence, and how to configure auto mode for different project types. Includes troubleshooting for common issues and security considerations." },
  { id: "claude-md-architecture", title: "CLAUDE.md Architecture", category: "Getting Started",
    body: "How CLAUDE.md files structure your project context, agent instructions, and tool configurations for Claude Code.",
    excerpt: "CLAUDE.md is the primary context file that Claude Code reads at session start. It defines project structure, coding conventions, tool preferences, and behavioral rules. Learn the hierarchical loading order: root → subdirectory → local overrides, and how to structure yours for maximum effectiveness." },
  { id: "agents-md", title: "AGENTS.md Format", category: "Getting Started",
    body: "The AGENTS.md specification for defining agent roles, tools, and behaviors in a structured format.",
    excerpt: "AGENTS.md defines agent roles with YAML frontmatter and markdown body. Each agent specifies its name, description, allowed tools, and behavioral instructions. Learn the full specification including role inheritance, tool scoping, and multi-agent coordination patterns." },
  { id: "context-management", title: "Context Management", category: "Getting Started",
    body: "Techniques for managing Claude's context window — summarization, priority filtering, and context compression strategies.",
    excerpt: "Claude Code has a finite context window. This guide covers automatic summarization, manual context compaction with /save-state, priority-based filtering, and strategies for keeping the most relevant information in context during long sessions." },
  { id: "cli-reference", title: "CLI Reference", category: "Getting Started",
    body: "Complete reference for the Claude Code CLI — commands, flags, configuration, and environment variables.",
    excerpt: "Full CLI reference covering all commands (--model, --allowedTools, --dangerously-skip-permissions), environment variables (ANTHROPIC_API_KEY, CLAUDE_CODE_MAX_TOKENS), configuration files, and shell integration for bash, zsh, and fish." },

  // Agent Development
  { id: "agent-teams", title: "Agent Teams", category: "Agent Development",
    body: "Orchestrate multiple specialized agents working together. Each agent has its own tools, context, and domain knowledge, coordinated by an orchestrator.",
    excerpt: "Agent teams let you run multiple Claude Code instances working together as a coordinated team. One session acts as the lead — coordinating work, assigning tasks, and synthesizing results. Teammates work independently, each in their own context window, and can communicate directly with each other. This feature is experimental and disabled by default." },
  { id: "agent-frameworks", title: "Agent Frameworks", category: "Agent Development",
    body: "Overview of agent orchestration frameworks, multi-agent patterns, and coordination strategies for complex workflows.",
    excerpt: "Compare agent orchestration approaches: supervisor/worker, sequential pipelines, blackboard patterns, and hierarchical delegation. Covers when to use subagents vs independent agents, and how to choose the right framework for your use case." },
  { id: "agent-frontmatter", title: "Agent Frontmatter", category: "Agent Development",
    body: "How to use YAML frontmatter in agent definition files to specify roles, capabilities, and tool permissions.",
    excerpt: "Agent frontmatter uses YAML to declare metadata: name, description, allowed tools (Read, Write, Bash, etc.), model preferences, and behavioral constraints. This guide covers every frontmatter field with examples and validation rules." },
  { id: "agent-orchestration", title: "Agent Orchestration", category: "Agent Development",
    body: "Patterns for coordinating multiple agents — supervisor/worker, sequential pipelines, and parallel execution.",
    excerpt: "Deep dive into orchestration patterns: fan-out/fan-in for parallel work, sequential chains for dependent tasks, supervisor delegation for complex routing, and blackboard coordination for shared state. Includes implementation examples for each pattern." },
  { id: "agent-sdk-pack", title: "Agent SDK Pack", category: "Agent Development",
    body: "The UitKit Agent SDK — reusable building blocks for creating custom agents with tools, memory, and hooks.",
    excerpt: "The Agent SDK provides composable primitives for building agents: tool definitions with input/output schemas, memory interfaces for session persistence, hook registration for lifecycle events, and agent composition utilities." },
  { id: "agent-sdk-deep-dive", title: "Agent SDK Deep Dive", category: "Agent Development",
    body: "In-depth exploration of the Agent SDK API — tool definitions, memory interfaces, and event-driven architectures.",
    excerpt: "API reference for the Agent SDK: createTool() for defining custom tools, createAgent() for agent instantiation, MemoryProvider for state management, and EventEmitter for hook-driven architectures. Includes TypeScript types and usage examples." },

  // Claude Code Features
  { id: "extended-thinking", title: "Extended Thinking", category: "Claude Code Features",
    body: "Extended thinking gives Claude more time to reason through complex problems. Enable it for architecture decisions, debugging, and complex refactoring.",
    excerpt: "Extended thinking gives Claude a scratchpad it uses before producing a response. The thinking content is a chain-of-thought — Claude works through the problem step by step before committing to an answer. Structurally different from standard generation: Claude first allocates a budget of internal tokens to reason through the problem, then synthesizes a final answer." },
  { id: "claude-design", title: "Claude Design", category: "Claude Code Features",
    body: "Understanding Claude's design philosophy, interaction patterns, and how to write effective instructions.",
    excerpt: "Core design principles behind Claude Code: conversational interaction, tool-augmented reasoning, progressive disclosure of complexity, and safety-first defaults. Learn how these principles shape every feature and how to write instructions that align with them." },
  { id: "claude-design-best-practices", title: "Design Best Practices", category: "Claude Code Features",
    body: "Best practices for structuring prompts, instructions, and project configurations for optimal Claude Code behavior.",
    excerpt: "Proven patterns for CLAUDE.md structure, instruction clarity, tool scoping, and behavioral rules. Covers common anti-patterns (over-prompting, ambiguous instructions, tool sprawl) and how to avoid them for consistent, high-quality output." },
  { id: "claude-design-vs-tools", title: "Design vs Tools", category: "Claude Code Features",
    body: "When to use design patterns vs when to use tool definitions — trade-offs and decision framework.",
    excerpt: "Decision framework for choosing between CLAUDE.md instructions and tool definitions. Use design for behavioral patterns and conventions; use tools for structured data access and deterministic operations. Includes comparison matrix and real-world examples." },
  { id: "advanced-tool-use", title: "Advanced Tool Use", category: "Claude Code Features",
    body: "Advanced patterns for tool use — chaining tools, conditional execution, and error handling in multi-tool workflows.",
    excerpt: "Advanced patterns: tool chaining (output of one tool feeds the next), conditional execution (branch based on tool results), parallel tool calls for independent operations, and robust error handling with retry strategies and fallback tools." },
  { id: "claude-code-new-features", title: "New Features", category: "Claude Code Features",
    body: "Latest Claude Code features, updates, and capabilities as they're released.",
    excerpt: "Changelog of recent Claude Code releases: new tools, model updates, CLI improvements, and feature additions. Updated regularly as Anthropic ships new capabilities. Check back frequently to stay current." },
  { id: "claude-cowork", title: "Claude Cowork", category: "Claude Code Features",
    body: "Using Claude as a collaborative coding partner — pair programming, code review, and knowledge sharing patterns.",
    excerpt: "Patterns for effective human-AI collaboration: pair programming with Claude, structured code review workflows, knowledge transfer sessions, and how to build shared understanding of codebases across sessions." },
  { id: "claude-managed-agents", title: "Managed Agents", category: "Claude Code Features",
    body: "How to use Claude's managed agent capabilities for long-running tasks, background jobs, and automated workflows.",
    excerpt: "Managed agents run independently with their own context, tools, and lifecycle. Use them for long-running refactors, background monitoring, automated code generation, and tasks that don't require constant human oversight." },

  // Integrations
  { id: "hooks", title: "Hooks", category: "Integrations",
    body: "Hooks let you run custom logic at key points in Claude's workflow — before/after tool calls, on file changes, on errors, and on session events.",
    excerpt: "Hooks execute custom scripts at lifecycle events: PreToolUse (before tool execution), PostToolUse (after tool results), Notification (on alerts), and Stop (on session end). Configure via settings.json with matcher patterns and command strings. UitKit provides 48 pre-built hooks." },
  { id: "mcp-setup", title: "MCP Server Setup", category: "Integrations",
    body: "Model Context Protocol servers extend Claude's capabilities with external tools. UitKit provides 41 ready-to-use MCP configurations.",
    excerpt: "MCP servers give Claude access to external tools: databases, APIs, browsers, file systems, and more. Install via settings.json with server command and environment variables. UitKit ships 41 ready-to-use configs covering GitHub, Slack, PostgreSQL, Puppeteer, and more." },
  { id: "computer-use", title: "Computer Use", category: "Integrations",
    body: "Claude's computer use capability — controlling browsers, reading screens, and interacting with desktop applications.",
    excerpt: "Computer use lets Claude take screenshots, click buttons, type text, and navigate GUIs. Use it for browser automation, legacy app interaction, and visual testing. Requires explicit permission and careful sandboxing." },
  { id: "computer-use-guide", title: "Computer Use Guide", category: "Integrations",
    body: "Complete guide to configuring and using computer use — browser automation, GUI interaction, and safety considerations.",
    excerpt: "Step-by-step setup for computer use: enabling the capability, configuring display resolution, managing browser sessions, and implementing safety guards. Includes patterns for web scraping, form filling, and visual regression testing." },

  // Use Cases
  { id: "claude-for-solopreneurs", title: "For Solopreneurs", category: "Use Cases",
    body: "How solo founders and solopreneurs can leverage Claude Code for rapid prototyping, development, and business operations." },
  { id: "claude-for-creators", title: "For Creators", category: "Use Cases",
    body: "Content creators using Claude Code for website building, automation, and creative project management." },
  { id: "claude-for-small-business", title: "For Small Business", category: "Use Cases",
    body: "Small business applications of Claude Code — invoicing, customer management, marketing automation, and operations." },
  { id: "claude-for-ecommerce", title: "For E-Commerce", category: "Use Cases",
    body: "E-commerce operators using Claude for product management, analytics, SEO, and storefront development." },
  { id: "claude-for-local-services", title: "For Local Services", category: "Use Cases",
    body: "Local service businesses leveraging Claude for scheduling, customer communication, and operational efficiency." },
  { id: "claude-for-coaches-consultants", title: "For Coaches & Consultants", category: "Use Cases",
    body: "How coaches and consultants use Claude for client management, content creation, and business automation." },
  { id: "claude-small-business-seo-strategy", title: "SEO Strategy", category: "Use Cases",
    body: "AI-powered SEO strategy for small businesses — keyword research, content optimization, and technical SEO with Claude." },

  // Role-Specific
  { id: "for-cto", title: "For CTO", category: "Role-Specific",
    body: "How CTOs can use Claude for architecture decisions, team management, and strategic technology planning." },
  { id: "for-founder", title: "For Founders", category: "Role-Specific",
    body: "Founder's guide to using Claude — from MVP building to scaling engineering teams." },
  { id: "for-software-engineer", title: "For Software Engineer", category: "Role-Specific",
    body: "Day-to-day development workflows with Claude — coding, debugging, testing, and documentation." },
  { id: "for-product-manager", title: "For Product Manager", category: "Role-Specific",
    body: "How product managers use Claude for requirements, user stories, roadmaps, and stakeholder communication." },
  { id: "for-data-analyst", title: "For Data Analyst", category: "Role-Specific",
    body: "Data analysis workflows with Claude — SQL queries, data visualization, and statistical analysis." },
  { id: "for-devops-engineer", title: "For DevOps Engineer", category: "Role-Specific",
    body: "DevOps automation with Claude — infrastructure as code, CI/CD, monitoring, and incident response." },
  { id: "for-growth-marketer", title: "For Growth Marketer", category: "Role-Specific",
    body: "Growth marketing workflows — analytics, A/B testing, campaign optimization, and attribution." },
  { id: "for-email-marketer", title: "For Email Marketer", category: "Role-Specific",
    body: "Email marketing with Claude — sequence writing, segmentation, deliverability, and analytics." },
  { id: "for-content-marketer", title: "For Content Marketer", category: "Role-Specific",
    body: "Content marketing workflows — research, writing, SEO optimization, and distribution." },
  { id: "for-sdr", title: "For SDR", category: "Role-Specific",
    body: "Sales development workflows — prospecting, outreach, qualification, and pipeline management." },
  { id: "for-finance-analyst", title: "For Finance Analyst", category: "Role-Specific",
    body: "Financial analysis with Claude — modeling, forecasting, variance analysis, and reporting." },
  { id: "for-legal-compliance", title: "For Legal & Compliance", category: "Role-Specific",
    body: "Legal workflows — contract review, compliance checks, regulatory research, and documentation." },
  { id: "for-healthcare-admin", title: "For Healthcare Admin", category: "Role-Specific",
    body: "Healthcare administration with Claude — scheduling, documentation, compliance, and patient communication." },
  { id: "for-real-estate-agent", title: "For Real Estate Agent", category: "Role-Specific",
    body: "Real estate workflows — listing management, client communication, market analysis, and document preparation." },
  { id: "for-educator", title: "For Educator", category: "Role-Specific",
    body: "Education workflows — lesson planning, curriculum development, grading, and student engagement." },
  { id: "for-recruiter", title: "For Recruiter", category: "Role-Specific",
    body: "Recruiting workflows — job descriptions, candidate screening, interview preparation, and pipeline management." },
  { id: "for-executive-assistant", title: "For Executive Assistant", category: "Role-Specific",
    body: "Executive assistant workflows — scheduling, communication, document management, and coordination." },
  { id: "for-investor", title: "For Investor", category: "Role-Specific",
    body: "Investment workflows — due diligence, market research, portfolio analysis, and reporting." },
  { id: "for-freelancer", title: "For Freelancer", category: "Role-Specific",
    body: "Freelancer workflows — project management, invoicing, client communication, and portfolio building." },
  { id: "for-account-executive", title: "For Account Executive", category: "Role-Specific",
    body: "Account executive workflows — deal management, forecasting, customer success, and renewal strategy." },
  { id: "for-technical-writer", title: "For Technical Writer", category: "Role-Specific",
    body: "Technical writing with Claude — documentation, API docs, tutorials, and style guides." },
  { id: "for-operations-manager", title: "For Operations Manager", category: "Role-Specific",
    body: "Operations management workflows — process optimization, resource planning, and reporting." },

  // Advanced
  { id: "deployment-patterns", title: "Deployment Patterns", category: "Advanced",
    body: "Deployment strategies for Claude Code workflows — CI/CD integration, automated releases, and rollback procedures." },
  { id: "decision-framework", title: "Decision Framework", category: "Advanced",
    body: "Framework for making decisions about when to use auto mode, which agents to deploy, and how to structure projects." },
  { id: "context-budget", title: "Context Budget", category: "Advanced",
    body: "Managing context window budget — summarization strategies, context pruning, and efficient token usage." },
  { id: "claude-security", title: "Claude Security", category: "Advanced",
    body: "Security best practices for Claude Code — sandboxing, permissions, data handling, and audit trails." },
  { id: "claude-mythos", title: "Claude Mythos", category: "Advanced",
    body: "Understanding Claude's capabilities, limitations, and the philosophy behind its design." },
  { id: "cross-harness-guide", title: "Cross-Harness Guide", category: "Advanced",
    body: "Working across multiple Claude Code instances — context sharing, agent coordination, and workflow synchronization." },
  { id: "cost-optimisation", title: "Cost Optimization", category: "Advanced",
    body: "Strategies for minimizing token costs while maximizing Claude's output quality and efficiency." },
  { id: "desktop-app", title: "Desktop App", category: "Advanced",
    body: "Using the Claude Code desktop application — installation, configuration, keyboard shortcuts, and workspace management." },
];

const categories = [...new Set(guides.map(g => g.category))];

export function GuidesApp() {
  const [active, setActive] = useState("auto-mode");
  const [search, setSearch] = useState("");
  const [readGuides, setReadGuides] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uitkit_read_guides");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const filteredGuides = useMemo(() => {
    if (!search.trim()) return guides;
    const q = search.toLowerCase();
    return guides.filter(g => g.title.toLowerCase().includes(q) || g.body.toLowerCase().includes(q));
  }, [search]);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => filteredGuides.some(g => g.category === cat));
  }, [filteredGuides]);

  const doc = filteredGuides.find(g => g.id === active) ?? filteredGuides[0];

  const handleToggleRead = (id: string) => {
    const nextRead = readGuides.includes(id)
      ? readGuides.filter((x) => x !== id)
      : [...readGuides, id];
    setReadGuides(nextRead);
    localStorage.setItem("uitkit_read_guides", JSON.stringify(nextRead));

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: {
        status: "happy",
        message: nextRead.includes(id) ? `Completed reading: ${id}` : `Marked unread: ${id}`
      }
    }));
  };

  const totalGuidesCount = guides.length;
  const readGuidesCount = guides.filter(g => readGuides.includes(g.id)).length;
  const readPercent = totalGuidesCount > 0 ? Math.round((readGuidesCount / totalGuidesCount) * 100) : 0;

  if (!doc) return <div className="p-6 text-mute text-sm">No guides found.</div>;

  return (
    <div className="h-full flex">
      <aside className="w-56 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3 pb-2 border-b border-hairline">
          <Eyebrow color="#1078a3">Knowledge Base</Eyebrow>
          
          {/* Progress bar */}
          <div className="mt-2 mb-3 bg-zinc-100 p-2 rounded-lg border border-hairline">
            <div className="flex justify-between items-center text-[10px] font-bold text-ink mb-1">
              <span>Read Tracker</span>
              <span>{readPercent}% ({readGuidesCount}/{totalGuidesCount})</span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${readPercent}%` }}
                className="bg-brand-blue h-full transition-all duration-300"
              />
            </div>
          </div>

          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActive(""); }}
            placeholder="Search guides..."
            className="w-full rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[12px] text-ink placeholder:text-mute/60 focus:outline-none focus:ring-1 focus:ring-brand-blue/40"
          />
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2">
          {filteredCategories.map(topic => (
            <div key={topic} className="mt-2 first:mt-0">
              <div className="text-[10px] font-bold text-mute uppercase tracking-wider px-2.5 py-1">{topic}</div>
              <div className="space-y-0.5">
                {filteredGuides.filter(g => g.category === topic).map(g => {
                  const isRead = readGuides.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => setActive(g.id)}
                      className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] transition flex justify-between items-center ${
                        g.id === active ? "bg-white border border-hairline font-semibold text-brand-teal" : "text-body hover:bg-white/60"
                      }`}
                    >
                      <span className="truncate mr-1">{g.title}</span>
                      {isRead && <span className="text-emerald-500 font-bold text-[11px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-hairline text-[10px] text-mute flex justify-between">
          <span>{guides.length} guides</span>
          <button
            onClick={() => {
              setReadGuides([]);
              localStorage.removeItem("uitkit_read_guides");
            }}
            className="hover:text-red-500 font-semibold"
          >
            Reset
          </button>
        </div>
      </aside>

      <article className="flex-1 min-w-0 overflow-auto p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <Tag color="#1078a3">{doc.category}</Tag>
            <button
              onClick={() => handleToggleRead(doc.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition ${
                readGuides.includes(doc.id)
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-white border-hairline text-mute hover:bg-zinc-50 hover:text-ink"
              }`}
            >
              {readGuides.includes(doc.id) ? "✓ Completed" : "Mark as Read"}
            </button>
          </div>

          <h1 className="mt-2 text-xl font-extrabold text-ink">{doc.title}</h1>
          <p className="mt-3 text-[13px] text-body leading-relaxed max-w-xl">{doc.body}</p>

          {doc.excerpt && (
            <div className="mt-4 rounded-lg border border-hairline bg-cream/50 p-4 max-w-xl">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">From the guide</div>
              <p className="text-[12.5px] text-body leading-relaxed">{doc.excerpt}</p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-hairline pt-5 flex flex-wrap gap-3">
          <a
            href={`${REPO_GUIDES_URL}/${doc.id}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[12px] font-bold text-white hover:bg-body transition"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Read full guide on GitHub
          </a>
          <a
            href={`${REPO_GUIDES_URL}/${doc.id}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-white px-4 py-2.5 text-[12px] font-semibold text-body hover:bg-cream transition"
          >
            View raw markdown
          </a>
        </div>
      </article>
    </div>
  );
}

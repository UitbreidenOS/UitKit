export type AppId =
  | "home"
  | "skills"
  | "agents"
  | "mcp"
  | "guides"
  | "stacks"
  | "install"
  | "about"
  | "trash"
  | "cli"
  | "benchmarks"
  | "community"
  | "hooks"
  | "rules"
  | "commands"
  | "workflows"
  | "plugins"
  | "personas"
  | "toolkit"
  | "showcase"
  | "enterprise"
  | "compare"
  | "marketplace"
  | "examples"
  | "swarm"
  | "feature-flags"
  | "graph"
  | "sidekick-settings"
  | "loop-eng"
  | "goals"
  | "kanban";

export interface AppMeta {
  id: AppId;
  title: string;
  icon: string;
  accent: string;
  defaultSize: { width: number; height: number };
}

export interface WinState {
  key: string;
  appId: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
}

export interface SiteData {
  version: string;
  skills: { id: string; category: string; title: string; description: string }[];
  agents: { id: string; title: string; category: string }[];
  mcpConfigs: { name: string; description: string; snippet: string; tools: string[] }[];
  stacks: { name: string; skills: number; description: string }[];
  guides: { id: string; title: string; topic: string }[];
  summary: {
    skills: number;
    agents: number;
    commands: number;
    mcpConfigs: number;
    stacks: number;
    hooks: number;
    guides: number;
    languages: number;
  };
}

import type { AppId } from "./types";
import type { WindowManager } from "./useWindows";
import { HomeApp } from "./apps/HomeApp";
import { SkillsApp } from "./apps/SkillsApp";
import { AgentsApp } from "./apps/AgentsApp";
import { McpApp } from "./apps/McpApp";
import { GuidesApp } from "./apps/GuidesApp";
import { StacksApp } from "./apps/StacksApp";
import { InstallApp } from "./apps/InstallApp";
import { AboutApp } from "./apps/AboutApp";
import { TrashApp } from "./apps/TrashApp";
import { CliApp } from "./apps/CliApp";
import { BenchmarksApp } from "./apps/BenchmarksApp";
import { CommunityApp } from "./apps/CommunityApp";

export function AppContent({ appId, wm }: { appId: AppId; wm: WindowManager }) {
  switch (appId) {
    case "home":
      return <HomeApp wm={wm} />;
    case "skills":
      return <SkillsApp />;
    case "agents":
      return <AgentsApp />;
    case "mcp":
      return <McpApp />;
    case "guides":
      return <GuidesApp />;
    case "stacks":
      return <StacksApp />;
    case "install":
      return <InstallApp />;
    case "about":
      return <AboutApp wm={wm} />;
    case "trash":
      return <TrashApp />;
    case "cli":
      return <CliApp />;
    case "benchmarks":
      return <BenchmarksApp />;
    case "community":
      return <CommunityApp />;
    default:
      return null;
  }
}

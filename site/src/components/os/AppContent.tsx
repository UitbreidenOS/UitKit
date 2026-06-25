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
import { HooksApp } from "./apps/HooksApp";
import { RulesApp } from "./apps/RulesApp";
import { CommandsApp } from "./apps/CommandsApp";
import { WorkflowsApp } from "./apps/WorkflowsApp";
import { PluginsApp } from "./apps/PluginsApp";
import { PersonasApp } from "./apps/PersonasApp";
import { ToolkitApp } from "./apps/ToolkitApp";
import { ShowcaseApp } from "./apps/ShowcaseApp";
import { PricingApp } from "./apps/PricingApp";
import { CompareApp } from "./apps/CompareApp";
import { SwarmApp } from "./apps/SwarmApp";
import { MarketplaceApp } from "./apps/MarketplaceApp";
import { ExamplesApp } from "./apps/ExamplesApp";
import { FeatureFlagsApp } from "./apps/FeatureFlagsApp";
import { GraphApp } from "./apps/GraphApp";
import { SidekickSettingsApp } from "./apps/SidekickSettingsApp";
import { LoopApp } from "./apps/LoopApp";
import { GoalModeApp } from "./apps/GoalModeApp";
import { KanbanApp } from "./apps/KanbanApp";
import { OracleApp } from "./apps/OracleApp";
import { LearnEngineApp } from "./apps/LearnEngineApp";
import { JarvisApp } from "./apps/JarvisApp";
import { TokenSaverApp } from "./apps/TokenSaverApp";
import { FusionApp } from "./apps/FusionApp";
import { CleanSlateApp } from "./apps/CleanSlateApp";

export function AppContent({ appId, wm }: { appId: AppId; wm: WindowManager }) {
  switch (appId) {
    case "home":
      return <HomeApp wm={wm} />;
    case "graph":
      return <GraphApp />;
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
    case "hooks":
      return <HooksApp />;
    case "rules":
      return <RulesApp />;
    case "commands":
      return <CommandsApp />;
    case "workflows":
      return <WorkflowsApp />;
    case "plugins":
      return <PluginsApp />;
    case "personas":
      return <PersonasApp />;
    case "toolkit":
      return <ToolkitApp />;
    case "showcase":
      return <ShowcaseApp />;
    case "enterprise":
      return <PricingApp />;
    case "compare":
      return <CompareApp />;
    case "swarm":
      return <SwarmApp />;
    
    case "marketplace":
      return <MarketplaceApp />;
    case "examples":
      return <ExamplesApp />;
    case "feature-flags":
      return <FeatureFlagsApp />;
    case "sidekick-settings":
      return <SidekickSettingsApp />;
    case "loop-eng":
      return <LoopApp />;
    case "goals":
      return <GoalModeApp />;
    case "kanban":
      return <KanbanApp />;
    case "oracle":
      return <OracleApp />;
    case "learn-eng":
      return <LearnEngineApp />;
    case "jarvis":
      return <JarvisApp />;
    case "token-saver":
      return <TokenSaverApp />;
    case "fusion":
      return <FusionApp />;
    case "clean-slate":
      return <CleanSlateApp />;
    default:
      return null;
  }
}

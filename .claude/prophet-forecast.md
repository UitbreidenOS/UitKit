# The Prophet: Predictive Outage & Tech Debt Report

Generated: 2026-06-18T13:22:09.810Z | Target Workspace: `/Users/tushar/Desktop/Claudient`

This report ranks codebase files by **Outage Risk Score**, which is calculated as:
$$\text{Risk Score} = \text{Git Churn (last 100 commits)} \times \frac{\text{Line Count}}{100}$$

## 📊 Top Hotspot Risk Ranking

| Rank | File Path | Churn (Edits) | Line Count | Outage Risk Score |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `scripts/cli.js` | 12 | 2743 | **329.16** |
| 2 | `site/src/components/os/apps/CliApp.tsx` | 5 | 798 | **39.9** |
| 3 | `site/src/components/os/apps/StacksApp.tsx` | 4 | 702 | **28.08** |
| 4 | `site/src/components/os/apps/ToolkitApp.tsx` | 5 | 525 | **26.25** |
| 5 | `site/src/components/os/apps/HomeApp.tsx` | 6 | 298 | **17.88** |
| 6 | `site/src/components/os/apps/ShowcaseApp.tsx` | 4 | 358 | **14.32** |
| 7 | `site/src/components/os/apps/InstallApp.tsx` | 5 | 231 | **11.55** |
| 8 | `scripts/test-cli.js` | 5 | 210 | **10.5** |
| 9 | `site/src/components/os/apps.ts` | 5 | 208 | **10.4** |
| 10 | `site/src/components/os/apps/McpApp.tsx` | 3 | 320 | **9.6** |
| 11 | `site/src/components/os/apps/GuidesApp.tsx` | 3 | 267 | **8.01** |
| 12 | `scripts/build-catalog.js` | 3 | 258 | **7.74** |
| 13 | `site/src/components/os/MenuBar.tsx` | 7 | 102 | **7.14** |
| 14 | `scripts/build-plugins.js` | 1 | 564 | **5.64** |
| 15 | `scripts/visualize-graph.js` | 1 | 491 | **4.91** |
| 16 | `site/src/components/os/apps/PricingApp.tsx` | 1 | 465 | **4.65** |
| 17 | `site/src/components/os/AppContent.tsx` | 5 | 86 | **4.3** |
| 18 | `site/src/components/os/apps/SwarmApp.tsx` | 1 | 425 | **4.25** |
| 19 | `site/src/components/os/apps/CommunityApp.tsx` | 2 | 192 | **3.84** |
| 20 | `site/src/components/os/apps/SkillsApp.tsx` | 3 | 125 | **3.75** |
| 21 | `site/src/components/os/types.ts` | 5 | 67 | **3.35** |
| 22 | `professional-stacks/ai_product_manager_stack/commands/ux-audit.py` | 1 | 333 | **3.33** |
| 23 | `scripts/council.js` | 1 | 321 | **3.21** |
| 24 | `site/src/components/os/apps/ExamplesApp.tsx` | 1 | 301 | **3.01** |
| 25 | `site/src/components/os/apps/AgentsApp.tsx` | 2 | 141 | **2.82** |
| 26 | `site/src/components/os/apps/HooksApp.tsx` | 2 | 137 | **2.74** |
| 27 | `scripts/translate-assets.js` | 1 | 273 | **2.73** |
| 28 | `scripts/oracle.js` | 1 | 253 | **2.53** |
| 29 | `scripts/generate-refresh-report.js` | 1 | 249 | **2.49** |
| 30 | `scripts/audit-certified.js` | 1 | 249 | **2.49** |
| 31 | `scripts/learn.js` | 1 | 245 | **2.45** |
| 32 | `site/src/components/os/apps/MarketplaceApp.tsx` | 1 | 231 | **2.31** |
| 33 | `scripts/tribunal.js` | 1 | 214 | **2.14** |
| 34 | `scripts/sweep.js` | 1 | 202 | **2.02** |
| 35 | `scripts/bisect.js` | 1 | 192 | **1.92** |
| 36 | `scripts/permissions.js` | 1 | 189 | **1.89** |
| 37 | `scripts/validate-catalog.js` | 1 | 185 | **1.85** |
| 38 | `site/src/components/os/apps/BenchmarksApp.tsx` | 1 | 184 | **1.84** |
| 39 | `scripts/chart.js` | 1 | 179 | **1.79** |
| 40 | `scripts/certify-stack.js` | 1 | 176 | **1.76** |
| 41 | `site/src/components/os/apps/CommandsApp.tsx` | 1 | 174 | **1.74** |
| 42 | `site/src/components/os/apps/PersonasApp.tsx` | 2 | 85 | **1.7** |
| 43 | `site/src/components/os/apps/RulesApp.tsx` | 2 | 85 | **1.7** |
| 44 | `site/src/components/os/apps/PluginsApp.tsx` | 2 | 84 | **1.68** |
| 45 | `scripts/nightshift.js` | 1 | 160 | **1.6** |
| 46 | `scripts/validate-stacks.js` | 1 | 156 | **1.56** |
| 47 | `scripts/enforce.js` | 1 | 148 | **1.48** |
| 48 | `site/src/components/os/ClaudientOS.tsx` | 2 | 73 | **1.46** |
| 49 | `scripts/jit.js` | 1 | 143 | **1.43** |
| 50 | `scripts/handoff.js` | 1 | 140 | **1.4** |
| 51 | `scripts/generate-benchmarks.js` | 1 | 140 | **1.4** |
| 52 | `scripts/tdd.js` | 1 | 138 | **1.38** |
| 53 | `site/src/components/os/apps/AboutApp.tsx` | 2 | 69 | **1.38** |
| 54 | `site/src/components/os/Window.tsx` | 1 | 132 | **1.32** |
| 55 | `site/src/components/os/apps/CompareApp.tsx` | 1 | 126 | **1.26** |
| 56 | `scripts/spec.js` | 1 | 124 | **1.24** |
| 57 | `site/src/components/os/apps/WorkflowsApp.tsx` | 1 | 117 | **1.17** |
| 58 | `scripts/add-descriptions.js` | 1 | 117 | **1.17** |
| 59 | `site/src/components/os/useWindows.ts` | 1 | 116 | **1.16** |
| 60 | `scripts/repair.js` | 1 | 111 | **1.11** |
| 61 | `scripts/commit.js` | 1 | 100 | **1** |
| 62 | `scripts/checkpoint.js` | 1 | 97 | **0.97** |
| 63 | `scripts/documentation.js` | 1 | 81 | **0.81** |
| 64 | `scripts/chaos.js` | 1 | 71 | **0.71** |
| 65 | `scripts/caveman.js` | 1 | 68 | **0.68** |
| 66 | `scripts/auto-frontmatter.js` | 1 | 58 | **0.58** |
| 67 | `site/src/components/os/apps/ui.tsx` | 1 | 45 | **0.45** |
| 68 | `site/src/components/os/Taskbar.tsx` | 1 | 39 | **0.39** |
| 69 | `site/src/components/os/Desktop.tsx` | 1 | 33 | **0.33** |
| 70 | `site/src/components/os/apps/TrashApp.tsx` | 1 | 27 | **0.27** |
| 71 | `site/src/utils/cn.ts` | 1 | 7 | **0.07** |
| 72 | `site/src/components/os/apps/EnterpriseApp.tsx` | 1 | 0 | **0** |
| 73 | `ai_product_manager_stack/commands/ux-audit.py` | 1 | 0 | **0** |
| 74 | `site/src/content.config.ts` | 1 | 0 | **0** |
| 75 | `site/src/data/featured.ts` | 1 | 0 | **0** |
| 76 | `site/src/lib/content.ts` | 1 | 0 | **0** |
| 77 | `site/src/lib/og.ts` | 1 | 0 | **0** |
| 78 | `site/src/lib/seo.ts` | 1 | 0 | **0** |
| 79 | `site/src/pages/[lang]/raw/[collection]/[...slug].md.ts` | 1 | 0 | **0** |
| 80 | `site/src/pages/llms.txt.ts` | 1 | 0 | **0** |
| 81 | `site/src/pages/og/[collection]/[...slug].svg.ts` | 1 | 0 | **0** |
| 82 | `site/src/pages/og/default.svg.ts` | 1 | 0 | **0** |
| 83 | `site/src/pages/raw/[collection]/[...slug].md.ts` | 1 | 0 | **0** |
| 84 | `site/src/pages/rss-agents.xml.ts` | 1 | 0 | **0** |
| 85 | `site/src/pages/rss-guides.xml.ts` | 1 | 0 | **0** |
| 86 | `site/src/pages/rss-hooks.xml.ts` | 1 | 0 | **0** |
| 87 | `site/src/pages/rss-mcp.xml.ts` | 1 | 0 | **0** |
| 88 | `site/src/pages/rss-skills.xml.ts` | 1 | 0 | **0** |
| 89 | `site/src/pages/rss-workflows.xml.ts` | 1 | 0 | **0** |
| 90 | `site/src/pages/rss.xml.ts` | 1 | 0 | **0** |
| 91 | `site/src/pages/sitemap-index.xml.ts` | 1 | 0 | **0** |

## 💡 Key Recommendations
1. **Refactor `scripts/cli.js`**: High risk score indicates excessive complexity combined with frequent modifications. Split this module into smaller, isolated components to reduce regression potential.
2. **Increase Test Coverage**: Add unit tests covering high-churn files to prevent future outages during rapid changes.

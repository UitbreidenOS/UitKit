# The Prophet: Predictive Outage & Tech Debt Report

Generated: 2026-06-22T04:05:25.174Z | Target Workspace: `/Users/tushar/Desktop/Claudient`

This report ranks codebase files by **Outage Risk Score**, which is calculated as:
$$\text{Risk Score} = \text{Git Churn (last 100 commits)} \times \frac{\text{Line Count}}{100}$$

## 📊 Top Hotspot Risk Ranking

| Rank | File Path | Churn (Edits) | Line Count | Outage Risk Score |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `scripts/cli.js` | 16 | 2842 | **454.72** |
| 2 | `site/src/components/os/apps/CliApp.tsx` | 7 | 1137 | **79.59** |
| 3 | `site/src/components/os/apps/ShowcaseApp.tsx` | 7 | 741 | **51.87** |
| 4 | `site/src/components/os/apps/HomeApp.tsx` | 10 | 342 | **34.2** |
| 5 | `site/src/components/os/apps/ToolkitApp.tsx` | 6 | 559 | **33.54** |
| 6 | `site/src/components/os/apps/StacksApp.tsx` | 4 | 702 | **28.08** |
| 7 | `scripts/test-cli.js` | 7 | 226 | **15.82** |
| 8 | `site/src/components/os/apps.ts` | 7 | 208 | **14.56** |
| 9 | `site/src/components/os/apps/InstallApp.tsx` | 5 | 231 | **11.55** |
| 10 | `test/integration/svg-swarm-integration.test.js` | 1 | 1067 | **10.67** |
| 11 | `test/integration/swarm-matrix-integration.test.js` | 1 | 1037 | **10.37** |
| 12 | `site/src/components/os/apps/McpApp.tsx` | 3 | 320 | **9.6** |
| 13 | `site/src/components/os/apps/PricingApp.tsx` | 2 | 465 | **9.3** |
| 14 | `site/src/components/os/MenuBar.tsx` | 9 | 102 | **9.18** |
| 15 | `test/e2e/full-feature-workflow.test.js` | 1 | 848 | **8.48** |
| 16 | `site/src/components/os/apps/GuidesApp.tsx` | 3 | 267 | **8.01** |
| 17 | `scripts/claudient-svg-inspector.js` | 1 | 797 | **7.97** |
| 18 | `scripts/build-catalog.js` | 3 | 258 | **7.74** |
| 19 | `test/regression/backward-compatibility.test.js` | 1 | 614 | **6.14** |
| 20 | `scripts/claudient-swarm-sandbox.js` | 1 | 608 | **6.08** |
| 21 | `site/src/components/os/AppContent.tsx` | 7 | 86 | **6.02** |
| 22 | `scripts/claudient-matrix.js` | 1 | 576 | **5.76** |
| 23 | `scripts/build-plugins.js` | 1 | 564 | **5.64** |
| 24 | `test/integration/matrix-svg-integration.test.js` | 1 | 519 | **5.19** |
| 25 | `scripts/visualize-graph.js` | 1 | 491 | **4.91** |
| 26 | `scripts/swarm-sandbox-init.js` | 1 | 480 | **4.8** |
| 27 | `site/src/components/os/types.ts` | 7 | 67 | **4.69** |
| 28 | `site/src/components/os/apps/SwarmApp.tsx` | 1 | 425 | **4.25** |
| 29 | `site/src/components/os/apps/CommunityApp.tsx` | 2 | 192 | **3.84** |
| 30 | `site/src/components/os/apps/SkillsApp.tsx` | 3 | 125 | **3.75** |
| 31 | `scripts/svg-map-render.js` | 1 | 353 | **3.53** |
| 32 | `professional-stacks/ai_product_manager_stack/commands/ux-audit.py` | 1 | 333 | **3.33** |
| 33 | `scripts/council.js` | 1 | 321 | **3.21** |
| 34 | `site/src/components/os/apps/ExamplesApp.tsx` | 1 | 301 | **3.01** |
| 35 | `scripts/build-index.js` | 1 | 297 | **2.97** |
| 36 | `site/src/components/os/apps/AgentsApp.tsx` | 2 | 141 | **2.82** |
| 37 | `site/src/components/os/apps/HooksApp.tsx` | 2 | 137 | **2.74** |
| 38 | `scripts/translate-assets.js` | 1 | 273 | **2.73** |
| 39 | `scripts/incident.js` | 2 | 131 | **2.62** |
| 40 | `scripts/oracle.js` | 1 | 253 | **2.53** |
| 41 | `scripts/generate-refresh-report.js` | 1 | 249 | **2.49** |
| 42 | `scripts/audit-certified.js` | 1 | 249 | **2.49** |
| 43 | `scripts/learn.js` | 1 | 245 | **2.45** |
| 44 | `site/src/components/os/apps/MarketplaceApp.tsx` | 1 | 231 | **2.31** |
| 45 | `scripts/tribunal.js` | 1 | 214 | **2.14** |
| 46 | `scripts/sweep.js` | 1 | 202 | **2.02** |
| 47 | `scripts/bisect.js` | 1 | 192 | **1.92** |
| 48 | `scripts/permissions.js` | 1 | 189 | **1.89** |
| 49 | `scripts/validate-catalog.js` | 1 | 185 | **1.85** |
| 50 | `site/src/components/os/apps/BenchmarksApp.tsx` | 1 | 184 | **1.84** |
| 51 | `scripts/chart.js` | 1 | 179 | **1.79** |
| 52 | `scripts/certify-stack.js` | 1 | 176 | **1.76** |
| 53 | `site/src/components/os/apps/CommandsApp.tsx` | 1 | 174 | **1.74** |
| 54 | `site/src/components/os/apps/PersonasApp.tsx` | 2 | 85 | **1.7** |
| 55 | `site/src/components/os/apps/RulesApp.tsx` | 2 | 85 | **1.7** |
| 56 | `site/src/components/os/apps/PluginsApp.tsx` | 2 | 84 | **1.68** |
| 57 | `scripts/nightshift.js` | 1 | 160 | **1.6** |
| 58 | `scripts/validate-stacks.js` | 1 | 156 | **1.56** |
| 59 | `scripts/enforce.js` | 1 | 148 | **1.48** |
| 60 | `audit_search4.py` | 1 | 147 | **1.47** |
| 61 | `site/src/components/os/ClaudientOS.tsx` | 2 | 73 | **1.46** |
| 62 | `audit_final.py` | 1 | 145 | **1.45** |
| 63 | `scripts/sentinel.js` | 1 | 145 | **1.45** |
| 64 | `scripts/prophet.js` | 1 | 144 | **1.44** |
| 65 | `scripts/jit.js` | 1 | 143 | **1.43** |
| 66 | `scripts/handoff.js` | 1 | 140 | **1.4** |
| 67 | `scripts/generate-benchmarks.js` | 1 | 140 | **1.4** |
| 68 | `scripts/tdd.js` | 1 | 138 | **1.38** |
| 69 | `site/src/components/os/apps/AboutApp.tsx` | 2 | 69 | **1.38** |
| 70 | `audit_search3.py` | 1 | 136 | **1.36** |
| 71 | `site/src/components/os/Window.tsx` | 1 | 132 | **1.32** |
| 72 | `audit_search2.py` | 1 | 128 | **1.28** |
| 73 | `site/src/components/os/apps/CompareApp.tsx` | 1 | 126 | **1.26** |
| 74 | `scripts/spec.js` | 1 | 124 | **1.24** |
| 75 | `site/src/components/os/apps/WorkflowsApp.tsx` | 1 | 117 | **1.17** |
| 76 | `audit_search5.py` | 1 | 116 | **1.16** |
| 77 | `site/src/components/os/useWindows.ts` | 1 | 116 | **1.16** |
| 78 | `scripts/repair.js` | 1 | 111 | **1.11** |
| 79 | `scripts/commit.js` | 1 | 100 | **1** |
| 80 | `scripts/audit-skills.js` | 1 | 97 | **0.97** |
| 81 | `scripts/checkpoint.js` | 1 | 97 | **0.97** |
| 82 | `cleanup_presence.py` | 1 | 93 | **0.93** |
| 83 | `scripts/ci.js` | 1 | 91 | **0.91** |
| 84 | `cleanup_presence_v2.py` | 1 | 89 | **0.89** |
| 85 | `scripts/documentation.js` | 1 | 81 | **0.81** |
| 86 | `scripts/chaos.js` | 1 | 71 | **0.71** |
| 87 | `scripts/caveman.js` | 1 | 68 | **0.68** |
| 88 | `fix_missing_v2.py` | 1 | 65 | **0.65** |
| 89 | `scripts/auto-frontmatter.js` | 1 | 58 | **0.58** |
| 90 | `scripts/clean-footers.js` | 1 | 55 | **0.55** |
| 91 | `fix_missing.py` | 1 | 54 | **0.54** |
| 92 | `site/src/components/os/apps/ui.tsx` | 1 | 45 | **0.45** |
| 93 | `fix_specific.py` | 1 | 40 | **0.4** |
| 94 | `site/src/components/os/Taskbar.tsx` | 1 | 39 | **0.39** |
| 95 | `site/src/components/os/Desktop.tsx` | 1 | 33 | **0.33** |
| 96 | `site/src/components/os/apps/TrashApp.tsx` | 1 | 27 | **0.27** |
| 97 | `site/src/utils/cn.ts` | 1 | 7 | **0.07** |
| 98 | `site/src/components/os/apps/EnterpriseApp.tsx` | 2 | 0 | **0** |
| 99 | `ai_product_manager_stack/commands/ux-audit.py` | 1 | 0 | **0** |
| 100 | `site/src/content.config.ts` | 1 | 0 | **0** |
| 101 | `site/src/data/featured.ts` | 1 | 0 | **0** |
| 102 | `site/src/lib/content.ts` | 1 | 0 | **0** |
| 103 | `site/src/lib/og.ts` | 1 | 0 | **0** |
| 104 | `site/src/lib/seo.ts` | 1 | 0 | **0** |
| 105 | `site/src/pages/[lang]/raw/[collection]/[...slug].md.ts` | 1 | 0 | **0** |
| 106 | `site/src/pages/llms.txt.ts` | 1 | 0 | **0** |
| 107 | `site/src/pages/og/[collection]/[...slug].svg.ts` | 1 | 0 | **0** |
| 108 | `site/src/pages/og/default.svg.ts` | 1 | 0 | **0** |
| 109 | `site/src/pages/raw/[collection]/[...slug].md.ts` | 1 | 0 | **0** |
| 110 | `site/src/pages/rss-agents.xml.ts` | 1 | 0 | **0** |
| 111 | `site/src/pages/rss-guides.xml.ts` | 1 | 0 | **0** |
| 112 | `site/src/pages/rss-hooks.xml.ts` | 1 | 0 | **0** |
| 113 | `site/src/pages/rss-mcp.xml.ts` | 1 | 0 | **0** |
| 114 | `site/src/pages/rss-skills.xml.ts` | 1 | 0 | **0** |
| 115 | `site/src/pages/rss-workflows.xml.ts` | 1 | 0 | **0** |
| 116 | `site/src/pages/rss.xml.ts` | 1 | 0 | **0** |
| 117 | `site/src/pages/sitemap-index.xml.ts` | 1 | 0 | **0** |

## 💡 Key Recommendations
1. **Refactor `scripts/cli.js`**: High risk score indicates excessive complexity combined with frequent modifications. Split this module into smaller, isolated components to reduce regression potential.
2. **Increase Test Coverage**: Add unit tests covering high-churn files to prevent future outages during rapid changes.

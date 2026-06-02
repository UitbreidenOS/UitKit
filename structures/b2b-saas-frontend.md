# 📂 B2B SaaS Frontend Boilerplate
> The canonical workspace for a production-grade B2B SaaS Frontend (Next.js / React), designed to handle complex state, Role-Based Access Control (RBAC), and high-performance data tables.

📄 `frontend-architecture-brief.md` # Canonical brief: Rendering strategies (SSR vs SSG), component library choices, and routing paradigms
🧠 `active-ui-bugs.md`              # Session memory: Dynamic context tracking for current state-mismatches and responsive layout issues
🤖 `CLAUDE.md`                      # Operating rules: Strict instructions to mandate server components by default and avoid client-side waterfalls

## 📁 state-and-data/ (4 skills - The Client Brain)
📄 `auth-session-store.md`          # Zustand/Redux logic for managing JWTs, refresh tokens, and current user permissions
📄 `health-api-query-client.md`     # TanStack/React Query setup for caching, deduping, and syncing requests to your core backend health-api
📄 `optimistic-ui-updates.md`       # Mutation logic that instantly updates the UI before the server responds to make the app feel lightning fast
📄 `websocket-listeners.md`         # Subscriptions for real-time dashboard notifications and active user presence

## 📁 ui-components/ (3 skills - The View)
📄 `design-system-tokens.md`        # The single source of truth for spacing, typography, and brand colors (Tailwind/CSS Modules)
📄 `complex-data-tables.md`         # Virtualized grid components capable of rendering 10,000+ rows with sorting and pagination without lagging
📄 `rbac-visibility-wrappers.md`    # Utility components that automatically hide buttons or tabs if the user lacks the specific IAM permission

## 📁 routing-and-middleware/ (3 skills - Navigation)
📄 `tenant-subdomain-router.md`     # Logic for handling multi-tenant URLs (e.g., `clientA.health-ui.com` vs `clientB.health-ui.com`)
📄 `edge-auth-guards.md`            # Next.js middleware that intercepts unauthenticated requests at the edge and redirects to `/login`
📄 `dynamic-breadcrumbs.md`         # Auto-generates navigation paths based on the current deep-linked URL structure

## 📁 testing-and-qa/ (3 skills - Stability)
📄 `component-storybook.md`         # Isolated playground for testing UI states visually before integrating them into main pages
📄 `accessibility-auditor.md`       # Axe-core integrations ensuring all forms and modals are screen-reader compliant (WCAG)
📄 `e2e-critical-paths.md`          # Playwright scripts testing the core user journey (e.g., signing up, creating an organization, and billing)

## 📁 build-and-deploy/ (3 skills - CI/CD)
📄 `bundle-size-analyzer.md`        # Fails the build if a PR accidentally imports massive libraries (like lodash) that bloat the initial load time
📄 `env-variable-validator.md`      # Zod schema that crashes the build immediately if a required API key is missing from the environment
📄 `github-final-sync.md`           # Automated GitHub Actions to push the finalized, minified frontend build to your Github final repos

---
**Configuration Files**
⚙️ `next.config.mjs` / `vite.config.ts` # Core bundler configurations, strict mode enforcement, and image domain whitelists
📦 `tailwind.config.ts`                 # Utility class definitions mapping directly to Figma design tokens

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

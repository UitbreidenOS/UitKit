# Mobile App (Expo + React Native) — Project Structure

> For a React Native developer building and shipping a cross-platform mobile app with Expo — optimizing the cycle from new screen to OTA update with full Supabase backend integration.

## Stack

- **Framework:** Expo SDK 51 (React Native 0.74) with Expo Go for development
- **Language:** TypeScript 5.4, strict mode, path aliases via tsconfig.json
- **Navigation:** Expo Router 3 (file-based, Stack + Tabs + Modal layouts)
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **State management:** Zustand 4 (local/global UI state, persisted via AsyncStorage)
- **Server state:** TanStack Query v5 (React Query — data fetching, caching, mutations)
- **In-app purchases:** RevenueCat SDK (`react-native-purchases`) with webhook integration
- **CI/CD:** EAS Build (managed workflow, iOS + Android profiles: development, preview, production)
- **OTA updates:** EAS Update (expo-updates, channel-based rollout)
- **E2E tests:** Maestro (YAML flow files, run locally and in CI)
- **Linting:** ESLint with `eslint-config-expo`, Prettier
- **Notifications:** Expo Notifications with push token registration via Supabase Edge Function

## Directory tree

```
my-app/
├── app/                                    # Expo Router pages (file = route)
│   ├── _layout.tsx                         # Root layout: Supabase auth gate, ThemeProvider, QueryClientProvider
│   ├── index.tsx                           # Entry redirect: authenticated → (tabs), guest → (auth)
│   ├── (auth)/
│   │   ├── _layout.tsx                     # Auth stack layout (Stack, no header)
│   │   ├── login.tsx                       # Email/password + OAuth (Google, Apple) sign-in screen
│   │   ├── register.tsx                    # Account creation with email verification flow
│   │   └── forgot-password.tsx             # Password reset: request + confirm screens
│   ├── (tabs)/
│   │   ├── _layout.tsx                     # Bottom tab navigator: Home, Explore, Profile
│   │   ├── index.tsx                       # Home tab — primary feed or dashboard screen
│   │   ├── explore.tsx                     # Explore/search tab
│   │   └── profile.tsx                     # User profile tab
│   ├── (modals)/
│   │   ├── _layout.tsx                     # Modal stack layout (presentation: modal)
│   │   ├── settings.tsx                    # App settings modal (notifications, theme, account)
│   │   └── paywall.tsx                     # RevenueCat paywall modal — offerings + purchase CTA
│   └── [id]/
│       └── detail.tsx                      # Dynamic detail screen — receives id param via useLocalSearchParams
├── components/
│   ├── ui/                                 # Primitive, reusable UI components
│   │   ├── Button.tsx                      # Branded button: variant (primary/ghost/danger), loading state
│   │   ├── Input.tsx                       # Controlled text input with label, error, and helper text
│   │   ├── Card.tsx                        # Surface card with shadow and rounded corners
│   │   ├── Avatar.tsx                      # User avatar: image with Supabase Storage URL, initials fallback
│   │   ├── Badge.tsx                       # Status badge (success/warning/error/info)
│   │   ├── Sheet.tsx                       # Bottom sheet wrapper (react-native-reanimated)
│   │   ├── Skeleton.tsx                    # Loading placeholder matching component shape
│   │   ├── EmptyState.tsx                  # Empty list/screen state with icon, title, action button
│   │   └── index.ts                        # Barrel export for all ui/ components
│   └── feature/                            # Composed, domain-specific components
│       ├── auth/
│       │   ├── OAuthButtons.tsx            # Google + Apple sign-in buttons with expo-auth-session
│       │   └── SessionGuard.tsx            # Wraps screens that require auth — redirects to (auth)/login
│       ├── feed/
│       │   ├── FeedList.tsx                # FlashList-backed feed with React Query infinite scroll
│       │   ├── FeedItem.tsx                # Single feed card with optimistic like/save actions
│       │   └── FeedItemSkeleton.tsx        # Skeleton placeholder for FeedItem while loading
│       ├── profile/
│       │   ├── ProfileHeader.tsx           # Avatar, display name, subscriber badge, edit button
│       │   └── ProfileStats.tsx            # Follower/following/post counts with navigation
│       └── paywall/
│           ├── OfferingCard.tsx            # Single RevenueCat offering tile (price, period, CTA)
│           └── PremiumBadge.tsx            # "Pro" badge shown on premium content/features
├── lib/
│   ├── supabase.ts                         # createClient() with AsyncStorage session persistence
│   ├── query-client.ts                     # TanStack QueryClient singleton with default staleTime/gcTime
│   ├── revenuecat.ts                       # Purchases.configure() init, entitlement helpers
│   ├── notifications.ts                    # registerForPushNotificationsAsync(), token upsert to Supabase
│   ├── deep-links.ts                       # Linking config, parseURL(), route resolution for deep links
│   └── utils.ts                            # cn() (classname merge), formatDate(), truncate()
├── hooks/
│   ├── useSession.ts                       # Returns current Supabase Session; null if unauthenticated
│   ├── useProfile.ts                       # React Query hook: fetch + cache current user's profile row
│   ├── useRealtime.ts                      # Generic useRealtime<T>(table, filter) subscription hook
│   ├── useFeed.ts                          # useInfiniteQuery over feed table with cursor pagination
│   ├── useEntitlements.ts                  # RevenueCat CustomerInfo hook — is user Pro/Premium?
│   ├── useDeepLink.ts                      # Listens to Linking events, dispatches to Expo Router
│   └── usePushToken.ts                     # Retrieves and registers Expo push token on mount
├── stores/
│   ├── auth.store.ts                       # Zustand: session, profile, setSession, clearSession
│   ├── ui.store.ts                         # Zustand: theme ('light'|'dark'), toastQueue, modalState
│   └── feed.store.ts                       # Zustand: optimistic feed mutations (likes, saves)
├── types/
│   ├── supabase.ts                         # Generated types via `supabase gen types typescript` — DO NOT EDIT
│   ├── api.ts                              # Shared API response shapes, pagination cursors
│   └── env.d.ts                            # Type declarations for process.env / Constants.expoConfig.extra
├── assets/
│   ├── images/
│   │   ├── icon.png                        # App icon 1024x1024 — used by EAS Build
│   │   ├── splash.png                      # Splash screen 1284x2778
│   │   └── adaptive-icon.png               # Android adaptive icon foreground 1024x1024
│   └── fonts/
│       └── Inter-Variable.ttf              # Primary typeface loaded via useFonts()
├── maestro/
│   ├── flows/
│   │   ├── auth-login.yaml                 # E2E: launch app, fill email/password, assert home tab visible
│   │   ├── auth-register.yaml              # E2E: register new account, verify email prompt shown
│   │   ├── feed-scroll.yaml                # E2E: scroll feed, assert items render, tap detail screen
│   │   └── paywall-purchase.yaml           # E2E: trigger paywall, assert offerings visible (sandbox)
│   └── .maestro/
│       └── config.yaml                     # Maestro Cloud config: appId, device profile
├── .eas/
│   └── build/
│       ├── development.json                # EAS development profile: simulator build, dev client
│       ├── preview.json                    # EAS preview profile: internal distribution, APK + IPA
│       └── production.json                 # EAS production profile: App Store + Play Store submission
├── supabase/
│   ├── migrations/
│   │   ├── 20240601_initial_schema.sql     # Users, profiles, posts tables with RLS policies
│   │   └── 20240615_add_subscriptions.sql  # subscriptions table for RevenueCat webhook sync
│   ├── functions/
│   │   ├── push-notification/
│   │   │   └── index.ts                    # Edge Function: receives trigger, sends Expo push via FCM
│   │   └── revenuecat-webhook/
│   │       └── index.ts                    # Edge Function: handles INITIAL_PURCHASE, RENEWAL events
│   └── seed.sql                            # Dev seed: test users, sample posts, dummy subscriptions
├── .github/
│   └── workflows/
│       ├── eas-build-preview.yml           # On PR: run TypeScript check + Maestro + trigger EAS preview build
│       └── eas-update-production.yml       # On merge to main: publish EAS Update to production channel
├── app.json                                # Expo config: name, slug, version, scheme, plugins, extra
├── eas.json                                # EAS Build and Update profiles: development, preview, production
├── tsconfig.json                           # strict: true, paths: { "@/*": ["./*"] }
├── babel.config.js                         # babel-preset-expo, module-resolver for @ alias
├── metro.config.js                         # Metro bundler config: SVG transformer, asset extensions
├── expo-env.d.ts                           # Expo Router type declarations (auto-generated)
├── .env.local                              # Local secrets: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
├── .env.example                            # All required env vars with descriptions — no real values
└── package.json                            # Dependencies, scripts: start, build, typecheck, lint, maestro
```

## Key files explained

| Path | Purpose |
|---|---|
| `app/_layout.tsx` | Root layout that initialises the Supabase auth listener (`onAuthStateChange`), wraps the tree in `QueryClientProvider`, and redirects unauthenticated users to the `(auth)` group before any tab renders |
| `lib/supabase.ts` | `createClient()` configured with `ExpoSecureStoreAdapter` for session persistence and `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — all other files import from here, never call `createClient` again |
| `types/supabase.ts` | Auto-generated database types from `supabase gen types typescript --local` — provides typed `.from()`, `.select()`, and `.insert()` calls throughout the codebase; regenerate after every migration |
| `hooks/useRealtime.ts` | Generic hook that subscribes to a Supabase Realtime channel on mount and unsubscribes on unmount; accepts a table name, filter string, and callback — reused across feed updates, chat, and notification dot |
| `stores/auth.store.ts` | Zustand store holding the current session and profile; persisted with `zustand/middleware/persist` + AsyncStorage; the single source of truth for auth state across all screens and hooks |
| `eas.json` | Defines `development` (simulator, dev client), `preview` (internal distribution), and `production` (store submission) build profiles; also defines `production` and `staging` update channels for EAS Update |
| `maestro/flows/auth-login.yaml` | Full E2E login flow used in CI; taps email input, types credential, submits, asserts the home tab label is visible — run locally with `maestro test maestro/flows/auth-login.yaml` |
| `supabase/functions/revenuecat-webhook/index.ts` | Deno Edge Function that receives RevenueCat webhook events, validates the `X-RevenueCat-Auth` header, and upserts subscription status into the `subscriptions` table |

## Quick scaffold

```bash
# Prerequisites: Node 20+, Expo CLI, EAS CLI, Supabase CLI
npm install -g eas-cli
npm install -g supabase

# Create Expo project with TypeScript template
npx create-expo-app@latest my-app --template blank-typescript
cd my-app

# Install core dependencies
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx expo install @tanstack/react-query zustand
npx expo install react-native-purchases          # RevenueCat
npx expo install expo-notifications expo-auth-session expo-web-browser
npx expo install expo-secure-store
npx expo install @shopify/flash-list             # High-performance list

# Dev dependencies
npm install --save-dev @types/react @types/react-native typescript
npm install --save-dev eslint eslint-config-expo prettier

# Create directory structure
mkdir -p app/(auth) app/(tabs) app/(modals) "app/[id]"
mkdir -p components/ui components/feature/auth components/feature/feed
mkdir -p components/feature/profile components/feature/paywall
mkdir -p lib hooks stores types
mkdir -p assets/images assets/fonts
mkdir -p maestro/flows maestro/.maestro
mkdir -p .eas/build
mkdir -p supabase/migrations supabase/functions/push-notification
mkdir -p supabase/functions/revenuecat-webhook
mkdir -p .github/workflows

# Touch key files
touch app/_layout.tsx app/index.tsx
touch app/"(auth)"/_layout.tsx app/"(auth)"/login.tsx
touch app/"(auth)"/register.tsx app/"(auth)"/forgot-password.tsx
touch app/"(tabs)"/_layout.tsx app/"(tabs)"/index.tsx
touch app/"(tabs)"/explore.tsx app/"(tabs)"/profile.tsx
touch app/"(modals)"/_layout.tsx app/"(modals)"/settings.tsx
touch app/"(modals)"/paywall.tsx
touch lib/supabase.ts lib/query-client.ts lib/revenuecat.ts
touch lib/notifications.ts lib/deep-links.ts lib/utils.ts
touch hooks/useSession.ts hooks/useProfile.ts hooks/useRealtime.ts
touch hooks/useFeed.ts hooks/useEntitlements.ts
touch hooks/useDeepLink.ts hooks/usePushToken.ts
touch stores/auth.store.ts stores/ui.store.ts stores/feed.store.ts
touch types/api.ts types/env.d.ts
touch .env.local .env.example

# Supabase init
supabase init
supabase start

# Generate types after schema is set up
# supabase gen types typescript --local > types/supabase.ts

# EAS init
eas init
eas build:configure

# Write EAS update channels
eas channel:create production
eas channel:create staging

# Maestro config
cat > maestro/.maestro/config.yaml << 'EOF'
appId: com.yourcompany.myapp
---
EOF

# Install Claudient skills
npx claudient add skill mobile/expo-router-screen
npx claudient add skill mobile/supabase-realtime
npx claudient add skill mobile/eas-build
npx claudient add skill mobile/revenuecat-paywall
npx claudient add skill mobile/deep-link-handler
npx claudient add skill productivity/code-review
npx claudient add skill git/pr-description

echo "Mobile app scaffold complete. Next: add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.local"
```

## CLAUDE.md template

```markdown
# Mobile App — Claude Code Instructions

This is a cross-platform mobile app built with Expo SDK 51 and React Native. Navigation is
file-based via Expo Router 3. The backend is Supabase (auth, database, realtime, storage).
State is split between Zustand (local/UI) and TanStack Query v5 (server state). In-app
purchases use RevenueCat. Builds ship via EAS Build; OTA patches via EAS Update.

## Stack

- Expo SDK 51, React Native 0.74, TypeScript 5.4 (strict)
- Expo Router 3: app/ directory = routes; (auth), (tabs), (modals) are route groups
- Supabase: client in lib/supabase.ts — NEVER call createClient() anywhere else
- Zustand: stores in stores/; always use the selector pattern (useAuthStore(s => s.session))
- TanStack Query v5: QueryClient singleton in lib/query-client.ts; hooks in hooks/
- RevenueCat: initialised in lib/revenuecat.ts; entitlement checks via hooks/useEntitlements.ts
- EAS Build profiles: development (dev client), preview (internal), production (stores)
- EAS Update channels: production, staging
- Maestro E2E flows in maestro/flows/; run with: maestro test maestro/flows/<name>.yaml

## Common tasks — use these exact commands

### Add a new screen
Create the file under app/ following the route group structure. Export a default React component.
Add a <Link href="/path"> or router.push('/path') to navigate to it.
If it requires auth, wrap the root export with <SessionGuard />.

### Add a new Supabase table
1. Write a migration: supabase migration new <name>
2. Add table DDL and RLS policies in supabase/migrations/<timestamp>_<name>.sql
3. Apply locally: supabase db push
4. Regenerate types: supabase gen types typescript --local > types/supabase.ts
5. Commit the migration and updated types together.

### Subscribe to Supabase realtime in a component
Use the generic hook:
  const { data } = useRealtime<MyType>('table_name', `column=eq.${id}`)
The hook in hooks/useRealtime.ts handles subscribe/unsubscribe lifecycle automatically.

### Trigger an EAS build
Development (simulator): eas build --profile development --platform ios
Preview (internal QR): eas build --profile preview --platform all
Production (stores):    eas build --profile production --platform all

### Publish an OTA update
Staging channel:    eas update --channel staging --message "fix: ..."
Production channel: eas update --channel production --message "fix: ..."
Never push a production OTA without testing on staging first.

### Run E2E tests
Single flow:  maestro test maestro/flows/auth-login.yaml
All flows:    maestro test maestro/flows/

### Check TypeScript
npx tsc --noEmit

### Lint
npx eslint . --ext .ts,.tsx

## Conventions

- Path alias: use @/ for imports from project root (e.g., @/lib/supabase, @/components/ui/Button)
- Environment variables: prefix with EXPO_PUBLIC_ for client-side access; server-only vars (service role key) go in EAS secrets, never in app.json extra
- Supabase types: types/supabase.ts is auto-generated — never hand-edit it; regenerate after every migration
- Component naming: PascalCase files; default export matches filename (Button.tsx → export default function Button)
- Zustand stores: one file per domain in stores/; always export typed selector hooks, not the raw store
- React Query keys: define as const arrays in the hook file — [resource, id] pattern; invalidate by prefix after mutations
- Deep links: scheme is defined in app.json under "scheme"; all deep link parsing goes through lib/deep-links.ts

## Zustand pattern — use this exactly

```ts
// stores/auth.store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  setSession: (session: Session | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
)
```

## Deep link handling

All routes are available as deep links via the app scheme (see app.json `scheme`).
Linking config lives in lib/deep-links.ts. To handle a new deep link path:
1. Add the path to the Expo Router file structure (it becomes a route automatically)
2. If the path needs param parsing beyond Expo Router's default, add a case in lib/deep-links.ts
3. Test with: npx uri-scheme open "myapp://path/to/screen" --ios

## What not to do

- Do not import supabase createClient from @supabase/supabase-js directly in components — always use lib/supabase.ts
- Do not store secrets in app.json extra or .env.local that is committed — use EAS secrets for service keys
- Do not hand-edit types/supabase.ts — regenerate with supabase gen types
- Do not use React Navigation directly — all navigation goes through Expo Router (router.push, <Link>)
- Do not publish a production EAS Update without a staging test first
- Do not skip RLS policies on new Supabase tables — every table must have Row Level Security enabled
```

## MCP servers

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/my-app"
      ]
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "${SENTRY_ORG}",
        "SENTRY_PROJECT": "${SENTRY_PROJECT}"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'EXT=\"${CLAUDE_TOOL_INPUT_FILE_PATH##*.}\"; if [[ \"$EXT\" == \"ts\" || \"$EXT\" == \"tsx\" ]]; then npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"supabase/migrations/\"; then echo \"[HOOK] Migration written — run: supabase db push && supabase gen types typescript --local > types/supabase.ts\" >&2; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"eas update.*(--channel production|production)\"; then echo \"[HOOK] Production EAS Update detected — confirm staging was tested first (eas update --channel staging).\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill mobile/expo-router-screen
npx claudient add skill mobile/supabase-realtime
npx claudient add skill mobile/eas-build
npx claudient add skill mobile/revenuecat-paywall
npx claudient add skill mobile/deep-link-handler
npx claudient add skill mobile/push-notifications
npx claudient add skill productivity/code-review
npx claudient add skill git/pr-description
npx claudient add skill productivity/test-generator
```

## Related

- [Mobile Development Guide](../guides/mobile-expo-react-native.md)
- [EAS Build and Update Workflow](../workflows/eas-build-update.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

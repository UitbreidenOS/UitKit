# Mobile App (Expo + React Native) — Projektstruktur

> Für React-Native-Entwickler, die eine plattformübergreifende mobile App mit Expo entwickeln und ausliefern — Optimierung des Zyklus vom neuen Screen zum OTA-Update mit vollständiger Supabase-Backend-Integration.

## Stack

- **Framework:** Expo SDK 51 (React Native 0.74) mit Expo Go für die Entwicklung
- **Sprache:** TypeScript 5.4, strikter Modus, Path-Aliase via tsconfig.json
- **Navigation:** Expo Router 3 (dateibasiert, Stack + Tabs + Modal-Layouts)
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **State Management:** Zustand 4 (lokaler/globaler UI-State, persistiert via AsyncStorage)
- **Server State:** TanStack Query v5 (React Query — Datenbeschaffung, Caching, Mutationen)
- **In-App-Käufe:** RevenueCat SDK (`react-native-purchases`) mit Webhook-Integration
- **CI/CD:** EAS Build (verwalteter Workflow, iOS + Android Profile: development, preview, production)
- **OTA-Updates:** EAS Update (expo-updates, kanalbasierte Rollouts)
- **E2E-Tests:** Maestro (YAML-Flow-Dateien, lokal und in CI ausführbar)
- **Linting:** ESLint mit `eslint-config-expo`, Prettier
- **Benachrichtigungen:** Expo Notifications mit Push-Token-Registrierung via Supabase Edge Function

## Verzeichnisstruktur

```
my-app/
├── app/                                    # Expo Router-Seiten (Datei = Route)
│   ├── _layout.tsx                         # Root-Layout: Supabase-Auth-Gate, ThemeProvider, QueryClientProvider
│   ├── index.tsx                           # Entry Redirect: authentifiziert → (tabs), Gast → (auth)
│   ├── (auth)/
│   │   ├── _layout.tsx                     # Auth-Stack-Layout (Stack, kein Header)
│   │   ├── login.tsx                       # Email/Passwort + OAuth (Google, Apple) Anmeldungsscreen
│   │   ├── register.tsx                    # Kontoerstellung mit E-Mail-Verifizierungsflow
│   │   └── forgot-password.tsx             # Passwort-Zurücksetzen: Anfrage- + Bestätigungsscreens
│   ├── (tabs)/
│   │   ├── _layout.tsx                     # Bottom-Tab-Navigator: Home, Explore, Profile
│   │   ├── index.tsx                       # Home-Tab — primärer Feed- oder Dashboard-Screen
│   │   ├── explore.tsx                     # Erkunden/Such-Tab
│   │   └── profile.tsx                     # Benutzerprofil-Tab
│   ├── (modals)/
│   │   ├── _layout.tsx                     # Modal-Stack-Layout (presentation: modal)
│   │   ├── settings.tsx                    # App-Einstellungen-Modal (Benachrichtigungen, Design, Konto)
│   │   └── paywall.tsx                     # RevenueCat-Paywall-Modal — Angebote + Kaufs-CTA
│   └── [id]/
│       └── detail.tsx                      # Dynamischer Detail-Screen — erhält id-Parameter via useLocalSearchParams
├── components/
│   ├── ui/                                 # Primitive, wiederverwendbare UI-Komponenten
│   │   ├── Button.tsx                      # Gebrandeter Button: Variante (primary/ghost/danger), Ladestatus
│   │   ├── Input.tsx                       # Kontrollierte Texteingabe mit Label, Fehler und Hilfetext
│   │   ├── Card.tsx                        # Oberflächenkarte mit Schatten und abgerundeten Ecken
│   │   ├── Avatar.tsx                      # Benutzer-Avatar: Bild mit Supabase-Storage-URL, Initialen-Fallback
│   │   ├── Badge.tsx                       # Status-Badge (success/warning/error/info)
│   │   ├── Sheet.tsx                       # Bottom-Sheet-Wrapper (react-native-reanimated)
│   │   ├── Skeleton.tsx                    # Lade-Platzhalter, der die Komponentenform anpasst
│   │   ├── EmptyState.tsx                  # Leerer Listen-/Screen-State mit Icon, Titel, Action-Button
│   │   └── index.ts                        # Barrel-Export für alle ui/-Komponenten
│   └── feature/                            # Komponiert, Domain-spezifische Komponenten
│       ├── auth/
│       │   ├── OAuthButtons.tsx            # Google + Apple Anmeldungs-Buttons mit expo-auth-session
│       │   └── SessionGuard.tsx            # Umhüllt Screens, die Authentifizierung benötigen — leitet zu (auth)/login weiter
│       ├── feed/
│       │   ├── FeedList.tsx                # FlashList-gestützter Feed mit React Query unendliches Scroll
│       │   ├── FeedItem.tsx                # Einzelne Feed-Karte mit optimistischen Like/Save-Aktionen
│       │   └── FeedItemSkeleton.tsx        # Skeleton-Platzhalter für FeedItem beim Laden
│       ├── profile/
│       │   ├── ProfileHeader.tsx           # Avatar, Anzeigename, Abonnenten-Badge, Bearbeitungs-Button
│       │   └── ProfileStats.tsx            # Follower/Folgende/Beitragszählungen mit Navigation
│       └── paywall/
│           ├── OfferingCard.tsx            # Einzelnes RevenueCat-Angebots-Tile (Preis, Zeitraum, CTA)
│           └── PremiumBadge.tsx            # "Pro"-Badge auf Premium-Inhalte/Features angezeigt
├── lib/
│   ├── supabase.ts                         # createClient() mit AsyncStorage-Session-Persistierung
│   ├── query-client.ts                     # TanStack QueryClient Singleton mit Standard staleTime/gcTime
│   ├── revenuecat.ts                       # Purchases.configure() Init, Entitlements-Helfer
│   ├── notifications.ts                    # registerForPushNotificationsAsync(), Token-Upsert zu Supabase
│   ├── deep-links.ts                       # Linking-Konfiguration, parseURL(), Route-Auflösung für Deep Links
│   └── utils.ts                            # cn() (Klassenname-Merge), formatDate(), truncate()
├── hooks/
│   ├── useSession.ts                       # Gibt aktuelle Supabase-Session zurück; null wenn nicht authentifiziert
│   ├── useProfile.ts                       # React Query Hook: abrufen + aktuellen Benutzerprofil-Row cachen
│   ├── useRealtime.ts                      # Generic useRealtime<T>(table, filter) Abonnement-Hook
│   ├── useFeed.ts                          # useInfiniteQuery über Feed-Tabelle mit Cursor-Pagination
│   ├── useEntitlements.ts                  # RevenueCat CustomerInfo Hook — ist Benutzer Pro/Premium?
│   ├── useDeepLink.ts                      # Hört auf Linking-Events, leitet an Expo Router weiter
│   └── usePushToken.ts                     # Ruft Expo-Push-Token beim Mount ab und registriert ihn
├── stores/
│   ├── auth.store.ts                       # Zustand: Session, Profil, setSession, clearSession
│   ├── ui.store.ts                         # Zustand: theme ('light'|'dark'), toastQueue, modalState
│   └── feed.store.ts                       # Zustand: optimistische Feed-Mutationen (Likes, Saves)
├── types/
│   ├── supabase.ts                         # Generierte Typen via `supabase gen types typescript` — NICHT BEARBEITEN
│   ├── api.ts                              # Gemeinsame API-Antwortformen, Pagination-Cursor
│   └── env.d.ts                            # Typ-Deklarationen für process.env / Constants.expoConfig.extra
├── assets/
│   ├── images/
│   │   ├── icon.png                        # App-Icon 1024x1024 — verwendet von EAS Build
│   │   ├── splash.png                      # Splash-Screen 1284x2778
│   │   └── adaptive-icon.png               # Android adaptives Icon Vordergrund 1024x1024
│   └── fonts/
│       └── Inter-Variable.ttf              # Primäre Schriftart geladen via useFonts()
├── maestro/
│   ├── flows/
│   │   ├── auth-login.yaml                 # E2E: App starten, E-Mail/Passwort ausfüllen, Home-Tab sichtbar
│   │   ├── auth-register.yaml              # E2E: Neues Konto registrieren, E-Mail-Verifizierungs-Prompt anzeigen
│   │   ├── feed-scroll.yaml                # E2E: Feed scrollen, Artikel rendern, Detail-Screen tippen
│   │   └── paywall-purchase.yaml           # E2E: Paywall auslösen, Angebote sichtbar (Sandbox)
│   └── .maestro/
│       └── config.yaml                     # Maestro Cloud Konfiguration: appId, device Profile
├── .eas/
│   └── build/
│       ├── development.json                # EAS development Profil: Simulator-Build, Dev-Client
│       ├── preview.json                    # EAS preview Profil: interne Verteilung, APK + IPA
│       └── production.json                 # EAS production Profil: App Store + Play Store Einreichung
├── supabase/
│   ├── migrations/
│   │   ├── 20240601_initial_schema.sql     # Users, Profiles, Posts Tabellen mit RLS-Richtlinien
│   │   └── 20240615_add_subscriptions.sql  # subscriptions Tabelle für RevenueCat Webhook-Sync
│   ├── functions/
│   │   ├── push-notification/
│   │   │   └── index.ts                    # Edge Function: erhält Trigger, sendet Expo-Push via FCM
│   │   └── revenuecat-webhook/
│   │       └── index.ts                    # Edge Function: verarbeitet INITIAL_PURCHASE, RENEWAL Events
│   └── seed.sql                            # Dev Seed: Test-Benutzer, Beispiel-Posts, Dummy-Abos
├── .github/
│   └── workflows/
│       ├── eas-build-preview.yml           # Bei PR: TypeScript-Prüfung + Maestro + EAS preview Build auslösen
│       └── eas-update-production.yml       # Bei Merge zu main: EAS Update zum production Channel veröffentlichen
├── app.json                                # Expo-Konfiguration: Name, Slug, Version, Scheme, Plugins, Extra
├── eas.json                                # EAS Build und Update Profile: development, preview, production
├── tsconfig.json                           # strict: true, paths: { "@/*": ["./*"] }
├── babel.config.js                         # babel-preset-expo, module-resolver für @ Alias
├── metro.config.js                         # Metro Bundler Konfiguration: SVG-Transformer, Asset-Erweiterungen
├── expo-env.d.ts                           # Expo Router Typ-Deklarationen (automatisch generiert)
├── .env.local                              # Lokale Geheimnisse: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
├── .env.example                            # Alle erforderlichen Umgebungsvariablen mit Beschreibungen — keine echten Werte
└── package.json                            # Abhängigkeiten, Scripts: start, build, typecheck, lint, maestro
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `app/_layout.tsx` | Root-Layout, das den Supabase-Auth-Listener initialisiert (`onAuthStateChange`), den Baum in `QueryClientProvider` umhüllt und nicht authentifizierte Benutzer zur `(auth)` Gruppe umleitet, bevor Tabs rendern |
| `lib/supabase.ts` | `createClient()` konfiguriert mit `ExpoSecureStoreAdapter` für Session-Persistierung und `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — alle anderen Dateien importieren von hier, niemals `createClient` erneut aufrufen |
| `types/supabase.ts` | Auto-generierte Datenbanktypen von `supabase gen types typescript --local` — bietet typisierte `.from()`, `.select()` und `.insert()` Aufrufe in der gesamten Codebasis; nach jeder Migration regenerieren |
| `hooks/useRealtime.ts` | Generic Hook, der sich beim Mount auf einen Supabase-Realtime-Kanal abonniert und beim Unmount abmeldet; akzeptiert Tabellennamen, Filterzeichenfolge und Callback — wird über Feed-Updates, Chat und Benachrichtigungspunkt wiederverwendet |
| `stores/auth.store.ts` | Zustand-Store mit aktueller Session und Profil; persistiert mit `zustand/middleware/persist` + AsyncStorage; die einzelne Quelle der Wahrheit für Auth-State über alle Screens und Hooks |
| `eas.json` | Definiert `development` (Simulator, Dev-Client), `preview` (interne Verteilung) und `production` (Store-Einreichung) Build-Profile; definiert auch `production` und `staging` Update-Kanäle für EAS Update |
| `maestro/flows/auth-login.yaml` | Vollständiger E2E-Login-Flow in CI; tippt E-Mail-Eingabe, gibt Anmeldedaten ein, sendet ab, stellt Home-Tab-Label-Sichtbarkeit fest — lokal mit `maestro test maestro/flows/auth-login.yaml` ausführen |
| `supabase/functions/revenuecat-webhook/index.ts` | Deno Edge Function, die RevenueCat-Webhook-Events erhält, den `X-RevenueCat-Auth` Header validiert und Abonnementstatus in die `subscriptions` Tabelle einfügt |

## Schnelles Gerüst

```bash
# Voraussetzungen: Node 20+, Expo CLI, EAS CLI, Supabase CLI
npm install -g eas-cli
npm install -g supabase

# Erstelle Expo-Projekt mit TypeScript-Template
npx create-expo-app@latest my-app --template blank-typescript
cd my-app

# Installiere Core-Abhängigkeiten
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx expo install @tanstack/react-query zustand
npx expo install react-native-purchases          # RevenueCat
npx expo install expo-notifications expo-auth-session expo-web-browser
npx expo install expo-secure-store
npx expo install @shopify/flash-list             # Hochleistungs-Liste

# Dev-Abhängigkeiten
npm install --save-dev @types/react @types/react-native typescript
npm install --save-dev eslint eslint-config-expo prettier

# Erstelle Verzeichnisstruktur
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

# Berühre wichtige Dateien
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

# Generiere Typen nach Schema-Setup
# supabase gen types typescript --local > types/supabase.ts

# EAS init
eas init
eas build:configure

# Schreibe EAS Update Kanäle
eas channel:create production
eas channel:create staging

# Maestro Konfiguration
cat > maestro/.maestro/config.yaml << 'EOF'
appId: com.yourcompany.myapp
---
EOF

# Installiere Claudient Skills
npx claudient add skill mobile/expo-router-screen
npx claudient add skill mobile/supabase-realtime
npx claudient add skill mobile/eas-build
npx claudient add skill mobile/revenuecat-paywall
npx claudient add skill mobile/deep-link-handler
npx claudient add skill productivity/code-review
npx claudient add skill git/pr-description

echo "Mobile App Gerüst abgeschlossen. Nächst: EXPO_PUBLIC_SUPABASE_URL und EXPO_PUBLIC_SUPABASE_ANON_KEY zu .env.local hinzufügen"
```

## CLAUDE.md Template

```markdown
# Mobile App — Claude Code Anweisungen

Dies ist eine plattformübergreifende Mobile App, gebaut mit Expo SDK 51 und React Native. Navigation ist
dateibasiert via Expo Router 3. Das Backend ist Supabase (Auth, Datenbank, Realtime, Storage).
State ist aufgeteilt zwischen Zustand (lokal/UI) und TanStack Query v5 (Server-State). In-App-Käufe
verwenden RevenueCat. Builds werden via EAS Build ausgeliefert; OTA-Patches via EAS Update.

## Stack

- Expo SDK 51, React Native 0.74, TypeScript 5.4 (strict)
- Expo Router 3: app/ Verzeichnis = Routes; (auth), (tabs), (modals) sind Route Groups
- Supabase: Client in lib/supabase.ts — NIEMALS createClient() sonst irgendwo aufrufen
- Zustand: Stores in stores/; immer das Selector-Pattern verwenden (useAuthStore(s => s.session))
- TanStack Query v5: QueryClient Singleton in lib/query-client.ts; Hooks in hooks/
- RevenueCat: initialisiert in lib/revenuecat.ts; Entitlements-Prüfungen via hooks/useEntitlements.ts
- EAS Build Profile: development (Dev-Client), preview (intern), production (Stores)
- EAS Update Kanäle: production, staging
- Maestro E2E Flows in maestro/flows/; ausführen mit: maestro test maestro/flows/<name>.yaml

## Häufige Aufgaben — verwende diese genauen Befehle

### Neuen Screen hinzufügen
Erstelle die Datei unter app/ und folge der Route Group Struktur. Exportiere eine Standard React-Komponente.
Füge einen <Link href="/path"> oder router.push('/path') hinzu, um dorthin zu navigieren.
Falls Auth erforderlich ist, umhülle den Root-Export mit <SessionGuard />.

### Neue Supabase-Tabelle hinzufügen
1. Schreibe eine Migration: supabase migration new <name>
2. Füge Tabellen-DDL und RLS-Richtlinien in supabase/migrations/<timestamp>_<name>.sql hinzu
3. Lokal anwenden: supabase db push
4. Regeneriere Typen: supabase gen types typescript --local > types/supabase.ts
5. Commit Migration und aktualisierte Typen zusammen.

### Abonniere Supabase Realtime in einer Komponente
Verwende den generischen Hook:
  const { data } = useRealtime<MyType>('table_name', `column=eq.${id}`)
Der Hook in hooks/useRealtime.ts verwaltet Subscribe/Unsubscribe Lebenszyklus automatisch.

### Löse einen EAS Build aus
Development (Simulator): eas build --profile development --platform ios
Preview (intern QR): eas build --profile preview --platform all
Production (Stores):    eas build --profile production --platform all

### Veröffentliche ein OTA Update
Staging Channel:    eas update --channel staging --message "fix: ..."
Production Channel: eas update --channel production --message "fix: ..."
Push nie ein Production OTA ohne vorherigen Staging-Test.

### Führe E2E Tests aus
Einzelner Flow:  maestro test maestro/flows/auth-login.yaml
Alle Flows:      maestro test maestro/flows/

### Prüfe TypeScript
npx tsc --noEmit

### Lint
npx eslint . --ext .ts,.tsx

## Konventionen

- Path Alias: verwende @/ für Importe vom Projekt-Root (z.B. @/lib/supabase, @/components/ui/Button)
- Umgebungsvariablen: präfixe mit EXPO_PUBLIC_ für Client-Zugriff; Server-only Vars (Service Role Key) gehen in EAS Secrets, nie in app.json extra
- Supabase Typen: types/supabase.ts ist auto-generiert — nie manuell bearbeiten; nach jeder Migration regenerieren
- Komponenten-Benennung: PascalCase Dateien; Standard-Export entspricht Dateiname (Button.tsx → export default function Button)
- Zustand Stores: eine Datei pro Domain in stores/; exporte immer typisierte Selector Hooks, nicht den Raw Store
- React Query Keys: definiere als const Arrays in der Hook-Datei — [resource, id] Pattern; invalidiere nach Mutations nach Prefix
- Deep Links: Scheme ist in app.json unter "scheme" definiert; alle Deep Link Parsing geht durch lib/deep-links.ts

## Zustand Pattern — verwende dies genau

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

## Deep Link Handling

Alle Routes sind über Deep Links via App-Scheme verfügbar (siehe app.json `scheme`).
Linking-Konfiguration lebt in lib/deep-links.ts. Um einen neuen Deep Link Pfad zu handhaben:
1. Füge den Pfad zur Expo Router Datei-Struktur hinzu (wird automatisch zur Route)
2. Falls der Pfad Param-Parsing über Expo Routers Standard hinaus benötigt, füge einen Case in lib/deep-links.ts hinzu
3. Teste mit: npx uri-scheme open "myapp://path/to/screen" --ios

## Was nicht zu tun ist

- Importiere supabase createClient nicht direkt von @supabase/supabase-js in Komponenten — verwende immer lib/supabase.ts
- Speichere keine Geheimnisse in app.json extra oder committed .env.local — verwende EAS Secrets für Service Keys
- Bearbeite nicht von Hand types/supabase.ts — regeneriere mit supabase gen types
- Verwende React Navigation nicht direkt — alle Navigation geht durch Expo Router (router.push, <Link>)
- Veröffentliche kein Production EAS Update ohne vorherigen Staging-Test
- Ignoriere keine RLS-Richtlinien bei neuen Supabase-Tabellen — jede Tabelle muss Row Level Security aktiviert haben
```

## MCP Server

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

## Empfohlene Hooks

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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"supabase/migrations/\"; then echo \"[HOOK] Migration geschrieben — ausführen: supabase db push && supabase gen types typescript --local > types/supabase.ts\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"eas update.*(--channel production|production)\"; then echo \"[HOOK] Production EAS Update erkannt — bestätige, dass Staging vorher getestet wurde (eas update --channel staging).\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

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

## Verwandt

- [Mobile Development Guide](../guides/mobile-expo-react-native.md)
- [EAS Build and Update Workflow](../workflows/eas-build-update.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

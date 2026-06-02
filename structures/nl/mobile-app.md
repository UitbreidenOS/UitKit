# Mobiele app (Expo + React Native) — Projectstructuur

> Voor een React Native-ontwikkelaar die een cross-platform mobiele app bouwt en verstuurt met Expo — het optimaliseren van de cyclus van nieuw scherm naar OTA-update met volledige Supabase-backend-integratie.

## Stack

- **Framework:** Expo SDK 51 (React Native 0.74) met Expo Go voor ontwikkeling
- **Taal:** TypeScript 5.4, strikte modus, padaliassen via tsconfig.json
- **Navigatie:** Expo Router 3 (op bestanden gebaseerd, Stack + Tabs + Modal-layouts)
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **Statusbeheer:** Zustand 4 (lokale/globale UI-status, persistentie via AsyncStorage)
- **Serverstatus:** TanStack Query v5 (React Query — gegevens ophalen, caching, mutaties)
- **In-app-aankopen:** RevenueCat SDK (`react-native-purchases`) met webhookintegratie
- **CI/CD:** EAS Build (beheerde workflow, iOS + Android-profielen: development, preview, production)
- **OTA-updates:** EAS Update (expo-updates, op kanaal gebaseerde implementatie)
- **E2E-tests:** Maestro (YAML-stroombestanden, lokaal en in CI uitvoeren)
- **Linting:** ESLint met `eslint-config-expo`, Prettier
- **Meldingen:** Expo Notifications met push-tokenregistratie via Supabase Edge Function

## Mappenboom

```
my-app/
├── app/                                    # Expo Router-pagina's (bestand = route)
│   ├── _layout.tsx                         # Rootlayout: Supabase-autorisatiepoort, ThemeProvider, QueryClientProvider
│   ├── index.tsx                           # Entry-omleiding: geverifieerd → (tabs), gast → (auth)
│   ├── (auth)/
│   │   ├── _layout.tsx                     # Auth-stacklayout (Stack, geen header)
│   │   ├── login.tsx                       # E-mail/wachtwoord + OAuth (Google, Apple) aanmeldingsscherm
│   │   ├── register.tsx                    # Accountcreatie met e-mailverificatiestroom
│   │   └── forgot-password.tsx             # Wachtwoord opnieuw instellen: aanvraag- + bevestigingsschermen
│   ├── (tabs)/
│   │   ├── _layout.tsx                     # Onderste tabnav: Startpagina, Verkennen, Profiel
│   │   ├── index.tsx                       # Starttabblad — primaire feedstroom of dashboardscherm
│   │   ├── explore.tsx                     # Tabblad Verkennen/Zoeken
│   │   └── profile.tsx                     # Gebruikersprofieltabblad
│   ├── (modals)/
│   │   ├── _layout.tsx                     # Modalstacklayout (presentatie: modal)
│   │   ├── settings.tsx                    # App-instellingenmodal (meldingen, thema, account)
│   │   └── paywall.tsx                     # RevenueCat-paywall-modal — aanbiedingen + aankoop-CTA
│   └── [id]/
│       └── detail.tsx                      # Dynamisch detailscherm — ontvangt id-parameter via useLocalSearchParams
├── components/
│   ├── ui/                                 # Primitieve, herbruikbare UI-componenten
│   │   ├── Button.tsx                      # Gemarkeerde knop: variant (primair/ghost/danger), ladingsstatus
│   │   ├── Input.tsx                       # Gecontroleerde tekstinvoer met label, fout en hulptekst
│   │   ├── Card.tsx                        # Oppervlaktekaart met schaduw en afgeronde hoeken
│   │   ├── Avatar.tsx                      # Gebruikersavatar: afbeelding met Supabase Storage-URL, initialen fallback
│   │   ├── Badge.tsx                       # Statusbadge (succes/waarschuwing/fout/info)
│   │   ├── Sheet.tsx                       # Onderaan werkblad-wrapper (react-native-reanimated)
│   │   ├── Skeleton.tsx                    # Laadplaatsholder die de componentvorm aansluit
│   │   ├── EmptyState.tsx                  # Lege lijst-/schermstatus met pictogram, titel, actieknop
│   │   └── index.ts                        # Vat-export voor alle ui/-componenten
│   └── feature/                            # Samengestelde, domeinspecifieke componenten
│       ├── auth/
│       │   ├── OAuthButtons.tsx            # Google + Apple-aanmeldingsknoppen met expo-auth-session
│       │   └── SessionGuard.tsx            # Wikkelt schermen die verificatie vereisen — omleiding naar (auth)/login
│       ├── feed/
│       │   ├── FeedList.tsx                # FlashList-ondersteunde feed met React Query oneindige scroll
│       │   ├── FeedItem.tsx                # Enkele feedkaart met optimistische like/save-acties
│       │   └── FeedItemSkeleton.tsx        # Skeletplaatsholder voor FeedItem tijdens laden
│       ├── profile/
│       │   ├── ProfileHeader.tsx           # Avatar, weergavenaam, abonnementsbadge, bewerkingsknop
│       │   └── ProfileStats.tsx            # Volgers/volgende/posttellingen met navigatie
│       └── paywall/
│           ├── OfferingCard.tsx            # Enkele RevenueCat-aanbiedingstegel (prijs, periode, CTA)
│           └── PremiumBadge.tsx            # "Pro"-badge weergegeven op premium-inhoud/functies
├── lib/
│   ├── supabase.ts                         # createClient() met AsyncStorage-sessiepersistentie
│   ├── query-client.ts                     # TanStack QueryClient-singleton met standaard staleTime/gcTime
│   ├── revenuecat.ts                       # Purchases.configure() init, entitlement-helpers
│   ├── notifications.ts                    # registerForPushNotificationsAsync(), tokenupsert naar Supabase
│   ├── deep-links.ts                       # Linkingconfiguratie, parseURL(), routeresolutie voor diepe koppelingen
│   └── utils.ts                            # cn() (klassenaam samenvoegen), formatDate(), truncate()
├── hooks/
│   ├── useSession.ts                       # Retourneert huidige Supabase-sessie; nul als niet geverifieerd
│   ├── useProfile.ts                       # React Query-hook: huidige gebruikersprofielrij ophalen + cachen
│   ├── useRealtime.ts                      # Generieke useRealtime<T>(table, filter)-abonnementshook
│   ├── useFeed.ts                          # useInfiniteQuery over feedtabel met cursorpaginering
│   ├── useEntitlements.ts                  # RevenueCat CustomerInfo-hook — is gebruiker Pro/Premium?
│   ├── useDeepLink.ts                      # Luistert naar Linking-events, verzending naar Expo Router
│   └── usePushToken.ts                     # Haalt Expo-pushtoken op en registreert bij mount
├── stores/
│   ├── auth.store.ts                       # Zustand: sessie, profiel, setSession, clearSession
│   ├── ui.store.ts                         # Zustand: thema ('licht'|'donker'), toastQueue, modalState
│   └── feed.store.ts                       # Zustand: optimistische feedmutaties (likes, saves)
├── types/
│   ├── supabase.ts                         # Gegenereerde types via `supabase gen types typescript` — NIET BEWERKEN
│   ├── api.ts                              # Gedeelde API-responsvormen, paginatiecursoren
│   └── env.d.ts                            # Typedeclaraties voor process.env / Constants.expoConfig.extra
├── assets/
│   ├── images/
│   │   ├── icon.png                        # App-pictogram 1024x1024 — gebruikt door EAS Build
│   │   ├── splash.png                      # Startscherm 1284x2778
│   │   └── adaptive-icon.png               # Android adaptief pictogramvoorgrond 1024x1024
│   └── fonts/
│       └── Inter-Variable.ttf              # Primaire lettertype geladen via useFonts()
├── maestro/
│   ├── flows/
│   │   ├── auth-login.yaml                 # E2E: app starten, e-mail/wachtwoord invullen, assert huistabblad zichtbaar
│   │   ├── auth-register.yaml              # E2E: nieuwe account registreren, verifieer e-mailprompt weergegeven
│   │   ├── feed-scroll.yaml                # E2E: feed scrollen, bevestig items renderen, tik detailscherm
│   │   └── paywall-purchase.yaml           # E2E: trigger paywall, bevestig aanbiedingen zichtbaar (sandbox)
│   └── .maestro/
│       └── config.yaml                     # Maestro Cloud-configuratie: appId, apparaatprofiel
├── .eas/
│   └── build/
│       ├── development.json                # EAS-ontwikkelingsprofiel: simulatorbuild, dev-client
│       ├── preview.json                    # EAS-voorbeeldprofiel: interne distributie, APK + IPA
│       └── production.json                 # EAS-productieprofiel: App Store + Play Store-indiening
├── supabase/
│   ├── migrations/
│   │   ├── 20240601_initial_schema.sql     # Gebruikers-, profiel-, berichttabellen met RLS-beleid
│   │   └── 20240615_add_subscriptions.sql  # Abonnementstabel voor RevenueCat-webhooksynchronisatie
│   ├── functions/
│   │   ├── push-notification/
│   │   │   └── index.ts                    # Edge Function: ontvangt trigger, verzendt Expo-push via FCM
│   │   └── revenuecat-webhook/
│   │       └── index.ts                    # Edge Function: handelt INITIAL_PURCHASE-, RENEWAL-events af
│   └── seed.sql                            # Devseed: testgebruikers, voorbeeldberichten, dummy-abonnementen
├── .github/
│   └── workflows/
│       ├── eas-build-preview.yml           # Op PR: TypeScript-controle uitvoeren + Maestro + trigger EAS preview build
│       └── eas-update-production.yml       # Bij merge naar main: EAS Update naar productiekanaal publiceren
├── app.json                                # Expo-configuratie: naam, slug, versie, schema, plugins, extra
├── eas.json                                # EAS Build- en Update-profielen: development, preview, production
├── tsconfig.json                           # strict: true, paths: { "@/*": ["./*"] }
├── babel.config.js                         # babel-preset-expo, module-resolver voor @-alias
├── metro.config.js                         # Metro bundler-configuratie: SVG-transformator, activaextensies
├── expo-env.d.ts                           # Expo Router-typedeclaraties (automatisch gegenereerd)
├── .env.local                              # Lokale geheimen: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
├── .env.example                            # Alle vereiste omgevingsvariabelen met beschrijvingen — geen werkelijke waarden
└── package.json                            # Afhankelijkheden, scripts: start, build, typecheck, lint, maestro
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `app/_layout.tsx` | Rootlayout dat de Supabase-autorisatielistener (`onAuthStateChange`) initialiseert, de boom in `QueryClientProvider` wikkelt en niet-geverifieerde gebruikers omleidt naar de `(auth)`-groep voordat tabbladen rendert |
| `lib/supabase.ts` | `createClient()` geconfigureerd met `ExpoSecureStoreAdapter` voor sessiepersistentie en `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — alle andere bestanden importeren van hier, roep `createClient` nooit opnieuw aan |
| `types/supabase.ts` | Automatisch gegenereerde databasetypes uit `supabase gen types typescript --local` — biedt getypeerde `.from()`, `.select()` en `.insert()`-aanroepen in de hele codebase; regenereer na elke migratie |
| `hooks/useRealtime.ts` | Generieke hook die zich abonneert op een Supabase Realtime-kanaal bij mount en zich afmeldt bij unmount; accepteert tabelnaam, filtertekenreeks en callback — hergebruikt in feedupdates, chat en meldingsstip |
| `stores/auth.store.ts` | Zustand-opslag met huidige sessie en profiel; persistent met `zustand/middleware/persist` + AsyncStorage; de enkele waarheidsbron voor autorisatiestatus in alle schermen en hooks |
| `eas.json` | Definieert `development` (simulator, dev-client), `preview` (interne distributie) en `production` (winkelbijdrage) buildprofielen; definieert ook `production`- en `staging`-updatekanalen voor EAS Update |
| `maestro/flows/auth-login.yaml` | Volledige E2E-aanmeldingsstroom gebruikt in CI; tikt e-mailinvoer, typt referentie, verzendt, bevestigt huistabbladetiket zichtbaar — voer lokaal uit met `maestro test maestro/flows/auth-login.yaml` |
| `supabase/functions/revenuecat-webhook/index.ts` | Deno Edge Function die RevenueCat-webhookgebeurtenissen ontvangt, de `X-RevenueCat-Auth`-header valideert en abonnementsstatus in de `subscriptions`-tabel upserteert |

## Snelle steiger

```bash
# Vereisten: Node 20+, Expo CLI, EAS CLI, Supabase CLI
npm install -g eas-cli
npm install -g supabase

# Maak Expo-project met TypeScript-sjabloon
npx create-expo-app@latest my-app --template blank-typescript
cd my-app

# Installeer kernafhankelijkheden
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx expo install @tanstack/react-query zustand
npx expo install react-native-purchases          # RevenueCat
npx expo install expo-notifications expo-auth-session expo-web-browser
npx expo install expo-secure-store
npx expo install @shopify/flash-list             # Krachtige lijst

# Dev-afhankelijkheden
npm install --save-dev @types/react @types/react-native typescript
npm install --save-dev eslint eslint-config-expo prettier

# Maak mapstructuur
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

# Raak sleutelbestanden aan
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

# Genereer types nadat schema is ingesteld
# supabase gen types typescript --local > types/supabase.ts

# EAS init
eas init
eas build:configure

# Schrijf EAS-updatekanalen
eas channel:create production
eas channel:create staging

# Maestro-configuratie
cat > maestro/.maestro/config.yaml << 'EOF'
appId: com.yourcompany.myapp
---
EOF

# Installeer Claudient-vaardigheden
npx claudient add skill mobile/expo-router-screen
npx claudient add skill mobile/supabase-realtime
npx claudient add skill mobile/eas-build
npx claudient add skill mobile/revenuecat-paywall
npx claudient add skill mobile/deep-link-handler
npx claudient add skill productivity/code-review
npx claudient add skill git/pr-description

echo "Mobiele app steiger voltooid. Volgende: voeg EXPO_PUBLIC_SUPABASE_URL en EXPO_PUBLIC_SUPABASE_ANON_KEY toe aan .env.local"
```

## CLAUDE.md-sjabloon

```markdown
# Mobiele app — Claude Code-instructies

Dit is een cross-platform mobiele app gebouwd met Expo SDK 51 en React Native. Navigatie is
op bestanden gebaseerd via Expo Router 3. De backend is Supabase (auth, database, realtime, storage).
Staat is verdeeld tussen Zustand (lokaal/UI) en TanStack Query v5 (serverstaat). In-app
aankopen gebruiken RevenueCat. Builds verzenden via EAS Build; OTA-patches via EAS Update.

## Stack

- Expo SDK 51, React Native 0.74, TypeScript 5.4 (strict)
- Expo Router 3: app/-map = routes; (auth), (tabs), (modals) zijn routegroepen
- Supabase: client in lib/supabase.ts — NOOIT createClient() elders aanroepen
- Zustand: winkels in stores/; altijd het selectorpatroon gebruiken (useAuthStore(s => s.session))
- TanStack Query v5: QueryClient-singleton in lib/query-client.ts; hooks in hooks/
- RevenueCat: geïnitialiseerd in lib/revenuecat.ts; entitlementcontroles via hooks/useEntitlements.ts
- EAS Build-profielen: development (dev-client), preview (intern), production (winkels)
- EAS Update-kanalen: production, staging
- Maestro E2E-stromen in maestro/flows/; voer uit met: maestro test maestro/flows/<naam>.yaml

## Veelvoorkomende taken — gebruik deze exacte commando's

### Voeg een nieuw scherm toe
Maak het bestand onder app/ volgend de routegroepstructuur. Exporteer een standaard React-component.
Voeg een <Link href="/path"> of router.push('/path') toe om ernaar te navigeren.
Als verificatie vereist is, wikkel de rootexport in <SessionGuard />.

### Voeg een nieuwe Supabase-tabel toe
1. Schrijf een migratie: supabase migration new <naam>
2. Voeg tabel DDL en RLS-beleid toe in supabase/migrations/<timestamp>_<naam>.sql
3. Pas lokaal toe: supabase db push
4. Genereer types opnieuw: supabase gen types typescript --local > types/supabase.ts
5. Commit de migratie en bijgewerkte types samen.

### Abonneer u op Supabase realtime in een component
Gebruik de generieke hook:
  const { data } = useRealtime<MyType>('table_name', `column=eq.${id}`)
De hook in hooks/useRealtime.ts handelt abonnements-/afmeldingslevenscyclus automatisch af.

### Trigger een EAS-build
Development (simulator): eas build --profile development --platform ios
Preview (interne QR): eas build --profile preview --platform all
Production (winkels):    eas build --profile production --platform all

### Publiceer een OTA-update
Stagingkanaal:    eas update --channel staging --message "fix: ..."
Productiekanaal: eas update --channel production --message "fix: ..."
Duw nooit een productie-OTA zonder eerst staging te testen.

### Voer E2E-tests uit
Enkele stroom:  maestro test maestro/flows/auth-login.yaml
Alle stromen:    maestro test maestro/flows/

### Controleer TypeScript
npx tsc --noEmit

### Lint
npx eslint . --ext .ts,.tsx

## Conventies

- Padalias: gebruik @/ voor imports vanaf projectroot (bijv. @/lib/supabase, @/components/ui/Button)
- Omgevingsvariabelen: voorvoegsel met EXPO_PUBLIC_ voor clienttoegang; servereigen vars (servicerollen-sleutel) gaan in EAS-geheimen, nooit in app.json extra
- Supabase-types: types/supabase.ts is automatisch gegenereerd — bewerk het nooit handmatig; regenereer na elke migratie
- Componentnamen: PascalCase-bestanden; standaardexport komt overeen met bestandsnaam (Button.tsx → export default function Button)
- Zustand-winkels: één bestand per domein in stores/; exporteer altijd getypeerde selectorhooks, niet de onbewerkte opslag
- React Query-sleutels: definieer als const-arrays in het hookbestand — [resource, id]-patroon; ongeldig maken op voorvoegsel na mutaties
- Diepe koppelingen: schema is gedefinieerd in app.json onder "scheme"; alle diepe koppeling parsing gaat door lib/deep-links.ts

## Zustand-patroon — gebruik dit exact

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

## Handling van diepe koppelingen

Alle routes zijn beschikbaar als diepe koppelingen via het app-schema (zie app.json `scheme`).
Linkingconfiguratie leeft in lib/deep-links.ts. Een nieuw diepkoppelingpad verwerken:
1. Voeg het pad toe aan de Expo Router-bestandsstructuur (dit wordt automatisch een route)
2. Als het pad param-parsing vereist buiten Expo Router's standaard, voeg een case toe in lib/deep-links.ts
3. Test met: npx uri-scheme open "myapp://path/to/screen" --ios

## Wat niet te doen

- Importeer supabase createClient niet uit @supabase/supabase-js rechtstreeks in componenten — altijd lib/supabase.ts gebruiken
- Sla geheimen niet op in app.json extra of .env.local die gecommit is — gebruik EAS-geheimen voor servicesleutels
- Bewerk types/supabase.ts niet handmatig — genereer opnieuw met supabase gen types
- Gebruik React Navigation niet rechtstreeks — alle navigatie gaat door Expo Router (router.push, <Link>)
- Publiceer geen productie EAS Update zonder eerst een staging-test
- Sla RLS-beleid op nieuwe Supabase-tabellen niet over — elke tabel moet Row Level Security ingeschakeld hebben
```

## MCP-servers

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

## Aanbevolen hooks

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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"supabase/migrations/\"; then echo \"[HOOK] Migratie geschreven — voer uit: supabase db push && supabase gen types typescript --local > types/supabase.ts\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"eas update.*(--channel production|production)\"; then echo \"[HOOK] Productie EAS Update gedetecteerd — bevestig dat staging eerst is getest (eas update --channel staging).\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

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

## Verwant

- [Mobile Development Guide](../guides/mobile-expo-react-native.md)
- [EAS Build and Update Workflow](../workflows/eas-build-update.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

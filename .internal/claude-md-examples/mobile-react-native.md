# CLAUDE.md — React Native Expo App (Annotated Example)
> Cross-platform iOS/Android app on Expo SDK 51 — shows how to constrain Claude to the Expo managed workflow and prevent it from suggesting bare/native-only solutions.

<!-- ANNOTATION: "Managed workflow" is the critical constraint. Without it, Claude may suggest `npx expo prebuild` or native module changes that break the managed workflow and require ejecting. Stating it first sets the entire context. -->
This is an Expo managed workflow app. Do not suggest changes that require ejecting to the bare workflow or adding native code. Expo SDK 51. React Native 0.74. TypeScript strict mode.

## Targets

- iOS 16+ and Android 11+ (API 30+)
- EAS Build for production builds — do not use `expo build` (deprecated)
- EAS Update for OTA updates
- Expo Go for development (managed workflow only)

## Project Structure

```
app/                    # Expo Router file-based navigation
  (auth)/               # Auth group — unauthenticated screens
  (app)/                # Main app group — authenticated screens
    (tabs)/             # Tab navigator screens
  _layout.tsx           # Root layout
components/
  ui/                   # Base UI components
  [feature]/            # Feature-specific components
hooks/                  # Custom hooks
lib/
  api/                  # API client (React Query + fetch)
  store/                # Zustand global state
  utils/
assets/
  fonts/
  images/
```

## Navigation

<!-- ANNOTATION: Expo Router v3 uses file-based routing — this is different from React Navigation manual configuration. Claude may default to the manual `createNativeStackNavigator` approach which conflicts with Expo Router. -->
- Navigation uses Expo Router v3 (file-based, similar to Next.js App Router)
- Do not use `react-navigation` APIs directly — use Expo Router's `useRouter`, `Link`, and `useLocalSearchParams`
- Route groups with `(name)/` affect layout, not URL
- Stack modals go in a `(modal)` group at the root layout level
- Use `expo-router/link` for navigation links, not `TouchableOpacity` + `router.push`

## State Management

<!-- ANNOTATION: Three-tier state management (local/query/global) prevents Claude from putting everything in Zustand or everything in component state. The boundaries are explicit. -->
- Local UI state: `useState` / `useReducer` — within the component
- Server state: React Query (`@tanstack/react-query`) — all API data
- Global app state: Zustand — auth session, user preferences, non-server state only
- Do not use Redux — it is not in this project

## Styling

<!-- ANNOTATION: StyleSheet.create is idiomatic React Native and enables performance optimizations. NativeWind (Tailwind for RN) is the utility approach. Both coexist — Claude needs to know which to prefer. -->
- Use NativeWind v4 for utility-class styling (Tailwind in React Native)
- Use `StyleSheet.create()` for complex or dynamic styles
- Do not use inline style objects for static styles — they are re-created on every render
- Platform-specific styles use `Platform.select()` or `.ios.tsx` / `.android.tsx` file extensions

## Expo Modules — Allowed List

<!-- ANNOTATION: The managed workflow only supports Expo modules and a curated set of community packages. This list prevents Claude from suggesting bare-only packages that would require ejecting. -->
Use only Expo SDK modules and packages compatible with managed workflow:
- Camera: `expo-camera`
- Notifications: `expo-notifications`
- Storage: `expo-secure-store` (sensitive), `@react-native-async-storage/async-storage` (non-sensitive)
- File system: `expo-file-system`
- Location: `expo-location`
- Haptics: `expo-haptics`
- In-app purchases: `expo-in-app-purchases`

If a needed feature requires a native module not in the Expo ecosystem, note it and ask the user — it may require bare workflow migration.

## API Client

- Base URL is configured in `lib/api/client.ts` via `API_URL` env variable
- All API calls go through the typed client — no raw `fetch` in components
- React Query handles caching, loading, and error states
- Auth tokens are stored in `expo-secure-store` and injected by the API client interceptor

## Environment Variables

<!-- ANNOTATION: Expo env vars have a specific public/private split using the EXPO_PUBLIC_ prefix. Without this, Claude may expose server secrets to the client bundle. -->
- `EXPO_PUBLIC_*` vars are bundled into the client — safe for public values only
- Server secrets go in EAS Secrets (never in `.env` files or app config)
- Access public vars via `process.env.EXPO_PUBLIC_API_URL` — not via a config file

## Building and Deploying

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas update --branch production --message "Fix login bug"
```

## What Not To Do

<!-- ANNOTATION: "Do not eject" is the top rule for managed workflow. All other rules flow from it. Claude should treat ejecting as a last resort requiring user confirmation, not a suggested solution. -->
- Do not suggest ejecting or running `expo prebuild` — this is a managed workflow project
- Do not add native modules that require `pod install` or `gradle` changes
- Do not use `react-navigation` APIs directly — use Expo Router
- Do not store sensitive data in `AsyncStorage` — use `expo-secure-store`
- Do not hardcode API URLs — use `EXPO_PUBLIC_API_URL`
- Do not use `expo build` — use `eas build`

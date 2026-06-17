---
name: react-native-expo
description: Build React Native apps with Expo — navigation, native modules, OTA updates, and EAS build/deploy
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building React Native apps with Expo or bare React Native
- Setting up Expo Router for file-based navigation
- Configuring EAS Build and EAS Submit for CI/CD
- Implementing native modules or config plugins
- Handling OTA updates with EAS Update or CodePush

## When NOT to use

- For Flutter development (use flutter-widgets)
- For native iOS/Android only apps
- For web-only React apps

## Instructions

1. **Initialize with Expo.** `npx create-expo-app` with TypeScript template. Use Expo Router for file-based navigation.
2. **Configure navigation.** Expo Router: file-based routes in `app/` directory. Tab layouts, stack screens, modal routes.
3. **State management.** Zustand for global state, React Query/TanStack Query for server state. Avoid Redux unless team already uses it.
4. **Native modules.** Use Expo config plugins for native dependencies. Prebuild when custom native code needed: `npx expo prebuild`.
5. **Performance.** FlashList over FlatList, Hermes engine enabled, image optimization with expo-image, lazy load screens.
6. **OTA updates.** Configure EAS Update channels (production, staging, preview). Test updates before pushing to production.
7. **Build and deploy.** EAS Build for cloud builds. EAS Submit for store uploads. Configure build profiles in `eas.json`.

## Example

```json
// eas.json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "channel": "preview" },
    "production": { "channel": "production", "autoIncrement": true }
  }
}
```

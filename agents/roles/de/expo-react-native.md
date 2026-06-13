---
name: expo-react-native
description: "Expo und React Native Entwicklungs-Agent — verwalteter/bare Workflow, EAS Build, native Module, React Navigation und OTA-Updates"
---

# Expo React Native

## Zweck
Erstellt und versendet React Native Apps mit Expo: Entscheidungen zwischen verwaltetem und bare Workflow, EAS Build und EAS Update Konfiguration, React Navigation stack/tab/drawer Muster, Expo SDK Modul-Integration und natives Module Bridging wenn SDK unzureichend ist.

## Modellempfehlung
Sonnet — Expo und React Native Entwicklung beinhaltet gut dokumentierte Muster und SDK-APIs. Sonnet handelt diese Idiome genau ab ohne Opus zu benötigen.

## Werkzeuge
Read, Write, Bash, Grep, Glob

## Wann delegieren
- Neue Expo oder React Native Apps bootstrappen
- Zwischen verwaltetem und bare Workflow basierend auf Anforderungen wählen
- EAS Build mit `eas.json` Profilen für dev/preview/production konfigurieren
- EAS Update für OTA-Deployments konfigurieren
- Expo SDK Module integrieren (Camera, Notifications, Location, SecureStore, FileSystem)
- React Navigation 6 mit stack, tab und drawer Navigatoren einrichten
- Native Module bridgen wenn Expo SDK fehlt
- Reanimated 2 Animationen bei 60fps auf dem nativen Thread implementieren
- Deep Links und Universal Links handhaben
- Push Notifications mit Expo Push + APNs + FCM einrichten

## Anweisungen

### Verwalteter vs Bare Workflow

Verwalteten Workflow wählen wenn alle erforderlichen APIs im Expo SDK sind und Sie null native Werkzeuge möchten. Bare wählen wenn Sie ein natives Modul nicht vom SDK abgedeckt benötigen, benutzerdefinierte native Build-Konfigurationen oder eine brownfield Migration.

```bash
# Verwalteter Workflow
npx create-expo-app MyApp --template blank-typescript

# Bare Workflow (mit nativen Verzeichnissen)
npx create-expo-app MyApp --template bare-minimum

# Vom verwalteten zum bare Workflow auswerfen (einbahnig, nicht reversibel)
npx expo prebuild
# Generiert ios/ und android/ Verzeichnisse aus app.json Konfiguration
# Ausführen beim Hinzufügen eines nativen Moduls das Linking benötigt
```

**app.json — die einzige Quelle für verwaltete Konfiguration :**
```json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "version": "1.0.0",
    "scheme": "myapp",
    "ios": {
      "bundleIdentifier": "com.example.myapp",
      "infoPlist": {
        "NSCameraUsageDescription": "Wird für Profilfotos verwendet"
      }
    },
    "android": {
      "package": "com.example.myapp",
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE"]
    },
    "plugins": [
      "expo-camera",
      ["expo-notifications", { "color": "#ffffff" }]
    ]
  }
}
```

### EAS Build Konfiguration

```json
// eas.json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "env": { "APP_ENV": "development" }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "env": { "APP_ENV": "staging" }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "env": { "APP_ENV": "production" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

```bash
# Build Befehle
eas build --platform ios --profile development    # dev client für Simulator
eas build --platform all --profile preview        # interne Verteilung
eas build --platform all --profile production     # Store Submission

# Nach Production Build einreichen
eas submit --platform ios --latest
eas submit --platform android --latest
```

---

---
name: expo-react-native
description: "Expo and React Native development agent — managed/bare workflow, EAS Build, native modules, React Navigation, and OTA updates"
updated: 2026-06-13
---

# Expo React Native

## Purpose
Builds and ships React Native apps with Expo: managed vs bare workflow decisions, EAS Build and EAS Update configuration, React Navigation stack/tab/drawer patterns, Expo SDK module integration, and native module bridging when the SDK falls short.

## Model guidance
Sonnet — Expo and React Native development involves well-documented patterns and SDK APIs. Sonnet handles these idioms accurately without needing Opus.

## Tools
Read, Write, Bash, Grep, Glob

## When to delegate here
- Bootstrapping new Expo or React Native apps
- Choosing between managed and bare workflow for a given set of requirements
- Setting up EAS Build with `eas.json` profiles for dev/preview/production
- Configuring EAS Update for OTA deployments
- Integrating Expo SDK modules (Camera, Notifications, Location, SecureStore, FileSystem)
- Setting up React Navigation 6 with stack, tab, and drawer navigators
- Bridging native modules when the Expo SDK does not cover a required API
- Implementing Reanimated 2 animations at 60fps on the native thread
- Handling deep links and universal links
- Setting up push notifications with Expo Push + APNs + FCM

## Instructions

### Managed vs Bare Workflow

Choose managed when all required APIs are in the Expo SDK and you want zero native tooling. Choose bare when you need a native module not covered by the SDK, require custom native build configurations, or are migrating a brownfield app.

```bash
# Managed workflow
npx create-expo-app MyApp --template blank-typescript

# Bare workflow (includes native directories)
npx create-expo-app MyApp --template bare-minimum

# Eject from managed to bare (one-way, irreversible)
npx expo prebuild
# Generates ios/ and android/ directories from app.json config
# Run this when you add a native module that requires linking
```

**app.json — the single source of truth for managed config:**
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
        "NSCameraUsageDescription": "Used for profile photos"
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

### EAS Build Configuration

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
# Build commands
eas build --platform ios --profile development    # dev client for simulator
eas build --platform all --profile preview        # internal distribution
eas build --platform all --profile production     # store submission

# Submit after production build
eas submit --platform ios --latest
eas submit --platform android --latest
```

### EAS Update — OTA Deployments

EAS Update delivers JS bundle updates without a full store release. Only JS changes are OTA-eligible — native code changes require a new build.

```bash
# Install
npx expo install expo-updates

# Publish update to preview channel
eas update --channel preview --message "Fix login bug"

# Publish to production
eas update --channel production --message "v1.2.3 — performance improvements"
```

```typescript
// Manually check for updates at runtime
import * as Updates from 'expo-updates';

export async function checkForUpdate(): Promise<void> {
  if (__DEV__) return; // updates don't apply in dev
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // restart app with new bundle
    }
  } catch (e) {
    console.error('Update check failed:', e);
  }
}
```

### Expo SDK Modules

```typescript
// expo-camera
import { CameraView, useCameraPermissions } from 'expo-camera';

export function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <Button title="Grant camera access" onPress={requestPermission} />
    );
  }

  return (
    <CameraView style={StyleSheet.absoluteFill} facing="back" />
  );
}

// expo-notifications — push notification setup
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotifications(): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });
  return token.data;
}

// expo-secure-store — encrypted key-value storage
import * as SecureStore from 'expo-secure-store';

export const tokenStorage = {
  set: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  get: (key: string) =>
    SecureStore.getItemAsync(key),
  delete: (key: string) =>
    SecureStore.deleteItemAsync(key),
};
```

### React Navigation 6

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userId: 'me' }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Typed navigation in a screen
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

export function ProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  // navigation.navigate is fully typed
  return <Text>User: {userId}</Text>;
}
```

### Deep Links

```typescript
// app.json — scheme and intentFilters
// "scheme": "myapp"  → myapp://home, myapp://products/123

// Universal links (iOS) / App Links (Android) require AASA / assetlinks.json on the server

// Handling deep links in navigation
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://example.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Profile: 'profile/:userId',
        },
      },
      Auth: 'auth',
    },
  },
};

<NavigationContainer linking={linking}>
```

### Reanimated 2 — 60fps Animations

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// Shared values live on the UI thread — mutations never drop to JS thread
function ExpandableCard() {
  const height = useSharedValue(80);
  const isExpanded = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(height.value, [80, 200], [0.7, 1], Extrapolation.CLAMP),
  }));

  const toggle = () => {
    isExpanded.value = !isExpanded.value;
    height.value = withSpring(isExpanded.value ? 200 : 80, {
      damping: 15,
      stiffness: 120,
    });
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable onPress={toggle}>
        <Text>Tap to expand</Text>
      </Pressable>
    </Animated.View>
  );
}
```

### Native Module Bridging (Bare Workflow)

When the Expo SDK lacks a required API, create a local native module:

```typescript
// modules/biometrics/index.ts
import { NativeModules, Platform } from 'react-native';

interface BiometricsModule {
  authenticate(reason: string): Promise<boolean>;
  isAvailable(): Promise<boolean>;
}

const { Biometrics } = NativeModules as { Biometrics: BiometricsModule };

export const biometrics = {
  authenticate: (reason: string) => Biometrics.authenticate(reason),
  isAvailable: () => Biometrics.isAvailable(),
};
```

```swift
// ios/Biometrics.swift — RCTBridgeModule
@objc(Biometrics)
class Biometrics: NSObject {
  @objc func authenticate(_ reason: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
      DispatchQueue.main.async {
        if success { resolve(true) }
        else { reject("AUTH_FAILED", error?.localizedDescription, error) }
      }
    }
  }
}
```

## Example use case

**Input:** Set up an Expo app with EAS Build, React Navigation tab + stack structure, push notifications, and an OTA update workflow.

**What this agent produces:**

Project setup: `expo create-expo-app` with TypeScript template. `eas.json` with development (simulator), preview (internal distribution), and production (auto-increment) profiles.

Navigation structure: `RootNavigator` with `NativeStackNavigator` as the root — unauthenticated users land on `AuthStack`, authenticated users land on `MainTabs`. `MainTabs` uses `BottomTabNavigator` with `Home`, `Notifications`, and `Profile` tabs. All param lists fully typed.

Push notifications: `registerForPushNotifications()` called after authentication, Expo Push Token stored in `SecureStore`, `setNotificationHandler` configured for foreground display. Background notification handling via `Notifications.addNotificationReceivedListener`.

OTA updates: `expo-updates` installed, `checkForUpdate()` called on `AppState` change to `active`. `eas.json` maps `preview` and `production` build profiles to matching update channels. Rollback by publishing a previous bundle via `eas update --channel production --republish`.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

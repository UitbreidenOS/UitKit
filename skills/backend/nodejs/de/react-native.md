# React Native and Expo

## Wann aktivieren
- Aufbau von React Native Apps mit Expo Managed oder Bare Workflow
- Konfigurieren von EAS Build und EAS Update (OTA)
- Setup von React Navigation mit verschachtelten Navigatoren
- Implementierung von Animationen mit Reanimated 2
- Hinzufügen oder Debuggen von Native Modulen
- Wahl zwischen Managed und Bare Workflow

## Wann NICHT verwenden
- Flutter oder andere Nicht-React Native Mobile Frameworks
- Pure React Web Anwendungen (verwenden Sie die Standard-React-Skill)
- Expo Snack One-Offs, die niemals den Browser Sandbox verlassen

## Anweisungen

### Managed vs Bare Workflow

**Managed Workflow** — Expo verwaltet die Native Layer. Keine `ios/` oder `android/` Verzeichnisse im Repo. Native Funktionalität kommt von Expo SDK Modulen und Config Plugins.

Wählen Sie Managed, wenn:
- Alle erforderlichen Native Module existieren im Expo SDK
- Das Team keine Native iOS/Android Erfahrung hat
- Sie Zero-Setup lokale Entwicklung möchten (`npx expo start`)
- OTA Updates (EAS Update) sind Priorität

**Bare Workflow** — React Native Projekt mit vollständig freiliegendem Native Code. Generiert via `npx expo eject` oder `npx create-expo-app --template bare`.

Wählen Sie Bare, wenn:
- Eine erforderliche Native Library hat kein Expo Config Plugin
- Benutzerdefinierter Native Code muss in Swift/Kotlin geschrieben werden
- Fine-Grained Kontrolle über `Podfile`, Gradle oder `AndroidManifest.xml` wird benötigt

Im Managed Workflow verwenden Sie Config Plugins in `app.json`/`app.config.js`, um Native Code zur Build-Zeit zu modifizieren, ohne zu ejecten:

```js
// app.config.js
export default {
  expo: {
    name: "MyApp",
    plugins: [
      ["expo-camera", { cameraPermission: "Allow MyApp to use the camera." }],
      ["expo-location", { locationWhenInUsePermission: "Used for delivery tracking." }],
      "./plugins/withCustomAndroidManifest.js",   // custom config plugin
    ],
  },
};
```

### React Navigation 6 — Nested Navigators

```jsx
// navigation/RootNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"   component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Tabs"        component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Settings"    component={SettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login"    component={LoginScreen}    options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Typpisieren Sie die Param List für Type-Safe Navigation:

```ts
// navigation/types.ts
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  OrderDetail: { orderId: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};

// In a screen component
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "OrderDetail">>();
navigation.navigate("OrderDetail", { orderId: "42" });
```

### Reanimated 2 — useAnimatedStyle

Alle Animation Worklets laufen auf dem UI-Thread, nicht dem JS-Thread. Greifen Sie niemals direkt auf React State oder Refs in Worklets zu.

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

function SwipeableCard() {
  const translateX = useSharedValue(0);
  const opacity    = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      opacity.value = interpolate(
        Math.abs(e.translationX),
        [0, 150],
        [1, 0.5],
        Extrapolation.CLAMP,
      );
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > 100) {
        translateX.value = withTiming(translateX.value > 0 ? 400 : -400);
        opacity.value = withTiming(0);
      } else {
        translateX.value = withSpring(0);
        opacity.value = withTiming(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* card content */}
      </Animated.View>
    </GestureDetector>
  );
}
```

Verwenden Sie `runOnJS(fn)(args)` innerhalb von Worklets, wenn Sie eine JS-Funktion aufrufen müssen (z.B. React State nach Animation aktualisieren).

### Expo SDK Key Modules

| Module | Purpose |
|---|---|
| `expo-camera` | Camera Access mit `useCameraPermissions` Hook |
| `expo-location` | GPS / Geolocation mit `requestForegroundPermissionsAsync` |
| `expo-notifications` | Push Notifications, Local Notifications, Badges |
| `expo-secure-store` | Keychain/Keystore für Secrets und Tokens |
| `expo-file-system` | Lesen/Schreiben zum Device Filesystem |
| `expo-image-picker` | Gallery und Camera Photo/Video Selection |
| `expo-av` | Audio und Video Playback |
| `expo-sqlite` | SQLite Database |
| `expo-haptics` | Haptic Feedback (iOS Taptic Engine + Android Vibration) |
| `expo-constants` | App Version, Device Info, Expo Config zur Laufzeit |

### EAS Build — eas.json Profile Structure

```json
{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "env": {
        "APP_ENV": "development",
        "API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "env": {
        "APP_ENV": "staging",
        "API_URL": "https://api.staging.example.com"
      }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "autoIncrement": true,
      "env": {
        "APP_ENV": "production",
        "API_URL": "https://api.example.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "team@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services-key.json",
        "track": "internal"
      }
    }
  }
}
```

Build Commands:
```bash
eas build --platform ios --profile development
eas build --platform android --profile preview
eas build --platform all --profile production
eas submit --platform ios --profile production
```

### OTA Update Strategy

EAS Update liefert JavaScript und Asset Änderungen ohne Store Release. Native Code Änderungen erfordern immer einen neuen Build.

```bash
# Publish an update to the preview channel
eas update --channel preview --message "Fix cart total display"

# Publish to production
eas update --channel production --message "v2.1.1 hotfix"
```

In `app.json` konfigurieren Sie die Update Runtime Version Policy:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/<project-id>",
      "fallbackToCacheTimeout": 3000
    }
  }
}
```

`sdkVersion` Policy: Updates sind kompatibel, solange die Expo SDK Version gleich ist. Verwenden Sie `nativeVersion` Policy für engere Kontrolle — kompatibel nur, wenn sowohl SDK als auch Native Code Version übereinstimmen.

Für kritische Updates erzwingen Sie ein sofortiges Reload:

```js
import * as Updates from "expo-updates";

async function checkForUpdate() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
}
```

## Beispiel

Ein Feed-Screen mit Pull-to-Refresh mit Reanimated und EAS Update:

```jsx
// screens/FeedScreen.tsx
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { FlatList, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";

export function FeedScreen() {
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchFeed(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  return (
    <Animated.FlatList
      data={data ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard item={item} />}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
```

Deploy Update nach Bugfix eines Feed:
```bash
eas update --channel production --message "Fix feed infinite scroll crash"
```

---

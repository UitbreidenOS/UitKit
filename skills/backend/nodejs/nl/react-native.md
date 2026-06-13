# React Native and Expo

## Wanneer activeren
- Bouwen van React Native apps met Expo managed of bare workflow
- Configureren van EAS Build en EAS Update (OTA)
- Instellen van React Navigation met nested navigators
- Implementeren van animations met Reanimated 2
- Toevoegen of debuggen van native modules
- Kiezen tussen managed en bare workflow

## Wanneer NIET gebruiken
- Flutter of ander non-React Native mobile frameworks
- Pure React web applicaties (gebruik standaard React skill)
- Expo Snack one-offs die nooit browser sandbox verlaten

## Instructies

### Managed vs Bare Workflow

**Managed workflow** — Expo beheert native layer. Geen `ios/` of `android/` directories in repo. Native functionality komt van Expo SDK modules en config plugins.

Kies managed wanneer:
- Alle vereiste native modules bestaan in Expo SDK
- Team heeft geen native iOS/Android ervaring
- Wil zero-setup local development (`npx expo start`)
- OTA updates (EAS Update) zijn priority

**Bare workflow** — React Native project met volledige native code exposed. Gegenereerd via `npx expo eject` of `npx create-expo-app --template bare`.

Kies bare wanneer:
- Vereiste native library heeft geen Expo config plugin
- Custom native code moet in Swift/Kotlin geschreven
- Fine-grained control over `Podfile`, Gradle, of `AndroidManifest.xml` nodig

In managed workflow, gebruiken config plugins in `app.json`/`app.config.js` om native code bij build time te wijzigen zonder eject:

```js
// app.config.js
export default {
  expo: {
    name: "MyApp",
    plugins: [
      ["expo-camera", { cameraPermission: "Allow MyApp to use the camera." }],
      ["expo-location", { locationWhenInUsePermission: "Used for delivery tracking." }],
      "./plugins/withCustomAndroidManifest.js",
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

Type param list voor type-safe navigation:

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

Alle animation worklets draaien op UI thread, niet JS thread. Roep nooit React state of refs direct aan inside worklets.

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

Gebruik `runOnJS(fn)(args)` inside worklets wanneer je JS functie moet roepen (bijv. React state updaten na animation completes).

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

Build commands:
```bash
eas build --platform ios --profile development
eas build --platform android --profile preview
eas build --platform all --profile production
eas submit --platform ios --profile production
```

### OTA Update Strategy

EAS Update levert JavaScript en asset changes af zonder store release. Native code changes vereisen altijd nieuwe build.

```bash
# Publish an update to the preview channel
eas update --channel preview --message "Fix cart total display"

# Publish to production
eas update --channel production --message "v2.1.1 hotfix"
```

---

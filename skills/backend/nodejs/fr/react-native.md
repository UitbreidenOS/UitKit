# React Native et Expo

## Quand activer
- Construction d'applications React Native avec Expo managed ou bare workflow
- Configuration d'EAS Build et EAS Update (OTA)
- Configuration de React Navigation avec navigateurs imbriqués
- Implémentation d'animations avec Reanimated 2
- Ajout ou débogage de modules natifs
- Choix entre workflow managed et bare

## Quand ne PAS utiliser
- Flutter ou autres frameworks mobiles non-React Native
- Les applications React web pures (utiliser la compétence React standard)
- Les one-offs Expo Snack qui ne quitteront jamais le sandbox du navigateur

## Instructions

### Workflow managed vs bare

**Workflow managed** — Expo gère la couche native. Pas de répertoires `ios/` ou `android/` dans le repo. La fonctionnalité native provient des modules SDK Expo et des plugins de configuration.

Choisir managed quand :
- Tous les modules natifs requis existent dans le SDK Expo
- L'équipe n'a pas d'expérience native iOS/Android
- Vous voulez le développement local sans configuration (`npx expo start`)
- Les mises à jour OTA (EAS Update) sont une priorité

**Workflow bare** — Projet React Native avec code natif complet exposé. Généré via `npx expo eject` ou `npx create-expo-app --template bare`.

Choisir bare quand :
- Une bibliothèque native requise n'a pas de plugin de configuration Expo
- Le code natif personnalisé doit être écrit en Swift/Kotlin
- Un contrôle fin-grained sur `Podfile`, Gradle, ou `AndroidManifest.xml` est nécessaire

Dans le workflow managed, utiliser les plugins de configuration dans `app.json`/`app.config.js` pour modifier le code natif au moment de la construction sans éjecter :

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

### React Navigation 6 — Navigateurs imbriqués

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

Taper la liste de paramètres pour la navigation type-safe :

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

Tous les worklets d'animation s'exécutent sur le thread d'interface utilisateur, pas le thread JS. Ne jamais accéder directement à l'état React ou refs à l'intérieur des worklets.

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

Utiliser `runOnJS(fn)(args)` à l'intérieur des worklets quand vous devez appeler une fonction JS (par ex. mettre à jour l'état React après la fin de l'animation).

### Modules clés du SDK Expo

| Module | Propos |
|---|---|
| `expo-camera` | Accès à la caméra avec le hook `useCameraPermissions` |
| `expo-location` | GPS / géolocalisation avec `requestForegroundPermissionsAsync` |
| `expo-notifications` | Push notifications, notifications locales, badges |
| `expo-secure-store` | Keychain/Keystore pour les secrets et tokens |
| `expo-file-system` | Lire/écrire dans le système de fichiers de l'appareil |
| `expo-image-picker` | Sélection de photos/vidéos de galerie et caméra |
| `expo-av` | Lecture audio et vidéo |
| `expo-sqlite` | Base de données SQLite |
| `expo-haptics` | Retour haptique (iOS Taptic Engine + vibration Android) |
| `expo-constants` | Version d'application, info d'appareil, config Expo à l'exécution |

### Structure du profil EAS Build — eas.json

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

Commandes de construction :
```bash
eas build --platform ios --profile development
eas build --platform android --profile preview
eas build --platform all --profile production
eas submit --platform ios --profile production
```

### Stratégie de mise à jour OTA

EAS Update livre les modifications de JavaScript et d'actifs sans publication en magasin. Les modifications de code natif nécessitent toujours une nouvelle construction.

```bash
# Publish an update to the preview channel
eas update --channel preview --message "Fix cart total display"

# Publish to production
eas update --channel production --message "v2.1.1 hotfix"
```

Dans `app.json`, configurer la politique de la version d'exécution de mise à jour :

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

La politique `sdkVersion` : les mises à jour sont compatibles tant que la version du SDK Expo est la même. Utiliser la politique `nativeVersion` pour un contrôle plus strict — compatible seulement quand la version du SDK et du code natif correspondent.

Pour les mises à jour critiques, forcer un rechargement immédiat :

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

## Exemple

Un écran de flux avec pull-to-refresh utilisant Reanimated et EAS Update :

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

Déployer la mise à jour après correction d'un bug de flux :
```bash
eas update --channel production --message "Fix feed infinite scroll crash"
```

---

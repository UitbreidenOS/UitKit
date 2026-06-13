# React Native y Expo

## Cuándo activar
- Construcción de aplicaciones React Native con flujo administrado o desnudo de Expo
- Configuración de EAS Build y EAS Update (OTA)
- Configuración de React Navigation con navegadores anidados
- Implementación de animaciones con Reanimated 2
- Adición o depuración de módulos nativos
- Elección entre flujo administrado y desnudo

## Cuándo NO usar
- Flutter u otros frameworks móviles que no sean React Native
- Aplicaciones React web puras (usar la habilidad React estándar)
- One-offs de Expo Snack que nunca saldrán de la caja de arena del navegador

## Instrucciones

### Flujo Administrado vs Desnudo

**Flujo administrado** — Expo maneja la capa nativa. Sin directorios `ios/` o `android/` en el repositorio. La funcionalidad nativa viene de módulos Expo SDK y plugins de configuración.

Elegir administrado cuando:
- Todos los módulos nativos requeridos existen en Expo SDK
- El equipo no tiene experiencia nativa en iOS/Android
- Quieres desarrollo local sin configuración (`npx expo start`)
- Las actualizaciones OTA (EAS Update) son una prioridad

**Flujo desnudo** — Proyecto React Native con código nativo completo expuesto. Generado vía `npx expo eject` o `npx create-expo-app --template bare`.

Elegir desnudo cuando:
- Una biblioteca nativa requerida no tiene plugin de configuración de Expo
- El código nativo personalizado debe escribirse en Swift/Kotlin
- Se necesita control fino sobre `Podfile`, Gradle, o `AndroidManifest.xml`

En flujo administrado, usar plugins de configuración en `app.json`/`app.config.js` para modificar código nativo en tiempo de construcción sin expulsar:

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

### React Navigation 6 — Navegadores Anidados

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

Escribir la lista de parámetros para navegación type-safe:

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

Todos los worklets de animación se ejecutan en el hilo de UI, no en el hilo JS. Nunca acceder a estado React o refs directamente dentro de worklets.

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

Usar `runOnJS(fn)(args)` dentro de worklets cuando deba llamar a una función JS (ej., actualizar estado React después de que se completa la animación).

### Módulos Clave de Expo SDK

| Module | Purpose |
|---|---|
| `expo-camera` | Camera access with `useCameraPermissions` hook |
| `expo-location` | GPS / geolocation with `requestForegroundPermissionsAsync` |
| `expo-notifications` | Push notifications, local notifications, badges |
| `expo-secure-store` | Keychain/Keystore for secrets and tokens |
| `expo-file-system` | Read/write to device filesystem |
| `expo-image-picker` | Gallery and camera photo/video selection |
| `expo-av` | Audio and video playback |
| `expo-sqlite` | SQLite database |
| `expo-haptics` | Haptic feedback (iOS Taptic Engine + Android vibration) |
| `expo-constants` | App version, device info, Expo config at runtime |

### EAS Build — Estructura de Perfil eas.json

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

Comandos de construcción:
```bash
eas build --platform ios --profile development
eas build --platform android --profile preview
eas build --platform all --profile production
eas submit --platform ios --profile production
```

### Estrategia de Actualización OTA

EAS Update entrega cambios de JavaScript y activos sin una versión de tienda. Los cambios de código nativo siempre requieren una nueva construcción.

```bash
# Publish an update to the preview channel
eas update --channel preview --message "Fix cart total display"

# Publish to production
eas update --channel production --message "v2.1.1 hotfix"
```

En `app.json`, configurar la política de versión de tiempo de ejecución de actualización:

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

Política `sdkVersion`: las actualizaciones son compatibles mientras la versión de Expo SDK sea la misma. Usar política `nativeVersion` para control más strict — solo compatible cuando versión SDK y código nativo coinciden.

Para actualizaciones críticas, forzar recarga inmediata:

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

## Ejemplo

Una pantalla de feed con pull-to-refresh usando Reanimated y EAS Update:

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

Desplegar actualización después de reparar un error de feed:
```bash
eas update --channel production --message "Fix feed infinite scroll crash"
```

---

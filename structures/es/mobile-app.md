# Aplicación Móvil (Expo + React Native) — Estructura del Proyecto

> Para un desarrollador de React Native que construye y envía una aplicación móvil multiplataforma con Expo — optimizando el ciclo desde una nueva pantalla hasta una actualización OTA con integración completa del backend de Supabase.

## Stack

- **Framework:** Expo SDK 51 (React Native 0.74) con Expo Go para desarrollo
- **Lenguaje:** TypeScript 5.4, modo strict, alias de rutas mediante tsconfig.json
- **Navegación:** Expo Router 3 (basado en archivos, layouts Stack + Tabs + Modal)
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **Gestión de estado:** Zustand 4 (estado local/global de UI, persistido mediante AsyncStorage)
- **Estado del servidor:** TanStack Query v5 (React Query — obtención de datos, caché, mutaciones)
- **Compras in-app:** SDK de RevenueCat (`react-native-purchases`) con integración de webhooks
- **CI/CD:** EAS Build (flujo gestionado, perfiles iOS + Android: development, preview, production)
- **Actualizaciones OTA:** EAS Update (expo-updates, lanzamiento basado en canales)
- **Pruebas E2E:** Maestro (archivos de flujo YAML, ejecutables localmente y en CI)
- **Linting:** ESLint con `eslint-config-expo`, Prettier
- **Notificaciones:** Expo Notifications con registro de push token mediante Supabase Edge Function

## Árbol de directorios

```
my-app/
├── app/                                    # Páginas de Expo Router (archivo = ruta)
│   ├── _layout.tsx                         # Layout raíz: puerta de autenticación Supabase, ThemeProvider, QueryClientProvider
│   ├── index.tsx                           # Redirección de entrada: autenticado → (tabs), invitado → (auth)
│   ├── (auth)/
│   │   ├── _layout.tsx                     # Layout de pila de autenticación (Stack, sin encabezado)
│   │   ├── login.tsx                       # Pantalla de inicio de sesión con correo/contraseña + OAuth (Google, Apple)
│   │   ├── register.tsx                    # Creación de cuenta con flujo de verificación de correo
│   │   └── forgot-password.tsx             # Restablecimiento de contraseña: pantallas de solicitud + confirmación
│   ├── (tabs)/
│   │   ├── _layout.tsx                     # Navegador de pestañas inferiores: Home, Explore, Profile
│   │   ├── index.tsx                       # Pestaña Home — pantalla de feed principal o dashboard
│   │   ├── explore.tsx                     # Pestaña Explore/búsqueda
│   │   └── profile.tsx                     # Pestaña de perfil de usuario
│   ├── (modals)/
│   │   ├── _layout.tsx                     # Layout de pila modal (presentación: modal)
│   │   ├── settings.tsx                    # Modal de configuración de la aplicación (notificaciones, tema, cuenta)
│   │   └── paywall.tsx                     # Modal de paywall de RevenueCat — ofertas + CTA de compra
│   └── [id]/
│       └── detail.tsx                      # Pantalla de detalle dinámico — recibe parámetro id mediante useLocalSearchParams
├── components/
│   ├── ui/                                 # Componentes de UI primitivos y reutilizables
│   │   ├── Button.tsx                      # Botón con marca: variante (primary/ghost/danger), estado de carga
│   │   ├── Input.tsx                       # Entrada de texto controlada con etiqueta, error y texto de ayuda
│   │   ├── Card.tsx                        # Tarjeta de superficie con sombra y esquinas redondeadas
│   │   ├── Avatar.tsx                      # Avatar de usuario: imagen con URL de Supabase Storage, fallback de iniciales
│   │   ├── Badge.tsx                       # Insignia de estado (success/warning/error/info)
│   │   ├── Sheet.tsx                       # Envoltorio de hoja inferior (react-native-reanimated)
│   │   ├── Skeleton.tsx                    # Marcador de posición de carga que coincide con la forma del componente
│   │   ├── EmptyState.tsx                  # Estado vacío de lista/pantalla con icono, título y botón de acción
│   │   └── index.ts                        # Exportación de barril para todos los componentes de ui/
│   └── feature/                            # Componentes compuestos específicos del dominio
│       ├── auth/
│       │   ├── OAuthButtons.tsx            # Botones de inicio de sesión de Google + Apple con expo-auth-session
│       │   └── SessionGuard.tsx            # Envuelve pantallas que requieren autenticación — redirige a (auth)/login
│       ├── feed/
│       │   ├── FeedList.tsx                # Feed respaldado por FlashList con desplazamiento infinito de React Query
│       │   ├── FeedItem.tsx                # Tarjeta de feed única con acciones optimistas de like/save
│       │   └── FeedItemSkeleton.tsx        # Marcador de posición esqueleto para FeedItem mientras carga
│       ├── profile/
│       │   ├── ProfileHeader.tsx           # Avatar, nombre para mostrar, insignia de suscriptor, botón de edición
│       │   └── ProfileStats.tsx            # Conteos de seguidores/siguiendo/posts con navegación
│       └── paywall/
│           ├── OfferingCard.tsx            # Mosaico de oferta de RevenueCat única (precio, período, CTA)
│           └── PremiumBadge.tsx            # Insignia "Pro" mostrada en contenido/características premium
├── lib/
│   ├── supabase.ts                         # createClient() con persistencia de sesión ExpoSecureStoreAdapter
│   ├── query-client.ts                     # Singleton de QueryClient de TanStack con staleTime/gcTime predeterminado
│   ├── revenuecat.ts                       # Inicialización de Purchases.configure(), ayudantes de derechos
│   ├── notifications.ts                    # registerForPushNotificationsAsync(), upsert de token a Supabase
│   ├── deep-links.ts                       # Configuración de Linking, parseURL(), resolución de rutas para deep links
│   └── utils.ts                            # cn() (fusión de nombres de clase), formatDate(), truncate()
├── hooks/
│   ├── useSession.ts                       # Devuelve la sesión actual de Supabase; null si no autenticado
│   ├── useProfile.ts                       # Hook de React Query: obtener + cachear fila de perfil del usuario actual
│   ├── useRealtime.ts                      # Hook genérico useRealtime<T>(table, filter) de suscripción
│   ├── useFeed.ts                          # useInfiniteQuery sobre tabla feed con paginación de cursor
│   ├── useEntitlements.ts                  # Hook de RevenueCat CustomerInfo — ¿es el usuario Pro/Premium?
│   ├── useDeepLink.ts                      # Escucha eventos de Linking, envía a Expo Router
│   └── usePushToken.ts                     # Recupera y registra token de push de Expo en el montaje
├── stores/
│   ├── auth.store.ts                       # Zustand: sesión, perfil, setSession, clearSession
│   ├── ui.store.ts                         # Zustand: tema ('light'|'dark'), toastQueue, modalState
│   └── feed.store.ts                       # Zustand: mutaciones optimistas de feed (likes, saves)
├── types/
│   ├── supabase.ts                         # Tipos generados mediante `supabase gen types typescript` — NO EDITAR
│   ├── api.ts                              # Formas de respuesta de API compartidas, cursores de paginación
│   └── env.d.ts                            # Declaraciones de tipo para process.env / Constants.expoConfig.extra
├── assets/
│   ├── images/
│   │   ├── icon.png                        # Icono de aplicación 1024x1024 — utilizado por EAS Build
│   │   ├── splash.png                      # Pantalla de inicio 1284x2778
│   │   └── adaptive-icon.png               # Icono adaptable de Android en primer plano 1024x1024
│   └── fonts/
│       └── Inter-Variable.ttf              # Tipografía principal cargada mediante useFonts()
├── maestro/
│   ├── flows/
│   │   ├── auth-login.yaml                 # E2E: lanzar aplicación, completar correo/contraseña, afirmar que la pestaña Home es visible
│   │   ├── auth-register.yaml              # E2E: registrar nueva cuenta, verificar que se muestre el aviso de verificación de correo
│   │   ├── feed-scroll.yaml                # E2E: desplazarse por feed, afirmar que los elementos se renderizan, pulsar pantalla de detalle
│   │   └── paywall-purchase.yaml           # E2E: desencadenar paywall, afirmar que las ofertas sean visibles (sandbox)
│   └── .maestro/
│       └── config.yaml                     # Configuración de Maestro Cloud: appId, perfil de dispositivo
├── .eas/
│   └── build/
│       ├── development.json                # Perfil de desarrollo de EAS: compilación de simulador, cliente de desarrollo
│       ├── preview.json                    # Perfil de vista previa de EAS: distribución interna, APK + IPA
│       └── production.json                 # Perfil de producción de EAS: envío a App Store + Play Store
├── supabase/
│   ├── migrations/
│   │   ├── 20240601_initial_schema.sql     # Tablas de Users, profiles, posts con políticas RLS
│   │   └── 20240615_add_subscriptions.sql  # Tabla de subscriptions para sincronización de webhooks de RevenueCat
│   ├── functions/
│   │   ├── push-notification/
│   │   │   └── index.ts                    # Edge Function: recibe disparador, envía push de Expo mediante FCM
│   │   └── revenuecat-webhook/
│   │       └── index.ts                    # Edge Function: maneja eventos INITIAL_PURCHASE, RENEWAL
│   └── seed.sql                            # Semilla de desarrollo: usuarios de prueba, posts de ejemplo, suscripciones dummy
├── .github/
│   └── workflows/
│       ├── eas-build-preview.yml           # En PR: ejecutar verificación de TypeScript + Maestro + desencadenar compilación de vista previa de EAS
│       └── eas-update-production.yml       # En merge a main: publicar actualización de EAS al canal de producción
├── app.json                                # Configuración de Expo: nombre, slug, versión, esquema, plugins, extra
├── eas.json                                # Perfiles de EAS Build y Update: development, preview, production
├── tsconfig.json                           # strict: true, paths: { "@/*": ["./*"] }
├── babel.config.js                         # babel-preset-expo, module-resolver para alias @
├── metro.config.js                         # Configuración del bundler de Metro: transformador SVG, extensiones de activos
├── expo-env.d.ts                           # Declaraciones de tipo de Expo Router (auto-generadas)
├── .env.local                              # Secretos locales: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
├── .env.example                            # Todas las variables de entorno requeridas con descripciones — sin valores reales
└── package.json                            # Dependencias, scripts: start, build, typecheck, lint, maestro
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `app/_layout.tsx` | Layout raíz que inicializa el escuchador de autenticación de Supabase (`onAuthStateChange`), envuelve el árbol en `QueryClientProvider` y redirige a los usuarios no autenticados al grupo `(auth)` antes de que se renderice cualquier pestaña |
| `lib/supabase.ts` | `createClient()` configurado con `ExpoSecureStoreAdapter` para persistencia de sesión y `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — todos los demás archivos importan desde aquí, nunca llamar a `createClient` de nuevo |
| `types/supabase.ts` | Tipos de base de datos auto-generados mediante `supabase gen types typescript --local` — proporciona llamadas tipadas `.from()`, `.select()` e `.insert()` en todo el código; regenerar después de cada migración |
| `hooks/useRealtime.ts` | Hook genérico que se suscribe a un canal de Supabase Realtime al montarse y se desuscribe al desmontarse; acepta nombre de tabla, cadena de filtro y callback — reutilizado en actualizaciones de feed, chat y punto de notificación |
| `stores/auth.store.ts` | Almacén de Zustand que contiene la sesión actual y el perfil; persistido con `zustand/middleware/persist` + AsyncStorage; la fuente única de verdad para estado de autenticación en todas las pantallas y hooks |
| `eas.json` | Define perfiles de compilación `development` (simulador, cliente de desarrollo), `preview` (distribución interna) y `production` (envío de tienda); también define canales de actualización `production` y `staging` para EAS Update |
| `maestro/flows/auth-login.yaml` | Flujo completo de login E2E utilizado en CI; pulsa entrada de correo, escribe credencial, envía, afirma que la etiqueta de la pestaña home es visible — ejecutar localmente con `maestro test maestro/flows/auth-login.yaml` |
| `supabase/functions/revenuecat-webhook/index.ts` | Edge Function de Deno que recibe eventos de webhook de RevenueCat, valida el encabezado `X-RevenueCat-Auth` e inserta el estado de suscripción en la tabla `subscriptions` |

## Andamiaje rápido

```bash
# Requisitos previos: Node 20+, Expo CLI, EAS CLI, Supabase CLI
npm install -g eas-cli
npm install -g supabase

# Crear proyecto Expo con plantilla TypeScript
npx create-expo-app@latest my-app --template blank-typescript
cd my-app

# Instalar dependencias principales
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx expo install @tanstack/react-query zustand
npx expo install react-native-purchases          # RevenueCat
npx expo install expo-notifications expo-auth-session expo-web-browser
npx expo install expo-secure-store
npx expo install @shopify/flash-list             # Lista de alto rendimiento

# Dependencias de desarrollo
npm install --save-dev @types/react @types/react-native typescript
npm install --save-dev eslint eslint-config-expo prettier

# Crear estructura de directorios
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

# Crear archivos clave
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

# Inicialización de Supabase
supabase init
supabase start

# Generar tipos después de configurar el esquema
# supabase gen types typescript --local > types/supabase.ts

# Inicialización de EAS
eas init
eas build:configure

# Escribir canales de actualización de EAS
eas channel:create production
eas channel:create staging

# Configuración de Maestro
cat > maestro/.maestro/config.yaml << 'EOF'
appId: com.yourcompany.myapp
---
EOF

# Instalar skills de Claudient
npx claudient add skill mobile/expo-router-screen
npx claudient add skill mobile/supabase-realtime
npx claudient add skill mobile/eas-build
npx claudient add skill mobile/revenuecat-paywall
npx claudient add skill mobile/deep-link-handler
npx claudient add skill productivity/code-review
npx claudient add skill git/pr-description

echo "Andamiaje de aplicación móvil completado. Siguiente: agregar EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY a .env.local"
```

## Plantilla CLAUDE.md

```markdown
# Aplicación Móvil — Instrucciones de Claude Code

Esta es una aplicación móvil multiplataforma construida con Expo SDK 51 y React Native. La navegación
es basada en archivos mediante Expo Router 3. El backend es Supabase (auth, base de datos, realtime, almacenamiento).
El estado se divide entre Zustand (local/UI) y TanStack Query v5 (estado del servidor). Las compras in-app
utilizan RevenueCat. Las compilaciones se envían mediante EAS Build; los parches OTA mediante EAS Update.

## Stack

- Expo SDK 51, React Native 0.74, TypeScript 5.4 (strict)
- Expo Router 3: directorio app/ = rutas; (auth), (tabs), (modals) son grupos de rutas
- Supabase: cliente en lib/supabase.ts — NUNCA llamar a createClient() en otro lugar
- Zustand: almacenes en stores/; siempre usar el patrón de selector (useAuthStore(s => s.session))
- TanStack Query v5: singleton de QueryClient en lib/query-client.ts; hooks en hooks/
- RevenueCat: inicializado en lib/revenuecat.ts; verificaciones de derechos mediante hooks/useEntitlements.ts
- Perfiles de EAS Build: development (cliente de desarrollo), preview (distribución interna), production (tiendas)
- Canales de EAS Update: production, staging
- Flujos E2E de Maestro en maestro/flows/; ejecutar con: maestro test maestro/flows/<name>.yaml

## Tareas comunes — usar estos comandos exactos

### Agregar una nueva pantalla
Crear el archivo bajo app/ siguiendo la estructura del grupo de rutas. Exportar un componente predeterminado de React.
Agregar un <Link href="/path"> o router.push('/path') para navegación.
Si requiere autenticación, envolver la exportación raíz con <SessionGuard />.

### Agregar una nueva tabla de Supabase
1. Escribir una migración: supabase migration new <name>
2. Agregar DDL de tabla y políticas RLS en supabase/migrations/<timestamp>_<name>.sql
3. Aplicar localmente: supabase db push
4. Regenerar tipos: supabase gen types typescript --local > types/supabase.ts
5. Confirmar la migración y los tipos actualizados juntos.

### Suscribirse a realtime de Supabase en un componente
Usar el hook genérico:
  const { data } = useRealtime<MyType>('table_name', `column=eq.${id}`)
El hook en hooks/useRealtime.ts maneja automáticamente el ciclo de vida de subscribe/unsubscribe.

### Desencadenar una compilación de EAS
Development (simulador): eas build --profile development --platform ios
Preview (código QR interno): eas build --profile preview --platform all
Production (tiendas):    eas build --profile production --platform all

### Publicar una actualización OTA
Canal Staging:    eas update --channel staging --message "fix: ..."
Canal Production: eas update --channel production --message "fix: ..."
Nunca enviar una OTA de producción sin probar primero en staging.

### Ejecutar pruebas E2E
Flujo único:  maestro test maestro/flows/auth-login.yaml
Todos los flujos:    maestro test maestro/flows/

### Verificar TypeScript
npx tsc --noEmit

### Lint
npx eslint . --ext .ts,.tsx

## Convenciones

- Alias de ruta: usar @/ para importaciones desde la raíz del proyecto (e.g., @/lib/supabase, @/components/ui/Button)
- Variables de entorno: prefijo con EXPO_PUBLIC_ para acceso del lado del cliente; variables de solo servidor (clave de rol de servicio) van en secretos de EAS, nunca en extra de app.json
- Tipos de Supabase: types/supabase.ts es auto-generado — nunca editarlo manualmente; regenerar después de cada migración
- Nombres de componentes: archivos PascalCase; exportación predeterminada coincide con nombre de archivo (Button.tsx → export default function Button)
- Almacenes de Zustand: un archivo por dominio en stores/; siempre exportar hooks de selector tipados, no el almacén sin procesar
- Claves de React Query: definir como matrices const en el archivo de hook — patrón [resource, id]; invalidar por prefijo después de mutaciones
- Deep links: el esquema se define en app.json bajo "scheme"; todo el análisis de deep link va a través de lib/deep-links.ts

## Patrón de Zustand — usar así exactamente

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

## Manejo de deep links

Todas las rutas están disponibles como deep links a través del esquema de la aplicación (ver `scheme` en app.json).
La configuración de Linking se encuentra en lib/deep-links.ts. Para manejar una nueva ruta de deep link:
1. Agregar la ruta a la estructura de archivos de Expo Router (se convierte automáticamente en una ruta)
2. Si la ruta necesita análisis de parámetros más allá del predeterminado de Expo Router, agregar un caso en lib/deep-links.ts
3. Probar con: npx uri-scheme open "myapp://path/to/screen" --ios

## Lo que no hacer

- No importar supabase createClient desde @supabase/supabase-js directamente en componentes — siempre usar lib/supabase.ts
- No almacenar secretos en extra de app.json o .env.local que se confirme — usar secretos de EAS para claves de servicio
- No editar manualmente types/supabase.ts — regenerar con supabase gen types
- No usar React Navigation directamente — toda la navegación va a través de Expo Router (router.push, <Link>)
- No publicar una actualización de EAS de producción sin una prueba de staging primero
- No omitir políticas RLS en nuevas tablas de Supabase — cada tabla debe tener Row Level Security habilitado
```

## Servidores MCP

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

## Hooks recomendados

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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"supabase/migrations/\"; then echo \"[HOOK] Migration written — run: supabase db push && supabase gen types typescript --local > types/supabase.ts\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"eas update.*(--channel production|production)\"; then echo \"[HOOK] Production EAS Update detected — confirm staging was tested first (eas update --channel staging).\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

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

## Relacionado

- [Mobile Development Guide](../guides/mobile-expo-react-native.md)
- [EAS Build and Update Workflow](../workflows/eas-build-update.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

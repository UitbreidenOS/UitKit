# Optimización de Compilación

## Cuándo activar
Compilaciones lentas, tamaños de paquetes grandes, canalizaciones de CI tomando más de 5 minutos, o cuando el usuario menciona problemas de desempeño de Webpack, Vite, Turbo, esbuild o Rollup.

## Cuándo NO usar
- Problemas de desempeño en tiempo de ejecución (CPU, memoria, red) — esta habilidad se enfoca solo en tiempo de compilación/agrupamiento
- Configuración de proyecto de primera vez donde no existe línea de base
- Proyectos usando empaquetadores que no sean los listados arriba (ej. Parcel, Brunch)

## Instrucciones

**Siempre comienza con análisis, nunca con cambios.**

### Análisis de Paquete (ejecutar primero)
- Webpack: `npx webpack-bundle-analyzer stats.json` — generar estadísticas con `webpack --profile --json > stats.json`
- Vite: `npx vite-bundle-visualizer` después de agregar `{ build: { reportCompressedSize: true } }`
- Identificar: chunks más grandes, dependencias duplicadas, módulos inesperadamente incluidos

### Division de Código
- Importaciones dinámicas: `const Foo = () => import('./Foo')` para divisiones a nivel de ruta y característica
- División basada en ruta en React Router / Next.js: `React.lazy` + `Suspense`
- Aislamiento de chunk de proveedor: código de terceros que cambia raramente separado del código de aplicación
- Vite `manualChunks`:
  ```js
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
        },
      },
    },
  }
  ```
- Webpack `SplitChunksPlugin`:
  ```js
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: { test: /node_modules/, name: 'vendors', chunks: 'all' },
      },
    },
  }
  ```

### Tree Shaking
- Requiere sintaxis de módulo ES (`import`/`export`) en todas partes — CommonJS (`require`) desactiva tree shaking
- Agregar `"sideEffects": false` a `package.json` (o listar archivos CSS que tienen efectos secundarios)
- Auditar archivos de barril (`index.ts`) — re-exportar todo derrota tree shaking; usar importaciones directas

### Compilación Incremental de TypeScript
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```
Agregar `.tsbuildinfo` a `.gitignore`, almacenar en caché en CI indexado en hash de fuente.

### Almacenamiento en Caché de Tarea de Turborepo
```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", ".next/**"],
      "inputs": ["src/**", "package.json", "tsconfig.json"]
    }
  }
}
```
Almacenamiento en caché remoto: `npx turbo link` — comparte aciertos de caché entre miembros del equipo e CI.

### Estrategia de Caché de CI (patrón de GitHub Actions)
```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    key: node-${{ hashFiles('**/package-lock.json') }}

- uses: actions/cache@v3
  with:
    path: dist
    key: build-${{ hashFiles('src/**') }}
```
Objetivo: >90% de tasa de acierto de caché. Un fallo en node_modules no debe invalidar el caché de salida de compilación.

### Victorias Rápidas Comunes (sin cambio arquitectónico requerido)
1. Agregar `.dockerignore` espejando `.gitignore` — previene enviar `node_modules` al contexto de compilación
2. Habilitar `vite.optimizeDeps.include` para deps CJS grandes que Vite pre-empaqueta lentamente
3. Reemplazar `ts-node` con `tsx` para scripts — tsx usa esbuild y es ~10× más rápido para ejecución puntual
4. Cambiar `jest` a `vitest` para proyectos TypeScript — elimina gastos generales de transformación de Babel
5. Habilitar `esbuild` como transformador TypeScript en Webpack vía `esbuild-loader`

## Ejemplo

**Síntoma:** Compilación de CI toma 8 minutos, paquete es 4 MB gzipped.

**Pasos tomados:**
1. Ejecutar `npx vite-bundle-visualizer` — revela `moment.js` (300 KB) y todas las locales incluidas
2. Reemplazar `moment` con importaciones `date-fns` tree-shaken — ahorra 280 KB
3. Agregar `manualChunks` para dividir proveedor del código de aplicación — reduce chunk de primera carga de 1.2 MB a 380 KB
4. Agregar Turborepo con `outputs: ["dist/**"]` — segunda ejecución de CI acierta en caché, tiempo de compilación cae a 45 segundos

---

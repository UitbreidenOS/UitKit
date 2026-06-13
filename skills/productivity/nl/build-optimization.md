# Build Optimization

## Wanneer activeren
Trage builds, grote bundel maten, CI-pijplijnen die langer dan 5 minuten duren, of wanneer de gebruiker Webpack, Vite, Turbo, esbuild of Rollup-prestatieproblemen noemt.

## Wanneer NIET gebruiken
- Runtime-prestatieproblemen (CPU, geheugen, netwerk) — deze skill is gericht op compile/bundle-tijd alleen
- Projectconfiguratie voor de eerste keer waar geen basislijn bestaat
- Projecten met andere bundlers dan de hierboven genoemde (bijv. Parcel, Brunch)

## Instructies

**Begin altijd met analyse, nooit met wijzigingen.**

### Bundel-analyse (voer eerst uit)
- Webpack: `npx webpack-bundle-analyzer stats.json` — genereer stats met `webpack --profile --json > stats.json`
- Vite: `npx vite-bundle-visualizer` na toevoegen van `{ build: { reportCompressedSize: true } }`
- Identificeer: grootste chunks, gedupliceerde afhankelijkheden, onverwacht opgenomen modules

### Code Splitting
- Dynamische imports: `const Foo = () => import('./Foo')` voor route-level en feature-level splits
- Route-based splitting in React Router / Next.js: `React.lazy` + `Suspense`
- Vendor chunk isolatie: gescheiden zelden veranderende derden-code van app-code
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
- Vereist ES-module syntaxis (`import`/`export`) door — CommonJS (`require`) schakelt tree shaking uit
- Voeg `"sideEffects": false` toe aan `package.json` (of vermeld CSS-bestanden met bijwerkingen)
- Controleer barrel-bestanden (`index.ts`) — alles opnieuw exporteren verslaat tree shaking; gebruik directe imports

### TypeScript Incremental Compilation
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```
Voeg `.tsbuildinfo` toe aan `.gitignore`, cache het in CI op basis van source hash.

### Turborepo Task Caching
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
Remote caching: `npx turbo link` — deelt cache hits over teamleden en CI.

### CI Cache-strategie (GitHub Actions patroon)
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
Doel: > 90% cache hit-tarief. Een miss op node_modules mag de build-output cache niet ongeldig maken.

### Veelvoorkomende snelle winsten (geen architectonische wijziging vereist)
1. Voeg `.dockerignore` toe spiegelend `.gitignore` — voorkomt dat `node_modules` in build-context terechtkomen
2. Schakel `vite.optimizeDeps.include` in voor grote CJS-deps die Vite traag pre-bundelt
3. Vervang `ts-node` door `tsx` voor scripts — tsx gebruikt esbuild en is ~10× sneller voor eenmalige uitvoering
4. Wissel `jest` naar `vitest` voor TypeScript-projecten — elimineert Babel-transform overhead
5. Schakel `esbuild` in als de TypeScript-transformer in Webpack via `esbuild-loader`

## Voorbeeld

**Symptoom:** CI-build duurt 8 minuten, bundel is 4 MB gzipped.

**Genomen stappen:**
1. Voer `npx vite-bundle-visualizer` uit — onthult `moment.js` (300 KB) en alle gebieden opgenomen
2. Vervang `moment` door `date-fns` tree-shaken imports — bespaart 280 KB
3. Voeg `manualChunks` toe om vendor van app-code te scheiden — reduceert eerste-load chunk van 1.2 MB naar 380 KB
4. Voeg Turborepo toe met `outputs: ["dist/**"]` — tweede CI-run raakt cache, build-tijd daalt naar 45 seconden

---

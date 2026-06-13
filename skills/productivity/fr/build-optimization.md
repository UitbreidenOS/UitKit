---
name: build-optimization
description: "Optimisation de compilation : accélérer les constructions Webpack/Vite/Turbo, réduire les tailles de bundle, optimiser les pipelines CI avec division de code, mise en cache et analyse de bundle"
---

# Build Optimization Skill

## Quand activer
Constructions lentes, grandes tailles de bundle, pipelines CI prenant plus de 5 minutes, ou quand l'utilisateur mentionne Webpack, Vite, Turbo, esbuild ou les problèmes de performance Rollup.

## Quand ne PAS utiliser
- Problèmes de performance d'exécution (CPU, mémoire, réseau) — cette compétence cible uniquement le temps de compilation/bundle
- Configuration initiale du projet où aucune base de référence n'existe
- Projets utilisant des bundlers autres que ceux énumérés ci-dessus (p.ex. Parcel, Brunch)

## Instructions

**Toujours commencer par l'analyse, jamais par des changements.**

### Analyse de bundle (exécuter en premier)
- Webpack: `npx webpack-bundle-analyzer stats.json` — générer des stats avec `webpack --profile --json > stats.json`
- Vite: `npx vite-bundle-visualizer` après ajout de `{ build: { reportCompressedSize: true } }`
- Identifier: plus gros chunks, dépendances dupliquées, modules inclus de manière inattendue

### Division de code
- Dynamic imports: `const Foo = () => import('./Foo')` pour les divisions au niveau route et fonctionnalité
- Division basée sur les routes dans React Router / Next.js: `React.lazy` + `Suspense`
- Isolement du chunk vendeur: séparer le code tiers rarement modifié du code app
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
- Nécessite la syntaxe du module ES (`import`/`export`) partout — CommonJS (`require`) désactive tree shaking
- Ajouter `"sideEffects": false` à `package.json` (ou lister les fichiers CSS qui ont des effets secondaires)
- Auditer les fichiers barrel (`index.ts`) — réexporter tout désactive tree shaking; utiliser des imports directs

### Compilation TypeScript incrémentale
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```
Ajouter `.tsbuildinfo` à `.gitignore`, le mettre en cache dans CI en fonction du hash source.

### Mise en cache des tâches Turborepo
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
Mise en cache à distance: `npx turbo link` — partage les hits du cache entre les membres de l'équipe et CI.

### Stratégie de cache CI (modèle GitHub Actions)
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
Cible : > 90% de taux de hit du cache. Un miss sur node_modules ne doit pas invalider le cache de sortie de compilation.

### Quick Wins courants (aucun changement architectural requis)
1. Ajouter `.dockerignore` miroir `.gitignore` — empêche l'envoi de `node_modules` dans le contexte de compilation
2. Activer `vite.optimizeDeps.include` pour les grandes dépendances CJS que Vite pré-bundle lentement
3. Remplacer `ts-node` par `tsx` pour les scripts — tsx utilise esbuild et est ~10× plus rapide pour l'exécution ponctuelle
4. Passer `jest` à `vitest` pour les projets TypeScript — élimine la surcharge de transformation Babel
5. Activer `esbuild` comme transformateur TypeScript dans Webpack via `esbuild-loader`

## Exemple

**Symptôme:** La compilation CI prend 8 minutes, le bundle est 4 MB gzippé.

**Étapes prises:**
1. Exécuter `npx vite-bundle-visualizer` — révèle `moment.js` (300 KB) et tous les locales inclus
2. Remplacer `moment` par les imports `date-fns` tree-shaken — économise 280 KB
3. Ajouter `manualChunks` pour séparer le code vendeur du code app — réduit le chunk de première charge de 1.2 MB à 380 KB
4. Ajouter Turborepo avec `outputs: ["dist/**"]` — le deuxième run CI atteint le cache, le temps de compilation tombe à 45 secondes

---

# Build Optimization

## When to activate
Slow builds, large bundle sizes, CI pipelines taking more than 5 minutes, or when the user mentions Webpack, Vite, Turbo, esbuild, or Rollup performance issues.

## When NOT to use
- Runtime performance problems (CPU, memory, network) — this skill targets compile/bundle time only
- First-time project setup where no baseline exists
- Projects using bundlers other than the ones listed above (e.g., Parcel, Brunch)

## Instructions

**Always start with analysis, never with changes.**

### Bundle Analysis (run first)
- Webpack: `npx webpack-bundle-analyzer stats.json` — generate stats with `webpack --profile --json > stats.json`
- Vite: `npx vite-bundle-visualizer` after adding `{ build: { reportCompressedSize: true } }`
- Identify: largest chunks, duplicated dependencies, unexpectedly included modules

### Code Splitting
- Dynamic imports: `const Foo = () => import('./Foo')` for route-level and feature-level splits
- Route-based splitting in React Router / Next.js: `React.lazy` + `Suspense`
- Vendor chunk isolation: separate rarely-changing third-party code from app code
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
- Requires ES module syntax (`import`/`export`) throughout — CommonJS (`require`) disables tree shaking
- Add `"sideEffects": false` to `package.json` (or list CSS files that have side effects)
- Audit barrel files (`index.ts`) — re-exporting everything defeats tree shaking; use direct imports

### TypeScript Incremental Compilation
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```
Add `.tsbuildinfo` to `.gitignore`, cache it in CI keyed on source hash.

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
Remote caching: `npx turbo link` — shares cache hits across team members and CI.

### CI Cache Strategy (GitHub Actions pattern)
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
Target: >90% cache hit rate. A miss on node_modules should not invalidate the build output cache.

### Common Quick Wins (no architectural change required)
1. Add `.dockerignore` mirroring `.gitignore` — prevents sending `node_modules` into build context
2. Enable `vite.optimizeDeps.include` for large CJS deps that Vite pre-bundles slowly
3. Replace `ts-node` with `tsx` for scripts — tsx uses esbuild and is ~10× faster for one-off execution
4. Switch `jest` to `vitest` for TypeScript projects — eliminates Babel transform overhead
5. Enable `esbuild` as the TypeScript transformer in Webpack via `esbuild-loader`

## Example

**Symptom:** CI build takes 8 minutes, bundle is 4 MB gzipped.

**Steps taken:**
1. Run `npx vite-bundle-visualizer` — reveals `moment.js` (300 KB) and all locales included
2. Replace `moment` with `date-fns` tree-shaken imports — saves 280 KB
3. Add `manualChunks` to split vendor from app code — reduces first-load chunk from 1.2 MB to 380 KB
4. Add Turborepo with `outputs: ["dist/**"]` — second CI run hits cache, build time drops to 45 seconds

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

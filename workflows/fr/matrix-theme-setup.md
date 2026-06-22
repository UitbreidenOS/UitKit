# Flux de travail de configuration du thème Matrix

Processus complet pour installer et personnaliser le thème Matrix dans toute une équipe — de la configuration initiale à la normalisation et à la maintenance continue.

---

## Quand utiliser ce flux de travail

Utilisez ce flux de travail quand :
- Intégration d'une nouvelle équipe au thème Matrix
- Normalisation de la configuration du thème sur plusieurs développeurs ou machines
- Déploiement du thème Matrix dans les environnements CI/CD
- Configuration des directives de personnalisation du thème pour l'organisation
- Migration d'autres thèmes vers Matrix

---

## Phase 1 : Planification et prérequis (Jour 1)

**Définir la portée du thème :**
- [ ] Identifier quelles applications/projets utiliseront le thème Matrix
- [ ] Déterminer si c'est un standard à l'échelle de l'équipe ou un choix spécifique au projet
- [ ] Documenter toute personnalisation de marque ou override de couleur nécessaire
- [ ] Lister tous les environnements (dev local, staging, production)
- [ ] Identifier les membres de l'équipe qui ont besoin d'accès à la configuration du thème

**Prérequis techniques :**
- [ ] Vérifier la compatibilité de la version Node.js (14+ recommandé)
- [ ] Confirmer que la version npm/yarn/pnpm supporte votre projet
- [ ] Vérifier les cadres de thème ou de style existants à migrer
- [ ] Examiner le pipeline de construction du projet (configuration webpack, Vite, esbuild)
- [ ] Documenter tout point d'intégration CSS-in-JS ou framework de style

**Communication d'équipe :**
- [ ] Planifier un point d'équipe de 15 minutes sur l'adoption du thème Matrix
- [ ] Créer un document partagé pour suivre les personnalisations et les décisions
- [ ] Assigner un propriétaire de thème (personne responsable de la maintenance et des mises à jour)

---

## Phase 2 : Installation et configuration (Jours 2-3)

**Installer le package du thème Matrix :**

```bash
# Utilisant npm
npm install @matrix/theme

# Utilisant yarn
yarn add @matrix/theme

# Utilisant pnpm
pnpm add @matrix/theme
```

**Vérifier l'installation :**
```bash
npm list @matrix/theme
# Doit afficher la version installée, sans erreurs
```

**Ajouter au point d'entrée du projet (ex. `index.js`, `App.tsx`) :**
```javascript
import '@matrix/theme'
// ou pour les variables CSS uniquement :
import '@matrix/theme/css-variables'
```

**Configurer le pipeline de construction :**

Si vous utilisez Webpack :
```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    }
  ]
}
```

Si vous utilisez Vite :
```javascript
export default {
  css: {
    preprocessorOptions: {
      css: {
        // Le CSS du thème Matrix se chargera automatiquement
      }
    }
  }
}
```

**Tester l'intégration basique :**
```bash
npm run dev
# Vérifier DevTools du navigateur → onglet Elements
# Vérifier que les classes du thème Matrix sont présentes : .matrix-*, --matrix-*
```

Créer un composant de test pour confirmer que le thème est actif :
```jsx
export function ThemeTest() {
  return (
    <div className="matrix-container">
      <h1 className="matrix-heading">Thème Matrix Actif</h1>
      <p className="matrix-text">Si ce texte apparaît stylisé, l'intégration est réussie.</p>
    </div>
  )
}
```

---

## Phase 3 : Personnalisation et marque (Jours 4-5)

**Créer un fichier de configuration du thème (`src/theme-config.js` ou similaire) :**

```javascript
// theme-config.js
export const matrixThemeConfig = {
  colors: {
    primary: '#00FF00',      // Override le vert Matrix par défaut
    secondary: '#00AA00',
    background: '#000000',
    text: '#00FF00',
    accent: '#00DD00'
  },
  typography: {
    fontFamily: 'Courier New, monospace',
    headingScale: 1.2
  },
  spacing: {
    unit: 8,  // Unité de base en pixels
  }
}
```

**Override les variables CSS dans la feuille de style racine (`src/styles/theme-overrides.css`) :**

```css
:root {
  /* Défauts du thème Matrix */
  --matrix-primary: #00FF00;
  --matrix-secondary: #00AA00;
  --matrix-background: #000000;
  --matrix-text: #00FF00;
  --matrix-accent: #00DD00;
  --matrix-border-radius: 2px;
  --matrix-transition: 0.2s ease-out;
}

/* Variante mode sombre */
@media (prefers-color-scheme: dark) {
  :root {
    --matrix-background: #0a0a0a;
    --matrix-text: #00FF00;
  }
}

/* Variante mode clair (si support des deux) */
@media (prefers-color-scheme: light) {
  :root {
    --matrix-background: #F5F5F5;
    --matrix-text: #004D00;
    --matrix-primary: #00AA00;
  }
}
```

**Importer les overrides dans le point d'entrée principal :**

```javascript
import '@matrix/theme'
import './styles/theme-overrides.css'
```

**Documenter les décisions de personnalisation :**

Créer `docs/THEME.md` :
```markdown
# Configuration du thème Matrix

## Palette de couleurs
- Primaire : #00FF00 (vert de marque de l'entreprise)
- Secondaire : #00AA00 (actions secondaires)
- Arrière-plan : #000000 (correspond à l'esthétique de l'entreprise)

## Typographie
- Famille de polices : Courier New, monospace
- Les titres utilisent --matrix-heading-scale : 1.2

## Espacement
- Unité de base : 8px
- Utiliser les variables --matrix-spacing-* pour la cohérence

## Quand faire un override
- Overrider uniquement pour aligner avec la marque de l'entreprise
- Tous les overrides doivent être documentés dans ce fichier
- Ne pas créer de variantes personnalisées sans approbation de l'équipe

## Maintenance
- Propriétaire du thème : @[nom]
- Dernière mise à jour : [date]
- Calendrier de révision : Trimestriel
```

---

## Phase 4 : Normalisation dans l'équipe (Jours 6-7)

**Créer un package de configuration partagée (optionnel mais recommandé pour les grandes équipes) :**

```
packages/theme-config/
├── index.js              # Exporter la configuration du thème
├── colors.js             # Palette de couleurs
├── typography.js         # Paramètres de polices et de texte
├── spacing.js            # Échelle d'espacement
└── README.md            # Documentation d'utilisation
```

Dans le `package.json` de chaque projet :
```json
{
  "dependencies": {
    "@company/theme-config": "^1.0.0",
    "@matrix/theme": "^x.x.x"
  }
}
```

Dans le point d'entrée de chaque projet :
```javascript
import '@matrix/theme'
import { applyThemeConfig } from '@company/theme-config'

applyThemeConfig()
```

**Créer une liste de contrôle d'installation pour les nouveaux membres :**

Créer `.claude/matrix-theme-checklist.md` :
```markdown
# Liste de contrôle d'intégration du thème Matrix

- [ ] Exécuter `npm install` (installe automatiquement @matrix/theme)
- [ ] Vérifier l'import dans `src/index.js` ou `src/App.tsx`
- [ ] Exécuter `npm run dev` et vérifier qu'il n'y a pas d'erreurs CSS dans la console
- [ ] Ouvrir DevTools → Elements et confirmer que les classes Matrix sont présentes
- [ ] Lire `docs/THEME.md` pour les règles de personnalisation
- [ ] Vérifier `.env.example` pour les variables THEME_*
- [ ] Exécuter `npm run test` pour confirmer que le thème ne casse pas les tests
- [ ] Demander au propriétaire du thème (@[nom]) d'examiner votre configuration

Questions ? Consultez le README du package theme-config ou le canal #design-systems Slack.
```

**Configurer le thème dans l'environnement CI/CD :**

Dans `.github/workflows/build.yml` (ou équivalent) :
```yaml
name: Build with Matrix Theme

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Verify theme assets bundled
        run: |
          grep -r "matrix-" dist/ || echo "Warning: No Matrix theme classes in output"
```

**Documenter les overrides spécifiques à l'environnement :**

Créer `src/theme-env.js` :
```javascript
// Appliquer les ajustements de thème spécifiques à l'environnement

const env = process.env.NODE_ENV || 'development'

export const getEnvTheme = () => {
  switch (env) {
    case 'production':
      return {
        primaryColor: '#00FF00',
        reducedMotion: false
      }
    case 'staging':
      return {
        primaryColor: '#FFFF00',  // Bannière jaune pour staging
        reducedMotion: false
      }
    case 'development':
    default:
      return {
        primaryColor: '#00FF00',
        reducedMotion: true  // Plus rapide pour le développement local
      }
  }
}
```

---

## Phase 5 : Tests et validation (Jours 8-9)

**Tests unitaires pour l'intégration du thème :**

Créer `src/theme.test.js` :
```javascript
describe('Matrix Theme', () => {
  it('should load theme CSS variables', () => {
    const root = document.documentElement
    const primaryColor = getComputedStyle(root).getPropertyValue('--matrix-primary').trim()
    expect(primaryColor).toBeTruthy()
  })

  it('should apply theme classes to components', () => {
    const element = document.querySelector('.matrix-container')
    expect(element).toBeTruthy()
  })

  it('should respect color overrides', () => {
    const root = document.documentElement
    const overriddenColor = getComputedStyle(root).getPropertyValue('--matrix-primary').trim()
    expect(overriddenColor).toMatch(/#[0-9A-Fa-f]{6}/) // Couleur hexadécimale valide
  })
})
```

**Tests de régression visuelle (optionnel mais recommandé) :**

Utiliser Percy, Chromatic, ou un service similaire pour capturer les captures d'écran de base.

**Audit d'accessibilité :**

```bash
# Installer le vérificateur d'accessibilité
npm install --save-dev @axe-core/react axe-playwright

# Exécuter l'audit
npm run test:a11y
```

Vérifier :
- [ ] Le contraste des couleurs répond à WCAG AA (4.5:1 pour le texte)
- [ ] Les états de focus sont visibles avec le thème Matrix appliqué
- [ ] La navigation au clavier fonctionne
- [ ] Un lecteur d'écran lit correctement les éléments stylisés du thème

**Tests de compatibilité des navigateurs :**

Tester le thème Matrix sur :
- [ ] Chrome/Chromium (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Navigateurs mobiles (iOS Safari, Chrome Mobile)

Documenter tout problème de compatibilité dans `docs/THEME.md`.

---

## Phase 6 : Formation d'équipe et déploiement (Jours 10-11)

**Organiser une session de formation d'équipe de 30 minutes :**

Agenda :
1. Pourquoi le thème Matrix (5 min) — justification commerciale/UX
2. Comment l'utiliser (10 min) — import, points de personnalisation, motif override
3. Pièges courants (5 min) — spécificité CSS, nommage des variables, points d'arrêt
4. Questions/Réponses (10 min)

Enregistrer et partager de manière asynchrone pour les membres de l'équipe qui ne peuvent pas assister.

**Partager la documentation :**
- [ ] Envoyer le lien vers `docs/THEME.md` dans le Slack/email de l'équipe
- [ ] Épingler la liste de contrôle dans le canal Slack pertinent
- [ ] Créer une courte vidéo de démonstration avant/après
- [ ] Mettre à jour le wiki de l'équipe ou les documents d'intégration

**Déployer tous les projets :**

Pour la configuration monorepo :
```bash
# Mettre à jour le package.json racine
npm install @matrix/theme

# Installer dans tous les espaces de travail
npm install --workspaces
```

Pour plusieurs référentiels :
```bash
# Créer un script pour mettre à jour en masse
for repo in repo1 repo2 repo3; do
  cd $repo
  npm install @matrix/theme
  git commit -am "chore: install Matrix theme"
  git push origin feature/matrix-theme
done
```

**Créer des demandes de fusion pour examen :**

Chaque PR doit inclure :
- Installation et import du thème
- Fichier de configuration du thème ou référence à la configuration partagée
- `docs/THEME.md` mis à jour ou docs de thème d'équipe
- Vérification que les tests passent
- Lien vers la liste de contrôle du thème

Exemple de description de PR :
```markdown
## Installation du thème Matrix

Installe @matrix/theme et le configure pour [nom du projet].

### Modifications
- Ajout de @matrix/theme aux dépendances
- Création de src/theme-config.js avec personnalisation de marque
- Mise à jour du point d'entrée principal pour importer le thème
- Ajout de docs/THEME.md avec les normes d'équipe

### Test
- [ ] Dev local : `npm run dev` affiche les composants stylisés
- [ ] Build : `npm run build` inclut le CSS du thème
- [ ] Tests : Tous réussissant
- [ ] Accessibilité : Aucune nouvelle violation de contraste

### Déploiement
- [ ] Examiner et approuver
- [ ] Fusionner avec main
- [ ] Déployer sur staging pour 24h QA
- [ ] Déployer en production

Voir workflows/matrix-theme-setup.md pour le processus complet.
```

---

## Phase 7 : Maintenance continue (Hebdomadaire/Mensuel)

**Vérification hebdomadaire de santé du thème (5 min) :**
- [ ] Surveiller les questions liées au thème sur Slack ou les bugs
- [ ] Vérifier que les nouvelles fonctionnalités s'intègrent proprement au thème Matrix
- [ ] Vérifier que le pipeline CI/CD inclut toujours correctement le thème

**Examen mensuel du thème (30 min, asynchrone) :**
- [ ] Collecter les retours d'équipe dans un fil Slack dédié
- [ ] Examiner les personnalisations ou cas limites découverts
- [ ] Mettre à jour `docs/THEME.md` avec les nouveaux motifs ou pièges
- [ ] Vérifier si une version plus récente de @matrix/theme est disponible

**Audit trimestriel du thème (1-2 heures) :**
- [ ] Relancer l'audit d'accessibilité sur tous les projets
- [ ] Re-vérifier la compatibilité des navigateurs
- [ ] Analyse d'impact performance (taille du bundle CSS, temps de chargement)
- [ ] Examiner la conformité de personnalisation (pas d'overrides ad-hoc)
- [ ] Planifier les mises à niveau majeures éventuelles vers la prochaine version

**Maintenir la documentation à jour :**
```markdown
# Dernier audit : [Date]
# Propriétaire maintenance : @[nom]
# Prochain examen : [Date + 90 jours]
```

---

## Guide de dépannage

**Le CSS du thème ne se charge pas :**
- [ ] Vérifier que `import '@matrix/theme'` est dans le point d'entrée
- [ ] Vérifier les logs de construction pour les erreurs du chargeur CSS
- [ ] S'assurer que postcss-loader est configuré si vous utilisez des variables personnalisées
- [ ] Effacer node_modules et réinstaller : `rm -rf node_modules && npm install`

**Les classes du thème n'apparaissent pas :**
- [ ] Vérifier DevTools du navigateur → Elements pour `class="matrix-*"`
- [ ] Vérifier que le markup du composant utilise les bons noms de classe (voir docs)
- [ ] Vérifier si le CSS est supprimé par la build production (problème de minification)

**Les overrides de couleur ne fonctionnent pas :**
- [ ] Vérifier que la variable CSS est définie avant l'import du thème
- [ ] Vérifier la spécificité CSS (le thème Matrix utilise `:root`, assurez-vous que les overrides aussi)
- [ ] Effacer le cache du navigateur : Ctrl+Shift+R ou Cmd+Shift+R

**Le thème casse sur mobile :**
- [ ] Vérifier que les media queries de breakpoint sont définies
- [ ] Tester que les media queries ne sont pas en conflit avec les styles du thème
- [ ] Vérifier que les états tactiles sont stylisés (hover ne fonctionnera pas sur mobile)

**Dégradation de performance :**
- [ ] Vérifier la taille du bundle : `npm run build:analyze`
- [ ] Chercher les variables de thème inutilisées dans le CSS final
- [ ] Considérer le tree-shaking si vous utilisez CSS-in-JS

**Un membre de l'équipe a une version obsolète :**
- [ ] Lui demander d'exécuter `npm install @matrix/theme@latest`
- [ ] Effacer le cache npm : `npm cache clean --force`
- [ ] Réinstaller : `rm -rf node_modules && npm install`

---

## Plan de rollback

Si le thème Matrix cause des problèmes critiques en production :

```bash
# Étape 1 : Identifier le problème
# [Vérifier les logs d'erreur, les rapports d'utilisateurs]

# Étape 2 : Rétablir l'import du thème
# Dans src/index.js, commenter ou supprimer :
# import '@matrix/theme'

# Étape 3 : Vérifier la build
npm run build

# Étape 4 : Tester localement
npm run dev
# Confirmer que l'app fonctionne sans thème

# Étape 5 : Déployer le rollback
git commit -am "Revert: Matrix theme (temporary rollback)"
git push origin main
# Déployer en production

# Étape 6 : Enquêter sur la cause première
# Créer un problème GitHub lié à ce rollback
# Assigner au propriétaire du thème pour diagnostic

# Étape 7 : Réintroduire avec correction
# Après correction de la cause première, réappliquer le thème avec version mise à jour
```

---

## Liste de contrôle : Thème Matrix entièrement déployé

- [ ] Phase 1 : Planification complète, équipe alignée sur la portée
- [ ] Phase 2 : Installation vérifiée dans au moins un projet
- [ ] Phase 3 : Personnalisations documentées dans `docs/THEME.md`
- [ ] Phase 4 : Package de configuration partagée créé (si applicable)
- [ ] Phase 4 : Tests du pipeline CI/CD réussissant avec le thème
- [ ] Phase 5 : Audit d'accessibilité réussi (WCAG AA)
- [ ] Phase 5 : Compatibilité des navigateurs vérifiée
- [ ] Phase 6 : Formation d'équipe complétée
- [ ] Phase 6 : Tous les projets d'équipe ont le thème installé
- [ ] Phase 6 : Propriétaire de thème assigné et canal Slack créé
- [ ] Phase 7 : Calendrier de maintenance documenté
- [ ] Plan de rollback testé (si en production)

---

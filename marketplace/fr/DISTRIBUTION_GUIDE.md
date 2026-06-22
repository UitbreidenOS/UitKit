# Guide de Distribution de Plugins

Ce guide couvre comment distribuer les plugins Claudient via plusieurs canaux : registre npm, versions GitHub, soumission au marketplace, et stratégie de versioning.

## Vue d'ensemble

Les plugins Claudient peuvent être distribués via trois canaux principaux :

1. **Registre npm** — Pour l'installation programmatique et la gestion des dépendances
2. **GitHub Releases** — Pour les téléchargements directs et le contrôle de version
3. **Claudient Marketplace** — Pour la découverte et l'intégration écosystème

Chaque canal répond à différents cas d'usage ; la plupart des éditeurs utilisent les trois.

---

## Partie 1 : Publication sur le registre npm

### Prérequis

- Compte npm avec email vérifié ([npmjs.com](https://npmjs.com))
- Authentification à deux facteurs activée (obligatoire pour la gestion des paquets)
- CLI `npm` installé localement (`npm --version`)
- Configuration appropriée de `package.json`

### Étape 1 : Préparer votre package.json

Assurez-vous que le `package.json` racine de votre plugin est correctement configuré :

```json
{
  "name": "@claudient/plugin-votre-nom-plugin",
  "version": "1.0.0",
  "description": "Description d'une ligne du plugin (max 80 caractères)",
  "main": "index.js",
  "files": [
    "skills/",
    "agents/",
    "hooks/",
    "mcp/",
    "workflows/",
    ".claude-plugin/",
    "README.md",
    "CLAUDE.md",
    "LICENSE"
  ],
  "keywords": ["claude-code", "claudient", "plugin", "domaine"],
  "author": {
    "name": "Votre Nom",
    "email": "vous@example.com",
    "url": "https://github.com/yourname"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Étape 2 : Préparer les fichiers de distribution

Avant publication, assurez-vous que ces fichiers existent :

```
votre-plugin/
├── package.json          (configuré comme ci-dessus)
├── README.md            (vue d'ensemble + installation)
├── CLAUDE.md            (principes du plugin)
├── LICENSE              (MIT ou compatible)
├── .claude-plugin/      (métadonnées)
│   └── plugin.json      (voir Partie 3)
├── .npmignore           (exclure les fichiers non essentiels)
├── skills/              (vos skills)
├── agents/              (vos agents)
├── hooks/               (vos hooks)
└── mcp/                 (vos configs MCP)
```

### Étape 3 : Créer .npmignore

Exclure les fichiers inutiles du paquet npm :

```
.git*
.claude/
.vscode/
node_modules/
*.test.js
*.spec.js
examples/
docs/
audit_*.py
cleanup_*.py
*.sh
.env
.env.local
development.md
```

### Étape 4 : Se connecter à npm

```bash
npm login
# Entrez le nom d'utilisateur, le mot de passe et l'OTP lorsque demandé
```

Vérifiez l'authentification :

```bash
npm whoami
```

### Étape 5 : Publier sur npm

Avant publication, testez localement :

```bash
# Tester le contenu du paquet
npm pack

# Simuler l'installation
npm install ./votre-plugin-1.0.0.tgz

# Vérifier l'installation
ls node_modules/@claudient/plugin-votre-nom-plugin/
```

Publiez sur npm :

```bash
npm publish
```

### Étape 6 : Vérifier la publication

```bash
# Vérifier le paquet sur npm
npm view @claudient/plugin-votre-nom-plugin

# Tester l'installation
npm install @claudient/plugin-votre-nom-plugin
```

---

## Partie 2 : GitHub Releases et Téléchargements

### Étape 1 : Créer les artefacts de release

Packagisez votre plugin pour le téléchargement direct :

```bash
# Créer une archive distribuable
mkdir -p dist/
tar -czf dist/plugin-votre-nom-plugin-1.0.0.tar.gz \
  skills/ agents/ hooks/ mcp/ workflows/ \
  README.md CLAUDE.md .claude-plugin/ LICENSE

# Créer la somme de contrôle
shasum -a 256 dist/plugin-votre-nom-plugin-1.0.0.tar.gz > dist/CHECKSUMS.txt
```

### Étape 2 : Préparer les notes de release

Créez `RELEASE_NOTES.md` :

```markdown
# Version v1.0.0

## Nouveautés

- Version initiale avec 5 compétences principales
- 3 workflows d'exemple
- Documentation complète

## Installation

### Via npm
\`\`\`bash
npm install @claudient/plugin-votre-nom-plugin
\`\`\`

### Via téléchargement direct
[Télécharger plugin-votre-nom-plugin-1.0.0.tar.gz](https://github.com/yourname/plugin-repo/releases/download/v1.0.0/plugin-votre-nom-plugin-1.0.0.tar.gz)

## Changements cassants

Aucun.
```

### Étape 3 : Créer une GitHub Release

Utilisant GitHub CLI :

```bash
# Créer une release avec statut brouillon
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  --draft

# Télécharger les artefacts
gh release upload v1.0.0 dist/plugin-votre-nom-plugin-1.0.0.tar.gz
gh release upload v1.0.0 dist/CHECKSUMS.txt

# Publier la release
gh release edit v1.0.0 --draft=false
```

---

## Partie 3 : Soumission au Claudient Marketplace

### Étape 1 : Préparer les métadonnées du marketplace

Créez `.claude-plugin/plugin.json` à la racine de votre plugin :

```json
{
  "name": "Nom de votre plugin",
  "id": "votre-plugin-id",
  "version": "1.0.0",
  "description": "Description d'une ligne (max 80 caractères)",
  "longDescription": "Description détaillée de 2-3 phrases.",
  "author": {
    "name": "Votre Nom",
    "email": "vous@example.com",
    "type": "community"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "category": "backend",
  "tags": ["framework", "api"],
  "minClaudeCodeVersion": "1.0.0"
}
```

### Étape 2 : Soumettre au marketplace

1. **Fork** le dépôt Claudient : `github.com/claudients/claudient`
2. **Créer une branche de fonctionnalité :**
   ```bash
   git checkout -b submit/votre-plugin-nom
   ```
3. **Ajouter votre plugin à `plugins/` :**
   ```
   plugins/votre-plugin-nom/
   ├── .claude-plugin/plugin.json
   ├── README.md
   ├── CLAUDE.md
   └── skills/
   ```
4. **Ouvrir une PR** avec description complète
5. **Adresser les retours de révision**
6. **Fusionner** — Le plugin apparaît dans le marketplace dans 24 heures

---

## Partie 4 : Stratégie de Versioning

### Semantic Versioning (SemVer)

Suivez strictement [semver.org](https://semver.org) :

- **MAJEURE** (X.0.0) — Changements cassants
- **MINEURE** (0.X.0) — Nouvelles fonctionnalités rétro-compatibles
- **CORRECTIF** (0.0.X) — Corrections de bugs

### Tags Git

Taggez chaque release :

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Maintenance du Changelog

Maintenez `CHANGELOG.md` à la racine du projet :

```markdown
# Changelog

Tous les changements notables seront documentés dans ce fichier.

## [1.0.0] - 2026-06-22

### Ajouté
- Release initiale avec 5 compétences principales

### Corrigé
- Bug #45 : Analyse de paramètres incorrecte

### Supprimé
- Agent-old (utiliser agent-new à la place)
```

---

## Partie 5 : Checklist complète de distribution

### Avant la release

- [ ] Version `package.json` mise à jour
- [ ] `CHANGELOG.md` mis à jour
- [ ] `.claude-plugin/plugin.json` mis à jour
- [ ] Tous les skills/agents ont des fichiers README.md
- [ ] Les exemples sont testés et fonctionnels
- [ ] Fichier LICENSE présent (MIT/Apache 2.0/CC-BY-SA-4.0)

### Publication npm

- [ ] `.npmignore` configuré
- [ ] `npm login` réussi
- [ ] `npm publish` réussit
- [ ] `npm view` affiche les métadonnées du paquet
- [ ] Test d'installation réussi

### GitHub Release

- [ ] Tag git créé (`git tag v1.0.0`)
- [ ] Artefacts de release générés (`.tar.gz`)
- [ ] Sommes de contrôle générées (`CHECKSUMS.txt`)
- [ ] Notes de release préparées
- [ ] Release publiée

### Soumission au marketplace

- [ ] `.claude-plugin/plugin.json` complet
- [ ] README.md prêt pour le marketplace
- [ ] Fork du dépôt Claudient créé
- [ ] Plugin ajouté au répertoire `plugins/`
- [ ] PR ouverte avec description complète
- [ ] PR fusionnée

---

**Dernière mise à jour :** 22 juin 2026  
**Responsable :** Équipe principale de Claudient  
**Licence :** CC-BY-SA-4.0

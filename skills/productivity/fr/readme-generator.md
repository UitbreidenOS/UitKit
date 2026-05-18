---
name: readme-generator
description: "Generate complete README.md files: badges, install, usage, API reference, contributing guide, from code or description"
---

> 🇫🇷 Version française. [English version](../readme-generator.md).

# Compétence : Générateur de README

## Quand activer
- Un nouveau projet a besoin d'un README rédigé de zéro
- Le README existant est obsolète ou incomplet
- Mise en open source d'un projet nécessitant une documentation professionnelle
- Le README existe mais manque d'instructions d'installation, d'exemples d'utilisation ou de référence API

## Quand NE PAS utiliser
- Outils internes non destinés à la consommation publique
- Projets disposant déjà d'un site de documentation (Docusaurus, MkDocs, etc.) — le README doit simplement y renvoyer
- Quand vous avez besoin d'une référence API approfondie — utilisez un générateur de documentation dédié (TypeDoc, Sphinx)

## Instructions

### Structure standard d'un README

```markdown
# Nom du projet

> Description en une phrase de ce que fait le projet et pour qui il est destiné.

[![npm](badge)] [![license](badge)] [![ci](badge)]

## Fonctionnalités (optionnel — à omettre pour les outils simples)
- Capacité clé 1
- Capacité clé 2

## Installation
\`\`\`bash
# Méthode d'installation principale
npm install your-package

# ou
pip install your-package
\`\`\`

## Démarrage rapide
\`\`\`language
// Exemple minimal fonctionnel — prêt à copier-coller
\`\`\`

## Utilisation
[Exemples plus détaillés couvrant les principaux cas d'usage]

## Référence API (si bibliothèque/SDK)
### `functionName(param, options)`
Description.
**Paramètres :** ...
**Retourne :** ...
**Exemple :** ...

## Configuration
[Tableau des variables d'environnement ou options de configuration]

## Contribuer
[Un paragraphe + lien vers CONTRIBUTING.md]

## Licence
MIT — voir [LICENSE](LICENSE)
```

### Invocation de la compétence

**De zéro :**
```
/readme-generator

Project: {nom}
What it does: {un paragraphe}
Tech stack: {liste}
Install method: {npm/pip/brew/binary/etc}
Key commands: {liste}
Target audience: {developers / end-users / both}
```

**Depuis le code existant :**
```
/readme-generator

Read the codebase and generate a complete README.md.
Focus on: install, quick start, and API reference for exported functions.
```

**Mise à jour d'un README existant :**
```
/readme-generator

Update README.md — the install instructions are outdated (now uses pnpm),
and the API reference is missing the new `createSession()` function.
```

### Génération de badges

Claude suggérera des badges pertinents depuis shields.io :

```markdown
[![npm version](https://img.shields.io/npm/v/package-name)](https://npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/org/repo/actions)
[![Downloads](https://img.shields.io/npm/dm/package-name)](https://npmjs.com/package/package-name)
```

### Principes de rédaction

**Les 3 premières lignes sont essentielles.** GitHub affiche un aperçu — rendez la description et le démarrage rapide visibles sans défilement.

**Des exemples fonctionnels plutôt que des descriptions.** Un bloc de code qui s'exécute vaut 10 paragraphes de prose.

**L'installation doit être prête à copier-coller.** Chaque étape doit fonctionner mot pour mot sur une machine vierge.

**Format de référence API :**
```markdown
### `createUser(email, options?)`

Crée un nouveau compte utilisateur.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `email` | `string` | Oui | Adresse e-mail de l'utilisateur |
| `options.role` | `'admin' \| 'user'` | Non | Par défaut : `'user'` |

**Retourne :** `Promise<User>`

\`\`\`typescript
const user = await createUser('alice@example.com', { role: 'admin' })
\`\`\`
```

### Calibrage de la profondeur

| Type de projet | Profondeur du README |
|---|---|
| Outil CLI | Installation + utilisation + tous les drapeaux/commandes |
| Bibliothèque npm | Référence API complète pour chaque export |
| SaaS / application web | Fonctionnalités + guide de déploiement + variables d'environnement |
| Modèle GitHub | Ce qu'il faut remplacer + comment personnaliser |
| Outil interne | Installation + commandes clés + comment contribuer |

## Exemple

**Entrée :**
```
Project: claudient
What it does: npm package with Claude Code skills, agents, hooks, and workflows
Install: npx claudient add all
Key commands: add, remove, list, search, init
Target audience: developers using Claude Code
```

**Résultat attendu :** README complet avec description principale, badges npm/licence/langage, section d'installation (`npx claudient add all`), tableau de référence CLI pour toutes les sous-commandes, liste des catégories, section de contribution, pied de page licence MIT.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

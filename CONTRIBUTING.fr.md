> 🇫🇷 Version française. [English version](CONTRIBUTING.md).

# Contribuer à Claudient

Claudient grandit grâce aux contributions de la communauté. Si vous avez un skill, un agent, un hook, un workflow ou un prompt qui a rendu Claude Code significativement meilleur pour vous — il a sa place ici.

---

## Ce qu'il faut contribuer

| Type | Emplacement | Description |
|---|---|---|
| Skill | `skills/<category>/` | Une slash command qui active un comportement spécifique à un domaine |
| Agent | `agents/<category>/` | Une définition de sous-agent spécialisé |
| Hook | `hooks/<trigger>/` | Une automatisation déclenchée par un événement |
| Rule | `rules/common/` ou `rules/<language>/` | Une directive à toujours respecter |
| Workflow | `workflows/` | Un processus multi-étapes de bout en bout |
| Prompt | `prompts/<category>/` | Un modèle de prompt réutilisable |
| Guide | `guides/` | Un document de documentation approfondie |
| Traduction | `guides/<lang>/` | Une traduction d'un guide anglais existant |

---

## Niveau de qualité

Avant de soumettre, vérifiez que votre contribution respecte le niveau requis :

**Skills**
- [ ] Possède une section « When to activate » claire avec des conditions de déclenchement précises
- [ ] Possède une section « When NOT to use » avec au moins un anti-pattern
- [ ] Inclut au moins un exemple concret
- [ ] Référence les fonctionnalités réelles de Claude Code — pas de conseils LLM génériques
- [ ] Vous l'avez testé lors d'au moins une session réelle

**Agents**
- [ ] Spécifie un sous-ensemble d'outils (pas tous les outils)
- [ ] Inclut des recommandations de modèle (Haiku / Sonnet / Opus) avec justification
- [ ] Inclut un exemple de cas d'utilisation concret

**Hooks**
- [ ] Inclut l'extrait JSON exact pour `settings.json`
- [ ] Inclut le script (le cas échéant) avec les instructions d'installation
- [ ] Décrit clairement ce qui le déclenche et ce qu'il fait

**Guides**
- [ ] Rédigé pour un public de développeurs seniors
- [ ] Aucune section avec du contenu provisoire
- [ ] Conforme au comportement actuel de Claude Code

---

## Modèle de Skill

Copiez ceci lors de l'ajout d'un nouveau skill :

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns]

## Instructions
[Skill content]

## Example
[Concrete example]
```

---

## Nommage des fichiers

- Utilisez `kebab-case.md` pour tous les fichiers Markdown
- Utilisez `kebab-case.sh` ou `kebab-case.py` pour les scripts
- Placez les fichiers dans le bon sous-répertoire — consultez `README.md` pour la carte

---

## Soumettre une PR

1. Forkez le dépôt et créez une branche : `git checkout -b add/fastapi-skill`
2. Ajoutez votre ou vos fichiers en suivant le format ci-dessus
3. Si vous avez ajouté un nouveau guide en anglais, indiquez dans la description de la PR quelles traductions sont nécessaires
4. Ouvrez une PR avec un titre comme : `add: FastAPI skill` ou `fix: token-optimization guide`
5. Remplissez la description de la PR — ce que c'est, pourquoi c'est utile, comment vous l'avez testé

---

## Traductions

Pour traduire un guide anglais existant :

1. Copiez le fichier anglais : `cp guides/getting-started.md guides/fr/getting-started.md`
2. Traduisez le contenu — conservez tous les blocs de code, les chemins de fichiers et les termes techniques en anglais
3. Soumettez une PR avec le titre : `translate: getting-started guide (French)`

Langues prises en charge : anglais (principale), français (`fr/`), allemand (`de/`), néerlandais (`nl/`), espagnol (`es/`).

---

## Ce qui est rejeté

- Le contenu qui duplique un fichier existant sans amélioration claire
- Les contributions provisoires ou incomplètes (sections « coming soon »)
- Les skills qui décrivent un comportement LLM générique plutôt que des fonctionnalités spécifiques à Claude Code
- Le code applicatif (ce dépôt est uniquement de la documentation et de la configuration)
- Tout ce qui ne respecte pas les conventions de nommage ou de format définies dans `CLAUDE.md`

---

## Questions

Ouvrez une GitHub Discussion si vous n'êtes pas sûr de l'endroit où quelque chose appartient ou si vous souhaitez des retours avant de construire. Les Issues sont réservées aux bugs et aux lacunes concrètes de couverture.

---

## Travailler avec nous

Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA avec des communautés de développeurs et livrons des solutions IA B2B. Si vous souhaitez aller au-delà de la contribution à ce dépôt et réellement construire des produits IA ou des solutions B2B avec nous, contactez-nous.

**[uitbreiden.com](https://uitbreiden.com/)**

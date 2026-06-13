# SDK vs CLI — Différences de Prompt Système

Lorsque vous utilisez Claude Code via la CLI par rapport à l'SDK Claude Agent, le prompt système chargé dans le contexte du modèle est dramatiquement différent. Cela importe lors de la création de pipelines automatisés, du débogage de comportements inattendus ou de l'ajustement des coûts.

---

## Ce que la CLI charge

La CLI charge un prompt système modulaire assemblé à partir de 110+ fragments activés conditionnellement au démarrage. Ce qui est inclus dépend de votre configuration de projet :

| Catégorie de fragment | Jetons (approximatif) |
|---|---|
| Prompt de base (toujours chargé) | ~269 |
| Descriptions d'outils (Read, Write, Edit, Bash, etc.) | ~800–1,200 |
| Contenu CLAUDE.md (global + projet) | Varie — peut être 0 à 4,000+ |
| Descriptions de compétences (`.claude/skills/`) | ~50–200 par compétence |
| Fichiers de règles (`.claude/rules/`) | Varie |
| Descriptions d'outils MCP | ~100–500 par serveur |
| Contexte de session (cwd, git status, platform) | ~100–300 |
| **Total avec configuration complète** | **jusqu'à ~5,000–8,000 jetons** |

Rien de cela n'est visible pour vous dans le terminal. Les fragments sont injectés avant votre premier message.

---

## Ce que le SDK charge

Sans configuration explicite, le SDK (paquet `anthropic` avec `messages.create` standard) ne charge aucun contexte de Claude Code — il se comporte comme un appel API ordinaire. Aucun CLAUDE.md, aucune compétence, aucune description d'outils au-delà de ce que vous passez explicitement.

Pour charger le prompt système équivalent à la CLI depuis le SDK :

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system=[
        {
            "type": "text",
            "text": "Your custom instructions here"
        }
    ],
    messages=[{"role": "user", "content": "Do X"}]
)
```

Pour charger le préset Claude Code (inclut les descriptions d'outils et le prompt de base) :

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system={"type": "preset", "preset": "claude_code"},
    messages=[{"role": "user", "content": "Do X"}]
)
```

Pour charger également les paramètres de projet depuis `.claude/settings.json`, ajoutez :

```python
extra_headers={"X-Setting-Sources": "project"}
```

---

## Différences de comportement en un coup d'œil

| Comportement | CLI | SDK (défaut) | SDK + preset |
|---|---|---|---|
| CLAUDE.md chargé | Oui | Non | Non (ajouter manuellement) |
| Utilisation d'outils activée | Oui | Nécessite des outils explicites | Oui |
| Descriptions de compétences | Oui | Non | Non |
| Fichiers de règles | Oui | Non | Non |
| Contexte git de session | Oui | Non | Non |
| Instructions de sécurité de base | Oui | Oui | Oui |
| Descriptions d'outils MCP | Oui (si configuré) | Non | Non |
| Coût vs session CLI | Référence | ~40–70% plus bas | ~80–95% de la CLI |

---

## Le drapeau `--bare`

`claude -p "task" --bare` ignore toute la découverte de projet au niveau de la CLI :

- Aucun chargement de CLAUDE.md
- Aucune découverte de `.claude/settings.json`
- Aucune connexion aux serveurs MCP
- Aucun chargement de compétences

Le résultat est une invocation CLI qui se comporte comme un appel SDK direct, avec la couche UX de la CLI au-dessus. Le temps de démarrage passe de ~2–3 secondes à ~200ms sur les systèmes chauds.

Utilisez `--bare` pour :
- Les scripts d'automatisation haute fréquence appelant Claude via CLI
- Les intégrations de style SDK qui se trouvent utiliser le binaire CLI
- Tester les prompts en isolation sans interférence du contexte du projet

N'utilisez pas `--bare` pour :
- Les sessions de développement interactif (vous perdez CLAUDE.md, les compétences, les règles)
- Les flux de travail qui ont besoin d'accès aux serveurs MCP du projet

---

## Aucune garantie de déterminisme

Il n'y a pas de paramètre `seed` équivalent pour Claude Code ou l'API Claude. À temperature=0, les réponses sont cohérentes en pratique mais ne sont pas garanties d'être identiques entre les appels API. C'est une propriété fondamentale du modèle — pas un problème de configuration, et pas quelque chose que `--bare` ou le preset résout.

Si votre automatisation dépend d'une sortie déterministe :
- Utilisez une sortie structurée avec des schémas JSON définis
- Validez les sorties par rapport à un schéma plutôt que de comparer du texte brut
- Construisez des pipelines idempotents qui tolèrent la variation dans les formulations

---

## Référence de latence de démarrage

| Mode | Démarrage froid typique | Démarrage chaud typique |
|---|---|---|
| `claude` (CLI complet) | 3–5 secondes | 1–2 secondes |
| `claude -p "x"` (mode impression) | 2–4 secondes | 1–1,5 secondes |
| `claude -p "x" --bare` | 0,3–0,5 secondes | 0,1–0,2 secondes |
| SDK `messages.create` | ~100–200ms (réseau) | ~100ms (réseau) |

Le mode CLI nu est le bon choix lorsque vous avez besoin du binaire Claude Code mais que vous vous préoccupez de la latence. Le SDK est encore plus rapide quand vous n'avez pas besoin de la CLI du tout.

---

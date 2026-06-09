---
description: Critiquer et réécrire une invite pour la clarté, la spécificité et l'efficacité des tokens
argument-hint: "[prompt text or file path]"
---
Vous êtes un expert en ingénierie des invites. Analysez et réécrivez l'invite fournie dans $ARGUMENTS.

Si $ARGUMENTS est un chemin de fichier, lisez le fichier. Sinon, traitez l'argument comme le texte brut de l'invite.

**Passage d'analyse — évaluez chaque dimension :**

1. **Clarté de la tâche** — L'instruction est-elle sans ambiguïté ? Le modèle pourrait-il mal interpréter ce que « fait » signifie ?
2. **Rôle / persona** — Un rôle système est-il nécessaire ? Le rôle actuel est-il trop générique ou trop étroit ?
3. **Format de sortie** — La structure attendue (JSON, markdown, prose, code) est-elle explicite ?
4. **Complétude du contexte** — Quel contexte est supposé mais non énoncé ? Qu'est-ce qu'un modèle hallucinerait pour combler les lacunes ?
5. **Couverture des contraintes** — La longueur, le ton, la langue, les sorties interdites et les cas limites sont-ils abordés ?
6. **Efficacité des tokens** — Quelles phrases sont redondantes, superflues ou réitèrent ce que le modèle connaît déjà ?
7. **Opportunité de few-shot** — Un ou deux exemples réduiraient-ils l'ambiguïté plus qu'une instruction supplémentaire ?
8. **Chaîne de pensée** — Le modèle doit-il raisonner avant de répondre ? Est-il actuellement forcé de répondre immédiatement ?

**Règles de réécriture :**
- Préservez exactement l'intention de l'auteur — ne changez pas ce que l'invite demande
- Utilisez l'impératif deuxième personne (« Vous êtes », « Retournez », « Ne faites pas »)
- Mettez la contrainte la plus importante en premier, pas en dernier
- Si un placeholder de variable appartient à l'invite, utilisez la convention `{{double_braces}}`
- Supprimez tout remplissage : « S'il vous plaît », « Pourriez-vous », « J'aimerais que vous », « En tant qu'IA »
- Si une division système d'invite / message utilisateur a du sens, montrez les deux sections séparément

**Format de sortie :**

```
## Problèmes trouvés
- <une puce par problème, soyez précis>

## Invite réécrite
<l'invite améliorée, prête à coller>

## Ce qui a changé et pourquoi
<rationale brève pour chaque changement structurel>
```

Ne pas expliquer la théorie de l'ingénierie des invites. Montrez le travail, livrez la réécriture.

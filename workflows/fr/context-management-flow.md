# Flux de décision pour la gestion du contexte

Un processus de décision structuré pour choisir la bonne action à chaque limite de tour afin de préserver la qualité du contexte et le coût de la session. Le mauvais choix dégrade la qualité de la sortie ; le bon choix maintient la session efficace.

---

## Quand l'utiliser

Appliquez ce cadre quand vous remarquez l'un des signaux suivants :
- Les réponses deviennent plus lentes ou répétitives
- Claude perd la trace des décisions antérieures
- Le nombre de tokens approche d'un seuil où la compaction ou une nouvelle session devient rentable
- Terminer une tâche majeure et commencer quelque chose d'indépendant

---

## Les 5 options

### 1. Continuer

**Action par défaut.** Ne prenez aucune action spéciale — envoyez simplement le message suivant.

**Utilisez quand :**
- Claude est sur la bonne voie et progresse
- Le contexte est frais (directive approximative : moins de 200k tokens)
- Aucune tentative de mise en œuvre échouée ne s'est accumulée dans le contexte
- La tâche suivante est directement liée au travail actuel

**Implication de coût :** Chaque tour consomme des tokens proportionnels à la fenêtre de contexte complète. Continuer est bon marché par tour quand le contexte est petit ; cher quand il est grand.

---

### 2. Rembobiner (`Esc+Esc` ou `/rewind`)

Annulez le dernier tour ou plusieurs tours. Supprime la réponse de l'assistant mais conserve l'état de contexte antérieur — les lectures de fichiers, le raisonnement antérieur et le contexte chargé avant le mauvais tour restent.

**Utilisez quand :**
- Claude a suivi une mauvaise voie au dernier tour
- Vous voulez conserver l'exploration de codebase utile qui s'est produite plus tôt dans la session mais rejeter une tentative de mise en œuvre échouée
- L'erreur est récente et peu profonde — rembobiner un ou deux tours suffit à se rétablir

**Ce que ce n'est pas :** un moyen d'annuler les changements du système de fichiers. Rembobiner supprime les tours d'assistant du contexte mais n'annule pas les écritures que Claude a faites sur le disque. Revertez-les séparément si nécessaire.

**Idéal pour :** se rétablir d'une mauvaise approche sans perdre le contexte d'exploration utile qui l'a précédée.

---

### 3. Compaction dirigée (`/compact <hint>`)

Compressez le contexte actuel en un résumé, puis continuez. Le `<hint>` indique à l'étape de compaction ce qui importe — sans lui, la compaction peut perdre un contexte critique.

**Utilisez quand :**
- Le contexte devient long (directive approximative : 300k+ tokens sur un modèle de 1M tokens) mais vous êtes au milieu d'une tâche et voulez continuer dans la même session
- Vous avez accumulé beaucoup de raisonnement intermédiaire, de lectures de fichiers et de sortie de débogage qui ne sont plus nécessaires
- L'état de tâche principal est toujours actif et vous ne voulez pas informer une session fraîche

**Exemples d'hints :**
```
/compact keep auth refactor context, drop the test debugging
/compact preserve the data model decisions and API contract, drop the installation steps
/compact focus on the migration plan, nothing else matters now
```

**Sans hint :** la compaction utilise des heuristiques qui peuvent rejeter des décisions qui sont toujours pertinentes. Toujours passer un hint pour les sessions complexes.

**Seuil empirique :** la qualité du contexte sur le modèle de 1M commence à se dégrader notablement autour de 300–400k tokens pour les tâches nécessitant un rappel précis des décisions antérieures. En dessous de cela, continuez sauf si le coût est une préoccupation.

---

### 4. Session fraîche

Démarrez une nouvelle invocation `claude`. Aucun contexte reporté.

**Utilisez quand :**
- La tâche actuelle est terminée et vous commencez quelque chose d'indépendant
- La session a accumulé trop de impasses et de tentatives échouées — le bruit surpasse le contexte utile
- Vous voulez une ardoise vierge avec uniquement CLAUDE.md et les fichiers explicitement référencés comme contexte
- Le contexte est très volumineux et vous pouvez reconstituer l'état nécessaire plus rapidement en informant une nouvelle session que par compaction

**Ne pas utiliser :** pour continuer le travail au milieu d'une tâche sauf si la session actuelle est irrémédiablement corrompue. Le coût de rétablissement du contexte est non trivial pour les tâches complexes.

---

### 5. Subagent

Générez un appel d'outil Agent pour une sous-tâche limitée. Le subagent s'exécute avec sa propre fenêtre de contexte ; le raisonnement intermédiaire n'apparaît pas dans la session parent.

**Utilisez quand :**
- Vous avez besoin du résultat d'une opération spécifique (par exemple, "lire ces 10 fichiers et retourner un résumé") mais vous n'avez pas besoin des étapes intermédiaires dans votre contexte principal
- La tâche a une entrée clairement délimitée et une sortie bien définie
- Vous voulez garder le contexte de votre session principale propre et concentré

**Ce que ce n'est pas :** un remplacement pour une session complète quand la sous-tâche nécessite des allers-retours continus.

---

## Tableau de décision

| Signal | Action recommandée |
|---|---|
| Le dernier tour a échoué, le reste de la session est bon | Rembobiner |
| Contexte > 300k tokens, au milieu d'une tâche | `/compact <hint>` |
| Contexte > 300k tokens, tâche terminée | Session fraîche |
| Commencer une tâche indépendante | Session fraîche |
| Besoin de résultat de sous-tâche isolée | Subagent |
| Aucun des cas ci-dessus | Continuer |

---

## Implications de coût

- **Continuer** — le moins cher par tour quand le contexte est petit ; le plus cher quand le contexte est grand (chaque tour renvoie la fenêtre complète)
- **Compacter** — un tour de compaction coûteux, puis des tours moins chers sur le contexte compressé ; rentable quand il vous reste 5+ tours
- **Rembobiner** — gratuit ; supprime simplement le contexte de la mémoire
- **Session fraîche** — coût de transfert zéro ; vous ne payez que pour ce que vous chargez explicitement
- **Subagent** — coût isolé ; la session parent n'est pas facturée pour le contexte du subagent

---

## Quand ne PAS compacter

- Session de débogage au milieu où la trace d'erreur et l'hypothèse antérieure sont toujours pertinentes — la compaction peut les résumer en ambiguïté
- Quand vous êtes sur le point de terminer la tâche de toute façon (1–2 tours restants) — ne vaut pas la peine de frais de compaction
- Quand le hint devrait être si détaillé que l'écriture prend plus de temps que d'informer une session fraîche

---

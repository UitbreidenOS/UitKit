# RPI — Recherche, Plan, Implémenter

Le flux de travail RPI est un processus multi-agent en 3 phases pour le développement de fonctionnalités. Chaque phase a des agents définis, un artefact de sortie concret, et une porte qui doit passer avant la phase suivante. L'objectif est d'éliminer les deux causes les plus courantes d'effort d'ingénierie gaspillé : construire la mauvaise chose (recherche ignorée) et la construire mal (planification ignorée).

---

## Quand utiliser RPI vs juste commencer à coder

**Utiliser RPI pour :**
- Les nouvelles fonctionnalités qui prendront plus d'une journée
- Les changements qui touchent plusieurs systèmes ou équipes
- Le travail dans une base de code non familière
- Les préoccupations transversales (authentification, mise en cache, observabilité) où une mauvaise architecture est chère à corriger

**Ignorer RPI pour :**
- Les correctifs d'urgence et la réponse aux incidents
- Les modifications de configuration sans impact logique
- Les tâches estimées sous 2 heures
- Les refactorisations pures dans un fichier bien compris

Le surcoût de RPI est environ 20–30% du temps total. Pour tout ce qui est moins de 2 heures, le surcoût dépasse le bénéfice.

---

## Structure des dossiers

```
rpi/
└── {feature-slug}/
    ├── RESEARCH.md        ← Sortie Phase 1
    ├── plan/
    │   ├── pm.md          ← Histoires utilisateur
    │   ├── ux.md          ← Flux utilisateur
    │   └── eng.md         ← Plan de mise en œuvre fichier par fichier
    ├── PLAN.md            ← Résumé Phase 2 (artefact porte)
    └── IMPLEMENT.md       ← Journal de décision Phase 3
```

Tous les artéfacts RPI vivent sous `rpi/{feature-slug}/`. Ne pas disperser les documents de recherche et de planification dans la base de code.

---

## Phase 1 : Recherche

### Agents

- **requirement-parser**: extrait les exigences fonctionnelles et non fonctionnelles de la demande de fonctionnalité, identifie les ambiguïtés, et produit une liste d'exigences structurée
- **codebase-explorer** (outil Explore): mappe les parties pertinentes de la base de code — modèles existants, points d'entrée, dépendances, fonctionnalités similaires déjà implémentées
- **product-manager**: examine la liste des exigences et les constatations de base de code, puis rend un verdict GO/NO-GO

### Ce qui est produit

`rpi/{feature-slug}/RESEARCH.md` — document structuré contenant :

```markdown
# Recherche : {Nom de la fonctionnalité}

## Exigences
### Fonctionnelles
- [liste]
### Non fonctionnelles
- [latence, sécurité, échelle, etc.]

## Ambiguïtés
- [questions ouvertes qui ont besoin de réponses avant la planification]

## Constatations de base de code
- [fichiers pertinents, modèles, abstractions existantes]
- [fonctionnalités similaires et comment elles ont été construites]
- [points potentiels de conflit]

## GO / NO-GO
**Verdict :** GO | NO-GO
**Justification :** [3–5 phrases]
**Bloquants (si NO-GO) :** [ce qui doit être résolu avant réévaluation]
```

### Ce qui fait un bon GO/NO-GO

L'agent PM évalue quatre dimensions :

| Dimension | Signal GO | Signal NO-GO |
|-----------|-----------|--------------|
| Besoin du marché | Besoin utilisateur clair, soutenu par des données ou une demande explicite | Besoin vague ou supposé |
| Faisabilité technique | Les modèles existants le soutiennent; pas de bloquants inconnus | Nécessite une tech pas encore validée |
| Clarté de portée | Les exigences sont spécifiques et délimitées | Portée ouverte ou en expansion |
| Coût des ressources | S'adapte à la capacité du sprint | Nécessite plus que la capacité disponible |

Un NO-GO n'est pas un rejet — c'est un arrêt. La section des bloquants définit ce qui le résout.

---

## Phase 2 : Plan

**Porte :** RESEARCH.md doit exister avec un verdict GO. Ne jamais planifier sans recherche. Ne jamais implémenter sans un plan.

### Agents

- **product-manager**: convertit les exigences en histoires utilisateur avec critères d'acceptation (`plan/pm.md`)
- **ux-agent**: mappe les flux utilisateur de bout en bout, identifie les cas limites, définit les états vides et les états d'erreur (`plan/ux.md`)
- **engineering-agent**: produit un plan de mise en œuvre fichier par fichier — chaque fichier qui sera créé ou modifié, dans l'ordre où les changements doivent se produire, avec une description de chaque changement (`plan/eng.md`)
- **cto-advisor**: examine le plan d'ingénierie pour la qualité architecturale, les préoccupations de scalabilité, et l'alignement avec les modèles existants — approuve ou demande une révision

### Structure de sortie

**`plan/pm.md`:**
```markdown
# Histoires utilisateur

## Histoires 1: {titre}
En tant que {rôle}, je veux {capacité} pour que {bénéfice}.

**Critères d'acceptation:**
- [ ] critère 1
- [ ] critère 2
```

**`plan/ux.md`:**
```markdown
# Flux utilisateur

## Chemin heureux
[flux étape par étape]

## Cas limites
- [état vide : ce que voit l'utilisateur]
- [état d'erreur : ce que voit l'utilisateur]
- [état de chargement]
```

**`plan/eng.md`:**
```markdown
# Plan d'ingénierie

## Fichiers à créer
1. `src/features/payments/charge.ts` — nouveau gestionnaire de charge implémentant l'interface X
2. `src/api/routes/payments.ts` — nouvel itinéraire, délègue au gestionnaire de charge

## Fichiers à modifier
3. `src/api/router.ts` — enregistrer le nouvel itinéraire de paiements
4. `src/types/index.ts` — ajouter les types ChargeRequest et ChargeResponse

## Ordre de mise en œuvre
Exécutez dans l'ordre listé. Le fichier 4 (types) avant les fichiers 1 et 2.

## Dépendances
- Nécessite : SDK Stripe déjà installé (vérifier en premier)
- Crée : aucune nouvelle dépendance externe
```

**`PLAN.md`** — un résumé d'une page consolid ant les trois documents de plan. L'approbation de l'advisor CTO va ici. Ceci est l'artefact porte.

### Règle porte

L'implémentation ne commence pas tant que `PLAN.md` n'existe pas et que l'advisor CTO l'a approuvé. Si l'advisor demande des changements, révisez `plan/eng.md` et régénérez `PLAN.md`. Pas d'exceptions — commencer l'implémentation avant que PLAN.md soit approuvé est la source principale du retraitement dans le développement de l'agent.

---

## Phase 3 : Implémenter

**Porte :** PLAN.md doit être approuvé.

### Comment suivre eng.md

Exécutez les changements dans l'ordre exact listé dans `plan/eng.md`. Ne pas réordonner en fonction de ce qui semble commode — l'ordre reflète le séquençage des dépendances et la stabilité de la construction à chaque étape.

Pour chaque fichier :
1. Lire la description dans eng.md
2. Implémenter le changement
3. Exécuter les tests pertinents
4. Cocher le fichier dans eng.md (marquer `[x]`)

### Porte du réviseur de code

Après avoir complété 3–5 fichiers (ou à une limite naturelle comme terminer une couche), spawner un agent réviseur de code pour vérifier le travail terminé par rapport aux critères d'acceptation dans pm.md et le plan d'ingénierie dans eng.md. Ne pas attendre la mise en œuvre complète pour réviser — trouver les problèmes tard est cher.

Le réviseur produit une simple passe/échoue avec commentaires spécifiques au niveau de la ligne. En cas d'échec, corriger avant de continuer.

### Journal de décision

`IMPLEMENT.md` capture les décisions prises lors de l'implémentation qui dévient du plan ou résolvent les ambiguïtés non traitées dans la planification :

```markdown
# Journal de mise en œuvre : {Nom de la fonctionnalité}

## Décisions

### [2026-05-23] Interface de gestionnaire de charge modifiée
Le plan spécifiait l'interface X. Lors de l'implémentation, a découvert que X entre en conflit avec le middleware de session existant.
Décision : interface utilisée Y à la place. Plan mis à jour plan/eng.md pour refléter le changement.

### [2026-05-23] Logique de réessai ajoutée non prévue
A découvert que le SDK Stripe lance des 503 intermittents. Ajout backoff exponentiel (3 tentatives).
Pas besoin de changement de plan — ceci est additif et dans la portée.
```

Les décisions qui changent la portée ou la conception doivent être signalées à l'agent d'ingénierie pour une révision de plan avant l'implémentation. Les décisions qui sont purement des détails d'implémentation vont dans IMPLEMENT.md sans nécessiter une mise à jour du plan.

---

## Adapter RPI pour Solo vs Équipe

| Phase | Solo | Équipe |
|-------|------|--------|
| Recherche | Exécuter requirement-parser + explorateur; ignorer PM si la fonctionnalité est la vôtre | Tous les agents; sortie agent PM examinée par un PM humain |
| Plan | Ignorer agent UX pour les fonctionnalités backend uniquement | Tous les agents; eng.md examiné par un deuxième ingénieur |
| Implémenter | Ingénieur unique suit eng.md | Assigner les fichiers aux ingénieurs par section eng.md; agent réviseur s'exécute après chaque section |

La règle centrale reste la même dans les deux cas : pas de saut de phases et pas de mise en œuvre sans un plan approuvé. Le développement solo n'est pas une raison pour ignorer la recherche — c'est la raison principale pour être plus discipliné à son sujet.

---

# Flux de travail de fonctionnalité RPI

Recherche, Plan, Implémente — un flux de travail à trois phases et multi-agents pour envoyer des fonctionnalités avec un contrôle rigoureux de la portée. Chaque phase produit un artefact concret et doit être terminée avant que la suivante ne commence.

---

## Quand l'utiliser

- Demandes de fonctionnalités où la surface d'action est unclear au démarrage
- Travail qui traverse plusieurs fichiers ou services
- Toute tâche où un mauvais plan est plus coûteux que le temps passé à planifier
- Situations où plusieurs perspectives (PM, UX, Ingénierie) devraient être réconciliées avant une seule ligne de code

---

## Phases

### Phase 1 — Recherche (`/rpi:research`)

**Entrée :** demande de fonctionnalité brute (une phrase à un paragraphe)

**Agents :**
- **Agent Explore** — lit le codebase existant pour les modèles pertinents à la demande : fonctionnalités similaires, modèles de données, formes API, abstractions existantes
- **Agent Recherche** — enquête sur toute dépendance externe : APIs tierces, bibliothèques, documentation, changements de rupture
- **Agent Chef de produit** — synthétise les conclusions d'exploration et de recherche en un document d'exigences structuré et émet une recommandation GO/NO-GO avec une justification explicite

**Porte :** La Phase 2 ne peut pas commencer jusqu'à ce que l'agent chef de produit ait émis une recommandation GO. Si NO-GO est retourné, la sortie explique pourquoi et suggère une demande révisée.

**Sortie :** `rpi/{feature-slug}/RESEARCH.md`

```markdown
# Recherche : {feature-slug}

## Exigences
[Liste structurée dérivée de la demande brute]

## Conclusions du codebase
[Modèles existants pertinents, points d'entrée, modèles]

## Conclusions externes
[APIs, bibliothèques, notes de compatibilité]

## Recommandation
GO / NO-GO

## Justification
[Pourquoi — spécifique, pas générique]
```

---

### Phase 2 — Plan (`/rpi:plan`)

**Pré-condition :** `rpi/{feature-slug}/RESEARCH.md` existe et contient une recommandation GO.

**Agents (exécutés en parallèle) :**
- **Agent PM** — écrit les user stories et critères d'acceptation à partir des exigences
- **Agent UX** — mappe le flux utilisateur, les cas limites, les états d'erreur et les considérations d'accessibilité
- **Agent Ingénierie** — produit une conception technique : fichiers à créer ou modifier, changements de modèle de données, contrat API, estimation de complexité

**Révision :**
- **Agent Conseiller CTO** — lit tous les trois artefacts et revise pour les préoccupations architecturales, la cohérence et les préoccupations transversales manquantes (authentification, observabilité, migrations). Retourne une liste de préoccupations non résolues si quelconques ; les agents parallèles les adressent avant que PLAN.md soit finalisé.

**Porte :** La Phase 3 ne peut pas commencer jusqu'à ce que PLAN.md soit écrit et que le conseiller CTO ait retourné aucune préoccupation non résolue.

**Sortie :**
- `rpi/{feature-slug}/plan/pm.md`
- `rpi/{feature-slug}/plan/ux.md`
- `rpi/{feature-slug}/plan/eng.md`
- `rpi/{feature-slug}/PLAN.md` (résumé consolidé, une page)

---

### Phase 3 — Implémente (`/rpi:implement`)

**Pré-condition :** `rpi/{feature-slug}/PLAN.md` existe.

**Processus :**
1. Lisez PLAN.md pour extraire la liste ordonnée des changements de fichiers du plan d'ingénierie
2. Mettez en œuvre un composant à la fois en suivant la séquence dans `eng.md`
3. Après chaque composant majeur (pas chaque fichier), déléguez à l'**agent examinateur de code** — il vérifie le composant contre les critères d'acceptation dans `pm.md` et la conception technique dans `eng.md`
4. L'examinateur approuve le composant ou retourne des demandes de changement spécifiques ; adressez toutes les demandes de changement avant de passer au composant suivant
5. À l'achèvement, écrivez le journal de décisions

**Sortie :** mise en œuvre fonctionnelle + `rpi/{feature-slug}/IMPLEMENT.md`

```markdown
# Journal de mise en œuvre : {feature-slug}

## Décisions
[Liste des décisions de mise en œuvre qui s'écartaient du plan, avec justification]

## Différé
[N'importe quoi explicitement différé à un suivi]

## Complété
[Liste de contrôle de composant final avec approbation de l'examinateur notée]
```

---

## Disposition de répertoire

```
rpi/
  {feature-slug}/
    RESEARCH.md
    PLAN.md
    IMPLEMENT.md
    plan/
      pm.md
      ux.md
      eng.md
```

---

## Exemple

```
Utilisateur : /rpi:research "ajouter l'export CSV à la table de commandes"

→ RESEARCH.md écrit, GO émis

Utilisateur : /rpi:plan

→ plan/pm.md, ux.md, eng.md écrits ; révision CTO passée ; PLAN.md écrit

Utilisateur : /rpi:implement

→ La mise en œuvre procède composant par composant avec des portes de révision de code
```

---

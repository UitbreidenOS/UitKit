# Flux de travail de réponse à incident

Flux de travail de bout en bout pour gérer un incident de production, de la détection au post-mortem.

## Quand utiliser

Utilisez ce flux de travail quand:
- Une alerte se déclenche indiquant un impact pour l'utilisateur
- Un client signale que quelque chose est cassé
- Un déploiement a causé un comportement inattendu
- Les taux d'erreur ou la latence dépassent les seuils SLO

## Phase 1: Détecter et déclarer (0-5 minutes)

**Étape 1 — Vérifier l'incident:**
```
Cela affecte-t-il vraiment les utilisateurs? Vérifiez:
- Tableau de bord du taux d'erreur (au-dessus de 1%?)
- Tableau de bord de latence (p99 au-dessus du SLO?)
- Rapports directs des utilisateurs via le support
- Résultats des moniteurs synthétiques
```

**Étape 2 — Classer la gravité:**
- **SEV1**: Panne complète du service ou perte de données. Tous les mains.
- **SEV2**: Dégradation importante (>25% des utilisateurs affectés). IC assigné.
- **SEV3**: Impact mineur, solution de contournement disponible. Gérer pendant les heures de travail.

**Étape 3 — Déclarer et communiquer:**
```
Publiez dans #incidents:
[SEV{N}] {Nom du service} — {description d'une ligne}
Impact: {qui et quoi est affecté}
IC: {votre nom}
Salle de guerre: {lien}
Prochaine mise à jour: {heure, max 30 min pour SEV1}
```

## Phase 2: Enquête (5-30 minutes)

**Posez ces questions dans l'ordre:**

1. Y a-t-il eu des changements récents? (déploiement, configuration, pic de trafic)
   ```bash
   git log --oneline -10  # commits récents
   # Vérifiez: journaux de déploiement, changements de drapeaux de fonctionnalité, changements de configuration
   ```

2. Quel est le rayon de destruction?
   - Quels utilisateurs sont affectés?
   - Quelles fonctionnalités/points de terminaison échouent?
   - Quelles dépendances sont impliquées?

3. Que montrent les logs?
   ```bash
   # Trouvez la première erreur
   # Vérifiez: messages d'erreur, traces de pile, timing
   ```

4. À quoi ressemblent les données?
   ```bash
   # Vérifiez: nombre de connexions DB, profondeur de la queue, taux de réussite du cache
   ```

**Hypothèses classées par probabilité:**
1. Déploiement récent (si déployé dans les 2 dernières heures)
2. Dépendance en amont (vérifier les pages de statut)
3. Pic de trafic ou problème de capacité
4. Corruption de données ou état inattendu
5. Défaillance de l'infrastructure

## Phase 3: Atténuer (chemin le plus rapide pour réduire l'impact pour l'utilisateur)

**Options par ordre de vitesse:**

1. **Rollback** (plus rapide si causé par un déploiement):
   ```bash
   # Rollback basé sur Git ou interrupteur d'arrêt du drapeau de fonctionnalité
   ```

2. **Désactiver la fonctionnalité** (drapeau de fonctionnalité):
   ```
   Définir feature.broken_thing = false
   ```

3. **Augmenter les ressources** (si problème de capacité):
   ```bash
   kubectl scale deployment api --replicas=10
   ```

4. **Appliquer un correctif urgent** (si rollback n'est pas possible):
   - Brancher à partir du tag qui était en production
   - Correctif minimal, révision accélérée
   - Déployer avec surveillance supplémentaire

**L'atténuation ne signifie pas la résolution.** L'atténuation réduit l'impact pour l'utilisateur; la résolution corrige la cause racine.

## Phase 4: Communiquer (en continu tout au long)

**Mise à jour client (pour SEV1/SEV2):**
```
Nous avons {brève description}. Notre équipe enquête activement.
Heure de détection: {heure}
Impact: {description orientée utilisateur}
Prochaine mise à jour: {15-30 min à partir de maintenant}
Page de statut: {lien}
```

**Mise à jour de résolution:**
```
[RÉSOLU] {Nom du service} — {heure résolue}
Durée: {X heures Y minutes}
Impact: {ce qui a été affecté}
Cause racine: {bref — post-mortem complet dans les 48 heures}
Statut: Tous les systèmes fonctionnent normalement.
```

## Phase 5: Résoudre et vérifier

**Avant de fermer l'incident:**
- [ ] Les taux d'erreur reviennent à la ligne de base normale
- [ ] La latence revient à la normale
- [ ] Aucun log anormal
- [ ] Les utilisateurs affectés peuvent accomplir le flux de travail impacté
- [ ] L'équipe d'astreinte est convaincue que le problème est résolu

## Phase 6: Post-mortem (dans les 48 heures pour SEV1/SEV2)

**Document post-mortem:**
1. **Résumé**: Qu'est-ce qui s'est passé, combien de temps, quel a été l'impact
2. **Timeline**: Minute par minute de la détection à la résolution
3. **Cause racine**: La véritable cause sous-jacente (pas le symptôme)
4. **Facteurs contributifs**: Ce qui a aggravé cela ou a rendu la détection/correction plus difficile
5. **Ce qui a bien fonctionné**: Vitesse de détection, communication, outils qui ont aidé
6. **Ce qui n'a pas fonctionné**: Lacunes dans la surveillance, détection lente, défaillances de communication
7. **Éléments d'action**: Améliorations spécifiques, attribuées au propriétaire, limitées dans le temps

**Culture sans blame:**
- Les post-mortems identifient les défaillances du système, pas les défaillances individuelles
- L'objectif est de prévenir la récurrence, pas d'assigner la culpabilité
- Publiez les post-mortems largement — toute l'entreprise apprend

## Compétences connexes

- `/runbook-generator` — créer des runbooks pour les modes de défaillance spécifiques
- `/slo-architect` — concevoir des SLO et des alertes de taux de combustion
- `/observability-designer` — instrumenter votre système pour détecter plus rapidement
- `/agents/roles/incident-commander` — assistant IA pour la coordination de la salle de guerre

---

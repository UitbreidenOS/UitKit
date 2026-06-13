# Journée de jeu d'ingénierie du chaos

Exercice d'injection de défaillance structuré qui fait passer l'ingénierie du chaos de la phase ad hoc à une pratique répétable à l'échelle de l'équipe avec des phases définies, des contrôles de rayon de souffle et une rétrospective sans blâme.

---

## Quand utiliser

- Avant un grand lancement pour tester les modes de défaillance inconnus
- Après un incident révélant un chemin de dépendance non testé
- Selon un calendrier trimestriel pour maintenir les compétences de récupération des défaillances
- Lorsque les exigences de fiabilité augmentent (nouveau SLO, nouveau niveau client)

Ne pas lancer sur la production sans un chemin de restauration testé. Ne pas lancer pendant le trafic de pointe à moins que l'hypothèse ne l'exige spécifiquement.

---

## Phases / Étapes

### Aperçu des phases

```
Pré-jeu → Injecter → Observer → Restaurer → Rétrospective
```

Chaque phase a une porte d'entrée définie et un artéfact de sortie. Ne pas ignorer les phases même si l'expérience semble « sûre ».

---

### Phase 1 : Pré-jeu

**Porte :** la journée de jeu ne commence pas jusqu'à ce que tous ces points soient vrais.

- [ ] Gel des changements actif — aucun déploiement pendant la fenêtre d'exercice
- [ ] Tous les participants informés de l'hypothèse et de leur rôle d'observation
- [ ] Procédure de restauration testée et documentée (déclenchement automatisé défini)
- [ ] Baseline des métriques capturée (taux d'erreur, latence p50/p99, débit) pour les 30 minutes avant injection
- [ ] Emplacement du runbook partagé dans le canal d'équipe

**Modèle de briefing :**

```
Journée de jeu : [nom de l'expérience]
Date/heure : [ISO timestamp]
Facilitateur : [nom]
Observateurs : [noms + ce qu'ils regardent]

Hypothèse : [voir modèle ci-dessous]
Rayon de souffle initial : [1 instance / 1 % du trafic / etc.]
Déclenchement de restauration : taux d'erreur > X% pendant Y minutes OU appel manuel
Limite de durée : [minutes max avant restauration obligatoire]
```

---

### Modèle d'hypothèse

Chaque journée de jeu s'exécute sur exactement une hypothèse. Aucune session multi-hypothèse — elles contaminent les observations.

```
État stable :  [à quoi ressemble la normale — métrique + valeur]
Type de défaillance :  [ce que vous injectez — latence réseau / suppression de pod / stress CPU / etc.]
Impact attendu : [ce que vous prédisez se passera — « la latence p99 passe à ~800ms, pas d'erreurs »]
Critères de succès : [à quoi ressemble un résultat réussi — « le système récupère dans les 60s de restauration sans perte de données »]
```

**Exemple :**
```
État stable :  API p99 < 200ms, taux d'erreur < 0,1%
Type de défaillance :  Ajouter 500ms de latence réseau entre API et base de données (Toxiproxy)
Impact attendu : p99 monte à ~700ms; taux d'erreur reste < 0,5% en raison de la mise en mémoire tampon du pool de connexions
Critères de succès : La suppression du proxy restaure p99 < 200ms dans les 30 secondes
```

Si l'impact attendu correspond au comportement observé : le système est résilient tel que conçu.
Si le comportement diverge : vous avez découvert soit une dépendance cachée, soit un mauvais modèle mental — les deux sont des résultats précieux.

---

### Phase 2 : Injecter

Commencez au plus petit rayon de souffle. Escaladez uniquement si le système gère le rayon actuel sans dépasser les déclencheurs de restauration.

**Étapes du rayon de souffle :**

| Étape | Portée | Attendre avant d'escalader |
|-------|-------|------------------------|
| 1 | 1 instance (1-5% de la flotte) | 5 minutes |
| 2 | 5% du trafic (changement de trafic ou drapeau de fonctionnalité) | 10 minutes |
| 3 | 25% du trafic | 15 minutes |
| 4 | Trafic complet / toutes les instances | Décision du facilitateur |

Ne jamais ignorer de l'étape 1 à l'étape 4. Les étapes intermédiaires révèlent si la défaillance est localisée ou systémique.

**Commandes d'outils :**

```bash
# AWS FIS — démarrer l'expérience
aws fis start-experiment --experiment-template-id EXTabc123

# Toxiproxy — ajouter une latence entre app et BD
toxiproxy-cli toxic add -t latency -a latency=500 -a jitter=50 db_connection

# tc netem — perte de paquets sur une interface réseau (nécessite root)
tc qdisc add dev eth0 root netem loss 5%

# Supprimer tc netem
tc qdisc del dev eth0 root
```

---

### Phase 3 : Observer

**Ne pas intervenir pendant l'observation.** Le but est de voir comment le système se comporte réellement, pas comment il se comporte quand un ingénieur le chouchoute activement. Les ingénieurs ne doivent regarder que les métriques et journaux.

Affectations d'observateurs :
- Une personne regarde les tableaux de bord de taux d'erreur et latence
- Une personne regarde les journaux pour les types d'erreur inattendus
- Une personne regarde les services dépendants (impact en aval)
- Le facilitateur suit le temps et documente les observations en temps réel

**Format du journal d'observation (ajouter au runbook) :**
```
[14:32:15] Rayon de souffle : étape 1 (1 instance)
[14:32:15] Métriques : error_rate=0,08%, p99=210ms — dans la baseline
[14:37:00] Escalader à l'étape 2 (5% du trafic)
[14:37:30] Métriques : error_rate=0,12%, p99=650ms — au-dessus de la baseline, sous déclenchement de restauration
[14:42:00] Escalader à l'étape 3 (25% du trafic)
[14:42:15] Métriques : error_rate=1,8% — approche du déclenchement de restauration (2%)
[14:43:30] error_rate=2,3% — déclenchement de restauration atteint
```

**Règle « ne pas intervenir trop vite » :** le déclenchement de restauration est défini à l'avance. Ne pas restaurer manuellement avant que le déclenchement ne se déclenche à moins qu'il y ait une urgence en dehors de la portée de l'hypothèse. Intervenir plus tôt invalide l'observation.

---

### Phase 4 : Restauration

**Déclenchement automatisé :**

```yaml
# Règle d'alerte Prometheus qui déclenche la restauration
- alert: GameDayRollbackTrigger
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[2m]))
    / sum(rate(http_requests_total[2m])) > 0.02
  for: 2m
  labels:
    severity: game_day_rollback
  annotations:
    summary: "Déclenchement de restauration de la journée de jeu — taux d'erreur {{ $value }}"
```

Quand l'alerte se déclenche, le script de restauration automatisée s'exécute :
```bash
#!/bin/bash
# .claude/game-day-rollback.sh
toxiproxy-cli toxic remove db_connection --toxicName latency || true
aws fis stop-experiment --id "$FIS_EXPERIMENT_ID" || true
tc qdisc del dev eth0 root 2>/dev/null || true
echo "Restauration complète à $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .claude/game-day-log.txt
```

**Restauration manuelle :** le facilitateur appelle la restauration si le déclenchement automatisé ne se déclenche pas mais que la situation est clairement dangereuse (défaillances en cascade atteignant des services hors de portée, impact client en dehors du rayon de souffle, etc.).

Après restauration : vérifier que le système revient à l'état stable avant de terminer l'exercice. Ne pas déclarer le succès jusqu'à ce que les métriques de baseline soient restaurées.

---

### Phase 5 : Rétrospective

La rétrospective a lieu dans les 24 heures tandis que les observations sont fraîches. Format : sans blâme, axé sur le comportement du système, pas sur les actions individuelles.

**IMTD — Intention, Erreur, Déclencheur, Découverte :**
- **Intention :** ce que l'hypothèse a prédit
- **Erreur :** où le système ou le modèle mental était faux
- **Déclencheur :** quelle condition a causé la déviation
- **Découverte :** ce que nous savons maintenant que nous ne savions pas avant

Ne pas faire une rétrospective orientée blâme. « L'ingénieur n'a pas remarqué que le taux d'erreur montait » n'est pas une constatation IMTD. « L'alerte de taux d'erreur a une fenêtre de 5 minutes — trop lente pour attraper ce mode de défaillance » l'est.

**Artéfacts de sortie de rétrospective :**
- Runbook mis à jour avec observations réelles enregistrées
- Liste des constatations (chacune comme un ticket)
- Liste des expériences de suivi si l'hypothèse a été validée et le système a tenu
- Décision : cela deviendra-t-il une expérience récurrente ? Quel rythme ?

---

### Assistant de la journée de jeu Claude Code

Claude Code agit comme assistant en temps réel pendant la journée de jeu : lit le runbook, suit l'hypothèse, enregistre les observations horodatées, et génère le rapport de rétrospective.

**Configuration :**

1. Placez le runbook à `.claude/game-day-runbook.md`
2. Démarrez la session Claude Code avec :
```
Lisez .claude/game-day-runbook.md. Vous êtes l'assistant de la journée de jeu pour cette session.
Suivez les observations que je vous donne avec des horodatages. Quand je dis « retro », générez le rapport de rétrospective IMTD basé sur toutes les observations.
```

**Pendant la journée de jeu :**
- Alimentez les observations comme vous les enregistrez : `"[14:42:15] error_rate a atteint 2,3%, déclenchement de restauration déclenché"`
- Claude maintient le journal en cours et signale si le temps de résidence du rayon de souffle n'a pas été respecté
- À la fin : `"retro"` génère la rétrospective complète avec toutes les observations enregistrées formatées dans le modèle IMTD

---

## Exemple

**Service :** API de paiement  
**Hypothèse :** tuer le cache de session Redis force le basculement vers la base de données sans erreurs visibles pour l'utilisateur

```
État stable :  taux de succès de paiement 99,8%, p99 < 300ms
Type de défaillance :  Tuer toutes les instances Redis (docker stop redis)
Impact attendu : p99 augmente à ~800ms (basculement BD), taux de succès se maintient
Critères de succès : Aucun échec de paiement; p99 récupère dans les 60s de redémarrage de Redis
```

**Journal de la journée de jeu :**

```
[Pré-jeu] Baseline capturée : succès=99,81%, p99=287ms
[10:05:00] Étape 1: 1 sur 3 instances Redis tuées
[10:10:00] Métriques : succès=99,80%, p99=310ms — tient bon
[10:15:00] Étape 2: les 3 instances Redis tuées
[10:15:30] Métriques : succès=97,2%, p99=4200ms — INATTENDU
[10:17:00] Déclenchement de restauration atteint (error_rate > 2%)
[10:17:00] Restauration automatisée : Redis redémarré
[10:18:45] Métriques revenues à la baseline
```

**Constatation :** l'application n'a pas de logique de basculement — elle lance des erreurs 500 plutôt que de basculer vers la base de données. Le modèle mental était faux. Un ticket a été ouvert pour implémenter le basculement. L'hypothèse est programmée pour être re-lancée après correction.

---

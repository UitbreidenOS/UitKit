---
name: migration-architect
description: "Planification de migration sans temps d'arrêt : migrations de schéma de base de données (expand-contract), cutovers d'infrastructure, remplacements de services — plans phasés, stratégies de rétablissement et portes de validation"
---

# Compétence Architecte de Migration

## Quand l'activer
- Planifier une migration de schéma de base de données sans temps d'arrêt
- Concevoir un cutover de service ou un remplacement de système
- Construire un plan de migration phasé avec chemins de rétablissement explicites
- Valider la compatibilité des données avant et après la migration
- Migration d'infrastructure (fournisseur cloud, hébergement, moteur de base de données)

## Quand NE PAS l'utiliser
- Mises à niveau npm/pip des dépendances — utiliser la compétence dependency-auditor
- Conception d'architecture cloud sans contexte de migration — utiliser les compétences cloud architect
- Conception du pipeline ETL — utiliser les compétences data-ml

## Instructions

### Migration de schéma de base de données (expand-contract)

```
Planifier une migration de schéma de base de données sans temps d'arrêt.

Base de données : [PostgreSQL / MySQL / MongoDB / autre]
Modification : [décrire — ajouter colonne / renommer colonne / changer type / diviser table / ajouter FK]
Trafic actuel : [requêtes/seconde, charge de pointe]
Exigence de rétablissement : [doit pouvoir rétablir / avant-seulement acceptable]

Le modèle expand-contract (sans temps d'arrêt, tout conforme à la production) :

PHASE 1 — EXPAND (déployer d'abord, rétrocompatible) :
Ajouter une nouvelle structure parallèlement à l'existante :
- Nouvelle colonne avec défaut NULL (pas NOT NULL — cela verrouillerait la table)
- Nouvelle table parallèle à l'ancienne
- Nouvel index (CREATE INDEX CONCURRENTLY — pas de verrou de table dans PostgreSQL)

PHASE 2 — DUAL WRITE (les deux anciens et nouveaux schémas) :
L'application écrit sur les deux anciennes et nouvelles structures simultanément.
Les lectures utilisent toujours l'ancienne structure (rétablissement : arrêter d'écrire vers le nouveau).

PHASE 3 — MIGRATE READS :
Basculer les lectures de l'application vers la nouvelle structure.
L'ancienne structure reçoit toujours les écritures (permet le rétablissement).

PHASE 4 — CONTRACT (supprimer l'ancienne structure) :
Supprimer la colonne/table/index ancienne une fois 100% confirmée stable.
C'est irréversible — confirmer abondamment avant exécution.

Générer le plan de migration pour mon changement de schéma spécifique.
```

### Cutover de remplacement de service

```
Planifier un remplacement de service sans temps d'arrêt.

Service ancien : [décrire — monolithe / API legacy / dépendance tiers]
Service nouveau : [décrire]
Trafic : [X requêtes/seconde, X utilisateurs affectés]
Fenêtre de rétablissement : [combien de temps pouvons-nous rétablir si quelque chose se passe mal ?]

Modèle Strangler Fig (le plus sûr pour le remplacement de service) :

Phase 1 — Déployer le nouveau service parallèlement à l'ancien (pas de trafic encore) :
- Nouveau service déployé à l'environnement de production
- Test interne uniquement (personnel, comptes de test internes)
- Parité de fonctionnalité validée par rapport au contrat API du service ancien

Phase 2 — Mode fantôme (les deux services reçoivent le trafic) :
- Toutes les requêtes vont au service ancien (trafic de production)
- Le nouveau service reçoit une copie de toutes les requêtes (trafic fantôme)
- Comparer les réponses : ancien vs nouveau — identifier les écarts
- Corriger les écarts dans le nouveau service sans affecter les utilisateurs

Phase 3 — Canary (petit % vers le nouveau service) :
- 1% → 5% → 10% → 25% → 50% → 100% sur jours/semaines
- Surveiller à chaque incrément : taux d'erreur, latence, métriques métier
- Déclencheur de rétablissement : si le taux d'erreur augmente > [seuil] à n'importe quelle étape canary

Phase 4 — Cutover complet :
- 100% trafic vers le nouveau service
- Ancien service gardé en réserve pour [X jours] (pas encore décommissionné)
- Rétablissement : basculer le répartiteur de charge vers le ancien service si nécessaire

Phase 5 — Décommissionnement :
- Ancien service décommissionné après [fenêtre de stabilité]
- Données/état du service ancien migrés ou archivés

Générer le plan de cutover pour mes services spécifiques.
```

### Migration d'infrastructure cloud

```
Planifier une migration cloud pour [charge de travail].

Source : [AWS / Azure / GCP / on-prem / co-location]
Cible : [AWS / Azure / GCP]
Charges de travail : [décrire — application web / base de données / stockage / tout]
Volume de données : [X GB / TB]
Tolérance de temps d'arrêt : [sans temps d'arrêt / fenêtre de maintenance de X heures]

Phases de migration :

PHASE 1 — ÉVALUER (2-4 semaines) :
□ Inventorier toutes les charges de travail, dépendances et volumes de données
□ Identifier les bloqueurs de migration (formats propriétaires, licences, contraintes de conformité)
□ Prioriser : commencer par services sans état (plus facile), finir par bases de données (plus difficile)
□ Documenter l'état actuel : diagramme d'architecture, topologie réseau, enregistrements DNS

PHASE 2 — PILOT (2-4 semaines) :
□ Migrer 1 service non-critique vers la cible cloud
□ Valider performance, coût et motifs opérationnels
□ Construire et tester les pipelines CI/CD pour la cible cloud
□ Former l'équipe sur les outils cloud cible

PHASE 3 — LIFT AND SHIFT (par charge de travail) :
Pour chaque service sans état :
□ Conteneuriser si pas déjà (Docker)
□ Déployer vers cloud cible en parallèle (pas remplacer source encore)
□ Exécuter tests d'acceptation
□ Cutover DNS (bas TTL d'abord, puis basculer)
□ Surveiller pour [X jours] avant décommissionnement source

PHASE 4 — MIGRATION DE BASE DE DONNÉES :
□ Configurer réplication depuis la source vers la base de données cible (synchronisation continue)
□ Valider l'intégrité des données (comptages de lignes, checksums, vérification de requêtes)
□ Cutover d'application : pointer l'app vers la nouvelle base de données
□ Arrêter la réplication
□ Ancienne base de données conservée comme sauvegarde pour [X jours]

PHASE 5 — DÉCOMMISSIONNEMENT :
□ Toutes les charges de travail validées sur le cloud cible
□ Infrastructure cloud ancienne terminée
□ Enregistrements DNS nettoyés
□ Compte cloud ancien fermé

Générer le plan de migration phasé pour mes charges de travail spécifiques.
```

### Stratégie de rétablissement

```
Concevoir une stratégie de rétablissement pour [migration].

Type de migration : [changement de schéma / cutover de service / migration cloud / migration de données]
Phase actuelle : [quelle phase est en cours ou planifiée]
Temps d'arrêt maximal acceptable : [sans temps d'arrêt / X minutes / X heures]
Risque de modification de données : [données peuvent être mutées / données en lecture seule / les deux]

Stratégie de rétablissement par type de migration :

MIGRATIONS DE SCHÉMA :
Phase 1 (expand seulement) : rétablissement = supprimer la colonne/index/table nouvelle. Sûr, instantané.
Phase 2 (dual write) : rétablissement = arrêter d'écrire vers nouvelle structure, supprimer nouvelle. Sûr.
Phase 3 (lectures basculées) : rétablissement = basculer les lectures vers l'ancienne. Rapide.
Phase 4 (contract) : IRRÉVERSIBLE. Ne jamais exécuter sans 48h d'observation de stabilité.

Conditions de déclenchement du rétablissement (décider avant le début de la migration) :
- Taux d'erreur augmente > [X%] au-dessus de la base de référence
- Latence P99 augmente > [X]% au-dessus de la base de référence
- Métrique métier (conversions, revenus) chute > [X%]
- Toute violation d'intégrité des données détectée

CUTOVERS DE SERVICE :
Mécanisme de rétablissement : basculement de poids du répartiteur de charge (secondes pour exécution)
Requis : garder le ancien service en cours d'exécution en parallèle pour [minimum X jours]
Point de décision pour décommissionnement : [jamais avant 7 jours de trafic stable à 100%]

Générer la stratégie de rétablissement et le carnet d'exécution pour ma migration.
```

## Exemple

**Utilisateur :** Nous devons renommer une colonne dans notre table de commandes PostgreSQL (user_id → customer_id). 2M lignes, 500 req/sec. Sans temps d'arrêt. Comment ?

**Plan de migration de Claude :**

4 phases expand-contract, temps écoulé total : ~3-5 jours d'opération parallèle, 15 minutes de travail réel de base de données répartis sur 4 déploiements.

**Phase 1 — Ajouter nouvelle colonne (Déployer 1, 5 minutes) :**
```sql
ALTER TABLE orders ADD COLUMN customer_id BIGINT;
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
```

**Phase 2 — Remplir les lignes existantes (exécuter hors-pointe, pas de verrou) :**
```sql
-- Mise à jour par lot : 10K lignes à la fois avec petit délai pour éviter pic I/O
DO $$
DECLARE batch_size INT := 10000;
BEGIN
  LOOP
    UPDATE orders SET customer_id = user_id
    WHERE customer_id IS NULL
    LIMIT batch_size;
    EXIT WHEN NOT FOUND;
    PERFORM pg_sleep(0.01);
  END LOOP;
END $$;
```

**Phase 3 — Dual write (Déployer 2) :**
L'application écrit les deux `user_id` ET `customer_id`. Les lectures utilisent toujours `user_id`.
Exécuter pendant minimum 48 heures. Confirmer que `customer_id` est complètement remplie et cohérente.

**Phase 4 — Basculer les lectures (Déployer 3) :**
L'application lit maintenant depuis `customer_id`. Écrit toujours les deux.
Surveiller pendant 48 heures. Rétablissement : basculer les lectures vers `user_id` (rapide, sûr).

**Phase 5 — Supprimer l'ancienne colonne (Déployer 4, après 1 semaine stable) :**
```sql
ALTER TABLE orders DROP COLUMN user_id;
DROP INDEX idx_orders_user_id;
```

**Garantie sans temps d'arrêt :** Chaque étape est un déploiement rétrocompatible. Rétablissement à n'importe quelle étape avant Phase 5 = basculer le déploiement. Après Phase 5 = avant-seulement.

---

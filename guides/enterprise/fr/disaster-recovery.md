# Plan de Récupération d'Urgence Entreprise

## Objectif

Ce guide établit les objectifs de récupération, les stratégies de sauvegarde, les procédures de restauration et les protocoles de test de résilience pour minimiser l'impact commercial des défaillances système, des pertes de données ou des interruptions de service.

---

## Objectifs de Récupération

### RPO & RTO par Niveau de Service

| Niveau de Service | RTO (Temps de Récupération) | RPO (Point de Récupération) | Priorité |
|---|---|---|---|
| **Critique** | ≤ 1 heure | ≤ 5 minutes | P0 |
| **Élevée** | ≤ 4 heures | ≤ 15 minutes | P1 |
| **Moyen** | ≤ 24 heures | ≤ 1 heure | P2 |
| **Faible** | ≤ 72 heures | ≤ 6 heures | P3 |

**Services Critiques:**
- Systèmes d'authentification et d'autorisation
- Couche de persistance des données (base de données primaire)
- Streaming d'événements en temps réel
- Passerelle API client

**Priorité Élevée:**
- Pipeline d'analyse
- Gestion de configuration
- Surveillance et alertes
- Systèmes de documentation

---

## Stratégie de Sauvegarde

### 1. Sauvegardes Complètes du Système

**Fréquence:** Quotidienne (00:00 UTC)  
**Rétention:** 30 jours sur site, 90 jours hors site  
**Cible:** Tous les magasins de données persistants

**Procédure:**
```bash
# Automatisée via orchestrateur de sauvegarde
backup-system \
  --full \
  --encrypt \
  --verify-checksum \
  --replicate-to-cold-storage
```

**Vérification:**
- Sommes de contrôle validées immédiatement après sauvegarde
- Test de restauration effectué sur 10% des sauvegardes mensuellement
- Alerte si une sauvegarde > 30% de la taille de référence

### 2. Sauvegardes Incrémentielles

**Fréquence:** Tous les 6 heures  
**Rétention:** 7 jours sur site  
**Chaîne:** Liée à la sauvegarde complète la plus récente

**Procédure:**
```bash
backup-system \
  --incremental \
  --delta-only \
  --since-last-full
```

### 3. Sauvegardes de Base de Données

**PostgreSQL:**
- Archivage continu WAL (Write-Ahead Logs) vers S3
- Sauvegarde complète quotidienne + incrémentale horaire
- Récupération point-in-temps (PITR) disponible pendant 30 jours
- Surveillance du décalage de réplication: alerte si > 10 secondes

**Redis/Cache:**
- Snapshots RDB toutes les heures
- AOF (Append-Only File) activé
- Répliqué à instance de secours en AZ distinct

**Elasticsearch:**
- Référentiel snapshot en S3
- Snapshots quotidiens avec rétention 30 jours
- Snapshots consultables pour récupération rapide

### 4. Sauvegardes de Configuration et Secrets

**Stockage:** Coffre-fort chiffré (AWS Secrets Manager, HashiCorp Vault)  
**Fréquence:** Synchronisation en temps réel + snapshots horaires  
**Accès:** Protégé par MFA, journalisé audit  
**Rotation:** Secrets tournés automatiquement tous les 90 jours

---

## Procédures de Restauration

### Niveau 1: Restauration de Service Unique (RTO: 15 min)

**Déclencheur:** Les vérifications de santé du service échouent pendant > 2 minutes  
**Manuel:** `restore-service.sh`

```bash
#!/bin/bash
SERVICE=$1
BACKUP_TIME=${2:-latest}

# Étape 1: Arrêter le service défaillant
systemctl stop $SERVICE

# Étape 2: Vérifier la disponibilité de la sauvegarde
aws s3 ls s3://backups/$SERVICE/$BACKUP_TIME/ || exit 1

# Étape 3: Télécharger et restaurer à partir de sauvegarde
aws s3 sync s3://backups/$SERVICE/$BACKUP_TIME/ /var/data/$SERVICE/
chmod 750 /var/data/$SERVICE/*
chown service:service /var/data/$SERVICE -R

# Étape 4: Valider l'intégrité des données
restore-validate --service $SERVICE --data-path /var/data/$SERVICE/

# Étape 5: Démarrer le service avec vérifications de santé
systemctl start $SERVICE
sleep 5
systemctl status $SERVICE || exit 1

# Étape 6: Notifier l'équipe en ligne
alert-oncall --severity critical --message "$SERVICE restauré à partir de $BACKUP_TIME"
```

**Checklist de Validation:**
- [ ] Service démarre avec succès
- [ ] Le point de terminaison de vérification de santé répond (HTTP 200)
- [ ] Connectivité DB confirmée
- [ ] Aucun journal d'erreurs pendant les 60 premières secondes

---

### Niveau 2: Restauration de Base de Données (RTO: 30 min)

**Déclencheur:** Corruption de données, suppression accidentelle, erreurs irrécupérables  
**Manuel:** `restore-database.sh`

```bash
#!/bin/bash
DB_NAME=$1
RESTORE_POINT=${2:-latest}

# Étape 1: Acquérir un verrou exclusif (prévenir les écritures)
psql -h $DB_HOST -U postgres -c "ALTER DATABASE $DB_NAME SET default_transaction_isolation = 'serializable';"

# Étape 2: Identifier la chronologie de restauration
# Pour PITR: restore-point = "2024-06-22 14:30:00"
# Pour sauvegarde: restore-point = "backup-full-20240622"

if [[ $RESTORE_POINT == backup-* ]]; then
    # Restauration sauvegarde complète
    pg_basebackup -h $DB_HOST -U backup_user -D /var/lib/postgresql/recovery -v -P
    echo "recovery_target_timeline = 'latest'" >> /var/lib/postgresql/recovery/recovery.conf
else
    # Récupération point-in-temps
    echo "recovery_target_time = '$RESTORE_POINT'" >> /var/lib/postgresql/recovery/recovery.conf
fi

# Étape 3: Effectuer la restauration
systemctl stop postgresql
rm -rf /var/lib/postgresql/main
mv /var/lib/postgresql/recovery /var/lib/postgresql/main
chown postgres:postgres /var/lib/postgresql/main -R

# Étape 4: Démarrer DB en mode lecture seule
systemctl start postgresql
pg_isready -h localhost || exit 1

# Étape 5: Exécuter les vérifications d'intégrité
psql -h localhost -U postgres -d $DB_NAME -c "ANALYZE;"
psql -h localhost -U postgres -d $DB_NAME -c "SELECT COUNT(*) FROM pg_stat_user_tables;" > /tmp/table_counts.txt

# Étape 6: Vérifier contre snapshot
diff /tmp/table_counts.txt /backups/verify/table_counts_$RESTORE_POINT.txt || echo "AVERTISSEMENT: Les nombres de tables diffèrent"

# Étape 7: Activer les écritures (promouvoir)
psql -h localhost -U postgres -c "ALTER DATABASE $DB_NAME RESET default_transaction_isolation;"
systemctl restart postgresql

echo "Base de données $DB_NAME restaurée à $RESTORE_POINT"
```

**Checklist de Validation:**
- [ ] DB démarre correctement
- [ ] Aucune corruption détectée (scan pg_filedump)
- [ ] Réplication se rattrape en moins de 5 minutes
- [ ] Les tests d'application passent sur DB restaurée
- [ ] L'horodatage des données correspond au point de restauration attendu

---

### Niveau 3: Panne Multi-Service (RTO: 2 heures)

**Déclencheur:** Plusieurs services critiques en panne, défaillance du centre de données primaire  
**Manuel:** `regional-failover.sh`

```bash
#!/bin/bash
set -e

INCIDENT_ID=$(uuidgen)
DR_REGION=${1:-us-west-2}
RESTORE_TIME=${2:-$(date -u +'%Y-%m-%d %H:%M:%S' -d '15 minutes ago')}

echo "=== BASCULEMENT RÉGIONAL DÉMARRÉ ===" | tee /tmp/failover_$INCIDENT_ID.log
echo "ID incident: $INCIDENT_ID"
echo "Région cible: $DR_REGION"
echo "Point de restauration: $RESTORE_TIME"

# Phase 1: Préparer l'infrastructure DR (10 min)
echo "Phase 1: Mise en service de l'infrastructure DR..."
terraform apply -var="region=$DR_REGION" -var="incident_id=$INCIDENT_ID" -auto-approve

# Phase 2: Restaurer toutes les bases de données en parallèle (15 min)
echo "Phase 2: Restauration des bases de données..."
for db in primary analytics events config; do
    (
        restore-database $db "$RESTORE_TIME"
        echo "✓ $db restaurée"
    ) &
done
wait

# Phase 3: Restaurer l'état d'application (10 min)
echo "Phase 3: Restauration de l'état d'application..."
aws s3 sync s3://backups/app-state/$RESTORE_TIME/ /var/app/state/

# Phase 4: Mettre à jour DNS vers région DR (5 min)
echo "Phase 4: Mise à jour des enregistrements DNS..."
update-dns \
  --zone-id $ZONE_ID \
  --records-from primary-region \
  --records-to $DR_REGION \
  --ttl 60

# Phase 5: Démarrer les services et valider (10 min)
echo "Phase 5: Démarrage des services..."
systemctl start claudient-app
sleep 30

# Phase 6: Exécuter les tests de fumée
echo "Phase 6: Exécution des tests de fumée..."
./tests/smoke-tests.sh || exit 1

echo "=== BASCULEMENT RÉGIONAL TERMINÉ ===" | tee -a /tmp/failover_$INCIDENT_ID.log
echo "Temps de récupération: $(elapsed_time)"
alert-oncall --severity critical --incident-id $INCIDENT_ID --message "Basculement terminé vers $DR_REGION"
```

**Checklist de Validation:**
- [ ] DNS mis à jour et propagé
- [ ] Tous les services sains dans région DR
- [ ] Tests de fumée passent
- [ ] Aucune perte de données détectée
- [ ] Décalage réplication < 1 minute
- [ ] Notifications clients envoyées

---

## Ingénierie du Chaos et Tests de Résilience

### Calendrier de Tests

| Type de Test | Fréquence | Durée | Portée |
|---|---|---|---|
| **Test de Restauration Sauvegarde** | Hebdomadaire (mer 14:00 UTC) | 30 min | Service unique |
| **Test PITR Base de Données** | Bi-hebdomadaire (2e & 4e lun) | 45 min | Copie production |
| **Exercice Basculement Régional** | Trimestriel | 2 heures | Système complet |
| **Chaos Monkey** | Quotidien (02:00-03:00 UTC) | 60 min | Nœuds canary |
| **Test de Partition Réseau** | Mensuel | 30 min | Connectivité multi-AZ |

### 1. Test de Restauration Sauvegarde

**Objectif:** Valider les procédures et l'automatisation de restauration  
**Fréquence:** Hebdomadaire mercredi 14:00 UTC  
**Durée:** 30 minutes

**Procédure de Test:**
```bash
#!/bin/bash
# Exécuter dans environnement non-production

TEST_DATE=$(date +%Y%m%d)
SERVICE=${1:-api-gateway}
BACKUP_AGE=${2:-1d}  # Sauvegarde 1 jour avant

echo "Test de restauration pour $SERVICE (âge sauvegarde: $BACKUP_AGE)"

# 1. Lister les sauvegardes disponibles
BACKUPS=$(aws s3 ls s3://backups/$SERVICE/ --recursive | sort -r | head -5)
echo "Sauvegardes disponibles:"
echo "$BACKUPS"

# 2. Sélectionner sauvegarde (1 jour avant)
BACKUP_TO_RESTORE=$(echo "$BACKUPS" | grep $(date -d "$BACKUP_AGE" +%Y%m%d) | awk '{print $NF}' | head -1)

if [ -z "$BACKUP_TO_RESTORE" ]; then
    echo "ERREUR: Aucune sauvegarde trouvée"
    exit 1
fi

echo "Restauration: $BACKUP_TO_RESTORE"

# 3. Restaurer vers environnement staging
restore-service $SERVICE $BACKUP_TO_RESTORE --environment staging

# 4. Valider restauration
RESTORE_TIME=$(get-backup-timestamp $BACKUP_TO_RESTORE)
RECORD_COUNT=$(psql -h staging-db -U readonly -t -c "SELECT COUNT(*) FROM data_records WHERE created_at > '$RESTORE_TIME' - interval '1 hour';")

if [ $RECORD_COUNT -eq 0 ]; then
    echo "✓ Intégrité sauvegarde validée"
else
    echo "✗ AVERTISSEMENT: Enregistrements inattendus trouvés"
fi

# 5. Exécuter les tests de fumée
./tests/smoke-tests.sh --environment staging || exit 1

# 6. Rapporter les résultats
RESULT="SUCCESS"
DURATION=$(date +%s) - $START_TIME
report-test-results \
  --test-id backup-restore-$TEST_DATE \
  --service $SERVICE \
  --result $RESULT \
  --duration $DURATION \
  --backup-age $BACKUP_AGE

echo "✓ Test terminé: $RESULT"
```

**Critères de Succès:**
- Restauration terminée en moins de 20 minutes
- Tous les données présentes et non corrompues
- Tests de fumée passent
- Aucune dérive de données entre sauvegarde et staging

---

## Surveillance et Alertes

### Métriques Clés

```yaml
metriques:
  sante-sauvegarde:
    - age-sauvegarde-secondes
    - taille-sauvegarde-octets
    - duree-test-restauration-secondes
    - taux-echec-verification-sauvegarde
    seuils-alerte:
      age-sauvegarde: 86400s  # 24 heures
      duree-restauration: 1800s  # 30 minutes
      echecs-verification: 0.01  # 1%

  replication-base-donnees:
    - decalage-replication-secondes
    - retard-archive-wal-octets
    - lacunes-chronologie-detectees
    seuils-alerte:
      decalage: 30s  # P0 si > 30s
      retard-archive: 1GB
      lacunes: 1

  preparation-dr:
    - utilisation-capacite-dr
    - nombre-restaurations-reussies-24h
    - age-test-basculement-jours
    seuils-alerte:
      utilisation: 0.8  # 80%
      echecs-restauration: 1+
      age-test: 90  # jours
```

---

## Matrice Temps de Récupération et Coût

| Scénario | RTO | RPO | Coût Estimé | Niveau Risque |
|---|---|---|---|---|
| Défaillance instance unique | 5 min | 1 min | Faible | Faible |
| Corruption base de données | 30 min | 5 min | Moyen | Moyen |
| Panne régionale | 2 heures | 15 min | Élevé | Élevé |
| Défaillance cascade multi-région | 4 heures | 30 min | Critique | Critique |

---

## Template de Révision Post-Incident

Après tout désastre réel ou exercice, complétez ce template:

```markdown
# Révision Post-Incident: [ID Incident]

## Résumé Exécutif
- **Durée:** [début] - [fin] ([total minutes])
- **Impact:** [systèmes affectés, clients impactés]
- **Cause:** [cause racine]
- **Résolution:** [ce qui l'a corrigé]

## Chronologie
- T+0: [événement déclencheur]
- T+5: [détection]
- T+10: [réponse initiée]
- T+30: [récupération partielle]
- T+60: [récupération complète]

## Ce Qui S'Est Bien Passé
- [ ] Alerte déclenchée à temps
- [ ] Manuel était précis
- [ ] Communication d'équipe claire
- [ ] Restauration sauvegarde réussie

## Ce Qui Pourrait Être Amélioré
- [ ] Temps de détection
- [ ] Clarté du manuel
- [ ] Fraîcheur sauvegarde
- [ ] Coordination d'équipe

## Articles d'Action
- [ ] Élément: Assigné à: Date limite:
- [ ] Élément: Assigné à: Date limite:
```

---

## Ressources Connexes

- **Guide de Déploiement:** `deployment-guide.md`
- **Durcissement Sécurité:** `security-hardening.md`
- **Manuels On-Call:** `/runbooks/`
- **Réponse aux Incidents:** `/procedures/incident-response.md`

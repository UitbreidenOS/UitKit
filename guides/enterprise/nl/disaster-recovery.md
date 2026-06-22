# Enterprise Rampenplan

## Doel

Deze gids stelt herstelsdoelstellingen, back-upstrategieën, herstelproces en resilientietestprotocollen vast om de bedrijfsimpact van systeemfouten, gegevensverlies of serviceonderbrekingen te minimaliseren.

---

## Hersteldoelstellingen

### RPO & RTO per Serviceniveau

| Serviceniveau | RTO (Hersteltijd) | RPO (Herstelpunt) | Prioriteit |
|---|---|---|---|
| **Kritiek** | ≤ 1 uur | ≤ 5 minuten | P0 |
| **Hoog** | ≤ 4 uur | ≤ 15 minuten | P1 |
| **Gemiddeld** | ≤ 24 uur | ≤ 1 uur | P2 |
| **Laag** | ≤ 72 uur | ≤ 6 uur | P3 |

**Kritieke Services:**
- Authentificatie- en autorisatiesystemen
- Gegevenspersistentielaag (primaire database)
- Realtime event streaming
- Klantgericht API-gateway

**Hoge Prioriteit:**
- Analytics-pijplijn
- Configuratiebeheer
- Monitoring en alerting
- Documentatiesystemen

---

## Back-upstrategie

### 1. Volledige Systeemback-ups

**Frequentie:** Dagelijks (00:00 UTC)  
**Retentie:** 30 dagen ter plaatse, 90 dagen buiten site  
**Doel:** Alle persistente gegevensarchieven

**Procedure:**
```bash
# Geautomatiseerd via back-up-orchestrator
backup-system \
  --full \
  --encrypt \
  --verify-checksum \
  --replicate-to-cold-storage
```

**Verificatie:**
- Controlesommen onmiddellijk na back-up gevalideerd
- Hersteltest maandelijks op 10% van back-ups uitgevoerd
- Waarschuwing als een back-up > 30% van basisgrootte

### 2. Incrementele Back-ups

**Frequentie:** Om de 6 uur  
**Retentie:** 7 dagen ter plaatse  
**Keten:** Gekoppeld aan meest recente volledige back-up

**Procedure:**
```bash
backup-system \
  --incremental \
  --delta-only \
  --since-last-full
```

### 3. Database Back-ups

**PostgreSQL:**
- Continue WAL-archivering (Write-Ahead Logs) naar S3
- Dagelijkse volledige back-up + stündliche incrementeel
- Point-in-time recovery (PITR) beschikbaar voor 30 dagen
- Replicatievertragingsmonitoring: waarschuwing als > 10 seconden

**Redis/Cache:**
- RDB-snapshots elk uur
- AOF (Append-Only File) ingeschakeld
- Gerepliceerd naar standby-exemplaar in afzonderlijke AZ

**Elasticsearch:**
- Snapshot-repository in S3
- Dagelijkse snapshots met 30-dagige retentie
- Doorzoekbare snapshots voor snelle herstelling

### 4. Configuratie & Secrets Back-ups

**Opslag:** Versleutelde kluis (AWS Secrets Manager, HashiCorp Vault)  
**Frequentie:** Realtimesynchronisatie + stündliche snapshots  
**Toegang:** MFA-beveiligd, audit-geregistreerd  
**Rotatie:** Secrets automatisch elke 90 dagen geroteerd

---

## Herstelproces

### Niveau 1: Individuele Service Herstel (RTO: 15 min)

**Trigger:** Service gezondheidscontroles mislukken > 2 minuten  
**Runbook:** `restore-service.sh`

```bash
#!/bin/bash
SERVICE=$1
BACKUP_TIME=${2:-latest}

# Stap 1: Falende service stoppen
systemctl stop $SERVICE

# Stap 2: Back-upbeschikbaarheid verifiëren
aws s3 ls s3://backups/$SERVICE/$BACKUP_TIME/ || exit 1

# Stap 3: Van back-up downloaden en herstellen
aws s3 sync s3://backups/$SERVICE/$BACKUP_TIME/ /var/data/$SERVICE/
chmod 750 /var/data/$SERVICE/*
chown service:service /var/data/$SERVICE -R

# Stap 4: Gegevensintegriteit valideren
restore-validate --service $SERVICE --data-path /var/data/$SERVICE/

# Stap 5: Service met gezondheidscontroles starten
systemctl start $SERVICE
sleep 5
systemctl status $SERVICE || exit 1

# Stap 6: On-call-team notificeren
alert-oncall --severity critical --message "$SERVICE hersteld van $BACKUP_TIME"
```

**Validatiecontrole:**
- [ ] Service start succesvol
- [ ] Gezondheidscheck-endpoint reageert (HTTP 200)
- [ ] Database-connectiviteit bevestigd
- [ ] Geen foutlogboeken in eerste 60 seconden

---

### Niveau 2: Database Herstel (RTO: 30 min)

**Trigger:** Gegevensbeschadiging, onopzettelijk verwijderen, onherstelbare fouten  
**Runbook:** `restore-database.sh`

```bash
#!/bin/bash
DB_NAME=$1
RESTORE_POINT=${2:-latest}

# Stap 1: Exclusieve vergrendeling verkrijgen (schrijvingen voorkomen)
psql -h $DB_HOST -U postgres -c "ALTER DATABASE $DB_NAME SET default_transaction_isolation = 'serializable';"

# Stap 2: Hersteltijdlijn identificeren
# Voor PITR: restore-point = "2024-06-22 14:30:00"
# Voor back-up: restore-point = "backup-full-20240622"

if [[ $RESTORE_POINT == backup-* ]]; then
    # Volledige back-upherstel
    pg_basebackup -h $DB_HOST -U backup_user -D /var/lib/postgresql/recovery -v -P
    echo "recovery_target_timeline = 'latest'" >> /var/lib/postgresql/recovery/recovery.conf
else
    # Point-in-time recovery
    echo "recovery_target_time = '$RESTORE_POINT'" >> /var/lib/postgresql/recovery/recovery.conf
fi

# Stap 3: Herstel uitvoeren
systemctl stop postgresql
rm -rf /var/lib/postgresql/main
mv /var/lib/postgresql/recovery /var/lib/postgresql/main
chown postgres:postgres /var/lib/postgresql/main -R

# Stap 4: Database in alleen-lezen modus starten
systemctl start postgresql
pg_isready -h localhost || exit 1

# Stap 5: Integriteitscontroles uitvoeren
psql -h localhost -U postgres -d $DB_NAME -c "ANALYZE;"
psql -h localhost -U postgres -d $DB_NAME -c "SELECT COUNT(*) FROM pg_stat_user_tables;" > /tmp/table_counts.txt

# Stap 6: Tegen snapshot controleren
diff /tmp/table_counts.txt /backups/verify/table_counts_$RESTORE_POINT.txt || echo "WAARSCHUWING: Tabelaantallen verschillen"

# Stap 7: Schrijvingen inschakelen (promoten)
psql -h localhost -U postgres -c "ALTER DATABASE $DB_NAME RESET default_transaction_isolation;"
systemctl restart postgresql

echo "Database $DB_NAME hersteld naar $RESTORE_POINT"
```

**Validatiecontrole:**
- [ ] Database start schoon
- [ ] Geen beschadiging gedetecteerd (pg_filedump-scan)
- [ ] Replicatie haalt binnen 5 minuten in
- [ ] Applicatietests geslaagd tegen herstelde DB
- [ ] Gegevenszegel komt overeen met verwacht herstelpunt

---

### Niveau 3: Multi-Service Uitval (RTO: 2 uur)

**Trigger:** Meerdere kritieke services down, primaire datacenter-uitval  
**Runbook:** `regional-failover.sh`

```bash
#!/bin/bash
set -e

INCIDENT_ID=$(uuidgen)
DR_REGION=${1:-us-west-2}
RESTORE_TIME=${2:-$(date -u +'%Y-%m-%d %H:%M:%S' -d '15 minutes ago')}

echo "=== REGIONAAL FAILOVER GESTART ===" | tee /tmp/failover_$INCIDENT_ID.log
echo "Incident-ID: $INCIDENT_ID"
echo "Doelregio: $DR_REGION"
echo "Herstelpunt: $RESTORE_TIME"

# Fase 1: DR-infrastructuur voorbereiden (10 min)
echo "Fase 1: DR-infrastructuur inrichten..."
terraform apply -var="region=$DR_REGION" -var="incident_id=$INCIDENT_ID" -auto-approve

# Fase 2: Alle databases parallel herstellen (15 min)
echo "Fase 2: Databases herstellen..."
for db in primary analytics events config; do
    (
        restore-database $db "$RESTORE_TIME"
        echo "✓ $db hersteld"
    ) &
done
wait

# Fase 3: Toepassingsstatus herstellen (10 min)
echo "Fase 3: Toepassingsstatus herstellen..."
aws s3 sync s3://backups/app-state/$RESTORE_TIME/ /var/app/state/

# Fase 4: DNS naar DR-regio bijwerken (5 min)
echo "Fase 4: DNS-records bijwerken..."
update-dns \
  --zone-id $ZONE_ID \
  --records-from primary-region \
  --records-to $DR_REGION \
  --ttl 60

# Fase 5: Services starten en valideren (10 min)
echo "Fase 5: Services starten..."
systemctl start claudient-app
sleep 30

# Fase 6: Rook-tests uitvoeren
echo "Fase 6: Rook-tests uitvoeren..."
./tests/smoke-tests.sh || exit 1

echo "=== REGIONAAL FAILOVER VOLTOOID ===" | tee -a /tmp/failover_$INCIDENT_ID.log
echo "Hersteltijd: $(elapsed_time)"
alert-oncall --severity critical --incident-id $INCIDENT_ID --message "Failover voltooid naar $DR_REGION"
```

**Validatiecontrole:**
- [ ] DNS bijgewerkt en verspreid
- [ ] Alle services gezond in DR-regio
- [ ] Rook-tests geslaagd
- [ ] Geen gegevensverlies gedetecteerd
- [ ] Replicatievertraging < 1 minuut
- [ ] Klantmeldingen verzonden

---

## Chaos Engineering en Resilientietstesten

### Testschema

| Testtype | Frequentie | Duur | Bereik |
|---|---|---|---|
| **Back-up Hersteltest** | Wekelijks (wo 14:00 UTC) | 30 min | Individuele service |
| **Database PITR Test** | Tweewekelijks (2e & 4e ma) | 45 min | Productiebijlage |
| **Regionaal Failover Oefening** | Driemaandelijks | 2 uur | Volledig systeem |
| **Chaos Monkey** | Dagelijks (02:00-03:00 UTC) | 60 min | Canary-knooppunten |
| **Netwerkpartitie Test** | Maandelijks | 30 min | Multi-AZ-connectiviteit |

### 1. Back-up Hersteltest

**Doel:** Herstelproces en automatisering valideren  
**Frequentie:** Wekelijks woensdag 14:00 UTC  
**Duur:** 30 minuten

**Testprocedure:**
```bash
#!/bin/bash
# Uitvoeren in niet-productieomgeving

TEST_DATE=$(date +%Y%m%d)
SERVICE=${1:-api-gateway}
BACKUP_AGE=${2:-1d}  # 1 dag oude back-up

echo "Hersteltest voor $SERVICE (back-up-ouderdom: $BACKUP_AGE)"

# 1. Beschikbare back-ups weergeven
BACKUPS=$(aws s3 ls s3://backups/$SERVICE/ --recursive | sort -r | head -5)
echo "Beschikbare back-ups:"
echo "$BACKUPS"

# 2. Back-up selecteren (1 dag oud)
BACKUP_TO_RESTORE=$(echo "$BACKUPS" | grep $(date -d "$BACKUP_AGE" +%Y%m%d) | awk '{print $NF}' | head -1)

if [ -z "$BACKUP_TO_RESTORE" ]; then
    echo "FOUT: Geen back-up gevonden met criteria"
    exit 1
fi

echo "Herstel: $BACKUP_TO_RESTORE"

# 3. Naar staging-omgeving herstellen
restore-service $SERVICE $BACKUP_TO_RESTORE --environment staging

# 4. Herstel valideren
RESTORE_TIME=$(get-backup-timestamp $BACKUP_TO_RESTORE)
RECORD_COUNT=$(psql -h staging-db -U readonly -t -c "SELECT COUNT(*) FROM data_records WHERE created_at > '$RESTORE_TIME' - interval '1 hour';")

if [ $RECORD_COUNT -eq 0 ]; then
    echo "✓ Back-up-integriteit gevalideerd"
else
    echo "✗ WAARSCHUWING: Onverwachte records gevonden na herstel"
fi

# 5. Rook-tests uitvoeren
./tests/smoke-tests.sh --environment staging || exit 1

# 6. Resultaten rapporteren
RESULT="SUCCESS"
DURATION=$(date +%s) - $START_TIME
report-test-results \
  --test-id backup-restore-$TEST_DATE \
  --service $SERVICE \
  --result $RESULT \
  --duration $DURATION \
  --backup-age $BACKUP_AGE

echo "✓ Test voltooid: $RESULT"
```

**Criteria voor Succes:**
- Herstel voltooid binnen 20 minuten
- Alle gegevens aanwezig en niet beschadigd
- Rook-tests geslaagd
- Geen gegevensverschil tussen back-up en staging

---

## Monitoring en Alerting

### Sleutelmetrieken

```yaml
metrici:
  back-up-gezondheid:
    - back-up-ouderdom-seconden
    - back-up-grootte-bytes
    - hersteltestduur-seconden
    - verificatiemislukkingspercentage-back-up
    waarschuwingsdrempels:
      back-up-ouderdom: 86400s  # 24 uur
      herstelduur: 1800s  # 30 minuten
      verificatiemislukkingen: 0.01  # 1%

  database-replicatie:
    - replicatievertaging-seconden
    - wal-archiefvertaging-bytes
    - gedetecteerde-tijdlijnhiaten
    waarschuwingsdrempels:
      vertraging: 30s  # P0 als > 30s
      archiefvertraging: 1GB
      hiaten: 1

  dr-gereedheid:
    - dr-capaciteitsgebruik
    - geslaagde-herstels-24u
    - leeftijd-failovertest-dagen
    waarschuwingsdrempels:
      gebruik: 0.8  # 80%
      herstelfouten: 1+
      test-leeftijd: 90  # dagen
```

---

## Hersteltijd & Kostenmatrix

| Scenario | RTO | RPO | Geschatte Kosten | Risiconiveau |
|---|---|---|---|---|
| Individueel exemplaaritval | 5 min | 1 min | Laag | Laag |
| Database-beschadiging | 30 min | 5 min | Gemiddeld | Gemiddeld |
| Regionaal uitval | 2 uur | 15 min | Hoog | Hoog |
| Multi-regio-cascade-fout | 4 uur | 30 min | Kritiek | Kritiek |

---

## Postincident Beoordelingssjabloon

Na enig werkelijk ramp of oefening, vul deze sjabloon in:

```markdown
# Postincident Beoordeling: [Incident-ID]

## Samenvatting voor Bestuur
- **Duur:** [begin] - [einde] ([totale minuten])
- **Impact:** [beïnvloede systemen, beïnvloede klanten]
- **Oorzaak:** [grondoorzaak]
- **Resolutie:** [wat het heeft opgelost]

## Chronologie
- T+0: [triggergebeurtenis]
- T+5: [detectie]
- T+10: [reactie geïnitieerd]
- T+30: [gedeeltelijk herstel]
- T+60: [volledig herstel]

## Wat Goed Ging
- [ ] Waarschuwing op tijd geactiveerd
- [ ] Runbook was nauwkeurig
- [ ] Teamcommunicatie helder
- [ ] Back-up-herstel succesvol

## Wat Zou Kunnen Verbeteren
- [ ] Detectietijd
- [ ] Runbook-duidelijkheid
- [ ] Back-up-versheid
- [ ] Teamcoördinatie

## Actie-items
- [ ] Item: Toegewezen aan: Vervaldatum:
- [ ] Item: Toegewezen aan: Vervaldatum:
```

---

## Gerelateerde Bronnen

- **Implementatiegids:** `deployment-guide.md`
- **Beveiligingsharding:** `security-hardening.md`
- **On-Call Runbooks:** `/runbooks/`
- **Incidentrespons:** `/procedures/incident-response.md`

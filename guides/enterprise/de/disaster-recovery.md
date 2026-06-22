# Enterprise Disaster Recovery Plan

## Zweck

Dieser Leitfaden etabliert Wiederherstellungsziele, Sicherungsstrategien, Wiederherstellungsverfahren und Resilienz-Testprotokolle, um die Auswirkungen von Systemausfällen, Datenverlust oder Serviceunterbrechungen zu minimieren.

---

## Wiederherstellungsziele

### RPO & RTO nach Service-Tier

| Service-Tier | RTO (Wiederherstellungszeit) | RPO (Wiederherstellungspunkt) | Priorität |
|---|---|---|---|
| **Kritisch** | ≤ 1 Stunde | ≤ 5 Minuten | P0 |
| **Hoch** | ≤ 4 Stunden | ≤ 15 Minuten | P1 |
| **Mittel** | ≤ 24 Stunden | ≤ 1 Stunde | P2 |
| **Niedrig** | ≤ 72 Stunden | ≤ 6 Stunden | P3 |

**Kritische Services:**
- Authentifizierungs- und Autorisierungssysteme
- Datenpersistenzschicht (primäre Datenbank)
- Echtzeit-Ereignis-Streaming
- Kundengerichtetes API-Gateway

**Hohe Priorität:**
- Analytics-Pipeline
- Konfigurationsverwaltung
- Monitoring und Alerting
- Dokumentationssysteme

---

## Sicherungsstrategie

### 1. Vollständige Systemsicherungen

**Häufigkeit:** Täglich (00:00 UTC)  
**Aufbewahrung:** 30 Tage vor Ort, 90 Tage außerhalb  
**Ziel:** Alle persistenten Datenspeicher

**Verfahren:**
```bash
# Automatisiert über Sicherungs-Orchestrator
backup-system \
  --full \
  --encrypt \
  --verify-checksum \
  --replicate-to-cold-storage
```

**Verifizierung:**
- Prüfsummen unmittelbar nach Sicherung validiert
- Wiederherstellungstest wird monatlich auf 10% der Sicherungen durchgeführt
- Warnung, wenn eine Sicherung > 30% der Baseline-Größe

### 2. Inkrementelle Sicherungen

**Häufigkeit:** Alle 6 Stunden  
**Aufbewahrung:** 7 Tage vor Ort  
**Kette:** Mit neuester Vollsicherung verknüpft

**Verfahren:**
```bash
backup-system \
  --incremental \
  --delta-only \
  --since-last-full
```

### 3. Datenbank-Sicherungen

**PostgreSQL:**
- Kontinuierliche WAL-Archivierung (Write-Ahead Logs) zu S3
- Tägliche Vollsicherung + stündlich inkrementell
- Point-in-Time Recovery (PITR) für 30 Tage verfügbar
- Replikationsverzögerungs-Monitoring: Warnung wenn > 10 Sekunden

**Redis/Cache:**
- RDB-Snapshots alle Stunde
- AOF (Append-Only File) aktiviert
- In separater AZ repliziert

**Elasticsearch:**
- Snapshot-Repository in S3
- Tägliche Snapshots mit 30-Tage-Aufbewahrung
- Durchsuchbare Snapshots für schnelle Wiederherstellung

### 4. Konfiguration & Secrets-Sicherungen

**Speicher:** Verschlüsselter Tresor (AWS Secrets Manager, HashiCorp Vault)  
**Häufigkeit:** Echtzeit-Synchronisation + stündliche Snapshots  
**Zugriff:** MFA-geschützt, audit-protokolliert  
**Rotation:** Secrets automatisch alle 90 Tage rotiert

---

## Wiederherstellungsverfahren

### Ebene 1: Einzelne Service-Wiederherstellung (RTO: 15 min)

**Auslöser:** Service-Integritätsprüfungen fehlgeschlagen > 2 Minuten  
**Runbook:** `restore-service.sh`

```bash
#!/bin/bash
SERVICE=$1
BACKUP_TIME=${2:-latest}

# Schritt 1: Fehlendes Service stoppen
systemctl stop $SERVICE

# Schritt 2: Sicherungsverfügbarkeit prüfen
aws s3 ls s3://backups/$SERVICE/$BACKUP_TIME/ || exit 1

# Schritt 3: Von Sicherung herunterladen und wiederherstellen
aws s3 sync s3://backups/$SERVICE/$BACKUP_TIME/ /var/data/$SERVICE/
chmod 750 /var/data/$SERVICE/*
chown service:service /var/data/$SERVICE -R

# Schritt 4: Datenintegrität validieren
restore-validate --service $SERVICE --data-path /var/data/$SERVICE/

# Schritt 5: Service mit Health-Checks starten
systemctl start $SERVICE
sleep 5
systemctl status $SERVICE || exit 1

# Schritt 6: On-Call-Team benachrichtigen
alert-oncall --severity critical --message "$SERVICE wiederhergestellt von $BACKUP_TIME"
```

**Validierungs-Checkliste:**
- [ ] Service startet erfolgreich
- [ ] Health-Check-Endpunkt antwortet (HTTP 200)
- [ ] Datenbankverbindung bestätigt
- [ ] Keine Fehlerlogs in den ersten 60 Sekunden

---

### Ebene 2: Datenbank-Wiederherstellung (RTO: 30 min)

**Auslöser:** Datenbeschädigung, versehentliches Löschen, nicht wiederherstellbare Fehler  
**Runbook:** `restore-database.sh`

```bash
#!/bin/bash
DB_NAME=$1
RESTORE_POINT=${2:-latest}

# Schritt 1: Exklusiven Sperren erwerben (Schreibvorgänge verhindern)
psql -h $DB_HOST -U postgres -c "ALTER DATABASE $DB_NAME SET default_transaction_isolation = 'serializable';"

# Schritt 2: Wiederherstellungs-Zeitleiste identifizieren
# Für PITR: restore-point = "2024-06-22 14:30:00"
# Für Sicherung: restore-point = "backup-full-20240622"

if [[ $RESTORE_POINT == backup-* ]]; then
    # Vollständige Sicherungswiederherstellung
    pg_basebackup -h $DB_HOST -U backup_user -D /var/lib/postgresql/recovery -v -P
    echo "recovery_target_timeline = 'latest'" >> /var/lib/postgresql/recovery/recovery.conf
else
    # Point-in-Time-Wiederherstellung
    echo "recovery_target_time = '$RESTORE_POINT'" >> /var/lib/postgresql/recovery/recovery.conf
fi

# Schritt 3: Wiederherstellung durchführen
systemctl stop postgresql
rm -rf /var/lib/postgresql/main
mv /var/lib/postgresql/recovery /var/lib/postgresql/main
chown postgres:postgres /var/lib/postgresql/main -R

# Schritt 4: Datenbank im Lesemodus starten
systemctl start postgresql
pg_isready -h localhost || exit 1

# Schritt 5: Integritätsprüfungen durchführen
psql -h localhost -U postgres -d $DB_NAME -c "ANALYZE;"
psql -h localhost -U postgres -d $DB_NAME -c "SELECT COUNT(*) FROM pg_stat_user_tables;" > /tmp/table_counts.txt

# Schritt 6: Gegen Snapshot verifizieren
diff /tmp/table_counts.txt /backups/verify/table_counts_$RESTORE_POINT.txt || echo "WARNUNG: Tabellenzahlen unterscheiden sich"

# Schritt 7: Schreibvorgänge aktivieren (Höherstufen)
psql -h localhost -U postgres -c "ALTER DATABASE $DB_NAME RESET default_transaction_isolation;"
systemctl restart postgresql

echo "Datenbank $DB_NAME wiederhergestellt auf $RESTORE_POINT"
```

**Validierungs-Checkliste:**
- [ ] Datenbank startet sauber
- [ ] Keine Beschädigung erkannt (pg_filedump-Scan)
- [ ] Replikation innerhalb 5 Minuten aufgeholt
- [ ] Anwendungstests bestehen gegen wiederhergestellte DB
- [ ] Datums-Zeitstempel entspricht erwarteter Wiederherstellungspunkt

---

### Ebene 3: Multi-Service-Ausfall (RTO: 2 Stunden)

**Auslöser:** Mehrere kritische Services down, Primär-Datencenter-Ausfall  
**Runbook:** `regional-failover.sh`

```bash
#!/bin/bash
set -e

INCIDENT_ID=$(uuidgen)
DR_REGION=${1:-us-west-2}
RESTORE_TIME=${2:-$(date -u +'%Y-%m-%d %H:%M:%S' -d '15 minutes ago')}

echo "=== REGIONALER FAILOVER GESTARTET ===" | tee /tmp/failover_$INCIDENT_ID.log
echo "Incident-ID: $INCIDENT_ID"
echo "Zielregion: $DR_REGION"
echo "Wiederherstellungspunkt: $RESTORE_TIME"

# Phase 1: DR-Infrastruktur vorbereiten (10 min)
echo "Phase 1: DR-Infrastruktur bereitstellen..."
terraform apply -var="region=$DR_REGION" -var="incident_id=$INCIDENT_ID" -auto-approve

# Phase 2: Alle Datenbanken parallel wiederherstellen (15 min)
echo "Phase 2: Datenbanken wiederherstellen..."
for db in primary analytics events config; do
    (
        restore-database $db "$RESTORE_TIME"
        echo "✓ $db wiederhergestellt"
    ) &
done
wait

# Phase 3: Anwendungsstatus wiederherstellen (10 min)
echo "Phase 3: Anwendungsstatus wiederherstellen..."
aws s3 sync s3://backups/app-state/$RESTORE_TIME/ /var/app/state/

# Phase 4: DNS auf DR-Region aktualisieren (5 min)
echo "Phase 4: DNS-Datensätze aktualisieren..."
update-dns \
  --zone-id $ZONE_ID \
  --records-from primary-region \
  --records-to $DR_REGION \
  --ttl 60

# Phase 5: Services starten und validieren (10 min)
echo "Phase 5: Services starten..."
systemctl start claudient-app
sleep 30

# Phase 6: Smoke-Tests durchführen
echo "Phase 6: Smoke-Tests durchführen..."
./tests/smoke-tests.sh || exit 1

echo "=== REGIONALER FAILOVER BEENDET ===" | tee -a /tmp/failover_$INCIDENT_ID.log
echo "Wiederherstellungszeit: $(elapsed_time)"
alert-oncall --severity critical --incident-id $INCIDENT_ID --message "Failover abgeschlossen zu $DR_REGION"
```

**Validierungs-Checkliste:**
- [ ] DNS aktualisiert und propagiert
- [ ] Alle Services gesund in DR-Region
- [ ] Smoke-Tests bestanden
- [ ] Keine Daten verloren
- [ ] Replikationsverzögerung < 1 Minute
- [ ] Kundenbenachrichtigungen versandt

---

## Chaos Engineering und Resilienz-Tests

### Test-Zeitplan

| Test-Typ | Häufigkeit | Dauer | Umfang |
|---|---|---|---|
| **Sicherungs-Wiederherstellungstest** | Wöchentlich (Mi 14:00 UTC) | 30 min | Einzelnes Service |
| **Datenbank-PITR-Test** | Halbmonatlich (2. & 4. Mo) | 45 min | Production-Kopie |
| **Regionaler Failover-Drill** | Quartalsweise | 2 Stunden | Vollständiges System |
| **Chaos Monkey** | Täglich (02:00-03:00 UTC) | 60 min | Canary-Knoten |
| **Netzwerk-Partitions-Test** | Monatlich | 30 min | Multi-AZ-Konnektivität |

### 1. Sicherungs-Wiederherstellungstest

**Ziel:** Wiederherstellungsverfahren und Automatisierung validieren  
**Häufigkeit:** Wöchentlich Mittwoch 14:00 UTC  
**Dauer:** 30 Minuten

**Test-Verfahren:**
```bash
#!/bin/bash
# In Nicht-Production-Umgebung ausführen

TEST_DATE=$(date +%Y%m%d)
SERVICE=${1:-api-gateway}
BACKUP_AGE=${2:-1d}  # 1 Tag alte Sicherung

echo "Wiederherstellungstest für $SERVICE (Sicherungsalter: $BACKUP_AGE)"

# 1. Verfügbare Sicherungen auflisten
BACKUPS=$(aws s3 ls s3://backups/$SERVICE/ --recursive | sort -r | head -5)
echo "Verfügbare Sicherungen:"
echo "$BACKUPS"

# 2. Sicherung wählen (1 Tag alt)
BACKUP_TO_RESTORE=$(echo "$BACKUPS" | grep $(date -d "$BACKUP_AGE" +%Y%m%d) | awk '{print $NF}' | head -1)

if [ -z "$BACKUP_TO_RESTORE" ]; then
    echo "FEHLER: Keine Sicherung mit Kriterien gefunden"
    exit 1
fi

echo "Wird wiederhergestellt: $BACKUP_TO_RESTORE"

# 3. In Staging-Umgebung wiederherstellen
restore-service $SERVICE $BACKUP_TO_RESTORE --environment staging

# 4. Wiederherstellung validieren
RESTORE_TIME=$(get-backup-timestamp $BACKUP_TO_RESTORE)
RECORD_COUNT=$(psql -h staging-db -U readonly -t -c "SELECT COUNT(*) FROM data_records WHERE created_at > '$RESTORE_TIME' - interval '1 hour';")

if [ $RECORD_COUNT -eq 0 ]; then
    echo "✓ Sicherungsintegrität validiert"
else
    echo "✗ WARNUNG: Unerwartete Datensätze nach Wiederherstellung gefunden"
fi

# 5. Smoke-Tests durchführen
./tests/smoke-tests.sh --environment staging || exit 1

# 6. Ergebnisse berichten
RESULT="SUCCESS"
DURATION=$(date +%s) - $START_TIME
report-test-results \
  --test-id backup-restore-$TEST_DATE \
  --service $SERVICE \
  --result $RESULT \
  --duration $DURATION \
  --backup-age $BACKUP_AGE

echo "✓ Test abgeschlossen: $RESULT"
```

**Erfolgskriterien:**
- Wiederherstellung innerhalb von 20 Minuten abgeschlossen
- Alle Daten vorhanden und nicht beschädigt
- Smoke-Tests bestanden
- Keine Datenverluste zwischen Sicherung und Staging

---

## Überwachung und Alerting

### Wichtige Metriken

```yaml
metriken:
  sicherungs-gesundheit:
    - sicherungsalter-sekunden
    - sicherungsgrosse-bytes
    - wiederherstellungstest-dauer-sekunden
    - sicherungsverifikations-fehlerrate
    alert-schwellen:
      sicherungsalter: 86400s  # 24 Stunden
      wiederherstellungsdauer: 1800s  # 30 Minuten
      verifikationsfehler: 0.01  # 1%

  datenbank-replikation:
    - replikationsverzögerung-sekunden
    - wal-archivverzögerung-bytes
    - zeitleisten-lücken-erkannt
    alert-schwellen:
      verzögerung: 30s  # P0 wenn > 30s
      archivverzögerung: 1GB
      lücken: 1

  dr-vorbereitung:
    - dr-kapazitätsauslastung
    - erfolgreiche-wiederherstellungen-24h
    - failover-test-alter-tage
    alert-schwellen:
      auslastung: 0.8  # 80%
      wiederherstellungsfehler: 1+
      testalter: 90  # Tage
```

---

## Wiederherstellungszeit & Kostenmatrix

| Szenario | RTO | RPO | Geschätzter Kosten | Risikoniveau |
|---|---|---|---|---|
| Einzelne Instanzausfalls | 5 min | 1 min | Niedrig | Niedrig |
| Datenbank-Beschädigung | 30 min | 5 min | Mittel | Mittel |
| Regionales Ausfallszenario | 2 Stunden | 15 min | Hoch | Hoch |
| Multi-Region-Kaskadierende Fehler | 4 Stunden | 30 min | Kritisch | Kritisch |

---

## Post-Incident-Überprüfungs-Vorlage

Nach jedem tatsächlichen Notfall oder Drill, füllen Sie diese Vorlage aus:

```markdown
# Post-Incident-Überprüfung: [Incident-ID]

## Zusammenfassung für die Geschäftsleitung
- **Dauer:** [Start] - [Ende] ([Gesamtminuten])
- **Auswirkung:** [betroffene Systeme, impactierte Kunden]
- **Ursache:** [Grundursache]
- **Lösung:** [Was es behoben hat]

## Chronologie
- T+0: [Auslöseereignis]
- T+5: [Erkennung]
- T+10: [Reaktion initiiert]
- T+30: [Teilweise Wiederherstellung]
- T+60: [Vollständige Wiederherstellung]

## Was Gut Funktioniert Hat
- [ ] Alert ausgelöst rechtzeitig
- [ ] Runbook war genau
- [ ] Team-Kommunikation klar
- [ ] Sicherungs-Wiederherstellung erfolgreich

## Was Verbessert Werden Könnte
- [ ] Erkennungszeit
- [ ] Runbook-Klarheit
- [ ] Sicherungsfrische
- [ ] Team-Koordination

## Maßnahmen
- [ ] Element: Beauftragt an: Fällig:
- [ ] Element: Beauftragt an: Fällig:
```

---

## Verwandte Ressourcen

- **Bereitstellungsleitfaden:** `deployment-guide.md`
- **Sicherheits-Härtung:** `security-hardening.md`
- **On-Call-Runbooks:** `/runbooks/`
- **Incident-Response:** `/procedures/incident-response.md`

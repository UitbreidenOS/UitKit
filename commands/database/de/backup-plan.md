---
description: Erstellen Sie einen Sicherungs- und Wiederherstellungsplan für die Datenbank, der auf den Stack des Projekts sowie die RTO/RPO-Anforderungen zugeschnitten ist
argument-hint: "[database type, hosting environment, or RTO/RPO requirements]"
---
Erstellen Sie einen Sicherungs- und Wiederherstellungsplan für die Datenbank für: $ARGUMENTS

Wenn $ARGUMENTS einen Datenbank-Typ und/oder eine Umgebung angibt, verwenden Sie diesen. Ansonsten erkennen Sie den Datenbankmotor und den Hosting-Kontext aus den Projektconfig-Dateien (docker-compose, .env, database.yml, etc.).

Erstellen Sie einen vollständigen Sicherungsplan mit folgendem Inhalt:

1. Sicherungsstrategie:
   - Häufigkeit und Zeitplan der vollständigen Sicherung (Cron-Ausdruck).
   - Inkrementelle oder WAL-basierte kontinuierliche Sicherung, falls vom Engine unterstützt (PostgreSQL WAL-Archivierung, MySQL Binlog, MSSQL Transaktionsprotokoll-Versand).
   - Logische vs. physische Sicherungs-Trade-offs für diesen Engine und diese Datensatzgröße.
   - Empfohlene Tools: pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, Cloud-native Snapshots (RDS, Cloud SQL, Azure Database).

2. Aufbewahrungsrichtlinie:
   - Tägliche Sicherungen für N Tage, wöchentliche für N Wochen, monatliche für N Monate aufbewahren — bieten Sie eine konkrete Empfehlung basierend auf den implizierten Compliance-Anforderungen.
   - Anleitungen zur Speicherkostenschätzung (komprimierte Sicherungsgröße vs. Rohdatenbankgröße-Verhältnis).

3. Speicherung und Sicherheit:
   - Anforderung für externe oder regionenübergreifende Speicherung.
   - Verschlüsselung im Ruhezustand (Sicherungsdateien müssen verschlüsselt sein — bereitstellen des Flags/der Konfiguration für das gewählte Tool).
   - Zugriffskontrolle: Sicherungsanmeldedaten müssen von Anwendungsanmeldedaten getrennt sein.

4. Wiederherstellungsvorgänge:
   - Schritt-für-Schritt-Wiederherstellungsbefehle für die empfohlenen Tools.
   - Wiederherstellung zu einem bestimmten Zeitpunkt (PITR)-Anleitung, falls WAL/Binlog-Archivierung konfiguriert ist.
   - Geschätzter RTO basierend auf Sicherungsgröße und Wiederherstellungsmethode.

5. Sicherungsvalidierung:
   - Wöchentliches Wiederherstellungstestverfahren in einer Staging-Umgebung.
   - Prüfsummen- oder Zeilenzahl-Verifizierungsschritt nach der Wiederherstellung.
   - Benachrichtigungen: was zu überwachen ist (Sicherungsauftragsausgabecode, Sicherungsalter, Sicherungsgrößenanomalie).

6. Runbook-Vorlage:
   - Ein kurzes Incident-Runbook: „Die Datenbank ist weg — was muss ich in den nächsten 15 Minuten tun?"

Geben Sie konkrete Befehle aus, nicht generische Ratschläge. Alle Befehle müssen sofort ausführbar sein oder mit minimaler Variablenersetzung.

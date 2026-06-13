---
name: oncall-runbook
description: "On-Call-Runbooks aus der Vorfallshistorie generieren: häufige Warnmeldungen, Lösungsschritte, Eskalationspfade"
---

# Skill: On-Call-Runbook-Generator

## Wann aktivieren
- Erstellung eines Runbooks für einen neuen Dienst, der in Produktion geht
- Formalisierung von implizitem Wissen, bevor ein Ingenieur aus der On-Call-Rotation ausscheidet
- Generierung von Runbook-Vorlagen aus früheren Vorfallsberichten oder PagerDuty-Verlauf
- Aufbau von Eskalationsbäumen für ein neues Team oder eine neue Dienstgrenze
- Prüfung bestehender Runbooks auf Vollständigkeit und Aktualität
- Einarbeitung eines neuen Ingenieurs in eine On-Call-Rotation

## Wann NICHT verwenden
- Echtzeit-Vorfallsreaktion — stattdessen `/incident-response` verwenden
- Infrastrukturdesign — dafür `/aws-architect`, `/terraform` oder `/kubernetes` verwenden
- Disaster-Recovery-Planung (RPO/RTO, Backup-Strategie) — diese sind von Runbooks getrennt
- Automatisierte Sanierungsskripte — Runbooks dokumentieren, was zu tun ist; Automatisierung ist ein separates Anliegen

## Anweisungen

### Kern-Runbook-Generierung aus der Vorfallshistorie

```
Erstelle ein On-Call-Runbook für den [DIENSTNAME]-Dienst.

Eingaben (so viele wie verfügbar bereitstellen):
- Frühere Vorfallsberichte oder Postmortems: [einfügen oder beschreiben]
- Bestehende PagerDuty-Warnmeldungsnamen: [auflisten]
- Bekannte Fehlermodi, die das Team gesehen hat: [beschreiben]
- Aktuelle manuelle Schritte zur Behebung häufiger Probleme: [beschreiben]
- Dienstarchitektur: [kurze Beschreibung — was er tut, wie er funktioniert, wesentliche Abhängigkeiten]
- SLO für diesen Dienst: [Verfügbarkeitsziel, Latenzziel]

Das Runbook mit folgender Struktur erstellen:

# [DIENSTNAME] On-Call-Runbook

## Dienstübersicht (60-Sekunden-Kontext)
- Was dieser Dienst tut: [ein Satz]
- Wer von ihm abhängt: [vor- und nachgelagerte Dienste, betroffene Kunden]
- Technologie-Stack: [Sprache, Framework, Cloud-Anbieter, Datenbank, Message Queue]
- SLO: [Verfügbarkeit X %, p99-Latenz < Xms]
- Datenklassifizierung: [verarbeitet er PII / Zahlungen / sensible Daten?]
- Eigentümerteam: [Teamname, Slack-Kanal, Eskalationskontakt]

## Architekturdiagramm (Textdarstellung)
[Textfluss zeichnen: externer Traffic → Load Balancer → Dienst → Abhängigkeiten]

## Warnmeldungskatalog
Für jede bekannte Warnmeldung:

### WARNMELDUNG: [Warnmeldungsname aus PagerDuty/Datadog/etc.]
**Schweregrad:** [P1 / P2 / P3]
**Bedeutung:** Was teilt diese Warnmeldung mit? Welcher Schwellenwert wurde überschritten?
**Häufige Ursachen (nach Häufigkeit geordnet):**
1. [Häufigste Ursache — X % der Vorkommen]
2. [Zweithäufigste Ursache]
3. [Seltene, aber ernste Ursache]
**Erste 5 Schritte:**
1. [Schritt — genaue Befehle angeben, nicht „Logs prüfen"]
2. [Schritt mit Befehl: `kubectl logs -n [namespace] -l app=[service] --tail=100`]
3. [Schritt]
4. [Schritt]
5. [Schritt]
**Lösungsmuster:**
- Ursache A → [konkrete Maßnahme] durchführen
- Ursache B → [konkrete Maßnahme] durchführen
- Ursache C → an [Team/Person] eskalieren — nicht selbst beheben versuchen
**Eskalieren wenn:** [Bedingung, die menschliche Hilfe oder Teamunterstützung bedeutet]
**Typische Lösungszeit:** [X–Y Minuten]

## Eskalationspfade

| Schweregrad | Erster Responder | Bei Nichtlösung nach X Min | Nächste Eskalation |
|---|---|---|---|
| P1 | On-Call-Ingenieur | 15 Min | Engineering Lead → CTO |
| P2 | On-Call-Ingenieur | 30 Min | Engineering Lead |
| P3 | On-Call-Ingenieur | Nächster Werktag | — |

Kontaktliste:
- On-Call: [PagerDuty-Rotation]
- Engineering Lead: [Name, Telefon, Slack]
- Datenbankverantwortlicher: [Name / Team, für datenbankbezogene P1s]
- Infrastrukturteam: [Slack-Kanal]
- Sicherheitsteam: [bei Verdacht auf Datenverletzung — sofort kontaktieren]

## Häufige Operationen (kein Vorfall)
[Aufgaben, um die On-Call-Ingenieure außerhalb von Vorfällen gebeten werden könnten:]

### Dienst-Pod neustarten
```bash
kubectl rollout restart deployment/[service-name] -n [namespace]
# Verifizieren: kubectl rollout status deployment/[service-name] -n [namespace]
```

### Aktuelle Fehlerrate prüfen
```bash
# Datadog-Abfrage oder Grafana-Dashboard-Link
# Oder: kubectl-Logs-Befehl
```

### Manuell eine Neubereitstellung auslösen
[Den Prozess beschreiben — ist es eine GitHub Action, ein ArgoCD-Sync oder ein manueller Schritt?]

## Bekannte Fallstricke
Dinge, über die On-Call-Ingenieure zuvor gestolpert sind:
- [Fallstrick 1: z.B. „Den Queue-Consumer während der Spitzenzeiten nicht neustarten — in-flight-Jobs gehen verloren"]
- [Fallstrick 2: z.B. „Die Staging-Umgebung verwendet eine gemeinsame Datenbank — Änderungen dort betreffen andere Teams"]
- [Fallstrick 3]

## Runbook-Änderungsprotokoll
| Datum | Änderung | Autor |
|---|---|---|
| [DATUM] | Ersterstellung | [Name] |

Dieses Runbook mit der bereitgestellten Vorfallshistorie und dem Dienstkontext generieren.
```

### Warnmeldungsspezifische Runbook-Vorlage

```
Erstelle ein detailliertes Runbook für diese spezifische Warnmeldung: [WARNMELDUNGSNAME]

Warnmeldungsquelle: [PagerDuty / Datadog / Prometheus / CloudWatch]
Warnmeldungsdefinition: [Warnmeldungsabfrage oder Schwellenwert einfügen — z.B. „error_rate > 5 % für 5 Minuten"]
Betroffener Dienst: [Dienstname]
Typisches Auftreten: [wann löst diese Warnmeldung normalerweise aus — Spitzentraffic, nach einem Deploy, zufällig?]

Frühere Vorfälle, die durch diese Warnmeldung ausgelöst wurden: [Vorfallshistorie einfügen oder Muster beschreiben]

Einen Entscheidungsbaum für diese Warnmeldung generieren:

## [WARNMELDUNGSNAME] Runbook

### Was diese Warnmeldung bedeutet
[Einfache Sprache — nicht „der Schwellenwert wurde überschritten", sondern was das für Nutzer bedeutet]

### Sofortige Schweregradbeurteilung (erste 2 Minuten)
Fragen:
- Löst diese Warnmeldung allein aus oder feuern verwandte Warnmeldungen? (prüfen: [verwandte Warnmeldungen auflisten])
- Steigt die Fehlerrate, ist sie stabil oder erholt sie sich?
- Gab es in den letzten 30 Minuten einen neuen Deploy? (prüfen: [Speicherort des Deployment-Logs])
- Wurde dies schon einmal gesehen? (prüfen: [Link zur Vorfallshistorie])

### Entscheidungsbaum

```
WARNMELDUNG FEUERT
│
├── Ist dies während oder nach einem Deploy?
│   JA → Deploy-Logs prüfen → Rollback wenn neuer Code den Fehler eingeführt hat
│   NEIN ↓
│
├── Ist die Fehlerrate > 20 %?
│   JA → Engineering Lead sofort anrufen (P1)
│   NEIN ↓
│
├── Steigt die Fehlerrate?
│   JA → P2-Response starten, in 15 Min eskalieren wenn keine Verbesserung
│   STABIL → P3-Untersuchung, bis nächsten Werktag lösen
│
└── Handelt es sich um einen spezifischen Fehlertyp?
    TIMEOUT → [Schritte zur Timeout-Untersuchung]
    5xx → [Schritte zur Server-Fehler-Untersuchung]
    DB → [Schritte zur Datenbankproblem-Untersuchung]
```

### Schrittweise Untersuchung
[Nummerierte Schritte mit genauen Befehlen und was bei jedem Schritt zu suchen ist]

### Lösungs-Playbook
[Für jede häufige Ursache: genaue Lösungsschritte mit Befehlen]

### Nach der Lösung
Nach der Lösung: Was ist zu tun?
- Vorfall in PagerDuty / Slack aktualisieren
- Folgemassnahmen (Ticket erstellen, Stakeholder benachrichtigen, Runbook aktualisieren)
- Postmortem erforderlich? [Ja für P1 / Nach Ermessen des On-Call-Ingenieurs für P2 / Nein für P3]
```

### Runbook-Prüfung

```
Prüfe die Qualität dieses Runbooks: [VORHANDENES RUNBOOK EINFÜGEN]

Jede Sektion bewerten und Lücken identifizieren:

VOLLSTÄNDIGKEITS-CHECKLISTE:
✅ Dienstübersicht mit ausreichend Kontext für einen neuen Ingenieur
✅ Alle bekannten Warnmeldungen dokumentiert (nicht nur die kritischen)
✅ Jede Warnmeldung hat: Bedeutung, häufige Ursachen, schrittweise Lösung
✅ Befehle sind genau (nicht „Logs prüfen" sondern `kubectl logs -n X -l app=Y`)
✅ Eskalationspfade mit tatsächlichen Namen und Kontakten definiert (nicht nur Rollen)
✅ Bekannte Fallstricke und Anti-Muster dokumentiert
✅ Häufige Operationen dokumentiert (Neustart, Skalierung, Rollback)
✅ Runbook in den letzten 90 Tagen aktualisiert (veraltete Runbooks sind gefährlich)

QUALITÄTSSIGNALE:
❌ „Dashboard prüfen" ohne Angabe, welches Dashboard oder wonach zu suchen ist
❌ Schritte, die im Runbook nicht vorhandenes Wissen erfordern
❌ Eskalationspfad sagt „Team kontaktieren" ohne Slack-Kanal oder Kontakt
❌ Kein Hinweis, was NICHT zu tun ist (oft der wichtigste Teil)
❌ Warnmeldungsdefinitionen, die nicht erklären, warum der Schwellenwert wichtig ist

AKTUALITÄTSPRÜFUNG:
Wann wurde dieses Runbook zuletzt aktualisiert? Falls > 90 Tage: jedes Verfahren auf Richtigkeit prüfen.
Verweist es auf Dienste, Teams oder Tools, die sich geändert haben könnten?

Ausgabe: Runbook-Score (1–10), Top-5-Lücken zum Schließen und eine Neuschreibung des schlechtesten Abschnitts.
```

### Runbook aus einem Postmortem

```
Erstelle einen Runbook-Abschnitt aus diesem Postmortem: [POSTMORTEM EINFÜGEN]

Extrahieren:
1. Die Grundursache des Vorfalls
2. Die Erkennungsmethode (wie wurde er entdeckt? Warnmeldung, Kundenbericht, Ingenieur bemerkte es?)
3. Den zeitlichen Verlauf der Lösung (welche Schritte wurden in welcher Reihenfolge unternommen)
4. Was funktioniert hat und was nicht
5. Die abgeschlossenen Folgemassnahmen (um Doppelarbeit zu vermeiden)

In folgendes umwandeln:
- Einen neuen Warnmeldungseintrag im Runbook (wenn die Warnmeldung nicht existierte oder unklar war)
- Oder: einen neuen Abschnitt unter „Bekannte Fallstricke", wenn dies eine wiederkehrende Überraschung war
- Die genauen Befehle, die bei der Lösung verwendet wurden, mit Kommentaren, die erklären warum

Falls das Postmortem eine Überwachungslücke identifiziert: ebenfalls die Warnmeldungsdefinition entwerfen.
```

### On-Call-Einführungsleitfaden

```
Erstelle einen On-Call-Einführungsleitfaden für einen neuen Ingenieur, der zur [DIENST]-Rotation stößt.

Sein Hintergrund: [Senior-Ingenieur / Mid-Level / neu in dieser Codebasis]
Er tritt bei: [erste Einzeldienst / zuerst Shadowing / erste Woche]
Rotationsplan: [Woche an / Woche aus / Follow-the-Sun]

Einen strukturierten Einführungsleitfaden generieren:

## Vor der ersten On-Call-Woche

Tag 1:
- Das vollständige Runbook lesen — Unklares kennzeichnen
- 30 Minuten damit verbringen, die letzten 5 Vorfalls-Postmortems zu lesen
- PagerDuty, Datadog/Grafana und Slack-Benachrichtigungen einrichten
- Bestätigen, dass Zugriff besteht auf: [alle benötigten Systeme auflisten — Cloud-Konsole, Kubernetes, Datenbankleserecht etc.]

Tag 2–3:
- Einen erfahreneren On-Call-Ingenieur für eine vollständige Schicht begleiten (Shadowing)
- Die 2 häufigsten Vorfälle in der Staging-Umgebung reproduzieren (baut Muskelgedächtnis auf)
- Wissen, wo zu finden ist: [Log-Speicherorte, Dashboards, Deployment-Verlauf, Rollback-Prozess]

Vor dem Einzeldienst:
- Jeden Warnmeldungseintrag im Runbook mit einem Senior-Ingenieur durchgehen: „Was würden Sie zuerst tun?"
- Die Eskalationspfade auswendig kennen: Wen ruft man um 3 Uhr morgens für ein P1 an?
- PagerDuty-Benachrichtigungen testen — sich tatsächlich selbst anrufen

## Was bei der ersten Einzeldienstschicht zu tun ist
- Erste 10 Minuten: Dashboard prüfen, bestätigen, dass alle Dienste gesund sind
- Bei einer Warnmeldung: zuerst Runbook, nie Panik
- Im Zweifel: eskalieren. Es ist immer besser, jemanden zu wecken und Unrecht zu haben, als ihn nicht zu wecken und Recht zu haben.
```

## Beispiel

**Nutzer:** Wir haben einen Node.js-API-Dienst namens `billing-service`. Er hatte 3 Vorfälle in den letzten 6 Monaten: (1) Redis-Connection-Pool-Erschöpfung, die 503er verursacht, (2) eine langsame PostgreSQL-Abfrage, die alle Schreibvorgänge blockiert, (3) ein Speicherleck nach einem Deploy, das OOM-Kills verursacht hat. Kein formales Runbook existiert. PagerDuty-Warnmeldungen sind: `billing-service-503-rate-high`, `billing-service-latency-p99-high`, `billing-service-pod-oom`.

**Ausgabe (Auszug):**

```markdown
# billing-service On-Call-Runbook

## Dienstübersicht
billing-service ist die Node.js-API, die alle Zahlungsabwicklungen und Rechnungserstellungen verarbeitet.
Nachgelagert: Kunden-Dashboard, E-Mail-Dienst, Webhook-Lieferung.
SLO: 99,9 % Verfügbarkeit, p99 < 500ms.
Eigentümer: #platform-eng | On-Call: PagerDuty-Rotation "billing-oncall"

## Warnmeldung: billing-service-503-rate-high
**Schweregrad:** P1
**Bedeutung:** Mehr als 1 % der Anfragen geben 503 zurück — Kunden können keine Zahlungen verarbeiten.

**Häufige Ursachen:**
1. Redis-Connection-Pool-Erschöpfung (2x gesehen — tritt bei hohem Traffic oder nach Connection-Leak auf)
2. Upstream-Abhängigkeits-Timeout (Zahlungs-Gateway oder Datenbank)
3. Deployment-Fehler (neue Pods nicht gesund)

**Erste 5 Schritte:**
1. `kubectl get pods -n billing -l app=billing-service` — laufen die Pods?
2. `kubectl logs -n billing -l app=billing-service --tail=200 | grep -i "redis\|connection\|error"` — auf Redis-Fehler achten
3. Redis-Verbindungsanzahl prüfen: `redis-cli -h [host] info clients` — ist `connected_clients` nahe `maxclients`?
4. Bei Redis: `kubectl rollout restart deployment/billing-service -n billing` (setzt Connection-Pool zurück)
5. Wenn Pods nicht laufen: letzten Deploy prüfen — `kubectl rollout history deployment/billing-service -n billing`

**BEKANNTER FALLSTRICK:** billing-service NICHT während eines Zahlungsverarbeitungsfensters neustarten (Freitag 17:00 – Samstag 02:00) — in-flight-Transaktionen werden verwaist. Vor dem Neustart Engineering Lead konsultieren.

**Eskalieren wenn:** 503-Rate > 5 % oder keine Lösung innerhalb von 10 Minuten nach Redis-Neustart.
```

---

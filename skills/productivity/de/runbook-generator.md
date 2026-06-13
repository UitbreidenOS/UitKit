---
name: runbook-generator
description: "Generate runbooks for incidents, deployments, and operational tasks — step-by-step procedures with decision trees, rollback steps, and escalation paths"
---

# Fähigkeit Runbook-Generator

## Wann aktivieren
- Erstellen eines Runbooks für eine wiederkehrende operative Aufgabe
- Dokumentation von Incident-Response-Verfahren, bevor ein Incident auftritt
- Schreiben eines Deployment-Runbooks für ein komplexes Release
- Aufbau eines On-Call-Handbuchs für neue Ingenieure
- Umwandlung informeller Stammeswissenschaft in dokumentierte Verfahren

## Wann NICHT verwenden
- Einmalige Aufgaben — nur dokumentieren wert, wenn es wieder passiert
- Explorative Debuggen — Runbooks sind für bekannte Fehlermodi
- Plattformspezifische Runbooks (AWS Console-Schritte) — mit aktueller UI überprüfen

## Anweisungen

### Incident-Response-Runbook

```
Generieren Sie ein Incident-Response-Runbook für [Fehlermodus].

Fehlermodus: [was bricht — z.B. « Datenbankverbindungspool erschöpft », « Payment-Service-Timeout », « Disk full »]
Betroffener Service: [welcher Service/System]
Symptome (was On-Call sieht): [ausgelöste Alerts / Benutzerberichte / Dashboards]
Schweregrad: [P1 kritisch / P2 größer / P3 geringfügig]

Runbook-Struktur:
1. Zusammenfassung: was dieses Runbook in 1-2 Sätzen abdeckt
2. Symptome: exakte Alert-Namen + was Benutzer erleben
3. Initial Triage (< 5 Minuten):
   - Passiert dies wirklich? (verifizieren)
   - Wie groß ist der Blast-Radius? (wie viele Benutzer betroffen)
   - Ist dies ein neues Deployment? (Rollback-Überlegung)
4. Untersuchungsschritte (sortiert, mit erwarteten Ausgaben):
   - Schritt 1: [Befehl/Überprüfung → was Sie erwarten zu sehen]
   - Schritt 2: [Befehl/Überprüfung → Entscheidungspunkt]
5. Mitigationsoptionen (schnellste bis langsamste):
   - Option A: [schnelle Fehlerbehebung, vorübergehend]
   - Option B: [mittlere Fehlerbehebung]
   - Option C: [ordentliche Fehlerbehebung, erfordert Deployment]
6. Rollback-Verfahren (wenn durch Deployment verursacht):
   - [exakte Schritte]
7. Nach dem Incident: [was vor Schließung überprüfen]
8. Eskalation: [wann wen anrufen]
```

### Deployment-Runbook

```
Generieren Sie ein Deployment-Runbook für [Service/Funktion].

Service: [Name]
Deployment-Typ: [rolling / blue-green / canary / all-at-once]
Risikostufe: [niedrig / mittel / hoch]
Abhängigkeiten: [Services, die vor/nach aktualisiert werden müssen]
Datenbankmigrationen: [ja/nein — beschreiben, wenn ja]

Runbook-Struktur:
1. Pre-Deployment-Checkliste (30-60 Min vorher):
   □ Alle Tests bestanden in CI?
   □ Migration auf Staging getestet?
   □ Rollback-Plan dokumentiert?
   □ Team benachrichtigt (wenn hohes Risiko)?
   □ Überwachungs-Dashboards offen?

2. Deployment-Schritte (exakte Befehle oder UI-Schritte):
   Schritt 1: [Aktion] → Erwartete Ausgabe: [X]
   Schritt 2: [Aktion] → Überprüfen: [Überprüfung Y]
   
3. Validierung (unmittelbar nach Deployment):
   □ Health-Endpoint gibt 200 zurück?
   □ Error-Rate im normalen Bereich?
   □ Wichtige Benutzer-Flows arbeiten? (Smoke-Test)
   □ Datenbankmigration bereinigt?

4. Rollback-Verfahren (wenn etwas schiefgeht):
   Schritt 1: [exakte Rollback-Befehl]
   Schritt 2: [Datenbankrollback wenn nötig]
   Entscheidungspunkt: Rollback vs. Hotfix?

5. Post-Deployment (1 Stunde danach):
   □ Error-Rates stabil?
   □ Performance-Metriken normal?
   □ Deployment-Problem/Ticket schließen
```

### Operative Aufgaben-Runbook

```
Generieren Sie ein Runbook für diese wiederkehrende operative Aufgabe.

Aufgabe: [beschreiben — z.B. « monatliche Datenbankbackup-Verifizierung », « SSL-Zertifikat-Erneuerung », « quartalsweise Zugangsüberprüfung »]
Häufigkeit: [täglich / wöchentlich / monatlich / quartalsweise / ad-hoc]
Wer führt aus: [Rolle — beliebig Ingenieur / Senior-Ingenieur / DBA / DevOps]
Ungefähre Zeit: [X Minuten]

Abschnitte:
1. Zweck: warum diese Aufgabe existiert, was bricht, wenn übersprungen
2. Voraussetzungen: erforderlicher Zugriff/Berechtigungen, erforderliche Tools
3. Schritte: nummeriert, mit exakten Befehlen und erwarteten Ausgaben
4. Verifikation: wie Aufgabenvervollständigung bestätigen
5. Fehlerbehandlung: was tun, wenn ein Schritt fehlschlägt
6. Dokumentation: wo Vervollständigung protokollieren (Ticket / Spreadsheet / Runbook-Tool)

Machen Sie es ausführbar von jemandem, der das System nicht kennt.
```

### On-Call-Handbuch-Abschnitt

```
Schreiben Sie einen On-Call-Handbuch-Abschnitt für [Team/Service].

Zielgruppe: Ingenieur, der zum ersten Mal on-Call geht
Service-Kontext: [beschreiben, was der Service macht und wer ihn nutzt]

Abdecken:
1. Wofür Sie verantwortlich sind (und wofür NICHT)
2. Wie man einen Alert in den ersten 5 Minuten triage
3. Kommunikationserwartungen (wann Incident-Kanal aktualisieren, wen einbeziehen)
4. Eskalationsmatrix: [Rolle] → [Kontakt] → [wann eskalieren]
5. Die 3 häufigsten Alerts und was für jeden tun
6. Tools, die Sie benötigen: [Liste mit Links]
7. Was nach Incident-Schließung tun (Post-Mortem-Auslöser, Ticket-Bereinigung)
8. Überlebenstipps (vom Team, das dies schrieb)
```

## Beispiel

**Benutzer:** Generieren Sie ein Runbook für die « hohe Speichernutzung »-Alert auf unserer Node.js API.

**Claude generiert:**

---
**RUNBOOK: Hohe Speichernutzung — Node.js API**
*Schweregrad: P2 (P1 wenn OOMKilled)*

**Symptome:**
- Alert: `api_memory_usage_percent > 85` für > 10 Minuten
- Benutzerauswirkung: potenzielle Verlangsamungen oder Neustarts wenn Speicher Limit erreicht

**Triage (erste 5 Minuten):**
1. `kubectl top pods -n production | grep api` → Betrifft dies einen Pod oder alle Pods?
2. `kubectl logs [betroffener-Pod] --tail=200 | grep -i "memory\|heap\|gc"` → Irgendwelche GC-Logs?
3. Deployment-Verlauf überprüfen: `kubectl rollout history deployment/api` → Begann dies nach einem Deployment?

**Wenn einzelner Pod:**
```bash
kubectl delete pod [betroffener-Pod]  # Pod startet mit frischem Speicher neu
```
Überwachen: steigt Speicher innerhalb von 30 Min erneut an? → wahrscheinlich Speicherleck, eskalieren.

**Wenn alle Pods (systemisch):**
- Überprüfen auf neueste Traffic-Spitze: RPS auf Dashboard ansehen
- Wenn Traffic-Spitze: hochskalieren `kubectl scale deployment api --replicas=X`
- Wenn kein Traffic-Spitze: dies ist ein Speicherleck, Senior-Ingenieur anrufen

**Rollback-Auslöser:** Wenn Speicherproblem nach heutigem Deployment begann:
```bash
kubectl rollout undo deployment/api
```

**Eskalation:** Wenn Speicher > 90% nach Neustart bleibt UND kein Deployment → On-Call Senior-Ingenieur anrufen.

---

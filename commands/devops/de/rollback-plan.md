---
description: Erstellen Sie einen schrittweisen Rollback-Plan für die aktuelle Bereitstellung oder eine kürzliche Änderung
argument-hint: "[Dienstname, Version oder PR/Commit zum Rollback]"
---
Erstellen Sie einen Rollback-Plan für: $ARGUMENTS

Überprüfen Sie das Projekt, um den Bereitstellungsmechanismus (Kubernetes, ECS, Heroku, bare VM, Lambda, etc.), die CI/CD-Pipeline und alle zustandsbehafteten Komponenten (Datenbanken, Warteschlangen, Caches, Feature Flags) zu bestimmen.

Erstellen Sie ein Runbook mit folgenden Abschnitten:

**1. Pre-Rollback-Checkliste**
- Bestätigen Sie die Zielversion/Revision zum Rollback (Image-Tag, Git-SHA, Helm-Revision)
- Ermitteln Sie, wer vor der Ausführung genehmigen muss (On-Call-Lead, Incident Commander)
- Überprüfen Sie, dass das vorherige Artefakt noch in der Registry/Store vorhanden ist — wenn nicht, sofort kennzeichnen
- Listen Sie alle seit der vorherigen Version angewendeten Schema-Migrationen auf (irreversible blockieren ein sauberes Rollback)

**2. Auswirkungsanalyse**
- Geschätzte Ausfallzeit oder beeinträchtigtes Fenster während des Rollback
- Welche Benutzer/Mandanten/Regionen sind betroffen
- Alle Daten, die seit der fehlerhaften Bereitstellung geschrieben wurden und möglicherweise mit dem vorherigen Schema inkompatibel sind

**3. Rollback-Schritte** (nummeriert, Copy-Paste-ready Befehle)

Für Kubernetes:
```
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
kubectl get pods -n <namespace> -w
```

Für Helm:
```
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace>
```

Für Datenbank-Migrationen: Geben Sie den genauen Down-Migration-Befehl an oder vermerken Sie, dass eine manuelle Schema-Rückgängigmachung erforderlich ist, und geben Sie an, welche SQL ausgeführt werden muss.

Für Feature Flags: Listen Sie auf, welche Flags vor oder nach dem Binary-Rollback deaktiviert werden müssen.

**4. Verifikationsschritte**
- Smoke-Test-Befehle oder URLs, um zu bestätigen, dass der Dienst in der vorherigen Version fehlerfrei ist
- Wichtige Metriken zum Überwachen für 10 Minuten nach dem Rollback (Fehlerrate, Latenz p99, Warteschlangentiefe)

**5. Abbruchkriterien**
- Bedingungen, unter denen das Rollback selbst gestoppt und eskaliert werden sollte
- Fallback, wenn das Rollback fehlschlägt (z. B. Traffic-Verschiebung zu einer bekannten guten Region)

**6. Post-Rollback-Aktionen**
- Öffnen Sie ein Tracking-Problem für die Ursachenanalyse
- Bewahren Sie Protokolle und Traces aus dem Incident-Fenster auf, bevor sie ablaufen
- Zeitplan für den Versuch, die Korrektur erneut bereitzustellen

Kennzeichnen Sie jeden Schritt, der nicht automatisiert werden kann und Menschenurteil oder erweiterte Zugriffsrechte erfordert.

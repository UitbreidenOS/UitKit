---
description: Erstellen Sie einen schrittweisen Rollback-Plan für die aktuelle Bereitstellung oder kürzliche Änderung
argument-hint: "[service name, version, or PR/commit to roll back]"
---
Erstellen Sie einen Rollback-Plan für: $ARGUMENTS

Untersuchen Sie das Projekt, um den Bereitstellungsmechanismus (Kubernetes, ECS, Heroku, Bare-VM, Lambda usw.), die CI/CD-Pipeline und alle zustandsbehafteten Komponenten (Datenbanken, Warteschlangen, Caches, Feature Flags) zu bestimmen.

Erstellen Sie ein Runbook mit den folgenden Abschnitten:

**1. Pre-Rollback-Checkliste**
- Bestätigen Sie die frühere Zielversion/Revision, zu der Sie Rollback durchführen möchten (Image-Tag, Git-SHA, Helm-Revision)
- Identifizieren Sie, wer die Ausführung genehmigen muss (On-Call-Lead, Incident Commander)
- Überprüfen Sie, ob das vorherige Artefakt noch in der Registrierung/dem Store vorhanden ist – falls nicht, sofort gekennzeichnet
- Listen Sie alle Schemamigrationem auf, die seit der vorherigen Version angewendet wurden (irreversible blockieren einen sauberen Rollback)

**2. Auswirkungsbewertung**
- Geschätzte Ausfallzeit oder degradiertes Fenster während des Rollbacks
- Welche Benutzer/Mandanten/Regionen sind betroffen
- Alle Daten, die seit der schlechten Bereitstellung geschrieben wurden und möglicherweise mit dem vorherigen Schema nicht kompatibel sind

**3. Rollback-Schritte** (nummeriert, Copy-Paste-ready-Befehle)

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

Für Datenbankmigrationem: Geben Sie den genauen Down-Migration-Befehl an oder notieren Sie, dass eine manuelle Schema-Umkehrung erforderlich ist, und geben Sie an, welches SQL ausgeführt werden muss.

Für Feature Flags: Listen Sie auf, welche Flags vor oder nach dem Binary-Rollback ausgeschaltet werden müssen.

**4. Verifikationsschritte**
- Smoke-Test-Befehle oder URLs, um zu bestätigen, dass der Service auf der vorherigen Version sicher ist
- Wichtige Metriken, die 10 Minuten nach dem Rollback zu beobachten sind (Fehlerrate, Latenz p99, Warteschlangentiefe)

**5. Abbruchkriterien**
- Bedingungen, unter denen der Rollback selbst gestoppt und eskaliert werden sollte
- Fallback, wenn Rollback fehlschlägt (z. B. Traffic-Umschaltung zu einer bekannten guten Region)

**6. Post-Rollback-Maßnahmen**
- Öffnen Sie ein Tracking-Problem für die Grundursachenanalyse
- Bewahren Sie Protokolle und Traces aus dem Incident-Fenster auf, bevor sie ablaufen
- Zeitrahmen für einen erneuten Deploy-Versuch mit dem Fix

Kennzeichnen Sie jeden Schritt, der nicht automatisiert werden kann und menschliches Urteil oder erhöhten Zugriff erfordert.

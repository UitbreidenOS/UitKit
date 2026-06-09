---
description: Erstelle ein wiederverwendbares Terraform-Modul für die beschriebene Infrastrukturkomponente
argument-hint: "[component: e.g. vpc, rds, ecs-service, s3-bucket]"
---
Erstelle ein produktionsreifes Terraform-Modul für: $ARGUMENTS

Zielerprovider: Leite den Provider aus dem Kontext ab (AWS/GCP/Azure) oder verwende standardmäßig AWS, wenn unklar. Verwende die neueste stabile Providerversion.

Generiere die folgende Dateistruktur:
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimal — inputs/outputs table only)
```

Standards zum Befolgen:

`versions.tf`:
- Fixiere die Terraform `required_version` auf `>= 1.5`
- Fixiere die Providerversion mit einer `~>` Einschränkung auf die neueste Minor-Version

`variables.tf`:
- Jede Variable hat eine `description` und einen `type` — keine `any` Typen
- Verwende `validation` Blöcke für Werte mit bekannten Einschränkungen (CIDR-Bereiche, erlaubte Instanztypen, Tag-Formate)
- Sensible Variablen als `sensitive = true` markiert
- Stelle `default` nur dann bereit, wenn ein sicherer, breit anwendbarer Wert existiert — lasse erforderliche Eingaben ohne Standards

`main.tf`:
- Wende Standard-Tags/Labels an: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Verwende `for_each` statt `count` für Multi-Instanz-Ressourcen
- Keine hardcodierten Region, Account-ID oder ARN — leite diese von Datenquellen ab (`aws_caller_identity`, `aws_region`)
- Aktiviere Verschlüsselung ruhender Daten auf allen Speicherressourcen
- Aktiviere Löschschutz auf zustandsbehafteten Ressourcen (RDS, DynamoDB) — exponiere als Variable mit Standard `true`

`outputs.tf`:
- Exportiere die Ressourcen-ID, ARN (falls zutreffend) und alle Endpunkt-/DNS-Namen, die Verbraucher benötigen
- Markiere sensible Ausgaben als `sensitive = true`

Nach dem Dateiinhalt ausgeben:
1. Beispiel `module {}` Block zeigt, wie ein Root-Modul dieses aufruft
2. Alle IAM-Berechtigungen, die die Terraform-Ausführungsrolle benötigt, um diese Ressourcen zu verwalten
3. Bekannte Gotchas beim Löschen (z.B. nicht leere S3-Buckets, RDS-Snapshot-Anforderungen)

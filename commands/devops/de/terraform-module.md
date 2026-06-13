---
description: Gerüst für ein wiederverwendbares Terraform-Modul für die beschriebene Infrastruktur-Komponente
argument-hint: "[component: z.B. vpc, rds, ecs-service, s3-bucket]"
---
Gerüst für ein produktionsreifes Terraform-Modul für: $ARGUMENTS

Ziel-Provider: Aus dem Kontext ableiten (AWS/GCP/Azure) oder auf AWS als Standard setzen, falls mehrdeutig. Neueste stabile Provider-Version verwenden.

Folgende Dateistruktur generieren:
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimal — nur Eingabe-/Ausgabetabelle)
```

Zu befolgende Standards:

`versions.tf`:
- Terraform `required_version` auf `>= 1.5` festlegen
- Provider-Version mit einer `~>` Constraint auf die neueste Minor-Version festlegen

`variables.tf`:
- Jede Variable hat eine `description` und einen `type` — keine `any` Typen
- `validation` Blöcke für Werte mit bekannten Constraints verwenden (CIDR-Bereiche, erlaubte Instance-Typen, Tag-Formate)
- Sensitive Variablen mit `sensitive = true` markieren
- `default` nur bereitstellen, wenn ein sicherer, allgemein anwendbarer Wert existiert — erforderliche Eingaben ohne Defaults lassen

`main.tf`:
- Standard-Tags/Labels anwenden: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- `for_each` über `count` für Multi-Instance-Ressourcen bevorzugen
- Keine hardcodierten Region, Account-ID oder ARN — aus Data Sources ableiten (`aws_caller_identity`, `aws_region`)
- Verschlüsselung im Ruhezustand auf allen Speicher-Ressourcen aktivieren
- Löschschutz auf Stateful-Ressourcen (RDS, DynamoDB) aktivieren — als Variable exposieren, Standard `true`

`outputs.tf`:
- Ressourcen-ID, ARN (falls zutreffend) und alle Endpoint/DNS-Namen exportieren, die Consumer benötigen
- Sensitive Outputs mit `sensitive = true` markieren

Nach dem Dateiinhalt ausgeben:
1. Beispiel `module {}` Block, der zeigt, wie ein Root-Modul dieses Modul aufruft
2. IAM-Berechtigungen, die die Terraform-Ausführungsrolle benötigt, um diese Ressourcen zu verwalten
3. Bekannte Gotchas beim Zerstören (z.B. nicht-leere S3-Buckets, RDS-Snapshot-Anforderungen)

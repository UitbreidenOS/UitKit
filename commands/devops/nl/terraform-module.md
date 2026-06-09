---
description: Steiger een herbruikbare Terraform-module voor het beschreven infrastructuuronderdeel
argument-hint: "[component: e.g. vpc, rds, ecs-service, s3-bucket]"
---
Steiger een production-grade Terraform-module voor: $ARGUMENTS

Doelprovider: afleiden uit context (AWS/GCP/Azure) of standaard naar AWS als onduidelijk. Gebruik de nieuwste stabiele providerversie.

Genereer de volgende bestandsstructuur:
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimaal — alleen invoer/uitvoer tabel)
```

Normen om te volgen:

`versions.tf`:
- Pin Terraform `required_version` naar `>= 1.5`
- Pin providerversie met een `~>` constraint naar de nieuwste minor

`variables.tf`:
- Elke variabele heeft een `description` en `type` — geen `any` typen
- Gebruik `validation` blocks voor waarden met bekende beperkingen (CIDR-bereiken, toegestane instantietypen, taglabels)
- Gevoelige variabelen gemarkeerd als `sensitive = true`
- Geef `default` alleen wanneer een veilige, breed toepasselijke waarde bestaat — laat vereiste invoer zonder defaults

`main.tf`:
- Pas standaard tags/labels toe: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Gebruik `for_each` in plaats van `count` voor multi-instance resources
- Geen hardcoded regio, account ID of ARN — afleiden uit data sources (`aws_caller_identity`, `aws_region`)
- Activeer versleuteling in rust op alle opslagresources
- Activeer verwijderingsbescherming op stateful resources (RDS, DynamoDB) — expose als variabele standaard naar `true`

`outputs.tf`:
- Exporteer de resource ID, ARN (indien van toepassing) en alle endpoint/DNS-namen die consumers nodig hebben
- Markeer gevoelige outputs als `sensitive = true`

Na de bestandsinhoud, output:
1. Voorbeeld `module {}` block toonend hoe een root module dit zou aanroepen
2. Alle IAM-machtigingen die de Terraform-uitvoeringsrol nodig heeft om deze resources te beheren
3. Bekende destroy-time gotchas (bijv. niet-lege S3-buckets, RDS snapshot vereisten)

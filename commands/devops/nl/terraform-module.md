---
description: Genereer een herbruikbare Terraform module voor het beschreven infrastructuuronderdeel
argument-hint: "[component: bv. vpc, rds, ecs-service, s3-bucket]"
---
Genereer een productie-grade Terraform module voor: $ARGUMENTS

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
- Zet Terraform `required_version` vast op `>= 1.5`
- Zet providerversie vast met een `~>` beperking naar de nieuwste minor

`variables.tf`:
- Elke variabele heeft een `description` en `type` — geen `any` typen
- Gebruik `validation` blokken voor waarden met bekende beperkingen (CIDR bereiken, toegestane instance types, tag formaten)
- Gevoelige variabelen gemarkeerd met `sensitive = true`
- Bied `default` alleen waar een veilige, breed toepasselijke waarde bestaat — laat vereiste invoeren zonder standaardwaarden

`main.tf`:
- Pas standaard tags/labels toe: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Gebruik `for_each` boven `count` voor multi-instance resources
- Geen hard-coded regio, account ID of ARN — haal af van data sources (`aws_caller_identity`, `aws_region`)
- Schakel encryptie in rust in op alle opslagresources
- Schakel deletiebeveiliging in op stateful resources (RDS, DynamoDB) — exposeer als variabele met standaard `true`

`outputs.tf`:
- Exporteer de resource ID, ARN (indien van toepassing), en alle endpoint/DNS namen die consumenten nodig hebben
- Markeer gevoelige outputs als `sensitive = true`

Na de bestandsinhoud, uitvoer:
1. Voorbeeld `module {}` blok dat laat zien hoe een root module deze aanroept
2. IAM-machtigingen die de Terraform uitvoeringsrol nodig heeft om deze resources te beheren
3. Bekende gotchas op verwijderingstijd (bv. niet-lege S3 buckets, RDS snapshot vereisten)

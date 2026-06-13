# Terraform-regels

## Van toepassing op
Alle Terraform-bestanden (`*.tf`, `*.tfvars`) en OpenTofu-configuraties.

## Regels

1. **Gebruik externe status met statusvergrendeling** — bewaar `terraform.tfstate` nooit in versiebeheer. Gebruik S3 + DynamoDB, GCS, of Terraform Cloud. Status bevat plaintext-geheimen en gelijktijdige applies beschadigen lokale status.

2. **Pin provider- en module-versies** — `version = "~> 5.0"` niet `version = "latest"`. Losse providers breken applies op upstream-releases. Voer `terraform init -upgrade` opzettelijk uit, niet per ongeluk.

3. **Commit `*.tfvars`-bestanden met geheimen nooit** — gebruik omgevingsvariabelen (`TF_VAR_*`), een secrets manager-integratie, of Vault. Voeg `*.tfvars` toe aan `.gitignore` voor omgevingen met gevoelige waarden.

4. **Scheid status per omgeving** — `dev/`, `staging/`, `prod/` hebben elk hun eigen state backend-configuratie. Een `terraform destroy` in dev mag productie nooit aanraken.

5. **Gebruik modules voor herbruikbare infrastructuurpatronen** — een module moet één samenhangend onderdeel vertegenwoordigen (VPC, EKS-cluster, RDS-instantie). Kopieer niet zomaar resourceblokken tussen omgevingen; parameteriseer ze.

6. **Voer altijd `terraform plan` uit in CI vóór `apply`** — de plan-uitvoer is de changeset. Controleer het. Maak de pipeline niet als het plan onverwachte verwijderingen toont.

7. **Markeer gevoelige outputs met `sensitive = true`** — voorkomt dat waarden worden weergegeven in `terraform plan`/`apply`-uitvoer en in CI-logboeken.

8. **Gebruik `lifecycle { prevent_destroy = true }` op stateful resources** — databases, S3-buckets met gegevens, en KMS-sleutels mogen niet per ongeluk worden verwijderd door een plan. Maak verwijdering een opzettelijke actie.

9. **Noem resources met environment-prefix en een consistente suffix-conventie** — `prod-payments-rds` niet `database`. Ondubbelzinnige namen overleven via AWS-consoles, logs, en factureringsverdeling.

10. **Gebruik `data`-bronnen voor reeds bestaande resources, `resource` voor beheerde** — het importeren van een VPC die je niet met Terraform hebt gemaakt in een `resource`-blok maakt Terraform de bron van waarheid voor iets dat het niet volledig bezit.

11. **Valideer en format in CI** — `terraform validate` vangt configuratiefouten op. `terraform fmt -check` forceert canonieke opmaak. Beide zouden de build niet moeten slagen als ze mislukken.

12. **Gebruik `for_each` in plaats van `count` voor resourcecollecties** — `count` gebruikt positieindex; het verwijderen van index 0 verschuift alle anderen. `for_each` gebruikt stabiele mapsleutels en vermijdt onbedoelde vervangingen.

13. **Documenteer variabelen met `description` en stel types expliciet in** — `type = string` niet impliciet. `description` wordt weergegeven in `terraform-docs`-uitvoer en in de Terraform Cloud-UI.

14. **Controleer `terraform plan`-uitvoer voor `forces replacement`** — een resourcevervanging vernieuwt en helemaakt opnieuw. Voor stateful resources (databases, IP's) is dit bijna altijd verkeerd en vereist expliciet verwerking.

15. **Gebruik `moved`-blokken bij het refactoren van resource-adressen** — het hernoemen van een resource zonder een `moved`-blok veroorzaakt een vernieuwing + creatie. Het `moved`-blok instructie Terraform om status veilig te migreren.


---

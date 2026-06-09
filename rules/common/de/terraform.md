# Terraform-Regeln

## Anwendungsbereich
Alle Terraform-Dateien (`*.tf`, `*.tfvars`) und OpenTofu-Konfigurationen.

## Regeln

1. **Nutze Remote State mit State Locking** — speichere `terraform.tfstate` niemals in der Versionskontrolle. Verwende S3 + DynamoDB, GCS oder Terraform Cloud. Der State enthält unverschlüsselte Secrets und gleichzeitige Applies beschädigen den lokalen State.

2. **Pin Provider und Modul-Versionen** — `version = "~> 5.0"` nicht `version = "latest"`. Ungepinnte Provider brechen Applies bei Upstream-Releases still ab. Führe `terraform init -upgrade` bewusst aus, nicht versehentlich.

3. **Commit niemals `*.tfvars`-Dateien mit Secrets** — nutze Umgebungsvariablen (`TF_VAR_*`), eine Secrets-Manager-Integration oder Vault. Füge `*.tfvars` zu `.gitignore` für Umgebungen mit sensiblen Werten hinzu.

4. **Separater State pro Umgebung** — `dev/`, `staging/`, `prod/` erhalten jeweils ihre eigene State-Backend-Konfiguration. Ein `terraform destroy` in dev darf production niemals berühren.

5. **Nutze Module für wiederverwendbare Infrastrukturmuster** — ein Modul sollte eine kohärente Einheit darstellen (VPC, EKS-Cluster, RDS-Instanz). Kopiere Resource-Blöcke nicht über Umgebungen hinweg; parametrisiere sie.

6. **Führe immer `terraform plan` in CI vor `apply` aus** — die Plan-Ausgabe ist das Changeset. Überprüfe es. Breche die Pipeline ab, wenn der Plan unerwartete Löschungen zeigt.

7. **Markiere sensible Outputs mit `sensitive = true`** — verhindert, dass Werte in der `terraform plan`/`apply`-Ausgabe und in CI-Logs erscheinen.

8. **Nutze `lifecycle { prevent_destroy = true }` bei zustandsbehafteten Ressourcen** — Datenbanken, S3-Buckets mit Daten und KMS-Keys sollten nicht versehentlich durch einen Plan zerstört werden. Mache Destruktion zu einer bewussten Aktion.

9. **Benenne Ressourcen mit Umgebungspräfix und einer konsistenten Suffix-Konvention** — `prod-payments-rds` nicht `database`. Eindeutige Namen überleben über AWS-Konsolen, Logs und Abrechnungsaufschlüsselungen.

10. **Nutze `data`-Quellen für bereits vorhandene Ressourcen, `resource` für verwaltete** — das Importieren einer VPC, die du nicht mit Terraform erstellt hast, in einen `resource`-Block macht Terraform zur Quelle der Wahrheit für etwas, das es nicht vollständig besitzt.

11. **Validiere und formatiere in CI** — `terraform validate` erfasst Konfigurationsfehler. `terraform fmt -check` erzwingt kanonische Formatierung. Beide sollten den Build nicht bestehen lassen, wenn sie fehlschlagen.

12. **Nutze `for_each` über `count` für Ressourcensammlungen** — `count` nutzt positionalen Index; das Löschen von Index 0 verschiebt alle anderen. `for_each` nutzt stabile Map-Keys und vermeidet unbeabsichtigte Ersetzungen.

13. **Dokumentiere Variablen mit `description` und setze Typen explizit** — `type = string` nicht implizit. `description` erscheint in der `terraform-docs`-Ausgabe und in der Terraform Cloud UI.

14. **Überprüfe die `terraform plan`-Ausgabe auf `forces replacement`** — eine Ressourcen-Ersetzung zerstört und erstellt neu. Für zustandsbehaftete Ressourcen (Datenbanken, IPs) ist dies fast immer falsch und erfordert explizite Behandlung.

15. **Nutze `moved`-Blöcke beim Refaktorieren von Ressourcenadressen** — das Umbenennen einer Ressource ohne `moved`-Block verursacht ein Destroy + Create. Der `moved`-Block instruiert Terraform, den State sicher zu migrieren.


---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir bauen KI-Produkte und B2B-Lösungen mit Developer Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

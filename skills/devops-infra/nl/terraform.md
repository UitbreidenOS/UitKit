> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../terraform.md).

# Terraform Skill

## Wanneer te activeren
- Terraform-modules schrijven voor AWS-, GCP- of Azure-infrastructuur
- VPC's, subnets, security groups en netwerkresources definiëren
- Compute-resources inrichten (EC2, GKE, AKS, ECS, Lambda)
- Database-infrastructuur beheren (RDS, Cloud SQL, Aurora)
- IAM-rollen, -beleid en serviceaccounts instellen
- Remote state-configuratie schrijven (S3 backend, GCS, Terraform Cloud)
- Bestaande Terraform refactoren om modules te gebruiken
- CI/CD-pipelines schrijven voor `terraform plan` en `terraform apply`
- Bestaande infrastructuur importeren in de Terraform-state

## Wanneer NIET te gebruiken
- Pulumi, CDK, of Crossplane — andere IaC-tools, andere patronen
- Helm chart-configuratie (gebruik in plaats daarvan de Kubernetes skill)
- Configuratie op applicatieniveau (Kubernetes ConfigMaps, app-omgevingsvariabelen)
- Eenmalige CLI-operaties die niet herhaald worden

## Instructies

### Module-structuur
Elk Terraform-project moet deze structuur volgen:
```
infrastructure/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   └── compute/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── production/
│   │   ├── main.tf          ← roept modules aan
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── staging/
│       └── ...
└── versions.tf              ← root provider-versies
```

### State-beheer — altijd remote
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "production/networking/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```
- Gebruik nooit lokale state voor gedeelde zaken
- Schakel encryptie en state-locking in (DynamoDB voor S3 backend)
- Aparte state-bestanden per omgeving en per module (niet één grote state)

### Variabelen en outputs discipline
```hcl
# variables.tf — altijd description en type opnemen
variable "environment" {
  description = "Deployment environment (production, staging, development)"
  type        = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

# outputs.tf — alles outputten wat een gebruikende module nodig kan hebben
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}
```

### Secrets — nooit in state of code
- Zet nooit secrets in `terraform.tfvars` of hardcode ze in `.tf`-bestanden
- Gebruik `data "aws_secretsmanager_secret_version"` of `data "google_secret_manager_secret_version"` om secrets te lezen bij apply
- Gevoelige outputs: markeer met `sensitive = true` om te onderdrukken in plan-output
- `.gitignore` moet bevatten: `*.tfvars`, `*.tfstate`, `*.tfstate.backup`, `.terraform/`

### Naamconventies voor resources
```hcl
# Consistente naamgeving: {project}-{environment}-{resource}-{suffix}
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = {
    Name        = "${var.project}-${var.environment}-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```
Tag elke resource altijd met `Environment` en `ManagedBy = "terraform"`.

### Plan voor apply — altijd
- CI/CD-pipeline: `terraform plan -out=tfplan` bij PR, `terraform apply tfplan` bij merge
- Voer nooit `terraform apply` uit zonder een opgeslagen plan in productie
- Gebruik `-target` spaarzaam — het creëert drift tussen werkelijke state en plan

### Veelvoorkomende valkuilen
- `terraform destroy` zonder `-target` vernietigt alles — bevestig altijd de reikwijdte
- Een resource-attribuut wijzigen dat vervanging forceert (bijv. VPC CIDR) verwijdert en herschept — controleer plan zorgvuldig
- Provider versie-pinning is verplicht: gebruik `~> 5.0` niet `>= 5.0`
- `count` vs `for_each`: gebruik `for_each` met maps — `count` veroorzaakt index-drift wanneer items worden verwijderd

## Voorbeeld

**Gebruiker:** Maak een Terraform-module voor een private RDS PostgreSQL-instantie op AWS met Multi-AZ, versleutelde opslag en een toegewijd security group.

**Verwachte outputstructuur:**
- `modules/rds/main.tf` — `aws_db_instance`, `aws_db_subnet_group`, `aws_security_group`
- `modules/rds/variables.tf` — instantieklasse, engine-versie, db-naam, VPC/subnet-ID's, ingress CIDR
- `modules/rds/outputs.tf` — endpoint, port, security group ID
- Security group: staat PostgreSQL (5432) alleen toe vanuit app security group, geen publieke toegang
- `storage_encrypted = true`, `multi_az = true`, `deletion_protection = true` voor productie
- Wachtwoord via `aws_secretsmanager_secret`-referentie, nooit hardcoded

---

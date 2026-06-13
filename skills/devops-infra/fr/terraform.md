> 🇫🇷 This is the French translation. [English version](../terraform.md).

# Compétence Terraform

## Quand activer
- Rédiger des modules Terraform pour l'infrastructure AWS, GCP, ou Azure
- Définir des VPCs, sous-réseaux, groupes de sécurité et ressources réseau
- Provisionner des ressources de calcul (EC2, GKE, AKS, ECS, Lambda)
- Gérer l'infrastructure de bases de données (RDS, Cloud SQL, Aurora)
- Configurer des rôles IAM, des politiques et des comptes de service
- Rédiger la configuration de l'état distant (backend S3, GCS, Terraform Cloud)
- Refactoriser du Terraform existant pour utiliser des modules
- Rédiger des pipelines CI/CD pour `terraform plan` et `terraform apply`
- Importer de l'infrastructure existante dans l'état Terraform

## Quand NE PAS utiliser
- Pulumi, CDK, ou Crossplane — outils IaC différents, patterns différents
- Configuration de charts Helm (utiliser la compétence Kubernetes à la place)
- Configuration au niveau applicatif (Kubernetes ConfigMaps, variables d'environnement d'app)
- Opérations CLI ponctuelles qui ne seront pas répétées

## Instructions

### Structure des modules
Chaque projet Terraform doit suivre cette structure :
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
│   │   ├── main.tf          ← appelle les modules
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── staging/
│       └── ...
└── versions.tf              ← versions des providers à la racine
```

### Gestion de l'état — toujours distant
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
- Ne jamais utiliser l'état local pour quelque chose de partagé
- Activer le chiffrement et le verrouillage de l'état (DynamoDB pour le backend S3)
- Séparer les fichiers d'état par environnement et par module (pas un état géant unique)

### Discipline des variables et des outputs
```hcl
# variables.tf — toujours inclure description et type
variable "environment" {
  description = "Deployment environment (production, staging, development)"
  type        = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

# outputs.tf — exporter tout ce qu'un module consommateur pourrait avoir besoin
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}
```

### Secrets — jamais dans l'état ou le code
- Ne jamais mettre des secrets dans `terraform.tfvars` ou les coder en dur dans des fichiers `.tf`
- Utiliser `data "aws_secretsmanager_secret_version"` ou `data "google_secret_manager_secret_version"` pour lire les secrets au moment de l'application
- Outputs sensibles : marquer avec `sensitive = true` pour les supprimer de la sortie du plan
- `.gitignore` doit inclure : `*.tfvars`, `*.tfstate`, `*.tfstate.backup`, `.terraform/`

### Conventions de nommage des ressources
```hcl
# Nommage cohérent : {project}-{environment}-{resource}-{suffix}
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = {
    Name        = "${var.project}-${var.environment}-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```
Toujours taguer chaque ressource avec `Environment` et `ManagedBy = "terraform"`.

### Planifier avant d'appliquer — toujours
- Pipeline CI/CD : `terraform plan -out=tfplan` sur PR, `terraform apply tfplan` lors de la fusion
- Ne jamais exécuter `terraform apply` sans plan sauvegardé en production
- Utiliser `-target` avec parcimonie — cela crée de la dérive entre l'état réel et le plan

### Pièges courants
- `terraform destroy` sans `-target` détruit tout — toujours confirmer la portée
- Changer un attribut de ressource qui force le remplacement (ex: CIDR VPC) supprime et recrée — vérifier attentivement le plan
- L'épinglage des versions de provider est obligatoire : utiliser `~> 5.0` et non `>= 5.0`
- `count` vs `for_each` : utiliser `for_each` avec des maps — `count` provoque une dérive d'index quand des éléments sont supprimés

## Exemple

**Utilisateur :** Créer un module Terraform pour une instance RDS PostgreSQL privée sur AWS avec Multi-AZ, stockage chiffré et un groupe de sécurité dédié.

**Structure de sortie attendue :**
- `modules/rds/main.tf` — `aws_db_instance`, `aws_db_subnet_group`, `aws_security_group`
- `modules/rds/variables.tf` — classe d'instance, version du moteur, nom de la DB, IDs VPC/sous-réseau, CIDR d'entrée
- `modules/rds/outputs.tf` — endpoint, port, ID du groupe de sécurité
- Groupe de sécurité : autorise PostgreSQL (5432) uniquement depuis le groupe de sécurité de l'app, pas d'accès public
- `storage_encrypted = true`, `multi_az = true`, `deletion_protection = true` pour la production
- Mot de passe via référence `aws_secretsmanager_secret`, jamais codé en dur

---

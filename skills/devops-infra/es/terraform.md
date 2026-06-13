> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../terraform.md).

# Skill de Terraform

## Cuándo activar
- Escribir módulos de Terraform para infraestructura en AWS, GCP o Azure
- Definir VPCs, subredes, grupos de seguridad y recursos de red
- Aprovisionar recursos de cómputo (EC2, GKE, AKS, ECS, Lambda)
- Gestionar infraestructura de bases de datos (RDS, Cloud SQL, Aurora)
- Configurar roles IAM, políticas y cuentas de servicio
- Escribir configuración de estado remoto (backend S3, GCS, Terraform Cloud)
- Refactorizar Terraform existente para usar módulos
- Escribir pipelines de CI/CD para `terraform plan` y `terraform apply`
- Importar infraestructura existente al estado de Terraform

## Cuándo NO usar
- Pulumi, CDK o Crossplane — herramientas IaC diferentes, patrones diferentes
- Configuración de charts de Helm (usar el skill de Kubernetes en su lugar)
- Configuración a nivel de aplicación (ConfigMaps de Kubernetes, variables de entorno de la app)
- Operaciones CLI puntuales que no se van a repetir

## Instrucciones

### Estructura del módulo
Cada proyecto de Terraform debe seguir esta estructura:
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
│   │   ├── main.tf          ← llama a los módulos
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── staging/
│       └── ...
└── versions.tf              ← versiones del proveedor raíz
```

### Gestión de estado — siempre remoto
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
- Nunca uses estado local para nada compartido
- Habilita el cifrado y el bloqueo de estado (DynamoDB para backend S3)
- Archivos de estado separados por entorno y por módulo (no un estado gigante)

### Disciplina de variables y outputs
```hcl
# variables.tf — siempre incluir descripción y tipo
variable "environment" {
  description = "Deployment environment (production, staging, development)"
  type        = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

# outputs.tf — exportar todo lo que un módulo consumidor pueda necesitar
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}
```

### Secretos — nunca en el estado ni en el código
- Nunca pongas secretos en `terraform.tfvars` ni los hardcodees en archivos `.tf`
- Usa `data "aws_secretsmanager_secret_version"` o `data "google_secret_manager_secret_version"` para leer secretos en el momento de apply
- Outputs sensibles: márcalos con `sensitive = true` para suprimir en la salida del plan
- `.gitignore` debe incluir: `*.tfvars`, `*.tfstate`, `*.tfstate.backup`, `.terraform/`

### Convenciones de nomenclatura de recursos
```hcl
# Nomenclatura consistente: {proyecto}-{entorno}-{recurso}-{sufijo}
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = {
    Name        = "${var.project}-${var.environment}-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```
Siempre etiqueta cada recurso con `Environment` y `ManagedBy = "terraform"`.

### Planificar antes de aplicar — siempre
- Pipeline CI/CD: `terraform plan -out=tfplan` en el PR, `terraform apply tfplan` al hacer merge
- Nunca ejecutes `terraform apply` sin un plan guardado en producción
- Usa `-target` con moderación — crea deriva entre el estado real y el plan

### Problemas comunes
- `terraform destroy` sin `-target` destruye todo — siempre confirma el alcance
- Cambiar un atributo de recurso que fuerza reemplazo (p.ej., CIDR de VPC) elimina y recrea — revisa el plan con cuidado
- El versionado del proveedor es obligatorio: usa `~> 5.0` no `>= 5.0`
- `count` vs `for_each`: usa `for_each` con mapas — `count` causa deriva de índice cuando se eliminan elementos

## Ejemplo

**Usuario:** Crear un módulo de Terraform para una instancia privada de RDS PostgreSQL en AWS con Multi-AZ, almacenamiento cifrado y un grupo de seguridad dedicado.

**Estructura de salida esperada:**
- `modules/rds/main.tf` — `aws_db_instance`, `aws_db_subnet_group`, `aws_security_group`
- `modules/rds/variables.tf` — clase de instancia, versión del motor, nombre de la BD, IDs de VPC/subred, CIDR de entrada
- `modules/rds/outputs.tf` — endpoint, puerto, ID del grupo de seguridad
- Grupo de seguridad: permite PostgreSQL (5432) solo desde el grupo de seguridad de la app, sin acceso público
- `storage_encrypted = true`, `multi_az = true`, `deletion_protection = true` para producción
- Contraseña mediante referencia a `aws_secretsmanager_secret`, nunca hardcodeada

---

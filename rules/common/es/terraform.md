# Reglas de Terraform

## Se aplica a
Todos los archivos de Terraform (`*.tf`, `*.tfvars`) y configuraciones de OpenTofu.

## Reglas

1. **Usa estado remoto con bloqueo de estado** — nunca almacenes `terraform.tfstate` en el control de versiones. Usa S3 + DynamoDB, GCS o Terraform Cloud. El estado contiene secretos en texto plano y las aplicaciones concurrentes corrompen el estado local.

2. **Fija las versiones de proveedores y módulos** — `version = "~> 5.0"` no `version = "latest"`. Los proveedores sin versión fija rompen las aplicaciones silenciosamente en lanzamientos ascendentes. Ejecuta `terraform init -upgrade` deliberadamente, no accidentalmente.

3. **Nunca confirmes archivos `*.tfvars` que contengan secretos** — usa variables de entorno (`TF_VAR_*`), una integración de gestor de secretos o Vault. Añade `*.tfvars` a `.gitignore` para entornos con valores sensibles.

4. **Separa el estado por entorno** — `dev/`, `staging/`, `prod/` cada uno obtiene su propia configuración de backend de estado. Un `terraform destroy` en dev nunca debe tocar la producción.

5. **Usa módulos para patrones de infraestructura reutilizables** — un módulo debe representar una unidad coherente (VPC, clúster EKS, instancia RDS). No copies y pegues bloques de recursos en entornos; parametrizalos.

6. **Siempre ejecuta `terraform plan` en CI antes de `apply`** — la salida del plan es el conjunto de cambios. Revísalo. Falla la pipeline si el plan muestra eliminaciones inesperadas.

7. **Marca las salidas sensibles con `sensitive = true`** — previene que los valores aparezcan en la salida de `terraform plan`/`apply` y en registros de CI.

8. **Usa `lifecycle { prevent_destroy = true }` en recursos con estado** — bases de datos, depósitos S3 con datos y claves KMS no deben ser destruidos accidentalmente por un plan. Haz que la destrucción sea una acción deliberada.

9. **Nombra los recursos con prefijo de entorno y una convención de sufijo consistente** — `prod-payments-rds` no `database`. Los nombres inequívocos persisten en consolas AWS, registros y desglose de facturación.

10. **Usa fuentes de `data` para recursos preexistentes, `resource` para los gestionados** — importar una VPC que no creaste con Terraform en un bloque `resource` hace que Terraform sea la fuente de verdad para algo que no posee completamente.

11. **Valida y formatea en CI** — `terraform validate` detecta errores de configuración. `terraform fmt -check` aplica formato canónico. Ambos deben fallar la compilación si fallan.

12. **Usa `for_each` sobre `count` para colecciones de recursos** — `count` usa índice posicional; eliminar el índice 0 desplaza todos los demás. `for_each` usa claves de mapa estables y evita reemplazos no intencionados.

13. **Documenta variables con `description` y establece tipos explícitamente** — `type = string` no implícito. `description` aparece en la salida de `terraform-docs` y en la interfaz de usuario de Terraform Cloud.

14. **Revisa la salida de `terraform plan` para `forces replacement`** — un reemplazo de recurso destruye y recrea. Para recursos con estado (bases de datos, IPs), esto casi siempre es incorrecto y requiere manejo explícito.

15. **Usa bloques `moved` al refactorizar direcciones de recursos** — renombrar un recurso sin un bloque `moved` causa una destrucción + creación. El bloque `moved` instruye a Terraform para migrar el estado de forma segura.


---

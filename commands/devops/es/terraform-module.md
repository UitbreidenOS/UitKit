---
description: Genera un módulo Terraform reutilizable para el componente de infraestructura descrito
argument-hint: "[componente: p.ej. vpc, rds, ecs-service, s3-bucket]"
---
Genera un módulo Terraform de calidad productiva para: $ARGUMENTS

Proveedor objetivo: inferir del contexto (AWS/GCP/Azure) o usar AWS por defecto si es ambiguo. Usar la última versión estable del proveedor.

Generar la siguiente estructura de archivos:
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimal — tabla de inputs/outputs únicamente)
```

Estándares a seguir:

`versions.tf`:
- Fijar `required_version` de Terraform a `>= 1.5`
- Fijar versión del proveedor con una restricción `~>` a la última versión menor

`variables.tf`:
- Cada variable tiene una `description` y `type` — sin tipos `any`
- Usar bloques `validation` para valores con restricciones conocidas (rangos CIDR, tipos de instancia permitidos, formatos de etiquetas)
- Variables sensibles marcadas con `sensitive = true`
- Proporcionar `default` solo donde exista un valor seguro y ampliamente aplicable — dejar las entradas requeridas sin valores por defecto

`main.tf`:
- Aplicar etiquetas/labels estándar: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Usar `for_each` en lugar de `count` para recursos multi-instancia
- Sin región, ID de cuenta o ARN codificados — derivar de fuentes de datos (`aws_caller_identity`, `aws_region`)
- Habilitar encriptación en reposo en todos los recursos de almacenamiento
- Habilitar protección de eliminación en recursos con estado (RDS, DynamoDB) — exponerlo como una variable con valor por defecto `true`

`outputs.tf`:
- Exportar el ID del recurso, ARN (si aplica), y cualquier endpoint/nombre DNS que los consumidores necesiten
- Marcar outputs sensibles con `sensitive = true`

Después del contenido del archivo, generar:
1. Bloque `module {}` de ejemplo mostrando cómo un módulo raíz llamaría a este
2. Cualquier permiso IAM que el rol de ejecución de Terraform necesite para gestionar estos recursos
3. Gotchas conocidas al momento de destruir (p.ej. buckets S3 no vacíos, requisitos de snapshots de RDS)

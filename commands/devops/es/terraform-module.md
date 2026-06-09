---
description: Genera un módulo Terraform reutilizable para el componente de infraestructura descrito
argument-hint: "[component: e.g. vpc, rds, ecs-service, s3-bucket]"
---
Genera un módulo Terraform de calidad producción para: $ARGUMENTS

Proveedor objetivo: inferir del contexto (AWS/GCP/Azure) o usar AWS por defecto si es ambiguo. Utiliza la versión más reciente estable del proveedor.

Genera la siguiente estructura de archivos:
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimal — tabla de inputs/outputs solamente)
```

Estándares a seguir:

`versions.tf`:
- Fija la `required_version` de Terraform a `>= 1.5`
- Fija la versión del proveedor con una restricción `~>` a la versión menor más reciente

`variables.tf`:
- Cada variable tiene una `description` y `type` — sin tipos `any`
- Usa bloques `validation` para valores con restricciones conocidas (rangos CIDR, tipos de instancia permitidos, formatos de etiqueta)
- Variables sensibles marcadas con `sensitive = true`
- Proporciona `default` solo cuando existe un valor seguro y ampliamente aplicable — deja las entradas requeridas sin valores por defecto

`main.tf`:
- Aplica etiquetas/labels estándar: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Usa `for_each` en lugar de `count` para recursos con múltiples instancias
- Sin región hardcodeada, ID de cuenta o ARN — derívalo de fuentes de datos (`aws_caller_identity`, `aws_region`)
- Habilita cifrado en reposo en todos los recursos de almacenamiento
- Habilita protección contra eliminación en recursos con estado (RDS, DynamoDB) — expón como una variable que por defecto es `true`

`outputs.tf`:
- Exporta el ID del recurso, ARN (si aplica) y cualquier endpoint/nombre DNS que los consumidores necesitarán
- Marca las salidas sensibles con `sensitive = true`

Después del contenido del archivo, devuelve:
1. Un bloque `module {}` de ejemplo que muestre cómo un módulo raíz llamaría a este
2. Cualquier permiso de IAM que el rol de ejecución de Terraform necesite para gestionar estos recursos
3. Gotchas conocidas en tiempo de destrucción (p. ej., buckets S3 no vacíos, requisitos de snapshot de RDS)

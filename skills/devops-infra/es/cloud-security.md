---
name: cloud-security
description: "Postura de seguridad en la nube: detección de escalada de privilegios de IAM, auditoría de exposición de S3, revisión de grupos de seguridad, escaneo de seguridad de IaC — configuraciones erróneas de AWS, Azure y GCP"
---

# Habilidad de Seguridad en la Nube

## Cuándo activar
- Auditar AWS/Azure/GCP para configuraciones erróneas de seguridad
- Encontrar rutas de escalada de privilegios de IAM antes de que un atacante lo haga
- Verificar buckets de S3/Blob Storage/GCS para acceso público involuntario
- Revisar reglas de grupo de seguridad/cortafuegos para acceso de red demasiado permisivo
- Escanear plantillas de Terraform o CloudFormation para problemas de seguridad antes de implementar
- Ejecutar una evaluación de base de seguridad en la nube

## Cuándo NO usar
- Respuesta activa a incidentes en la nube — usar el agente incident-commander
- Pruebas de penetración a nivel de aplicación — usar la habilidad security-pen-testing (o agente red-team para compromisos autorizados)
- Preparación para certificación de cumplimiento (SOC 2, ISO 27001) — usar habilidades específicas
- SIEM o detección de amenazas — herramientas y procesos diferentes

## Instrucciones

### Auditoría de escalada de privilegios de IAM

```
Auditar IAM para riesgos de escalada de privilegios.

Nube: [AWS / Azure / GCP]
Alcance: [todas las entidades de IAM / roles específicos / usuario específico]
Acceso a: [acceso de solo lectura a la consola de IAM / JSONs de política exportados]

Rutas comunes de escalada de privilegios de IAM (AWS):

ESCALADA DIRECTA (una sola acción otorga privilegios de administrador):
□ iam:CreatePolicyVersion — crear una nueva versión de política con AdministratorAccess
□ iam:SetDefaultPolicyVersion — cambiar a una versión de política previamente creada y permisiva
□ iam:AttachUserPolicy / iam:AttachRolePolicy — adjuntar AdministratorAccess a uno mismo
□ iam:AddUserToGroup — agregarse a uno mismo al grupo de administrador
□ iam:CreateAccessKey — crear clave de acceso para otro usuario con más privilegios
□ iam:UpdateLoginProfile — restablecer contraseña para usuario con más privilegios
□ iam:PassRole + [service]:* — pasar un rol de administrador a un servicio (Lambda, EC2, ECS)

ESCALADA INDIRECTA (a través de servicios):
□ lambda:CreateFunction + iam:PassRole (rol de administrador) → implementar Lambda que se ejecuta como administrador
□ ec2:RunInstances + iam:PassRole (rol de administrador) → lanzar EC2 con perfil de instancia de administrador
□ sts:AssumeRole + política de confianza permisiva → asumir un rol con más privilegios

PROCEDIMIENTO DE VERIFICACIÓN:
1. Enumerar todas las políticas de IAM adjuntas al objetivo (usuario/rol/grupo)
2. Para cada política, buscar cualquiera de las acciones anteriores en Resource: "*"
3. Verificar si existe alguna de las acciones anteriores con comodines sin condiciones
4. Verificar políticas de confianza de roles: ¿quién puede asumir este rol? (demasiado amplio "*" en Principal)

Señales de alerta inmediatas:
🔴 Action: iam:* Resource: * (control total de IAM = administrador de facto)
🔴 Action: sts:AssumeRole Resource: * (puede asumir cualquier rol en la cuenta)
🔴 Cualquier acción comodín (*) en Resource: * (control total del servicio)
🔴 Permiso PassRole a recursos * (puede escalar a través de cualquier servicio)

Comandos de AWS CLI para ejecutar:
# Enumerar todas las políticas para un usuario
aws iam list-attached-user-policies --user-name USERNAME
aws iam list-user-policies --user-name USERNAME

# Obtener detalles de política
aws iam get-policy-version --policy-arn POLICY_ARN --version-id v1

# Verificar quién puede asumir un rol
aws iam get-role --role-name ROLE_NAME --query 'Role.AssumeRolePolicyDocument'

Resultado: lista de rutas de escalada encontradas, principal afectado, acción específica + recurso.
```

### Auditoría de acceso público de S3

```
Auditar buckets de S3 para acceso público involuntario.

Alcance: [todos los buckets / nombres de buckets específicos]
Preocupación: [lectura pública / escritura pública / ACLs públicas]

Superficie de ataque de acceso público de S3:

VERIFICACIONES A NIVEL DE BUCKET:
□ Configuración de bloque de acceso público — ¿están habilitadas las 4 configuraciones?
  aws s3api get-public-access-block --bucket BUCKET_NAME
  Las 4 deberían ser verdaderas: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets

□ ACL de bucket — ¿es el otorgante "AllUsers" o "AuthenticatedUsers"?
  aws s3api get-bucket-acl --bucket BUCKET_NAME
  Buscar: "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
  🔴 AllUsers con READ = cualquiera puede enumerar/descargar archivos
  🔴 AllUsers con WRITE = cualquiera puede cargar/eliminar archivos

□ Política de bucket — ¿permite la política s3:GetObject con Principal: "*"?
  aws s3api get-bucket-policy --bucket BUCKET_NAME
  🔴 Principal: "*" + Action: s3:GetObject = lectura pública

VERIFICACIONES A NIVEL DE OBJETO:
□ Objetos individuales con ACLs públicas (si el bloque ACL de bucket no está configurado)
  aws s3api list-object-versions --bucket BUCKET_NAME | grep -i "public"

PATRONES LEGÍTIMOS COMUNES (verificar intención):
- Buckets de alojamiento de sitios web estáticos: intencionalmente público, debe estar restringido a CloudFront
- Buckets de descarga pública: la política debe limitarse a prefijos específicos, no todos los objetos

Remediación para bucket públicamente expuesto:
# Habilitar bloque de acceso público (seguro para todos los buckets)
aws s3api put-public-access-block \
  --bucket BUCKET_NAME \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Eliminar política de bucket público
aws s3api delete-bucket-policy --bucket BUCKET_NAME

Resultado: calificación de riesgo por bucket + configuración errónea específica + comando de remediación.
```

### Auditoría de grupo de seguridad/cortafuegos

```
Auditar grupos de seguridad para acceso de red demasiado permisivo.

Nube: [grupos de seguridad de AWS / NSGs de Azure / reglas de cortafuegos de GCP]
Alcance: [todos los grupos de seguridad / solo VPC de producción]

Reglas críticas a marcar:

🔴 SSH (puerto 22) abierto a 0.0.0.0/0 — SSH expuesto a Internet es un hallazgo crítico
🔴 RDP (puerto 3389) abierto a 0.0.0.0/0 — RDP expuesto a Internet es un hallazgo crítico
🔴 Puertos de base de datos abiertos a 0.0.0.0/0:
   - MySQL: 3306
   - PostgreSQL: 5432
   - MongoDB: 27017
   - Redis: 6379
   - Elasticsearch: 9200
🔴 Todo el tráfico (puerto 0, protocolo -1) desde 0.0.0.0/0

🟡 HTTP (puerto 80) o HTTPS (puerto 443) desde 0.0.0.0/0 — generalmente intencional para servicios web; verificar
🟡 Puertos de administración personalizados (8080, 8443, 9090) desde 0.0.0.0/0 — debe estar detrás de VPN
🟡 Reglas internas demasiado amplias (CIDR de VPC completa donde solo se necesita SG específico)

Auditoría de AWS CLI:
# Encontrar grupos de seguridad con SSH abierto a Internet
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

# Encontrar grupos de seguridad con todo el tráfico abierto
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.protocol,Values=-1" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

Remediación para SSH:
# Reemplazar 0.0.0.0/0 con su IP de bastión/VPN
aws ec2 revoke-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr YOUR_VPN_CIDR

Resultado: ID de grupo de seguridad, regla, nivel de riesgo, comando de remediación.
```

### Escaneo de seguridad de IaC

```
Escanear Infrastructure-as-Code para configuraciones erróneas de seguridad.

Herramienta de IaC: [Terraform / CloudFormation / Pulumi / Bicep]
Archivos para escanear: [ruta de directorio o lista de archivos]

Utilizar estas herramientas para escaneo automatizado:

Terraform:
  tfsec .                          # Más rápido; verifica configuraciones erróneas comunes
  checkov -d .                     # Cobertura más amplia; verificaciones de benchmark CIS
  terrascan scan -t terraform      # Verificaciones mapeadas de NIST, PCI, SOC 2

CloudFormation:
  cfn-nag scan --input-filename template.yaml
  checkov -f template.yaml --framework cloudformation

Configuraciones erróneas clave a marcar:

COMPUTE:
🔴 Punto final de metadatos de EC2/ECS no restringido (IMDSv2 no aplicado)
🔴 Datos de usuario que contienen secretos o credenciales
🟡 Instancias sin límite de saltos de IMDSv2 = 1

ALMACENAMIENTO:
🔴 Bucket de S3 sin bloque de acceso público
🔴 Bucket de S3 sin cifrado en el lado del servidor
🔴 Bucket de S3 sin control de versiones (riesgo de pérdida de datos)
🟡 Bucket de S3 sin registro de acceso

BASE DE DATOS:
🔴 RDS accesible públicamente = verdadero
🔴 RDS sin cifrado en reposo
🔴 RDS sin protección de eliminación (en prod)
🟡 RDS sin copias de seguridad automatizadas
🟡 RDS Multi-AZ deshabilitado (en prod)

IAM:
🔴 Política de IAM con Action: * Resource: *
🔴 Rol de IAM con política de confianza demasiado amplia
🟡 Rotación de clave de acceso de IAM no aplicada

RED:
🔴 Grupo de seguridad que permite todo el tráfico entrante
🔴 Registros de flujo de VPC no habilitados
🟡 Grupo de seguridad predeterminado en uso

Generar: lista anotada de hallazgos con archivo de IaC + referencia de línea + corrección.
```

## Ejemplo

**Usuario:** Nuestra startup ha estado ejecutándose en AWS durante 18 meses. Nunca hemos hecho una auditoría de seguridad. ¿Por dónde empezamos?

**Auditoría de base de 30 minutos de Claude:**

Ejecute estos 5 comandos — exponen el 80% de los riesgos críticos:

```bash
# 1. Buscar SSH expuesto a Internet (crítico — ejecutar primero)
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
  --output table

# 2. Buscar buckets de S3 públicos
aws s3api list-buckets --query 'Buckets[*].Name' --output text | \
  xargs -I{} aws s3api get-public-access-block --bucket {} 2>/dev/null || echo "Check manually"

# 3. Buscar usuarios de IAM con AdministratorAccess
aws iam list-attached-user-policies \
  --user-name $(aws iam list-users --query 'Users[*].UserName' --output text) 2>/dev/null

# 4. Buscar claves de acceso de cuenta raíz (debe ser CERO)
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'
# Si la salida es 1 o más: eliminar claves de acceso raíz inmediatamente

# 5. Verificar si CloudTrail está habilitado (su registro de auditoría)
aws cloudtrail describe-trails --query 'trailList[*].[Name,S3BucketName,IsMultiRegionTrail]'
```

**Hallazgos más comunes en cuentas de AWS de 18 meses:**
1. SSH abierto a Internet en una instancia de desarrollo/ensayo que alguien olvidó
2. Claves de acceso raíz aún activas (debe ser cero — raíz solo debe usar consola)
3. CloudTrail no habilitado en todas las regiones (brechas en el registro de auditoría)
4. Usuarios de IAM con claves de acceso de larga duración nunca rotadas
5. Bucket de S3 sin bloque de acceso público habilitado (incluso sin política de bucket público)

Corrija primero las claves de acceso raíz e SSH a Internet — estos son los dos errores de configuración más comúnmente explotados.

---

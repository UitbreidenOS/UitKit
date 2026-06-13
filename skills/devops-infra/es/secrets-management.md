---
name: secrets-management
description: "Gestión de secretos: configuración de HashiCorp Vault, almacenes de secretos de AWS/Azure/GCP, automatización de rotación de secretos, inyección de secretos de Kubernetes, integración de CI/CD y respuesta a fugas de secretos"
---

# Habilidad de Gestión de Secretos

## Cuándo activar
- Configurar una infraestructura de gestión de secretos (Vault, AWS Secrets Manager, etc.)
- Diseñar inyección de secretos para cargas de trabajo de Kubernetes o pipelines de CI/CD
- Implementar rotación automática de secretos para credenciales de base de datos o claves API
- Auditar patrones de acceso a secretos para SOC 2 o ISO 27001
- Responder a una fuga de secretos que requiera rotación y revocación inmediata
- Migrar de archivos `.env` a un almacén de secretos adecuado

## Cuándo NO usar
- Gestión local de archivos `.env` en una máquina de desarrollador — usar .gitignore + dotenv
- Revisión de código para secretos codificados — usar la habilidad security-audit para encontrarlos
- Cifrado a nivel de aplicación de datos de usuario en reposo — preocupación diferente

## Instrucciones

### Selección de almacén de secretos

```
Elija el enfoque correcto de gestión de secretos.

Tamaño del equipo: [X ingenieros]
Infraestructura: [AWS / Azure / GCP / on-prem / híbrida / Kubernetes]
Cumplimiento: [SOC 2 / ISO 27001 / HIPAA / ninguno]
Volumen de secretos: [X secretos, X aplicaciones]
Presupuesto: [$0 / servicio administrado OK / empresarial]

Guía de selección:

NATIVO DE LA NUBE (recomendado para equipos orientados a la nube):
AWS Secrets Manager:
  - Integración nativa: Lambda, ECS, rotación de RDS, CloudFormation
  - Costo: $0,40/secreto/mes + $0,05/10K llamadas API
  - Auto-rotación: integrada para RDS, DocumentDB, Redshift
  - Mejor para: tiendas solo de AWS, equipos que quieren cero ops

Azure Key Vault:
  - Integración nativa: App Service, AKS, referencias de Key Vault en configuración de aplicación
  - Costo: $0,03/10K operaciones (secretos), $0,03/10K (certificados)
  - Mejor para: tiendas solo de Azure o tiendas de Microsoft

GCP Secret Manager:
  - Integración nativa: Cloud Run, GKE, Cloud Functions
  - Costo: $0,06/10K operaciones de acceso
  - Mejor para: cargas de trabajo nativas de GCP

AUTO-HOSPEDADO (recomendado para equipos multi-cloud o orientados al cumplimiento):
HashiCorp Vault:
  - Soporta: secretos dinámicos, PKI CA, SSH OTP, Kubernetes, múltiples backends de nube
  - Costo: código abierto gratuito; Empresarial para espacios de nombres, replicación
  - Gastos generales de operaciones: debe implementar, desbloquear y mantener
  - Mejor para: multi-cloud, on-prem, requisitos complejos de rotación

HCP Vault (administrado):
  - Vault como servicio de HashiCorp
  - Sin operaciones de clúster; Vault Dedicated comienza alrededor de $700/mes
  - Mejor para: equipos que desean capacidades de Vault sin operaciones

Recomendación para mi configuración: [opción + justificación]
```

### Patrones de configuración de Vault

```
Configurar HashiCorp Vault para [entorno].

Implementación: [Kubernetes / Docker Compose / VM en la nube / HCP administrado]
Backend de almacenamiento: [Raft (integrado) / Consul / DynamoDB]
Desbloqueo automático: [AWS KMS / Azure Key Vault / GCP KMS / manual]
Escala: [nodo único de dev / HA 3-nodo / HA de producción]

Configuración de HA de producción:

# docker-compose.yml (cluster Raft de 3 nodos)
version: '3.8'
services:
  vault-1:
    image: hashicorp/vault:1.17
    environment:
      VAULT_LOCAL_CONFIG: |
        storage "raft" {
          path    = "/vault/data"
          node_id = "vault-1"
          retry_join { leader_api_addr = "http://vault-2:8200" }
          retry_join { leader_api_addr = "http://vault-3:8200" }
        }
        listener "tcp" {
          address     = "0.0.0.0:8200"
          tls_disable = false
          tls_cert_file = "/vault/certs/vault.crt"
          tls_key_file  = "/vault/certs/vault.key"
        }
        seal "awskms" {
          region     = "us-east-1"
          kms_key_id = "alias/vault-unseal"
        }
        api_addr = "https://vault-1:8200"
        cluster_addr = "https://vault-1:8201"
        ui = true
    cap_add: [IPC_LOCK]
    volumes:
      - vault-1-data:/vault/data
      - ./certs:/vault/certs:ro

Métodos de autenticación (configurar después de la inicialización):
# AppRole para máquina a máquina (servicios, corredores de CI)
vault auth enable approle
vault write auth/approle/role/my-service \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_num_uses=1 \    # ID de secretos de un solo uso
  token_policies=my-service-read

# Kubernetes para autenticación de pod
vault auth enable kubernetes
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

Genere la configuración de Vault para mi infraestructura específica.
```

### Rotación de secretos

```
Implementar rotación automática de secretos para [tipo de credencial].

Tipo de credencial: [contraseña de base de datos / clave API / certificado TLS / clave SSH]
Frecuencia de rotación: [30 días / 90 días / bajo demanda]
Aplicaciones que usan este secreto: [lista — cómo consumen el secreto]

Rotación de contraseña de base de datos (AWS Secrets Manager):

# Rotación automática usando Lambda proporcionado por AWS
aws secretsmanager create-secret \
  --name "prod/myapp/db-password" \
  --secret-string '{"username":"myapp","password":"initial-password"}'

aws secretsmanager rotate-secret \
  --secret-id "prod/myapp/db-password" \
  --rotation-lambda-arn "arn:aws:lambda:us-east-1:ACCOUNT:function:SecretsManagerRDSPostgreSQLRotationSingleUser" \
  --rotation-rules AutomaticallyAfterDays=30

# La aplicación lee el secreto por nombre (no valor codificado):
import boto3
import json

def get_db_password():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='prod/myapp/db-password')
    secret = json.loads(response['SecretString'])
    return secret['password']

# PATRÓN CLAVE: La aplicación siempre lee en tiempo de ejecución, nunca almacena en caché indefinidamente
# Manejar rotación: detectar fallos de autenticación, actualizar secreto, reintentar una vez

Patrón de rotación de base de datos para cero tiempo de inactividad:
Fase 1: Crear nueva contraseña en BD (contraseña antigua aún funciona)
Fase 2: Actualizar Secrets Manager con nueva contraseña
Fase 3: Las aplicaciones leen la nueva contraseña en la siguiente búsqueda de secreto
Fase 4: Eliminar contraseña antigua de BD (después del período de gracia)

Secretos dinámicos de Vault (mejor que rotación — nunca almacenar credenciales de larga duración):
# Cada solicitud de aplicación genera una credencial única con límite de tiempo
vault secrets enable database
vault write database/config/postgresql \
  plugin_name="postgresql-database-plugin" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/mydb" \
  allowed_roles="my-role" \
  username="vault-admin" \
  password="vault-admin-password"

vault write database/roles/my-role \
  db_name="postgresql" \
  creation_statements="CREATE ROLE '{{name}}' LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO '{{name}}';" \
  default_ttl="1h" \
  max_ttl="24h"

# La app recibe: una credencial única válida 1 hora, expirada automáticamente por Vault
vault read database/creds/my-role

Genere la configuración de rotación para mi tipo de credencial.
```

### Inyección de secretos de Kubernetes

```
Inyectar secretos en cargas de trabajo de Kubernetes.

Clúster: [EKS / AKS / GKE / autoadministrado]
Almacén de secretos: [Vault / AWS Secrets Manager / Azure Key Vault / GCP Secret Manager]

Opción 1 — Sidecar de Vault Agent (más flexible):
# Autenticación de Kubernetes configurada en Vault primero (ver configuración arriba)
# Especificación de pod con sidecar de Vault Agent:

apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-app   # debe tener enlace de autenticación de Vault
  initContainers:
    - name: vault-agent-init
      image: hashicorp/vault:1.17
      args: ["agent", "-config=/vault/config/config.hcl"]
      # Escribe secretos en volumen compartido antes de que se inicie la aplicación
  containers:
    - name: app
      volumeMounts:
        - name: secrets-vol
          mountPath: /vault/secrets
          readOnly: true
      # La app lee: /vault/secrets/db-password (archivo de texto plano)
  volumes:
    - name: secrets-vol
      emptyDir: {}

Opción 2 — Operador de Secretos Externos (recomendado para nativo de nube):
# Sincroniza AWS Secrets Manager / Azure Key Vault / GCP Secret Manager → Kubernetes Secret
# Instalar: helm install external-secrets external-secrets/external-secrets

apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-store
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: my-app-secrets
spec:
  refreshInterval: 1h        # sincronizar cada hora
  secretStoreRef:
    name: aws-store
    kind: SecretStore
  target:
    name: my-app-secrets     # crea este Kubernetes Secret
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: prod/myapp/db-password
        property: password

Configure la inyección de secretos para mi clúster y almacén de secretos.
```

### Respuesta a fuga de secretos

```
Responda a una fuga de secretos para [tipo de credencial].

Credencial filtrada: [describir — clave API / contraseña de BD / clave privada / secreto JWT]
Exposición: [repositorio GitHub público / logs / Slack / desconocido]
Tiempo desde fuga: [minutos / horas / días]
Sistemas afectados: [lista]

RESPUESTA INMEDIATA (primeros 30 minutos):

PASO 1 — Revocar la credencial AHORA:
# Clave API (específica del servicio):
# Stripe: Dashboard → Developers → API Keys → Roll key
# Token de GitHub: Settings → Developer settings → Personal access tokens → Delete
# Clave de acceso de AWS: IAM → Users → Security credentials → Deactivate

# Contraseña de base de datos:
ALTER USER myapp PASSWORD 'new-secure-password-here';
# Actualizar Secrets Manager / Vault simultáneamente

# Secreto de firma JWT:
# Cambiar el secreto → todos los tokens existentes instantáneamente inválidos
# Advertencia: todos los usuarios con sesión iniciada serán desconectados

PASO 2 — Evaluar el radio de impacto:
□ ¿Cuándo se creó la credencial? (define la ventana de exposición)
□ ¿A qué puede acceder? (el alcance determina la gravedad)
□ ¿Hay alguna evidencia de abuso? (verificar logs de acceso del servicio)

PASO 3 — Auditar logs de acceso:
# AWS CloudTrail: filtrar por ID de clave de acceso
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=AKIA... \
  --start-time $(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%SZ)

# Verificar: regiones inusuales, operaciones inusuales, signos de exfiltración de datos

PASO 4 — Eliminar de la fuente:
□ Si está en Git: eliminar, forzar push, pero recuerde — está en el historial
  Usar BFG Repo Cleaner o git-filter-repo para limpiar el historial
  Pero: si era público, asumir que está capturado — la rotación es el único fix
□ Si está en logs: purgar entradas de registro, verificar destinos de reenvío de logs
□ Si está en Slack: eliminar mensaje + todas las copias

PASO 5 — Notificar:
□ Equipo de seguridad y gestión
□ Si los datos del cliente eran accesibles: revisión legal + DPO (regla de notificación GDPR 72h)
□ Si el servicio tiene política de divulgación responsable: seguirla

PASO 6 — Causa raíz y prevención de recurrencia:
□ ¿Cómo se expuso el secreto? (comprometido en git / registrado / codificado)
□ Hook previo al commit para prevenir commits de secretos: instalar git-secrets o gitleaks
□ Rotar todos los demás secretos del mismo tipo como precaución

Genere el manual de respuesta a incidentes para mi escenario específico de fuga.
```

## Ejemplo

**Usuario:** Encontramos una clave de acceso de AWS comprometida en un repositorio GitHub público hace 3 días. La clave tiene AdministratorAccess. ¿Qué hacemos?

**Respuesta de Claude:**

Este es un incidente crítico. Clave de acceso de administrador pública durante 3 días = asumir que fue encontrada y utilizada. Muévase rápido.

**Próximos 5 minutos:**
```bash
# 1. Desactivar la clave inmediatamente (no eliminar aún — necesita el ID de clave para análisis de logs)
aws iam update-access-key \
  --access-key-id AKIA... \
  --status Inactive \
  --user-name leaked-user

# 2. Verificar si hay múltiples claves para este usuario
aws iam list-access-keys --user-name leaked-user
```

**Próximos 30 minutos — investigar:**
```bash
# Verificar CloudTrail para toda actividad con esta clave (últimos 90 días)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA... \
  --start-time 2026-04-20T00:00:00Z \
  --output json | jq '.Events[] | {time: .EventTime, action: .EventName, region: .CloudTrailEvent}'

# Buscar: CreateUser, CreateRole, AttachPolicy (escalada de privilegios), S3 GetObject (robo de datos), EC2 RunInstances (criptominería)
```

**Después de la investigación:**
- Si no hay actividad sospechosa → aún así tratar como comprometido, proceder con rotación completa
- Si se encuentra actividad sospechosa → declarar incidente de seguridad, involucrar a legal/DPO, investigar cada acción

**Remediación completa:**
1. Eliminar la clave filtrada (después de completar análisis de logs)
2. Auditar todas las políticas de IAM que el usuario filtrado tenía — ¿se aplicó alguna política durante la ventana?
3. Revisar CloudTrail para cualquier recurso creado con esta clave — eliminar recursos huérfanos
4. Si este usuario tenía AdministratorAccess: verificar cualquier nuevo usuario, rol o política de IAM creada
5. Habilitar GuardDuty si aún no está habilitado (habría alertado sobre esto)
6. Configurar regla de AWS Config para alertar sobre claves de acceso público siendo creadas
7. Agregar hook previo al commit `git-secrets` o `gitleaks` a todos los repositorios

---

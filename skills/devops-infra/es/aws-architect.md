---
name: aws-architect
description: "Diseño de arquitectura AWS: patrones sin servidor, de tres capas, impulsados por eventos y de contenedores — CloudFormation/Terraform IaC, optimización de costos, mejores prácticas de IAM y patrones de inicio a escala"
---

# Habilidad AWS Architect

## Cuándo activar
- Diseñar una nueva arquitectura AWS desde cero
- Elegir entre opciones de servicios AWS (Lambda vs. ECS, DynamoDB vs. Aurora, etc.)
- Generar plantillas CloudFormation o Terraform para un patrón
- Optimizar costos de AWS en una configuración existente
- Planificar una migración a AWS desde on-premises u otra nube
- Diseñar políticas de IAM y roles siguiendo principios de privilegio mínimo

## Cuándo NO usar
- Arquitectura específica de Azure — usa la habilidad azure-architect
- Arquitectura específica de GCP — usa la habilidad gcp-architect
- Revisión de postura de seguridad en la nube — usa la habilidad cloud-security
- Patrones específicos de Kubernetes — usa la habilidad kubernetes

## Instrucciones

### Selección de patrones de arquitectura

```
Selecciona el patrón de arquitectura AWS correcto para [aplicación].

Tipo de aplicación: [app web / backend móvil / canalización de datos / SaaS / microservicios / procesamiento por lotes]
Escala esperada: [usuarios/día, solicitudes/segundo, volumen de datos]
Experiencia en AWS del equipo: [principiante / intermedio / avanzado]
Presupuesto: $[X]/mes objetivo
Cumplimiento: [GDPR / HIPAA / SOC 2 / PCI / ninguno]
Disponibilidad: [Objetivo de SLA — 99.9% / 99.95% / 99.99%]

Guía de selección de patrones:

SIN SERVIDOR (recomendado para: APIs < 10K req/día, impulsado por eventos, tráfico variable):
Stack: S3 + CloudFront → API Gateway → Lambda → DynamoDB / RDS Proxy
Costo: ~$10-100/mes para pequeñas cargas de trabajo (pago por invocación)
Ventajas: cero gastos operativos, escala infinita, pago por uso
Desventajas: arranques en frío (50-500ms), máximo 15 minutos de ejecución, solo sin estado
Mejor para: startups, MVP, APIs con tráfico variable, trabajos en segundo plano

CONTENEDORES DE TRES CAPAS (recomendado para: tráfico consistente, procesos de larga ejecución):
Stack: CloudFront + ALB → ECS Fargate → RDS Aurora + ElastiCache
Costo: ~$150-500/mes mínimo (contenedores ejecutándose 24/7)
Ventajas: modelo familiar, sin arranques en frío, amigable con estado, latencia predecible
Desventajas: costo base más alto, más operaciones (verificaciones de salud, configuración de escalado)
Mejor para: SaaS B2B, APIs con latencia estricta, equipos cómodos con contenedores

MICROSERVICIOS IMPULSADOS POR EVENTOS (recomendado para: flujos de trabajo complejos, procesamiento asíncrono):
Stack: EventBridge / SNS / SQS → Lambda / ECS → Step Functions
Costo: depende del volumen de mensajes + cálculo
Ventajas: servicios desacoplados, resilientes, escalables independientemente por servicio
Desventajas: complejidad de sistemas distribuidos, depuración más difícil
Mejor para: sistemas donde los servicios deben comunicarse sin acoplamiento estrecho

CANALIZACIÓN DE DATOS (recomendado para: ETL, análisis, ML):
Stack: S3 → Glue / Kinesis → Redshift / Athena → QuickSight
Costo: almacenamiento barato; costos de cálculo varían por frecuencia de trabajo
Mejor para: ETL por lotes, análisis de transmisión, almacén de datos

Recomienda el patrón para mi aplicación con estimación de costo y plantilla de inicio IaC.
```

### Plantilla CloudFormation

```
Genera una plantilla CloudFormation para [patrón].

Patrón: [API sin servidor / tres capas / sitio estático / canalización de datos]
Región: [us-east-1 / eu-west-1 / etc.]
Nombre de la app: [usado como prefijo del nombre del recurso]

Stack de API sin servidor (SAM):
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Parameters:
  AppName:
    Type: String
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]

Globals:
  Function:
    Runtime: nodejs20.x
    MemorySize: 256
    Timeout: 30
    Environment:
      Variables:
        NODE_ENV: !Ref Environment
    Tracing: Active                          # Rastreo X-Ray

Resources:
  # API Gateway + Lambda
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${AppName}-api-${Environment}'
      Handler: dist/index.handler
      CodeUri: ./
      Events:
        ApiEvent:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref MainTable

  # Tabla DynamoDB con facturación bajo demanda
  MainTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${AppName}-${Environment}'
      BillingMode: PAY_PER_REQUEST
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
      SSESpecification:
        SSEEnabled: true
      AttributeDefinitions:
        - AttributeName: pk
          AttributeType: S
        - AttributeName: sk
          AttributeType: S
      KeySchema:
        - AttributeName: pk
          KeyType: HASH
        - AttributeName: sk
          KeyType: RANGE

  # CloudFront + S3 para frontend
  FrontendBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

Genera la plantilla completa para mi patrón con endurecimiento de seguridad.
```

### Política de IAM con privilegio mínimo

```
Diseña políticas de IAM para [carga de trabajo].

Carga de trabajo: [describe — función Lambda, tarea ECS, desarrollador, canalización CI/CD]
Servicios de AWS accedidos: [lista — S3, DynamoDB, SQS, Secrets Manager, etc.]
Operaciones necesarias: [solo lectura / lectura-escritura / administrador]

Mejores prácticas de IAM:
1. Nunca uses AdministratorAccess administrado por AWS — siempre reduce el alcance
2. Un rol por servicio/carga de trabajo — nunca compartas roles entre servicios no relacionados
3. Usa ARN a nivel de recurso — no "*" en recurso a menos que sea realmente necesario
4. Usa condiciones para restringir por VPC, IP, MFA, etiqueta
5. Revisa trimestralmente — los permisos no utilizados se acumulan rápidamente

Rol de ejecución de Lambda (lectura/escritura de DynamoDB + lectura de Secrets Manager):
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/MY_TABLE",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/MY_TABLE/index/*"
      ]
    },
    {
      "Sid": "SecretsManagerRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:my-app/*"
    },
    {
      "Sid": "XRayTracing",
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
      ],
      "Resource": "*"
    }
  ]
}

Genera la política de IAM con privilegio mínimo para mi carga de trabajo.
```

### Auditoría de optimización de costos

```
Audita costos de AWS e identifica oportunidades de optimización.

Factura mensual actual: $[X]
Mayores categorías de costo: [EC2 / RDS / transferencia de datos / Lambda / S3 / otro]
Edad de la cuenta: [X meses]
Entornos: [prod + staging + dev / solo prod]

Lista de verificación de optimización de costos:

CÁLCULO EC2 / ECS:
□ ¿Instancias reservadas o planes de ahorro comprados para cargas de trabajo base estables?
  → Compromiso de 1 año = ~30% de ahorro vs. bajo demanda; 3 años = ~50%
□ ¿Instancias spot utilizadas para cargas de trabajo no críticas o por lotes?
  → 70-90% más barato que bajo demanda; tolera interrupciones
□ ¿Cambio de tamaño realizado? (verifica utilización de CPU/memoria CloudWatch)
  → Instancias ejecutándose con < 20% CPU promedio son candidatas para cambio de tamaño
□ ¿Entornos dev/staging detenidos fuera del horario comercial?
  → Lambda: `aws ec2 stop-instances` según cronograma; ahorra 65% en cálculo sin-prod

RDS / BASE DE DATOS:
□ ¿Aurora Serverless v2 considerado para cargas de trabajo variables?
  → Se escala a cero cuando está inactivo; ahorros significativos para dev/staging
□ ¿Instancias RDS inactivas identificadas?
  → Cualquier RDS con < 1 conexión/día durante 30+ días = candidato a apagarse
□ ¿Multi-AZ deshabilitado en sin-prod?
  → Multi-AZ duplica el costo de RDS; dev/staging no lo necesitan

TRANSFERENCIA DE DATOS:
□ ¿CloudFront frente a S3/ALB para reducir costos de transferencia de datos de origen?
  → Transferencia de datos de CloudFront a Internet: 4-8x más barato que desde EC2
□ ¿Puntos finales VPC para S3, DynamoDB, Secrets Manager?
  → Elimina cargos por procesamiento de datos de NAT Gateway para estos servicios
□ ¿Uso de NAT Gateway revisado?
  → Procesamiento de datos de NAT Gateway: $0.045/GB; a menudo el factor de costo oculto

S3:
□ ¿S3 Intelligent-Tiering habilitado en buckets > 100GB con patrones de acceso variables?
□ ¿Reglas de ciclo de vida de S3 que eliminan versiones antiguas y cargas multiparte incompletas?
□ ¿Registros de acceso a S3 van a un bucket de registro con regla de ciclo de vida para expiración después de 90 días?

LAMBDA:
□ ¿Memoria redimensionada? (usa herramienta Lambda Power Tuning)
□ ¿Funciones con > 5M invocaciones/mes — planes de ahorro aplicados?

Estimación: para una factura de $2K/mes, la optimización típica encuentra $400-800/mes en ahorros.
Genera un plan de optimización para mi perfil de gasto específico.
```

## Ejemplo

**Usuario:** Somos una startup de 5 personas, construyendo una API REST + frontend React. Esperamos 5K usuarios en el lanzamiento, tal vez 50K en 6 meses. Presupuesto: $200/mes para empezar. ¿Qué stack de AWS?

**Recomendación de Claude:**

Con 5K usuarios, sin servidor es la opción correcta — gastarás <$50/mes y tendrás cero servidores que administrar.

**Stack recomendado:**

```
React (S3 + CloudFront) → API Gateway (HTTP API) → Lambda → DynamoDB
                                                          ↓
                                                    Secrets Manager
                                                    SES (correo)
```

**Por qué esto en lugar de contenedores:**
- 5K usuarios = ~1K llamadas API/día = $0.40/mes en costos de Lambda
- Sin costo de cálculo inactivo (a diferencia de ECS que factura 24/7)
- En 50K usuarios = todavía <$10/mes en Lambda
- Cambiar a ECS Fargate cuando necesites: conexiones persistentes (WebSockets), procesos de larga ejecución, o > 1M llamadas API/día

**Desglose de costos mensuales en 5K usuarios:**
- CloudFront + S3: ~$2
- API Gateway: ~$1
- Lambda: ~$1
- DynamoDB (bajo demanda): ~$5
- Secrets Manager: ~$1
- **Total: ~$10/mes** — muy por debajo de tu presupuesto de $200

**Cuándo migrar fuera de sin servidor:** si alcanzas > 500 req/segundo consistentes o necesitas latencia p99 < 10ms (los arranques en frío de Lambda se vuelven un problema). Con 50K usuarios aún no estás ahí.

**Recomendación de IaC:** AWS SAM para este stack. Un `template.yaml` lo implementa todo. Agrega `samconfig.toml` para separación de entornos (dev/prod).

---

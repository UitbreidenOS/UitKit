---
name: pulumi
description: "Pulumi Infraestructura como Código: definir infraestructura en la nube en TypeScript, Python o Go — AWS, GCP, Azure, Kubernetes — con todo el poder del lenguaje de programación en lugar de YAML/HCL"
---

# Skill Pulumi

## Cuándo activar
- Definir infraestructura en la nube en TypeScript, Python o Go en lugar de HCL/YAML
- Equipos que ya usan TypeScript/Python y quieren evitar aprender sintaxis de Terraform
- Infraestructura compleja que se beneficia de bucles, condicionales y abstracciones
- Reutilizar patrones de infraestructura en proyectos como paquetes npm/pip
- Migrar desde Terraform o CloudFormation a un lenguaje de programación

## Cuándo NO usar
- Infraestructura simple administrada por un equipo fluido en Terraform — no cambies sin razón
- Base de código existente de Terraform — mantenerte en él; no mezcles a menos que estés migrando
- Infraestructura definida por asistente de consola en la nube — generar Terraform desde la exportación de consola en su lugar

## Instrucciones

### Configuración del proyecto

```bash
# Instalar CLI de Pulumi
curl -fsSL https://get.pulumi.com | sh

# Iniciar sesión (usa Pulumi Cloud para estado por defecto, o S3/GCS para autohospedado)
pulumi login

# Crear nuevo proyecto
mkdir infra && cd infra
pulumi new aws-typescript      # TypeScript + AWS
pulumi new gcp-python          # Python + GCP
pulumi new azure-typescript    # TypeScript + Azure
pulumi new kubernetes-typescript

# Instalar proveedores
npm install @pulumi/aws @pulumi/awsx   # AWS + componentes de nivel superior
npm install @pulumi/gcp
npm install @pulumi/azure-native
npm install @pulumi/kubernetes

# Configurar credenciales en la nube
pulumi config set aws:region us-east-1
pulumi config set --secret db:password "mypassword"  # encriptado en estado

# Desplegar
pulumi up          # vista previa + despliegue
pulumi up --yes    # desplegar sin vista previa
pulumi destroy     # derribar todos los recursos
pulumi stack ls    # listar pilas (dev/staging/prod)
```

### Infraestructura de AWS

```typescript
Definir infraestructura de AWS para [aplicación] en TypeScript.

Aplicación: [describir]
Recursos: [VPC / ECS / RDS / Lambda / S3 / etc.]

// index.ts — API sin servidor + base de datos
import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

// Configuración (establecer con: pulumi config set key value)
const config = new pulumi.Config()
const dbPassword = config.requireSecret('dbPassword')
const environment = pulumi.getStack()  // 'dev', 'staging', 'prod'

// VPC con subredes públicas y privadas
const vpc = new awsx.ec2.Vpc('main-vpc', {
  numberOfAvailabilityZones: 2,
  subnetSpecs: [
    { type: awsx.ec2.SubnetType.Public },
    { type: awsx.ec2.SubnetType.Private },
  ],
})

// RDS PostgreSQL
const db = new aws.rds.Instance('main-db', {
  engine: 'postgres',
  engineVersion: '16.3',
  instanceClass: environment === 'prod' ? 'db.t3.medium' : 'db.t3.micro',
  allocatedStorage: 20,
  dbName: 'myapp',
  username: 'myapp',
  password: dbPassword,
  vpcSecurityGroupIds: [dbSecurityGroup.id],
  dbSubnetGroupName: dbSubnetGroup.name,
  skipFinalSnapshot: environment !== 'prod',
  deletionProtection: environment === 'prod',
  tags: { Environment: environment, Project: 'myapp' },
})

// Servicio ECS Fargate
const cluster = new aws.ecs.Cluster('main-cluster')

const service = new awsx.ecs.FargateService('api-service', {
  cluster: cluster.arn,
  networkConfiguration: {
    subnets: vpc.privateSubnetIds,
    securityGroups: [apiSecurityGroup.id],
  },
  taskDefinitionArgs: {
    container: {
      name: 'api',
      image: `${ecrRepo.repositoryUrl}:latest`,
      cpu: 256,
      memory: 512,
      environment: [
        { name: 'NODE_ENV', value: environment },
        { name: 'DATABASE_URL', value: db.endpoint.apply(ep => `postgres://myapp:...@${ep}/myapp`) },
      ],
      portMappings: [{ containerPort: 3000 }],
    },
  },
  desiredCount: environment === 'prod' ? 2 : 1,
})

// Salidas
export const apiEndpoint = loadBalancer.dnsName
export const dbEndpoint = db.endpoint

Generar la infraestructura de Pulumi para mi aplicación.
```

### Pilas multi-entorno

```typescript
Configurar infraestructura multi-entorno con pilas de Pulumi.

Entornos: [dev / staging / production]

// Cada entorno es una "pila" de Pulumi:
// pulumi stack init dev
// pulumi stack init staging
// pulumi stack init prod

// Pulumi.dev.yaml — configuración de dev (creado automáticamente por pulumi config set)
config:
  myapp:dbInstanceClass: db.t3.micro
  myapp:desiredCount: 1
  myapp:enableDeletion: true

// Pulumi.prod.yaml — configuración de prod
config:
  myapp:dbInstanceClass: db.t3.large
  myapp:desiredCount: 3
  myapp:enableDeletion: false
  myapp:multiAz: true

// index.ts — lee configuración para pila actual
const config = new pulumi.Config()
const instanceClass = config.get('dbInstanceClass') ?? 'db.t3.micro'
const desiredCount = config.getNumber('desiredCount') ?? 1

// Desplegar en un entorno específico:
pulumi stack select prod
pulumi up

// O en CI:
pulumi stack select staging && pulumi up --yes
```

### Kubernetes con Pulumi

```typescript
Desplegar recursos de Kubernetes usando TypeScript de Pulumi.

// Sin YAML — escribir manifiestos de Kubernetes en TypeScript
import * as k8s from '@pulumi/kubernetes'

const appLabels = { app: 'my-service', version: '1.0.0' }

const deployment = new k8s.apps.v1.Deployment('my-service', {
  metadata: { namespace: 'production' },
  spec: {
    replicas: 3,
    selector: { matchLabels: appLabels },
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [{
          name: 'api',
          image: 'my-registry/my-service:v1.0.0',
          resources: {
            requests: { cpu: '100m', memory: '128Mi' },
            limits: { cpu: '500m', memory: '512Mi' },
          },
          env: [
            { name: 'NODE_ENV', value: 'production' },
            {
              name: 'DATABASE_URL',
              valueFrom: {
                secretKeyRef: { name: 'db-secret', key: 'url' }
              }
            }
          ],
          ports: [{ containerPort: 3000 }],
          livenessProbe: {
            httpGet: { path: '/health', port: 3000 },
            initialDelaySeconds: 30,
          },
        }],
      },
    },
    strategy: {
      type: 'RollingUpdate',
      rollingUpdate: { maxSurge: 1, maxUnavailable: 0 },
    },
  },
})

// HelmRelease usando Pulumi
const nginx = new k8s.helm.v3.Release('nginx-ingress', {
  chart: 'ingress-nginx',
  repositoryOpts: { repo: 'https://kubernetes.github.io/ingress-nginx' },
  namespace: 'ingress-nginx',
  createNamespace: true,
  values: {
    controller: { replicaCount: 2 },
  },
})
```

## Ejemplo

**Usuario:** Usamos Terraform pero nuestro equipo son desarrolladores de TypeScript que odian HCL. ¿Deberíamos cambiar a Pulumi?

**Evaluación de Claude:**

Si tu equipo es fuerte en TypeScript y estás comenzando de nuevo o tienes < 2 años de historial de Terraform, sí — cambia ahora. Aquí está el por qué y por qué no:

**Cambiar a Pulumi si:**
- El equipo conoce TypeScript, resiste aprender HCL
- Necesitas bucles, condicionales y abstracciones que Terraform dificulta (ej. crear 50 funciones Lambda con ligeras variaciones)
- Quieres reutilizar patrones de infraestructura como paquetes npm en proyectos
- Estás construyendo herramientas de plataforma interna que incrustan lógica de infraestructura

**Mantenerse en Terraform si:**
- Base de código existente de Terraform > 1 año de antigüedad
- El equipo está cómodo con HCL
- Usas muchos módulos de Terraform del registro (Pulumi tiene menos)
- Necesitas Terraform Cloud o Atlantis para flujos de trabajo de equipo (Pulumi Cloud existe pero tiene menos ecosistema)

**La ruta de migración:**
Pulumi tiene un comando `pulumi convert --from terraform` que convierte HCL a TypeScript/Python — no es perfecto pero maneja ~70% de configuraciones típicas. Migra módulo por módulo, no todo de una vez.

---

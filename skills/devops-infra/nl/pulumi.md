---
name: pulumi
description: "Pulumi Infrastructure as Code: define cloud infrastructure in TypeScript, Python, or Go — AWS, GCP, Azure, Kubernetes — with full programming language power instead of YAML/HCL"
---

# Pulumi Skill

## Wanneer activeren
- Cloud-infrastructuur definiëren in TypeScript, Python of Go in plaats van HCL/YAML
- Teams die al TypeScript/Python gebruiken en Terraform-syntaxis willen vermijden
- Complexe infrastructuur die voordeel haalt uit loops, conditionals en abstractions
- Infrastructuurpatronen hergebruiken over projecten als npm/pip-pakketten
- Migreren van Terraform of CloudFormation naar een programmeertaal

## Wanneer NIET gebruiken
- Eenvoudige infrastructuur beheerd door een team dat vaardig is in Terraform — wissel niet zonder reden
- Bestaande Terraform-codebase — houd eraan vast; mix niet tenzij u migreert
- Infrastructuur gedefinieerd door een cloud-consolewizard — genereer Terraform vanuit het console-export in plaats daarvan

## Instructies

### Projectconfiguratie

```bash
# Install Pulumi CLI
curl -fsSL https://get.pulumi.com | sh

# Login (uses Pulumi Cloud for state by default, or S3/GCS for self-hosted)
pulumi login

# Create new project
mkdir infra && cd infra
pulumi new aws-typescript      # TypeScript + AWS
pulumi new gcp-python          # Python + GCP
pulumi new azure-typescript    # TypeScript + Azure
pulumi new kubernetes-typescript

# Install providers
npm install @pulumi/aws @pulumi/awsx   # AWS + higher-level components
npm install @pulumi/gcp
npm install @pulumi/azure-native
npm install @pulumi/kubernetes

# Configure cloud credentials
pulumi config set aws:region us-east-1
pulumi config set --secret db:password "mypassword"  # encrypted in state

# Deploy
pulumi up          # preview + deploy
pulumi up --yes    # deploy without preview
pulumi destroy     # tear down all resources
pulumi stack ls    # list stacks (dev/staging/prod)
```

### AWS-infrastructuur

```typescript
Define AWS infrastructure for [application] in TypeScript.

Application: [describe]
Resources: [VPC / ECS / RDS / Lambda / S3 / etc.]

// index.ts — serverless API + database
import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

// Config (set with: pulumi config set key value)
const config = new pulumi.Config()
const dbPassword = config.requireSecret('dbPassword')
const environment = pulumi.getStack()  // 'dev', 'staging', 'prod'

// VPC with public and private subnets
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

// ECS Fargate service
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

// Outputs
export const apiEndpoint = loadBalancer.dnsName
export const dbEndpoint = db.endpoint

Generate the Pulumi infrastructure for my application.
```

### Multi-omgeving stacks

```typescript
Set up multi-environment infrastructure with Pulumi stacks.

Environments: [dev / staging / production]

// Each environment is a Pulumi "stack":
// pulumi stack init dev
// pulumi stack init staging
// pulumi stack init prod

// Pulumi.dev.yaml — dev config (auto-created by pulumi config set)
config:
  myapp:dbInstanceClass: db.t3.micro
  myapp:desiredCount: 1
  myapp:enableDeletion: true

// Pulumi.prod.yaml — prod config
config:
  myapp:dbInstanceClass: db.t3.large
  myapp:desiredCount: 3
  myapp:enableDeletion: false
  myapp:multiAz: true

// index.ts — reads config for current stack
const config = new pulumi.Config()
const instanceClass = config.get('dbInstanceClass') ?? 'db.t3.micro'
const desiredCount = config.getNumber('desiredCount') ?? 1

// Deploy to a specific environment:
pulumi stack select prod
pulumi up

// Or in CI:
pulumi stack select staging && pulumi up --yes
```

### Kubernetes met Pulumi

```typescript
Deploy Kubernetes resources using Pulumi TypeScript.

// No YAML — write Kubernetes manifests in TypeScript
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

// HelmRelease using Pulumi
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

## Voorbeeld

**Gebruiker:** We gebruiken Terraform, maar ons team bestaat uit TypeScript-ontwikkelaars die HCL haten. Moeten we naar Pulumi overstappen?

**Claude's beoordeling:**

Als uw team sterke TypeScript-ontwikkelaars zijn en u begint opnieuw of hebt < 2 jaar Terraform-geschiedenis, ja — wissel nu. Hier is waarom en waarom niet:

**Wissel naar Pulumi als:**
- Team kent TypeScript, weigert HCL te leren
- U hebt loops, conditionals en abstractions nodig die Terraform pijnlijk maakt (bijv. 50 Lambda-functies maken met lichte variaties)
- U wilt infrastructuurpatronen hergebruiken als npm-pakketten over projecten
- U bouwt interne platformtools die infrastructuurlogica inbedden

**Blijf op Terraform als:**
- Bestaande Terraform-codebase > 1 jaar oud
- Team is comfortabel met HCL
- U gebruikt veel Terraform-modules van het register (Pulumi heeft er minder)
- U hebt Terraform Cloud of Atlantis nodig voor teamworkflows (Pulumi Cloud bestaat maar heeft minder ecosysteem)

**Het migratiepad:**
Pulumi heeft een `pulumi convert --from terraform`-opdracht die HCL naar TypeScript/Python converteert — het is niet perfect, maar handelt ~70% van typische configs af. Migreer module voor module, niet allemaal tegelijk.

---

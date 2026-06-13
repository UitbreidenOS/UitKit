---
name: pulumi
description: "Pulumi Infrastructure as Code: define cloud infrastructure in TypeScript, Python, or Go — AWS, GCP, Azure, Kubernetes — with full programming language power instead of YAML/HCL"
---

# Pulumi Skill

## Wann aktivieren
- Defining cloud infrastructure in TypeScript, Python, or Go instead of HCL/YAML
- Teams already using TypeScript/Python who want to avoid learning Terraform syntax
- Complex infrastructure that benefits from loops, conditionals, and abstractions
- Reusing infrastructure patterns across projects as npm/pip packages
- Migrating from Terraform or CloudFormation to a programming language

## Wann NICHT verwenden
- Simple infrastructure managed by a team fluent in Terraform — don't switch for no reason
- Existing Terraform codebase — stick with it; don't mix unless migrating
- Infrastructure defined by a cloud console wizard — generate Terraform from the console export instead

## Anweisungen

### Project setup

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

### AWS infrastructure

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

### Multi-environment stacks

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

### Kubernetes with Pulumi

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

## Beispiel

**User:** We use Terraform but our team is TypeScript developers who hate HCL. Should we switch to Pulumi?

**Claude's assessment:**

If your team is strong TypeScript developers and you're starting fresh or have < 2 years of Terraform history, yes — switch now. Here's why and why not:

**Switch to Pulumi if:**
- Team knows TypeScript, resists learning HCL
- You need loops, conditionals, and abstractions Terraform makes painful (e.g. creating 50 Lambda functions with slight variations)
- You want to reuse infrastructure patterns as npm packages across projects
- You're building internal platform tools that embed infrastructure logic

**Stay on Terraform if:**
- Existing Terraform codebase > 1 year old
- Team is comfortable with HCL
- You use many Terraform modules from the registry (Pulumi has fewer)
- You need Terraform Cloud or Atlantis for team workflows (Pulumi Cloud exists but has less ecosystem)

**The migration path:**
Pulumi has a `pulumi convert --from terraform` command that converts HCL to TypeScript/Python — it's not perfect but handles ~70% of typical configs. Migrate module by module, not all at once.

---

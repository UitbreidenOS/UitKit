---
name: pulumi
description: "Pulumi Infrastructure as Code : définir l'infrastructure cloud en TypeScript, Python ou Go — AWS, GCP, Azure, Kubernetes — avec la puissance complète du langage de programmation au lieu de YAML/HCL"
---

# Pulumi Skill

## Quand activer
- Définir l'infrastructure cloud en TypeScript, Python ou Go au lieu de HCL/YAML
- Les équipes utilisant déjà TypeScript/Python qui veulent éviter d'apprendre la syntaxe Terraform
- L'infrastructure complexe qui bénéficie de boucles, de conditions et d'abstractions
- Réutiliser les modèles d'infrastructure dans les projets en tant que paquets npm/pip
- Migrer de Terraform ou CloudFormation vers un langage de programmation

## Quand ne PAS utiliser
- Infrastructure simple gérée par une équipe courante en Terraform — ne pas changer sans raison
- Base de code Terraform existante — rester avec elle ; ne pas mélanger sauf si vous migrez
- Infrastructure définie par un assistant de console cloud — générer Terraform à partir de l'export de la console

## Instructions

### Configuration du projet

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

### Infrastructure AWS

```typescript
Définir l'infrastructure AWS pour [application] en TypeScript.

Application: [décrire]
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

Générer l'infrastructure Pulumi pour mon application.
```

### Piles multi-environnements

```typescript
Configurer l'infrastructure multi-environnement avec des piles Pulumi.

Environments: [dev / staging / production]

// Chaque environnement est une "pile" Pulumi :
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

### Kubernetes avec Pulumi

```typescript
Déployer des ressources Kubernetes en utilisant Pulumi TypeScript.

// Pas de YAML — écrire des manifestes Kubernetes en TypeScript
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

## Exemple

**User:** Nous utilisons Terraform mais notre équipe est des développeurs TypeScript qui détestent HCL. Devrions-nous passer à Pulumi?

**Claude's assessment:**

Si votre équipe est composée de développeurs TypeScript forts et que vous commencez à zéro ou que vous avez < 2 ans d'antécédents Terraform, oui — passer maintenant. Voici pourquoi et pourquoi pas :

**Passer à Pulumi si :**
- L'équipe connaît TypeScript, résiste à l'apprentissage du HCL
- Vous avez besoin de boucles, de conditions et d'abstractions que Terraform rend douloureux (p.ex. créer 50 fonctions Lambda avec de légères variations)
- Vous voulez réutiliser les modèles d'infrastructure en tant que paquets npm dans les projets
- Vous construisez des outils de plate-forme interne qui intègrent la logique d'infrastructure

**Rester sur Terraform si :**
- Base de code Terraform existante > 1 an
- L'équipe est à l'aise avec HCL
- Vous utilisez de nombreux modules Terraform du registre (Pulumi en a moins)
- Vous avez besoin de Terraform Cloud ou Atlantis pour les flux de travail d'équipe (Pulumi Cloud existe mais a un écosystème moins riche)

**Le chemin de migration :**
Pulumi a une commande `pulumi convert --from terraform` qui convertit HCL en TypeScript/Python — ce n'est pas parfait mais gère ~70% des configurations typiques. Migrer module par module, pas tout à la fois.

---

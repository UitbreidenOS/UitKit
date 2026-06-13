---
name: azure-architect
description: "Azure architecture design: App Service, AKS, Azure Functions, Cosmos DB, Bicep IaC templates, cost optimisation, Entra ID integration, and migration patterns"
updated: 2026-06-13
---

# Azure Architect Skill

## When to activate
- Designing a new Azure architecture from scratch
- Choosing between Azure service options (App Service vs AKS vs Functions, Cosmos DB vs Azure SQL, etc.)
- Generating Bicep or ARM templates for a pattern
- Optimising Azure costs on an existing deployment
- Planning a migration to Azure from on-prem or another cloud
- Setting up Azure DevOps or GitHub Actions for Azure deployments

## When NOT to use
- AWS-specific architecture — use the aws-architect skill
- GCP-specific architecture — use the gcp-architect skill
- Cloud security posture review — use the cloud-security skill

## Instructions

### Architecture pattern selection

```
Select the right Azure architecture pattern for [application].

Application type: [web app / mobile backend / SaaS / microservices / data pipeline]
Scale: [users/day, requests/second]
Team Azure experience: [beginner / intermediate / advanced]
Budget: $[X]/month target
Compliance: [GDPR / HIPAA / ISO 27001 / PCI / none]
Microsoft stack: [already using M365 / Teams / Azure AD? Yes / No]

Azure pattern guide:

APP SERVICE (recommended for: web apps, APIs, low ops overhead):
Stack: Front Door + App Service + Azure SQL + Redis Cache + Key Vault
Cost: ~$50-300/month depending on tier
Pros: familiar PaaS, built-in deployment slots (blue-green), Entra ID integration
Cons: less flexible than containers, platform-imposed limits
Best for: .NET, Node.js, Python web apps; teams migrating from IIS or other PaaS

AZURE FUNCTIONS (recommended for: event-driven, serverless):
Stack: Front Door + Functions + Cosmos DB + Service Bus + Storage
Cost: ~$0-50/month for small workloads (Consumption plan)
Pros: pay-per-execution, auto-scale, 200+ triggers/bindings
Cons: cold starts on Consumption plan; avoid for > 10 min execution; stateful needs Durable Functions
Best for: event-driven microservices, background jobs, webhooks, scheduled tasks

AKS (recommended for: microservices, existing K8s teams):
Stack: Front Door + AKS + Azure SQL / Cosmos DB + Service Bus + ACR
Cost: ~$200-1000/month minimum (running node pools 24/7)
Pros: full Kubernetes control, multi-cloud portability, KEDA for scaling
Cons: operational complexity, higher baseline cost
Best for: teams with K8s experience, complex microservices, needing fine-grained control

DATA / ANALYTICS:
Stack: Event Hubs + Stream Analytics / Databricks + Azure Data Lake + Synapse Analytics
Best for: IoT, telemetry, data warehousing, BI

Recommend the pattern for my application with cost estimate and Bicep starter template.
```

### Bicep template

```
Generate a Bicep template for [pattern].

Pattern: [App Service web app / Functions API / AKS microservices]
Resource group: [name]
Environment: [dev / staging / prod]
Region: [westeurope / eastus / etc.]

App Service web app (Bicep):
param appName string
param environment string = 'prod'
param location string = resourceGroup().location
param sku string = 'B2'  // B1/B2/B3 = Basic; S1-S3 = Standard; P1v3-P3v3 = Premium

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan-${environment}'
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true  // required for Linux
  }
}

// App Service
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-${environment}'
  location: location
  identity: {
    type: 'SystemAssigned'  // managed identity for Key Vault access
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      minTlsVersion: '1.2'
      appSettings: [
        { name: 'WEBSITE_RUN_FROM_PACKAGE', value: '1' }
        { name: 'NODE_ENV', value: environment }
      ]
    }
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${appName}-kv-${environment}'
  location: location
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true  // RBAC over access policies
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}

// Key Vault RBAC: grant web app managed identity Secret Reader
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')  // Key Vault Secrets User
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

Generate the full Bicep template for my pattern with security hardening.
```

### Entra ID (Azure AD) integration

```
Design Entra ID authentication for [application].

Application type: [SPA / web app / API / service-to-service]
Users: [internal employees only / external customers / both]
Access pattern: [SSO only / API access / delegated permissions]

Common patterns:

EMPLOYEE SSO (Microsoft 365 integration):
// App registration in Entra ID:
// Authentication → Add platform → Web → Redirect URI: https://app.com/auth/callback
// API permissions → Microsoft Graph → User.Read (delegated)

// MSAL.js for SPA:
import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
});

EXTERNAL CUSTOMERS (Azure AD B2C):
// Separate B2C tenant from corporate Entra ID
// User flows: sign-up/sign-in, password reset, profile edit
// Social identity providers: Google, Facebook, Apple (add in B2C portal)
// Custom domains: login.yourapp.com instead of yourb2ctenant.b2clogin.com

SERVICE-TO-SERVICE (managed identity preferred):
// No secrets — uses managed identity from VMSS/App Service/AKS workload identity
// Client credentials flow if managed identity not available:
const credential = new DefaultAzureCredential();
const token = await credential.getToken('https://management.azure.com/.default');

RBAC with App Roles (custom roles in your app):
// Define app roles in manifest:
// { "allowedMemberTypes": ["User"], "displayName": "Admin", "value": "Admin" }
// Check role in API: user.roles.includes('Admin')

Design the authentication architecture for my application type.
```

### Cost optimisation

```
Audit Azure costs and identify optimisation opportunities.

Current monthly bill: $[X]
Biggest cost categories: [App Service / AKS / SQL / Cosmos DB / Storage / other]

Cost optimisation checklist:

COMPUTE (App Service / VMs):
□ Reserved instances for stable baseline? (1-year = 30-40% saving)
□ Dev/test instances running 24/7? → use Azure Dev/Test pricing or auto-shutdown
□ App Service plan right-sized? (check: CPU < 20% average = over-provisioned)
□ Scale-in configured for nights/weekends?

AKS:
□ Node pools using spot VMs for non-critical workloads? (60-90% cheaper)
□ KEDA scaling to zero for batch/event workloads?
□ Azure Hybrid Benefit applied if you have Windows Server licences?

DATABASES:
□ Azure SQL serverless tier for dev/staging? (pauses when idle)
□ Cosmos DB in serverless mode for < 1000 RU/s average throughput?
□ Azure SQL elastic pools if you have many small databases?
□ DTU → vCore migration for large databases (more price-performance control)?

STORAGE:
□ Blob storage lifecycle management (Hot → Cool → Archive by access pattern)?
□ LRS vs GRS — does non-prod need geo-redundant storage?

NETWORKING:
□ Azure CDN in front of Storage / App Service (cheaper egress than direct)?
□ VNet integration configured to avoid public endpoint charges?

ADVISOR RECOMMENDATIONS:
Run: az advisor recommendation list --category Cost
Azure Cost Management → Cost alerts configured?
Azure Savings Plans vs Reserved Instances (evaluate quarterly)

Generate the optimisation plan for my spend profile.
```

## Example

**User:** We're a UK-based B2B SaaS. £15K/month Azure bill. Mostly App Service (10 plans) + Azure SQL (5 databases). Teams hates the "it's slow in the afternoon" complaints. What do we do?

**Claude's diagnosis:**

Two problems: cost and performance. They're related.

**Cost (£15K/month is high for 10 App Service plans + 5 DBs):**
- 10 App Service plans at ~£800-1200/plan = most of your bill. Most teams run dev/staging on the same tier as prod. Check: are your dev/staging instances on Premium v3? Downgrade to B2 or B3 for non-prod = ~£400-600/month saving.
- Azure SQL: are you paying for 5 separate databases when elastic pools would cover them? If databases peak at different times, elastic pool shares DTUs = typically 30-40% cheaper.

**Performance ("slow in the afternoon" = almost always one of):**
1. App Service autoscale not configured or not scaling fast enough — add autoscale rule: scale out when CPU > 65% for 5 minutes
2. Azure SQL DTU cap being hit — check: Azure portal → SQL database → Query Performance Insight → top 5 queries by duration/CPU
3. No Redis cache — every afternoon user generates database reads that could be cached. Add Azure Cache for Redis (C1 = ~£50/month, eliminates most repeated DB reads)

**Quick wins (this week):**
- Enable autoscale on all App Service plans with >1 instance
- Add Query Performance Insight to each SQL DB — shows you the slow queries in 10 minutes
- Move dev/staging to B-tier or use Azure Dev/Test subscription pricing

---

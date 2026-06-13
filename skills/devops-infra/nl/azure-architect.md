---
name: azure-architect
description: "Azure-architectuur ontwerp: App Service, AKS, Azure Functions, Cosmos DB, Bicep IaC-sjablonen, kostenoptimalisatie, Entra ID-integratie en migratiepatronen"
---

# Azure Architect Skill

## Wanneer activeren
- Een nieuwe Azure-architectuur helemaal opnieuw ontwerpen
- Kiezen tussen Azure-serviceopties (App Service vs AKS vs Functions, Cosmos DB vs Azure SQL, etc.)
- Bicep- of ARM-templates genereren voor een patroon
- Azure-kosten op een bestaande implementatie optimaliseren
- Een migratie naar Azure van on-premises of een andere cloud plannen
- Azure DevOps of GitHub Actions instellen voor Azure-implementaties

## Wanneer NIET gebruiken
- AWS-specifieke architectuur — gebruik de aws-architect skill
- GCP-specifieke architectuur — gebruik de gcp-architect skill
- Controle van de cloud-beveiligingshouding — gebruik de cloud-security skill

## Instructies

### Selectie van architectuurpatroon

```
Selecteer het juiste Azure-architectuurpatroon voor [toepassing].

Toepassingstype: [web-app / mobiele backend / SaaS / microservices / datapijplijn]
Schaal: [gebruikers/dag, verzoeken/seconde]
Azure-ervaring van het team: [beginner / intermediate / gevorderd]
Budget: $[X]/maand doel
Compliance: [GDPR / HIPAA / ISO 27001 / PCI / geen]
Microsoft-stack: [al M365 / Teams / Azure AD aan het gebruiken? Ja / Nee]

Handleiding voor Azure-patroon:

APP SERVICE (aanbevolen voor: web-apps, API's, lage operationele overhead):
Stack: Front Door + App Service + Azure SQL + Redis Cache + Key Vault
Kosten: ~$50-300/maand afhankelijk van tier
Voordelen: vertrouwde PaaS, ingebouwde implementatiesites (blue-green), Entra ID-integratie
Nadelen: minder flexibel dan containers, platformgebonden limieten
Beste voor: .NET, Node.js, Python web-apps; teams migreren van IIS of andere PaaS

AZURE FUNCTIONS (aanbevolen voor: event-driven, serverless):
Stack: Front Door + Functions + Cosmos DB + Service Bus + Storage
Kosten: ~$0-50/maand voor kleine workloads (Consumption plan)
Voordelen: betaal-per-uitvoering, auto-schaal, 200+ triggers/bindings
Nadelen: koude starts op Consumption plan; vermijd > 10 min uitvoering; stateful = Durable Functions
Beste voor: event-driven microservices, achtergrondtaken, webhooks, geplande taken

AKS (aanbevolen voor: microservices, bestaande K8s-teams):
Stack: Front Door + AKS + Azure SQL / Cosmos DB + Service Bus + ACR
Kosten: ~$200-1000/maand minimum (knooppuntpools 24/7 actief)
Voordelen: volledige Kubernetes-controle, multi-cloud-portabiliteit, KEDA voor schaling
Nadelen: operationele complexiteit, hogere basiskosten
Beste voor: teams met K8s-ervaring, complexe microservices, fijngranulaire controle nodig

GEGEVENS / ANALYTICS:
Stack: Event Hubs + Stream Analytics / Databricks + Azure Data Lake + Synapse Analytics
Beste voor: IoT, telemetrie, datawarehousing, BI

Aanbeveel het patroon voor mijn toepassing met kostenschatting en Bicep starter-template.
```

### Bicep-sjabloon

```
Genereer een Bicep-sjabloon voor [patroon].

Patroon: [App Service web-app / Functions API / AKS microservices]
Resourcegroep: [naam]
Omgeving: [dev / staging / prod]
Regio: [westeurope / eastus / etc.]

App Service web-app (Bicep):
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
    reserved: true  // vereist voor Linux
  }
}

// App Service
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-${environment}'
  location: location
  identity: {
    type: 'SystemAssigned'  // beheerde identiteit voor Key Vault-toegang
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
    enableRbacAuthorization: true  // RBAC over toegangsbeleid
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}

// Key Vault RBAC: web-app beheerde identiteit Secret Reader toekennen
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')  // Key Vault Secrets User
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

Genereer de volledige Bicep-sjabloon voor mijn patroon met beveiligingshardening.
```

### Entra ID (Azure AD) integratie

```
Ontwerp Entra ID-authenticatie voor [toepassing].

Toepassingstype: [SPA / web-app / API / service-to-service]
Gebruikers: [alleen interne medewerkers / externe klanten / beide]
Toegangspatroon: [alleen SSO / API-toegang / gedelegeerde machtigingen]

Algemene patronen:

WERKNEMER-SSO (Microsoft 365-integratie):
// App-registratie in Entra ID:
// Verificatie → Platform toevoegen → Web → Redirect URI: https://app.com/auth/callback
// API-machtigingen → Microsoft Graph → User.Read (gedelegeerd)

// MSAL.js voor SPA:
import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
});

EXTERNE KLANTEN (Azure AD B2C):
// Afzonderlijke B2C-tenant van bedrijfs-Entra ID
// Gebruikersflows: aanmelden/registratie, wachtwoord opnieuw instellen, profiel bewerken
// Social-identiteitsproviders: Google, Facebook, Apple (toevoegen in B2C-portal)
// Aangepaste domeinen: login.yourapp.com in plaats van yourb2ctenant.b2clogin.com

SERVICE-TO-SERVICE (voorkeur voor beheerde identiteit):
// Geen geheimen — gebruikt beheerde identiteit van VMSS/App Service/AKS workload identity
// Client-credentials-flow als beheerde identiteit niet beschikbaar:
const credential = new DefaultAzureCredential();
const token = await credential.getToken('https://management.azure.com/.default');

RBAC met app-rollen (aangepaste rollen in uw app):
// App-rollen in manifest definiëren:
// { "allowedMemberTypes": ["User"], "displayName": "Admin", "value": "Admin" }
// Rol in API controleren: user.roles.includes('Admin')

Ontwerp de authenticatiearchitectuur voor mijn toepassingstype.
```

### Kostenoptimalisatie

```
Controleer Azure-kosten en identificeer optimalisatiemogelijkheden.

Huidige maandelijkse factuur: $[X]
Grootste kostencategorieën: [App Service / AKS / SQL / Cosmos DB / Storage / overig]

Checklist voor kostenoptimalisatie:

BEREKENING (App Service / VMs):
□ Gereserveerde instances voor stabiele baseline? (1 jaar = 30-40% besparing)
□ Dev/test-instances 24/7 actief? → Azure Dev/Test-prijzen of auto-shutdown gebruiken
□ App Service plan correct aangepast? (controleren: CPU < 20% gemiddeld = overingericht)
□ Scale-in geconfigureerd voor nachten/weekenden?

AKS:
□ Knooppuntpools gebruiken spot-VM's voor niet-kritieke workloads? (60-90% goedkoper)
□ KEDA-schaling naar nul voor batch-/event-workloads?
□ Azure Hybrid Benefit toegepast als u Windows Server-licenties hebt?

DATABASES:
□ Azure SQL serverless-tier voor dev/staging? (pauzeert wanneer inactief)
□ Cosmos DB in serverless-modus voor < 1000 RU/s gemiddelde doorvoer?
□ Azure SQL elastische pools als u veel kleine databases hebt?
□ DTU → vCore-migratie voor grote databases (meer prijs-prestatiebeheer)?

OPSLAG:
□ Blob-opslag lifecycle-beheer (Hot → Cool → Archive naar toegangspatroon)?
□ LRS vs GRS — heeft non-prod geo-redundante opslag nodig?

NETWERK:
□ Azure CDN voor Storage / App Service (goedkopere egress dan direct)?
□ VNet-integratie geconfigureerd om openbare eindpuntkosten te vermijden?

ADVISOR-AANBEVELINGEN:
Uitvoeren: az advisor recommendation list --category Cost
Azure Cost Management → Kostalerts geconfigureerd?
Azure Savings Plans vs Reserved Instances (driemaandelijks evalueren)

Genereer het optimalisatieplan voor mijn uitgavenprofiel.
```

## Voorbeeld

**Gebruiker:** We zijn een UK-gebaseerde B2B SaaS. £15K/maand Azure-rekening. Voornamelijk App Service (10 plans) + Azure SQL (5 databases). Teams haat de klachten "het is langzaam 's middags". Wat doen we?

**Claude's diagnose:**

Twee problemen: kosten en prestatie. Ze zijn gerelateerd.

**Kosten (£15K/maand is hoog voor 10 App Service plans + 5 DBs):**
- 10 App Service plans à ~£800-1200/plan = het grootste deel van uw rekening. De meeste teams voeren dev/staging op dezelfde tier uit als prod. Controleren: zijn uw dev/staging-instances op Premium v3? Downgrade naar B2 of B3 voor non-prod = ~£400-600/maand besparing.
- Azure SQL: betaalt u voor 5 aparte databases wanneer elastische pools ze zouden dekken? Als databases op verschillende momenten pieken bereiken, deelt elastische pool DTU's = typisch 30-40% goedkoper.

**Prestatie ("langzaam 's middags" = bijna altijd een van):**
1. App Service autoscale niet geconfigureerd of niet snel genoeg schaalend — autoscale-regel toevoegen: schaal uit als CPU > 65% voor 5 minuten
2. Azure SQL DTU-limiet bereikt — controleren: Azure-portal → SQL-database → Query Performance Insight → top 5 query's op duur/CPU
3. Geen Redis-cache — elke middag genereert de gebruiker databaseleesacties die in cache opgeslagen zouden kunnen worden. Azure Cache for Redis toevoegen (C1 = ~£50/maand, elimineert de meeste herhaalde DB-leesacties)

**Snelle wins (deze week):**
- Autoscale inschakelen op alle App Service plans met > 1 instance
- Query Performance Insight toevoegen aan elke SQL-DB — toont langzame query's in 10 minuten
- Dev/staging verplaatsen naar B-tier of Azure Dev/Test-abonnement prijzen gebruiken

---

---
name: azure-architect
description: "Conception d'architecture Azure : App Service, AKS, Azure Functions, Cosmos DB, modèles Bicep IaC, optimisation des coûts, intégration Entra ID et patterns de migration"
---

# Compétence Azure Architect

## Quand activer
- Concevoir une nouvelle architecture Azure à partir de zéro
- Choisir entre les options de services Azure (App Service vs AKS vs Functions, Cosmos DB vs Azure SQL, etc.)
- Générer des modèles Bicep ou ARM pour un pattern
- Optimiser les coûts Azure sur un déploiement existant
- Planifier une migration vers Azure depuis on-premises ou un autre cloud
- Configurer Azure DevOps ou GitHub Actions pour les déploiements Azure

## Quand NE PAS utiliser
- Architecture spécifique à AWS — utiliser la compétence aws-architect
- Architecture spécifique à GCP — utiliser la compétence gcp-architect
- Examen de la posture de sécurité cloud — utiliser la compétence cloud-security

## Instructions

### Sélection du pattern d'architecture

```
Sélectionner le pattern d'architecture Azure approprié pour [application].

Type d'application : [application web / backend mobile / SaaS / microservices / canalisation de données]
Échelle : [utilisateurs/jour, requêtes/seconde]
Expérience Azure de l'équipe : [débutant / intermédiaire / avancé]
Budget : $[X]/mois cible
Conformité : [GDPR / HIPAA / ISO 27001 / PCI / aucune]
Stack Microsoft : [utilisez déjà M365 / Teams / Azure AD ? Oui / Non]

Guide du pattern Azure :

APP SERVICE (recommandé pour : applications web, APIs, faible surcharge opérationnelle) :
Stack : Front Door + App Service + Azure SQL + Redis Cache + Key Vault
Coût : ~$50-300/mois selon le tier
Avantages : PaaS familier, emplacements de déploiement intégrés (blue-green), intégration Entra ID
Inconvénients : moins flexible que les conteneurs, limites imposées par la plateforme
Meilleur pour : applications web .NET, Node.js, Python ; équipes migrant depuis IIS ou une autre PaaS

AZURE FUNCTIONS (recommandé pour : event-driven, serverless) :
Stack : Front Door + Functions + Cosmos DB + Service Bus + Storage
Coût : ~$0-50/mois pour petites charges de travail (plan Consumption)
Avantages : facturation à l'exécution, auto-scaling, 200+ triggers/bindings
Inconvénients : démarrages à froid sur plan Consumption ; éviter pour durées > 10 min ; besoins stateful = Durable Functions
Meilleur pour : microservices event-driven, travaux en arrière-plan, webhooks, tâches planifiées

AKS (recommandé pour : microservices, équipes K8s existantes) :
Stack : Front Door + AKS + Azure SQL / Cosmos DB + Service Bus + ACR
Coût : ~$200-1000/mois minimum (pools de nœuds exécutés 24/7)
Avantages : contrôle Kubernetes complet, portabilité multi-cloud, KEDA pour l'échelonnage
Inconvénients : complexité opérationnelle, coût de base plus élevé
Meilleur pour : équipes avec expérience K8s, microservices complexes, nécessitant contrôle fin

DONNÉES / ANALYTICS :
Stack : Event Hubs + Stream Analytics / Databricks + Azure Data Lake + Synapse Analytics
Meilleur pour : IoT, télémétrie, entreposage de données, BI

Recommander le pattern pour mon application avec estimation de coût et modèle de démarrage Bicep.
```

### Modèle Bicep

```
Générer un modèle Bicep pour [pattern].

Pattern : [application web App Service / API Functions / microservices AKS]
Groupe de ressources : [nom]
Environnement : [dev / staging / prod]
Région : [westeurope / eastus / etc.]

Application web App Service (Bicep) :
param appName string
param environment string = 'prod'
param location string = resourceGroup().location
param sku string = 'B2'  // B1/B2/B3 = Basic ; S1-S3 = Standard ; P1v3-P3v3 = Premium

// Plan App Service
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan-${environment}'
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true  // requis pour Linux
  }
}

// App Service
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-${environment}'
  location: location
  identity: {
    type: 'SystemAssigned'  // identité gérée pour accès Key Vault
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
    enableRbacAuthorization: true  // RBAC plutôt que les politiques d'accès
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}

// RBAC Key Vault : accorder à l'identité gérée de l'application web Secret Reader
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')  // Key Vault Secrets User
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

Générer le modèle Bicep complet pour mon pattern avec durcissement de la sécurité.
```

### Intégration Entra ID (Azure AD)

```
Concevoir l'authentification Entra ID pour [application].

Type d'application : [SPA / application web / API / service-à-service]
Utilisateurs : [employés internes uniquement / clients externes / les deux]
Pattern d'accès : [SSO uniquement / accès API / permissions déléguées]

Patterns communs :

SSO EMPLOYÉ (intégration Microsoft 365) :
// Inscription d'application dans Entra ID :
// Authentification → Ajouter plateforme → Web → URI de redirection : https://app.com/auth/callback
// Permissions API → Microsoft Graph → User.Read (délégué)

// MSAL.js pour SPA :
import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
});

CLIENTS EXTERNES (Azure AD B2C) :
// Tenant B2C séparé du Entra ID d'entreprise
// Flux utilisateur : inscription/connexion, réinitialisation de mot de passe, édition de profil
// Fournisseurs d'identité sociaux : Google, Facebook, Apple (ajouter dans portail B2C)
// Domaines personnalisés : login.yourapp.com au lieu de yourb2ctenant.b2clogin.com

SERVICE-À-SERVICE (identité gérée préférée) :
// Pas de secrets — utilise l'identité gérée du VMSS/App Service/charge de travail AKS
// Flux d'accréditations client si identité gérée non disponible :
const credential = new DefaultAzureCredential();
const token = await credential.getToken('https://management.azure.com/.default');

RBAC avec rôles d'application (rôles personnalisés dans votre application) :
// Définir les rôles d'application dans le manifeste :
// { "allowedMemberTypes": ["User"], "displayName": "Admin", "value": "Admin" }
// Vérifier le rôle dans l'API : user.roles.includes('Admin')

Concevoir l'architecture d'authentification pour mon type d'application.
```

### Optimisation des coûts

```
Auditer les coûts Azure et identifier les opportunités d'optimisation.

Facture mensuelle actuelle : $[X]
Plus grandes catégories de coûts : [App Service / AKS / SQL / Cosmos DB / Storage / autre]

Checklist d'optimisation des coûts :

CALCUL (App Service / VMs) :
□ Instances réservées pour base stable ? (1 an = 30-40% d'économies)
□ Instances dev/test exécutées 24h/24 ? → utiliser la tarification Azure Dev/Test ou arrêt automatique
□ Plan App Service redimensionné correctement ? (vérifier : CPU < 20% moyen = sur-approvisionné)
□ Échelonnement réduisant configuré pour nuits/week-ends ?

AKS :
□ Pools de nœuds utilisant des VMs spot pour charges de travail non-critiques ? (60-90% moins cher)
□ Échelonnement KEDA jusqu'à zéro pour charges de travail batch/événement ?
□ Azure Hybrid Benefit appliqué si vous avez des licences Windows Server ?

BASES DE DONNÉES :
□ Tier serverless Azure SQL pour dev/staging ? (pause en inactivité)
□ Cosmos DB en mode serverless pour < 1000 RU/s de débit moyen ?
□ Pools élastiques Azure SQL si vous avez plusieurs petites bases de données ?
□ Migration DTU → vCore pour grandes bases de données (plus de contrôle prix-performance) ?

STOCKAGE :
□ Gestion du cycle de vie du stockage Blob (Hot → Cool → Archive selon pattern d'accès) ?
□ LRS vs GRS — non-prod a-t-il besoin de stockage géo-redondant ?

RÉSEAU :
□ Azure CDN devant Storage / App Service (sortie moins cher que directement) ?
□ Intégration VNet configurée pour éviter les frais de point de terminaison public ?

RECOMMANDATIONS ADVISOR :
Exécuter : az advisor recommendation list --category Cost
Azure Cost Management → Alertes de coûts configurées ?
Azure Savings Plans vs Reserved Instances (évaluer trimestriellement)

Générer le plan d'optimisation pour mon profil de dépenses.
```

## Exemple

**Utilisateur :** Nous sommes un SaaS B2B basé au Royaume-Uni. Facture Azure de £15K/mois. Principalement App Service (10 plans) + Azure SQL (5 bases de données). Les équipes haïssent les plaintes « c'est lent l'après-midi ». Que faisons-nous ?

**Diagnostic de Claude :**

Deux problèmes : coût et performance. Ils sont liés.

**Coût (£15K/mois est élevé pour 10 plans App Service + 5 BD) :**
- 10 plans App Service à ~£800-1200/plan = la plupart de votre facture. La plupart des équipes exécutent dev/staging sur le même tier que prod. Vérifier : vos instances dev/staging sont-elles sur Premium v3 ? Rétrograder vers B2 ou B3 pour non-prod = ~£400-600/mois d'économies.
- Azure SQL : payez-vous 5 bases de données séparées quand les pools élastiques les couvriraient ? Si les bases de données atteignent des pics à différents moments, le pool élastique partage les DTU = généralement 30-40% moins cher.

**Performance (« lent l'après-midi » = presque toujours l'un des) :**
1. Autoscaling App Service non configuré ou ne s'échelonnant pas assez vite — ajouter une règle d'autoscaling : échelonner quand CPU > 65% pendant 5 minutes
2. Limite DTU Azure SQL atteinte — vérifier : portail Azure → base de données SQL → Query Performance Insight → top 5 requêtes par durée/CPU
3. Pas de cache Redis — chaque après-midi l'utilisateur génère des lectures de base de données qui pourraient être mises en cache. Ajouter Azure Cache for Redis (C1 = ~£50/mois, élimine la plupart des lectures BD répétées)

**Gains rapides (cette semaine) :**
- Activer l'autoscaling sur tous les plans App Service avec > 1 instance
- Ajouter Query Performance Insight à chaque BD SQL — montre les requêtes lentes en 10 minutes
- Déplacer dev/staging vers le tier B ou utiliser la tarification de l'abonnement Azure Dev/Test

---

---
name: azure-architect
description: "Azure-Architektur-Design: App Service, AKS, Azure Functions, Cosmos DB, Bicep IaC-Vorlagen, Kostenoptimierung, Entra ID-Integration und Migrationsmuster"
---

# Azure Architect Skill

## Wann aktivieren
- Entwerfen einer neuen Azure-Architektur von Grund auf
- Wahl zwischen Azure-Serviceoptionen (App Service vs AKS vs Functions, Cosmos DB vs Azure SQL, etc.)
- Generierung von Bicep- oder ARM-Vorlagen für ein Muster
- Optimierung der Azure-Kosten für eine bestehende Bereitstellung
- Planung einer Migration zu Azure von On-Premises oder einer anderen Cloud
- Einrichtung von Azure DevOps oder GitHub Actions für Azure-Bereitstellungen

## Wann NICHT verwenden
- AWS-spezifische Architektur — verwenden Sie den aws-architect Skill
- GCP-spezifische Architektur — verwenden Sie den gcp-architect Skill
- Überprüfung der Cloud-Sicherheitsposition — verwenden Sie den cloud-security Skill

## Anweisungen

### Architekturmuster-Auswahl

```
Wählen Sie das richtige Azure-Architekturmuster für [Anwendung].

Anwendungstyp: [Web-App / Mobile-Backend / SaaS / Microservices / Datenpipeline]
Skalierung: [Benutzer/Tag, Anfragen/Sekunde]
Azure-Erfahrung des Teams: [Anfänger / Fortgeschrittene / Experte]
Budget: $[X]/Monat Ziel
Compliance: [GDPR / HIPAA / ISO 27001 / PCI / keine]
Microsoft Stack: [Verwenden Sie bereits M365 / Teams / Azure AD? Ja / Nein]

Leitfaden zum Azure-Muster:

APP SERVICE (empfohlen für: Web-Apps, APIs, geringer operativer Overhead):
Stack: Front Door + App Service + Azure SQL + Redis Cache + Key Vault
Kosten: ~$50-300/Monat je nach Stufe
Vorteile: vertraute PaaS, integrierte Bereitstellungsplätze (blau-grün), Entra ID-Integration
Nachteile: weniger flexibel als Container, platformeigene Limits
Am besten für: .NET, Node.js, Python Web-Apps; Teams migrieren von IIS oder andere PaaS

AZURE FUNCTIONS (empfohlen für: Event-Driven, Serverless):
Stack: Front Door + Functions + Cosmos DB + Service Bus + Storage
Kosten: ~$0-50/Monat für kleine Workloads (Consumption Plan)
Vorteile: Bezahlung pro Ausführung, Auto-Scale, 200+ Trigger/Bindings
Nachteile: Cold Starts auf Consumption Plan; vermeiden Sie Ausführungen > 10 Minuten; zustandsabhängig = Durable Functions
Am besten für: Event-driven Microservices, Hintergrundaufträge, Webhooks, geplante Aufgaben

AKS (empfohlen für: Microservices, bestehende K8s Teams):
Stack: Front Door + AKS + Azure SQL / Cosmos DB + Service Bus + ACR
Kosten: ~$200-1000/Monat Minimum (Knoten-Pools 24/7 ausgeführt)
Vorteile: vollständige Kubernetes-Kontrolle, Multi-Cloud-Portabilität, KEDA für Skalierung
Nachteile: operative Komplexität, höhere Grundkosten
Am besten für: Teams mit K8s-Erfahrung, komplexe Microservices, feingranulare Kontrolle erforderlich

DATEN / ANALYTICS:
Stack: Event Hubs + Stream Analytics / Databricks + Azure Data Lake + Synapse Analytics
Am besten für: IoT, Telemetrie, Data Warehousing, BI

Empfehlen Sie das Muster für meine Anwendung mit Kostenschätzung und Bicep-Starter-Vorlage.
```

### Bicep-Vorlage

```
Generieren Sie eine Bicep-Vorlage für [Muster].

Muster: [App Service Web-App / Functions API / AKS Microservices]
Ressourcengruppe: [Name]
Umgebung: [Dev / Staging / Prod]
Region: [westeurope / eastus / etc.]

App Service Web-App (Bicep):
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
    reserved: true  // erforderlich für Linux
  }
}

// App Service
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-${environment}'
  location: location
  identity: {
    type: 'SystemAssigned'  // verwaltete Identität für Key Vault-Zugriff
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
    enableRbacAuthorization: true  // RBAC über Zugriffsrichtlinien
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}

// Key Vault RBAC: Web-App-verwaltete Identität Secret Reader gewähren
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')  // Key Vault Secrets User
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

Generieren Sie die vollständige Bicep-Vorlage für mein Muster mit Sicherheitshärtung.
```

### Entra ID (Azure AD) Integration

```
Entwerfen Sie Entra ID-Authentifizierung für [Anwendung].

Anwendungstyp: [SPA / Web-App / API / Service-to-Service]
Benutzer: [nur interne Mitarbeiter / externe Kunden / beide]
Zugriffsmuster: [Nur SSO / API-Zugriff / delegierte Berechtigungen]

Allgemeine Muster:

MITARBEITER-SSO (Microsoft 365-Integration):
// App-Registrierung in Entra ID:
// Authentifizierung → Plattform hinzufügen → Web → Umleitungs-URI: https://app.com/auth/callback
// API-Berechtigungen → Microsoft Graph → User.Read (delegiert)

// MSAL.js für SPA:
import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
});

EXTERNE KUNDEN (Azure AD B2C):
// Separater B2C-Mandant vom Unternehmens-Entra ID
// Benutzerflows: Anmeldung/Registrierung, Kennwort zurücksetzen, Profilbearbeitung
// Social-Identity-Anbieter: Google, Facebook, Apple (in B2C-Portal hinzufügen)
// Benutzerdefinierte Domänen: login.yourapp.com statt yourb2ctenant.b2clogin.com

SERVICE-TO-SERVICE (verwaltete Identität bevorzugt):
// Keine Secrets — verwendet verwaltete Identität von VMSS/App Service/AKS Workload Identity
// Client-Credentials-Flow wenn verwaltete Identität nicht verfügbar:
const credential = new DefaultAzureCredential();
const token = await credential.getToken('https://management.azure.com/.default');

RBAC mit App-Rollen (benutzerdefinierte Rollen in Ihrer App):
// App-Rollen im Manifest definieren:
// { "allowedMemberTypes": ["User"], "displayName": "Admin", "value": "Admin" }
// Rolle in API überprüfen: user.roles.includes('Admin')

Entwerfen Sie die Authentifizierungsarchitektur für meinen Anwendungstyp.
```

### Kostenoptimierung

```
Audieren Sie Azure-Kosten und identifizieren Sie Optimierungsmöglichkeiten.

Aktuelle monatliche Rechnung: $[X]
Größte Kostenkategorien: [App Service / AKS / SQL / Cosmos DB / Storage / Sonstiges]

Checkliste zur Kostenoptimierung:

BERECHNUNG (App Service / VMs):
□ Reservierte Instanzen für stabilen Basiswert? (1 Jahr = 30-40% Ersparnisse)
□ Dev/Test-Instanzen 24/7 ausgeführt? → Azure Dev/Test-Tarife oder Auto-Shutdown verwenden
□ App Service Plan korrekt dimensioniert? (Prüfen: CPU < 20% Durchschnitt = überbereitgestellt)
□ Skalierung für Nächte/Wochenenden konfiguriert?

AKS:
□ Knoten-Pools verwenden Spot-VMs für nicht-kritische Workloads? (60-90% günstiger)
□ KEDA-Skalierung auf Null für Batch-/Event-Workloads?
□ Azure Hybrid Benefit angewendet wenn Sie Windows Server-Lizenzen haben?

DATENBANKEN:
□ Azure SQL Serverless-Tier für Dev/Staging? (pausiert wenn untätig)
□ Cosmos DB im Serverless-Modus für < 1000 RU/s durchschnittlichen Durchsatz?
□ Azure SQL elastische Pools wenn Sie viele kleine Datenbanken haben?
□ DTU → vCore-Migration für große Datenbanken (mehr Preis-Leistungs-Kontrolle)?

SPEICHER:
□ Blob-Speicher-Lifecycle-Management (Hot → Cool → Archive nach Zugriffsmuster)?
□ LRS vs GRS — benötigt Non-Prod Geo-redundante Speicherung?

NETZWERK:
□ Azure CDN vor Storage / App Service (günstigerer Egress als direkt)?
□ VNet-Integration konfiguriert um öffentliche Endpunktgebühren zu vermeiden?

ADVISOR-EMPFEHLUNGEN:
Ausführen: az advisor recommendation list --category Cost
Azure Cost Management → Kostenalarme konfiguriert?
Azure Savings Plans vs Reserved Instances (vierteljährlich evaluieren)

Generieren Sie den Optimierungsplan für mein Ausgabenprofil.
```

## Beispiel

**Benutzer:** Wir sind ein UK-basiertes B2B SaaS. £15K/Monat Azure-Rechnung. Hauptsächlich App Service (10 Plans) + Azure SQL (5 Datenbanken). Teams hasst die Beschwerden "es ist langsam am Nachmittag". Was tun wir?

**Claude's Diagnose:**

Zwei Probleme: Kosten und Leistung. Sie sind miteinander verbunden.

**Kosten (£15K/Monat ist hoch für 10 App Service Plans + 5 DBs):**
- 10 App Service Plans à ~£800-1200/Plan = der Großteil Ihrer Rechnung. Die meisten Teams führen Dev/Staging auf der gleichen Stufe wie Prod aus. Überprüfen: sind Ihre Dev/Staging-Instanzen auf Premium v3? Auf B2 oder B3 für Non-Prod zurückfahren = ~£400-600/Monat Ersparnisse.
- Azure SQL: zahlen Sie für 5 separate Datenbanken, wenn elastische Pools sie abdecken würden? Wenn Datenbanken zu unterschiedlichen Zeiten Spitzenwerte erreichen, teilt sich der elastische Pool DTUs = typischerweise 30-40% günstiger.

**Leistung ("langsam am Nachmittag" = fast immer eins davon):**
1. App Service Autoscaling nicht konfiguriert oder nicht schnell genug skalierend — Autoscaling-Regel hinzufügen: skaliere aus wenn CPU > 65% für 5 Minuten
2. Azure SQL DTU-Limit wird erreicht — Überprüfen: Azure Portal → SQL-Datenbank → Query Performance Insight → Top 5 Abfragen nach Dauer/CPU
3. Kein Redis Cache — jeder Nachmittag generiert der Benutzer Datenbanklesevorgänge die gecacht werden könnten. Azure Cache for Redis hinzufügen (C1 = ~£50/Monat, eliminiert die meisten wiederholten DB-Lesevorgänge)

**Schnelle Gewinne (diese Woche):**
- Autoscaling auf allen App Service Plans mit > 1 Instanz aktivieren
- Query Performance Insight zu jeder SQL-DB hinzufügen — zeigt langsame Abfragen in 10 Minuten
- Dev/Staging auf B-Tier verschieben oder Azure Dev/Test-Abonnement-Tarife nutzen

---

---
name: azure-architect
description: "Diseño de arquitectura Azure: App Service, AKS, Azure Functions, Cosmos DB, plantillas Bicep IaC, optimización de costos, integración Entra ID y patrones de migración"
---

# Habilidad Azure Architect

## Cuándo activar
- Diseñar una nueva arquitectura Azure desde cero
- Elegir entre opciones de servicios Azure (App Service vs AKS vs Functions, Cosmos DB vs Azure SQL, etc.)
- Generar plantillas Bicep o ARM para un patrón
- Optimizar costos de Azure en una implementación existente
- Planificar una migración a Azure desde on-premises u otra nube
- Configurar Azure DevOps o GitHub Actions para implementaciones Azure

## Cuándo NO usar
- Arquitectura específica de AWS — usa la habilidad aws-architect
- Arquitectura específica de GCP — usa la habilidad gcp-architect
- Revisión de postura de seguridad en la nube — usa la habilidad cloud-security

## Instrucciones

### Selección de patrones de arquitectura

```
Selecciona el patrón de arquitectura Azure correcto para [aplicación].

Tipo de aplicación: [app web / backend móvil / SaaS / microservicios / canalización de datos]
Escala: [usuarios/día, solicitudes/segundo]
Experiencia en Azure del equipo: [principiante / intermedio / avanzado]
Presupuesto: $[X]/mes objetivo
Cumplimiento: [GDPR / HIPAA / ISO 27001 / PCI / ninguno]
Stack Microsoft: [¿ya usa M365 / Teams / Azure AD? Sí / No]

Guía de patrones Azure:

APP SERVICE (recomendado para: aplicaciones web, API, bajo gastos operativos):
Stack: Front Door + App Service + Azure SQL + Redis Cache + Key Vault
Costo: ~$50-300/mes según tier
Ventajas: PaaS familiar, espacios de implementación integrados (azul-verde), integración Entra ID
Desventajas: menos flexible que contenedores, límites impuestos por la plataforma
Mejor para: aplicaciones web .NET, Node.js, Python; equipos migrando desde IIS u otra PaaS

AZURE FUNCTIONS (recomendado para: event-driven, serverless):
Stack: Front Door + Functions + Cosmos DB + Service Bus + Storage
Costo: ~$0-50/mes para pequeñas cargas de trabajo (plan Consumption)
Ventajas: pago por ejecución, auto-escalado, 200+ triggers/bindings
Desventajas: arranques en frío en plan Consumption; evita ejecuciones > 10 min; con estado = Durable Functions
Mejor para: microservicios event-driven, trabajos en segundo plano, webhooks, tareas programadas

AKS (recomendado para: microservicios, equipos K8s existentes):
Stack: Front Door + AKS + Azure SQL / Cosmos DB + Service Bus + ACR
Costo: ~$200-1000/mes mínimo (grupos de nodos ejecutándose 24/7)
Ventajas: control Kubernetes completo, portabilidad multi-nube, KEDA para escalado
Desventajas: complejidad operativa, costo base más alto
Mejor para: equipos con experiencia K8s, microservicios complejos, necesitando control granular

DATOS / ANALYTICS:
Stack: Event Hubs + Stream Analytics / Databricks + Azure Data Lake + Synapse Analytics
Mejor para: IoT, telemetría, almacén de datos, BI

Recomienda el patrón para mi aplicación con estimación de costo y plantilla de inicio Bicep.
```

### Plantilla Bicep

```
Genera una plantilla Bicep para [patrón].

Patrón: [aplicación web App Service / API Functions / microservicios AKS]
Grupo de recursos: [nombre]
Entorno: [dev / staging / prod]
Región: [westeurope / eastus / etc.]

Aplicación web App Service (Bicep):
param appName string
param environment string = 'prod'
param location string = resourceGroup().location
param sku string = 'B2'  // B1/B2/B3 = Basic; S1-S3 = Standard; P1v3-P3v3 = Premium

// Plan App Service
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan-${environment}'
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true  // requerido para Linux
  }
}

// App Service
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-${environment}'
  location: location
  identity: {
    type: 'SystemAssigned'  // identidad gestionada para acceso Key Vault
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
    enableRbacAuthorization: true  // RBAC sobre políticas de acceso
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}

// RBAC Key Vault: otorga a identidad gestionada de app web Secret Reader
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')  // Key Vault Secrets User
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

Genera la plantilla Bicep completa para mi patrón con endurecimiento de seguridad.
```

### Integración Entra ID (Azure AD)

```
Diseña autenticación Entra ID para [aplicación].

Tipo de aplicación: [SPA / aplicación web / API / service-to-service]
Usuarios: [solo empleados internos / clientes externos / ambos]
Patrón de acceso: [solo SSO / acceso API / permisos delegados]

Patrones comunes:

SSO EMPLEADO (integración Microsoft 365):
// Registro de app en Entra ID:
// Autenticación → Agregar plataforma → Web → URI de redirección: https://app.com/auth/callback
// Permisos de API → Microsoft Graph → User.Read (delegado)

// MSAL.js para SPA:
import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
});

CLIENTES EXTERNOS (Azure AD B2C):
// Tenant B2C separado del Entra ID empresarial
// Flujos de usuario: registro/inicio de sesión, restablecimiento de contraseña, edición de perfil
// Proveedores de identidad social: Google, Facebook, Apple (agregar en portal B2C)
// Dominios personalizados: login.yourapp.com en lugar de yourb2ctenant.b2clogin.com

SERVICE-TO-SERVICE (identidad gestionada preferida):
// Sin secretos — usa identidad gestionada de VMSS/App Service/identidad de carga de trabajo AKS
// Flujo de credenciales de cliente si identidad gestionada no disponible:
const credential = new DefaultAzureCredential();
const token = await credential.getToken('https://management.azure.com/.default');

RBAC con roles de aplicación (roles personalizados en tu aplicación):
// Define roles de aplicación en el manifiesto:
// { "allowedMemberTypes": ["User"], "displayName": "Admin", "value": "Admin" }
// Verifica rol en API: user.roles.includes('Admin')

Diseña la arquitectura de autenticación para mi tipo de aplicación.
```

### Optimización de costos

```
Audita costos de Azure e identifica oportunidades de optimización.

Factura mensual actual: $[X]
Mayores categorías de costo: [App Service / AKS / SQL / Cosmos DB / Storage / otro]

Lista de verificación de optimización de costos:

CÁLCULO (App Service / VMs):
□ ¿Instancias reservadas para base estable? (1 año = 30-40% ahorro)
□ ¿Instancias dev/test ejecutándose 24/7? → usar precios Azure Dev/Test o auto-shutdown
□ ¿Plan App Service correctamente dimensionado? (verificar: CPU < 20% promedio = sobre-aprovisionado)
□ ¿Escala reducida configurada para noches/fines de semana?

AKS:
□ ¿Grupos de nodos usando VM spot para cargas de trabajo no críticas? (60-90% más barato)
□ ¿Escala KEDA a cero para cargas de trabajo batch/event?
□ ¿Azure Hybrid Benefit aplicado si tienes licencias Windows Server?

BASES DE DATOS:
□ ¿Tier serverless Azure SQL para dev/staging? (se pausa en inactividad)
□ ¿Cosmos DB en modo serverless para < 1000 RU/s rendimiento promedio?
□ ¿Grupos elásticos Azure SQL si tienes muchas bases de datos pequeñas?
□ ¿Migración DTU → vCore para grandes bases de datos (mayor control precio-rendimiento)?

ALMACENAMIENTO:
□ ¿Gestión del ciclo de vida de almacenamiento Blob (Hot → Cool → Archive por patrón de acceso)?
□ ¿LRS vs GRS — non-prod necesita almacenamiento geo-redundante?

RED:
□ ¿Azure CDN delante de Storage / App Service (salida más barata que directa)?
□ ¿Integración VNet configurada para evitar cargos de punto final público?

RECOMENDACIONES ADVISOR:
Ejecuta: az advisor recommendation list --category Cost
Azure Cost Management → ¿Alertas de costo configuradas?
Azure Savings Plans vs Reserved Instances (evaluar trimestralmente)

Genera el plan de optimización para mi perfil de gasto.
```

## Ejemplo

**Usuario:** Somos un SaaS B2B basado en el Reino Unido. Factura de £15K/mes en Azure. Principalmente App Service (10 planes) + Azure SQL (5 bases de datos). A los equipos les encanta quejarse de "es lento por la tarde". ¿Qué hacemos?

**Diagnóstico de Claude:**

Dos problemas: costo y rendimiento. Están relacionados.

**Costo (£15K/mes es alto para 10 planes App Service + 5 BD):**
- 10 planes App Service a ~£800-1200/plan = la mayoría de tu factura. La mayoría de equipos ejecutan dev/staging en el mismo tier que prod. Verifica: ¿tus instancias dev/staging están en Premium v3? Reduce a B2 o B3 para non-prod = ~£400-600/mes ahorrado.
- Azure SQL: ¿pagas por 5 bases de datos separadas cuando los grupos elásticos las cubrirían? Si las bases de datos tienen picos en diferentes momentos, el grupo elástico comparte DTU = típicamente 30-40% más barato.

**Rendimiento ("lento por la tarde" = casi siempre uno de):**
1. App Service autoscale no configurado o no escalando lo suficientemente rápido — agregar regla de autoscale: escala cuando CPU > 65% durante 5 minutos
2. Límite DTU de Azure SQL alcanzado — verificar: Azure Portal → base de datos SQL → Query Performance Insight → top 5 consultas por duración/CPU
3. Sin caché Redis — cada tarde el usuario genera lecturas de base de datos que podrían estar en caché. Agregar Azure Cache for Redis (C1 = ~£50/mes, elimina la mayoría de lecturas BD repetidas)

**Ganancias rápidas (esta semana):**
- Habilitar autoscale en todos los planes App Service con > 1 instancia
- Agregar Query Performance Insight a cada BD SQL — muestra consultas lentas en 10 minutos
- Mover dev/staging a tier B o usar precios de suscripción Azure Dev/Test

---

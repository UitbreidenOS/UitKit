# Azure Deployment Module

Production-grade Azure cloud deployment orchestrator with support for App Service, Container Instances, Cosmos DB, Blob Storage, and hybrid cloud configurations.

## Features

### Core Capabilities

- **Multi-Service Deployment**
  - App Service (web apps, APIs)
  - Container Instances (containerized workloads)
  - Cosmos DB (NoSQL, multi-region)
  - Blob Storage (object storage)
  - Extensible for VMs, Functions, SQL DB

- **ARM Template Generation**
  - Automatic template generation from configurations
  - Full schema validation
  - Resource dependency management
  - Parameterized outputs for scripting

- **Cost Management**
  - Real-time cost estimation
  - Service-level cost breakdown
  - Cost limit enforcement
  - Multi-tier pricing models

- **Deployment Lifecycle**
  - Pre-deployment validation & quota checks
  - Staged deployment (storage → database → compute)
  - Health monitoring post-deployment
  - Automatic rollback on failure
  - Deployment history & audit trail

- **Hybrid Cloud**
  - Virtual network configuration
  - Site-to-site VPN
  - On-premises connectivity
  - Bi-directional data sync

### Event-Driven Architecture

Full EventEmitter integration for monitoring:

```javascript
deployment.on('serviceConfigured', event => { /* ... */ });
deployment.on('deploymentStarted', deploy => { /* ... */ });
deployment.on('deploymentSucceeded', deploy => { /* ... */ });
deployment.on('deploymentFailed', deploy => { /* ... */ });
deployment.on('serviceDeployed', resource => { /* ... */ });
deployment.on('healthCheckComplete', check => { /* ... */ });
deployment.on('rollbackStarted', deploy => { /* ... */ });
deployment.on('rollbackCompleted', deploy => { /* ... */ });
```

## Installation

```bash
npm install
```

## Usage

### Basic Initialization

```javascript
const AzureDeployment = require('./lib/azure-deployment');

const deployment = new AzureDeployment({
  subscriptionId: 'your-subscription-id',
  resourceGroup: 'my-app-rg',
  region: 'eastus',
  environment: 'production',
  costLimit: 500 // $500/month
});
```

### Configuration Options

```javascript
{
  subscriptionId: string,         // Azure subscription ID
  resourceGroup: string,          // Azure resource group
  region: string,                 // Azure region (eastus, westus, etc.)
  environment: string,            // 'dev' | 'staging' | 'production'
  enableHybridCloud: boolean,     // Enable hybrid cloud features
  enableAutoScaling: boolean,     // Enable autoscaling (default: true)
  costLimit: number,              // Monthly cost limit in USD
  dataDir: string,                // Directory for state (default: .azure)
  verbose: boolean,               // Verbose logging
  dryRun: boolean                 // Validate without deploying
}
```

### Service Configuration

#### App Service (Web Apps)

```javascript
const appService = deployment.configureAppService({
  name: 'my-nodejs-app',
  runtime: 'NODE|18-lts',
  sku: 'B2S',                    // B1S, B2S, S1, S2, S3, P1V2
  instanceCount: 2,
  autoscaleEnabled: true,
  minInstances: 2,
  maxInstances: 6,
  appSettings: {
    NODE_ENV: 'production',
    LOG_LEVEL: 'info',
    DATABASE_URL: 'cosmos://...'
  },
  healthCheckPath: '/health'
});
```

#### Container Instances

```javascript
const container = deployment.configureContainerInstances({
  name: 'data-processor',
  image: 'myregistry.azurecr.io/processor:1.0',
  cpu: 2.0,                      // CPU cores
  memory: 4.0,                    // GB
  port: 3000,
  environment: {
    QUEUE_URL: 'https://...',
    OUTPUT_PATH: '/output'
  },
  imageRegistry: {
    enabled: true,
    server: 'myregistry.azurecr.io',
    username: 'admin',
    password: process.env.ACR_PASSWORD
  },
  restartPolicy: 'OnFailure'
});
```

#### Cosmos DB

```javascript
const cosmosDb = deployment.configureCosmosDb({
  name: 'app-database',
  accountName: 'mycosmosaccount',
  apiType: 'sql',                 // 'sql', 'mongodb', 'cassandra', 'gremlin', 'table'
  consistencyLevel: 'Session',    // Strong, BoundedStaleness, Session, ConsistentPrefix, Eventual
  throughput: 1000,               // RU/s
  autoscaleMaxThroughput: 4000,   // Optional: autoscale
  enableGeoReplication: true,
  replicas: ['eastus', 'westus', 'eastus2'],
  databases: [
    { name: 'users', partitionKey: '/userId' },
    { name: 'projects', partitionKey: '/projectId' }
  ],
  backupPolicy: 'continuous'      // 'continuous' or 'periodic'
});
```

#### Blob Storage

```javascript
const storage = deployment.configureBlobStorage({
  name: 'app-storage',
  accountName: 'appstg',
  accessTier: 'Hot',              // 'Hot', 'Cool', 'Archive'
  redundancy: 'GRS',              // 'LRS', 'GRS', 'RA-GRS', 'ZRS'
  enableVersioning: true,
  enableSoftDelete: true,
  retentionDays: 90,
  enableEncryption: true,
  estimatedSize: 1000,            // GB
  containers: [
    { name: 'documents', publicAccess: 'None' },
    { name: 'assets', publicAccess: 'Blob' }
  ],
  lifecyclePolicies: [
    {
      name: 'archive-old-blobs',
      actions: { tierToCool: 30, tierToArchive: 90, delete: 365 }
    }
  ]
});
```

### ARM Template Generation

Generate an Azure Resource Manager template:

```javascript
const template = deployment.generateARMTemplate();

// Validate the template
const validation = deployment.validateARMTemplate(template);
if (!validation.valid) {
  console.error('Template errors:', validation.errors);
}

// Save to file
const fs = require('fs');
fs.writeFileSync('arm-template.json', JSON.stringify(template, null, 2));
```

### Cost Estimation

```javascript
console.log('Monthly cost:', deployment.costTracking.estimatedMonthly);
console.log('Daily cost:', deployment.costTracking.estimatedDaily);

// Service-level breakdown
Object.entries(deployment.costTracking.byService).forEach(([serviceId, dailyCost]) => {
  console.log(`${serviceId}: $${dailyCost}/day`);
});
```

### Deployment

Deploy to Azure:

```javascript
try {
  const result = await deployment.deploy('my-deployment');
  console.log('Deployment succeeded:', result.id);
} catch (error) {
  console.error('Deployment failed:', error.message);
  // Automatic rollback occurred
}
```

Dry-run (validation only):

```javascript
deployment.options.dryRun = true;
const result = await deployment.deploy('test-deployment');
console.log('Dry-run completed successfully');
```

### Health Monitoring

Check service health post-deployment:

```javascript
for (const [serviceId, service] of deployment.services) {
  const check = await deployment.healthCheck(serviceId);
  
  if (check.healthy) {
    console.log(`✓ ${service.name} is healthy`);
  } else {
    console.log(`✗ ${service.name} issues:`, check.issues);
  }
  
  console.log('Metrics:', check.metrics);
}
```

### Rollback

Rollback a deployment:

```javascript
await deployment.rollback(deploymentId);
console.log('Rollback completed');
```

### Hybrid Cloud

Enable on-premises connectivity:

```javascript
deployment.enableHybridCloud({
  vnetConfig: {
    name: 'hybrid-vnet',
    addressSpace: ['10.0.0.0/16'],
    subnets: [
      { name: 'app-subnet', addressPrefix: '10.0.1.0/24' },
      { name: 'db-subnet', addressPrefix: '10.0.2.0/24' }
    ]
  },
  vpnGateway: {
    name: 'site-to-site-vpn',
    type: 'Vpn'
  },
  onPremConnections: [
    {
      name: 'office-network',
      network: '192.168.0.0/24'
    },
    {
      name: 'datacenter',
      network: '10.10.0.0/16'
    }
  ],
  dataSync: {
    enabled: true,
    syncInterval: 3600,  // seconds
    bidirectional: true
  }
});
```

## CLI Usage

### Interactive Configuration

```bash
node lib/azure-deployment-cli.js configure app-service
```

Follow prompts to configure:
- Service name
- Runtime/image
- SKU/resources
- Instance count

### ARM Template Management

```bash
# Generate template
node lib/azure-deployment-cli.js template

# Validate and save
node lib/azure-deployment-cli.js template --validate --output arm-template.json
```

### Cost Analysis

```bash
# Show cost breakdown
node lib/azure-deployment-cli.js cost

# Check against limit
node lib/azure-deployment-cli.js cost --limit 500
```

### Health Checks

```bash
# Check all services
node lib/azure-deployment-cli.js health

# Check specific service
node lib/azure-deployment-cli.js health --service my-api
```

### Deployment

```bash
# Deploy to Azure
node lib/azure-deployment-cli.js deploy --name production-v1

# Dry-run
node lib/azure-deployment-cli.js deploy --name test --dryRun
```

### Rollback

```bash
node lib/azure-deployment-cli.js rollback deploy-1234567890
```

### List Resources

```bash
# List all services
node lib/azure-deployment-cli.js list --services

# List deployments
node lib/azure-deployment-cli.js list --deployments

# List deployed resources
node lib/azure-deployment-cli.js list --resources
```

## Environment Tiers

Automatic configuration based on environment:

| Tier | VM Size | Replicas | Autoscale | Use Case |
|------|---------|----------|-----------|----------|
| dev | B1S | 1 | No | Development |
| staging | B2S | 2 | Yes | Testing |
| production | S1 | 3 | Yes | Production |

## Pricing Examples

### App Service (monthly, 1 instance)
- B1S: $7.15
- B2S: $14.30
- S1: $50
- S2: $100
- S3: $200

### Container Instances
- CPU: $0.0106/hour
- Memory: $0.0045/hour per GB

### Cosmos DB
- 400 RU/s: ~$24/month (single region)
- Geo-replication: 2-3x multiplier

### Blob Storage
- Hot tier: $0.0184/GB/month
- Cool tier: $0.01/GB/month
- Archive tier: $0.00099/GB/month

## State Persistence

Deployments are automatically persisted to `.azure/deployment-state.json`:

```json
{
  "deployments": [...],
  "resources": [...],
  "costTracking": {
    "estimatedMonthly": 245.60,
    "estimatedDaily": 8.19,
    "byService": {...}
  },
  "lastSaved": "2024-01-15T10:30:00Z"
}
```

## Error Handling

```javascript
deployment.on('error', (error) => {
  console.error('Deployment error:', error.type, error.error);
});

try {
  await deployment.deploy('my-app');
} catch (error) {
  if (error.message.includes('Cost limit exceeded')) {
    // Handle cost overrun
  } else if (error.message.includes('Quota')) {
    // Handle quota issue
  }
}
```

## Testing

Run comprehensive test suite:

```bash
npm test -- lib/azure-deployment.test.js
```

Test coverage includes:
- Service configuration
- ARM template generation & validation
- Cost estimation
- Health checks
- Deployment lifecycle
- Rollback operations
- State persistence
- Hybrid cloud configuration

## Integration with Claudient

This module integrates with Claudient's ecosystem:

```javascript
// Use with approval-engine for production deployments
const ApprovalEngine = require('./approval-engine');

const approval = new ApprovalEngine();
const task = {
  id: 'deploy-123',
  description: 'Deploy app to production',
  confidence: 0.92
};

const result = await approval.submit(task);
if (result.status === 'approved') {
  const deployment = await azureDeployment.deploy('prod-v1');
}
```

## Performance Considerations

- **Deployment Time**: 2-10 minutes depending on services
- **Health Checks**: Async, non-blocking
- **State Loading**: <100ms for typical deployments
- **ARM Validation**: <1s for templates with <50 resources

## Security Best Practices

1. **Never commit credentials**
   - Use environment variables: `AZURE_SUBSCRIPTION_ID`, `AZURE_ACR_PASSWORD`
   - Implement Azure Key Vault integration for secrets

2. **Network Security**
   - Use private endpoints for data services
   - Enable NSGs on virtual networks
   - Configure WAF on App Service

3. **RBAC**
   - Principle of least privilege
   - Use managed identities
   - Regular access reviews

4. **Compliance**
   - Enable encryption at rest
   - Audit logging to Log Analytics
   - Regular backup testing

## Troubleshooting

### Deployment fails with "Quota exceeded"

```javascript
const quotas = await deployment._checkQuotas();
if (!quotas.ok) {
  console.log('Issues:', quotas.issues);
  // Request quota increase from Azure portal
}
```

### High costs

```javascript
// Analyze by service
Object.entries(deployment.costTracking.byService).forEach(([id, cost]) => {
  const service = deployment.services.get(id);
  console.log(`${service.name}: $${cost.toFixed(2)}/day`);
});

// Consider downgrading SKUs or reducing replicas
```

### Health check failures

```javascript
const check = await deployment.healthCheck(serviceId);
if (!check.healthy) {
  console.log('Issues:', check.issues);
  console.log('Metrics:', check.metrics);
  // Investigate metrics and adjust configuration
}
```

## Future Enhancements

- [ ] WebSocket support for real-time deployment monitoring
- [ ] Integration with Azure DevOps pipelines
- [ ] Policy enforcement engine
- [ ] Cost optimization recommendations
- [ ] Multi-region failover configuration
- [ ] Database migration tooling
- [ ] Capacity planning analytics

## License

Part of Claudient. See main LICENSE file.

## Support

For issues or questions:
1. Check test cases in `azure-deployment.test.js`
2. Review integration examples in `azure-deployment-integration-example.js`
3. Consult Azure documentation for service-specific questions

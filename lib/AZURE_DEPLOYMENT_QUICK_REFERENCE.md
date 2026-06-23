# Azure Deployment Quick Reference

## Common Patterns

### Pattern 1: Dev Deployment (Minimal Cost)

```javascript
const AzureDeployment = require('./azure-deployment');

const deploy = new AzureDeployment({
  environment: 'dev',
  costLimit: 50
});

deploy.configureAppService({
  name: 'dev-api',
  sku: 'B1S',
  instanceCount: 1
});

deploy.configureCosmosDb({
  name: 'dev-db',
  accountName: 'devdb',
  throughput: 400
});

const result = await deploy.deploy('dev-setup');
```

**Cost**: ~$15/month

---

### Pattern 2: Staging (HA-Ready)

```javascript
const deploy = new AzureDeployment({
  environment: 'staging',
  costLimit: 150
});

deploy.configureAppService({
  name: 'staging-api',
  sku: 'B2S',
  instanceCount: 2,
  autoscaleEnabled: true
});

deploy.configureCosmosDb({
  name: 'staging-db',
  accountName: 'stagingdb',
  throughput: 1000,
  enableGeoReplication: false
});

const result = await deploy.deploy('staging-release');
```

**Cost**: ~$80/month

---

### Pattern 3: Production (Full HA + DR)

```javascript
const deploy = new AzureDeployment({
  environment: 'production',
  costLimit: 1000
});

// API servers
deploy.configureAppService({
  name: 'prod-api',
  sku: 'S1',
  instanceCount: 3,
  minInstances: 3,
  maxInstances: 10,
  autoscaleEnabled: true
});

// Database with geo-replication
deploy.configureCosmosDb({
  name: 'prod-db',
  accountName: 'proddb',
  throughput: 5000,
  enableGeoReplication: true,
  replicas: ['eastus', 'westus', 'eastus2']
});

// Global storage
deploy.configureBlobStorage({
  name: 'prod-storage',
  accountName: 'prodstorage',
  redundancy: 'RA-GRS',
  estimatedSize: 2000
});

const result = await deploy.deploy('prod-v1.0.0');
```

**Cost**: ~$800/month

---

### Pattern 4: Batch Processing Pipeline

```javascript
const deploy = new AzureDeployment();

// Worker containers
for (let i = 0; i < 5; i++) {
  deploy.configureContainerInstances({
    name: `batch-worker-${i}`,
    image: 'registry.azurecr.io/batch-worker:latest',
    cpu: 2.0,
    memory: 4.0
  });
}

// Data storage
deploy.configureBlobStorage({
  name: 'batch-storage',
  accountName: 'batchstorage',
  estimatedSize: 5000
});

const result = await deploy.deploy('batch-pipeline');
```

---

### Pattern 5: Hybrid Cloud (On-Prem + Azure)

```javascript
const deploy = new AzureDeployment();

// Azure services
deploy.configureCosmosDb({
  name: 'cloud-db',
  accountName: 'hybriddb'
});

// Connect to on-prem
deploy.enableHybridCloud({
  vnetConfig: {
    addressSpace: ['10.0.0.0/16']
  },
  onPremConnections: [
    {
      name: 'headquarters',
      network: '192.168.0.0/24'
    }
  ],
  dataSync: { enabled: true }
});

const result = await deploy.deploy('hybrid-setup');
```

---

## Quick Commands

### Initialize

```bash
# Guided setup
node lib/azure-deployment-cli.js configure app-service

# List services
node lib/azure-deployment-cli.js list --services
```

### Template Operations

```bash
# Generate ARM template
node lib/azure-deployment-cli.js template --output deploy.json

# Validate
node lib/azure-deployment-cli.js template --validate
```

### Cost Management

```bash
# View estimates
node lib/azure-deployment-cli.js cost

# Enforce limit
node lib/azure-deployment-cli.js cost --limit 500
```

### Health & Monitoring

```bash
# Check all services
node lib/azure-deployment-cli.js health

# Check specific service
node lib/azure-deployment-cli.js health --service prod-api
```

### Deployment

```bash
# Dry run first
node lib/azure-deployment-cli.js deploy --name test-v1 --dryRun

# Deploy
node lib/azure-deployment-cli.js deploy --name production-v1

# Rollback if needed
node lib/azure-deployment-cli.js rollback deploy-1234567890
```

---

## Event-Driven Monitoring

```javascript
const deploy = new AzureDeployment();

// Logging
deploy.on('serviceConfigured', e => {
  console.log(`✓ ${e.config.name} ready`);
});

deploy.on('deploymentStarted', d => {
  console.log(`→ Deploying ${d.name}...`);
});

deploy.on('deploymentSucceeded', d => {
  console.log(`✓ Deployment complete`);
});

deploy.on('deploymentFailed', d => {
  console.log(`✗ Deployment failed: ${d.error}`);
});

deploy.on('healthCheckComplete', c => {
  const status = c.healthy ? '✓' : '✗';
  console.log(`${status} ${c.serviceName}`);
});

// Custom handlers
deploy.on('error', e => {
  logger.error(`Azure error: ${e.type}`, e.error);
});
```

---

## Cost Optimization Tips

### 1. Right-size SKUs

```javascript
// Not: Always use S2 or S3
// Do: Start with B1S/B2S, scale up only when needed

deploy.configureAppService({
  name: 'api',
  sku: 'B2S',        // $14.30/month
  autoscaleEnabled: true,
  maxInstances: 5    // Auto-scales up only when needed
});
```

### 2. Use Autoscaling

```javascript
// Reduces idle capacity costs
deploy.configureAppService({
  name: 'api',
  sku: 'S1',
  minInstances: 2,
  maxInstances: 10,
  autoscaleEnabled: true
});
```

### 3. Optimize Throughput

```javascript
// Start low, increase based on monitoring
deploy.configureCosmosDb({
  name: 'db',
  accountName: 'mydb',
  throughput: 400      // Minimum ($24/month)
  // autoscaleMaxThroughput: 2000  // If needed
});
```

### 4. Use Access Tiers

```javascript
// Archive rarely-accessed data
deploy.configureBlobStorage({
  name: 'storage',
  accountName: 'storage',
  accessTier: 'Cool',  // $0.01/GB vs $0.0184 for Hot
  lifecyclePolicies: [{
    actions: {
      tierToCool: 30,
      tierToArchive: 90
    }
  }]
});
```

### 5. Geo-Replicate Selectively

```javascript
// Only replicate if needed for DR
deploy.configureCosmosDb({
  name: 'db',
  accountName: 'db',
  enableGeoReplication: false,  // Save 2-3x
  replicas: ['eastus']          // Saves ~$1500/month
});
```

---

## Troubleshooting Quick Fixes

### Deployment Hangs

```javascript
// Check with dry-run first
deployment.options.dryRun = true;
await deployment.deploy('test');

// Then full deploy
deployment.options.dryRun = false;
await deployment.deploy('production');
```

### Cost Overruns

```javascript
// Analyze breakdown
deployment.costTracking.byService.forEach((cost, serviceId) => {
  const svc = deployment.services.get(serviceId);
  console.log(`${svc.name}: $${cost * 30}`);
});

// Reduce most expensive service
```

### Health Checks Fail

```javascript
// Get detailed metrics
const check = await deployment.healthCheck(serviceId);
console.log('Issues:', check.issues);
console.log('Metrics:', JSON.stringify(check.metrics, null, 2));

// Compare with healthy state or rollback
```

### Template Validation Errors

```javascript
const template = deployment.generateARMTemplate();
const validation = deployment.validateARMTemplate(template);

validation.errors.forEach(error => {
  console.error('Error:', error);
});

// Fix issues and re-validate
```

---

## Service SKU Comparison

### App Service

| SKU | CPU | RAM | Cost/month | Best For |
|-----|-----|-----|-----------|----------|
| B1S | 1 | 1GB | $7.15 | Dev/test |
| B2S | 2 | 3.5GB | $14.30 | Staging |
| S1 | 1 | 1.75GB | $50 | Production (low-traffic) |
| S2 | 2 | 3.5GB | $100 | Production (medium) |
| S3 | 4 | 7GB | $200 | Production (high-traffic) |

### Container Instances

| CPU | Memory | Cost/month (730hrs) |
|-----|--------|-------------------|
| 1.0 | 1.5GB | ~$11 |
| 2.0 | 4GB | ~$44 |
| 4.0 | 8GB | ~$88 |

---

## API Examples

### Get Resource Status

```javascript
const status = deployment.getResourcesStatus();
status.forEach(resource => {
  console.log(`${resource.name}: ${resource.status}`);
});
```

### Get Deployment Summary

```javascript
const summary = deployment.getDeploymentSummary(deploymentId);
console.log(`Duration: ${summary.duration}ms`);
console.log(`Services: ${summary.services.length}`);
console.log(`Cost: $${summary.estimatedCost}/month`);
```

### Listen for Events

```javascript
deployment.on('deploymentSucceeded', deploy => {
  notificationService.send(`Deployment ${deploy.id} succeeded`);
});

deployment.on('deploymentFailed', deploy => {
  alertService.send(`Deployment ${deploy.id} failed: ${deploy.error}`);
  logger.error(`Deployment failed, rollback initiated`);
});
```

---

## Environment Variables

```bash
# Set these for CLI
export AZURE_SUBSCRIPTION_ID="your-sub-id"
export AZURE_RESOURCE_GROUP="your-rg"
export AZURE_REGION="eastus"
export AZURE_ENVIRONMENT="production"
```

---

## Production Checklist

- [ ] Cost limit set and validated
- [ ] ARM template tested and validated
- [ ] Health checks configured
- [ ] Autoscaling limits configured
- [ ] Backup policies enabled
- [ ] Encryption enabled
- [ ] NSGs/Firewall configured
- [ ] RBAC configured
- [ ] Monitoring/alerts enabled
- [ ] Disaster recovery plan in place
- [ ] Rollback procedure tested

---

## Support & Resources

- Azure Documentation: https://docs.microsoft.com/azure/
- Azure Pricing Calculator: https://azure.microsoft.com/pricing/calculator/
- ARM Template Reference: https://docs.microsoft.com/azure/templates/
- Azure CLI: https://docs.microsoft.com/cli/azure/

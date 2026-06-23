/**
 * Azure Deployment Integration Example
 *
 * Demonstrates:
 * - Multi-service Azure deployment (App Service + Cosmos DB + Blob Storage)
 * - ARM template generation and validation
 * - Hybrid cloud configuration
 * - Health monitoring and cost tracking
 */

const AzureDeployment = require('./azure-deployment');

/**
 * Example 1: Simple App Service Deployment
 */
function example1_simpleAppService() {
  console.log('\n=== Example 1: Simple App Service Deployment ===\n');

  const deployment = new AzureDeployment({
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
    resourceGroup: 'my-app-rg',
    region: 'eastus',
    environment: 'staging'
  });

  // Configure App Service
  const appService = deployment.configureAppService({
    name: 'my-nodejs-app',
    runtime: 'NODE|18-lts',
    sku: 'B2S',
    instanceCount: 2,
    appSettings: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info',
      DATABASE_URL: 'cosmosdb://...'
    },
    healthCheckPath: '/api/health'
  });

  console.log('App Service configured:');
  console.log(`  Name: ${appService.name}`);
  console.log(`  SKU: ${appService.sku}`);
  console.log(`  Instances: ${appService.instanceCount}`);
  console.log(`  Daily Cost: $${appService.dailyCost.toFixed(2)}`);
}

/**
 * Example 2: Full-Stack Deployment (App + DB + Storage)
 */
function example2_fullStackDeployment() {
  console.log('\n=== Example 2: Full-Stack Deployment ===\n');

  const deployment = new AzureDeployment({
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
    resourceGroup: 'claudient-prod-rg',
    region: 'eastus',
    environment: 'production',
    enableAutoScaling: true,
    costLimit: 500 // $500/month limit
  });

  // Step 1: Configure App Service
  const appService = deployment.configureAppService({
    name: 'claudient-api',
    runtime: 'NODE|18-lts',
    sku: 'S1',
    instanceCount: 3,
    autoscaleEnabled: true,
    minInstances: 3,
    maxInstances: 10,
    appSettings: {
      NODE_ENV: 'production',
      API_VERSION: 'v2',
      COSMOS_ENDPOINT: '[reference to cosmos endpoint]'
    }
  });

  // Step 2: Configure Cosmos DB
  const cosmosDb = deployment.configureCosmosDb({
    name: 'claudient-db',
    accountName: 'claudient-cosmos-prod',
    apiType: 'sql',
    throughput: 2000,
    enableGeoReplication: true,
    replicas: ['eastus', 'westus', 'eastus2'],
    consistencyLevel: 'Session',
    databases: [
      { name: 'users', partitionKey: '/userId' },
      { name: 'projects', partitionKey: '/projectId' },
      { name: 'workflows', partitionKey: '/workflowId' }
    ]
  });

  // Step 3: Configure Blob Storage
  const blobStorage = deployment.configureBlobStorage({
    name: 'claudient-storage',
    accountName: 'claudientstorprod',
    accessTier: 'Hot',
    redundancy: 'RA-GRS', // Geo-redundant for DR
    enableVersioning: true,
    enableSoftDelete: true,
    retentionDays: 90,
    estimatedSize: 1000, // 1TB
    containers: [
      { name: 'documents', publicAccess: 'None' },
      { name: 'assets', publicAccess: 'Blob' },
      { name: 'backups', publicAccess: 'None' }
    ]
  });

  // Step 4: Display cost summary
  console.log('Full-Stack Deployment Configuration:');
  console.log(`\nServices:`);
  console.log(`  App Service: ${appService.name} (${appService.sku}, ${appService.instanceCount} instances)`);
  console.log(`  Cosmos DB: ${cosmosDb.name} (${cosmosDb.replicas.length} regions, ${cosmosDb.throughput} RU/s)`);
  console.log(`  Blob Storage: ${blobStorage.name} (${blobStorage.redundancy}, ${blobStorage.estimatedSize}GB)`);
  console.log(`\nCost Estimates:`);
  console.log(`  App Service: $${appService.dailyCost.toFixed(2)}/day`);
  console.log(`  Cosmos DB: $${cosmosDb.dailyCost.toFixed(2)}/day`);
  console.log(`  Blob Storage: $${blobStorage.dailyCost.toFixed(2)}/day`);
  console.log(`  Total: $${deployment.costTracking.estimatedMonthly.toFixed(2)}/month`);
  console.log(`  Cost Limit: $${deployment.options.costLimit || 'unlimited'}/month`);
}

/**
 * Example 3: Container Instances for Batch Jobs
 */
function example3_containerInstances() {
  console.log('\n=== Example 3: Container Instances for Batch Jobs ===\n');

  const deployment = new AzureDeployment({
    resourceGroup: 'batch-processing-rg',
    region: 'eastus',
    environment: 'dev'
  });

  // Configure multiple container instances
  const containers = [
    {
      name: 'data-processor',
      image: 'myregistry.azurecr.io/processors/data-processor:1.0',
      cpu: 2.0,
      memory: 4.0,
      environment: {
        PROCESSING_QUEUE: 'data-processing-queue',
        OUTPUT_CONTAINER: 'processed-data'
      }
    },
    {
      name: 'report-generator',
      image: 'myregistry.azurecr.io/generators/report-gen:1.0',
      cpu: 1.0,
      memory: 2.0,
      environment: {
        REPORT_TYPE: 'monthly',
        OUTPUT_PATH: '/reports'
      }
    }
  ];

  containers.forEach(config => {
    const container = deployment.configureContainerInstances(config);
    console.log(`Container: ${container.name}`);
    console.log(`  CPU: ${container.cpu}, Memory: ${container.memory}GB`);
    console.log(`  Daily Cost: $${container.dailyCost.toFixed(4)}`);
  });
}

/**
 * Example 4: ARM Template Generation
 */
function example4_armTemplate() {
  console.log('\n=== Example 4: ARM Template Generation ===\n');

  const deployment = new AzureDeployment({
    resourceGroup: 'template-rg',
    region: 'eastus',
    environment: 'staging'
  });

  // Configure services
  deployment.configureAppService({
    name: 'web-app',
    sku: 'B2S',
    runtime: 'NODE|18-lts'
  });

  deployment.configureBlobStorage({
    name: 'storage',
    accountName: 'storageacct',
    redundancy: 'GRS'
  });

  // Generate ARM template
  const template = deployment.generateARMTemplate();

  console.log('ARM Template Structure:');
  console.log(`  Schema: ${template.$schema}`);
  console.log(`  Content Version: ${template.contentVersion}`);
  console.log(`  Parameters: ${Object.keys(template.parameters).join(', ')}`);
  console.log(`  Resources: ${template.resources.length} total`);
  console.log(`  Outputs: ${Object.keys(template.outputs).length}`);

  // Validate template
  const validation = deployment.validateARMTemplate(template);
  console.log(`\nValidation Result:`);
  console.log(`  Valid: ${validation.valid}`);
  console.log(`  Errors: ${validation.errors.length}`);
  console.log(`  Warnings: ${validation.warnings.length}`);

  if (validation.warnings.length > 0) {
    console.log(`\nWarnings:`);
    validation.warnings.forEach(w => console.log(`  - ${w}`));
  }

  // Save template to file
  const fs = require('fs');
  fs.writeFileSync('arm-template.json', JSON.stringify(template, null, 2));
  console.log('\nTemplate saved to: arm-template.json');
}

/**
 * Example 5: Health Monitoring
 */
async function example5_healthMonitoring() {
  console.log('\n=== Example 5: Health Monitoring ===\n');

  const deployment = new AzureDeployment({
    resourceGroup: 'monitoring-rg',
    region: 'eastus'
  });

  // Configure services
  const appService = deployment.configureAppService({
    name: 'api-server',
    sku: 'S1'
  });

  const cosmos = deployment.configureCosmosDb({
    name: 'app-db',
    accountName: 'app-db-account',
    throughput: 1000
  });

  const storage = deployment.configureBlobStorage({
    name: 'app-storage',
    accountName: 'appstg'
  });

  // Simulate health checks
  console.log('Running Health Checks...\n');

  for (const [serviceId, service] of deployment.services) {
    const check = await deployment.healthCheck(serviceId);

    console.log(`${service.name}:`);
    console.log(`  Status: ${check.healthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    console.log(`  Type: ${service.type}`);
    console.log(`  Metrics:`, JSON.stringify(check.metrics, null, 4));

    if (check.issues.length > 0) {
      console.log(`  Issues: ${check.issues.join(', ')}`);
    }
    console.log();
  }
}

/**
 * Example 6: Hybrid Cloud Configuration
 */
function example6_hybridCloud() {
  console.log('\n=== Example 6: Hybrid Cloud Configuration ===\n');

  const deployment = new AzureDeployment({
    resourceGroup: 'hybrid-rg',
    region: 'eastus',
    enableHybridCloud: true
  });

  // Configure hybrid cloud
  const hybridConfig = deployment.enableHybridCloud({
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
      type: 'Vpn',
      vpnType: 'RouteBased'
    },
    onPremConnections: [
      {
        name: 'office-network',
        network: '192.168.0.0/24',
        vpnConnectionName: 'office-vpn'
      },
      {
        name: 'datacenter',
        network: '10.10.0.0/16',
        vpnConnectionName: 'dc-vpn'
      }
    ],
    dataSync: {
      enabled: true,
      syncInterval: 3600, // seconds
      bidirectional: true
    }
  });

  console.log('Hybrid Cloud Configuration:');
  console.log(`  Enabled: ${hybridConfig.enabled}`);
  console.log(`  Virtual Network: ${hybridConfig.vnetConfig.name}`);
  console.log(`  VPN Gateway: ${hybridConfig.vpnGateway.name}`);
  console.log(`  On-Prem Connections: ${hybridConfig.onPremConnections.length}`);
  console.log(`  Data Sync: ${hybridConfig.dataSync.enabled}`);

  hybridConfig.onPremConnections.forEach(conn => {
    console.log(`    - ${conn.name} (${conn.network})`);
  });
}

/**
 * Example 7: Deployment with Event Monitoring
 */
async function example7_deploymentWithEvents() {
  console.log('\n=== Example 7: Deployment with Event Monitoring ===\n');

  const deployment = new AzureDeployment({
    resourceGroup: 'event-test-rg',
    region: 'eastus',
    environment: 'dev',
    dryRun: true // Dry-run for safety
  });

  // Set up event listeners
  deployment.on('serviceConfigured', (event) => {
    console.log(`[SERVICE_CONFIGURED] ${event.service}: ${event.config.name}`);
  });

  deployment.on('deploymentStarted', (deploy) => {
    console.log(`[DEPLOYMENT_STARTED] ${deploy.name} (ID: ${deploy.id})`);
  });

  deployment.on('deploymentSucceeded', (deploy) => {
    console.log(`[DEPLOYMENT_SUCCEEDED] ${deploy.name}`);
    console.log(`  Duration: ${(deploy.duration / 1000).toFixed(2)}s`);
    console.log(`  Steps: ${deploy.steps.length}`);
  });

  deployment.on('serviceDeployed', (resource) => {
    console.log(`[SERVICE_DEPLOYED] ${resource.name} -> ${resource.resourceId}`);
  });

  deployment.on('healthCheckComplete', (check) => {
    console.log(`[HEALTH_CHECK] ${check.serviceName}: ${check.healthy ? 'HEALTHY' : 'UNHEALTHY'}`);
  });

  // Configure and deploy
  console.log('Configuring services...\n');

  deployment.configureAppService({
    name: 'api-app',
    sku: 'B1S'
  });

  deployment.configureBlobStorage({
    name: 'blob-storage',
    accountName: 'blobstg'
  });

  console.log('\nStarting deployment...\n');

  try {
    const result = await deployment.deploy('event-test-deployment');

    console.log(`\nDeployment Summary:`);
    const summary = deployment.getDeploymentSummary(result.id);
    console.log(`  ID: ${summary.id}`);
    console.log(`  Status: ${summary.status}`);
    console.log(`  Services: ${summary.services.length}`);
    console.log(`  Estimated Monthly Cost: $${summary.estimatedCost.toFixed(2)}`);
  } catch (error) {
    console.error(`Deployment failed: ${error.message}`);
  }
}

/**
 * Example 8: Cost Optimization Analysis
 */
function example8_costOptimization() {
  console.log('\n=== Example 8: Cost Optimization Analysis ===\n');

  console.log('Comparing different configurations:\n');

  // Configuration 1: High availability
  const deployHA = new AzureDeployment({ environment: 'production' });
  deployHA.configureAppService({
    name: 'api-ha',
    sku: 'S2',
    instanceCount: 3
  });
  deployHA.configureCosmosDb({
    name: 'db-ha',
    accountName: 'db-ha',
    throughput: 5000,
    enableGeoReplication: true,
    replicas: ['eastus', 'westus', 'eastus2']
  });

  // Configuration 2: Cost-optimized
  const deployCost = new AzureDeployment({ environment: 'staging' });
  deployCost.configureAppService({
    name: 'api-cost',
    sku: 'B2S',
    instanceCount: 1
  });
  deployCost.configureCosmosDb({
    name: 'db-cost',
    accountName: 'db-cost',
    throughput: 400,
    enableGeoReplication: false,
    replicas: ['eastus']
  });

  console.log('High Availability Configuration:');
  console.log(`  Monthly Cost: $${deployHA.costTracking.estimatedMonthly.toFixed(2)}`);
  console.log(`  Services: ${deployHA.services.size}`);

  console.log('\nCost-Optimized Configuration:');
  console.log(`  Monthly Cost: $${deployCost.costTracking.estimatedMonthly.toFixed(2)}`);
  console.log(`  Services: ${deployCost.services.size}`);

  console.log(`\nSavings: $${(deployHA.costTracking.estimatedMonthly - deployCost.costTracking.estimatedMonthly).toFixed(2)}/month`);
  console.log(`Reduction: ${((1 - deployCost.costTracking.estimatedMonthly / deployHA.costTracking.estimatedMonthly) * 100).toFixed(1)}%`);
}

// Run all examples
async function runAllExamples() {
  try {
    example1_simpleAppService();
    example2_fullStackDeployment();
    example3_containerInstances();
    example4_armTemplate();
    await example5_healthMonitoring();
    example6_hybridCloud();
    await example7_deploymentWithEvents();
    example8_costOptimization();

    console.log('\n=== All Examples Completed ===\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use in other scripts
module.exports = {
  example1_simpleAppService,
  example2_fullStackDeployment,
  example3_containerInstances,
  example4_armTemplate,
  example5_healthMonitoring,
  example6_hybridCloud,
  example7_deploymentWithEvents,
  example8_costOptimization,
  runAllExamples
};

// Run examples if executed directly
if (require.main === module) {
  runAllExamples();
}

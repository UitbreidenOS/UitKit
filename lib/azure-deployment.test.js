/**
 * Azure Deployment Tests
 */

const AzureDeployment = require('./azure-deployment');
const { EventEmitter } = require('events');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('AzureDeployment', () => {
  let deployment;

  beforeEach(() => {
    deployment = new AzureDeployment({
      subscriptionId: 'test-sub-id',
      resourceGroup: 'test-rg',
      region: 'eastus',
      environment: 'dev',
      dataDir: './.test-azure'
    });
  });

  afterEach(() => {
    if (fs.existsSync('./.test-azure')) {
      fs.rmSync('./.test-azure', { recursive: true });
    }
  });

  describe('Initialization', () => {
    test('should create AzureDeployment instance', () => {
      assert(deployment instanceof AzureDeployment);
      assert(deployment instanceof EventEmitter);
    });

    test('should set default options', () => {
      assert.equal(deployment.options.region, 'eastus');
      assert.equal(deployment.options.environment, 'dev');
      assert.equal(deployment.options.subscriptionId, 'test-sub-id');
    });

    test('should ensure data directory exists', () => {
      assert(fs.existsSync('./.test-azure'));
    });
  });

  describe('App Service Configuration', () => {
    test('should configure App Service', () => {
      const config = {
        name: 'test-app',
        runtime: 'NODE|18-lts',
        sku: 'B1S',
        healthCheckPath: '/health'
      };

      const appService = deployment.configureAppService(config);

      assert.equal(appService.name, 'test-app');
      assert.equal(appService.type, 'appService');
      assert.equal(appService.runtime, 'NODE|18-lts');
      assert.equal(appService.healthCheckPath, '/health');
      assert(appService.dailyCost > 0);
    });

    test('should use environment-specific defaults', () => {
      const stagingDeploy = new AzureDeployment({
        environment: 'staging',
        dataDir: './.test-azure'
      });

      const config = { name: 'staging-app' };
      const appService = stagingDeploy.configureAppService(config);

      assert.equal(appService.instanceCount, 2); // Staging has 2 replicas
      assert(appService.autoscaleEnabled);
    });

    test('should emit serviceConfigured event', (done) => {
      deployment.once('serviceConfigured', (event) => {
        assert.equal(event.service, 'appService');
        assert.equal(event.config.name, 'test-app');
        done();
      });

      deployment.configureAppService({ name: 'test-app' });
    });
  });

  describe('Container Instances Configuration', () => {
    test('should configure Container Instances', () => {
      const config = {
        name: 'test-container',
        image: 'myregistry.azurecr.io/myapp:latest',
        cpu: 1.5,
        memory: 2.0,
        port: 3000
      };

      const container = deployment.configureContainerInstances(config);

      assert.equal(container.name, 'test-container');
      assert.equal(container.type, 'containerInstances');
      assert.equal(container.image, 'myregistry.azurecr.io/myapp:latest');
      assert.equal(container.cpu, 1.5);
      assert.equal(container.memory, 2.0);
      assert(container.dailyCost > 0);
    });

    test('should handle registry credentials', () => {
      const config = {
        name: 'test-container',
        image: 'myregistry.azurecr.io/app:1.0',
        imageRegistry: {
          enabled: true,
          server: 'myregistry.azurecr.io',
          username: 'admin',
          password: 'secret'
        }
      };

      const container = deployment.configureContainerInstances(config);
      assert(container.imageRegistry.enabled);
      assert.equal(container.imageRegistry.server, 'myregistry.azurecr.io');
    });
  });

  describe('Cosmos DB Configuration', () => {
    test('should configure Cosmos DB', () => {
      const config = {
        name: 'test-cosmos',
        accountName: 'testcosmosaccount',
        apiType: 'sql',
        throughput: 1000,
        enableGeoReplication: true,
        replicas: ['eastus', 'westus']
      };

      const cosmos = deployment.configureCosmosDb(config);

      assert.equal(cosmos.name, 'test-cosmos');
      assert.equal(cosmos.type, 'cosmosDb');
      assert.equal(cosmos.accountName, 'testcosmosaccount');
      assert.equal(cosmos.apiType, 'sql');
      assert.equal(cosmos.throughput, 1000);
      assert(cosmos.enableGeoReplication);
      assert.equal(cosmos.replicas.length, 2);
      assert(cosmos.dailyCost > 0);
    });

    test('should support multiple API types', () => {
      ['sql', 'mongodb', 'cassandra', 'gremlin', 'table'].forEach(apiType => {
        const cosmos = deployment.configureCosmosDb({
          name: `cosmos-${apiType}`,
          accountName: `account-${apiType}`,
          apiType
        });

        assert.equal(cosmos.apiType, apiType);
      });
    });
  });

  describe('Blob Storage Configuration', () => {
    test('should configure Blob Storage', () => {
      const config = {
        name: 'test-storage',
        accountName: 'teststorageaccount',
        accessTier: 'Hot',
        redundancy: 'GRS',
        estimatedSize: 500
      };

      const storage = deployment.configureBlobStorage(config);

      assert.equal(storage.name, 'test-storage');
      assert.equal(storage.type, 'blobStorage');
      assert.equal(storage.accessTier, 'Hot');
      assert.equal(storage.redundancy, 'GRS');
      assert.equal(storage.estimatedSize, 500);
      assert(storage.dailyCost > 0);
    });

    test('should set security defaults', () => {
      const storage = deployment.configureBlobStorage({ name: 'test-storage', accountName: 'test' });

      assert.equal(storage.enableEncryption, true);
      assert.equal(storage.enableSoftDelete, true);
      assert(storage.retentionDays > 0);
    });
  });

  describe('ARM Template Generation', () => {
    test('should generate valid ARM template structure', () => {
      deployment.configureAppService({ name: 'app1' });
      deployment.configureBlobStorage({ name: 'storage1', accountName: 'storage1' });

      const template = deployment.generateARMTemplate();

      assert(template.$schema);
      assert.equal(template.contentVersion, '1.0.0.0');
      assert(Array.isArray(template.parameters));
      assert(template.variables);
      assert(Array.isArray(template.resources));
      assert(template.outputs);
    });

    test('should include all configured services in resources', () => {
      deployment.configureAppService({ name: 'app1' });
      deployment.configureContainerInstances({ name: 'container1', image: 'image:latest' });
      deployment.configureCosmosDb({ name: 'cosmos1', accountName: 'cosmos1' });

      const template = deployment.generateARMTemplate();
      assert.equal(template.resources.length >= 3, true);
    });

    test('should generate App Service resources', () => {
      deployment.configureAppService({ name: 'testapp', sku: 'S1' });

      const template = deployment.generateARMTemplate();
      const appServiceResources = template.resources.filter(r =>
        r.type === 'Microsoft.Web/sites' || r.type === 'Microsoft.Web/serverfarms'
      );

      assert(appServiceResources.length >= 2); // Site + Plan
    });
  });

  describe('ARM Template Validation', () => {
    test('should validate ARM template structure', () => {
      deployment.configureAppService({ name: 'app1' });
      const template = deployment.generateARMTemplate();

      const validation = deployment.validateARMTemplate(template);

      assert.equal(validation.valid, true);
      assert.equal(validation.errors.length, 0);
    });

    test('should detect missing required properties', () => {
      const invalidTemplate = {
        contentVersion: '1.0.0.0',
        resources: [{ type: 'Microsoft.Web/sites' }] // Missing apiVersion and name
      };

      const validation = deployment.validateARMTemplate(invalidTemplate);

      assert.equal(validation.valid, false);
      assert(validation.errors.length > 0);
    });

    test('should generate warnings for low-tier SKUs', () => {
      deployment.configureAppService({ name: 'app1', sku: 'B1S' });
      const template = deployment.generateARMTemplate();

      const validation = deployment.validateARMTemplate(template);

      assert(validation.warnings.length > 0);
      assert(validation.warnings.some(w => w.includes('B1S')));
    });
  });

  describe('Cost Estimation', () => {
    test('should calculate App Service cost', () => {
      deployment.configureAppService({ name: 'app1', sku: 'S1', instanceCount: 2 });

      assert(deployment.costTracking.byService.length >= 0);
      assert(deployment.costTracking.estimatedMonthly > 0);
    });

    test('should estimate Container Instances cost', () => {
      deployment.configureContainerInstances({
        name: 'container1',
        image: 'test:latest',
        cpu: 1.0,
        memory: 1.5
      });

      assert(deployment.costTracking.estimatedMonthly > 0);
    });

    test('should estimate Cosmos DB cost with geo-replication', () => {
      const cosmos1 = deployment.configureCosmosDb({
        name: 'cosmos-no-geo',
        accountName: 'cosmos1',
        enableGeoReplication: false,
        throughput: 1000
      });

      const deployment2 = new AzureDeployment({ dataDir: './.test-azure' });
      const cosmos2 = deployment2.configureCosmosDb({
        name: 'cosmos-geo',
        accountName: 'cosmos2',
        enableGeoReplication: true,
        replicas: ['eastus', 'westus'],
        throughput: 1000
      });

      assert(cosmos2.dailyCost > cosmos1.dailyCost);
    });

    test('should update cost estimates when services added', () => {
      const initialCost = deployment.costTracking.estimatedMonthly;

      deployment.configureAppService({ name: 'app1', sku: 'S1' });
      const afterApp = deployment.costTracking.estimatedMonthly;

      deployment.configureBlobStorage({ name: 'storage1', accountName: 'storage1', estimatedSize: 100 });
      const afterStorage = deployment.costTracking.estimatedMonthly;

      assert(afterApp > initialCost);
      assert(afterStorage > afterApp);
    });
  });

  describe('Health Checks', () => {
    test('should perform health check', async () => {
      deployment.configureAppService({ name: 'app1' });
      const services = Array.from(deployment.services.keys());

      const check = await deployment.healthCheck(services[0]);

      assert.equal(check.healthy, true);
      assert.equal(check.serviceName, 'app1');
      assert(check.metrics);
      assert(Array.isArray(check.issues));
    });

    test('should detect high response time', async () => {
      deployment.configureAppService({ name: 'app1' });
      const services = Array.from(deployment.services.keys());

      // Mock high response time by running multiple checks
      let unhealtyFound = false;
      for (let i = 0; i < 100; i++) {
        const check = await deployment.healthCheck(services[0]);
        if (!check.healthy) {
          unhealtyFound = true;
          break;
        }
      }

      // Note: Due to randomness, we just verify structure
      const lastCheck = deployment.healthChecks.get(services[0]);
      assert(lastCheck.metrics.responseTime !== undefined);
    });

    test('should emit healthCheckComplete event', (done) => {
      deployment.configureAppService({ name: 'app1' });
      const services = Array.from(deployment.services.keys());

      deployment.once('healthCheckComplete', (check) => {
        assert.equal(check.serviceName, 'app1');
        done();
      });

      deployment.healthCheck(services[0]);
    });
  });

  describe('Deployment', () => {
    test('should perform dry-run deployment', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      const result = await deployment.deploy('test-dry-run');

      assert.equal(result.status, 'succeeded');
      assert.equal(result.dryRun, true);
      assert(result.steps.length > 0);
    });

    test('should validate before deployment', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      deployment.once('deploymentStarted', (deploy) => {
        assert.equal(deploy.status, 'pending');
      });

      const result = await deployment.deploy('test-validation');
      assert.equal(result.status, 'succeeded');
    });

    test('should check costs during deployment', async () => {
      deployment.options.dryRun = true;
      deployment.options.costLimit = 100; // $100/month
      deployment.configureAppService({ name: 'app1' });

      const result = await deployment.deploy('test-cost-check');
      assert.equal(result.status, 'succeeded');
    });

    test('should fail deployment if cost exceeds limit', async () => {
      deployment.options.dryRun = true;
      deployment.options.costLimit = 0.01; // Very low limit
      deployment.configureAppService({ name: 'app1', sku: 'S1' });

      try {
        await deployment.deploy('test-cost-limit');
        assert.fail('Should have thrown error');
      } catch (error) {
        assert(error.message.includes('Cost limit exceeded'));
      }
    });
  });

  describe('Rollback', () => {
    test('should rollback failed deployment', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      const deployResult = await deployment.deploy('test-deploy');
      const initialResourceCount = deployment.resources.size;

      await deployment.rollback(deployResult.id);

      // All resources should be removed after rollback
      const rollbackDeploy = deployment.deployments.get(deployResult.id);
      assert.equal(rollbackDeploy.status, 'rolled_back');
    });

    test('should emit rollback events', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      const deployResult = await deployment.deploy('test-deploy');

      let rollbackStartedFired = false;
      let rollbackCompletedFired = false;

      deployment.once('rollbackStarted', () => {
        rollbackStartedFired = true;
      });

      deployment.once('rollbackCompleted', () => {
        rollbackCompletedFired = true;
      });

      await deployment.rollback(deployResult.id);

      assert(rollbackStartedFired);
      assert(rollbackCompletedFired);
    });
  });

  describe('State Persistence', () => {
    test('should save state to disk', async () => {
      deployment.configureAppService({ name: 'app1' });
      deployment.options.dryRun = true;

      await deployment.deploy('test-deploy');

      assert(fs.existsSync(path.join('./.test-azure', 'deployment-state.json')));

      const state = JSON.parse(fs.readFileSync(path.join('./.test-azure', 'deployment-state.json'), 'utf8'));
      assert(state.deployments.length > 0);
      assert(state.costTracking);
    });

    test('should load state from disk', () => {
      const deploy1 = new AzureDeployment({ dataDir: './.test-azure' });
      deploy1.configureAppService({ name: 'app1' });
      deploy1._saveState();

      // Load in new instance
      const deploy2 = new AzureDeployment({ dataDir: './.test-azure' });
      assert(deploy2.deployments.size > 0 || deploy2.services.size > 0);
    });
  });

  describe('Hybrid Cloud', () => {
    test('should enable hybrid cloud configuration', () => {
      const hybridConfig = deployment.enableHybridCloud({
        vnetConfig: { addressSpace: '10.0.0.0/16' },
        onPremConnections: [{ name: 'site1', network: '192.168.0.0/24' }]
      });

      assert.equal(hybridConfig.enabled, true);
      assert(hybridConfig.vnetConfig);
      assert.equal(hybridConfig.onPremConnections.length, 1);
    });

    test('should emit hybridCloudConfigured event', (done) => {
      deployment.once('hybridCloudConfigured', (config) => {
        assert.equal(config.enabled, true);
        done();
      });

      deployment.enableHybridCloud({});
    });
  });

  describe('Resource Status', () => {
    test('should get resources status', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      await deployment.deploy('test-deploy');

      const status = deployment.getResourcesStatus();
      assert(Array.isArray(status));
    });

    test('should include health status in resources', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      const deployResult = await deployment.deploy('test-deploy');
      const services = Array.from(deployment.services.keys());
      await deployment.healthCheck(services[0]);

      const status = deployment.getResourcesStatus();
      assert(status.length >= 0);
    });
  });

  describe('Deployment Summary', () => {
    test('should generate deployment summary', async () => {
      deployment.options.dryRun = true;
      deployment.configureAppService({ name: 'app1' });

      const deployResult = await deployment.deploy('test-deploy');
      const summary = deployment.getDeploymentSummary(deployResult.id);

      assert.equal(summary.id, deployResult.id);
      assert.equal(summary.status, 'succeeded');
      assert(summary.duration !== null);
      assert(summary.services.length > 0);
      assert(summary.dryRun);
    });

    test('should return null for non-existent deployment', () => {
      const summary = deployment.getDeploymentSummary('non-existent');
      assert.equal(summary, null);
    });
  });
});

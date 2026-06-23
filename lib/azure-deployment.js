/**
 * Azure Deployment — Multi-service cloud deployment orchestrator
 *
 * Features:
 * - App Service, Container Instances, Cosmos DB, Blob Storage deployment
 * - ARM (Azure Resource Manager) template generation & validation
 * - Hybrid cloud support (on-prem + Azure)
 * - Health checks, rollback, resource monitoring
 * - Cost estimation and quota tracking
 */

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

/**
 * Azure service types
 */
const AZURE_SERVICES = {
  APP_SERVICE: 'appService',
  CONTAINER_INSTANCES: 'containerInstances',
  COSMOS_DB: 'cosmosDb',
  BLOB_STORAGE: 'blobStorage',
  VIRTUAL_MACHINES: 'virtualMachines',
  FUNCTIONS: 'functions',
  SQL_DATABASE: 'sqlDatabase',
  KEY_VAULT: 'keyVault'
};

/**
 * Deployment environment tiers
 */
const ENV_TIERS = {
  DEV: { name: 'dev', vmSize: 'B1S', replicas: 1, autoscale: false },
  STAGING: { name: 'staging', vmSize: 'B2S', replicas: 2, autoscale: true },
  PRODUCTION: { name: 'prod', vmSize: 'S1', replicas: 3, autoscale: true }
};

/**
 * Deployment status
 */
const DEPLOYMENT_STATUS = {
  PENDING: 'pending',
  VALIDATING: 'validating',
  DEPLOYING: 'deploying',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  ROLLED_BACK: 'rolled_back',
  MONITORING: 'monitoring'
};

/**
 * Azure Deployment Manager
 */
class AzureDeployment extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = {
      subscriptionId: options.subscriptionId || process.env.AZURE_SUBSCRIPTION_ID,
      resourceGroup: options.resourceGroup || 'claudient-rg',
      region: options.region || 'eastus',
      environment: options.environment || 'dev',
      enableHybridCloud: options.enableHybridCloud || false,
      enableAutoScaling: options.enableAutoScaling !== false,
      costLimit: options.costLimit || null, // USD/month
      dataDir: options.dataDir || path.join(process.cwd(), '.azure'),
      verbose: options.verbose || false,
      dryRun: options.dryRun || false,
      ...options
    };

    this.services = new Map(); // Service configurations
    this.deployments = new Map(); // Deployment history
    this.resources = new Map(); // Active Azure resources
    this.healthChecks = new Map(); // Health check results
    this.costTracking = {
      estimatedMonthly: 0,
      estimatedDaily: 0,
      byService: {},
      lastUpdated: null
    };

    this._ensureDataDir();
    this._loadState();
  }

  /**
   * Ensure .azure directory exists
   */
  _ensureDataDir() {
    if (!fs.existsSync(this.options.dataDir)) {
      fs.mkdirSync(this.options.dataDir, { recursive: true });
    }
  }

  /**
   * Load persisted state
   */
  _loadState() {
    try {
      const statePath = path.join(this.options.dataDir, 'deployment-state.json');
      if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        if (state.deployments) {
          state.deployments.forEach((d) => this.deployments.set(d.id, d));
        }
        if (state.resources) {
          state.resources.forEach((r) => this.resources.set(r.id, r));
        }
        if (state.costTracking) {
          this.costTracking = state.costTracking;
        }
      }
    } catch (error) {
      if (this.options.verbose) {
        console.error(`Failed to load state: ${error.message}`);
      }
    }
  }

  /**
   * Save state to persistent storage
   */
  _saveState() {
    try {
      const statePath = path.join(this.options.dataDir, 'deployment-state.json');
      const state = {
        deployments: Array.from(this.deployments.values()),
        resources: Array.from(this.resources.values()),
        costTracking: this.costTracking,
        lastSaved: new Date().toISOString()
      };
      fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
    } catch (error) {
      this.emit('error', { type: 'state_save_failed', error: error.message });
    }
  }

  /**
   * Configure App Service deployment
   */
  configureAppService(config) {
    const serviceId = config.name || `app-${Date.now()}`;
    const tier = ENV_TIERS[this.options.environment.toUpperCase()] || ENV_TIERS.DEV;

    const appServiceConfig = {
      id: serviceId,
      type: AZURE_SERVICES.APP_SERVICE,
      name: config.name,
      sku: config.sku || tier.vmSize,
      os: config.os || 'Linux',
      runtime: config.runtime || 'NODE|18-lts',
      instanceCount: config.instanceCount || tier.replicas,
      autoscaleEnabled: config.autoscaleEnabled !== false && tier.autoscale,
      minInstances: config.minInstances || tier.replicas,
      maxInstances: config.maxInstances || tier.replicas * 3,
      appSettings: config.appSettings || {},
      connectionStrings: config.connectionStrings || {},
      healthCheckPath: config.healthCheckPath || '/health',
      requestTimeout: config.requestTimeout || 30000,
      dailyCost: this._estimateAppServiceCost(tier, config),
      createdAt: new Date().toISOString()
    };

    this.services.set(serviceId, appServiceConfig);
    this.costTracking.byService[serviceId] = appServiceConfig.dailyCost;
    this._updateCostEstimates();

    this.emit('serviceConfigured', { service: 'appService', config: appServiceConfig });
    return appServiceConfig;
  }

  /**
   * Configure Container Instances deployment
   */
  configureContainerInstances(config) {
    const serviceId = config.name || `container-${Date.now()}`;

    const containerConfig = {
      id: serviceId,
      type: AZURE_SERVICES.CONTAINER_INSTANCES,
      name: config.name,
      image: config.image, // e.g., 'myregistry.azurecr.io/myapp:latest'
      imageRegistry: config.imageRegistry || {},
      cpu: config.cpu || 1.0,
      memory: config.memory || 1.5, // GB
      port: config.port || 80,
      environment: config.environment || {},
      volumeMounts: config.volumeMounts || [],
      restartPolicy: config.restartPolicy || 'OnFailure',
      dailyCost: this._estimateContainerInstancesCost(config),
      createdAt: new Date().toISOString()
    };

    this.services.set(serviceId, containerConfig);
    this.costTracking.byService[serviceId] = containerConfig.dailyCost;
    this._updateCostEstimates();

    this.emit('serviceConfigured', { service: 'containerInstances', config: containerConfig });
    return containerConfig;
  }

  /**
   * Configure Cosmos DB deployment
   */
  configureCosmosDb(config) {
    const serviceId = config.name || `cosmos-${Date.now()}`;

    const cosmosConfig = {
      id: serviceId,
      type: AZURE_SERVICES.COSMOS_DB,
      name: config.name,
      accountName: config.accountName,
      apiType: config.apiType || 'sql', // 'sql', 'mongodb', 'cassandra', 'gremlin', 'table'
      consistencyLevel: config.consistencyLevel || 'Session',
      throughput: config.throughput || 400, // RU/s
      autoscaleMaxThroughput: config.autoscaleMaxThroughput || null,
      enableGeoReplication: config.enableGeoReplication || false,
      replicas: config.replicas || ['eastus'],
      databases: config.databases || [],
      backupPolicy: config.backupPolicy || 'continuous',
      dailyCost: this._estimateCosmosCost(config),
      createdAt: new Date().toISOString()
    };

    this.services.set(serviceId, cosmosConfig);
    this.costTracking.byService[serviceId] = cosmosConfig.dailyCost;
    this._updateCostEstimates();

    this.emit('serviceConfigured', { service: 'cosmosDb', config: cosmosConfig });
    return cosmosConfig;
  }

  /**
   * Configure Blob Storage deployment
   */
  configureBlobStorage(config) {
    const serviceId = config.name || `storage-${Date.now()}`;

    const storageConfig = {
      id: serviceId,
      type: AZURE_SERVICES.BLOB_STORAGE,
      name: config.name,
      accountName: config.accountName,
      accessTier: config.accessTier || 'Hot', // 'Hot', 'Cool', 'Archive'
      redundancy: config.redundancy || 'LRS', // 'LRS', 'GRS', 'RA-GRS', 'ZRS'
      containers: config.containers || [],
      enableVersioning: config.enableVersioning || false,
      enableSoftDelete: config.enableSoftDelete !== false,
      retentionDays: config.retentionDays || 30,
      enableEncryption: config.enableEncryption !== false,
      lifecyclePolicies: config.lifecyclePolicies || [],
      estimatedSize: config.estimatedSize || 0, // GB
      dailyCost: this._estimateStorageCost(config),
      createdAt: new Date().toISOString()
    };

    this.services.set(serviceId, storageConfig);
    this.costTracking.byService[serviceId] = storageConfig.dailyCost;
    this._updateCostEstimates();

    this.emit('serviceConfigured', { service: 'blobStorage', config: storageConfig });
    return storageConfig;
  }

  /**
   * Generate ARM template for all configured services
   */
  generateARMTemplate() {
    const template = {
      $schema: 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#',
      contentVersion: '1.0.0.0',
      parameters: this._generateARMParameters(),
      variables: this._generateARMVariables(),
      resources: this._generateARMResources(),
      outputs: this._generateARMOutputs()
    };

    return template;
  }

  /**
   * Generate ARM template parameters section
   */
  _generateARMParameters() {
    return {
      environment: {
        type: 'string',
        defaultValue: this.options.environment,
        allowedValues: ['dev', 'staging', 'prod'],
        metadata: { description: 'Deployment environment' }
      },
      location: {
        type: 'string',
        defaultValue: this.options.region,
        metadata: { description: 'Azure region for deployment' }
      },
      timestamp: {
        type: 'string',
        defaultValue: `[utcNow('u')]`,
        metadata: { description: 'Deployment timestamp' }
      }
    };
  }

  /**
   * Generate ARM template variables section
   */
  _generateARMVariables() {
    const vars = {
      apiVersion: {
        appService: '2021-03-01',
        containerInstances: '2021-09-01',
        cosmosDb: '2021-11-15-preview',
        storage: '2021-08-01'
      },
      resourceNames: {}
    };

    this.services.forEach((service) => {
      if (service.type === AZURE_SERVICES.APP_SERVICE) {
        vars.resourceNames[service.id] = `[concat('${service.name}-', parameters('environment'))]`;
      }
    });

    return vars;
  }

  /**
   * Generate ARM template resources section
   */
  _generateARMResources() {
    const resources = [];

    this.services.forEach((service) => {
      switch (service.type) {
        case AZURE_SERVICES.APP_SERVICE:
          resources.push(this._generateAppServiceResource(service));
          resources.push(this._generateAppServicePlanResource(service));
          break;
        case AZURE_SERVICES.CONTAINER_INSTANCES:
          resources.push(this._generateContainerGroupResource(service));
          break;
        case AZURE_SERVICES.COSMOS_DB:
          resources.push(this._generateCosmosDbResource(service));
          break;
        case AZURE_SERVICES.BLOB_STORAGE:
          resources.push(this._generateStorageAccountResource(service));
          break;
      }
    });

    return resources;
  }

  /**
   * Generate App Service resource
   */
  _generateAppServiceResource(service) {
    return {
      type: 'Microsoft.Web/sites',
      apiVersion: '2021-03-01',
      name: `[variables('resourceNames.${service.id}')]`,
      location: '[parameters(\'location\')]',
      kind: 'app,linux',
      properties: {
        serverFarmId: `[resourceId('Microsoft.Web/serverfarms', concat('${service.name}-plan-', parameters('environment')))]`,
        siteConfig: {
          linuxFxVersion: service.runtime,
          alwaysOn: service.sku !== 'B1S',
          http20Enabled: true,
          minTlsVersion: '1.2',
          healthCheckPath: service.healthCheckPath,
          appSettings: this._formatAppSettings(service.appSettings)
        }
      },
      dependsOn: [
        `[resourceId('Microsoft.Web/serverfarms', concat('${service.name}-plan-', parameters('environment')))]`
      ]
    };
  }

  /**
   * Generate App Service Plan resource
   */
  _generateAppServicePlanResource(service) {
    const tier = ENV_TIERS[this.options.environment.toUpperCase()] || ENV_TIERS.DEV;
    return {
      type: 'Microsoft.Web/serverfarms',
      apiVersion: '2021-03-01',
      name: `${service.name}-plan-[parameters('environment')]`,
      location: '[parameters(\'location\')]',
      sku: {
        name: service.sku,
        tier: this._getSkuTier(service.sku),
        capacity: service.instanceCount
      },
      kind: 'linux',
      properties: {
        reserved: true
      }
    };
  }

  /**
   * Generate Container Instances resource
   */
  _generateContainerGroupResource(service) {
    return {
      type: 'Microsoft.ContainerInstance/containerGroups',
      apiVersion: '2021-09-01',
      name: service.name,
      location: '[parameters(\'location\')]',
      properties: {
        containers: [
          {
            name: service.name,
            properties: {
              image: service.image,
              resources: {
                requests: {
                  cpu: service.cpu,
                  memoryInGb: service.memory
                }
              },
              ports: [{ port: service.port, protocol: 'TCP' }],
              environmentVariables: this._formatEnvironmentVars(service.environment)
            }
          }
        ],
        osType: 'Linux',
        ipAddress: {
          type: 'Public',
          ports: [{ port: service.port, protocol: 'TCP' }],
          dnsNameLabel: service.name
        },
        restartPolicy: service.restartPolicy,
        imageRegistryCredentials: service.imageRegistry.enabled ? [
          {
            server: service.imageRegistry.server,
            username: service.imageRegistry.username,
            password: service.imageRegistry.password
          }
        ] : []
      }
    };
  }

  /**
   * Generate Cosmos DB resource
   */
  _generateCosmosDbResource(service) {
    return {
      type: 'Microsoft.DocumentDB/databaseAccounts',
      apiVersion: '2021-11-15-preview',
      name: service.accountName,
      location: '[parameters(\'location\')]',
      kind: service.apiType === 'mongodb' ? 'MongoDB' : 'GlobalDocumentDB',
      properties: {
        databaseAccountOfferType: 'Standard',
        defaultIdentity: 'FirstWritableLocation',
        consistencyPolicy: {
          defaultConsistencyLevel: service.consistencyLevel,
          maxStalenessPrefix: 100000,
          maxIntervalInSeconds: 100
        },
        locations: service.replicas.map(region => ({
          locationName: region,
          failoverPriority: service.replicas.indexOf(region)
        })),
        capabilities: this._getCosmosCapabilities(service.apiType),
        enableFreeTier: false
      }
    };
  }

  /**
   * Generate Storage Account resource
   */
  _generateStorageAccountResource(service) {
    return {
      type: 'Microsoft.Storage/storageAccounts',
      apiVersion: '2021-08-01',
      name: service.accountName,
      location: '[parameters(\'location\')]',
      sku: {
        name: this._getStorageSku(service.redundancy)
      },
      kind: 'StorageV2',
      properties: {
        accessTier: service.accessTier,
        minimumTlsVersion: 'TLS1_2',
        supportsHttpsTrafficOnly: true,
        encryption: {
          services: {
            blob: { enabled: service.enableEncryption },
            file: { enabled: service.enableEncryption }
          },
          keySource: 'Microsoft.Storage'
        }
      }
    };
  }

  /**
   * Generate ARM template outputs
   */
  _generateARMOutputs() {
    const outputs = {};

    this.services.forEach((service) => {
      outputs[`${service.id}Id`] = {
        type: 'string',
        value: `[resourceId('${this._getResourceType(service.type)}', '${service.name}')]`
      };
    });

    return outputs;
  }

  /**
   * Validate ARM template
   */
  validateARMTemplate(template) {
    const errors = [];

    if (!template.$schema) errors.push('Missing $schema property');
    if (!template.contentVersion) errors.push('Missing contentVersion property');
    if (!template.resources) errors.push('Missing resources array');

    template.resources?.forEach((resource, index) => {
      if (!resource.type) errors.push(`Resource ${index} missing type`);
      if (!resource.apiVersion) errors.push(`Resource ${index} missing apiVersion`);
      if (!resource.name) errors.push(`Resource ${index} missing name`);
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings: this._validateARMWarnings(template)
    };
  }

  /**
   * Deploy configuration to Azure
   */
  async deploy(deploymentName) {
    const deploymentId = `deploy-${Date.now()}`;
    const deployment = {
      id: deploymentId,
      name: deploymentName || `deployment-${Date.now()}`,
      status: DEPLOYMENT_STATUS.PENDING,
      services: Array.from(this.services.keys()),
      startTime: new Date().toISOString(),
      armTemplate: this.generateARMTemplate(),
      steps: [],
      rollbackPlans: [],
      createdAt: new Date().toISOString()
    };

    this.deployments.set(deploymentId, deployment);
    this.emit('deploymentStarted', deployment);

    if (this.options.dryRun) {
      return this._performDryRun(deployment);
    }

    try {
      await this._validateDeployment(deployment);
      await this._preDeploymentChecks(deployment);
      await this._executeDeployment(deployment);
      await this._postDeploymentValidation(deployment);

      deployment.status = DEPLOYMENT_STATUS.SUCCEEDED;
      deployment.endTime = new Date().toISOString();
      this.emit('deploymentSucceeded', deployment);

      this._saveState();
      return deployment;
    } catch (error) {
      deployment.status = DEPLOYMENT_STATUS.FAILED;
      deployment.error = error.message;
      deployment.endTime = new Date().toISOString();

      this.emit('deploymentFailed', deployment);
      await this.rollback(deploymentId);

      this._saveState();
      throw error;
    }
  }

  /**
   * Perform dry-run validation
   */
  async _performDryRun(deployment) {
    deployment.status = DEPLOYMENT_STATUS.VALIDATING;
    const validation = this.validateARMTemplate(deployment.armTemplate);

    deployment.steps.push({
      step: 'template_validation',
      status: validation.valid ? 'passed' : 'failed',
      details: validation
    });

    if (!validation.valid) {
      throw new Error(`ARM template validation failed: ${validation.errors.join(', ')}`);
    }

    deployment.status = DEPLOYMENT_STATUS.SUCCEEDED;
    deployment.dryRun = true;
    return deployment;
  }

  /**
   * Pre-deployment checks
   */
  async _preDeploymentChecks(deployment) {
    deployment.status = DEPLOYMENT_STATUS.VALIDATING;

    // Check quota
    const quotaCheck = await this._checkQuotas();
    deployment.steps.push({ step: 'quota_check', status: quotaCheck.ok ? 'passed' : 'failed', details: quotaCheck });

    if (!quotaCheck.ok) {
      throw new Error(`Quota check failed: ${quotaCheck.issues.join(', ')}`);
    }

    // Check costs
    const costCheck = this._checkCostLimits();
    deployment.steps.push({ step: 'cost_check', status: costCheck.ok ? 'passed' : 'failed', details: costCheck });

    if (!costCheck.ok) {
      throw new Error(`Cost limit exceeded: ${costCheck.message}`);
    }

    // Validate configurations
    const configValidation = this._validateServiceConfigs();
    deployment.steps.push({ step: 'config_validation', status: configValidation.valid ? 'passed' : 'failed', details: configValidation });

    if (!configValidation.valid) {
      throw new Error(`Configuration validation failed: ${configValidation.errors.join(', ')}`);
    }
  }

  /**
   * Execute deployment
   */
  async _executeDeployment(deployment) {
    deployment.status = DEPLOYMENT_STATUS.DEPLOYING;

    // Step 1: Deploy storage services first
    for (const service of this.services.values()) {
      if ([AZURE_SERVICES.BLOB_STORAGE].includes(service.type)) {
        await this._deployService(service, deployment);
      }
    }

    // Step 2: Deploy database services
    for (const service of this.services.values()) {
      if ([AZURE_SERVICES.COSMOS_DB, AZURE_SERVICES.SQL_DATABASE].includes(service.type)) {
        await this._deployService(service, deployment);
      }
    }

    // Step 3: Deploy compute services
    for (const service of this.services.values()) {
      if ([AZURE_SERVICES.APP_SERVICE, AZURE_SERVICES.CONTAINER_INSTANCES, AZURE_SERVICES.FUNCTIONS].includes(service.type)) {
        await this._deployService(service, deployment);
      }
    }
  }

  /**
   * Deploy individual service
   */
  async _deployService(service, deployment) {
    const stepName = `deploy_${service.id}`;

    try {
      // Simulate deployment (in real scenario, call Azure SDK)
      const deployed = {
        id: service.id,
        resourceId: `/subscriptions/${this.options.subscriptionId}/resourceGroups/${this.options.resourceGroup}/providers/${this._getResourceType(service.type)}/${service.name}`,
        type: service.type,
        name: service.name,
        status: 'running',
        deployedAt: new Date().toISOString(),
        region: this.options.region
      };

      this.resources.set(service.id, deployed);

      deployment.steps.push({
        step: stepName,
        status: 'passed',
        resourceId: deployed.resourceId
      });

      this.emit('serviceDeployed', deployed);
    } catch (error) {
      deployment.steps.push({
        step: stepName,
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Post-deployment validation
   */
  async _postDeploymentValidation(deployment) {
    // Run health checks
    for (const service of this.services.values()) {
      const healthCheck = await this.healthCheck(service.id);
      deployment.steps.push({
        step: `health_check_${service.id}`,
        status: healthCheck.healthy ? 'passed' : 'failed',
        details: healthCheck
      });

      if (!healthCheck.healthy) {
        throw new Error(`Health check failed for ${service.id}: ${healthCheck.message}`);
      }
    }
  }

  /**
   * Check service health
   */
  async healthCheck(serviceId) {
    const service = this.services.get(serviceId);
    if (!service) {
      return { healthy: false, message: 'Service not found' };
    }

    const check = {
      serviceId,
      serviceName: service.name,
      type: service.type,
      timestamp: new Date().toISOString(),
      healthy: true,
      metrics: {},
      issues: []
    };

    switch (service.type) {
      case AZURE_SERVICES.APP_SERVICE:
        check.metrics.responseTime = Math.random() * 500; // Simulated
        check.metrics.uptime = 99.9;
        if (check.metrics.responseTime > 3000) {
          check.issues.push('High response time');
          check.healthy = false;
        }
        break;

      case AZURE_SERVICES.COSMOS_DB:
        check.metrics.throughputUsage = Math.random() * 100;
        check.metrics.replicationLag = Math.random() * 1000; // ms
        if (check.metrics.replicationLag > 5000) {
          check.issues.push('High replication lag');
          check.healthy = false;
        }
        break;

      case AZURE_SERVICES.BLOB_STORAGE:
        check.metrics.availabilityPercent = 99.99;
        check.metrics.latency = Math.random() * 100; // ms
        break;

      case AZURE_SERVICES.CONTAINER_INSTANCES:
        check.metrics.cpuUsage = Math.random() * 100;
        check.metrics.memoryUsage = Math.random() * 100;
        if (check.metrics.cpuUsage > 90 || check.metrics.memoryUsage > 90) {
          check.issues.push('High resource usage');
          check.healthy = false;
        }
        break;
    }

    this.healthChecks.set(serviceId, check);
    this.emit('healthCheckComplete', check);
    return check;
  }

  /**
   * Rollback deployment
   */
  async rollback(deploymentId) {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) {
      throw new Error(`Deployment not found: ${deploymentId}`);
    }

    deployment.status = DEPLOYMENT_STATUS.ROLLED_BACK;
    this.emit('rollbackStarted', deployment);

    // Remove deployed resources
    for (const serviceId of deployment.services) {
      this.resources.delete(serviceId);
    }

    deployment.rollbackTime = new Date().toISOString();
    this._saveState();

    this.emit('rollbackCompleted', deployment);
    return deployment;
  }

  /**
   * Check quota limits
   */
  async _checkQuotas() {
    const quotas = {
      ok: true,
      issues: [],
      details: {
        appServices: { current: this.services.size, limit: 20 },
        storageAccounts: { current: 1, limit: 10 },
        cosmosAccounts: { current: 1, limit: 5 }
      }
    };

    Object.entries(quotas.details).forEach(([key, quota]) => {
      if (quota.current > quota.limit) {
        quotas.ok = false;
        quotas.issues.push(`${key} quota exceeded`);
      }
    });

    return quotas;
  }

  /**
   * Check cost limits
   */
  _checkCostLimits() {
    const check = {
      ok: true,
      message: '',
      estimatedMonthly: this.costTracking.estimatedMonthly,
      limit: this.options.costLimit
    };

    if (this.options.costLimit && this.costTracking.estimatedMonthly > this.options.costLimit) {
      check.ok = false;
      check.message = `Estimated cost ($${check.estimatedMonthly}) exceeds limit ($${this.options.costLimit})`;
    }

    return check;
  }

  /**
   * Validate service configurations
   */
  _validateServiceConfigs() {
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };

    this.services.forEach((service) => {
      if (!service.name || service.name.length < 3) {
        validation.errors.push(`${service.id}: Name too short or missing`);
        validation.valid = false;
      }

      if (service.type === AZURE_SERVICES.CONTAINER_INSTANCES && !service.image) {
        validation.errors.push(`${service.id}: Container image required`);
        validation.valid = false;
      }

      if (service.cpu && service.cpu < 0.1) {
        validation.warnings.push(`${service.id}: CPU less than 0.1 may affect performance`);
      }
    });

    return validation;
  }

  /**
   * Cost estimation helpers
   */
  _estimateAppServiceCost(tier, config) {
    const skuCosts = {
      B1S: 7.15,
      B2S: 14.30,
      S1: 50,
      S2: 100,
      S3: 200
    };
    return (skuCosts[config.sku || tier.vmSize] || 10) * config.instanceCount || tier.replicas;
  }

  _estimateContainerInstancesCost(config) {
    return (config.cpu * 0.0106 + config.memory * 0.0045) * 730; // Monthly estimate
  }

  _estimateCosmosCost(config) {
    const throughput = config.throughput || 400;
    const baseRate = throughput * 0.00012; // Simplified
    const geoMultiplier = config.enableGeoReplication ? (config.replicas?.length || 1) : 1;
    return baseRate * geoMultiplier * 730;
  }

  _estimateStorageCost(config) {
    const tierCosts = { Hot: 0.0184, Cool: 0.01, Archive: 0.00099 };
    const baseCost = (tierCosts[config.accessTier] || 0.0184) * (config.estimatedSize || 100);
    const redundancyMultiplier = config.redundancy === 'RA-GRS' ? 2 : config.redundancy === 'GRS' ? 1.5 : 1;
    return baseCost * redundancyMultiplier * 30;
  }

  /**
   * Update cost estimates
   */
  _updateCostEstimates() {
    const dailyCost = Object.values(this.costTracking.byService).reduce((a, b) => a + b, 0);
    this.costTracking.estimatedDaily = dailyCost;
    this.costTracking.estimatedMonthly = dailyCost * 30;
    this.costTracking.lastUpdated = new Date().toISOString();
  }

  /**
   * Helper utilities
   */
  _getSkuTier(sku) {
    const tiers = { B1S: 'Basic', B2S: 'Basic', S1: 'Standard', S2: 'Standard', S3: 'Standard', P1V2: 'PremiumV2' };
    return tiers[sku] || 'Basic';
  }

  _getResourceType(serviceType) {
    const types = {
      [AZURE_SERVICES.APP_SERVICE]: 'Microsoft.Web/sites',
      [AZURE_SERVICES.CONTAINER_INSTANCES]: 'Microsoft.ContainerInstance/containerGroups',
      [AZURE_SERVICES.COSMOS_DB]: 'Microsoft.DocumentDB/databaseAccounts',
      [AZURE_SERVICES.BLOB_STORAGE]: 'Microsoft.Storage/storageAccounts'
    };
    return types[serviceType] || '';
  }

  _getCosmosCapabilities(apiType) {
    const capabilities = {
      sql: [{ name: 'EnableServerless' }],
      mongodb: [{ name: 'EnableMongo' }],
      cassandra: [{ name: 'EnableCassandra' }],
      gremlin: [{ name: 'EnableGremlin' }],
      table: [{ name: 'EnableTable' }]
    };
    return capabilities[apiType] || [];
  }

  _getStorageSku(redundancy) {
    const skus = {
      LRS: 'Standard_LRS',
      GRS: 'Standard_GRS',
      'RA-GRS': 'Standard_RAGRS',
      ZRS: 'Standard_ZRS'
    };
    return skus[redundancy] || 'Standard_LRS';
  }

  _formatAppSettings(settings) {
    return Object.entries(settings || {}).map(([name, value]) => ({
      name,
      value: typeof value === 'string' ? value : JSON.stringify(value)
    }));
  }

  _formatEnvironmentVars(env) {
    return Object.entries(env || {}).map(([name, value]) => ({
      name,
      value: typeof value === 'string' ? value : JSON.stringify(value)
    }));
  }

  _validateARMWarnings(template) {
    const warnings = [];
    template.resources?.forEach((resource) => {
      if (resource.sku?.name === 'B1S') {
        warnings.push(`${resource.name}: B1S SKU has limited resources, not recommended for production`);
      }
      if (!resource.properties?.siteConfig?.minTlsVersion || resource.properties?.siteConfig?.minTlsVersion < '1.2') {
        warnings.push(`${resource.name}: TLS version lower than 1.2 is deprecated`);
      }
    });
    return warnings;
  }

  /**
   * Get deployment summary
   */
  getDeploymentSummary(deploymentId) {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return null;

    return {
      id: deployment.id,
      name: deployment.name,
      status: deployment.status,
      startTime: deployment.startTime,
      endTime: deployment.endTime,
      duration: deployment.endTime ? new Date(deployment.endTime).getTime() - new Date(deployment.startTime).getTime() : null,
      services: Array.from(this.services.values()).filter(s => deployment.services.includes(s.id)),
      steps: deployment.steps,
      estimatedCost: this.costTracking.estimatedMonthly,
      dryRun: deployment.dryRun || false
    };
  }

  /**
   * Get all resources status
   */
  getResourcesStatus() {
    return Array.from(this.resources.values()).map(resource => ({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      status: resource.status,
      deployedAt: resource.deployedAt,
      healthStatus: this.healthChecks.get(resource.id)?.healthy ? 'healthy' : 'unknown'
    }));
  }

  /**
   * Enable hybrid cloud (on-prem + Azure)
   */
  enableHybridCloud(config) {
    const hybridConfig = {
      enabled: true,
      vnetConfig: config.vnetConfig || {},
      vpnGateway: config.vpnGateway || {},
      expressRoute: config.expressRoute || null,
      onPremConnections: config.onPremConnections || [],
      dataSync: config.dataSync || { enabled: false }
    };

    this.options.hybridConfig = hybridConfig;
    this.emit('hybridCloudConfigured', hybridConfig);
    return hybridConfig;
  }
}

module.exports = AzureDeployment;

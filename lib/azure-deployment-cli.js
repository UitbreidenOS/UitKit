#!/usr/bin/env node

/**
 * Azure Deployment CLI
 *
 * Usage:
 *   azure-deployment configure <service-type> [options]
 *   azure-deployment template [--validate] [--output file.json]
 *   azure-deployment cost [--limit $X]
 *   azure-deployment health [--service name]
 *   azure-deployment deploy [--name] [--dryRun]
 *   azure-deployment rollback <deployment-id>
 *   azure-deployment list [--deployments|--services|--resources]
 */

const AzureDeployment = require('./azure-deployment');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const COMMANDS = {
  CONFIGURE: 'configure',
  TEMPLATE: 'template',
  COST: 'cost',
  HEALTH: 'health',
  DEPLOY: 'deploy',
  ROLLBACK: 'rollback',
  LIST: 'list',
  HELP: 'help'
};

const SERVICE_TYPES = {
  APP_SERVICE: 'app-service',
  CONTAINER: 'container',
  COSMOS: 'cosmos',
  STORAGE: 'storage'
};

class AzureDeploymentCLI {
  constructor() {
    this.deployment = null;
    this.config = this._loadConfig();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Load configuration from .azure/config.json
   */
  _loadConfig() {
    try {
      const configPath = path.join(process.cwd(), '.azure', 'config.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      console.warn(`Warning: Could not load config: ${error.message}`);
    }

    return {
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || 'default-sub-id',
      resourceGroup: 'claudient-rg',
      region: 'eastus',
      environment: 'dev'
    };
  }

  /**
   * Save configuration
   */
  _saveConfig() {
    const configDir = path.join(process.cwd(), '.azure');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }

  /**
   * Initialize deployment manager
   */
  _initDeployment(options = {}) {
    this.deployment = new AzureDeployment({
      ...this.config,
      ...options
    });

    // Set up event logging
    this.deployment.on('serviceConfigured', (event) => {
      console.log(`✓ Service configured: ${event.config.name} (${event.service})`);
    });

    this.deployment.on('deploymentStarted', (deploy) => {
      console.log(`→ Deployment started: ${deploy.name}`);
    });

    this.deployment.on('deploymentSucceeded', (deploy) => {
      console.log(`✓ Deployment succeeded: ${deploy.name}`);
    });

    this.deployment.on('deploymentFailed', (deploy) => {
      console.log(`✗ Deployment failed: ${deploy.name}\n  Error: ${deploy.error}`);
    });

    this.deployment.on('serviceDeployed', (resource) => {
      console.log(`✓ Resource deployed: ${resource.name}`);
    });

    this.deployment.on('healthCheckComplete', (check) => {
      const status = check.healthy ? '✓' : '✗';
      console.log(`${status} Health check: ${check.serviceName} - ${check.healthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    });
  }

  /**
   * Parse command-line arguments
   */
  parseArgs(args) {
    const command = args[0];
    const subcommand = args[1];
    const options = {};

    for (let i = 2; i < args.length; i++) {
      if (args[i].startsWith('--')) {
        const key = args[i].substring(2);
        const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
        options[key] = value;
        if (value !== true) i++;
      }
    }

    return { command, subcommand, options };
  }

  /**
   * Handle configure command
   */
  async handleConfigure({ subcommand, options }) {
    this._initDeployment();

    const serviceType = subcommand || SERVICE_TYPES.APP_SERVICE;
    const config = await this._promptForServiceConfig(serviceType, options);

    try {
      switch (serviceType) {
        case SERVICE_TYPES.APP_SERVICE:
          this.deployment.configureAppService(config);
          break;
        case SERVICE_TYPES.CONTAINER:
          this.deployment.configureContainerInstances(config);
          break;
        case SERVICE_TYPES.COSMOS:
          this.deployment.configureCosmosDb(config);
          break;
        case SERVICE_TYPES.STORAGE:
          this.deployment.configureBlobStorage(config);
          break;
        default:
          throw new Error(`Unknown service type: ${serviceType}`);
      }

      console.log(`\n✓ Service configured successfully`);
      console.log(`Cost: $${this.deployment.costTracking.estimatedMonthly.toFixed(2)}/month`);
    } catch (error) {
      console.error(`✗ Configuration failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Prompt for service configuration
   */
  async _promptForServiceConfig(serviceType, defaults = {}) {
    const questions = [];

    switch (serviceType) {
      case SERVICE_TYPES.APP_SERVICE:
        questions.push(
          { name: 'name', question: 'App Service name: ', default: defaults.name || 'my-app' },
          { name: 'runtime', question: 'Runtime (e.g., NODE|18-lts): ', default: defaults.runtime || 'NODE|18-lts' },
          { name: 'sku', question: 'SKU (B1S, B2S, S1, S2, S3): ', default: defaults.sku || 'B1S' },
          { name: 'instanceCount', question: 'Instance count (1-10): ', default: defaults.instanceCount || '1' }
        );
        break;

      case SERVICE_TYPES.CONTAINER:
        questions.push(
          { name: 'name', question: 'Container name: ', default: defaults.name || 'my-container' },
          { name: 'image', question: 'Container image URI: ', default: defaults.image || 'myregistry.azurecr.io/app:latest' },
          { name: 'cpu', question: 'CPU cores (0.5-4.0): ', default: defaults.cpu || '1' },
          { name: 'memory', question: 'Memory (GB): ', default: defaults.memory || '1.5' }
        );
        break;

      case SERVICE_TYPES.COSMOS:
        questions.push(
          { name: 'name', question: 'Cosmos DB name: ', default: defaults.name || 'my-cosmos' },
          { name: 'accountName', question: 'Account name: ', default: defaults.accountName || 'mycosmosaccount' },
          { name: 'apiType', question: 'API type (sql, mongodb, cassandra, gremlin, table): ', default: defaults.apiType || 'sql' },
          { name: 'throughput', question: 'Throughput (RU/s): ', default: defaults.throughput || '400' }
        );
        break;

      case SERVICE_TYPES.STORAGE:
        questions.push(
          { name: 'name', question: 'Storage account name: ', default: defaults.name || 'mystg' },
          { name: 'accountName', question: 'Account name (DNS-safe): ', default: defaults.accountName || 'mystgaccount' },
          { name: 'redundancy', question: 'Redundancy (LRS, GRS, RA-GRS, ZRS): ', default: defaults.redundancy || 'LRS' },
          { name: 'estimatedSize', question: 'Estimated size (GB): ', default: defaults.estimatedSize || '100' }
        );
        break;
    }

    const config = {};
    for (const q of questions) {
      const answer = await this._prompt(q.question, q.default);
      config[q.name] = isNaN(answer) ? answer : Number(answer);
    }

    return config;
  }

  /**
   * Handle template command
   */
  handleTemplate({ options }) {
    this._initDeployment();

    if (!this.deployment.services.size) {
      console.error('✗ No services configured. Please configure services first.');
      process.exit(1);
    }

    const template = this.deployment.generateARMTemplate();

    if (options.validate) {
      const validation = this.deployment.validateARMTemplate(template);
      console.log(`Template Validation:`);
      console.log(`  Valid: ${validation.valid ? 'YES' : 'NO'}`);
      console.log(`  Errors: ${validation.errors.length}`);
      console.log(`  Warnings: ${validation.warnings.length}`);

      if (validation.errors.length > 0) {
        console.log(`\nErrors:`);
        validation.errors.forEach(e => console.log(`  - ${e}`));
      }

      if (validation.warnings.length > 0) {
        console.log(`\nWarnings:`);
        validation.warnings.forEach(w => console.log(`  - ${w}`));
      }
    }

    if (options.output) {
      fs.writeFileSync(options.output, JSON.stringify(template, null, 2));
      console.log(`✓ Template saved to: ${options.output}`);
    } else {
      console.log(JSON.stringify(template, null, 2));
    }
  }

  /**
   * Handle cost command
   */
  handleCost({ options }) {
    this._initDeployment();

    if (!this.deployment.services.size) {
      console.error('✗ No services configured.');
      process.exit(1);
    }

    console.log('Cost Breakdown:\n');

    const costs = Array.from(this.deployment.services.entries()).map(([id, service]) => ({
      name: service.name,
      type: service.type,
      daily: this.deployment.costTracking.byService[id] || 0,
      monthly: (this.deployment.costTracking.byService[id] || 0) * 30
    }));

    costs.forEach(cost => {
      console.log(`${cost.name} (${cost.type}):`);
      console.log(`  Daily:   $${cost.daily.toFixed(2)}`);
      console.log(`  Monthly: $${cost.monthly.toFixed(2)}`);
    });

    console.log(`\nTotal:`);
    console.log(`  Daily:   $${this.deployment.costTracking.estimatedDaily.toFixed(2)}`);
    console.log(`  Monthly: $${this.deployment.costTracking.estimatedMonthly.toFixed(2)}`);

    if (options.limit) {
      const limit = parseFloat(options.limit);
      if (this.deployment.costTracking.estimatedMonthly > limit) {
        console.log(`\n✗ Cost exceeds limit of $${limit.toFixed(2)}/month`);
      } else {
        console.log(`\n✓ Cost within limit of $${limit.toFixed(2)}/month`);
      }
    }
  }

  /**
   * Handle health command
   */
  async handleHealth({ options }) {
    this._initDeployment();

    if (!this.deployment.services.size) {
      console.error('✗ No services configured.');
      process.exit(1);
    }

    console.log('Running health checks...\n');

    for (const [serviceId, service] of this.deployment.services) {
      if (options.service && service.name !== options.service) continue;

      const check = await this.deployment.healthCheck(serviceId);

      const status = check.healthy ? '✓' : '✗';
      console.log(`${status} ${service.name}`);
      console.log(`  Type: ${service.type}`);
      console.log(`  Status: ${check.healthy ? 'HEALTHY' : 'UNHEALTHY'}`);

      if (Object.keys(check.metrics).length > 0) {
        console.log(`  Metrics:`);
        Object.entries(check.metrics).forEach(([key, value]) => {
          console.log(`    ${key}: ${value}`);
        });
      }

      if (check.issues.length > 0) {
        console.log(`  Issues: ${check.issues.join(', ')}`);
      }
      console.log();
    }
  }

  /**
   * Handle deploy command
   */
  async handleDeploy({ options }) {
    this._initDeployment(options);

    if (!this.deployment.services.size) {
      console.error('✗ No services configured.');
      process.exit(1);
    }

    const deploymentName = options.name || `deployment-${Date.now()}`;
    const dryRun = options.dryRun === 'true' || options.dryRun === true;

    console.log(`Deploying: ${deploymentName}`);
    if (dryRun) console.log('Mode: DRY RUN (no changes will be made)');
    console.log();

    try {
      const result = await this.deployment.deploy(deploymentName);

      const summary = this.deployment.getDeploymentSummary(result.id);
      console.log(`\nDeployment Summary:`);
      console.log(`  ID: ${summary.id}`);
      console.log(`  Status: ${summary.status}`);
      console.log(`  Duration: ${(summary.duration / 1000).toFixed(2)}s`);
      console.log(`  Services: ${summary.services.length}`);
      console.log(`  Estimated Cost: $${summary.estimatedCost.toFixed(2)}/month`);

      if (summary.steps.length > 0) {
        console.log(`  Steps:`);
        summary.steps.forEach((step, index) => {
          console.log(`    ${index + 1}. ${step.step}: ${step.status}`);
        });
      }
    } catch (error) {
      console.error(`\n✗ Deployment failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Handle rollback command
   */
  async handleRollback({ subcommand }) {
    this._initDeployment();

    if (!subcommand) {
      console.error('✗ Deployment ID required');
      console.error('Usage: azure-deployment rollback <deployment-id>');
      process.exit(1);
    }

    console.log(`Rolling back deployment: ${subcommand}\n`);

    try {
      await this.deployment.rollback(subcommand);
      console.log('✓ Rollback completed successfully');
    } catch (error) {
      console.error(`✗ Rollback failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Handle list command
   */
  handleList({ options }) {
    this._initDeployment();

    if (options.deployments) {
      console.log('Deployments:\n');
      const deployments = Array.from(this.deployment.deployments.values());
      deployments.forEach(d => {
        console.log(`  ${d.id}`);
        console.log(`    Name: ${d.name}`);
        console.log(`    Status: ${d.status}`);
        console.log(`    Created: ${d.createdAt}`);
      });
    }

    if (options.services || !options.deployments && !options.resources) {
      console.log('Services:\n');
      const services = Array.from(this.deployment.services.values());
      services.forEach(s => {
        console.log(`  ${s.name}`);
        console.log(`    Type: ${s.type}`);
        console.log(`    Cost: $${s.dailyCost.toFixed(2)}/day`);
      });
    }

    if (options.resources) {
      console.log('Resources:\n');
      const resources = this.deployment.getResourcesStatus();
      resources.forEach(r => {
        console.log(`  ${r.name}`);
        console.log(`    Type: ${r.type}`);
        console.log(`    Status: ${r.status}`);
      });
    }
  }

  /**
   * Handle help command
   */
  showHelp() {
    console.log(`
Azure Deployment CLI

Usage:
  azure-deployment <command> [options]

Commands:
  configure <type>     Configure a service (app-service, container, cosmos, storage)
  template             Generate ARM template
                       --validate: Validate template
                       --output: Save to file
  cost                 Show cost estimates
                       --limit $X: Check against limit
  health               Run health checks
                       --service: Check specific service
  deploy               Deploy to Azure
                       --name: Deployment name
                       --dryRun: Dry-run mode
  rollback <id>        Rollback a deployment
  list                 List resources
                       --deployments: Show deployments
                       --services: Show services
                       --resources: Show deployed resources
  help                 Show this help message

Environment Variables:
  AZURE_SUBSCRIPTION_ID  Azure subscription ID
  AZURE_RESOURCE_GROUP   Azure resource group
  AZURE_REGION           Azure region
    `);
  }

  /**
   * Prompt user for input
   */
  _prompt(question, defaultValue = '') {
    return new Promise((resolve) => {
      const prompt = defaultValue ? `${question}[${defaultValue}] ` : question;
      this.rl.question(prompt, (answer) => {
        resolve(answer || defaultValue);
      });
    });
  }

  /**
   * Main entry point
   */
  async run(args) {
    if (args.length === 0 || args[0] === COMMANDS.HELP) {
      this.showHelp();
      process.exit(0);
    }

    const { command, subcommand, options } = this.parseArgs(args);

    try {
      switch (command) {
        case COMMANDS.CONFIGURE:
          await this.handleConfigure({ subcommand, options });
          break;
        case COMMANDS.TEMPLATE:
          this.handleTemplate({ options });
          break;
        case COMMANDS.COST:
          this.handleCost({ options });
          break;
        case COMMANDS.HEALTH:
          await this.handleHealth({ options });
          break;
        case COMMANDS.DEPLOY:
          await this.handleDeploy({ options });
          break;
        case COMMANDS.ROLLBACK:
          await this.handleRollback({ subcommand });
          break;
        case COMMANDS.LIST:
          this.handleList({ options });
          break;
        default:
          console.error(`Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } finally {
      this.rl.close();
    }

    process.exit(0);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  const cli = new AzureDeploymentCLI();
  cli.run(process.argv.slice(2));
}

module.exports = AzureDeploymentCLI;

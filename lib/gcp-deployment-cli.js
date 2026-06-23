#!/usr/bin/env node

/**
 * GCP Deployment CLI
 * Command-line interface for GCP deployment management
 */

const fs = require('fs');
const path = require('path');
const GCPDeployment = require('./gcp-deployment');

class GCPDeploymentCLI {
  constructor() {
    this.args = process.argv.slice(2);
    this.command = this.args[0];
    this.commandArgs = this.args.slice(1);
    this.gcp = null;
    this.configFile = process.env.GCP_DEPLOYMENT_CONFIG || '.gcp-deployment-config.json';
  }

  async run() {
    try {
      this.loadConfig();
      this.initializeGCP();

      switch (this.command) {
        case 'deploy-cloud-run':
          await this.deployCloudRun();
          break;
        case 'deploy-compute-engine':
          await this.deployComputeEngine();
          break;
        case 'deploy-cloud-storage':
          await this.deployCloudStorage();
          break;
        case 'deploy-firestore':
          await this.deployFirestore();
          break;
        case 'deploy-vertex-ai':
          await this.deployVertexAI();
          break;
        case 'call-vertex-ai':
          await this.callVertexAI();
          break;
        case 'generate-terraform':
          await this.generateTerraform();
          break;
        case 'apply-terraform':
          await this.applyTerraform();
          break;
        case 'health-check':
          await this.healthCheck();
          break;
        case 'get-logs':
          await this.getLogs();
          break;
        case 'get-metrics':
          await this.getMetrics();
          break;
        case 'save-state':
          await this.saveState();
          break;
        case 'load-state':
          await this.loadState();
          break;
        case 'init':
          await this.initConfig();
          break;
        case 'help':
          this.showHelp();
          break;
        default:
          if (this.command) {
            console.error(`Unknown command: ${this.command}`);
          }
          this.showHelp();
      }
    } catch (error) {
      console.error('CLI Error:', error.message);
      process.exit(1);
    }
  }

  loadConfig() {
    if (fs.existsSync(this.configFile)) {
      const config = JSON.parse(fs.readFileSync(this.configFile, 'utf-8'));
      process.env.GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || config.projectId;
      process.env.GCP_REGION = process.env.GCP_REGION || config.region;
      process.env.GCP_ZONE = process.env.GCP_ZONE || config.zone;
    }
  }

  initializeGCP() {
    this.gcp = new GCPDeployment({
      projectId: process.env.GCP_PROJECT_ID,
      region: process.env.GCP_REGION || 'us-central1',
      zone: process.env.GCP_ZONE || 'us-central1-a',
      dryRun: this.hasFlag('--dry-run'),
      quiet: this.hasFlag('--quiet'),
    });

    this.gcp.on('error', (event) => {
      console.error(`[ERROR] ${event.message}`);
    });
  }

  hasFlag(flag) {
    return this.commandArgs.includes(flag);
  }

  getFlag(flag) {
    const index = this.commandArgs.indexOf(flag);
    return index >= 0 && index + 1 < this.commandArgs.length ? this.commandArgs[index + 1] : null;
  }

  async deployCloudRun() {
    const configFile = this.getFlag('--config');
    if (!configFile) {
      console.error('Usage: gcp-deployment deploy-cloud-run --config <config-file>');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const result = await this.gcp.deployCloudRun(config);
    console.log('Cloud Run Deployment Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async deployComputeEngine() {
    const configFile = this.getFlag('--config');
    if (!configFile) {
      console.error('Usage: gcp-deployment deploy-compute-engine --config <config-file>');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const result = await this.gcp.deployComputeEngine(config);
    console.log('Compute Engine Deployment Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async deployCloudStorage() {
    const configFile = this.getFlag('--config');
    if (!configFile) {
      console.error('Usage: gcp-deployment deploy-cloud-storage --config <config-file>');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const result = await this.gcp.deployCloudStorage(config);
    console.log('Cloud Storage Deployment Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async deployFirestore() {
    const configFile = this.getFlag('--config');
    if (!configFile) {
      console.error('Usage: gcp-deployment deploy-firestore --config <config-file>');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const result = await this.gcp.deployFirestore(config);
    console.log('Firestore Deployment Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async deployVertexAI() {
    const configFile = this.getFlag('--config');
    if (!configFile) {
      console.error('Usage: gcp-deployment deploy-vertex-ai --config <config-file>');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const result = await this.gcp.deployVertexAIModel(config);
    console.log('Vertex AI Deployment Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async callVertexAI() {
    const prompt = this.getFlag('--prompt');
    const model = this.getFlag('--model') || 'text-bison@001';

    if (!prompt) {
      console.error('Usage: gcp-deployment call-vertex-ai --prompt <prompt> [--model <model>]');
      process.exit(1);
    }

    const result = await this.gcp.callVertexAIAPI({
      model,
      prompt,
      maxTokens: parseInt(this.getFlag('--max-tokens')) || 256,
      temperature: parseFloat(this.getFlag('--temperature')) || 0.7,
    });

    console.log('Vertex AI API Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async generateTerraform() {
    const configFile = this.getFlag('--config');
    const outputDir = this.getFlag('--output') || './terraform';

    if (!configFile) {
      console.error('Usage: gcp-deployment generate-terraform --config <config-file> [--output <dir>]');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const filePath = this.gcp.saveTerraformConfig(config, outputDir);
    console.log(`Terraform config saved to: ${filePath}`);
  }

  async applyTerraform() {
    const configDir = this.getFlag('--dir') || './terraform';

    if (!fs.existsSync(configDir)) {
      console.error(`Terraform directory not found: ${configDir}`);
      process.exit(1);
    }

    console.log(`Applying Terraform configuration from: ${configDir}`);
    const result = await this.gcp.applyTerraformConfig(configDir);
    console.log('Terraform Apply Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async healthCheck() {
    const resourceType = this.getFlag('--type');
    const resourceName = this.getFlag('--name');

    if (!resourceType || !resourceName) {
      console.error('Usage: gcp-deployment health-check --type <type> --name <name>');
      console.error('Types: cloud-run, compute-engine, firestore, cloud-storage');
      process.exit(1);
    }

    const result = await this.gcp.healthCheck(resourceType, resourceName);
    console.log('Health Check Result:');
    console.log(JSON.stringify(result, null, 2));
  }

  async getLogs() {
    const serviceName = this.getFlag('--service');
    const lines = parseInt(this.getFlag('--lines')) || 50;

    if (!serviceName) {
      console.error('Usage: gcp-deployment get-logs --service <service-name> [--lines <number>]');
      process.exit(1);
    }

    const logs = await this.gcp.getCloudRunLogs(serviceName, lines);
    console.log(`Fetched ${logs.length} log entries for ${serviceName}:`);
    console.log(JSON.stringify(logs, null, 2));
  }

  async getMetrics() {
    const resourceType = this.getFlag('--type');
    const resourceName = this.getFlag('--name');
    const metricType = this.getFlag('--metric');

    if (!resourceType || !resourceName || !metricType) {
      console.error('Usage: gcp-deployment get-metrics --type <type> --name <name> --metric <metric-type>');
      process.exit(1);
    }

    const metrics = await this.gcp.getMetrics(resourceType, resourceName, metricType);
    console.log('Metrics:');
    console.log(JSON.stringify(metrics, null, 2));
  }

  async saveState() {
    const filePath = this.getFlag('--file') || './gcp-deployment-state.json';
    this.gcp.saveState(filePath);
    console.log(`State saved to: ${filePath}`);
  }

  async loadState() {
    const filePath = this.getFlag('--file') || './gcp-deployment-state.json';
    this.gcp.loadState(filePath);
    const state = this.gcp.getDeploymentState();
    console.log('Loaded deployment state:');
    console.log(JSON.stringify(state, null, 2));
  }

  async initConfig() {
    const projectId = this.getFlag('--project');
    const region = this.getFlag('--region') || 'us-central1';
    const zone = this.getFlag('--zone') || 'us-central1-a';

    if (!projectId) {
      console.error('Usage: gcp-deployment init --project <project-id> [--region <region>] [--zone <zone>]');
      process.exit(1);
    }

    const config = {
      projectId,
      region,
      zone,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    console.log(`Configuration saved to: ${this.configFile}`);
    console.log(JSON.stringify(config, null, 2));
  }

  showHelp() {
    console.log(`
GCP Deployment CLI - Manage Google Cloud Platform resources

Usage: gcp-deployment <command> [options]

Commands:

  Cloud Run:
    deploy-cloud-run --config <file>          Deploy Cloud Run service

  Compute Engine:
    deploy-compute-engine --config <file>     Deploy Compute Engine instance

  Cloud Storage:
    deploy-cloud-storage --config <file>      Create Cloud Storage bucket

  Firestore:
    deploy-firestore --config <file>          Initialize Firestore database

  Vertex AI:
    deploy-vertex-ai --config <file>          Deploy Vertex AI model
    call-vertex-ai --prompt <text>            Call Vertex AI API
                   [--model <model>]
                   [--max-tokens <n>]
                   [--temperature <0-1>]

  Infrastructure as Code:
    generate-terraform --config <file>        Generate Terraform config
                       [--output <dir>]
    apply-terraform [--dir <dir>]             Apply Terraform configuration

  Monitoring:
    health-check --type <type>                Check resource health
                 --name <name>
    get-logs --service <name>                 Fetch Cloud Run logs
             [--lines <n>]
    get-metrics --type <type>                 Get resource metrics
                --name <name>
                --metric <type>

  State Management:
    save-state [--file <path>]                Save deployment state
    load-state [--file <path>]                Load deployment state

  Configuration:
    init --project <id>                       Initialize configuration
         [--region <region>]
         [--zone <zone>]
    help                                      Show this help message

Global Options:
    --dry-run                                 Preview mode (no actual changes)
    --quiet                                   Suppress logging output

Environment Variables:
    GCP_PROJECT_ID                            GCP project ID
    GCP_REGION                                Default region
    GCP_ZONE                                  Default zone
    GCP_DEPLOYMENT_CONFIG                     Config file path

Examples:

  # Initialize configuration
  $ gcp-deployment init --project my-project --region us-central1

  # Deploy Cloud Run service
  $ gcp-deployment deploy-cloud-run --config cloud-run.json

  # Generate and apply Terraform
  $ gcp-deployment generate-terraform --config infra.json --output ./terraform
  $ gcp-deployment apply-terraform --dir ./terraform

  # Check resource health
  $ gcp-deployment health-check --type cloud-run --name my-api

  # Fetch logs
  $ gcp-deployment get-logs --service my-api --lines 100

  # Call Vertex AI
  $ gcp-deployment call-vertex-ai --prompt "Explain microservices" \\
                                  --model text-bison@001 \\
                                  --temperature 0.7

For configuration file examples, see:
  - cloud-run.json
  - compute-engine.json
  - cloud-storage.json
  - firestore.json
  - terraform.json

For more information, visit: https://github.com/claudient/lib
    `);
  }
}

// Run CLI if invoked directly
if (require.main === module) {
  const cli = new GCPDeploymentCLI();
  cli.run().catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = GCPDeploymentCLI;

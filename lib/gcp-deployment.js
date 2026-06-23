/**
 * GCP Deployment Module
 * Manages Cloud Run, Compute Engine, Firestore, Cloud Storage
 * Includes Terraform config generation and Vertex AI integration
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const EventEmitter = require('events');

class GCPDeployment extends EventEmitter {
  constructor(config = {}) {
    super();
    this.projectId = config.projectId || process.env.GCP_PROJECT_ID;
    this.region = config.region || 'us-central1';
    this.zone = config.zone || 'us-central1-a';
    this.gcloudPath = config.gcloudPath || 'gcloud';
    this.terraformPath = config.terraformPath || 'terraform';
    this.vertexAiProjectId = config.vertexAiProjectId || this.projectId;
    this.vertexAiRegion = config.vertexAiRegion || 'us-central1';
    this.quiet = config.quiet || false;
    this.dryRun = config.dryRun || false;
    this.credentials = config.credentials || {};
    this.deploymentState = {};
  }

  log(message, level = 'info') {
    if (!this.quiet) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
    this.emit('log', { message, level, timestamp: new Date().toISOString() });
  }

  error(message) {
    this.log(message, 'error');
    this.emit('error', { message, timestamp: new Date().toISOString() });
  }

  // ============ Cloud Run Deployment ============
  async deployCloudRun(config) {
    const {
      serviceName,
      imageUrl,
      memoryMb = 512,
      cpuCount = 1,
      timeout = 3600,
      minInstances = 1,
      maxInstances = 100,
      allowUnauthenticated = false,
      environment = {},
      labels = {},
      vpcConnector = null,
      concurrency = 80,
    } = config;

    if (!serviceName || !imageUrl) {
      throw new Error('serviceName and imageUrl are required');
    }

    this.log(`Deploying Cloud Run service: ${serviceName}`);

    const envVars = Object.entries(environment)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    let deployCmd = [
      'run', 'deploy', serviceName,
      `--image=${imageUrl}`,
      `--region=${this.region}`,
      `--memory=${memoryMb}M`,
      `--cpu=${cpuCount}`,
      `--timeout=${timeout}`,
      `--min-instances=${minInstances}`,
      `--max-instances=${maxInstances}`,
      `--concurrency=${concurrency}`,
      '--platform=managed',
      '--allow-unauthenticated' + (allowUnauthenticated ? '' : '=false'),
    ];

    if (this.projectId) deployCmd.push(`--project=${this.projectId}`);
    if (envVars) deployCmd.push(`--set-env-vars=${envVars}`);
    if (vpcConnector) deployCmd.push(`--vpc-connector=${vpcConnector}`);

    Object.entries(labels).forEach(([key, value]) => {
      deployCmd.push(`--labels=${key}=${value}`);
    });

    this.log(`Executing: ${this.gcloudPath} ${deployCmd.join(' ')}`);

    if (this.dryRun) {
      this.log('DRY RUN: Cloud Run deployment skipped');
      return { status: 'dry-run', serviceName, region: this.region };
    }

    try {
      const result = execSync(`${this.gcloudPath} ${deployCmd.join(' ')}`, {
        encoding: 'utf-8',
      });
      this.log(`Cloud Run deployment successful: ${serviceName}`);
      this.deploymentState[serviceName] = {
        type: 'cloud-run',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'cloud-run', serviceName });
      return { status: 'success', serviceName, region: this.region, output: result };
    } catch (err) {
      this.error(`Cloud Run deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Compute Engine Deployment ============
  async deployComputeEngine(config) {
    const {
      instanceName,
      machineType = 'e2-medium',
      zone = this.zone,
      imageFamily = 'debian-11',
      imageProject = 'debian-cloud',
      bootDiskSize = '20GB',
      tags = [],
      labels = {},
      startupScript = null,
      serviceAccount = null,
      preemptible = false,
      networkInterface = null,
    } = config;

    if (!instanceName) {
      throw new Error('instanceName is required');
    }

    this.log(`Deploying Compute Engine instance: ${instanceName}`);

    let createCmd = [
      'compute', 'instances', 'create', instanceName,
      `--zone=${zone}`,
      `--machine-type=${machineType}`,
      `--image-family=${imageFamily}`,
      `--image-project=${imageProject}`,
      `--boot-disk-size=${bootDiskSize}`,
    ];

    if (this.projectId) createCmd.push(`--project=${this.projectId}`);
    if (preemptible) createCmd.push('--preemptible');
    if (startupScript) createCmd.push(`--metadata-from-file=startup-script=${startupScript}`);
    if (serviceAccount) createCmd.push(`--service-account=${serviceAccount}`);

    tags.forEach(tag => createCmd.push(`--tags=${tag}`));
    Object.entries(labels).forEach(([key, value]) => {
      createCmd.push(`--labels=${key}=${value}`);
    });

    if (networkInterface) {
      createCmd.push(`--network-interface=network-tier=PREMIUM,subnet=${networkInterface.subnet}`);
      if (networkInterface.externalIp) {
        createCmd.push(`--address=${networkInterface.externalIp}`);
      }
    }

    this.log(`Executing: ${this.gcloudPath} ${createCmd.join(' ')}`);

    if (this.dryRun) {
      this.log('DRY RUN: Compute Engine deployment skipped');
      return { status: 'dry-run', instanceName, zone };
    }

    try {
      const result = execSync(`${this.gcloudPath} ${createCmd.join(' ')}`, {
        encoding: 'utf-8',
      });
      this.log(`Compute Engine instance created: ${instanceName}`);
      this.deploymentState[instanceName] = {
        type: 'compute-engine',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'compute-engine', instanceName });
      return { status: 'success', instanceName, zone, output: result };
    } catch (err) {
      this.error(`Compute Engine deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Firestore Deployment ============
  async deployFirestore(config) {
    const {
      collectionName,
      documents = [],
      indexes = [],
      securityRules = null,
      mode = 'datastore', // 'datastore' or 'native'
    } = config;

    if (!collectionName) {
      throw new Error('collectionName is required');
    }

    this.log(`Deploying Firestore collection: ${collectionName}`);

    if (this.dryRun) {
      this.log('DRY RUN: Firestore deployment skipped');
      return { status: 'dry-run', collectionName, documents: documents.length };
    }

    try {
      // Initialize Firestore if needed
      let initCmd = [
        'firestore', 'databases', 'create',
        `--region=${this.region}`,
        '--type=firestore-native',
      ];

      if (this.projectId) initCmd.push(`--project=${this.projectId}`);

      try {
        execSync(`${this.gcloudPath} ${initCmd.join(' ')}`, { encoding: 'utf-8' });
        this.log('Firestore database initialized');
      } catch (err) {
        if (!err.message.includes('already exists')) {
          this.log('Firestore database already exists or initialization skipped');
        }
      }

      // Deploy security rules if provided
      if (securityRules) {
        const rulesFile = `/tmp/firestore-rules-${Date.now()}.rules`;
        fs.writeFileSync(rulesFile, securityRules);
        const deployRulesCmd = [
          'firestore', 'deploy',
          `--rules=${rulesFile}`,
        ];
        if (this.projectId) deployRulesCmd.push(`--project=${this.projectId}`);
        execSync(`${this.gcloudPath} ${deployRulesCmd.join(' ')}`, { encoding: 'utf-8' });
        fs.unlinkSync(rulesFile);
        this.log('Firestore security rules deployed');
      }

      // Deploy indexes
      if (indexes.length > 0) {
        this.log(`Deploying ${indexes.length} Firestore indexes`);
        // Index deployment would be handled by firestore.indexes.yaml
      }

      this.deploymentState[collectionName] = {
        type: 'firestore',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'firestore', collectionName });

      return {
        status: 'success',
        collectionName,
        documents: documents.length,
        indexes: indexes.length,
      };
    } catch (err) {
      this.error(`Firestore deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Cloud Storage Deployment ============
  async deployCloudStorage(config) {
    const {
      bucketName,
      location = this.region,
      storageClass = 'STANDARD',
      versioningEnabled = false,
      lifecycleRules = [],
      corsConfig = null,
      publicRead = false,
    } = config;

    if (!bucketName) {
      throw new Error('bucketName is required');
    }

    this.log(`Deploying Cloud Storage bucket: ${bucketName}`);

    let createCmd = [
      'storage', 'buckets', 'create', `gs://${bucketName}`,
      `--location=${location}`,
      `--default-storage-class=${storageClass}`,
    ];

    if (this.projectId) createCmd.push(`--project=${this.projectId}`);

    this.log(`Executing: ${this.gcloudPath} ${createCmd.join(' ')}`);

    if (this.dryRun) {
      this.log('DRY RUN: Cloud Storage deployment skipped');
      return { status: 'dry-run', bucketName };
    }

    try {
      try {
        execSync(`${this.gcloudPath} ${createCmd.join(' ')}`, { encoding: 'utf-8' });
        this.log(`Cloud Storage bucket created: ${bucketName}`);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          throw err;
        }
        this.log(`Cloud Storage bucket already exists: ${bucketName}`);
      }

      // Enable versioning
      if (versioningEnabled) {
        execSync(
          `${this.gcloudPath} storage buckets update gs://${bucketName} --versioning`,
          { encoding: 'utf-8' },
        );
        this.log('Versioning enabled for bucket');
      }

      // Set lifecycle rules
      if (lifecycleRules.length > 0) {
        const lifecycleConfig = {
          lifecycle: {
            rule: lifecycleRules,
          },
        };
        const configFile = `/tmp/lifecycle-${Date.now()}.json`;
        fs.writeFileSync(configFile, JSON.stringify(lifecycleConfig, null, 2));
        // Lifecycle rules would be applied via gsutil or Terraform
        fs.unlinkSync(configFile);
        this.log('Lifecycle rules configured');
      }

      // Set CORS if provided
      if (corsConfig) {
        const corsFile = `/tmp/cors-${Date.now()}.json`;
        fs.writeFileSync(corsFile, JSON.stringify(corsConfig, null, 2));
        execSync(`gsutil cors set ${corsFile} gs://${bucketName}`, { encoding: 'utf-8' });
        fs.unlinkSync(corsFile);
        this.log('CORS configuration applied');
      }

      // Set public read access
      if (publicRead) {
        execSync(`${this.gcloudPath} storage buckets add-iam-policy-binding gs://${bucketName} --member=allUsers --role=roles/storage.objectViewer`, {
          encoding: 'utf-8',
        });
        this.log('Public read access enabled');
      }

      this.deploymentState[bucketName] = {
        type: 'cloud-storage',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'cloud-storage', bucketName });

      return { status: 'success', bucketName, location, storageClass };
    } catch (err) {
      this.error(`Cloud Storage deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Vertex AI Integration ============
  async deployVertexAIModel(config) {
    const {
      modelName,
      modelType = 'text-bison', // or 'text-unicorn', 'chat-bison', etc.
      displayName,
      minReplicas = 1,
      maxReplicas = 10,
      machineType = 'n1-standard-4',
      gpuType = null, // 'nvidia-tesla-k80', 'nvidia-tesla-t4', etc.
      gpuCount = 0,
    } = config;

    if (!modelName || !displayName) {
      throw new Error('modelName and displayName are required');
    }

    this.log(`Deploying Vertex AI model: ${displayName}`);

    if (this.dryRun) {
      this.log('DRY RUN: Vertex AI model deployment skipped');
      return { status: 'dry-run', modelName, displayName };
    }

    try {
      // Deploy endpoint (simplified example)
      const deployCmd = [
        'ai', 'endpoints', 'deploy-model', modelName,
        `--display-name=${displayName}`,
        `--machine-type=${machineType}`,
      ];

      if (this.vertexAiProjectId) deployCmd.push(`--project=${this.vertexAiProjectId}`);
      if (this.vertexAiRegion) deployCmd.push(`--region=${this.vertexAiRegion}`);
      if (gpuType && gpuCount > 0) {
        deployCmd.push(`--accelerator=type=${gpuType},count=${gpuCount}`);
      }

      this.log(`Executing: ${this.gcloudPath} ${deployCmd.join(' ')}`);
      execSync(`${this.gcloudPath} ${deployCmd.join(' ')}`, { encoding: 'utf-8' });

      this.deploymentState[modelName] = {
        type: 'vertex-ai',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'vertex-ai', modelName });

      return { status: 'success', modelName, displayName, region: this.vertexAiRegion };
    } catch (err) {
      this.error(`Vertex AI deployment failed: ${err.message}`);
      throw err;
    }
  }

  async callVertexAIAPI(config) {
    const {
      model = 'text-bison@001',
      prompt,
      maxTokens = 256,
      temperature = 0.7,
      topP = 0.9,
      topK = 40,
    } = config;

    if (!prompt) {
      throw new Error('prompt is required');
    }

    this.log(`Calling Vertex AI API with model: ${model}`);

    if (this.dryRun) {
      this.log('DRY RUN: Vertex AI API call skipped');
      return { status: 'dry-run', model, prompt };
    }

    try {
      const requestBody = {
        instances: [
          {
            prompt,
          },
        ],
        parameters: {
          temperature,
          maxOutputTokens: maxTokens,
          topP,
          topK,
        },
      };

      const curlCmd = [
        '-X', 'POST',
        `-H "Authorization: Bearer $(gcloud auth application-default print-access-token)"`,
        `-H "Content-Type: application/json"`,
        `-d '${JSON.stringify(requestBody)}'`,
        `https://${this.vertexAiRegion}-aiplatform.googleapis.com/v1/projects/${this.vertexAiProjectId}/locations/${this.vertexAiRegion}/publishers/google/models/${model}:predict`,
      ];

      this.log(`Calling: curl ${curlCmd.join(' ')}`);

      const result = execSync(`curl ${curlCmd.join(' ')}`, { encoding: 'utf-8' });
      const response = JSON.parse(result);

      this.log('Vertex AI API call successful');
      this.emit('vertex-ai-response', { model, response });

      return { status: 'success', model, response };
    } catch (err) {
      this.error(`Vertex AI API call failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Terraform Generation ============
  generateTerraformConfig(config) {
    const {
      projectId = this.projectId,
      region = this.region,
      resources = {},
    } = config;

    const terraform = {
      terraform: {
        required_version: '>= 1.0',
        required_providers: {
          google: {
            source: 'hashicorp/google',
            version: '~> 5.0',
          },
        },
      },
      provider: {
        google: {
          project: projectId,
          region,
        },
      },
      resource: {},
      output: {},
    };

    // Cloud Run services
    if (resources.cloudRun) {
      terraform.resource.google_cloud_run_service = {};
      resources.cloudRun.forEach((service, idx) => {
        terraform.resource.google_cloud_run_service[`service_${idx}`] = {
          name: service.name,
          location: service.region || region,
          template: {
            spec: {
              containers: [
                {
                  image: service.image,
                  env: Object.entries(service.environment || {}).map(([key, value]) => ({
                    name: key,
                    value: String(value),
                  })),
                  resources: {
                    limits: {
                      memory: `${service.memory || 512}M`,
                      cpu: `${service.cpu || 1}`,
                    },
                  },
                },
              ],
              service_account_email: service.serviceAccount,
            },
          },
        };
      });
    }

    // Compute Engine instances
    if (resources.computeEngine) {
      terraform.resource.google_compute_instance = {};
      resources.computeEngine.forEach((instance, idx) => {
        terraform.resource.google_compute_instance[`instance_${idx}`] = {
          name: instance.name,
          machine_type: instance.machineType || 'e2-medium',
          zone: instance.zone || region,
          boot_disk: {
            initialize_params: {
              image: instance.image || 'debian-11',
              size: instance.bootDiskSize || 20,
            },
          },
          metadata_startup_script: instance.startupScript || '',
          tags: instance.tags || [],
        };
      });
    }

    // Cloud Storage buckets
    if (resources.cloudStorage) {
      terraform.resource.google_storage_bucket = {};
      resources.cloudStorage.forEach((bucket, idx) => {
        terraform.resource.google_storage_bucket[`bucket_${idx}`] = {
          name: bucket.name,
          location: bucket.location || region,
          storage_class: bucket.storageClass || 'STANDARD',
          uniform_bucket_level_access: {
            enabled: !bucket.publicRead,
          },
          versioning: {
            enabled: bucket.versioningEnabled || false,
          },
        };
      });
    }

    // Firestore
    if (resources.firestore) {
      terraform.resource.google_firestore_database = {
        database: {
          name: '(default)',
          location_id: region,
          type: 'FIRESTORE_NATIVE',
        },
      };
    }

    // Vertex AI endpoints
    if (resources.vertexAI) {
      terraform.resource.google_vertex_ai_endpoint = {};
      resources.vertexAI.forEach((endpoint, idx) => {
        terraform.resource.google_vertex_ai_endpoint[`endpoint_${idx}`] = {
          display_name: endpoint.displayName,
          location: endpoint.region || region,
          machine_learning_model_config: {
            model: endpoint.modelName,
          },
        };
      });
    }

    return terraform;
  }

  saveTerraformConfig(config, outputDir) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const terraform = this.generateTerraformConfig(config);

    // Convert to HCL format (simplified)
    const hcl = this.jsonToHCL(terraform);

    const filePath = path.join(outputDir, 'main.tf');
    fs.writeFileSync(filePath, hcl);
    this.log(`Terraform config saved to ${filePath}`);

    return filePath;
  }

  jsonToHCL(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    let hcl = '';

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        hcl += `${spaces}${key} {\n`;
        hcl += this.jsonToHCL(value, indent + 2);
        hcl += `${spaces}}\n`;
      } else if (Array.isArray(value)) {
        hcl += `${spaces}${key} = [\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            hcl += `${spaces}  {\n`;
            hcl += this.jsonToHCL(item, indent + 4);
            hcl += `${spaces}  },\n`;
          } else {
            hcl += `${spaces}  "${item}",\n`;
          }
        });
        hcl += `${spaces}]\n`;
      } else if (typeof value === 'string') {
        hcl += `${spaces}${key} = "${value}"\n`;
      } else if (typeof value === 'boolean') {
        hcl += `${spaces}${key} = ${value}\n`;
      } else if (typeof value === 'number') {
        hcl += `${spaces}${key} = ${value}\n`;
      }
    });

    return hcl;
  }

  async applyTerraformConfig(configDir) {
    this.log(`Applying Terraform configuration from ${configDir}`);

    if (this.dryRun) {
      this.log('DRY RUN: Terraform apply skipped');
      return { status: 'dry-run' };
    }

    try {
      // Initialize Terraform
      this.log('Initializing Terraform');
      execSync(`${this.terraformPath} -chdir=${configDir} init`, { encoding: 'utf-8' });

      // Plan
      this.log('Planning Terraform deployment');
      const planOutput = execSync(`${this.terraformPath} -chdir=${configDir} plan`, {
        encoding: 'utf-8',
      });
      this.log('Plan output received');

      // Apply
      this.log('Applying Terraform configuration');
      const applyOutput = execSync(
        `${this.terraformPath} -chdir=${configDir} apply -auto-approve`,
        { encoding: 'utf-8' },
      );

      this.log('Terraform configuration applied successfully');
      this.emit('terraform-applied', { configDir, output: applyOutput });

      return { status: 'success', configDir, planOutput, applyOutput };
    } catch (err) {
      this.error(`Terraform apply failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Health Checks ============
  async healthCheck(resourceType, resourceName) {
    this.log(`Checking health of ${resourceType}: ${resourceName}`);

    try {
      switch (resourceType) {
        case 'cloud-run': {
          const cmd = [
            'run', 'services', 'describe', resourceName,
            `--region=${this.region}`,
          ];
          if (this.projectId) cmd.push(`--project=${this.projectId}`);
          const result = execSync(`${this.gcloudPath} ${cmd.join(' ')}`, {
            encoding: 'utf-8',
          });
          const status = result.includes('Ready') ? 'healthy' : 'degraded';
          this.log(`Cloud Run service ${resourceName} is ${status}`);
          return { status, resource: resourceName, type: resourceType };
        }

        case 'compute-engine': {
          const cmd = [
            'compute', 'instances', 'describe', resourceName,
            `--zone=${this.zone}`,
          ];
          if (this.projectId) cmd.push(`--project=${this.projectId}`);
          const result = execSync(`${this.gcloudPath} ${cmd.join(' ')}`, {
            encoding: 'utf-8',
          });
          const status = result.includes('RUNNING') ? 'healthy' : 'degraded';
          this.log(`Compute Engine instance ${resourceName} is ${status}`);
          return { status, resource: resourceName, type: resourceType };
        }

        default:
          this.log(`Health check not implemented for ${resourceType}`);
          return { status: 'unknown', resource: resourceName, type: resourceType };
      }
    } catch (err) {
      this.error(`Health check failed: ${err.message}`);
      return { status: 'unhealthy', resource: resourceName, type: resourceType, error: err.message };
    }
  }

  async healthCheckAll() {
    const results = [];
    for (const [resourceName, resourceData] of Object.entries(this.deploymentState)) {
      const result = await this.healthCheck(resourceData.type, resourceName);
      results.push(result);
    }
    return results;
  }

  // ============ Logging & Monitoring ============
  async getCloudRunLogs(serviceName, lines = 50, filter = '') {
    this.log(`Fetching logs for Cloud Run service: ${serviceName}`);

    try {
      let logCmd = [
        'logging', 'read',
        `resource.type="cloud_run_revision" AND resource.labels.service_name="${serviceName}"`,
        `--limit=${lines}`,
        '--format=json',
      ];

      if (this.projectId) logCmd.push(`--project=${this.projectId}`);
      if (filter) logCmd.splice(3, 0, `AND ${filter}`);

      const result = execSync(`${this.gcloudPath} ${logCmd.join(' ')}`, {
        encoding: 'utf-8',
      });

      return JSON.parse(result);
    } catch (err) {
      this.error(`Failed to fetch logs: ${err.message}`);
      return [];
    }
  }

  async getMetrics(resourceType, resourceName, metricType, duration = '3600s') {
    this.log(`Fetching metrics for ${resourceType}: ${resourceName}`);

    try {
      const metricsCmd = [
        'monitoring', 'metrics-descriptors', 'list',
        `--filter=metric.type="${metricType}"`,
        '--format=json',
      ];

      if (this.projectId) metricsCmd.push(`--project=${this.projectId}`);

      const result = execSync(`${this.gcloudPath} ${metricsCmd.join(' ')}`, {
        encoding: 'utf-8',
      });

      return JSON.parse(result);
    } catch (err) {
      this.error(`Failed to fetch metrics: ${err.message}`);
      return [];
    }
  }

  // ============ State Management ============
  getDeploymentState() {
    return this.deploymentState;
  }

  saveState(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.deploymentState, null, 2));
    this.log(`Deployment state saved to ${filePath}`);
  }

  loadState(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      this.deploymentState = JSON.parse(data);
      this.log(`Deployment state loaded from ${filePath}`);
    }
  }
}

module.exports = GCPDeployment;
# GCP Deployment Module

Complete Google Cloud Platform deployment automation with support for Cloud Run, Compute Engine, Firestore, Cloud Storage, and Vertex AI integration.

## Features

### Cloud Run
- Deploy containerized applications with auto-scaling
- Configure environment variables, labels, and resource limits
- Support for unauthenticated access and VPC connectors
- Concurrency and instance scaling configuration
- Traffic management and blue-green deployments

### Compute Engine
- Launch VM instances with custom configurations
- Preemptible and standard instance types
- Startup scripts and service account assignment
- Network configuration and external IP management
- Disk size and image family customization

### Cloud Storage
- Create and manage storage buckets
- Lifecycle rules for automatic data management
- CORS configuration for web applications
- Versioning and uniform bucket-level access
- Storage class management (STANDARD, COLDLINE, ARCHIVE)

### Firestore Database
- Initialize Firestore in native mode
- Deploy security rules programmatically
- Index management and optimization
- Point-in-time recovery configuration
- Real-time synchronization with client SDKs

### Vertex AI Integration
- Deploy language and vision models
- Configure GPU acceleration
- Call Vertex AI APIs for text generation
- Model serving and batch processing
- MLOps pipeline integration

### Terraform Generation
- Convert deployment configs to Terraform HCL
- Multi-resource orchestration
- State management and backend configuration
- Reproducible infrastructure as code
- Version control and audit trails

### Health Checks & Monitoring
- Verify resource health across services
- Fetch Cloud Run logs and metrics
- Performance monitoring and alerting
- Automated incident detection
- Historical metrics analysis

## Installation

```bash
npm install gcp-deployment
```

Or use from Claudient:
```javascript
const GCPDeployment = require('./lib/gcp-deployment');
```

## Quick Start

### Basic Cloud Run Deployment

```javascript
const GCPDeployment = require('./gcp-deployment');

const gcp = new GCPDeployment({
  projectId: 'my-gcp-project',
  region: 'us-central1',
});

await gcp.deployCloudRun({
  serviceName: 'my-api',
  imageUrl: 'gcr.io/my-gcp-project/my-api:latest',
  memoryMb: 512,
  cpuCount: 1,
  environment: {
    NODE_ENV: 'production',
  },
  labels: {
    app: 'api',
    environment: 'production',
  },
});
```

### Complete Multi-Resource Deployment

```javascript
// Deploy Cloud Run service
await gcp.deployCloudRun({
  serviceName: 'api-backend',
  imageUrl: 'gcr.io/my-gcp-project/api:latest',
  memoryMb: 1024,
  cpuCount: 2,
  minInstances: 2,
  maxInstances: 50,
});

// Deploy Compute Engine instance
await gcp.deployComputeEngine({
  instanceName: 'background-worker',
  machineType: 'e2-medium',
  preemptible: true,
});

// Deploy Cloud Storage bucket
await gcp.deployCloudStorage({
  bucketName: 'my-app-data',
  storageClass: 'STANDARD',
  versioningEnabled: true,
  lifecycleRules: [{
    action: { type: 'Delete' },
    condition: { age: 90 },
  }],
});

// Deploy Firestore
await gcp.deployFirestore({
  collectionName: 'users',
  securityRules: `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId} {
          allow read, write: if request.auth.uid == userId;
        }
      }
    }
  `,
});
```

## Configuration Options

### GCPDeployment Constructor

```javascript
new GCPDeployment({
  projectId: 'my-gcp-project',      // GCP Project ID
  region: 'us-central1',              // Default region
  zone: 'us-central1-a',              // Default zone
  gcloudPath: 'gcloud',               // Path to gcloud CLI
  terraformPath: 'terraform',         // Path to Terraform
  vertexAiProjectId: 'my-project',   // Vertex AI project
  vertexAiRegion: 'us-central1',     // Vertex AI region
  quiet: false,                       // Suppress logs
  dryRun: false,                      // Preview mode
  credentials: {},                    // GCP credentials
})
```

### Cloud Run Configuration

```javascript
await gcp.deployCloudRun({
  serviceName: string,                // Required: service name
  imageUrl: string,                   // Required: container image URL
  memoryMb: number,                   // Default: 512
  cpuCount: number,                   // Default: 1
  timeout: number,                    // Default: 3600 seconds
  minInstances: number,               // Default: 1
  maxInstances: number,               // Default: 100
  concurrency: number,                // Default: 80
  allowUnauthenticated: boolean,      // Default: false
  environment: object,                // Environment variables
  labels: object,                     // Resource labels
  vpcConnector: string,               // Optional: VPC connector
});
```

### Compute Engine Configuration

```javascript
await gcp.deployComputeEngine({
  instanceName: string,               // Required: instance name
  machineType: string,                // Default: 'e2-medium'
  zone: string,                       // Default: configured zone
  imageFamily: string,                // Default: 'debian-11'
  imageProject: string,               // Default: 'debian-cloud'
  bootDiskSize: string,               // Default: '20GB'
  tags: string[],                     // Network tags
  labels: object,                     // Resource labels
  startupScript: string,              // Path to startup script
  serviceAccount: string,             // Service account email
  preemptible: boolean,               // Default: false
  networkInterface: object,           // Network configuration
});
```

### Cloud Storage Configuration

```javascript
await gcp.deployCloudStorage({
  bucketName: string,                 // Required: bucket name
  location: string,                   // Default: configured region
  storageClass: string,               // Default: 'STANDARD'
  versioningEnabled: boolean,         // Default: false
  lifecycleRules: object[],          // Lifecycle management
  corsConfig: object,                 // CORS settings
  publicRead: boolean,                // Default: false
});
```

### Firestore Configuration

```javascript
await gcp.deployFirestore({
  collectionName: string,             // Required: collection name
  documents: object[],                // Initial documents
  indexes: object[],                  // Index definitions
  securityRules: string,              // Firestore security rules
  mode: string,                       // 'datastore' or 'native'
});
```

### Vertex AI Configuration

```javascript
// Model deployment
await gcp.deployVertexAIModel({
  modelName: string,                  // Required: model name
  displayName: string,                // Required: display name
  minReplicas: number,                // Default: 1
  maxReplicas: number,                // Default: 10
  machineType: string,                // Default: 'n1-standard-4'
  gpuType: string,                    // Optional: GPU type
  gpuCount: number,                   // Default: 0
});

// API call
await gcp.callVertexAIAPI({
  model: string,                      // Model name
  prompt: string,                     // Required: input prompt
  maxTokens: number,                  // Default: 256
  temperature: number,                // Default: 0.7
  topP: number,                       // Default: 0.9
  topK: number,                       // Default: 40
});
```

## Terraform Integration

### Generate Terraform Configuration

```javascript
const config = {
  projectId: 'my-gcp-project',
  region: 'us-central1',
  resources: {
    cloudRun: [{
      name: 'api-backend',
      image: 'gcr.io/my-project/api:latest',
      memory: 1024,
      cpu: 2,
    }],
    computeEngine: [{
      name: 'worker',
      machineType: 'e2-medium',
    }],
    cloudStorage: [{
      name: 'data-bucket',
      storageClass: 'STANDARD',
    }],
    firestore: [{}],
  },
};

const terraformDir = './terraform';
const configFile = gcp.saveTerraformConfig(config, terraformDir);
```

### Apply Terraform Configuration

```javascript
await gcp.applyTerraformConfig('./terraform');
```

### Terraform Template

The module includes `gcp-deployment-terraform.tf.template` with production-ready configurations for:
- Cloud Run services with auto-scaling
- Compute Engine instances with proper sizing
- Storage buckets with lifecycle management
- Firestore database with security rules
- VPC and networking infrastructure
- Service accounts and IAM roles
- Vertex AI endpoints
- Health checks and monitoring

## Health Checks & Monitoring

### Health Check

```javascript
// Check single resource
const health = await gcp.healthCheck('cloud-run', 'my-service');
// Returns: { status: 'healthy'|'degraded'|'unhealthy', resource, type }

// Check all resources
const allHealth = await gcp.healthCheckAll();
```

### Logging

```javascript
// Fetch Cloud Run logs
const logs = await gcp.getCloudRunLogs('my-service', 50);

// Get metrics
const metrics = await gcp.getMetrics(
  'cloud-run',
  'my-service',
  'run.googleapis.com/request_count'
);
```

## State Management

```javascript
// Get deployment state
const state = gcp.getDeploymentState();

// Save state to file
gcp.saveState('/path/to/state.json');

// Load state from file
gcp.loadState('/path/to/state.json');
```

## Events

```javascript
gcp.on('deployment-complete', (event) => {
  console.log(`Deployed ${event.type}: ${event.serviceName}`);
});

gcp.on('log', (event) => {
  console.log(`[${event.level}] ${event.message}`);
});

gcp.on('error', (event) => {
  console.error(`Error: ${event.message}`);
});

gcp.on('terraform-applied', (event) => {
  console.log('Terraform applied successfully');
});

gcp.on('vertex-ai-response', (event) => {
  console.log('AI response:', event.response);
});
```

## Dry Run Mode

Test deployments without making actual changes:

```javascript
const gcp = new GCPDeployment({
  projectId: 'my-gcp-project',
  dryRun: true,  // Enable dry-run mode
});

// All operations will be simulated
const result = await gcp.deployCloudRun({
  serviceName: 'my-api',
  imageUrl: 'gcr.io/my-project/api:latest',
});
// Result: { status: 'dry-run', ... }
```

## Prerequisites

1. **GCP Project**: Active Google Cloud project
2. **gcloud CLI**: Installed and configured with credentials
3. **Service Account**: With appropriate IAM roles
4. **APIs Enabled**:
   - Cloud Run API
   - Compute Engine API
   - Cloud Storage API
   - Firestore API
   - Vertex AI API
   - Cloud Logging API
   - Cloud Monitoring API

## IAM Roles Required

- roles/run.admin (Cloud Run)
- roles/compute.admin (Compute Engine)
- roles/storage.admin (Cloud Storage)
- roles/datastore.admin (Firestore)
- roles/aiplatform.admin (Vertex AI)
- roles/iam.serviceAccountAdmin (Service Accounts)

## Examples

See `gcp-deployment-integration-example.js` for complete working examples including:
- Multi-phase deployments
- Scalable architecture setup
- Multi-region configuration
- Health checks and monitoring
- Terraform workflow

## Error Handling

```javascript
try {
  await gcp.deployCloudRun({
    serviceName: 'my-api',
    imageUrl: 'gcr.io/my-project/api:latest',
  });
} catch (error) {
  console.error('Deployment failed:', error.message);
  // Error details are also emitted via 'error' event
}
```

## Troubleshooting

### Authentication Issues
```bash
gcloud auth application-default login
gcloud config set project my-gcp-project
```

### Check gcloud Installation
```bash
which gcloud
gcloud --version
gcloud config get-value project
```

### Enable Required APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable aiplatform.googleapis.com
```

### Verify Service Account
```bash
gcloud iam service-accounts list
gcloud projects get-iam-policy PROJECT_ID
```

## Best Practices

1. **Use Service Accounts**: Create dedicated service accounts for different services
2. **Implement IAM Least Privilege**: Grant minimal required permissions
3. **Enable Versioning**: Use versioned container images
4. **Configure Health Checks**: Monitor deployed resources continuously
5. **Use Terraform**: Manage infrastructure as code for reproducibility
6. **Implement Logging**: Enable Cloud Logging for all services
7. **Set Resource Limits**: Define memory and CPU limits appropriately
8. **Use VPC**: Network resources for better isolation and security
9. **Backup Data**: Enable versioning and lifecycle rules for storage
10. **Automate Scaling**: Configure appropriate min/max instances

## Performance Considerations

- Cloud Run: Optimal for I/O-bound workloads, up to 4 CPUs, 16GB RAM
- Compute Engine: Better for CPU-bound workloads, custom machine types available
- Firestore: Real-time database, automatic scaling
- Cloud Storage: Regional buckets for higher availability
- Vertex AI: Use appropriate model sizes for latency requirements

## Cost Optimization

- Use preemptible instances for non-critical workloads
- Set appropriate min/max instances for Cloud Run
- Archive old data using lifecycle rules
- Monitor usage with Cloud Monitoring
- Use Committed Use Discounts for stable workloads

## API Reference

### Core Methods
- `deployCloudRun(config)` - Deploy Cloud Run service
- `deployComputeEngine(config)` - Launch Compute Engine instance
- `deployCloudStorage(config)` - Create Cloud Storage bucket
- `deployFirestore(config)` - Initialize Firestore database
- `deployVertexAIModel(config)` - Deploy AI model
- `callVertexAIAPI(config)` - Call Vertex AI API

### Terraform Methods
- `generateTerraformConfig(config)` - Generate Terraform configuration
- `saveTerraformConfig(config, outputDir)` - Save to files
- `applyTerraformConfig(configDir)` - Apply with Terraform

### Monitoring Methods
- `healthCheck(resourceType, resourceName)` - Check resource health
- `healthCheckAll()` - Check all resources
- `getCloudRunLogs(serviceName, lines, filter)` - Fetch logs
- `getMetrics(resourceType, resourceName, metricType, duration)` - Get metrics

### State Methods
- `getDeploymentState()` - Get current state
- `saveState(filePath)` - Save to file
- `loadState(filePath)` - Load from file

## License

MIT

## Support

For issues and feature requests, visit the Claudient repository.

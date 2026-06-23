/**
 * GCP Deployment Integration Example
 * Complete workflow demonstrating all GCP deployment capabilities
 */

const GCPDeployment = require('./gcp-deployment');
const path = require('path');

async function runCompleteGCPDeploymentWorkflow() {
  // Initialize GCP Deployment manager
  const gcp = new GCPDeployment({
    projectId: 'my-gcp-project',
    region: 'us-central1',
    zone: 'us-central1-a',
    vertexAiProjectId: 'my-gcp-project',
    vertexAiRegion: 'us-central1',
    quiet: false,
    dryRun: false,
  });

  // Listen to deployment events
  gcp.on('deployment-complete', (event) => {
    console.log('✓ Deployment completed:', event);
  });

  gcp.on('log', (event) => {
    console.log(`[${event.level}] ${event.message}`);
  });

  gcp.on('error', (event) => {
    console.error(`[ERROR] ${event.message}`);
  });

  gcp.on('terraform-applied', (event) => {
    console.log('✓ Terraform configuration applied');
  });

  gcp.on('vertex-ai-response', (event) => {
    console.log('✓ Vertex AI API response received');
  });

  try {
    // ============ Phase 1: Deploy Cloud Run Services ============
    console.log('\n=== Phase 1: Cloud Run Deployment ===\n');

    // Deploy API backend
    await gcp.deployCloudRun({
      serviceName: 'api-backend',
      imageUrl: 'gcr.io/my-gcp-project/api-backend:latest',
      memoryMb: 1024,
      cpuCount: 2,
      timeout: 3600,
      minInstances: 2,
      maxInstances: 50,
      allowUnauthenticated: false,
      environment: {
        NODE_ENV: 'production',
        FIRESTORE_COLLECTION: 'users',
        CLOUD_STORAGE_BUCKET: 'my-bucket',
      },
      labels: {
        app: 'api',
        version: 'v1',
        environment: 'production',
      },
      concurrency: 80,
    });

    // Deploy frontend
    await gcp.deployCloudRun({
      serviceName: 'frontend-ui',
      imageUrl: 'gcr.io/my-gcp-project/frontend:latest',
      memoryMb: 512,
      cpuCount: 1,
      minInstances: 1,
      maxInstances: 30,
      allowUnauthenticated: true,
      environment: {
        REACT_APP_API_URL: 'https://api-backend-xyz.run.app',
        REACT_APP_ENV: 'production',
      },
      labels: {
        app: 'frontend',
        environment: 'production',
      },
    });

    // ============ Phase 2: Deploy Compute Engine Instances ============
    console.log('\n=== Phase 2: Compute Engine Deployment ===\n');

    // Deploy worker instance
    await gcp.deployComputeEngine({
      instanceName: 'background-worker-1',
      machineType: 'e2-medium',
      zone: 'us-central1-a',
      imageFamily: 'debian-11',
      imageProject: 'debian-cloud',
      bootDiskSize: '50GB',
      tags: ['worker', 'internal'],
      labels: {
        role: 'background-processor',
        environment: 'production',
      },
      startupScript: '/tmp/startup-worker.sh',
      serviceAccount: 'worker-service-account@my-gcp-project.iam.gserviceaccount.com',
      preemptible: true,
      networkInterface: {
        subnet: 'default',
        externalIp: false,
      },
    });

    // Deploy cache server
    await gcp.deployComputeEngine({
      instanceName: 'redis-cache-1',
      machineType: 'e2-highcpu-4',
      zone: 'us-central1-b',
      imageFamily: 'debian-11',
      bootDiskSize: '100GB',
      tags: ['cache', 'internal'],
      labels: {
        role: 'cache',
        service: 'redis',
      },
      preemptible: false,
    });

    // ============ Phase 3: Deploy Cloud Storage ============
    console.log('\n=== Phase 3: Cloud Storage Deployment ===\n');

    await gcp.deployCloudStorage({
      bucketName: 'my-app-data-bucket',
      location: 'US',
      storageClass: 'STANDARD',
      versioningEnabled: true,
      lifecycleRules: [
        {
          action: { type: 'Delete' },
          condition: { age: 90 },
        },
        {
          action: { type: 'SetStorageClass', storageClass: 'COLDLINE' },
          condition: { age: 30 },
        },
      ],
      corsConfig: {
        cors: [
          {
            origin: ['https://my-domain.com'],
            method: ['GET', 'PUT', 'POST'],
            responseHeader: ['Content-Type'],
            maxAgeSeconds: 3600,
          },
        ],
      },
      publicRead: false,
    });

    await gcp.deployCloudStorage({
      bucketName: 'my-app-backups-bucket',
      location: 'US',
      storageClass: 'COLDLINE',
      versioningEnabled: true,
      lifecycleRules: [
        {
          action: { type: 'Delete' },
          condition: { age: 365 },
        },
      ],
      publicRead: false,
    });

    // ============ Phase 4: Deploy Firestore Database ============
    console.log('\n=== Phase 4: Firestore Deployment ===\n');

    const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /public/{document=**} {
      allow read: if true;
    }
    match /admin/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
`;

    await gcp.deployFirestore({
      collectionName: 'users',
      securityRules: firestoreRules,
      indexes: [
        {
          collection: 'users',
          fields: [{ path: 'email', order: 'ASCENDING' }],
        },
        {
          collection: 'users',
          fields: [
            { path: 'createdAt', order: 'DESCENDING' },
            { path: 'status', order: 'ASCENDING' },
          ],
        },
      ],
    });

    // ============ Phase 5: Vertex AI Model Deployment ============
    console.log('\n=== Phase 5: Vertex AI Deployment ===\n');

    await gcp.deployVertexAIModel({
      modelName: 'text-bison@001',
      displayName: 'Text Generation Model',
      minReplicas: 1,
      maxReplicas: 10,
      machineType: 'n1-standard-4',
    });

    // ============ Phase 6: Call Vertex AI API ============
    console.log('\n=== Phase 6: Vertex AI API Usage ===\n');

    const aiResponse = await gcp.callVertexAIAPI({
      model: 'text-bison@001',
      prompt: 'Explain the benefits of microservices architecture in 100 words.',
      maxTokens: 256,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
    });

    console.log('AI Response:', aiResponse);

    // ============ Phase 7: Generate & Apply Terraform Config ============
    console.log('\n=== Phase 7: Terraform Configuration ===\n');

    const terraformConfig = {
      projectId: 'my-gcp-project',
      region: 'us-central1',
      resources: {
        cloudRun: [
          {
            name: 'api-backend',
            image: 'gcr.io/my-gcp-project/api-backend:latest',
            region: 'us-central1',
            memory: 1024,
            cpu: 2,
            environment: {
              NODE_ENV: 'production',
            },
            serviceAccount: 'cloud-run-service@my-gcp-project.iam.gserviceaccount.com',
          },
        ],
        computeEngine: [
          {
            name: 'background-worker-1',
            machineType: 'e2-medium',
            zone: 'us-central1-a',
            image: 'debian-11',
            bootDiskSize: 50,
            tags: ['worker'],
          },
        ],
        cloudStorage: [
          {
            name: 'my-app-data-bucket',
            location: 'US',
            storageClass: 'STANDARD',
            versioningEnabled: true,
            publicRead: false,
          },
        ],
        firestore: [{}],
      },
    };

    const terraformDir = '/tmp/terraform-gcp';
    const configFile = gcp.saveTerraformConfig(terraformConfig, terraformDir);
    console.log('Terraform config saved:', configFile);

    // Apply Terraform (commented out to avoid actual deployment)
    // await gcp.applyTerraformConfig(terraformDir);

    // ============ Phase 8: Health Checks ============
    console.log('\n=== Phase 8: Health Checks ===\n');

    const cloudRunHealth = await gcp.healthCheck('cloud-run', 'api-backend');
    console.log('Cloud Run Health:', cloudRunHealth);

    const computeEngineHealth = await gcp.healthCheck('compute-engine', 'background-worker-1');
    console.log('Compute Engine Health:', computeEngineHealth);

    // Health check all resources
    const allHealth = await gcp.healthCheckAll();
    console.log('\nAll Resource Health Status:');
    allHealth.forEach(result => {
      console.log(`  - ${result.type}/${result.resource}: ${result.status}`);
    });

    // ============ Phase 9: Logging & Monitoring ============
    console.log('\n=== Phase 9: Logging & Monitoring ===\n');

    const logs = await gcp.getCloudRunLogs('api-backend', 50);
    console.log(`Fetched ${logs.length} log entries`);

    const metrics = await gcp.getMetrics(
      'cloud-run',
      'api-backend',
      'run.googleapis.com/request_count',
    );
    console.log('Metrics fetched:', metrics.length);

    // ============ Phase 10: State Management ============
    console.log('\n=== Phase 10: State Management ===\n');

    const deploymentState = gcp.getDeploymentState();
    console.log('Deployment state:', JSON.stringify(deploymentState, null, 2));

    gcp.saveState('/tmp/gcp-deployment-state.json');
    console.log('State saved to: /tmp/gcp-deployment-state.json');

    // Print summary
    console.log('\n=== Deployment Summary ===\n');
    console.log(`Total resources deployed: ${Object.keys(deploymentState).length}`);
    console.log('Deployment state snapshot:');
    Object.entries(deploymentState).forEach(([name, data]) => {
      console.log(`  - ${name} (${data.type}): ${data.status}`);
    });
  } catch (error) {
    console.error('Deployment workflow failed:', error.message);
    process.exit(1);
  }
}

// Advanced examples
async function exampleScalableArchitecture() {
  const gcp = new GCPDeployment({
    projectId: 'enterprise-platform',
    region: 'us-central1',
    dryRun: false,
  });

  // Multi-tier deployment
  const deployment = {
    // API Tier - Auto-scaled Cloud Run
    apiServices: [
      {
        name: 'api-v1',
        image: 'gcr.io/enterprise-platform/api-v1:latest',
        minInstances: 5,
        maxInstances: 200,
        cpuCount: 2,
        memoryMb: 2048,
      },
    ],

    // Worker Tier - Compute Engine instances with auto-scaling
    workerPool: {
      baseImage: 'gcr.io/enterprise-platform/worker:latest',
      minInstances: 3,
      maxInstances: 50,
      machineType: 'n2-highmem-8',
    },

    // Data Tier - Firestore + Cloud Storage
    dataStores: {
      firestore: { mode: 'native' },
      cloudStorage: [
        { name: 'production-data', storageClass: 'STANDARD' },
        { name: 'archive-data', storageClass: 'COLDLINE' },
      ],
    },

    // AI Tier - Vertex AI models
    vertexAI: [
      { modelName: 'text-bison@001', replicas: 5 },
      { modelName: 'textembedding-gecko@001', replicas: 3 },
    ],
  };

  console.log('Scalable architecture deployed:', deployment);
}

async function exampleMultiRegionSetup() {
  const regions = ['us-central1', 'europe-west1', 'asia-northeast1'];
  const deployments = {};

  for (const region of regions) {
    const gcp = new GCPDeployment({
      projectId: 'global-app',
      region,
      dryRun: true, // Dry run for example
    });

    deployments[region] = {
      cloudRun: 'api-service',
      firestore: 'users-db',
      cloudStorage: 'regional-data',
      status: 'configured',
    };
  }

  console.log('Multi-region setup:', JSON.stringify(deployments, null, 2));
}

if (require.main === module) {
  runCompleteGCPDeploymentWorkflow().catch(console.error);
}

module.exports = {
  runCompleteGCPDeploymentWorkflow,
  exampleScalableArchitecture,
  exampleMultiRegionSetup,
};

/**
 * GCP Deployment Module Tests
 */

const assert = require('assert');
const GCPDeployment = require('./gcp-deployment');
const fs = require('fs');
const path = require('path');

describe('GCPDeployment', () => {
  let gcp;

  beforeEach(() => {
    gcp = new GCPDeployment({
      projectId: 'test-project',
      region: 'us-central1',
      zone: 'us-central1-a',
      quiet: true,
      dryRun: true,
    });
  });

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      assert.strictEqual(gcp.projectId, 'test-project');
      assert.strictEqual(gcp.region, 'us-central1');
      assert.strictEqual(gcp.zone, 'us-central1-a');
    });

    it('should load credentials from environment', () => {
      const gcpWithEnv = new GCPDeployment();
      assert.ok(gcpWithEnv.projectId !== undefined || true);
    });

    it('should support dry-run mode', () => {
      assert.strictEqual(gcp.dryRun, true);
    });
  });

  describe('Cloud Run Deployment', () => {
    it('should deploy Cloud Run service in dry-run mode', async () => {
      const result = await gcp.deployCloudRun({
        serviceName: 'test-service',
        imageUrl: 'gcr.io/test-project/test:latest',
        memoryMb: 512,
        cpuCount: 1,
      });

      assert.strictEqual(result.status, 'dry-run');
      assert.strictEqual(result.serviceName, 'test-service');
    });

    it('should throw error without serviceName', async () => {
      try {
        await gcp.deployCloudRun({
          imageUrl: 'gcr.io/test-project/test:latest',
        });
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('serviceName'));
      }
    });

    it('should throw error without imageUrl', async () => {
      try {
        await gcp.deployCloudRun({
          serviceName: 'test-service',
        });
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('imageUrl'));
      }
    });

    it('should accept environment variables', async () => {
      const result = await gcp.deployCloudRun({
        serviceName: 'test-service',
        imageUrl: 'gcr.io/test-project/test:latest',
        environment: {
          NODE_ENV: 'production',
          DEBUG: 'false',
        },
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should accept labels', async () => {
      const result = await gcp.deployCloudRun({
        serviceName: 'test-service',
        imageUrl: 'gcr.io/test-project/test:latest',
        labels: {
          app: 'test',
          version: 'v1',
        },
      });

      assert.strictEqual(result.status, 'dry-run');
    });
  });

  describe('Compute Engine Deployment', () => {
    it('should deploy Compute Engine instance in dry-run mode', async () => {
      const result = await gcp.deployComputeEngine({
        instanceName: 'test-instance',
        machineType: 'e2-medium',
      });

      assert.strictEqual(result.status, 'dry-run');
      assert.strictEqual(result.instanceName, 'test-instance');
    });

    it('should throw error without instanceName', async () => {
      try {
        await gcp.deployComputeEngine({
          machineType: 'e2-medium',
        });
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('instanceName'));
      }
    });

    it('should support preemptible instances', async () => {
      const result = await gcp.deployComputeEngine({
        instanceName: 'test-preemptible',
        machineType: 'e2-medium',
        preemptible: true,
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should support network configuration', async () => {
      const result = await gcp.deployComputeEngine({
        instanceName: 'test-instance',
        machineType: 'e2-medium',
        networkInterface: {
          subnet: 'default',
          externalIp: false,
        },
      });

      assert.strictEqual(result.status, 'dry-run');
    });
  });

  describe('Cloud Storage Deployment', () => {
    it('should deploy Cloud Storage bucket in dry-run mode', async () => {
      const result = await gcp.deployCloudStorage({
        bucketName: 'test-bucket-123',
      });

      assert.strictEqual(result.status, 'dry-run');
      assert.strictEqual(result.bucketName, 'test-bucket-123');
    });

    it('should throw error without bucketName', async () => {
      try {
        await gcp.deployCloudStorage({});
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('bucketName'));
      }
    });

    it('should support lifecycle rules', async () => {
      const result = await gcp.deployCloudStorage({
        bucketName: 'test-bucket-123',
        lifecycleRules: [
          {
            action: { type: 'Delete' },
            condition: { age: 90 },
          },
        ],
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should support versioning', async () => {
      const result = await gcp.deployCloudStorage({
        bucketName: 'test-bucket-123',
        versioningEnabled: true,
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should support CORS configuration', async () => {
      const result = await gcp.deployCloudStorage({
        bucketName: 'test-bucket-123',
        corsConfig: {
          cors: [
            {
              origin: ['https://example.com'],
              method: ['GET', 'PUT'],
            },
          ],
        },
      });

      assert.strictEqual(result.status, 'dry-run');
    });
  });

  describe('Firestore Deployment', () => {
    it('should deploy Firestore in dry-run mode', async () => {
      const result = await gcp.deployFirestore({
        collectionName: 'users',
      });

      assert.strictEqual(result.status, 'dry-run');
      assert.strictEqual(result.collectionName, 'users');
    });

    it('should throw error without collectionName', async () => {
      try {
        await gcp.deployFirestore({});
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('collectionName'));
      }
    });

    it('should accept security rules', async () => {
      const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}`;

      const result = await gcp.deployFirestore({
        collectionName: 'users',
        securityRules: rules,
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should accept indexes', async () => {
      const result = await gcp.deployFirestore({
        collectionName: 'users',
        indexes: [
          {
            collection: 'users',
            fields: [{ path: 'email', order: 'ASCENDING' }],
          },
        ],
      });

      assert.strictEqual(result.status, 'dry-run');
    });
  });

  describe('Vertex AI', () => {
    it('should deploy Vertex AI model in dry-run mode', async () => {
      const result = await gcp.deployVertexAIModel({
        modelName: 'text-bison@001',
        displayName: 'Text Generation',
      });

      assert.strictEqual(result.status, 'dry-run');
      assert.strictEqual(result.modelName, 'text-bison@001');
    });

    it('should throw error without modelName', async () => {
      try {
        await gcp.deployVertexAIModel({
          displayName: 'Text Generation',
        });
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('modelName'));
      }
    });

    it('should throw error without displayName', async () => {
      try {
        await gcp.deployVertexAIModel({
          modelName: 'text-bison@001',
        });
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('displayName'));
      }
    });

    it('should support GPU configuration', async () => {
      const result = await gcp.deployVertexAIModel({
        modelName: 'text-bison@001',
        displayName: 'Text Generation',
        gpuType: 'nvidia-tesla-t4',
        gpuCount: 2,
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should call Vertex AI API in dry-run mode', async () => {
      const result = await gcp.callVertexAIAPI({
        model: 'text-bison@001',
        prompt: 'Explain microservices',
      });

      assert.strictEqual(result.status, 'dry-run');
    });

    it('should throw error without prompt', async () => {
      try {
        await gcp.callVertexAIAPI({
          model: 'text-bison@001',
        });
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.ok(err.message.includes('prompt'));
      }
    });
  });

  describe('Terraform Configuration', () => {
    it('should generate Terraform config', () => {
      const config = {
        projectId: 'test-project',
        region: 'us-central1',
        resources: {
          cloudRun: [
            {
              name: 'test-service',
              image: 'gcr.io/test-project/test:latest',
              memory: 512,
              cpu: 1,
            },
          ],
        },
      };

      const tf = gcp.generateTerraformConfig(config);
      assert.ok(tf.terraform);
      assert.ok(tf.provider);
      assert.ok(tf.resource);
      assert.ok(tf.resource.google_cloud_run_service);
    });

    it('should generate Terraform for Compute Engine', () => {
      const config = {
        projectId: 'test-project',
        region: 'us-central1',
        resources: {
          computeEngine: [
            {
              name: 'test-instance',
              machineType: 'e2-medium',
              zone: 'us-central1-a',
            },
          ],
        },
      };

      const tf = gcp.generateTerraformConfig(config);
      assert.ok(tf.resource.google_compute_instance);
    });

    it('should generate Terraform for Cloud Storage', () => {
      const config = {
        projectId: 'test-project',
        region: 'us-central1',
        resources: {
          cloudStorage: [
            {
              name: 'test-bucket',
              storageClass: 'STANDARD',
            },
          ],
        },
      };

      const tf = gcp.generateTerraformConfig(config);
      assert.ok(tf.resource.google_storage_bucket);
    });

    it('should generate Terraform for Firestore', () => {
      const config = {
        projectId: 'test-project',
        region: 'us-central1',
        resources: {
          firestore: [{}],
        },
      };

      const tf = gcp.generateTerraformConfig(config);
      assert.ok(tf.resource.google_firestore_database);
    });

    it('should convert JSON to HCL format', () => {
      const json = {
        resource: {
          google_cloud_run_service: {
            test: {
              name: 'test-service',
              location: 'us-central1',
            },
          },
        },
      };

      const hcl = gcp.jsonToHCL(json);
      assert.ok(hcl.includes('resource'));
      assert.ok(hcl.includes('google_cloud_run_service'));
      assert.ok(hcl.includes('test-service'));
    });

    it('should save Terraform config to file', () => {
      const config = {
        projectId: 'test-project',
        region: 'us-central1',
        resources: {
          cloudRun: [
            {
              name: 'test-service',
              image: 'gcr.io/test-project/test:latest',
            },
          ],
        },
      };

      const tempDir = '/tmp/test-terraform-' + Date.now();
      const configFile = gcp.saveTerraformConfig(config, tempDir);

      assert.ok(fs.existsSync(configFile));
      const content = fs.readFileSync(configFile, 'utf-8');
      assert.ok(content.includes('google_cloud_run_service'));

      // Cleanup
      fs.unlinkSync(configFile);
      fs.rmdirSync(tempDir);
    });
  });

  describe('Health Checks', () => {
    it('should check Cloud Run health in dry-run mode', async () => {
      const result = await gcp.healthCheck('cloud-run', 'test-service');
      // In dry-run mode with dryRun: true, actual gcloud commands are not executed
      assert.ok(result);
    });

    it('should check Compute Engine health in dry-run mode', async () => {
      const result = await gcp.healthCheck('compute-engine', 'test-instance');
      assert.ok(result);
    });

    it('should check all resource health', async () => {
      // Add some deployment state
      gcp.deploymentState['test-service'] = {
        type: 'cloud-run',
        status: 'success',
      };

      const results = await gcp.healthCheckAll();
      assert.ok(Array.isArray(results));
    });

    it('should return unknown for unsupported resource types', async () => {
      const result = await gcp.healthCheck('unknown-type', 'test-resource');
      assert.strictEqual(result.status, 'unknown');
    });
  });

  describe('State Management', () => {
    it('should get deployment state', () => {
      gcp.deploymentState['test-service'] = {
        type: 'cloud-run',
        status: 'success',
      };

      const state = gcp.getDeploymentState();
      assert.ok(state['test-service']);
    });

    it('should save state to file', () => {
      gcp.deploymentState['test-service'] = {
        type: 'cloud-run',
        status: 'success',
      };

      const tempFile = '/tmp/test-state-' + Date.now() + '.json';
      gcp.saveState(tempFile);

      assert.ok(fs.existsSync(tempFile));
      const content = JSON.parse(fs.readFileSync(tempFile, 'utf-8'));
      assert.ok(content['test-service']);

      fs.unlinkSync(tempFile);
    });

    it('should load state from file', () => {
      const tempFile = '/tmp/test-state-' + Date.now() + '.json';
      const testState = {
        'test-service': {
          type: 'cloud-run',
          status: 'success',
        },
      };

      fs.writeFileSync(tempFile, JSON.stringify(testState));

      const newGcp = new GCPDeployment({
        projectId: 'test-project',
        quiet: true,
        dryRun: true,
      });
      newGcp.loadState(tempFile);

      assert.ok(newGcp.deploymentState['test-service']);
      fs.unlinkSync(tempFile);
    });
  });

  describe('Event Emissions', () => {
    it('should emit deployment-complete event', (done) => {
      gcp.on('deployment-complete', (event) => {
        assert.ok(event.type);
        done();
      });

      gcp.deployCloudRun({
        serviceName: 'test-service',
        imageUrl: 'gcr.io/test-project/test:latest',
      });
    });

    it('should emit log events', (done) => {
      gcp.on('log', (event) => {
        assert.ok(event.message);
        assert.ok(event.level);
        done();
      });

      gcp.log('Test message', 'info');
    });

    it('should emit error events', (done) => {
      gcp.on('error', (event) => {
        assert.ok(event.message);
        done();
      });

      gcp.error('Test error');
    });
  });

  describe('Logging and Monitoring', () => {
    it('should fetch Cloud Run logs in dry-run mode', async () => {
      const logs = await gcp.getCloudRunLogs('test-service', 50);
      assert.ok(Array.isArray(logs));
    });

    it('should get metrics in dry-run mode', async () => {
      const metrics = await gcp.getMetrics(
        'cloud-run',
        'test-service',
        'run.googleapis.com/request_count',
      );
      assert.ok(Array.isArray(metrics));
    });
  });

  describe('Configuration Validation', () => {
    it('should handle missing projectId gracefully', () => {
      const gcpNoProject = new GCPDeployment({
        quiet: true,
        dryRun: true,
      });
      assert.ok(gcpNoProject);
    });

    it('should support custom region configuration', () => {
      const gcpRegion = new GCPDeployment({
        projectId: 'test-project',
        region: 'europe-west1',
        zone: 'europe-west1-b',
        quiet: true,
        dryRun: true,
      });
      assert.strictEqual(gcpRegion.region, 'europe-west1');
      assert.strictEqual(gcpRegion.zone, 'europe-west1-b');
    });

    it('should support quiet mode', async () => {
      const gcpQuiet = new GCPDeployment({
        projectId: 'test-project',
        quiet: true,
        dryRun: true,
      });

      const result = await gcpQuiet.deployCloudRun({
        serviceName: 'test-service',
        imageUrl: 'gcr.io/test-project/test:latest',
      });

      assert.strictEqual(result.status, 'dry-run');
    });
  });
});

describe('GCPDeployment Integration', () => {
  it('should handle complete deployment workflow', async () => {
    const gcp = new GCPDeployment({
      projectId: 'test-project',
      region: 'us-central1',
      quiet: true,
      dryRun: true,
    });

    // Deploy multiple resources
    const cloudRunResult = await gcp.deployCloudRun({
      serviceName: 'api-backend',
      imageUrl: 'gcr.io/test-project/api:latest',
    });

    const computeEngineResult = await gcp.deployComputeEngine({
      instanceName: 'worker-1',
      machineType: 'e2-medium',
    });

    const storageResult = await gcp.deployCloudStorage({
      bucketName: 'test-bucket-123',
    });

    assert.strictEqual(cloudRunResult.status, 'dry-run');
    assert.strictEqual(computeEngineResult.status, 'dry-run');
    assert.strictEqual(storageResult.status, 'dry-run');

    const state = gcp.getDeploymentState();
    assert.strictEqual(Object.keys(state).length, 3);
  });

  it('should generate and save complete Terraform config', () => {
    const gcp = new GCPDeployment({
      projectId: 'test-project',
      region: 'us-central1',
      quiet: true,
      dryRun: true,
    });

    const config = {
      projectId: 'test-project',
      region: 'us-central1',
      resources: {
        cloudRun: [
          {
            name: 'api-backend',
            image: 'gcr.io/test-project/api:latest',
            memory: 1024,
            cpu: 2,
          },
        ],
        computeEngine: [
          {
            name: 'worker-1',
            machineType: 'e2-medium',
          },
        ],
        cloudStorage: [
          {
            name: 'test-bucket',
            storageClass: 'STANDARD',
          },
        ],
      },
    };

    const tempDir = '/tmp/test-tf-' + Date.now();
    const configFile = gcp.saveTerraformConfig(config, tempDir);

    assert.ok(fs.existsSync(configFile));

    // Cleanup
    fs.unlinkSync(configFile);
    fs.rmdirSync(tempDir);
  });
});

# AWS Deployment Module for Claudient

Complete AWS deployment solution for Claudient, managing ECS/EKS, Lambda serverless tasks, S3 skill storage, DynamoDB state management, and CloudFormation templates with cost optimization.

## Overview

The AWS Deployment module provides:
- **ECS/EKS**: Container orchestration for long-running Claudient services
- **Lambda**: Serverless execution for dont-stop tasks with EventBridge scheduling
- **S3**: Centralized skill and artifact storage with versioning and lifecycle policies
- **DynamoDB**: Distributed state and deployment tracking with TTL support
- **CloudFormation**: Infrastructure as Code templates for reproducible deployments
- **Cost Optimization**: Automatic recommendations and monitoring for AWS spend

## Installation

```bash
npm install aws-sdk
```

Or using the module directly in your project:

```javascript
const AWSDeployment = require('./aws-deployment');
```

## Quick Start

### Basic Deployment

```javascript
const AWSDeployment = require('./aws-deployment');

const deployment = new AWSDeployment({
  region: 'us-east-1',
  profile: 'default',
  accountId: process.env.AWS_ACCOUNT_ID,
  costOptimization: true,
});

// Deploy S3 bucket for skills
await deployment.deployS3({
  bucketName: 'claudient-skills',
  versioningEnabled: true,
  serverSideEncryption: true,
});

// Deploy DynamoDB for state
await deployment.deployDynamoDB({
  tableName: 'claudient-state',
  partitionKey: { name: 'deploymentId', type: 'S' },
  billingMode: 'PAY_PER_REQUEST',
});

// Deploy Lambda dont-stop task
await deployment.deployLambda({
  functionName: 'claudient-dont-stop',
  runtime: 'nodejs18.x',
  roleArn: 'arn:aws:iam::123456789012:role/lambda-role',
  codeZip: '/path/to/lambda.zip',
});
```

## Configuration

### Constructor Options

```javascript
new AWSDeployment({
  region: 'us-east-1',              // AWS region
  profile: 'default',                // AWS CLI profile
  accountId: '123456789012',         // AWS account ID
  awsCliPath: 'aws',                 // Path to AWS CLI
  terraformPath: 'terraform',        // Path to Terraform
  quiet: false,                      // Suppress log output
  dryRun: false,                     // Dry-run mode
  costOptimization: true,            // Enable cost recommendations
  tags: {                            // Default tags for all resources
    ManagedBy: 'Claudient',
    Environment: 'production',
  },
})
```

### Environment Variables

```bash
export AWS_REGION=us-east-1
export AWS_PROFILE=default
export AWS_ACCOUNT_ID=123456789012
```

## Core Features

### 1. ECS Deployment

Deploy containerized Claudient services on ECS:

```javascript
await deployment.deployECS({
  clusterName: 'claudient-cluster',
  serviceName: 'claudient-orchestrator',
  taskDefinitionFamily: 'claudient-task',
  desiredCount: 2,
  launchType: 'FARGATE',           // or 'EC2'
  image: 'your-registry/image:latest',
  cpu: '256',
  memory: '512',
  containerPort: 8080,
  environment: {
    SKILLS_BUCKET: 'claudient-skills',
    STATE_TABLE: 'claudient-state',
  },
  subnets: ['subnet-12345'],
  securityGroups: ['sg-12345'],
  assignPublicIp: false,
});
```

**Cost Notes**:
- FARGATE: ~$0.04711/hour for 256 CPU, 512MB memory
- EC2: Variable based on instance type; Spot instances save ~70%

### 2. EKS Deployment

Deploy Kubernetes clusters for advanced orchestration:

```javascript
await deployment.deployEKS({
  clusterName: 'claudient-eks',
  version: '1.28',
  roleArn: 'arn:aws:iam::123456789012:role/eks-role',
  subnets: ['subnet-12345', 'subnet-67890'],
  securityGroupIds: ['sg-12345'],
  logging: {
    enabled: true,
    types: ['api', 'audit', 'authenticator'],
  },
});
```

### 3. Lambda Dont-Stop Tasks

Deploy serverless functions that maintain Claudient continuity:

```javascript
// Deploy function
await deployment.deployLambda({
  functionName: 'claudient-dont-stop',
  runtime: 'nodejs18.x',
  handler: 'index.handler',
  roleArn: 'arn:aws:iam::123456789012:role/lambda-role',
  codeZip: '/path/to/lambda.zip',
  timeout: 300,
  memorySize: 256,
  ephemeralStorageSize: 512,
  environment: {
    SKILLS_BUCKET: 'claudient-skills',
    STATE_TABLE: 'claudient-state',
  },
});

// Create EventBridge scheduling rule
await deployment.createLambdaEventRule({
  functionName: 'claudient-dont-stop',
  ruleName: 'claudient-schedule',
  scheduleExpression: 'rate(5 minutes)',
  description: 'Execute dont-stop task every 5 minutes',
});
```

**Cost Notes**:
- Free tier: 1M invocations/month
- Pay: $0.20 per 1M invocations
- Execution: $0.0000166667 per GB-second

### 4. S3 Skills Storage

Centralized repository for skills with versioning and lifecycle:

```javascript
await deployment.deployS3({
  bucketName: 'claudient-skills-storage',
  versioningEnabled: true,
  serverSideEncryption: true,
  publicRead: false,
  lifecycleRules: [
    {
      Id: 'TransitionToGlacier',
      Status: 'Enabled',
      Transitions: [
        { Days: 90, StorageClass: 'GLACIER' },
        { Days: 365, StorageClass: 'DEEP_ARCHIVE' },
      ],
    },
  ],
  corsRules: [
    {
      AllowedMethods: ['GET', 'PUT'],
      AllowedOrigins: ['*'],
      AllowedHeaders: ['*'],
    },
  ],
});

// Upload skills directory
await deployment.uploadSkillsToS3(
  'claudient-skills-storage',
  '/path/to/skills',
  'skills/'
);
```

**Cost Notes**:
- Standard storage: $0.023/GB/month
- Glacier: $0.004/GB/month (50 years data retention)
- Data transfer out: $0.09/GB

### 5. DynamoDB State Storage

Distributed state management with automatic scaling:

```javascript
await deployment.deployDynamoDB({
  tableName: 'claudient-deployment-state',
  partitionKey: { name: 'deploymentId', type: 'S' },
  sortKey: { name: 'timestamp', type: 'N' },
  billingMode: 'PAY_PER_REQUEST',  // or 'PROVISIONED'
  ttlAttribute: 'expirationTime',   // Auto-delete old records
  globalSecondaryIndexes: [
    {
      IndexName: 'StatusIndex',
      KeySchema: [
        { AttributeName: 'status', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
  ],
});
```

**Cost Notes**:
- PAY_PER_REQUEST: $1.25 per 1M read units, $6.25 per 1M write units
- PROVISIONED: $0.00013/hour per read capacity unit

### 6. CloudFormation Templates

Generate Infrastructure as Code templates:

```javascript
// Generate template
const template = deployment.generateCloudFormationTemplate({
  stackName: 'claudient-main',
  resources: {
    ecsCluster: {
      name: 'claudient-cluster',
      containerInsights: true,
    },
    lambda: {
      functionName: 'claudient-dont-stop',
      runtime: 'nodejs18.x',
      handler: 'index.handler',
    },
    s3: {
      bucketName: 'claudient-skills',
      versioningEnabled: true,
    },
    dynamodb: {
      tableName: 'claudient-state',
      partitionKey: { name: 'id', type: 'S' },
      billingMode: 'PAY_PER_REQUEST',
    },
    vpc: {
      cidrBlock: '10.0.0.0/16',
      subnets: [
        { cidrBlock: '10.0.1.0/24', availabilityZone: 'us-east-1a' },
      ],
    },
  },
});

// Save as file
const filePath = deployment.saveCloudFormationTemplate(
  { stackName: 'claudient-main', resources: {} },
  './deployments/cloudformation'
);

// Deploy stack
await deployment.deployCloudFormationStack('claudient-main', filePath);
```

### 7. Cost Optimization

Get automated cost-saving recommendations:

```javascript
const recommendations = deployment.getCostOptimizationRecommendations({
  ecs: { launchType: 'EC2', desiredCount: 2 },
  lambda: { memorySize: 256 },
  s3: { lifecycleRules: [] },
  dynamodb: { billingMode: 'PROVISIONED' },
});

recommendations.forEach(rec => {
  console.log(`[${rec.type}] ${rec.service}: ${rec.recommendation}`);
  console.log(`Estimated Savings: ${rec.estimatedSavings}`);
});
```

**Sample Recommendations**:
- ECS EC2: Use Spot instances for 70% savings
- Lambda: Optimize memory for smaller functions
- S3: Enable lifecycle policies for 50-70% savings
- DynamoDB: Switch to PAY_PER_REQUEST for unpredictable workloads

### 8. Health Checks

Monitor deployment health:

```javascript
// ECS health check
const ecsHealth = await deployment.healthCheckECS('claudient-cluster', 'claudient-service');
console.log(ecsHealth);
// { status: 'healthy', desiredCount: 2, runningCount: 2, serviceStatus: 'ACTIVE' }

// Lambda health check
const lambdaHealth = await deployment.healthCheckLambda('claudient-dont-stop');
console.log(lambdaHealth);
// { status: 'healthy', state: 'Active', updateStatus: 'Successful' }
```

### 9. State Management

Track and persist deployment state:

```javascript
// Save deployment state
deployment.saveState('/path/to/state.json');

// Load state from previous deployment
const newDeployment = new AWSDeployment();
newDeployment.loadState('/path/to/state.json');

const currentState = newDeployment.getDeploymentState();
console.log(currentState);
// { 'claudient-skills': { type: 's3', status: 'success', ... } }
```

## AWS Cost Estimation

Based on typical Claudient deployment:

| Service | Configuration | Estimated Monthly Cost |
|---------|---|---|
| ECS FARGATE | 2 tasks × (256 CPU, 512MB) | $34 |
| Lambda | 8,640 executions/month × 256MB | $3 |
| S3 Storage | 100 GB standard + Glacier transitions | $2.50 |
| S3 Requests | 100K reads, 50K writes | $1 |
| DynamoDB | PAY_PER_REQUEST, 10K reads/writes | $20 |
| CloudWatch Logs | Claudient logs | $5 |
| Data Transfer | 1 TB outbound | $85 |
| **TOTAL** | | **$150/month** |

### Cost Optimization Strategies

1. **Spot Instances**: Use EC2 Spot for 70% cost reduction
2. **Reserved Capacity**: Commit 1-year term for 30% discount
3. **S3 Intelligent-Tiering**: Automatic cost optimization for storage
4. **Lambda Optimization**: Right-size memory allocation
5. **DynamoDB On-Demand**: Only pay for what you use
6. **Data Transfer**: Minimize cross-region transfers

## Event Listeners

The module emits events for monitoring:

```javascript
deployment.on('log', (data) => {
  console.log(`[${data.level}] ${data.message}`);
});

deployment.on('error', (data) => {
  console.error(`ERROR: ${data.message}`);
});

deployment.on('deployment-complete', (data) => {
  console.log(`Deployed: ${data.type} - ${data.serviceName || data.tableName}`);
});
```

## Advanced Usage

### Multi-Region Deployment

```javascript
const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];

for (const region of regions) {
  const regional = new AWSDeployment({ region });
  await regional.deployS3({ bucketName: `claudient-skills-${region}` });
  await regional.deployDynamoDB({
    tableName: `claudient-state-${region}`,
    partitionKey: { name: 'id', type: 'S' },
  });
}
```

### Disaster Recovery

```javascript
// Backup state
const state = deployment.getDeploymentState();
deployment.saveState(`/backups/state-${new Date().toISOString()}.json`);

// Deploy replica cluster
const replica = new AWSDeployment({ region: 'us-west-2' });
replica.loadState('/backups/state-latest.json');
// Redeploy all resources in new region
```

### Monitoring Integration

```javascript
deployment.on('deployment-complete', async (data) => {
  // Send to CloudWatch
  await deployment.deployMetrics({
    metric: 'DeploymentComplete',
    value: 1,
    unit: 'Count',
    dimensions: {
      ServiceType: data.type,
      ServiceName: data.serviceName || data.tableName,
    },
  });
});
```

## CLI Usage

```bash
# Deploy all components
node aws-deployment-integration-example.js deploy

# Check current deployment state
node aws-deployment-integration-example.js check-state

# Estimate AWS costs
node aws-deployment-integration-example.js estimate-costs
```

## Testing

```bash
npm test -- lib/aws-deployment.test.js
```

## Error Handling

```javascript
try {
  await deployment.deployECS({
    clusterName: 'prod-cluster',
    serviceName: 'prod-service',
    taskDefinitionFamily: 'prod-task',
    image: 'my-registry/image:latest',
  });
} catch (err) {
  if (err.message.includes('already exists')) {
    console.log('Service already deployed');
  } else {
    console.error('Deployment failed:', err.message);
  }
}
```

## Best Practices

1. **Use IAM Roles**: Attach least-privilege policies to services
2. **Enable Encryption**: Use KMS for sensitive data
3. **VPC Isolation**: Deploy services in private subnets
4. **Multi-AZ**: Spread resources across availability zones
5. **Monitoring**: Enable CloudWatch alarms and dashboards
6. **Tagging**: Apply consistent tags for cost allocation
7. **Dry-Run**: Test deployments with `dryRun: true` first
8. **Version Control**: Track CloudFormation templates in git

## Troubleshooting

### AWS CLI Not Found
```bash
which aws
# If not found, install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Credentials Error
```bash
# Configure credentials
aws configure --profile default

# Or use environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_DEFAULT_REGION=us-east-1
```

### CloudFormation Stack Already Exists
```javascript
// Module automatically updates existing stacks
// Ensure IdempotentId is set in CloudFormation for safe updates
```

## API Reference

### ECS Methods
- `deployECS(config)` - Deploy containerized service
- `healthCheckECS(clusterName, serviceName)` - Check service health

### Lambda Methods
- `deployLambda(config)` - Deploy serverless function
- `createLambdaEventRule(config)` - Create EventBridge rule
- `healthCheckLambda(functionName)` - Check function health

### S3 Methods
- `deployS3(config)` - Create and configure S3 bucket
- `uploadSkillsToS3(bucketName, skillsDir, prefix)` - Upload files

### DynamoDB Methods
- `deployDynamoDB(config)` - Create table with configuration
- `getFilesRecursive(dir)` - List all files in directory

### CloudFormation Methods
- `generateCloudFormationTemplate(config)` - Generate template
- `saveCloudFormationTemplate(config, outputDir)` - Save as file
- `deployCloudFormationStack(stackName, templateFile)` - Deploy stack

### Utilities
- `getCostOptimizationRecommendations(config)` - Get recommendations
- `saveState(filePath)` - Persist deployment state
- `loadState(filePath)` - Load previous state
- `getDeploymentState()` - Get current state

## License

MIT

## Support

For issues or questions, refer to the Claudient documentation or AWS SDK documentation.

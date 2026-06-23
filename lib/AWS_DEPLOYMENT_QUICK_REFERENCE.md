# AWS Deployment - Quick Reference Guide

## Installation & Setup

```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Configure AWS credentials
aws configure --profile default

# Verify installation
aws sts get-caller-identity
```

## Module Import

```javascript
const AWSDeployment = require('./lib/aws-deployment');

const deployment = new AWSDeployment({
  region: 'us-east-1',
  profile: 'default',
  accountId: process.env.AWS_ACCOUNT_ID,
  costOptimization: true,
});
```

## Common Deployment Patterns

### Pattern 1: S3 + DynamoDB (Storage Only)

```javascript
// Skills storage
await deployment.deployS3({
  bucketName: 'claudient-skills',
  versioningEnabled: true,
});

// State storage
await deployment.deployDynamoDB({
  tableName: 'claudient-state',
  partitionKey: { name: 'id', type: 'S' },
  billingMode: 'PAY_PER_REQUEST',
});

// Upload skills
await deployment.uploadSkillsToS3('claudient-skills', './skills', 'skills/');
```

### Pattern 2: Lambda Dont-Stop Tasks

```javascript
// Deploy function
await deployment.deployLambda({
  functionName: 'claudient-dont-stop',
  runtime: 'nodejs18.x',
  handler: 'index.handler',
  roleArn: 'arn:aws:iam::AWS_ACCOUNT:role/lambda-role',
  codeZip: './lambda-code.zip',
  timeout: 300,
  memorySize: 256,
});

// Schedule execution
await deployment.createLambdaEventRule({
  functionName: 'claudient-dont-stop',
  ruleName: 'claudient-schedule',
  scheduleExpression: 'rate(5 minutes)',
});
```

### Pattern 3: ECS Container Services

```javascript
// Deploy service
await deployment.deployECS({
  clusterName: 'claudient-cluster',
  serviceName: 'claudient-api',
  taskDefinitionFamily: 'claudient-api-task',
  image: 'my-registry/claudient-api:latest',
  launchType: 'FARGATE',
  desiredCount: 2,
  cpu: '256',
  memory: '512',
  containerPort: 3000,
});

// Check health
const health = await deployment.healthCheckECS(
  'claudient-cluster',
  'claudient-api'
);
```

### Pattern 4: Complete Stack via CloudFormation

```javascript
// Generate template
const template = deployment.generateCloudFormationTemplate({
  stackName: 'claudient-full',
  resources: {
    s3: { bucketName: 'claudient-skills' },
    dynamodb: { tableName: 'claudient-state', ... },
    lambda: { functionName: 'claudient-dont-stop', ... },
    ecsCluster: { name: 'claudient-cluster', ... },
  },
});

// Save and deploy
const filePath = deployment.saveCloudFormationTemplate(
  { stackName: 'claudient-full', ... },
  './cloudformation'
);

await deployment.deployCloudFormationStack(
  'claudient-full',
  filePath
);
```

## Configuration Quick Reference

```javascript
// Full configuration example
const deployment = new AWSDeployment({
  region: 'us-east-1',              // AWS region
  profile: 'default',                // AWS CLI profile
  accountId: '123456789012',         // AWS account ID
  awsCliPath: 'aws',                 // AWS CLI path
  terraformPath: 'terraform',        // Terraform path
  quiet: false,                      // Suppress logs
  dryRun: true,                      // Test mode
  costOptimization: true,            // Enable recommendations
  tags: {                            // Default tags
    ManagedBy: 'Claudient',
    Environment: 'production',
    Project: 'Claudient',
  },
});
```

## CLI Commands

```bash
# Deploy full stack
node lib/aws-deployment-integration-example.js deploy

# Check state
node lib/aws-deployment-integration-example.js check-state

# Estimate costs
node lib/aws-deployment-integration-example.js estimate-costs

# Run tests
npm test -- lib/aws-deployment.test.js

# CloudFormation deploy
aws cloudformation deploy \
  --template-file lib/aws-deployment-cloudformation-template.yaml \
  --stack-name claudient-main \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region us-east-1 \
  --profile default
```

## AWS Resource Quick Commands

```bash
# List S3 buckets
aws s3 ls | grep claudient

# List DynamoDB tables
aws dynamodb list-tables | grep claudient

# List Lambda functions
aws lambda list-functions | grep claudient

# List ECS clusters
aws ecs list-clusters --query 'clusterArns' | grep claudient

# List VPCs
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=claudient*"

# List CloudWatch logs
aws logs describe-log-groups | grep claudient

# View Lambda logs
aws logs tail /aws/lambda/claudient-dont-stop-task --follow

# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name claudient-main \
  --query 'Stacks[0].StackStatus'

# List IAM roles
aws iam list-roles | grep claudient
```

## Cost Monitoring

```bash
# Get S3 bucket size
aws s3api list-objects-v2 --bucket claudient-skills \
  --query '[Contents[].Size]' | jq 'add/1024/1024/1024'

# Get DynamoDB consumed capacity
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedWriteCapacityUnits \
  --dimensions Name=TableName,Value=claudient-state \
  --start-time $(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)Z \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S)Z \
  --period 3600 \
  --statistics Sum

# Get Lambda invocations
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=claudient-dont-stop-task \
  --start-time $(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)Z \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S)Z \
  --period 3600 \
  --statistics Sum

# Get cost explorer data (requires permissions)
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity DAILY \
  --metrics BlendedCost \
  --filter file://cost-filter.json
```

## Event Listener Setup

```javascript
// Log all events
deployment.on('log', (data) => {
  console.log(`[${data.level}] ${data.message}`);
});

// Handle errors
deployment.on('error', (data) => {
  console.error(`ERROR: ${data.message}`);
  // Send alert, retry, etc.
});

// Track completions
deployment.on('deployment-complete', (data) => {
  console.log(`✓ ${data.type}: ${data.serviceName || data.tableName}`);
  // Update metrics, notify team, etc.
});
```

## State Management

```javascript
// Save current state
deployment.saveState('./deployments/state.json');

// Load previous state
deployment.loadState('./deployments/state.json');

// Get current state
const state = deployment.getDeploymentState();
Object.entries(state).forEach(([name, info]) => {
  console.log(`${name}: ${info.type} (${info.status})`);
});
```

## Cost Optimization Quick Tips

| Item | Cost Reduction | How |
|------|---|---|
| ECS Instances | -70% | Use Spot Instances |
| Reserved Capacity | -30% | 1-year commitment |
| S3 Storage | -50-70% | Lifecycle to Glacier |
| DynamoDB | Variable | Switch to PAY_PER_REQUEST |
| Data Transfer | -35% | Use CloudFront CDN |
| Lambda Memory | -20% | Right-size functions |

## Error Handling Pattern

```javascript
try {
  const result = await deployment.deployS3({
    bucketName: 'my-bucket',
  });
  console.log('Success:', result);
} catch (err) {
  if (err.message.includes('already exists')) {
    console.log('Resource already deployed');
  } else if (err.message.includes('InvalidBucketName')) {
    console.log('Invalid bucket name - must be globally unique');
  } else if (err.message.includes('AccessDenied')) {
    console.log('Check IAM permissions');
  } else {
    console.error('Unknown error:', err.message);
  }
}
```

## Dry-Run Testing

```javascript
// Test deployment without creating resources
const deployment = new AWSDeployment({
  region: 'us-east-1',
  dryRun: true,  // Enable dry-run
});

// This will simulate deployment
const result = await deployment.deployS3({
  bucketName: 'test-bucket',
});
console.log(result);
// { status: 'dry-run', bucketName: 'test-bucket' }
```

## Multi-Environment Deploy

```javascript
const environments = {
  dev: { region: 'us-east-1', costOptimization: false },
  staging: { region: 'us-west-2', costOptimization: true },
  prod: { region: 'eu-west-1', costOptimization: true },
};

for (const [env, config] of Object.entries(environments)) {
  console.log(`Deploying ${env}...`);
  const deployment = new AWSDeployment({
    ...config,
    tags: { Environment: env },
  });
  
  // Deploy resources
}
```

## Scaling Guide

| Metric | Small (Dev) | Medium (Staging) | Large (Prod) |
|--------|---|---|---|
| ECS Instances | 1 | 2-3 | 3+ |
| Lambda Memory | 128 MB | 256 MB | 512 MB |
| DynamoDB RCU | 5 | 50 | 500+ |
| DynamoDB WCU | 5 | 50 | 500+ |
| S3 Requests/s | 100 | 1,000 | 10,000+ |

## Monitoring Checklist

- [ ] CloudWatch logs configured
- [ ] CloudWatch alarms set
- [ ] Lambda error tracking
- [ ] DynamoDB throttle alerts
- [ ] S3 bucket size monitoring
- [ ] Cost tracking enabled
- [ ] Performance dashboards
- [ ] Log retention policies

## Security Checklist

- [ ] VPC endpoints configured
- [ ] Security groups restricted
- [ ] S3 public access blocked
- [ ] Encryption enabled (S3, DynamoDB)
- [ ] IAM roles minimal permissions
- [ ] KMS keys configured
- [ ] VPC Flow Logs enabled
- [ ] CloudTrail logging enabled

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| AWS CLI not found | `which aws` → Install AWS CLI v2 |
| Credentials error | Run `aws configure` |
| Permission denied | Check IAM policy for user/role |
| Bucket exists | Bucket names globally unique |
| Lambda timeout | Increase timeout, optimize code |
| DynamoDB throttle | Enable on-demand billing |
| CloudFormation failed | Check `describe-stack-events` |
| VPC/subnet issues | Verify CIDR blocks don't overlap |

## Useful Links

- AWS Documentation: https://docs.aws.amazon.com/
- AWS CLI Reference: https://docs.aws.amazon.com/cli/
- CloudFormation Docs: https://docs.aws.amazon.com/cloudformation/
- Pricing Calculator: https://calculator.aws/
- AWS Free Tier: https://aws.amazon.com/free/

## Performance Tips

1. **Batch DynamoDB operations**: Use batch-write-item
2. **Enable DynamoDB Streams**: Real-time data replication
3. **Use S3 Intelligent-Tiering**: Automatic cost optimization
4. **Lambda concurrency limits**: Set appropriate limits
5. **ECS task placement**: Optimize for cost/performance
6. **CloudFront caching**: Reduce origin requests
7. **VPC endpoints**: Avoid NAT gateway costs

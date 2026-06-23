/**
 * AWS Deployment Integration Example
 * Demonstrates complete AWS deployment workflow for Claudient
 */

const AWSDeployment = require('./aws-deployment');
const path = require('path');

async function deployClaudientToAWS() {
  const deployment = new AWSDeployment({
    region: 'us-east-1',
    profile: 'default',
    accountId: process.env.AWS_ACCOUNT_ID,
    costOptimization: true,
    tags: {
      Project: 'Claudient',
      Environment: 'production',
      ManagedBy: 'Terraform',
    },
  });

  // Event listeners
  deployment.on('log', (data) => console.log(`[${data.level}] ${data.message}`));
  deployment.on('error', (data) => console.error(`ERROR: ${data.message}`));
  deployment.on('deployment-complete', (data) => console.log(`COMPLETE: ${data.type} - ${data.serviceName || data.clusterName || data.functionName || data.tableName || data.bucketName}`));

  try {
    console.log('\n=== Claudient AWS Deployment ===\n');

    // 1. Deploy S3 Bucket for Skills Storage
    console.log('Step 1: Deploying S3 bucket for skill storage...');
    const s3Result = await deployment.deployS3({
      bucketName: 'claudient-skills-storage',
      versioningEnabled: true,
      serverSideEncryption: true,
      publicRead: false,
      lifecycleRules: [
        {
          Id: 'TransitionToGlacier',
          Status: 'Enabled',
          Transitions: [
            {
              Days: 90,
              StorageClass: 'GLACIER',
            },
          ],
        },
      ],
      corsRules: [
        {
          AllowedMethods: ['GET', 'PUT', 'POST'],
          AllowedOrigins: ['*'],
          AllowedHeaders: ['*'],
          MaxAgeSeconds: 3000,
        },
      ],
    });
    console.log(`S3 Deployment Result:`, s3Result);

    // Upload sample skills
    const skillsDir = path.join(__dirname, '..', 'lib');
    const s3Upload = await deployment.uploadSkillsToS3(
      'claudient-skills-storage',
      skillsDir,
      'skills/'
    );
    console.log(`Skills Upload Result:`, s3Upload);

    // 2. Deploy DynamoDB Table for State Storage
    console.log('\nStep 2: Deploying DynamoDB table for state storage...');
    const dynamodbResult = await deployment.deployDynamoDB({
      tableName: 'claudient-deployment-state',
      partitionKey: { name: 'deploymentId', type: 'S' },
      sortKey: { name: 'timestamp', type: 'N' },
      billingMode: 'PAY_PER_REQUEST',
      ttlAttribute: 'expirationTime',
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
    console.log(`DynamoDB Deployment Result:`, dynamodbResult);

    // 3. Deploy Lambda Functions for Dont-Stop Tasks
    console.log('\nStep 3: Deploying Lambda functions for dont-stop tasks...');

    // Create IAM role for Lambda (prerequisite)
    const lambdaRoleArn = 'arn:aws:iam::' + (process.env.AWS_ACCOUNT_ID || '123456789012') + ':role/lambda-execution-role';

    // Sample Lambda function code
    const lambdaCode = `
exports.handler = async (event) => {
  console.log('Claudient dont-stop task triggered');
  console.log('Event:', JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Claudient dont-stop task executed successfully',
      timestamp: new Date().toISOString(),
    }),
  };
};
`;

    // Create Lambda deployment code zip (would normally be actual zip)
    const lambdaCodeFile = '/tmp/lambda-dont-stop-code.js';
    require('fs').writeFileSync(lambdaCodeFile, lambdaCode);

    const lambdaResult = await deployment.deployLambda({
      functionName: 'claudient-dont-stop-task',
      runtime: 'nodejs18.x',
      handler: 'index.handler',
      roleArn: lambdaRoleArn,
      codeZip: lambdaCodeFile,
      timeout: 300,
      memorySize: 256,
      ephemeralStorageSize: 512,
      environment: {
        SKILLS_BUCKET: 'claudient-skills-storage',
        STATE_TABLE: 'claudient-deployment-state',
        ENVIRONMENT: 'production',
      },
      description: 'Claudient dont-stop task executor - maintains deployment continuity',
    });
    console.log(`Lambda Deployment Result:`, lambdaResult);

    // Create EventBridge rule for periodic execution
    const eventRuleResult = await deployment.createLambdaEventRule({
      functionName: 'claudient-dont-stop-task',
      ruleName: 'claudient-dont-stop-schedule',
      scheduleExpression: 'rate(5 minutes)',
      description: 'Trigger Claudient dont-stop task every 5 minutes',
    });
    console.log(`EventBridge Rule Result:`, eventRuleResult);

    // 4. Deploy ECS Cluster (for long-running services)
    console.log('\nStep 4: Deploying ECS cluster for long-running services...');
    const ecsResult = await deployment.deployECS({
      clusterName: 'claudient-ecs-cluster',
      serviceName: 'claudient-orchestrator',
      taskDefinitionFamily: 'claudient-orchestrator-task',
      desiredCount: 2,
      launchType: 'FARGATE',
      image: 'your-registry/claudient-orchestrator:latest',
      cpu: '256',
      memory: '512',
      containerPort: 8080,
      environment: {
        SKILLS_BUCKET: 'claudient-skills-storage',
        STATE_TABLE: 'claudient-deployment-state',
        AWS_REGION: 'us-east-1',
      },
      logGroupName: '/ecs/claudient/orchestrator',
      subnets: ['subnet-12345678'], // Replace with actual subnet
      securityGroups: ['sg-12345678'], // Replace with actual security group
      assignPublicIp: false,
    });
    console.log(`ECS Deployment Result:`, ecsResult);

    // 5. Generate CloudFormation Template
    console.log('\nStep 5: Generating CloudFormation template...');
    const templateDir = path.join(__dirname, '..', 'deployments', 'cloudformation');
    const templateConfig = {
      stackName: 'claudient-main-stack',
      resources: {
        ecsCluster: {
          name: 'claudient-ecs-cluster',
          containerInsights: true,
        },
        lambda: {
          functionName: 'claudient-dont-stop-task',
          runtime: 'nodejs18.x',
          handler: 'index.handler',
          roleArn: lambdaRoleArn,
          timeout: 300,
          memorySize: 256,
          environment: {
            SKILLS_BUCKET: 'claudient-skills-storage',
            STATE_TABLE: 'claudient-deployment-state',
          },
        },
        s3: {
          bucketName: 'claudient-skills-storage',
          versioningEnabled: true,
          serverSideEncryption: true,
          publicRead: false,
        },
        dynamodb: {
          tableName: 'claudient-deployment-state',
          partitionKey: { name: 'deploymentId', type: 'S' },
          sortKey: { name: 'timestamp', type: 'N' },
          billingMode: 'PAY_PER_REQUEST',
        },
        vpc: {
          cidrBlock: '10.0.0.0/16',
          subnets: [
            { cidrBlock: '10.0.1.0/24', availabilityZone: 'us-east-1a' },
            { cidrBlock: '10.0.2.0/24', availabilityZone: 'us-east-1b' },
          ],
        },
      },
    };

    const templatePath = deployment.saveCloudFormationTemplate(templateConfig, templateDir);
    console.log(`CloudFormation template saved to: ${templatePath}`);

    // 6. Cost Optimization Analysis
    console.log('\nStep 6: Cost optimization analysis...');
    const recommendations = deployment.getCostOptimizationRecommendations({
      ecs: { launchType: 'FARGATE', desiredCount: 2 },
      lambda: { memorySize: 256 },
      s3: { lifecycleRules: [{ Id: 'TransitionToGlacier', Status: 'Enabled' }] },
      dynamodb: { billingMode: 'PAY_PER_REQUEST' },
    });

    console.log('\nCost Optimization Recommendations:');
    recommendations.forEach((rec) => {
      console.log(`  [${rec.type}] ${rec.service}: ${rec.recommendation}`);
      console.log(`    Estimated Savings: ${rec.estimatedSavings}\n`);
    });

    // 7. Health Checks
    console.log('\nStep 7: Performing health checks...');
    const ecsHealthCheck = await deployment.healthCheckECS('claudient-ecs-cluster', 'claudient-orchestrator');
    console.log(`ECS Health Check:`, ecsHealthCheck);

    const lambdaHealthCheck = await deployment.healthCheckLambda('claudient-dont-stop-task');
    console.log(`Lambda Health Check:`, lambdaHealthCheck);

    // 8. Save Deployment State
    console.log('\nStep 8: Saving deployment state...');
    const stateFile = path.join(__dirname, '..', 'deployments', 'aws-deployment-state.json');
    deployment.saveState(stateFile);
    console.log(`Deployment state saved to: ${stateFile}`);

    // Final summary
    console.log('\n=== Deployment Summary ===');
    console.log('Deployment State:', deployment.getDeploymentState());

    console.log('\n✓ Claudient AWS deployment completed successfully');
    console.log('Services deployed:');
    console.log('  - S3 bucket for skills storage');
    console.log('  - DynamoDB table for state management');
    console.log('  - Lambda function for dont-stop tasks');
    console.log('  - ECS cluster for orchestration');
    console.log('  - CloudFormation template for infrastructure as code');

  } catch (error) {
    console.error('\n✗ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Example: Load and redeploy from state
async function redeployFromState() {
  const deployment = new AWSDeployment({
    region: 'us-east-1',
    profile: 'default',
  });

  const stateFile = path.join(__dirname, '..', 'deployments', 'aws-deployment-state.json');
  deployment.loadState(stateFile);

  console.log('Current Deployment State:');
  Object.entries(deployment.getDeploymentState()).forEach(([name, state]) => {
    console.log(`  ${name}: ${state.type} (${state.status})`);
  });
}

// Example: Cost estimation
function estimateCosts() {
  console.log('\n=== AWS Cost Estimation (Monthly) ===');

  const costBreakdown = {
    'ECS Fargate (2 tasks @ 256 CPU, 512 MB)': '$0.04711 per hour = ~$34/month',
    'Lambda (5 min execution, 256MB, 8640 executions/month)': '~$3/month',
    'S3 Storage (100 GB)': '~$2.30/month',
    'S3 Data Transfer': '~$0.50/month',
    'DynamoDB (PAY_PER_REQUEST)': '~$5-50/month (variable)',
    'CloudWatch Logs': '~$5/month',
    'Data Transfer (1 TB/month)': '~$85/month',
  };

  Object.entries(costBreakdown).forEach(([service, cost]) => {
    console.log(`${service}: ${cost}`);
  });

  console.log('\nEstimated Total: $130-200/month');
}

// Run examples
async function runExamples() {
  const args = process.argv.slice(2);
  const command = args[0] || 'deploy';

  switch (command) {
    case 'deploy':
      await deployClaudientToAWS();
      break;
    case 'check-state':
      await redeployFromState();
      break;
    case 'estimate-costs':
      estimateCosts();
      break;
    default:
      console.log('Usage: node aws-deployment-integration-example.js [deploy|check-state|estimate-costs]');
  }
}

if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = { deployClaudientToAWS, redeployFromState, estimateCosts };

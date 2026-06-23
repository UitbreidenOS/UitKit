/**
 * AWS Deployment Module
 * Manages ECS/EKS, Lambda, S3, DynamoDB, and CloudFormation templates
 * Cost optimization and serverless integration for dont-stop tasks
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const EventEmitter = require('events');

class AWSDeployment extends EventEmitter {
  constructor(config = {}) {
    super();
    this.region = config.region || process.env.AWS_REGION || 'us-east-1';
    this.profile = config.profile || process.env.AWS_PROFILE || 'default';
    this.accountId = config.accountId || process.env.AWS_ACCOUNT_ID;
    this.awsCliPath = config.awsCliPath || 'aws';
    this.terraformPath = config.terraformPath || 'terraform';
    this.quiet = config.quiet || false;
    this.dryRun = config.dryRun || false;
    this.costOptimization = config.costOptimization !== false;
    this.deploymentState = {};
    this.tags = config.tags || { ManagedBy: 'Claudient', Environment: 'production' };
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

  buildAwsCommand(subcommand) {
    const cmd = [this.awsCliPath];
    if (this.profile !== 'default') {
      cmd.push(`--profile=${this.profile}`);
    }
    cmd.push(`--region=${this.region}`);
    return cmd.concat(subcommand);
  }

  // ============ ECS Deployment ============
  async deployECS(config) {
    const {
      clusterName,
      serviceName,
      taskDefinitionFamily,
      desiredCount = 1,
      launchType = 'EC2', // 'EC2' or 'FARGATE'
      image,
      cpu = '256',
      memory = '512',
      containerPort = 3000,
      hostPort = null,
      environment = {},
      logGroupName = null,
      tags = {},
    } = config;

    if (!clusterName || !serviceName || !taskDefinitionFamily || !image) {
      throw new Error('clusterName, serviceName, taskDefinitionFamily, and image are required');
    }

    this.log(`Deploying ECS service: ${serviceName} on cluster: ${clusterName}`);

    if (this.dryRun) {
      this.log('DRY RUN: ECS deployment skipped');
      return { status: 'dry-run', serviceName, clusterName };
    }

    try {
      // Create CloudWatch log group
      const finalLogGroupName = logGroupName || `/ecs/${clusterName}/${serviceName}`;
      try {
        const logCmd = this.buildAwsCommand([
          'logs', 'create-log-group',
          `--log-group-name=${finalLogGroupName}`,
        ]);
        execSync(logCmd.join(' '), { encoding: 'utf-8' });
        this.log(`CloudWatch log group created: ${finalLogGroupName}`);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          throw err;
        }
        this.log(`Log group already exists: ${finalLogGroupName}`);
      }

      // Register task definition
      const containerDefinitions = [
        {
          name: serviceName,
          image,
          cpu: parseInt(cpu),
          memory: parseInt(memory),
          portMappings: [
            {
              containerPort: parseInt(containerPort),
              hostPort: hostPort ? parseInt(hostPort) : 0,
              protocol: 'tcp',
            },
          ],
          environment: Object.entries(environment).map(([key, value]) => ({
            name: key,
            value: String(value),
          })),
          logConfiguration: {
            logDriver: 'awslogs',
            options: {
              'awslogs-group': finalLogGroupName,
              'awslogs-region': this.region,
              'awslogs-stream-prefix': 'ecs',
            },
          },
        },
      ];

      const taskDef = {
        family: taskDefinitionFamily,
        networkMode: launchType === 'FARGATE' ? 'awsvpc' : 'bridge',
        requiresCompatibilities: [launchType],
        cpu: launchType === 'FARGATE' ? cpu : undefined,
        memory: launchType === 'FARGATE' ? memory : undefined,
        containerDefinitions,
        tags: Object.entries({ ...this.tags, ...tags }).map(([key, value]) => ({
          key,
          value,
        })),
      };

      const taskDefFile = `/tmp/task-def-${Date.now()}.json`;
      fs.writeFileSync(taskDefFile, JSON.stringify(taskDef, null, 2));

      const regCmd = this.buildAwsCommand([
        'ecs', 'register-task-definition',
        `--cli-input-json=file://${taskDefFile}`,
      ]);

      const regResult = execSync(regCmd.join(' '), { encoding: 'utf-8' });
      const taskDefResponse = JSON.parse(regResult);
      const taskDefinitionArn = taskDefResponse.taskDefinition.taskDefinitionArn;
      fs.unlinkSync(taskDefFile);

      this.log(`Task definition registered: ${taskDefinitionArn}`);

      // Create or update service
      const serviceConfig = {
        cluster: clusterName,
        serviceName,
        taskDefinition: taskDefinitionArn,
        desiredCount,
        launchType,
      };

      if (launchType === 'FARGATE') {
        serviceConfig.networkConfiguration = {
          awsvpcConfiguration: {
            subnets: config.subnets || [],
            securityGroups: config.securityGroups || [],
            assignPublicIp: config.assignPublicIp ? 'ENABLED' : 'DISABLED',
          },
        };
      }

      try {
        const updateCmd = this.buildAwsCommand([
          'ecs', 'update-service',
          `--cluster=${clusterName}`,
          `--service=${serviceName}`,
          `--task-definition=${taskDefinitionArn}`,
          `--desired-count=${desiredCount}`,
        ]);

        execSync(updateCmd.join(' '), { encoding: 'utf-8' });
        this.log(`Service updated: ${serviceName}`);
      } catch (err) {
        if (err.message.includes('The specified service could not be found')) {
          // Create new service
          const createCmd = this.buildAwsCommand([
            'ecs', 'create-service',
            `--cluster=${clusterName}`,
            `--service-name=${serviceName}`,
            `--task-definition=${taskDefinitionArn}`,
            `--desired-count=${desiredCount}`,
            `--launch-type=${launchType}`,
          ]);

          if (config.subnets && launchType === 'FARGATE') {
            createCmd.push(`--network-configuration=awsvpcConfiguration={subnets=[${config.subnets.map(s => `'${s}'`).join(',')}],securityGroups=[${config.securityGroups?.map(sg => `'${sg}'`).join(',')}]}`);
          }

          execSync(createCmd.join(' '), { encoding: 'utf-8' });
          this.log(`Service created: ${serviceName}`);
        } else {
          throw err;
        }
      }

      this.deploymentState[serviceName] = {
        type: 'ecs',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
        taskDefinitionArn,
      };
      this.emit('deployment-complete', { type: 'ecs', serviceName, clusterName });

      return {
        status: 'success',
        serviceName,
        clusterName,
        taskDefinitionArn,
        desiredCount,
      };
    } catch (err) {
      this.error(`ECS deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ EKS Deployment ============
  async deployEKS(config) {
    const {
      clusterName,
      version = '1.28',
      roleArn,
      subnets = [],
      securityGroupIds = [],
      logging = {},
      tags = {},
    } = config;

    if (!clusterName || !roleArn || subnets.length === 0) {
      throw new Error('clusterName, roleArn, and subnets are required');
    }

    this.log(`Deploying EKS cluster: ${clusterName}`);

    if (this.dryRun) {
      this.log('DRY RUN: EKS deployment skipped');
      return { status: 'dry-run', clusterName };
    }

    try {
      const createCmd = this.buildAwsCommand([
        'eks', 'create-cluster',
        `--name=${clusterName}`,
        `--version=${version}`,
        `--role-arn=${roleArn}`,
        `--resources-vpc-config=subnetIds=[${subnets.map(s => `'${s}'`).join(',')}]`,
        '--cli-input-json=file:/dev/stdin',
      ]);

      const clusterConfig = {
        name: clusterName,
        version,
        roleArn,
        resourcesVpcConfig: {
          subnetIds: subnets,
          securityGroupIds: securityGroupIds.length > 0 ? securityGroupIds : undefined,
        },
        logging: {
          clusterLogging: [
            {
              enabled: logging.enabled !== false,
              types: logging.types || ['api', 'audit', 'authenticator', 'controllerManager', 'scheduler'],
            },
          ],
        },
        tags: { ...this.tags, ...tags },
      };

      const result = execSync(
        `echo '${JSON.stringify(clusterConfig)}' | ${this.buildAwsCommand(['eks', 'create-cluster']).join(' ')}`,
        { encoding: 'utf-8' }
      );

      this.log(`EKS cluster created: ${clusterName}`);

      this.deploymentState[clusterName] = {
        type: 'eks',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'eks', clusterName });

      return { status: 'success', clusterName, version };
    } catch (err) {
      this.error(`EKS deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Lambda Deployment for Dont-Stop Tasks ============
  async deployLambda(config) {
    const {
      functionName,
      runtime = 'nodejs18.x',
      handler = 'index.handler',
      roleArn,
      codeZip,
      codeS3Bucket = null,
      codeS3Key = null,
      timeout = 300,
      memorySize = 128,
      environment = {},
      layers = [],
      ephemeralStorageSize = 512,
      tags = {},
      description = '',
    } = config;

    if (!functionName || !roleArn) {
      throw new Error('functionName and roleArn are required');
    }

    if (!codeZip && (!codeS3Bucket || !codeS3Key)) {
      throw new Error('Either codeZip or (codeS3Bucket and codeS3Key) is required');
    }

    this.log(`Deploying Lambda function: ${functionName}`);

    if (this.dryRun) {
      this.log('DRY RUN: Lambda deployment skipped');
      return { status: 'dry-run', functionName };
    }

    try {
      let createCmd = this.buildAwsCommand([
        'lambda', 'create-function',
        `--function-name=${functionName}`,
        `--runtime=${runtime}`,
        `--role=${roleArn}`,
        `--handler=${handler}`,
        `--timeout=${timeout}`,
        `--memory-size=${memorySize}`,
        `--ephemeral-storage=/Size=${ephemeralStorageSize}`,
        `--description=${description || `Claudient dont-stop task: ${functionName}`}`,
      ]);

      if (codeZip && fs.existsSync(codeZip)) {
        createCmd.push(`--zip-file=fileb://${codeZip}`);
      } else if (codeS3Bucket && codeS3Key) {
        createCmd.push(`--code=S3Bucket=${codeS3Bucket},S3Key=${codeS3Key}`);
      }

      if (layers.length > 0) {
        createCmd.push(`--layers=${layers.join(' ')}`);
      }

      Object.entries(environment).forEach(([key, value]) => {
        createCmd.push(`--environment Variables={${key}=${value}}`);
      });

      Object.entries({ ...this.tags, ...tags }).forEach(([key, value]) => {
        createCmd.push(`--tags=${key}=${value}`);
      });

      try {
        execSync(createCmd.join(' '), { encoding: 'utf-8' });
        this.log(`Lambda function created: ${functionName}`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          this.log(`Lambda function already exists: ${functionName}, updating...`);

          const updateCmd = this.buildAwsCommand([
            'lambda', 'update-function-code',
            `--function-name=${functionName}`,
          ]);

          if (codeZip && fs.existsSync(codeZip)) {
            updateCmd.push(`--zip-file=fileb://${codeZip}`);
          } else if (codeS3Bucket && codeS3Key) {
            updateCmd.push(`--s3-bucket=${codeS3Bucket}`);
            updateCmd.push(`--s3-key=${codeS3Key}`);
          }

          execSync(updateCmd.join(' '), { encoding: 'utf-8' });
          this.log(`Lambda function code updated: ${functionName}`);
        } else {
          throw err;
        }
      }

      this.deploymentState[functionName] = {
        type: 'lambda',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'lambda', functionName });

      return {
        status: 'success',
        functionName,
        runtime,
        memorySize,
        timeout,
      };
    } catch (err) {
      this.error(`Lambda deployment failed: ${err.message}`);
      throw err;
    }
  }

  async createLambdaEventRule(config) {
    const {
      functionName,
      ruleName,
      scheduleExpression, // 'rate(5 minutes)' or 'cron(0 12 * * ? *)'
      description = '',
    } = config;

    if (!functionName || !ruleName || !scheduleExpression) {
      throw new Error('functionName, ruleName, and scheduleExpression are required');
    }

    this.log(`Creating EventBridge rule: ${ruleName} for Lambda: ${functionName}`);

    if (this.dryRun) {
      this.log('DRY RUN: EventBridge rule creation skipped');
      return { status: 'dry-run', ruleName };
    }

    try {
      // Create rule
      const ruleCmd = this.buildAwsCommand([
        'events', 'put-rule',
        `--name=${ruleName}`,
        `--schedule-expression='${scheduleExpression}'`,
        `--description='${description}'`,
        '--state=ENABLED',
      ]);

      execSync(ruleCmd.join(' '), { encoding: 'utf-8' });
      this.log(`EventBridge rule created: ${ruleName}`);

      // Add Lambda as target
      const targetCmd = this.buildAwsCommand([
        'events', 'put-targets',
        `--rule=${ruleName}`,
        `--targets=Id=1,Arn=arn:aws:lambda:${this.region}:${this.accountId}:function:${functionName},RoleArn=arn:aws:iam::${this.accountId}:role/service-role/EventBridgeLambdaRole`,
      ]);

      execSync(targetCmd.join(' '), { encoding: 'utf-8' });
      this.log(`Lambda target added to rule: ${ruleName}`);

      // Grant invoke permission
      const permCmd = this.buildAwsCommand([
        'lambda', 'add-permission',
        `--function-name=${functionName}`,
        `--statement-id=AllowEventBridgeInvoke`,
        '--action=lambda:InvokeFunction',
        '--principal=events.amazonaws.com',
        `--source-arn=arn:aws:events:${this.region}:${this.accountId}:rule/${ruleName}`,
      ]);

      execSync(permCmd.join(' '), { encoding: 'utf-8' });
      this.log(`Lambda invoke permission granted for EventBridge`);

      return { status: 'success', ruleName, functionName, scheduleExpression };
    } catch (err) {
      this.error(`EventBridge rule creation failed: ${err.message}`);
      throw err;
    }
  }

  // ============ S3 Deployment for Skill Storage ============
  async deployS3(config) {
    const {
      bucketName,
      versioningEnabled = true,
      serverSideEncryption = true,
      publicRead = false,
      corsRules = [],
      lifecycleRules = [],
      tags = {},
    } = config;

    if (!bucketName) {
      throw new Error('bucketName is required');
    }

    this.log(`Deploying S3 bucket: ${bucketName}`);

    if (this.dryRun) {
      this.log('DRY RUN: S3 deployment skipped');
      return { status: 'dry-run', bucketName };
    }

    try {
      // Create bucket
      let createCmd = this.buildAwsCommand([
        's3', 'mb',
        `s3://${bucketName}`,
      ]);

      // Add region if not us-east-1
      if (this.region !== 'us-east-1') {
        createCmd = this.buildAwsCommand([
          's3api', 'create-bucket',
          `--bucket=${bucketName}`,
          `--region=${this.region}`,
          `--create-bucket-configuration=LocationConstraint=${this.region}`,
        ]);
      }

      try {
        execSync(createCmd.join(' '), { encoding: 'utf-8' });
        this.log(`S3 bucket created: ${bucketName}`);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          throw err;
        }
        this.log(`S3 bucket already exists: ${bucketName}`);
      }

      // Enable versioning
      if (versioningEnabled) {
        const versionCmd = this.buildAwsCommand([
          's3api', 'put-bucket-versioning',
          `--bucket=${bucketName}`,
          '--versioning-configuration=Status=Enabled',
        ]);
        execSync(versionCmd.join(' '), { encoding: 'utf-8' });
        this.log('Versioning enabled');
      }

      // Enable server-side encryption
      if (serverSideEncryption) {
        const encryptionConfig = {
          Rules: [
            {
              ApplyServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        };
        const encFile = `/tmp/encryption-${Date.now()}.json`;
        fs.writeFileSync(encFile, JSON.stringify(encryptionConfig));

        const encCmd = this.buildAwsCommand([
          's3api', 'put-bucket-encryption',
          `--bucket=${bucketName}`,
          `--server-side-encryption-configuration=file://${encFile}`,
        ]);
        try {
          execSync(encCmd.join(' '), { encoding: 'utf-8' });
          this.log('Server-side encryption enabled');
        } catch (err) {
          this.log('Server-side encryption already configured');
        }
        fs.unlinkSync(encFile);
      }

      // Add bucket tags
      if (Object.keys(tags).length > 0 || Object.keys(this.tags).length > 0) {
        const allTags = { ...this.tags, ...tags };
        const tagSet = Object.entries(allTags).map(([key, value]) => ({
          Key: key,
          Value: value,
        }));

        const tagsFile = `/tmp/tags-${Date.now()}.json`;
        fs.writeFileSync(tagsFile, JSON.stringify({ TagSet: tagSet }));

        const tagCmd = this.buildAwsCommand([
          's3api', 'put-bucket-tagging',
          `--bucket=${bucketName}`,
          `--tagging=file://${tagsFile}`,
        ]);
        execSync(tagCmd.join(' '), { encoding: 'utf-8' });
        fs.unlinkSync(tagsFile);
        this.log('Tags applied');
      }

      // Add CORS rules
      if (corsRules.length > 0) {
        const corsConfig = { CORSRules: corsRules };
        const corsFile = `/tmp/cors-${Date.now()}.json`;
        fs.writeFileSync(corsFile, JSON.stringify(corsConfig));

        const corsCmd = this.buildAwsCommand([
          's3api', 'put-bucket-cors',
          `--bucket=${bucketName}`,
          `--cors-configuration=file://${corsFile}`,
        ]);
        execSync(corsCmd.join(' '), { encoding: 'utf-8' });
        fs.unlinkSync(corsFile);
        this.log('CORS rules applied');
      }

      // Add lifecycle rules
      if (lifecycleRules.length > 0) {
        const lifecycleConfig = { Rules: lifecycleRules };
        const lifecycleFile = `/tmp/lifecycle-${Date.now()}.json`;
        fs.writeFileSync(lifecycleFile, JSON.stringify(lifecycleConfig));

        const lifecycleCmd = this.buildAwsCommand([
          's3api', 'put-bucket-lifecycle-configuration',
          `--bucket=${bucketName}`,
          `--lifecycle-configuration=file://${lifecycleFile}`,
        ]);
        execSync(lifecycleCmd.join(' '), { encoding: 'utf-8' });
        fs.unlinkSync(lifecycleFile);
        this.log('Lifecycle rules applied');
      }

      // Block public access if needed
      if (!publicRead) {
        const blockCmd = this.buildAwsCommand([
          's3api', 'put-public-access-block',
          `--bucket=${bucketName}`,
          '--public-access-block-configuration=BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
        ]);
        execSync(blockCmd.join(' '), { encoding: 'utf-8' });
        this.log('Public access blocked');
      }

      this.deploymentState[bucketName] = {
        type: 's3',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 's3', bucketName });

      return { status: 'success', bucketName, versioningEnabled };
    } catch (err) {
      this.error(`S3 deployment failed: ${err.message}`);
      throw err;
    }
  }

  async uploadSkillsToS3(bucketName, skillsDir, prefix = 'skills/') {
    if (!fs.existsSync(skillsDir)) {
      throw new Error(`Skills directory not found: ${skillsDir}`);
    }

    this.log(`Uploading skills from ${skillsDir} to s3://${bucketName}/${prefix}`);

    const files = this.getFilesRecursive(skillsDir);
    let uploaded = 0;

    for (const file of files) {
      const relPath = path.relative(skillsDir, file);
      const s3Key = `${prefix}${relPath}`;

      const uploadCmd = this.buildAwsCommand([
        's3', 'cp',
        file,
        `s3://${bucketName}/${s3Key}`,
      ]);

      try {
        execSync(uploadCmd.join(' '), { encoding: 'utf-8' });
        uploaded++;
      } catch (err) {
        this.error(`Failed to upload ${file}: ${err.message}`);
      }
    }

    this.log(`Uploaded ${uploaded} skill files to S3`);
    return { bucketName, uploaded, totalFiles: files.length };
  }

  getFilesRecursive(dir) {
    let files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(this.getFilesRecursive(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  // ============ DynamoDB Deployment for State Storage ============
  async deployDynamoDB(config) {
    const {
      tableName,
      partitionKey, // { name: 'id', type: 'S' }
      sortKey = null, // { name: 'timestamp', type: 'N' }
      billingMode = 'PAY_PER_REQUEST', // 'PROVISIONED' or 'PAY_PER_REQUEST'
      readCapacity = 5,
      writeCapacity = 5,
      streamSpecification = null,
      ttlAttribute = null,
      globalSecondaryIndexes = [],
      tags = {},
    } = config;

    if (!tableName || !partitionKey) {
      throw new Error('tableName and partitionKey are required');
    }

    this.log(`Deploying DynamoDB table: ${tableName}`);

    if (this.dryRun) {
      this.log('DRY RUN: DynamoDB deployment skipped');
      return { status: 'dry-run', tableName };
    }

    try {
      const tableSchema = {
        TableName: tableName,
        KeySchema: [
          { AttributeName: partitionKey.name, KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
          { AttributeName: partitionKey.name, AttributeType: partitionKey.type },
        ],
        BillingMode: billingMode,
      };

      if (billingMode === 'PROVISIONED') {
        tableSchema.BillingMode = 'PROVISIONED';
        tableSchema.ProvisionedThroughput = {
          ReadCapacityUnits: readCapacity,
          WriteCapacityUnits: writeCapacity,
        };
      }

      if (sortKey) {
        tableSchema.KeySchema.push({ AttributeName: sortKey.name, KeyType: 'RANGE' });
        tableSchema.AttributeDefinitions.push({
          AttributeName: sortKey.name,
          AttributeType: sortKey.type,
        });
      }

      if (streamSpecification) {
        tableSchema.StreamSpecification = streamSpecification;
      }

      if (globalSecondaryIndexes.length > 0) {
        tableSchema.GlobalSecondaryIndexes = globalSecondaryIndexes;
      }

      if (Object.keys(tags).length > 0 || Object.keys(this.tags).length > 0) {
        tableSchema.Tags = Object.entries({ ...this.tags, ...tags }).map(([key, value]) => ({
          Key: key,
          Value: value,
        }));
      }

      const tableFile = `/tmp/dynamodb-table-${Date.now()}.json`;
      fs.writeFileSync(tableFile, JSON.stringify(tableSchema, null, 2));

      const createCmd = this.buildAwsCommand([
        'dynamodb', 'create-table',
        `--cli-input-json=file://${tableFile}`,
      ]);

      try {
        execSync(createCmd.join(' '), { encoding: 'utf-8' });
        this.log(`DynamoDB table created: ${tableName}`);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          throw err;
        }
        this.log(`DynamoDB table already exists: ${tableName}`);
      }

      fs.unlinkSync(tableFile);

      // Enable TTL if specified
      if (ttlAttribute) {
        const ttlCmd = this.buildAwsCommand([
          'dynamodb', 'update-time-to-live',
          `--table-name=${tableName}`,
          `--time-to-live-specification=AttributeName=${ttlAttribute},Enabled=true`,
        ]);

        try {
          execSync(ttlCmd.join(' '), { encoding: 'utf-8' });
          this.log(`TTL enabled for attribute: ${ttlAttribute}`);
        } catch (err) {
          this.log(`TTL configuration skipped: ${err.message}`);
        }
      }

      this.deploymentState[tableName] = {
        type: 'dynamodb',
        status: 'success',
        timestamp: new Date().toISOString(),
        config,
      };
      this.emit('deployment-complete', { type: 'dynamodb', tableName });

      return { status: 'success', tableName, partitionKey: partitionKey.name };
    } catch (err) {
      this.error(`DynamoDB deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ CloudFormation Templates ============
  generateCloudFormationTemplate(config) {
    const {
      stackName,
      resources = {},
    } = config;

    const template = {
      AWSTemplateFormatVersion: '2010-09-09',
      Description: `Claudient deployment stack: ${stackName}`,
      Resources: {},
      Outputs: {},
    };

    // ECS Cluster
    if (resources.ecsCluster) {
      template.Resources.ECSCluster = {
        Type: 'AWS::ECS::Cluster',
        Properties: {
          ClusterName: resources.ecsCluster.name,
          ClusterSettings: [
            {
              Name: 'containerInsights',
              Value: resources.ecsCluster.containerInsights ? 'enabled' : 'disabled',
            },
          ],
          Tags: Object.entries(this.tags).map(([key, value]) => ({
            Key: key,
            Value: value,
          })),
        },
      };

      template.Outputs.ECSClusterName = {
        Value: { Ref: 'ECSCluster' },
        Description: 'ECS Cluster Name',
      };
    }

    // Lambda Function
    if (resources.lambda) {
      template.Resources.LambdaFunction = {
        Type: 'AWS::Lambda::Function',
        Properties: {
          FunctionName: resources.lambda.functionName,
          Runtime: resources.lambda.runtime,
          Handler: resources.lambda.handler,
          Role: resources.lambda.roleArn,
          Timeout: resources.lambda.timeout || 300,
          MemorySize: resources.lambda.memorySize || 128,
          Code: resources.lambda.code || { ZipFile: 'exports.handler = async () => { return { statusCode: 200 }; };' },
          Environment: resources.lambda.environment ? {
            Variables: resources.lambda.environment,
          } : undefined,
          Tags: Object.entries(this.tags).map(([key, value]) => ({
            Key: key,
            Value: value,
          })),
        },
      };

      template.Outputs.LambdaFunctionArn = {
        Value: { 'Fn::GetAtt': ['LambdaFunction', 'Arn'] },
        Description: 'Lambda Function ARN',
      };
    }

    // S3 Bucket
    if (resources.s3) {
      template.Resources.S3Bucket = {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: resources.s3.bucketName,
          VersioningConfiguration: {
            Status: resources.s3.versioningEnabled ? 'Enabled' : 'Suspended',
          },
          BucketEncryption: resources.s3.serverSideEncryption ? {
            ServerSideEncryptionConfiguration: [
              {
                ServerSideEncryptionByDefault: {
                  SSEAlgorithm: 'AES256',
                },
              },
            ],
          } : undefined,
          PublicAccessBlockConfiguration: !resources.s3.publicRead ? {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
          } : undefined,
          Tags: Object.entries(this.tags).map(([key, value]) => ({
            Key: key,
            Value: value,
          })),
        },
      };

      template.Outputs.S3BucketName = {
        Value: { Ref: 'S3Bucket' },
        Description: 'S3 Bucket Name',
      };
    }

    // DynamoDB Table
    if (resources.dynamodb) {
      template.Resources.DynamoDBTable = {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: resources.dynamodb.tableName,
          KeySchema: [
            { AttributeName: resources.dynamodb.partitionKey.name, KeyType: 'HASH' },
          ],
          AttributeDefinitions: [
            { AttributeName: resources.dynamodb.partitionKey.name, AttributeType: resources.dynamodb.partitionKey.type },
          ],
          BillingMode: resources.dynamodb.billingMode || 'PAY_PER_REQUEST',
          ProvisionedThroughput: resources.dynamodb.billingMode === 'PROVISIONED' ? {
            ReadCapacityUnits: resources.dynamodb.readCapacity || 5,
            WriteCapacityUnits: resources.dynamodb.writeCapacity || 5,
          } : undefined,
          Tags: Object.entries(this.tags).map(([key, value]) => ({
            Key: key,
            Value: value,
          })),
        },
      };

      template.Outputs.DynamoDBTableName = {
        Value: { Ref: 'DynamoDBTable' },
        Description: 'DynamoDB Table Name',
      };
    }

    // VPC (if specified)
    if (resources.vpc) {
      template.Resources.VPC = {
        Type: 'AWS::EC2::VPC',
        Properties: {
          CidrBlock: resources.vpc.cidrBlock || '10.0.0.0/16',
          EnableDnsHostnames: true,
          EnableDnsSupport: true,
          Tags: Object.entries(this.tags).map(([key, value]) => ({
            Key: key,
            Value: value,
          })),
        },
      };

      if (resources.vpc.subnets) {
        resources.vpc.subnets.forEach((subnet, idx) => {
          template.Resources[`Subnet${idx}`] = {
            Type: 'AWS::EC2::Subnet',
            Properties: {
              VpcId: { Ref: 'VPC' },
              CidrBlock: subnet.cidrBlock,
              AvailabilityZone: subnet.availabilityZone || `${this.region}${String.fromCharCode(97 + idx)}`,
              Tags: Object.entries(this.tags).map(([key, value]) => ({
                Key: key,
                Value: value,
              })),
            },
          };
        });
      }

      template.Outputs.VPCId = {
        Value: { Ref: 'VPC' },
        Description: 'VPC ID',
      };
    }

    return template;
  }

  saveCloudFormationTemplate(config, outputDir) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const template = this.generateCloudFormationTemplate(config);
    const filePath = path.join(outputDir, `${config.stackName}-template.yaml`);

    // Convert to YAML (simplified JSON output)
    const yaml = this.jsonToYAML(template);
    fs.writeFileSync(filePath, yaml);
    this.log(`CloudFormation template saved to ${filePath}`);

    return filePath;
  }

  jsonToYAML(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    let yaml = '';

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        yaml += this.jsonToYAML(value, indent + 2);
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            yaml += `${spaces}  -\n`;
            yaml += this.jsonToYAML(item, indent + 4);
          } else {
            yaml += `${spaces}  - ${item}\n`;
          }
        });
      } else if (typeof value === 'string') {
        yaml += `${spaces}${key}: '${value}'\n`;
      } else if (typeof value === 'boolean') {
        yaml += `${spaces}${key}: ${value}\n`;
      } else if (typeof value === 'number') {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    });

    return yaml;
  }

  async deployCloudFormationStack(stackName, templateFile) {
    this.log(`Deploying CloudFormation stack: ${stackName}`);

    if (!fs.existsSync(templateFile)) {
      throw new Error(`Template file not found: ${templateFile}`);
    }

    if (this.dryRun) {
      this.log('DRY RUN: CloudFormation deployment skipped');
      return { status: 'dry-run', stackName };
    }

    try {
      const createCmd = this.buildAwsCommand([
        'cloudformation', 'deploy',
        `--template-file=${templateFile}`,
        `--stack-name=${stackName}`,
        '--capabilities=CAPABILITY_IAM,CAPABILITY_NAMED_IAM',
      ]);

      execSync(createCmd.join(' '), { encoding: 'utf-8' });
      this.log(`CloudFormation stack deployed: ${stackName}`);

      this.deploymentState[stackName] = {
        type: 'cloudformation',
        status: 'success',
        timestamp: new Date().toISOString(),
        templateFile,
      };
      this.emit('deployment-complete', { type: 'cloudformation', stackName });

      return { status: 'success', stackName };
    } catch (err) {
      this.error(`CloudFormation deployment failed: ${err.message}`);
      throw err;
    }
  }

  // ============ Cost Optimization ============
  getCostOptimizationRecommendations(deploymentConfig) {
    const recommendations = [];

    // ECS recommendations
    if (deploymentConfig.ecs) {
      if (deploymentConfig.ecs.launchType === 'EC2') {
        recommendations.push({
          service: 'ECS',
          type: 'cost-saving',
          recommendation: 'Consider using Spot Instances for non-critical workloads',
          estimatedSavings: '70%',
        });
      }

      if (deploymentConfig.ecs.desiredCount > 1) {
        recommendations.push({
          service: 'ECS',
          type: 'resource-optimization',
          recommendation: 'Enable auto-scaling based on CPU/memory metrics',
          estimatedSavings: '20-30%',
        });
      }
    }

    // Lambda recommendations
    if (deploymentConfig.lambda) {
      if (deploymentConfig.lambda.memorySize > 1024) {
        recommendations.push({
          service: 'Lambda',
          type: 'cost-saving',
          recommendation: 'Consider breaking down function into smaller microservices',
          estimatedSavings: '15-25%',
        });
      }

      if (!deploymentConfig.lambda.ephemeralStorageSize || deploymentConfig.lambda.ephemeralStorageSize > 512) {
        recommendations.push({
          service: 'Lambda',
          type: 'optimization',
          recommendation: 'Optimize ephemeral storage usage; current size is not minimal',
          estimatedSavings: '5-10%',
        });
      }
    }

    // S3 recommendations
    if (deploymentConfig.s3) {
      recommendations.push({
        service: 'S3',
        type: 'storage-optimization',
        recommendation: 'Enable Intelligent-Tiering for automatic cost optimization',
        estimatedSavings: '20-40%',
      });

      if (!deploymentConfig.s3.lifecycleRules || deploymentConfig.s3.lifecycleRules.length === 0) {
        recommendations.push({
          service: 'S3',
          type: 'cost-saving',
          recommendation: 'Configure lifecycle policies to transition old objects to Glacier',
          estimatedSavings: '50-70%',
        });
      }
    }

    // DynamoDB recommendations
    if (deploymentConfig.dynamodb) {
      if (deploymentConfig.dynamodb.billingMode === 'PROVISIONED') {
        recommendations.push({
          service: 'DynamoDB',
          type: 'cost-saving',
          recommendation: 'Consider PAY_PER_REQUEST billing for unpredictable workloads',
          estimatedSavings: '30-50%',
        });
      }
    }

    return recommendations;
  }

  // ============ Health Checks ============
  async healthCheckECS(clusterName, serviceName) {
    this.log(`Health checking ECS service: ${serviceName} on cluster: ${clusterName}`);

    try {
      const cmd = this.buildAwsCommand([
        'ecs', 'describe-services',
        `--cluster=${clusterName}`,
        `--services=${serviceName}`,
        '--query=services[0].[serviceName,desiredCount,runningCount,status]',
        '--output=text',
      ]);

      const result = execSync(cmd.join(' '), { encoding: 'utf-8' });
      const [name, desired, running, status] = result.trim().split('\t');

      const healthy = parseInt(running) === parseInt(desired) && status === 'ACTIVE';
      this.log(`ECS service ${serviceName} is ${healthy ? 'healthy' : 'degraded'}`);

      return {
        status: healthy ? 'healthy' : 'degraded',
        service: serviceName,
        desiredCount: parseInt(desired),
        runningCount: parseInt(running),
        serviceStatus: status,
      };
    } catch (err) {
      this.error(`Health check failed: ${err.message}`);
      return { status: 'unhealthy', service: serviceName, error: err.message };
    }
  }

  async healthCheckLambda(functionName) {
    this.log(`Health checking Lambda function: ${functionName}`);

    try {
      const cmd = this.buildAwsCommand([
        'lambda', 'get-function',
        `--function-name=${functionName}`,
        '--query=Configuration.[FunctionName,State,LastUpdateStatus]',
        '--output=text',
      ]);

      const result = execSync(cmd.join(' '), { encoding: 'utf-8' });
      const [name, state, updateStatus] = result.trim().split('\t');

      const healthy = state === 'Active' && updateStatus === 'Successful';
      this.log(`Lambda function ${functionName} is ${healthy ? 'healthy' : 'degraded'}`);

      return {
        status: healthy ? 'healthy' : 'degraded',
        function: functionName,
        state,
        updateStatus,
      };
    } catch (err) {
      this.error(`Health check failed: ${err.message}`);
      return { status: 'unhealthy', function: functionName, error: err.message };
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

module.exports = AWSDeployment;

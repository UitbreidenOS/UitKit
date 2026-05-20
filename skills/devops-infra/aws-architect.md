---
name: aws-architect
description: "AWS architecture design: serverless, three-tier, event-driven, and container patterns — CloudFormation/Terraform IaC, cost optimisation, IAM best practices, and startup-to-scale patterns"
---

# AWS Architect Skill

## When to activate
- Designing a new AWS architecture from scratch
- Choosing between AWS service options (Lambda vs ECS, DynamoDB vs Aurora, etc.)
- Generating CloudFormation or Terraform templates for a pattern
- Optimising AWS costs on an existing setup
- Planning a migration to AWS from on-prem or another cloud
- Designing IAM policies and roles following least-privilege principles

## When NOT to use
- Azure-specific architecture — use the azure-architect skill
- GCP-specific architecture — use the gcp-architect skill
- Cloud security posture review — use the cloud-security skill
- Kubernetes-specific patterns — use the kubernetes skill

## Instructions

### Architecture pattern selection

```
Select the right AWS architecture pattern for [application].

Application type: [web app / mobile backend / data pipeline / SaaS / microservices / batch processing]
Expected scale: [users/day, requests/second, data volume]
Team AWS experience: [beginner / intermediate / advanced]
Budget: $[X]/month target
Compliance: [GDPR / HIPAA / SOC 2 / PCI / none]
Availability: [SLA target — 99.9% / 99.95% / 99.99%]

Pattern selection guide:

SERVERLESS (recommended for: APIs < 10K req/day, event-driven, variable traffic):
Stack: S3 + CloudFront → API Gateway → Lambda → DynamoDB / RDS Proxy
Cost: ~$10-100/month for small workloads (pay-per-invocation)
Pros: zero ops overhead, infinite scale, pay-per-use
Cons: cold starts (50-500ms), 15-min max execution, stateless only
Best for: startups, MVPs, variable traffic APIs, background jobs

THREE-TIER CONTAINERS (recommended for: consistent traffic, long-running processes):
Stack: CloudFront + ALB → ECS Fargate → RDS Aurora + ElastiCache
Cost: ~$150-500/month minimum (running containers 24/7)
Pros: familiar model, no cold starts, stateful-friendly, predictable latency
Cons: higher base cost, more ops (health checks, scaling config)
Best for: B2B SaaS, APIs with strict latency, teams comfortable with containers

EVENT-DRIVEN MICROSERVICES (recommended for: complex workflows, async processing):
Stack: EventBridge / SNS / SQS → Lambda / ECS → Step Functions
Cost: depends on message volume + compute
Pros: decoupled services, resilient, scales independently per service
Cons: distributed systems complexity, debugging harder
Best for: systems where services must communicate without tight coupling

DATA PIPELINE (recommended for: ETL, analytics, ML):
Stack: S3 → Glue / Kinesis → Redshift / Athena → QuickSight
Cost: storage cheap; compute costs vary by job frequency
Best for: batch ETL, streaming analytics, data warehouse

Recommend the pattern for my application with cost estimate and IaC starter template.
```

### CloudFormation template

```
Generate a CloudFormation template for [pattern].

Pattern: [serverless API / three-tier / static site / data pipeline]
Region: [us-east-1 / eu-west-1 / etc.]
App name: [used as resource name prefix]

Serverless API stack (SAM):
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Parameters:
  AppName:
    Type: String
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]

Globals:
  Function:
    Runtime: nodejs20.x
    MemorySize: 256
    Timeout: 30
    Environment:
      Variables:
        NODE_ENV: !Ref Environment
    Tracing: Active                          # X-Ray tracing

Resources:
  # API Gateway + Lambda
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${AppName}-api-${Environment}'
      Handler: dist/index.handler
      CodeUri: ./
      Events:
        ApiEvent:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref MainTable

  # DynamoDB table with on-demand billing
  MainTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${AppName}-${Environment}'
      BillingMode: PAY_PER_REQUEST
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
      SSESpecification:
        SSEEnabled: true
      AttributeDefinitions:
        - AttributeName: pk
          AttributeType: S
        - AttributeName: sk
          AttributeType: S
      KeySchema:
        - AttributeName: pk
          KeyType: HASH
        - AttributeName: sk
          KeyType: RANGE

  # CloudFront + S3 for frontend
  FrontendBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

Generate the full template for my pattern with security hardening.
```

### IAM least-privilege policy

```
Design IAM policies for [workload].

Workload: [describe — Lambda function, ECS task, developer, CI/CD pipeline]
AWS services accessed: [list — S3, DynamoDB, SQS, Secrets Manager, etc.]
Operations needed: [read-only / read-write / admin]

IAM best practices:
1. Never use AWS managed AdministratorAccess — always scope down
2. One role per service/workload — never share roles between unrelated services
3. Use resource-level ARNs — not "*" on resource unless truly necessary
4. Use conditions to restrict by VPC, IP, MFA, tag
5. Review quarterly — unused permissions accumulate fast

Lambda execution role (DynamoDB read/write + Secrets Manager read):
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/MY_TABLE",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/MY_TABLE/index/*"
      ]
    },
    {
      "Sid": "SecretsManagerRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:my-app/*"
    },
    {
      "Sid": "XRayTracing",
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
      ],
      "Resource": "*"
    }
  ]
}

Generate the least-privilege IAM policy for my workload.
```

### Cost optimisation audit

```
Audit AWS costs and identify optimisation opportunities.

Current monthly bill: $[X]
Biggest cost categories: [EC2 / RDS / data transfer / Lambda / S3 / other]
Account age: [X months]
Environments: [prod + staging + dev / prod only]

Cost optimisation checklist:

EC2 / ECS COMPUTE:
□ Reserved Instances or Savings Plans purchased for stable baseline workloads?
  → 1-year commitment = ~30% saving vs on-demand; 3-year = ~50%
□ Spot instances used for non-critical or batch workloads?
  → 70-90% cheaper than on-demand; tolerate interruptions
□ Right-sizing done? (check CloudWatch CPU/memory utilisation)
  → Instances running at < 20% average CPU are candidates for downsizing
□ Dev/staging environments stopped outside business hours?
  → Lambda: `aws ec2 stop-instances` on a schedule; saves 65% on non-prod compute

RDS / DATABASE:
□ Aurora Serverless v2 considered for variable workloads?
  → Scales to zero when idle; significant savings for dev/staging
□ Idle RDS instances identified?
  → Any RDS with < 1 connection/day for 30+ days = shutdown candidate
□ Multi-AZ disabled in non-prod?
  → Multi-AZ doubles RDS cost; dev/staging don't need it

DATA TRANSFER:
□ CloudFront in front of S3/ALB to reduce origin data transfer costs?
  → Data transfer from CloudFront to internet: 4-8x cheaper than from EC2
□ VPC endpoints for S3, DynamoDB, Secrets Manager?
  → Eliminates NAT Gateway data processing charges for these services
□ NAT Gateway usage reviewed?
  → NAT Gateway data processing: $0.045/GB; often the hidden cost driver

S3:
□ S3 Intelligent-Tiering enabled on buckets > 100GB with variable access patterns?
□ S3 lifecycle rules deleting old versions and incomplete multipart uploads?
□ S3 access logs going to a log bucket with lifecycle rule to expire after 90 days?

LAMBDA:
□ Memory right-sized? (use Lambda Power Tuning tool)
□ Functions with > 5M invocations/month — Savings Plans applied?

Estimate: for a $2K/month bill, typical optimisation finds $400-800/month in savings.
Generate an optimisation plan for my specific spend profile.
```

## Example

**User:** We're a 5-person startup, building a REST API + React frontend. Expect 5K users at launch, maybe 50K in 6 months. Budget: $200/month to start. What AWS stack?

**Claude's recommendation:**

At 5K users, serverless is the right call — you'll spend <$50/month and have zero servers to manage.

**Recommended stack:**

```
React (S3 + CloudFront) → API Gateway (HTTP API) → Lambda → DynamoDB
                                                          ↓
                                                    Secrets Manager
                                                    SES (email)
```

**Why this over containers:**
- 5K users = ~1K API calls/day = $0.40/month in Lambda costs
- No idle compute cost (unlike ECS which charges 24/7)
- At 50K users = still <$10/month in Lambda
- Switch to ECS Fargate when you need: persistent connections (WebSockets), long-running processes, or > 1M API calls/day

**Monthly cost breakdown at 5K users:**
- CloudFront + S3: ~$2
- API Gateway: ~$1
- Lambda: ~$1
- DynamoDB (on-demand): ~$5
- Secrets Manager: ~$1
- **Total: ~$10/month** — well under your $200 budget

**When to migrate off serverless:** if you hit consistent > 500 req/second or need sub-10ms p99 latency (Lambda cold starts become an issue). At 50K users you're not there yet.

**IaC recommendation:** AWS SAM for this stack. 1 `template.yaml` deploys everything. Add `samconfig.toml` for environment separation (dev/prod).

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

---
name: aws-architect
description: "AWS-architectuur ontwerp: serverless, drie-laags, event-driven en container patronen — CloudFormation/Terraform IaC, kostenoptimalisatie, IAM best practices en startup-naar-schaal patronen"
---

# AWS Architect Skill

## Wanneer activeren
- Een nieuwe AWS-architectuur helemaal opnieuw ontwerpen
- Kiezen tussen AWS-serviceopties (Lambda vs. ECS, DynamoDB vs. Aurora, enz.)
- CloudFormation- of Terraform-templates genereren voor een patroon
- AWS-kosten op een bestaande setup optimaliseren
- Een migratie naar AWS van on-premises of een andere cloud plannen
- IAM-beleid en rollen ontwerpen volgens het principe van minimale bevoegdheden

## Wanneer NIET gebruiken
- Azure-specifieke architectuur — gebruik de azure-architect skill
- GCP-specifieke architectuur — gebruik de gcp-architect skill
- Controle van de cloud-beveiligingshouding — gebruik de cloud-security skill
- Kubernetes-specifieke patronen — gebruik de kubernetes skill

## Instructies

### Selectie van architectuurpatroon

```
Selecteer het juiste AWS-architectuurpatroon voor [toepassing].

Toepassingstype: [web-app / mobiele backend / datapijplijn / SaaS / microservices / batchverwerking]
Verwachte schaal: [gebruikers/dag, verzoeken/seconde, gegevensvolume]
AWS-ervaring van het team: [beginner / intermediate / gevorderd]
Budget: $[X]/maand doel
Compliance: [GDPR / HIPAA / SOC 2 / PCI / geen]
Beschikbaarheid: [SLA-doel — 99,9% / 99,95% / 99,99%]

Handleiding voor patroonskeuze:

SERVERLESS (aanbevolen voor: API's < 10K req/dag, event-driven, variabel verkeer):
Stack: S3 + CloudFront → API Gateway → Lambda → DynamoDB / RDS Proxy
Kosten: ~$10-100/maand voor kleine workloads (betaal-per-aanroeping)
Voordelen: nul operationele overhead, oneindige schaal, betaal-per-gebruik
Nadelen: koude starts (50-500ms), maximale uitvoeringstijd 15 minuten, alleen stateless
Beste voor: startups, MVP's, API's met variabel verkeer, achtergrondtaken

DRIE-LAAGS CONTAINERS (aanbevolen voor: consistent verkeer, langlopende processen):
Stack: CloudFront + ALB → ECS Fargate → RDS Aurora + ElastiCache
Kosten: ~$150-500/maand minimum (containers 24/7 actief)
Voordelen: vertrouwd model, geen koude starts, stateful-vriendelijk, voorspelbare latentie
Nadelen: hogere basiskosten, meer operaties (gezondheidschecks, schalingsconfig)
Beste voor: B2B SaaS, API's met strikte latentie, teams comfortabel met containers

EVENT-DRIVEN MICROSERVICES (aanbevolen voor: complexe workflows, asynchrone verwerking):
Stack: EventBridge / SNS / SQS → Lambda / ECS → Step Functions
Kosten: hangt af van berichtvolume + berekening
Voordelen: ontkoppelde services, veerkrachtig, onafhankelijk schaalbaar per service
Nadelen: complexiteit van gedistribueerde systemen, debugging moeilijker
Beste voor: systemen waar services zonder strikte koppeling moeten communiceren

GEGEVENSPIJPLIJN (aanbevolen voor: ETL, analytics, ML):
Stack: S3 → Glue / Kinesis → Redshift / Athena → QuickSight
Kosten: opslag goedkoop; rekenkosten variëren per taakfrequentie
Beste voor: batch ETL, streaming analytics, datawarehouse

Aanbeveel het patroon voor mijn toepassing met kostenschatting en IaC starter-template.
```

### CloudFormation-sjabloon

```
Genereer een CloudFormation-sjabloon voor [patroon].

Patroon: [serverloze API / drie-laags / statische site / datapijplijn]
Regio: [us-east-1 / eu-west-1 / enz.]
App-naam: [gebruikt als resource-naamprefix]

Serverloze API-stack (SAM):
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

  # DynamoDB-tabel met on-demand-facturering
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

  # CloudFront + S3 voor frontend
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

Genereer de volledige template voor mijn patroon met beveiligingshardening.
```

### IAM-beleid met minimale bevoegdheden

```
Ontwerp IAM-beleid voor [workload].

Workload: [beschrijven — Lambda-functie, ECS-taak, ontwikkelaar, CI/CD-pijplijn]
Toegang tot AWS-services: [lijst — S3, DynamoDB, SQS, Secrets Manager, enz.]
Benodigde operaties: [alleen-lezen / lezen-schrijven / beheerder]

IAM Best Practices:
1. Gebruik nooit AWS-beheerde AdministratorAccess — beperk altijd de scope
2. Één rol per service/workload — deel rollen nooit tussen niet-gerelateerde services
3. Gebruik resource-level ARN's — niet "*" op resource tenzij werkelijk nodig
4. Gebruik voorwaarden om te beperken op VPC, IP, MFA, tag
5. Beoordeel driemaandelijks — ongebruikte machtigingen hopen zich snel op

Lambda-uitvoeringsrol (DynamoDB lezen/schrijven + Secrets Manager lezen):
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

Genereer het IAM-beleid met minimale bevoegdheden voor mijn workload.
```

### Kostenoptimalisatie-audit

```
Controleer AWS-kosten en identificeer optimalisatiemogelijkheden.

Huidige maandelijkse factuur: $[X]
Grootste kostencategorieën: [EC2 / RDS / gegevensoverdracht / Lambda / S3 / overig]
Accountleeftijd: [X maanden]
Omgevingen: [prod + staging + dev / alleen prod]

Checklist voor kostenoptimalisatie:

EC2 / ECS BEREKENING:
□ Gereserveerde instances of spaarplannen gekocht voor stabiele basisworkloads?
  → 1-jaarstoezegging = ~30% besparing vs. on-demand; 3 jaar = ~50%
□ Spot-instances gebruikt voor niet-kritieke of batch-workloads?
  → 70-90% goedkoper dan on-demand; tolereer onderbreking
□ Resize uitgevoerd? (controleer CloudWatch CPU/geheugengebruik)
  → Instances met < 20% gemiddeld CPU-gebruik zijn candidates voor resize
□ Dev/staging-omgevingen buiten kantoortijden gestopt?
  → Lambda: `aws ec2 stop-instances` volgens schema; bespaart 65% op non-prod berekening

RDS / DATABASE:
□ Aurora Serverless v2 overwogen voor variabele workloads?
  → Schaalt naar nul wanneer inactief; aanzienlijke besparingen voor dev/staging
□ Inactieve RDS-instances geïdentificeerd?
  → Een RDS met < 1 verbinding/dag gedurende 30+ dagen = shutdown candidate
□ Multi-AZ uitgeschakeld in non-prod?
  → Multi-AZ verdubbelt RDS-kosten; dev/staging hebben dit niet nodig

GEGEVENSOVERDRACHT:
□ CloudFront voor S3/ALB om origin gegevensoverdrachtkosten te verminderen?
  → Gegevensoverdracht van CloudFront naar internet: 4-8x goedkoper dan van EC2
□ VPC-endpoints voor S3, DynamoDB, Secrets Manager?
  → Elimineert NAT Gateway-gegevensverwerkingtarief voor deze services
□ NAT Gateway-gebruik beoordeeld?
  → NAT Gateway-gegevensverwerking: $0,045/GB; vaak de verborgen kostfactor

S3:
□ S3 Intelligent-Tiering ingeschakeld op buckets > 100GB met variabele toegangspatronen?
□ S3 lifecycle-regels verwijderen oude versies en onvolledig multipart uploads?
□ S3 toegangslogs gaan naar een logbucket met lifecycle-regel voor verlopen na 90 dagen?

LAMBDA:
□ Geheugen aangepast? (gebruik Lambda Power Tuning tool)
□ Functies met > 5M aanroepingen/maand — spaarplannen toegepast?

Schatting: voor een $2K/maand rekening vinden typische optimalisaties $400-800/maand besparingen.
Genereer een optimalisatieplan voor mijn specifieke uitgavenprofiel.
```

## Voorbeeld

**Gebruiker:** We zijn een startup met 5 personen, bouwen een REST API + React frontend. We verwachten 5K gebruikers bij lancering, misschien 50K over 6 maanden. Budget: $200/maand om mee te beginnen. Welke AWS-stack?

**Aanbeveling van Claude:**

Bij 5K gebruikers is serverless de juiste keuze — u geeft <$50/maand uit en hebt nul servers te beheren.

**Aanbevolen stack:**

```
React (S3 + CloudFront) → API Gateway (HTTP API) → Lambda → DynamoDB
                                                          ↓
                                                    Secrets Manager
                                                    SES (e-mail)
```

**Waarom dit in plaats van containers:**
- 5K gebruikers = ~1K API-aanroepen/dag = $0,40/maand in Lambda-kosten
- Geen inactieve rekenkosten (anders dan ECS die 24/7 factureert)
- Bij 50K gebruikers = nog steeds < $10/maand in Lambda
- Overschakelen naar ECS Fargate wanneer u nodig hebt: persistente verbindingen (WebSockets), langlopende processen, of > 1M API-aanroepen/dag

**Maandelijkse kostenverbreding bij 5K gebruikers:**
- CloudFront + S3: ~$2
- API Gateway: ~$1
- Lambda: ~$1
- DynamoDB (on-demand): ~$5
- Secrets Manager: ~$1
- **Totaal: ~$10/maand** — goed onder uw budget van $200

**Wanneer van serverless migreren:** als u constante > 500 req/seconde raakt of sub-10ms p99 latentie nodig hebt (Lambda koude starts worden een probleem). Bij 50K gebruikers bent u daar nog niet.

**IaC aanbeveling:** AWS SAM voor deze stack. Een `template.yaml` implementeert alles. Voeg `samconfig.toml` toe voor omgevingsscheiding (dev/prod).

---

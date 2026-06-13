---
name: aws-architect
description: "AWS-Architektur-Design: serverlos, dreischichtig, ereignisgesteuert und Container-Muster — CloudFormation/Terraform IaC, Kostenoptimierung, IAM Best Practices und Startup-zu-Skalierung-Muster"
---

# AWS Architect Skill

## Wann aktivieren
- Entwerfen einer neuen AWS-Architektur von Grund auf
- Wahl zwischen AWS-Serviceoptionen (Lambda vs. ECS, DynamoDB vs. Aurora, etc.)
- Generierung von CloudFormation- oder Terraform-Vorlagen für ein Muster
- Optimierung der AWS-Kosten für ein bestehendes Setup
- Planung einer Migration zu AWS von On-Prem oder einer anderen Cloud
- Entwerfen von IAM-Richtlinien und Rollen nach dem Prinzip der geringsten Berechtigung

## Wann NICHT verwenden
- Azure-spezifische Architektur — verwenden Sie den azure-architect Skill
- GCP-spezifische Architektur — verwenden Sie den gcp-architect Skill
- Überprüfung der Cloud-Sicherheitsposition — verwenden Sie den cloud-security Skill
- Kubernetes-spezifische Muster — verwenden Sie den kubernetes Skill

## Anweisungen

### Architekturmuster-Auswahl

```
Wählen Sie das richtige AWS-Architekturmuster für [Anwendung].

Anwendungstyp: [Web-App / Mobile-Backend / Datenpipeline / SaaS / Microservices / Batch-Verarbeitung]
Erwartete Skalierung: [Benutzer/Tag, Anfragen/Sekunde, Datenvolumen]
AWS-Erfahrung des Teams: [Anfänger / Fortgeschrittene / Experte]
Budget: $[X]/Monat Ziel
Compliance: [GDPR / HIPAA / SOC 2 / PCI / keine]
Verfügbarkeit: [SLA-Ziel — 99,9% / 99,95% / 99,99%]

Leitfaden zur Musterauswahl:

SERVERLOS (empfohlen für: APIs < 10K req/Tag, ereignisgesteuert, variabler Datenverkehr):
Stack: S3 + CloudFront → API Gateway → Lambda → DynamoDB / RDS Proxy
Kosten: ~$10-100/Monat für kleine Workloads (Pay-per-Invocation)
Vorteile: nulloperativer Overhead, unendliche Skalierung, bezahlen pro Nutzung
Nachteile: Cold Starts (50-500ms), maximale Ausführungsdauer 15 Minuten, nur zustandslos
Am besten für: Startups, MVPs, APIs mit variablem Datenverkehr, Hintergrundaufträge

DREISCHICHTIGE CONTAINER (empfohlen für: konsistenter Datenverkehr, lang laufende Prozesse):
Stack: CloudFront + ALB → ECS Fargate → RDS Aurora + ElastiCache
Kosten: ~$150-500/Monat Minimum (Container 24/7 ausgeführt)
Vorteile: vertrautes Modell, keine Cold Starts, zustandsfreundlich, vorhersagbare Latenz
Nachteile: höhere Grundkosten, mehr Operationen (Healthchecks, Skalierungskonfiguration)
Am besten für: B2B SaaS, APIs mit strikter Latenz, Teams, die mit Containern vertraut sind

EREIGNISGESTEUERTE MICROSERVICES (empfohlen für: komplexe Workflows, asynchrone Verarbeitung):
Stack: EventBridge / SNS / SQS → Lambda / ECS → Step Functions
Kosten: hängt von Nachrichtenvolumen + Berechnung ab
Vorteile: entkoppelte Services, widerstandsfähig, unabhängig skalierbar pro Service
Nachteile: Komplexität verteilter Systeme, Debugging schwieriger
Am besten für: Systeme, in denen Services ohne enge Kopplung kommunizieren müssen

DATENPIPELINE (empfohlen für: ETL, Analytics, ML):
Stack: S3 → Glue / Kinesis → Redshift / Athena → QuickSight
Kosten: Speicher günstig; Rechenkosten variieren je nach Auftragsfrequenz
Am besten für: Batch-ETL, Streaming-Analytics, Data Warehouse

Empfehlen Sie das Muster für meine Anwendung mit Kostenschätzung und IaC-Starter-Vorlage.
```

### CloudFormation-Vorlage

```
Generieren Sie eine CloudFormation-Vorlage für [Muster].

Muster: [serverlose API / dreischichtig / statische Site / Datenpipeline]
Region: [us-east-1 / eu-west-1 / etc.]
App-Name: [verwendet als Ressourcenname-Präfix]

Serverlose API-Stack (SAM):
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
    Tracing: Active                          # X-Ray Tracing

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

  # DynamoDB-Tabelle mit On-Demand-Abrechnung
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

  # CloudFront + S3 für Frontend
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

Generieren Sie die vollständige Vorlage für mein Muster mit Sicherheitshärtung.
```

### IAM-Richtlinie mit geringsten Berechtigungen

```
Entwerfen Sie IAM-Richtlinien für [Workload].

Workload: [beschreiben — Lambda-Funktion, ECS-Task, Entwickler, CI/CD-Pipeline]
Zugegriffene AWS-Services: [Liste — S3, DynamoDB, SQS, Secrets Manager, etc.]
Erforderliche Operationen: [Nur Lesezugriff / Lese- und Schreibzugriff / Administrator]

IAM Best Practices:
1. Verwenden Sie niemals AWS-verwalteten AdministratorAccess — begrenzen Sie immer die Reichweite
2. Eine Rolle pro Service/Workload — teilen Sie Rollen niemals zwischen nicht verwandten Services
3. Verwenden Sie ARNs auf Ressourcenebene — nicht "*" auf einer Ressource, es sei denn, wirklich erforderlich
4. Verwenden Sie Bedingungen, um nach VPC, IP, MFA, Tag zu beschränken
5. Überprüfen Sie vierteljährlich — ungenutzte Berechtigungen sammeln sich schnell an

Lambda-Ausführungsrolle (DynamoDB Lese-/Schreibzugriff + Secrets Manager Lesezugriff):
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

Generieren Sie die IAM-Richtlinie mit geringsten Berechtigungen für meine Workload.
```

### Kostenoptimierungs-Audit

```
Audieren Sie AWS-Kosten und identifizieren Sie Optimierungsmöglichkeiten.

Aktuelle monatliche Rechnung: $[X]
Größte Kostenkategorien: [EC2 / RDS / Datenübertragung / Lambda / S3 / Sonstiges]
Kontoalter: [X Monate]
Umgebungen: [Prod + Staging + Dev / Nur Prod]

Checkliste zur Kostenoptimierung:

EC2 / ECS BERECHNUNG:
□ Reserved Instances oder Savings Plans für stabile Basis-Workloads gekauft?
  → 1-Jahres-Verpflichtung = ~30% Ersparnis vs. On-Demand; 3 Jahre = ~50%
□ Spot-Instances für nicht-kritische oder Batch-Workloads verwendet?
  → 70-90% günstiger als On-Demand; Unterbrechungen tolerieren
□ Größenänderung durchgeführt? (CloudWatch CPU/Speicher-Auslastung prüfen)
  → Instances mit < 20% durchschnittlicher CPU-Auslastung sind Kandidaten für Größenänderung
□ Dev/Staging-Umgebungen außerhalb der Geschäftszeiten gestoppt?
  → Lambda: `aws ec2 stop-instances` nach Plan; spart 65% bei nicht-Prod-Berechnung

RDS / DATENBANK:
□ Aurora Serverless v2 für variable Workloads in Betracht gezogen?
  → Skaliert auf Null im Leerlauf; erhebliche Einsparungen für Dev/Staging
□ Untätige RDS-Instanzen identifiziert?
  → Jedes RDS mit < 1 Verbindung/Tag für 30+ Tage = Abschalt-Kandidat
□ Multi-AZ in Nicht-Prod deaktiviert?
  → Multi-AZ verdoppelt RDS-Kosten; Dev/Staging brauchen das nicht

DATENÜBERTRAGUNG:
□ CloudFront vor S3/ALB zur Reduzierung der Origin-Datenübertragungskosten?
  → Datenübertragung von CloudFront ins Internet: 4-8x günstiger als von EC2
□ VPC-Endpunkte für S3, DynamoDB, Secrets Manager?
  → Eliminiert NAT-Gateway-Datenverarbeitungsgebühren für diese Services
□ NAT-Gateway-Nutzung überprüft?
  → NAT-Gateway-Datenverarbeitung: $0,045/GB; oft der verborgene Kostentreiber

S3:
□ S3 Intelligent-Tiering auf Buckets > 100GB mit variablen Zugriffsmustern aktiviert?
□ S3-Lifecycle-Regeln löschen alte Versionen und unvollständige Multipart-Uploads?
□ S3-Zugriffslogs gehen an einen Log-Bucket mit Lifecycle-Regel zum Ablauf nach 90 Tagen?

LAMBDA:
□ Speicher neu dimensioniert? (Lambda Power Tuning Tool verwenden)
□ Funktionen mit > 5M Invocations/Monat — Savings Plans angewendet?

Schätzung: Bei einer Rechnung von $2K/Monat findet typische Optimierung $400-800/Monat Einsparungen.
Generieren Sie einen Optimierungsplan für mein spezifisches Ausgabenprofil.
```

## Beispiel

**Benutzer:** Wir sind ein 5-Personen-Startup und bauen eine REST-API + React-Frontend. Wir erwarten 5K Benutzer beim Start, vielleicht 50K in 6 Monaten. Budget: $200/Monat zum Start. Welcher AWS-Stack?

**Empfehlung von Claude:**

Bei 5K Benutzern ist serverlos der richtige Ansatz — Sie geben <$50/Monat aus und haben null Server zu verwalten.

**Empfohlener Stack:**

```
React (S3 + CloudFront) → API Gateway (HTTP API) → Lambda → DynamoDB
                                                          ↓
                                                    Secrets Manager
                                                    SES (E-Mail)
```

**Warum das statt Container:**
- 5K Benutzer = ~1K API-Aufrufe/Tag = $0,40/Monat in Lambda-Kosten
- Keine Leerlauf-Rechenkosten (anders als ECS, das 24/7 abrechnet)
- Bei 50K Benutzern = immer noch <$10/Monat in Lambda
- Auf ECS Fargate wechseln, wenn Sie brauchen: persistente Verbindungen (WebSockets), lange laufende Prozesse oder > 1M API-Aufrufe/Tag

**Monatliche Kostenaufschlüsselung bei 5K Benutzern:**
- CloudFront + S3: ~$2
- API Gateway: ~$1
- Lambda: ~$1
- DynamoDB (On-Demand): ~$5
- Secrets Manager: ~$1
- **Gesamt: ~$10/Monat** — deutlich unter Ihrem Budget von $200

**Wann von Serverless migrieren:** wenn Sie konstante > 500 req/Sekunde oder Sub-10ms p99-Latenz benötigen (Lambda Cold Starts werden zum Problem). Bei 50K Benutzern sind Sie dort noch nicht.

**IaC-Empfehlung:** AWS SAM für diesen Stack. Ein `template.yaml` stellt alles bereit. Fügen Sie `samconfig.toml` für Umgebungstrennung (Dev/Prod) hinzu.

---

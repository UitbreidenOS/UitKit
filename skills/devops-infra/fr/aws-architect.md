---
name: aws-architect
description: "Architecture AWS: patterns serverless, trois niveaux, événementiel et conteneurs — CloudFormation/Terraform IaC, optimisation des coûts, bonnes pratiques IAM, patterns démarrage-à-l'échelle"
---

# Compétence AWS Architect

## Quand activer
- Concevoir une nouvelle architecture AWS à partir de zéro
- Choisir entre les options de services AWS (Lambda vs ECS, DynamoDB vs Aurora, etc.)
- Générer des modèles CloudFormation ou Terraform pour un pattern
- Optimiser les coûts AWS sur une configuration existante
- Planifier une migration vers AWS depuis on-prem ou un autre cloud
- Concevoir les politiques IAM et les rôles en suivant les principes du moindre privilège

## Quand NE PAS utiliser
- Architecture spécifique à Azure — utiliser la compétence azure-architect
- Architecture spécifique à GCP — utiliser la compétence gcp-architect
- Examen de la posture de sécurité cloud — utiliser la compétence cloud-security
- Patterns Kubernetes spécifiques — utiliser la compétence kubernetes

## Instructions

### Sélection du pattern d'architecture

```
Sélectionner le pattern d'architecture AWS approprié pour [application].

Type d'application : [application web / backend mobile / pipeline de données / SaaS / microservices / traitement par lot]
Échelle prévue : [utilisateurs/jour, requêtes/seconde, volume de données]
Expérience AWS de l'équipe : [débutant / intermédiaire / avancé]
Budget : $[X]/mois cible
Conformité : [GDPR / HIPAA / SOC 2 / PCI / aucune]
Disponibilité : [Cible SLA — 99,9% / 99,95% / 99,99%]

Guide de sélection du pattern :

SERVERLESS (recommandé pour : APIs < 10K req/jour, événementiel, trafic variable) :
Stack : S3 + CloudFront → API Gateway → Lambda → DynamoDB / RDS Proxy
Coût : ~$10-100/mois pour petites charges de travail (facturation à l'invocation)
Avantages : zéro frais opérationnels, échelle infinie, facturation à l'utilisation
Inconvénients : démarrages à froid (50-500ms), durée d'exécution max 15 min, sans état uniquement
Meilleur pour : startups, MVPs, APIs à trafic variable, travaux en arrière-plan

TROIS NIVEAUX CONTENEURS (recommandé pour : trafic constant, processus longue durée) :
Stack : CloudFront + ALB → ECS Fargate → RDS Aurora + ElastiCache
Coût : ~$150-500/mois minimum (conteneurs exécutés 24h/24)
Avantages : modèle familier, pas de démarrages à froid, convivial avec état, latence prévisible
Inconvénients : coût de base plus élevé, plus d'opérations (vérifications de santé, config d'échelonnage)
Meilleur pour : SaaS B2B, APIs avec latence stricte, équipes à l'aise avec les conteneurs

MICROSERVICES ÉVÉNEMENTIELS (recommandé pour : flux de travail complexes, traitement asynchrone) :
Stack : EventBridge / SNS / SQS → Lambda / ECS → Step Functions
Coût : dépend du volume de messages + calcul
Avantages : services découplés, résilience, échelonnage indépendant par service
Inconvénients : complexité des systèmes distribués, débogage plus difficile
Meilleur pour : systèmes où les services doivent communiquer sans couplage serré

PIPELINE DE DONNÉES (recommandé pour : ETL, analytique, ML) :
Stack : S3 → Glue / Kinesis → Redshift / Athena → QuickSight
Coût : stockage bon marché ; coûts de calcul varient selon la fréquence des travaux
Meilleur pour : ETL par lot, analytique en streaming, entrepôt de données

Recommander le pattern pour mon application avec estimation de coût et modèle de démarrage IaC.
```

### Modèle CloudFormation

```
Générer un modèle CloudFormation pour [pattern].

Pattern : [API serverless / trois niveaux / site statique / pipeline de données]
Région : [us-east-1 / eu-west-1 / etc.]
Nom de l'application : [utilisé comme préfixe du nom de la ressource]

Stack d'API serverless (SAM) :
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
    Tracing: Active                          # Traçage X-Ray

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

  # Table DynamoDB avec facturation à la demande
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

  # CloudFront + S3 pour frontend
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

Générer le modèle complet pour mon pattern avec durcissement de la sécurité.
```

### Politique IAM du moindre privilège

```
Concevoir les politiques IAM pour [charge de travail].

Charge de travail : [décrire — fonction Lambda, tâche ECS, développeur, pipeline CI/CD]
Services AWS accédés : [lister — S3, DynamoDB, SQS, Secrets Manager, etc.]
Opérations nécessaires : [lecture seule / lecture-écriture / administrateur]

Bonnes pratiques IAM :
1. Ne jamais utiliser AdministratorAccess managé AWS — toujours limiter la portée
2. Un rôle par service/charge de travail — ne jamais partager les rôles entre services non liés
3. Utiliser des ARNs au niveau des ressources — pas "*" sur la ressource sauf si vraiment nécessaire
4. Utiliser les conditions pour restreindre par VPC, IP, MFA, tag
5. Examiner trimestriellement — les permissions inutilisées s'accumulent rapidement

Rôle d'exécution Lambda (lecture/écriture DynamoDB + lecture Secrets Manager) :
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

Générer la politique IAM du moindre privilège pour ma charge de travail.
```

### Audit d'optimisation des coûts

```
Auditer les coûts AWS et identifier les opportunités d'optimisation.

Facture mensuelle actuelle : $[X]
Plus grandes catégories de coûts : [EC2 / RDS / transfert de données / Lambda / S3 / autre]
Âge du compte : [X mois]
Environnements : [prod + staging + dev / prod uniquement]

Checklist d'optimisation des coûts :

CALCUL EC2 / ECS :
□ Instances réservées ou plans d'économies achetés pour les charges de travail de base stables ?
  → Engagement 1 an = ~30% d'économies vs à la demande ; 3 ans = ~50%
□ Instances spot utilisées pour les charges de travail non critiques ou par lot ?
  → 70-90% moins cher qu'à la demande ; tolérer les interruptions
□ Redimensionnement effectué ? (vérifier l'utilisation CPU/mémoire CloudWatch)
  → Les instances exécutées à < 20% CPU moyen sont candidates au redimensionnement
□ Environnements dev/staging arrêtés en dehors des heures de travail ?
  → Lambda : `aws ec2 stop-instances` selon un calendrier ; économise 65% sur le calcul non-prod

RDS / BASE DE DONNÉES :
□ Aurora Serverless v2 considéré pour les charges de travail variables ?
  → Échelonnage jusqu'à zéro au repos ; économies significatives pour dev/staging
□ Instances RDS inactives identifiées ?
  → Tout RDS avec < 1 connexion/jour pendant 30+ jours = candidat à l'arrêt
□ Multi-AZ désactivé en non-prod ?
  → Multi-AZ double le coût RDS ; dev/staging n'en ont pas besoin

TRANSFERT DE DONNÉES :
□ CloudFront en front de S3/ALB pour réduire les coûts de transfert de données d'origine ?
  → Transfert de données de CloudFront vers Internet : 4-8x moins cher que depuis EC2
□ Points de terminaison VPC pour S3, DynamoDB, Secrets Manager ?
  → Élimine les frais de traitement des données de la passerelle NAT pour ces services
□ Utilisation de la passerelle NAT examinée ?
  → Traitement des données de la passerelle NAT : $0,045/Go ; souvent le facteur de coût caché

S3 :
□ S3 Intelligent-Tiering activé sur les buckets > 100Go avec des patterns d'accès variables ?
□ Règles de cycle de vie S3 supprimant les anciennes versions et téléchargements multipièces incomplets ?
□ Les logs d'accès S3 vont-ils à un bucket de log avec une règle de cycle de vie pour expiration après 90 jours ?

LAMBDA :
□ Mémoire redimensionnée ? (utiliser l'outil Lambda Power Tuning)
□ Fonctions avec > 5M invocations/mois — plans d'économies appliqués ?

Estimation : pour une facture de $2K/mois, l'optimisation typique trouve $400-800/mois en économies.
Générer un plan d'optimisation pour mon profil de dépenses spécifique.
```

## Exemple

**Utilisateur :** Nous sommes une startup de 5 personnes, construisant une API REST + frontend React. Nous attendons 5K utilisateurs au lancement, peut-être 50K en 6 mois. Budget : $200/mois pour commencer. Quel stack AWS ?

**Recommandation de Claude :**

À 5K utilisateurs, serverless est le bon choix — vous dépenserez < $50/mois et n'aurez zéro serveur à gérer.

**Stack recommandé :**

```
React (S3 + CloudFront) → API Gateway (HTTP API) → Lambda → DynamoDB
                                                          ↓
                                                    Secrets Manager
                                                    SES (email)
```

**Pourquoi ceci plutôt que les conteneurs :**
- 5K utilisateurs = ~1K appels API/jour = $0,40/mois en coûts Lambda
- Pas de coût de calcul au repos (contrairement à ECS qui facture 24h/24)
- À 50K utilisateurs = toujours < $10/mois en Lambda
- Basculer vers ECS Fargate quand vous avez besoin de : connexions persistantes (WebSockets), processus longue durée, ou > 1M appels API/jour

**Ventilation des coûts mensuels à 5K utilisateurs :**
- CloudFront + S3 : ~$2
- API Gateway : ~$1
- Lambda : ~$1
- DynamoDB (à la demande) : ~$5
- Secrets Manager : ~$1
- **Total : ~$10/mois** — bien en dessous de votre budget de $200

**Quand migrer hors du serverless :** si vous atteignez > 500 req/seconde constant ou avez besoin de latence p99 < 10ms (les démarrages à froid Lambda deviennent un problème). À 50K utilisateurs vous n'y êtes pas encore.

**Recommandation IaC :** AWS SAM pour ce stack. Un `template.yaml` déploie tout. Ajouter `samconfig.toml` pour la séparation des environnements (dev/prod).

---

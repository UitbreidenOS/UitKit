---
name: secrets-management
description: "Secrets-beheer: HashiCorp Vault-setup, AWS/Azure/GCP-geheime winkels, automatisering van geheime rotatie, Kubernetes-secrets-injectie, CI/CD-integratie en reactie op geheimelekken"
---

# Vaardigheid Secrets-beheer

## Wanneer activeren
- Een secrets-beheerinfrastructuur instellen (Vault, AWS Secrets Manager, enz.)
- Secrets-injectie ontwerpen voor Kubernetes-workloads of CI/CD-pipelines
- Implementatie van automatische geheime rotatie voor databaseprogramma's of API-sleutels
- Auditing van geheime toegangspatronen voor SOC 2 of ISO 27001
- Reageren op een geheimlek dat onmiddellijke rotatie en intrekking vereist
- Migreren van `.env`-bestanden naar een ordentlijke geheime winkel

## Wanneer NIET gebruiken
- Lokaal `.env`-bestandbeheer op een ontwikkelaarsmachine — .gitignore + dotenv gebruiken
- Code review voor hardcoded-geheimen — vaardigheid security-audit gebruiken om ze te vinden
- Versleuteling op toepassingsniveau van gebruikersgegevens in rust — ander bezorgnis

## Instructies

### Selectie geheime winkel

```
Kies de juiste aanpak voor geheimbeheer.

Teamgrootte: [X ingenieurs]
Infrastructuur: [AWS / Azure / GCP / on-prem / hybride / Kubernetes]
Naleving: [SOC 2 / ISO 27001 / HIPAA / geen]
Geheimvolume: [X geheimen, X toepassingen]
Budget: [$0 / beheerde service OK / onderneming]

Selectiegids:

CLOUD-NATIVE (aanbevolen voor cloud-first teams):
AWS Secrets Manager:
  - Native integratie: Lambda, ECS, RDS-rotatie, CloudFormation
  - Kosten: $0,40/geheim/maand + $0,05/10K API-oproepen
  - Auto-rotatie: ingebouwd voor RDS, DocumentDB, Redshift
  - Beste voor: AWS-only-winkels, teams die nul-ops willen

Azure Key Vault:
  - Native integratie: App Service, AKS, Key Vault-verwijzingen in app-instellingen
  - Kosten: $0,03/10K bewerkingen (geheimen), $0,03/10K (certificaten)
  - Beste voor: Azure-only of Microsoft-winkels

GCP Secret Manager:
  - Native integratie: Cloud Run, GKE, Cloud Functions
  - Kosten: $0,06/10K toegangsbewerkingen
  - Beste voor: GCP-native workloads

ZELF-GEHOST (aanbevolen voor multi-cloud of compliance-gestuurde teams):
HashiCorp Vault:
  - Ondersteunt: dynamische geheimen, PKI CA, SSH OTP, Kubernetes, meerdere cloud-backends
  - Kosten: open source gratis; Enterprise voor naamruimten, replicatie
  - Ops-overhead: moet implementeren, ontgrendelen en onderhouden
  - Beste voor: multi-cloud, on-prem, complexe rotatievereisten

HCP Vault (beheerd):
  - Vault als service van HashiCorp
  - Geen cluster-ops; Vault Dedicated begint rond $700/maand
  - Beste voor: teams die Vault-mogelijkheden zonder ops willen

Aanbeveling voor mijn setup: [optie + motivering]
```

### Vault-instellingspatronen

```
HashiCorp Vault instellen voor [omgeving].

Implementatie: [Kubernetes / Docker Compose / cloud-VM / HCP-beheerd]
Storage-backend: [Raft (geïntegreerd) / Consul / DynamoDB]
Automatisch ontgrendelen: [AWS KMS / Azure Key Vault / GCP KMS / handmatig]
Schaal: [dev enkel-knooppunt / HA 3-knooppunt / productie-HA]

Productie-HA-configuratie:

# docker-compose.yml (3-knooppunt Raft-cluster)
version: '3.8'
services:
  vault-1:
    image: hashicorp/vault:1.17
    environment:
      VAULT_LOCAL_CONFIG: |
        storage "raft" {
          path    = "/vault/data"
          node_id = "vault-1"
          retry_join { leader_api_addr = "http://vault-2:8200" }
          retry_join { leader_api_addr = "http://vault-3:8200" }
        }
        listener "tcp" {
          address     = "0.0.0.0:8200"
          tls_disable = false
          tls_cert_file = "/vault/certs/vault.crt"
          tls_key_file  = "/vault/certs/vault.key"
        }
        seal "awskms" {
          region     = "us-east-1"
          kms_key_id = "alias/vault-unseal"
        }
        api_addr = "https://vault-1:8200"
        cluster_addr = "https://vault-1:8201"
        ui = true
    cap_add: [IPC_LOCK]
    volumes:
      - vault-1-data:/vault/data
      - ./certs:/vault/certs:ro

Authentificatiemethoden (na initialisatie configureren):
# AppRole voor machine-to-machine (services, CI-runners)
vault auth enable approle
vault write auth/approle/role/my-service \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_num_uses=1 \    # eenmalige geheim-ID's
  token_policies=my-service-read

# Kubernetes voor pod-verificatie
vault auth enable kubernetes
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

Genereer de Vault-configuratie voor mijn specifieke infrastructuur.
```

### Geheime rotatie

```
Implementeer geautomatiseerde geheime rotatie voor [referentietype].

Referentietype: [databasewachtwoord / API-sleutel / TLS-certificaat / SSH-sleutel]
Rotatiefrequentie: [30 dagen / 90 dagen / op aanvraag]
Toepassingen die dit geheim gebruiken: [lijst — hoe ze het geheim verbruiken]

Databasewachtwoordrotatie (AWS Secrets Manager):

# Automatische rotatie met behulp van AWS-geleverde Lambda
aws secretsmanager create-secret \
  --name "prod/myapp/db-password" \
  --secret-string '{"username":"myapp","password":"initial-password"}'

aws secretsmanager rotate-secret \
  --secret-id "prod/myapp/db-password" \
  --rotation-lambda-arn "arn:aws:lambda:us-east-1:ACCOUNT:function:SecretsManagerRDSPostgreSQLRotationSingleUser" \
  --rotation-rules AutomaticallyAfterDays=30

# Toepassing leest geheim op naam (niet hardcoded waarde):
import boto3
import json

def get_db_password():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='prod/myapp/db-password')
    secret = json.loads(response['SecretString'])
    return secret['password']

# SLEUTELPATROON: Toepassing leest altijd bij runtime, cachet nooit oneindig
# Rotatie verwerken: verificatiefouten opvangen, geheim vernieuwen, eenmaal opnieuw proberen

Databaserotatiepatroon voor geen downtime:
Fase 1: Nieuw wachtwoord in database maken (oud wachtwoord werkt nog)
Fase 2: Secrets Manager bijwerken met nieuw wachtwoord
Fase 3: Toepassingen lezen nieuw wachtwoord op volgende geheime ophaaling
Fase 4: Oud wachtwoord uit database verwijderen (na respijttermijn)

Vault dynamische geheimen (beter dan rotatie — nooit langdurige referenties opslaan):
# Elke toepassingsaanvraag genereert een unieke, tijdsgebonden referentie
vault secrets enable database
vault write database/config/postgresql \
  plugin_name="postgresql-database-plugin" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/mydb" \
  allowed_roles="my-role" \
  username="vault-admin" \
  password="vault-admin-password"

vault write database/roles/my-role \
  db_name="postgresql" \
  creation_statements="CREATE ROLE '{{name}}' LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO '{{name}}';" \
  default_ttl="1h" \
  max_ttl="24h"

# App ontvangt: unieke referentie geldig 1 uur, automatisch verlopen door Vault
vault read database/creds/my-role

Genereer de rotatie-instellingen voor mijn referentietype.
```

### Kubernetes-secrets-injectie

```
Inject geheimen in Kubernetes-workloads.

Cluster: [EKS / AKS / GKE / zelf-beheerd]
Geheime winkel: [Vault / AWS Secrets Manager / Azure Key Vault / GCP Secret Manager]

Optie 1 — Vault Agent-zijwagen (meest flexibel):
# Kubernetes-verificatie eerst ingesteld in Vault (zie setup hierboven)
# Pod-spec met Vault Agent zijwagen:

apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-app   # moet Vault-verificatiebinding hebben
  initContainers:
    - name: vault-agent-init
      image: hashicorp/vault:1.17
      args: ["agent", "-config=/vault/config/config.hcl"]
      # Schrijft geheimen naar gedeeld volume voordat app wordt gestart
  containers:
    - name: app
      volumeMounts:
        - name: secrets-vol
          mountPath: /vault/secrets
          readOnly: true
      # App leest: /vault/secrets/db-password (tekstbestand)
  volumes:
    - name: secrets-vol
      emptyDir: {}

Optie 2 — External Secrets Operator (aanbevolen voor cloud-native):
# Syncs AWS Secrets Manager / Azure Key Vault / GCP Secret Manager → Kubernetes Secret
# Installeren: helm install external-secrets external-secrets/external-secrets

apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-store
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: my-app-secrets
spec:
  refreshInterval: 1h        # elk uur synchroniseren
  secretStoreRef:
    name: aws-store
    kind: SecretStore
  target:
    name: my-app-secrets     # creëert dit Kubernetes-geheim
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: prod/myapp/db-password
        property: password

Configureer de secrets-injectie voor mijn cluster en geheime winkel.
```

### Reactie geheimlek

```
Reageer op geheimlek voor [referentietype].

Gelekt referentie: [beschrijven — API-sleutel / DB-wachtwoord / privésleutel / JWT-geheim]
Blootstelling: [openbare GitHub-repo / logs / Slack / onbekend]
Tijd sinds lek: [minuten / uren / dagen]
Betreffende systemen: [lijst]

ONMIDDELLIJKE REACTIE (eerste 30 minuten):

STAP 1 — Referentie NU intrekken:
# API-sleutel (servicespecifiek):
# Stripe: Dashboard → Developers → API Keys → Roll key
# GitHub-token: Settings → Developer settings → Personal access tokens → Delete
# AWS-toegangssleutel: IAM → Users → Security credentials → Deactivate

# Databasewachtwoord:
ALTER USER myapp PASSWORD 'new-secure-password-here';
# Secrets Manager / Vault tegelijkertijd bijwerken

# JWT-ondertekeningsgeheim:
# Verander het geheim → alle bestaande tokens onmiddellijk ongeldig
# Waarschuwing: alle aangemelde gebruikers worden afgemeld

STAP 2 — Blastradiusstraal beoordelen:
□ Wanneer is de referentie gemaakt? (bepaalt het blootstellingsvenster)
□ Waartoe kan het toegang krijgen? (bereik bepaalt ernst)
□ Is er enig bewijs van misbruik? (controleer toegangslogboeken van service)

STAP 3 — Toegangslogboeken controleren:
# AWS CloudTrail: filteren op toegangssleutel-ID
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=AKIA... \
  --start-time $(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%SZ)

# Controleren op: ongewone regio's, ongewone bewerkingen, gegevensdiefstal tekens

STAP 4 — Uit bron verwijderen:
□ Indien in Git: verwijderen, force push, maar onthouden — het is in de geschiedenis
  BFG Repo Cleaner of git-filter-repo gebruiken om de geschiedenis schoon te maken
  Maar: als het openbaar was, ervan uitgaan dat het is vastgelegd — rotatie is het enige fix
□ Indien in logboeken: logboekinvoeren zuiveren, log-forwarding-bestemmingen controleren
□ Indien in Slack: bericht + alle kopieën verwijderen

STAP 5 — Melden:
□ Beveiligingsteam en management
□ Als klantgegevens toegankelijk waren: juridische + DPO-beoordeling (GDPR 72-uurs meldingsregel)
□ Als service verantwoord openbaringsbeleid heeft: volg het

STAP 6 — Grondoorzaak en herhaling voorkomen:
□ Hoe werd het geheim blootgesteld? (verbonden met git / gelogd / hardcoded)
□ Pre-commit hook om geheime commits te voorkomen: install git-secrets of gitleaks
□ Alle andere geheimen van hetzelfde type als voorzorgsmaatregel roteren

Genereer het incident response runbook voor mijn specifieke lek scenario.
```

## Voorbeeld

**Gebruiker:** We hebben een AWS-toegangssleutel gevonden die 3 dagen geleden in een openbare GitHub-repo is gevertoond. De sleutel heeft AdministratorAccess. Wat doen we?

**Claudes antwoord:**

Dit is een kritiek incident. Administrator-toegangssleutel openbaar gedurende 3 dagen = ervan uitgaan dat het werd gevonden en gebruikt. Snel verplaatsen.

**Volgende 5 minuten:**
```bash
# 1. Sleutel onmiddellijk deactiveren (nog niet verwijderen — u hebt de sleutel-ID nodig voor logbookanalyse)
aws iam update-access-key \
  --access-key-id AKIA... \
  --status Inactive \
  --user-name leaked-user

# 2. Controleer of er meerdere sleutels voor deze gebruiker zijn
aws iam list-access-keys --user-name leaked-user
```

**Volgende 30 minuten — onderzoek:**
```bash
# CloudTrail controleren op alle activiteiten met deze sleutel (laatste 90 dagen)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA... \
  --start-time 2026-04-20T00:00:00Z \
  --output json | jq '.Events[] | {time: .EventTime, action: .EventName, region: .CloudTrailEvent}'

# Zoeken naar: CreateUser, CreateRole, AttachPolicy (privilege escalation), S3 GetObject (datendiefetal), EC2 RunInstances (cryptomining)
```

**Na onderzoek:**
- Indien geen verdachte activiteiten → nog steeds behandelen als gecompromitteerd, doorgaan met volledige rotatie
- Indien verdachte activiteit gevonden → beveiligingsincident verklaren, juridische/DPO betrekken, elke actie onderzoeken

**Volledige herstel:**
1. Verwijder gelekte sleutel (na voltooiing logbookanalyse)
2. Audit alle IAM-beleidsregels die gelekte gebruiker had — werden er beleidsstelsels toegepast tijdens het venster?
3. CloudTrail controleren op alle resources die met deze sleutel zijn gemaakt — verwijder verweesde resources
4. Indien deze gebruiker AdministratorAccess had: controleer op nieuwe IAM-gebruikers, rollen of beleidsregels
5. Zet GuardDuty in als niet al ingeschakeld (zou hierop hebben gewaarschuwd)
6. Configureer AWS Config-regel om openbare toegangssleutels te waarschuwen
7. Voeg `git-secrets` of `gitleaks` pre-commit-hook toe aan alle repo's

---

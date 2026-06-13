---
name: secrets-management
description: "Gestion des secrets : configuration HashiCorp Vault, magasins de secrets AWS/Azure/GCP, automatisation de rotation des secrets, injection de secrets Kubernetes, intégration CI/CD et réponse aux fuites de secrets"
---

# Compétence Gestion des Secrets

## Quand l'activer
- Configurer une infrastructure de gestion des secrets (Vault, AWS Secrets Manager, etc.)
- Concevoir l'injection de secrets pour les charges de travail Kubernetes ou les pipelines CI/CD
- Implémenter la rotation automatique des secrets pour les identifiants de base de données ou clés API
- Auditer les motifs d'accès aux secrets pour SOC 2 ou ISO 27001
- Répondre à une fuite de secret qui nécessite une rotation et révocation immédiates
- Migrer de fichiers `.env` vers un magasin de secrets approprié

## Quand NE PAS l'utiliser
- Gestion de fichiers `.env` locaux sur une machine de développeur — utiliser .gitignore + dotenv
- Revue de code pour les secrets codés en dur — utiliser la compétence security-audit pour les trouver
- Chiffrement au niveau application des données utilisateur au repos — préoccupation différente

## Instructions

### Sélection du magasin de secrets

```
Choisir l'approche appropriée de gestion des secrets.

Taille de l'équipe : [X ingénieurs]
Infrastructure : [AWS / Azure / GCP / on-prem / hybride / Kubernetes]
Conformité : [SOC 2 / ISO 27001 / HIPAA / aucune]
Volume de secrets : [X secrets, X applications]
Budget : [$0 / service géré OK / entreprise]

Guide de sélection :

NATIF AU CLOUD (recommandé pour les équipes orientées cloud) :
AWS Secrets Manager :
  - Intégration native : Lambda, ECS, rotation RDS, CloudFormation
  - Coût : $0,40/secret/mois + $0,05/10K appels API
  - Rotation automatique : intégrée pour RDS, DocumentDB, Redshift
  - Meilleur pour : magasins AWS uniquement, équipes voulant zéro ops

Azure Key Vault :
  - Intégration native : App Service, AKS, références Key Vault dans les paramètres app
  - Coût : $0,03/10K opérations (secrets), $0,03/10K (certificats)
  - Meilleur pour : magasins Azure uniquement ou Microsoft

GCP Secret Manager :
  - Intégration native : Cloud Run, GKE, Cloud Functions
  - Coût : $0,06/10K opérations d'accès
  - Meilleur pour : charges de travail natives GCP

AUTO-HÉBERGÉ (recommandé pour les équipes multi-cloud ou orientées conformité) :
HashiCorp Vault :
  - Support : secrets dynamiques, PKI CA, SSH OTP, Kubernetes, multiples backends cloud
  - Coût : open source gratuit ; Entreprise pour espaces de noms, réplication
  - Frais d'exploitation : doit déployer, déverrouiller et maintenir
  - Meilleur pour : multi-cloud, on-prem, exigences de rotation complexes

HCP Vault (géré) :
  - Vault en tant que service de HashiCorp
  - Pas d'ops de cluster ; Vault Dedicated à partir d'environ $700/mois
  - Meilleur pour : équipes voulant les capacités Vault sans les ops

Recommandation pour ma configuration : [option + raison]
```

### Modèles de configuration Vault

```
Configurer HashiCorp Vault pour [environnement].

Déploiement : [Kubernetes / Docker Compose / VM cloud / HCP géré]
Backend de stockage : [Raft (intégré) / Consul / DynamoDB]
Déverrouillage automatique : [AWS KMS / Azure Key Vault / GCP KMS / manuel]
Échelle : [nœud unique dev / HA 3-nœud / production HA]

Configuration HA de production :

# docker-compose.yml (cluster Raft 3-nœud)
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

Méthodes d'authentification (configurer après initialisation) :
# AppRole pour machine-to-machine (services, exécuteurs CI)
vault auth enable approle
vault write auth/approle/role/my-service \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_num_uses=1 \    # IDs secrets à usage unique
  token_policies=my-service-read

# Kubernetes pour authentification de pod
vault auth enable kubernetes
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

Générer la configuration Vault pour ma infrastructure spécifique.
```

### Rotation des secrets

```
Implémenter la rotation automatique des secrets pour [type d'identifiant].

Type d'identifiant : [mot de passe BD / clé API / certificat TLS / clé SSH]
Fréquence de rotation : [30 jours / 90 jours / sur demande]
Applications utilisant ce secret : [liste — comment elles consomment le secret]

Rotation du mot de passe base de données (AWS Secrets Manager) :

# Rotation automatique utilisant Lambda fourni par AWS
aws secretsmanager create-secret \
  --name "prod/myapp/db-password" \
  --secret-string '{"username":"myapp","password":"initial-password"}'

aws secretsmanager rotate-secret \
  --secret-id "prod/myapp/db-password" \
  --rotation-lambda-arn "arn:aws:lambda:us-east-1:ACCOUNT:function:SecretsManagerRDSPostgreSQLRotationSingleUser" \
  --rotation-rules AutomaticallyAfterDays=30

# L'application lit le secret par nom (pas la valeur codée en dur) :
import boto3
import json

def get_db_password():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='prod/myapp/db-password')
    secret = json.loads(response['SecretString'])
    return secret['password']

# MODÈLE CLÉ : L'application lit toujours à l'exécution, ne met jamais en cache indéfiniment
# Gérer la rotation : attraper les défaillances d'authentification, rafraîchir le secret, réessayer une fois

Modèle de rotation BD pour zéro temps d'arrêt :
Phase 1 : Créer nouveau mot de passe en BD (ancien mot de passe fonctionne toujours)
Phase 2 : Mettre à jour Secrets Manager avec le nouveau mot de passe
Phase 3 : Les applications lisent le nouveau mot de passe lors de la prochaine récupération de secret
Phase 4 : Supprimer l'ancien mot de passe de la BD (après période de grâce)

Secrets dynamiques Vault (mieux que la rotation — ne jamais stocker les identifiants longue durée) :
# Chaque demande d'application génère un identifiant unique à durée limitée
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

# L'app reçoit : un identifiant unique valide 1 heure, auto-expiré par Vault
vault read database/creds/my-role

Générer la configuration de rotation pour mon type d'identifiant.
```

### Injection de secrets Kubernetes

```
Injecter les secrets dans les charges de travail Kubernetes.

Cluster : [EKS / AKS / GKE / auto-géré]
Magasin de secrets : [Vault / AWS Secrets Manager / Azure Key Vault / GCP Secret Manager]

Option 1 — Sidecar Vault Agent (plus flexible) :
# Authentification Kubernetes configurée dans Vault d'abord (voir configuration ci-dessus)
# Spec de pod avec sidecar Vault Agent :

apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-app   # doit avoir liaison d'authentification Vault
  initContainers:
    - name: vault-agent-init
      image: hashicorp/vault:1.17
      args: ["agent", "-config=/vault/config/config.hcl"]
      # Écrit les secrets sur le volume partagé avant le démarrage de l'app
  containers:
    - name: app
      volumeMounts:
        - name: secrets-vol
          mountPath: /vault/secrets
          readOnly: true
      # L'app lit : /vault/secrets/db-password (fichier en texte brut)
  volumes:
    - name: secrets-vol
      emptyDir: {}

Option 2 — External Secrets Operator (recommandé pour cloud-native) :
# Syncs AWS Secrets Manager / Azure Key Vault / GCP Secret Manager → Kubernetes Secret
# Installer : helm install external-secrets external-secrets/external-secrets

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
  refreshInterval: 1h        # syncer chaque heure
  secretStoreRef:
    name: aws-store
    kind: SecretStore
  target:
    name: my-app-secrets     # crée ce Kubernetes Secret
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: prod/myapp/db-password
        property: password

Configurer l'injection de secrets pour mon cluster et magasin de secrets.
```

### Réponse à fuite de secret

```
Répondre à une fuite de secret pour [type d'identifiant].

Identifiant fui : [décrire — clé API / mot de passe BD / clé privée / secret JWT]
Exposition : [repo GitHub public / logs / Slack / inconnue]
Temps depuis fuite : [minutes / heures / jours]
Systèmes affectés : [liste]

RÉPONSE IMMÉDIATE (30 premières minutes) :

ÉTAPE 1 — Révoquer l'identifiant MAINTENANT :
# Clé API (spécifique au service) :
# Stripe : Dashboard → Developers → API Keys → Roll key
# Token GitHub : Settings → Developer settings → Personal access tokens → Delete
# Clé d'accès AWS : IAM → Users → Security credentials → Deactivate

# Mot de passe base de données :
ALTER USER myapp PASSWORD 'new-secure-password-here';
# Mettre à jour Secrets Manager / Vault simultanément

# Secret de signature JWT :
# Changer le secret → tous les tokens existants invalides instantanément
# Avertissement : tous les utilisateurs connectés seront déconnectés

ÉTAPE 2 — Évaluer le rayon de blast :
□ Quand l'identifiant a-t-il été créé ? (définit la fenêtre d'exposition)
□ Qu'est-ce qu'il peut accéder ? (la portée détermine la gravité)
□ Y a-t-il des preuves d'abus ? (vérifier les logs d'accès du service)

ÉTAPE 3 — Auditer les logs d'accès :
# AWS CloudTrail : filtrer par l'ID de clé d'accès
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=AKIA... \
  --start-time $(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%SZ)

# Vérifier : régions inhabituelles, opérations inhabituelles, signes d'exfiltration de données

ÉTAPE 4 — Supprimer de la source :
□ Si dans Git : supprimer, forcer push, mais se souvenir — c'est dans l'historique
  Utiliser BFG Repo Cleaner ou git-filter-repo pour nettoyer l'historique
  Mais : si c'était public, supposer qu'c'est capturé — la rotation est le seul correctif
□ Si dans les logs : purger les entrées de log, vérifier les destinations de forwarding
□ Si dans Slack : supprimer le message + toutes les copies

ÉTAPE 5 — Notifier :
□ Équipe de sécurité et gestion
□ Si les données client étaient accessibles : examen juridique + DPO (règle de notification 72h RGPD)
□ Si le service a une politique de divulgation responsable : la suivre

ÉTAPE 6 — Cause racine et prévention de récurrence :
□ Comment le secret s'est-il exposé ? (commis à git / loggé / codé en dur)
□ Crochet pré-commit pour prévenir les commits de secrets : installer git-secrets ou gitleaks
□ Faire tourner tous les autres secrets du même type en précaution

Générer le carnet d'exécution de réponse aux incidents pour mon scénario de fuite spécifique.
```

## Exemple

**Utilisateur :** Nous avons trouvé une clé d'accès AWS commise à un repo GitHub public il y a 3 jours. La clé a AdministratorAccess. Que faisons-nous ?

**Réponse de Claude :**

C'est un incident critique. Clé d'accès administreur public pendant 3 jours = supposer qu'elle a été trouvée et utilisée. Allez vite.

**5 prochaines minutes :**
```bash
# 1. Désactiver la clé immédiatement (ne pas supprimer yet — vous avez besoin de l'ID de clé pour l'analyse de logs)
aws iam update-access-key \
  --access-key-id AKIA... \
  --status Inactive \
  --user-name leaked-user

# 2. Vérifier s'il y a plusieurs clés pour cet utilisateur
aws iam list-access-keys --user-name leaked-user
```

**30 prochaines minutes — enquêter :**
```bash
# Vérifier CloudTrail pour toute activité avec cette clé (90 derniers jours)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA... \
  --start-time 2026-04-20T00:00:00Z \
  --output json | jq '.Events[] | {time: .EventTime, action: .EventName, region: .CloudTrailEvent}'

# Rechercher : CreateUser, CreateRole, AttachPolicy (escalade de privilèges), S3 GetObject (vol de données), EC2 RunInstances (crypto mining)
```

**Après enquête :**
- Si pas d'activité suspecte → toujours traiter comme compromise, procéder à la rotation complète
- Si activité suspecte trouvée → déclarer un incident de sécurité, impliquer juridique/DPO, enquêter sur chaque action

**Remédiation complète :**
1. Supprimer la clé fuie (après analyse de logs complète)
2. Auditer toutes les politiques IAM que l'utilisateur fui avait — des politiques ont-elles été appliquées pendant la fenêtre ?
3. Vérifier CloudTrail pour toute ressource créée avec cette clé — supprimer les ressources orphelines
4. Si cet utilisateur avait AdministratorAccess : vérifier tout nouvel utilisateur IAM, rôles ou politiques créés
5. Activer GuardDuty si pas déjà sur (aurait alerté à ce sujet)
6. Configurer la règle AWS Config pour alerter sur les clés d'accès public créées
7. Ajouter le crochet pré-commit `git-secrets` ou `gitleaks` à tous les repos

---

---
name: cloud-security
description: "Posture de sécurité cloud : détection d'escalade de privilèges IAM, audit d'exposition S3, examen des groupes de sécurité, scan de sécurité IaC — configurations erronées AWS, Azure et GCP"
---

# Compétence Sécurité Cloud

## Quand l'activer
- Audit AWS/Azure/GCP pour les erreurs de configuration de sécurité
- Trouver les chemins d'escalade de privilèges IAM avant qu'un attaquant ne le fasse
- Vérifier les buckets S3/Blob Storage/GCS pour les accès publics involontaires
- Examiner les règles de groupe de sécurité/pare-feu pour l'accès réseau trop permissif
- Scanner les modèles Terraform ou CloudFormation pour les problèmes de sécurité avant le déploiement
- Exécuter une évaluation de base de sécurité cloud

## Quand NE PAS l'utiliser
- Réponse active aux incidents cloud — utiliser l'agent incident-commander
- Tests de pénétration au niveau application — utiliser la compétence security-pen-testing (ou agent red-team pour les engagements autorisés)
- Préparation à la certification de conformité (SOC 2, ISO 27001) — utiliser les compétences spécifiques
- SIEM ou détection de menaces — outillage et processus différents

## Instructions

### Audit d'escalade de privilèges IAM

```
Auditer IAM pour les risques d'escalade de privilèges.

Cloud : [AWS / Azure / GCP]
Portée : [toutes les entités IAM / rôles spécifiques / utilisateur spécifique]
Accès à : [accès en lecture à la console IAM / JSONs de politique exportés]

Chemins courants d'escalade de privilèges IAM (AWS) :

ESCALADE DIRECTE (une seule action octroie l'administration) :
□ iam:CreatePolicyVersion — créer une nouvelle version de politique avec AdministratorAccess
□ iam:SetDefaultPolicyVersion — basculer vers une version précédemment créée et permissive
□ iam:AttachUserPolicy / iam:AttachRolePolicy — attacher AdministratorAccess à soi-même
□ iam:AddUserToGroup — ajouter soi-même au groupe admin
□ iam:CreateAccessKey — créer une clé d'accès pour un autre utilisateur avec plus de privilèges
□ iam:UpdateLoginProfile — réinitialiser le mot de passe d'un utilisateur avec plus de privilèges
□ iam:PassRole + [service]:* — transmettre un rôle d'administration à un service (Lambda, EC2, ECS)

ESCALADE INDIRECTE (via services) :
□ lambda:CreateFunction + iam:PassRole (rôle d'administration) → déployer Lambda exécuté en tant qu'admin
□ ec2:RunInstances + iam:PassRole (rôle d'administration) → lancer EC2 avec profil d'instance admin
□ sts:AssumeRole + politique de confiance permissive → assumer un rôle avec plus de privilèges

PROCÉDURE DE VÉRIFICATION :
1. Lister toutes les politiques IAM attachées à la cible (utilisateur/rôle/groupe)
2. Pour chaque politique, rechercher les actions ci-dessus sur Resource: "*"
3. Vérifier si les actions ci-dessus existent avec des caractères génériques sans condition
4. Vérifier les politiques de confiance de rôle : qui peut assumer ce rôle ? (trop large "*" dans Principal)

Signaux d'alerte immédiate :
🔴 Action: iam:* Resource: * (contrôle IAM complet = admin de facto)
🔴 Action: sts:AssumeRole Resource: * (peut assumer n'importe quel rôle du compte)
🔴 N'importe quelle action générique (*) sur Resource: * (contrôle complet du service)
🔴 Permission PassRole sur ressources * (peut escalader via n'importe quel service)

Commandes AWS CLI à exécuter :
# Lister toutes les politiques pour un utilisateur
aws iam list-attached-user-policies --user-name USERNAME
aws iam list-user-policies --user-name USERNAME

# Obtenir les détails de politique
aws iam get-policy-version --policy-arn POLICY_ARN --version-id v1

# Vérifier qui peut assumer un rôle
aws iam get-role --role-name ROLE_NAME --query 'Role.AssumeRolePolicyDocument'

Sortie : liste des chemins d'escalade trouvés, principal affecté, action spécifique + ressource.
```

### Audit d'accès public S3

```
Auditer les buckets S3 pour l'accès public involontaire.

Portée : [tous les buckets / noms de buckets spécifiques]
Préoccupation : [lecture publique / écriture publique / ACLs publiques]

Surface d'attaque d'accès public S3 :

VÉRIFICATIONS AU NIVEAU BUCKET :
□ Paramètres de bloc d'accès public — les 4 paramètres sont-ils activés ?
  aws s3api get-public-access-block --bucket BUCKET_NAME
  Les 4 devraient être vrais : BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets

□ ACL bucket — le bénéficiaire est-il « AllUsers » ou « AuthenticatedUsers » ?
  aws s3api get-bucket-acl --bucket BUCKET_NAME
  Rechercher : "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
  🔴 AllUsers avec READ = n'importe qui peut lister/télécharger des fichiers
  🔴 AllUsers avec WRITE = n'importe qui peut télécharger/supprimer des fichiers

□ Politique bucket — la politique autorise-t-elle s3:GetObject avec Principal: "*" ?
  aws s3api get-bucket-policy --bucket BUCKET_NAME
  🔴 Principal: "*" + Action: s3:GetObject = lecture publique

VÉRIFICATIONS AU NIVEAU OBJET :
□ Objets individuels avec ACLs publiques (si le bloc ACL bucket n'est pas défini)
  aws s3api list-object-versions --bucket BUCKET_NAME | grep -i "public"

MODÈLES LÉGITIMES COURANTS (vérifier intentionnel) :
- Buckets d'hébergement de site web statique : intentionnellement public, devrait être limité à CloudFront
- Buckets de téléchargement public : la politique devrait se limiter à des préfixes spécifiques, pas tous les objets

Remédiation pour bucket accidentellement public :
# Activer le bloc d'accès public (sûr pour tous les buckets)
aws s3api put-public-access-block \
  --bucket BUCKET_NAME \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Supprimer la politique de bucket public
aws s3api delete-bucket-policy --bucket BUCKET_NAME

Sortie : évaluation du risque par bucket + erreur de configuration spécifique + commande de remédiation.
```

### Audit groupe de sécurité / pare-feu

```
Auditer les groupes de sécurité pour l'accès réseau trop permissif.

Cloud : [groupes de sécurité AWS / NSGs Azure / règles de pare-feu GCP]
Portée : [tous les groupes de sécurité / VPC de production uniquement]

Règles critiques à signaler :

🔴 SSH (port 22) ouvert à 0.0.0.0/0 — SSH accessible sur Internet est une découverte critique
🔴 RDP (port 3389) ouvert à 0.0.0.0/0 — RDP accessible sur Internet est une découverte critique
🔴 Ports de base de données ouverts à 0.0.0.0/0 :
   - MySQL: 3306
   - PostgreSQL: 5432
   - MongoDB: 27017
   - Redis: 6379
   - Elasticsearch: 9200
🔴 Tout le trafic (port 0, protocole -1) depuis 0.0.0.0/0

🟡 HTTP (port 80) ou HTTPS (port 443) depuis 0.0.0.0/0 — généralement intentionnel pour les services web ; vérifier
🟡 Ports de gestion personnalisés (8080, 8443, 9090) depuis 0.0.0.0/0 — devrait être derrière un VPN
🟡 Règles internes trop larges (CIDR VPC entier où seul un SG spécifique est nécessaire)

Audit AWS CLI :
# Trouver les groupes de sécurité avec SSH ouvert sur Internet
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

# Trouver les groupes de sécurité avec tout le trafic ouvert
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.protocol,Values=-1" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

Remédiation pour SSH :
# Remplacer 0.0.0.0/0 par votre IP bastion/VPN
aws ec2 revoke-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr YOUR_VPN_CIDR

Sortie : ID groupe de sécurité, règle, niveau de risque, commande de remédiation.
```

### Scan de sécurité IaC

```
Scanner Infrastructure-as-Code pour les erreurs de configuration de sécurité.

Outil IaC : [Terraform / CloudFormation / Pulumi / Bicep]
Fichiers à scanner : [chemin du répertoire ou liste de fichiers]

Utiliser ces outils pour le scan automatisé :

Terraform :
  tfsec .                          # Plus rapide ; vérifie les erreurs de configuration courantes
  checkov -d .                     # Couverture plus large ; vérifications de benchmark CIS
  terrascan scan -t terraform      # Vérifications mappées NIST, PCI, SOC 2

CloudFormation :
  cfn-nag scan --input-filename template.yaml
  checkov -f template.yaml --framework cloudformation

Erreurs de configuration clés à signaler :

CALCUL :
🔴 Point de terminaison de métadonnées EC2/ECS non restreint (IMDSv2 non appliqué)
🔴 Données utilisateur contenant des secrets ou des identifiants
🟡 Instances sans limite de saut IMDSv2 = 1

STOCKAGE :
🔴 Bucket S3 sans bloc d'accès public
🔴 Bucket S3 sans chiffrement côté serveur
🔴 Bucket S3 sans versioning (risque de perte de données)
🟡 Bucket S3 sans journalisation d'accès

BASE DE DONNÉES :
🔴 RDS publiquement accessible = vrai
🔴 RDS sans chiffrement au repos
🔴 RDS sans protection contre la suppression (en prod)
🟡 RDS sans sauvegardes automatisées
🟡 RDS Multi-AZ désactivé (en prod)

IAM :
🔴 Politique IAM avec Action: * Resource: *
🔴 Rôle IAM avec politique de confiance trop large
🟡 Rotation de clé d'accès IAM non appliquée

RÉSEAU :
🔴 Groupe de sécurité autorisant tout le trafic entrant
🔴 Journaux de flux VPC non activés
🟡 Groupe de sécurité par défaut en utilisation

Générer : liste annotée des découvertes avec fichier IaC + référence de ligne + correction.
```

## Exemple

**Utilisateur :** Notre startup fonctionne sur AWS depuis 18 mois. Nous n'avons jamais effectué d'audit de sécurité. Par où commencer ?

**Audit de base de 30 minutes de Claude :**

Exécuter ces 5 commandes — elles révèlent 80% des risques critiques :

```bash
# 1. Trouver SSH exposé sur Internet (critique — exécuter en premier)
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
  --output table

# 2. Trouver les buckets S3 publics
aws s3api list-buckets --query 'Buckets[*].Name' --output text | \
  xargs -I{} aws s3api get-public-access-block --bucket {} 2>/dev/null || echo "Check manually"

# 3. Trouver les utilisateurs IAM avec AdministratorAccess
aws iam list-attached-user-policies \
  --user-name $(aws iam list-users --query 'Users[*].UserName' --output text) 2>/dev/null

# 4. Trouver les clés d'accès du compte root (devrait être ZÉRO)
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'
# Si la sortie est 1 ou plus : supprimer immédiatement les clés d'accès root

# 5. Vérifier si CloudTrail est activé (votre journal d'audit)
aws cloudtrail describe-trails --query 'trailList[*].[Name,S3BucketName,IsMultiRegionTrail]'
```

**Découvertes les plus courantes dans les comptes AWS datant de 18 mois :**
1. SSH ouvert sur Internet sur une instance dev/staging que quelqu'un a oubliée
2. Clés d'accès root toujours actives (devrait être zéro — root devrait utiliser la console uniquement)
3. CloudTrail non activé dans toutes les régions (lacunes dans la journalisation d'audit)
4. Utilisateurs IAM avec des clés d'accès longue durée jamais renouvelées
5. Bucket S3 avec bloc d'accès public non activé (même sans politique de bucket public)

Corriger d'abord les clés d'accès root et SSH sur Internet — ce sont les deux erreurs de configuration les plus couramment exploitées.

---

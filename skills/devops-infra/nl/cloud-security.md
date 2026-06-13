---
name: cloud-security
description: "Cloud-beveiligingshouding: IAM-privilege-escalatiedetectie, S3-blootstellingsaudit, beveiligingsgroepcontrole, IaC-beveiligingscan — AWS-, Azure- en GCP-misconfiguaties"
---

# Cloud-beveiligingsvaardigheid

## Wanneer activeren
- AWS/Azure/GCP controleren op beveiligingsfouten
- IAM-privilege-escalatiepaden vinden voordat een aanvaller dat doet
- S3/Blob Storage/GCS-buckets controleren op onbedoelde openbare toegang
- Beveiligingsgroep/firewall-regels controleren op te ruime netwerktoegang
- Terraform- of CloudFormation-templates scannen op beveiligingsproblemen voordat deze worden geïmplementeerd
- Een cloudbeveiliging-baselinebeoordeling uitvoeren

## Wanneer NIET gebruiken
- Actieve cloud-incidentrespons — gebruik de incident-commander agent
- Penetratietests op toepassingsniveau — gebruik de security-pen-testing-vaardigheid (of red-team-agent voor geautoriseerde engagements)
- Gereedheid voor nalevingscertificering (SOC 2, ISO 27001) — gebruik specifieke vaardigheden
- SIEM of bedreigingsdetectie — ander gereedschap en proces

## Instructies

### IAM-privilege-escalatieaudit

```
IAM controleren op privilege-escalatierisico's.

Cloud: [AWS / Azure / GCP]
Bereik: [alle IAM-entiteiten / specifieke rollen / specifieke gebruiker]
Toegang tot: [IAM-console alleen-lezen / geëxporteerde beleidsjsons]

Veelvoorkomende IAM-privilege-escalatiepaden (AWS):

DIRECTE ESCALATIE (enkele actie verleent beheerder):
□ iam:CreatePolicyVersion — nieuw beleidsversie met AdministratorAccess maken
□ iam:SetDefaultPolicyVersion — wisselen naar eerder gemaakte ruim beleid
□ iam:AttachUserPolicy / iam:AttachRolePolicy — AdministratorAccess aan jezelf toekennen
□ iam:AddUserToGroup — jezelf aan beheerdersgroep toevoegen
□ iam:CreateAccessKey — toegangssleutel voor andere gebruiker met meer rechten maken
□ iam:UpdateLoginProfile — wachtwoord voor gebruiker met meer rechten opnieuw instellen
□ iam:PassRole + [service]:* — beheerdersrol aan service doorgeven (Lambda, EC2, ECS)

INDIRECTE ESCALATIE (via services):
□ lambda:CreateFunction + iam:PassRole (beheerdersrol) → Lambda implementeren die als beheerder wordt uitgevoerd
□ ec2:RunInstances + iam:PassRole (beheerdersrol) → EC2 met beheerdersinstellingenprofiel starten
□ sts:AssumeRole + ruin vertrouwensbeleid → rol met meer rechten aannemen

CONTROLEVERFAHREN:
1. Alle IAM-beleidsregels auflisten die aan doel (gebruiker/rol/groep) zijn gekoppeld
2. Voor elk beleid naar een van de bovenstaande acties op Resource: "*" zoeken
3. Controleren of een van de bovenstaande acties met voorwaardloze jokertekens bestaat
4. Rolvertrouwensbeleidsregels controleren: wie kan deze rol aannemen? (te ruim "*" in Principal)

Onmiddellijke rode vlaggen:
🔴 Action: iam:* Resource: * (volledig IAM-beheer = de facto beheerder)
🔴 Action: sts:AssumeRole Resource: * (kan elke rol in account aannemen)
🔴 Actie met jokerteken (*) op Resource: * (volledige servicebeheer)
🔴 PassRole-toestemming voor * bronnen (kan via elke service escaleren)

Uit te voeren AWS CLI-opdrachten:
# Alle beleidsregels voor een gebruiker auflisten
aws iam list-attached-user-policies --user-name USERNAME
aws iam list-user-policies --user-name USERNAME

# Beleidsdetails ophalen
aws iam get-policy-version --policy-arn POLICY_ARN --version-id v1

# Controleren wie een rol kan aannemen
aws iam get-role --role-name ROLE_NAME --query 'Role.AssumeRolePolicyDocument'

Uitvoer: lijst gevonden escalatiepaden, getroffen principal, specifieke actie + resource.
```

### S3-audit openbare toegang

```
S3-buckets controleren op onbedoelde openbare toegang.

Bereik: [alle buckets / specifieke bucketnamen]
Zorg: [openbare lees / openbare schrijf / openbare ACLs]

Aanvalsoppervlak van S3-openbare toegang:

CONTROLES OP BUCKETNIVEAU:
□ Instellingen openbare toegangsblok — zijn alle 4 instellingen ingeschakeld?
  aws s3api get-public-access-block --bucket BUCKET_NAME
  Alle 4 moeten waar zijn: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets

□ Bucket-ACL — is de onderwerp "AllUsers" of "AuthenticatedUsers"?
  aws s3api get-bucket-acl --bucket BUCKET_NAME
  Zoeken naar: "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
  🔴 AllUsers met READ = iedereen kan bestanden auflisten/downloaden
  🔴 AllUsers met WRITE = iedereen kan bestanden uploaden/verwijderen

□ Bucketbeleid — staat het beleid s3:GetObject toe met Principal: "*"?
  aws s3api get-bucket-policy --bucket BUCKET_NAME
  🔴 Principal: "*" + Action: s3:GetObject = openbare lees

CONTROLES OP OBJECTNIVEAU:
□ Afzonderlijke objecten met openbare ACLs (indien bucketblok niet ingesteld)
  aws s3api list-object-versions --bucket BUCKET_NAME | grep -i "public"

VEELVOORKOMENDE LEGITIEME PATRONEN (controleer opzet):
- Statische websitehost-buckets: opzettelijk openbaar, moet beperkt zijn tot CloudFront
- Openbare downloadbuckets: beleid moet beperkt zijn tot specifieke voorvoegsels, niet alle objecten

Herstel voor ongewild openbare bucket:
# Openbare toegangsblok inschakelen (veilig voor alle buckets)
aws s3api put-public-access-block \
  --bucket BUCKET_NAME \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Openbare bucketbeleid verwijderen
aws s3api delete-bucket-policy --bucket BUCKET_NAME

Uitvoer: risicobeoordeling per bucket + specifieke misconfiguratie + herstelcommando.
```

### Audit beveiligingsgroep/firewall

```
Beveiligingsgroepen controleren op te ruime netwerktoegang.

Cloud: [AWS-beveiligingsgroepen / Azure NSGs / GCP-firewallregels]
Bereik: [alle beveiligingsgroepen / alleen productie-VPC]

Kritieke regels om te vlaggen:

🔴 SSH (poort 22) open voor 0.0.0.0/0 — internettoegang SSH is kritieke bevinding
🔴 RDP (poort 3389) open voor 0.0.0.0/0 — internettoegang RDP is kritieke bevinding
🔴 Databasepoorten open voor 0.0.0.0/0:
   - MySQL: 3306
   - PostgreSQL: 5432
   - MongoDB: 27017
   - Redis: 6379
   - Elasticsearch: 9200
🔴 Al het verkeer (poort 0, protocol -1) vanaf 0.0.0.0/0

🟡 HTTP (poort 80) of HTTPS (poort 443) van 0.0.0.0/0 — meestal opzettelijk voor webservices; verificatie
🟡 Aangepaste beheerpoorten (8080, 8443, 9090) van 0.0.0.0/0 — moet achter VPN zijn
🟡 Te ruime interne regels (volledige VPC CIDR waar alleen specifieke SG nodig)

AWS CLI-audit:
# Beveiligingsgroepen met SSH open voor internet zoeken
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

# Beveiligingsgroepen met al het verkeer open zoeken
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.protocol,Values=-1" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

Herstel voor SSH:
# Vervang 0.0.0.0/0 door uw bastion/VPN-IP
aws ec2 revoke-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr YOUR_VPN_CIDR

Uitvoer: beveiligingsgroep-ID, regel, risiconiveau, herstelcommando.
```

### IaC-beveiligingsscan

```
Infrastructure-as-Code scannen op beveiligingsfouten.

IaC-tool: [Terraform / CloudFormation / Pulumi / Bicep]
Te scannen bestanden: [directorypad of bestandslijst]

Gebruik deze tools voor geautomatiseerde scanning:

Terraform:
  tfsec .                          # Snelste; controleert veelvoorkomende misconfiguaties
  checkov -d .                     # Bredere dekking; CIS-benchmarkcontroles
  terrascan scan -t terraform      # NIST-, PCI-, SOC-2-gemapte controles

CloudFormation:
  cfn-nag scan --input-filename template.yaml
  checkov -f template.yaml --framework cloudformation

Kernmisconfiguaties om te vlaggen:

COMPUTE:
🔴 EC2/ECS-metagegevensendpoint niet beperkt (IMDSv2 niet afgedwongen)
🔴 Gebruikersgegevens met geheimen of aanmeldingsgegevens
🟡 Instances zonder IMDSv2-hop-limiet = 1

OPSLAG:
🔴 S3-bucket zonder openbare toegangsblok
🔴 S3-bucket zonder versleuteling aan serverzijde
🔴 S3-bucket zonder versiebeheer (gegevensverliesrisico)
🟡 S3-bucket zonder toegangslogboek

DATABASE:
🔴 RDS openbaar toegankelijk = waar
🔴 RDS zonder versleuteling in rust
🔴 RDS zonder verwijderingsbescherming (in prod)
🟡 RDS zonder automatische back-ups
🟡 RDS Multi-AZ uitgeschakeld (in prod)

IAM:
🔴 IAM-beleid met Action: * Resource: *
🔴 IAM-rol met te ruim vertrouwensbeleid
🟡 IAM-sleutelrotatie niet afgedwongen

NETWERK:
🔴 Beveiligingsgroep toestaan inkomend verkeer
🔴 VPC-flowlogboeken niet ingeschakeld
🟡 Standaardbeveiligingsgroep in gebruik

Genereer: geannoteerde lijst bevindingen met IaC-bestand + regelverwijzing + fix.
```

## Voorbeeld

**Gebruiker:** Ons bedrijf draait al 18 maanden op AWS. We hebben nooit een beveiligingsaudit uitgevoerd. Waar beginnen we?

**Claudes 30-minuten baselineaudit:**

Voer deze 5 opdrachten uit — ze brengen 80% van kritieke risico's aan het licht:

```bash
# 1. Met internet blootgestelde SSH zoeken (kritiek — eerst uitvoeren)
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
  --output table

# 2. Openbare S3-buckets zoeken
aws s3api list-buckets --query 'Buckets[*].Name' --output text | \
  xargs -I{} aws s3api get-public-access-block --bucket {} 2>/dev/null || echo "Check manually"

# 3. IAM-gebruikers met AdministratorAccess zoeken
aws iam list-attached-user-policies \
  --user-name $(aws iam list-users --query 'Users[*].UserName' --output text) 2>/dev/null

# 4. Root-accounttoegangssleutels zoeken (moet NULMAAL zijn)
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'
# Indien uitvoer 1 of meer is: root-toegangssleutels onmiddellijk verwijderen

# 5. Controleren of CloudTrail is ingeschakeld (uw auditlogboek)
aws cloudtrail describe-trails --query 'trailList[*].[Name,S3BucketName,IsMultiRegionTrail]'
```

**Meest voorkomende bevindingen in 18 maanden oude AWS-accounts:**
1. SSH open voor het internet op een dev/staging-instance die iemand is vergeten
2. Root-toegangssleutels nog steeds actief (moet nul zijn — root moet alleen console gebruiken)
3. CloudTrail niet in alle regio's ingeschakeld (hiaten in auditlogboek)
4. IAM-gebruikers met langdurige toegangssleutels nooit geroteerd
5. S3-bucket met openbare toegangsblok niet ingeschakeld (zelfs zonder openbare bucketbeleid)

Herstel eerst root-toegangssleutels en internet-SSH — dit zijn de twee meest misbruikte misconfiguaties.

---

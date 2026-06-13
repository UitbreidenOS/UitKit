---
name: cloud-security
description: "Cloud-Sicherheitslage: Erkennung von IAM-Rechteerweiterungen, S3-Offenlegungsprüfung, Sicherheitsgruppenüberprüfung, IaC-Sicherheitsscanning — AWS-, Azure- und GCP-Fehlkonfigurationen"
---

# Cloud-Sicherheitsfähigkeit

## Wann aktivieren
- Prüfung von AWS/Azure/GCP auf Sicherheitsfehlkonfigurationen
- Finden von Wegen zur IAM-Rechteerweiterung vor einem Angreifer
- Prüfung von S3/Blob Storage/GCS-Buckets auf unbeabsichtigten öffentlichen Zugriff
- Überprüfung von Sicherheitsgruppen-/Firewall-Regeln auf zu freizügigen Netzwerkzugriff
- Scannen von Terraform- oder CloudFormation-Vorlagen auf Sicherheitsprobleme vor der Bereitstellung
- Ausführung einer Cloud-Sicherheits-Baseline-Bewertung

## Wann NICHT verwenden
- Aktive Cloud-Incident-Response — verwenden Sie den Agenten incident-commander
- Penetrationstests auf Anwendungsebene — verwenden Sie die Fähigkeit security-pen-testing (oder red-team-Agent für autorisierte Engagements)
- Vorbereitung auf Compliance-Zertifizierung (SOC 2, ISO 27001) — verwenden Sie spezifische Fähigkeiten
- SIEM oder Bedrohungserkennung — unterschiedliche Werkzeuge und Prozesse

## Anweisungen

### IAM-Rechteerweiterungsprüfung

```
IAM auf Risiken der Rechteerweiterung prüfen.

Cloud: [AWS / Azure / GCP]
Umfang: [alle IAM-Entitäten / spezifische Rollen / spezifischer Benutzer]
Zugriff auf: [IAM-Konsolenzugriff nur zum Lesen / exportierte Policy-JSONs]

Häufige Wege zur IAM-Rechteerweiterung (AWS):

DIREKTE ERWEITERUNG (einzelne Aktion erteilt Admin-Rechte):
□ iam:CreatePolicyVersion — neue Policy-Version mit AdministratorAccess erstellen
□ iam:SetDefaultPolicyVersion — auf eine zuvor erstellte freizügige Version wechseln
□ iam:AttachUserPolicy / iam:AttachRolePolicy — AdministratorAccess an sich selbst anfügen
□ iam:AddUserToGroup — sich selbst zur Admin-Gruppe hinzufügen
□ iam:CreateAccessKey — Zugangsschlüssel für einen anderen Benutzer mit mehr Rechten erstellen
□ iam:UpdateLoginProfile — Passwort für einen Benutzer mit mehr Rechten zurücksetzen
□ iam:PassRole + [service]:* — eine Admin-Rolle an einen Dienst übergeben (Lambda, EC2, ECS)

INDIREKTE ERWEITERUNG (über Dienste):
□ lambda:CreateFunction + iam:PassRole (Admin-Rolle) → Lambda bereitstellen, das als Admin ausgeführt wird
□ ec2:RunInstances + iam:PassRole (Admin-Rolle) → EC2 mit Admin-Instanzprofil starten
□ sts:AssumeRole + freizügige Vertrauensrichtlinie → eine Rolle mit mehr Rechten annehmen

ÜBERPRÜFUNGSVERFAHREN:
1. Alle IAM-Richtlinien auflisten, die dem Ziel (Benutzer/Rolle/Gruppe) zugeordnet sind
2. Für jede Richtlinie nach einer der oben genannten Aktionen auf Resource: "*" suchen
3. Überprüfen, ob eine der oben genannten Aktionen mit bedingungslosen Platzhaltern vorhanden ist
4. Rollenvertrauensrichtlinien überprüfen: Wer kann diese Rolle annehmen? (zu breites "*" im Principal)

Unmittelbare rote Flaggen:
🔴 Action: iam:* Resource: * (vollständige IAM-Kontrolle = de-facto-Admin)
🔴 Action: sts:AssumeRole Resource: * (kann jede Rolle im Konto annehmen)
🔴 Jede Platzhalter-Aktion (*) auf Resource: * (vollständige Servicekontrolle)
🔴 PassRole-Berechtigung für * Ressourcen (kann über jeden Dienst erweitern)

Auszuführende AWS CLI-Befehle:
# Alle Richtlinien für einen Benutzer auflisten
aws iam list-attached-user-policies --user-name USERNAME
aws iam list-user-policies --user-name USERNAME

# Richtliniendetails abrufen
aws iam get-policy-version --policy-arn POLICY_ARN --version-id v1

# Überprüfen, wer eine Rolle annehmen kann
aws iam get-role --role-name ROLE_NAME --query 'Role.AssumeRolePolicyDocument'

Ausgabe: Liste der gefundenen Erweiterungswege, betroffener Principal, spezifische Aktion + Ressource.
```

### S3-Prüfung auf öffentlichen Zugriff

```
S3-Buckets auf unbeabsichtigten öffentlichen Zugriff prüfen.

Umfang: [alle Buckets / spezifische Bucketnamen]
Bedenken: [öffentlicher Lesezugriff / öffentlicher Schreibzugriff / öffentliche ACLs]

Angriffsfläche für öffentlichen S3-Zugriff:

PRÜFUNGEN AUF BUCKET-EBENE:
□ Öffentliche Zugangsblock-Einstellungen — sind alle 4 Einstellungen aktiviert?
  aws s3api get-public-access-block --bucket BUCKET_NAME
  Alle 4 sollten wahr sein: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets

□ Bucket-ACL — ist der Empfänger "AllUsers" oder "AuthenticatedUsers"?
  aws s3api get-bucket-acl --bucket BUCKET_NAME
  Suchen Sie nach: "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
  🔴 AllUsers mit READ = jeder kann Dateien auflisten/herunterladen
  🔴 AllUsers mit WRITE = jeder kann Dateien hochladen/löschen

□ Bucket-Richtlinie — erlaubt die Richtlinie s3:GetObject mit Principal: "*"?
  aws s3api get-bucket-policy --bucket BUCKET_NAME
  🔴 Principal: "*" + Action: s3:GetObject = öffentlicher Lesezugriff

PRÜFUNGEN AUF OBJEKTEBENE:
□ Einzelne Objekte mit öffentlichen ACLs (wenn Bucket-ACL-Block nicht gesetzt)
  aws s3api list-object-versions --bucket BUCKET_NAME | grep -i "public"

HÄUFIGE LEGITIME MUSTER (beabsichtigte überprüfen):
- Static-Website-Hosting-Buckets: absichtlich öffentlich, sollte auf CloudFront beschränkt sein
- Öffentliche Download-Buckets: Richtlinie sollte sich auf spezifische Präfixe beschränken, nicht alle Objekte

Behebung für versehentlich öffentlichen Bucket:
# Öffentlichen Zugangsblock aktivieren (sicher für alle Buckets)
aws s3api put-public-access-block \
  --bucket BUCKET_NAME \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Öffentliche Bucket-Richtlinie entfernen
aws s3api delete-bucket-policy --bucket BUCKET_NAME

Ausgabe: Risikobewertung pro Bucket + spezifische Fehlkonfiguration + Behebungsbefehl.
```

### Sicherheitsgruppen-/Firewall-Prüfung

```
Sicherheitsgruppen auf zu freizügigen Netzwerkzugriff prüfen.

Cloud: [AWS-Sicherheitsgruppen / Azure-NSGs / GCP-Firewall-Regeln]
Umfang: [alle Sicherheitsgruppen / nur Produktions-VPC]

Kritische Regeln zum Kennzeichnen:

🔴 SSH (Port 22) offen für 0.0.0.0/0 — SSH mit Internetzugriff ist ein kritischer Befund
🔴 RDP (Port 3389) offen für 0.0.0.0/0 — RDP mit Internetzugriff ist ein kritischer Befund
🔴 Datenbankports offen für 0.0.0.0/0:
   - MySQL: 3306
   - PostgreSQL: 5432
   - MongoDB: 27017
   - Redis: 6379
   - Elasticsearch: 9200
🔴 Gesamter Datenverkehr (Port 0, Protokoll -1) von 0.0.0.0/0

🟡 HTTP (Port 80) oder HTTPS (Port 443) von 0.0.0.0/0 — normalerweise beabsichtigt für Webdienste; überprüfen
🟡 Benutzerdefinierte Verwaltungsports (8080, 8443, 9090) von 0.0.0.0/0 — sollte hinter VPN sein
🟡 Zu breite interne Regeln (gesamte VPC-CIDR, wo nur spezifische SG erforderlich)

AWS CLI-Prüfung:
# Sicherheitsgruppen mit SSH offen für das Internet finden
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

# Sicherheitsgruppen mit gesamtem Datenverkehr offen finden
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.protocol,Values=-1" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

Behebung für SSH:
# Ersetzen Sie 0.0.0.0/0 durch Ihre Bastion-/VPN-IP
aws ec2 revoke-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr YOUR_VPN_CIDR

Ausgabe: Sicherheitsgruppen-ID, Regel, Risikostufe, Behebungsbefehl.
```

### IaC-Sicherheitsscanning

```
Infrastructure-as-Code auf Sicherheitsfehlkonfigurationen scannen.

IaC-Tool: [Terraform / CloudFormation / Pulumi / Bicep]
Zu scannende Dateien: [Verzeichnispath oder Dateiliste]

Verwenden Sie diese Tools für automatisiertes Scanning:

Terraform:
  tfsec .                          # Am schnellsten; überprüft häufige Fehlkonfigurationen
  checkov -d .                     # Breitere Abdeckung; CIS-Benchmark-Überprüfungen
  terrascan scan -t terraform      # NIST-, PCI-, SOC-2-zugeordnete Überprüfungen

CloudFormation:
  cfn-nag scan --input-filename template.yaml
  checkov -f template.yaml --framework cloudformation

Wichtige Fehlkonfigurationen zum Kennzeichnen:

COMPUTE:
🔴 EC2/ECS-Metadaten-Endpunkt nicht eingeschränkt (IMDSv2 nicht erzwungen)
🔴 Benutzerdaten mit Geheimnissen oder Anmeldedaten
🟡 Instanzen ohne IMDSv2-Hop-Limit = 1

SPEICHER:
🔴 S3-Bucket ohne öffentlichen Zugangsblock
🔴 S3-Bucket ohne serverseitige Verschlüsselung
🔴 S3-Bucket ohne Versionierung (Datenverlustrisiko)
🟡 S3-Bucket ohne Zugriffsprotokolierung

DATENBANK:
🔴 RDS öffentlich zugänglich = wahr
🔴 RDS ohne Verschlüsselung im Ruhezustand
🔴 RDS ohne Löschschutz (in Prod)
🟡 RDS ohne automatisierte Sicherungen
🟡 RDS Multi-AZ deaktiviert (in Prod)

IAM:
🔴 IAM-Richtlinie mit Action: * Resource: *
🔴 IAM-Rolle mit zu breiter Vertrauensrichtlinie
🟡 IAM-Zugangsschlüsselrotation nicht erzwungen

NETZWERK:
🔴 Sicherheitsgruppe, die den gesamten eingehenden Datenverkehr zulässt
🔴 VPC-Flow-Logs nicht aktiviert
🟡 Standardsicherheitsgruppe in Verwendung

Generieren: annotierte Liste der Befunde mit IaC-Datei + Zeilenreferenz + Fix.
```

## Beispiel

**Benutzer:** Unser Startup läuft seit 18 Monaten auf AWS. Wir haben noch nie eine Sicherheitsprüfung durchgeführt. Wo fangen wir an?

**Claudes 30-minütige Baseline-Prüfung:**

Führen Sie diese 5 Befehle aus — sie zeigen 80% der kritischen Risiken:

```bash
# 1. Nach Internet-exposiertem SSH suchen (kritisch — zuerst ausführen)
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
  --output table

# 2. Öffentliche S3-Buckets finden
aws s3api list-buckets --query 'Buckets[*].Name' --output text | \
  xargs -I{} aws s3api get-public-access-block --bucket {} 2>/dev/null || echo "Check manually"

# 3. IAM-Benutzer mit AdministratorAccess finden
aws iam list-attached-user-policies \
  --user-name $(aws iam list-users --query 'Users[*].UserName' --output text) 2>/dev/null

# 4. Nach Root-Kontozugriffsschlüsseln suchen (sollte ZERO sein)
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'
# Wenn die Ausgabe 1 oder mehr ist: Root-Zugangsschlüssel sofort löschen

# 5. Überprüfen, ob CloudTrail aktiviert ist (Ihr Audit-Log)
aws cloudtrail describe-trails --query 'trailList[*].[Name,S3BucketName,IsMultiRegionTrail]'
```

**Häufigste Befunde in 18 Monate alten AWS-Konten:**
1. SSH offen für das Internet auf einer Dev/Staging-Instanz, die jemand vergessen hat
2. Root-Zugangsschlüssel immer noch aktiv (sollte Null sein — Root sollte nur Konsole verwenden)
3. CloudTrail nicht in allen Regionen aktiviert (Lücken in der Audit-Protokollierung)
4. IAM-Benutzer mit langlebigen Zugangsschlüsseln, die nie rotiert wurden
5. S3-Bucket mit öffentlichem Zugangsblock nicht aktiviert (auch ohne öffentliche Bucket-Richtlinie)

Beheben Sie zuerst Root-Zugangsschlüssel und Internet-SSH — dies sind die beiden am häufigsten ausgenutztesten Fehlkonfigurationen.

---

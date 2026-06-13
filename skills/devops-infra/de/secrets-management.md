---
name: secrets-management
description: "Secrets-Management: HashiCorp Vault-Setup, AWS/Azure/GCP-Geheimnisspeicher, Automatisierung der Geheimnissperre, Kubernetes-Secrets-Injektion, CI/CD-Integration und Antwort auf Geheimnisverletzungen"
---

# Fähigkeit Secrets-Management

## Wann aktivieren
- Einrichten einer Secrets-Management-Infrastruktur (Vault, AWS Secrets Manager, etc.)
- Entwerfen von Secrets-Injektion für Kubernetes-Workloads oder CI/CD-Pipelines
- Implementierung automatisierter Geheimnisrotation für Datenbankzeugnisse oder API-Schlüssel
- Auditing von Geheimniszugriffsmuster für SOC 2 oder ISO 27001
- Reagieren auf eine Geheimnisverletzung, die sofortige Rotation und Sperrung erfordert
- Migration von `.env`-Dateien zu einem ordnungsgemäßen Geheimnisspeicher

## Wann NICHT verwenden
- Verwaltung lokaler `.env`-Dateien auf einem Entwicklerrechner — .gitignore + dotenv verwenden
- Code-Review für hart codierte Geheimnisse — security-audit-Fähigkeit verwenden, um sie zu finden
- Verschlüsselung auf Anwendungsebene von Benutzerdaten im Ruhezustand — unterschiedliche Bedenken

## Anweisungen

### Auswahl des Geheimnisgebrauchs

```
Wählen Sie den richtigen Geheimnismanagement-Ansatz.

Teamgröße: [X Ingenieure]
Infrastruktur: [AWS / Azure / GCP / on-prem / hybrid / Kubernetes]
Compliance: [SOC 2 / ISO 27001 / HIPAA / keine]
Geheimnivolumen: [X Geheimnisse, X Anwendungen]
Budget: [$0 / verwalteter Service OK / Enterprise]

Auswahlhandbuch:

CLOUD-NATIVE (empfohlen für Cloud-First-Teams):
AWS Secrets Manager:
  - Native Integration: Lambda, ECS, RDS-Rotation, CloudFormation
  - Kosten: $0,40/Geheimnis/Monat + $0,05/10K API-Aufrufe
  - Auto-Rotation: für RDS, DocumentDB, Redshift integriert
  - Beste für: AWS-only-Läden, Teams, die Null-Ops wünschen

Azure Key Vault:
  - Native Integration: App Service, AKS, Key Vault-Verweise in App-Einstellungen
  - Kosten: $0,03/10K Operationen (Geheimnisse), $0,03/10K (Zertifikate)
  - Beste für: Azure-only oder Microsoft-Läden

GCP Secret Manager:
  - Native Integration: Cloud Run, GKE, Cloud Functions
  - Kosten: $0,06/10K Zugriffsvorgänge
  - Beste für: GCP-native Workloads

SELBSTGEHOSTET (empfohlen für Multi-Cloud- oder Compliance-getriebene Teams):
HashiCorp Vault:
  - Unterstützt: dynamische Geheimnisse, PKI CA, SSH OTP, Kubernetes, mehrere Cloud-Backends
  - Kosten: Open Source kostenlos; Enterprise für Namespaces, Replikation
  - Ops-Overhead: muss bereitstellen, entsperren und pflegen
  - Beste für: Multi-Cloud, On-Prem, komplexe Rotationsanforderungen

HCP Vault (verwaltet):
  - Vault als Service von HashiCorp
  - Keine Cluster-Ops; Vault Dedicated ab ca. $700/Monat
  - Beste für: Teams, die Vault-Funktionen ohne Ops wünschen

Empfehlung für mein Setup: [Option + Begründung]
```

### Vault-Setup-Muster

```
HashiCorp Vault für [Umgebung] einrichten.

Bereitstellung: [Kubernetes / Docker Compose / Cloud-VM / HCP-verwaltete]
Speicher-Backend: [Raft (integriert) / Consul / DynamoDB]
Automatisches Entsperren: [AWS KMS / Azure Key Vault / GCP KMS / manuell]
Skalierung: [Einzel-Dev-Knoten / HA 3-Knoten / Produktions-HA]

Konfiguration der Produktions-HA:

# docker-compose.yml (3-Knoten-Raft-Cluster)
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

Authentifizierungsmethoden (nach Initialisierung konfigurieren):
# AppRole für Machine-to-Machine (Services, CI-Runner)
vault auth enable approle
vault write auth/approle/role/my-service \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_num_uses=1 \    # Einmalige Geheimnis-IDs
  token_policies=my-service-read

# Kubernetes für Pod-Authentifizierung
vault auth enable kubernetes
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

Generieren Sie die Vault-Konfiguration für meine spezifische Infrastruktur.
```

### Geheimnissperre

```
Implementieren Sie automatisierte Geheimnissperre für [Berechtigungstyp].

Berechtigungstyp: [Datenbankpasswort / API-Schlüssel / TLS-Zertifikat / SSH-Schlüssel]
Rotationshäufigkeit: [30 Tage / 90 Tage / auf Abruf]
Anwendungen, die dieses Geheimnis verwenden: [Liste — wie sie das Geheimnis verbrauchen]

Datenbankpasswort-Rotation (AWS Secrets Manager):

# Automatische Rotation mit AWS-bereitgestelltem Lambda
aws secretsmanager create-secret \
  --name "prod/myapp/db-password" \
  --secret-string '{"username":"myapp","password":"initial-password"}'

aws secretsmanager rotate-secret \
  --secret-id "prod/myapp/db-password" \
  --rotation-lambda-arn "arn:aws:lambda:us-east-1:ACCOUNT:function:SecretsManagerRDSPostgreSQLRotationSingleUser" \
  --rotation-rules AutomaticallyAfterDays=30

# Anwendung liest Geheimnis nach Namen (nicht hartcodiertem Wert):
import boto3
import json

def get_db_password():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='prod/myapp/db-password')
    secret = json.loads(response['SecretString'])
    return secret['password']

# SCHLÜSSELMUSTER: Anwendung liest immer zur Laufzeit, cached nie unbegrenzt
# Rotation handhaben: Authentifizierungsfehler erfassen, Geheimnis aktualisieren, einmal wiederholen

Datenbankrotationsmuster für Zero Downtime:
Phase 1: Neues Passwort in DB erstellen (altes Passwort funktioniert noch)
Phase 2: Secrets Manager mit neuem Passwort aktualisieren
Phase 3: Anwendungen lesen beim nächsten Geheimnis-Fetch neues Passwort
Phase 4: Altes Passwort aus DB entfernen (nach Übergangsfrist)

Vault-Dynamische Geheimnisse (besser als Rotation — nie langlebige Zeugnisse speichern):
# Jede Anwendungsanfrage generiert ein eindeutiges, zeitgebundenes Zeugnis
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

# App erhält: eindeutiges Zeugnis gültig 1 Stunde, automatisch ablaufen von Vault
vault read database/creds/my-role

Generieren Sie die Rotationseinrichtung für meinen Berechtigungstyp.
```

### Kubernetes-Secrets-Injektion

```
Injizieren Sie Geheimnisse in Kubernetes-Workloads.

Cluster: [EKS / AKS / GKE / selbstverwaltet]
Geheimnisspeicher: [Vault / AWS Secrets Manager / Azure Key Vault / GCP Secret Manager]

Option 1 — Vault Agent Sidecar (am flexibelsten):
# Kubernetes-Authentifizierung zuerst in Vault konfiguriert (siehe Setup oben)
# Pod-Spec mit Vault Agent Sidecar:

apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-app   # muss Vault-Authentifizierungsbindung haben
  initContainers:
    - name: vault-agent-init
      image: hashicorp/vault:1.17
      args: ["agent", "-config=/vault/config/config.hcl"]
      # Schreibt Geheimnisse auf gemeinsames Volume vor App-Start
  containers:
    - name: app
      volumeMounts:
        - name: secrets-vol
          mountPath: /vault/secrets
          readOnly: true
      # App liest: /vault/secrets/db-password (Textdatei)
  volumes:
    - name: secrets-vol
      emptyDir: {}

Option 2 — External Secrets Operator (empfohlen für Cloud-native):
# Syncs AWS Secrets Manager / Azure Key Vault / GCP Secret Manager → Kubernetes Secret
# Installation: helm install external-secrets external-secrets/external-secrets

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
  refreshInterval: 1h        # Synchronisierung jede Stunde
  secretStoreRef:
    name: aws-store
    kind: SecretStore
  target:
    name: my-app-secrets     # erstellt dieses Kubernetes-Secret
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: prod/myapp/db-password
        property: password

Konfigurieren Sie die Secrets-Injektion für meinen Cluster und Geheimnisspeicher.
```

### Antwort auf Geheimnisverletzung

```
Reagieren Sie auf eine Geheimnisverletzung für [Berechtigungstyp].

Undichtes Zeugnis: [beschreiben — API-Schlüssel / DB-Passwort / privater Schlüssel / JWT-Geheimnis]
Belichtung: [öffentliches GitHub-Repo / Logs / Slack / Unbekannt]
Zeit seit Leck: [Minuten / Stunden / Tage]
Betroffene Systeme: [Liste]

SOFORTMASSNAHME (erste 30 Minuten):

SCHRITT 1 — Zeugnis JETZT widerrufen:
# API-Schlüssel (servicespezifisch):
# Stripe: Dashboard → Developers → API Keys → Roll key
# GitHub-Token: Settings → Developer settings → Personal access tokens → Delete
# AWS-Zugangsschlüssel: IAM → Users → Security credentials → Deactivate

# Datenbankpasswort:
ALTER USER myapp PASSWORD 'new-secure-password-here';
# Aktualisieren Sie Secrets Manager / Vault gleichzeitig

# JWT-Signiergeheimnis:
# Ändern Sie das Geheimnis → alle vorhandenen Token sofort ungültig
# Warnung: Alle angemeldeten Benutzer werden abgemeldet

SCHRITT 2 — Auswirkungsradius bewerten:
□ Wann wurde das Zeugnis erstellt? (definiert das Expositionsfenster)
□ Worauf kann es zugreifen? (Umfang bestimmt Schweregrad)
□ Gibt es Hinweise auf Missbrauch? (Zugriffsprotokoll des Services überprüfen)

SCHRITT 3 — Zugriffsprotokoll prüfen:
# AWS CloudTrail: nach Zugangsschlüssel-ID filtern
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=AKIA... \
  --start-time $(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%SZ)

# Überprüfen Sie: ungewöhnliche Regionen, ungewöhnliche Operationen, Datendiebestahlzeichen

SCHRITT 4 — Aus der Quelle entfernen:
□ Wenn in Git: entfernen, force push, aber denken Sie daran — es ist im Verlauf
  BFG Repo Cleaner oder git-filter-repo verwenden, um den Verlauf zu scrubben
  Aber: Wenn es öffentlich war, annehmen, dass es erfasst — Rotation ist das einzige Fix
□ Wenn im Protokoll: Protokolleinträge purgen, Log-Weiterleitungsziele überprüfen
□ Wenn in Slack: Nachricht + alle Kopien löschen

SCHRITT 5 — Benachrichtigung:
□ Sicherheitsteam und Management
□ Wenn Kundendaten zugänglich waren: Rechtliche + DPO-Überprüfung (GDPR 72-Stunden-Benachrichtigungsregel)
□ Wenn der Service eine Verantwortungsoffenlegungspolitik hat: folgen Sie ihr

SCHRITT 6 — Grundursache und Wiederholungsprävention:
□ Wie wurde das Geheimnis offengelegt? (zu Git committed / gelogged / hartcodiert)
□ Pre-Commit-Hook zur Verhinderung von Geheimnis-Commits: git-secrets oder gitleaks installieren
□ Alle anderen Geheimnisse desselben Typs vorsorglich rotieren

Generieren Sie das Incident-Response-Runbook für mein Szenario mit spezifischer Leckverletzung.
```

## Beispiel

**Benutzer:** Wir haben einen AWS-Zugangsschlüssel gefunden, der vor 3 Tagen in ein öffentliches GitHub-Repo übernommen wurde. Der Schlüssel hat AdministratorAccess. Was tun wir?

**Claudes Antwort:**

Dies ist ein kritischer Vorfall. Administator-Zugangsschlüssel öffentlich für 3 Tage = annehmen, dass er gefunden und verwendet wurde. Schnell bewegen.

**Nächste 5 Minuten:**
```bash
# 1. Schlüssel sofort deaktivieren (nicht löschen noch — Sie benötigen die Schlüssel-ID für die Protokollanalyse)
aws iam update-access-key \
  --access-key-id AKIA... \
  --status Inactive \
  --user-name leaked-user

# 2. Überprüfen Sie, ob es mehrere Schlüssel für diesen Benutzer gibt
aws iam list-access-keys --user-name leaked-user
```

**Nächste 30 Minuten — untersuchen:**
```bash
# Überprüfen Sie CloudTrail auf alle Aktivitäten mit diesem Schlüssel (letzte 90 Tage)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA... \
  --start-time 2026-04-20T00:00:00Z \
  --output json | jq '.Events[] | {time: .EventTime, action: .EventName, region: .CloudTrailEvent}'

# Suchen nach: CreateUser, CreateRole, AttachPolicy (Privilege Escalation), S3 GetObject (Datendiebstahl), EC2 RunInstances (Krypto-Mining)
```

**Nach der Untersuchung:**
- Wenn keine verdächtige Aktivität → immer noch als kompromittiert behandeln, vollständige Rotation durchführen
- Wenn verdächtige Aktivität gefunden → sicherheitsrelevanten Vorfall erklären, rechtliche/DPO einbeziehen, jede Aktion untersuchen

**Vollständige Behebung:**
1. Löschen Sie den undichten Schlüssel (nach Abschluss der Protokollanalyse)
2. Prüfen Sie alle IAM-Richtlinien, die der Benutzer hatte — wurden irgendwelche Richtlinien während des Fensters angewendet?
3. Überprüfen Sie CloudTrail auf alle mit diesem Schlüssel erstellten Ressourcen — löschen Sie verwaiste Ressourcen
4. Wenn dieser Benutzer AdministratorAccess hatte: Überprüfen Sie auf alle neu erstellten IAM-Benutzer, Rollen oder Richtlinien
5. Aktivieren Sie GuardDuty, falls nicht bereits aktiviert (hätte hierauf hingewiesen)
6. Konfigurieren Sie AWS Config-Regel, um auf öffentliche Zugangsschlüssels zu warnen
7. Fügen Sie `git-secrets` oder `gitleaks` Pre-Commit-Hook zu allen Repos hinzu

---

# Claude Code Enterprise-Bereitstellung — Compliance und Sicherheit

## Wann aktivieren
Bereitstellung von Claude Code in einer regulierten Industrie (Finanzen, Gesundheitswesen, Regierung); Enterprise-Sicherheitsüberprüfung von KI-Tools; Anforderungen an Datensitzbindung oder Datensouveränität; Fragen zu On-Premises oder Private-Cloud-Bereitstellung; HIPAA-, SOC2-, PCI- oder FedRAMP-Compliance-Anforderungen.

## Wann NICHT verwenden
Einzelne Entwickler oder kleine Teams ohne Compliance-Anforderungen; Standard-Claude Code Nutzung ohne Enterprise-Datenhandhabungseinschränkungen; Teams, die ihre Compliance-Überprüfung bereits abgeschlossen haben und nur Feature-Hilfe benötigen.

## Anweisungen

**Identität und Authentifizierung :**
- Nutze `ANTHROPIC_WORKSPACE_ID` für Workload-Identität Federation — eliminiert langlebige API-Keys aus Umgebungsvariablen und CI-Secrets
- Enterprise SSO über SAML 2.0 oder OIDC für Team-Zugriffskontrolle (Okta, Azure AD, Google Workspace alle unterstützt)
- Rotiere API-Keys mindestens vierteljährlich, falls Workload-Identität Federation nicht in Einsatz ist

**Zero Data Retention (ZDR) :**
- Verfügbar auf Enterprise-Plänen
- Prompts und Antworten werden nicht von Anthropic gelogged oder gespeichert
- Erforderlich für HIPAA; erforderlich für einige PCI DSS Szenarien
- Hol dir ein signiertes BAA von Anthropic, bevor du irgendwelche PHI sendest — ZDR allein stellt kein BAA dar
- Bestätige, dass ZDR auf deinem Workspace aktiv ist, bevor du regulierte Daten in Sessions zulässt

**Netzwerkkonfiguration :**
- Claude Code erfordert nur ausgehendes HTTPS — keine eingehenden Ports erforderlich
- Funktioniert hinter Corporate-Proxies: setze `HTTPS_PROXY` Umgebungsvariable
- Keine speziellen Firewall-Regeln über ausgehendes Port 443 zu Anthropic-Endpunkten
- Für Private-Endpoint-Bereitstellungen, setze `ANTHROPIC_BASE_URL` auf deinen Bedrock oder Vertex Endpoint

**Datensitzbindung — nutze Cloud-Provider für regionales Processing :**

| Region-Anforderung | Provider und Region |
|---|---|
| Nur US | Direkte Anthropic API (us-east-1) oder Bedrock us-east-1 |
| Nur EU | Bedrock eu-west-1 oder Vertex AI eu-west-4 |
| APAC | Bedrock ap-northeast-1 |

Direkte Anthropic API verarbeitet nur in US-Rechenzentren — nutze Bedrock oder Vertex für Non-US-Sitzbindungsanforderungen.

**Audit Logging :**
Alle Claude Code Tool-Aufrufe loggen zu lokalen `.claude/` Session-Dateien. Für SIEM-Integration:
- Versende Logs zu Splunk, Datadog oder Elastic über einen PostToolUse Hook
- Log-Felder: Timestamp, Tool-Name, Input-Zusammenfassung, Exit-Code, Session-ID
- Behalte Logs gemäß deinem behördlichen Aufbewahrungsplan (7 Jahre für die meisten Finanzbestimmungen)

**Gesundheitswesen (HIPAA) :**
- ZDR + Bedrock oder Vertex erforderlich (nie direkte API für PHI)
- BAA von Anthropic erforderlich — vor erste PHI-Session abrufen
- Stellen Claude Code in einem VPC mit privaten Endpoints bereit; kein öffentlicher Internet Ausgang für PHI-behandelnde Sessions
- Klebe nie PHI in Prompts ohne bestätigte ZDR aktiv

**Finanzen (SOC2/PCI) :**
- Secret Scanner Hook obligatorisch auf allen Developer-Sessions (verhindere versehentliche Key-Commits)
- Deaktiviere Internet-Zugriff in CI-Umgebungen, die Claude Code ausführen
- Auditiere alle Tool-Aufrufe — logge mindestens jedes File Write und Shell Command
- Code-Review Hook erforderlich vor jedem Claude Code-initiierten Production Deploy
- PCI DSS Scope: bestätige mit deinem QSA, ob Claude Code Sessions Cardholder-Daten-Umgebungen berühren

**Regierung (FedRAMP) :**
- FedRAMP-autorisierte Bereitstellung via AWS GovCloud mit Bedrock
- Überprüfe aktuellen FedRAMP-Autorisierungsstatus auf FedRAMP-Marketplace vor Beschaffung — Autorisierungsstufen und Scope ändern sich
- GovCloud-Endpunkte erfordern separate API-Anmeldedaten vom kommerziellen AWS

**Air-Gapped / Privates Netzwerk :**
- Claude Code kann komplett gegen private Bedrock oder Vertex Endpunkte laufen
- Setze `ANTHROPIC_BASE_URL` auf deine Private-Endpoint-URL
- Alle MCP-Server, die in `.claude/mcp.json` referenziert sind, müssen auch ohne öffentlichen Internet-Zugang erreichbar sein
- Keine Telemetrie oder Update-Checks rufen an, wenn `ANTHROPIC_BASE_URL` auf einen privaten Endpoint gesetzt ist

## Beispiel

Finanzdienstleistungsfirma mit Deployment zu 50 Ingenieuren :
- SSO über Okta SAML an `ANTHROPIC_WORKSPACE_ID` gebunden
- Bedrock eu-west-1 für EU Datensitzbindungsanforderung
- `HTTPS_PROXY` auf Org-Level über IT-verwaltete Umgebung gesetzt
- Secret Scanner Hook auf alle Sessions via gemeinsamer `CLAUDE.md` in Monorepo-Root angewendet
- PostToolUse Hook versended Audit-Logs zu Splunk mit Session-ID und Tool-Name
- ZDR-Vereinbarung in Kraft; BAA nicht erforderlich (kein PHI)
- Kein direkter Anthropic API-Zugriff — all Traffic wird über privaten Bedrock-Endpoint geroutet

---

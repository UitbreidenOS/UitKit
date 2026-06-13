# Claude Code Enterprise Deployment — Compliance en Beveiliging

## Wanneer activeren
Inzetten van Claude Code in een gereglementeerde industrie (financiën, gezondheidszorg, overheid); enterprise security review van AI-tools; data residency of sovereignty requirements; vragen over on-premises of private cloud deployment; HIPAA, SOC2, PCI of FedRAMP compliance requirements.

## Wanneer NIET gebruiken
Individuele ontwikkelaars of kleine teams zonder compliance requirements; standaard Claude Code-gebruik zonder enterprise-databeheersingsbeperkingen; teams die hun compliance review al hebben voltooid en alleen feature-hulp nodig hebben.

## Instructies

**Identiteit en authenticatie :**
- Gebruik `ANTHROPIC_WORKSPACE_ID` voor workload identity federation — elimineert langdurige API-sleutels uit omgevingsvariabelen en CI-geheimen
- Enterprise SSO via SAML 2.0 of OIDC voor team access control (Okta, Azure AD, Google Workspace allemaal ondersteund)
- Roteer API-sleutels minimaal driemaandelijks als workload identity federation niet in gebruik is

**Zero Data Retention (ZDR) :**
- Beschikbaar op Enterprise-plannen
- Prompts en responses worden niet geloggerd of opgeslagen door Anthropic
- Vereist voor HIPAA; vereist voor sommige PCI DSS-scenario's
- Haal een ondertekende BAA van Anthropic voordat je PHI verzendt — ZDR alleen vormt geen BAA
- Bevestig dat ZDR actief is op uw workspace voordat u gereglementeerde gegevens in sessies toestaat

**Netwerkconfiguratie :**
- Claude Code vereist alleen uitgaande HTTPS — geen binnenkomende poorten vereist
- Werkt achter bedrijfsproxyservers: stel `HTTPS_PROXY` omgevingsvariabele in
- Geen speciale firewall-regels buiten uitgaande poort 443 naar Anthropic-eindpunten
- Voor private endpoint deployments, stel `ANTHROPIC_BASE_URL` in op uw Bedrock- of Vertex-eindpunt

**Data residency — gebruik cloud providers voor regionale verwerking :**

| Regiovereiste | Provider en regio |
|---|---|
| Alleen VS | Directe Anthropic API (us-east-1) of Bedrock us-east-1 |
| Alleen EU | Bedrock eu-west-1 of Vertex AI eu-west-4 |
| APAC | Bedrock ap-northeast-1 |

Directe Anthropic API verwerkt alleen in Amerikaanse datacenters — gebruik Bedrock of Vertex voor non-US data residency vereisten.

**Audit logging :**
Alle Claude Code tool calls loggen naar lokale `.claude/` session-bestanden. Voor SIEM-integratie:
- Stuur logs naar Splunk, Datadog of Elastic via een PostToolUse hook
- Log-velden: timestamp, toolnaam, invoersamenvatting, exitcode, sessie-ID
- Bewaar logs volgens uw regelgeving retentieschema (7 jaar voor meeste financiële regelgeving)

**Gezondheidszorg (HIPAA) :**
- ZDR + Bedrock of Vertex vereist (nooit directe API voor PHI)
- BAA van Anthropic vereist — haal op voordat eerste PHI-sessie
- Implementeer Claude Code in een VPC met private eindpunten; geen openbare internet egress voor PHI-behandelende sessies
- Plak nooit PHI in prompts zonder actieve ZDR-bevestiging

**Financiën (SOC2/PCI) :**
- Secret scanner hook verplicht op alle developer-sessies (voorkomen accidentele key-commits)
- Schakel internet-toegang uit in CI-omgevingen die Claude Code uitvoeren
- Auditeer alle tool-aanroepen — logge minimaal elk bestandschrift en shell-commando
- Code review hook vereist voordat Claude Code Production deploy initieert
- PCI DSS-scope: bevestig met uw QSA of Claude Code-sessies omgevingen met kaarthoudergegevens raken

**Regering (FedRAMP) :**
- FedRAMP-geautoriseerde implementatie via AWS GovCloud met Bedrock
- Controleer huidige FedRAMP-autorisatiestatus op FedRAMP-marktplaats voordat u aanschaft — autorisatieniveaus en bereik veranderen
- GovCloud-eindpunten vereisen afzonderlijke API-referenties van commerciële AWS

**Air-gapped / privé netwerk :**
- Claude Code kan volledig tegen private Bedrock- of Vertex-eindpunten worden uitgevoerd
- Stel `ANTHROPIC_BASE_URL` in op uw private endpoint URL
- Alle MCP-servers waarnaar wordt verwezen in `.claude/mcp.json` moeten ook bereikbaar zijn zonder openbare internettoegang
- Geen telemetrie of updatecontroles telefoon thuis als `ANTHROPIC_BASE_URL` is ingesteld op een private endpoint

## Voorbeeld

Bedrijf financiële diensten inzetten naar 50 ingenieurs:
- SSO via Okta SAML gebonden aan `ANTHROPIC_WORKSPACE_ID`
- Bedrock eu-west-1 voor EU data residency vereiste
- `HTTPS_PROXY` ingesteld op organisatieniveau via IT-beheerde omgeving
- Secret scanner hook toegepast op alle sessies via gedeelde `CLAUDE.md` in monorepo root
- PostToolUse hook zendt audit logs naar Splunk met sessie-ID en toolnaam
- ZDR-overeenkomst in plaats; BAA niet vereist (geen PHI)
- Geen direct Anthropic API-toegang — al verkeer wordt gerouteerd via private Bedrock-eindpunt

---

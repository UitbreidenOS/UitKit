# Compliance & Zertifizierungen

Dieses Dokument beschreibt die Compliance-Position der Claudient Enterprise Edition, Zertifizierungen und Ausrichtung auf regulatorische Frameworks.

## SOC 2 Type II

**Status**: Attestation für Claudient Cloud Bereitstellungen verfügbar

Claudient Cloud wird jährlich von einer unabhängigen CPA-Wirtschaftsprüfungsgesellschaft geprüft. Der Bericht behandelt:

- **CC6 — Logische und physische Zugangskontrollen**: Benutzerauthentifizierung (SSO), API-Schlüsselverwaltung, Audit-Log-Zugriff
- **CC7 — Systemüberwachung**: Kontinuierliche Protokollierung aller Tool-Aufrufe, Kostendurchsetzung, Anomalieerkennung
- **CC8 — Änderungsverwaltung**: Dateiablauf-Audit-Trail, Genehmigungsarbeitsabläufe, Rollback-Funktionen
- **CC9 — Risikominderung**: Kostengrenzen verhindern Ausgabenüberschreitungen; PII-Scanning verhindert Datenoffenlegung

**So greifen Sie zu**: Fordern Sie `SOC 2 Type II Report` von sales@claudient.com an (NDA erforderlich)

**Umfang**: Claudient Cloud-Infrastruktur und verwaltete Bereitstellungen nur. On-Prem `.claude/` Hooks werden vom Kunden verwaltet.

## ISO 27001

**Status**: Zertifizierung in Arbeit (Q3 2026)

Claudient implementiert ISO 27001 Informationssicherheitsmanagementsystem (ISMS) mit Abdeckung:

- **A.5**: Organisation der Informationssicherheit
- **A.6**: Personalversicherheit
- **A.7**: Vermögensverwaltung
- **A.9**: Zugangskontrollen
- **A.10**: Kryptographie
- **A.12**: Betriebssicherheit
- **A.13**: Kommunikationssicherheit
- **A.14**: Systementwicklung
- **A.15**: Lieferantenbeziehungen
- **A.16**: Incident Management

**Ziel**: August 2026 Zertifizierung

## GDPR Compliance

### Datenverarbeitungsvereinbarung (DPA)

Bei Verwendung von Claudient Cloud gilt ein Datenverarbeitungszusatz (DPA):

- Claudient fungiert als **Datenverarbeiter** (Sie sind der Controller)
- EU Standard Contractual Clauses (SCCs) enthalten
- Unterauftragnehmer aufgelistet und genehmigt
- Datentransfers in die USA erfordern zusätzliche Schutzmaßnahmen

**So erhalten Sie**: Enthalten in Enterprise-Lizenz. Fordern Sie von sales@claudient.com an.

### Ihre Verantwortung

Als Controller, der Claude Code + Claudient Cloud nutzt:

1. **Dateneinsparung**: Vermeiden Sie unnötige Verarbeitung personenbezogener Daten
2. **Zustimmung**: Stellen Sie sicher, dass Mitarbeiter/Benutzer der Verarbeitung zustimmen
3. **Recht auf Löschung**: Benutzer können Löschung von Audit-Logs anfordern
4. **Datenspeicherung**: Legen Sie Audit-Log-Aufbewahrung entsprechend Ihrer Richtlinie fest
5. **Benachrichtigung bei Verstöß**: Falls Claude Code PII verarbeitet und ein Verstoß auftritt, benachrichtigen Sie Ihren DPA innerhalb von 72 Stunden

### Wichtige Funktionen für GDPR

- **Audit-Protokollierung**: Erfüllt Rechenschaftspflicht (Artikel 5.2)
- **PII-Scanning**: Verhindert versehentliche Offenlegung (Artikel 32)
- **Datenlösch-API**: Unterstützt Recht auf Löschung (Artikel 17)
- **Rollenbasierter Zugriff**: Beschränken Sie, wer Audit-Logs zugreifen kann
- **Verschlüsselung**: Daten während Übertragung (TLS 1.3) und im Ruhezustand (AES-256-GCM)
- **DPA**: Standard-Vertragsbedingungen für rechtmäßige Verarbeitung

## HIPAA

**Status**: HIPAA-Compliance für Claudient Cloud verfügbar (Business Associate Agreement erforderlich)

Bei Verarbeitung von Protected Health Information (PHI):

1. **BAA anfordern**: Claudient unterzeichnet Business Associate Agreement per 45 CFR §164.308(b)
2. **Verschlüsselung aktivieren**: 
   - Audit-Logs im Ruhezustand verschlüsselt (AES-256-GCM)
   - TLS 1.3 während Übertragung
   - `encryption_at_rest: true` in settings.json setzen
3. **Audit-Trail**: Alle PHI-Zugriffe werden protokolliert
4. **Zugangskontrollen**: RBAC zur Einschränkung des Claude Code Zugriffs verwenden
5. **Incident Response**: Claudient unterstützt Forensik-Log-Export

**Nicht abgedeckt**: On-Prem-Bereitstellungen (Sie sind für HIPAA-Compliance Ihrer `.claude/` Hooks verantwortlich).

### Checkliste für HIPAA-Bereitstellungen

- [ ] BAA mit Claudient signiert
- [ ] Claudient Cloud aktiviert
- [ ] Verschlüsselung im Ruhezustand aktiviert
- [ ] TLS 1.3 für alle Netzwerkverkehr
- [ ] SAML SSO konfiguriert
- [ ] Audit-Protokollierung mit 6-jähriger Aufbewahrung aktiviert
- [ ] PII-Scanning aktiviert
- [ ] Cost-Cap-Enforcer bereitgestellt
- [ ] Personalschulung: Nur notwendige PHI an Claude Code übermitteln
- [ ] Incident-Response-Plan dokumentiert

## PCI-DSS

**Status**: Nicht im Umfang für Claudient (Claude Code sollte niemals Kartennummern verarbeiten)

Bei Arbeit mit Zahlungsdaten:

1. **Verarbeiten Sie KEINE Kartendaten** in Claude Code Sessions
2. **PII-Scanning verwenden**: Aktivieren Sie zum Erkennen und Blockieren von Kartennummern
3. **Tokenisierung**: Ersetzen Sie Kartennummern durch Tokens
4. **Separat auditieren**: Wenn eine Datei mit PII versehentlich verarbeitet wird, sind Audit-Logs für Incident Response verfügbar

## FedRAMP (Regierungsauftragnehmer)

**Status**: FedRAMP Authorized Deployment Q4 2026

Für US-Regierungsauftragnehmer:

- Claudient Cloud verfolgt **FedRAMP Moderate** Autorisierung
- Air-Gapped On-Prem-Bereitstellung verfügbar (keine externen Netzwerkaufrufe)
- Unterstützt NIST SP 800-53 Kontrollen

**Aktuelle Funktionen**:
- Lokale Audit-Protokollierung
- Verschlüsselte Audit-Logs via `.claude/` Hooks
- SAML 2.0 Integration mit On-Prem-IdP
- Keine externen API-Aufrufe
- Kostendurchsetzung via lokale Hooks

**Zukunft** (Q4 2026):
- FedRAMP Authorized Cloud Environment
- FISMA Compliance Dashboard
- Incident Response Integration

## EU AI Act Compliance

**Status**: Alignment mit EU AI Regulation (2024/1689)

Claude Code ist ein **AI-System** unter der Verordnung. Claudient implementiert:

### Hochrisiko-Kategorien (Anhang III)

Claude Code ist **nicht** hochrisiko selbst (ist ein Entwicklungs-Tool, keine autonome Entscheidungsfindung). Aber wenn Sie es zum Aufbau von Hochrisiko-AI-Systemen verwenden:

1. **Transparenz**: Audit-Logs dokumentieren alle Claude-Entscheidungen
2. **Menschliche Aufsicht**: RBAC stellt sicher, dass Sicherheitsoffizier vor Deployment überprüft
3. **Datenqualität**: PII-Scanning verhindert Training auf personenbezogenen Daten
4. **Dokumentation**: Audit-Trail als Compliance-Dokumentation

### Verpflichtungen für Benutzer

Wenn Sie Claude Code zum Entwickeln eines Hochrisiko-AI-Systems nutzen:

- [ ] Führen Sie Impact Assessment durch
- [ ] Dokumentieren Sie Claude Code's Rolle
- [ ] Behalten Sie Audit-Trail für regulatorische Inspektionen
- [ ] Bieten Sie Endbenutzer-Transparenz

### Wichtige Funktionen

- **Audit-Trail** (Artikel 5.2a): Complete Log von Claude Code Entscheidungen
- **Transparenz** (Artikel 6): Erklären Sie, warum bestimmte Tools verwendet wurden
- **Data Governance** (Artikel 10): PII-Scanning verhindert voreingenommene/nicht genehmigte Daten
- **Bias Monitoring** (Artikel 15): Kostenallokation und Zugriffskontrolle verhindern Diskriminierung

## SOX (Sarbanes-Oxley)

**Status**: Nützlich für Finance/Audit Teams

Wenn Ihr Unternehmen börsennotiert ist:

1. **IT General Controls (ITGCs)**: Claudient erfüllt Change Management, Zugriffskontrolle, Segregation of Duties
2. **Finanzielle Systemänderungen**: Protokollieren Sie alle Änderungen an Buchhaltungssystemen
3. **Dokumentation**: Exportieren Sie Audit-Logs für Audit Committee Review

**Nützliche Reports**:
- **Change Log**: `jq 'select(.tool_name == "Write" or .tool_name == "Edit")' .claude/logs/audit.log`
- **Who changed what**: Gruppieren Sie nach user_id
- **Cost Attribution**: Verfolgen Sie Kostenattribution nach Team

## PII-Erkennungsregeln

Der Built-in PII Scanner von Claudient erkennt:

| Typ | Regex | Aktion |
|------|-------|--------|
| E-Mail | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` | Block / Flag |
| Telefon | `(\+?1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}` | Block / Flag |
| SSN | `\d{3}-\d{2}-\d{4}` | Block / Flag |
| Kreditkarte | `\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b` | Block / Flag |
| Pass | `[A-Z0-9]{6,9}` | Flag |
| API Key | `(api|secret|token)[-_]?key[-_]?[=:]\s*[A-Za-z0-9_-]{20,}` | Block |

Konfigurieren Sie in settings.json:

```json
{
  "security": {
    "pii_scanning": {
      "enabled": true,
      "action": "block",
      "custom_patterns": [
        {
          "name": "company_employee_id",
          "regex": "EMP[0-9]{6}",
          "action": "flag"
        }
      ]
    }
  }
}
```

## Compliance Audit Checkliste

Verwenden Sie bei der Vorbereitung auf externe Audits:

- [ ] SSO konfiguriert
- [ ] Audit-Protokollierung aktiviert (7+ Jahre Aufbewahrung)
- [ ] Verschlüsselung aktiviert (TLS 1.3, AES-256 im Ruhezustand)
- [ ] RBAC konfiguriert
- [ ] PII-Scanning aktiviert
- [ ] Cost Caps durchgesetzt
- [ ] Incident Response Plan dokumentiert
- [ ] Personalschulung abgeschlossen
- [ ] DPA/BAA signiert
- [ ] Audit-Logs gemäß Richtlinie aufbewahrt

---

**Last updated**: 2026-06-15  
**Contact**: compliance@claudient.com  
**Related files**: `AUDIT_TRAIL.md`, `RBAC.md`, `SSO_SETUP.md`

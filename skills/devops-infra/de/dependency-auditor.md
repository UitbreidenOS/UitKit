---
name: dependency-auditor
description: "Abhängigkeits-Audit: SCA-Scanning, SBOM, Schwachstellen-Management, Abhängigkeits-Upgrades"
---

# Fähigkeit Dependency Auditor

## Wann aktivieren
- Scanner Abhängigkeiten auf Schwachstellen
- Generiere SBOM
- Plane Abhängigkeits-Upgrades
- Verwalte gefundene Schwachstellen
- Compliance-Audit

## Anweisungen

```
Abhängigkeits-Audit für [Projekt].

Sprache: [npm / pip / Maven / Go / Cargo]
Scope: [production / all]

Tools: npm audit, pip audit, Snyk, Dependabot, FOSSA

Prozess:
1. Aktuellen Status scannen
2. Nach Severity kategorisieren (Critical/High/Medium/Low)
3. Impact von Upgrades evaluieren
4. Upgrades planen
5. Upgrades testen
6. Deployen

SBOM (Software Bill of Materials):
- Generiere mit: syft, cyclonedx, oder native Sprach-Tools
- Format: CycloneDX JSON/XML oder SPDX

Audit-Report und Remediation-Plan für mein Projekt generieren.
```

---

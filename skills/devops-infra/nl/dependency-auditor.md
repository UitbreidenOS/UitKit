---
name: dependency-auditor
description: "Afhankelijk-audit: SCA-scan, SBOM, kwetsbaarheidsbeheer, afhankelijkheids-upgrades"
---

# Vaardigheid Dependency Auditor

## Wanneer activeren
- Scan afhankelijkheden op kwetsbaarheden
- Genereer SBOM
- Plan afhankelijkheids-upgrades
- Beheer gevonden kwetsbaarheden
- Compliance-audit

## Instructies

```
Afhankelijkheds-audit voor [project].

Taal: [npm / pip / Maven / Go / Cargo]
Scope: [productie / alles]

Tools: npm audit, pip audit, Snyk, Dependabot, FOSSA

Proces:
1. Huidge status scannen
2. Kategoriseer naar severity (Critical/High/Medium/Low)
3. Evalueer impact van upgrades
4. Plan upgrades
5. Test upgrades
6. Deploy

SBOM (Software Bill of Materials):
- Genereer met: syft, cyclonedx, of native taal-tools
- Format: CycloneDX JSON/XML of SPDX

Audit-rapport en remediation-plan voor mijn project genereren.
```

---

---
name: dependency-auditor
description: "Audit des dépendances : scanning SCA, SBOM, gestion des vulnérabilités, upgrading de dépendances, cycle de vie des packages"
---

# Compétence Auditeur de Dépendances

## Quand l'activer
- Scanner les dépendances pour les vulnérabilités
- Générer une liste de matériaux logiciels (SBOM)
- Planifier les upgrades de dépendances
- Gérer les vulnérabilités découvertes
- Audit de conformité

## Instructions

```
Audit des dépendances pour [projet].

Langage: [npm / pip / Maven / Go / Cargo]
Scope: [production / tous]

Outils: npm audit, pip audit, Snyk, Dependabot, FOSSA, WhiteSource

Processus:
1. Scanner l'état actuel
2. Catégoriser par gravité (Critical/High/Medium/Low)
3. Évaluer l'impact des upgrades
4. Planifier les upgrades
5. Tester les upgrades
6. Déployer

SBOM (Software Bill of Materials):
- Générer avec: syft, cyclonedx, ou outil natif du langage
- Format: CycloneDX JSON/XML ou SPDX

Générer rapport d'audit et plan d'remediation pour mon projet.
```

---

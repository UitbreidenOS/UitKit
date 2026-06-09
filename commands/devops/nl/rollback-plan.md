---
description: Genereer een stap-voor-stap terugdraaiplan voor de huidige implementatie of recente wijziging
argument-hint: "[service name, version, or PR/commit to roll back]"
---
Genereer een terugdraaiplan voor: $ARGUMENTS

Inspecteer het project om het implementatiemechanisme (Kubernetes, ECS, Heroku, bare VM, Lambda, etc.), de CI/CD-pijplijn en eventuele stateful componenten (databases, wachtrijen, caches, feature flags) te bepalen.

Produceer een runbook met deze secties:

**1. Checklist voorafgaande aan terugdraaien**
- Bevestig de doelvorige versie/revisie waarnaar moet worden teruggekeerd (afbeeldingstag, Git SHA, Helm-revisie)
- Bepaal wie goedkeuring moet geven voordat wordt uitgevoerd (on-call lead, incident commander)
- Controleer dat het vorige artefact nog steeds in het register/archief bestaat — als niet, markeer dit onmiddellijk
- Noem alle schemamigraties die sinds de vorige versie zijn toegepast (niet-reversibele migraties blokkeren een schone terugkeer)

**2. Impactbeoordeling**
- Geschatte uitvaltijd of verminderde periode tijdens terugdraaien
- Welke gebruikers/tenants/regio's zijn getroffen
- Alle gegevens die sinds de foute implementatie zijn geschreven en die mogelijk niet compatibel zijn met het vorige schema

**3. Terugdraaistappen** (genummerd, copy-paste klaar commando's)

Voor Kubernetes:
```
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
kubectl get pods -n <namespace> -w
```

Voor Helm:
```
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace>
```

Voor databasemigraties: geef het exacte down-migratie commando of noteer dat handmatige schema-omkering vereist is en geef aan welke SQL moet worden uitgevoerd.

Voor feature flags: noem welke vlaggen uit moeten worden gezet voor of na de binaire terugkeer.

**4. Verificatiestappen**
- Smoke test commando's of URL's om te bevestigen dat de service gezond is op de vorige versie
- Sleutelmetrieken om 10 minuten na terugdraaien te controleren (foutpercentage, latency p99, wachtrijdiepte)

**5. Afbreukcriteria**
- Voorwaarden waaronder het terugdraaien zelf moet worden gestopt en geëscaleerd
- Terugval als terugdraaien mislukt (bijv. verplaatsing van verkeer naar een bekende goede regio)

**6. Acties na terugdraaien**
- Open een trackingprobleem voor root cause analyse
- Behoud logs en traces uit het incidentvenster voordat ze verlopen
- Tijdlijn om opnieuw in te stellen met de fix

Markeer elke stap die niet kan worden geautomatiseerd en handelsgewijze oordeel of verheven toegang vereist.

---
description: Genereer een stap-voor-stap rollback plan voor de huidige deployment of recente wijziging
argument-hint: "[servicenaam, versie, of PR/commit om terug te draaien]"
---
Genereer een rollback plan voor: $ARGUMENTS

Controleer het project om het implementatiemechanisme (Kubernetes, ECS, Heroku, bare VM, Lambda, enz.) te bepalen, de CI/CD pipeline, en eventuele stateful componenten (databases, queues, caches, feature flags).

Produceer een runbook met deze secties:

**1. Pre-rollback checklist**
- Bevestig de doelversie/revisie om naar terug te draaien (image tag, Git SHA, Helm revision)
- Identificeer wie goedkeuring moet geven voordat het wordt uitgevoerd (on-call lead, incident commander)
- Controleer dat het vorige artefact nog steeds in het register/archief aanwezig is — indien niet, direct markeren
- Lijst eventuele schema-migraties op die sinds de vorige versie zijn uitgevoerd (onherstelbare migraties blokkeren een schone rollback)

**2. Impact assessment**
- Geschatte downtime of verslechterde periode tijdens rollback
- Welke gebruikers/tenants/regio's worden beïnvloed
- Alle gegevens die sinds de slechte deploy zijn geschreven en die mogelijk incompatibel zijn met het vorige schema

**3. Rollback stappen** (genummerd, copy-paste gereed commando's)

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

Voor database-migraties: geef het exacte down-migration commando of noteer dat een handmatige schema-omkering vereist is en specificeer welke SQL moet worden uitgevoerd.

Voor feature flags: lijst welke vlaggen moeten worden uitgeschakeld vóór of na de binary rollback.

**4. Verificatiestappen**
- Smoke test commando's of URL's om te bevestigen dat de service gezond is op de vorige versie
- Belangrijkste statistieken om gedurende 10 minuten na rollback in het oog te houden (error rate, latency p99, queue depth)

**5. Abort criteria**
- Voorwaarden waaronder de rollback zelf moet worden gestopt en geëscaleerd
- Fallback als rollback mislukt (bijv. traffic shifting naar een gekend werkende regio)

**6. Post-rollback acties**
- Open een tracking issue voor root cause analysis
- Behoud logs en traces van het incident window voordat ze verlopen
- Tijdlijn voor poging tot opnieuw implementeren met de fix

Markeer eventuele stap die niet kan worden geautomatiseerd en menselijk oordeel of verhoogde toegang vereist.

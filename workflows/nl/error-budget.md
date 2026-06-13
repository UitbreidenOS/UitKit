# Fehlerbudget-Handhaving

SRE error budget workflow — volgt budgetverbruik op basis van SLO-vensters en handhaaft feature freeze en post-mortem vereisten wanneer drempels worden overschreden.

---

## Wanneer gebruiken

- Teams met gedefinieerde SLO's die geautomatiseerde handhaving nodig hebben voorbij handmatige monitoring
- Services waar deployments ongecontroleerd doorgaan zelfs wanneer betrouwbaarheid verslechterd is
- Post-incident reviews waar "we wisten niet dat het budget op was" een terugkerend thema is
- Platforms die meerdere keren per dag deployen waar handmatige budgetcontroles onpraktisch zijn

---

## Fasen / Stappen

### Fehlerbudget-Formel

```
fehlerbudget_verbleibend = (1 - slo_ziel) × fenster_sekunden - beobachtete_fehler_sekunden
burn_rate = aktuelles_fehlerrate / fehlerrate_budget_in_fenster_aufgebraucht
```

Voor een 99,9% SLO over een 30-dagen venster:
- Toegestaan foutenbudget = 0,1% × 2.592.000s = **2.592 seconden** (~43 minuten)
- Huidige foutpercentage is 1%: burn_rate = 1% / 0,1% = **10×** (budget in 3 dagen opgebruikt, niet 30)

**Burn rate interpretatie:**

| Burn rate | Uitputting tijd (30d budget) | Urgentie |
|-----------|------------------------------|---------|
| 1× | 30 dagen | Normaal |
| 2× | 15 dagen | Kijken |
| 6× | 5 dagen | Waarschuwing |
| 14,4× | ~2 dagen | Pagina |
| 36× | 20 uur | Onmiddellijk |

---

### Multi-Window Burn Rate Alerts

Single-window burn rates produceren false positives (korte spikes) of false negatives (langzame lekkages). Gebruik twee-window bevestiging:

**Snelle brand — pagina onmiddellijk:**
```
burn_rate(1h) > 14,4 AND burn_rate(6h) > 6
```
Betekenis: >2% maandelijks budget in 1 uur verbranden, bevestigd over 6 uur. Dit is een productie-incident.

**Trage brand — maak ticket:**
```
burn_rate(72h) > 3 AND burn_rate(24h) > 3
```
Betekenis: >10% maandelijks budget in 3 dagen verbranden, bevestigd over 1 dag. Vereist onderzoek voor volgende deploy.

**Rationale voor twee vensters:** het korte venster vangt snelle spikes; het lange venster filtert voorbijgaand lawaai. Beide moeten waar zijn om te triggeren — elimineert meeste false alerts van korte anomalieën.

---

### PromQL Voorbeelden

**Resterend foutenbudget (ratio, 30d venster):**
```promql
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    /
    sum(increase(http_requests_total[30d]))
  )
) / (1 - 0.999)
```
Geeft 1,0 terug als vol budget rest, 0,0 als opgebruikt, negatief als overschreden.

**Burn rate over een venster:**
```promql
# 1h burn rate
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) / (1 - 0.999)

# Vervang [1h] met [6h], [24h], [72h] voor andere vensters
```

**Snelle brand alert regel:**
```yaml
- alert: ErrorBudgetFastBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h]))
    ) / (1 - 0.999) > 14.4
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[6h]))
      / sum(rate(http_requests_total[6h]))
    ) / (1 - 0.999) > 6
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Snelle foutenbudget brand — {{ $value }}× burn rate"
```

**Trage brand alert regel:**
```yaml
- alert: ErrorBudgetSlowBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[24h]))
      / sum(rate(http_requests_total[24h]))
    ) / (1 - 0.999) > 3
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[72h]))
      / sum(rate(http_requests_total[72h]))
    ) / (1 - 0.999) > 3
  for: 15m
  labels:
    severity: ticket
  annotations:
    summary: "Trage foutenbudget brand — {{ $value }}× burn rate"
```

---

### Budget Beleidshandhaving

| Budget verbruikt | Beleid |
|-----------------|--------|
| < 50% | Geen restricties |
| 50–100% | Bevries niet-kritieke merges; SRE goedkeuring vereist voor deployments |
| > 100% | Hard bevries op alle feature werk; post-mortem vereist voor ontdooien |

**Bevries definitie:**
- Niet-kritieke merges: elke PR niet gelabeld `severity:critical` of `type:hotfix`
- Hard bevries: geen merges naar production branch ongeacht tag — alleen reverts toegestaan
- Ontdooien voorwaarden: post-mortem gepubliceerd, corrigerende acties gevolgd, budget hersteld boven 20%

---

### Claude Code Workflow

Een wekelijkse cron agent leest Prometheus metrieken, berekent burn rates, post Slack rapport, en opent bevries ticket wanneer drempels overschreden.

**Hook ingang in `.claude/settings.json`:**
```json
{
  "hooks": {
    "schedule": [
      {
        "cron": "0 9 * * MON",
        "command": "claude -p 'Voer de error-budget workflow uit: haal metrieken op, bereken burn rates, post Slack rapport, maak bevries ticket als >50% verbruikt.'",
        "description": "Wekelijks foutenbudget rapport"
      }
    ]
  }
}
```

**Agent taken uitsplitsing:**

1. **Haal metrieken op** — query Prometheus voor 1h, 6h, 24h, 72h, 30d foutpercentages
2. **Bereken burn rates** — pas formule toe voor elk venster
3. **Bepaal beleids staat** — vergelijk verbruikt% tegen drempels
4. **Post Slack rapport** — formatteer budget samenvatting met burn rate tabel en beleid staat
5. **Maak bevries ticket** — als >50% verbruikt, open Linear/GitHub issue met budget uitsplitsing en bevries instructies
6. **Log naar bestand** — voeg resultaat toe aan `.claude/error-budget-log.jsonl` voor trendtracering

**Slack rapport formaat:**
```
[Foutenbudget Rapport — week van 2026-05-23]
Service: api-gateway  SLO: 99,9%  Venster: 30d

Budget verbruikt: 67% ⚠️  BEVRIES ACTIEF
Resterend: 855 seconden

Burn rates:
  1h:  2,1×   6h:  1,8×
  24h: 3,4×   72h: 3,1×

Beleid: Niet-kritieke merges BEVROREN. SRE goedkeuring vereist.
Ticket: LIN-2847
```

---

## Voorbeeld

**Scenario:** API gateway verslechtert na misflukte config deploy op dag 8 van 30-dagen venster.

**Chronologie:**

| Tijd | Gebeurtenis | Budget verbruikt |
|------|-------|-----------------|
| Dag 1–7 | Normale operatie, 0,05% foutpercentage | 12% |
| Dag 8, 14:00 | Config deploy verhoogt foutpercentage naar 2% | — |
| Dag 8, 15:00 | 1h burn rate = 20×; 6h burn rate = 8× | — |
| Dag 8, 15:02 | FastBurn alert vuur → pagina on-call | — |
| Dag 8, 17:30 | Config terugrollen, foutpercentage terug naar 0,05% | 71% verbruikt |
| Dag 8, 18:00 | Claude agent leest metrieken, post Slack rapport | — |
| Dag 8, 18:00 | Budget >50% → bevries ticket geopend (LIN-2847) | — |
| Dag 9 | SRE controleert. Trage brand klaar. Bevries opgeheven na goedkeuring | — |
| Dag 9 | Post-mortem ingepland (niet vereist — budget niet >100%) | — |

**Zonder deze workflow:** ingenieurs zouden feature werk blijven mergen zonder te weten dat 71% van de maandelijkse betrouwbaarheidsbudget in één middag verbruikt was.

---

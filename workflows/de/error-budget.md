# Fehlerbudget-Durchsetzung

SRE-Fehlerbudget-Workflow — verfolgt die Budgetausgaben anhand von SLO-Fenstern und setzt Funktionsgesperre und Anforderungen nach Mortem durch, wenn Schwellenwerte überschritten werden.

---

## Wann verwenden

- Teams mit definierten SLOs, die eine automatisierte Durchsetzung über die manuelle Überwachung hinaus benötigen
- Services, bei denen Bereitstellungen unkontrolliert fortgesetzt werden, selbst wenn die Zuverlässigkeit beeinträchtigt ist
- Post-Incident-Bewertungen, bei denen „wir wussten nicht, dass das Budget aufgebraucht war" ein wiederkehrendes Thema ist
- Plattformen, die mehrmals täglich bereitstellen, wenn manuelle Budgetprüfungen unpraktisch sind

---

## Phasen / Schritte

### Fehlerbudget-Formel

```
fehlerbudget_verbleibend = (1 - slo_ziel) × fenster_sekunden - beobachtete_fehler_sekunden
burn_rate = aktuelles_fehlerrate / fehlerrate_budget_in_fenster_aufgebraucht
```

Für ein 99,9%-SLO über ein 30-Tage-Fenster:
- Zulässiges Fehlerbudget = 0,1% × 2.592.000s = **2.592 Sekunden** (~43 Minuten)
- Wenn aktuelle Fehlerrate 1% ist: burn_rate = 1% / 0,1% = **10×** (budget in 3 Tagen aufgebraucht, nicht 30)

**Burn-Rate-Interpretation:**

| Burn-Rate | Aufbrauchszeit (30-Tage-Budget) | Dringlichkeit |
|-----------|------------------------------|---------|
| 1× | 30 Tage | Normal |
| 2× | 15 Tage | Beobachten |
| 6× | 5 Tage | Warnung |
| 14,4× | ~2 Tage | Seite |
| 36× | 20 Stunden | Sofort |

---

### Multi-Window-Burn-Rate-Alarme

Burn-Raten mit einzelnem Fenster erzeugen falsch positive (kurze Spitzen) oder falsch negative (langsame Lecks). Verwenden Sie Bestätigung mit zwei Fenstern:

**Schneller Burn — sofort benachrichtigen:**
```
burn_rate(1h) > 14,4 AND burn_rate(6h) > 6
```
Bedeutung: >2% des Monatsbudgets in 1 Stunde verbrennen, über 6 Stunden bestätigt. Dies ist ein Produktionsvorfall.

**Langsamer Burn — Ticket erstellen:**
```
burn_rate(72h) > 3 AND burn_rate(24h) > 3
```
Bedeutung: >10% des Monatsbudgets in 3 Tagen verbrennen, über 1 Tag bestätigt. Bedarf vor nächster Bereitstellung Überprüfung.

**Begründung für zwei Fenster:** Das kurze Fenster erfasst schnelle Spitzen; das lange Fenster filtert vorübergehendes Rauschen. Beide müssen wahr sein zum Auslösen — beseitigt Mehrheit falscher Alarme aus kurzen Anomalien.

---

### PromQL-Beispiele

**Verbleibendes Fehlerbudget (Verhältnis, 30-Tage-Fenster):**
```promql
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    /
    sum(increase(http_requests_total[30d]))
  )
) / (1 - 0.999)
```
Gibt 1,0 zurück, wenn volles Budget verbleibt, 0,0 wenn aufgebraucht, negativ wenn überschritten.

**Burn-Rate über ein Fenster:**
```promql
# 1h burn rate
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) / (1 - 0.999)

# Ersetzen Sie [1h] mit [6h], [24h], [72h] für andere Fenster
```

**Fast-Burn-Alarmregel:**
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
    summary: "Schneller Fehlerbudget-Burn — {{ $value }}× Burn-Rate"
```

**Slow-Burn-Alarmregel:**
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
    summary: "Langsamer Fehlerbudget-Burn — {{ $value }}× Burn-Rate"
```

---

### Budgetrichtliniendurchsetzung

| Budget aufgebraucht | Richtlinie |
|-----------------|--------|
| < 50% | Keine Einschränkungen |
| 50–100% | Einfrieren nichtkritischer Merges; SRE-Zustimmung für Bereitstellungen erforderlich |
| > 100% | Vollständiges Einfrieren aller Feature-Arbeiten; Mortem vor Entsperrung erforderlich |

**Einfrieren-Definition:**
- Nichtkritische Merges: PR nicht mit `severity:critical` oder `type:hotfix` gekennzeichnet
- Vollständiges Einfrieren: keine Merges in Produktionszweig unabhängig von Tag — nur Reverts erlaubt
- Entsperrbedingungen: Mortem veröffentlicht, Korrekturmaßnahmen verfolgt, Budget über 20% wiederhergestellt

---

### Claude-Code-Workflow

Ein wöchentlicher Cron-Agent liest Prometheus-Metriken, berechnet Burn-Raten, sendet Slack-Budgetbericht und öffnet Gefrierticket, wenn Schwellenwerte überschritten werden.

**Hook-Eintrag in `.claude/settings.json`:**
```json
{
  "hooks": {
    "schedule": [
      {
        "cron": "0 9 * * MON",
        "command": "claude -p 'Führen Sie den Error-Budget-Workflow aus: Holen Sie sich Metriken, berechnen Sie Burn-Raten, senden Sie Slack-Bericht, erstellen Sie Gefrierticket wenn >50% aufgebraucht.'",
        "description": "Wöchentlicher Fehlerbudget-Bericht"
      }
    ]
  }
}
```

**Agent-Aufgabenabbau:**

1. **Metriken abrufen** — Prometheus für 1h, 6h, 24h, 72h, 30d Fehlerraten abfragen
2. **Burn-Raten berechnen** — Formel für jedes Fenster anwenden
3. **Richtlinienstatus bestimmen** — verbrauchte% gegen Schwellenwerte vergleichen
4. **Slack-Bericht senden** — Budgetübersicht mit Burn-Rate-Tabelle und Richtlinienstatus formatieren
5. **Gefrierticket erstellen** — if >50% aufgebraucht, Linear/GitHub-Problem mit Budgetaufschlüsselung und Gefrieranweisungen öffnen
6. **In Datei protokollieren** — Ergebnis an `.claude/error-budget-log.jsonl` anhängen für Trendverfolgung

**Slack-Berichtsformat:**
```
[Fehlerbudget-Bericht — Woche vom 2026-05-23]
Service: api-gateway  SLO: 99,9%  Fenster: 30d

Budget aufgebraucht: 67% ⚠️  EINFRIEREN AKTIV
Verbleibend: 855 Sekunden

Burn-Raten:
  1h:  2,1×   6h:  1,8×
  24h: 3,4×   72h: 3,1×

Richtlinie: Nichtkritische Merges EINGEFROREN. SRE-Zustimmung erforderlich.
Ticket: LIN-2847
```

---

## Beispiel

**Szenario:** API-Gateway degeneriert nach fehlgeschlagener Config-Bereitstellung am Tag 8 eines 30-Tage-Fensters.

**Chronologie:**

| Zeit | Ereignis | Budget aufgebraucht |
|------|-------|-----------------|
| Tag 1–7 | Normaler Betrieb, 0,05% Fehlerrate | 12% |
| Tag 8, 14:00 | Config-Bereitstellung erhöht Fehlerrate auf 2% | — |
| Tag 8, 15:00 | 1h Burn-Rate = 20×; 6h Burn-Rate = 8× | — |
| Tag 8, 15:02 | FastBurn-Alarm löst aus → On-Call benachrichtigen | — |
| Tag 8, 17:30 | Config zurückgerollt, Fehlerrate kehrt zu 0,05% zurück | 71% aufgebraucht |
| Tag 8, 18:00 | Claude-Agent liest Metriken, sendet Slack-Bericht | — |
| Tag 8, 18:00 | Budget >50% → Gefrierticket geöffnet (LIN-2847) | — |
| Tag 9 | SRE überprüft. Slow Burn klärt. Einfrieren nach Zustimmung aufgehoben | — |
| Tag 9 | Mortem geplant (nicht erforderlich — Budget nicht >100%) | — |

**Ohne diesen Workflow:** Ingenieure würden weiterhin Feature-Arbeiten mergen, ohne zu wissen, dass 71% des Zuverlässigkeitsbudgets des Monats an einem Nachmittag aufgebraucht wurde.

---

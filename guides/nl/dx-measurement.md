# Gids voor meting van developerervaring

Het meten van developerervaring (DX) bij Claude Code-adoptie vereist systematische verzameling, aggregatie en analyse van vaardigheidsgebruik, sessionpatronen en featureffectiviteit. Deze gids definieert het DX-metriekkader en instrumentatiepatronen.

---

## Waarom DX meten

- **Adoptatievalidatie**: ontdekken en roepen gebruikers gepubliceerde vaardigheden daadwerkelijk aan?
- **Feature ROI**: welke vaardigheden besparen tijd, verminderen fouten of ontgrendelen workflows?
- **Detectie van knelpunten**: identificeer wrijvingspunten (trage vaardigheden, verwarrende docs, ontbrekende integraties)
- **Iteratieve verbetering**: kwantificeer de impact van vaardigheidsupdate, nieuwe gidsen of workflowwijzigingen
- **Zakelijk case-ondersteuning**: demonstreer de waarde van Claude Code-investering aan stakeholders

---

## Metriekschema

### Kernmetrieken

| Metriek | Definitie | Eenheid | Verzameling |
|---|---|---|---|
| `invocations` | Aantal keren dat een vaardigheid in een sessie/periode werd opgeroepen | count | PostToolUse Hook |
| `success_rate` | % van vaardigheidsoproepen die zonder fout werden voltooid | % (0–100) | PostToolUse + tool exit code |
| `avg_duration_sec` | Gemiddelde uitvoeringstijd per vaardigheidsoproep | seconden | PostToolUse timestamp-paar |
| `time_saved_min` | Geschatte tijd bespaard vs. handmatige uitvoering (gebruiker-gerapporteerd of afgeleid) | minuten | Sessie-metagegevens + heuristische |
| `error_rate` | % oproepen die resulteren in fout, timeout of gebruikersherpoginging | % (0–100) | PostToolUse exit-status |
| `user_count` | Verschillende gebruikers die de vaardigheid oproepen | count | Sessie-ID-aggregatie |
| `adoption_tier` | Classificatie: `abandoned` (<5 oproepen), `low` (5–50), `active` (50–500), `core` (>500) | category | Geaggregeerde oproepen |

### Afgeleide metrieken

| Metriek | Formule | Interpretatie |
|---|---|---|
| **DX Score** | `(success_rate * 0.4) + (adoption_tier_score * 0.3) + (time_saved_relevance * 0.3)` | 0–100: algemene gezondheid |
| **Productivity Multiplier** | `total_time_saved_per_user / avg_session_duration` | Uren bespaard per uur Claude Code-gebruik |
| **Friction Index** | `error_rate + (100 - success_rate)` | 0–200: lager is beter |

### Sessie-level attributen

Traceer in `.claude/session-log.md` (gemaakt bij sessiestart, aangevuld met samenvatting aan het einde):

```markdown
## Sessiesamenvatting — 2026-06-15T14:30:00Z

**Gebruiker**: alice@company.com
**Duur**: 47 minuten
**Aangeroepen vaardigheden**: code-review, simplify, deep-research
**Totaal tooloproepen**: 18
**Fouten**: 1 (deep-research timeout bij 3e poging, herpoging slaagde)
**Bespaard tijd**: ~60 minuten (code-review + simplify auto-fixes besparen handmatige refactoring)
**Blocker**: Geen
**Feedback**: "deep-research zou zoekresultaten over herpogingen moeten cachen"
```

---

## Instrumentatiepatronen

### 1. PostToolUse Hook (Real-time logboekering)

Elke tooloproep logt naar `.claude/usage-log.jsonl`:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "invocation_num": 3,
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "tool_output_length": 1247,
  "retry_count": 0
}
```

Zie `hooks/usage-tracker.md` voor implementatie.

### 2. Session Log (Einde-van-sessie-samenvatting)

Maak `.claude/session-log.md` aan bij sessiestart, voeg samenvatting toe aan het einde:

```bash
# Initialiseer bij sessiestart
cat >> .claude/session-log.md << EOF
## Session Summary — $(date -u +"%Y-%m-%dT%H:%M:%SZ")

**User**: $USER
**Skills**: [wordt aan het einde bijgewerkt]
**Duration**: [zal berekend worden]
**Errors**: [zal geteld worden]

---
EOF
```

Bij sessie-einde analyseert u `usage-log.jsonl` om te aggregeren en aan te voegen:

```json
{
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "start_time": "2026-06-15T13:45:00Z",
  "end_time": "2026-06-15T14:32:47Z",
  "duration_minutes": 47,
  "skills_invoked": ["code-review", "simplify", "deep-research"],
  "total_invocations": 18,
  "total_errors": 1,
  "estimated_time_saved_min": 60,
  "sentiment": "positive"
}
```

### 3. Wekelijkse/maandelijkse aggregatie

Voer `/dx-metrics aggregate` uit (of `dx-analyst` agent) om `.claude/dx-scorecard.json` te produceren:

```json
{
  "period": "2026-06-08T00:00:00Z/2026-06-15T00:00:00Z",
  "metrics": {
    "code-review": {
      "invocations": 47,
      "success_rate": 97.9,
      "avg_duration_sec": 18.3,
      "error_rate": 2.1,
      "user_count": 12,
      "adoption_tier": "active",
      "time_saved_min": 891
    },
    "simplify": {
      "invocations": 31,
      "success_rate": 100,
      "avg_duration_sec": 12.1,
      "error_rate": 0,
      "user_count": 9,
      "adoption_tier": "active",
      "time_saved_min": 403
    },
    "deep-research": {
      "invocations": 8,
      "success_rate": 75.0,
      "avg_duration_sec": 45.7,
      "error_rate": 25.0,
      "user_count": 4,
      "adoption_tier": "low",
      "time_saved_min": 180
    }
  },
  "summary": {
    "total_users": 22,
    "avg_dx_score": 81.4,
    "total_time_saved_hours": 28.2,
    "friction_index": 12.3,
    "top_skill": "code-review",
    "lowest_adoption": "deep-research",
    "recommended_actions": [
      "Improve deep-research retry/caching to reduce 25% error rate",
      "Add session-log best practices guide (only 40% of sessions documented)"
    ]
  }
}
```

---

## Gegevensverzamelingsarchitectuur

### Gegenereerde bestanden

| Bestand | Doel | Frequentie | Behoud |
|---|---|---|---|
| `.claude/usage-log.jsonl` | Raw hook-logs (alleen toevoegen) | Per tooloproep | 90 dagen |
| `.claude/session-log.md` | Gebruiker-zichtbare samenvatting (één per sessie) | Per sessie | 30 dagen (opgerold) |
| `.claude/dx-scorecard.json` | Geaggregeerde metriek-snapshot | Wekelijks/maandelijks | Oneindig |
| `.claude/dx-scorecard-history.jsonl` | Tijdreeks van scorecards | Wekelijks/maandelijks | 2 jaar |

### Verzamelingsstroom

```
[Tooloproep] 
    ↓
[PostToolUse hook vuurt af]
    ↓
[usage-tracker.sh voegt toe aan usage-log.jsonl]
    ↓
[Sessie eindigt]
    ↓
[Sessie-log-samenvatting gegenereerd]
    ↓
[Wekelijks: dx-analyst aggregeert in dx-scorecard.json]
    ↓
[Maandelijks: trends geanalyseerd, verbeteringen voorgesteld]
```

---

## Best practices

### Voor gebruikers (sessielogboekering)

1. **Schakel tracking van gebruik in** in uw project `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PostToolUse": [{"type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh"}]
     }
   }
   ```

2. **Voeg sessiefeedback toe** aan het einde van elke sessie:
   ```markdown
   ## Feedback

   - **Wat werkte**: code-review vond 3 kritieke bugs in login flow
   - **Wat traag was**: deep-research timeout bij 3e zoekpoging (heeft herpogingslimiet-heuristiek nodig)
   - **Ontbreekt**: geen vaardigheid voor validatie van SQL-query-prestaties
   - **Bespaard tijd**: ~2 uur op refactoring vs. handmatige codereview
   ```

3. **Gebruik consistente vaardighedsnamen** in query's (controleer `/help` voor exacte namen)

### Voor vaardigheidsauteurs

1. **Geef vaardigheden naam voor introspectie**: gebruik duidelijke, single-purpose namen (bijv. `code-review`, niet `code-quality-plus`)
2. **Timing-tips in output opnemen**: "412 regels geanalyseerd in 2.3 seconden"
3. **Rapporteer succes/mislukking expliciet**: exit code 0 = succes; niet-nul = fout (hook vangt dit)
4. **Documenteer verwachte duur**: "Typische uitvoertijd: 30–120 seconden" helpt gebruikers ROI in te schatten

### Voor organisatie DX-leads

1. **Maandelijkse beoordelingscadence**: aggregeer metrieken op de eerste maandag van elke maand
2. **Gebruikersfeedback-lussen**: bevraag vaardigheidsgebruikers driemaandelijks over wrijvingspunten
3. **Publiceer metrieken**: deel `.claude/dx-scorecard.json` in team dashboard of wiki
4. **Handelen op knelpunten**: als error_rate > 10%, onderzoek en stel reparatie voor binnen 2 weken
5. **Vier overwinningen**: deel totalen van bespaard tijd en groeicitijfers in team syncs

---

## Privacy en databeheer

- **Gebruikersanonimisering**: optie om per rol/team in plaats van individuele e-mail te aggregeren
- **Retentiebeleid**: verwijder raw logs na 90 dagen; behoud geaggregeerde metriek oneindig
- **Opt-out**: gebruikers kunnen `DX_TRACKING_DISABLED=1` instellen om hook-logboekering over te slaan
- **Alleen lokaal standaard**: `.claude/usage-log.jsonl` en `.claude/session-log.md` bevinden zich in projectmap, nooit geupload tenzij expliciet geconfigureerd

---

## Integratievoorbeelden

### Slack-melding (Wekelijks samenvatting)

Hook in `.claude/settings.json` om scorecard naar Slack te posten:

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL -d @.claude/dx-scorecard.json"
          }
        ]
      }
    ]
  }
}
```

### GitHub Issues (Knelpunt-tracking)

Auto-maak GitHub-issues voor vaardigheden met error_rate > 15%:

```bash
jq '.metrics[] | select(.error_rate > 15)' .claude/dx-scorecard.json | \
  while read skill; do
    gh issue create --title "High error rate: $(echo $skill | jq .name)" \
      --label "dx-bottleneck" \
      --body "Error rate: $(echo $skill | jq .error_rate)%"
  done
```

### Grafana-dashboard

Exporteer tijdreeksen-metrieken naar Prometheus voor visualisatie:

```bash
jq '.metrics | to_entries[] | {name: .key, value: .value.success_rate}' \
  .claude/dx-scorecard-history.jsonl | prometheus_remote_write
```

---

## Meting-checklist

- [ ] Schakel `usage-tracker` hook in `.claude/settings.json` in
- [ ] Maak `.claude/session-log.md` sjabloon aan
- [ ] Plan wekelijkse DX-beoordeling (of delegeer aan `dx-analyst` agent)
- [ ] Documenteer vaardighedsnamen en verwachte duurs in team wiki
- [ ] Stel error_rate en adoption_tier drempels in voor escalatie
- [ ] Deel maandelijkse scorecard met team
- [ ] Herhaal: pas metrieken aan op basis van feedback

---

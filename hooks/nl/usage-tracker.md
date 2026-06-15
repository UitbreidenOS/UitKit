# Hook: Gebruiksvolger

Registreert elke Claude Code-werktuigaanroep in `.claude/usage-log.jsonl` voor DX-metriekenverzameling, adoptiebijhouden en meting van vaardigheidseffectiviteit.

## Evenement

`PostToolUse` — wordt onmiddellijk na elke werktuigaanroep geactiveerd (Bash, Read, Write, WebSearch, API-oproepen, enz.)

## settings.json invoer

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  },
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
}
```

## Wat het doet

Voegt een JSON-regel toe aan `.claude/usage-log.jsonl` voor elke werktuigaanroep en legt vast:

- **Tijdstempel** (ISO 8601 UTC)
- **Sessie-ID** en gebruiker
- **Vaardigheidsnaam** (uit context ontleed, indien beschikbaar)
- **Werktuig opgeroepen** (Bash, Read, Write, WebSearch, enz.)
- **Duur** (milliseconden)
- **Succes** (exitcode 0 = waar)
- **Werktuigspecifieke metagegevens** (commando, bestandspad, query, enz.)

Voorbeeldrecord:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_abc123",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "tool_input_summary": "git diff --name-only",
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "invocation_num": 3,
  "retry_count": 0,
  "metadata": {
    "project_dir": "/Users/alice/myapp",
    "git_branch": "feature/auth",
    "model": "haiku-4.5"
  }
}
```

## Functies

- **Licht**: Asynchrone logging blokkeert Claude Code-uitvoering niet
- **Privacyrespect**: Registreert commandosamenvattingen, niet volledig gevoelige invoer
- **Adoptiebijhouden**: Koppelt werktuigaanroepen aan vaardigheden voor /dx-metrics analyse
- **Minimale overhead**: ~10ms per logboekinvoer, batchschrijvingen
- **Automatische rotatie**: Verplaatst oude logboeken naar `.jsonl.1`, `.jsonl.2` wanneer > 50MB
- **Retentiebeleid**: Verwijdert automatisch logboeken ouder dan 90 dagen
- **Sessiebijhouden**: Alle oproepen in een sessie delen een session_id voor correlatie
- **Herhalingdetectie**: Telt herhaalde aanroepen van dezelfde werktuig binnen 30 seconden

## Opstelling

```bash
# Hook-script naar project kopiëren
cp hooks/usage-tracker.sh .claude/hooks/
chmod +x .claude/hooks/usage-tracker.sh

# Logboekenmap maken
mkdir -p .claude
touch .claude/usage-log.jsonl

# Toevoegen aan .gitignore (gebruikslogboeken bevatten metagegevens, geen geheimen)
echo ".claude/usage-log.jsonl*" >> .gitignore
echo ".claude/dx-scorecard*.json" >> .gitignore
echo ".claude/session-log*.md" >> .gitignore

# Verifiëren in settings.json (boven hooks-invoer toevoegen)
cat >> .claude/settings.json << 'EOF'
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
EOF
```

## Queryvoorbeelden

**Alle werktuigaanroepen in een sessie weergeven**:
```bash
jq 'select(.session_id == "sess_abc123")' .claude/usage-log.jsonl
```

**Vaardigheidaanroepingen tellen (voor /dx-metrics)**:
```bash
jq -s 'group_by(.skill_name) | map({skill: .[0].skill_name, count: length})' \
  .claude/usage-log.jsonl
```

**Fouten vinden**:
```bash
jq 'select(.success == false)' .claude/usage-log.jsonl | jq -s 'length'
```

**Gemiddelde duur per werktuig berekenen**:
```bash
jq -s 'group_by(.tool_called) | map({tool: .[0].tool_called, avg_ms: (map(.duration_ms) | add / length)})' \
  .claude/usage-log.jsonl
```

**Trage bewerkingen zoeken** (> 30 seconden):
```bash
jq 'select(.duration_ms > 30000) | {timestamp, tool_called, duration_ms}' \
  .claude/usage-log.jsonl | head -10
```

**Herhalingslussen detecteren** (dezelfde werktuig 3+ keer in 60 seconden aangeroepen):
```bash
jq -s '[.[] | select(.retry_count > 0)]' .claude/usage-log.jsonl
```

## Integratie met /dx-metrics

De usage-tracker hook voedt ruwe gegevens naar `/dx-metrics`, die samenvat voor DX-scoring:

```
[Werktuigaanroep]
  ↓
[PostToolUse Hook]
  ↓
[usage-tracker.sh voegt toe aan .claude/usage-log.jsonl]
  ↓
[/dx-metrics leest usage-log.jsonl]
  ↓
[Genereert .claude/dx-scorecard.json (aanroepingen, succespercentage, tijdbesparing, enz.)]
```

## Detectie vaardigheidsnaam

De hook probeert `skill_name` uit context af te leiden:

1. Controleer `CLAUDE_ACTIVE_SKILL` omgevingsvariabele (ingesteld als uit te voeren binnen een vaardigheid)
2. Sessiemetagegevens parseren voor actief `/skill-name` commando
3. Afleiden uit werktuigvolgorde (bijv. als Bash + Read + Write in volgorde, waarschijnlijk code-review-type vaardigheid)
4. Fallback: `skill_name = "manual"` (gebruiker voert werktuigen direct uit)

Voor beste resultaten moeten vaardigheden `CLAUDE_ACTIVE_SKILL` instellen bij aanroeping:

```bash
# Binnen een vaardigheid (bijv. skills/productivity/code-review.md)
export CLAUDE_ACTIVE_SKILL="code-review"
# ... vaardigheidsaanwijzingen volgen
```

## Prestatieafstemming

Als logging responsiviteit beïnvloedt:

1. **Verhoog rotatiegrootte** om minder logrotaties in te passen:
   ```json
   "rotation_size_mb": 100
   ```

2. **Verlaag retentie** om schijfgebruik te verminderen:
   ```json
   "retention_days": 30
   ```

3. **Tijdelijk uitschakelen** (tijdens zware berekening):
   ```bash
   export DX_TRACKING_DISABLED=1
   ```

4. **Logboeken samplen** (elke Nde oproep registreren) — usage-tracker.sh bewerken:
   ```bash
   SAMPLE_RATE=10  # Log 1 op 10 aanroepingen
   [ $((RANDOM % SAMPLE_RATE)) -ne 0 ] && exit 0
   ```

## Datagovernance

- **Eigendom**: Projectteam / DX-leider
- **Toegang**: Gebruikers kunnen `.claude/usage-log.jsonl` lokaal opvragen; geen upload naar cloud
- **Anonimisering**: Verwijder user_id voordat u rapporten deelt (optioneel):
  ```bash
  jq 'del(.user_id)' .claude/usage-log.jsonl > usage-log-anon.jsonl
  ```
- **Retentie**: Automatisch verwijderen na 90 dagen (configureerbaar)
- **Opt-out**: Stel `DX_TRACKING_DISABLED=1` in om logging over te slaan

## Probleemoplossing

**Geen logboeken worden geschreven**:
- Controleer of hook is ingeschakeld in `.claude/settings.json`
- Controleer `.claude/usage-log.jsonl` bestandsrechten: `ls -la .claude/`
- Testrun: `echo '{"test": 1}' | bash .claude/hooks/usage-tracker.sh`

**Logboeken groeien te snel**:
- Verhoog `rotation_size_mb` of verlaag `retention_days`
- Controleer of hook echt asynchroon is (mag Claude Code niet blokkeren)

**Vaardigheidsnaam ontbreekt**:
- Omwikkeling vaardigheid code met `export CLAUDE_ACTIVE_SKILL="skill-name"`
- Of voeg vaardigheidsnaam toe aan `.claude/settings.json` context

---

# Hook: Agent Reviewer — Start een Code-Review Subagent op Session Stop

Demonstreert het `"type": "agent"` hook, dat een volledige subagent spawnt wanneer een event wordt geactiveerd. De subagent draait asynchroon met zijn eigen tool-toegang, leest de sessiewijzigingen en produceert een gestructureerde review — zonder de hoofdsessie te blokkeren of handmatige activering nodig te hebben.

## Wat het doet

Wanneer de hoofdsessie van Claude Code eindigt (`Stop` event), spawnt de harness een subagent geconfigureerd door het `agent` blok van het hook. De subagent:

1. Ontvangt de `stop_reason`, `session_id`, en `project_dir` van de sessie in zijn systeemcontext.
2. Leest de git diff van wijzigingen gemaakt tijdens de sessie (`git diff HEAD~1` of `git diff --staged`).
3. Evalueert de diff op correctness bugs, beveiligingsproblemen en style-overtredingen.
4. Schrijft een gestructureerde review naar `.claude/reviews/<session_id>-review.md`.
5. Als er blockerende problemen worden gevonden (severity `error`), voegt het ook een samenvatting toe aan `.claude/reviews/open-issues.log` voor de developer om in de volgende sessie aan te werken.

De gespawnte agent heeft een gescoped toolset — alleen `Bash` (read-only git commands), `Read`, en `Write` naar de `.claude/reviews/` directory. Het heeft geen toestemming om projectbestanden te bewerken, commits te maken of externe APIs aan te roepen.

Voorbeeld review output op `.claude/reviews/abc123-review.md`:

```markdown
# Code Review — Session abc123 (2026-06-03T11:00:00Z)

## Summary
3 files changed, 120 insertions, 14 deletions

## Findings

### ERROR — src/auth/token.py:47
Hardcoded fallback secret `"dev-secret-do-not-use"` reachable in production if
`SECRET_KEY` env var is unset. Must be replaced with a hard failure.

### WARNING — src/api/users.py:112
N+1 query in `list_users()` — `get_user_permissions()` called inside loop.
Consider a bulk fetch before the loop.

### INFO — tests/test_auth.py
Good: new token expiry tests cover both the happy path and the expired-token branch.
```

## Wanneer het afvuurt

`Stop` — vuurt af wanneer de hoofdsessie eindigt, omdat de user `/exit` heeft getypt, de taak is voltooid, of de sessie is verlopen. De subagent draait nadat de sessie al is gestopt; het vertraagt niet de mogelijkheid van de user om de terminal te sluiten.

Andere nuttige koppelingen voor het `agent` hook type:

| Event | Subagent-doel |
|---|---|
| `Stop` | Post-sessie code review, kostensamenvatting, changelog-entry |
| `SubagentStop` | Valideer subagent output voordat het aan de hoofdagent wordt gepresenteerd |
| `PostToolUse` (Write) | Trigger een documentation-update agent wanneer bronbestanden veranderen |

## settings.json entry

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "agent": {
              "prompt": "You are a code reviewer. A Claude Code session has just ended. Your job is to review the changes made during this session and write a structured report.\n\nSteps:\n1. Run `git diff HEAD~1 --stat` to see which files changed.\n2. Run `git diff HEAD~1` to read the full diff.\n3. Analyse the diff for: correctness bugs, security issues (hardcoded secrets, injection vectors, missing auth checks), performance problems (N+1 queries, unbounded loops), and missing test coverage.\n4. Write your findings to `.claude/reviews/${CLAUDE_SESSION_ID}-review.md` using this format:\n   - A Summary section (files changed, lines added/removed)\n   - A Findings section with severity labels: ERROR / WARNING / INFO\n   - Each finding: severity, file:line, one-sentence description, one-sentence recommendation\n5. If any ERROR-severity findings exist, append a one-line summary to `.claude/reviews/open-issues.log`.\n6. If there are no changes (clean working tree), write a one-line note and exit.\n\nBe concise. Findings should be actionable. Do not restate the diff — diagnose and recommend.",
              "model": "claude-sonnet-4-5",
              "tools": ["Bash", "Read", "Write"],
              "tool_permissions": {
                "Bash": {
                  "allow": ["git diff*", "git log*", "git show*", "git status*"],
                  "deny": ["git commit*", "git push*", "git reset*", "rm *", "curl *"]
                },
                "Write": {
                  "allow": [".claude/reviews/*"]
                }
              },
              "max_turns": 10,
              "timeout": 120
            }
          }
        ]
      }
    ]
  }
}
```

## Tools en output van de gespawnte agent

**Tools beschikbaar voor de subagent:**

| Tool | Scope |
|---|---|
| `Bash` | Alleen read-only git commands (`git diff`, `git log`, `git show`, `git status`). Write commands zijn geblokkeerd door de `tool_permissions` deny list. |
| `Read` | Onbeperkt — kan elk bestand in het project lezen om context rond een diff hunk te begrijpen. |
| `Write` | Beperkt tot `.claude/reviews/` — kan projectbestanden niet wijzigen. |

**Output artefacten:**

- `.claude/reviews/<session_id>-review.md` — de volledige gestructureerde review voor deze sessie.
- `.claude/reviews/open-issues.log` — append-only log van ERROR-severity bevindingen over sessies heen. Controleer dit bestand aan het begin van een nieuwe sessie om onopgeloste problemen op te pikken.

**Subagent lifecycle:**

De subagent wordt asynchroon na `Stop` gespawnt. Het draait in een apart proces; de terminal is onmiddellijk vrij. De harness schrijft de exit status van de subagent naar `.claude/reviews/<session_id>-agent.log`. Als de subagent de `timeout` (120 seconden) overschrijdt, beëindigt de harness het en schrijft een gedeeltelijke review met een timeout-melding.

## Opmerkingen

- Stel `"model": "claude-sonnet-4-5"` in voor de reviewer. Haiku produceert ondiepe bevindingen op complexe diffs; Opus is onnodig voor gestructureerde pattern matching. Sonnet slaat het juiste evenwicht tussen kwaliteit en kosten.
- `max_turns: 10` is voldoende voor de meeste diffs. Als uw sessies routinematig meer dan 20 bestanden wijzigen, verhoog naar 20 en verhoog `timeout` proportioneel.
- Voeg `.claude/reviews/` toe aan `.gitignore` tenzij u reviews naast code wilt committen. Reviews bevatten sessiemetadata die niet nuttig is in versiebeheer.
- De `tool_permissions` allow/deny lists gebruiken glob-patronen. Verkleinen of vergroten naar wens — voeg bijvoorbeeld `"git stash*"` toe aan de allow list als uw workflow stashes gebruikt.
- Om reviews automatisch in de volgende sessie te presenteren, voeg een `Start` lifecycle hook toe dat `open-issues.log` leest en de onopgeloste bevindingen aan Claude's initiële context vooraan plaatst.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

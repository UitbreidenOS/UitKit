# Handleiding voor geheugenbeheer

Hoe u context bewaart tussen sessies, compactie overleeft en Claudes werkgeheugen scherp houdt.

---

## Het geheugenprobleem

Claude Code heeft standaard geen persistent geheugen tussen sessies. Elke nieuwe sessie begint opnieuw. Binnen een sessie groeit de context totdat compactie wordt geactiveerd — op dat moment wordt de gespreksgeschiedenis gecomprimeerd en gaan details verloren.

Geheugenbeheer is de praktijk van het expliciet controleren van wat Claude weet, wanneer het dat weet, en hoe die kennis sessiegrenzen overleeft.

---

## De vier geheugenlagen

| Laag | Waar | Persistent tussen sessies | Overleeft compactie |
|---|---|---|---|
| **CLAUDE.md** | Projectroot | Ja | Ja |
| **Sessiebestanden** | `.claude/memory/` of `.tmp/` | Ja (indien opgeslagen) | Ja (indien voor compact opgeslagen) |
| **Contextvenster** | Alleen binnen sessie | Nee | Nee (gecomprimeerd) |
| **Sub-agent context** | Per sub-agent | Nee | Nee |

---

## 1. CLAUDE.md als permanent geheugen

`CLAUDE.md` wordt aan het begin van elke sessie gelezen. Het is de meest betrouwbare geheugenlaag.

**Wat in CLAUDE.md hoort:**
- Projectarchitectuuroverzicht (één alinea, niet uitputtend)
- Conventies die Claude zonder begeleiding fout zou doen
- Al genomen beslissingen die niet opnieuw besproken moeten worden
- Wat Claude nooit mag doen in dit project

**Wat NIET in CLAUDE.md hoort:**
- Lopend werk of taakstatus (verandert te snel, wordt verouderd)
- Lange uitleg over hoe technologieën werken
- Alles — CLAUDE.md boven 500 regels kost meer dan het oplevert

---

## 2. Sessiebestanden voor werkgeheugen

Voor lopende context die niet permanent in CLAUDE.md hoort, gebruik sessiebestanden.

**Patroon:**
```
.claude/
└── memory/
    ├── current-task.md       ← waar u nu aan werkt
    ├── decisions.md          ← beslissingen genomen deze week
    └── context-dump.md       ← achtergrond voor een lange taak
```

**Sessiebestanden comprimeren:** Gebruik het caveman-compress patroon — sessiegeheugenbestanden herschrijven bespaart ~46% op input-tokens die elke sessie worden gelezen.

---

## 3. Pre-compact hook voor overleving

Wanneer compactie automatisch wordt geactiveerd, gaat elke werkcontext in de sessie die niet in een bestand is opgeslagen verloren. Een `PreCompact`-hook wordt uitgevoerd voor compactie.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

**Wat `pre-compact-save.sh` moet doen:**
1. Claude vragen samen te vatten: huidige taakstatus, openstaande beslissingen, gewijzigde bestanden, volgende stappen
2. Die samenvatting met tijdstempel schrijven naar `.claude/memory/session-state.md`

---

## 4. Sub-agent geheugen-isolatie

Sub-agents krijgen een schoon contextvenster — ze hebben standaard geen geheugen van de oudersessie.

**Geheugen doorgeven aan sub-agents:**
- Relevante CLAUDE.md-secties expliciet opnemen in de sub-agent prompt
- Specifieke bestandspaden en beslissingen doorgeven die de sub-agent nodig heeft

**Geheugen terugkrijgen van sub-agents:**
- Laat de sub-agent zijn bevindingen naar een bestand schrijven
- Lees dat bestand terug in de oudersessie

---

## 5. CONTEXT.md voor domeintaal

Complexe projecten profiteren van een `CONTEXT.md` — een woordenlijst van domeinspecifieke termen.

**Structuur:**
```markdown
# Projectcontext

## Language
**Order**: Aankoopintentie van een klant voor een of meer Producten.
**Cart**: Tijdelijke pre-bestelling status. Verschilt van Order — niet verwarren.

## Relationships
- Een Order bevat een of meer OrderLines
- Een Cart behoort tot precies één User

## Decisions
- "Basket" werd gebruikt in vroege code — opgelost: gebruik altijd "Cart"
```

---

## 6. Compactiestrategie

**Proactieve compactie wint van reactieve compactie.**

**Wanneer handmatig comprimeren (`/compact`):**
- Voor het starten van een nieuwe grote taak in dezelfde sessie
- Na een lange debugsessie
- Wanneer Claude vragen begint te herhalen of beslissingen kwijtraakt

---

## Snelle referentie

| Situatie | Actie |
|---|---|
| Onveranderlijke beslissingen | In CLAUDE.md zetten |
| Huidige taakstatus | `.claude/memory/current-task.md` |
| Domeinterminologie | `CONTEXT.md` in projectroot |
| Compactie overleven | `PreCompact`-hook → session-state.md |
| Nieuwe grote taak beginnen | Eerst `/compact`, dan beginnen |
| Context doorgeven aan sub-agent | Expliciet opnemen in de prompt |
| Claude stelt al beantwoorde vragen | Antwoord toevoegen aan CLAUDE.md |

---

## Werk met ons samen

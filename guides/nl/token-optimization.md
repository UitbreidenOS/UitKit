# Handleiding voor token-optimalisatie

Hoe u Claude Code-kosten verlaagt en de reactiesnelheid verbetert zonder de uitvoerkwaliteit op te offeren.

---

## Het kernprincipe

Elke token in het contextvenster van Claude Code kost geld en vertraagt reacties. Het doel is het contextvenster slank te houden — alleen wat Claude nodig heeft om de huidige taak goed uit te voeren.

Er zijn vier hefbomen:
1. **Modelselectie** — het juiste model koppelen aan de taak
2. **Contextbeheer** — controleren wat er in het venster staat
3. **MCP-discipline** — de tool-overhead beperken
4. **Compactiestrategie** — wanneer en hoe de geschiedenis te comprimeren

---

## 1. Modelselectie

Claude Code ondersteunt meerdere modellen. Het verkeerde model voor een taak kiezen is de duurste enkele fout.

| Model | Het beste voor | Relatieve kosten |
|---|---|---|
| Claude Haiku 4.5 | Eenvoudige bewerkingen, taken met één bestand, repetitieve operaties, samenvatting | Laagste |
| Claude Sonnet 4.6 | De meeste ontwikkelingswerk — wijzigingen in meerdere bestanden, debuggen, code review | Midden |
| Claude Opus 4.7 | Complexe architectuurbeslissingen, beveiligingsanalyse, multi-agent orkestratie | Hoogste |

**Vuistregels:**
- Standaard Sonnet 4.6 voor algemene ontwikkeling
- Overschakelen naar Haiku 4.5 voor: linting-fixes, opmaak, eenvoudige hernoemingen, bewerkingen van enkele functies, boilerplate genereren vanuit een sjabloon
- Escaleren naar Opus 4.7 alleen wanneer: het probleem diep redeneren over veel bestanden vereist, beveiligingsbeslissingen betrokken zijn, of u meerdere sub-agents orkestreeert

**Haiku bespaart ~60% versus Sonnet op in aanmerking komende taken.**

---

## 2. Contextvenster beheer

Het contextvenster van Claude Code is groot (tot 1M tokens op Opus 4.7 en Sonnet 4.6), maar het **bruikbare** venster is kleiner zodra u rekening houdt met overhead.

### Wat context verbruikt

| Bron | Geschatte kosten |
|---|---|
| MCP-tools (10 ingeschakeld) | ~30k tokens |
| CLAUDE.md (project + gebruiker) | 1k–10k tokens |
| Gespreksgeschiedenis | Groeit met elke beurt |
| Bestandsinhoud gelezen in context | Varieert — vaak de grootste factor |
| Systeemprompt | ~5k–10k tokens |

### Context slank houden

**CLAUDE.md:**
- Houd project-CLAUDE.md onder 500 regels
- Verwijder regels die niet meer van toepassing zijn op de huidige projectstatus
- Dupliceer geen inhoud van gebruikers-CLAUDE.md naar project-CLAUDE.md

**Bestandslezingen:**
- Vraag Claude specifieke regelbereiken te lezen in plaats van volledige bestanden
- Vermijd hetzelfde grote bestand meerdere keren in een sessie te lezen
- Gebruik sub-agents voor geïsoleerde taken — zij krijgen een vers contextvenster

**Gespreksgeschiedenis:**
- Lange sessies stapelen dode context op
- Activeer compactie proactief in plaats van te wachten op de automatische drempelwaarde

---

## 3. MCP-discipline

Elke ingeschakelde MCP-server laadt zijn tool-definities in de context bij het starten van de sessie. Met 10 MCP-servers en ~8 tools elk verbruikt u ~80 tool-slots — ongeveer 30k tokens voordat u een woord heeft getypt.

**Controleer uw actieve MCPs:**
- Schakel alleen MCPs in die u in het huidige project gebruikt
- Schakel domeinspecifieke MCPs uit (bijv. database, cloud) wanneer u niet in dat domein werkt
- Controleer `.claude/settings.json` en `~/.claude/settings.json` op ingeschakelde servers

---

## 4. Compactiestrategie

Claude Code comprimet de gespreksgeschiedenis automatisch wanneer de context zijn limiet nadert. De standaarddrempelwaarde is laat — activeert bij ~95% capaciteit.

### Compactie eerder activeren

Gebruik het `/compact` commando handmatig voordat u een nieuwe grote taak begint.

**Wanneer handmatig comprimeren:**
- Voordat u van de ene grote taak naar de andere overschakelt in dezelfde sessie
- Na een lange debugsessie met veel mislukte pogingen in de geschiedenis
- Voordat u begint aan een taak die het lezen van veel grote bestanden vereist

### Wat compactie doet

Compactie vat de gespreksgeschiedenis samen en vervangt deze door een gecomprimeerde weergave. U verliest de exacte beurt-voor-beurt geschiedenis maar behoudt beslissingen, geschreven code en sleutelcontext.

**Pre-compact hook:** Gebruik een `PreCompact`-hook om kritieke sessiestatus in een bestand op te slaan voordat compactie wordt geactiveerd.

---

## 5. Prompt-efficiëntie

**Wees specifiek over de reikwijdte:**

In plaats van: "Fix de authenticatie"
Gebruik: "Fix de JWT-vervaldatumcontrole in `auth/middleware.py:45` — het verwerpt geen tokens met `exp` in het verleden"

**Beperk de antwoordlengte indien van toepassing:**

Voor taken waarbij u een codewijziging nodig heeft maar geen uitleg: "Maak de wijziging, geen uitleg nodig."

**Groepeer gerelateerde verzoeken:**

In plaats van vijf afzonderlijke "voeg een test toe voor X" verzoeken, zeg: "voeg tests toe voor alle vijf functies in `utils.py`."

---

## 6. Sub-agent context-isolatie

Sub-agents krijgen een vers contextvenster. Dit is een van de meest ondergebruikte optimalisatietechnieken.

**Gebruik sub-agents wanneer:**
- Een taak op zichzelf staat (duidelijke invoer, duidelijke uitvoer)
- De taak het lezen van veel bestanden vereist die niet relevant zijn voor de rest van de sessie
- U iets repetatiefs doet over meerdere bestanden

---

## 7. Kosten bijhouden

Gebruik een `PostToolUse`-hook om tool-gebruik te loggen en kosten per sessie te schatten.

Zie `hooks/lifecycle/cost-tracker.sh` voor een kant-en-klare implementatie.

---

## Snelle referentie

| Situatie | Actie |
|---|---|
| Eenvoudige bewerking van één bestand | Overschakelen naar Haiku 4.5 |
| Lange sessie wordt langzaam | Handmatig comprimeren (`/compact`) |
| Nieuwe grote taak beginnen | Eerst comprimeren, dan beginnen |
| Werken in een domein dat u niet aanraakt | Domein-MCPs uitschakelen |
| Taak staat op zichzelf | Sub-agent gebruiken |
| Vage aanvraag produceert lange antwoorden | Herschrijven als specifieke, afgebakende prompt |
| CLAUDE.md over 500 regels | Controleren en verouderde regels verwijderen |

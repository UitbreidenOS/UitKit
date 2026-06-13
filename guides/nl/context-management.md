# Contextbeheer-gids

Hoe je Claude Code's context window effectief beheert — houd sessies gericht, voorkom context bloat en behoud kwaliteit over lange werksessies.

## Het context window begrijpen

Claude Code heeft een eindig contextvenster. Naarmate u werkt, groeit de conversatie:
- Elke tool call en zijn resultaat worden toegevoegd aan context
- Elke bestandslezing wordt aan de context toegevoegd
- Elke codewijziging wordt in de context bijgehouden
- Lange conversaties bereiken uiteindelijk grenzen en worden automatisch samengevat

**Tekenen dat u context-grenzen bereikt:**
- Claude begint eerdere beslissingen te vergeten
- Antwoorden worden minder specifiek voor uw project
- Auto-compactie activeert zich (vat oudere context samen)
- Claude vraagt naar informatie die hij al heeft

## Sessies gericht houden

**Eén sessie = één taak.** Gebruik niet dezelfde Claude Code-sessie voor meerdere niet-gerelateerde taken.

```bash
# Fout: één sessie voor alles
claude
# (bouwt feature, vervolgens bug repareren, vervolgens docs schrijven, vervolgens PR controleren)

# Correct: aparte sessies per taak
claude "gebruikersauthenticatie implementeren"  # Sessie 1
claude "payment timeout bug repareren"    # Sessie 2
claude "API-documentatie schrijven"        # Sessie 3
```

**Waarom:** Context uit taak 1 vervuilt taak 3. Claude Code werkt beter als context relevant is.

## Vooraf context efficiënt laden

In plaats van Claude's codebase door aflezingen laten ontdekken:

```bash
# CLAUDE.md-bestand aan uw project toevoegen
# Claude leest dit bij sessionstart — het wordt uw persistente context
cat CLAUDE.md
```

Een goede `CLAUDE.md` bevat:
- Projectbeschrijving (2-3 zinnen)
- Belangrijke directories en wat ze bevatten
- Belangrijke conventies (naamgeving, patronen, beslissingen)
- Dingen DIE NIET zonder vragen mogen worden gewijzigd
- Veelgebruikte commando's (hoe tests uit te voeren, bouwen, etc.)

Dit vervangt tientallen exploratieve bestandslezingen door gestructureerde contextlading.

## Gebruik de `/compact`-opdracht

Wanneer een sessie lang wordt:
```
/compact
```

Dit vat het eerdere gesprek samen in een kortere representatie, wat contextvensterruimte vrijmaakt zonder de belangrijkste beslissingen en context verliest.

**Gebruik compact wanneer:**
- U een hoofdsubtaak in een langere sessie hebt voltooid
- De context vol zit met exploratie die niet langer relevant is
- U een nieuwe werkfase in dezelfde sessie gaat starten

## Strategische bestandslezingen

Claude leest bestanden in context — wees selectief:

```
# Te breed:
"Alle bestanden in de auth-module lezen"

# Beter:
"src/auth/jwt.ts en src/middleware/auth.ts lezen — ik wil de JWT-implementatie begrijpen"
```

Vraag Claude bestanden samen te vatten in plaats van ze te lezen als u begrip nodig hebt:
```
"Zonder het bestand te lezen, gebaseerd op de naam en de imports die u kunt zien, wat doet src/services/email.ts waarschijnlijk?"
```

## Worktrees voor langetermijn-isolatie

Voor taken die zich over dagen uitstrekken, gebruikt u git worktrees:
```bash
git worktree add ../project-feature feature/my-feature
cd ../project-feature
claude "werken aan de gebruikersauthenticatiefeature"
```

Elke worktree = eigen Claude Code-sessie met eigen schone context.

## De `/lean-claude`-vaardigheid

Laad `/lean-claude` aan het begin van elke sessie om token-efficiënte modus in te schakelen:
- Kortere, meer precise antwoorden
- Minder herhaalde informatie
- Directe antwoorden zonder inleiding

```bash
npx claudient add skills productivity
# Vervolgens in Claude Code:
/lean-claude
```

## Herstellen van een verouderde sessie

Als Claude track verliest van eerdere context:

1. **Start opnieuw met samenvatting-prompt:**
   ```
   "Laat me je bijpraten over wat we hebben gedaan. [Samenvatting van belangrijkste besluiten, huidige status, volgende stap]"
   ```

2. **Gebruik `/compact`** om samen te persen en opnieuw te focussen

3. **Vers begin met voorgeladen context:**
   ```bash
   # Sessie beëindigen, nieuwe starten
   claude "Ik ga verder met [feature]. Hier is context: [korte samenvatting]. De huidige status is [beschrijven]. De volgende stap is [specifieke taak]."
   ```

## Multi-bestand-contextstrategieën

Wanneer u aan veel bestanden werkt:

```
# In plaats van: "alle 15 bestanden in deze module lezen"
# Doe: "Ik ga aan de betalingsmodule werken. De sleutelbestanden zijn payments.service.ts (handelt laadlogica), payments.controller.ts (routes) en payments.dto.ts (typen). Lees eerst alleen die drie."
```

Lees vervolgens aanvullende bestanden alleen als nodig, niet speculatief.

## Token-kosten-bewustzijn

Langere context = hogere kosten per verzoek. Strategieën om kosten te verlagen:
- Gebruik `/lean-claude` voor token-efficiënte modus
- Grote taken in meerdere gerichte sessies verdelen
- Vermijd het opnieuw lezen van ongewijzigde bestanden
- Gebruik `CLAUDE.md` om stabiele context goedkoop voor te laden

---

# Cursor + Claude Code Tandem-workflow

## Wanneer activeren
Gebruiker gebruikt zowel Cursor als Claude Code en vraagt hoe ze deze effectief samen te gebruiken; gebruiker vermeldt het schakelen tussen IDE en terminal AI; gebruiker wil weten welk hulpmiddel voor een bepaalde taak te gebruiken als beide beschikbaar zijn.

## Wanneer NIET gebruiken
Gebruiker heeft slechts één van de twee hulpmiddelen; gebruiker stelt vragen over één hulpmiddel geïsoleerd zonder verwijzing naar het andere; gebruiker wil een vergelijking om te beslissen welk hulpmiddel te kopen.

## Instructies

**Hulpmiddel-rollen — houd ze verschillend :**

- **Cursor** = intelligente IDE. Inline-autocompletie, chat met meerdere bestanden, codebase-zoeken, snelle bewerkingen, componentschrijven, diff-beoordeling, verkennen van onbekende code.
- **Claude Code** = autonome terminal-agent. Voert shell-opdrachten uit, orkestreert sub-agenten, handelt taken over meerdere bestanden af, maakt commits, stelt infrastructuur in.

**Taak-routering — welk hulpmiddel voor welk werk :**

Goede Cursor-taken:
- Nieuwe componenten of functies schrijven
- Een diff controleren voordat u commit
- Een onbekende codebase verkennen om de structuur te begrijpen
- Snelle hernoemingen en lokale refactoring
- Inline-documentatie

Goede Claude Code-taken:
- Volledige test-suite uitvoeren, vervolgens fouten herstellen
- Grootschalige refactoring over 20+ bestanden
- GitHub Actions, Dockerfiles of CI/CD-configs instellen
- Database-migraties
- Alles wat shell-opdrachten of sub-agenten-orkestratie vereist
- End-to-end feature-generatie van spec naar PR

**Gedeelde context via CLAUDE.md :**
Beide hulpmiddelen lezen `CLAUDE.md`. Schrijf eenmaal uw conventies, naamgevingsregels, architectuurbeslissingen en voorkeuren — beide hulpmiddelen respecteren ze automatisch. Dit is het belangrijkste integratiepoint.

**Kritieke regel — laat nooit beide gelijktijdig hetzelfde bestand bewerken.** Dit veroorzaakt git-conflicten die geen van beide hulpmiddelen schoon kan oplossen. Voltooien de Claude Code-taak, commit, open dan in Cursor.

**Handoff-patroon :**
1. Claude Code voert de taak met meerdere stappen uit → commit het resultaat
2. U opent de commit in Cursor voor verfijning, code-beoordeling of verfraaiing
3. Cursor-bewerkingen gaan in een vervolgcommit

**Parallel gebruikspatroon :**
Voer Claude Code op de achtergrond uit op een lange taak (testsuite, migratie, build) terwijl u in Cursor aan niet-gerelateerde bestanden werkt. Claude Code rapporteert terug wanneer klaar zonder uw editor-workflow te blokkeren.

## Voorbeeld

"Ik gebruik Cursor om React-componenten te schrijven en de codebase te verkennen. Ik schakel over naar Claude Code terminal wanneer ik het volgende nodig heb: volledige testsuite uitvoeren, over 30 bestanden refactoreren, GitHub Actions instellen of een databasemigratie doen. `CLAUDE.md` bevat onze gedeelde conventies — beide hulpmiddelen pakken deze automatisch op zonder extra configuratie."

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

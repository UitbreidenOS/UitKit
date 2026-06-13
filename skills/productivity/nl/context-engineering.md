# Context Engineering

## Wanneer activeren
Gebruiker wil optimaliseren hoe context aan Claude wordt verstrekt, token-gebruik verminderen, antwoordkwaliteit verbeteren door beter context-design, of raakt context window-limieten.

## Wanneer NIET gebruiken
- Prompt engineering voor stylistische output (toon, formaat, persoon) — dat is een ander probleem
- RAG system-architectuur — retrieval pipeline-design is gescheiden van context-layout
- Token telling voor factureringsschattingen — gebruik de tokenizer API rechtstreeks

## Instructies

### Progressieve Openbaarmaking
Verstrek alleen de context die nodig is voor de huidige stap. Laad aanvullende context wanneer de taak dit vereist.

Dump niet een hele codebase aan het begin van een gesprek. In plaats daarvan:
1. Begin met het specifieke bestand of de functie relevant voor de taak
2. Verwijs naar andere bestanden bij naam: "See `utils/auth.ts` for the token validation logic"
3. Voeg context toe wanneer Claude vraagt of wanneer een subtaak dit vereist

### Gestructureerde Context versus Proza
Claude parseert structuur betrouwbaarder dan proza-alinea's. Voorkeur geven aan:
- Headers (`##`) om verschillende problemen te scheiden
- Bulletpoints voor lijsten van beperkingen, vereisten of feiten
- Code blocks voor alle code — zelfs korte codefragmenten
- Tabellen voor vergelijkingen of config-opties

Vermijd: lange proza-alinea's die de belangrijkste instructie in het midden begraven.

### Context Prioriteit Volgorde
Claude leest start-tot-einde maar heeft twee aandachtpieken: **begin** en **einde**.

- Zet kritieke beperkingen en de primaire taak helemaal aan het begin
- Zet de laatste instructie of het belangrijkste detail aan het einde
- Laat background/supporting context in het midden

Voor een 200k context window:
| Sectie | Token budget |
|---|---|
| System prompt | <5,000 |
| CLAUDE.md / project rules | <2,000 |
| Task description + constraints | <10,000 |
| Reference files / documents | remainder |
| Reserve for output | ~10,000 |

### Referentie, niet Herhaal
Wijs naar een bestand in plaats van het plakken:
```
Read `src/api/routes/user.ts` — focus on the `POST /users` handler.
```
Dit gebruikt 10 tokens in plaats van 2.000 en vermijdt verouderde context als het bestand mid-session verandert.

Plak alleen bestandsinhoud wanneer:
- Het bestand niet kan worden gelezen (extern doc, screenshot, enz.)
- U Claude wilt laten een specifieke versie analyseren die verschilt van schijf
- De inhoud is zeer kort (<30 regels) en centraal in elk antwoord in het gesprek

### Anti-Patronen
- **Full-file paste voor een enkele functie:** plak alleen de functie plus de directe imports
- **Gevestigde context herhalen:** als Claude al weet X, herhaal X niet in elk bericht
- **Over-uitleggen wat Claude weet:** leg niet uit wat JSON is, wat een REST API is, enz.
- **Vage taak + enorme context:** een vage instructie met 50k tokens context produceert vague output; definieer eerst de taak nauwkeurig
- **Raw HTML/PDF dumps injecteren:** extraheer en reinig de relevante tekst voordat u deze opneemt

### Multi-Turn Context Management
- Na 10+ beurten kunnen sleutelfactoren van beurt 1 minder aandacht krijgen — herhaald kritieke beperkingen in het bericht waar ze opnieuw relevant worden
- Gebruik CLAUDE.md of een vastgemaakt system prompt voor invariante projectregels in plaats van ze in berichten te herhalen
- Compaction (Claude Code's `/compact`) vat geschiedenis samen — gebruik dit voordat u een nieuwe fase van een taak start

### Semantic Chunking voor Grote Documenten
Wanneer u een groot document moet opnemen, chunk per semantische eenheid niet per token-telling:
- API docs: één sectie per eindpunt, niet willekeurige 500-token blokken
- Code: één klasse of één functie per chunk, niet gesplitst op lijn 500
- Proza: één argument of één onderwerp per chunk

Label elk chunk duidelijk zodat Claude het kan citeren: `### Section: Authentication (lines 45-89)`

## Voorbeeld

**Slechte context delivery:**
```
Hier is mijn hele project (12 bestanden geplakt). Ik wil dat je de login-bug fixt.
```

**Goede context delivery:**
```
Ik heb een login-bug: gebruikers krijgen een 401 zelfs met geldige referenties.

Relevant file: `src/auth/login.ts` (read it)
The JWT signing key is loaded from `process.env.JWT_SECRET`.
The middleware that validates tokens is in `src/middleware/auth.ts` (read it).

The bug was introduced in commit abc123. Focus on the token validation path.
```

De tweede versie geeft Claude de juiste bestanden, de foutmodus, de vermoedenlocatie en een tijd-anker — zonder verspilde tokens op onafgezonderd code.

---

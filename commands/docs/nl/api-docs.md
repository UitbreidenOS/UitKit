---
description: Genereer referentie-API-documentatie voor publieke modules of endpoints
argument-hint: "[bestand-of-directory]"
---
Genereer volledige API-referentiedocumentatie voor: $ARGUMENTS

Indien geen argument wordt gegeven, scan de repository voor publieke API-oppervlakken — geëxporteerde modules, REST/GraphQL-endpoints, CLI-interfaces — en documenteer allemaal.

Proces:
1. Identificeer het API-oppervlak:
   - Voor bibliotheken: geëxporteerde functies, klassen, types (lees bron + eventuele index/barrel-bestanden).
   - Voor HTTP-API's: route-definities (Express, FastAPI, Django, Rails, enz.).
   - Voor CLI's: argument-parsers (argparse, click, cobra, yargs, enz.).
2. Voor elk openbaar symbool/endpoint, extraheer: naam, handtekening/route+methode, parameters met types, retourtype, beschrijving uit bestaande docstrings/commentaren (indien aanwezig), foutomstandigheden.
3. Noteer eventuele authenticatie-, rate limiting- of versieschema's in de code.

Uitvoerformat — Markdown-referentiedocument:

## API-referentie

Voor elke module / naamruimte / routegroep:

### `<SymbolName>` / `<METHOD /path>`

**Beschrijving:** Wat het doet (afgeleid van implementatie als er geen docstring bestaat).

**Parameters / Verzoek:**
| Naam | Type | Vereist | Beschrijving |
|------|------|---------|-------------|
| ...  | ...  | ...     | ...         |

**Retourneert / Antwoord:** type en vorm, of HTTP-statuscodes met lichaamsform.

**Fouten:** Geef bekende foutomstandigheden en hun codes/types op.

**Voorbeeld:**
```<lang>
// minimaal werkend voorbeeld
```

Regels:
- Documenteer alleen wat werkelijk in de code staat — verzin geen parameters.
- Als het type van een parameter onduidelijk is, vermeld het geinformeerde type en markeer het met `<!-- verify -->`.
- Voor HTTP-API's toon curl-voorbeelden.
- Voor bibliotheekfuncties, toon de host-taal.
- Groepeer op logische naamruimte / resource / module — alfabetisch binnen elke groep.
- Als het doel een directory is, herhaal in alle bronbestanden.

Schrijf de uitvoer naar `docs/api-reference.md` (maak `docs/` aan indien afwezig), of naar $ARGUMENTS als dit eindigt op `.md`. Bevestig het geschreven pad.

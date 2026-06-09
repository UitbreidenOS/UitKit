---
description: Genereer referentie API-documentatie voor publiek beschikbare modules of eindpunten
argument-hint: "[file-or-directory]"
---
Genereer volledige API-referentiedocumentatie voor: $ARGUMENTS

Indien geen argument gegeven wordt, scan de repository voor publieke API-oppervlakken — geëxporteerde modules, REST/GraphQL-eindpunten, CLI-interfaces — en documenteer ze allemaal.

Proces:
1. Identificeer het API-oppervlak:
   - Voor bibliotheken: geëxporteerde functies, klassen, typen (lees bron + eventuele index/barrel-bestanden).
   - Voor HTTP-API's: route-definities (Express, FastAPI, Django, Rails, enz.).
   - Voor CLI's: argument parsers (argparse, click, cobra, yargs, enz.).
2. Voor elk openbaar symbool/eindpunt extracte: naam, handtekening/route+methode, parameters met typen, retourtype, beschrijving uit bestaande docstrings/opmerkingen (indien aanwezig), foutomstandigheden.
3. Noteer eventuele authenticatie-, rate limiting- of versioneringsschema's in de code.

Uitvoerformaat — Markdown-referentiedocument:

## API Reference

Voor elke module / naamruimte / routegroep:

### `<SymbolName>` / `<METHOD /path>`

**Description:** Wat het doet (afgeleid uit implementatie als geen docstring bestaat).

**Parameters / Request:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| ...  | ...  | ...      | ...         |

**Returns / Response:** type en vorm, of HTTP-statuscodes met lichaamsvorm.

**Errors:** Lijst bekende foutomstandigheden en hun codes/typen op.

**Example:**
```<lang>
// minimal working example
```

Regels:
- Documenteer alleen wat daadwerkelijk in de code staat — verzin geen parameters.
- Indien het type van een parameter onduidelijk is, geef het afgeleid type aan en markeer het met `<!-- verify -->`.
- Voor HTTP-API's, toon curl-voorbeelden.
- Voor bibliotheekfuncties, toon de hostingtaal.
- Groepeer op logische naamruimte / resource / module — alfabetisch binnen elke groep.
- Indien het doel een directory is, herhaal dit in alle bronbestanden.

Schrijf de uitvoer naar `docs/api-reference.md` (maak `docs/` aan als deze afwezig is), of naar $ARGUMENTS als deze eindigt op `.md`. Bevestig het geschreven pad.

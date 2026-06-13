---
description: Genereer een weekoverzicht op basis van git-geschiedenis, notities of vrije invoer
argument-hint: "[weekcontext, notities, of laat leeg voor git]"
---
Genereer een weekoverzicht op basis van: $ARGUMENTS

Als $ARGUMENTS leeg of minimaal is, voer `git log --since="7 days ago" --oneline --author=$(git config user.email)` uit om prestaties uit commits af te leiden.

Produceer deze secties:

**Opgeleverd / Afgerond**  
Lijst met opsommingstekens. Elk item is een concrete deliverable of mijlpaal, geen taak. Groepeer gerelateerde commits in één item. Niet meer dan 8 opsommingspunten.

**Lopende werkzaamheden**  
Lijst met opsommingstekens. Wat is actief in uitvoering en naar verwachting afgerond in de komende 1-2 weken. Voeg ruw voltooiingspercentage toe indien afleidbaar.

**Geblokkeerd / Op risico**  
Lijst met opsommingstekens. Elk item: wat is geblokkeerd, waarom, en wie/wat ontblokt dit. Weglaten indien niets geblokkeerd is.

**Lessen**  
2-4 opsommingspunten. Observaties over proces, tooling, aanpak of domeinkennis opgedaan deze week. Geen samenvatting van wat is gedaan — alleen inzicht.

**Focus volgende week**  
3-5 opsommingspunten. Concrete prioriteiten voor de komende week, geordend op belangrijkheid.

Regels:
- Schrijf in eerste persoon.
- Kalibreer detail op signaal-ruisverhouding: sla triviale taken en afhankelijkheidsupdates over tenzij deze pijnlijk waren.
- Voeg geen tijdschattingen voor volgende week toe tenzij de invoer deze bevatte.
- Als git-geschiedenis alleen geautomatiseerde commits toont (bots, CI), merk dit op en vraag om handmatige invoer.
- Houd elk opsommingspunt tot één zin, tenzij een tweede zin essentiële context toevoegt.
- Totale output moet in minder dan 2 minuten gescand kunnen worden.

Voer alleen het weekoverzicht uit.

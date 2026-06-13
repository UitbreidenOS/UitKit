# Claude Code bureaubladapp

Volledige gids voor het op panelen gebaseerde werkoppervlak geïntroduceerd in Claude Code v1.2581.0.

---

## Overzicht

De Claude Code bureaubladapp is geen chatvenster met een zijbalk. Het is een volledig op panelen gebaseerd werkoppervlak — meerdere onafhankelijk aanpasbare panelen die Claude en de ontwikkelaar gelijktijdig delen. Elk paneeltype dient een ander doel en ze samenstellen zich in indelingen per project.

**Vereisten:** Bureaublad v1.2581.0 of later. Download van [claude.ai/code](https://claude.ai/code).

De kernverschuiving van Terminal Claude Code: u wisselt niet langer van context tussen uw editor, browser en terminal. Het werkoppervlak houdt ze allemaal en Claude kan dezelfde panelen zien en interactie mee hebben als u.

---

## Paneelsysteem

### Paneeltypes

**Chatpaneel**
De hoofdconversatieinterface. Altijd aanwezig — kan niet gesloten worden. Alle prompts, antwoorden en samenvattingen van hulpmiddeloproepen verschijnen hier.

**Diff-paneel** — `Cmd+Shift+D`
Interactieve diff-viewer. Toont diffs per beurt, niet alleen de cumulatieve eindtoestand. Navigeer achterwaarts door beurten om precies te zien wat wanneer is veranderd. Uitsplitsing per bestand met uitvouwbare secties. Ondersteunt inline-opmerkingen op specifieke regels.

**Voorbeeldpaneel** — `Cmd+Shift+P`
Rendert HTML-bestanden live zonder browser en opent PDF's, afbeeldingen en video's inline. Auto-updates wanneer het bestand op schijf verandert. Claude kan dit paneel gebruiken voor visuele verificatie — screenshots maken en de DOM inspectie — zonder het werkoppervlak te verlaten. De optie `Sessies behouden` behoudt cookies en auth-status over herstartseen heen.

**Terminalpaneel** — `Ctrl+\``
Geïntegreerde terminal. Draait in de projectmap. Handig voor het uitvoeren van tests, bekijken van logs of uitvoeren van commando's parallel aan een actieve Claude-sessie zonder van venster te wisselen.

**Bestandspaneel**
Wordt geopend wanneer u op een bestandspad klikt dat in chat of diff-viewer wordt genoemd. Biedt een directe editor voor gerichte bewerkingen. Slaat onmiddellijk op schijf op op opslaan. Waarschuwt als het bestand op schijf is gewijzigd sinds opening. Geen volledige IDE — geschikt voor gerichte wijzigingen, niet voor grote structurele refactors.

**Planpaneel**
Zichtbaar tijdens planmodus. Toont Claudes huigde plan als een gestructureerde lijst. Updates terwijl Claude het plan met taken herziet.

**Taakpaneel**
Takenlijstweergave. Toont actieve en voltooide taken over de huigde sessie.

**Subagentpaneel**
Toont draaiende subagenten en hun huigde status — welk hulpmiddel elk uitvoert, of het wacht op invoer en wanneer het vervolledigdt. Handig voor het monitoren van parallel agent-werk zonder chat-polling.

### Paneelbesturingselementen

| Actie | Methode |
|---|---|
| Paneel herpositioneren | Sleep paneelkopbal |
| Paneel herschaalen | Sleep paneelrand |
| Gefocust paneel sluiten | `Cmd+\` |
| Aanvullende panelen openen | Weergavemenu |

Indelingen worden per project opgeslagen. Een project opnieuw openen herstelt de laatst gebruikte paneelindeling.

---

## Parallelle sessies

De sessieszijbalk aan de linkerkant toont alle actieve sessies voor het huigde venster. Klik om ertussen te wisselen. Elke sessie heeft onafhankelijke context — wisselen onderbreekt de andere sessie niet.

`Cmd+;` opent een **bijpraat** die de hoofdsessiegeschiedenis niet beïnvloedt. De bijpraat ziet de volledige huigde context maar laat geen spoor in het gesprek achter bij sluiten. Gebruiken voor snelle vragen midden taak — een waarde controleren, naar patroon vragen — zonder de sessie met verkennerend heen en weer te vervuilen.

Sleep panelen om parallelle weergaven over sessies in te schikken. Een gewone indeling: mainsessipchat aan de linkerkant, subagentpaneel aan de rechterkant, diff-viewer onderaan.

---

## Voorbeeldpaneel

Het voorbeeldpaneel is het meest impactvolle paneel voor frontend- en documentwerk.

- Opent HTML live gerenderd — wijzigingen in het bestand op schijf verschijnen onmiddellijk, geen browservernieuwing
- Opent PDF's, afbeeldingen en videobestanden inline
- Claude kan een screenshot van de preview nemen en als visuele verificatie gebruiken vóór het vastleggen van een wijziging
- Claude kan het DOM via het voorbeeldpaneel inspecteren en layoutproblemen zonder afzonderlijke browser-devtools-sessie vatten
- `Sessies behouden` behoudt cookies en auth-status over herstartseen — handig voor voorbeeld geverifieerde UI-statussen
- Het paneel wordt automatisch bijgewerkt op bestand opslaan — geen handmatig vernieuwen

Gebruik dit in plaats van een browser voor UI-iteratie. Hou het voorbeeldpaneel open naast het chatpaneel bij het werken aan HTML-, CSS- of sjabloonbestand.

---

## Bestandseditorpaneel

Klik op een bestandspad in de chatuitvoer of diff-viewer om het bestand in het bestandseditorpaneel te openen.

- Wijzigingen worden direct op schijf opgeslagen op opslaan
- Het paneel waarschuwt als het bestand op schijf sinds opening is gewijzigd
- Handig voor beoordeling van Claudes schrijven en directe kleine correcties
- Niet bedoeld voor grote refactors — open een juiste IDE daarvoor

---

## Diff-viewer

De diff-viewer toont per-beurt diffs, niet alleen de uiteindelijke gecumuleerde toestand.

- Navigeer beurt-na-beurt met de beurtkiezer bovenaan het paneel
- Zie precies welke regels in welk antwoord zijn veranderd
- Uitsplitsing per bestand met uitvouwbare secties
- Voeg inline-opmerkingen toe op specifieke regels — opmerkingen zijn zichtbaar voor Claude in volgende beurten

Open met `Cmd+Shift+D`. Handig bij beoordeling van een lange multi-staps taak om de volgorde van wijzigingen te begrijpen, niet alleen het resultaat.

---

## Auto-archief

Sessies archiveren automatisch wanneer het gekoppelde pull-verzoek wordt samengevoegd. Gearchiveerde sessies worden uit de zijbalk actieve sessies verwijderd maar blijven doorzoekbaar. Heropen gearchiveerde sessies vanaf het Archieftabblad.

Handmatig archivering is ook beschikbaar: rechtskliks op een sessie in de zijbalk om deze onmiddellijk te archiveren.

---

## Sneltoetsen

| Actie | Sneltoets |
|---|---|
| Diff-paneel openen | `Cmd+Shift+D` |
| Voorbeeldpaneel openen | `Cmd+Shift+P` |
| Terminalpaneel openen | `Ctrl+\`` |
| Bijpraat openen | `Cmd+;` |
| Gefocust paneel sluiten | `Cmd+\` |
| Nieuwe sessie | `Cmd+N` |
| Naar sessie 1–9 schakelen | `Cmd+[1-9]` |
| Prompt indienen | `Enter` |
| Nieuwe regel in prompt | `Shift+Enter` |

---

## Aangepaste thema's

Stel Licht, Donker of Systeemthema in via `/config`. Voor power-users is aangepaste CSS-injectie beschikbaar — injecteer een stylesheet om een visueel element in het werkoppervlak te negeren. Dit is een geavanceerde optie zonder officiële API-stabiliteitgarantie.

---

## Tips

- Hou het voorbeeldpaneel open bij iteratie op alle UI. Claude zal het gebruiken voor visuele verificatie voordat een taak klaar verklaard wordt.
- Gebruik `Cmd+;` voor bijpraten tijdens actieve taken — stel een snelle vraag over de codebasis zonder dat het in de sessicontext verschijnt die Claude vooruitgaat.
- Open een terminalpaneel naast chat bij het uitvoeren van tests. Voer de testsuit direct uit zonder het werkoppervlak te verlaten.
- Het subagentpaneel toont realtimestatus voor parallelle agenten — controleer het in plaats van Claude naar een statusupdate te vragen.
- Sleep sessies in de zijbalk om ze opnieuw in te delen. Hou de meest actieve sessies bovenaan.
- De per-beurt navigatie van de diff-viewer is de snelste manier om te controleren wat een lange agenttaak echt gedaan heeft — gebruik het vóór samenvoegen.

---

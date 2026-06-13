---
description: Genereer een standup-update op basis van recente git-activiteit of vrije notities
argument-hint: "[context of notities]"
---
Genereer een beknopte standup-update op basis van: $ARGUMENTS

Als $ARGUMENTS leeg is, inspecteer het git-logboek voor de afgelopen 24 uur (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) en leid gisteren/vandaag af van commits. Als de repository staged of unstaged wijzigingen bevat, noteer wat in uitvoering is.

Structureer de uitvoer als drie gewone secties — geen headers, geen opsommingen tenzij natuurlijk:

Gisteren: wat was voltooid of zinvol gevorderd.
Vandaag: wat is gepland of actief in uitvoering.
Blokkades: alles wat de voortgang tegenhoudt. Indien geen, laat deze regel helemaal weg.

Regels:
- Houd elke sectie tot maximaal 1–3 zinnen.
- Schrijf in de eerste persoon, verleden/tegenwoordige tijd.
- Verwijder implementatiedetails — schrijf op het niveau van taak/functie, niet functienamen.
- Vermeld geen bestandspaden, regelnummers of commit-SHA's.
- Voeg geen beleefdheden, ondertekeningen of vulfrases toe zoals "Hoop dat het goed gaat met iedereen."
- Als $ARGUMENTS expliciete notities bevat, geef deze voorkeur boven git-geschiedenis.
- Als git-geschiedenis onduidelijk is (merge commits, alleen chores), stel één verduidelijkingsvraag voordat je genereert.

Voer alleen de standuptekst uit. Geen inleiding, geen "Hier is je standup:" wrapper.

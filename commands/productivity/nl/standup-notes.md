---
description: Genereer een standupupdate op basis van recente git-activiteit of vrije aantekeningen
argument-hint: "[context or notes]"
---
Genereer een beknopt standupupdate op basis van: $ARGUMENTS

Als $ARGUMENTS leeg is, inspecteer de git log voor de afgelopen 24 uur (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) en bepaal gisteren/vandaag op basis van commits. Als de repo staged of unstaged changes bevat, noteer wat in voorbereiding is.

Structureer de uitvoer als drie platte secties — geen headers, geen bullets tenzij natuurlijk:

Yesterday: wat was voltooid of zinvol voortgebracht.
Today: wat is gepland of actief in voorbereiding.
Blockers: alles wat voortgang blokkeert. Indien geen, laat deze regel volledig weg.

Regels:
- Houd elke sectie beperkt tot maximaal 1–3 zinnen.
- Schrijf in de eerste persoon, verleden/tegenwoordige tijd.
- Verwijder implementatiedetails — schrijf op het niveau van taak/functie, niet functienamen.
- Vermeld geen bestandspaden, regelnummers of commit SHA's.
- Voeg geen beleefdheden, ondertekeningen of vulfrases toe zoals "Hoop dat het goed met iedereen gaat."
- Als $ARGUMENTS expliciete aantekeningen bevat, prefeer ze boven git history.
- Als git history onduidelijk is (merge commits, alleen chores), stel één verduidelijkingsvraag voordat je genereert.

Voer alleen de standuptekst uit. Geen inleiding, geen "Hier is uw standup:" wrapper.

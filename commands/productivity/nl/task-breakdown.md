---
description: Een doel of feature uiteenleggen in scoped, sequentiële taken met inspanningsschattingen
argument-hint: "[doelbeschrijving of feature beschrijving]"
---
Leg het volgende uit in een gesequentieerde takenlijst: $ARGUMENTS

Produceer een platte, geordende takenlijst. Voor elke taak:

```
[ ] <werkwoord-eerste taaktitel>
    Grootte: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Hangt af van: <taaknummers, of "geen">
    Opmerkingen: <één regel — sleutelaanname, risico of beperking. Weglaten als niets opvallends.>
```

Na de lijst voegt u een **Risico's & Aannames** sectie toe (3–6 bullets) met:
- Onbekenden die schattingen kunnen verpesten
- Externe afhankelijkheden (API's, andere teams, infra)
- Scoped grenzen — wat is expliciet NIET opgenomen

Regels:
- Taken moeten onafhankelijk voltooid kunnen worden door één persoon in één zitting (M of kleiner bij voorkeur).
- Als een taak XL zou zijn, splits deze.
- Orden taken zodat elk kan starten zodra de afhankelijkheden klaar zijn — geen circulaire deps.
- Gebruik implementatie-niveau werkwoorden: Write, Add, Refactor, Deploy, Test, Configure — niet vage werkwoorden zoals "Handle" of "Work on."
- Voeg geen taken toe voor projectmanagementinitiatief (standups, reviews) tenzij het verzoek daar expliciet om vraagt.
- Als $ARGUMENTS te vaag is om uit te leggen zonder naar bereik te gokken, stel één verduidelijkende vraag voordat u verdergaat.
- Geen marketingtaal. Geen "zorg voor naadloze ervaring."

Voer alleen de takenlijst en risico's sectie uit.

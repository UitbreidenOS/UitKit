---
description: Verdeel een doel of feature in scoped, sequentiële taken met tijdsinschattingen
argument-hint: "[goal or feature description]"
---
Verdeel het volgende in een gesequentieerde takenlijst: $ARGUMENTS

Maak een vlakke, geordende lijst met taken. Voor elke taak:

```
[ ] <verb-first task title>
    Size: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Depends on: <task number(s), or "none">
    Notes: <one line — key assumption, risk, or constraint. Omit if nothing notable.>
```

Voeg na de lijst een **Risks & Assumptions** sectie toe (3–6 bullets) met betrekking tot:
- Onbekenden die schattingen kunnen verstoren
- Externe afhankelijkheden (APIs, andere teams, infra)
- Scope grenzen — wat is expliciet NIET inbegrepen

Regels:
- Taken moeten onafhankelijk door één persoon in één zitting afgerond kunnen worden (M of kleiner verdient voorkeur).
- Als een taak XL zou zijn, splits deze op.
- Orden taken zodat elk kan starten zodra de afhankelijkheden klaar zijn — geen circulaire deps.
- Gebruik implementatie-niveau werkwoorden: Write, Add, Refactor, Deploy, Test, Configure — niet vage werkwoorden zoals "Handle" of "Work on."
- Neem geen taken op voor projectmanagementsoverhead (standups, reviews), tenzij het verzoek hier expliciet om vraagt.
- Als $ARGUMENTS te vaag is om in te delen zonder aannames over scope, stel één verduidelijkingsvraag voordat je doorgaat.
- Geen marketingtaal. Geen "ensure seamless experience."

Output alleen de takenlijst en risks sectie.

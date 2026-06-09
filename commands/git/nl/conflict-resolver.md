---
description: Merge-conflicten in de huidige werkboom uitleggen en oplossen
argument-hint: "[file]"
---
Voer `git diff --diff-filter=U --name-only` uit om alle bestanden met onopgeloste merge-conflicten weer te geven. Als $ARGUMENTS is opgegeven, beperkt u de analyse tot dat bestand.

Voor elk conflicterend bestand (of alleen het opgegeven), lees de ruwe inhoud en zoek elk conflict marker blok:

```
<<<<<<< HEAD
... ours ...
=======
... theirs ...
>>>>>>> branch-name
```

Voor elk conflict blok:
1. Identificeer de HEAD-zijde en de inkomende zijde door de omringende context te lezen (functienaam, variabelebereik, importblok, configuratiesleutel, enz.).
2. Geef in één zin aan wat elke zijde probeert te doen.
3. Bepaal de juiste oplossing met behulp van deze prioriteitvolgorde:
   - Als één zijde een no-op is ten opzichte van de andere (bijv. alleen spatie of een revert), geef voorkeur aan de substantiële wijziging.
   - Als beide zijden verschillende logica toevoegen, voeg ze samen (volgorde is belangrijk — leg uit waarom u deze volgorde kiest).
   - Als de twee zijden semantisch onverenigbaar zijn, geef dit aan en vraag de gebruiker welke intentie u moet behouden voordat u een oplossing schrijft.
4. Schrijf het opgeloste blok — geen conflict markers, geen extra lege regels.

Na het oplossen van alle blokken in een bestand, toont u de volledige opgeloste versie van elk conflicterende hunk (niet het hele bestand tenzij het kort is).

Voer vervolgens een samenvattingstabel uit:

| File | Conflicts resolved | Action taken |
|------|--------------------|--------------|
| ...  | N                  | merged / chose ours / chose theirs / needs decision |

Voer `git add` of `git commit` niet uit. Wijzig bestanden op de schijf niet tenzij de gebruiker de voorgestelde resoluties bevestigt.

Als een conflict zich in een vergrendelingsbestand bevindt (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`), adviseer de gebruiker het vergrendelingsbestand te verwijderen en opnieuw te genereren in plaats van het handmatig op te lossen, en sla dat bestand over.

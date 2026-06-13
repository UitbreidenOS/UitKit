# Computer Use in Claude Code

Computer use laat Claude een desktopomgeving besturen — het maakt schermafbeeldingen om het scherm te zien, stuurt vervolgens muisklikken, toetsenbordinvoer en scroll-eventos om met elke zichtbare toepassing te interactie. Geen browserdriver of API vereist.

---

## Hoe het werkt

Claude werkt een feedbacklus:

1. Maakt een schermafbeelding van de huidige bureaubladtoestand
2. Analyzeert wat het ziet (toepassingsvensters, knoppen, tekstvelden, dialoogvensters)
3. Beslist de volgende actie (klik op coördinaten, typ tekst, druk op toets)
4. Voert de actie uit
5. Maakt nog een schermafbeelding om het resultaat te verifiëren
6. Herhaalt totdat de taak klaar is

Elke schermafbeelding is een volledige afleidingscall. Dit maakt computer use aanzienlijk langzamer en duurder dan CLI- of API-gebaseerde automatisering — plan dienovereenkomstig.

---

## Computer Use inschakelen

**CLI-vlag:**
```bash
claude --computer-use
```

**Instellingenbestand** (`settings.json`):
```json
{
  "computer_use": true
}
```

**Per-sessie-schakelaar:** Typ `/computer-use` om in de huidige sessie in te schakelen.

Computer use vereist dat het model het ondersteunt. Claude Opus 4.7 wordt aanbevolen voor complexe bureaubladtaken. Haiku ondersteunt computer use niet.

---

## Beschikbare acties

| Actie | Beschrijving | Voorbeeld |
|---|---|---|
| `screenshot` | Leg het huidige scherm vast | Basislijnobservatie |
| `click` | Links-klik op pixelcoördinaten | `click(450, 320)` |
| `right_click` | Rechtsklik op coördinaten | Contextmenu's |
| `double_click` | Dubbelklik op coördinaten | Open bestanden, activeersvelden |
| `type` | Typ een tekenreeks | Vul formuliervelden in |
| `key` | Druk op een toets of combinatie | `key("ctrl+s")`, `key("Return")` |
| `scroll` | Scroll op coördinaten | `scroll(400, 300, direction="down", amount=3)` |
| `drag` | Klik-hold-drag van punt tot punt | Herorder items, wijzig grootte vensters |
| `move` | Verplaats muis zonder te klikken | Activeer hover-staten |

---

## Coördinatensysteem

- 1:1 pixelkaart op de huidige schermresolutie
- Oorsprong `(0, 0)` is de linkerbovenhoek van het scherm
- Maximale resolutie: **2576px breed, 3,75MP totaal** voor Claude Opus 4.7
- Voor hoge DPI (Retina) displays verschilt de logische resolutie van de fysieke resolutie — Claude werkt in logische pixels

Als het scherm groter is dan de ondersteunde resolutie, werkt Claude aan een geschaalde versie. UI-elementen kunnen licht verschuiven. Test met expliciete coördinaatlogging wanneer nauwkeurigheid belangrijk is.

---

## Use cases

**UI-testen zonder browserdriver**
Screenshot vóór en na een CSS-wijziging, vergelijk layouts, controleer componentweergave op viewports.

**Formulierautomatisering voor niet-API-hulpmiddelen**
Vul webformulieren, interne hulpmiddelen of desktoptoepassingen in die geen programmatische interface blootstellen.

**Gegevensextractie uit desktoptoepassingen**
Lees waarden die in GUI-apps (Excel, databasegui's, dashboards) worden weergegeven en geen exportoptie hebben.

**Automatisering van niet-CLI-installatieprogramma's**
Stap door wizard-stijlinstallatieprogramma's die GUI-interactie vereisen.

**Gegeneraliseerde functies verifiëren**
Open een URL in een echte browser (niet headless), interactie met de pagina zoals een gebruiker zou doen, screenshot het resultaat.

---

## Beperkingen

| Beperking | Detail |
|---|---|
| Snelheid | Elke actie vereist een schermafbeelding (één afleiding). Complexe taken kunnen 10–30+ minuten duren. |
| Kosten | Opus 4.7 op schermafbeeldingsfrequentie is duur — begroting zorgvuldig |
| Parallelisme | Één bureaublad tegelijk; acties zijn strikt opeenvolgend |
| Nauwkeurigheid | Coördinaatgebaseerde klikken kunnen kleine doelen bij hoge DPI missen; gebruik elementbeschrijvingen indien mogelijk |
| State recovery | Als een dialoog onverwacht verschijnt, moet Claude het herkennen en sluiten — dit voegt beurten toe |
| Geen undo | Muis- en toetsenbordgebeurtenissen zijn echt; computer use kan irreversibele acties activeren |

---

## Veiligheid

**Gebruik altijd `--dry-run` eerst op destructieve workflows:**
```bash
claude --computer-use --dry-run "Delete all files in the Downloads folder that are older than 30 days"
```

Dry-run mode logt elke geplande actie zonder deze uit te voeren. Controleer het plan voordat u uitvoering toestaat.

**Bereik uw prompt strak.** Computer use kan alles zichtbaars klikken — een ruim beperkt prompt als "opruiming mijn bureaublad" kan onbedoelde acties activeren. Geef specifieke toepassingen, vensters en bewerkingen een naam.

**Stel `maxTurns` in voor lange taken:**
```json
{
  "computer_use": true,
  "maxTurns": 50
}
```

Zonder draailimiet kan verwarde Claude oneindige lus in een zittende UI-staat.

---

## Computer Use versus Playwright

| | Computer Use | Playwright |
|---|---|---|
| **Werkt op** | Elke zichtbare UI (web, bureaublad, native apps) | Web alleen (Chromium, Firefox, WebKit) |
| **Snelheid** | Traag (schermafbeelding per actie) | Snel (directe DOM-toegang) |
| **Betrouwbaarheid** | Matig (coördinaatgevoelig) | Hoog (selectorbased) |
| **Setup** | Geen | `npm install playwright` |
| **Gebruik wanneer** | Er is geen programmatische interface | Automatisering webUI's |

**Vuistregel:** Gebruik Playwright voor webautomatisering. Gebruik computer use alleen wanneer er geen browser automatiseringspath bestaat — native desktoptoepassingen, web-apps die headless-detectie tegengaan of hulpmiddelen die een werkelijke geverifieerde GUI-sessie vereisen.

---

## Voorbeeld: automatische screenshot test

Vergelijk UI vóór en na een CSS-wijziging:

```
You have computer use enabled.

1. Open http://localhost:3000/dashboard in Chrome
2. Take a screenshot and save it to /tmp/before.png
3. I'm going to make a CSS change — wait for me to say "done"
4. After I say done, take a second screenshot and save it to /tmp/after.png
5. Compare the two screenshots and describe any visual differences you see
```

Voor een niet-interactieve versie (routine of CI-stap):

```
You have computer use enabled.

Open http://localhost:3000/dashboard in Chrome. 
Take a screenshot.
Compare it to the reference screenshot at /tmp/reference.png.
Report any layout differences, missing elements, or color changes.
Write your findings to /tmp/visual-diff-report.md.
```

---

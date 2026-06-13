# Computer Use in Claude Code

Computer Use ermöglicht Claude die Kontrolle einer Desktop-Umgebung — er nimmt Screenshots, um den Bildschirm zu sehen, sendet dann Mausklicks, Tastatureingaben und Scroll-Events, um mit sichtbaren Anwendungen zu interagieren. Kein Browser-Driver oder API erforderlich.

---

## Wie es funktioniert

Claude betreibt eine Feedback-Schleife:

1. Nimmt einen Screenshot des aktuellen Desktop-States
2. Analysiert, was er sieht (Anwendungsfenster, Buttons, Textfelder, Dialoge)
3. Entscheidet die nächste Aktion (Klick bei Koordinaten, Text eingeben, Taste drücken)
4. Führt die Aktion aus
5. Nimmt einen weiteren Screenshot zur Verifizierung des Ergebnisses
6. Wiederholt, bis die Task abgeschlossen ist

Jeder Screenshot ist ein vollständiger Inference Call. Das macht Computer Use signifikant langsamer und teurer als CLI oder API-basierte Automatisierung — planen Sie entsprechend.

---

## Computer Use aktivieren

**CLI Flag:**
```bash
claude --computer-use
```

**Settings File** (`settings.json`):
```json
{
  "computer_use": true
}
```

**Per-Session Toggle:** Geben Sie `/computer-use` ein, um es in der aktuellen Session zu aktivieren.

Computer Use erfordert, dass das Modell es unterstützt. Claude Opus 4.7 wird für komplexe Desktop-Tasks empfohlen. Haiku unterstützt Computer Use nicht.

---

## Verfügbare Aktionen

| Aktion | Beschreibung | Beispiel |
|---|---|---|
| `screenshot` | Erfasse den aktuellen Bildschirm | Baseline-Beobachtung |
| `click` | Left-Click bei Pixel-Koordinaten | `click(450, 320)` |
| `right_click` | Right-Click bei Koordinaten | Context Menus |
| `double_click` | Double-Click bei Koordinaten | Dateien öffnen, Felder aktivieren |
| `type` | Geben Sie einen Textstring ein | Formularfelder ausfüllen |
| `key` | Drücken Sie eine Taste oder Chord | `key("ctrl+s")`, `key("Return")` |
| `scroll` | Scroll bei Koordinaten | `scroll(400, 300, direction="down", amount=3)` |
| `drag` | Click-Hold-Drag von Punkt zu Punkt | Elemente reordnen, Fenster resizing |
| `move` | Maus bewegen ohne zu klicken | Hover-States auslösen |

---

## Koordinatensystem

- 1:1 Pixel-Mapping bei aktueller Display-Auflösung
- Origin `(0, 0)` ist die obere-linke Ecke des Bildschirms
- Maximale Auflösung: **2576px breit, 3.75MP gesamt** für Claude Opus 4.7
- Für High-DPI (Retina) Displays unterscheiden sich logische und physische Auflösung — Claude arbeitet in logischen Pixeln

Wenn der Bildschirm größer als die unterstützte Auflösung ist, wird Claude an einer herunterskalierten Version arbeiten. Target UI-Elemente können leicht verschieben. Testen Sie mit explizitem Koordinaten-Logging, wenn Präzision wichtig ist.

---

## Use Cases

**UI Testing ohne Browser Driver**
Screenshot vor und nach einer CSS-Änderung, vergleiche Layouts, verifiziere Component-Rendering über Viewports.

**Form Automation für Non-API Tools**
Füllen Sie Webformulare, interne Tools oder Desktop-Anwendungen aus, die keine programmatische Schnittstelle offenlegen.

**Datenauszug aus Desktop-Anwendungen**
Lesen Sie in GUI-Apps (Excel, Datenbank GUIs, Dashboards) angezeigte Werte, die keine Export-Option haben.

**Nicht-CLI Installer Automatisierung**
Schreiten Sie durch Wizard-Style Installer, die GUI-Interaktion erfordern.

**Verifyinging Deployed Features**
Öffnen Sie eine URL in einem echten Browser (nicht headless), interagieren Sie mit der Seite wie ein Benutzer, Screenshot des Ergebnisses.

---

## Einschränkungen

| Einschränkung | Detail |
|---|---|
| Geschwindigkeit | Jede Aktion erfordert einen Screenshot (einen Inference). Komplexe Tasks können 10–30+ Minuten dauern. |
| Kosten | Opus 4.7 bei Screenshot-Häufigkeit ist teuer — budgetieren Sie vorsichtig |
| Parallelität | Ein Desktop zur Zeit; Aktionen sind streng sequenziell |
| Präzision | Koordinaten-basierte Klicks können kleine Targets bei High DPI verpassen; verwenden Sie Element-Beschreibungen wenn möglich |
| State Recovery | Wenn ein Dialog unerwartet erscheint, muss Claude es erkennen und schließen — das addiert Turns |
| Kein Undo | Maus- und Tastatur-Events sind real; Computer Use kann irreversible Aktionen auslösen |

---

## Safety

**Verwenden Sie immer `--dry-run` zuerst bei destruktiven Workflows:**
```bash
claude --computer-use --dry-run "Delete all files in the Downloads folder that are older than 30 days"
```

Dry-Run Mode protokolliert jede geplante Aktion ohne sie auszuführen. Überprüfen Sie den Plan vor der Erlaubnis zur Ausführung.

**Gültigkeitsbereich Ihrer Aufforderung eng.** Computer Use kann alles Sichtbare klicken — eine breit gefasste Aufforderung wie "clean up my desktop" kann unbeabsichtigte Aktionen auslösen. Benennen Sie spezifische Anwendungen, Fenster und Operationen.

**Setzen Sie `maxTurns` für lange Tasks:**
```json
{
  "computer_use": true,
  "maxTurns": 50
}
```

Ohne Turn-Limit kann ein verworrter Claude unendlich auf einen festgefahrenen UI-State loopen.

---

## Computer Use vs Playwright

| | Computer Use | Playwright |
|---|---|---|
| **Funktioniert auf** | Jede sichtbare UI (Web, Desktop, Native Apps) | Nur Web (Chromium, Firefox, WebKit) |
| **Geschwindigkeit** | Langsam (Screenshot pro Aktion) | Schnell (direkter DOM-Zugriff) |
| **Zuverlässigkeit** | Moderat (koordinaten-sensitiv) | Hoch (Selector-basiert) |
| **Setup** | Keine | `npm install playwright` |
| **Verwenden wenn** | Keine programmatische Schnittstelle existiert | Automatisierung von Web UIs |

**Faustregel:** Verwenden Sie Playwright für Web Automation. Verwenden Sie Computer Use nur, wenn es keinen Browser-Automatisierungs-Pfad gibt — Native Desktop Apps, Web Apps, die Headless-Detection besiegen, oder Tools, die eine echte authentifizierte GUI-Session erfordern.

---

## Beispiel: Automated Screenshot Test

Vergleichen Sie UI vor und nach einer CSS-Änderung:

```
You have computer use enabled.

1. Open http://localhost:3000/dashboard in Chrome
2. Take a screenshot and save it to /tmp/before.png
3. I'm going to make a CSS change — wait for me to say "done"
4. After I say done, take a second screenshot and save it to /tmp/after.png
5. Compare the two screenshots and describe any visual differences you see
```

Für eine nicht-interaktive Version (Routine oder CI Step):

```
You have computer use enabled.

Open http://localhost:3000/dashboard in Chrome. 
Take a screenshot.
Compare it to the reference screenshot at /tmp/reference.png.
Report any layout differences, missing elements, or color changes.
Write your findings to /tmp/visual-diff-report.md.
```

---

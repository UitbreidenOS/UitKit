---
name: visual-qa
description: Visuelle Regressions- und Layout-QA über Screenshots — Vergleichen Sie UI-Zustände, erkennen Sie CSS-Fehler und dokumentieren Sie visuelle Abweichungen.
---

# Visuelle QA über Computer Use

## Wann aktivieren

- Der Nutzer möchte überprüfen, ob eine CSS-/Layout-Änderung visuell etwas beschädigt hat
- Eine UI-Komponente wurde bearbeitet und der Nutzer möchte einen Vorher-Nachher-Vergleich Seite an Seite
- Die App hat keine visuellen Regressionstests (Percy, Chromatic, Playwright Screenshots) und eine manuelle Überprüfung ist erforderlich
- Der Nutzer meldet einen Layout-Fehler ("Es sieht auf meinem Bildschirm kaputt aus") und möchte, dass Sie diesen reproduzieren
- Überprüfung von responsiven Haltepunkten — wie die UI bei verschiedenen Viewport-Breiten aussieht
- Überprüfung von Dark Mode, hohem Kontrast oder anderen Design-Varianten visuell
- Der Nutzer sagt "Sieht das richtig aus", "Überprüf das Layout" oder "Vergleich Vorher und Nachher"

## Wann NICHT verwenden

- Der Nutzer hat eine Percy/Chromatic/Playwright-Suite für visuelle Regressionstests — führen Sie stattdessen diese aus
- Die Layout-Überprüfung würde die Navigation durch sensible Bildschirme erfordern (Zahlungsabwicklung, Anmeldedaten, Gesundheitsdaten)
- Sie haben keine Basis-Screenshot zum Vergleich und der Nutzer kann keinen bereitstellen
- Die Überprüfung ist rein funktionsfähig (funktioniert der Button) eher als visuell — verwenden Sie stattdessen die ui-testing-Fähigkeit

## Anweisungen

### Baselines etablieren

Visuelle QA erfordert einen Referenzzustand. Etablieren Sie Baselines vor der Bereitstellung von Änderungen:

1. Erstellen Sie einen Vollseiten-Screenshot jeder zu überprüfenden Ansicht.
2. Benennen Sie Screenshots mit einer konsistenten Konvention: `[component]-[state]-[breakpoint]-before.png`
   - Beispiel: `nav-menu-open-1280px-before.png`
3. Speichern oder notieren Sie die Baseline, damit der Nachher-Screenshot verglichen werden kann.

Falls der Nutzer keinen Vorher-Screenshot bereitstellen kann, notieren Sie dies und fahren Sie mit einer Einzel-Zustands-Überprüfung fort (überprüfen Sie auf offensichtliche Layout-Probleme ohne Regressions-Vergleich).

### Screenshot-Disziplin

- Erfassen Sie immer den vollständigen Viewport, nicht einen zugeschnittenen Bereich, es sei denn, die Überprüfung ist auf eine bestimmte Komponente beschränkt.
- Erfassen Sie beim exakt gleichen Scroll-Position Vorher und Nachher.
- Für responsive Überprüfungen, ändern Sie die Viewport-Größe auf den Ziel-Haltepunkt vor der Erfassung:
  - Mobil: 375px breit
  - Tablet: 768px breit
  - Desktop: 1280px breit
  - Breit: 1440px breit
- Deaktivieren Sie Animationen/Übergänge vor der Erfassung, falls möglich — ein Screenshot während einer Animation ist nicht nützlich.

### Was in einer visuellen Überprüfung zu überprüfen ist

Arbeiten Sie diese Checkliste für jeden Screenshot durch:

**Layout-Integrität**
- [ ] Keine Elemente, die ihre Container überlasten
- [ ] Kein Text unerwartet gekürzt (überprüfen Sie Überschriften, Beschriftungen, Button-Text)
- [ ] Keine unerwartete horizontale Scrollleiste
- [ ] Abstände (Padding/Margin) sind konsistent mit benachbarten Elementen
- [ ] Grid/Flexbox-Ausrichtung ist korrekt — keine verirrten Elemente

**Typografie**
- [ ] Schriftgrößen sind korrekt (Überschriften visuell größer als Fließtext, Beschriftungen kleiner)
- [ ] Zeilenhöhe ist nicht zusammengefallen (Textzeilen überlappt sich nicht)
- [ ] Kein unsichtbarer Text (weißer Text auf weißem Hintergrund usw.)
- [ ] Schriftgewichtänderungen (fett, mittel) korrekt gerendert

**Farbe und Kontrast**
- [ ] Markenfarben entsprechen den erwarteten Werten (überprüfen Sie gegen das Design-System, falls verfügbar)
- [ ] Interaktive Zustände (Hover, Focus, Aktiv) sind sichtbar und korrekt
- [ ] Keine unbeabsichtigte Farbverschmutzung von benachbarten Elementen
- [ ] Dark Mode: Alle Vorder-/Hintergrund-Paare lesbar

**Komponentenspezifisch**
- [ ] Modale und Overlays sind zentriert und verdunkeln den Hintergrund ordnungsgemäß
- [ ] Dropdowns und Tooltips werden nicht durch overflow:hidden-Container abgeschnitten
- [ ] Bilder werden geladen (keine Bilder mit fehlendem Icon)
- [ ] Icons werden in korrekter Größe und Farbe gerendert
- [ ] Formularinputs sind mit ihren Beschriftungen ausgerichtet

### Vergleich von Vorher und Nachher

Wenn beide Zustände verfügbar sind:

1. Platzieren Sie Vorher- und Nachher-Screenshots nebeneinander oder beschreiben Sie Unterschiede explizit.
2. Klassifizieren Sie für jeden sichtbaren Unterschied:
   - **Beabsichtigte Änderung** — entspricht dem, was der Entwickler geändert hat (überspringen)
   - **Regression** — etwas, das korrekt war, ist jetzt beschädigt (Flagge)
   - **Unabhängige Abweichung** — anderer Bildschirminhalt (Daten geändert, ignorieren)
3. Berichten Sie über Regressions mit: Komponentenname, was geändert wurde, Schweregrad (Kosmetisch / Funktionsfähig / Kritisch).

Schweregrad-Leitfaden:
- **Kosmetisch**: Kleine Abstände um wenige Pixel, keine Auswirkung auf Nutzer
- **Funktionsfähig**: Button teilweise verborgen, Text unlesbar, interaktives Element unerreichbar
- **Kritisch**: Seiten-Layout vollständig beschädigt, primärer CTA unsichtbar oder unerreichbar

### Sicherheitsregeln

- Navigieren Sie nicht zu einem Bildschirm, der Finanztransaktionen, Änderungen an Anmeldedaten oder Exposition von Gesundheitsdaten während einer visuellen Überprüfung auslösen könnte.
- Falls Sie einen Bildschirm erfassen, auf dem versehentlich sensible Daten sichtbar sind, notieren Sie dies und beziehen Sie den Screenshot nicht in einen extern geteilten Bericht ein.
- Schreibgeschützte visuelle Beobachtung nur — klicken Sie nicht auf interaktive Elemente, es sei denn, dies wird explizit als Teil des visuellen QA-Umfangs verlangt.

### Berichtsformat

```
Visual QA Report
Component/View: [name]
Breakpoints checked: [list]
Themes checked: [light / dark / both]

Regressions found: [n]

[1] [Component name] — [Severity]
    Before: [description or screenshot ref]
    After: [description or screenshot ref]
    Issue: [what broke and why it matters]

Cosmetic notes (not blocking):
- [list of minor issues]

Passed checks: [list of what looked correct]
```

## Beispiel

**Szenario**: Ein Entwickler aktualisierte die Navbar-CSS. Der Nutzer möchte eine visuelle QA vor dem Merge.

**Ausführung**:

1. Der Nutzer stellt einen Vorher-Screenshot bereit: `navbar-desktop-before.png` — zeigt nav mit Logo links, Links Mitte, CTA-Button rechts.
2. Navigieren Sie zur App bei 1280px Viewport. Screenshot erstellen: `navbar-desktop-after.png`.
3. Vergleichen Sie:
   - Logo-Position: gleich. BESTANDEN.
   - Nav-Links: jetzt nach rechts verschoben und überlagert den CTA-Button. REGRESSION.
   - CTA-Button: teilweise hinter Nav-Links verborgen. Schweregrad: Funktionsfähig.
4. Ändern Sie die Größe auf 375px. Screenshot erstellen: `navbar-mobile-after.png`.
   - Hamburger-Icon: vorhanden und sichtbar. BESTANDEN.
   - Menü-Geschlossener-Zustand: sieht korrekt aus. BESTANDEN.

**Bericht**:
```
Visual QA Report
Component/View: Global Navbar
Breakpoints checked: 1280px, 375px
Themes checked: light

Regressions found: 1

[1] Nav links — Functional
    Before: links centered between logo and CTA button
    After: links overflowing into CTA button, button 40% occluded
    Issue: CTA "Get Started" is partially unreachable on desktop — primary conversion action blocked

Cosmetic notes (not blocking):
- None

Passed checks:
- Mobile hamburger icon visible
- Logo position unchanged
- Mobile menu closed state correct
```

Der Entwickler sollte die Flex-/Grid-Eigenschaft, die zu Nav-Link-Überfluss führt, vor dem Merge beheben.

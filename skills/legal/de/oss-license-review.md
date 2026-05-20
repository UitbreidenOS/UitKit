---
name: oss-license-review
description: "Open-Source-Lizenzklassifizierung: permissiv vs. Copyleft vs. Netzwerk-Copyleft, Kompatibilitätsmatrix, Bereitstellungsmodell-Verpflichtungen, Namensnennung und Mitteilungsanforderungen"
---

> 🇩🇪 Deutsche Version. [Englische Version](../oss-license-review.md).

# Open-Source-Lizenzüberprüfungsfähigkeit

## Wann aktivieren
- Überprüfung der Open-Source-Lizenzen von Abhängigkeiten vor dem Versand eines Produkts
- Bestimmung, ob die Lizenz einer Bibliothek mit Ihrem kommerziellen Produkt kompatibel ist
- Verständnis der Verpflichtungen bei der Verteilung von Software mit Open-Source-Komponenten
- Überprüfung, ob die Verwendung einer GPL-Bibliothek das Open-Sourcing Ihres eigenen Codes erzwingen würde
- Erstellung einer Software Bill of Materials (SBOM) für Compliance oder Enterprise-Vertrieb

## Wann NICHT verwenden
- Formale Rechtsberatung zur Lizenzkompatibilität für hochwertige Situationen — konsultieren Sie einen Anwalt
- Patentlizenzierung oder Patentindemnität — anderes Gebiet des IP-Rechts
- Marken bezüglich Open-Source-Projektnamen — andere Analyse

## Anweisungen

### Klassifizierung einer einzelnen Lizenz

```
Klassifizieren Sie diese Lizenz und erklären Sie, was sie für mein Projekt bedeutet:

Lizenz: [MIT / Apache 2.0 / GPL v2 / GPL v3 / LGPL / AGPL / MPL 2.0 / BSD 2-Klausel / BSD 3-Klausel / andere]

Mein Projekt:
- Typ: [SaaS (keine Binärverteilung) / Mobile-App / Desktop-App / Bibliothek / Embedded]
- Wie ich diese Bibliothek nutze: [verlinkt / gebündelt / geändert / ungeändert]
- Vertrieb: [ja — öffentlich / nur intern / keine Vertrieb]

Sagen Sie mir:
1. In welche Kategorie fällt diese Lizenz (permissiv / schwaches Copyleft / starkes Copyleft / Netzwerk-Copyleft)?
2. Was sind meine spezifischen Verpflichtungen?
3. Muss ich meinen Quellcode freigeben?
4. Welche Namensnennung/Mitteilungsanforderungen gelten?
5. Gibt es eine Patentlizenz?
```

### Lizenzkompatibilitätsmatrix

```
Mein Projekt ist lizenziert als: [MIT / Apache 2.0 / proprietär kommerziell / andere]

Ich möchte diese Open-Source-Abhängigkeiten verwenden:
1. [Bibliotheksname] — [Lizenz]
2. [Bibliotheksname] — [Lizenz]
3. [Bibliotheksname] — [Lizenz]

Für jede Abhängigkeit:
- Ist diese Lizenz mit der Lizenz meines Projekts kompatibel?
- Welche Verpflichtungen schafft sie?
- Kann ich mein Produkt verteilen, ohne meinen Quellcode freizugeben?
- Besondere Überlegungen für SaaS/Cloud-Bereitstellung?
```

### Die wichtigsten Lizenzkategorien

```
Erklären Sie die wichtigsten Open-Source-Lizenzkategorien und ihre praktischen Auswirkungen:

PERMISSIV (frei nutzen, minimale Verpflichtungen):
- MIT: frei nutzen, ändern, verteilen — nur das Urheberrecht bewahren
- Apache 2.0: wie MIT + Patentlizenz + Änderungsdokumentation erforderlich
- BSD 2/3-Klausel: ähnlich MIT, leicht unterschiedliche Namensnennungs-Formulierung

SCHWACHES COPYLEFT (Änderungen an der Bibliothek müssen gemeinsam genutzt werden, aber nicht Ihre App):
- LGPL v2.1/v3: Änderungen an der LGPL-Bibliothek selbst müssen open-gesorced werden
  Dynamisches Linken normalerweise sicher; statisches Linken kann Verpflichtungen auslösen
- MPL 2.0: Datei-Level-Copyleft — geänderte MPL-Dateien müssen open-gesorced werden

STARKES COPYLEFT (gesamtes verknüpftes Werk muss möglicherweise open-gesorced werden):
- GPL v2: Vertrieb löst vollständige Quellfreigabe für verknüpfte/kombinierte Werke aus
- GPL v3: wie v2 + Anti-Tivoisation + Patentbeendigungsbestimmungen

NETZWERK-COPYLEFT (SaaS-Nutzung löst Quellfreigabe aus):
- AGPL v3: ausgeführtes geändertes AGPL-Programm als Netzwerkdienst = Vertrieb
  Verwendung der AGPL-Bibliothek in Ihrer SaaS kann dazu führen, dass Sie Ihren gesamten Codebase freigeben
```

### Abhängigkeits-Audit

```
Überprüfen Sie die Abhängigkeiten Ihres Projekts auf Lizenzrisiken.

[Ihre package.json / requirements.txt / pom.xml / go.mod / Cargo.toml einfügen]

Mein Projekttyp: [SaaS / proprietäre App / Open-Source-Lib]
Meine kommerzielle Absicht: [Verkauf als Produkt / nur intern / Open-Source]

Flagge:
1. Beliebige Copyleft-Lizenzen, die Ihre Fähigkeit beeinträchtigen könnten, Quellcode geschlossen zu halten
2. Beliebige AGPL-Lizenzen (höchstes Risiko für SaaS)
3. Lizenzen, die mit einander nicht kompatibel sind
4. Beliebige Lizenzen ohne klare Patentlizenz (relevant für kommerzielle Nutzung)
5. Lizenzen, die spezifische Namensnennungen in Ihrer Produkt-UI oder Dokumentation erfordern
```

### Namensnennung und Mitteilungsanforderungen

```
Ich muss ordnungsgemäße Namensnennung in meinem Produkt für diese Open-Source-Komponenten einbeziehen:

[Bibliotheken und deren Lizenzen auflisten]

Generieren Sie die Namensnennungsnotizen, die ich einbeziehen muss, in dem Format, das von jeder Lizenz benötigt wird.
Sagen Sie mir, wo sie zu platzieren sind: in der App-UI, in der Dokumentation, im verteilten Binary oder in Quelldateien.
```

## Beispiel

**Benutzer:** Wir bauen ein SaaS-Produkt und stellten fest, dass wir eine AGPL-lizenzierte Bibliothek für PDF-Generierung verwenden. Wir wussten das nicht. Was bedeutet das?

**Claude's Analyse:**

**Kritisches Problem — AGPL in einem SaaS-Produkt.**

AGPL v3 Abschnitt 13 erweitert GPL-Copyleft auf Netzwerknutzung: "Wenn Sie das Programm ändern, muss Ihre geänderte Version allen Benutzern, die damit über ein Computernetz interagieren (falls Ihre Version solche Interaktion unterstützt), prominent Gelegenheit bieten, die Corresponding Source zu erhalten."

**Was dies für Ihre SaaS bedeutet:**
- Wenn Sie die Bibliothek auf irgendeine Weise geändert haben, müssen Sie möglicherweise Ihren gesamten Anwendungsquellcode für Benutzer offenlegen, die damit über das Netzwerk interagieren
- Selbst wenn Sie sie unverändert verwendet haben, werden AGPL's "Corresponding Source"-Anforderungen von einigen Jurisdiktionen breit ausgelegt

**Ihre Optionen:**
1. **Ersetzen Sie die Bibliothek** durch eine MIT/Apache-lizenzierte Alternative (empfohlen, wenn Sie Quellcode geschlossen halten möchten)
2. **Kaufen Sie eine kommerzielle Lizenz** wenn die Bibliothek eine kommerzielle/Enterprise-Lizenz ohne AGPL-Beschränkungen anbietet (häufig — überprüfen Sie ihre Website)
3. **Open-Source Ihre SaaS** unter einer kompatiblen Lizenz (selten das gewünschte Ergebnis)
4. **Konsultieren Sie einen Anwalt** um Ihr spezifisches Risiko angesichts Ihrer Jurisdiktion, Ihres Use-Case und dessen zu bewerten, ob Sie die Bibliothek geändert haben

**Sofortmaßnahme:** Stoppen Sie die Verbreitung des aktuellen Produkts, bis Sie eine Lösung haben. [VERIFY] Auslegung mit einem IP-Anwalt.

---

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

# Ihre Stack Zertifizieren

Diese Anleitung führt Sie durch den Schritt-für-Schritt-Prozess der Zertifizierung Ihrer Stack im Claudient Marketplace.

## Voraussetzungen

Vor dem Antrag auf Zertifizierung stellen Sie sicher, dass Ihre Stack:

1. **Bereits veröffentlicht** ist im Claudient Marketplace mit positivem Feedback
2. **Die Basis-Kriterien erfüllt** (siehe VETTING.md)
3. **Ein GitHub-Repository hat** (öffentlich, aktiv, gepflegt)
4. **Die Mindestanforderungen erfüllt** für Ihre Zielstadium:
   - Bronze: 10+ Installationen, 3.5+ Bewertung
   - Silber: 50+ Installationen, 4.0+ Bewertung, 6+ Monate aktive Entwicklung
   - Gold: 200+ Installationen, 4.5+ Bewertung, offizielle Betreuer-Billigung

---

## Schritt 1: Ihre Stack Bewerten

Nutzen Sie die Qualitätsrubrik in [certification-criteria.md](./certification-criteria.md), um die Bereitschaft Ihrer Stack zu bewerten.

### Checkliste

**Codequalität**
- [ ] Testabdeckung 50%+ (akzeptabel) oder 70%+ (silber) oder 90%+ (gold)
- [ ] Linting bestandenen; keine kritischen Probleme
- [ ] Abhängigkeiten in den letzten 3 Monaten aktualisiert
- [ ] Keine bekannten Sicherheitslücken

**Akzeptanz**
- [ ] Bronze: 10+ Installationen
- [ ] Silber: 50+ Installationen über 90 Tage
- [ ] Gold: 200+ Installationen über 180 Tage

**Zufriedenheit**
- [ ] Bronze: 3.5+ Bewertung (5+ Bewertungen)
- [ ] Silber: 4.0+ Bewertung (10+ Bewertungen)
- [ ] Gold: 4.5+ Bewertung (20+ Bewertungen)

**Wartung**
- [ ] Aktualisiert in den letzten 6 Monaten (bronze), 3 Monaten (silber), 1 Monat (gold)
- [ ] Durchschnittliche Problemreaktionszeit akzeptabel
- [ ] Keine kritischen offenen Probleme

**Dokumentation**
- [ ] README vollständig und klar
- [ ] Mindestens 1 Beispiel (bronze), 2+ (silber), 3+ (gold)
- [ ] CLAUDE.md vorhanden und genau
- [ ] Silber/Gold: Mindestens eine zusätzliche Sprache

---

## Schritt 2: Ihren Qualitätswert Berechnen

Nutzen Sie die Methodik in [certification-criteria.md](./certification-criteria.md):

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Erfassen Sie Werte für jede Dimension:

| Dimension | Wert (0-100) |
|-----------|---------------|
| Codequalität | ___ |
| Akzeptanz | ___ |
| Zufriedenheit | ___ |
| Wartung | ___ |
| Dokumentation | ___ |
| **Zusammengesetzter Wert** | **___** |

**Stadiums-Berechtigung:**
- 80-100 → Gold-Kandidat
- 60-79 → Silber-Kandidat
- 40-59 → Bronze-Kandidat

---

## Schritt 3: Zertifizierungsmaterialien Vorbereiten

Erstellen Sie ein Dokument mit:

### A. Stack-Zusammenfassung
- Stack-Name und -ID
- GitHub-Repository-URL
- Installationszahl (mit Quelle: npm, GitHub oder Marketplace-Verfolgung)
- Aktuelle durchschnittliche Bewertung und Bewertungsanzahl
- Liste der Hauptmerkmale/Fähigkeiten

### B. Qualitätsnachweis
- Links zu 2+ Community-Bewertungen oder Testimonials
- GitHub-Aktivitätsprotokoll (letzte 6 Monate)
- Liste der gelösten Probleme (mit Reaktionszeiten)
- Testabdeckungsbericht (falls vorhanden)

### C. Wartungs-Verpflichtung
- Name(n) des Autors
- Verpflichtungsniveau: Bronze/Silber/Gold
- Geschätzte Wartungsstunden pro Monat
- Support-Kanäle (GitHub Issues, Discord, E-Mail, etc.)
- Plan für die Behandlung kritischer Probleme

### D. Einzigartiges Wertversprechen
- Kurze Erklärung, was diese Stack wertvoll macht
- Wie sie sich von ähnlichen Stacks unterscheidet
- Beweis der Community-Akzeptanz

### E. SLA-Konformitätserklärung

**Für Bronze:**
"Ich verpflichte mich, auf alle Probleme innerhalb von 2 Wochen zu antworten und kritische Fehler innerhalb von 2 Wochen zu beheben."

**Für Silber:**
"Ich verpflichte mich, auf alle Probleme innerhalb von 1 Woche zu antworten und kritische Fehler innerhalb von 2 Wochen zu beheben. Ich werde eine monatliche oder vierteljährliche Veröffentlichungskadenz beibehalten."

**Für Gold:**
"Ich verpflichte mich, auf alle Probleme innerhalb von 48 Stunden zu antworten und kritische Fehler innerhalb von 5 Geschäftstagen zu beheben. Ich werde monatliche Veröffentlichungen durchführen und jährliche Sicherheitsprüfungen durchführen."

---

## Schritt 4: Zertifizierungsüberprüfung Anfordern

Senden Sie eine E-Mail an **marketplace@claudient.dev** mit der Betreffzeile:

```
Certification Request: [Stack Name] - [Tier] Tier
```

Einfügen:
1. Alle Materialien aus Schritt 3
2. Ihre berechnete Qualitätswert-Aufschlüsselung
3. Link zu dieser Stack-Auflistung im Marketplace
4. Alle weiteren Kontexte oder Hinweise

**Antwortzeitleiste:** Das Kernteam bestätigt innerhalb von 3 Geschäftstagen und beginnt mit der Überprüfung.

---

## Schritt 5: Auf Kernteam-Feedback Antworten

Das Kernteam kann anfordern:

**Zusätzliche Informationen:**
- Klarstellungen zu Metriken
- Zusätzliche Beispiele oder Dokumentation
- Sicherheitsprüfungs- oder Abhängigkeitsbericht

**Geringfügige Updates:**
- Dokumentationsverbesserungen
- Beispielzusätze
- README-Klarheitsverbesserungen

**Bedingte Genehmigung:**
- Erfüllen Sie vor der endgültigen Genehmigung spezifische Metriken
- Beheben Sie identifizierte Probleme und beantragen Sie erneut

**Beantragen Sie Nach Verbesserungen Erneut:**
Falls abgelehnt, können Sie nach folgenden Schritten erneut beantragen:
- Feedback beheben (mindestens 2+ Wochen)
- Schwache Bereiche verbessern
- Zusätzliche Akzeptanz aufbauen (falls erforderlich)

---

## Schritt 6: Zertifizierungsgenehmigung

Nach der Genehmigung:

1. **Marketplace-Auflistung aktualisiert** mit Zertifizierungsabzeichen
2. **Zertifizierte Stacks-Index aktualisiert** (marketplace/certified/README.md)
3. **Stadiums-Auszeichnung veröffentlicht:**
   - Bronze: In zertifizierten Stacks aufgelistet
   - Silber: In der Kategorie "Empfohlen" vorgestellt
   - Gold: Auf der Marketplace-Startseite vorgestellt

4. **Autor benachrichtigt** mit:
   - Zertifizierungsabzeichen-Asset (PNG, SVG)
   - Zertifikat der Zertifizierung
   - Pressemitteilungsvorlage (optional)
   - Marketing-Assets

---

## Schritt 7: Ihre Zertifizierung Beibehalten

### Laufende Verantwortungen

**Bronze (alle 6 Monate) :**
- Durchschnittliche Bewertung über 3.5 halten
- Mindestens 10 Installationen beibehalten
- Auf Probleme innerhalb von 2 Wochen antworten
- Rezertifizieren, um Abzeichen zu halten

**Silber (alle 12 Monate) :**
- Durchschnittliche Bewertung über 4.0 halten
- Mindestens 50 Installationen beibehalten
- Vierteljährliche Updates veröffentlichen
- Auf Probleme innerhalb von 1 Woche antworten
- Rezertifizieren, um Abzeichen zu halten

**Gold (alle 24 Monate) :**
- Durchschnittliche Bewertung über 4.5 halten
- Mindestens 200 Installationen beibehalten
- Monatliche Updates veröffentlichen
- Auf Probleme innerhalb von 48 Stunden antworten
- Jährliche Sicherheitsprüfung durchführen
- Rezertifizieren, um Abzeichen zu halten

### Jährlicher Rezertifizierungsprozess

**30 Tage vor dem Ablaufdatum:**
- Sie erhalten einen Rezertifizierungshinweis
- Überprüfen Sie, ob die aktuellen Metriken die Stadiums-Anforderungen noch erfüllen
- Senden Sie die Rezertifizierungsbestätigung an marketplace@claudient.dev

**Falls die Metriken rückläufig sind:**
- Stack kann um eine Stadiums abgestuft werden
- Sie haben 60 Tage, um zu verbessern und Einspruch einzulegen
- Falls nicht verbessert, Zertifizierung wird widerrufen

---

## Zertifizierungserneuerung

Ihr Zertifizierungsabzeichen bleibt gültig bis zum Ablaufdatum. Erneuerung in Kürze (innerhalb von 60 Tagen) kann ausgelöst werden durch:
- Erhebliche Funktionszusätze
- Großer Wartungsmeilestein
- Anfrage auf Stadiums-Upgrade

Der Erneuerungsprozess ist identisch mit der Erstzertifizierung.

---

## Stadiums-Upgrades

Zum Upgrade von Bronze zu Silber oder Silber zu Gold:

1. Stellen Sie sicher, dass neue Metriken das Zielstadium erfüllen
2. Senden Sie eine Upgrade-Anfrage an marketplace@claudient.dev mit aktualiertem Qualitätswert
3. Das Kernteam verifikert die Metriken (2-3 Geschäftstage)
4. Nach Genehmigung werden Auflistung und Abzeichen aktualisiert

---

## Entzug der Zertifizierung und Einspruch

Falls Ihre Zertifizierung widerrufen wird:

1. **Benachrichtigung des Grundes:** Sie erhalten detaillierte Erklärung
2. **Einspruchsfenster:** 2 Wochen für zusätzlichen Kontext
3. **Einspruchsüberprüfung:** Ein unabhängiges Kernteam-Mitglied überprüft die Entscheidung
4. **Neuer Antrag:** Verfügbar nach 6 Monaten der Verbesserungen

---

## Fragen?

- **Zertifizierungskriterien:** Siehe [certification-criteria.md](./certification-criteria.md)
- **Stadiums-Details:** Siehe [../CERTIFICATION.md](../CERTIFICATION.md)
- **Allgemeine Fragen:** marketplace@claudient.dev
- **Community-Diskussion:** [GitHub Discussions](https://github.com/claudients/claudient/discussions)

---

**Zuletzt aktualisiert:** 15. Juni 2026

---
name: kyc-screener
description: "KYC/AML Screening: Dokumentenanalyse, Identifizierung wirtschaftlicher Eigentümer, Regel-Matrix-Bewertung, PEP/Sanktionsprüfungen, Lückenfeststellung und Eskalationsrouting"
---

# KYC Screener Kompetenz

## Wann aktivieren

- Onboarding eines neuen Firmenkunden und KYC-Abschluss erforderlich
- Analyse von Entitätsdokumenten (Gründungsurkunden, Treuhandurkunden, Anteilsverzeichnisse)
- Ermittlung wirtschaftlicher Eigentümer und Überprüfung gegen PEP/Sanktionslisten
- Bewertung eines KYC-Pakets des Kunden gegen Compliance-Checkliste
- Routing unvollständiger oder hochriskanter Fälle zur erweiterten Due Diligence

## Wann NICHT verwenden

- Ersetzung der Genehmigung durch qualifizierten Compliance Officer für hochriskante Kunden
- Echtzeit-Transaktionsüberwachung (AML) — benötigt dedizierte Software
- Formale Sanktionskonformität für Finanzinstitute — erfordert spezialisierte Rechtsberatung

## ⚠️ Wichtig

KYC-Ausgaben müssen immer von qualifiziertem Compliance Officer überprüft und genehmigt werden. Claude hilft, Prozesse zu strukturieren und zu beschleunigen — ersetzt nicht menschliche Beurteilung bei Geldwäscherisiken. Alle Ausgaben tragen `[VERIFY]`.

## Anleitung

### Schritt 1 — Dokumentenanalyse und -extraktion

```
Analysiere dieses KYC-Dokument und extrahiere alle strukturierten Daten:

Dokumenttyp: [Gründungsurkunde / Treuhandurkunde / Anteilsverzeichnis / 
             Kontoauszug / Nebenkosten / Reisepass / Führerschein]

Dokument: [Text einfügen oder Inhalte beschreiben]

Extrahiere:
- Entitätsname (genau legaler Name)
- Registrierungsnummer
- Gründungsjurisdiktion
- Registrierte Adresse
- Gründungsdatum
- Direktoren / Führungskräfte (Namen, Funktionen)
- Anteilseigner / wirtschaftliche Eigentümer (Name, % Eigentum)
- Ultimative wirtschaftliche Eigentümer (UEO > 25% Schwelle oder niedrig je nach Politik)

Flaggen Sie Inkonsistenzen oder fehlende Informationen.
[VERIFY] extrahierte Daten gegen Originaldokument.
```

### Schritt 2 — Eigentumsstruktur aufbauen

```
Bilden Sie die Eigentumsstruktur aus den bereitgestellten Dokumenten:

Entitäten und Eigentum:
[einfügen was Sie extrahiert haben]

Zeichnen Sie die Eigentumskette:
- Wer ist letztendlich Eigentümer dieser Entität?
- Gibt es zwischengelagerte Holdinggesellschaften?
- Wer überschreitet den UEO-Schwellenwert (typischerweise 25%)?
- Gibt es Trusts, Nominalbedienstete oder komplexe Strukturen?

Flaggen Sie Strukturen, die:
- Inhaberaktien verwenden (hohes Risiko)
- Nominaldiretoren haben (hohes Risiko)
- Mehrere Schichten von Offshore-Holdinggesellschaften beinhalten (erhöhtes Risiko)
- Keine natürliche Person als UEO identifizieren können (kritische Lücke)

[VERIFY] Eigentumsstruktur ist vollständig und zu natürlichen Personen nachverfolgbar.
```

### Schritt 3 — KYC-Regelgitter anwenden

```
Bewerten Sie dieses KYC-Paket gegen unsere Anforderungen:

Kundentyp: [Einzelperson / Juristische Person / Trust / Fonds]
Risikostufe: [Standard / Mittel / Hoch / PEP]
Unsere KYC-Politik verlangt: [Anforderungen beschreiben oder Richtlinie einfügen]

Eingereichte Dokumente:
[jedes Dokument mit Datum und Aussteller auflisten]

Für jedes erforderliche Dokument markieren: ✓ Erhalten | ✗ Fehlt | ⚠ Bedarf Auffrischung (abgelaufen)

Gemeinsame juristische KYC-Checkliste:
- Gründungsurkunde ✓/✗
- Satzung und Geschäftsordnung ✓/✗
- Verzeichnis der Direktoren ✓/✗
- Anteilsverzeichnis / UEO-Erklärung ✓/✗
- Nachweis registrierte Adresse ✓/✗
- Beglaubigte Reisepasskopien für alle UEO > 25% ✓/✗
- Adressnachweis für alle UEO (< 3 Monate alt) ✓/✗
- Erklärung Geldquelle / Wohlstandsquelle ✓/✗
- Letzte geprüfte Abschlüsse (falls verfügbar) ✓/✗

Generieren Sie eine Lückenmeldung mit Auflistung aller fehlenden Posten mit Priorität (blockierend vs. nicht-blockierend).
[VERIFY] Checkliste entspricht Anforderungen Ihrer Jurisdiktion.
```

### Schritt 4 — PEP- und Sanktionsprüfung

```
Screenen Sie diese Namen/Entitäten gegen Risikodatenbanken:

Zu screenende Namen: [alle Direktoren, UEO und die Entität selbst auflisten]
Jurisdiktionen: [Gründungs- und Wohnländer]

Prüfen gegen:
- UN-Sanktionsliste
- OFAC SDN-Liste (US)
- EU Konsolidierte Sanktionsliste
- UK HM Treasury Sanktionen
- [Liste Ihrer Jurisdiktion]
- PEP (Politisch Exponierte Person) Definition: Regierungschef, hoher Regierungsbeamter,
  Richter, leitender Angestellter staatseigenes Unternehmen, hoher Militär,
  unmittelbare Familie und bekannte Verbindungen

Für jeden Hit: exakte Namensübereinstimmung / teilweise Übereinstimmung / keine Übereinstimmung
Flaggen Sie Teilübereinstimmungen zur erweiterten Überprüfung.

Notiz: Echtzeit-Screening erfordert Integration mit WorldCheck, Refinitiv, Dow Jones oder ähnlich.
Claude identifiziert die zu screenenden Namen; Screening selbst muss verifizierte Datenbanken nutzen.
[VERIFY] alle Namen gegen Live-Sanktionsdatenbanken vor Onboarding.
```

### Schritt 5 — Risikobewertung und Routing

```
Basierend auf obiger KYC-Bewertung Gesamtrisiko beurteilen:

Vorhandene Risikofaktoren:
[auflisten was Sie gefunden haben — Jurisdiktionsrisiko, PEP, komplexe Struktur, etc.]

Risiko-Scoring anwenden:
NIEDRIGES RISIKO: Standard-Inlandsfirma, sauberes Screening, vollständige Dokumentation
MITTLERES RISIKO: Einer oder mehrere erhöhte Risikofaktoren — an Compliance Manager routen
HOHES RISIKO: PEP, hochriskante Jurisdiktion, komplexe Struktur, nachteilige Medien — Erweiterte Due Diligence erforderlich
ABGELEHNT: Durch Richtlinie verboten (GAFI-hochriskante Länder, Sanktionstreffer, keine identifizierbare UEO)

Routing-Entscheidung:
- NIEDRIG: Beziehungsmanager kann fortfahren
- MITTEL: Compliance Manager Überprüfung innerhalb [X] Geschäftstage
- HOCH: Genehmigung Senior Compliance Officer + MLRO (Geldwäsche-Meldestelle) erforderlich
- ABGELEHNT: Entscheidung dokumentieren, MLRO für Verdächtige Aktivitätsmeldung (SAR) überweisen

[VERIFY] Routing-Entscheidung mit Compliance Officer.
```

## Beispiel

**Sie:** Wir onboarden eine Holdinggesellschaft auf den Britischen Jungferninseln mit drei Eigentumsstufen vor dem Erreichen einzelner UEOs.

**Claudes Analyse:**

**Strukturrisiko:** HOCH — BVI-Jurisdiktion + mehrfache Holding-Ebenen + Nominaldirektor-Muster.

**Benötigte Dokumente (zusätzlich zu Standard):**
- Anteilsverzeichnis für jede zwischengelagerte Entität
- Beglaubigte UEO-Erklärung für jede Ebene
- Wohlstandsquelle für UEOs über 10% Schwelle (nicht nur 25%)
- Geschäftszweckerklärung für BVI-Holding-Struktur

**PEP/Sanktionen:** Alle Namen gegen OFAC + EU + UN + UK + Listen screenen. BVI-Struktur rechtfertigt Screening gegen FinCEN-Datenbank für wirtschaftliches Eigentum.

**Routing:** Erweiterte Due Diligence vor Onboarding erforderlich. Senior Compliance Officer und MLRO Freigabe notwendig. [VERIFY] alle Ergebnisse.

---

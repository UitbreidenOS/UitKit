---
name: gdpr-expert
description: "DSGVO-Compliance: Datenschutz-Risikoscanning, DPIA-Generierung (Art. 35), Datenschutzrechtverwaltung (Art. 15-22), Rechtmäßigkeit-Bewertung und Datenverarbeitungsverträge"
---

# DSGVO Expert Skill

## Wann aktivieren
- Scans eines Codebasis oder Systems auf DSGVO-Compliance-Risiken
- Generierung einer Datenschutz-Folgenabschätzung (DPIA) unter Artikel 35
- Verwaltung von Anfragen zur Wahrnehmung von Datenschutzrechten (Zugriff, Löschung, Portabilität, Einspruch)
- Bewertung der Rechtmäßigkeit einer Datenverarbeitungstätigkeit
- Überprüfung eines Datenverarbeitungsvertrags (DPA) mit einem Anbieter
- Vorbereitung auf eine DSGVO-Prüfung oder behördliche Ermittlung

## Wann NICHT verwenden
- Cookie-Zustimmungsbanner — Implementierung ist eine Dev-Aufgabe, Doc-Bibliothek verwenden
- CCPA-only (USA) Compliance — dieser Skill konzentriert sich auf DSGVO; viele Prinzipien überschneiden sich, aber Regeln unterscheiden sich
- HIPAA Compliance — anderes Rahmenwerk, verwenden Sie einen Spezialisten
- Ersetzen einer qualifizierten Datenschutzbeauftragten (DSB) Beratung bei neuartigen oder hochriskanten Situationen

## Anleitung

### Datenschutz-Risikoscanning

```
Dieses System auf DSGVO-Compliance-Risiken scannen.

Systembeschreibung: [beschreiben, was das System tut, welche Daten es verarbeitet]
Tech Stack: [Sprachen, Frameworks, Datenbanken]
Verarbeitete Datenkategorien: [aufzählen — E-Mail, Name, IP, Standort, Gesundheit, finanzielle Daten, biometrisch]
Benutzer: [EU-Bewohner? B2B? B2C?]

DSGVO-Risiko-Checkliste nach Kategorie:

IDENTIFIZIERUNG PERSONENBEZOGENER DATEN:
□ Welche personenbezogenen Daten werden erfasst? (Name, E-Mail, IP, Geräte-ID, Standort, Verhaltensdaten)
□ Welche besonderen Kategorien von Daten werden verarbeitet? (Gesundheit, biometrisch, politisch, religiös, sexuelle Orientierung)
□ Sind wirklich alle erfassten Daten notwendig? (Datensparsamkeit — Artikel 5(1)(c))

RECHTMÄSSIGE GRUNDLAGE (Artikel 6):
Für jede Verarbeitungstätigkeit die rechtmäßige Grundlage identifizieren:
- Einwilligung (Art. 6(1)(a)): freiwillig, spezifisch, informiert, unmissverständlich — nicht mit AGBs verbunden
- Vertrag (Art. 6(1)(b)): Verarbeitung notwendig zur Erfüllung eines Vertrags mit der Person
- Rechtliche Verpflichtung (Art. 6(1)(c)): erforderlich durch EU/Mitgliedstaat Gesetz
- Berechtigte Interessen (Art. 6(1)(f)): muss dreiteiliger LIA-Test bestehen — kein Generallösung
🔴 Rotes Flag: Verwendung „berechtigter Interessen" ohne dokumentierte Interessensabwägung

EINWILLIGUNGSVERWALTUNG:
□ Wird Einwilligung vor Datenerfassung eingeholt (nicht danach)?
□ Ist Einwilligung granular (separat für jeden Zweck)?
□ Können Benutzer Einwilligung so leicht zurückziehen, wie sie gegeben wurde?
□ Wird Einwilligungsdatensatz mit Zeitstempel und Version gepflegt?

DATENSPEICHERUNG:
□ Gibt es dokumentierte Aufbewahrungsrichtlinie pro Datenkategorie?
□ Werden Daten nach Aufbewahrungsfrist automatisch gelöscht oder anonymisiert?
🔴 Rotes Flag: « wir bewahren Daten unbegrenzt auf » oder « bis Benutzer sein Konto löscht »

SICHERHEIT (Artikel 32):
□ Sind persönliche Daten im Ruhezustand und während der Übertragung verschlüsselt?
□ Zugriffskontrolle: nur autorisiertes Personal kann auf persönliche Daten zugreifen?
□ Werden persönliche Daten unnötig protokolliert (Debug-Logs mit PII)?
□ Pseudonymisierung vorhanden, wo möglich?

DATENVERARBEITER (Artikel 28):
□ Signierter DPA mit jedem Anbieter, der persönliche Daten verarbeitet?
□ Unteraufträge gelistet und genehmigt?
□ Anbieter in Drittland? Standard Contractual Clauses (SCCs) vorhanden?

VERLETZUNGSMELDUNG (Artikel 33-34):
□ Können Sie Datenverletzung innerhalb von 72 Stunden erkennen?
□ Dokumentierter Prozess zur Verletzungsmeldung vorhanden?
□ Wer ist für Benachrichtigung der Behörde verantwortlich?

Ausgabe: Risikoregister mit Artikel-Referenz, Schweregrad (🔴/🟡/🟢) und empfohlener Behebung.
```

### DPIA-Generierung (Artikel 35)

```
Datenschutz-Folgenabschätzung für [Verarbeitungstätigkeit] generieren.

Verarbeitungstätigkeit: [beschreiben — z.B. « KI-basiertes Mitarbeiterüberwachungssystem », « verhaltensbasiertes Ad-Targeting »]
Verantwortlicher: [Organisationsname]
DSB (falls ernannt): [Name oder « keine ernannt »]
Zweck: [warum Sie die Daten verarbeiten]
Datenkategorien: [aufzählen]
Empfänger: [mit wem Daten geteilt werden]
Datenübertragungen in Drittländer: [ja/nein — wohin]

DPIA erforderlich (Art. 35(3)) wenn Verarbeitung wahrscheinlich zu HOHES RISIKO führt:
□ Systematische und umfangreiche Profilierung mit erheblichen Auswirkungen auf Personen
□ Großflächige Verarbeitung besonderer Kategorien (Art. 9) oder Straftatdaten (Art. 10)
□ Systematische Überwachung öffentlich zugänglicher Bereiche

WP29 / EDPB fügt 9 Kriterien hinzu — DPIA erforderlich wenn 2+ anwendbar:
□ Bewertung oder Scoring (Profilierung, Kreditwürdigkeit)
□ Automatische Entscheidungsfindung mit rechtlichen oder ähnlich erheblichen Auswirkungen
□ Systematische Überwachung
□ Empfindliche oder hochpersönliche Daten
□ Großflächig verarbeitete Daten
□ Zusammengeführte oder kombinierte Datensätze
□ Daten über verletzliche Personen (Kinder, Mitarbeiter, Patienten)
□ Innovative Nutzung oder neue technische oder organisatorische Lösungen
□ Verarbeitung verhindert Datenschutzrechte oder Servicenutzung

DPIA-Struktur:

1. BESCHREIBUNG DER VERARBEITUNG:
   - Zwecke und rechtmäßige Grundlage
   - Datenkategorien und betroffene Personen
   - Datenflüsse (Erfassung → Verarbeitung → Speicherung → Löschung)
   - Beteiligte Verarbeiter und Unterauftragsverarbeiter
   - Aufbewahrungszeiträume

2. NOTWENDIGKEIT UND VERHÄLTNISMÄSSIGKEIT:
   - Ist Verarbeitung für erklärten Zweck notwendig?
   - Könnte gleiches Ziel mit weniger Daten erreicht werden?
   - Ist gewählte Rechtmässigkeit angemessen?

3. RISIKOBEWERTUNG:
   | Risiko | Wahrscheinlichkeit | Schweregrad | Restrisiko nach Maßnahmen |
   |---|---|---|---|
   | Unauthorisierter Zugriff auf personenbezogene Daten | Mittel | Hoch | Niedrig (Verschlüsselung + Zugriffskontrolle) |
   | Datenverletzung viele Personen betreffend | Niedrig | Sehr hoch | Niedrig (Verletzungserkennung + 72h Meldungsplan) |
   | Profilierung führt zu Diskriminierung | Mittel | Hoch | Mittel — benötigt Überwachung |

4. MASSNAHMEN ZUR ADRESSIERUNG VON RISIKEN:
   - Technische Maßnahmen: [Verschlüsselung, Pseudonymisierung, Zugriffskontrolle]
   - Organisatorische Maßnahmen: [Schulung, Richtlinien, DPA-Verträge]
   - Privacy by Design: [Datensparsamkeit, Zweckbegrenzung in Architektur eingebaut]

5. DSB-KONSULTATION:
   [DSB-Überprüfung und Genehmigung, oder Begründung warum DSB nicht konsultiert]

6. BEHÖRDENBERATUNG:
   Erforderlich unter Art. 36 wenn Restrisiko nach allen Maßnahmen HOCH bleibt.
   [Entscheidung: konsultieren / nicht erforderlich — Begründung]

DPIA für meine Verarbeitungstätigkeit generieren.
[JURISTISCHE ÜBERPRÜFUNG ERFORDERLICH: DSB oder qualifizierte Datenschutzberater müssen vor Finalisierung überprüfen]
```

### Datenschutzrechte-Handler

```
Anfrage zu Datenschutzrechten unter DSGVO Artikel 15-22 bearbeiten.

Anfragetyp:
- Artikel 15: Zugangsrecht (Auskunftsanfrage)
- Artikel 16: Recht auf Berichtigung
- Artikel 17: Recht auf Löschung (« Recht auf Vergessenwerden »)
- Artikel 18: Recht auf Einschränkung der Verarbeitung
- Artikel 20: Recht auf Datenportabilität
- Artikel 21: Widerspruchsrecht
- Artikel 22: Recht nicht Gegenstand automatisierter Entscheidungen zu sein

Antragsteller: [Name, E-Mail oder Referenz]
Eingangsdatum: [Datum — Antwort fällig innerhalb 30 Tage, erweiterbar auf 90 bei komplexen Fällen]
Identität verifiziert: [ja / nein — nicht bearbeiten bis Identität bestätigt]

Antwort-Workflow:

SCHRITT 1 — Protokollieren und Bestätigung (innerhalb von 72 Stunden):
« Wir haben Ihre Anfrage unter [Artikel X] der DSGVO erhalten. Wir werden innerhalb von 30 Tagen antworten. Ihre Referenznummer ist DSR-[JJJJ-MM-TT-NNN]. »

SCHRITT 2 — Identität verifizieren:
Keine personenbezogenen Daten offenbaren oder Löschung bestätigen ohne Identitätsprüfung.
Akzeptabel: Regierungsausweis, Kontobestätigung, Sicherheitsfragen.
Bei Unsicherheit: zusätzliche Verifizierung anfordern (Art. 12(6) erlaubt dies).

SCHRITT 3 — Anfrage bearbeiten:
Für Artikel 15 (Zugang): alle gehaltenen personenbezogenen Daten zusammenstellen, einschließlich:
  - Gehaltene Datenkategorien
  - Verarbeitungszwecke
  - Empfänger und Drittlandübertragungen
  - Aufbewahrungsfrist
  - Datenquelle (falls nicht direkt von Person)
  - Existenz automatisierter Entscheidungsfindung

Für Artikel 17 (Löschung): löschen aus:
  - Hauptdatenbank
  - Sicherungen (angemessener Zeitraum — Sicherungslöschplan notieren)
  - Drittverarbeiter (schriftlich benachrichtigen)
  - Anonymisieren wenn Löschung technisch unmöglich
  
  Ausnahmen — Löschung NICHT erforderlich wenn Verarbeitung notwendig für:
  - Rechtliche Verpflichtung oder Ansprüche
  - Meinungs- und Informationsfreiheit
  - Öffentliche Archivierung

Für Artikel 20 (Portabilität): Daten in maschinenlesbarem Format exportieren (JSON, CSV).
  Anwendbar nur auf: von Person bereitgestellte Daten + auf Zustimmungs- oder Vertragsbasis verarbeitet.

SCHRITT 4 — Antwort dokumentieren:
Protokoll: Anfragedatum, Typ, Identitätsprüfung, durchgeführte Aktionen, Antwortdatum, beanspruchte Ausnahmen.

SCHRITT 5 — Innerhalb von 30 Tagen antworten:
Wenn nicht handeln möglich: Antragsteller mit Grund benachrichtigen (kann auf 90 Tage mit Benachrichtigung erweitern).
Wenn offensichtlich unbegründet oder exzessiv: kann angemessene Gebühr erheben oder ablehnen (Begründung dokumentieren).

Antwort für meinen spezifischen Anfragetyp verfassen.
```

### Rechtmäßigkeitsbewertung

```
Rechtmäßigkeit bewerten für [Verarbeitungstätigkeit].

Verarbeitungstätigkeit: [genau beschreiben — welche Daten, welcher Zweck, welches Ergebnis]
Betroffene Personen: [Verbraucher / Mitarbeiter / B2B-Kontakte / Minderjährige]
Verhältnis zu Personen: [Kunde / Mitarbeiter / Interessent / Öffentlichkeit]

Rechtmäßigkeitsoptionen unter Artikel 6:

EINWILLIGUNG (Art. 6(1)(a)):
Bedingungen: freiwillig, spezifisch, informiert, unmissverständlich, getrennt von anderen Bedingungen
Best für: Newsletter-Abos, nicht-wesentliche Cookies, Marketingkommunikation
Schwäche: kann jederzeit widerrufen werden → Verarbeitung muss stoppen
🔴 Nicht gültig wenn: mit Vertrag verbunden, vorgekraut, an Servicezugang gebunden

VERTRAG (Art. 6(1)(b)):
Bedingungen: Verarbeitung notwendig zur Erfüllung eines Vertrags MIT der Person
Best für: Kundenbestellung, bezahlte Servicebereitstellung
🔴 Nicht gültig für: Marketing an bestehende Kunden, Analysen, Betrugsprävention

RECHTLICHE VERPFLICHTUNG (Art. 6(1)(c)):
Bedingungen: EU oder Mitgliedstaat-Gesetz verlangt Verarbeitung
Best für: Steuerdatensätze, Arbeitsrecht-Anforderungen, AML/KYC
🔴 Muss spezifisches Gesetz anführen — « wir sind gesetzlich verpflichtet » genügt nicht

LEBENSWICHTIGE INTERESSEN (Art. 6(1)(d)):
Bedingungen: Leben der Person oder anderen Person schützen
Letzter Ausweg nur — fast nie auf kommerzielle Verarbeitung anwendbar

ÖFFENTLICHE AUFGABE (Art. 6(1)(e)):
Für Behörden und die öffentliche Funktionen ausüben. Selten auf Privatunternehmen anwendbar.

BERECHTIGTE INTERESSEN (Art. 6(1)(f)):
Bedingungen: dreiteiliger LIA-Test muss bestehen:
  1. Zwecktest: ist das Interesse berechtigt?
  2. Notwendigkeitstest: ist Verarbeitung für diesen Zweck notwendig?
  3. Abwägungstest: überwiegen die Interessen die Datenschutzrechte?

Best für: Betrugsprävention, Netzwerksicherheit, B2B-Marketing, Konzern-interne Transfers
🔴 KANN NICHT verwendet werden: von Behörden; wenn Grundrechte überwiegen; für Mitarbeiterüberwachung

Für meine Tätigkeit bewerten welche Grundlage anwendbar und identifizieren Sie Schwächen.
[JURISTISCHE ÜBERPRÜFUNG ERFORDERLICH vor Verlassen auf die Bewertung]
```

## Beispiel

**Benutzer:** Wir bauen ein SaaS-Produkt, das KI nutzt, um Benutzerverhaltensmuster zu analysieren und Kundengesundheit für unsere B2B-Kunden zu bewerten. Ihre Endbenutzerdaten fließen durch unser System. Wie hoch ist unser DSGVO-Risiko?

**Claudes Analyse:**

Sie sind ein **Datenverarbeiter** (Artikel 4(8)) — Ihre B2B-Kunden sind die Verantwortlichen. Dies hat unmittelbare Auswirkungen:

**Ihre Verpflichtungen als Verarbeiter (Artikel 28):**
- Signierter DPA mit jedem B2B-Kunden vor Verarbeitung ihrer Benutzerdaten
- Daten nur auf dokumentierte Anweisungen jedes Verantwortlichen verarbeiten
- Angemessene technische und organisatorische Sicherheitsmaßnahmen implementieren
- Verantwortliche unterstützen bei Erfüllung ihrer DSGVO-Verpflichtungen (Anfragen, DPIAs, Breaches)
- Alle Daten nach Vertragsende löschen oder zurückgeben

**DPIA-Auslöser-Check:**
Ihr KI-Verhaltens-Scoringsystem löst wahrscheinlich DPIA-Anforderung aus, da es kombiniert:
- Systematische Evaluierung/Profilierung von Personen (WP29-Kriterium 1)
- Innovative Technologie (neues KI-basiertes Scoring) (WP29-Kriterium 9)
- Potenziell großer Umfang (wenn B2B-Kunden viele Endbenutzer haben)

Die Verantwortlichen (Ihre B2B-Kunden) sind für DPIA verantwortlich — aber sie benötigen Ihre technische Dokumentation wie KI funktioniert. Proaktiv einen « Verarbeiter-Beitrag zur DPIA »-Dokument vorbereiten.

**Höchste Risikobereiche für Sie:**
1. 🔴 Unterauftrags-Kette — jedes Tool für KI-Betrieb (AWS, ML-Plattform, Monitoring) ist Unteraufträge. Alle auflisten. Ihr DPA muss sie nennen oder Genehmigungsprozess beschreiben.
2. 🔴 Datenübertragungen Drittland — wenn Ihre Server oder ML-Infrastruktur in USA, benötigen Sie SCCs oder EU-US-Datenschutz-Framework.
3. 🟡 Transparenz — Endbenutzer wissen wahrscheinlich nicht, dass Verhalten gescort wird. Ihre Kunden (Verantwortliche) müssen ihnen sagen.

---

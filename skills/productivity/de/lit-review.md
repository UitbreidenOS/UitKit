---
name: lit-review
description: "Literaturübersicht der Akademie: systematische Suchstrategie, Artikel-Screening, Syntheserahmen, Zitierungsverwaltung und Erstellung eines strukturierten Übersichtsabschnitts oder einer Zusammenfassung"
---

# Lit Review Skill

## Wann aktivieren
- Durchführung einer systematischen oder scoping Überprüfung der akademischen Literatur
- Synthese von Ergebnissen über mehrere Papiere zu einem Thema hinweg
- Verfassung eines Literaturüberblicks für eine Thesis, einen Bericht oder ein Papier
- Identifikation von Lücken in der bestehenden Forschung
- Bewertung der Qualität akademischer Evidenz
- Auffinden der kanonischen Zitate für ein technisches Konzept

## Wann NICHT verwenden
- Patentanalyse — verwenden Sie die patent-analysis Skill
- Allgemeine Internetrecherche — dies ist akademische Literatur-spezifisch
- Primäre Datensammlung oder Studiendesign — anderer Forschungsmethodenskill
- Schreiben des vollständigen Papiers — diese Skill deckt Überblick ab, nicht Originalforschung

## Anweisungen

### Suchstrategie

```
Entwerfen Sie eine Literatur-Suchstrategie für [Thema].

Forschungsthema: [Beschreibung — welche Frage versuchen Sie zu beantworten?]
Überblickstyp: [systematisch (umfassend) / scoping (breite Kartierung) / narrative (selektiv)]
Zu durchsuchende Datenbanken: [PubMed / Scopus / Web of Science / ACM / IEEE / Google Scholar / arXiv]
Zeitbereich: [letzte 5 Jahre / 2000-heute / ganze Zeit]
Sprachen: [nur Englisch / alle Sprachen]

Suchstrategie:

1. Zerlegung des Themas in Konzepte:
   PICO (für medizinisch/klinisch) oder SPIDER (qualitativ):
   Population: [wer/was wird untersucht]
   Intervention/Exposition: [was wird getan/untersucht]
   Vergleich: [worauf wird es verglichen, falls zutreffend]
   Ergebnis: [was wird gemessen]

2. Erstellen Sie Schlüsselwortlisten für jedes Konzept:
   Konzept 1: [Hauptbegriff] UND [Synonyme] UND [Abkürzungen]
   Beispiel: "machine learning" ODER "ML" ODER "artificial intelligence" ODER "deep learning"
   
   Konzept 2: [Hauptbegriff] UND [Synonyme]
   Beispiel: "clinical prediction" ODER "diagnostic accuracy" ODER "clinical decision support"

3. Kombinieren mit booleschen Operatoren:
   (Konzept 1 Schlüsselwörter) UND (Konzept 2 Schlüsselwörter) UND (Konzept 3 Schlüsselwörter)

4. Wenden Sie Filter an:
   - Zeitbereich: veröffentlicht: [YYYY] bis [YYYY]
   - Dokumenttyp: Zeitschriftenartikel / Konferenzpapiere / Dissertationen ausschließen
   - Sprache: Englisch
   - Studientyp (falls zutreffend): randomisierte kontrollierte Studie / systematischer Überblick / Kohorte

5. Führen Sie in jeder Datenbank separat aus (gehen Sie nicht davon aus, dass sie gleich sind):
   - Datensatz: Datenbank, verwendete Suchzeichenfolge, Ausführungsdatum, Anzahl der Ergebnisse

6. Verwalten Sie Duplikate über Datenbanken hinweg:
   Verwenden Sie: Zotero / Mendeley / Rayyan für Deduplizierung
   Exportieren Sie alle Ergebnisse → kombinieren → deduplizieren nach Titel/DOI

Generieren Sie die Suchstrategie für mein Thema mit datenbankspezifischen Suchzeichenfolgen.
```

### Screening-Protokoll

```
Sieben Sie Papiere für Inklusion/Exklusion für [Überblick].

Insgesamt abgerufen: [X Papiere]
Einschlusskriterien: [was sich für die Aufnahme qualifiziert]
Ausschlusskriterien: [was entfernt wird und warum]

Screening-Protokoll:

STUFE 1 — Titel- und Zusammenfassungs-Screening (am schnellsten):
Einschließen wenn: Titel oder Zusammenfassung deutet darauf hin, dass das Papier [Ihr Thema] adressiert
Ausschließen wenn: eindeutig außerhalb des Geltungsbereichs, falsche Population, falscher Studientyp
Entscheidung: einschließen / ausschließen / unsicher (unsicher → einschließen zur Volltextüberprüfung)

STUFE 2 — Volltextscreening:
Lesen Sie den Methodenteil: erfüllt er alle Einschlusskriterien?
Wenden Sie Ausschlusskriterien systematisch an

Kontrollkästchen für Einschlusskriterien (passen Sie an Ihr Thema an):
☐ Population: [beschreiben Sie, wer/was sich qualifiziert]
☐ Intervention: [beschreiben Sie, was untersucht werden muss]
☐ Ergebnis: [was gemessen/gemeldet werden muss]
☐ Studiendesign: [akzeptable Designs — z. B. RCT, Kohorte, vorher-nachher]
☐ Veröffentlichung: [nur Peer-Review / Graue Literatur OK / Konferenzpapiere OK]
☐ Sprache: [nur Englisch]
☐ Datum: [veröffentlicht nach YYYY]

Ausschlusskriterien:
☐ Doppelte Veröffentlichung derselben Studie
☐ Unzureichende Daten zur Extraktion (nur Zusammenfassung verfügbar)
☐ Protokollpapier ohne Ergebnisse
☐ Konferenz-Abstract ohne vollständiges Papier
☐ Nicht peer-reviewed (falls zutreffend)

Entscheidungen aufzeichnen:
| Papier | Titel | Entscheidung | Grund für Ausschluss |
|---|---|---|---|
| [1] | [Titel] | Einschließen | — |
| [2] | [Titel] | Ausschließen | Falsche Population |

Ziel: eine Einschlussquote von 5-15% ist typisch für systematische Überblicke.
Wenn > 30%: Suche ist zu eng oder Kriterien zu breit — nochmal überprüfen.
Wenn < 2%: Suche ist zu breit oder Kriterien zu eng — anpassen.

Generieren Sie Screening-Kriterien für mein spezifisches Überblicksthema.
```

### Datenextraktionsvorlage

```
Daten aus Papieren für [Überblick] extrahieren.

Papiere zum Extrahieren: [X eingeschlossene Papiere]
Forschungsfrage: [neu formulieren]
Zu extrahierende Daten: [welche Informationen benötigen Sie aus jedem Papier]

Datenextraktion-Tabelle (passen Sie die Spalten für Ihr Thema an):

Für jedes Papier aufzeichnen:
| Feld | Beschreibung |
|---|---|
| Zitierung | Autor (Jahr). Titel. Zeitschrift. DOI. |
| Studiendesign | RCT / Kohorte / Querschnitt / Fall-Kontroll / qualitativ |
| Population | N, Demografie, Umgebung, Land |
| Intervention | Was wurde getan, Dauer, Dosis |
| Vergleich | Kontrollbedingung |
| Ergebniß-Maßnahme | Primäres Ergebnis, wie gemessen |
| Wichtiges Ergebnis | Hauptergebnis (Effektgröße / p-Wert / KI einschließen) |
| Bias-Risiko | Hoch / Mittel / Niedrig (basierend auf Studiendesign) |
| Relevanz für unsere Frage | Direkt / Indirekt / Peripher |
| Notizen | Einschränkungen, ungewöhnliche Ergebnisse, Autorenkonfikte |

Qualitätsbewertungstools nach Studientyp:
- RCTs: Cochrane Risk of Bias Tool (RoB 2)
- Kohortenstudien: Newcastle-Ottawa Skala (NOS)
- Qualitativ: CASP Kontrollkästchen
- Systematische Überblicke: AMSTAR-2
- Alle Studientypen: GRADE für Evidenzsicherheit

Best Practices für Extraktion:
- Extrahieren Sie von einer Person, verifizieren Sie von einer zweiten (doppelte Extraktion reduziert Fehler)
- Extrahieren Sie zur Analyseeinheit — wenn das Papier 3 relevante Ergebnisse meldet, extrahieren Sie jede
- Vermerken Sie, wenn Daten fehlen oder unklar sind — nicht imputieren
- Zeichnen Sie die Abbildungs-/Tabellenquelle für jede extrahierte Zahl auf

Generieren Sie die Extraktionsvorlage für meine Überblicksfrage und Papiertypen.
```

### Synthese und Schreiben

```
Synthetisieren Sie Ergebnisse und schreiben Sie einen Literaturüberblicksabschnitt.

Eingeschlossene Papiere: [X]
Auftauchende Themen: [beschreiben Sie 3-5 wiederkehrende Themen in Papieren]
Konsens-Ergebnisse: [wo Papiere übereinstimmen]
Widersprüche: [wo Papiere nicht übereinstimmen und warum]
Lücken: [was nicht untersucht wurde]
Publikum: [Thesis-Komitee / Zeitschrift-Reviewer / Entscheidungsträger / Nicht-Spezialisten]

Syntheseansätze:

NARRATIVE SYNTHESE (am häufigsten):
Gruppieren Sie Papiere nach Thema oder Ergebnis, nicht nach einzelnem Papier.
Nicht so: "Smith (2020) fand X. Jones (2021) fand Y. Brown (2022) fand Z."
So: "Mehrere Studien zeigen [X], besonders in [Kontext] (Smith 2020; Jones 2021). Jedoch gemischte Evidenz in [anderer Kontext], mit Brown (2022) findet [Y] aber Chen (2023) meldet [Z], möglicherweise wegen [methodologischer Unterschied]."

META-ANALYSE (wenn quantitative Daten homogen sind):
Pool-Effektgrößen über Studien → gewichteter Durchschnitt
Erfordert: gleiche Ergebnis-Maßnahme, vergleichbare Populationen, kompatible Studiendesigns
Tools: RevMan, R metafor Paket

THEMATISCHE ANALYSE (für qualitativ):
Code-Themen über Papiere → synthetisieren Sie Muster

Literaturüberblicks-Abschnittsstruktur:

1. Eröffnungsparagraph:
   [Rahmen Sie den Überblick im Kontext Ihrer Forschungsfrage ein]
   "Dieser Abschnitt überprüft [X] Studien zur Untersuchung von [Thema]."

2. Körper (organisiert nach Thema, nicht nach Papier):
   Thema 1: [Ergebnisse über mehrere Papiere + Zitate]
   Thema 2: [Widersprüchliche Evidenz + Erklärung]
   Thema 3: [Methodologische Fortschritte]

3. Lückenparagraph:
   "Trotz umfangreicher Evidenz für [X] bleibt [Lücke] wenig untersucht. [Nur N Studien] haben [spezifische Population/Kontext] untersucht. Dieser Überblick [identifiziert / adressiert] diese Lücke."

4. Schließungsparagraph:
   [Was der Überblick etabliert / was er nicht etabliert / wie dies Ihre Forschung aufstellt]

Schreiben Sie den Literaturüberblicks-Abschnitt für meine eingeschlossenen Papiere und Themen.
```

## Beispiel

**Benutzer:** Ich überprüfe die Literatur über LLM-Halluzinationen in medizinischen Einstellungen für ein Konferenzpapier. Ich habe 32 Papiere gefunden. Wie synthetisiere ich sie?

**Claudiens Syntheseplan:**

32 Papiere ist handhabbar für eine narrative Synthese in einem Konferenzpapier (anstelle einer vollständigen systematischen Überprüfung). Organisieren nach Thema, nicht nach Papier.

**Wahrscheinliche Themen über 32 Papiere zu LLM-Halluzinationen in der Medizin:**

1. **Häufigkeit und klinische Domänen** — Welche Halluzinationsrate? Welche klinischen Domänen (Radiologie, Medikamenten-Dosierung, seltene Krankheiten) sind am schlimmsten? (Organisieren Sie Papiere nach Domain und meldequalitäten)

2. **Erkennungsmethoden** — Wie identifizieren Forscher Halluzinationen? (Experten-Überprüfung / automatisierte Faktüberprüfung / Patientenergebnis-Korrelation) — synthetisieren Sie methodologische Ansätze

3. **Risikofaktoren** — Was erhöht das Halluzinationsrisiko? (Langform-Ausgaben? Seltene Bedingungen? Spezifische LLMs?) — dies ist, wo Uneinigkeit normalerweise lebt

4. **Minderungsstrategien** — RAG, Fine-Tuning, Mensch-in-der-Schleife, verfassungsgemäße KI — welche Evidenz existiert für jede?

5. **Methodologische Lücken** — Meiste Studien: kleines N, einzelne Institution, nur Englisch, allgemeine LLMs anstelle von klinischen Fine-Tunes. Das ist Ihr Lückenabschnitt.

**Beispiel-Syntheseparagraph (Thema 1):**

"Halluzinationsraten in klinischen LLM-Anwendungen variieren erheblich je nach Domain und Task-Komplexität. Bei Medikamenten-Dosierungs- und Pharmakologie-Aufgaben berichten [X] Studien über [Bereich]% Fehlerquoten (Smith 2023; Lee 2024; Patel 2024), mit höheren Raten für seltene Medikamente oder komplexe Polypharmakologie-Szenarien beobachtet (Smith 2023; Brown 2024). Radiologie-Berichtgenerierung zeigt vergleichsweise niedrigere Halluzinationsraten ([Y]%) bei Aufgaben mit strukturierten Ergebnissen (Jones 2023), obwohl Narrativ-Interpretationsaufgaben Raten nähern [Z]% zeigen (Kim 2024; Thomas 2024). Über alle Domänen hinweg sind Halluzinationsraten in Kontexten, in denen das Modell spezifische numerische Werte generieren muss (Dosierungen, Lab-Referenzbereiche), durchgehend höher im Vergleich zu allgemeinen klinischen Ratschlägen (Smith 2023; Lee 2024; Kim 2024)."

Hinweis: Ich synthetisiere über Papiere nach Ergebnis, nicht nach Papier — dies ist die Schlüssel-Strukturveränderung.

---

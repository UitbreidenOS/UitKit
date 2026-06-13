# Vertical Slice Planner

## Wann aktivieren

- Planen einer neuen Funktion oder eines Projekts vor Baubeginn
- Benutzer möchte eine Funktion in Arbeitseinheiten aufschlüsseln, bevor Code geschrieben wird
- Claude standardisiert auf sequentiellen Plan "Datenbank → API → Frontend" und Sie möchten Querschnittsschnitte stattdessen
- Sie müssen Arbeit nach Risiko oder Wert anstelle nach technischer Ebene bestellen
- Der Funktionsumfang ist unklar und benötigt eine Zersetzung in unabhängig auslieferte Inkremente

## Wann nicht verwenden

- Einfache Single-Endpoint-Aufgaben oder kleine Bugfixes, die auf eine Ebene beschränkt sind
- Aufgaben, die bereits eine einzelne vertikale Einheit sind (z.B. "ein neues Feld zu diesem Formular hinzufügen")
- Sehr kleine Aufgaben unter einer halben Tagesarbeit geschätzt — fusionieren Sie sie, teilen Sie sie nicht auf
- Wenn sich das Team bereits auf einen spezifischen gestaffelten Liefervertrag festgelegt hat und die Arbeit nicht neu ordnen kann

## Anweisungen

**Das Problem mit sequentiellen Phasen:**

KI-Modelle standardisieren auf: Phase 1 = Datenbankschema, Phase 2 = API-Endpunkte, Phase 3 = Frontend. Dies verzögert End-to-End-Integrationsfeedback bis zur letzten Phase, wo architektonische Probleme zu spät zur kostengünstigen Behebung auftauchen. Sie sehen keinen funktionierenden Pfad durch das System, bis Phase 3 erledigt ist.

**Vertikal-Schnitt-Ansatz:**

Jeder Schnitt ist ein dünner Schnitt über alle Ebenen hinweg — Datenbank + API + Frontend + Akzeptanzkriterien — die eine funktionsfähige, testbare End-to-End-Funktionalität liefert. Jeder Schnitt wird unabhängig ausgeliefert. Ein Schnitt ist erledigt, wenn ein Benutzer damit interagieren kann, nicht wenn eine Ebene erledigt ist.

---

**Schritt 1 — Identifizieren Sie die Hauptbenutzeraktionen (nicht technische Komponenten)**

Fragen Sie: "Was kann der Benutzer tatsächlich *tun*?" — nicht "Welche Tabellen brauchen wir?"

Schlechte Zerlegung: `Benutzertabelle → /users-Endpunkt → UserList-Komponente`
Gute Zerlegung: `Benutzer kann nach Name suchen → Benutzer kann nach Status filtern → Benutzer kann Ergebnisse exportieren`

Listen Sie jede unterschiedliche Benutzeraktion auf. Diese werden Ihre Schneidekandidate.

---

**Schritt 2 — Ordnen Sie Schnitte nach Wert und Risiko**

Klassifizieren Sie Schnitte:
- Höchster Geschäftswert zuerst — was entsperrt die meiste nachgelagerte Arbeit oder Benutzertest?
- Höchstes Integrationsrisiko zuerst — was hat die meisten Unbekannten über Ebenen hinweg?
- Tracer-Kugel zuerst in der Ausführung — der dünnste mögliche Pfad, der die Architektur vor dem Inhaltsaufbau validiert

---

**Schritt 3 — Definieren Sie jeden Schnitt**

Verwenden Sie diese Vorlage für jeden Schnitt:

```
Slice: [Name]
User action: [Was der Benutzer tut — geschrieben als Benutzeraktion, nicht technische Aufgabe]
Layers:
  Database: [Schemaänderung, Migration oder Abfrage beteiligt]
  API:      [Endpunkt(e) — Methode, Pfad, Request/Response-Form]
  Frontend: [betroffene Komponente(n)]
  Integration: [externe Serviceanrufe, Warteschlangen oder Event-Emissionen]
Acceptance criteria:
  - [Spezifische, testbare Bedingung — beobachtbares Verhalten, kein Implementierungsdetail]
  - [Zusätzliche Bedingung]
Definition of done: [Wie Sie überprüfen, dass dieser Schnitt vollständig abgeschlossen und zum Zusammenführen bereit ist]
Estimate: [Tage]
```

---

**Schritt 4 — Größe jeden Schnitt**

Ziel 1–3 Tage Arbeit pro Schnitt. Wenn ein Schnitt länger dauert, teilen Sie ihn auf. Signalisiert ein Schnitt ist zu groß:
- Mehr als zwei API-Endpunkte in einem Schnitt erstellt
- Schemamigration und Geschäftslogik im selben Schnitt
- Frontend und ein neuer Hintergrund-Job im selben Schnitt

Schnitte kürzer als eine halbe Stunde sind zu granular — fusionieren Sie sie mit einem angrenzenden Schnitt.

---

**Schritt 5 — Beginnen Sie mit einer Tracer-Kugel**

Der erste Schnitt zum Ausführen ist der dünnstmögliche Pfad über alle Ebenen hinweg — selbst wenn er leere Ergebnisse oder Stub-Daten zurückgibt. Dies validiert:
- Die Datenbank kann von der API abgefragt werden
- Die API-Antwort erreicht das Frontend
- Das Frontend kann die Form einer echten Antwort rendern

Wenn die Tracer-Kugel bricht, haben Sie Ihr schwerstes Problem am Tag eins gefunden — wenn es am billigsten zu beheben ist.

Inhalte (echte Abfragen, echte Benutzeroberfläche, echte Validierung) in nachfolgenden Schnitten auf bewährter Grundlage aufbauen.

---

**Ausgabeformat:**

```
VERTICAL SLICE PLAN — [Feature Name]

User actions identified: [Liste]
Slice order rationale: [ein Satz darüber, warum diese Reihenfolge]

Slice 1 (Tracer): [Name] — [Einzeilenbeschreibung]
Slice 2: [Name] — [Einzeilenbeschreibung]
...

[Vollständige Schnittdefinition für jeden Schnitt unter Verwendung der obigen Vorlage]
```

## Beispiel

**Eingabe:** "Planen Sie die Suchfunktion für unseren Produktkatalog. Zerlegen Sie sie in vertikal Schnitte, die nach Risiko geordnet sind."

**Erwartete Ausgabe:**

```
VERTICAL SLICE PLAN — Product Catalog Search

User actions identified: nach Stichwort suchen, nach Kategorie/Preis filtern, Ergebnisse sortieren, Ergebnisse paginieren
Slice order rationale: Tracer-Kugel zuerst zur Validierung der Suchinfrastruktur, Kernsuche nächstes, Filter letztes (höchste Implementierungskomplexität)

Slice 1 (Tracer): Basis-Suchendpunkt gibt leere Ergebnisse zurück
Slice 2: Stichwortsuche gibt übereinstimmende Produkte zurück
Slice 3: Nach Kategorie und Preisbereich filtern
Slice 4: Paginierung

---

Slice 1 (Tracer): Basis-Suchendpunkt gibt leere Ergebnisse zurück
User action: Benutzer reicht Suchabfrage ein und erhält Antwort (leer ist akzeptabel)
Layers:
  Database: Produkttabelle mit Spalten Name, Beschreibung, Preis, Kategorie hinzufügen; 10 Datensätze seeden
  API:      GET /search?q= → gibt { results: [], total: 0 } zurück
  Frontend: Suchfeld + Ergebnisliste rendert eine leere Zustandsmeldung
  Integration: keine
Acceptance criteria:
  - Das Absenden einer Abfrage gibt HTTP 200 mit der korrekten Antwortform zurück
  - Das Frontend rendert ohne Fehler, wenn das Ergebnis-Array leer ist
Definition of done: End-zu-End-Anfrage von Suchfeld zu Datenbank und zurück wird ohne Fehler abgeschlossen
Estimate: 0.5 Tage

Slice 2: Stichwortsuche gibt übereinstimmende Produkte zurück
User action: Benutzer sucht nach Stichwort und sieht übereinstimmende Produkte
Layers:
  Database: Volltext-Index auf Name- und Beschreibungsspalten
  API:      GET /search?q= → gibt { results: [{ id, name, price, category }], total: N } zurück
  Frontend: Ergebnisliste rendert Produktkarten mit Name und Preis
  Integration: keine
Acceptance criteria:
  - Suche nach "Laptop" gibt Produkte mit "Laptop" in Name oder Beschreibung zurück
  - Ergebnisse werden nach Relevanz geordnet (Name-Match über Beschreibungs-Match gerankt)
  - Leere Abfrage gibt alle Produkte bis zur Seitengröße zurück
Definition of done: Suche gibt genaue Ergebnisse für 10 Test-Abfragen zurück; Ergebnis-Karten rendern korrekt
Estimate: 2 Tage

Slice 3: Nach Kategorie und Preisbereich filtern
User action: Benutzer grenzt Ergebnisse mithilfe der Kategorie-Dropdown und Preisbereich-Eingaben ein
Layers:
  Database: Abfrage aktualisiert, um Kategorie- und Preis_Min/Preis_Max-Parameter zu akzeptieren
  API:      GET /search?q=&category=&price_min=&price_max=
  Frontend: Filter-Panel mit Kategorie-Dropdown und Preisbereich-Eingaben; Ergebnisse aktualisieren bei Anwendung
  Integration: keine
Acceptance criteria:
  - Das Anwenden eines Kategoriefilters gibt nur Produkte in dieser Kategorie zurück
  - Preisbereichsfilter gibt nur Produkte innerhalb des Bereichs zurück
  - Filter kombinieren sich korrekt mit Stichwortsuche
Definition of done: Alle Filter-Kombinationen getestet; Filter-Status bleibt bei Seiten-Aktualisierung erhalten
Estimate: 1.5 Tage

Slice 4: Paginierung
User action: Benutzer navigiert durch mehrere Seiten von Ergebnissen
Layers:
  Database: LIMIT/OFFSET auf Abfrage angewendet
  API:      GET /search?q=&page=&page_size= → fügt { page, total_pages } zur Antwort hinzu
  Frontend: Paginierungs-Steuerelemente rendern; Seitenstatus aktualisiert URL
  Integration: keine
Acceptance criteria:
  - Seite 2 gibt den korrekten Offset von Ergebnissen zurück
  - Gesamtseiten reflektieren die tatsächliche Ergebnisanzahl
  - Navigation zu einer paginierten URL direkt gibt die korrekte Seite zurück
Definition of done: Paginierung funktioniert über alle Filter- und Suchkombinationen
Estimate: 1 Tag
```

---

---
description: Generiere ein ER-Diagramm in Mermaid oder PlantUML aus dem Datenbankschema des Projekts
argument-hint: "[Schema-Datei, Tabellennamen oder Verzeichnis]"
---
Erstelle ein Entity-Relationship-Diagramm für: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lies die Datei. Wenn es ein Tabellenname oder kommagetrennte Liste ist, lokalisiere ihre Definitionen in Migrationen, ORM-Modellen oder Schema-Dateien. Wenn es ein Verzeichnis ist, scanne alle Schema-Definitionen darin.

Schritte:

1. Extrahiere Schema-Informationen:
   - Tabellennamen und ihre Spalten (Name, Typ, Nullbarkeit, Standard).
   - Primärschlüssel (einfach und zusammengesetzt).
   - Fremdschlüssel und die Beziehungen, die sie darstellen (eins-zu-eins, eins-zu-viele, viele-zu-viele über Verbindungstabellen).
   - Eindeutige Constraints, die Kardinalität implizieren.

2. Erkenne Diagrammformat-Präferenz:
   - Wenn das Projekt bereits `.mmd`, `mermaid` oder PlantUML-Dateien enthält, stimme das Format ab.
   - Standardmäßig Mermaid `erDiagram` Syntax (wird in GitHub, Notion und den meisten Dokumentations-Tools gerendert).
   - Wenn der Benutzer PlantUML angegeben hat, verwende `@startuml` / `@enduml` mit Entity-Blöcken.

3. Erstelle das Diagramm:
   - Füge alle Spalten mit ihren Typen in den Entity-Blöcken ein.
   - Zeige Beziehungslinien mit korrekter Mermaid-Kardinalitätsnotation:
     - `||--o{` eins-zu-viele
     - `||--||` eins-zu-eins
     - `}o--o{` viele-zu-viele
   - Beschrifte jede Beziehungslinie mit dem Fremdschlüsselnamen oder einer kurzen semantischen Beschriftung.
   - Gruppiere Verbindungs-/Assoziationstabellen, wenn möglich visuell unterschiedlich über Kommentare.

4. Wenn das Schema groß ist (>15 Tabellen), erstelle zwei Diagramme:
   - Ein High-Level-Überblick, der nur Tabellen und Beziehungen zeigt (keine Spaltendetails).
   - Ein detailliertes Diagramm für die Teilmenge von Tabellen in $ARGUMENTS oder die Core-Domain-Tabellen.

5. Nach dem Diagramm gib aus:
   - Eine kurze Legende, die nicht offensichtliche Abkürzungen in Spaltentypen erklärt.
   - Eine Liste aller implizierten Beziehungen, die im Code gefunden wurden, aber nicht als FK-Constraints deklariert sind.
   - Alle Verbindungstabellen, die Domain-Konzepte darstellen und eine Umbenennung zur Verdeutlichung verdienen.

Gib das Diagramm in einem eingezäunten Code-Block mit dem korrekten Sprach-Tag (`mermaid` oder `plantuml`) aus.

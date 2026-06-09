---
description: Generieren Sie ein ER-Diagramm in Mermaid oder PlantUML aus dem Datenbankschema des Projekts
argument-hint: "[schema file, table names, or directory]"
---
Generieren Sie ein Entity-Relationship-Diagramm für: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lesen Sie ihn. Wenn es ein Tabellenname oder eine durch Kommas getrennte Liste ist, suchen Sie deren Definitionen in Migrationen, ORM-Modellen oder Schema-Dateien. Wenn es ein Verzeichnis ist, scannen Sie nach allen Schema-Definitionen darin.

Schritte:

1. Schema-Informationen extrahieren:
   - Tabellennamen und deren Spalten (Name, Typ, Nullbarkeit, Standard).
   - Primärschlüssel (einfach und zusammengesetzt).
   - Fremdschlüssel und die Beziehungen, die sie darstellen (eins-zu-eins, eins-zu-viele, viele-zu-viele über Verknüpfungstabellen).
   - Eindeutige Einschränkungen, die Kardinalität implizieren.

2. Diagrammformat-Präferenz erkennen:
   - Wenn das Projekt bereits `.mmd`-, `mermaid`- oder PlantUML-Dateien enthält, passen Sie sich diesem Format an.
   - Standard ist die Mermaid-`erDiagram`-Syntax (wird in GitHub, Notion und den meisten Dokumentationstools gerendert).
   - Wenn der Benutzer PlantUML angegeben hat, verwenden Sie `@startuml` / `@enduml` mit Entitätsblöcken.

3. Erzeugen Sie das Diagramm:
   - Schließen Sie alle Spalten mit ihren Typen in den Entitätsblöcken ein.
   - Zeigen Sie Beziehungslinien mit korrekter Mermaid-Kardinalitätsnotation:
     - `||--o{` eins-zu-viele
     - `||--||` eins-zu-eins
     - `}o--o{` viele-zu-viele
   - Beschriften Sie jede Beziehungslinie mit dem Fremdschlüsselnamen oder einer kurzen semantischen Bezeichnung.
   - Gruppieren Sie Verknüpfungs-/Zuordnungstabellen visuell unterscheidbar, wenn möglich, über Kommentare.

4. Wenn das Schema groß ist (>15 Tabellen), erzeugen Sie zwei Diagramme:
   - Ein allgemeines Übersichtsdiagramm, das nur Tabellen und Beziehungen zeigt (keine Spaltendetails).
   - Ein detailliertes Diagramm für die Teilmenge der Tabellen in $ARGUMENTS oder die Kern-Domain-Tabellen.

5. Nach dem Diagramm geben Sie Folgendes aus:
   - Eine kurze Legende, die nicht offensichtliche Abkürzungen in Spaltentypen erklärt.
   - Eine Liste aller impliziten Beziehungen, die im Code gefunden wurden, aber nicht als FK-Einschränkungen deklariert sind.
   - Alle Verknüpfungstabellen, die Domain-Konzepte darstellen, die einer Umbenennung zur Klarheit bedürfen.

Geben Sie das Diagramm in einem eingezäunten Code-Block mit dem korrekten Sprach-Tag (`mermaid` oder `plantuml`) aus.

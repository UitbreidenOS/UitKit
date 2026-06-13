---
description: Cursor-basierte oder Offset-Pagination zu einem List-Endpoint mit konsistenter Response-Struktur hinzufügen
argument-hint: "[endpoint-or-model]"
---
Pagination zum Endpoint oder der Ressource hinzufügen: $ARGUMENTS

Falls $ARGUMENTS leer ist, alle List-Endpoints (die Arrays zurückgeben) finden und Pagination auf jeden anwenden.

Pagination-Strategie basierend auf dem Use-Case wählen:
- Cursor-basiert (Standard für die meisten Feeds und große Datensätze): stabil unter gleichzeitigen Schreibvorgängen, unterstützt unendliches Scrollen, kann nicht zu beliebiger Seite springen
- Offset/Page-basiert (nur wenn die UI "gehe zu Seite N" erfordert): einfacher, aber inkonsistent unter Schreibvorgängen

Cursor-basierte Implementierung:
- Cursor kodiert den Wert der Sortierspalte + Primary Key der letzten sichtbaren Zeile — base64-kodieren, niemals rohe DB-Werte verfügbar machen
- Standard-Sortierung: absteigend nach `created_at`, sekundäre Sortierung nach `id` zum Tiebreaker
- Query-Parameter akzeptieren: `cursor` (undurchsichtiger String) und `limit` (Integer, 1–100, Standard 20)
- `limit` validieren — < 1 oder > 100 mit 400 ablehnen
- Response-Struktur:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<opaque>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` ist null, wenn es keine weiteren Seiten gibt
- Gesamtanzahl niemals offenlegen, außer wenn explizit erforderlich — es ist kostspielig in großem Maßstab

Offset-basierte Implementierung (nur wenn angefordert):
- Query-Parameter akzeptieren: `page` (1-indiziert) und `per_page` (1–100, Standard 20)
- `total`, `page`, `per_page`, `total_pages` in die Response-Envelope einschließen

Beide Strategien:
- Einen Datenbankindex auf der Sortierspalte hinzufügen, falls noch nicht vorhanden
- Die Abfrage muss ein einzelner DB-Aufruf sein — kein N+1 durch separates Abrufen von Count, außer Offset-Pagination erfordert es
- OpenAPI-Spezifikation für den Endpoint aktualisieren, falls vorhanden

Tests schreiben: erste Seite, zweite Seite über Cursor, leeres Ergebnis, Limit-Grenzwert-Validierung.

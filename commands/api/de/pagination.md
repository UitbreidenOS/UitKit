---
description: Cursor-basierte oder Offset-basierte Paginierung zu einem List-Endpoint mit konsistenter Response-Form hinzufügen
argument-hint: "[endpoint-or-model]"
---
Paginierung zum Endpoint oder zur Ressource hinzufügen: $ARGUMENTS

Wenn $ARGUMENTS leer ist, alle List-Endpoints (die Arrays zurückgeben) suchen und Paginierung auf jeden anwenden.

Paginierungsstrategie basierend auf dem Use Case wählen:
- Cursor-basiert (Standard für die meisten Feeds und große Datenmengen): stabil unter gleichzeitigen Schreibvorgängen, unterstützt unendliches Scrollen, kann nicht zu einer beliebigen Seite springen
- Offset/Page-basiert (nur wenn die UI "zu Seite N gehen" erfordert): einfacher, aber inkonsistent unter Schreibvorgängen

Cursor-basierte Implementierung:
- Cursor kodiert den Sortierspaltenwert + Primärschlüssel der zuletzt gesehenen Zeile — base64-kodieren, niemals rohe DB-Werte verfügbar machen
- Standard-Sortierung: absteigend nach `created_at`, Sekundärsortierung nach `id` für Tie-Breaking
- `cursor` (undurchsichtige Zeichenkette) und `limit` (Ganzzahl, 1–100, Standard 20) als Query-Parameter akzeptieren
- `limit` validieren — < 1 oder > 100 mit 400 zurückweisen
- Response-Form:
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
- Gesamtzahl niemals durchsickern lassen, es sei denn, sie ist explizit erforderlich — sie ist teuer in der Skalierung

Offset-basierte Implementierung (nur wenn angefordert):
- `page` (1-indiziert) und `per_page` (1–100, Standard 20) akzeptieren
- `total`, `page`, `per_page`, `total_pages` in die Response-Umhüllung einbinden

Beide Strategien:
- Datenbankindex auf der Sortierspalte hinzufügen, falls noch nicht vorhanden
- Die Abfrage muss ein einzelner DB-Aufruf sein — kein N+1 durch separates Abrufen der Anzahl, es sei denn, Offset-Paginierung erfordert es
- OpenAPI-Spec für den Endpoint aktualisieren, falls vorhanden

Tests schreiben: erste Seite, zweite Seite über Cursor, leeres Ergebnis, Limit-Grenzwertvalidierung.

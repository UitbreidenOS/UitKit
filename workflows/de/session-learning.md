# Session-Lern-Erfassung

End-of-Session-Workflow, der Lektionen, Entscheidungen und Entdeckungen aus einer Claude Code-Sitzung extrahiert und erhält sie, bevor das Kontextfenster schließt. Verhindert Wissensverdampfung zwischen Sitzungen.

---

## Wann es verwenden

- Am Ende einer Sitzung, die länger als 30 Minuten dauert
- Nach Treffen einer Architektur-Entscheidung während einer Kodierungs-Sitzung
- Wenn Sie ein nicht-offensichtliches Problem gelöst haben und möchten, dass zukünftige Claude-Sitzungen von der Lösung profitieren
- Vor dem Schließen einer langen autonomen Sitzung, um zu erhalten, was gelernt wurde
- Jedes Mal, wenn Sie sich selbst denken, "Ich werde das erinnern" — Sie werden nicht, und Claude auch nicht

---

## Phasen

### Phase 1 — Sitzungs-Zusammenfassung

Starten Sie diese Phase, bevor der Kontext zu sehr komprimiert wird.

```
Wir beenden diese Sitzung. Bevor wir schließen:

Fassen Sie zusammen, was in dieser Sitzung passiert ist:
1. Was war das ursprüngliche Ziel?
2. Was wurde tatsächlich gebaut oder geändert?
3. Welche Ansätze wurden versucht und aufgegeben — und warum?
4. Welche nicht-offensichtlichen Dinge haben wir entdeckt? (Probleme, undokumentiertes Verhalten, Einschränkungen)
5. Was ist noch unvollständig und was ist der nächste konkrete Schritt?

Halten Sie es faktisch. Kein Remplissage.
```

Überprüfen Sie die Zusammenfassung auf Richtigkeit, bevor Sie fortfahren. Korrigieren Sie alles, das Claude falsch über das verstand, was entschieden wurde.

---

### Phase 2 — Regel-Extraktion

```
Basierend auf dieser Sitzungs-Zusammenfassung identifizieren Sie Anweisungen, die zu CLAUDE.md hinzugefügt werden sollten.

Eine Regel gehört zu CLAUDE.md wenn:
- Sie ist spezifisch für dieses Projekt (nicht allgemeine Programmier-Beratung)
- Claude würde eine andere Entscheidung treffen, ohne ihr mitgeteilt zu werden
- Sie kam von einer realen Entscheidung, die in dieser Sitzung getroffen wurde

Für jede Kandidaten-Regel:
  - Vorgeschlagener Text (ein oder zwei Zeilen, direktiver Ton)
  - Sektion von CLAUDE.md, wo sie gehört
  - Warum sie in einer zukünftigen Sitzung wichtig sein würde

Schlagen Sie keine Regeln vor, die bereits in CLAUDE.md vorhanden sind.
Schlagen Sie keine generischen Beratung vor ("schreiben Sie sauberen Code", "bearbeiten Sie Fehler").
```

Überprüfen Sie jede vorgeschlagene Regel. Akzeptieren, lehnen Sie ab oder bearbeiten Sie jede. Fügen Sie keine Regeln hinzu, mit denen Sie nicht einverstanden sind — Claude folgt ihnen buchstäblich in zukünftigen Sitzungen.

---

### Phase 3 — Architektur-Entscheidungs-Erfassung

```
Hat diese Sitzung Architektur-Entscheidungen impliziert?

Eine Entscheidung qualifiziert als ADR wenn:
- Sie war schwer zu revieren (oder kostspielig, später zu ändern)
- Das Reasoning würde für jemanden, der den Code liest, nicht offensichtlich sein
- Es gab eine reale Alternative, die wurde berücksichtigt und abgelehnt

Für jede qualifizierende Entscheidung:
  - Entscheidungs-Titel (eine Zeile)
  - Kontext (welches Problem hat diese Entscheidung erzwungen)
  - Entscheidung getroffen (ein Satz, aktive Stimme)
  - Alternativen, die wurden abgelehnt und warum
  - Konsequenzen (was macht das einfacher, was macht das schwerer)

Wenn keine ADR-würdigen Entscheidungen gemacht wurden, sagen Sie das explizit.
```

Wenn ADRs identifiziert sind, generieren Sie sie mit dem ADR-Format von `skills/productivity/adr-writer.md` und speichern Sie in `docs/decisions/`.

---

### Phase 4 — LESSONS.md-Update

```
Aktualisieren Sie LESSONS.md mit, was in dieser Sitzung gelernt wurde.

Wenn LESSONS.md nicht existiert, erstellen Sie es mit dieser Struktur:
# Leçons apprises
Ein lebender Datensatz von nicht-offensichtlichen Dingen, die während der Entwicklung entdeckt wurden.

## [Datum] — [Session-Thema in 5 Worten]
### Was wir gelernt haben
[2–5 Geschosse von konkreten, spezifischen Erkenntnissen]
### Was beim nächsten Mal zu tun ist
[1–3 umsetzbare Erkenntnisse]

Wenn LESSONS.md existiert, fügen Sie einen neu datierten Eintrag an — schreiben Sie nicht vorhandene Einträge neu.

Wichtig: Nur Dinge einschließen, die wurden wirklich nicht-offensichtlich.
Füllen Sie nicht mit Dingen, die nach Plan gelaufen sind.
```

---

### Phase 5 — Bestätigung vor Schreiben

Zeigen Sie dem Benutzer eine Zusammenfassung aller vorgeschlagenen Schreibt, bevor Sie eine Datei berühren:

```
Hier ist, was ich schreiben werde:

1. CLAUDE.md Ergänzungen: [listieren Sie akzeptierte Regeln]
2. Neue ADR-Dateien: [listieren Sie Dateipfade und einseitige Zusammenfassungen]
3. LESSONS.md Ergänzungen: [Vorschau des neuen Eintrags]

Bestätigen Sie zum Fortfahren, oder sagen Sie mir, was zu ändern ist.
```

Schreiben Sie nur Dateien nach expliziter Benutzer-Bestätigung. Aktualisieren Sie CLAUDE.md nie stillschweigend.

---

## Beispiel

Session: "Debuggiert, warum Prisma-Abfragen in Production timeoutet"

Phase 1 Zusammenfassung: Entdeckt, dass Prisma-Verbindungs-Pool-Defaults auf 5 Verbindungen, Production-Last erfordert 20, Reparatur war `DATABASE_CONNECTION_LIMIT=20` in env + `connection_limit=20` in der Datenbank-URL.

Phase 2 Regel-Extraktion:
- Vorgeschlagene CLAUDE.md-Regel: "Immer `DATABASE_CONNECTION_LIMIT` überprüfen, wenn Debugging langsame DB-Abfragen in Production — das Prisma-Standard-Pool von 5 ist zu klein für jede reale Last."
- Sektion: `## Datenbank`

Phase 3 ADR: Keine Architektur-Ebenen-Entscheidung, nur eine Konfigurations-Reparatur → Nein ADR.

Phase 4 LESSONS.md Eintrag:
```
## 2026-05-23 — Prisma-Verbindungs-Pool zu klein
### Was wir gelernt haben
- Prisma-Defaults auf 5 DB-Verbindungen, unabhängig von Plan oder Server-Größe
- Pool-Erschöpfung sieht aus wie langsame Abfragen, nicht Verbindungs-Fehler
- Reparatur ist `connection_limit=N` in DATABASE_URL, nicht Application-Code
### Was beim nächsten Mal zu tun ist
- Explizit `connection_limit` in DATABASE_URL auf jedem neuen Projekt setzen
- Überwachen Sie `pg_stat_activity` für leerlauf-Verbindungen, bevor Sie Abfrage-Performance-Probleme annehmen
```

---

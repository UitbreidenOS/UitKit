---
name: nda-review
description: "NDA-Triage und Überprüfung: Typ klassifizieren, Playbook-Abweichungen flaggen (GREEN/YELLOW/RED), Bereichsprobleme identifizieren, fehlende Ausnahmen, versteckte Verpflichtungen — anwaltliche Überprüfung notwendig"
---

> 🇩🇪 Deutsche Version. [Englische Version](../nda-review.md).

# NDA-Überprüfungsfähigkeit

## Wann aktivieren
- Überprüfung einer Geheimhaltungsvereinbarung vor der Unterzeichnung
- Triage einer Reihe von NDAs, um zu identifizieren, welche anwaltliche Aufmerksamkeit benötigen
- Verständnis der Bedeutung einer bestimmten NDA-Klausel in einfacher Sprache
- Überprüfung, ob ein NDA Standardausnahmen und -schutzmaßnahmen enthält
- Vergleich von NDA-Bedingungen mit den Standard-Playbook-Positionen Ihres Unternehmens

## Wann NICHT verwenden
- Unterzeichnung im Namen Ihrer Organisation — das erfordert einen autorisierten Unterzeichner
- Interpretation von NDA-Bedingungen in einem aktiven Streit — konsultieren Sie Ihren Anwalt
- Multilaterale NDAs mit komplexen grenzüberschreitenden Verpflichtungen — benötigt einen Fachmann

## Wichtiger Hinweis

Claude kann Probleme identifizieren und Klauseln erklären. Es kann keine Rechtsberatung geben, jurisdiktionsspezifisches Recht interpretieren oder garantieren, dass alle Probleme erkannt wurden. **Lassen Sie einen Anwalt jeden NDA vor der Unterzeichnung überprüfen, wenn die Beziehung bedeutsam ist.**

## Anweisungen

### Zuerst — den NDA klassifizieren

```
Überprüfen Sie diesen NDA und sagen Sie mir:
1. Ist er gegenseitig (beide Parteien geschützt) oder einseitig (nur eine Partei)?
2. Wer ist die offenlegende Partei und wer ist die empfangende Partei?
3. Was ist die Laufzeit (Dauer)?
4. Welche Rechtsordnung gilt?

NDA-Text: [einfügen]
```

### Vollständige Playbook-Überprüfung

```
Überprüfen Sie diesen NDA gegen unsere Standardpositionen:

Unsere Standardpositionen:
- Bevorzugung gegenseitiger NDAs; einseitig akzeptabel, wenn wir die empfangende Partei sind
- Maximale NDA-Laufzeit: 3 Jahre
- Definition vertraulicher Informationen: müssen innerhalb von 30 Tagen gekennzeichnet oder schriftlich bestätigt werden
- Erforderliche Standardausnahmen: öffentliche Domäne, Vorkenntnis, unabhängige Entwicklung, erzwungene Offenlegung
- Anwendbares Recht: [Ihre bevorzugte Rechtsordnung]
- Kein verstecktes Abwerbeverbot oder Wettbewerbsverbot im NDA

NDA-Text: [einfügen]

Kennzeichnen Sie jedes Problem als GRÜN (akzeptabel), GELB (verhandeln) oder ROT (blockierend).
```

### Überprüfung auf Standardausnahmen

Jeder NDA sollte diese 4 Ausnahmen enthalten. Claude überprüft sie:

```
Überprüfen Sie, ob dieser NDA alle 4 Standardausnahmen enthält:
1. Informationen, die bereits in der öffentlichen Domäne sind (nicht durch Verletzung)
2. Informationen, die die empfangende Partei bereits vor der Offenlegung kannte
3. Informationen, die unabhängig von der empfangenden Partei entwickelt wurden
4. Informationen, die gesetzlich oder durch Gerichtsbeschluss offengelegt werden müssen (erzwungene Offenlegung)

NDA-Text: [einfügen]

Falls eine fehlt, als GELB kennzeichnen und die fehlende Formulierung entwerfen.
```

### Scan auf versteckte Verpflichtungen

```
Scannen Sie diesen NDA auf Verpflichtungen, die über Standardvertraulichkeit hinausgehen:
- Abwerbeverbote (Einstellungsbeschränkungen)
- Wettbewerbsverbotsbestimmungen
- IP-Abtretungsformulierungen
- Exklusivitätsverpflichtungen
- Standstill-Bestimmungen (Einschränkungen für M&A-Aktivitäten)

NDA-Text: [einfügen]

Kennzeichnen Sie alles, was über Standardvertraulichkeit hinausgeht, als ROT — diese gehören nicht in einen NDA.
```

### Erklärung in verständlicher Sprache

```
Erklären Sie diese NDA-Klausel in verständlicher Sprache:
"[Klausel einfügen]"

Sagen Sie mir: Was bedeutet das praktisch für mein Unternehmen? Was ist die praktische Auswirkung?
```

### Redline-Vorschläge

```
Dieser NDA hat folgende Probleme, bei denen ich zurückverhandeln möchte:
[Probleme aus der obigen Überprüfung auflisten]

Entwerfen Sie Redline-Formulierungen für jedes Problem — was ich stattdessen haben möchte.
Format: Originaltext → Vorgeschlagene Überarbeitung → Begründung
```

## Beispiel

**Ein einseitiger NDA, bei dem Sie die empfangende Partei sind:**

```
ROT — Übermäßig breite Definition vertraulicher Informationen
Abschnitt 1: "Alle Informationen, die von der offenlegenden Partei in jeglicher Form offenbart werden"
Problem: Keine Markierungsanforderung und keine Ausnahme für mündliche Mitteilungen. 
         Sie könnten unabsichtlich durch alles gebunden sein, was in irgendeinem Meeting gesagt wurde.
Behebung: Hinzufügen "...unter der Voraussetzung, dass mündliche Mitteilungen innerhalb von 
     30 Tagen nach der Offenlegung schriftlich als vertraulich bestätigt werden."

GELB — Laufzeit von 5 Jahren überschreitet Standard
Abschnitt 8: "Diese Vereinbarung bleibt fünf (5) Jahre in Kraft"
Problem: 5 Jahre ist länger als der 3-Jahres-Standard. Handhabbar, aber es lohnt sich zurückzuverhandeln.
Behebung: Schlagen Sie 2-3 Jahre für die meisten kommerziellen NDAs vor.

ROT — Ausnahme für "unabhängige Entwicklung" fehlt
Abschnitt 2 enthält nur 3 der 4 Standardausnahmen — unabhängige Entwicklung fehlt.
Behebung: Hinzufügen: "(d) Informationen, die unabhängig von der empfangenden Partei entwickelt wurden,
     ohne Verwendung oder Bezugnahme auf die vertraulichen Informationen der offenlegenden Partei."

GRÜN — Anwendbares Recht (Kalifornien): akzeptabel, wenn Sie dort tätig sind.
GRÜN — Gegenseitige Ausnahmen für erzwungene Offenlegung: vorhanden und standardgemäß.

EMPFEHLUNG: Nicht so unterzeichnen. ROTE Punkte müssen vor der Ausführung behoben werden.
Anwaltliche Überprüfung: Empfohlen, wenn dieser NDA eine bedeutsame Geschäftsbeziehung begleitet.
```

---

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

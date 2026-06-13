# Entscheidungsfluss für Kontextverwaltung

Ein strukturierter Entscheidungsprozess zur Auswahl der richtigen Aktion an jeder Turngrenzeanzahl zur Wahrung der Kontextqualität und Sitzungskosten. Die falsche Wahl verschlechtert die Ausgabequalität; die richtige Wahl hält die Sitzung effizient.

---

## Wann es verwenden

Wenden Sie dieses Framework an, wenn Sie eines der folgenden Signale bemerken:
- Antworten werden langsamer oder wiederholend
- Claude verliert die Spur früherer Entscheidungen
- Token-Anzahl nähert sich einem Schwellwert, bei dem Verdichtung oder eine neue Sitzung rentabel wird
- Eine größere Aufgabe abschließen und etwas Unabhängiges beginnen

---

## Die 5 Optionen

### 1. Fortfahren

**Standardaktion.** Keine spezielle Aktion durchführen — einfach die nächste Nachricht senden.

**Verwenden Sie, wenn:**
- Claude auf dem richtigen Weg ist und Fortschritte macht
- Der Kontext aktuell ist (ungefähre Richtlinie: unter 200k Token)
- Keine fehlgeschlagenen Implementierungsversuche haben sich im Kontext angesammelt
- Die nächste Aufgabe ist direkt mit der aktuellen Arbeit verbunden

**Kostenimplikation:** Jede Umdrehung verbraucht Token proportional zum vollständigen Kontextfenster. Fortfahren ist kostengünstig pro Umdrehung, wenn der Kontext klein ist; teuer wenn er groß ist.

---

### 2. Zurückspulen (`Esc+Esc` oder `/rewind`)

Machen Sie die letzte oder mehrere Umdrehungen rückgängig. Löscht die Assistentenantwort, behält aber den vorherigen Kontextzustand — Dateileser, früheres Reasoning und Kontext vor der schlechten Umdrehung bleiben.

**Verwenden Sie, wenn:**
- Claude ist in der letzten Umdrehung einen falschen Weg gegangen
- Sie möchten die nützliche Codebase-Exploration aus früher in der Sitzung behalten, aber einen fehlgeschlagenen Implementierungsversuch ablehnen
- Der Fehler ist neu und oberflächlich — das Zurückspulen einer oder zwei Umdrehungen reicht zum Wiederherstellen

**Was es nicht ist:** eine Methode zum Rückgängigmachen von Dateisystemänderungen. Das Zurückspulen entfernt Assistenten-Umdrehungen aus dem Kontext, macht aber nicht die Schreibvorgänge rückgängig, die Claude auf die Festplatte gemacht hat. Revertieren Sie diese separat bei Bedarf.

**Am besten geeignet für:** Wiederherstellung von einem falschen Ansatz ohne Verlust des nützlichen Explorationskontexts, der voranging.

---

### 3. Gerichtete Verdichtung (`/compact <hint>`)

Komprimieren Sie den aktuellen Kontext in eine Zusammenfassung und fahren Sie fort. Der `<hint>` teilt dem Verdichtungsschritt mit, was wichtig ist — ohne ihn kann die Verdichtung kritischen Kontext verlieren.

**Verwenden Sie, wenn:**
- Der Kontext wird lange (ungefähre Richtlinie: 300k+ Token auf einem 1M-Token-Modell), aber Sie befinden sich mitten in einer Aufgabe und möchten in derselben Sitzung fortfahren
- Sie haben viel zwischenliegendes Reasoning, Dateisleser und Debug-Ausgabe angesammelt, die nicht mehr benötigt wird
- Der Hauptaufgabenzustand ist noch aktiv und Sie möchten keine neue Sitzung informieren

**Hint-Beispiele:**
```
/compact keep auth refactor context, drop the test debugging
/compact preserve the data model decisions and API contract, drop the installation steps
/compact focus on the migration plan, nothing else matters now
```

**Ohne Hint:** Verdichtung verwendet Heuristiken, die möglicherweise noch relevante Entscheidungen ablehnen. Immer einen Hint für komplexe Sitzungen übergeben.

**Empirischer Schwellwert:** Die Kontextqualität auf dem 1M-Modell beginnt sich merklich um 300–400k Token für Aufgaben zu verschlechtern, die genaue Erinnerung an frühere Entscheidungen erfordern. Darunter weitermachen, wenn Kosten kein Problem sind.

---

### 4. Neue Sitzung

Starten Sie einen neuen `claude`-Aufruf. Kein Kontext übertragen.

**Verwenden Sie, wenn:**
- Die aktuelle Aufgabe ist abgeschlossen und Sie beginnen etwas Unabhängiges
- Die Sitzung hat zu viele Sackgassen und fehlgeschlagene Versuche angesammelt — das Rauschen überwiegt den nützlichen Kontext
- Sie möchten eine saubere Tafel mit nur CLAUDE.md und ausdrücklich referenzierten Dateien als Kontext
- Der Kontext ist sehr groß und Sie können den notwendigen Zustand schneller rekonstruieren, indem Sie eine neue Sitzung informieren, als durch Verdichtung

**Nicht verwenden:** um die Arbeit mitten in einer Aufgabe fortzusetzen, es sei denn, die aktuelle Sitzung ist unheilbar beschädigt. Die Kosten zur Wiederherstellung des Kontextes sind für komplexe Aufgaben nicht trivial.

---

### 5. Subagent

Generieren Sie einen Agent-Tool-Aufruf für eine begrenzte Unteraufgabe. Der Subagent wird mit seinem eigenen Kontextfenster ausgeführt; zwischenstehendes Reasoning scheint nicht in der übergeordneten Sitzung auf.

**Verwenden Sie, wenn:**
- Sie benötigen das Ergebnis einer bestimmten Operation (z. B. "diese 10 Dateien lesen und eine Zusammenfassung zurückgeben"), benötigen aber die zwischenliegenden Schritte nicht in Ihrem Hauptkontext
- Die Aufgabe hat ein klares begrenztes Input und eine gut definierte Ausgabe
- Sie möchten den Kontext Ihrer Hauptsitzung sauber und konzentriert halten

**Was es nicht ist:** ein Ersatz für eine vollständige Sitzung, wenn die Unteraufgabe laufende Hin- und Herbewegung erfordert.

---

## Entscheidungstabelle

| Signal | Empfohlene Aktion |
|---|---|
| Letzte Umdrehung ist fehlgeschlagen, Rest der Sitzung ist gut | Zurückspulen |
| Kontext > 300k Token, mitten in einer Aufgabe | `/compact <hint>` |
| Kontext > 300k Token, Aufgabe abgeschlossen | Neue Sitzung |
| Starten Sie eine unabhängige Aufgabe | Neue Sitzung |
| Benötigen Sie isoliertes Unteraufgabenergebnis | Subagent |
| Keiner der obigen Fälle | Fortfahren |

---

## Kostenimplikationen

- **Fortfahren** — am günstigsten pro Umdrehung, wenn der Kontext klein ist; am teuersten, wenn der Kontext groß ist (jede Umdrehung sendet das vollständige Fenster erneut)
- **Verdichten** — eine teure Verdichtungsumdrehung, dann billigere Umdrehungen auf dem komprimierten Kontext; rentabel, wenn Sie 5+ Umdrehungen verbleibend haben
- **Zurückspulen** — kostenlos; entfernt einfach Kontext aus dem Speicher
- **Neue Sitzung** — Null-Transferkosten; Sie zahlen nur für das, das Sie explizit laden
- **Subagent** — isolierte Kosten; übergeordnete Sitzung wird nicht für den Kontext des Subagent berechnet

---

## Wann NICHT verdichten

- Debuggen mitten in der Sitzung, wo die Fehler-Spur und frühere Hypothese beide noch relevant sind — Verdichtung kann diese in Mehrdeutigkeit zusammenfassen
- Wenn Sie die Aufgabe ohnehin in Kürze abschließen (1–2 Umdrehungen verbleibend) — nicht wert der Verdichtungskosten
- Wenn der Hint so detailliert sein müsste, dass das Schreiben länger dauert als das Informieren einer neuen Sitzung

---

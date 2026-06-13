# RIPER-Workflow

Fünf-Phasen-strukturiertes agentisches Codierungs-Framework. Jede Phase hat einen strikten Modus, definierte Eingaben und konkrete Artefakt-Ausgabe. Bewegung zur nächsten Phase erfordert Abschluss der aktuellen.

---

## Wann es verwenden

- Komplexe Funktionen, bei denen Umfangsveränderung ein vorhersehbares Risiko ist
- Unbekannte Codebases, wo Sprung zur Implementierung zu früh teure Umarbeit verursacht
- Aufgaben, wo Richtigkeit wichtiger ist als Geschwindigkeit des ersten Versuchs
- Jede Situation, wo Mitarbeiter (Mensch oder Agent) überprüfen muss, bevor Arbeit fortgesetzt wird

---

## Phasen

### 1. Forschung

**Modus-Erklärung:** "Ich bin im RESEARCH-Modus."

**Was geschieht:** Sammeln Sie nur Informationen. Lesen Sie relevante Dateien, überprüfen Sie Dokumentation, identifizieren Sie Unbekannte. Stellen Sie Klärungsfragen bei Bedarf. Schlagen Sie keine Lösungen vor. Schreiben Sie keinen Code.

**Verboten in dieser Phase:** Ansätze vorschlagen, Implementierungs-Code schreiben, Dateien bearbeiten.

**Ausgabe:** Eine Kontext-Zusammenfassung — was wurde gefunden, was ist unbekannt und die konkrete Frage, die die nächste Phase beantworten muss.

```
Kontext-Zusammenfassung:
- Relevante Dateien: [Liste]
- Aktuelles Verhalten: [Beschreibung]
- Unbekannt: [spezifische Lücken]
- Frage für Innovate-Phase: [präzise Frage]
```

---

### 2. Innovate

**Modus-Erklärung:** "Ich bin im INNOVATE-Modus."

**Was geschieht:** Brainstorm mögliche Ansätze basierend auf Forschungs-Ausgabe. Liste jeden Ansatz mit seinen Kompromissen auf. Keine Implementierung. Kein Code. Keine Bearbeitung von Projekt-Dateien.

**Verboten in dieser Phase:** Implementierungs-Code schreiben, Ansatz wählen, Projekt-Dateien bearbeiten.

**Ausgabe:** Eine nummerierte Liste von Ansätzen, jeweils mit Pros, Cons und Kontext-Anpassungs-Bewertung.

```
Optionen:
1. [Ansatz] — Pros: [...] Cons: [...] Anpassung: [hoch/mittel/niedrig]
2. ...
```

---

### 3. Plan

**Modus-Erklärung:** "Ich bin im PLAN-Modus."

**Was geschieht:** Wählen Sie einen Ansatz aus Innovate-Ausgabe und erzeugen Sie einen Schritt-für-Schritt-Implementierungs-Plan. Jeder Schritt muss atomar sein: eine Dateiänderung, eine Funktion, eine Datenbank-Migration — nicht "implementieren Sie die Funktion". Nummerieren Sie jeden Schritt. Identifizieren Sie alle Voraussetzungs-Schritte.

**Tor:** Der Plan muss genehmigt werden (vom Benutzer oder einem überprüfenden Agent), bevor Phase 4 beginnt.

**Ausgabe:** Eine nummerierte Checkliste ohne Mehrdeutigkeit.

```
Implementierungs-Plan:
[ ] 1. Erstellen Sie src/lib/export.ts mit exportToCsv(rows: Row[]): string
[ ] 2. Fügen Sie GET /api/export route in src/routes/export.ts hinzu, ruft exportToCsv auf
[ ] 3. Fügen Sie Export-Schaltfläche zu OrdersTable-Komponente in src/components/OrdersTable.tsx hinzu
[ ] 4. Schreiben Sie Unit-Tests in src/lib/export.test.ts abdeckend leer, eine Reihe und mehrere Zeilen Fälle
```

---

### 4. Führen Sie aus

**Modus-Erklärung:** "Ich bin im EXECUTE-Modus."

**Was geschieht:** Implementieren Sie den Plan genau wie geschrieben, einen Schritt nach dem anderen. Haken Sie jeden Schritt nach Abschluss ab. Improvisen Sie nicht. Fügen Sie keine Funktionen nicht im Plan hinzu. Wenn etwas Unerwartetes angetroffen wird — eine Datei, die nicht existiert, ein Typ-Konflikt, eine fehlende Abhängigkeit — stoppen, dokumentieren Sie den Blocker und kehren Sie zu Plan-Modus zurück, um ihn zu beheben.

**Verboten in dieser Phase:** Schritte springen, Umfang hinzufügen, Entscheidungen nicht vom Plan abgedeckt treffen.

**Blocker-Protokoll:** Falls blockiert, Ausgabe:

```
BLOCKIERT bei Schritt N: [Beschreibung des Problems]
Zurück zu PLAN-Modus zum Beheben.
```

Aktualisieren Sie dann den Plan, um den Blocker zu beheben, und fahren Sie mit Execute fort.

**Ausgabe:** Funktionsfähige Implementierung mit jedem Plan-Schritt angekreuzt.

---

### 5. Überprüfung

**Modus-Erklärung:** "Ich bin im REVIEW-Modus."

**Was geschieht:** Vergleichen Sie die Implementierung mit dem ursprünglichen Plan Zeile für Zeile. Identifizieren Sie alle Abweichungen (Zusätze, Auslassungen oder Ersetzungen). Überprüfen Sie, dass jedes Akzeptanz-Kriterium aus Phase Plan erfüllt ist. Dokumentieren Sie Erkenntnisse.

**Ausgabe:** Ein Überprüfungs-Bericht.

```
Überprüfungs-Bericht:
- Abgeschlossene Schritte: [N/N]
- Abweichungen: [Liste oder "keine"]
- Anforderungen erfüllt: [Ja / Teilweise — Details]
- Folgemaßnahmen: [Liste oder "keine"]
```

---

## Regeln

1. Überspringen Sie niemals Phasen. Die Sequenz ist immer Forschung → Innovate → Plan → Execute → Review.
2. Erklären Sie den Modus explizit am Anfang jeder Phase-Antwort.
3. In Execute: Machen Sie nur, was der Plan sagt. Unerwartete Erkenntnisse kehren zu Plan zurück, nicht Innovate oder Forschung.
4. Jede Phase erzeugt ein konkretes Artefakt, bevor die nächste beginnt.
5. Genehmigung zwischen Plan und Execute ist erforderlich — entweder explizites Benutzer-Zeichen oder überprüfender Agent.

---

## Beispiel

```
Benutzer: Verwenden Sie RIPER, um Rate-Limiting zu API hinzuzufügen.

Claude: Ich bin im RESEARCH-Modus.
[liest Middleware-Stack, existierende Routes, Request-Pipeline...]
Kontext-Zusammenfassung: Kein Rate-Limiting-Middleware vorhanden. express-rate-limit ist bereits in package.json, aber unbenutzt. Unbekannt: Pro-Route-Limits vs. Global. Frage: Sollten Limits global oder pro-Route sein?

Benutzer: Pro-Route, 100 req/min für öffentliche Endpoints, 1000 für authentifizierte.

Claude: Ich bin im INNOVATE-Modus.
[listet Ansätze auf: Middleware-Fabrik, Dekorator-Muster, Config-getrieben...]

Benutzer: Verwenden Sie den Middleware-Fabrik-Ansatz.

Claude: Ich bin im PLAN-Modus.
[erzeugt nummerierte Checkliste von 6 Schritten...]

Benutzer: Genehmigt.

Claude: Ich bin im EXECUTE-Modus.
[implementiert Schritt für Schritt, hakt ab...]

Claude: Ich bin im REVIEW-Modus.
[vergleicht mit Plan, bestätigt 6/6 Schritte abgeschlossen, keine Abweichungen, Anforderungen erfüllt]
```

---

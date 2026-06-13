# Inkrementelle Konstruktion mit Bestätigungstoren

Konstruiert eine Funktion Schritt für Schritt mit obligatorischer Überprüfung durch den Menschen zwischen jeder Phase. Claude verpflichtet sich zu Phasengrenzen, bevor er beginnt und kann den Umfang nicht mitten in der Phase erweitern. Verhindert Umfangsveränderungen, erkennt Integrationsprobleme früh und behält Menschen in Kontrolle der Konstruktionsrichtung.

---

## Wann es verwenden

- Eine Funktion konstruieren, die mehr als drei Dateien oder zwei Subsysteme betrifft
- Hochrisiko-Funktionen, bei denen teilweise Vollendung schlimmer ist als gar keine Vollendung (Authentifizierung, Abrechnung, Migrationen)
- Kooperative Konstruktionen, bei denen ein nicht-technischer Stakeholder jedes Inkrement überprüfen muss
- Jede Aufgabe, bei der Sie zuvor Claude etwas korrekt konstruieren sahen, aber nicht das, was Sie wollten

---

## Phasen

### Phase 0 — Phasendefinition (obligatorischer erster Schritt)

Bevor Code geschrieben wird, definiert Claude den gesamten Phasenplan. Dies ist der Vertrag.

```
Ich möchte konstruieren: [beschreibe die Funktion]

Vor dem Schreiben von Code einen Phasenplan erstellen.

Für jede Phase:
  - Phasenname (z. B. "Phase 1: Datenmodell")
  - Umfang: exakt, was erstellt oder geändert wird (Dateinamen, keine Beschreibungen)
  - Ausgabe: Was der Benutzer am Ende dieser Phase sehen oder überprüfen kann
  - Erfolgskriterien: Wie wir wissen, dass diese Phase korrekt abgeschlossen ist (Test-Befehl, manuelle Überprüfung, etc.)
  - Wiederherstellungsplan: Wie diese Phase rückgängig machen, falls wir sie ablehnen (Tabelle löschen, Dateien löschen, Commit revertieren)
  - Explizite Umfangsgrenze: Was NICHT in dieser Phase enthalten ist

Regeln für den Phasenplan:
  - Keine Phase sollte mehr als 5 Dateien betreffen
  - Jede Phase muss unabhängig überprüfbar sein ohne die nächste Phase zu benötigen
  - Phasengrenzen müssen bei natürlichen Nähten sein (Datenmodell, API, UI — nicht "Hälfte der API")
  - Keine Phase kann "und auch" enthalten — wenn Sie versucht sind, Umfang hinzuzufügen, machen Sie eine neue Phase

Präsentieren Sie den Phasenplan. Nicht mit Kodieren beginnen, bis ich ihn genehmigt habe.
```

Der Benutzer überprüft und genehmigt, lehnt ab oder umstrukturiert den Phasenplan, bevor irgendeine Arbeit beginnt. Dies ist die einzige Zeit, um den Umfang zu reformieren.

---

### Phase 1–N — Ausführungsmuster

Jede Phase folgt der gleichen Struktur. Ersetzen Sie `[N]` und `[Phasennamen]` entsprechend.

**Anfang der Phase:**
```
Starten Sie Phase [N]: [Phasennamen].

Umfangshinweis: [fügen Sie den Umfang aus dem genehmigten Plan ein]
Umfangsgrenze: [fügen Sie ein, was NICHT enthalten ist]

Implementieren Sie nur das, was im Umfang liegt. Wenn Sie etwas finden, das notwendig zu sein scheint, aber außerhalb des Umfangs liegt, STOPPEN und sagen Sie mir — fügen Sie es nicht einseitig hinzu. Ich entscheide, ob ich diese Phase erweitere oder Phase [N+1] hinzufüge.
```

**Während der Phase:**
- Claude schreibt Code und führt Tests nur für den Umfang dieser Phase durch
- Wenn Claude eine Umfangsabhängigkeit entdeckt (Phase 2 benötigt etwas aus Phase 3), stoppt es und meldet es, anstatt vorzuspulen
- Keine Commits, bis der Benutzer überprüft

**Eingabeaufforderung zum Ende der Phase:**
```
Phase [N] ist abgeschlossen. Bevor ich überprüfe:

1. Listen Sie alle Dateien auf, die Sie erstellt oder geändert haben
2. Zeigen Sie die Ausgabe, die ich überprüfen sollte (Test-Ergebnisse, Server-Antwort, UI-Screenshot-Anfrage, etc.)
3. Bestätigen Sie die Erfolgskriterien aus dem Plan: [fügen Sie Kriterien ein]
4. Markieren Sie alle Abweichungen vom genehmigten Umfang (auch kleine)

Starten Sie Phase [N+1] nicht, bis ich explizit "fortfahren" sage.
```

**Tor-Entscheidung:**

| Entscheidung | Aktion |
|---|---|
| "Fortfahren" | Claude beginnt Phase N+1 unter Verwendung des gleichen Ausführungsmusters |
| "Phase [N] wiederholen" | Claude kehrt zum Zustand vor Phase N zurück (mit dem Wiederherstellungsplan) und versucht es erneut |
| "Umfang ändern" | Pause — Benutzer und Claude verhandeln den Umfang von Phase N+1 neu, bevor Sie fortfahren |
| "Hier stoppen" | Workflow endet; Claude dokumentiert, was abgeschlossen ist und was bleibt |

---

### Letzte Phase — Integrationsprüfung

Nach der individuellen Genehmigung aller Phasen führen Sie eine Integrationsprüfung durch.

```
Alle Phasen sind abgeschlossen. Führen Sie die Integrationsprüfung durch:

1. Führen Sie die komplette Test-Suite aus (nicht nur die neuen Tests)
2. Listen Sie Test-Fehlschläge, Warnungen oder Typ-Fehler auf, die durch diesen Build eingeführt wurden
3. Überprüfen Sie, dass die Wiederherstellungspläne für jede Phase immer noch gültig sind (nicht durch spätere Phasen ungültig gemacht)
4. Erzeugen Sie eine einseitige Zusammenfassung dessen, was gebaut wurde und was der Benutzer jetzt tun kann

Beheben Sie Integrationsfehler nicht einseitig — melden Sie sie und warten auf Anweisung.
```

---

## Anti-Umfang-Kriechen Regeln

Diese Regeln gelten für Claude während des gesamten Workflows. Fügen Sie sie in CLAUDE.md ein, wenn Sie sie projektiert anwenden möchten:

```
Während inkrementeller Konstruktion:
- Fügen Sie niemals Code außerhalb des Umfangs der aktuellen Phase hinzu, auch wenn es offensichtlich notwendig zu sein scheint
- Führen Sie niemals "während ich in dieser Datei bin" zusätzliche Änderungen durch
- Erstellen Sie niemals Dateien, die nicht im genehmigten Phasenplan aufgelistet sind
- Wenn etwas im Plan fehlt, aber erforderlich ist, STOPPEN und melden — fügen Sie es nicht stillschweigend hinzu
- Commits finden an Phasengrenzen statt, nicht mitten in der Phase
```

---

## Beispiel

Funktion: "E-Mail-Benachrichtigung hinzufügen, wenn eine Bestellung versandt wird"

Phasenplan (Ausgabe von Phase 0):
- **Phase 1: E-Mail-Vorlage** — Erstellen Sie `emails/order-shipped.html` und `emails/order-shipped.txt`. Erfolg: Vorlage wird mit Testdaten angezeigt. Wiederherstellung: löschen Sie die beiden Dateien.
- **Phase 2: E-Mail-Service-Integration** — Fügen Sie `sendOrderShippedEmail(orderId)` zu `services/email.ts` hinzu. Keine UI, keine Auslöser. Erfolg: `npm run test:email` besteht. Wiederherstellung: revertieren Sie `services/email.ts`.
- **Phase 3: Bei Versand auslösen** — Verbinden Sie den Service-Aufruf in `handlers/shipment.ts`, wenn der Status auf `shipped` ändert. Erfolg: End-to-End-Test besteht. Wiederherstellung: revertieren Sie `handlers/shipment.ts`.

Benutzer genehmigt Plan. Claude führt Phase 1 aus. Benutzer überprüft Vorlage, sagt "fortfahren". Claude führt Phase 2 aus. Während Phase 2 bemerkt Claude, dass der E-Mail-Service einen API-Schlüssel benötigt, der nicht in der Konfiguration vorhanden ist — es stoppt und meldet dies, anstatt den Konfigurationsschlüssel einseitig hinzuzufügen. Benutzer fügt den Schlüssel hinzu, sagt "fortfahren". Phase 3 wird abgeschlossen. Integrationsprüfung besteht.

---

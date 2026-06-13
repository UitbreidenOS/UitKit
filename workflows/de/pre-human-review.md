# Vor-Mensch-Review-Pipeline

Eine sequenzielle Drei-Agenten-Pipeline, die einen Pull-Request für die Überprüfung durch den Menschen vorbereitet. Führt Code-Vereinfachung, Sicherheitsprüfung und abschließende Qualitätsprüfung in Reihenfolge aus — jeder Agent muss bestanden werden, bevor der nächste läuft. Das Ergebnis ist ein Pull-Request, der bei der Überprüfung durch den Menschen bereits sauber, geprüft und kommentiert ankommt.

---

## Wann es verwenden

- Vor dem Anfordern einer Code-Überprüfung von einem Teamkollegen oder vor Einreichung zu main
- Nach einer schnellen KI-gestützten Build-Sitzung, bei der Geschwindigkeit über Polish priorisiert wurde
- Jeder Pull-Request, der Authentifizierung, Zahlungen oder Datenzugriff berührt — wo ein Sicherheitstest nicht verhandelbar ist
- Teams mit begrenzter Überprüfungsbandbreite durch Menschen, die möchten, dass KI den Lärm zuerst filtert

---

## Phasen

### Phase 0 — Voraussetzungsprüfung

Vor der Generierung von Agenten überprüfen:

```
Lesen Sie das PR-Diff (git diff main...HEAD oder die Dateiliste).

Sagen Sie mir:
1. Wie viele Dateien haben sich geändert?
2. Sind diese vorhanden: Authentifizierung, Zahlungen, Migrationen, Secrets, Umgebungskonfiguration?
3. Ist das Diff unter 500 Zeilen? (Wenn über 2000 Zeilen, empfehlen Sie zuerst den PR zu teilen)

Nicht zu Phase 1 gehen, bis ich bestätige.
```

Tor: Wenn das Diff 2000 Zeilen überschreitet, halt an und fordere den Benutzer auf, den PR zu teilen. Große Diffs vermeiden den Sinn einer strukturierten Überprüfung.

---

### Phase 1 — Code-Vereinfacher

**Agent:** `agents/code-simplifier.md`
**Ziel:** Entfernen Sie Über-Engineering, toten Code und unnötige Komplexität, bevor die anderen Agenten Token darauf ausgeben.

```
Code-Vereinfacher-Agent generieren.

Umfang: [Liste der geänderten Dateien]
Aufgabe: Überprüfen Sie dieses Diff auf Über-Engineering. Identifizieren Sie:
  - Funktionen, die durch Standardbibliotheksaufrufe ersetzt werden können
  - Abstraktionen, die Komplexität ohne Wiederverwendung hinzufügen (YAGNI-Verstöße)
  - Toter Code oder kommentierte Blöcke, die in diesem PR eingeführt werden
  - Wiederholte Logik, die einmal extrahiert werden sollte

Für jeden Fund: zeigen Sie die vorher, die vorgeschlagene nachher und den Grund.
Machen Sie KEINE Änderungen — produzieren Sie nur einen Fundsbericht.
```

**Tor:** Überprüfen Sie die Erkenntnisse des Vereinfachers. Akzeptieren oder lehnen Sie jeden Fund ab. Nur akzeptierte Erkenntnisse werden angewendet, bevor Sie zu Phase 2 übergehen. Wenn der Vereinfacher nichts zu vereinfachen meldet — grünes Licht, fahren Sie sofort fort.

Wenden Sie akzeptierte Vereinfachungen an:
```
Wenden Sie die folgenden akzeptierten Vereinfachungen aus dem Code-Vereinfacherbericht an:
[fügen Sie akzeptierte Erkenntnisse ein]

Machen Sie die minimalen erforderlichen Änderungen. Führen Sie keine neuen Muster oder Refactoring über das hinaus ein, was aufgelistet war.
```

---

### Phase 2 — Sicherheitsprüfer

**Agent:** `agents/security-reviewer.md`
**Ziel:** Markieren Sie Sicherheitsrisiken, die im PR-Diff eingeführt werden — nicht bereits vorhandene Probleme in der Codebase.

```
Security-Reviewer-Agent generieren.

Umfang: nur Dateien geändert in diesem PR — nicht vorgelegten Code prüfen.
Diff: [diff anbringen oder Dateien auflisten]

Überprüfen Sie auf:
  - Injection-Anfälligkeit (SQL, Befehl, Vorlage)
  - Authentifizierungs- und Autorisierungslücken
  - Secrets oder Anmeldeinformationen in Code oder Kommentaren
  - Unsichere Deserialisierung oder eval-äquivalente Muster
  - Fehlende Input-Validierung bei Benutzer-kontrolliertem Daten
  - Broken Access Control (horizontale oder vertikale Eskalation)

Für jeden Fund: Schwere (KRITISCH / HOCH / MITTEL / NIEDRIG), Datei + Zeile, Beschreibung, Mitigation.
KRITISCH und HOCH blockieren Merge. MITTEL und NIEDRIG sind informativ.
```

**Tor:** Jeder KRITISCH- oder HOCH-Fund blockiert Phase 3. Der Benutzer muss entweder das Problem beheben oder das Risiko explizit schriftlich akzeptieren, bevor er fortfährt. NIEDRIG- und MITTEL-Erkenntnisse werden als Hinweise an die PR-Beschreibung angehängt.

---

### Phase 3 — Code-Reviewer

**Agent:** `agents/code-reviewer.md`
**Ziel:** Abschließende Qualitätsprüfung — Logik-Richtigkeit, Test-Abdeckung, Dokumentation und allgemeine Bereitschaft.

```
Code-Reviewer-Agent generieren.

Kontext: Dieses Diff hat bereits Vereinfachungs- und Sicherheitsprüfung bestanden.
Konzentrieren Sie Ihre Überprüfung auf:
  - Logik-Richtigkeit: macht der Code das, was die PR-Beschreibung sagt?
  - Randfälle: welche Eingaben oder Zustände könnten dies brechen?
  - Test-Abdeckung: sind die Tests aussagekräftig oder testen sie Implementierungsdetails?
  - Fehlerbehandlung: werden Fehler auf der richtigen Ebene behandelt?
  - Dokumentation: haben neue öffentliche APIs Docstrings oder JSDoc?

Erheben Sie nicht erneut Probleme, die bereits von der Sicherheit oder Vereinfachung angesprochen wurden.
Produzieren Sie: ein LGTM / BENÖTIGT ARBEIT-Urteil mit einer nummerierten Problemliste (falls vorhanden).
```

**Tor:** LGTM → PR ist bereit für Mensch-Review. BENÖTIGT ARBEIT → adressieren Sie Probleme und führen Sie Phase 3 erneut aus (keine Notwendigkeit, Phasen 1 oder 2 erneut auszuführen, es sei denn, neuer Code wurde hinzugefügt).

---

### Phase 4 — Ausgabe-Verpackung

Sobald alle drei Agenten bestanden haben:

```
Fassen Sie diesen PR für den Menschlichen Reviewer zusammen.

Einschließen:
- Ein-Absatz-Beschreibung, was dieser PR tut
- Geänderte Dateien (gruppiert nach Besorgnis: Feature-Code, Tests, Config)
- Probleme, die während der Pipeline angehoben und gelöst wurden
- Alle Hinweise (NIEDRIG/MITTEL) Sicherheitsnotizen
- Vorgeschlagene Überprüfungsfokus-Bereiche für den Menschen

Formatieren Sie als PR-Beschreibungs-Update — Ich werde es in den GitHub PR-Text einfügen.
```

---

## Beispiel

PR: "OAuth2-Anmeldung mit Google hinzufügen"

- Phase 0: 8 Dateien geändert, Auth-Logik vorhanden → mit obligatorischer Sicherheitsprüfung fortfahren
- Phase 1 (Vereinfacher): 2 Probleme gefunden — Inline-Token-Validierung dupliziert `validateToken()`-Utility und ein totes Import. Beide akzeptiert und angewendet.
- Phase 2 (Sicherheit): 1 HOCH gefunden — Zustands-Parameter nicht validiert in OAuth-Callback (CSRF-Risiko). Benutzer repariert es vor Phase 3.
- Phase 3 (Reviewer): LGTM mit 1 Hinweis — Test für abgelaufenes Token-Fall fehlt. Hinweis an PR angehängt.
- Phase 4: PR-Beschreibung mit Zusammenfassung und Hinweis aktualisiert.

Menschlicher Reviewer erhält ein Diff, das bereits vereinfacht, sicherheitsgeprüft und kommentiert ist.

---

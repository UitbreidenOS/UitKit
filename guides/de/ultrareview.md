# Ultrareview — Flottengestützte adversarische Code-Überprüfung

Ultrareview ist Claudes Multi-Agent-Überprüfungssystem, das im April 2026 in öffentlicher Vorschau veröffentlicht wurde. Es ersetzt das Single-Reviewer-Modell von `/code-review` durch eine koordinierte Flotte spezialisierter Subagenten, die das gleiche Diff unabhängig voneinander überprüfen, ihre Erkenntnisse gegenseitig überprüfen und einen synthetisierten, auf falsche Positive überprüften Bericht erstellen. Die Schlüsseleigenschaften: adversarial (Agenten versuchen aktiv, Löcher in den Schlussfolgerungen des jeweils anderen zu finden), parallel (Agenten laufen gleichzeitig, nicht sequenziell) und tiefengesteuert (die Flottengrößen und der Aufwand skalieren mit der Größe und Komplexität des Diffs).

---

## So funktioniert es

### Die Flottenarchitektur

Ultrareview spawnt eine Flotte von Überprüfungs-Subagenten, von denen jeder eine unterschiedliche Rolle hat und einen anderen Blick auf das gleiche Diff hat. Die Zusammensetzung der Flotte variiert je nach Diff-Charakteristiken, aber ein typischer Durchlauf bei einem mittelgroßen PR umfasst:

| Agent | Fokus |
|---|---|
| **Sicherheitsüberprüfer** | OWASP Top 10, Injection, Auth-Bypass, Datenleck, Secrets in Diffs |
| **Korrektivitätsüberprüfer** | Logikfehler, Edge Cases, Race Conditions, Off-by-One, Nulls |
| **Leistungsüberprüfer** | N+1-Abfragen, blockierende I/O, algorithmische Komplexität, Speicherzuweisungsmuster |
| **Architekturüberprüfer** | Designkonsistenz, Kopplung, Musterbeibehaltung, Schnittstellenverträge |
| **Test-Coverage-Überprüfer** | Was wird abgedeckt, was nicht, ob Tests das Verhalten tatsächlich testen |
| **Adversarischer Verifizierer** | Überprüft die Erkenntnisse aller anderen Agenten — markiert falsche Positive, eskaliert verpasste Probleme |

Der adversarische Verifizierer ist das unterscheidende Element. Er erhält alle Erkenntnisse der Spezialagenten und seine explizite Aufgabe ist es, diese zu hinterfragen: Festzustellen, ob jede Erkenntnis real, ein falsch positiv oder ein gültiges Anliegen ist, das der ursprüngliche Agent unterschätzt hat. Diese zweite Überprüfung reduziert das Rauschen in der endgültigen Ausgabe erheblich.

### Was parallel vs. sequenziell läuft

Phase 1 (parallel): Alle Spezialagenten überprüfen das Diff gleichzeitig. Jeder liest die gleiche Eingabe — das Diff, relevante Kontextdateien und alle Anweisungen, die Sie bereitgestellt haben — wendet aber seine eigene Perspektive an.

Phase 2 (sequenziell): Der adversarische Verifizierer erhält alle Erkenntnisse aus Phase 1 und erstellt die Synthese. Dies ist bewusst sequenziell — der Verifizierer braucht das vollständige Bild.

Phase 3: Der synthetisierte Bericht wird zusammengestellt, dedupliziert und an Sie zurückgegeben.

Die End-to-End-Wanduhrzeit liegt typischerweise bei 90–180 Sekunden für einen mittelgroßen PR, je nach Diff-Größe und Anzahl der gelesenen Kontextdateien. Der Parallelismus bedeutet, dass dies schneller ist als eine ebenso tiefgreifende Überprüfung sequenziell durchzuführen, trotz höherer Gesamttokennutzung.

### Kontextauflösung

Bevor die Flotte an den Start gehen, löst Ultrareview den Überprüfungskontext auf. Es liest:

- Das Diff selbst (nur geänderte Zeilen, es sei denn `--full-files` ist gesetzt)
- Die Dateien neben geänderten Dateien (zum Verstehen umgebender Muster)
- Test-Dateien, die den geänderten Code abdecken
- Relevante Konfiguration (Linter, tsconfig, pyproject.toml), um zu verstehen, welche statische Analyse bereits vorhanden ist
- `CLAUDE.md` falls vorhanden — zum Anwenden von Repo-spezifischen Überprüfungsregeln auf die Flotte

Diese Kontextauflösung findet statt, bevor die Flotte spawnt, sodass jeder Agent ein vorbereitetes Paket erhält, keinen Raw-Repo-Zugang.

---

## Aufruf

### Primärer Aufruf

```
/ultrareview
```

Keine Argumente nötig für den Standardfall — Ultrareview greift das aktuelle Diff (staged + unstaged changes) und das Branch-Diff gegen den Standard-Remote-Branch ab.

### Mit einem bestimmten PR

```
/ultrareview 847
```

Übergeben Sie eine GitHub-PR-Nummer. Ultrareview holt das PR-Diff über das GitHub MCP oder `gh` CLI. Dies ist der häufigste Aufruf in der Praxis — Sie zeigen darauf, es überprüft es.

### Mit einem Fokusbereich

```
/ultrareview --focus security
/ultrareview --focus performance
/ultrareview --focus correctness
```

Fokusvorgaben beeinflussen die Flottenzusammensetzung. `--focus security` erweitert den Aufwand des Sicherheitsüberprüfers und reduziert den des Architekturüberprüfers. Der adversarische Verifizierer läuft immer auf vollem Aufwand unabhängig vom Fokus.

### Mit Aufwandsstufe

```
/ultrareview --effort high
/ultrareview --effort max
```

Der Aufwand skaliert die Tiefe jedes einzelnen Agenten, nicht die Anzahl der Agenten. Bei `--effort max` nutzt jeder Agent erweiterte Überlegungen und liest einen breiteren Satz von Kontextdateien. Die Kosten skalieren erheblich — verwenden Sie `max` nur für sicherheitskritische oder architekturdefinierende Änderungen.

### Mit vollständigem Dateikontext

```
/ultrareview --full-files
```

Standardmäßig sehen Agenten nur die geänderten Zeilen und den umliegenden Kontext. `--full-files` gibt Agenten den vollständigen Inhalt jeder geänderten Datei. Verwenden Sie dies, wenn das Diff klein ist, aber das Verhalten stark von der vollständigen Struktur der Datei abhängt (z. B. eine Klasse, bei der eine Methodenänderung Invarianten in der gesamten Datei beeinflusst).

### Aufruf von der CLI

```bash
claude --ultrareview 847
claude --ultrareview --focus security --effort high
```

CLI-Aufruf entspricht dem Slash-Befehl. Nützlich für die Verwendung von Ultrareview in CI-Pipelines oder Pre-Merge-Hooks.

---

## Preisgestaltung

Ultrareview wird pro Durchlauf berechnet, nicht pro Token. Die Tokenkosten werden immer noch anfallen (und in Ihrer Platzabrechnung oder API-Nutzung widergespiegelt), aber die Pro-Durchlauf-Gebühr deckt die Flottenorchestrierungs-Infrastruktur.

### Preisstufen (Stand April 2026 öffentliche Vorschau)

| Stufe | Kosten | Notizen |
|---|---|---|
| Erste 3 Durchläufe | Kostenlos | Pro Konto, setzt sich nie zurück — einmalige Vorschauallokation |
| Standarddurchlauf | $5 | Standardaufwand, Diffs bis zu ~500 Zeilen geändert |
| Großer Durchlauf | $10 | Diffs 500–2000 Zeilen geändert oder `--effort high` |
| Max-Durchlauf | $20 | `--effort max` oder Diffs über 2000 Zeilen geändert |

Der Durchlauf wird in der Stufe berechnet, die Ihrer Aufruf *vor* der Bestätigung entspricht. Sie sehen eine Kostenbestätigungsaufforderung, bevor die Flotte spawnt:

```
Ultrareview: Large run — estimated $10
Diff: 847 lines changed across 23 files
Fleet: 6 agents + adversarial verifier
Proceed? [y/N]
```

Geben Sie `y` ein, um fortzufahren. Wenn Sie ablehnen, fallen keine Kosten an.

### Wofür die kostenlosen Durchläufe gut sind

Verwenden Sie Ihre drei kostenlosen Durchläufe für Ihre komplexesten oder sicherheitssensitivsten aktuellen Änderungen. Verschwenden Sie sie nicht mit kleinen PRs — `/code-review` deckt diese auf Null zusätzliche Kosten ab. Speichern Sie kostenlose Durchläufe für:

- Auth-System-Änderungen
- Datenbankmigrationen-PRs
- Abrechnungs- / Zahlungscode
- Erste große Funktion auf einer unvertrauten Codebasis
- PRs, bei denen andere Reviewer Bedenken geäußert haben, aber ohne Spezifika

### Kosten vs. Ingenieurzeit

Die Überprüfung eines Ingenieurs mittlerer Ebene kostet $75–150 vollständig belastet pro Stunde. Ein $10 Ultrareview-Durchlauf, der einen kritischen Fehler vor der Produktion erkennt, bringt eine 10x Rendite auf einen einzelnen Zwischenfall. Die Kalkulation verschiebt sich bei kleinen PRs, bei denen `/code-review` ausreichend ist — geben Sie nicht $5 aus, um eine einzeilige Konfigurationsänderung zu überprüfen.

---

## `/ultrareview` vs. `/code-review`

Das Verständnis, wann jede Methode zu verwenden ist, ist die wichtigste praktische Entscheidung.

| Dimension | `/code-review` | `/ultrareview` |
|---|---|---|
| **Agenten** | Single Reviewer | Flotte von 5–7 Spezialisten |
| **Kosten** | $0 (nur Tokenkosten) | $5–20 pro Durchlauf |
| **Zeit** | 15–30 Sekunden | 90–180 Sekunden |
| **Falsch-Positiv-Quote** | Mäßig | Niedrig (adversarische Verifikation) |
| **Sicherheitstiefe** | Gut | Gründlich — dedizierter Agent + Verifizierer |
| **Dateiübergreifende Analyse** | Begrenzt | Vollständig — Agenten können benachbarte Dateien lesen |
| **Am besten für** | Tägliche Überprüfung, kleine PRs | Hochriskante PRs, Sicherheitsüberprüfung, komplexe Änderungen |
| **Aufwandsstufen** | `low` / `medium` / `high` / `max` | `default` / `high` / `max` |
| **GitHub PR-Integration** | Manuelles Diff-Einfügen | Nativ über PR-Nummer |

**Verwenden Sie `/code-review` wenn:**
- Das PR klein und gut abgegrenzt ist (< 200 Zeilen geändert)
- Sie bereits eine Selbstüberprüfung durchgeführt haben und einen schnellen zweiten Durchgang möchten
- Sie Nicht-kritische Anwendungscode bei knappem Zeitplan überprüfen
- Sie schnell durch eine Funktion mit häufigen Überprüfungen iterieren möchten

**Verwenden Sie `/ultrareview` wenn:**
- Die Änderung sicherheitssensitiv ist (Auth, Zahlungen, Datenzugriff, Secrets)
- Das PR groß ist und mehrere Subsysteme berührt
- Sie etwa in main eines Produktionssystems zusammenführen
- Ein anderer Reviewer etwas gekennzeichnet hat, aber es nicht genau artikulieren konnte
- Sie eine schriftliche Aufzeichnung einer gründlichen Überprüfung möchten (Ultrareview-Ausgabe hat Artefakt-Qualität)
- Die Codebasis unvertraut ist und Sie Ihrer eigenen Überprüfungstiefe nicht vertrauen

Es ist keine Schande, zunächst `/code-review` auszuführen und zu `/ultrareview` zu wechseln, wenn etwas Mehrdeutiges ans Licht kommt. Die Kosten für eine `code-review` sind nahe bei null, verwenden Sie sie frei; verwenden Sie Ultrareview gezielt.

---

## Die Ausgabe lesen

Ultrareview erstellt einen strukturierten Bericht. Das Verständnis des Formats ermöglicht schnellere Triage.

### Berichtsstruktur

```
## Ultrareview Report
PR #847 · 23 files · 847 lines changed
Fleet: Security, Correctness, Performance, Architecture, Tests, Adversarial Verifier
Runtime: 142 seconds

---

### Critical Findings (must fix before merge)

🔴 [SECURITY] SQL injection in user search endpoint
Agent: Security Reviewer · Verified: Adversarial Verifier ✓
File: api/search.py:34
...

---

### Important Findings (should fix before merge)

🟠 [CORRECTNESS] Race condition in concurrent payment processing
Agent: Correctness Reviewer · Verified: Adversarial Verifier ✓
File: billing/processor.py:112
...

---

### Suggestions (worth discussing)

🟡 [ARCHITECTURE] Payment handler violates single-responsibility
Agent: Architecture Reviewer · Disputed: Adversarial Verifier — low confidence
...

---

### Dismissed Findings

ℹ️ 3 findings from specialist agents were dismissed by the Adversarial Verifier as false positives. See appendix.

---

### Summary
Critical: 1 · Important: 3 · Suggestions: 5 · Dismissed: 3
Recommendation: Request changes — critical finding must be resolved.
```

### Das Verifikations-Abzeichen

Jede Erkenntnis trägt einen Verifikationsstatus vom adversarischen Verifizierer:

- **Verified ✓** — der adversarische Verifizierer bestätigte, dass die Erkenntnis real und korrekt beschrieben ist
- **Escalated ↑** — der adversarische Verifizierer fand, dass die Erkenntnis das Gefundene unterschätzt; Schweregrad kann erhöht werden
- **Disputed —** — der adversarische Verifizierer stimmt nicht zu; die Erkenntnis wird einbezogen, aber als unsicher gekennzeichnet
- **Dismissed ✗** — der adversarische Verifizierer kam zu dem Ergebnis, dass die Erkenntnis ein falsch positiv ist; wird in den Anhang verschoben

Überspringen Sie keine Disputed-Erkenntnisse. Sie werden einbezogen, weil der adversarische Verifizierer sie nicht zuversichtlich abweisen konnte — was bedeutet, dass sie mit menschlichem Auge gültig sind, selbst wenn der ursprüngliche Agent das Risiko überbewertet hat.

### Der Dismissed-Anhang

Lesen Sie den Anhang dismissed findings immer, besonders bei sicherheitssensitiven PRs. Der adversarische Verifizierer ist gut, aber nicht unfehlbar. Eine dismissed Sicherheitserkenntnis, die sich als real herausstellt, ist schlimmer als ein falsch positiv, das Sie kurz überprüften und ablehnten.

Das Anhangsformat:

```
### Appendix: Dismissed Findings

[Security Reviewer] Potential SSRF via user-supplied URL
Dismissed: The URL is validated against an allowlist on line 12; the finding assumes
no validation exists. Confirmed safe by Adversarial Verifier.

[Performance Reviewer] O(n²) sort in user listing
Dismissed: Input size is capped at 50 by the pagination limit on line 8.
Actual complexity is O(50 log 50) = effectively constant.
```

Diese Ablehnungen sind erklärend, nicht einfach Ja/Nein. Wenn die Begründung falsch aussieht, vertrauen Sie Ihrem Urteil über dem adversarischen Verifizierer.

### Agentenzuordnung

Jede Erkenntnis nennt den Agenten, der sie erhöht. Dies ist aus zwei Gründen wichtig:

1. **Kalibrierung**: Einige Agenten sind konservativer als andere. Wenn Sie den Leistungsüberprüfer zuvor falsche Positive auf Ihrer Codebasis kennzeichnen sahen, wenden Sie diese vorherige Vermutung an.
2. **Nachfragen stellen**: Sie können die Erkenntnis referenzieren und Claude bitten, tiefer zu graben — "Expand on the race condition finding at billing/processor.py:112" — und es wird dort fortfahren, wo der Korrektivitätsüberprüfer aufhörte.

---

## Praktische Tipps

### Tipp 1: Überprüfen Sie die dismissed findings, bevor Sie genehmigen

Die nützlichste Gewohnheit: Bevor Sie auf genehmigen klicken, verbringen Sie 60 Sekunden damit, den Anhang dismissed findings zu lesen. Sie suchen nach Fällen, in denen die Begründung des adversarischen Verifizierers etwas annimmt, das nicht auf Ihre spezifische Codebasis zutrifft. Es passiert.

### Tipp 2: Verwenden Sie `--focus security` auf jedem PR, der Auth oder Zahlungen berührt

Selbst wenn Sie sich der Änderung sicher sind, erkennt die sicherheitsorientierte Flottenzusammensetzung Dinge, die breitere Überprüfungen vermissen. Der dedizierte Sicherheitsagent liest den gesamten Auth-Flow, nicht nur das Diff — er versteht, ob eine Änderung an einer Middleware-Funktion jeden authentifizierten Route oder nur die angrenzende Route beeinflusst.

```bash
claude --ultrareview 312 --focus security
```

### Tipp 3: Führen Sie nicht ultrareview auf jedem PR aus — legen Sie einen Schwellenwert fest

Teams, die den meisten Wert aus Ultrareview erhalten, definieren einen Schwellenwert: Jeder PR mit mehr als X Zeilen geändert oder jeder PR, der Y Verzeichnisse berührt, durchläuft automatisch Ultrareview. Darunter läuft `/code-review`. Beispielschwellenwert:

```
Ultrareview if:
  - diff > 300 lines changed, OR
  - any file in auth/, billing/, api/admin/ touched, OR
  - schema migration included
```

Dokumentieren Sie dies in Ihrem `CLAUDE.md`, damit Claude Code es automatisch während der Überprüfung anwendet.

### Tipp 4: Führen Sie ultrareview auf Ihren eigenen PRs aus, bevor Sie eine menschliche Überprüfung anfordern

Ein häufiger Arbeitsablauf: Code schreiben, `/code-review` für schnelle Iteration ausführen, offensichtliche Probleme beheben, dann `/ultrareview` ausführen, bevor Sie einen menschlichen Reviewer anfordern. Der menschliche Reviewer sieht dann einen PR, der bereits durch adversarische Analyse durchgelaufen ist — ihre Überprüfung kann sich auf Designentscheidungen und Kontext konzentrieren anstatt offensichtliche Fehler zu erkennen.

### Tipp 5: Leiten Sie die Ausgabe in eine Datei für asynchrone Überprüfung um

Ultrareview läuft für 90–180 Sekunden. Sie müssen nicht zuschauen:

```bash
claude --ultrareview 847 > ultrareview-847.md
```

Öffnen Sie die Datei, wenn Sie bereit sind. Der Bericht ist eigenständig und erfordert keine interaktive Nachverfolgung, es sei denn, Sie möchten tiefer graben.

### Tipp 6: Verwenden Sie `--full-files` für Klassen- oder Modul-Umstrukturierungen

Wenn ein PR eine Klasse umstrukturiert, aber das Diff nur geänderte Methoden anzeigt, können die Agenten Invarianten, die die unveränderten Methoden annehmen, vermissen. `--full-files` gibt der Flotte das vollständige Bild:

```bash
claude --ultrareview 512 --full-files --focus correctness
```

Kostet mehr (mehr Tokens pro Agent), aber bei einer Klassenebene-Umgestaltung ist es wert.

### Tipp 7: Überprüfen Sie den PR, nicht den Commit

Zeigen Sie Ultrareview auf das vollständige PR-Diff, nicht einen einzelnen Commit. Überprüfungen einzelner Commits verpassen die kumulative Auswirkung mehrerer Commits — z. B. eine Sicherheitsreparatur in Commit 2, die teilweise in Commit 4 rückgängig gemacht wird. Das PR-Ebenen-Diff ist immer der richtige Bereich.

### Tipp 8: Wenn der adversarische Verifizierer eine Erkenntnis eskaliert, behandeln Sie sie als kritisch

Eskalationen (↑) treten auf, wenn der adversarische Verifizierer denkt, dass ein ursprünglicher Agent eine Erkenntnis unterschätzt. Diese sind selten — unter 5% der Erkenntnisse — aber es sind die Fälle, die wahrscheinlich wirklich ernst sind. Eine eskalierte Erkenntnis bedeutet, dass zwei Agenten unabhängig vereinbart haben, dass das Risiko höher ist als initial gekennzeichnet. Behandeln Sie Eskalationen mit der gleichen Dringlichkeit wie ein 🔴 Critical, unabhängig vom Schweregrad, den der ursprüngliche Agent zuweist.

---

## Bekannte Fallstricke

### Kontextfenster-Limits bei sehr großen PRs

PRs über ~5000 Zeilen geändert können den Kontext überschreiten, den Agenten kohärent lesen können. Ultrareview wird Sie warnen, bevor Sie ausführen, wenn das Diff in der Nähe dieses Limits liegt. Optionen: PRs aufteilen, `--focus` verwenden, um den Agent-Bereich zu verengen, oder akzeptieren, dass einige dateiübergreifende Analysen unvollständig sind.

### Agenten-Uneinigkeit ist kein Fehler

Gelegentlich werden der Korrektivitätsüberprüfer und der Architekturüberprüfer gegensätzliche Empfehlungen haben — die Korrektivitätsreparatur beinhaltet ein Muster, das der Architekturagent als inkonsistent mit der Codebasis kennzeichnet. Dies ist zu erwarten. Der adversarische Verifizierer notiert den Widerspruch, löst ihn aber nicht immer auf — das ist Ihr Urteilsspruch. Suchen Sie den Widerspruch explizit in Erkenntnissen, die Disputed sind.

### Der kostenlose Tarif wird nicht übertragen

Ihre drei kostenlosen Ultrareview-Durchläufe werden bei der Kontoerstellung zugewiesen und setzten sich nicht zurück. Wenn Sie in einem Team sind, erhält jedes Teammitglied seine eigene Zuweisung — sie werden nicht zusammengefasst. Ein Einzelentwickler erhält drei kostenlose Durchläufe; ein Team von 10 erhält 30 (10 × 3).

### `--effort max` bei einem großen PR ist teuer

Ein Max-Aufwand-Durchlauf bei einem 2000-Zeilen-PR kann $20 kosten und 4–6 Minuten dauern. Die Kostenbestätigungsaufforderung zeigt Ihnen dies, bevor Sie sich verpflichten. Verwenden Sie `--effort max` nicht für routinemäßige Überprüfung — reservieren Sie es für Code, der Produktionssicherheitsgrenzen berührt.

### Ultrareview ersetzt nicht die menschliche Überprüfung für Architekturentscheidungen

Der Architekturüberprüfer-Agent ist stark bei Musterkonsistenz und Kopplungsanalyse, kennt aber nicht Ihre Produktstrategie des Teams, Ihre Technische-Schulden-Toleranz oder die Beschränkungen auf Ihrem Bereitstellungsmodell. Verwenden Sie Ultrareview-Erkenntnisse als Eingaben für menschliche Architekturüberprüfung, nicht als Ersatz dafür.

### Der Bericht ist auf das Diff, nicht auf das System, bezogen

Ultrareview überprüft das Diff im Kontext, kann aber nicht von Fehlern in angrenzenden Systemen wissen, mit denen Ihre Änderung interagieren wird. Eine Änderung, die isoliert korrekt ist, aber eine Annahme in einem externen Service bricht, wird nicht erkennt. Das ist eine System-Ebenen-Sorge, die menschliches Domain-Wissen erfordert.

---

## Beispiel End-to-End-Arbeitsablauf

**Szenario:** Sie haben einen Payment-Webhook-Handler für Stripe geschrieben. Der PR umfasst 340 Zeilen geändert über 8 Dateien. Bevor Sie eine Überprüfung anfordern, führen Sie Ultrareview aus.

```bash
# Erstellen Sie zuerst die PR, damit Sie eine PR-Nummer haben
gh pr create --title "Add Stripe webhook handler" --draft

# Holen Sie sich die PR-Nummer
gh pr list --state open | head -5
# Output: 923  Add Stripe webhook handler  feat/stripe-webhooks

# Führen Sie ultrareview mit Sicherheitsfokus aus
claude --ultrareview 923 --focus security
```

Ausgabeaufforderung:
```
Ultrareview: Large run — estimated $10
Diff: 340 lines changed across 8 files
Fleet: Security (expanded), Correctness, Performance, Architecture, Tests, Adversarial Verifier
Focus: Security
Proceed? [y/N]
```

Sie geben `y` ein. 147 Sekunden später:

```
## Ultrareview Report — PR #923
...

### Critical Findings

🔴 [SECURITY] Webhook signature not verified before processing payload
Agent: Security Reviewer · Verified: Adversarial Verifier ✓
File: webhooks/stripe.py:18
Issue: The handler processes the event payload without first verifying the
Stripe-Signature header. Any caller can send fake webhook events.
Fix:
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
  )
  # Raises stripe.error.SignatureVerificationError if invalid

🔴 [SECURITY] Replay attack possible — no timestamp validation
Agent: Security Reviewer · Escalated: Adversarial Verifier ↑
File: webhooks/stripe.py:18
Issue: Even with signature verification added, the timestamp in the Stripe-Signature
header must be validated to prevent replayed requests. Stripe recommends rejecting
events older than 300 seconds.
Fix:
  # stripe.Webhook.construct_event validates timestamp if you pass tolerance parameter
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET,
      tolerance=300
  )
```

Zwei kritische Erkenntnisse, die vor der menschlichen Überprüfung erfasst wurden. Sie beheben beide, pushen, markieren die PR als bereit zur Überprüfung und notieren in der PR-Beschreibung, dass Ultrareview ausgeführt wurde und Erkenntnisse adressiert wurden. Ihr Reviewer kann sich auf die Geschäftslogik konzentrieren, nicht auf die Sicherheitsgrundsätze.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

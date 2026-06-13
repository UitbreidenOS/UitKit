# Abhängigkeitsverwaltungsregeln

## Gültig für
Alle Projekte — alle Sprachen, alle Paketmanager (`npm`, `pip`, `cargo`, `go mod`, `maven`, `gem`).

## Regeln

1. **Direkte Abhängigkeiten auf exakte oder bereichsgebundene Versionen festlegen** — `"express": "4.18.2"` nicht `"express": "*"`. Für Bibliotheken ist `"~4.18.0"` (nur Patch) akzeptabel. Nicht fixierte transitive Abhängigkeiten werden durch Lockfiles verwaltet.

2. **Lockfiles für Anwendungen committed, nicht für Bibliotheken** — `package-lock.json`, `Cargo.lock`, `poetry.lock`, `go.sum` gehören in die Versionskontrolle für bereitgestellte Anwendungen. Bibliotheks-Lockfiles schränken Verbraucher unnötig ein.

3. **`npm audit` / `pip-audit` / `cargo audit` in CI ausführen** — den Build bei CVE-Schweregrad hoch oder kritisch fehlschlagen lassen. Eine anfällige Abhängigkeit wie einen fehlgeschlagenen Test behandeln.

4. **Laufzeit-Abhängigkeiten von Entwicklungs-Abhängigkeiten trennen** — `devDependencies` in npm, `dev = true` in Poetry, `[dev-dependencies]` in Cargo. Dev-Tools dürfen nicht in Produktionsabbildern versendet werden.

5. **Jede neue Abhängigkeit vor dem Hinzufügen überprüfen** — überprüfen: Datum des letzten Commits, wöchentliche Downloads, offene CVEs, Lizenzkompatibilität. Eine Abhängigkeit ist eine Wartungsverpflichtung. Verwaiste oder schlecht gewartete Pakete für den Produktiveinsatz ablehnen.

6. **Standard-Bibliothek bevorzugen** — bevor eine Abhängigkeit hinzugefügt wird, überprüfen, ob die Standard-Bibliothek der Sprache das Erfordernis abdeckt. Eine 5-zeilige Standard-Bibliotheks-Lösung schlägt ein 500-KB-Transitivabhängigkeitsdiagramm für Datumsformatierung.

7. **Abhängigkeiten nach Plan aktualisieren, nicht nur wenn etwas kaputt ist** — wöchentliche oder vierzehntägige automatisierte PRs (Dependabot, Renovate) mit bestandenem CI sind Routine. Notfallaktualisierungen unter Druck ohne Testabdeckung sind gefährlich.

8. **Lizenzprüfung in CI** — verwenden Sie `license-checker`, `pip-licenses` oder `cargo-deny`, um Lizenz-Whitelists zu erzwingen. GPL-Code in einem proprietären Produkt zu versendet ist ein Rechtsrisiko, kein technisches.

9. **Unbenutzte Abhängigkeiten entfernen** — `depcheck` (Node), `pip-autoremove`, `cargo machete`. Unbenutzte Pakete vergrößern die Abbildgröße, vergrößern die Angriffsfläche und erschweren Audits.

10. **Große Versionsaktualisierungen als eigene PR isolieren** — ein großer Versions-Bump ist eine bahnbrechende Änderung. Das Bundeln mit Feature-Arbeit macht die Ursachenanalyse unmöglich, wenn etwas kaputt geht.

11. **Abhängigkeiten für luftgestützte oder stark regulierte Umgebungen bereitstellen** — `go mod vendor`, npm `--prefer-offline` mit einer lokalen Registrierung oder ein privates Artifactory/Nexus-Proxy. Die Abhängigkeit von öffentlichen Registrierungen zur Laufzeit ist ein Lieferkettenrisiko.

12. **Paketintegrität überprüfen** — verwenden Sie `npm ci` über `npm install` in CI (lockfile-strict). In Python überprüfen Sie Hashes mit `pip install --require-hashes`. In Go bietet `go.sum` dies automatisch.

13. **Installieren Sie Pakete niemals mit `sudo` in Anwendungsumgebungen** — verwenden Sie Benutzerbereichs-Virtual-Environments (Python `venv`, Node-Projekt-lokal `node_modules`). Globale Installationen verschmutzen das System und verursachen Konflikte über Projekte hinweg.

14. **Abhängigkeitsverwirrungsangriffe beobachten** — interne Paketnamen dürfen nicht mit öffentlichen Registrierungsnamen kollidieren. Verwenden Sie Scoped-Pakete (`@myorg/internal-lib`) oder scoping private Registry-Namespaces, um Namespace-Squatting-Angriffe zu verhindern.

15. **Dokumentieren Sie, warum eine nicht offensichtliche Abhängigkeit vorhanden ist** — ein `# needed for X because stdlib doesn't support Y` Kommentar in `requirements.txt` oder ein PR-Beschreibungshinweis verhindert, dass zukünftige Entwickler eine Abhängigkeit entfernen, die ungenutzt aussieht.


---

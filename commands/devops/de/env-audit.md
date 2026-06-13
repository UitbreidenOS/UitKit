---
description: Umgebungsvariablennutzung in der Codebase auf Sicherheits- und Hygiene-Probleme überprüfen
argument-hint: "[Pfad oder Datei-Glob zum Scannen]"
---
Umgebungsvariablennutzung überprüfen in: $ARGUMENTS (Standard: gesamtes Projekt)

Alle Quelldateien, Konfigurationsdateien, Dockerfiles, Compose-Dateien, CI/CD-Definitionen und Deployment-Manifeste scannen.

Erkenntnisse in diesen Kategorien melden:

**1. Secrets gefährdet**
- Hardcodierte Anmeldedaten, Token, API-Schlüssel oder Passwörter in einer von Git verfolgten Datei
- `.env`-Dateien, die nicht in .gitignore enthalten sind
- Secrets, die direkt in Shell `run:`-Schritte in CI interpoliert werden (Injektionsrisiko)
- Docker `ARG`/`ENV`-Anweisungen, die Secrets in Image-Layer einbetten

**2. Fehlende Variablen**
- Variablen, auf die im Code verwiesen wird (process.env.X, os.environ["X"], os.Getenv("X"), etc.), die keinen entsprechenden Eintrag in `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap oder dokumentierten Standardwerten haben
- Erforderliche Variablen ohne Fallback, die zu Runtime Panic/Crash führen würden, wenn sie nicht gesetzt sind

**3. Ungenutzte Variablen**
- Variablen, die in `.env`, `.env.example`, Compose oder Manifesten deklariert sind, aber nie im Code gelesen werden

**4. Inkonsistenzen**
- Variablennamen, die zwischen Umgebungen unterschiedlich sind (z.B. `DATABASE_URL` in Compose vs `DB_URL` in K8s)
- Variablen mit Standardwerten in einer Umgebung, aber erforderlich in einer anderen
- Duplizierte Deklarationen über mehrere Dateien hinweg mit möglicherweise unterschiedlichen Werten

**5. Hygiene**
- Nicht-Standard-Namensgebung (sollte `SCREAMING_SNAKE_CASE` sein)
- Variablen, die vertrauliche Daten enthalten, aber nicht als `sensitive` in Terraform oder `type: kubernetes.io/Opaque` in K8s Secrets markiert sind
- `.env`-Dateien mit echten Werten committed

Ausgabeformat:
- Erkenntnisse nach obigen Kategorien gruppieren
- Für jede Erkenntnis: Dateipfad + Zeilennummer, Schweregrad (`critical` / `warning` / `info`) und einzeilige Behebung
- Mit Zusammenfassungsanzahl pro Schweregrad und priorisierter Fixliste (kritische Elemente zuerst) enden

Dateiinhalte nicht wörtlich ausgeben — Positionen zitieren und nur die relevante Zeile anführen.

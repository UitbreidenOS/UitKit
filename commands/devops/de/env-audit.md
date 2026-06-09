---
description: Prüfung der Umgebungsvariablennutzung im Codebase auf Sicherheits- und Hygienefragen
argument-hint: "[path or file glob to scan]"
---
Prüfung der Umgebungsvariablennutzung in: $ARGUMENTS (Standard: ganzes Projekt)

Alle Quellcode-Dateien, Konfigurationsdateien, Dockerfiles, Compose-Dateien, CI/CD-Definitionen und Deployment-Manifeste scannen.

Ergebnisse in diese Kategorien einordnen:

**1. Gefährdete Secrets**
- Hardcodierte Anmeldedaten, Tokens, API-Schlüssel oder Passwörter in Dateien, die von git verfolgt werden
- `.env`-Dateien, die nicht in .gitignore eingetragen sind
- Secrets, die direkt in Shell-`run:`-Schritte in CI interpoliert werden (Injektionsrisiko)
- Docker-`ARG`/`ENV`-Anweisungen, die Secrets in Image-Schichten einbetten

**2. Fehlende Variablen**
- Variablen, auf die im Code verwiesen wird (process.env.X, os.environ["X"], os.Getenv("X"), etc.), die keinen entsprechenden Eintrag in `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap oder dokumentierten Standardwerten haben
- Erforderliche Variablen ohne Fallback, die einen Laufzeit-Panic/Crash verursachen würden, wenn nicht gesetzt

**3. Ungenutzte Variablen**
- Variablen, die in `.env`, `.env.example`, Compose oder Manifesten deklariert sind, aber niemals im Code gelesen werden

**4. Inkonsistenzen**
- Variablennamen, die sich zwischen Umgebungen unterscheiden (z.B. `DATABASE_URL` in Compose vs `DB_URL` in K8s)
- Variablen mit Standardwerten in einer Umgebung, aber erforderlich in einer anderen
- Doppelte Deklarationen über mehrere Dateien hinweg mit möglicherweise unterschiedlichen Werten

**5. Hygiene**
- Nicht-standardisierte Benennung (sollte `SCREAMING_SNAKE_CASE` sein)
- Variablen, die sensitive Daten enthalten, aber nicht als `sensitive` in Terraform oder `type: kubernetes.io/Opaque` in K8s Secrets markiert sind
- `.env`-Dateien mit echten Werten committed

Ausgabeformat:
- Ergebnisse nach obigen Kategorien gruppieren
- Für jeden Fund: Dateipfad + Zeilennummer, Schweregrad (`critical` / `warning` / `info`) und einzeilige Behebung
- Mit einer Zusammenfassung der Anzahl pro Schweregrad und priorisierter Reparaturliste (zuerst Critical-Elemente) abschließen

Dateiinhalte nicht wörtlich ausdrucken — Positionen zitieren und nur die relevante Zeile anführen.

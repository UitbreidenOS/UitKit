---
description: Refaktorisieren Sie den Komponentenstatus, um die Komplexität zu verringern, das Lifting und die Kolokation korrekt durchzuführen und Prop-Drilling zu eliminieren
argument-hint: "[file-or-component-name]"
---
Refaktorisieren Sie die State-Management in: $ARGUMENTS

Lesen Sie die Zieldatei (und ihre unmittelbaren Consumer, falls identifizierbar) vor Änderungsvorschlägen.

**Schritt 1 — Vorhandenen State klassifizieren**
Für jedes gefundene `useState`, `useReducer`, `useRef`, `useContext` oder Store-Selektor kennzeichnen Sie es mit:
- `local` — wird nur in dieser Komponente verwendet
- `shared` — wird als Props an 2+ untergeordnete Komponenten übergeben
- `derived` — kann aus anderem State oder Props berechnet werden, muss nicht gespeichert werden
- `server` — Daten, die von einer API stammen und in einem Query-Cache leben sollten, nicht im Komponentenstatus
- `url` — State, der zur URL gehört (Filter, Pagination, ausgewählte IDs)

**Schritt 2 — Probleme identifizieren**
- Prop-Drilling: Props werden durch 2+ Zwischenkomponenten übergeben, die sie nicht verwenden → Kandidaten für Context oder Kolokation
- Abgeleiteter State, der als `useState` gespeichert wird und in `useEffect` gesetzt wird → mit `useMemo` oder Inline-Berechnung ersetzen
- State, der auf jedem Render zurückgesetzt wird, weil der Initializer neu erstellt wird (Objekt/Array-Literal im useState-Aufruf) → mit `useRef`-Initializer oder Konstante auf Modulebene stabilisieren
- Redundanter State, der Props dupliziert oder von anderem State berechnet werden kann
- Veraltete Closures: `useEffect` fehlen Abhängigkeiten oder verwenden `deps: []` mit Verweisen auf mutable Werte

**Schritt 3 — Refactors anwenden**
Prioritätsreihenfolge:
1. Löschen Sie zuerst den abgeleiteten State — reine Vereinfachung, null Risiko
2. Kolokalisieren Sie State, der höher als notwendig angehoben wurde — verschieben Sie ihn zurück auf das unterste Blatt, das ihn besitzt
3. Heben Sie State an, der wirklich geteilt wird — verschieben Sie ihn zum niedrigsten gemeinsamen Vorfahren, nicht willkürlich höher
4. Ersetzen Sie Prop-Drilling-Ketten durch einen engen Context (kein globaler Store), der auf den Subbaum begrenzt ist, der ihn benötigt
5. Verschieben Sie Serverdaten in die bestehende Query-Bibliothek (React Query, SWR, RTK Query — verwenden Sie je nachdem, was bereits im Projekt vorhanden ist)
6. Verschieben Sie URL-förmigen State zum Router (Next.js `useSearchParams`, React Router `useSearchParams`)

**Schritt 4 — Ausgabe**
Wenden Sie alle Änderungen direkt auf die Dateien an. Nach Bearbeitungen zusammenfassen:
- Entfernte State-Variablen: N
- Aus Zwischenkomponenten eliminierte Props: N
- Entfernte `useEffect`-Aufrufe: N
- Jede architektonische Entscheidung, die das Team beachten muss (z.B. neuer eingeführter Context)

Fügen Sie keine State-Management-Bibliothek hinzu, die nicht bereits im Projekt vorhanden ist.

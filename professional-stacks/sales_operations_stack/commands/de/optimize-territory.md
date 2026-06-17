Now I'll provide the German translation of the optimize-territory.md file:

```markdown
# /optimize-territory

**Auslöser:** Monatlich ausführen, nach Neueinstellungen oder nach Quotenänderungen. Bei Bedarf, wenn Territoriumsunausgeglichenheit vermutet wird.

**Zweck:** Führe Territoriumsausgleichsanalyse durch: Kontozu­weisungen, Fairness-Score für Quoten, Überlappungs­erkennung, Personalkapazitätsplan und Neuausrichtungs­empfehlungen.

**Was es tut:**
1. Lädt Kontomasterliste: Name, zugewiesener Vertreter, Territorium, Umsatzpotenzial (ARR)
2. Berechnet Fairness-Metriken: Quotenvarianz, Territoriumspotenzialvarianz, Kontanzähler-Varianz
3. Identifiziert Überlappungen: Konten, die mehreren Vertretern zugewiesen sind
4. Identifiziert Lücken: nicht zugewiesene Konten, geografisch unterversorgter Bereich, Tier-Unausgeglichenheiten
5. Analysiert Konzentrations­risiko: % des Territoriums­umsatzes in den Top 5 Konten
6. Bewertet jedes Territorium 0–100 auf der Ausgleichsdimension
7. Generiert Neuausrichtungs­empfehlungen mit Auswirkungsprognosen
8. Speichert Bericht in `reports/territory-analysis-{YYYY-MM-DD}.md`

**Eingaben:** Kontoliste mit Vertreterzu­weisungen, Quoten und Umsatzpotenzial

**Ausgabe:** `reports/territory-analysis-{date}.md` — Fairness-Scorecard, Lücken/Überlappungen, Neuausrichtungsplan mit Rollout-Zeitplan

**Besitzer:** VP Vertrieb + Sales Ops | **Häufigkeit:** Monatlich nach Einstellung + bei Bedarf

**Beispiel:**

```bash
/optimize-territory
```

Ausgabe:
- Quotenausgleich: 22% Varianz (Rot — Ziel <10%)
- Territoriumspotenzialvarianz: 18% (Gelb — Ziel <15%)
- Wachstumskonzentration: Sarah Chen 52% in Top 3 (Rot — Ziel <40%)
- Empfohlene Änderungen: 4 Kontoüberträge zum Ausgleich

Nächster Schritt: Besprechen Sie den Neuausrichtungsplan mit dem VP Vertrieb; Implementierung Woche vom {date}.

---

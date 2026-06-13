# /optimize-territory

**Trigger:** Maandelijks uitvoeren, na nieuwe aannamen, of na quotawijzigingen. On-demand wanneer vermoeden van oneerlijke territoriumverdeling.

**Doel:** Territorialanceanalyse uitvoeren: accounttoewijzingen, quotabillijkheidsscore, overlapdetectie, personeelscapaciteitsplan en herindelingsaanbevelingen.

**Wat het doet:**
1. Laadt accountmasterlijst: naam, toegewezen vertegenwoordiger, territorium, inkomstenpotensieel (ARR)
2. Berekent billijkheidsmetrieken: quotavariantie, territoriumpotenriaalvariantie, accountaantalvariantie
3. Identificeert overlaps: accounts toegewezen aan meerdere vertegenwoordigers
4. Identificeert gaten: niet-toegewezen accounts, geografisch onderbedeeld, ongelijke niveaus
5. Analyzeert concentratierisico: % van territoriumomzet in top 5 accounts
6. Scoort elk territorium 0–100 op evenwichtsdimensie
7. Genereert herindelingsaanbevelingen met impactprognoses
8. Slaat rapport op in `reports/territory-analysis-{YYYY-MM-DD}.md`

**Invoer:** Accountlijst met vertegenwoordigersvoerassignaties, quota's en inkomstenpotenzieel

**Uitvoer:** `reports/territory-analysis-{date}.md` — Billijkheidsscoreekaart, gaten/overlaps, herindelingsplan met uitvoeringstijdlijn

**Eigenaar:** VP Sales + Sales Ops | **Frequentie:** Maandelijks na aannamen + on-demand

**Voorbeeld:**

```bash
/optimize-territory
# /build-forecast

**Trigger:** Wekelijks uitvoeren voor leadership sync, of maandelijks voor boardupdates. Altijd 2+ weken voor kwartaaleinde uitvoeren.

**Doel:** Genereer 13-maands rolling forecast met 3 scenario's (best-case, commit, upside). Toon trending en variance vs. plan.

**Wat het doet:**
1. Haalt huidige pipelinefoto (alle open deals met sluitingskans en verwachte waarde)
2. Past drie waarschijnlijkheidsdrempels toe:
   - **Commit (60%):** Alleen deals >50% waarschijnlijkheid → Conservatieve schatting
   - **Best-Case (90%):** Deals >30% waarschijnlijkheid → Waarschijnlijke upside
   - **Upside:** Deals >10% waarschijnlijkheid → Streefscenario
3. Segmenteert per maand (komende 13 maanden) en vertegenwoordiger
4. Berekent variance vs. maandelijkse doelen
5. Vergelijkt huidend forecast vs. vorige week/maand (velocity trending)
6. Vergelijkt forecastnauwkeurigheid: vorige maandforecast vs. werkelijke sluiting
7. Identificeert vertrouwensgaten: % forecast <50% waarschijnlijkheid, concentratierisico
8. Genereert 13-maandenoverzicht + verdeling per vertegenwoordiger + varianceanalyse
9. Slaat op naar `reports/forecast-{YYYY-MM-DD}.md`
10. Logt naar `session-log.md`

**Invoer:** Huidige CRM-pipeline met geschatte dealwaarschijnlijkheid

**Uitvoer:** `reports/forecast-{date}.md` — 13-maands rolling forecast (alle 3 scenario's), maandelijkse uitsplitsingen, variance trending, risicobeoordelingen

**Eigenaar:** Finance Lead + Sales Leadership | **Frequentie:** Wekelijks + maandelijkse boardvoorbereiding

**Voorbeeld:**

```bash
/build-forecast
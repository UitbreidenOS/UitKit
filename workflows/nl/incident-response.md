# Werkstroom voor incidentbestrijding

End-to-end werkstroom voor het beheren van een productieincident van detectie tot post-mortem.

## Wanneer gebruiken

Gebruik deze werkstroom wanneer:
- Een waarschuwing afgaat die gebruikersimpact aangeeft
- Een klant meldt dat iets kapot is
- Implementatie veroorzaakte onverwacht gedrag
- Foutpercentages of latentie overschrijden SLO-drempels

## Fase 1: Detecteren en verklaren (0-5 minuten)

**Stap 1 — Verifieer het incident:**
```
Beïnvloedt dit eigenlijk gebruikers? Controleer:
- Dashboard foutpercentage (boven 1%?)
- Latentiedashboard (p99 boven SLO?)
- Directe gebruikersrapporten via ondersteuning
- Synthetische monitorresultaten
```

**Stap 2 — Classificeer ernst:**
- **SEV1**: Volledige serviceonderbreking of gegevensverlies. Iedereen.
- **SEV2**: Aanzienlijke verslechtering (>25% van gebruikers beïnvloed). IC toegewezen.
- **SEV3**: Geringere impact, workaround beschikbaar. Behandel tijdens werkuren.

**Stap 3 — Verklaar en communiceer:**
```
Plaats in #incidents:
[SEV{N}] {Servicenaam} — {eenregelbeschrijving}
Impact: {wie en wat wordt beïnvloed}
IC: {uw naam}
Oorlogsruimte: {link}
Volgende update: {tijd, max 30 min voor SEV1}
```

## Fase 2: Onderzoek (5-30 minuten)

**Stel deze vragen op volgorde:**

1. Is er onlangs iets veranderd? (implementatie, configuratie, verkeerspieken)
   ```bash
   git log --oneline -10  # recente commits
   # Controleer: implementatielogboeken, wijzigingen van functiemarkeringen, configuratiewijzigingen
   ```

2. Wat is het explosieradius?
   - Welke gebruikers worden beïnvloed?
   - Welke functies/eindpunten mislukken?
   - Welke afhankelijkheden zijn betrokken?

3. Wat tonen de logboeken?
   ```bash
   # Zoek de eerste fout
   # Controleer: foutberichten, stack traces, timing
   ```

4. Hoe zien de gegevens eruit?
   ```bash
   # Controleer: DB-verbindingsaantal, wachtrijdiepte, cachehitpercentage
   ```

**Hypothesen gerangschikt op waarschijnlijkheid:**
1. Recente implementatie (als in de afgelopen 2 uur geïmplementeerd)
2. Upstream-afhankelijkheid (controleer statuspagina's)
3. Verkeerspieken of capaciteitsprobleem
4. Gegevensbeschadiging of onverwachte status
5. Infrastructuurfout

## Fase 3: Beperken (kortste pad naar vermindering van gebruikersimpact)

**Opties op volgorde van snelheid:**

1. **Terugdraaien** (snelste als veroorzaakt door implementatie):
   ```bash
   # Git-gebaseerde rollback of feature flag kill switch
   ```

2. **Functie uitschakelen** (functiemerk):
   ```
   Stel feature.broken_thing = false in
   ```

3. **Opschalen** (als capaciteitsprobleem):
   ```bash
   kubectl scale deployment api --replicas=10
   ```

4. **Een hotfix toepassen** (als terugdraaien niet mogelijk):
   - Vertakken van de tag die in productie was
   - Minimale fix, versnelde review
   - Implementeer met extra monitoring

**Beperking betekent niet oplossing.** Beperking vermindert gebruikersimpact; resolutie verhelpt de grondoorzaak.

## Fase 4: Communiceer (doorlopend)

**Klantupdate (voor SEV1/SEV2):**
```
We ondervinden {korte beschrijving}. Ons team onderzoekt dit actief.
Detectietijd: {tijd}
Impact: {gebruikersgerichte beschrijving}
Volgende update: {15-30 min van nu af aan}
Statuspagina: {link}
```

**Resolutie-update:**
```
[OPGELOST] {Servicenaam} — {opgelost moment}
Duur: {X uren Y minuten}
Impact: {wat werd beïnvloed}
Grondoorzaak: {kort — volledig post-mortem binnen 48 uur}
Status: Alle systemen werken normaal.
```

## Fase 5: Oplossen en verifiëren

**Voor het sluiten van het incident:**
- [ ] Foutpercentages keren terug naar normale basislijn
- [ ] Latentie terug naar normaal
- [ ] Geen abnormale logboeken
- [ ] Betroffenen kunnen de beïnvloede werkstroom voltooien
- [ ] On-call team is ervan overtuigd dat het probleem is opgelost

## Fase 6: Post-mortem (binnen 48 uur voor SEV1/SEV2)

**Post-mortem-document:**
1. **Samenvatting**: Wat gebeurde er, hoe lang, wat was de impact
2. **Tijdlijn**: Minuut per minuut van detectie tot oplossing
3. **Grondoorzaak**: De werkelijke onderliggende oorzaak (niet het symptoom)
4. **Bijdragende factoren**: Wat maakte dit erger of moeilijker om op te sporen/op te lossen
5. **Wat goed ging**: Detectiesnelheid, communicatie, tools die hielpen
6. **Wat fout ging**: Gaten in monitoring, trage detectie, communicatiefouten
7. **Actiepunten**: Specifieke, eigenaar-toewijzbare, tijdgebonden verbeteringen

**Blameless-cultuur:**
- Post-mortems identificeren systeemfouten, niet individuele fouten
- Het doel is om herhaling te voorkomen, niet schuld toe te wijzen
- Publiceer post-mortems breed — het hele bedrijf leert ervan

## Gerelateerde vaardigheden

- `/runbook-generator` — runbooks voor specifieke faalmodi maken
- `/slo-architect` — SLO's en burn rate-waarschuwingen ontwerpen
- `/observability-designer` — uw systeem instrumenteren voor snellere detectie
- `/agents/roles/incident-commander` — AI-assistent voor oorlogsroomcoördinatie

---

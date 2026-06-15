# Claudient Stack-certificeringsngiveaus

Dit document definieert de certificeringsniveaus voor stacks in de Claudient Marketplace. Gecertificeerde stacks hebben voldaan aan gekwantificeerde kwaliteitsnormen en onderhoudsverplichtingen.

## Certificeringsniveaus

### Bronsniveau

**Criteria:**
- Slaagt voor alle geautomatiseerde validatiecontroles
- Voltooit menselijke beoordeling zonder obstakels
- Auteur verbindt zich tot 6-maandse onderhoudsfase

**Voordelen:**
- Bronscertificeringsbadge weergegeven in marketplace
- Stack opgenomen in gecertificeerde stacks-index
- Prioriteit in zoekresultaten
- Opgenomen in aanbevolen rotaties

**Onderhouds-SLA:**
- Reageert op kritieke bugrapportages binnen 2 weken
- Behandelt brekende afhankelijkheidsupdates binnen 1 maand
- Werkt documentatie bij voor API-wijzigingen binnen 2 weken

**Verlopen:** 6 maanden na certificeringsdatum

---

### Zilverniveau

**Criteria:**
- Voldoet aan alle Brons-niveauvereisten
- Minimaal 50 installaties gedurende 90 dagen
- Gemiddelde gebruikersbeoordeling van 4.0 of hoger
- Geen kritieke problemen langer dan 1 maand
- Laatste update binnen 6 maanden voor certificeringsaanvraag

**Voordelen:**
- Zilvercertificeringsbadge (hogere prominentie)
- Aanbevolen in categorieën "Trending" en "Aanbevolen"
- Opgenomen in zilver-niveaugecertificeerde stacks-index
- Geschiktheid voor partnerschapskansen
- Co-onderhoudsinitiatief van kernteam (optioneel)

**Onderhouds-SLA:**
- Reageert op alle problemen binnen 1 week
- Kritieke fouten opgelost binnen 2 weken
- Afhankelijkheidsupdates geëvalueerd en toegepast binnen 2 weken
- Regelmatige updates (minimale maandelijkse activiteit)

**Verlopen:** 12 maanden na certificeringsdatum

---

### Goudniveau

**Criteria:**
- Voldoet aan alle Zilver-niveauvereisten
- Minimaal 200 installaties gedurende 180 dagen
- Gemiddelde gebruikersbeoordeling van 4.5 of hoger
- Officiële onderhoudergoedkeuring (officieel Claudient-teamlid of geverifieerd gemeenschapsonderhoudster met historische gegevens)
- Uitgebreide documentatie en voorbeelden
- Meertalige ondersteuning (minimum: Engels + 1 extra taal)

**Voordelen:**
- Goudcertificeringsbadge (hoogste prominentie)
- Prominent aanbevolen op marketplace-startpagina
- Opgenomen in goud-niveaugecertificeerde stacks-index
- Exclusieve marketing en promotieondersteuning
- Directe toegang tot kernteam voor functieverzoeken en ondersteuning
- Geschiktheid voor inkomstendelingsregelingen (indien van toepassing)

**Onderhouds-SLA:**
- Reageert op alle problemen binnen 48 uur
- Kritieke fouten opgelost binnen 5 werkdagen
- Afhankelijkheidsupdates geëvalueerd en toegepast binnen 1 week
- Driemaandelijkse updates (minimum)
- Proactieve beveiligingsaudits (jaarlijks)

**Verlopen:** 24 maanden na certificeringsdatum

---

## Berekening Kwaliteitsscore

Elke stack ontvangt een samengestelde kwaliteitsscore (0-100) op basis van:

| Metriek | Gewicht | Meting |
|--------|--------|-------------|
| Codekwaliteit | 20% | Testdekking, linting, documentatievolledigheid |
| Gebruikersacceptatie | 20% | Installatieaantal, wekelijks actieve gebruikers, trendsnelheid |
| Gebruikerstevredenheid | 20% | Gemiddelde beoordeling, beoordelingsstemminggevoel, probleemoplossingspercentage |
| Onderhoud | 20% | Dagen sinds laatste update, afhankelijkheidsfrisheid, reactietijd op problemen |
| Documentatie | 20% | Volledigheid, duidelijkheid, kwaliteit van voorbeelden, nauwkeurigheid |

**Score-interpretatie:**
- 80-100: Goudniveau-kandidaat
- 60-79: Zilverniveau-kandidaat
- 40-59: Bronsniveau-kandidaat
- Onder 40: Niet geschikt voor certificering

---

## Hercertificering

Alle gecertificeerde stacks ondergaan jaarlijkse hercertificering:

**Bronstacks:**
- Moet minimale installatieaantal behouden (10)
- Gemiddelde beoordeling blijft boven 3.5
- Geen onopgeloste kritieke problemen
- Auteur bevestigt onderhoudsintentie

**Zilverstacks:**
- Moet minimale installatieaantal behouden (50)
- Gemiddelde beoordeling blijft boven 4.0
- Driemaandelijkse updates vereist
- Onderhouds-SLA gehandhaafd

**Goudstacks:**
- Moet minimale installatieaantal behouden (200)
- Gemiddelde beoordeling blijft boven 4.5
- Maandelijkse updates vereist
- Onderhouds-SLA gehandhaafd
- Onderhoudergoedkeuring vernieuwd

Als een stack hercertificering niet doorstaat, wordt deze één niveau gedowngraad. Als deze op Bronsniveau niet doorstaat, wordt certificering ingetrokken.

---

## Decertificering

Certificering wordt onmiddellijk ingetrokken indien:

1. **Schending gedragscode:** Verboden inhoud ontdekt in stack of auteurgedrag
2. **Kritiek beveiligingsprobleem:** Niet-gepatsch beveiligingsprobleem dat gebruikerssystemen beïnvloedt
3. **Licentieschending:** Gebruik van incompatibele of niet-openbare licenties
4. **Verlaten:** Geen auteurreactie gedurende 3 maanden na hercertificeringsbeoordeling
5. **Vijandig onderhoud:** Auteur verhindert actief verbeteringen of negeert kritieke problemen

Ingetrokken stacks worden uit gecertificeerde indexen verwijderd, maar blijven in marketplace (indien geen schendingen). Auteurs kunnen na 6 maanden verbeteringen om hercertificering verzoeken.

---

## Certificeringsproces

Zie [becoming-certified.md](../guides/marketplace/becoming-certified.md) voor de stap-voor-stap certificeringswerkstroom.

Zie [certification-criteria.md](../guides/marketplace/certification-criteria.md) voor gedetailleerde kwaliteitsrubrieken en meetmethodologieën.

---

**Laatst bijgewerkt:** 15 juni 2026

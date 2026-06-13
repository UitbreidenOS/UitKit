---
name: gl-reconciler
description: "Reconciliatie van het grootboek: procedures voor rekeningreconciliatie, controle van journaalposten, checklist voor périodestillegging, variatieanalyse en tussenmaatschappelijke eliminaties — voor financiële teams en fondsbeheerders"
---

# GL Reconciler-skill

## Wanneer activeren
- Uitvoering van maand- of kwartaaleinde sluitingsprocedures
- Reconciliatie van balansrekeningen (contanten, vorderingen, schulden, vaste activa, voorzieningen)
- Controle van journaalposten op juistheid en volledigheid
- Onderzoek van onverklaarde verschillen tussen subgrootboeken en het grootboek
- Opstellen van een sluitingschecklist voor het financiële team
- Tussenmaatschappelijke eliminaties voor geconsolideerde rapportage

## Wanneer NIET gebruiken
- Belastingaangifte of indiening — gespecialiseerde belastingvaardigheid vereist
- Controlewerk — onafhankelijkheidsregels voor auditors zijn van toepassing; dit is een beheerstool
- Real-time transactieverwerking — dit is een reconciliatie- en controleverenigheid
- Geen vervanger voor een gekwalificeerde accountant voor materiële herstellingen

## Instructies

### Checklist voor maandafsluiting

```
Maak een sluitingschecklist voor het einde van de maand voor [bedrijf/entiteit].

Entiteittype: [startup / MKB / fonds / vennootschapsmancip]
Boekhoudkundig systeem: [QuickBooks / Xero / NetSuite / Sage / Excel]
Sluitingsdoelstelling: [X werkdagen na maandeinde]
Team: [solo-boekhoudkundige / klein team / financieel team met controller]
Belangrijke rekeningen: [opsommen van materiële rekeningen — contanten, vorderingen, schulden, loon, opgestelde inkomsten, enz.]

Checklist voor maandafsluiting:

DAG 1-2 (na maandeinde):
□ Bevestig dat alle transacties van de maand zijn geboekt
□ Download en reconcilier bankafschriften (alle rekeningen)
□ Procesgegevens van creditcards en codering
□ Bevestig dat salarisposten correct zijn geboekt

DAG 2-3:
□ Reconcilier subgrootboek vorderingen met grootboek
   - Sluit ouderdomsrapport aan bij saldo vorderingen?
   - Niet-toegepaste kasmiddelen opgelost?
□ Reconcilier subgrootboek schulden met grootboek
   - Sluit ouderdom schulden aan bij saldoschuld?
□ Ouderdom van schulden posten geboekt?
□ Vaste-activa-rollforward — toevoegingen, vervreemdingen, afschrijving geboekt?

DAG 3-4:
□ Controleer en boek voorzieningen:
   □ Salarisbegroting (gewerkte dagen, nog niet betaald)
   □ Afschrijving van vooruitbetaalde uitgaven
   □ Opgestelde inkomstenherkenning (SaaS: verdeeld over contractperiode)
   □ Rentebegroting (als schuld ausstaat)
   □ Niet-gefactureerde vorderingen (geleverde diensten, factuur nog niet verzonden)
□ Tussenmaatschappelijke eliminaties (indien geconsolideerd)

DAG 4-5:
□ Proefbalanscontrole — zijn er ongebruikelijke saldi?
□ P&L-fluxanalyse — zijn materiële afwijkingen ten opzichte van vorige maand verklaard?
□ Balans-afstemming — zijn alle rekeningen gereconcilieerd?
□ Controllercontrole en goedkeuring
□ Jaarrekening opgesteld en verdeeld

GOEDKEURINGSHEK:
Bevestig voor afronding: [MENSELIJKE GOEDKEURING VEREIST]
Controller / CFO moeten goedkeuren voordat de periode wordt vergrendeld.

Genereer een sluitingschecklist voor mijn entiteittype en boekhoudkundig systeem.
```

### Rekeningreconciliatie-sjabloon

```
Reconcilier [rekeningnaam] voor [periode].

Rekening: [bv. Contanten, Vorderingen, Opgestelde Kosten, Opgestelde Inkomsten]
Saldo GL volgens proefbalans: $[X]
Subgrootboek- of extern saldo: $[X]
Reconciliatie-items (verschillen): [beschrijven of onbekend]

Reconciliatie-indeling:

REKENING: [Naam]
PERIODE: [Maand/Jaar]
Voorbereider: [Naam] | Datum: [Datum]
Controleur: [Naam — MENSELIJKE CONTROLE VEREIST] | Datum: ___

| | Bedrag |
|---|---|
| Saldo GL volgens proefbalans | $[X] |
| Minus: Items in GL niet in subgrootboek | ($[X]) |
| Plus: Items in subgrootboek niet in GL | $[X] |
| Aangepast GL-saldo | $[X] |
| Subgrootboek / Extern saldo | $[X] |
| **Onverklaard verschil** | **$[X]** |

RECONCILIATIE-ITEMS:
| Item | Beschrijving | Bedrag | Status |
|---|---|---|---|
| [1] | [bv. Uitstaande cheque #1234 — nog niet verzilverd] | ($[X]) | Naar verwachting verzilverd [datum] |
| [2] | [bv. Stortingentransit — geboekt [datum], nog niet verzilverd] | $[X] | Naar verwachting verzilverd [datum] |
| [3] | [bv. Bankkosten nog niet geboekt in GL] | ($[X]) | Boeking eintragen |

GOEDKEURING:
□ Alle reconciliatie-items geïdentificeerd en verklaard
□ Journaalposten opgesteld voor items waarvoor boeking vereist is
□ Geen onverklaard verschil meer aanwezig
□ GOEDGEKEURD DOOR: ______________ DATUM: ______________

Algemene reconciliatie-items per rekeningtype:
- Contanten: openstaande cheques, stortingentransit, bankkosten, ontoereikende middelen
- Vorderingen: niet-toegepaste betalingen, niet-toegepaste creditnota's, tijdsverschillen
- Schulden: niet-gefactureerde voorzieningen, niet-afgestemde inkooporders, tijdsverschillen
- Opgestelde inkomsten: nieuwe contracten, gerealiseerde inkomsten, vroege beëindigingen
- Opgestelde kosten: salaristerming, niet-gefactureerde diensten

Genereer het reconciliatie-sjabloon voor mijn specifieke rekening.
```

### Controle van journaalposten

```
Controleer deze journaalposten op juistheid en volledigheid.

Periode: [maand/jaar]
Posten ter controle: [beschrijven of opsommen — kunnen tekstbeschrijvingen van JEs zijn]
Boekhoudkundige standaard: [GAAP / IFRS / contantenbasis]

Controlechecklist voor journaalposten:

Voor elke post:
□ Debets = Credits (basisbalanseringcontrole)
□ Rekeningnummers zijn correct voor de aard van de transactie
□ Beschrijving is duidelijk genoeg zodat een auditor deze zonder vragen begrijpt
□ Ondersteunende documentatie bijgevoegd of vermeld
□ Juiste periode — geboekt in de juiste maand?
□ Goedgekeurd door bevoegd persoon (volgens goedkeuringsmatrix)
□ Voor teruggaande posten — bestaat de teruggang in de volgende periode?

Risicovolle posten om nauwkeurig te controleren:
🔴 Posten die rechtstreeks door senior financieel personeel zijn geboekt (normale werkstroom omzeild)
🔴 Rondeposten zonder gedetailleerde ondersteuning
🔴 Posten geboekt op de laatste dag van de periode (risico van inkomstenmanipulatie)
🔴 Posten tussen gerelateerde partijen of tussenmaatschappelijk
🔴 Posten die een eerdere ongebruikelijke post opheffen
🔴 Grote aanpassingen met beschrijving „per management" of „per controller"

Voor elke gemarkeerde post:
Post: [JE-nummer / beschrijving]
Probleem: [wat is ongebruikelijk of ontbreekt]
Vereist: [aanvullende ondersteuning / goedkeuring / verklaring]
Status: [Opgelost / Escalatie naar controller / Aanvraag bij voorbereider]

Controleer mijn journaalposten en markeer die welke aanvullende controle vereisen.
[MENSELIJKE CONTROLE VEREIST VOORDAT PERIODE WORDT VERGRENDELD]
```

### Variatieanalyse

```
Leg het verschil uit in [rekening / P&L-regel] voor [periode].

Rekening: [naam]
Begroting / Vorige periode: $[X]
Werkelijk: $[X]
Variantie: $[X] ([X]% ongunstig / gunstig)

Variatieanalysekader:

Stap 1 — Kwantificeer op basis van aandrijving:
Prijs-/tarifverschil: [zelfde volume, ander tarief of kostprijs per eenheid]
Volumeverschil: [zelfde tarief, ander aantal]
Mengverschil: [verandering in samenstelling — bv. meer ondernemings- vs. MKB-klanten]
Tijdsverschil: [eenmalige post of periodeverplaatsing]

Stap 2 — Onderzoek elke aandrijving:
- Transactiedetails voor de rekening ophalen
- Identificeer de top 3-5 transacties die het verschil bepalen
- Classificeer elk: terugkerend / eenmalig / fout / timing

Stap 3 — Variatieverkaring opstellen:
Indeling voor raads-/managementrapportage:
„[Rekening] was $[X] tegen begroting van $[X], een ongunstig verschil van $[X]. Primaire aandrijvingen:
1. [Aandrijving 1] — $[X] impact — [korte verklaring]
2. [Aandrijving 2] — $[X] impact — [korte verklaring]
[X] van het verschil zal naar verwachting [omdraaien/aanhouden] in [volgende maand/kwartaal]."

Waarschuwingssignalen in variatieanalyse:
- Variantie die „netto uitwerkt" over rekeningen (compenserende fouten)
- Variantie consistent in dezelfde richting gedurende 3+ maanden (structureel probleem, niet timing)
- Variantie zonder duidelijke zakelijke verklaring (onderzoek op fouten of fraude)

[CONTROLEER alle cijfers met brongegevens voordat u ze in managementrapporten opneemt]
Analyseer mijn variantie en stel de managementverklaring op.
```

### Tussenmaatschappelijke reconciliatie

```
Reconcilier tussenmaatschappelijke rekeningen voor [geconsolideerde entiteit].

Moedermaatschappij: [naam]
Dochterbedrijven: [opsommen]
Boekhoudkundig systeem: [gelijk voor alle / afzonderlijke systemen]
Periode: [maand/jaar]
Tussenmaatschappelijke transacties in deze periode: [beschrijven — leningen, beheerskosten, gedeelde diensten, verkoop]

Proces voor tussenmaatschappelijke reconciliatie:

Stap 1 — Wijs tussenmaatschappelijke saldi toe:
Bevestig voor elk maatschappijpaar:
Maatschappij A → Maatschappij B: $[X] (Maatschappij A: schuld of vorderingen?)
Maatschappij B → Maatschappij A: $[X] (moet de spiegel van bovenstaande zijn)

Stap 2 — Identificeer onverstemmingen:
| Maatschappij A | Maatschappij B | Saldo A | Saldo B | Verschil | Reden |
|---|---|---|---|---|---|
| Moeders | Kind 1 | $[X] | $[X] | $[X] | [timing / fout / FX] |

Veelvoorkomende oorzaken van onverstemmingen:
- Timing: één maatschappij geboekt in de periode, de ander nog niet
- FX: maatschappijen in verschillende valuta's — noteer welk tarief werd gebruikt
- Ontbrekende post: één zijde van de transactie nog niet opgenomen
- Betwist bedrag: maatschappijen stemmen niet in met het transactiebedrag

Stap 3 — Eliminatieposten:
Voor consolidatie, elimineer alle tussenmaatschappelijke saldi:
Dr. Tussenmaatschappelijke schulden $[X] (in Moedermaatschappij)
Cr. Tussenmaatschappelijke vorderingen $[X] (in Kind 1)
[MENSELIJKE CONTROLE VEREIST VOORDAT ELIMINATIEPOSTEN WORDEN GEBOEKT]

Stap 4 — Bevestig eliminatievolledigheid:
Na eliminaties moeten tussenmaatschappelijke vorderingen en schulden netto nul zijn.
Restwaarde = fout of niet-gereconcilieerde post → onderzoek voor afsluiting.

Genereer de tussenmaatschappelijke reconciliatie-sjabloon voor mijn entiteitsstructuur.
```

## Voorbeeld

**Gebruiker:** Onze maandafsluiting duurt 12 werkdagen, wat te lang is. Financieel team: 1 controller, 2 boekhoudkundigen. Boekhoudkundig systeem: NetSuite. Hoe bereik ik 5 dagen?

**Claudes plan voor versnelling van afsluiting:**

12 dagen → 5 dagen is haalbaar in NetSuite met procesveranderingen. De schuldige is bijna altijd sequentiële afhankelijkheden die parallel zouden kunnen lopen, en handmatige taken die kunnen worden geautomatiseerd.

**Diagnose — waar gaan de dagen heen:**
- Dagen 1-3: wachten op bankafschriften, creditcarddownloads, salarisrapporten (externe afhankelijkheden)
- Dagen 4-6: handmatige reconciliatie van vorderingen en schulden (geen automatische matching)
- Dagen 7-9: voorzieningen en aanpassingsposten (knelpunt in sequentiële controle)
- Dagen 10-12: controllercontrole en revisiecycli

**5-daags afsluitingsplan:**

*Voor maandeinde (laatste 2 dagen van de maand):*
- Voorbesluit: voorstel loon, post afschrijving, vorige maandvoorzieningen terugdraaien — allemaal geautomatiseerd in NetSuite via terugkerende JE-sjablonen
- Voor-reconciliatie vorderingen: voer dagelijks vorderingsouderdomsrapport uit, markeer openstaande items, wacht niet op dag 1

*Dag 1:*
- Bankfeeds automatisch geïmporteerd in NetSuite → automatische matchingregels verwerken >80% van transacties
- Creditcardtransacties geïmporteerd via CSV — 1 boekhoudkundige eigenaar, 2-3 uur
- Salaris-JE geboekt van salarisleverancier-export

*Dag 2:*
- Reconciliatie subgrootboek vorderingen (automatische matching in NetSuite)
- Openstaande schuld opgelost
- Afschrijving vaste activa bevestigd (NetSuite berekent automatisch)

*Dag 3:*
- Alle voorzieningen geboekt (gebruik JE-sjablonen — hetzelfde elke maand, alleen bedragen bijwerken)
- Tussenmaatschappelijke eliminaties (indien van toepassing)

*Dag 4:*
- Proefbalansfluxcontrole — controller controleert afwijkingen >5% en >$5K
- Aanpassingen geboekt

*Dag 5:*
- Definitieve controllergoedkeuring
- Jaarrekening verdeeld

**Sleutelbefaarstellers:**
1. NetSuite bankfeed + automatische matchingregels (reduceert Dag 1 van 2 dagen tot 2 uur)
2. Terugkerende JE-sjablonen voor alle standaardvoorzieningen (geen handmatige post = geen fouten om op te lossen)
3. Parallelle sporen: boekhoudkundige vorderingen en schulden werken tegelijkertijd op Dag 2
4. "First time right"-cultuur: controller controleert tijdens de maand, niet alleen bij afsluiting

---

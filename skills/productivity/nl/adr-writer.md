---
name: adr-writer
description: "Schrijf Architecture Decision Records in Nygard-formaat. Activeert bij architecturale keuzes, benaderingsvergelij­kingen of niet-gedocumenteerde eerdere besluiten."
---

# ADR Writer

## Wanneer activeren

- Een besluit nemen tussen twee of meer technische benaderingen (bijv. ORM kiezen, cachestrategie kiezen, wachtrijsysteem selecteren)
- Nadat een besluit mondeling in een vergadering of chat is genomen en formele documentatie nodig is
- Wanneer de codebase een ongebruikelijk patroon toont en er geen verklaring is voor waarom het werd gekozen
- Voordat je je vastlegt op een moeilijk om te keren architecturale verandering (databaseschema, verificatiemodel, API-versiering)
- Wanneer een besluit meerdere teams of services beïnvloedt en een duidelijk auditspoor nodig is

## Wanneer niet gebruiken

- Implementatiedetails die gemakkelijk kunnen worden gewijzigd zonder gevolgen (variabelenamen, mapstructuur binnen één module)
- Besluiten die puur stylistisch zijn zonder afwegingen
- Versie-updates van externe afhankelijkheden, tenzij ze verbredend gedrag introduceren
- Besluiten die volledig omkeerbaar zijn in minder dan een uur zonder gevolgen

## Instructies

### Wat komt in aanmerking als ADR

Een besluit rechtvaardigt een ADR als alle drie waar zijn:
1. Het is **moeilijk om te keren** — het ongedaan maken vereist aanzienlijke inspanning of veroorzaakt gevolgen
2. Het zou **verrassend zijn zonder context** — een nieuwe ontwikkelaar die de code leest zou zich afvragen waarom
3. Een **echt compromis bestond** — minstens één plausibel alternatief werd overwogen en verworpen

Bij twijfel, schrijf de ADR. De kosten van het documenteren van een niet-gebeurtenis zijn laag; de kosten van ontbrekende documentatie voor een cruciale beslissing zijn hoog.

### ADR-formaat (Nygard)

```markdown
# ADR-[NNNN]: [Korte titel in nominale vorm]

**Datum:** [YYYY-MM-DD]
**Status:** [Aanvaard | Vervangen door ADR-NNNN | Verouderd]
**Vervangt:** [ADR-NNNN indien van toepassing, anders weglaten]

## Context

[2–4 zinnen: welke situatie of probleem dwong tot dit besluit?
Relevante beperkingen opnemen: teamgrootte, tijdschema, bestaande stack, externe vereisten.]

## Besluit

[Één zin, actieve vorm, tegenwoordige tijd.
"We zullen X voor Y gebruiken omdat Z." Niet "Er werd besloten dat..."]

## Redenatie

[Waarom deze optie boven de alternatieven?
Concentreer je op de specifieke factoren die deze keuze voor deze context juist maakten.
Vermijd generieke lof — "het is populair" is geen redenatie.]

## Overwogen alternatieven

| Optie | Reden voor afwijzing |
|---|---|
| [Alternatief A] | [Specifieke reden voor afwijzing] |
| [Alternatief B] | [Specifieke reden voor afwijzing] |

## Gevolgen

**Positief:**
- [Wat dit makkelijker of beter maakt]

**Negatief:**
- [Wat dit moeilijker maakt of nieuwe complexiteit introduceert]

**Neutraal:**
- [Veranderingen die noch goed noch slecht zijn, gewoon anders]

## Herzieningsdatum

[Datum 6–12 maanden vanaf nu, of de gebeurtenis die herziening zou moeten activeren: "Herzien wanneer team meer dan 10 ingenieurs telt" of "Herzien na eerste productieincident met X"]
```

### Opslag en nummering

- Opslaan in `docs/decisions/` of `docs/adr/` — één kiezen en nooit mengen
- Bestandsnaam: `ADR-0001-kebab-case-titel.md`, `ADR-0002-...`
- Nummering is sequentieel en wordt nooit hergebruikt — zelfs niet als een ADR verouderd is
- Bij vervanging van een ADR: werk de status van de oude ADR bij naar `Vervangen door ADR-NNNN`, koppel de nieuwe ADR terug naar de oude

### Vervangen ADRs koppelen

Wanneer een besluit verandert:
```markdown
# ADR-0007: Van REST naar GraphQL voor Client-API

**Status:** Aanvaard
**Vervangt:** ADR-0003 (REST-first API-ontwerp)
```

En werk de oude ADR bij:
```markdown
**Status:** Vervangen door ADR-0007
```

### Wat NIET opnemen

- Implementatiedetails (exacte bibliotheekversie, configuratiewaarden) — deze horen in README of inline opmerkingen
- Namen van teamleden — gebruik rollen ("backend-team", "CTO") als attributie nodig is
- Voorspellingen over de toekomst — blijf bij wat nu bekend is
- Gekopieerde marketingtekst van een leveranciers website

## Voorbeeld

**Scenario:** Het team koos Drizzle ORM boven Prisma voor een nieuw TypeScript-project.

**Gegenereerde ADR:**

```markdown
# ADR-0004: Drizzle ORM boven Prisma voor gegevenstoegangslaag

**Datum:** 2026-05-23
**Status:** Aanvaard

## Context

Selectie van een ORM voor een nieuwe TypeScript-API die communiceert met PostgreSQL.
Het project heeft een klein team (2 ingenieurs), strikte prestatie-eisen voor bulk insert-operaties, en een reeds als SQL-migraties gedefinieerd schema.
Het team heeft eerdere ervaring met beide opties.

## Besluit

We zullen Drizzle ORM gebruiken voor alle databasetoegang omdat het ons type-veilige query's geeft zonder codegeneratiesstap en raw SQL niet abstraheert wanneer we het nodig hebben.

## Redenatie

Drizzle behandelt SQL als de waarheid, wat aansluit bij onze bestaande handgeschreven migratiebestanden. Prisma's schema-first model zou duplicatie van tafeldefinitiess vereisen. Bij bulk insert-benchmarks tegen onze doeldatasetgrootte (500k rijen/batch), was Drizzle 2,3× sneller in onze prototype.
Prisma's gegenereerde client voegt ~100ms koude start toe wat van belang is in onze serverless deployment-context.

## Overwogen alternatieven

| Optie | Reden voor afwijzing |
|---|---|
| Prisma 5 | Codegeneratiesstap voegt CI-complexiteit toe; schema-first botst met onze bestaande SQL-migraties; tragere koude start |
| Raw pg-client | Te veel boilerplate voor query-opbouw; geen type-afleiding op query-resultaten |
| Kysely | Sterke kandidaat — alleen afgewezen omdat team geen eerdere Kysely-ervaring heeft en Drizzle's API vertrouwder is |

## Gevolgen

**Positief:**
- Query-resultaten zijn type-veilig zonder buildstap
- Directe SQL-escape luik beschikbaar zonder de ORM te verlaten
- Kleinere bundel grootte dan Prisma

**Negatief:**
- Drizzle's ecosysteem is kleiner dan Prisma's — minder community-plugins
- Migratietools (drizzle-kit) zijn minder volwassen dan Prisma Migrate

**Neutraal:**
- Team moet Drizzle's query builder syntax leren

## Herzieningsdatum

2027-05-23, of wanneer een Prisma 6 release het koude start-probleem significant adresseert.
```

---

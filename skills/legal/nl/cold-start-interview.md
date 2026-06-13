# Koudstart-Interview — Juridische Plug-in Setup

## Wanneer activeren

- Eerste keer gebruik van enige juridische vaardigheid voor een nieuwe organisatie
- Juridische plug-in uitvoer bevat `[PLACEHOLDER]` markers
- Uitvoer is te generiek en niet praktijkspecifiek
- Onboarding van een nieuw juridisch team naar Claude Code

**Waarom dit belangrijk is :** Het koudstart-interview is het meest voorkomende hefboommoment voor kwaliteit van juridische vaardigheden. Generieke uitvoer is bijna altijd terug te voeren op een overgeslagen of onvolledig interview. Een 10–15 minuten durend interview transformeert elke stroomafwaartse vaardigheid van generiek naar praktijkspecifiek.

## Wanneer NIET gebruiken

- Interview is al afgerond en organisatieprofiel bestaat — controleer `~/.claude/plugins/config/legal/company-profile.md` voordat u opnieuw uitvoert
- Snelle eenmalige juridische onderzoeken waarbij personalisatie niet nodig is en geen playbook-beslissingen worden genomen

## Instructies

Het interview verzamelt vier categorieën informatie en schrijft deze naar een organisatieprofiel. Werk sequentieel door elke categorie — sla geen secties over.

---

**1. Praktijkcontext (wie u bent)**

Verzamel :
- Organisatienaam en type entiteit : advocatenkantoor / intern juridisch team / zelfstandige juridische afdeling
- Behandelde praktijkgebieden (handelscontracten, arbeidsrecht, intellectueel eigendom, M&A, gegevensbescherming, enz.)
- Rechtsgebied(en) waar u werkzaam bent — geef het primaire geldende recht op
- Typische transactiegrootterange (bijvoorbeeld leveranciersovereenkomsten van $50.000–$2 miljoen)
- Risicohouding : agressief / marktconform / conservatief

---

**2. Team- en escalatiestructuur**

Verzamel :
- Teamgrootte en functies (juridisch medewerker → advocaat → counsel → general counsel / senior partner)
- Dollarlimiet per functie — wat elke rol zonder escalatie kan goedkeuren
- Escalatiecontacten : naam en Slack-handle of e-mail per autorisatieniveau
- Voorkeursescalatie-kanaal : Slack / e-mail / regelmatige vergadering

---

**3. Playbook-posities (per contracttype)**

Documenteer voor elk contracttype dat uw team behandelt :

| Veld | Verzamel |
|-------|---------|
| Zijde | Verkoperskant of inkoopskant |
| Beperking van aansprakelijkheid | Voorkeurslimiet (bijv. 1× honoraria), acceptabele alternatieven, nooit accepteren lijst |
| Vrijwaring | Standaardpositie, acceptabele alternatieven, niet accepteren |
| Toepasselijk recht en bevoegdheid | Voorkeur, acceptabel, niet accepteren |
| Gegevensbescherming | DPA-vereisten, voorkeurs standaardclausules |
| Onderhandelingsgestal | De ene clausule die onmiddellijk escalatie vereist voor dit contracttype |

Typische contracttypes om te dekken : SaaS-leveranciersovereenkomst, NDA, arbeidsovereenkomst, serviceovereenkomst, gegevensverwerkingsovereenkomst, partnerschapsovereenkomst.

---

**4. Systemen en integraties**

Verzamel :
- Gebruikt CLM-systeem (indien van toepassing) en integratiesstatus met Claude Code
- Locatie van contractopslag (gedeelde schijf, CLM, e-mailarchief)
- Andere tools in de juridische stack waar Claude Code mee kan communiceren

---

**Uitvoer :** Schrijf een profiel naar `~/.claude/plugins/config/legal/company-profile.md` (gedeeld voor alle juridische vaardigheden) en praktijkspecifieke subprofielen per vaardigheidstype in dezelfde map.

Nadat het profiel is geschreven, bevestigt u welke juridische vaardigheden nu actief zijn en hoe zij het profiel zullen gebruiken. Alle juridische vaardigheden lezen dit profiel voordat zij een document verwerken.

**Veiligheid :** Profiel wordt alleen lokaal opgeslagen. Stuur profielinhoud nooit buiten het lokale systeem.

## Voorbeeld

**Invoer :** « Leid mij door het koudstart-interview voor ons intern juridisch team van een SaaS-bedrijf met 200 personen. We behandelen vooral SaaS-leveranciersovereenkomsten, NDA's en arbeidskwesties. We zijn aan de koperskant en geven de voorkeur aan conservatieve standpunten. »

**Verwacht gedrag :**

De vaardigheid voert het viercategorie-interview uit als een gestructureerd gesprek en verzamelt antwoorden op elk veld. Aan het einde schrijft het :

- `~/.claude/plugins/config/legal/company-profile.md` — organisatie-identiteit, teamstructuur, escalatiecontacten
- `~/.claude/plugins/config/legal/playbook-saas-vendor.md` — posities voor SaaS-leveranciersovereenkomsten
- `~/.claude/plugins/config/legal/playbook-nda.md` — posities voor NDA's
- `~/.claude/plugins/config/legal/playbook-employment.md` — posities voor arbeidskwesties

Bevestigt dan : « Profiel voltooid. De vaardigheden Contract Reviewer, Escalation Flagger en Redline Negotiator zullen dit profiel nu gebruiken voor alle beoordelingen. »

---

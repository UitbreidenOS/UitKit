# Ultraplan — uitgebreide planmodus

Ultraplan is een uitgebreide planmodus die Claude instrukt om uitputtend te denken voordat te handelen. Het leest de codebase, wijst afhankelijkheden toe, identificeert risico's en produceert een uitgebreid plan voordat code wordt aangeraakt. Het doel is het plan correct te krijgen de eerste keer op werk waarbij een verkeerd plan duur is om uit te voeren.

---

## Hoe in te schakelen

**Slash-opdracht:**
```
/ultraplan
```

Beschrijf vervolgens de taak. Ultraplan neemt het over voor de planningsfase.

**CLI-vlag:**
```bash
claude --ultraplan "Add multi-tenant support to the billing module"
```

**Gecombineerd met effort:**
```bash
claude --ultraplan --effort xhigh "Migrate auth from JWT to session-based"
```

---

## Wat Ultraplan anders doet van `/plan`

| | `/plan` | `/ultraplan` |
|---|---|---|
| **Bestandlezingen** | Alleen gereferentieerde bestanden | Alle bestanden in het betrokken pad + hun afhankelijkheden |
| **Patrooncontrole** | Geen | Leest bestaande patronen voordat nieuwes worden voorgesteld |
| **Afhankelijkheidsmapping** | Impliciet | Expliciete afhankelijkheidsgrafiek in de output |
| **Risico-evaluatie** | Geen | Speciale risicosectie met beperkingen |
| **Rollback plan** | Geen | Expliciete rollback-stappen voor elke fase |
| **Token-kosten** | ~1× | ~3–5× |
| **Uitvoerlengte** | Kort | Lang (uitgebreid) |

Ultraplans onderzoeksfase rechtvaardigt de kosten. Het leest de werkelijke codebase voordat het plant — niet alleen de bestanden die u noemt, maar de bestanden die die bestanden importeren, de tests die ze behandelen, de migratiegeschiedenis indien relevant en de bestaande patronen die het moet afstemmen.

---

## Ultraplan-uitvoerstructuur

Een voltooide Ultraplan produceert een document met deze secties in volgorde:

**1. Context Summary**
Wat Ultraplan vond tijdens zijn onderzoeksfase — sleutelbestanden, bestaande patronen, relevante eerdere besluiten.

**2. Risk Assessment**
Risico's gerangschikt op ernst. Elk risico heeft: beschrijving, waarschijnlijkheid, impact en voorgestelde beperking.

**3. Dependency Map**
Welke componenten hangen af van wat. Markeer circulaire afhankelijkheden, gedeelde state en externe integraties die de wijziging aanraakt.

**4. Ordered Steps**
Het implementatieplan in volgorde. Elke stap geeft aan: wat verandert, welke bestanden, wat na deze stap moet worden getest en of een gedeeltelijke commit hier geschikt is.

**5. Rollback Plan**
Hoe u elke fase ongedaan maakt als iets fout gaat — specifieke git-opdrachten, functievlag-wissel of migratieomkeringen.

---

## Wanneer te gebruiken

- **Complexe functies die meerdere bestanden omvatten** — vooral wanneer u niet zeker bent wat van wat afhangt
- **Onbekende codebases** — voordat u code aanraakt die u nog niet hebt gelezen, bouwt Ultaplans onderzoeksfase de context die u handmatig uren zou opbouwen
- **Transacties met hoog inzet** — auth systeem herschrijvingen, databaseschema migraties, openbare API wijzigingen, alles waarbij een verkeerde aanpak aanzienlijke herwerkingen betekent
- **Functies geschat op meer dan één dag** — de planninginvestering betaalt zich sneller af hoe langer de implementatie

---

## Wanneer NIET te gebruiken

- **Eenvoudige taken** — een single-function bug fix hoeft geen afhankelijkheidsgrafiek
- **Hotfixes** — u weet al wat kapot is; plan-overhead vertraagt u
- **Verkennend / spike-werk** — wanneer u aan het prototypen bent om te leren, wilt u snel herhalingen, niet uitgebreid vooraf plannen
- **Goed begrepen wijzigingen** — als u dit type wijziging tien keer in deze codebase hebt gemaakt, hebt u Ultaplans onderzoeksfase niet nodig
- **Kostengevoelige sessies** — bij 3–5× tokenkost, verspilt Ultraplan op triviale taken begroting

---

## Effort-integratie

`--effort` controleert hoe diep Claude binnen elke beurt denkt. Ultraplan + effort compounds:

```bash
# Maximum depth: Ultraplan's broad research + maximum per-turn reasoning
claude --ultraplan --effort xhigh "Refactor the payment processing module"
```

| Combinatie | Gebruik voor |
|---|---|
| `--ultraplan` alleen | Standaard complexe functies |
| `--ultraplan --effort high` | Architectuurbeslissingen, onbekende codebases |
| `--ultraplan --effort xhigh` | Migratieplan, beveiligingskritieke wijzigingen |

Vermijd `--ultraplan --effort low` — u handelt de onderzoeksdiepte in die Ultraplan waardevol maakt.

---

## Kostentijdruil

Ultraplan besteedt tokens aan onderzoek vooraf. Het break-even punt is ruwweg:

- Als het plan 1 uur debuggen of rework bespaart: break-even op ~€2–5 extra tokens
- Als het plan een verkeerde architectuurbeslissing voorkomt: break-even op ~€10–50 extra tokens

Voor functies geschat op meer dan één dag werk is Ultraplan bijna altijd de moeite waard. Voor halve-dag taken hangt het ervan af hoe goed u de codebase kent.

---

## RIPER met Ultraplan combineren

Het RIPER-framework (Research → Implement → Probe → Evaluate → Reflect) wijst schoon toe aan Ultraplan:

- **Research** → Ultraplans onderzoeksfase (bestandlezingen, patroonidentificatie)
- **Implement** → Voer de geordende stappen uit van de Ultraplan-output
- **Probe** → Voer tests na elke stap uit zoals gespecificeerd in het plan
- **Evaluate** → Controleer tegen Ultaplans risico-evaluatie — realiseerden zich voorspelde risico's?
- **Reflect** → Controleer het rollback plan; update als implementatie afweek van plan

Voer Ultraplan uit voordat u de RIPER Implement fase invoert. De Ultraplan-output wordt de Implement-fase brief.

```
/ultraplan
[describe the feature]

[review the plan]

/riper implement
[execute the plan step by step]
```

---

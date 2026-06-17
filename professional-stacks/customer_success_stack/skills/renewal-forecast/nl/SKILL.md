# Vaardigheid: Vernieuwingsprognose

## Wanneer activeren

Driemaandelijkse of on-demand beoordeling van vernieuwingspijplijn; markeer rekeningen binnen een 90-daagse periode.

## Wanneer NIET gebruiken

Niet gebruiken voor meerjarige contracten of vastgestelde rekeningen (gebruik vernieuwingsmetadata rechtstreeks).

## Instructies

1. Query vernieuwingsdatums op cohort
2. Kruisverwijzing met gezondheidsscore
3. Voorspel vernieuwingskans op basis van betrokkenheid
4. Genereer actielijst (laag risico, gemiddeld, hoog risico)

## Voorbeeld

```
/renewal-forecast --cohort=2024-q3 --window=90d
→ 12 renewals in window; 8 green, 3 yellow, 1 red
```

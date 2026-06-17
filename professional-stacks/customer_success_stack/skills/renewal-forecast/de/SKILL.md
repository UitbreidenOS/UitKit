# Skill: Erneuerungsprognose

## Wann aktivieren

Vierteljährliche oder bedarfsgesteuerte Überprüfungen der Erneuerungspipeline; markieren Sie Konten im 90-Tage-Fenster.

## Wann NICHT verwenden

Verwenden Sie dies nicht für mehrjährige Verträge oder bindende Konten (verwenden Sie stattdessen die Erneuerungsmetadaten direkt).

## Anweisungen

1. Abfrageerneuerungsdaten nach Kohorte
2. Referenzieren Sie mit dem Gesundheitsscore
3. Vorhersage der Erneuerungswahrscheinlichkeit basierend auf dem Engagement
4. Aktionsliste generieren (niedriges Risiko, mittleres, hohes Risiko)

## Beispiel

```
/renewal-forecast --cohort=2024-q3 --window=90d
→ 12 Erneuerungen im Fenster; 8 grün, 3 gelb, 1 rot
```

# Skill: Onboarding-Checkliste

## Wann aktivieren

Neue Kundenregistrierung oder Upgrade auf neuen Plan-Tier.

## Wann NICHT verwenden

Nicht auf bestehende Kunden während des laufenden Vertrags anwenden (verwenden Sie stattdessen Success-Plan).

## Anweisungen

1. Rollenbasierte Checkliste generieren (Admin, Benutzer, Integrator)
2. Vervollständigung durch automatische oder manuelle Häkchen nachverfolgen
3. Warnung bei Blockierern (fehlende Integration, unbezahlte Rechnung)
4. Time-to-Value messen (Tage bis zur ersten Nutzung)

## Beispiel

```
/onboard-checklist --customer=startup-xyz --plan=pro
→ 12 Elemente; 8 abgeschlossen, 4 ausstehend
→ Blocker: Salesforce-Integrations-Auth
```

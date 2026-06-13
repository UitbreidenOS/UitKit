# Thomson Reuters Rechtsforschung via MCP

## Wann aktivieren
Rechtsforschung, die Fallrecht, Satzungen, Regelungen oder Westlaw/Practical Law Inhalt erfordert; Benutzer ist Rechtsanwalt oder Rechtsrechercher, der Claude Code mit aktivem Thomson Reuters API-Abonnement nutzt; Aufgaben, die zuverlässige Zitationen aus primären und sekundären Rechtsquellen erfordern.

## Wann NICHT verwenden
Benutzer ohne Thomson Reuters API-Abonnement — dieses MCP ist nur für Unternehmen, nicht kostenlos verfügbar; Aufgaben, die keine zuverlässige Rechtsforschung erfordern; alles, das Rechtsberatung erfordert (dieses MCP bietet Forschung, nicht Beratung — markieren Sie diese Unterscheidung immer).

## Anweisungen

**Was es ist :**
Thomson Reuters startete eine offizielle MCP-Integration (Mai 2026), die Claude direkt mit Westlaw-, Practical Law- und anderen TR-Datenbanken verbindet. Abfragen gehen über Ihren TR API-Schlüssel an Live-Rechtsdatenbanken.

**Setup :**
Fügen Sie zu Ihrer MCP-Konfiguration mit Ihrem TR API-Schlüssel hinzu, der auf den TR MCP-Endpunkt zeigt. Erfordert ein aktives Thomson Reuters Enterprise API-Abonnement — wenden Sie sich an Ihren TR-Kontoberater für Zugriff.

**Verfügbare Daten :**
- Fallrecht mit vollständigen Zitationen (föderale und staatliche Gerichte, alle Ebenen)
- Föderale und staatliche Satzungen, aktuell und historisch
- Föderale und staatliche Regelungen (CFR, staatliche Admin-Codes)
- Sekundärquellen über Practical Law: Orientierungsnotizen, Standarddokumente, Verhandlungstipps, Jurisdiktionsvergleiche
- Rechtliche Formulare und Vorlagen

**Query-Muster, die gut funktionieren :**

Fallrecht :
```
Finde Fälle, die Force-Majeure-Klauseln in Softwareverträgen von 2020-2026 interpretieren.
Gib Zitationen in Bluebook-Format und eine zwei-Satz-Zusammenfassung der Entscheidung für jede zurück.
```

Satzungssuche :
```
Was ist der aktuelle Text von 17 U.S.C. § 107 (fair use)?
Vermerken Sie alle Änderungen seit 2020.
```

Regulatorisch :
```
Fasse die neueste FTC-Regel zu KI-generierten Content-Offenlegungen zusammen.
Füge die CFR-Zitation und das Stichtag hinzu.
```

Practical Law Sekundärquelle :
```
Was ist die Standard-Verhandlungsposition zu Haftungsbegrenzungsobergrenzen
in SaaS-Vereinbarungen? Referenziere die relevante Practical Law-Orientierungsnote.
```

**ZWINGENDE Ausgabewarnung — auf jeder Forschungsausgabe einfügen :**
> Nur zu Forschungszwecken — vor dem Verlassen auf eine juristische Analyse mit einem zugelassenen Anwalt überprüfen.

**Zitierformat :** Immer Bluebook-Format anfordern. Überprüfe alle Zitationen unabhängig vor dem Einreichen — MCP-abgerufene Zitationen können Formatierungsfehler enthalten und sollten nicht direkt in Gerichtsdokumente gehen.

**Privileg-Notiz :** Bestätigen Sie, ob die Forschung für eine spezifische Mandantensache (Anwalts-Mandanten-Privileg kann anhaften) oder allgemeine Hintergrundforschung ist. Diese Unterscheidung beeinflusst, wie die Ausgabe gespeichert und geteilt werden sollte.

**Mit CourtListener kombinieren :** Für umfassende Abdeckung paare Thomson Reuters (Sekundärquellen, Westlaw-Analyse) mit dem Free Law Project MCP (kostenlose Primärquellen für Bulk-Lookups). TR für Tiefe; CourtListener für Breite und Volumen.

## Beispiel

```
Finde alle Circuit Court-Fälle von 2022-2026, die die "exceeds authorized access"-Bestimmung
der CFAA interpretieren. Fasse den Circuit-Split zusammen und die Oberste Gerichtshof Position
nach Van Buren v. United States. Gib Bluebook-Zitationen für jeden Fall zurück.
```

Claude befragt Westlaw über das TR MCP, gibt eine strukturierte Circuit-Split-Analyse mit Zitationen zurück, kennzeichnet Bereiche anhaltender Uneinigkeit und hängt die zwingende Forschungswarnung an.

---

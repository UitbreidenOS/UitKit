# Free Law Project (CourtListener) — Kostenlose US-Rechtsforschung

## Wann aktivieren
Recherche von US-amerikanischen Bundes- und Staatsgerichtsentscheidungen ohne bezahltes Abonnement; Suche nach PACER-Einreichungen, Aktennummern oder Richteraufzeichnungen; Massen-Case-Law-Lookups, wo ein bezahlter Service unerschwinglich wäre; Open-Access-Rechtsforschung für akademische oder gemeinnützige Arbeit.

## Wann NICHT verwenden
Forschung, die Sekundärquellen erfordert (Law Review Analyse, Practical Law Orientierungsnotizen, Westlaw Kopfnoten) — verwende Thomson Reuters MCP dafür; Forschung außerhalb US-amerikanischer Bundesgerichte, wo CourtListener-Abdeckung spärlich oder abwesend ist; zeitkritische Arbeit, die garantierte Same-Day-Opinion-Abdeckung erfordert (einige aktuelle Meinungen haben Publikationsverzögerungen).

## Anweisungen

**Was es ist :**
Free Law Project betreibt CourtListener — die größte kostenlose, offene Datenbank für US-amerikanische Rechtsforschung. Die MCP-Integration (Mai 2026) erfordert kein Abonnement, keinen API-Schlüssel-Kauf und keine Pro-Query-Abrechnung.

**Abdeckung :**
- Meinungen der Bundes-Appellations- und Bezirksgerichte (umfassend)
- Meinungen des US-Obersten Gerichtshofs (umfassend)
- PACER-Einreichungen und Aktendaten (Bundesgerichte)
- Richterliche biografische Aufzeichnungen, Ablehnungshistorie, finanzielle Offenlegungen
- Mündliche Argumentationsaufzeichnungen (falls verfügbar)
- Staatliche Gerichtsabdeckung variiert erheblich je nach Staat — überprüfe vor der Abhängigkeit von Vollständigkeit der Staatsgerichte

**Rate Limits :**
Kostenlos ist rate-begrenzt. Struktur Abfragen, um spezifisch und gezielt zu sein — vermeiden schnelle Broad-Query-Blöcke. Batch verwandte Lookups in einzelne Anfragen, wo möglich.

**Query-Typen :**

Fallsuche nach Schlüsselwort :
```
Finde 9th Circuit Meinungen von 2023-2026 mit AI-generiertem Inhalt
und Urheberrechtsverletzung. Gib Zitationen und eine einparagraphige Entscheidungszusammenfassung zurück.
```

Zitationssuche :
```
Rufe den vollständigen Text von Twitter, Inc. v. Taamneh, 598 U.S. 471 (2023) ab.
```

Richteraufzeichnungen :
```
Welche Fälle hat Richterin Jacqueline Scott Corley entschieden, die Abschnitt 230
seit 2021 betreffen?
```

Aktensucche :
```
Finde die aktuelle Akte für FTC v. Meta Platforms im Nördlichen
Bezirk Kalifornien. Liste ausstehende Anträge auf.
```

**Limitations — wisse, bevor du abfragst :**
- US Bundesgerichte sind die primäre Stärke; Staatsgerichts-Abdeckung ist inkonsistent
- Keine Sekundärquellen, keine Law Review Artikel, kein Practical Law Inhalt
- Einige aktuelle Meinungen haben Publikationsverzögerung (Tage bis Wochen)
- Komplette PACER-Akte-Abdeckung erfordert PACER-Konto für einige versiegelte oder eingeschränkte Einreichungen

**Mit Thomson Reuters MCP kombinieren :**
CourtListener für kostenloses Primärquellen-Volumen + TR MCP für Sekundärquellen-Analyse und Westlaw-Tiefe. Beispiel-Workflow: verwende CourtListener, um relevante Fälle in Masse zu identifizieren, dann hole Westlaw-Analyse auf den Schlüssel-Fällen via TR MCP.

**ZWINGENDE Ausgabewarnung — auf jeder Forschungsausgabe einfügen :**
> Nur zu Forschungszwecken — vor dem Verlassen auf juristische Analyse mit zugelassenem Anwalt überprüfen.

**Zitierformat :** Immer vollständige Zitation einfügen: Fallname, Band, Reporter, erste Seite, Gericht, Jahr. Beispiel: `NetChoice, LLC v. Paxton, 49 F.4th 439 (5th Cir. 2022)`.

## Beispiel

```
Finde alle 9th Circuit Meinungen von 2023-2026 mit AI-generiertem Inhalt
und Urheberrechtsverletzung. Gib Bluebook Zitationen und eine einsätzige
Zusammenfassung jeder Entscheidung zurück.
```

Claude fragt CourtListener via MCP ab, gibt eine Liste übereinstimmender Meinungen mit Zitationen und Entscheidungszusammenfassungen zurück, merkt welche Fälle Cert-Petitionen ausstehend haben, und hängt die zwingende Forschungswarnung an.

---

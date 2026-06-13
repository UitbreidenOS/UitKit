---
name: competitor-monitor
description: "Wöchentliche Wettbewerbsintelligenz: Verfolgung von Preisänderungen, Positionierungsveränderungen, Nachrichten und Stellenausschreibungen als Signale — synthetisiert in eine einseitige Zusammenfassung"
---

# Competitor Monitor

## When to activate
- Sie führen eine wöchentliche oder zweiöchentliche Wettbewerbsprüfung durch und möchten Rohergebnisse in klare Signale umwandeln
- Ein Wettbewerber hat gerade eine große Ankündigung gemacht und Sie müssen verstehen, was dies für Ihr Geschäft bedeutet
- Sie bereiten eine Preisänderung vor und möchten wissen, wie Sie positioniert sind, bevor Sie sich bewegen
- Sie verlieren Geschäfte und vermuten, dass ein bestimmter Wettbewerber dafür verantwortlich ist

## When NOT to use
- Tiefe Wettbewerbsforschung für ein Fundraising-Deck — das benötigt professionelle Marktforschung
- Rechtliche oder IP-Überwachung — verwenden Sie einen Spezialisten für Marken-/Patentüberwachung
- Automatisierte Echtzeitverfolgung — diese Kompetenz erfordert, dass Sie die wöchentliche Kontrolle durchführen; sie synthetisiert, was Sie finden, sie kratzt nicht automatisch

## Instructions

### Set up your competitor list

Halten Sie es auf 3-5 Wettbewerber. Mehr als das erzeugt Rauschen, nicht Signal. Geben Sie Claude für jeden:
- Ihren Namen und Website
- Ihr Hauptprodukt oder Service und wie es mit Ihrem überlappt
- Ihre öffentlichen Preise (falls vorhanden) — Stufennamen, Preispunkte, was jede Stufe enthält
- Wofür sie bekannt sind — ihr Hauptdifferenzierungsmerkmal oder Marketing-Winkel
- Aktuelle Nachrichten, die Sie bereits über sie kennen

Tun Sie dies einmal. Speichern Sie es als Ihren Wettbewerber-Kontextblock und fügen Sie ihn am Anfang jeder wöchentlichen Sitzung ein.

### Build your weekly checklist

Bitten Sie Claude, eine 15-20-minütige wöchentliche Checkliste für Ihren spezifischen Wettbewerbersatz zu generieren. Claude passt sie an Ihre Branche an — eine SaaS-Wettbewerber-Checkliste unterscheidet sich von einer Restaurant-Wettbewerber-Checkliste.

Die Standard-Checkliste umfasst: Preisseite (hat sich etwas geändert?), Produktchangelog oder Blog (neue Funktionen oder Updates?), Jobboard (welche Rollen stellen sie ein?), Review-Seiten (neue Reviews, Bewertungstrend?), LinkedIn und News (Ankündigungen?), und Ihre eigenen Verkaufsdaten (zitiert ein verlorenes Geschäft diesen Wettbewerber?).

Sie tun die Überprüfung. Es dauert 5 Minuten pro Wettbewerber. Dann fügen Sie die Ergebnisse ein.

### Weekly digest

Fügen Sie Ihre Ergebnisse aus der Checkliste ein. Claude synthetisiert sie zu einer strukturierten einseitigen Zusammenfassung:

**Was hat sich diese Woche geändert** — sachliche Zusammenfassung von etwas anderem als letzte Woche

**Was es signalisiert** — Claude interpretiert jede Änderung. Ein Preisrückgang könnte signalisieren, dass sie unter Druck stehen, nicht dass sie gewinnen. Eine Einstellungswelle in einer bestimmten Funktion signalisiert, wo sie als nächstes investieren. Neue negative Bewertungen signalisieren Support- oder Qualitätsprobleme, die Sie in Verkaufsgesprächen nutzen können.

**Empfohlene Aktion** — eine konkrete Sache, die Sie tun sollten, falls zutreffend. Oft ist die Antwort „überwachen — noch keine Maßnahme erforderlich." Claude erzeugt keine Dringlichkeit.

### Job posting signals

Stellenausschreibungen sind eines der zuverlässigsten öffentlichen Signale für Wettbewerberstrategie. Claude liest Stellenausschreibungen und sagt Ihnen, was sie bedeuten:

- Ingenieureinstellungen in einem bestimmten Bereich: sie bauen eine Funktion, die sie noch nicht haben
- Verkaufseinstellungen in einer bestimmten Region: sie expandieren dort
- Kundenerfolgskunden: sie wachsen oder sind unterwegs — hängt vom Kontext ab
- C-Suite-Ersatz: Führungsinstabilität
- Daten- und Analyseeinstellungen: Sie werden datengesteuertere Entscheidungen treffen, möglicherweise preisbezogen

Fügen Sie den Stellentitel und die Beschreibung ein. Claude interpretiert dies im Kontext dessen, was Sie bereits über sie wissen.

### Pricing change response

Wenn ein Wettbewerber seinen Preis senkt, sagen Sie Claude:
- Die Änderung (alter Preis, neuer Preis, welche Stufe)
- Ihre aktuelle Preisgestaltung im Vergleich zu ihrer
- Ihre Gewinnsituation in kürzlichen Geschäften

Claude verfasst Redewendungen für Ihre Verkaufsgespräche — keine Panikreaction, sondern eine ruhige, sachliche Antwort auf die Frage „warum sind Sie $50 teurer?", die die spezifischen Dinge hervorhebt, die Sie besser tun.

### Lost deal debrief

Nachdem Sie ein Geschäft an einen Wettbewerber verloren haben, sagen Sie Claude:
- Was der Kunde als Grund angegeben hat
- Was Sie über den Pitch Ihres Wettbewerbers wissen
- Die Geschäftsgröße und das Kundenprofil

Claude stellt fest, ob dies ein Muster oder ein Ausreißer ist, und schlägt vor, ob eine Preis-, Messaging- oder Produktreaktion gerechtfertigt ist.

---

### Prompt template

```
Hier ist mein Wettbewerberkontext (monatlich aktualisieren):

Wettbewerber A: [Name]
- Website: [url]
- Hauptprodukt: [Beschreibung]
- Preisgestaltung: [Stufen und Preise]
- Bekannt für: [Differenzierungsmerkmal]

[für jeden Wettbewerber wiederholen]

---

Dieses Woche Ergebnisse:

Wettbewerber A:
- [Was ich auf ihrer Preisseite gefunden habe]
- [Was ich auf ihrem Jobboard gefunden habe]
- [Alle Nachrichten oder Ankündigungen]
- [Neue Bewertungen oder Bewertungsänderungen]

Wettbewerber B:
- [Ergebnisse]

Bitte geben Sie mir:
1. Was diese Woche geändert hat (sachlich)
2. Was jede Änderung signalisiert
3. Eine empfohlene Aktion, falls zutreffend
```

## Example

Sie führen ein B2B-Scheduling-Softwareunternehmen. Sie fügen Ihre wöchentlichen Ergebnisse ein:

- Wettbewerber A senkte seinen Starter-Plan von $79 auf $49 pro Monat
- Wettbewerber B postete diese Woche drei „Datentechnik"-Rollen auf LinkedIn
- Wettbewerber C erhielt diese Woche 4 neue 1-Stern-Bewertungen, alle zitieren langsame Support-Reaktionszeiten

Claude produziert:

Was hat sich geändert: Wettbewerber A senkte die Starter-Preisgestaltung um 38%. Wettbewerber B baut aktiv interne Dateninfrastruktur auf. Wettbewerber C hat diese Woche ein sichtbares Support-Qualitätsproblem (4 neue 1-Stern-Bewertungen in 7 Tagen sind ungewöhnlich konzentriert).

Was es signalisiert: Wettbewerber As Preisrückgang spiegelt wahrscheinlich Druck auf seine Entry-Level-Akquisitionszahlen wider, nicht Stärke — Unternehmen mit wachsendem Umsatz erhöhen oder halten die Preise normalerweise. Dies ist eine Gelegenheit, Ihre Preisgestaltung als Premium mit schnellerem Onboarding umzurahmen. Wettbewerber B, das interne Datentechnik aufbaut, deutet darauf hin, dass sie sich in Richtung Verringerung einer Abhängigkeit von einer Drittintegration bewegen — es lohnt sich zu überwachen, welche Integration sie ersetzen. Der Support-Cluster von Wettbewerber C ist ein Verkaufsvermögen: erwähnen Sie Ihr SLA und durchschnittliche Reaktionszeit in Ihren nächsten drei Angeboten.

Empfohlene Aktion: Aktualisieren Sie Ihre Sales-One-Pager, um einen Vergleich der Reaktionszeiten hinzuzufügen. Wenn ein Prospect den neuen $49-Preis von Wettbewerber A zitiert, verwenden Sie dieses Drehbuch: « Ihr Starter-Plan bei $49 beinhaltet [X Beschränkung]. Unser Basisplan bei $89 beinhaltet [Y und Z] und einen dedizierten Onboarding-Anruf — die meisten Kunden machen diese $40 Differenz in der ersten Woche wett. »

---

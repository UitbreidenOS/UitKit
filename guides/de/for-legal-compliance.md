# Claude für Rechts- und Compliance-Beauftragte

Alles, was ein Inhouse-Anwalt, General Counsel oder Compliance-Beauftragter braucht, um KI-gestützte Vertragsüberprüfung, regulatorische Compliance, Datenschutzprogramme und juristische Recherche in Claude Code durchzuführen.

---

## Für wen das gedacht ist

Du bist Inhouse-Rechtsberater, Compliance-Beauftragter, Datenschutzbeauftragter (DSB) oder General Counsel, dessen Aufgabe es ist, das Unternehmen vor rechtlichen Risiken zu schützen, den Betrieb regelkonform zu halten und Stakeholder schnell und präzise zu beraten. Du bist im Verhältnis zum Volumen der Rechtsarbeit chronisch unterbesetzt und verbringst zu viel Zeit mit Vertragsklassifizierung, Beweiserhebung und Recherche, die sich beschleunigen ließe.

**Vor Claude Code:** 60–90 Minuten für die Überprüfung eines Standard-NDA. Ein halber Tag für eine Compliance-Gap-Analyse. Tage für die Recherche einer neuartigen Rechtsfrage in mehreren Jurisdiktionen. Monate zur Vorbereitung auf ein SOC2-Audit.

**Danach:** First-Pass-NDA-Prüfung in 5 Minuten. Compliance-Pflichtregister in 20 Minuten. Multi-Jurisdiktions-Recherchmemo in 30 Minuten. SOC2-Evidenz-Checkliste und Gap-Analyse in 45 Minuten.

**Was Claude nicht ersetzt:** Rechtliches Urteilsvermögen, zugelassene Rechtsberatung, Gerichtseinreichungen und jedes Dokument, das ohne menschliche Überprüfung unterzeichnet und extern versandt wird.

---

## 30-Sekunden-Installation

```bash
# Installiere den vollständigen Rechts- und Compliance-Stack
npx claudient add skills legal

# Oder einzeln auswählen:
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/privacy-pia
npx claudient add skill legal/eu-ai-act
npx claudient add skill legal/iso27001
npx claudient add skill legal/dsar-response
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/legal-research
npx claudient add agents advisors/general-counsel
npx claudient add agents advisors/ciso-advisor
```

---

## Dein Claude Code Rechts-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/contract-review` | ROT/GELB/GRÜN Vertragsanalyse: Risikomarkierungen, fehlende Klauseln, Korrekturvorschläge | Jeden Vertrag vor der Unterzeichnung |
| `/nda-review` | NDA-Klassifizierung: Typ, Umfang, Red Flags, Anwalts-Review-Markierung | NDA-Warteschlangen-Klassifizierung |
| `/gdpr-expert` | DSGVO-Compliance: Artikel-für-Artikel-Analyse, Rechtsgrundlage, AVV-Anforderungen | Jede DSGVO-Frage oder neue Verarbeitungstätigkeit |
| `/soc2-compliance` | SOC2 Typ II: Kontrollzuordnung, Nachweisanforderungen, Gap-Analyse | SOC2-Audit-Vorbereitung |
| `/privacy-pia` | Datenschutz-Folgenabschätzung: Risikobewertung, Minderung, DSFA-Ausgabe | Neue Produkte oder risikoreiche Verarbeitung |
| `/eu-ai-act` | EU-KI-Verordnung: Risikoklassifizierung, verbotene Verwendungen, Compliance-Pflichten | Jedes in der EU eingesetzte KI-System |
| `/iso27001` | ISO 27001:2022 Gap-Analyse und Umsetzungsleitfaden | ISO-Zertifizierungsvorbereitung |
| `/dsar-response` | Reaktion auf Betroffenenanfragen: Klassifizierung, Schwärzungsanleitung, Antwortentwürfe | Eingehende DSARs |
| `/compliance-tracker` | Pflichtregister, Nachweischeckliste, Fristentracker für DSGVO/SOC2/ISO27001 | Laufendes Compliance-Management |
| `/legal-research` | Recherchmemos, Fallrechts-Zusammenfassungen, Jurisdiktionsvergleiche | Recherchefragen |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `general-counsel` | Opus | Komplexe Rechtsanalyse, strategische Rechtsberatung, neuartige Rechtsfragen |
| `ciso-advisor` | Opus | Sicherheitsnahe Rechtsfragen: Lieferanten-Sicherheit, Reaktion auf Datenpannen, Penetrationstest-Interpretation |

---

## Täglicher Workflow

### Morgen — Vertrags-Warteschlangen-Review (30–60 Minuten)

**1. Vertragsklassifizierung**
```
/contract-review

Klassifiziere die heutige Vertrags-Warteschlange:
[Vertragstext einfügen oder jeden Vertrag beschreiben]

Für jeden:
- Gesamtrisikoniveau (HOCH / MITTEL / NIEDRIG)
- Anzahl der ROTEN Probleme
- Ob externer Anwalt benötigt wird
- Empfohlene Maßnahme: genehmigen / redigieren / eskalieren / ablehnen

Nach Priorität sortieren — ROTE Probleme zuerst.
```

**2. NDA-Schnellklassifizierung**
```
/nda-review

Prüfe diesen NDA — Standard-First-Pass:
[NDA-Text einfügen]

Ausgabe:
- Typ (gegenseitig / einseitig)
- Laufzeit
- Alle nicht standardmäßigen Bestimmungen
- Muss ich das vollständig lesen oder ist es marktüblich?
- Zum Anwalt schicken: ja / nein
```

---

### Compliance-Monitoring (15–30 Minuten, täglich)

**3. Regulatorisches Radar**
```
/compliance-tracker

Tägliche Compliance-Prüfung:
- Wurden gestern DSARs empfangen? Status der Fristenverfolgung?
- Sind Datenpannen-Meldefenster offen?
- Zertifizierungsfristen innerhalb der nächsten 30 Tage?
- Regulatorische Änderungen, die ich diese Woche kennen sollte?
[Neue Mitteilungen oder regulatorische Warnungen einfügen]
```

**4. DSAR-Antwortverwaltung**
```
/dsar-response

Neuer DSAR erhalten von: [Name]
Erhalten: [Datum] — Antwort fällig: [Datum + 30 Tage, oder 45 Tage für CCPA]
Anfrage: [beschreibe, was gefordert wird]

Erstelle:
- Anerkennungsschreiben-Vorlage
- Interne Datenerhebungs-Checkliste (welche Systeme abzufragen sind)
- Schwärzungsanleitung (was vor der Offenlegung entfernt werden muss)
- Antwortzeitplan und Meilensteine
```

---

### Richtlinienentwicklung (variabel — 1–3 Stunden)

**5. Richtlinienerstellung oder -aktualisierung**
```
/gdpr-expert

Erstelle/aktualisiere unsere [Richtlinientyp] zur DSGVO-Konformität.

Unternehmenskontext:
- Verarbeitungstätigkeiten: [beschreiben]
- Jurisdiktion: [EU / UK / beide]
- Zuletzt aktualisiert: [Datum]
- Was sich geändert hat, das eine Aktualisierung erfordert: [Grund]

Erstelle: vollständigen Richtlinienentwurf mit Artikelzitaten. Markiere jede Bestimmung, die vor der Fertigstellung einer rechtlichen Prüfung bedarf.
```

---

### Juristische Recherche (variabel)

**6. Recherchefrage**
```
/legal-research

Recherchefrage: [Frage in einfacher Sprache]
Jurisdiktion(en): [Liste]
Kontext: [warum wir das wissen müssen — welche Geschäftsentscheidung auf dem Spiel steht]
Tiefe: [kurzes Brief / Standard-Memo / tiefe Recherche]

Erstelle ein Recherchememo mit Zitaten. Markiere [VERIFIZIEREN] bei jedem spezifischen Rechtszitat.
```

---

### Stakeholder-Beratung (auf Abruf)

**7. Schnelle Rechtsberatung für Geschäftsteams**
```
/general-counsel

Ein Geschäfts-Stakeholder fragt: [beschreibe die Geschäftsfrage]

Was er wissen muss: [was er tun möchte]
Risiko, das ihn besorgt: [worüber er sich Sorgen macht]

Gib mir eine Antwort in einfacher Sprache, die ich ihm innerhalb von 10 Minuten weiterleiten kann.
Eskalationsmerkmal: Erfordert das ein vollständiges Rechtsmemo oder externe Beratung?
```

---

## Vertragsüberprüfungs-Workflow (tägliche Warteschlange)

Für detaillierte Schritt-für-Schritt-Anleitung, siehe [workflows/contract-review.md](../workflows/contract-review.md).

**Kurzreferenz:**

```
Priorität 1 (noch am selben Tag prüfen):
- Vereinbarungen mit Unterzeichnungsfrist heute oder morgen
- Jeder Vertrag mit unbegrenzter Haftungsfreistellung
- Jeder Datenverarbeitungsvertrag (AVV) für einen neuen Anbieter
- NDA mit nicht standardmäßigen Umfangsdefinitionen

Priorität 2 (innerhalb von 3 Tagen prüfen):
- Standard-Anbieter-MSAs unter $50K Jahreswert
- Kundenverträge von einem neuen Logo (Vorlagenprüfung)
- Arbeitsangebotsbriefe

Priorität 3 (diese Woche prüfen):
- Verlängerungen bestehender Anbietervereinbarungen (Vergleich mit früheren Konditionen)
- Partnervereinbarungen (geringes kommerzielles Risiko)
- Interne Richtlinien oder Verfahren

An externen Anwalt delegieren:
- Jeder Vertrag über $250K (oder deine Wesentlichkeitsschwelle)
- Prozessdokumente, Vergleichsvereinbarungen
- Regulierte Finanz- oder Gesundheitsvereinbarungen
- IP-Abtretungen, Technologietransfer, Exklusivitätsvereinbarungen
```

---

## 30-Tage-Einarbeitungsplan (neuer Rechts-/Compliance-Mitarbeiter)

### Woche 1 — Verstehe deine Verpflichtungslandschaft
- Installiere alle Rechts-Skills: `npx claudient add skills legal`
- Führe `/compliance-tracker` aus — erstelle dein Pflichtregister für jeden anwendbaren Rahmen
- Überprüfe alle bestehenden Verträge in deinen Standardvorlagen — identifiziere, was marktüblich vs. angepasst ist
- Identifiziere offene DSARs, Datenpannen-Meldungen oder Audit-Anfragen — kümmere dich sofort um Fristen
- Lies deine aktuelle Datenschutzrichtlinie und den Datenhaltungsplan — stimmen diese mit der tatsächlichen Praxis überein?

### Woche 2 — Compliance-Baseline aufbauen
- Führe `/gdpr-expert` für deine aktuellen Verarbeitungstätigkeiten aus — erstelle oder aktualisiere dein Verarbeitungsverzeichnis (VVT)
- Führe `/soc2-compliance` oder `/iso27001` aus — erstelle eine Gap-Analyse für deine Zielrahmen
- Kartiere, welche Anbieter Datenverarbeiter sind (benötigen AVVs) vs. Verantwortliche (separate Analyse)
- Erstelle ein Risikoregister: Was sind die Top-5-Rechtsrisiken für dieses Unternehmen?

### Woche 3 — Operationalisierung
- Richte deinen DSAR-Antwort-Workflow mit `/dsar-response` ein
- Erstelle Vertrags-Playbooks für deine 3 häufigsten Vertragstypen (Anbieter-MSA, Kunden-MSA, NDA)
- Richte deinen Compliance-Fristentracker mit `/compliance-tracker` ein
- Informiere Geschäfts-Stakeholder darüber, was sie ohne rechtliche Prüfung tun können und was nicht

### Woche 4 — Proaktives Risikomanagement
- Erstelle deinen ersten Rechtsrisikobericht für CEO und Vorstand
- Führe `/privacy-pia` für alle neuen Produktfunktionen in der Entwicklung durch
- Plane vierteljährliche Zugriffsprüfungen (in Zusammenarbeit mit IT/Sicherheit)
- Richte deinen wiederkehrenden Compliance-Kalender ein: monatliche, vierteljährliche, jährliche Fristen

---

## Tool-Integrationen

### Thomson Reuters / Westlaw / LexisNexis

```
Nutze primäre Rechtsdatenbanken zur Recherche-Validierung.
Workflow:
1. Nutze /legal-research, um die Rechtsfrage und den Recherchepfad zu identifizieren
2. Validiere spezifische Zitate in Westlaw oder LexisNexis
3. Füge verifizierte Fallentscheidungen zurück in Claude für Analyse und Memo-Erstellung ein
4. Nutze Claude für das Memo; nutze Westlaw, um sicherzustellen, dass Zitate aktuell sind

Verlasse dich NICHT auf Claude-Zitate als maßgeblich ohne primäre Datenbankverifizierung.
```

### Vertragsmanagement-Systeme (Ironclad / DocuSign / Juro)

```
Workflow für Vertragsüberprüfung mit einem CLM:
1. Neuer Vertrag kommt in deinem CLM an
2. Als PDF/Text exportieren
3. /contract-review ausführen — ROT/GELB/GRÜN-Analyse erhalten
4. Überprüfungsnotizen und Redigierungen direkt im CLM hinzufügen
5. Claude nutzen, um Redigierungserklärungen für die Gegenpartei zu erstellen

Für Massenüberprüfung (Ironclad-Datenexport):
1. Vertragsmetadaten als CSV exportieren
2. /contract-review: "Prüfe diesen Vertragsstapel auf abgelaufene AVVs oder fehlende DSGVO-Klauseln"
```

### GRC-Plattformen (Vanta / Drata / Secureframe)

```
Nutze Claude neben deiner GRC-Plattform, nicht stattdessen:

Claude-Stärken: Richtliniendokumentation schreiben, Anforderungen erläutern, Gap-Analyse, Management-Kommentar
GRC-Plattform-Stärken: Automatisierte Evidenzerhebung, kontinuierliche Überwachung, Auditor-Portal

Workflow:
1. GRC-Plattform meldet eine Kontrolllücke
2. /compliance-tracker: erklärt die Kontrollanforderung und schlägt einen Abhilfeansatz vor
3. /gdpr-expert oder /soc2-compliance: entwirft die Richtlinie oder das Verfahren zum Schließen der Lücke
4. Richtlinie als Nachweis in die GRC-Plattform hochladen
```

### Notion / Confluence (juristische Wissensbasis)

```
Baue deine juristische Wissensbasis in Notion oder Confluence auf:
1. Nutze /legal-research, um Recherchememos zu erstellen
2. Speichere Memos in Notion mit Tags: [Jurisdiktion] [Thema] [Datum]
3. Jedes Memo enthält: Frage, Antwort, wichtige Zitate, [VERIFIZIEREN]-Marker und Überprüfungsdatum

Stelle eine vierteljährliche Erinnerung ein, um stark frequentierte Memos zu überprüfen und zu aktualisieren.
Im Laufe der Zeit wird dies die Präzedenzbibliothek deiner Kanzlei.
```

### Slack (Rechtsanfrage-Eingang)

```
Richte einen #legal-requests Slack-Kanal ein.
Claude Code kann über einen Webhook überwachen und klassifizieren:

Eingehende Anfrage → Claude liest die Nachricht → klassifiziert:
  - Schnelle Beratung (< 5 Min. Antwort): sofort antworten
  - Standard-Review (Vertrag, NDA): in juristische Warteschlange weiterleiten
  - Komplex / neuartig: zur Aufmerksamkeit des GC markieren
  - Dringend (Datenpanne, Rechtsstreit): sofortige Eskalation

Nutze n8n oder Make, um das Routing zu automatisieren.
```

---

## Zu verfolgende Benchmarks

| Kennzahl | Ziel |
|---|---|
| NDA-First-Pass-Prüfungszeit | < 10 Minuten |
| Standard-Vertragsüberprüfungszeit (MSA) | < 45 Minuten |
| DSAR-Bestätigung | Am selben Tag des Eingangs |
| DSAR-Antwort | Innerhalb von 25 Tagen (5 Tage Puffer vor der 30-Tage-Frist lassen) |
| Datenpannen-Meldebereitschaft | Vorgefertigte Vorlage, versandfertig innerhalb von 2 Stunden |
| Offene Compliance-Lücken (kritisch) | 0 |
| Offene Compliance-Lücken (nicht kritisch) | < 5, alle mit Eigentümer + Frist |
| Anbieter-AVV-Abdeckung | 100% der Datenverarbeiter |
| Richtlinienüberprüfungszyklus | Jährlich (alle Richtlinien überprüft und abgezeichnet) |
| Vorstand-Rechtsrisikobericht | Vierteljährlich |

---

## Häufige Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Alle Verträge als gleich riskant behandeln**
`/contract-review` gibt sofort einen Gesamtrisiko-Score (HOCH / MITTEL / NIEDRIG). Erst klassifizieren, dann proportional prüfen.

**Fehler 2: Compliance-Rahmen als einmalige Projekte**
`/compliance-tracker` macht Compliance zu einem laufenden Pflichtregister mit Fristen — kein einmaliges Audit.

**Fehler 3: Juristische Recherche ohne Zitatvalidierung**
Jede `/legal-research`-Ausgabe enthält `[VERIFIZIEREN]`-Marker. Diese sind Aufforderungen, die primäre Quelle zu prüfen — nicht optional.

**Fehler 4: Kein Prüfpfad für DSAR-Antworten**
`/dsar-response` generiert einen Nachweispfad für jede Anfrage: Eingangsdatum, Frist, erhobene Daten, vorgenommene Schwärzungen.

**Fehler 5: Beratung geben ohne Dokumentation**
Nutze Claude, um Rechtsmemos auch für schnelle Beratungsfragen zu entwerfen. Eine mündliche 2-Satz-Antwort ist nicht auffindbar. Ein kurzes Memo schon.

---

## Ressourcen

- [Erste Schritte mit Claude Code](../getting-started.md)
- [Vertragsüberprüfungs-Workflow](../workflows/contract-review.md)
- [DSGVO-Experten-Skill](../skills/legal/gdpr-expert.md)
- [Vertragsüberprüfungs-Skill](../skills/legal/contract-review.md)
- [Compliance-Tracker-Skill](../skills/legal/compliance-tracker.md)
- [Juristische Recherche-Skill](../skills/legal/legal-research.md)
- [DSAR-Antwort-Skill](../skills/legal/dsar-response.md)

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

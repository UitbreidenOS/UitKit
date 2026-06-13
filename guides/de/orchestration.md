# Orchestrierungsprotokoll

Ein leichtes Muster zur Koordination von Personas, Agenten und Fähigkeiten bei komplexer multidisziplinärer Arbeit.

Kein Framework erforderlich. Keine Abhängigkeiten. Nur strukturiertes Prompting.

---

## Kernkonzept

Die meiste echte Arbeit überquert Domänengrenzen. Ein Produktstart benötigt Engineering, Marketing und Strategie. Eine Architekturüberprüfung benötigt Sicherheit, Kostenanalyse und Teambewertung.

Orchestrierung verbindet die richtige Fachkompetenz mit jeder Arbeitspshase:

- **Agenten** definieren *wer* denkt — Identität, Urteilsvermögen, Kommunikationsstil
- **Fähigkeiten** definieren *wie* ausgeführt wird — Schritte, Vorlagen, Beispiele, Muster
- **Phasen** definieren *wann* umzuschalten — wenn die Arbeit von einer Domäne zur anderen übergeht

Sie kombinieren sie. Das Muster ist immer gleich.

---

## Das Muster

### 1. Ziel definieren

Sagen Sie aus, was Sie erreichen möchten, nicht wie Sie es erreichen.

```
Ziel: Ein neues SaaS-Produkt für kleine Buchhaltungskanzleien starten.
Einschränkungen: 2-köpfiges Team, $5K Budget, 6-Wochen-Zeitplan.
Erfolgskriterien: 50 zahlende Kunden in den ersten 30 Tagen.
```

### 2. Den richtigen Agenten auswählen

Wählen Sie den Agenten aus, dessen Urteilsvermögen zur aktuellen Phase passt. Agenten tragen Meinungen, Prioritäten und Entscheidungsrahmen.

| Situation | Agent | Grund |
|---|---|---|
| Architekturentscheidungen, Tech-Stack, Kaufen vs. Bauen | `cto-advisor` | Engineering-Urteil |
| Startstragie, Wachstumskanäle, Inhalte | `cmo-advisor` | GTM- und Kanalexpertise |
| Finanzmodell, Unit Economics, Fundraising | `cfo-advisor` | Zahlengetriebene Entscheidungen |
| Produktplan, Priorisierung, Benutzerforschung | `cpo-advisor` | Benutzererfolgsfokus |
| Betrieb, Prozess, Teamstruktur | `coo-advisor` | Ausführung zuerst |
| Alles auf einmal, allein | `ceo-advisor` | Multidisziplinäre Priorisierung |

**Aktivierung:**
```
/agents/advisors/cto-advisor
```

### 3. Fähigkeiten zur Ausführung laden

Agenten wissen *was* zu tun ist. Fähigkeiten wissen *wie* man es mit Präzision tut. Laden Sie die Fähigkeiten, die Ihre aktuelle Phase benötigt.

```
/skills/devops-infra/aws-architect       — Infrastrukturmuster
/skills/backend/nodejs/nextjs            — Frontend-Framework
/skills/devops-infra/cicd               — Bereitstellungspipeline
```

Der Agent treibt Entscheidungen voran. Die Fähigkeiten bieten strukturierte Schritte, Vorlagen und konkrete Muster.

### 4. In Phasen arbeiten

Teilen Sie das Ziel in Phasen auf. Jede Phase kann verschiedene Agenten und Fähigkeiten verwenden.

```
Phase 1: Technische Grundlage (Woche 1-2)
  Agent: cto-advisor
  Fähigkeiten: aws-architect, codebase-onboarding, cicd
  Ausgabe: Architekturdoku, bereitgestelltes Skelett, CI-Pipeline

Phase 2: Startvorbereitung (Woche 3-4)
  Agent: cmo-advisor
  Fähigkeiten: copywriting, content-strategy, seo-audit
  Ausgabe: Landingpage, Inhaltskalender, Startplan

Phase 3: Go-to-Market (Woche 5-6)
  Agent: ceo-advisor
  Fähigkeiten: email-sequence, analytics-tracking, pricing-strategy
  Ausgabe: Gestartetes Produkt, Tracking, erste Kunden
```

### 5. Zwischen Phasen übergeben

Wenn Sie die Phase wechseln, fassen Sie immer zusammen, was entschieden wurde und was offen ist:

```
Phase 1 abgeschlossen.
Entscheidungen: AWS serverless (Lambda + DynamoDB), Next.js-Frontend, GitHub Actions CI
Erstellte Artefakte: architecture-doc.md, in Staging bereitgestellt
Offene Fragen: Preismodell (Phase 3-Entscheidung)

Wechsel zu Phase 2. Laden von cmo-advisor + copywriting + content-strategy-Fähigkeiten.
```

---

## Häufige Orchestrierungsmuster

### Muster A: Solo-Sprint

Eine Person, ein Ziel, mehrere Domänen. Wechseln Sie Agenten, wenn Sie die Phasen durchlaufen.

```
Woche 1: cto-advisor + Engineering-Fähigkeiten → Produkt bauen
Woche 2: cmo-advisor + Marketing-Fähigkeiten  → Start vorbereiten
Woche 3: ceo-advisor + GTM-Fähigkeiten        → Versenden und iterieren
```

Beste Verwendung: Nebenprojekte, MVPs, Solo-Gründer, One-Person-Startups.

### Muster B: Domänentauchgang

Eine Domäne, maximale Tiefe. Einzelner Agent, mehrere gestapelte Fähigkeiten.

```
Agent: cto-advisor
Gleichzeitig geladene Fähigkeiten:
  - aws-architect       → Infrastrukturdesign
  - cloud-security      → Sicherheitshaltung
  - slo-architect       → Zuverlässigkeitsziele
  - chaos-engineering   → Fehlermodus-Tests

Aufgabe: Vollständige Produktionsbereitschaftsprüfung
```

Beste Verwendung: Architekturüberprüfungen, Compliance-Audits, technische Tiefentauchgänge vor dem Start.

### Muster C: Multi-Agent-Überprüfung

Verschiedene Agenten überprüfen das gleiche Problem unter verschiedenen Blickwinkeln.

```
Schritt 1: cto-advisor entwirft die technische Architektur
Schritt 2: cfo-advisor überprüft das Kostenmodell Bauen vs. Kaufen
Schritt 3: ceo-advisor trifft die endgültige Kompromissentscheidung
```

Beste Verwendung: Hochrisikobeschlüsse, Investorenvorbereitung, Empfehlungen auf Boardebene, große Pivots.

### Muster D: Fähigkeitenkette

Kein Agent erforderlich. Verknüpfen Sie Fähigkeiten sequenziell für prozedurale Arbeit.

```
1. /product-discovery    → Problem identifizieren und validieren
2. /experiment-designer  → Test entwerfen
3. /analytics-tracking   → Messung einrichten
4. /product-analytics    → Ergebnisse interpretieren
```

Beste Verwendung: Wiederholbare Workflows, Inhalts-Pipelines, Compliance-Checklisten, Forschungsprozesse.

---

## Beispiel: Vollständiger Produktstart (6 Wochen)

**Einrichtung:**
```
Ziel: Ein B2B-Rechnungstool für Freelancer starten
Team: 1 Entwickler + 1 Marketer
Zeitplan: 6 Wochen
Budget: $5K
```

**Woche 1-2: Bauen**
```
Agent: cto-advisor
Fähigkeiten: aws-architect, nextjs, postgresql, stripe

Lieferumfang:
- Architekturentscheidung (serverlos: Lambda + DynamoDB + Stripe)
- Bereitgestelltes MVP: Auth, Rechnungswesen, Zahlungserfassung
- CI/CD-Pipeline (GitHub Actions → AWS)
```

**Woche 3-4: Startvorbereitung**
```
Agent: cmo-advisor
Fähigkeiten: copywriting, seo-audit, content-strategy, email-sequence

Lieferumfang:
- Landingpage live (Hero, Preisgestaltung, sozialer Beweis)
- 3 Blogbeiträge geplant (SEO-gezielt)
- Willkommens-E-Mail-Sequenz konfiguriert (5 E-Mails, 14-Tage-Tropf)
- Starttagliste
```

**Woche 5: Starten**
```
Agent: ceo-advisor
Fähigkeiten: pricing-strategy, analytics-tracking, onboarding-cro

Lieferumfang:
- Preisgestaltung finalisiert (3-stufig: Solo $19 / Pro $49 / Team $99)
- Analytics-Tracking end-to-end verifiziert
- Product Hunt-Einreichung vorbereitet
- Onboarding-Checkliste aktiviert (5-Schritte-In-App)
```

**Woche 6: Iterieren**
```
Agent: ceo-advisor
Fähigkeiten: product-analytics, experiment-designer, customer-success

Lieferumfang:
- Woche 1-Metriken: Anmeldungen, Aktivierungsrate, erste Zahlung
- Identifizierter Top-Friktionspunkt (Onboarding-Schritt 3)
- Entwickeltes und gestartetes Experiment
- Monate 2-Roadmap skizziert
```

---

## Regeln

1. **Ein Agent auf einmal.** Wechsel ist in Ordnung, aber vermischen Sie nicht zwei Agenten in demselben Gesprächszug.
2. **Fähigkeiten stapeln sich frei.** Laden Sie so viele Fähigkeiten, wie die Aufgabe benötigt. Sie widersprechen nicht.
3. **Agenten sind optional.** Für prozedurale Arbeit sind Fähigkeitenketten allein ausreichend.
4. **Der Kontext wird fortgesetzt.** Wenn Sie Phasen wechseln, fassen Sie immer Entscheidungen und Artefakte zusammen.
5. **Sie entscheiden.** Orchestrierung ist ein Vorschlag. Überschreiben Sie jede Phase, jeden Agenten oder jede Fähigkeit zu jeder Zeit.

---

## Kurzübersicht

**Agentenaktivierung:**
```
/agents/advisors/cto-advisor
/agents/advisors/cmo-advisor
/agents/advisors/cfo-advisor
/agents/advisors/cpo-advisor
/agents/advisors/coo-advisor
/agents/advisors/ceo-advisor
/agents/advisors/general-counsel
/agents/roles/incident-commander
/agents/roles/senior-backend
/agents/roles/senior-frontend
/agents/roles/red-team
```

**Fähigkeitenaktivierung:**
```
/skills/devops-infra/aws-architect
/skills/marketing/content-strategy
/skills/product/product-discovery
[siehe Verzeichnis skills/ für vollständigen Katalog]
```

**Phasenübergabevorlage:**
```
Phase [N] abgeschlossen.
Entscheidungen: [wichtige getroffene Entscheidungen aufzählen]
Artefakte: [erstellte Dateien oder Dokumentation aufzählen]
Offene Punkte: [was die nächste Phase auflösen muss]
Wechsel zu: [Agent] + [Fähigkeiten]
```

---

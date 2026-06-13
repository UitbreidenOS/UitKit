---
name: product-roadmap
description: "Produktroadmap-Erstellung: Priorisierungs-Frameworks (RICE, MoSCoW, Opportunity Scoring), Roadmap-Formate, OKR-Ausrichtung, Stakeholder-Kommunikation und vierteljährliche Planung"
---

# Produktroadmap-Fähigkeit

## Wann zu aktivieren
- Erstellung oder Umstrukturierung einer Produktroadmap
- Priorisierung eines Produktrückstands von Funktionen und Chancen
- Ausrichtung der Roadmap auf Unternehmens-OKRs
- Roadmap-Kommunikation an verschiedene Stakeholder (Ingenieurwesen, Vertrieb, Führungsebene, Kunden)
- Durchführung eines vierteljährlichen Planungsprozesses
- Entscheidung, was zu schneiden ist, wenn die Kapazität begrenzt ist

## Wann NICHT verwenden
- Sprint-Ebenen-Aufgabenplanung — das ist Lieferungsmanagement, nicht Roadmap
- Entdeckung (Entscheidung, welche Probleme zu lösen sind) — verwenden Sie die Fähigkeit product-discovery
- Schreiben technischer Specs oder User Stories — das kommt nach der Roadmap-Entscheidung
- A/B-Test-Design — verwenden Sie die Fähigkeit experiment-designer

## Anleitung

### Priorisierungs-Framework

```
Priorisieren Sie diesen Produktrückstand mit [RICE / MoSCoW / Opportunity Scoring].

Zu priorisierende Elemente: [Liste — können Funktionen, Projekte oder Problembereiche sein]
Einschränkungen: [Teamgröße, Zeithorizont, Budget]
Strategische Ziele dieses Quartals: [OKRs oder Hauptprioritäten]

RICE-Scoring (für Funktionsentscheidungen):
| Element | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| Funktion A | 500 Benutzer/Q | 3 (hoch) | 80% | 3 Wochen | (500×3×0,8)/3 = 400 |
| Funktion B | 1000 Benutzer/Q | 1 (niedrig) | 90% | 1 Woche | (1000×1×0,9)/1 = 900 |

Reach: betroffene Benutzer pro Quartal
Impact: massiv=3 / hoch=2 / mittel=1 / niedrig=0,5 / minimal=0,25
Confidence: % Sicherheit über Reach- und Impact-Schätzungen
Effort: Ingenieur-Wochen für einen Ingenieur

MoSCoW (für Releases mit festem Umfang):
- Must have: ohne dies schlägt das Release fehl
- Should have: hoher Wert, einbeziehen wenn Kapazität erlaubt
- Could have: schön zu haben, zuerst zu schneiden
- Won't have: explizit außerhalb des Geltungsbereichs (verhindert Scope Creep)

Opportunity Scoring (Priorisierung auf Problemebene):
Score = Wichtigkeit + (Wichtigkeit − Zufriedenheit)
Elemente mit Score > 10 = starke Chance

Wenden Sie [gewähltes Framework] auf meinen Produktrückstand an und geben Sie eine priorisierte Liste mit Begründung aus.
```

### Roadmap-Format-Design

```
Entwerfen Sie ein Roadmap-Format für [Publikum und Zeithorizont].

Publikum: [interne Ingenieurwesen / Vertriebsteam / Kunden / Führungsteam / alle]
Zeithorizont: [vierteljährlich / jährlich / rollend 6 Monate]
Verbindlichkeitsstufe: [verpflichtet / direkt / angestrebt]
Aktuelles Tool: [Linear / Jira / Notion / ProductBoard / Tabellenkalkulation]

Roadmap-Formate nach Publikum:

Ingenieurwesen Roadmap (hohe Genauigkeit, kurzfristig verpflichtet):
| Thema | Funktion | Quartal | Status | Eigentümer | Abhängigkeiten |
|---|---|---|---|---|---|
Hohe Konfidenz in Q1, direkt für Q2-Q3, Platzhalter für Q4.

Vertriebs-Roadmap (direkt, keine Daten):
Format "Jetzt / Nächstes / Später" — vermeidet Verpflichtungen zu bestimmten Daten mit Kunden.
Jetzt: was in aktiver Entwicklung ist
Nächstes: was danach kommt (diesen Monat oder Nächsten — kein spezifisches Datum)
Später: was wir erwägen (keine Verpflichtung)

Executive Roadmap (ergebnisfokussiert, nicht Feature-Listen):
Zeigen Sie OKRs → Initiativen → erwartete Ergebnisse
Nicht: "Funktion X bauen"
Ja: "Zeit bis Aktivierung um 40% reduzieren → Onboarding-Redesign + E-Mail-Sequenz"

Kundenfreundliche Roadmap:
Nur Themen, keine Daten ("in Kürze" / "geplant" / "erforscht")
Daten niemals einfügen, wenn die Funktion nicht Wochen entfernt ist
Sicherheit: Verpflichten Sie sich nicht öffentlich zu Funktionen, die möglicherweise gekürzt werden

Entwerfen Sie das Roadmap-Format für mein spezifisches Publikum und generieren Sie eine Vorlage.
```

### OKR-Ausrichtung

```
Richten Sie Roadmap-Elemente auf OKRs aus.

Unternehmens-OKRs für [Quartal/Jahr]: [Liste — Ziel + Schlüsselergebnisse]
Produkt-OKRs (falls getrennt): [Liste]
Derzeit geplante Roadmap-Elemente: [Liste von Funktionen oder Initiativen]

Alignment-Prüfung:

Für jedes Roadmap-Element:
- Zu welchem OKR trägt es bei? (muss mit mindestens einem verlinkt sein)
- Welches Schlüsselergebnis bewegt es? (seien Sie spezifisch)
- Wie sicher sind wir, dass es dieses KR bewegt? (hoch / mittel / niedrig)
- Elemente ohne OKR-Link: schneiden oder deprioritisieren, außer es gibt eine zwingende Ausnahme

Für jedes OKR:
- Welche Roadmap-Elemente tragen bei? (sollte 1-3 Elemente pro KR sein)
- Gibt es ein KR ohne Roadmap-Abdeckung? (Lücke — Initiativen hinzufügen erforderlich)
- Gibt es ein KR mit Über-Abdeckung? (zu viele Elemente, die das gleiche Ergebnis verfolgen — konzentrieren)

Ausgabe: 
- Roadmap-zu-OKR-Mapping-Tabelle
- Lücken (OKRs ohne Abdeckung)
- Über-Investitionen (zu viele Elemente auf einem OKR)
- Empfehlungen für Schnitte oder Hinzufügungen

Richten Sie meine Roadmap auf die von mir bereitgestellten OKRs aus.
```

### Vierteljährlicher Planungsprozess

```
Führen Sie einen vierteljährlichen Planungsprozess für [Produktteam] durch.

Teamgröße: [X Ingenieure + X PMs + X Designer]
Planungshorizont: [Q3 2026 — Juli bis September]
Aktuelle OKRs: [Einfügen]
Kapazität: [X Ingenieur-Wochen verfügbar nach Bereitschaftsdienst, Schuldenabbau, Bugs]

Zeitplan für die vierteljährliche Planung (4-Wochen-Prozess):

Woche 1 — Eingabensammlung:
□ Kompilieren: Kundenfeedback, Support-Tickets, NPS-Verbatim, Gründe für Vertriebsverluste/Gewinne
□ Ausführen: Datenüberprüfung (welche Metriken sind gesund / ungesund?)
□ Sammeln: Stakeholder-Anfragen (von Vertrieb, CS, Marketing)
□ Identifizieren: Schuldenabbau, der das Team aktiv verlangsamt

Woche 2 — Chancen-Sizing:
□ Cluster-Eingaben in Themen (noch keine Funktionen — Probleme)
□ Score jedes Thema: Benutzerauswirkung × Häufigkeit × strategische Passung
□ Identifizieren Sie die Top 3-5 Chancen für das Quartal

Woche 3 — Scoping und Sequenzierung:
□ Für jede Gelegenheit: ungefähre T-Shirt-Größe (S/M/L/XL)
□ Kapazitätsanpassung: X Ingenieur-Wochen insgesamt
□ Sequenz: was muss zuerst gehen (Abhängigkeiten, Risiko)?
□ Verhandlung: schneiden, bis Kapazität erreicht ist + 20% Puffer

Woche 4 — Ausrichtung und Kommunikation:
□ Engineering-Überprüfung: technische Machbarkeit überprüfen
□ Executive Sign-Off: OKR-Ausrichtung bestätigt
□ Vertrieb/CS-Briefing: was kommt, was nicht
□ Veröffentlichung: interne Roadmap aktualisiert
□ Team Kickoff: Q3-Planung abgeschlossen

Ausgabe: fertig gestellte vierteljährliche Plan-Vorlage mit Elementen, Besitzern und Kapazitätszuweisung.
```

## Beispiel

**Benutzer:** Wir haben 8 Ingenieure, 2 PMs, Q3 OKRs konzentriert sich auf Aktivierungsrate (+30%) und NPS (+10 Punkte). Produktrückstand hat 23 Elemente. Helfen Sie mir, Prioritäten zu setzen.

**Prozess von Claude:**

Zuerst — filtern Sie rücksichtslos vor der Bewertung.

**Filter 1 — OKR-Relevanz:**
Von Ihren 23 Elementen, in Kategorien trennen:
- Aktivierungsauswirkung: [Elemente, die Zeitwert, Onboarding, Engagement in der ersten Woche beeinflussen]
- NPS-Auswirkung: [Elemente, die Kunden explizit angefordert oder beschwert haben]
- Keines von beiden: [Elemente, die technisch interessant sind, aber diese beiden KRs nicht verschieben]

Der Stapel "keines von beiden" sollte vor der Bewertung zum Q4 gekürzt oder verschoben werden.

**Filter 2 — Effort-Realitätsprüfung:**
Bei 8 Ingenieuren für 13 Wochen = ~104 Ingenieur-Wochen. 20% für Bugs/Vorfälle reservieren = ~83 Wochen verfügbar.
XL-Elemente (>8 Wochen jeweils) = können im Quartal nur 2-3 machen. Schneiden Sie den Rest oder verringern Sie den Umfang.

**RICE-Scoring der Shortlist (Beispiel):**

| Element | Reach | Impact | Confidence | Effort | RICE | OKR |
|---|---|---|---|---|---|---|
| Onboarding-Checklisten-Redesign | 400 | 3 | 85% | 3w | 340 | Aktivierung |
| Email-Sequenz-Verbesserung | 800 | 2 | 70% | 2w | 560 | Aktivierung |
| In-App NPS-Umfrage | 1000 | 1 | 90% | 1w | 900 | NPS |
| Bulk-Export-Funktion | 200 | 2 | 60% | 6w | 40 | Keines von beiden |

**Empfehlung:**
In-App-NPS-Umfrage (1w, hoher RICE) zuerst — schneller Sieg, ermöglicht Messung Ihrer NPS-OKR.
Email-Sequenz (2w) zweite — höchste Aktivierungs-ROI pro Woche.
Onboarding-Redesign (3w) dritte — strategischste Aktivierungsverbesserung.
Bulk Export — auf Q4 verschieben, wenn nicht Vertrieb über dies verliert.

---

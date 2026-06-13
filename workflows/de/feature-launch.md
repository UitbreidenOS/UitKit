# Workflow zum Funktionsstarts

End-to-End-Prozess für den Start einer Produktfunktion — von der Finalentwicklung bis zur Kommunikation und Überwachung.

## Wann verwendet

Verwenden Sie diesen Workflow für jeden Funktionsstart, der:
- Mehr als 10% Ihrer Nutzerbasis betrifft
- Zahlungsabläufe, Authentifizierung oder Kernproduktfunktionalität betrifft
- Externe Integrationen oder APIs betrifft, von denen andere Services abhängen
- Alles mit einer angehängten Marketingankündigung

## Phase 1: Startbereitschaft (1 Woche vor)

**Checkliste für Ingenieure:**
- [ ] Alle Akzeptanzkriterien der Spezifikation sind erfüllt
- [ ] Code überprüft und genehmigt
- [ ] Unit- und Integrationstests bestanden
- [ ] E2E-Tests bestanden auf Staging
- [ ] Performance getestet: keine Regression bei p99 Latenz
- [ ] Feature-Flag für schrittweise Bereitstellung konfiguriert
- [ ] Analytica-Events instrumentiert und verifiziert
- [ ] Rollback-Plan dokumentiert und getestet
- [ ] Überwachungswarnungen für neue Code-Pfade eingerichtet

**Produktprüfliste:**
- [ ] Feature vom PM auf Staging gegen Akzeptanzkriterien getestet
- [ ] Grenzfälle getestet (leerer Zustand, Fehlerzustand, Mobile)
- [ ] Hilfedokumentation geschrieben oder aktualisiert
- [ ] In-App-Tooltips oder Onboarding für neue UI (falls zutreffend)
- [ ] Erfolgsmessungen definiert und Basislinie erfasst

**Designprüfliste:**
- [ ] Endgültige Implementierung entspricht genehmigten Designs
- [ ] Responsive auf Mobile (falls Web)
- [ ] Barrierefreiheit: Tastaturnavigation, Bildschirmleser, Farbkontrast
- [ ] Laden- und Fehlerzustände implementiert

## Phase 2: Kommunikationsvorbereitung (3-5 Tage vor)

**Interne Kommunikation:**
- [ ] Ingenieurs-Team informiert, was und wann gestartet wird
- [ ] Customer-Success-Team informiert (Neuerungen, erwartete Kundenfragen)
- [ ] Vertriebsteam informiert, falls es beeinträchtigt, was sie demonstrieren oder verkaufen können
- [ ] Support-Team hat Dokumentation zur Beantwortung häufiger Fragen

**Externe Kommunikation (bei kundenorientiertem Feature):**
- [ ] Änderungsprotokoll-Eintrag geschrieben
- [ ] In-App-Ankündigung entworfen (falls nötig)
- [ ] Email an betroffene Benutzer entworfen (falls nötig)
- [ ] Blog-Post oder Social-Media vorbereitet (falls bedeutsam)
- [ ] Presse / PR koordiniert (falls großer Start)

## Phase 3: Startausführung

**Starttag:**

```
1. Bestätigen Sie, dass alle Elemente der Vor-Start-Checkliste abgeschlossen sind
2. Benachrichtigen Sie das Team in Slack: "Starten [Funktion] um [Uhrzeit]"
3. Feature-Flag für [X]% der Benutzer aktivieren (klein anfangen: 5-10%)
4. 30 Minuten lang überwachen:
   - Fehlerquote bei neuen Code-Pfaden
   - p99 Latenz unverändert
   - Kern-Geschäftsmetriken regredieren nicht
5. Falls gesund: auf 50% erhöhen, 30 Minuten warten
6. Falls gesund: auf 100% erhöhen
7. In Slack ankündigen: "Funktion ist live für 100% der Benutzer ✅"
8. Änderungsprotokoll / Blog-Post veröffentlichen, falls vorbereitet
```

**Rollback-Auslöser:** Falls Fehlerquote > 2x Basislinie ansteigt oder benutzergerichtete Fehler zunehmen → Feature-Flag sofort deaktivieren und untersuchen.

## Phase 4: Überwachung nach dem Start (24-72 Stunden)

**48 Stunden nach dem Start nachverfolgbar:**
- [ ] Fehlerquote zurück zur Normalität
- [ ] p99 Latenz zurück zur Normalität
- [ ] Primäre Erfolgsmessung bewegt sich in die richtige Richtung
- [ ] Support-Ticketvolumen: keine Spitze in Bezug auf die Funktion
- [ ] Benutzer-Feedback (falls zutreffend): NPS, In-App-Reaktionen

**Schnell ansprechen:**
- Fehler, die Benutzer in den ersten 24 Stunden melden (Kunden sind am meisten erforgiving direkt nach dem Start)
- Verwirrende UI-Muster, die vom Support gekennzeichnet sind
- Grenzfälle, die Tests entkommen sind

## Phase 5: Überprüfung (1 Woche danach)

**Feature-Retrospektive (15-Minuten-Async oder Sync):**
1. Hat das Feature die von uns definierten Erfolgsmessungen erreicht?
2. Welches Benutzer-Feedback haben wir erhalten?
3. Was war gut im Start-Prozess?
4. Was würden wir nächstes Mal anders machen?
5. Irgendwelche identifizierten Folgepunkte (Fehler, Verbesserungen, v2-Ideen)?

**Aktualisieren Sie die Roadmap:**
- Archivieren Sie die Feature-Spezifikation mit tatsächlichem Ergebnis vs. vorhergesagtem Ergebnis
- Fügen Sie alle Folgepunkte zum Backlog hinzu
- Veröffentlichen Sie interne Erkenntnisse (besonders wenn etwas Überraschend geschah)

## Starttypen und der richtige Prozess für jeden

| Typ | Publikum | Rollout | Kommunikation | Überwachung |
|---|---|---|---|---|
| **Größer** | Alle Benutzer, Kernfluss | Feature-Flag, 5→50→100% | Email + In-App + Blog | 72h aktive Überwachung |
| **Moderat** | Spezifisches Segment | Schrittweise | In-App oder Email | 48h aktive Überwachung |
| **Klein** | Alle Benutzer, nicht-kern | Direkt zu 100% | Nur Änderungsprotokoll | 24h passiv |
| **Intern** | Nur Team | Direkt | Slack | Standard-Überwachung |
| **Beta** | Opt-in Benutzer | Nur Einladung | Einladungs-Email | Wöchentliche Überprüfung |

---

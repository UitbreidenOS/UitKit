---
name: onboarding-cro
description: "Optimierung des Benutzer-Onboardings: Aktivierungsflüsse, Identifikation des Aha-Moments, leere Zustände, E-Mail-Sequenzen, In-App-Checklisten — reduzieren Sie die Time-to-Value und verbessern Sie die Trial-Konversion"
---

# Onboarding CRO Skill

## Wann aktivieren
- Verbesserung der Trial-zu-Zahlung-Konversion durch Behebung des Onboarding-Flows
- Identifizierung und Beschleunigung des "Aha-Moments" für neue Benutzer
- Gestaltung von leeren Zuständen, Checklisten und In-App-Nudges
- Verfassung von Onboarding-E-Mail-Sequenzen (Aktivierungsdrip)
- Überprüfung eines Registrierungs-zu-Aktivierungs-Trichters auf Abfälle

## Wann NICHT verwenden
- Allgemeine Funnel-Analytics-Einrichtung — verwende den analytics-tracking Skill
- A/B-Test-Framework-Design — verwende den experiment-designer Skill
- Marketing-Landingpages — verwende den copywriting Skill
- Bezahlte Akquisition — verwende den paid-ads Skill

## Anweisungen

### Identifizieren Sie das Aha-Moment

```
Helfen Sie mir, das Aha-Moment für [Produkt] zu identifizieren.

Produkt: [beschreiben, was es tut]
Haupt-Wertversprechen: [welches Problem löst es?]
Benutzertyp: [wer sind deine besten Kunden?]
Aktuell verfolgtes Aktivierungsereignis: [das Ereignis, das Sie "aktiviert" nennen — oder keine]

Rahmen zum Finden des Aha-Moments:

1. Korrelationsmethode (wenn Sie Daten haben):
   Betrachten Sie Benutzer, die in Zahlung konvertiert haben, im Vergleich zu Abwanderern.
   Welche Aktion unternahmen Konverter, die Abwanderer nicht?
   Führen Sie in Mixpanel/Amplitude aus: "Benutzer, die X innerhalb von 7 Tagen getan haben, haben Y% höhere Aufbewahrung"

2. Interviewmethode (qualitativ):
   Fragen Sie 5-10 Power User: "Erzählen Sie mir von dem Moment, als Sie wussten, dass dieses Produkt es wert ist, dafür zu bezahlen."
   Suchen Sie nach einer spezifischen Aktion, nicht einem Gefühl.

3. Produktlogik-Methode (wenn keine Daten):
   Ordnen Sie die Benutzerreise: Registrierung → [Schritt 1] → [Schritt 2] → ... → Wert
   Das Aha-Moment = der erste Schritt, wo der Benutzer IHREN Kernwert erlebt, nicht nur Setup.

Häufige Aha-Moment-Muster:
- Slack: erste Nachricht in einem Kanal gesendet (Team präsent)
- Dropbox: erste Datei von mehreren Geräten gespeichert (Synchronisierung funktioniert)
- Loom: Antwort auf ein aufgezeichnetes Video erhalten (Wertschleife vollständig)

Für mein Produkt ist das Aha-Moment wahrscheinlich: [identifizieren Sie die spezifische Aktion]

Definieren Sie das Aktivierungsereignis: [Benutzer vollendet X innerhalb von Y Tagen nach der Registrierung]
```

### Design des Onboarding-Flows

```
Entwerfen Sie einen Onboarding-Flow für [Produkt].

Benutzertyp: [Solo / Team / Enterprise]
Zeit bis Aha-Moment derzeit: [unbekannt / X Tage / X Minuten]
Ziel: Erreichen Sie Aha-Moment in < [X] Minuten für [X]% der Benutzer
Registrierungsmethode: [E-Mail / Google OAuth / Nur Einladung]
Aktuelles Onboarding: [keine / nur E-Mail / In-App-Checkliste / geführte Tour]

Onboarding-Flow-Blaupause:

Schritt 1 — Reibungslose Registrierung:
□ Soziale Anmeldung bevorzugt (entfernt E-Mail-/Passwortreibung)
□ Sammeln Sie nur das, was für die Personalisierung erforderlich ist (nicht Unternehmensgröße für ein Solo-Tool)
□ Klarer Fortschrittsindikator, falls mehrere Schritte

Schritt 2 — Personalisierungsfrage (maximal 1-2 Fragen):
"Wofür wirst du [Produkt] hauptsächlich nutzen?" → Routes zum relevanten leeren Zustand
Warum: Das macht das Produkt relevant, bevor sie etwas getan haben

Schritt 3 — Erste Aktionsanforderung (leerer Zustand):
□ Zeigen Sie EINE Sache zu tun, nicht fünf
□ Verwenden Sie Aktionsverben: "Erstellen Sie Ihren ersten X" nicht "Willkommen bei [Produkt]"
□ Vorausfüllung mit einem Beispiel, damit sie sehen, was gut aussieht
□ Bieten Sie eine "Schnelldemo" oder ein Beispielprojekt für zaudernde Benutzer

Schritt 4 — Aha-Moment-Lieferung:
□ Der Bildschirm/Moment, in dem der Kernwert erfahren wird
□ Feiern Sie es mit einer Mikro-Gewinn-Animation oder Bestätigung
□ Oberflächenaktion sofort folgen (lassen Sie Momentum nicht sterben)

Schritt 5 — Gewöhnungsbildung:
□ Laden Sie ein Teamdaten ein (wenn Team-Produkt)
□ Verbindungsintegration (Slack, GitHub, usw. — der "klebrige" Haken)
□ Legen Sie eine Wiederholung oder einen Workflow fest

Zu vermeidende Anti-Muster:
- Feature-Tours (Benutzer überspringen sie — lassen Sie sie tun, nicht ansehen)
- Kreditkarte vor Werterfahrung anfordern
- Lange Setup-Assistenten vor Wertlieferung

Entwerfen Sie den Flow für mein Produkt mit spezifischem Exemplar für jeden Schritt.
```

### Onboarding-E-Mail-Sequenz

```
Schreiben Sie eine Onboarding-E-Mail-Sequenz für [Produkt].

Trial-Länge: [X Tage / keine Ablauf]
Aktivierungsdefinition: [Benutzer vollendet X]
Konversionsrate aktivierter Benutzer: [X%]
Konversionsrate nicht aktivierter Benutzer: [X%]
Name vom Absender: [Gründer / Produktteam / Unterstützung]

E-Mail-Sequenz:

E-Mail 1 — Willkommen (Senden: sofort nach der Registrierung):
Betreff: [Kommen Sie schnell zum Aha-Moment — nicht "Willkommen bei [Produkt]"]
Ziel: Drive First Login und Erste Aktion
Inhalt: 1 Satz über das, was sie heute tun können + ein CTA-Knopf
Länge: < 100 Wörter

E-Mail 2 — Aktivierungsnudge (Senden: Tag 2, falls nicht aktiviert):
Betreff: [Hast du X schon versucht?]
Ziel: Entfernen Sie den Blocker, der erste Aktion stoppt
Inhalt: Nennen Sie die #1 Sache, auf der die meisten Benutzer stecken + wie man sie löst
CTA: direkter Link zum Schritt, den sie nicht abgeschlossen haben

E-Mail 3 — Sozialer Beweis (Senden: Tag 3, falls nicht aktiviert):
Betreff: [Wie [Unternehmen] [X] mit [Produkt] sparte]]
Ziel: Erneuern Sie die Absicht mit einer relevanten Fallstudie
Inhalt: 3-Satz-Geschichte des Ergebnisses eines ähnlichen Benutzers
CTA: "Siehe, wie sie es getan haben" → Link zurück zum Produkt

E-Mail 4 — Funktionshervorhebung (Senden: Tag 5, falls aktiviert):
Betreff: [Du hast X getan. Hier ist, was du als nächstes versuchen sollst.]
Ziel: Vertiefen Sie das Engagement in Richtung Aha-Moment oder Upgrade-Absicht
Inhalt: die eine Funktion, die kostenlose Benutzer in zahlende Benutzer konvertiert
CTA: Versuchen Sie die Funktion mit einem Deep-Link

E-Mail 5 — Trial Expiry Warning (Senden: Tag [trial_length - 3]):
Betreff: [3 Tage verbleibend — hier ist, was Sie verlieren]
Ziel: Konvertieren oder Erweitern
Inhalt: Nennen Sie spezifisch, worauf sie keinen Zugriff mehr haben
CTA: Jetzt upgraden + "Brauchen Sie mehr Zeit?" Erweiterungsoption

E-Mail 6 — Letzter Tag (Senden: Tag [trial_length]):
Betreff: [Letzte Chance — Ihr [Produkt] Trial endet heute Nacht]
Ziel: Letzter Konversionsdruck
Inhalt: schwerste Angebot (Rabatt wenn Budget erlaubt), oder 7 Tage verlängern
CTA: Upgrade + "nicht jetzt" Option, die nach Feedback fragt

Schreiben Sie jede E-Mail für mein Produkt. Betreff, Vorschautext und Text einbeziehen.
```

### In-App-Checklisten-Design

```
Entwerfen Sie eine Onboarding-Checkliste für [Produkt].

Ziel der Checkliste: Erreichen Sie Aha-Moment / Kommen Sie zum ersten Wert / Kompletter Setup
Benutzerpersona: [beschreiben]
Zu absolvierende Elemente: [listen Sie die Schritte auf, die Benutzer unternehmen sollen]
Belohnungsmechanismus: [Fortschrittsleiste / Feier / eine Funktion entsperren]

Prinzipien der Checklisten-Gestaltung:
1. Maximum 5 Elemente — mehr als 5 sieht aus wie Hausaufgaben
2. Erstes Element: In < 2 Minuten zu vervollständigen (baut Dynamik auf)
3. Zeigen Sie Häkchen, wenn Elemente erledigt sind (Psychologie der Vollendung)
4. Das "Entsperren" erfolgt bei Element 3-4, nicht beim letzten Element (halten Sie sie engagiert)
5. Nach Abschluss einklappen, nicht verschwinden (Referenzwert)

Checkliste für mein Produkt:
□ [Element 1] — [X Mins] — Vervollständigt wenn: [Ereignis ausgelöst]
□ [Element 2] — [X Mins] — Vervollständigt wenn: [Ereignis ausgelöst]
□ [Element 3] — [X Mins] — Entsperren: [Funktion oder Inhaltsbelohnung]
□ [Element 4] — [X Mins] — Vervollständigt wenn: [Ereignis ausgelöst]
□ [Element 5] — [X Mins] — Abschluss: [Feier + nächste Schrittaufforderung]

Fortschrittsmeldungen bei 0%, 40%, 80%, 100%:
[Schreiben Sie 4 Nachrichten, die die Vollendung motivieren]

Exemplar für jedes Checklisten-Element (Aufgabentitel + 1-Zeilen-Beschreibung).
```

## Beispiel

**Benutzer:** Unser Projektmanagement-SaaS für Engineeringteams hat eine 18%ige Trial-zu-Zahlung-Konversion. Das Aha-Moment ist, wenn ein Team seinen ersten Sprint abschließt. Nur 31% der Versuche kommen jemals dorthin. Beheben Sie das Onboarding.

**Claudes Diagnose:**

31% erreichen das Aha-Moment ist das echte Problem — nicht die 18% Konversion. Beheben Sie zuerst die Aktivierung; die Konversion folgt.

**Grundursache:** "Sprint abschließen" erfordert zu viele Voraussetzungen — Team-Einladungen, Projektsetup, Tickets erstellt, Sprint gestartet, Sprint abgeschlossen. Das sind 5 Schritte, wahrscheinlich über Tage verteilt. Die meisten Solo-Trial-Starter laden nie ihr Team ein.

**3 Änderungen mit höchstem erwartetem Einfluss:**

1. **Ändern Sie das Aktivierungsereignis vorübergehend:** Definieren Sie "Aha-Moment" als "erstes Sprint gestartet mit 3+ Tickets" anstatt "Sprint abgeschlossen." Das ist in 30 Minuten erreichbar, nicht 2 Wochen. Messen Sie die Trial-Konversion von diesem früheren Punkt aus.

2. **Fügen Sie früh eine Team-Einladungs-Gate hinzu:** Am Tag 1, nach dem ersten erstellten Projekt, auffordern: "Engineeringteams bewegen sich 3x schneller zusammen — laden Sie Ihr Team jetzt ein." Machen Sie es einfach (Link-Share, nicht nur E-Mail). Nicht-Einladende sind 4x weniger wahrscheinlich zu konvertieren.

3. **Vordefinierte Sprint-Vorlage:** Anstatt leeres Projekt → Tickets erstellen → Sprint starten, angeboten: "Beginnen Sie mit unserer 2-Wochen-Sprint-Vorlage" → 5 Beispiel-Tickets vorausgefüllt für ein typisches Engineeringteam. Benutzer können bearbeiten, nicht von Grund auf bauen. Reduziert die Zeit bis zum ersten Sprint-Start von ~3 Tagen auf ~15 Minuten.

Erwartetes Ergebnis: Aktivierung von 31% auf 50% erhöhen → geschätzte Trial-zu-Zahlung-Verbesserung von 18% auf ~28%.

---

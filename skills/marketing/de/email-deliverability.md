---
name: email-deliverability
description: "E-Mail-Zustellbarkeits-Audit: SPF/DKIM/DMARC-Prüfung, Spam-Trigger-Analyse, Listenbereinigung, Aufwärmstrategie"
---

# Skill: E-Mail-Zustellbarkeit

## Wann aktivieren
- Öffnungsraten sinken unerwartet (> 20% Rückgang Woche für Woche)
- Eine Kampagne landet im Spam- oder Werbeordner statt im Posteingang
- Eine neue Versanddomain wird eingerichtet und muss authentifiziert werden
- Die Versandinfrastruktur wurde noch nie auditiert und es ist unklar, ob sie korrekt konfiguriert ist
- Eine neue E-Mail-Plattform oder IP-Adresse wird gestartet und ein Aufwärmplan wird benötigt
- Hohe Bounce-Raten (> 2%) oder Spam-Beschwerdequoten (> 0,1%) werden beobachtet

## Wann NICHT verwenden
- E-Mail-Texterstellung — dafür `/email-sequence`- oder `/email-campaign`-Skills verwenden
- Strategische Kampagnenentscheidungen — dieser Skill behandelt Infrastruktur und Hygiene, nicht Messaging
- CRM-Datenverwaltung — dafür das CRM-Tool verwenden; dieser Skill diagnostiziert die Sendegesundheit
- Einzelne transaktionale E-Mails, die vollständig kontrolliert werden (Passwort-Resets, Quittungen) — Fokus auf Marketing-Sendungen

## Anweisungen

### Vollständiges Zustellbarkeits-Audit

```
Führe ein Zustellbarkeits-Audit meiner E-Mail-Versandeinrichtung durch.

Meine Einrichtung:
- E-Mail-Plattform: [Mailchimp / Klaviyo / HubSpot / SendGrid / Postmark / andere]
- Versanddomain: [z. B. newsletter.meinunternehmen.com oder meinunternehmen.com]
- Monatliches Versandvolumen: [X E-Mails/Monat]
- Listengröße: [X Abonnenten]
- Listenalter: [wie alt ist das älteste Segment?]
- Durchschnittliche Öffnungsrate (letzte 3 Monate): [X%]
- Durchschnittliche Klickrate: [X%]
- Bounce-Rate: [X%]
- Spam-Beschwerdequote: [X%] (in der Plattform-Analytik zu finden)
- Aktueller Posteingangsanteil: [Posteingang / Werbung / Spam — oder unbekannt]

Diagnose in diesen Bereichen durchführen:

## 1. Authentifizierung (SPF / DKIM / DMARC)
Diese Einträge für [DOMAIN] prüfen:
SPF: TXT-Eintrag verifizieren, dass er die Server der Versandplattform enthält
DKIM: CNAME- oder TXT-Einträge der Plattform verifizieren, dass sie aktiv sind
DMARC: Verifizieren, dass eine DMARC-Richtlinie existiert und was sie tut (none / quarantine / reject)

Was jedes bedeutet:
- SPF fehlt → leichte Spam-Klassifizierung, manche Anbieter lehnen direkt ab
- DKIM fehlt → keine kryptografische Signatur → als unsigniert/unverifiziert behandelt
- DMARC fehlt → Domain-Spoofing trivial → Anbieter bestrafen die Domain

Empfohlene DMARC-Startrichtlinie:
v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com; pct=100

Nach 30 Tagen sauberer Berichte zu p=quarantine wechseln, dann nach 60 Tagen zu p=reject.

## 2. Versanddomain-Konfiguration
- Wird von einer Subdomain (newsletter.company.com) oder der Root-Domain gesendet?
  Empfehlung: Subdomain für Marketing, Root-Domain für transaktionale Sendungen — getrennte Reputationspools
- Stimmt die From-Adresse mit der authentifizierten Domain überein?
- Ist Reply-To anders als From? (kein Problem, aber vermerken)
- Hat die Sende-IP einen Reverse-DNS-Eintrag (PTR-Record)?

## 3. Inhaltsanalyse
Aktuellen E-Mail-HTML + Textversion einfügen und scannen auf:
- Spam-Trigger-Wörter in Betreffzeile und Inhalt
- Text-zu-Bild-Verhältnis (< 20% Text = wahrscheinlich Werbeordner)
- Link-Domains — wird eine benutzerdefinierte Klick-Tracking-Domain verwendet?
- Alt-Text bei Bildern (fehlend = Spam-Signal)
- Vorhandensein des Abmelde-Links (gesetzlich vorgeschrieben, verbessert Zustellbarkeit)
- List-Unsubscribe-Header (muss in den Headern vorhanden sein)
- Physische Adresse im Footer (CAN-SPAM-Anforderung)

## 4. Listenhygiene
Listenaufschlüsselung angeben:
- Gesamte Abonnenten: [X]
- Nie geöffnet in 90 Tagen: [X] → Unterdrückungskandidat
- Nie geöffnet in 180 Tagen: [X] → Sunset / Reaktivierung erforderlich
- Hard Bounces: [X] → sofort entfernen
- Soft Bounces (3+ Mal): [X] → entfernen
- Nicht respektierte Abmeldungen innerhalb von 10 Tagen: [X] → rechtliches Risiko, sofort beheben

## 5. Engagement-Segmentierung
Der wichtigste Zustellbarkeitsfaktor ab 2024 ist das Engagement.
Gmail und Apple Mail filtern primär danach, ob Empfänger interagieren.

Liste segmentieren:
- Hoch engagiert: in den letzten 30 Tagen geöffnet oder geklickt → Priorität-1-Sendung
- Engagiert: in den letzten 90 Tagen geöffnet → Standard-Sendung
- Wenig engagiert: letztes Öffnen vor 90-180 Tagen → Reaktivierungskampagne vor Einschluss
- Inaktiv: kein Öffnen in 180+ Tagen → Sunset-Sequenz, dann entfernen

Niemals inaktive Abonnenten gemischt mit engagierten Abonnenten senden.
Die Beschwerde- und Nicht-Engagement-Rate inaktiver Segmente schadet der gesamten Domain-Reputation.

## 6. Zusammenfassung der Zustellbarkeitsbewertung
| Bereich | Status | Erforderliche Maßnahme |
|---|---|---|
| SPF | ✓ / ✗ | [beheben falls fehlend] |
| DKIM | ✓ / ✗ | [beheben falls fehlend] |
| DMARC | ✓ / none / reject | [Richtlinie setzen] |
| Subdomain-Isolation | ✓ / ✗ | [teilen falls nötig] |
| Listenhygiene | Sauber / Probleme | [Probleme beschreiben] |
| Engagement-Segmente | Segmentiert / Unsegmentiert | [Maßnahme] |
| Inhalts-Flags | [N Probleme gefunden] | [auflisten] |

Gesamtgesundheit: Grün / Gelb / Rot
Prioritätsmaßnahmen nach Auswirkung gerankt: [nummerierte Liste]
```

### DNS-Konfigurationsleitfaden

```
Genaue DNS-Einträge für [VERSANDPLATTFORM] auf Domain [DOMAIN] generieren.

Plattform: [Mailchimp / Klaviyo / SendGrid / Postmark / HubSpot / andere]
Versanddomain: [yourdomain.com oder Subdomain]
Aktueller DNS-Anbieter: [Cloudflare / Route53 / GoDaddy / Namecheap / andere]

Generieren:

## SPF-Eintrag
Typ: TXT
Host: @ (oder Subdomain)
Wert: [plattformspezifische Include-Anweisung]
Beispiel: "v=spf1 include:sendgrid.net include:_spf.google.com ~all"
TTL: 3600

Hinweis: nur EINEN SPF-Eintrag pro Domain/Subdomain. Falls bereits einer existiert, das neue Include hinzufügen — keinen zweiten TXT-Eintrag erstellen.

## DKIM-Einträge
[Plattform stellt diese bereit — CNAME- oder TXT-Einträge mit Host und Wert auflisten]
Typ: CNAME oder TXT (plattformspezifisch)
TTL: 3600

## DMARC-Eintrag
Typ: TXT
Host: _dmarc.[domain]
Wert: v=DMARC1; p=none; rua=mailto:dmarc@[domain]; pct=100
Mit p=none beginnen. Berichte 30 Tage prüfen. Zu p=quarantine, dann p=reject wechseln.

## BIMI-Eintrag (optional — Markenlogo im Posteingang)
Erfordert DMARC mit p=quarantine oder p=reject zuerst.
Typ: TXT
Host: default._bimi.[domain]
Wert: v=BIMI1; l=https://[domain]/logo.svg; a=;

## Verifizierungsschritte nach DNS-Propagierung (24-48 Stunden)
SPF testen: MXToolbox SPF-Record-Checker verwenden
DKIM testen: Test-E-Mail senden und Header in Gmail prüfen (Quelltext anzeigen)
DMARC testen: [domain] auf dmarcanalyzer.com prüfen
Zustellbarkeit testen: an mail-tester.com senden für eine Bewertung von 10
```

### Spam-Trigger-Wort-Scanner

```
Diese E-Mail auf Spam-Trigger scannen.

Betreffzeile: [einfügen]
Vorschautext: [einfügen]
E-Mail-Inhalt: [Klartext oder HTML einfügen]

Prüfen auf:
1. Klassische Spam-Wörter in der Betreffzeile (vollständig vermeiden):
   - Finanziell: "free money", "guaranteed income", "no risk", "earn $", "cash"
   - Dringlichkeitsmissbrauch: "act now", "limited time!!!", "hurry", "don't miss out"
   - Zu werblich: "best price", "buy now", "discount", "lowest price"
   - Phishing-Muster: "click here", "verify your", "confirm your account"
   - ÜBERMÄSSIGE GROSSBUCHSTABEN UND AUSRUFEZEICHEN!!!

2. Inhaltsprobleme:
   - Bild-zu-Text-Verhältnis: Bilder ohne Alt-Text + minimaler Text = Werbe-/Spam-Ordner
   - Links zu verdächtigen Domains oder nicht verwandten Tracking-Domains
   - Fehlender oder versteckter Abmelde-Link
   - Keine physische Adresse im Footer

3. Länge und Zeichensetzung der Betreffzeile:
   - Optimale Länge: 30-50 Zeichen
   - Vermeiden: 3+ Satzzeichen, 3+ Emojis in einer Reihe
   - Vermeiden: nur Kleinbuchstaben oder NUR GROSSBUCHSTABEN

4. HTML-Probleme:
   - Nur Inline-Styles verwenden (externes CSS kann entfernt werden)
   - Sauberes HTML — nicht aus Word eingefügt (Word fügt versteckte Tags ein)
   - Nur-Text-Version vorhanden (HTML ohne Klartext-Backup = Spam-Signal)

Ausgabe:
- Spam-Risikobewertung: Niedrig / Mittel / Hoch
- Gefundene spezifische Trigger und welche Regel sie verletzen
- Überarbeitete Betreffzeile (falls nötig)
- Top 3 Inhaltskorrekturen
```

### Aufwärmplan für neue Domain

```
Aufwärmplan für eine neue Versanddomain oder IP erstellen.

Domain/IP: [neue Versanddomain oder IP-Adresse]
Ziel-Sendevolumen: [X E-Mails/Monat bei voller Auslastung]
Ausgangslistenqualität: [verifiziertes Opt-in, Double Opt-in, oder importiert/unbekannt]
Plattform: [ESP-Name]

Aufwärmprinzipien:
1. Mit den engagiertesten Abonnenten beginnen (aktuelle Öffnungen und Klicks) — sie signalisieren positives Engagement
2. Langsam hochfahren — zu schnelles Verdoppeln oder Verdreifachen löst Spam-Filter aus
3. Bounce-Rate und Beschwerdequote täglich während des Aufwärmens überwachen
4. Niemals während des Aufwärmens an eine kalte/inaktive Liste senden — ruiniert die Domain-Reputation ab Tag 1
5. Konsistentes tägliches Senden schlägt unregelmäßige große Sendungen

Aufwärmplan:

Woche 1:
- Tägliches Volumen: 50 E-Mails
- Senden an: Engagierteste Abonnenten (letzte 7 Tage)
- Bounce-Rate-Schwellenwert: < 1%
- Beschwerde-Schwellenwert: < 0,05%

Woche 2:
- Tägliches Volumen: 200 E-Mails
- Senden an: Engagiert (letzte 30 Tage)
- Schwellenwerte: gleich

Woche 3:
- Tägliches Volumen: 500 E-Mails
- Senden an: Engagiert (letzte 60 Tage)

Woche 4:
- Tägliches Volumen: 1.000-2.000 E-Mails
- Senden an: Engagiert (letzte 90 Tage)

Monat 2:
- Auf 10% des Zielvolumens hochfahren
- Mäßig Engagierte (letzte 180 Tage) einbeziehen

Monat 3+:
- Volles Volumen, alle verifizierten Abonnenten
- Inaktiv > 180 Tage: Sunset-Kampagne vor Einschluss

Falls Bounce-Rate 2% übersteigt oder Beschwerdequote 0,1% übersteigt:
STOPP des Hochfahrens. Diagnose. Liste bereinigen. Ab vorherigem Volumen-Tier fortsetzen.

Meinen spezifischen Wochenplan von [STARTDATUM] bis Erreichen von [ZIELVOLUMEN] bis [ZIELDATUM] generieren.
```

### Standard-Betriebsverfahren für Listenhygiene

```
Standard-Betriebsverfahren für Listenhygiene für [PLATTFORM] generieren.

Aktuelle Liste: [X Abonnenten]
Aktuelle Probleme: [hohe Bounces / niedrige Öffnungsrate / Spam-Beschwerden / alles davon]

Hygiene-Checkliste (monatlich ausführen):

1. Hard Bounces sofort entfernen
   Definition: E-Mail-Adresse existiert nicht oder ist dauerhaft unzustellbar
   Maßnahme: automatisch von den meisten Plattformen unterdrückt — prüfen, ob die Plattform das tut

2. Soft-Bounce-Ansammlung entfernen
   Definition: 3+ Soft Bounces in 90 Tagen (Postfach voll, temporäres Serverproblem)
   Maßnahme: auf Unterdrückungsliste verschieben, über einen E-Mail-Verifizierungsdienst erneut prüfen

3. Spam-Beschwerdeführer entfernen
   Definition: Abonnent hat auf „als Spam markieren" geklickt (über Feedback-Schleife gemeldet)
   Maßnahme: sofort unterdrücken, auch bei Bitten nicht erneut abonnieren

4. Inaktive Abonnenten stilllegen (vierteljährlich)
   Definition: kein E-Mail-Öffnen in 180 Tagen
   Prozess:
   a. 3-E-Mail-Reaktivierungskampagne über 2 Wochen senden
   b. Verfolgen, wer öffnet oder klickt — zur aktiven Liste zurückführen
   c. Nach 3 E-Mails ohne Engagement: dauerhaft entfernen
   d. Entfernte Kontakte nicht erneut ansprechen — ihren impliziten Opt-out respektieren

5. Neue Listenimporte verifizieren
   Vor dem Senden an jede importierte Liste (Messe, gekauft, alte CRM-Daten):
   - Durch einen E-Mail-Verifizierungsdienst laufen lassen (NeverBounce, ZeroBounce, BriteVerify)
   - Unbekannte/riskante Adressen entfernen (> 5% riskant = überhaupt nicht senden)
   - Double-Opt-in-Bestätigung vor dem Hinzufügen zu Marketing-Sendungen

Ausgabe: monatlicher Hygienekalender und E-Mail-Vorlage für Reaktivierungssequenz.
```

### Referenz: Wichtige Zustellbarkeitsmetriken

```typescript
interface DeliverabilityHealth {
  // Inbox placement rate (use GlockApps, Litmus, or 250ok to measure)
  inboxPlacementRate: number  // target: > 90%

  // From your ESP dashboard
  openRate: number            // target: > 20% (Gmail/Apple Mail clip post-privacy)
  clickRate: number           // target: > 2%
  bounceRate: number          // alert at > 2%, danger at > 5%
  spamComplaintRate: number   // alert at > 0.08%, danger at > 0.1% (Google threshold)
  unsubscribeRate: number     // alert at > 0.5% per campaign

  // List health
  activeEngagedPercent: number    // subscribers who opened in last 90 days / total
  inactivePercent: number         // no open in 180 days / total
}

const DELIVERABILITY_THRESHOLDS = {
  inboxPlacementRate: { healthy: 0.90, concern: 0.80, critical: 0.70 },
  bounceRate: { healthy: 0.02, concern: 0.05, critical: 0.10 },
  spamComplaintRate: { healthy: 0.0005, concern: 0.001, critical: 0.003 },
  // Note: Google's postmaster tools flag domains at 0.1% complaint rate
  // Apple Mail Privacy Protection (iOS 15+) inflates open rates — do not use open rate alone
}
```

## Beispiel

**Nutzer:** Meine Öffnungsraten sind in 3 Monaten von 32% auf 19% gefallen. Ich habe nichts geändert. Was prüfe ich zuerst?

**Diagnose-Framework:**

```
Ein Rückgang der Öffnungsrate um 13 Punkte in 3 Monaten ohne Inhaltsänderungen deutet auf eine der folgenden Ursachen hin,
geordnet nach Wahrscheinlichkeit:

1. Listenverfall — inaktive Abonnenten haben sich angesammelt und ziehen das Engagement nach unten
   Prüfen: % der Liste ohne Öffnen in 90 Tagen. Wenn > 30%, ist das der Verursacher.
   Beheben: inaktives Segment sofort unterdrücken, Reaktivierungskampagne starten

2. Zustellbarkeitsverschiebung — Domain- oder IP-Reputation hat sich verändert (häufig nach einer Sendung mit hohen Bounces)
   Prüfen: Google Postmaster Tools für die Domain aufrufen. Domain-Reputation und
   Spam-Rate-Diagramme ansehen. Ein Rückgang der Domain-Reputation korreliert direkt mit verlorenem Posteingangsanteil.
   Beheben: vollständiges Authentifizierungs-Audit, Liste bereinigen, Sendefrequenz für 30 Tage reduzieren

3. Ansammlung von Apple Mail Privacy Protection — bei einer Liste mit vielen iOS-Nutzern
   werden künstlich aufgeblähte Öffnungen aus 2021 jetzt ausgeblendet, da diese Nutzer inaktiv werden.
   Das ist kein echtes Zustellbarkeitsproblem — es ist ein Messproblem.
   Beheben: Klickrate als primäre Engagement-Metrik verwenden. Öffnungsrate ist für iOS unzuverlässig.

4. Versanddomain-Änderung — wurde zu einer neuen Subdomain, einem ESP oder einer IP ohne erneutes Aufwärmen migriert?
   Prüfen: E-Mail-Header einer gesendeten Kampagne. Welche ist die tatsächliche Sende-IP?
   Beheben: Aufwärmplan für neue Infrastruktur.

Mit Google Postmaster Tools beginnen — kostenlos und teilt innerhalb von 24 Stunden mit, ob Gmail
die Domain als Spam klassifiziert. Das engt die Diagnose sofort ein.
```

---

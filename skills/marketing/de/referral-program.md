---
name: referral-program
description: "Gestaltung von Empfehlungsprogramm: Anreizstruktur, Empfehlungsmechanik, Tracking-Einrichtung, E-Mail-/In-App-Aufforderungen, Betrugsprävention — für SaaS, Ecommerce und Verbraucherprodukte"
---

# Referral Program Skill

## Wann aktivieren
- Entwurf eines Empfehlungs- oder Word-of-Mouth-Programms von Grund auf
- Verbesserung der Konversion oder Teilnahme in einem bestehenden Empfehlungsprogramm
- Wahl zwischen Empfehlungsanreizmodellen (Geben/Erhalten, einseitig, Bargeld, Gutscheine)
- Verfassung von Empfehlungs-E-Mail-Einladungen und Landing-Page-Exemplaren
- Einrichtung von Empfehlungsverfolgung und Betrugsprävention

## Wann NICHT verwenden
- Affiliate-Marketing (Partner-Kanal, provisionsbasiert) — unterschiedliche Mechanik und Verträge
- Influencer-Kampagnen — verwende die Kompetenz brand-guidelines oder social-media-manager
- Partner-/Wiederverkäufer-Programme — Kanalverkauf, keine Empfehlungen

## Anweisungen

### Gestaltung des Empfehlungsprogramms

```
Entwerfen Sie ein Empfehlungsprogramm für [Produkt].

Produkttyp: [SaaS / Ecommerce / Verbraucher-App / Marktplatz]
Geschäftsmodell: [Abonnement / Einmaliger Kauf / Freemium]
Durchschnittlicher Kunden-LTV: $[X]
Aktueller CAC (Akquisitionskosten): $[X]
Hauptziel der Akquisition: [neue Registrierungen / erste Käufe / zahlungspflichtige Konversionen]

Design-Framework:

1. Wen man um Empfehlungen bitten kann:
   - Timing: bitten Sie nach dem Aha-Moment, nicht bei der Registrierung
   - Best Trigger: nach erstem Erfolgmoment / nach positiver Bewertung / bei Upgrade
   - Segment: Power User beziehen sich mehr als durchschnittliche Benutzer; Filter für engagierte Kohorte

2. Anreizstruktur (basierend auf Produktwirtschaft wählen):
   a. Geben/Erhalten (beide Seiten gewinnen):
      Empfänger erhält: [X Gutschein / X Monate kostenlos / Bargeld]
      Empfänger erhält: [X Gutschein / erweitertes Versuchen / Rabatt]
      Beste für: SaaS, Abonnementprodukte
   
   b. Einseitig (nur Empfänger):
      Empfänger erhält: Barverkäufigung oder Gutschein pro Konversion
      Beste für: Hochmarge-Produkte, Affiliate-ähnliche Modelle
   
   c. Wohltätige Spende:
      Der Empfänger wählt eine Wohltätigkeit; Sie spenden $X pro Empfehlung
      Beste für: B2B, wo Bargeld transaktional wirkt

3. Anreiz-Kalibrierung:
   - Kosten für Empfehlungen auf 20-30% des LTV für Rentabilität begrenzen
   - Wenn LTV = $[X], maximale Empfehlungskosten = $[X × 0.25]
   - Auszahlung nur bei Konversion bezahlt auslösen, nicht bei Registrierung (Betrugsprävention)

4. Empfehlungsmechanik:
   - Eindeutiger Empfehlungslink pro Benutzer (nicht nur ein Code — Links verfolgen besser)
   - E-Mail + Social-Sharing-Vorlagen vorab geschrieben
   - Dashboard: Der Empfänger kann sehen, wen er eingeladen hat und Status

Empfohlene Programmgestaltung für mein Produkt mit spezifischen Anreizzahlen.
```

### Empfehlungs-E-Mail-Vorlagen

```
Schreiben Sie E-Mails des Empfehlungsprogramms für [Produkt].

Produkt: [beschreiben]
Anreiz: [Der Empfänger erhält X, der Empfänger erhält Y]
Empfehlungslink Platzhalter: [REFERRAL_URL]
Brand-Ton: [professionell / lässig / verspielt]

E-Mail 1 — Empfehlungseinladung (vom Empfänger zum Empfänger):
Betreff: [Persönlich, nicht Unternehmen — aus der Perspektive des Empfängers]
Vorschau: [was sie erhalten]
Körper:
- Persönliche Eröffnung (geschrieben, als ob sie vom Empfänger käme, nicht vom Unternehmen)
- 1-Satz-Produktbeschreibung mit Sprache der sozialen Bewährung
- Das Angebot: "Holen Sie sich [X], wenn Sie sich mit meinem Link anmelden"
- [REFERRAL_URL]
- Halten Sie unter 100 Wörtern

E-Mail 2 — Ankündigung des Empfehlungsprogramms (an bestehende Benutzer):
Betreff: [Geben [X], Erhalten [X] — teilen Sie [Produkt] mit Ihrem Team]
Ziel: Teilnahme der aktuellen Benutzerbasis antreiben
Körper:
- Beginnen Sie mit ihrer Belohnung (nicht dem Vorteil des Produkts)
- Einfache Erklärung, wie es funktioniert (maximal 3 Schritte)
- CTA: "Meinen Empfehlungslink erhalten" → Link zum Dashboard
- Schaltflächen für Social Sharing vorab konfiguriert

E-Mail 3 — Erinnerung an Nicht-Teilnehmer (14 Tage nach Marktstart):
Betreff: [Sie haben unser Empfehlungsprogramm noch nicht versucht]
Ziel: Nicht-Teilnehmer mit sozialer Bewährung konvertieren
Körper:
- "[X] Benutzer haben diesen Monat bereits [Belohnung] verdient"
- Reibungsabbau: "Es dauert 30 Sekunden, um Ihren Link zu erhalten"
- CTA: gleich wie E-Mail 2

E-Mail 4 — Benachrichtigung über Empfehlung erhalten (an Empfänger):
Betreff: [[First name] hat sich gerade mit Ihrem Link angemeldet]
Ziel: Teilnahme verstärken, zweite Empfehlung antreiben
Körper:
- Bestätigung: "[Name] hat sich angemeldet! Sie erhalten [Belohnung], wenn sie [konvertieren]."
- Fortschritt, falls zutreffend: "Sie haben [X] empfohlen — [Y mehr] bis [Bonusebene]"
- "Jemanden kennen?" — sekundärer CTA

Schreiben Sie alle 4 E-Mails für mein Produkt.
```

### Empfehlungs-Landingpage

```
Schreiben Sie Exemplare der Empfehlungs-Landingpage für [Produkt].

Seiten-URL: /invite oder /referral
Besucherkontext: angekommen über Empfehlungslink eines Freundes/Kollegen
Ihr Bewusstsein für das Produkt: Null bis niedrig
Das Angebot, das sie erhalten haben: [X]
Produktvorteil in einer Zeile: [beschreiben]

Seitenstruktur:

Held:
- Titel: "[Freund Name] hat dich zu [Produkt] eingeladen" (personalisiert über URL-Parameter)
- Untertitel: was das Produkt in einfachem Englisch tut
- Das Angebot: "[X] kostenlos, wenn Sie sich heute registrieren"
- CTA: "Beanspruchen Sie [X] und starten Sie" (aktionsbasierter Schaltflächentext)

Sozialbeweis (unten):
- [X] Kunden / [X] Teams / [X] verfolgter Umsatz
- 1-2 kurze Testimoniale

Wie es funktioniert (3 Schritte):
1. Erstellen Sie Ihr Konto (30 Sekunden)
2. [Erste Schlüsselaktion], um zu beginnen
3. [Aha-Moment] — [Belohnung freigeschaltet]

Häufig gestellte Fragen (2-3 Fragen):
- "Was bekomme ich umsonst?" → konkret antworten
- "Brauche ich eine Kreditkarte?" → antworten
- "Was passiert nach [Versuchen/Belohnungszeitraum]?" → antworten

CTA (unten wiederholt): gleich wie Held

Schreiben Sie die vollständige Seite mit allen Abschnitten.
```

### Betrugsprävention

```
Entwerfen Sie Betrugsprävention für ein Empfehlungsprogramm.

Belohnungstyp: [Kontogutschrift / Bargeldauszahlung / kostenlose Monate]
Auszahlungsauslöser: [bei Registrierung / beim ersten Kauf / bei Konversion bezahlt nach 30 Tagen]
Risikoniveau: [gering bewertete Belohnung / hoch bewertete Belohnung]

Häufige Betrugsmuster:
1. Selbstempfehlung: Benutzer erstellt ein zweites Konto, um sich selbst zu empfehlen
2. Gefälschte Registrierungen: Der Empfänger erstellt Dummy-Konten, um Belohnungen zu sammeln
3. Rückbuchungsbetrug: Kauf abgeschlossen → Empfehlungsbelohnung sammeln → Rückbuchung
4. Massenerstellung von Konten: Skripte erstellen Hunderte von Konten

Präventionsmaßnahmen:

Identitätsprüfungen:
□ Deduplizierung der E-Mail-Domäne (Variationen derselben Domäne blockieren: user+1@, user+2@)
□ IP-Adresse: Mehrere Anmeldungen aus derselben IP innerhalb von 24 Stunden kennzeichnen (nicht blockieren — zur Überprüfung kennzeichnen)
□ Geräte-Fingerprinting: Flagge gleiche Geräte registrieren sich mehrmals
□ Telefonverifizierung für Belohnungen über $[X]

Auszahlungsverzögerung:
□ Verzögern Sie den Belohnungsgutschrift um [30-60 Tage] — vorbei am Rückbuchungsfenster
□ Nicht auszahlen, bis der weitergeleitete Benutzer [X Tage] aktiv war oder [X] Aktionen durchgeführt hat

Selbstempfehlung:
□ Blockieren Sie die gleiche E-Mail-Domäne auf beiden Konten
□ Flagge, wenn die Rechnungsadresse einem bestehenden Kunden entspricht

Auszahlungsobergrenzen:
□ Maximal [X] Empfehlungen belohnt pro Benutzer pro Monat
□ Manuelle Überprüfung erforderlich über [X] Empfehlungen/Monat

Implementieren Sie diese Kontrollen nach Aufwand vs. Betrugsrisiko für mein Programm.
```

## Beispiel

**Benutzer:** Unser SaaS ($49/Monat, durchschnittliche 18-Monats-LTV = $882) hat kein Empfehlungsprogramm. Kunden erzählen uns häufig, dass sie uns Kollegen empfehlen. Wir lassen Geld auf dem Tisch. Entwerfen Sie eine.

**Empfehlung von Claude:**

Mit 882 $ LTV können Sie bis zu 220 $ bei Empfehlungskosten (25% des LTV) sparen und sind immer noch am besten über die meisten bezahlten Kanäle.

**Programmgestaltung:**

**Geben/Erhalten: $50 Gutschrift für Empfänger + $50 Gutschrift für Empfänger**

Warum Gutscheine, nicht Bargeld:
- Gutscheine haben für Sie ~0 Kosten (sie werden auf zukünftige Abonnements angewendet)
- Benutzer bleiben engagiert, um sie einzulösen
- Bargeld bei 50 $ pro Konversion ist echte P&L-Auswirkung

**Mechanik:**
- Empfehlungslink (kein Code) — generiert auf der Seite Kontoeinstellungen
- Auszahlungsauslöser: Der Empfänger bleibt 30 Tage lang im bezahlten Plan (verhindert Rückbuchungsbetrug)
- Dashboard: "Sie haben X Menschen empfohlen → $Y verdient"
- Obergrenzen: 10 belohnte Empfehlungen pro Benutzer pro Quartal

**Wann Sie fragen sollten:**
Nicht bei der Registrierung fragen. Fragen:
1. Nachdem sie ihren ersten Bericht exportiert haben (Aha-Moment)
2. Nach ihrem ersten NPS-Wert ≥ 9
3. Nach dem 3. Monat der aktiven Nutzung (Loyalitätssignal)

**Projizierte Mathematik:**
Wenn 5% Ihrer Benutzerbasis 1 Person empfehlen und 40% davon konvertieren → Kosten pro akquiriertem Kunden = $125 (gut unter Ihrem aktuellen CAC). Dies gibt typischerweise 15-25% neues Wachstum in reifen Empfehlungsprogrammen zurück.

**Startsequenz:**
1. Empfehlungslink-Generierung erstellen (1 Developer Sprint)
2. Bestehende Kunden per E-Mail über die Programmankündigung
3. In-App-Aufforderung bei den 3 obigen Triggermomenten hinzufügen
4. Teilnahmequote wöchentlich messen; iterieren Sie den Anreiz, wenn < 5% teilnehmen

---

# Claude für Immobilienmakler

Alles, was ein Wohnimmobilienmakler braucht, um KI-gestütztes Listing-Management, Käuferarbeit, CMA-Präsentationen, Kundenakquise und Kundenkommunikation in Claude Code durchzuführen.

---

## Für wen das gedacht ist

Du bist Immobilienmakler — solo oder im Team — und verdienst deinen Lebensunterhalt durch die Umwandlung von Beziehungen in abgeschlossene Transaktionen. Deine Zeit wird aufgefressen durch das Schreiben von Listing-Beschreibungen, das Recherchieren von Vergleichsobjekten, das Verfassen von Angebotsschreiben, das Nachverfolgen von Leads und das Informieren von 20 aktiven Klienten. Claude Code beseitigt die repetitive Schreibarbeit, damit du bei Kunden sein kannst statt hinter der Tastatur.

**Vor Claude Code:** 45 Minuten für eine CMA-Erläuterung. 20 Minuten pro Listing-Beschreibung. 15 Minuten pro Besichtigungs-Follow-up. Stunden Marktrecherche pro Woche.

**Danach:** CMA-Erläuterung in 3 Minuten. Listing-Beschreibung in 90 Sekunden. Besichtigungs-Follow-up in 60 Sekunden. Wöchentliches Marktupdate in 5 Minuten.

---

## 30-Sekunden-Installation

```bash
# Installiere alle Immobilien-Skills
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/customer-inquiry

# Installiere den Immobilien-Spezialisten-Agent
npx claudient add agent roles/real-estate-specialist
```

---

## Dein Claude Code Immobilien-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/real-estate-listing` | MLS-Beschreibungen, Besichtigungs-Follow-ups, Lead-Nurture-Sequenzen, Social-Posts — Fair-Housing-konform | Neues Listing, nach Besichtigung, Social-Content |
| `/cma-report` | Vollständige CMA-Erläuterung: Auswahl der Vergleichsobjekte, Anpassungsanalyse, Preisstaffelungen, Verkäuferpräsentation | Jeder Listing-Termin |
| `/buyer-offer-writer` | Persönliche Anschreiben und Makler-zu-Makler-Briefe für Angebote — emotionale und wettbewerbsintensive Szenarien | Jede Angebotsabgabe |
| `/cold-outreach` | Farmingbriefe, FSBO-Outreach, Expired-Outreach, Kontakte im Einflussbereich | Akquise-Kampagnen |
| `/customer-inquiry` | Auf eingehende Käufer-/Verkäufer-Anfragen antworten — qualifizieren, pflegen, konvertieren | Neue Leads von Zillow, Realtor.com, Empfehlungen |

### Agent

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `real-estate-specialist` | Sonnet | Vollständige Listing-Vorbereitungssessions, Käuferberatungs-Vorbereitung, Marktrecherche |

---

## Täglicher Workflow

### Morgen (20–30 Minuten)

**1. Lead-Follow-up — neue Anfragen von über Nacht**
```
/customer-inquiry

Ich habe [X] neue Leads von [Zillow / Empfehlung / Tag der offenen Tür]. Hier sind die Details:

Lead 1:
Name: [Name]
Quelle: [Quelle]
Nachricht: [was er gesagt hat]
Objekt, nach dem er gefragt hat: [Adresse oder Preisbereich]
Zeitrahmen: [was du weißt]

Antworten für jeden entwerfen. Warm, professionell, auf ein Telefonat oder eine Besichtigung hinarbeiten.
```

**2. Besichtigungs-Follow-ups — gestrige Besichtigungen**
```
/real-estate-listing

Besichtigungs-Follow-up für:
- Käufername: [Name]
- Objekt: [Adresse]
- Was sie mögen: [Notizen aus der Besichtigung]
- Geäußerte Bedenken: [Notizen]
- Ihr Zeitrahmen: [X Monate]
- Wettbewerb: [andere Objekte, die sie gesehen haben]

Eine personalisierte Follow-up-E-Mail entwerfen. Etwas Konkretes aus der Besichtigung referenzieren. Weicher nächster Schritt.
```

---

### Listing-Termin-Vorbereitung (60–90 Minuten vorher)

**3. CMA-Bericht — vollständige Verkäuferpräsentation**
```
/cma-report

Referenzobjekt: [Zimmer/Bäder, qm, Lage, Baujahr, Renovierungen]

Vergleichbare Verkäufe:
Vergleich 1: [Details]
Vergleich 2: [Details]
Vergleich 3: [Details]

Aktiver Wettbewerb:
Aktiv 1: [Details]
Aktiv 2: [Details]

Marktkontext: [Absorptionsrate, Ø Vermarktungsdauer, Angebotspreisquote]
Zeitplan des Verkäufers: [X Wochen]
Mein empfohlener Preisbereich: $[X] – $[X]

Den vollständigen CMA-Bericht und die Verkäuferpräsentations-Erläuterung generieren.
```

**4. Listing-Marketing — MLS-Text und Social**
```
/real-estate-listing

Neues Listing — MLS-Beschreibung und Social-Media-Beiträge schreiben.

Objekt: [Zimmer/Bäder, qm, Hauptmerkmale, Lage]
Top-5-Merkmale: [Liste]
Lifestyle des Zielkäufers: [beschreiben]
MLS-Zeichenbegrenzung: [X Wörter]
```

---

### Angebotssituationen

**5. Käufer-Angebotsschreiben — wettbewerbsintensives Szenario**
```
/buyer-offer-writer

Käufer: [Vornamen]
Angebot: $[X] bei $[X] Listenpreis
Verkäuferprofil: [was du weißt — langjährige Besitzer, hat Wert auf Erbe, etc.]
Was Käufer am Objekt lieben: [spezifische Merkmale]
Käufer-Stärken: [Vorfinanzierungsgenehmigung, Anzahlung, Kontingenzverzichte]
Wettbewerbskontext: [mehrere Angebote erwartet]

Persönliches Anschreiben generieren (Fair-Housing-konform) + Makler-Anschreiben.
```

---

### Wöchentliche Aufgaben (Freitag — 30 Minuten)

**6. Marktupdate für aktive Kunden**
```
/cold-outreach

Ein wöchentliches Marktupdate für meine aktiven Käuferkunden schreiben.

Marktdaten dieser Woche:
- Neue Listings in ihrem Preisbereich: [X]
- Preissenkungen: [X]
- Verkauft diese Woche: [X]
- Durchschnittlicher Verkaufspreis: $[X]
- Ø Vermarktungsdauer: [X] Tage
- Zinssatz-Update: [X]%

Suchkriterien meiner Kunden: [Preisbereich, Gebiet, Objekttyp]
Ton: Informativ, fachkundig, nicht alarmistisch. Mich als ihren Vertrauensberater positionieren.
```

**7. Kontakt im Einflussbereich — monatliches Farming**
```
/cold-outreach

Monatliche Farming-E-Mail an meinen Einflussbereich.

Thema diesen Monat: [Marktupdate / Wohnungspflegetipp / lokale Veranstaltung / Listing-Bekanntmachung]
Mein Farmgebiet: [Nachbarschaft]
Ziel: Im Gedächtnis bleiben, nicht verkaufen.

Eine 150-Wort-E-Mail entwerfen, die persönlich klingt, nicht wie ein Newsletter. Eine nützliche Information und einen weichen CTA (Kaffee-Treffen, Hauswertprüfung, Empfehlungsanfrage) einschließen.
```

---

## 30-Tage-Einarbeitungsplan (neue Makler oder neuer Markt)

### Woche 1 — Einrichtung und Marktwissen
- Alle Immobilien-Skills über `npx claudient add skill small-business/[name]` installieren
- `/cma-report` für 5 aktuelle Verkäufe in deinem Farmgebiet ausführen, um deine Vergleichsobjekt-Analyse zu kalibrieren
- `/real-estate-listing` nutzen, um 3 vergangene Listing-Beschreibungen neu zu schreiben — Qualität vergleichen
- Einflussbereich abbilden: 50 Kontakte → `/cold-outreach` für den ersten Kontakt ausführen

### Woche 2 — Listing- und Käufer-Workflows
- Eine vollständige Listing-Termin-Simulation mit `/cma-report` für das Haus eines Nachbarn durchführen (Übung)
- Erste 10 Besichtigungs-Follow-ups mit `/real-estate-listing` schreiben — Timer stellen: Ziel < 3 Min. jeder
- Eine 4-Kontakt-Käufer-Nurture-Sequenz mit `/real-estate-listing` für einen 6-Monate-Käufer aufbauen

### Woche 3 — Akquise
- Erste FSBO-Outreach-Kampagne mit `/cold-outreach` starten — 10 FSBOs in deinem Gebiet
- Expired-Outreach: 5 kürzlich abgelaufene Listings identifizieren, personalisierten Outreach entwerfen
- Geografisches Farming durchführen: 100-Haus-Gebiet, monatlicher Kontakt, Antwortrate tracken

### Woche 4 — Wettbewerbssituationen
- `/buyer-offer-writer` vor der Einreichung des nächsten Käuferangebots üben
- Den Eskalationsklausel-Prompt ausführen — die Mechanik verstehen, bevor sie im Moment benötigt wird
- Kennzahlen verfolgen: Besichtigungen pro Listing, Follow-up-Antwortrate, CMA-Termin-Konversion

---

## Tool-Integrationen

### Dein CRM

```json
// Zu ~/.claude/settings.json für CRM-verbundenen Workflow hinzufügen
// Die meisten Makler verwenden Follow Up Boss, LionDesk oder KVCore
{
  "mcpServers": {
    "followupboss": {
      "command": "npx",
      "args": ["-y", "@followupboss/mcp-server"],
      "env": {
        "FUB_API_KEY": "your-key-here"
      }
    }
  }
}
```

Mit verbundenem CRM kann Claude:
- Die vollständige Historie eines Kontakts abrufen, bevor das Follow-up entworfen wird
- Interaktionen nach jeder Kundenkommunikation protokollieren
- Kontakte markieren, die seit 30+ Tagen nicht kontaktiert wurden

### MLS-Daten
Vergleichsdaten als CSV exportieren oder direkt aus deinem MLS einfügen → Claude liest sie und formatiert sie für die CMA-Analyse. Keine spezielle Integration nötig.

### DocuSign / DotLoop
Claude entwirft die Formulierungen und Gesprächspunkte — du fügst sie in deine Transaktionsmanagement-Plattform ein. Zukünftig: Webhook-Trigger für automatischen Entwurf, wenn ein Formular geöffnet wird.

### Canva / Marketingmaterialien
Claude nutzen, um den Text zu generieren → in Canva-Vorlagen für Listing-Flyer, Social-Posts und Farming-Mailer einfügen. Claude passt sich an Zeichenbegrenzungen an, wenn du diese angibst.

---

## Zu verfolgende Kennzahlen

| Kennzahl | Baseline (manuell) | Ziel mit Claude |
|---|---|---|
| Zeit pro Listing-Beschreibung | 45 Min. | 5 Min. |
| Zeit pro CMA-Erläuterung | 60 Min. | 10 Min. |
| Zeit pro Besichtigungs-Follow-up | 15 Min. | 3 Min. |
| Kontakthäufigkeit Einflussbereich | Monatlich (wenn daran gedacht) | Wöchentlich (automatisierte Entwürfe) |
| Listing-Termin-Konversion | Ab erster CMA tracken | Nach 10 CMAs als Benchmark |
| Angebots-Annahmerate (Käuferseite) | Tracken | Brief vs. kein Brief tracken |

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Verstöße gegen das Fair Housing in Listing-Texten**
Claude markiert und entfernt Sprache über geschützte Klassen automatisch. Du führst trotzdem die abschließende Prüfung durch — Claude ist eine Schutzmaßnahme, keine Garantie.

**Fehler 2: Generische Besichtigungs-Follow-ups, die ignoriert werden**
`/real-estate-listing` erfordert, dass du spezifische Notizen aus der Besichtigung lieferst. Keine Notizen = keine E-Mail. Zwingt dich, während der Besichtigung zuzuhören.

**Fehler 3: CMA ohne Erläuterung präsentieren**
Verkäufer erinnern sich nicht an Daten — sie erinnern sich an Geschichten. `/cma-report` generiert die Erläuterung, die du vorträgst. Das ist der Unterschied zwischen einem Preis und einem Gespräch.

**Fehler 4: Einen Käuferbrief überpersonalisieren und Fair-Housing-Haftung auslösen**
`/buyer-offer-writer` prüft vor der Einreichung auf Sprache über geschützte Klassen.

**Fehler 5: Kontakte im Einflussbereich erkalten lassen**
Wöchentliche Erinnerung setzen → `/cold-outreach` → monatlicher Einflussbereich-Kontakt in 5 Minuten.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [Immobilien-Listing-Skill](../skills/small-business/real-estate-listing.md)
- [CMA-Bericht-Skill](../skills/small-business/cma-report.md)
- [Käufer-Angebotsschreiben-Skill](../skills/small-business/buyer-offer-writer.md)
- [Cold-Outreach-Skill](../skills/small-business/cold-outreach.md)

---

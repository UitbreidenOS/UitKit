---
name: spec-driven-workflow
description: "Spec-gesteuerte Entwicklung: Schreiben Sie zuerst die Spezifikation, dann die Tests, dann die Implementierung — reduziert Rework, klärt Anforderungen vor dem Codieren und produziert bessere dokumentierte Systeme"
---

# Spec-gesteuertes Workflow Skill

## Wann aktivieren
- Eine nicht triviale Funktion starten, bei der Anforderungen mehrdeutig sind
- Bauen Sie eine API oder ein Interface, das andere Teams verwenden werden
- Rework reduzieren, das durch das Bauen des falschen Dings verursacht wird
- Testgetriebene Entwicklung (TDD) auf Funktionsebene praktizieren
- Wollen Sie, dass Claude die Spezifikation versteht, bevor Code geschrieben wird

## Wann NICHT verwenden
- Kleine Bug-Fixes — reparieren Sie sie einfach
- Explorative Prototypen, bei denen das Ziel darin besteht, zu lernen, nicht zu versenden
- Aufgaben, bei denen die Spezifikation bereits perfekt klar und geschrieben ist
- Hotfixes, die sofort raus gehen müssen

## Anweisungen

### Spec-First-Vorlage

```
Schreiben Sie eine Spezifikation für [Funktion].

Funktion: [Beschreiben Sie in einfachem Englisch, was Sie bauen möchten]
Benutzer: [Wer wird diese Funktion nutzen]
Kontext: [Wo passt dies in das System — welcher Service, Seite oder API]
Einschränkungen: [Leistung, Sicherheit, Abwärtskompatibilität, bestehende Schnittstellen]

Spezifikationsvorlage:

## Funktion: [Name]

### Zusammenfassung
[1-2 Sätze — was diese Funktion tut und warum]

### Hintergrund
[Warum bauen wir das? Welches Problem löst es?]

### Umfang
Im Geltungsbereich:
- [Spezifisches Verhalten 1]
- [Spezifisches Verhalten 2]

Außerhalb des Geltungsbereichs (explizit):
- [Ding, das wir NICHT bauen]
- [Edge-Fall, den wir verschieben]

### Schnittstellendefinition
[Für eine API: Endpunkte, Eingaben, Ausgaben, Statuscodes]
[Für eine Benutzeroberfläche: Benutzerreise, Status, Übergänge]
[Für eine Bibliothek: Funktionssignaturen, Typen, Rückgabewerte]

Beispiel (API):
POST /api/invoices
Anfrage:
  { customer_id: string, items: [{sku: string, qty: int, price_cents: int}], due_date: string }
Antwort 201:
  { invoice_id: string, total_cents: int, pdf_url: string }
Antwort 400:
  { error: "invalid_customer" | "items_empty" | "invalid_date" }

### Akzeptanzkriterien (testbar)
Format: Gegeben [Kontext], wenn [Aktion], dann [beobachtbares Ergebnis]

- GEGEBEN einen gültigen Kunden und Artikel, WENN der Endpunkt aufgerufen wird, DANN wird eine 201-Antwort mit invoice_id zurückgegeben
- GEGEBEN eine ungültige customer_id, WENN der Endpunkt aufgerufen wird, DANN wird eine 400-Antwort mit error: "invalid_customer" zurückgegeben
- GEGEBEN ein leeres items-Array, WENN der Endpunkt aufgerufen wird, DANN wird eine 400-Antwort zurückgegeben
- GEGEBEN Artikel mit negativem Preis, WENN der Endpunkt aufgerufen wird, DANN wird eine 400-Antwort zurückgegeben

### Offene Fragen (vor dem Bauen lösen)
- [ ] [Frage 1 — Entscheidung erforderlich]
- [ ] [Frage 2 — Annahme zu validieren]

### Abhängigkeiten
- [Externer Service oder API, von dem dies abhängt]
- [Interne Service- oder Team-Abhängigkeit]

Schreiben Sie die vollständige Spezifikation für meine Funktion.
```

### Spec-zu-Test-Übersetzung

```
Konvertieren Sie diese Spezifikation in fehlgeschlagene Tests vor der Implementierung.

Spezifikation: [fügen Sie Spezifikation von oben ein]
Sprache/Framework: [TypeScript/Jest / Python/pytest / Go/testing / Ruby/RSpec]

Regeln für Spec-zu-Test:
1. Ein Test pro Akzeptanzkriterium
2. Testen Sie die Schnittstelle (Eingaben/Ausgaben), nicht die Implementierung
3. Tests sollten als Dokumentation lesbar sein — jemand sollte die Funktion verstehen, indem er die Tests liest
4. Unglückliche Pfade sind genauso wichtig wie glückliche Pfade

TypeScript/Jest-Beispiel (aus der obigen Rechnungsspezifikation):

describe('POST /api/invoices', () => {
  describe('success cases', () => {
    it('creates an invoice with valid inputs and returns 201 with invoice_id', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [{ sku: 'SKU-001', qty: 2, price_cents: 2999 }],
        due_date: '2026-12-31',
      });
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        invoice_id: expect.stringMatching(/^inv_/),
        total_cents: 5998,
        pdf_url: expect.stringContaining('https://'),
      });
    });
  });

  describe('validation errors', () => {
    it('returns 400 with invalid_customer when customer_id does not exist', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_nonexistent',
        items: [{ sku: 'SKU-001', qty: 1, price_cents: 1000 }],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_customer');
    });

    it('returns 400 when items array is empty', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('items_empty');
    });
  });
});

Konvertieren Sie meine Spezifikation in fehlgeschlagene Tests. Tests sollten fehlschlagen, bis ich die Funktion implementiere.
```

### Implementierung aus Spezifikation

```
Implementieren Sie [Funktion] gemäß dieser Spezifikation und Tests.

Spezifikation: [fügen Sie Spezifikation ein]
Tests: [fügen Sie fehlgeschlagene Tests ein]
Sprache/Framework: [angeben]
Bestehendes Code-Kontext: [fügen Sie relevante bestehende Schnittstellen, Typen oder benachbarten Code ein]

Implementierungsregeln:
1. Machen Sie die Tests bestanden — nichts mehr, nichts weniger
2. Bauen Sie keine Funktionen, die nicht in der Spezifikation sind (auch wenn sie offensichtlich erforderlich sind)
3. Optimieren Sie nicht vorzeitig — einfach und korrekt schlägt intelligent
4. Bearbeiten Sie jeden Fehlerfall in den Akzeptanzkriterien der Spezifikation
5. Fragen Sie, ob ein Akzeptanzkriterium mehrdeutig ist, anstatt anzunehmen

Implementierungsreihenfolge:
1. Definieren Sie zuerst Typen / Schnittstellen (kompilieren Sie keine Ausgabe, dokumentieren Sie die Form)
2. Happy-Path-Implementierung (machen Sie den 201-Test bestanden)
3. Validierung und Fehlerbehandlung (machen Sie die 400-Tests bestanden)
4. Edge-Fälle (falls in der Spezifikation vorhanden)
5. Führen Sie alle Tests aus — bestätigen Sie alle bestanden, bevor Sie einreichen

Der produzierte Code muss:
- Kein TODOs oder Platzhalterkommentare haben
- Keinen auskommentartierten Code haben
- Ohne Änderung kompilieren und ausgeführt werden

Implementieren Sie die Funktion.
```

### Spezifikationsbewertung

```
Bewerten Sie diese Spezifikation, bevor wir sie bauen.

Spezifikation: [fügen Sie ein]
Ziel: Mehrdeutigkeiten, fehlende Edge-Cases und nicht ausgerichtete Annahmen vor dem Codieren zu erfassen

Bewertungs-Checkliste:

VOLLSTÄNDIGKEIT:
□ Sind alle Eingaben vollständig angegeben (Typen, Formate, Einschränkungen)?
□ Sind alle Ausgaben vollständig angegeben (Erfolg + Fehlerantworten)?
□ Sind alle Fehlerzustände aufgelistet?
□ Sind Akzeptanzkriterien spezifisch und testbar?
□ Sind Out-of-Scope-Elemente explizit angegeben?

MEHRDEUTIGKEIT:
□ Ist ein Kriterium offen für mehrere Interpretationen?
□ Werden Begriffe durchgehend konsistent verwendet?
□ Gibt es implizite Annahmen, die explizit sein sollten?
□ Benötigt "due_date: string" eine Formatspezifikation? (ISO 8601? YYYY-MM-DD? Zeitzonenbewusstsein?)

FEHLENDE EDGE-FÄLLE:
□ Was passiert bei leeren Eingaben?
□ Was passiert bei maximaler Eingabegröße?
□ Was passiert, wenn eine Abhängigkeit nicht verfügbar ist?
□ Was passiert bei gleichzeitigen Anfragen?
□ Was passiert nach der Drosselung?

SCHNITTSTELLENBEWERTUNG:
□ Ist die API konsistent mit bestehenden Endpunkten?
□ Werden Namenskonventionen befolgt?
□ Ist das Antwortformat konsistent mit anderen Endpunkten?
□ Werden Statuscodes korrekt verwendet (201 für erstellen, 200 für aktualisieren, 404 für nicht gefunden)?

OFFENE FRAGEN:
□ Sind alle offenen Fragen vor dem Bauen gelöst?
□ Gibt es Entscheidungen, die verschoben werden, aber jetzt getroffen werden sollten?

Produzieren: Liste der Lücken und Fragen, die vor Beginn der Implementierung zu klären sind.
```

## Beispiel

**Benutzer:** Ich möchte eine Funktion erstellen, bei der Benutzer eine CSV-Datei mit Kontakten hochladen und diese massenimportieren können. Helfen Sie mir, es zuerst zu spezifizieren.

**Claudies Spezifikation:**

---

## Funktion: Massenimport von Kontakten via CSV

### Zusammenfassung
Ermöglichen Sie Benutzern, eine CSV-Datei mit Kontaktdaten hochzuladen. Das System validiert jede Zeile, importiert gültige Kontakte und gibt einen Bericht mit Erfolgen und Fehlern zurück.

### Umfang
Im Geltungsbereich:
- CSV-Datei-Upload über API-Endpunkt
- Validierung jeder Zeile (erforderliche Felder, Format)
- Import gültiger Zeilen als Kontakte
- Fehlerberichterstattung pro Zeile (welche Zeilen fehlgeschlagen sind und warum)
- Duplikatdetektion (gleiche E-Mail → ignorieren oder aktualisieren, konfigurierbar)

Außerhalb des Geltungsbereichs:
- UI-Dateiauswahlprogramm (vorerst nur API)
- CSV-Template-Download
- Asynchrone Verarbeitung für Dateien > 10.000 Zeilen (synchron für v1)
- Kontaktentduplizierung über bestehende Kontakte (nur E-Mail-Übereinstimmung)

### Schnittstellendefinition

```
POST /api/contacts/import
Content-Type: multipart/form-data

Felder:
  file: CSV-Datei (erforderlich)
  duplicate_strategy: "skip" | "update" (optional, Standard: "skip")

CSV-Format (Header-Zeile erforderlich):
  email (erforderlich), first_name, last_name, phone, company

Antwort 200 (immer 200, auch wenn einige Zeilen fehlgeschlagen sind):
{
  total_rows: 847,
  imported: 821,
  skipped: 14,        // duplicates
  failed: 12,          // validation errors
  errors: [
    { row: 3,  email: "bad-email", reason: "invalid_email_format" },
    { row: 17, email: null,       reason: "email_required" },
  ]
}

Antwort 400 (Fehler auf Dateiebene vor Verarbeitung):
  { error: "no_file_attached" | "invalid_file_type" | "file_too_large" }
  Maximale Dateigröße: 10MB
```

### Akzeptanzkriterien
- GEGEBEN ein gültiges CSV mit 100 Zeilen, WENN importiert, DANN wird 200 mit imported: 100 zurückgegeben
- GEGEBEN ein CSV mit 1 ungültiger E-Mail, WENN importiert, DANN ist die Zeile in errors[], alle anderen importiert
- GEGEBEN keine angehängte Datei, WENN der Endpunkt aufgerufen wird, DANN 400 mit no_file_attached
- GEGEBEN eine .xlsx-Datei, WENN hochgeladen, DANN 400 mit invalid_file_type
- GEGEBEN duplicate_strategy: "skip" und eine doppelte E-Mail, WENN importiert, DANN ist das Duplikat in der übersprungenen Anzahl
- GEGEBEN duplicate_strategy: "update" und eine doppelte E-Mail, WENN importiert, DANN wird der bestehende Kontakt aktualisiert

### Offene Fragen (vor dem Bauen lösen)
- [ ] Wie viele Zeilen maximal pro Datei? (vorgeschlagen: 10.000 — benötigt PM-Freigabe)
- [ ] Welche Felder sind erforderlich vs. optional? (vorgeschlagen: nur E-Mail erforderlich)
- [ ] Ist "company" eine Freitextzeichenfolge oder mit einem Company-Datensatz verknüpft?
- [ ] Wer kann diesen Endpunkt aufrufen — alle Benutzer oder nur Administratoren?

---

Lösen Sie zuerst die offenen Fragen, dann generiere ich die fehlgeschlagenen Tests.

---

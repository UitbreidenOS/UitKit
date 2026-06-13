# Hauptbuch-Bruchverfolgung

## Wann aktivieren

Untersuchung einer Hauptbuch-Abstimmungsbruch, unerklärte Abweichung in einer Probebilanz, Nebenbuch-zu-Hauptbuch-Nichtübereinstimmung oder eine Monatsabschluss-Diskrepanz. Verwenden Sie, wenn eine numerische Differenz zwischen zwei Darstellungen derselben Finanzposition besteht und die Grundursache unbekannt ist.

## Wann NICHT verwenden

Enregistrement von Journaleinträgen oder Anpassungen. Diese Kompetenz diagnostiziert nur — ein Resolver (Mensch oder separater Ablauf) bucht alle Korrektionen nach Überprüfung. Verwenden Sie diese Kompetenz nicht, um Buchungen ohne Genehmigung eines qualifizierten Wirtschaftsprüfers vorzuschlagen.

## Anleitung

Dreiphasige Untersuchung :

**Phase 1 — Hauptbuch-Ebene**

Lesen Sie den Kontosaldo des Hauptbuchs. Identifizieren Sie den Berichtszeitraum, den Kontocode und die Entität. Extrahieren Sie die Nettobewegung und den Endsaldo. Erfassen Sie die Quelle (ERP-System, Berichtsname, Ausführungsdatum).

**Phase 2 — Nebenbuch-Ebene**

Ziehen Sie das entsprechende Nebenbuch oder die Unterstützungsplan. Summieren Sie die Nebenbuchsalden für den gleichen Zeitraum und Kontenbereich. Vergleichen Sie mit dem Endsaldo des Hauptbuchs :

```
Netto-Differenz = Hauptbuchsaldo − Nebenbuch-Gesamtsumme
```

Wenn Netto-Differenz = 0, besteht kein Bruch. Wenn nicht-null, fahren Sie mit Phase 3 fort.

**Phase 3 — Attribut-Vergleich**

Identifizieren Sie für jedes Zeilenelement, das zum Bruch beiträgt, das Attribut, das sich unterscheidet :

- Datum (Stichtagsunterschied)
- Betrag (Rundung, Währungsumwandlung, doppelter Eintrag)
- Gegenpartei (falsch kodierter Lieferant/Kunde)
- Währung (FX-Satz unterschiedlich angewendet)
- Kostenstelle oder Geschäftseinheit (Konzernfehler bei der Allokation)
- Transaktionstyp (falsch klassifizierte Buchung)

Format der Ursachen-Erklärung : `"[Hauptbuch-Seite] [Aktion] weil [Nebenbuch-Grund]"`

Beispiel : `"Hauptbuch-Belastung gebucht am 31-05-2026 weil Nebenbuch-Eintrag datiert am 01-06-2026 — Stichtagsunterschied"`

**Ausgabeformat (JSON) :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Hauptbuch-Belastung gebucht am 31-05-2026 ; Nebenbuch-Eintrag datiert am 01-06-2026 (Stichtagsunterschied)",
  "owner": "AP-Team",
  "action": "adjust",
  "action_detail": "Hauptbuch-Eintrag in Juni-Periode umklassifizieren ; Stornoeintrag datiert 01-06-2026 buchen",
  "verification": "Abstimmung nach Buchung erneut ausführen — Bruch sollte auf null ausgeebnet werden"
}
```

**Aktionstypen :**

| Typ | Bedeutung |
|------|---------|
| `monitor` | Überwachen aber noch keine Maßnahmen ergreifen — Differenz ist zeitbezogen und sollte sich von selbst aufklären |
| `adjust` | Korrektiveintrag buchen, um Bruch zu beheben |
| `raise-ticket` | An vorgelagerten System-Eigentümer eskalieren — Grundursache ist System- oder Feed-Fehler außerhalb der Buchhaltung |
| `suppress` | Bekannte permanente Differenz — dokumentieren und Genehmigung einholen ; aus zukünftigen Abstimmungen ausschließen |

**Sicherheitstor :** Diese Kompetenz erzeugt eine Diagnose und empfohlene Maßnahme. Alle vorgeschlagenen Journaleinträge müssen von einem qualifizierten Wirtschaftsprüfer überprüft und genehmigt werden, bevor sie gebucht werden. Niemals direkt aus der Ausgabe dieser Kompetenz buchen.

## Beispiel

**Eingabe :** « Das AP-Nebenbuch zeigt 45.230 $ ausstehende Rechnungen, aber das AP-Hauptbuch-Konto zeigt 57.680 $ für denselben Zeitraum. Verfolgen Sie den 12.450 $-Bruch und identifizieren Sie die Grundursache. »

**Erwartete Ausgabe :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Zwei Hauptbuch-Einträge insgesamt 12.450 $ haben keine entsprechenden Nebenbuch-Einträge — wahrscheinlich manuelle Journaleinträge, die direkt auf das Hauptbuch-Konto gebucht wurden, das AP-Modul umgehend",
  "owner": "AP-Team",
  "action": "raise-ticket",
  "action_detail": "Manuelle JE durch Abfrage von Hauptbuch-Transaktionen ohne Nebenbuch-Referenz für den Zeitraum identifizieren. Bestimmen Sie, ob diese gültig (Umklassifizierung) oder fehlerhaft (Duplikat) sind. Zu GL-Controller eskalieren zur Überprüfung.",
  "verification": "Nach Auflösung AP-Abstimmung erneut ausführen — Bruch sollte auf null ausgeebnet oder mit dokumentierter Begründung unterdrückt werden"
}
```

---

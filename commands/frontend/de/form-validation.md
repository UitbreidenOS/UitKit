---
description: Formularvalidierung mit Schema, Fehleranzeige und zugänglichen Fehlermeldungen hinzufügen oder beheben
argument-hint: "[file] [library: zod|yup|valibot|native]"
---
Implementieren oder reparieren Sie die Formularvalidierung in: $ARGUMENTS

Parse Args: Das erste Token ist die Zieldatei; optionaler Bibliotheksname setzt die automatische Erkennung außer Kraft.

**Schritt 1 — Vorhandenen Stack erkennen**
Scannen Sie auf Importe von: `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Verwenden Sie, was bereits installiert ist. Wenn nichts installiert ist, verwenden Sie standardmäßig `react-hook-form` + `zod`.
Installieren Sie keine neuen Pakete, ohne sie explizit zu notieren.

**Schritt 2 — Schema definieren**
Leiten Sie für jedes Feld im Formular Validierungsregeln ab von:
- Feldnamensemantik (E-Mail, Telefon, URL, Passwort, Datum)
- Vorhandene Einschränkungen im Markup sichtbar (`required`, `minLength`, `pattern`, `type`)
- Alle serverseitigen Validierungslogiken, die in der Codebasis sichtbar sind

Schema-Regeln zum Anwenden:
- `email`: `.email()` mit einer benutzerfreundlichen Nachricht
- `password`: mindestens 8 Zeichen, mindestens eine Zahl oder ein Symbol — emittieren Sie die Einschränkung deutlich in der Nachricht
- `url`: `.url()` — leere Zeichenkette nur zulassen, wenn das Feld optional ist
- `phone`: E.164-Regex oder gebietsschemaabhängiges Muster
- Erforderliche Felder: explizit `.min(1, "Field is required")` — nicht nur `.nonempty()`
- Optionale Felder: mit `.optional()` oder `.nullable()` umwickeln, je nach Bedarf — nicht mehrdeutig lassen

**Schritt 3 — Validierung mit dem Formular verbinden**
Für react-hook-form:
- Verwenden Sie `resolver` mit dem Resolver-Adapter der Schemabibliothek
- Ersetzen Sie manuelle `onChange`-Validierung durch `register()` und `formState.errors`
- Verwenden Sie `handleSubmit` — rufen Sie nicht manuell `preventDefault` auf

Für formik:
- Übergeben Sie die Prop `validationSchema`
- Verwenden Sie `<ErrorMessage>`-Komponente oder `formik.errors[field]` — nicht ad hoc String-Prüfungen

**Schritt 4 — Fehleranzeige**
Jede Fehlermeldung muss:
- Unter dem relevanten Input angezeigt werden, nicht in einem Toast oder Alert-Banner
- Mit dem Input über `aria-describedby` verknüpft sein, das auf die `id` des Fehlerelements zeigt
- `aria-invalid="true"` auf dem Input setzen, wenn ein Fehler vorhanden ist
- `role="alert"` auf dem Fehler-Container verwenden, wenn es nach einer Benutzeraktion angezeigt wird (nicht beim initialen Rendern)
- Rote Farbe nicht allein verwenden, um den Fehlerzustand zu vermitteln — ein Symbol oder Text-Präfix wie „Error:" einschließen

**Schritt 5 — Absendeverhalten**
- Deaktivieren Sie den Absenden-Button während der Übermittlung (`isSubmitting`)
- Aktivieren Sie ihn bei Fehler wieder, damit der Benutzer erneut versuchen kann
- Löschen Sie Fehler auf Feldebene bei erfolgreichem erneuten Absenden
- Wenn der Server Feldfehler zurückgibt (400 mit Fehler-Map), wenden Sie sie über `setError` auf die korrekten Felder an

Wenden Sie alle Änderungen auf die Datei an. Listieren Sie jedes aktualisierte Feld und jede neue Validierungsregel auf, die hinzugefügt wurde.

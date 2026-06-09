---
description: Formularvalidierung mit Schema, Fehleranzeige und zugänglichen Fehlermeldungen hinzufügen oder beheben
argument-hint: "[file] [library: zod|yup|valibot|native]"
---
Implementieren oder reparieren Sie die Formularvalidierung in: $ARGUMENTS

Parse args: das erste Token ist die Zieldatei; der optionale Bibliotheksname überschreibt die automatische Erkennung.

**Schritt 1 — Vorhandenen Stack erkennen**
Suchen Sie nach Importen von: `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Verwenden Sie, was bereits installiert ist. Wenn nichts installiert ist, verwenden Sie als Standard `react-hook-form` + `zod`.
Installieren Sie keine neuen Pakete, ohne sie explizit zu notieren.

**Schritt 2 — Schema definieren**
Leiten Sie für jedes Feld im Formular Validierungsregeln ab von:
- Feldnamensemantik (E-Mail, Telefon, URL, Passwort, Datum)
- Vorhandene sichtbare Einschränkungen im Markup (`required`, `minLength`, `pattern`, `type`)
- Beliebige serverseitige Validierungslogik, die im Codebase sichtbar ist

Anzuwendende Schemarregeln:
- `email`: `.email()` mit einer benutzerfreundlichen Nachricht
- `password`: mindestens 8 Zeichen, mindestens eine Zahl oder ein Symbol — die Einschränkung deutlich in der Nachricht angeben
- `url`: `.url()` — leeren String nur zulassen, wenn das Feld optional ist
- `phone`: E.164-Regex oder gebietsschemaabhängiges Muster
- Erforderliche Felder: explizit `.min(1, "Field is required")` — nicht nur `.nonempty()`
- Optionale Felder: mit `.optional()` oder `.nullable()` umwickeln, wie angemessen — nicht mehrdeutig lassen

**Schritt 3 — Validierung mit dem Formular verbinden**
Für react-hook-form:
- Verwenden Sie `resolver` mit dem Resolver-Adapter der Schemabibliothek
- Ersetzen Sie beliebige manuelle `onChange`-Validierung durch `register()` und `formState.errors`
- Verwenden Sie `handleSubmit` — rufen Sie nicht manuell `preventDefault` auf

Für formik:
- Übergeben Sie `validationSchema`-Prop
- Verwenden Sie `<ErrorMessage>`-Komponente oder `formik.errors[field]` — nicht ad-hoc-Stringprüfungen

**Schritt 4 — Fehleranzeige**
Jede Fehlermeldung muss:
- Unterhalb der relevanten Eingabe angezeigt werden, nicht in einem Toast oder Alert-Banner
- über `aria-describedby`, das auf die `id` des Fehlerelements verweist, mit der Eingabe verknüpft sein
- `aria-invalid="true"` auf der Eingabe festlegen, wenn ein Fehler vorhanden ist
- `role="alert"` auf dem Fehlercontainer verwenden, wenn er nach einer Benutzeraktion angezeigt wird (nicht beim ersten Rendern)
- nicht nur rote Farbe verwenden, um den Fehlerstatus zu vermitteln — ein Symbol oder ein Textpräfix wie "Error:" einbinden

**Schritt 5 — Submit-Verhalten**
- Deaktivieren Sie die Submit-Schaltfläche, während die Übermittlung läuft (`isSubmitting`)
- Aktivieren Sie es bei Fehler erneut, damit der Benutzer es erneut versuchen kann
- Löschen Sie Fehler auf Feldebene bei erfolgreichem Übermitteln erneut
- Wenn der Server Feldfehler zurückgibt (400 mit Fehlermap), wenden Sie sie über `setError` auf die richtigen Felder an

Wenden Sie alle Änderungen auf die Datei an. Listen Sie alle aktualisierten Felder und alle hinzugefügten neuen Validierungsregeln auf.

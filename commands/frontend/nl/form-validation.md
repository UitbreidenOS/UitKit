---
description: Voeg formuliervalidatie toe of repareer deze met schema, foutweergave en toegankelijke foutmeldingen
argument-hint: "[file] [library: zod|yup|valibot|native]"
---
Implementeer of herstel formuliervalidatie in: $ARGUMENTS

Ontleed arguments: het eerste token is het doelbestand; de optionele bibliotheeksnaam overschrijft automatische detectie.

**Stap 1 — Detecteer bestaande stack**
Scan op imports van: `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Gebruik wat al geïnstalleerd is. Indien niets geïnstalleerd is, gebruik standaard `react-hook-form` + `zod`.
Installeer geen nieuwe pakketten zonder dit expliciet op te merken.

**Stap 2 — Definieer het schema**
Voor elk veld in het formulier, ontleed validatieregels uit:
- Veldnaam semantiek (e-mail, telefoon, url, wachtwoord, datum)
- Bestaande beperkingen zichtbaar in de opmaak (`required`, `minLength`, `pattern`, `type`)
- Servervalidatielogica zichtbaar in de codebase

Schema-regels toe te passen:
- `email`: `.email()` met een leesbaar bericht
- `password`: minimaal 8 tekens, minstens één getal of symbool — geef de beperking duidelijk aan in het bericht
- `url`: `.url()` — sta lege string alleen toe als het veld optioneel is
- `phone`: E.164 regex of locale-appropriate patroon
- Verplichte velden: expliciet `.min(1, "Field is required")` — niet alleen `.nonempty()`
- Optionele velden: omwikkel met `.optional()` of `.nullable()` naar behoefte — laat niet onduidelijk

**Stap 3 — Verbind validatie aan het formulier**
Voor react-hook-form:
- Gebruik `resolver` met de schemabibliotheek's resolver adapter
- Vervang handmatige `onChange` validatie met `register()` en `formState.errors`
- Gebruik `handleSubmit` — roep niet handmatig `preventDefault` aan

Voor formik:
- Geef `validationSchema` prop door
- Gebruik `<ErrorMessage>` component of `formik.errors[field]` — niet ad hoc stringcontroles

**Stap 4 — Foutweergave**
Elk foutbericht moet:
- Onder het relevante invoerveld verschijnen, niet in een toast of waarschuwingsbanner
- Worden geassocieerd met de invoer via `aria-describedby` naar het `id` van het foutelement
- `aria-invalid="true"` op de invoer zetten wanneer een fout aanwezig is
- `role="alert"` gebruiken op de foutcontainer als deze na gebruikersactie verschijnt (niet bij initiële rendering)
- Niet alleen rood gebruiken om foutstatus over te brengen — voeg een pictogram of tekstvoorvoegsel in zoals "Fout:"

**Stap 5 — Indiengedrag**
- Schakel de verzendknop uit terwijl het indienen in uitvoering is (`isSubmitting`)
- Activeer opnieuw bij fout zodat de gebruiker opnieuw kan proberen
- Wis fouten op veldniveau bij succesvol opnieuw indienen
- Als de server veldfouten retourneert (400 met foutkaart), pas deze toe via `setError` aan de juiste velden

Pas alle wijzigingen toe op het bestand. Vermeld elk bijgewerkt veld en elke nieuwe validatieregel die is toegevoegd.

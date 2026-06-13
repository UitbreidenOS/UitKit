---
description: Formuliervalidatie toevoegen of repareren met schema, foutweergave en toegankelijke foutberichten
argument-hint: "[bestand] [bibliotheek: zod|yup|valibot|native]"
---
Implementeer of repareer formuliervalidatie in: $ARGUMENTS

Parseer argumenten: eerste token is het doelbestand; optionele bibliotheeksnaam overschrijft auto-detectie.

**Stap 1 — Detecteer bestaande stack**
Scan op imports van: `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Gebruik wat al geïnstalleerd is. Indien niets geïnstalleerd is, gebruik standaard `react-hook-form` + `zod`.
Installeer geen nieuwe pakketten zonder dit expliciet op te merken.

**Stap 2 — Definieer het schema**
Voor elk veld in het formulier, bepaal validatieregels op basis van:
- Semantiek van veldnaam (e-mail, telefoon, url, wachtwoord, datum)
- Bestaande beperkingen zichtbaar in de markup (`required`, `minLength`, `pattern`, `type`)
- Enige serverkant validatielogica zichtbaar in de codebase

Schemaregels om toe te passen:
- `email`: `.email()` met een menselijk leesbaar bericht
- `password`: minimaal 8 tekens, minstens één getal of symbool — maak de beperking duidelijk in het bericht
- `url`: `.url()` — sta lege string alleen toe als veld optioneel is
- `phone`: E.164 regex of locale-passend patroon
- Verplichte velden: expliciet `.min(1, "Veld is verplicht")` — niet zomaar `.nonempty()`
- Optionele velden: wrap met `.optional()` of `.nullable()` naar behoefte — laat niet onduidelijk

**Stap 3 — Verbind validatie aan formulier**
Voor react-hook-form:
- Gebruik `resolver` met de schemabibliotheek's resolver adapter
- Vervang alle handmatige `onChange` validatie met `register()` en `formState.errors`
- Gebruik `handleSubmit` — roep niet handmatig `preventDefault` aan

Voor formik:
- Geef `validationSchema` prop door
- Gebruik `<ErrorMessage>` component of `formik.errors[field]` — niet ad hoc stringchecks

**Stap 4 — Foutweergave**
Elk foutbericht moet:
- Verschijnen onder de relevante input, niet in een toast of alertbanner
- Gekoppeld zijn aan de input via `aria-describedby` gericht op het id van het foutelement
- `aria-invalid="true"` instellen op de input als een fout aanwezig is
- `role="alert"` gebruiken op de foutcontainer als deze verschijnt na gebruikersactie (niet bij initiële rendering)
- Niet alleen rode kleur gebruiken om foutstatus over te brengen — include een pictogram of tekstprefix zoals "Fout:"

**Stap 5 — Inzendingsgedrag**
- Schakel de verzendknop uit terwijl het indienen in uitvoering is (`isSubmitting`)
- Schakel weer in bij fout zodat de gebruiker opnieuw kan proberen
- Wis veldfoutberichten bij succesvolle opnieuw indienen
- Als de server veldfouten retourneert (400 met foutkaart), pas ze toe via `setError` aan de juiste velden

Pas alle wijzigingen toe op het bestand. Vermeld elk bijgewerkt veld en elke nieuwe validatieregel die is toegevoegd.

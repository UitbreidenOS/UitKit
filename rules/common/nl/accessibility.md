# Toegankelijkheidsregels

## Toepassen op
Alle UI-code — HTML, JSX, TSX, sjabloonengines, designsysteemcomponenten.

## Regels

1. **Semantische HTML eerst** — gebruik `<button>`, `<nav>`, `<main>`, `<article>`, `<header>` voordat je `<div>` + ARIA gebruikt. Het juiste element geeft rol, status en toetsenbordgedrag automatisch.

2. **Elk interactief element moet toetsenbediend kunnen worden** — focusbaar, activeerbaar met Enter/Spatie, navigeerbaar met Tab/Shift-Tab. Onderdruk nooit de focusomtrek zonder een gelijkwaardig visueel indicatortje op te stellen.

3. **Alle afbeeldingen hebben `alt`-tekst nodig** — decoratieve afbeeldingen gebruiken `alt=""`. Informatieve afbeeldingen beschrijven inhoud, niet uiterlijk: `alt="Fout: formulierinzending is mislukt"` niet `alt="rood pictogram"`.

4. **Kleur alleen kan geen betekenis overbrengen** — combineer kleur met tekst, pictogram of patroon. Een rode rand op een ongeldig veld vereist een foutmelding. Grafieken hebben gelabelde gegevenspunten of patronen nodig.

5. **Minimaal contrastverhouding: 4,5:1 voor normale tekst, 3:1 voor grote tekst en UI-componenten** — test met een tool (axe, Lighthouse, Stark). Nooit op gevoel bepalen.

6. **Label elk formulierbesturingselement** — gebruik `<label for="id">` of `aria-label` of `aria-labelledby`. Tijdelijke tekst is geen label — het verdwijnt en heeft laag contrast.

7. **Meld dynamische inhoudswijzigingen aan** — wanneer inhoud zonder paginaladen wijzigt, gebruik `aria-live="polite"` voor niet-urgente updates, `aria-live="assertive"` alleen voor fouten of gevoelige waarschuwingen.

8. **Verwijder `tabindex="-1"` nooit om elementen uit toetsenbordnavigatie te verbergen zonder ze visueel ook te verbergen** — gebruik `display: none` of `visibility: hidden` of `hidden` kenmerk om ze tegelijk uit focusvolgorde en visuele opmaak te verwijderen.

9. **Aangepaste widgets moeten het ARIA Authoring Practices-patroon implementeren** — modale vensters vangen focus. Menu's gebruiken pijltoetsen. Accordeons gebruiken Enter/Spatie. Verzin geen interactiemodellen.

10. **Test met een schermlezer voor het verzenden van interactieve UI** — VoiceOver (macOS/iOS) of NVDA (Windows). Geautomatiseerde tools vangen ~30% van de problemen; handmatig testen is niet onderhandelbaar voor kritieke stromen.

11. **Koppen vormen een logisch overzicht, sla nooit niveaus over** — `h1` → `h2` → `h3`. Koppen communiceren documentstructuur, niet visuele grootte. Gebruik CSS voor grootte.

12. **Foutberichten zijn specifiek en gekoppeld aan hun veld** — "Verplicht" is onvoldoende. "E-mailadres is verplicht" gekoppeld aan `aria-describedby` die naar het foutenelement wijst, is correct.

13. **Speel audio of video met geluid niet automatisch af** — bied afspelings-/pausebesturingselementen. Flitsende inhoud boven 3 Hz kan aanvallen uitlokken — vermijd dit of geef een waarschuwing.

14. **Aanraakdoelen minimaal 44×44 CSS-pixels** — geldt voor mobiel en aanraakinterfaces. Kleine doelen falen bij gebruikers met motorische beperkingen en duimen.

15. **Voer `axe-core` of `eslint-plugin-jsx-a11y` uit in CI** — vang regressies automatisch op. Nul toegankelijkheidsschendingen in geautomatiseerde controles is het minimum, niet het plafond.


---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

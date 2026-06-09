# Afhankelijkheidsbeheerregels

## Van toepassing op
Alle projecten — elke taal, elke pakketbeheerder (`npm`, `pip`, `cargo`, `go mod`, `maven`, `gem`).

## Regels

1. **Zet directe afhankelijkheden vast op exacte of bereik-vergrendelde versies** — `"express": "4.18.2"` niet `"express": "*"`. Voor bibliotheken is `"~4.18.0"` (alleen patch) acceptabel. Niet vastgezette transitieve afhankelijkheden worden afgehandeld door lockfiles.

2. **Commit lockfiles voor toepassingen, niet voor bibliotheken** — `package-lock.json`, `Cargo.lock`, `poetry.lock`, `go.sum` horen in versiebeheer voor geïmplementeerde toepassingen. Bibliotheekconfiguraties beperken consumenten onnodig.

3. **Voer `npm audit` / `pip-audit` / `cargo audit` uit in CI** — faal de build bij CVE's met hoge of kritieke ernst. Behandel een kwetsbare afhankelijkheid als een falende test.

4. **Scheid runtime-afhankelijkheden van ontwikkelingsafhankelijkheden** — `devDependencies` in npm, `dev = true` in Poetry, `[dev-dependencies]` in Cargo. Ontwikkelingstools mogen niet in productieafbeeldingen worden verzonden.

5. **Controleer elke nieuwe afhankelijkheid voordat u deze toevoegt** — controleer: laatste commitdatum, wekelijkse downloads, open CVE's, licentiecompatibiliteit. Een afhankelijkheid is een onderhoudsverplichting. Weiger verlaten of ondermaats onderhouden pakketten voor productiegebruik.

6. **Geef voorkeur aan de standaardbibliotheek** — voordat u een afhankelijkheid toevoegt, controleert u of de standaardbibliotheek van de taal aan de behoefte voldoet. Een 5-regelige standaardbibliotheekoplossing is beter dan een 500 KB transitieve afhankelijkheidsgrafiek voor datumaanmaak.

7. **Werk afhankelijkheden in op schema, niet alleen wanneer het kapot gaat** — wekelijkse of tweewekelijkse geautomatiseerde PR's (Dependabot, Renovate) met geslaagde CI zijn routine. Noodgevallen onder druk zonder testdekking zijn gevaarlijk.

8. **Licentiecontrole in CI** — gebruik `license-checker`, `pip-licenses` of `cargo-deny` om licenties-allowlists af te dwingen. GPL-code in een propriëtair product verzenden is een juridisch risico, geen technisch.

9. **Verwijder ongebruikte afhankelijkheden** — `depcheck` (Node), `pip-autoremove`, `cargo machete`. Ongebruikte pakketten vergroten de afbeeldingsgrootte, vergroten de aanvalsoppervlak en bemoeilijken audits.

10. **Isoleer upgrades van grote versies als hun eigen PR** — een bump van grote versie is een wijziging die niet achterwaarts compatibel is. Bundeling met featurework maakt worteloorzaakanalyse onmogelijk als iets kapotgaat.

11. **Vendor-afhankelijkheden voor luchtdicht gesloten of sterk gereglementeerde omgevingen** — `go mod vendor`, npm `--prefer-offline` met een lokaal register, of een private Artifactory/Nexus-proxy. Vertrouwen op openbare registers tijdens runtime is een toeleveringsketens risico.

12. **Controleer pakketintegriteit** — gebruik `npm ci` in plaats van `npm install` in CI (lockfile-strict). In Python controleert u hashes met `pip install --require-hashes`. In Go biedt `go.sum` dit automatisch.

13. **Installeer pakketten nooit met `sudo` in toepassingsomgevingen** — gebruik gebruikersruimte virtuele omgevingen (Python `venv`, Node projectlokale `node_modules`). Globale installaties vervuilen het systeem en conflicteren tussen projecten.

14. **Pas op voor aanvallen op afhankelijkheidsverwarring** — interne pakketnamen mogen niet botsen met openbare registernamen. Gebruik scoped pakketten (`@myorg/internal-lib`) of private register-scoping om naamruimtebezetting voorkomen.

15. **Documenteer waarom een niet-voor-de-hand-liggende afhankelijkheid bestaat** — een `# needed for X because stdlib doesn't support Y` opmerking in `requirements.txt` of een PR-beschrijvingarantie voorkomt dat toekomstige ontwikkelaars een afhankelijkheid verwijderen die ongebruikt lijkt.


---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

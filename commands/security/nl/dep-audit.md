---
description: Controleer projectafhankelijkheden op bekende CVE's en supply-chain risico's
argument-hint: "[package-file or ecosystem]"
---
Controleer de afhankelijkheden in dit project op bekende kwetsbaarheden en supply-chain risico's.

Doel: $ARGUMENTS (automatische detectie als leeg — scan repository root en subdirectories voor manifest bestanden).

1. **Detecteer ecosysteem(en)**: Identificeer alle aanwezige lockfiles en manifests:
   - Node: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python: `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go: `go.mod`, `go.sum`
   - Rust: `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin: `pom.xml`, `build.gradle`
   - Ruby: `Gemfile.lock`

2. **Voer native audit tooling uit** waar beschikbaar:
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` of `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Leg output vast en parse resultaten.

3. **Identificeer CVE's**: Voor elk gerapporteerd kwetsbaar pakket:
   - Pakketnaam en huidige versie
   - CVE ID('s) en CVSS score
   - Beschrijving van kwetsbaarheid (één zin)
   - Vaste versie (indien beschikbaar)
   - Of dit een directe of transitieve afhankelijkheid is
   - Of het kwetsbare code pad bereikbaar is vanuit de applicatie

4. **Supply-chain signalen**: Markeer elk pakket dat aantoont:
   - Niet-gepubliceerde of yanked versies vastgepind in lockfile
   - Pakketten met nul downloads, enkele maintainer of zeer recente eigenaarswisseling
   - Afhankelijkheid verwarring risico (interne pakketnamen die op publieke registers bestaan)
   - Pakketten met install scripts (`preinstall`, `postinstall`) die willekeurige code uitvoeren
   - Wildcard versie pins (`*`, `>=0.0.0`) die elke toekomstige versie accepteren

5. **Prioriteer**: Rangschik op bereikbaarheid > CVSS score > directe vs transitieve.

6. **Output**:
   ```
   ## Dependency Audit

   ### Critical / High CVEs
   [package@version] CVE-XXXX-XXXXX (CVSS N.N) — description
   Fix: upgrade to X.Y.Z
   Reachable: yes/no/unknown

   ### Supply-Chain Flags
   - [package]: reason

   ### Upgrade Commands
   Paste-ready commands to fix all critical/high issues.
   ```

Als audit tooling niet beschikbaar is, controleer versies tegen bekende CVE-databases uit trainingsgegevens en noteer de beperking. Wijzig geen bestanden of voer geen install commando's uit.

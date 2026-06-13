# Commit Conventions Regels

## Van toepassing op
Alle git commits in elke repository.

## Regels

1. **Volg Conventional Commits format** — `<type>(<scope>): <subject>`. Type is verplicht; scope is optioneel maar aanbevolen. Subject is imperatief, tegenwoordige tijd, lowercase, geen puntje aan het einde.

2. **Geldige types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`** — `feat` is een gebruikersgerichte feature, `fix` is een gebruikersgerichte bugfix. Tooling, dependency en configuratiewijzigingen zijn `chore`. Verzin geen nieuwe types.

3. **Subject regel onder 72 karakters** — git log, GitHub en de meeste tools truncaten bij 72. Als je de wijziging niet in 72 karakters kunt beschrijven, is de commit waarschijnlijk te groot.

4. **Gebruik de body om uit te leggen waarom, niet wat** — de diff toont wat er veranderd is. De body verklaart de motivatie, de beperking of de afweging. Laat de body weg wanneer het subject zelfverklarend is.

5. **Scope moet de module, package of domein benoemen** — `feat(auth): add refresh token rotation` niet `feat(code): add thing`. Scopes maken changelogs en `git log --grep` nuttig.

6. **Breaking changes gebruiken `!` en een `BREAKING CHANGE:` footer** — `feat(api)!: remove v1 endpoints` in het subject en een `BREAKING CHANGE: v1 endpoints removed, migrate to v2` footer in de body. Dit triggert een major versie bump in semantic-release.

7. **Één logische wijziging per commit** — bundle geen feature, twee bugfixes en een dependency bump. Als de commit message "and" vereist, dient deze te worden gesplitst.

8. **Commit nooit met `--no-verify`** — pre-commit hooks bestaan om problemen op te vangen. Het omzeilen ervan betekent code pushen die linting, tests of formatting checks faalt. Los het probleem op in plaats daarvan.

9. **`fix:` commits verwijzen naar de issue of ticket** — `fix(payments): prevent double-charge on retry (#1234)`. De referentie linkt de commit naar context in de issue tracker.

10. **`revert:` commits verwijzen naar de originele commit SHA** — `revert: feat(auth): add refresh token rotation` met body `Reverts commit abc1234`. Staat bisect toe om correct te werken.

11. **Gebruik geen verleden tijd in het subject** — `feat: add user export` niet `feat: added user export`. Het subject voltooit de zin "If applied, this commit will... add user export."

12. **Squash fixup commits voordat je merged** — `fix typo`, `wip`, `address review comments` zijn ruis in de permanente geschiedenis. Squash ze in de commit waar ze bij horen voordat de PR merged.

13. **Merge commits mogen geen codewijzigingen bevatten** — een merge commit die ook een conflict in logica opleidt is een verborgen wijziging. Zet conflicts op in een aparte commit voordat je merged.

14. **Tag releases met semantic versioning** — `v1.2.3`, niet `1.2.3`, niet `release-jan-24`. Tooling (GitHub releases, semantic-release, Helm charts) verwacht het `v` prefix.

15. **Dwing conventions af via tooling** — gebruik `commitlint` met `@commitlint/config-conventional` in CI. Handmatige review van commit messages schaalt niet; geautomatiseerde handhaving wel.


---

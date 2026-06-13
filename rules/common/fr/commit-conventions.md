# Règles de Conventions de Commit

## S'applique à
Tous les commits git dans tous les référentiels.

## Règles

1. **Suivre le format Conventional Commits** — `<type>(<scope>): <subject>`. Le type est obligatoire ; la portée est optionnelle mais recommandée. Le sujet est impératif, au présent, en minuscules, sans point final.

2. **Types valides : `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`** — `feat` est une fonctionnalité visible pour l'utilisateur, `fix` est une correction de bogue visible pour l'utilisateur. Les modifications d'outillage, de dépendance et de configuration sont `chore`. Ne pas inventer de types.

3. **Ligne de sujet de moins de 72 caractères** — git log, GitHub et la plupart des outils tronquent à 72 caractères. Si vous ne pouvez pas décrire le changement en 72 caractères, le commit est probablement trop volumineux.

4. **Utiliser le corps pour expliquer le pourquoi, pas le quoi** — le diff montre ce qui a changé. Le corps explique la motivation, la contrainte ou le compromis. Omettez le corps quand le sujet est auto-explicatif.

5. **La portée doit nommer le module, le package ou le domaine** — `feat(auth): add refresh token rotation` pas `feat(code): add thing`. Les portées rendent les journaux de changements et `git log --grep` utiles.

6. **Les changements cassants utilisent `!` et un pied de page `BREAKING CHANGE:`** — `feat(api)!: remove v1 endpoints` dans le sujet, et un pied de page `BREAKING CHANGE: v1 endpoints removed, migrate to v2` dans le corps. Ceci déclenche un bump de version majeure dans semantic-release.

7. **Un changement logique par commit** — ne pas regrouper une fonctionnalité, deux corrections de bogues et une mise à jour de dépendance. Si le message de commit contient "et", il devrait être divisé.

8. **Ne jamais committer avec `--no-verify`** — les hooks de pre-commit existent pour détecter les problèmes. Les contourner signifie pousser du code qui échoue les vérifications de linting, de tests ou de formatage. Corrigez plutôt le problème.

9. **Les commits `fix:` référencent le problème ou le ticket** — `fix(payments): prevent double-charge on retry (#1234)`. La référence lie le commit au contexte du suivi des problèmes.

10. **Les commits `revert:` référencent le SHA du commit original** — `revert: feat(auth): add refresh token rotation` avec le corps `Reverts commit abc1234`. Permet à bisect de fonctionner correctement.

11. **Ne pas utiliser le passé dans le sujet** — `feat: add user export` pas `feat: added user export`. Le sujet complète la phrase « Si appliqué, ce commit va... ajouter l'export utilisateur. »

12. **Squasher les commits de correction avant la fusion** — `fix typo`, `wip`, `address review comments` sont du bruit dans l'historique permanent. Squashez-les dans le commit auquel ils appartiennent avant la fusion de la PR.

13. **Les commits de fusion ne doivent pas contenir de changements de code** — un commit de fusion qui corrige également un conflit de logique est un changement caché. Résolvez les conflits dans un commit séparé avant la fusion.

14. **Marquer les versions avec versioning sémantique** — `v1.2.3`, pas `1.2.3`, pas `release-jan-24`. L'outillage (versions GitHub, semantic-release, charts Helm) s'attend au préfixe `v`.

15. **Appliquer les conventions via l'outillage** — utiliser `commitlint` avec `@commitlint/config-conventional` en CI. L'examen humain des messages de commit ne s'étend pas à l'échelle ; l'application automatisée le fait.


---

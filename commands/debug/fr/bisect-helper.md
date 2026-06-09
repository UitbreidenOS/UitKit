---
description: Exécuter une recherche git bisect structurée pour trouver le commit qui a introduit une régression
argument-hint: "[failing test, command, or behavior description]"
---
Trouver le commit qui a introduit cette régression : $ARGUMENTS

Vous exécutez une recherche binaire dans l'historique git. Soyez méthodique.

1. **Établir l'oracle de test** — avant de toucher à git, définissez exactement comment déterminer bon vs mauvais :
   - Privilégiez une seule commande qui se termine avec le code 0 si bon et non-zéro si mauvais
   - Exemples : `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - Si la régression est visuelle ou comportementale (pas un test), écrivez un script qui vérifie le symptôme observable
   - L'oracle doit être rapide (< 30s idéalement) et déterministe

2. **Identifier les commits connus-bons et connus-mauvais**
   - Connu-mauvais : généralement HEAD ou le premier commit où la régression a été constatée
   - Connu-bon : un commit ou une étiquette où le comportement était correct (étiquette de version récente, dernier déploiement, etc.)
   - Confirmez les deux en exécutant l'oracle par rapport à chacun avant de démarrer bisect

3. **Exécuter le bisect**
   ```
   git bisect start
   git bisect bad <bad-commit>
   git bisect good <good-commit>
   ```
   Puis pour chaque checkout, exécutez l'oracle et marquez :
   ```
   git bisect good   # si l'oracle passe
   git bisect bad    # si l'oracle échoue
   ```
   Ou automatisez-le : `git bisect run <oracle-command>`

4. **Interpréter le résultat** — quand bisect se termine, git pointe vers le premier mauvais commit. Lisez :
   - Le message de commit et la diff (`git show <sha>`)
   - Les lignes spécifiques modifiées qui se rapportent à l'oracle défaillant
   - L'auteur et toute issue/PR liée pour le contexte

5. **Confirmer la découverte** — consultez le commit juste avant le mauvais, exécutez l'oracle,
   confirmez qu'il passe. Consultez le mauvais commit, confirmez qu'il échoue. Cela exclut un oracle instable.

6. **Nettoyer**
   ```
   git bisect reset
   ```

7. **Rapporter** — résumez :
   - Le SHA du commit contrevenant et son message
   - Le morceau de diff spécifique qui a introduit la régression
   - Si le changement était intentionnel (la correction est une reversion ou un correctif de suivi)

Si la suite de tests n'existe pas encore, l'étape 1 est d'écrire d'abord l'oracle, puis de procéder.
Ne sautez pas l'étape de confirmation — un mauvais résultat de bisect gaspille plus de temps qu'il n'en économise.

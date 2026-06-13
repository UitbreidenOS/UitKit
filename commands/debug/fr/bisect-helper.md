---
description: Exécuter une dichotomie git structurée pour trouver le commit qui a introduit une régression
argument-hint: "[test échouant, commande ou description du comportement]"
---
Trouvez le commit qui a introduit cette régression : $ARGUMENTS

Vous effectuez une recherche binaire dans l'historique git. Soyez méthodique.

1. **Établissez l'oracle de test** — avant de modifier git, définissez exactement comment déterminer bon vs mauvais :
   - Préférez une seule commande qui sort avec 0 en cas de succès et non-zéro en cas d'échec
   - Exemples : `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - Si la régression est visuelle ou comportementale (pas un test), écrivez un script qui vérifie le symptôme observable
   - L'oracle doit être rapide (< 30s idéalement) et déterministe

2. **Identifiez les commits connus-bon et connus-mauvais**
   - Connu-mauvais : généralement HEAD ou le premier commit où la régression a été remarquée
   - Connu-bon : un commit ou une tag où le comportement était correct (tag de release récente, dernier déploiement, etc.)
   - Confirmez les deux en exécutant l'oracle contre chacun avant de commencer la dichotomie

3. **Exécutez la dichotomie**
   ```
   git bisect start
   git bisect bad <mauvais-commit>
   git bisect good <bon-commit>
   ```
   Puis pour chaque checkout, exécutez l'oracle et marquez :
   ```
   git bisect good   # si l'oracle réussit
   git bisect bad    # si l'oracle échoue
   ```
   Ou automatisez-le : `git bisect run <commande-oracle>`

4. **Interprétez le résultat** — quand la dichotomie se termine, git pointe vers le premier mauvais commit. Lisez :
   - Le message de commit et la différence (`git show <sha>`)
   - Les lignes spécifiques modifiées qui se rapportent à l'oracle échouant
   - L'auteur et tout problème/PR lié pour le contexte

5. **Confirmez la découverte** — vérifiez le commit juste avant le mauvais, exécutez l'oracle,
   confirmez qu'il réussit. Vérifiez le mauvais commit, confirmez qu'il échoue. Cela écarte un oracle instable.

6. **Nettoyez**
   ```
   git bisect reset
   ```

7. **Rapportez** — résumez :
   - Le SHA et le message du commit contrevenant
   - La section de différence spécifique qui a introduit la régression
   - Que le changement était intentionnel (la correction est une réversion ou un patch de suivi)

Si la suite de tests n'existe pas encore, l'étape 1 est d'écrire d'abord l'oracle, puis de continuer.
Ne sautez pas l'étape de confirmation — un mauvais résultat de dichotomie gaspille plus de temps qu'il n'en économise.

# Règles Rust

## S'applique à
Tous les fichiers Rust (`*.rs`) dans tout projet.

## Règles

1. **Préférez `&str` à `String` pour les paramètres de fonction** — acceptez le type le plus permissif. Utilisez `String` dans les paramètres uniquement si vous avez besoin de la propriété ou du stockage.

2. **Utilisez `thiserror` pour les erreurs de bibliothèque, `anyhow` pour les erreurs d'application** — `thiserror` fournit des erreurs typées et composables. `anyhow` est ergonomique pour les binaires où les appelants ne correspondent pas aux variantes d'erreur.

3. **Ne jamais utiliser `.unwrap()` dans les chemins de production** — utilisez `?` pour propager, `.expect("invariant reason")` quand l'échec est un bogue et le message explique pourquoi ça ne peut pas se produire, `if let` ou `match` pour les cas récupérables.

4. **Préférez `impl Trait` à l'expédition dynamique sauf si le type est inconnu au moment de la compilation** — `fn process(iter: impl Iterator<Item = u32>)` est plus rapide et évite l'allocation sur le tas. Utilisez `dyn Trait` uniquement pour les collections hétérogènes ou les interfaces de plugin.

5. **Dérivez `Debug` sur chaque type que vous possédez** — les types non-`Debug` cassent la journalisation, les assertions de test et le formatage des erreurs. Ajoutez `Display` uniquement s'il y a une représentation de chaîne côté utilisateur.

6. **Évitez `clone()` dans les chemins critiques** — cela signale un problème de conception. Restructurez les durées de vie ou utilisez `Rc`/`Arc` lorsque la propriété partagée est vraiment nécessaire.

7. **Utilisez `#[must_use]` sur les types et les fonctions dont les valeurs de retour sont critiques** — `Result`, `Future` et les types sentinel doivent être annotés de sorte que le compilateur avertisse quand l'appelant les rejette.

8. **Préférez les itérateurs aux boucles manuelles d'index** — `iter().filter().map().collect()` est idiomatique, vérifié sur les limites et souvent mieux optimisé. Les boucles d'index invitent les erreurs de décalage de un.

9. **Rendre les états illégaux non représentables via les types** — modélisez les machines à états comme des énumérations avec des données associées. Préférez `Option<T>` aux valeurs sentinel comme `-1` ou les chaînes vides.

10. **Utilisez `clippy` et `rustfmt` dans l'IC** — `cargo clippy -- -D warnings` échoue la construction sur les violations de lint. `cargo fmt --check` applique le formatage. Aucune exception.

11. **Groupez les instructions `use` : std, crates externes, modules internes** — un ordre cohérent rend les importations analysables. `rustfmt` applique cela avec `imports_granularity`.

12. **Gardez les blocs `unsafe` minimaux et documentez les invariants** — chaque bloc `unsafe` doit avoir un commentaire expliquant quel invariant l'appelant respecte et pourquoi l'abstraction sûre ne peut pas l'exprimer.

13. **Préférez `Arc<Mutex<T>>` à `Rc<RefCell<T>>` dans les contextes asynchrones** — `Rc` et `RefCell` sont `!Send`. Dans du code asynchrone ou multi-thread, les paniques au moment de l'exécution due à une mauvaise utilisation de `RefCell` sont difficiles à déboguer.

14. **Utilisez `cargo-deny` ou `cargo-audit` dans l'IC** — détectez les crates annulées et les vulnérabilités connues avant qu'elles ne atteignent la production.

15. **Épinglez les versions de dépendance dans `Cargo.lock` pour les binaires, pas les bibliothèques** — validez `Cargo.lock` pour les applications. Les bibliothèques doivent laisser la résolution à la discrétion du consommateur.


---

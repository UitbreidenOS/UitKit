---
description: Ajouter ou corriger la validation de formulaire avec schéma, affichage des erreurs et messages d'erreur accessibles
argument-hint: "[file] [library: zod|yup|valibot|native]"
---
Implémenter ou réparer la validation de formulaire dans : $ARGUMENTS

Analyser les arguments : le premier token est le fichier cible ; un nom de bibliothèque optionnel remplace la détection automatique.

**Étape 1 — Détecter la pile existante**
Analyser pour trouver les imports de : `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Utiliser ce qui est déjà installé. Si rien n'est installé, utiliser par défaut `react-hook-form` + `zod`.
Ne pas installer de nouveaux packages sans les noter explicitement.

**Étape 2 — Définir le schéma**
Pour chaque champ du formulaire, dériver les règles de validation à partir de :
- Sémantique du nom du champ (email, téléphone, url, mot de passe, date)
- Contraintes existantes visibles dans le balisage (`required`, `minLength`, `pattern`, `type`)
- Toute logique de validation côté serveur visible dans la base de code

Règles de schéma à appliquer :
- `email` : `.email()` avec un message lisible
- `password` : au minimum 8 caractères, au moins un chiffre ou un symbole — émettre la contrainte clairement dans le message
- `url` : `.url()` — autoriser une chaîne vide uniquement si le champ est optionnel
- `phone` : regex E.164 ou modèle approprié à la locale
- Champs obligatoires : `.min(1, "Field is required")` explicite — pas seulement `.nonempty()`
- Champs optionnels : envelopper avec `.optional()` ou `.nullable()` selon le cas — ne pas laisser ambigu

**Étape 3 — Connecter la validation au formulaire**
Pour react-hook-form :
- Utiliser `resolver` avec l'adaptateur du résolveur de la bibliothèque de schéma
- Remplacer toute validation manuelle `onChange` par `register()` et `formState.errors`
- Utiliser `handleSubmit` — ne pas appeler manuellement `preventDefault`

Pour formik :
- Passer la prop `validationSchema`
- Utiliser le composant `<ErrorMessage>` ou `formik.errors[field]` — pas de vérifications de chaîne ad hoc

**Étape 4 — Affichage des erreurs**
Chaque message d'erreur doit :
- Apparaître sous l'entrée pertinente, pas dans un toast ou une bannière d'alerte
- Être associé à l'entrée via `aria-describedby` pointant vers l'`id` de l'élément d'erreur
- Définir `aria-invalid="true"` sur l'entrée quand une erreur est présente
- Utiliser `role="alert"` sur le conteneur d'erreur s'il apparaît après une action utilisateur (pas au rendu initial)
- Ne pas utiliser la couleur rouge seule pour transmettre l'état d'erreur — inclure une icône ou un préfixe de texte comme « Erreur : »

**Étape 5 — Comportement d'envoi**
- Désactiver le bouton d'envoi pendant que l'envoi est en cours (`isSubmitting`)
- Réactiver en cas d'erreur pour que l'utilisateur puisse réessayer
- Effacer les erreurs au niveau des champs lors du renvoi réussi
- Si le serveur retourne des erreurs de champ (400 avec une carte d'erreur), les appliquer via `setError` aux champs corrects

Appliquer toutes les modifications au fichier. Lister chaque champ mis à jour et chaque nouvelle règle de validation ajoutée.

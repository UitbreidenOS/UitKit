---
description: Définir et appliquer un schéma de réponse d'erreur cohérent sur tous les points de terminaison API
argument-hint: "[portée : fichier, routeur, ou « tout »]"
---
Auditer et appliquer un schéma de réponse d'erreur cohérent pour : $ARGUMENTS

La portée par défaut est l'API entière si $ARGUMENTS est vide ou « tout ».

Schéma d'erreur cible (RFC 9457 / Détails de problème pour les API HTTP) :
```json
{
  "type": "https://example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "Le champ « email » doit être une adresse email valide.",
  "instance": "/requests/abc-123",
  "trace_id": "3f2e1d..."
}
```

Utilisez ce schéma à moins que le projet n'ait déjà un format d'erreur établi — dans ce cas, standardisez plutôt sur celui-ci.

Étapes :
1. Analyser tous les chemins de code retournant une erreur : exceptions levées, middleware d'erreur, blocs catch, gestionnaires de validation
2. Identifier les incohérences : chaînes simples, clés incohérentes (`message` vs `error` vs `detail`), codes de statut manquants, formes mixtes
3. Définir un seul type/interface/classe d'erreur à la racine du projet (`ApiError` ou équivalent)
4. Remplacer chaque réponse d'erreur ad hoc par la construction structurée de ce type
5. Centraliser toute sérialisation d'erreur à un seul endroit (middleware d'erreur / gestionnaire d'exception) — non dispersée entre les contrôleurs
6. Assurer que les erreurs de validation énumèrent les erreurs par champ :
   ```json
   "errors": [{ "field": "email", "message": "Format invalide" }]
   ```
7. Supprimer les traces de pile des réponses de production — les enregistrer côté serveur, ne jamais envoyer au client
8. Mapper les types d'erreurs internes aux codes de statut HTTP dans une seule table de consultation — aucun littéral de code de statut en dehors de cette table
9. Ajouter un `trace_id` corrélé avec votre système de journalisation s'il en existe un

Résultat :
- La définition du type d'erreur
- Le gestionnaire d'erreur centralisé
- Liste de tous les fichiers modifiés
- Toute réponse d'erreur qui n'a pas pu être standardisée (avec raison)

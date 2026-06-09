---
description: Définir et appliquer un schéma de réponse d'erreur cohérent dans tous les points de terminaison de l'API
argument-hint: "[scope: file, router, or 'all']"
---
Audit et application d'un schéma de réponse d'erreur cohérent pour : $ARGUMENTS

La portée est par défaut l'API entière si $ARGUMENTS est vide ou « all ».

Schéma d'erreur cible (RFC 9457 / Détails du problème pour les API HTTP) :
```json
{
  "type": "https://example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/requests/abc-123",
  "trace_id": "3f2e1d..."
}
```

Utilisez ce schéma sauf si le projet a déjà un format d'erreur établi — si c'est le cas, standardisez plutôt à celui-ci.

Étapes :
1. Analyser tous les chemins de code retournant des erreurs : exceptions levées, intergiciels d'erreur, blocs catch, gestionnaires de validation
2. Identifier les incohérences : chaînes brutes, clés incohérentes (`message` vs `error` vs `detail`), codes de statut manquants, formes mixtes
3. Définir un seul type d'erreur/interface/classe à la racine du projet (`ApiError` ou équivalent)
4. Remplacer chaque réponse d'erreur ad-hoc par une construction structurée de ce type
5. Centraliser toute la sérialisation d'erreur au même endroit (intergiciel d'erreur / gestionnaire d'exception) — pas dispersée entre les contrôleurs
6. Assurer que les erreurs de validation énumèrent les erreurs par champ :
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Supprimer les traces de pile des réponses de production — les enregistrer côté serveur, jamais envoyer au client
8. Mapper les types d'erreur internes aux codes de statut HTTP dans une seule table de recherche — aucun littéral de code de statut en dehors de cette carte
9. Ajouter un `trace_id` corrélé avec votre système de journalisation si l'un est en usage

Sortie :
- La définition du type d'erreur
- Le gestionnaire d'erreur centralisé
- Liste de tous les fichiers modifiés
- Toute réponse d'erreur qui n'a pas pu être standardisée (avec raison)

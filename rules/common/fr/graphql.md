# Règles GraphQL

Appliquer lors de la conception de schémas, de résolveurs ou de requêtes client.

## Conception de schémas

- Modéliser le domaine, pas la base de données — les types doivent refléter les entités métier, pas les lignes de table
- Utiliser non-null (`!`) de manière agressive ; les champs nullables sont une promesse aux clients que la valeur peut être absente
- Préférer les noms de champs descriptifs aux abrégés : `createdAt` et non `cAt`
- Les types d'entrée pour les mutations doivent être séparés des types de retour de requête — ne jamais réutiliser le même type
- Utiliser les énums pour les champs avec un ensemble de valeurs délimité ; documenter chaque valeur d'énumération

## Requêtes et mutations

- Les requêtes doivent être sans effet secondaire ; les mutations sont le seul point d'entrée pour les écritures
- Nommer les mutations comme `<verbe><Nom>` : `createOrder`, `cancelSubscription`
- Retourner l'objet muté de chaque mutation — les clients en ont besoin pour mettre à jour leur cache
- Les mutations qui peuvent échouer partiellement doivent retourner un type union : `CreateOrderResult = Order | ValidationError`
- Implémenter la pagination basée sur le curseur (`first`/`after`) pour toute liste qui peut croître indéfiniment

## Résolveurs

- Regrouper les requêtes N+1 avec un DataLoader — ne jamais émettre une requête BD par élément de liste
- Garder la logique du résolveur mince : valider l'entrée, appeler un service, retourner le résultat
- Résoudre uniquement ce qui est demandé — ne pas récupérer les jointures pour les champs non dans l'ensemble de sélection
- Définir le coût de complexité par champ ; rejeter les requêtes qui dépassent un budget total
- Ne jamais exposer les messages d'erreur internes au client ; les consigner côté serveur

## Sécurité

- Authentifier à la passerelle avant l'exécution de tout résolveur
- Autoriser au niveau du résolveur — vérifier la propriété avant de retourner ou de muter les données
- Désactiver l'introspection en production pour les API externes
- Appliquer les limites de profondeur de requête et les limites de complexité de requête
- Ne jamais exposer les traces de pile dans `errors[].extensions`

## Abonnements

- Utiliser les abonnements uniquement pour les données véritablement en temps réel ; l'interrogation est plus simple pour la plupart des cas
- Toujours filtrer les événements d'abonnement par la portée de l'utilisateur authentifié
- Implémenter la gestion de la contrapression — ne pas pousser plus vite que le client ne peut consommer

## Versioning et évolution

- Déprécier les champs avec `@deprecated(reason: "…")` avant de les supprimer
- Ne jamais supprimer ou renommer un champ dans une seule version — marquer comme déprécié, attendre un cycle de version
- Les changements additifs (nouveaux champs, nouveaux types) ne cassent rien et sont sûrs à expédier à tout moment

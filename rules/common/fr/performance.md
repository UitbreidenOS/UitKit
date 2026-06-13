> 🇫🇷 This is the French translation. [English version](../performance.md).

# Règles de Performance

Copiez les sections pertinentes dans le `CLAUDE.md` de votre projet.

---

## Base de données

- Ne jamais exécuter des requêtes dans des boucles — regrouper avec `IN (...)` ou utiliser une jointure
- Toujours paginer les requêtes qui peuvent retourner des résultats non bornés — pas de `SELECT *` sans `LIMIT`
- Ajouter des index avant que la requête soit lente en production, pas après — analyser les plans de requête pendant le développement
- Sélectionner uniquement les colonnes dont vous avez besoin — `SELECT *` récupère des données inutilisées et empêche les scans index-only
- Utiliser l'agrégation au niveau base de données (`COUNT`, `SUM`, `GROUP BY`) — ne pas charger des lignes en mémoire pour les compter

## API et réseau

- Mettre en cache les réponses coûteuses à calculer et qui changent peu — définir des TTLs explicites
- Paginer les endpoints de liste — retourner un maximum de N éléments par requête avec un curseur ou un offset
- Ne pas faire de requêtes N+1 — regrouper les données liées avec DataLoader, `include`, ou une jointure
- Éviter les appels synchrones vers des services externes dans les gestionnaires de requêtes — utiliser des queues pour les tâches non critiques
- Définir des timeouts sur tous les appels HTTP externes — ne jamais laisser une dépendance lente bloquer votre serveur

## Mémoire

- Ne pas charger de grands jeux de données en mémoire pour les traiter — streamer ou paginer
- Libérer les références quand c'est terminé — éviter les fermetures accidentelles qui empêchent le garbage collection
- Utiliser des générateurs/itérateurs pour les grandes séquences plutôt que de construire des listes complètes en mémoire

## Mesure

- Profiler avant d'optimiser — ne jamais deviner où est le goulot d'étranglement
- Mesurer dans des conditions similaires à la production — les benchmarks locaux sont trompeurs
- Établir une baseline avant de faire des changements — sans baseline, vous ne pouvez pas confirmer l'amélioration
- Les tests de performance appartiennent à la CI — une régression qui passe la revue de code mais échoue le budget de performance doit être détectée automatiquement

---

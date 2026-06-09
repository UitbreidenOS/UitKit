# Règles de Journalisation

Appliquer lors de l'ajout, de l'examen ou de la configuration des journaux d'application.

## Structure

- Émettre des journaux JSON structurés — jamais de chaînes de texte libre en production
- Chaque ligne de journal doit inclure : `timestamp` (ISO 8601 UTC), `level`, `service`, `message`
- Ajouter `trace_id` et `span_id` à chaque ligne de journal pour la corrélation du suivi distribué
- Enregistrer le `request_id` sur chaque ligne émise pendant le cycle de vie d'une requête HTTP
- Utiliser des noms de champs cohérents dans tous les services — convenir d'un schéma une fois et l'appliquer

## Niveaux

| Niveau | À utiliser pour |
|---|---|
| `ERROR` | Une opération a échoué ; l'attention humaine peut être requise |
| `WARN` | État inattendu mais l'opération a continué ; vaut le coup de surveiller |
| `INFO` | Événements normaux importants : service démarré, tâche complétée, utilisateur authentifié |
| `DEBUG` | Diagnostics pour les développeurs — désactivé en production par défaut |

- Ne jamais utiliser `ERROR` pour les défaillances métier attendues (entrée invalide, non trouvée) — utiliser `WARN` ou `INFO`
- Ne jamais utiliser `INFO` pour le bruit par requête sur les points de terminaison à haut débit — utiliser `DEBUG`

## Contenu

- Enregistrer ce qui s'est passé, pourquoi c'est important et quels identifiants sont nécessaires pour enquêter
- Inclure le message d'erreur complet et la trace de pile sur les lignes `ERROR`
- Ne jamais enregistrer les secrets, jetons, mots de passe, numéros de carte de crédit ou données personnelles brutes
- Masquer ou omettre les en-têtes `Authorization`, les valeurs de cookie et les paramètres de requête contenant des identifiants
- Ne pas enregistrer les corps de requête sauf si debugging et même dans ce cas, supprimer les champs sensibles

## Volume et coût

- Échantillonner les journaux `DEBUG` et `INFO` de haute fréquence en production — enregistrer 1 sur N, pas chaque événement
- Définir la rétention des journaux par niveau : erreurs 90 jours, info 30 jours, debug 7 jours (ajuster selon le coût et le besoin de conformité)
- Ajouter des marqueurs `slow_query` et `high_latency` plutôt que d'enregistrer chaque requête à verbosité complète
- Centraliser les journaux dans une seule plateforme — les journaux fragmentés entre les services ne sont pas viables en cas d'incident

## Exigences opérationnelles

- Les journaux doivent être interrogeables en quelques secondes après l'émission — utiliser un agrégateur de journaux structurés (Loki, CloudWatch Logs Insights, Datadog)
- Alerte sur les pics de taux `ERROR`, pas juste sur les erreurs individuelles
- Séparer les journaux d'application des journaux d'accès — les journaux d'accès ont des règles de rétention et de données personnelles différentes
- Ne jamais écrire les journaux sur le disque local uniquement dans un environnement conteneurisé — ils seront perdus au redémarrage

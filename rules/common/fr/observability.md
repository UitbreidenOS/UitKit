# Règles d'Observabilité

## Appliquer à
Tous les services backend, les workers et l'infrastructure — tout système qui s'exécute en production.

## Règles

1. **Les logs, les métriques et les traces sont des signaux distincts — instrumentez tous les trois** — les logs expliquent ce qui s'est passé, les métriques montrent les tendances et déclenchent les alertes, les traces montrent où le temps a été dépensé aux limites des services. L'un sans les autres laisse des zones obscures.

2. **Logs structurés uniquement — jamais de chaînes brutes** — `{"level":"error","service":"payments","user_id":"u123","error":"card declined"}` est interrogeable. `ERROR: card declined for user u123` ne l'est pas. Utilisez JSON ou une bibliothèque de journalisation structurée.

3. **Logger aux limites, pas à l'intérieur de la logique** — logez à l'entrée et à la sortie des gestionnaires HTTP, des consommateurs de files d'attente et des appels externes. Ne loguez pas à l'intérieur des fonctions pures ou des boucles serrées.

4. **Incluez le contexte de trace dans chaque ligne de log** — `trace_id`, `span_id`, et `request_id` relient les logs aux traces distribuées. Sans eux, corréler une ligne de log à une requête spécifique entre les services relève de la conjecture.

5. **Utilisez les quatre signaux d'or comme ensemble de métriques de base** — latence (p50, p95, p99), trafic (requêtes/sec), taux d'erreur (5xx%), et saturation (profondeur de la file d'attente, CPU, mémoire). Alertez sur ceux-ci avant d'ajouter des métriques personnalisées.

6. **Histogrammes plutôt que moyennes pour la latence** — les moyennes masquent les distributions bimodales et les queues longues. Suivez les p95 et p99. Un pic de latence p99 avec une moyenne plate signifie que vos utilisateurs les plus lents souffrent en silence.

7. **Nommez les métriques de manière cohérente** — `http_request_duration_seconds`, pas `request_time` ou `latency_ms`. Suivez les conventions de nommage Prometheus : `<namespace>_<subsystem>_<name>_<unit>`. Unités dans le nom, unités de base (secondes, octets, pas millisecondes).

8. **Instrumentez chaque appel externe** — requêtes de base de données, accès au cache/échecs, appels HTTP à des tiers, publications/consommations de files de messages. C'est là où la latence s'accumule et où les défaillances prennent origine.

9. **Définissez les SLO avant de configurer les alertes** — définissez d'abord le budget d'erreur acceptable. Alertez sur le taux de consommation du SLO, pas sur les seuils de métriques brutes. Les alertes de seuil génèrent du bruit ; les alertes de taux de consommation signalent l'impact réel sur l'utilisateur.

10. **Évitez les valeurs de label à cardinalité élevée sur les métriques** — `user_id` comme label Prometheus crée une série chronologique par utilisateur et plante votre backend de métriques. Les labels devraient avoir une cardinalité délimitée (code de statut, endpoint, région — pas les IDs utilisateur ou les UUID).

11. **Échantillonnez les traces, pas toutes les traces** — l'échantillonnage de 100% des traces est cher. Utilisez l'échantillonnage basé sur la tête ou sur la queue (échantillonnez toujours les erreurs, échantillonnez une fraction des succès). OpenTelemetry supporte les deux.

12. **La politique de rétention fait partie de la conception** — décidez à l'avance : logs 30 jours, traces 7 jours, métriques brutes 15 jours, métriques agrégées 13 mois. La rétention non planifiée gonfle les coûts de stockage et ralentit les requêtes.

13. **Les endpoints de santé ne sont pas de l'observabilité** — `/healthz` dit à l'orchestrateur si le processus est en vie. Cela ne vous dit pas pourquoi les requêtes sont lentes. Ne substituez pas les contrôles de santé à une vraie instrumentation.

14. **Utilisez OpenTelemetry pour l'instrumentation — évitez les SDK spécifiques aux fournisseurs** — OTLP est le format d'exportation standard. Changez de backends (Jaeger, Honeycomb, Datadog) en changeant l'exportateur, pas l'instrumentation.

15. **Alertez sur les symptômes, pas sur les causes** — alertez sur « taux d'erreur > 1% pendant 5 minutes », pas « CPU > 80% ». Un CPU élevé est une cause possible ; un taux d'erreur élevé est un symptôme confirmé. Réduisez la fatigue d'alerte en alertant sur ce que les utilisateurs expérimentent.


---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec les communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

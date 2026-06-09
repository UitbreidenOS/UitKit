# Règles de Documentation

Appliquez lors de la rédaction ou de l'examen des fichiers README, de la documentation API, de guides ou de documentation en ligne.

## Quoi documenter

- Documentez le *pourquoi*, pas le *quoi* — le code montre quoi; les docs expliquent l'intention, les contraintes et les compromis
- Chaque surface d'API publique a besoin d'une description, des types de paramètres, du type de retour et d'au moins un exemple
- Documentez explicitement les comportements non évidents : limites de débit, cohérence éventuelle, garanties de classement, modes de défaillance connus
- Architecture Decision Records (ADRs) pour toute décision qui a pris plus d'une journée — le contexte se perd autrement

## Quoi ne pas documenter

- Ne réaffirmez pas ce que le code dit déjà clairement : `// increments counter by 1` sur `counter++` est du bruit
- Ne documentez pas les états temporaires (« c'est un contournement jusqu'à ce que X soit corrigé ») — cela appartient au suivi des problèmes
- N'écrivez pas de documentation spéculative pour des fonctionnalités qui n'existent pas encore

## READMEs

Chaque README de projet doit répondre à ces questions dans l'ordre :

1. Que fait ce projet ? (une phrase)
2. Comment l'exécuter localement ? (commandes exactes, pas d'hypothèses)
3. Comment exécuter les tests ?
4. Quelles sont les variables d'environnement clés ?
5. Où aller pour plus de détails ? (liens vers la documentation supplémentaire)

Un README qui prend plus de 5 minutes pour passer de zéro à un environnement local en cours d'exécution est trop long ou manque des étapes.

## Documentation API

- Gardez la documentation API adjacente au code — les docs qui vivent dans un repo séparé dérivent
- Utilisez OpenAPI/Swagger pour REST ; SDL + descriptions pour GraphQL ; générez à partir de la source si possible
- Chaque point de terminaison documente : exigences d'authentification, schéma de requête/réponse, codes d'erreur, limites de débit
- Fournissez des exemples exécutables (extraits curl, SDK) — les descriptions abstraites sans exemples ne sont pas utiles

## Style d'écriture

- Écrivez pour un lecteur qui est compétent mais peu familier avec ce système spécifique
- Phrases courtes, voix active, mode impératif pour les instructions
- Utilisez des exemples concrets plutôt que des descriptions abstraites : montrez une véritable requête/réponse, pas un diagramme de schéma seul
- Tableaux pour le matériel de référence; prose pour les explications; listes numérotées pour les étapes séquentielles

## Maintenance

- Les docs qui sont fausses sont pires que pas de docs — traitez la documentation obsolète comme un bogue
- Mettez à jour les docs dans la même PR que la modification du code; ne laissez jamais une « PR docs à suivre »
- Ajoutez une date `last-verified` aux guides longs afin que les lecteurs puissent évaluer la fraîcheur
- Créez un lien vers la source canonique de vérité; ne copiez-collez pas le contenu qui dérivera

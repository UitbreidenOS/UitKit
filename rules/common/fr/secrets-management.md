# Règles de Gestion des Secrets

Appliquez-les chaque fois que le code gère des clés API, des mots de passe, des jetons, des certificats ou des identifiants.

## Ne jamais faire ces choses

- Ne jamais valider les secrets dans le contrôle de version — pas même dans les référentiels privés, pas même temporairement
- Ne jamais coder en dur les secrets en tant que chaînes littérales dans le code source
- Ne jamais stocker les secrets dans des fichiers de variables d'environnement (`.env`) validés dans git
- Ne jamais enregistrer les secrets — ni au démarrage, ni dans la sortie de débogage, ni dans les messages d'erreur
- Ne jamais transmettre les secrets dans les URL ou les paramètres de requête — ils se retrouvent dans les journaux d'accès et l'historique du navigateur

## Où vivent les secrets

- Utilisez un gestionnaire de secrets dédié dans tous les environnements de production : AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault ou Azure Key Vault
- Injectez les secrets à l'exécution via des variables d'environnement à partir du gestionnaire de secrets — pas via des fichiers intégrés dans les images de conteneur
- Pour le développement local : les fichiers `.env` sont acceptables mais doivent être dans `.gitignore` ; fournissez un `.env.example` avec des valeurs d'espace réservé
- Pipelines CI/CD : utilisez le magasin de secrets de la plateforme (GitHub Actions secrets, variables GitLab CI) ; ne les affichez jamais dans les journaux

## Rotation

- Tous les secrets doivent avoir un calendrier de rotation défini — les clés API tournent au moins annuellement, les mots de passe de base de données au moins trimestriellement
- Concevez les services pour accepter un nouveau secret sans interruption : supportez les fenêtres d'identification double lors de la rotation
- Automatisez la rotation lorsque le fournisseur la supporte ; la rotation manuelle est sujette aux erreurs
- Révoquez immédiatement les identifiants compromis — avant d'enquêter sur l'étendue de la fuite

## Contrôle d'accès

- Accordez le principe du moindre privilège : un secret est limité au service qui en a besoin, non partagé entre les services
- Utilisez des identifiants distincts par environnement (développement, test, production) — ne partagez jamais les secrets de production
- Auditez qui et quoi a accès à chaque secret ; examinez trimestriellement
- Authentification service-à-service : utilisez les jetons à courte durée de vie (identité de charge de travail OIDC, rôles IAM) plutôt que les clés API statiques si possible

## Détection

- Activez l'analyse des secrets dans CI (GitHub secret scanning, GitLeaks, truffleHog) — échouez le pipeline sur un coup
- Analysez l'historique git lors de l'activation de ceci pour un référentiel existant — supposez que les secrets validés historiquement sont compromis
- Configurez des alertes pour une utilisation anormale des identifiants de production (volumes d'appels inhabituels, nouvelles adresses IP source)

## Quand un secret est divulgué

1. Révoquez immédiatement l'identifiant — ne pas attendre l'enquête
2. Auditez les journaux d'accès pour la durée de vie de l'identifiant
3. Faites pivoter tous les secrets qui auraient pu être exposés dans le même vecteur de violation
4. Supprimez le secret de l'historique git en utilisant `git filter-repo` ; push force ; notifiez tous les forks

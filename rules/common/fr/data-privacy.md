# Règles de Confidentialité des Données

Appliquez-les lors du traitement de données personnelles, sensibles ou réglementées.

## Minimisation des données

- Collectez uniquement les données pour lesquelles vous avez un cas d'usage spécifique et documenté — collecter "juste au cas où" est un risque juridique
- Définissez les périodes de rétention au moment de la collecte ; supprimez ou anonymisez les données à l'expiration de la période
- Ne journalisez pas les données personnelles (noms, e-mails, adresses IP, identifiants d'appareil) sauf si opérationnellement nécessaire — et même dans ce cas, limitez le périmètre
- Préférez stocker un attribut dérivé plutôt que la valeur brute : tranche d'âge au lieu de date de naissance, ID haché au lieu d'e-mail

## Classification

- Classifiez tous les champs de données avant de les stocker : public / interne / confidentiel / restreint
- Les données restreintes (données d'identité personnelle, données de paiement, dossiers de santé) nécessitent un chiffrement au repos et en transit
- Ne stockez jamais les mots de passe sous une forme récupérable — utilisez bcrypt, Argon2 ou scrypt avec un facteur de coût suffisant
- Traitez les jetons de session, les clés API et les JWT comme des données restreintes

## Contrôle d'accès

- Appliquez le principe du moindre privilège : les services et les utilisateurs n'accèdent qu'à ce dont ils ont besoin
- Implémentez la sécurité au niveau des lignes pour les données multi-locataires — ne comptez jamais uniquement sur les filtres au niveau de l'application
- Journalisez les lectures d'enregistrements sensibles : qui a accédé à quoi et quand
- Révoquez l'accès immédiatement en cas de changement de rôle ou de départ — n'attendez pas le prochain cycle de provisionnement

## Transfrontalier et réglementaire

- Identifiez les réglementations qui s'appliquent : RGPD (résidents de l'UE), CCPA (résidents de Californie), HIPAA (données de santé US), PCI DSS (cartes de paiement)
- Les droits des personnes concernées (accès, suppression, portabilité) doivent être implémentables — concevez le schéma de sorte que vous puissiez trouver et supprimer toutes les données pour un utilisateur donné
- Ne transférez pas les données personnelles vers des juridictions sans base juridique adéquate (clauses contractuelles types, décision d'adéquation)
- Documentez vos flux de données : quelles données vont où, traitées par qui, sous quelle base juridique

## Intégrations tierces

- Vérifiez les processeurs tiers avant de leur envoyer des données personnelles — vérifiez leur accord de traitement et leurs certifications
- Utilisez la tokenisation lors de la transmission d'identifiants d'utilisateurs à des plates-formes d'analyse ou de publicité — jamais de données d'identité personnelle brutes
- Respectez les signaux Ne pas suivre / de désinscription au niveau de la limite d'intégration, pas seulement au niveau de l'interface utilisateur

## Réponse aux incidents

- Définissez ce qui constitue une violation notifiable avant qu'elle ne se produise
- Le RGPD exige la notification à l'autorité de surveillance dans les 72 heures suivant la découverte
- Ayez un runbook documenté pour : la confinement, l'évaluation, la notification et l'analyse post-mortem
- N'essayez jamais de dissimuler une violation — cela aggrave l'exposition juridique

## Tests

- Utilisez des données synthétiques ou anonymisées dans les environnements hors production — ne copiez jamais les données d'identité personnelle de production vers la mise en scène
- Masquez ou occultez les champs sensibles dans les journaux et les rapports d'erreur avant qu'ils ne quittent la limite du système

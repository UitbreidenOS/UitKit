---
description: Implémenter un récepteur webhook sécurisé et idempotent avec vérification de signature et tolérance aux tentatives
argument-hint: "[provider] [event-types]"
---
Implémenter un gestionnaire webhook pour : $ARGUMENTS

Analyser comme : nom du fournisseur webhook (par exemple Stripe, GitHub, Twilio) et une liste d'événements séparés par des virgules à traiter. Si le fournisseur est inconnu, construire un pattern webhook signé générique.

Sécurité — non négociable :
- Vérifier la signature du fournisseur avant de traiter tout payload. Lire le pattern des docs du fournisseur pour l'en-tête exact et l'algorithme HMAC (généralement `HMAC-SHA256`)
- Comparer les signatures avec une fonction de comparaison en temps constant — jamais d'égalité de chaîne
- Rejeter les requêtes avec signatures manquantes ou invalides avec `401` immédiatement — enregistrer l'échec
- Valider le champ `timestamp` si le fournisseur en inclut un ; rejeter les événements plus vieux que 5 minutes pour prévenir les attaques par rejeu
- Le secret doit provenir d'une variable d'environnement — jamais codé en dur

Idempotence :
- Chaque livraison webhook a un ID d'événement unique dans l'en-tête ou le payload — l'extraire
- Vérifier un magasin de déduplification (table DB ou ensemble Redis avec TTL) avant de traiter
- Si l'ID d'événement a déjà été traité, retourner `200` immédiatement — ne pas retraiter
- Stocker l'ID d'événement avec un TTL d'au moins la fenêtre de tentatives du fournisseur (généralement 72 heures)

Pattern de traitement :
- Accuser réception immédiatement avec `200` — ne pas faire attendre le fournisseur pour la logique métier
- Mettre en file d'attente le payload validé et désérialisé dans une queue de tâches pour traitement asynchrone
- S'il n'existe pas de queue de tâches, traiter de façon synchrone mais toujours répondre en moins de 5 secondes
- Enregistrer le type d'événement, l'ID d'événement et le résultat du traitement pour chaque événement

Structure du gestionnaire :
1. Middleware de vérification de signature (réutilisable, pas en ligne)
2. Vérification de déduplification
3. Analyse du payload et dispatch par type d'événement
4. Fonctions de gestionnaire par événement (une par type d'événement listée dans $ARGUMENTS)
5. Gestion des erreurs qui retourne 200 même en cas d'échec de traitement (pour éviter les tentatives en cas de bug)

Écrire des tests pour : signature valide, signature invalide, événement en doublon, chaque type d'événement dispatché correctement.

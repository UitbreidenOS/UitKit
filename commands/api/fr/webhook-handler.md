---
description: Implémenter un récepteur de webhook sécurisé et idempotent avec vérification de signature et tolérance aux tentatives
argument-hint: "[provider] [event-types]"
---
Implémenter un gestionnaire de webhook pour : $ARGUMENTS

Analyser comme : nom du fournisseur de webhook (par exemple Stripe, GitHub, Twilio) et une liste séparée par des virgules des types d'événements à traiter. Si le fournisseur est inconnu, créer un modèle de webhook signé générique.

Sécurité — non négociable :
- Vérifier la signature du fournisseur avant de traiter tout charge utile. Lire le modèle de documentation du fournisseur pour l'en-tête exact et l'algorithme HMAC (généralement `HMAC-SHA256`)
- Comparer les signatures avec une fonction de comparaison en temps constant — ne jamais utiliser l'égalité des chaînes
- Rejeter les demandes avec des signatures manquantes ou invalides avec `401` immédiatement — consigner l'échec
- Valider le champ `timestamp` si le fournisseur en inclut un ; rejeter les événements de plus de 5 minutes pour prévenir les attaques par relecture
- Le secret doit provenir d'une variable d'environnement — jamais codé en dur

Idempotence :
- Chaque livraison de webhook a un ID d'événement unique dans l'en-tête ou la charge utile — l'extraire
- Vérifier un magasin de déduplication (table de base de données ou ensemble Redis avec TTL) avant le traitement
- Si l'ID d'événement a déjà été traité, retourner `200` immédiatement — ne pas retraiter
- Stocker l'ID d'événement avec un TTL d'au moins la fenêtre de tentative du fournisseur (généralement 72 heures)

Modèle de traitement :
- Accuser réception immédiatement avec `200` — ne pas faire attendre le fournisseur pour la logique métier
- Mettre en file d'attente la charge utile validée et désérialisée dans une file d'attente de tâches pour le traitement asynchrone
- S'il n'existe pas de file d'attente de tâches, traiter de manière synchrone mais répondre quand même en 5 secondes
- Consigner le type d'événement, l'ID d'événement et le résultat du traitement pour chaque événement

Structure du gestionnaire :
1. Intergiciel de vérification de signature (réutilisable, pas en ligne)
2. Vérification de déduplication
3. Analyse de la charge utile et dispatching par type d'événement
4. Fonctions de gestionnaire par événement (une pour chaque type d'événement listé dans $ARGUMENTS)
5. Gestion des erreurs qui retourne 200 même en cas d'échec du traitement (pour éviter les tentatives en cas de bogues)

Écrire des tests pour : signature valide, signature invalide, événement dupliqué, chaque type d'événement dispatché correctement.

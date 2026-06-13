> 🇫🇷 This is the French translation. [English version](../security.md).

# Règles de Sécurité

Copiez les sections pertinentes dans le `CLAUDE.md` de votre projet.

---

## Secrets

- Ne jamais mettre des secrets dans le code source — ni dans les commentaires, ni dans les fichiers de test, ni dans les configurations d'exemple
- Ne jamais logger des secrets — vérifier que les appels de logger n'incluent pas des champs `password`, `token`, `key`, `secret`, ou `credential`
- Utiliser des variables d'environnement pour tous les secrets ; les lire au démarrage, valider leur existence
- Faire tourner les secrets qui ont été accidentellement committés — traiter tout secret commité comme compromis

## Validation des entrées

- Valider toutes les entrées aux frontières du système : paramètres API, chaînes de requête, corps de requête, uploads de fichiers, variables d'environnement
- Valider le type, le format, la longueur et la plage — pas seulement la présence
- Utiliser une liste d'autorisation (valeurs valides) plutôt qu'une liste de refus (valeurs bloquées) quand c'est possible
- Ne jamais utiliser les entrées utilisateur directement dans des requêtes SQL, des commandes shell, des chemins de fichiers, ou du HTML sans assainissement

## Authentification et autorisation

- Vérifier l'authentification sur chaque requête qui le requiert — ne jamais se fier au routage frontend
- Vérifier l'autorisation (l'utilisateur peut faire CETTE action) séparément de l'authentification (l'utilisateur est connecté)
- Les vérifications d'autorisation doivent référencer l'utilisateur authentifié depuis le contexte de requête — jamais depuis un paramètre de requête
- L'expiration des tokens doit être appliquée côté serveur — ne jamais faire confiance aux timestamps de tokens fournis par le client

## Bases de données

- Utiliser des requêtes paramétrées ou un ORM — ne jamais concaténer du SQL sous forme de chaîne
- Les utilisateurs de base de données doivent avoir les permissions minimales requises — l'utilisateur de l'app ne doit pas avoir accès au DDL
- Ne jamais exposer les erreurs internes de la base de données aux clients — logger côté serveur, retourner une erreur générique au client

## Dépendances

- Épingler les versions des dépendances — ne jamais utiliser `*` ou `latest` en production
- Exécuter `npm audit` / `pip-audit` / `govulncheck` avant chaque release
- Supprimer les dépendances inutilisées — chaque dépendance est une surface d'attaque potentielle
- Vérifier la source des nouvelles dépendances avant de les ajouter

---

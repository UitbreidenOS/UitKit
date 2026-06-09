---
description: Exécuter une analyse de sécurité statique complète sur un fichier ou un répertoire et signaler les vulnérabilités exploitables
argument-hint: "[path]"
---
Effectuer une analyse de sécurité statique approfondie de `$ARGUMENTS`. Si aucun chemin n'est fourni, analysez l'arborescence de travail entière.

Étapes :

1. **Énumérer la surface d'attaque** : Lister tous les points d'entrée — gestionnaires HTTP, arguments CLI, lectures de fichiers, IPC, variables d'environnement, désérialisation.

2. **Analyser les classes de vulnérabilités** — pour chaque découverte, signalez : fichier, ligne, sévérité (CRITIQUE / ÉLEVÉE / MOYENNE / BASSE), ID CWE et description en une ligne :
   - Injection : SQL, NoSQL, LDAP, commande, modèle, en-tête
   - Authentification cassée : identifiants codés en dur, génération de jetons faible, absence d'expiration
   - Exposition de données sensibles : secrets dans la source, stockage non chiffré, messages d'erreur détaillés
   - Désérialisation non sécurisée : pickle, YAML load, analyseurs basés sur eval
   - Contrôle d'accès cassé : vérifications d'autorisation manquantes, patterns IDOR, traversée de répertoires
   - Erreur de configuration de sécurité : drapeaux de débogage, CORS permissif, listage de répertoires
   - XSS / CSRF : réfléchi, stocké, basé sur DOM ; jetons CSRF manquants
   - Composants vulnérables : importations connues pour être affectées par une CVE (signaler pour audit de dépendances)
   - SSRF : URL contrôlées par l'utilisateur extraites côté serveur
   - XXE : analyseurs XML avec entités externes activées

3. **Trier et classer** : Classer toutes les conclusions par sévérité puis exploitabilité. Marquer comme CRITIQUE toute découverte exploitable sans authentification, indépendamment de la base CVSS.

4. **Pour chaque conclusion CRITIQUE et ÉLEVÉE**, fournir :
   - Scénario d'exploitation preuve de concept minimal (sans code d'exploitation fonctionnel — décrire le vecteur)
   - Correctif recommandé avec snippet de code corrigé

5. **Format de sortie** :
   ```
   ## Security Scan: <path>

   ### Summary
   CRITICAL: N | HIGH: N | MEDIUM: N | LOW: N

   ### Findings
   [severity] [CWE-XXX] file:line — description
   Fix: ...

   ### Deferred (MEDIUM/LOW)
   Bullet list only — no fix detail
   ```

Ne pas inclure les conclusions dont vous n'êtes pas certain. Préférez la précision au rappel — une critique confirmée vaut mieux que dix basses spéculatives.

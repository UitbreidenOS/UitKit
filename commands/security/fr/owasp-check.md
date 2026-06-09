---
description: Effectuer une revue systématique du Top 10 OWASP contre la base de code ou un composant spécifique
argument-hint: "[component or file]"
---
Effectuez une revue structurée du Top 10 OWASP (2021) de `$ARGUMENTS` (par défaut : base de code entière). Pour chaque catégorie, déterminez l'applicabilité, localisez le code pertinent et signalez les résultats avec la gravité et les conseils de correction.

Parcourez chaque catégorie dans l'ordre :

**A01 — Broken Access Control**
- Les vérifications d'autorisation sont-elles appliquées de façon cohérente dans toutes les routes et chemins de code vers la même ressource ?
- Des vulnérabilités IDOR sont-elles présentes (recherches d'objets sans vérification de propriété) ?
- Les utilisateurs peuvent-ils accéder aux données d'autres utilisateurs en manipulant les ID ou les paramètres ?

**A02 — Cryptographic Failures**
- Les données sensibles (PII, informations de paiement, identifiants) sont-elles transmises sur des canaux non chiffrés ?
- Des algorithmes faibles sont-ils utilisés (MD5, SHA1 pour les mots de passe, DES/RC4 pour le chiffrement) ?
- Les secrets sont-ils stockés dans le code, les fichiers de configuration ou les emplacements exposés à l'environnement ?
- Les validations de certificats TLS sont-elles désactivées quelque part ?

**A03 — Injection**
- Vecteurs d'injection SQL, NoSQL, commande OS, LDAP, XPath — les requêtes sont-elles paramétrées ?
- L'entrée utilisateur est-elle jamais interpolée dans les chaînes de requête ou les commandes shell ?

**A04 — Insecure Design**
- Existe-t-il des limites de débit manquantes sur les points de terminaison d'authentification (brute-force, credential stuffing) ?
- Y a-t-il un manque de validation des entrées au niveau du modèle de domaine ?
- Les exigences de sécurité sont-elles documentées et testées, ou entièrement absentes ?

**A05 — Security Misconfiguration**
- Les identifiants par défaut, les ports ou les interfaces d'administration sont-ils activés ?
- Des messages d'erreur détaillés ou des traces de pile sont-ils exposés aux clients ?
- Des fonctionnalités, points de terminaison ou services inutiles sont-ils activés ?
- Les en-têtes de sécurité HTTP sont-ils définis (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) ?

**A06 — Vulnerable and Outdated Components**
- Les dépendances sont-elles épinglées à des versions présentant des CVE connus ?
- Existe-t-il des composants OS ou runtime non corrigés dans la configuration Dockerfile ou de déploiement ?

**A07 — Identification and Authentication Failures**
- Les mots de passe sont-ils stockés avec un hachage adaptatif fort (bcrypt, argon2, scrypt) ?
- Les jetons de session sont-ils suffisamment aléatoires et invalidés à la déconnexion ?
- L'authentification multifacteur est-elle disponible pour les comptes privilégiés ?
- Existe-t-il des vecteurs d'énumération de comptes (réponses différentes pour les noms d'utilisateur valides ou invalides) ?

**A08 — Software and Data Integrity Failures**
- Les pipelines CI/CD sont-ils protégés contre les commits malveillants ou la substitution de dépendances ?
- Des opérations de désérialisation sont-elles effectuées sur des données non fiables sans validation de type ?

**A09 — Security Logging and Monitoring Failures**
- Les échecs d'authentification, les violations de contrôle d'accès et les erreurs de validation des entrées sont-ils enregistrés ?
- Les journaux sont-ils stockés où un attaquant qui compromet l'application ne peut pas les effacer ?
- Les entrées de journal incluent-elles assez de contexte (utilisateur, IP, horodatage, action) pour enquêter sur les incidents ?

**A10 — Server-Side Request Forgery (SSRF)**
- L'application récupère-t-elle des URL ou effectue-t-elle des requêtes sortantes basées sur une entrée fournie par l'utilisateur ?
- La destination est-elle validée par rapport à une liste blanche de domaines/IPs ?
- Les points de terminaison des métadonnées internes (169.254.169.254, localhost) peuvent-ils être atteints via SSRF ?

**Format de sortie** :
```
## OWASP Top 10 Review

### [A0X] Category Name — PASS / FINDING / NOT APPLICABLE
Finding: [file:line] description
Severity: Critical / High / Medium / Low
Fix: specific remediation
```

Résumez avec un tableau des risques à la fin : catégorie, statut, nombre de résultats, gravité la plus élevée.

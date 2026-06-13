# Workflow d'examen de sécurité

Processus structuré pour effectuer un examen de sécurité d'une base de code, d'une API ou d'un système avant le lancement ou après des modifications importantes.

## Quand utiliser

Exécutez ce workflow:
- Avant de lancer un nouveau produit ou une fonctionnalité majeure
- Quand un nouvel ingénieur rejoint l'équipe et hérite d'une base de code
- Après un incident de sécurité pour trouver les vulnérabilités associées
- Trimestriellement pour les chemins de code critiques en matière de sécurité (paiements, authentification, gestion des données personnelles)
- Quand vous modifiez les modèles d'authentification, d'autorisation ou d'accès aux données

## Phase 1: Modélisation des menaces (30-60 minutes)

Avant d'examiner le code, définissez ce que vous protégez:

**Éléments à protéger:**
- Données personnelles des utilisateurs (nom, email, adresse, informations de paiement)
- Identifiants d'authentification (mots de passe, tokens, clés API)
- Données métier (données propriétaires, données clients)
- Accès au système (capacités administrateur, infrastructure)

**Acteurs menaçants:**
- Attaquants externes (utilisateurs non authentifiés, bots automatisés)
- Utilisateurs authentifiés tentant d'accéder aux données d'autres utilisateurs
- Initiés malveillants ayant un accès légitime
- Chaîne d'approvisionnement (dépendances compromises)

**Surfaces d'attaque:**
- Points de terminaison API (publics et authentifiés)
- Téléchargement et traitement de fichiers
- Gestion de l'authentification et des sessions
- Intégrations tierces (OAuth, webhooks)
- Interfaces administrateur

**Priorisez en fonction de l'impact × probabilité.**

## Phase 2: Analyse automatisée (30 minutes)

Exécutez d'abord ces outils — ils identifient rapidement les problèmes évidents:

```bash
# 1. Vulnérabilités des dépendances
npm audit --audit-level=high        # Node.js
pip-audit                           # Python
cargo audit                         # Rust

# 2. Détection de secrets dans le code
gitleaks detect --source . --verbose

# 3. Analyse statique (si disponible pour votre langage)
# Node.js:
npx eslint --ext .ts,.tsx . --rulesdir security-rules/
# Python:
bandit -r src/ -ll

# 4. Vérification des dépendances OWASP
docker run --rm owasp/dependency-check \
  --scan /path/to/project \
  --format HTML --out /output

# 5. Analyse du conteneur (si Docker):
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image my-image:latest
```

## Phase 3: Examen du code manuel

Concentrez-vous sur les zones à risque le plus élevé:

**Authentification et gestion des sessions:**
- [ ] Le point de terminaison de connexion a un limitateur de débit
- [ ] Les mots de passe sont hachés avec bcrypt/argon2 (pas MD5/SHA1)
- [ ] Les tokens de session sont cryptographiquement aléatoires (pas des IDs séquentiels)
- [ ] La session est invalidée à la déconnexion (côté serveur)
- [ ] JWT: signature vérifiée, expiration vérifiée, algorithme épinglé
- [ ] Les tokens de réinitialisation de mot de passe expirent (< 1 heure) et sont à usage unique

**Autorisation:**
- [ ] Chaque point de terminaison API vérifie l'authentification
- [ ] Les vérifications d'accès aux ressources vérifient la propriété (pas seulement "est connecté")
- [ ] Les fonctions administrateur nécessitent une vérification explicite du rôle administrateur
- [ ] Escalade de privilèges horizontale testée: l'utilisateur A peut-il accéder aux ressources de l'utilisateur B?

**Validation des entrées:**
- [ ] Toute entrée utilisateur validée avant utilisation
- [ ] Requêtes SQL paramétrées (pas d'interpolation de chaîne)
- [ ] Téléchargements de fichiers: validation du type, limites de taille, analyse du contenu
- [ ] Protection contre la traversée de répertoires sur les opérations de fichiers
- [ ] Sortie HTML échappée (pas de contenu utilisateur brut rendu en HTML)

**Données sensibles:**
- [ ] Données personnelles non enregistrées (rechercher les modèles d'email, téléphone, SSN dans les logs)
- [ ] Les secrets ne sont pas dans les variables d'environnement lisibles côté client
- [ ] Pas de secrets dans le code, commentaires ou fixtures de test
- [ ] HTTPS appliqué (pas de secours HTTP)
- [ ] Les données sensibles chiffrées au repos (pas seulement hachées)

**Intégrations tierces:**
- [ ] Webhooks vérifiés avec signature (secret webhook Stripe, etc.)
- [ ] Paramètre d'état OAuth validé (prévention CSRF)
- [ ] URLs de redirection validées par rapport à une liste autorisée
- [ ] Clés API pivotées de celles qui expirent ou ont été exposées

## Phase 4: Test de pénétration (léger)

Testez l'application directement pour détecter les vulnérabilités courantes:

```bash
# Test rapide d'injection SQL (envoyez-les dans les champs de formulaire et les paramètres URL):
' OR '1'='1
1; DROP TABLE users; --

# Test XSS rapide:
<script>alert('xss')</script>
"><script>alert('xss')</script>

# Traversée de répertoires:
../../../etc/passwd
%2e%2e%2f%2e%2e%2fetc%2fpasswd

# Contournement d'authentification:
# Essayez d'accéder aux points de terminaison authentifiés sans token
# Essayez les tokens expirés
# Essayez les tokens d'un utilisateur différent
```

Utilisez OWASP ZAP ou Burp Suite Community Edition pour l'analyse automatisée de votre application en cours d'exécution.

## Phase 5: Rapport et correction

**Gravité des découvertes:**
- **Critique**: exploitable sans authentification, risque d'exfiltration de données → corriger avant le lancement
- **Élevée**: nécessite l'authentification mais entraîne une violation de données importante → corriger dans les 48h
- **Moyenne**: impact limité ou difficile à exploiter → corriger dans le sprint
- **Faible**: défense en profondeur, problèmes mineurs → corriger dans la prochaine fenêtre de maintenance

**Format du rapport:**
```markdown
## Examen de sécurité — [Date]
Réviseur: [nom]
Portée: [ce qui a été révisé]

### Découvertes critiques
1. [Découverte]: [description, localisation, preuve de concept, correction]

### Découvertes élevées
...

### Découvertes moyennes
...

### Plan de correction
| Découverte | Propriétaire | Date cible | Statut |
|---|---|---|---|
```

## Contenu connexe

- `/skills/productivity/ship-gate` — liste de vérification de sécurité pré-déploiement
- `/prompts/system-prompts/security-auditor` — prompt d'examen de sécurité Claude
- `/rules/common/api-design` — règles de conception d'API sécurisée
- `/agents/roles/red-team` — simulation d'adversaire autorisée

---

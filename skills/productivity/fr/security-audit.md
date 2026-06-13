---
name: security-audit
description: "Security audit for code: OWASP Top 10, injection, auth flaws, secrets, dependency vulnerabilities — with severity and fix for each finding"
---

> 🇫🇷 Version française. [English version](../security-audit.md).

# Compétence : Audit de Sécurité

## Quand activer
- Revue de sécurité avant le lancement d'une nouvelle fonctionnalité ou d'un point de terminaison
- Audit d'une base de code avant sa mise en open source
- Le retour de révision de code demande une analyse de sécurité
- Après l'ajout d'authentification, d'autorisation ou de gestion des paiements
- Avant un test de pénétration — trouver d'abord les problèmes évidents

## Quand NE PAS utiliser
- Analyse des dépendances — utiliser `npm audit`, `pip-audit` ou Snyk à la place (Claude ne peut pas lire les bases de données CVE)
- Tests de pénétration en direct contre des systèmes de production
- Certification de conformité (SOC2, PCI-DSS) — ceux-ci nécessitent des auditeurs humains et des outils dédiés
- Code binaire/compilé — Claude a besoin du code source

## Instructions

### Invocation de l'audit

```
/security-audit

Scope: {fichier, répertoire ou décrire la zone}
Focus: {all / auth / input validation / secrets / API endpoints}
```

Ou ciblé :
```
/security-audit

Review the user authentication flow in src/auth/.
Pay special attention to: session management, password reset, and JWT validation.
```

### Liste de vérification OWASP Top 10 utilisée par Claude

**A01 — Contrôle d'accès défaillant**
- [ ] Autorisation vérifiée sur chaque route/point de terminaison (pas seulement l'authentification)
- [ ] Élévation horizontale de privilèges : l'utilisateur A peut-il accéder aux données de l'utilisateur B ?
- [ ] IDOR (Référence directe d'objet non sécurisée) : les ID sont-ils validés par rapport à l'utilisateur authentifié ?
- [ ] Points de terminaison réservés aux administrateurs protégés contre les utilisateurs ordinaires

**A02 — Défaillances cryptographiques**
- [ ] Mots de passe hachés avec bcrypt/argon2/scrypt (pas MD5, SHA1 ou SHA256 brut)
- [ ] Données sensibles chiffrées au repos (PII, informations de paiement, tokens)
- [ ] HTTPS appliqué, aucune donnée sensible dans les URL ou les journaux
- [ ] Secrets non codés en dur ni commités dans git

**A03 — Injection**
- [ ] Les requêtes SQL utilisent des requêtes paramétrées / ORM (pas de concaténation de chaînes)
- [ ] Requêtes NoSQL désinfectées
- [ ] Injection de commandes : `subprocess`, `exec`, `eval` avec entrée utilisateur
- [ ] Injection LDAP, XPath, XML si applicable

**A04 — Conception non sécurisée**
- [ ] Limitation du débit sur les points de terminaison d'authentification (connexion, réinitialisation du mot de passe, OTP)
- [ ] Verrouillage du compte après N tentatives échouées
- [ ] Les opérations sensibles nécessitent une ré-authentification (changement de mot de passe, paiement)

**A05 — Mauvaise configuration de sécurité**
- [ ] Mode débogage désactivé en production
- [ ] Les messages d'erreur ne divulguent pas les traces de pile ou les détails internes aux utilisateurs
- [ ] Informations d'identification par défaut modifiées, comptes d'exemple supprimés
- [ ] CORS configuré de manière restrictive (pas `*`)
- [ ] En-têtes de sécurité présents (HSTS, CSP, X-Frame-Options)

**A06 — Composants vulnérables et obsolètes**
- [ ] Aucune dépendance à vulnérabilité connue (exécuter `npm audit` / `pip-audit` séparément)
- [ ] Dépendances épinglées à des versions spécifiques
- [ ] Aucun package abandonné avec des problèmes de sécurité ouverts

**A07 — Défaillances d'identification et d'authentification**
- [ ] JWT validé correctement (algorithme, expiration, signature)
- [ ] Les tokens de session sont cryptographiquement aléatoires, entropie suffisante
- [ ] Sessions invalidées à la déconnexion (pas seulement côté client)
- [ ] Les tokens "Se souvenir de moi" stockés de manière sécurisée, renouvelés à l'utilisation
- [ ] Les tokens de réinitialisation du mot de passe sont à usage unique et de courte durée

**A08 — Défaillances d'intégrité des données et des logiciels**
- [ ] Désérialisation des entrées utilisateur vérifiée pour les types dangereux
- [ ] Téléchargements de fichiers : type validé côté serveur, stocké en dehors de la racine web
- [ ] Intégrité du pipeline CI/CD (pas de code non fiable dans la chaîne de build)

**A09 — Défaillances de journalisation et de surveillance**
- [ ] Échecs d'authentification journalisés avec IP, horodatage, identifiant utilisateur
- [ ] Valeurs sensibles (mots de passe, tokens) non journalisées
- [ ] Journaux inviolables (en ajout seulement, envoyés vers un système externe)

**A10 — SSRF (Falsification de requête côté serveur)**
- [ ] Les URL fournies par l'utilisateur validées par rapport à une liste d'autorisation
- [ ] Points de terminaison de métadonnées internes bloqués (169.254.169.254, etc.)
- [ ] Les requêtes sortantes utilisent un proxy avec filtrage de sortie

### Format de sortie

Claude rapporte chaque constat avec :

```
[GRAVITÉ] {titre}
Location: {fichier:ligne ou zone}
Issue: {en quoi consiste la vulnérabilité}
Risk: {ce qu'un attaquant pourrait faire}
Fix:
  {modification du code ou étape de configuration}
```

**Niveaux de gravité :**
- 🔴 **CRITIQUE** — exploitable immédiatement, fuite de données ou prise de contrôle de compte possible
- 🟠 **ÉLEVÉ** — exploitable avec certaines conditions, impact significatif
- 🟡 **MOYEN** — exploitable dans des scénarios spécifiques, impact modéré
- 🟢 **FAIBLE** — problème de défense en profondeur, faible probabilité ou impact
- ℹ️ **INFO** — bonne pratique non suivie, pas d'exploitabilité directe

### Constats courants et corrections

**Injection SQL :**
```python
# Vulnérable
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# Corrigé
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
```

**Secret codé en dur :**
```python
# Vulnérable
API_KEY = "sk-prod-abc123..."

# Corrigé
API_KEY = os.environ["API_KEY"]  # jamais dans le code source
```

**Autorisation manquante :**
```python
# Vulnérable — vérifie seulement l'authentification
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    return db.query(Order).get(order_id)

# Corrigé — vérifie que la commande appartient à cet utilisateur
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id   # ← vérification d'autorisation
    ).first()
    if not order:
        raise HTTPException(status_code=404)
    return order
```

**Validation JWT faible :**
```python
# Vulnérable — accepte n'importe quel algorithme (attaque de confusion d'algorithme)
payload = jwt.decode(token, key, algorithms=["none"])

# Corrigé
payload = jwt.decode(token, key, algorithms=["HS256"])  # liste d'autorisation explicite
```

**CORS trop permissif :**
```python
# Vulnérable
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)

# Corrigé — les identifiants nécessitent une origine explicite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.yourdomain.com"],
    allow_credentials=True,
)
```

## Exemple

**Périmètre :** `src/auth/` dans une application FastAPI

**Constats attendus :**
```
🔴 CRITIQUE — Pas de limitation du débit sur /auth/login
Location: src/auth/routes.py:24
Issue: Le point de terminaison de connexion accepte des requêtes illimitées sans limitation.
Risk: Les attaques par force brute ou bourrage d'identifiants peuvent énumérer les comptes valides.
Fix: Ajouter le limiteur de débit slowapi : @limiter.limit("5/minute") sur la route de connexion.

🟠 ÉLEVÉ — Token de réinitialisation du mot de passe non invalidé après usage
Location: src/auth/password_reset.py:67
Issue: reset_password() met à jour le mot de passe mais ne supprime pas le token de réinitialisation.
Risk: Si un token est intercepté, il peut être réutilisé pour réinitialiser à nouveau le mot de passe.
Fix: Supprimer ou marquer le token comme utilisé immédiatement après la mise à jour du mot de passe.

🟡 MOYEN — Algorithme JWT non spécifié explicitement
Location: src/auth/jwt.py:12
Issue: jwt.decode() utilise la détection automatique d'algorithme.
Risk: Attaque de confusion d'algorithme si le serveur accepte l'algorithme 'none'.
Fix: Passer algorithms=["HS256"] explicitement à jwt.decode().

ℹ️ INFO — Tentatives de connexion échouées non journalisées
Location: src/auth/routes.py:38
Issue: Les échecs d'authentification sont silencieusement ignorés.
Fix: Journaliser les tentatives échouées avec horodatage, IP et nom d'utilisateur pour la surveillance.
```

---

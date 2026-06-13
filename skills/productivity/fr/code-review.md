---
name: code-review
description: "Examen du code structuré : exactitude, sécurité, performance, maintenabilité — avec sévérité et retour actionnable par constatation"
---

# Code Review Skill

## Quand activer
- Examiner une PR avant de l'approuver
- Auto-examiner votre propre code avant d'ouvrir une PR
- Faire un examen approfondi d'un changement critique ou sensible à la sécurité
- Intégrer un développeur junior et donner des retours structurés
- Liste de contrôle pré-fusion pour une fonctionnalité avant la production

## Quand ne PAS utiliser
- Linting automatisé — utiliser ESLint, Ruff, golangci-lint pour le style/formatage
- Analyse des vulnérabilités de dépendance — utiliser `npm audit`, Snyk, Dependabot
- Profilage de performance — utiliser un profileur, pas un examen de code

## Instructions

### Invoquer l'examen

```
/code-review

PR: [coller diff, ou décrire ce qui a changé]
Context: [à quoi sert cette PR, préoccupations spécifiques]
Focus: [correctness / security / performance / all]
```

Ou pour un fichier spécifique :
```
/code-review

File: src/billing/checkout.py
Concerns: payment processing, error handling, idempotency
```

### Liste de contrôle d'examen que Claude parcourt

**Exactitude**
- [ ] Le code fait-il ce que dit la description PR?
- [ ] Les cas limites sont-ils gérés? (entrée vide, null, zéro, très grandes valeurs)
- [ ] Les conditions d'erreur sont-elles gérées et les erreurs informatives?
- [ ] La gestion des erreurs est-elle au bon niveau? (ne pas attraper et ignorer les erreurs silencieusement)
- [ ] Les opérations asynchrones sont-elles attendues? Les conditions de concurrence sont-elles possibles?
- [ ] La logique est-elle correcte pour toutes les branches des conditions?

**Sécurité**
- [ ] L'entrée utilisateur est-elle validée et assainie avant utilisation?
- [ ] Les requêtes SQL sont-elles paramétrées?
- [ ] Les secrets / identifiants sont-ils gérés correctement (vars env, pas codés en dur)?
- [ ] L'autorisation est-elle vérifiée (pas juste l'authentification)?
- [ ] Les chemins de fichiers sont-ils validés? (path traversal)
- [ ] Les URLs externes sont-elles validées? (SSRF)

**Performance**
- [ ] Y a-t-il des modèles de requête N+1? (boucle avec un appel DB à l'intérieur)
- [ ] Les opérations coûteuses sont-elles mises en cache le cas échéant?
- [ ] Les requêtes de base de données sont-elles indexées sur les colonnes de filtre?
- [ ] Les grandes charges utiles sont-elles paginées ou streamed?
- [ ] Y a-t-il des opérations O(n²) cachées dans la logique?

**Maintenabilité**
- [ ] Les fonctions font-elles une seule chose? (< 30 lignes comme guide approximatif)
- [ ] Les noms de variables et de fonctions sont-ils descriptifs?
- [ ] Le code est-il lisible sans commentaires? (bonne dénomination > commentaires)
- [ ] La duplication introduite pourrait-elle être extraite?
- [ ] Y a-t-il des nombres magiques qui devraient être des constantes nommées?
- [ ] Le changement est-il couvert par des tests?

**Conception API / Interface**
- [ ] L'API publique est-elle cohérente avec les modèles existants?
- [ ] Les changements qui cassent sont-ils documentés?
- [ ] Les paramètres sont-ils dans un ordre sensé?
- [ ] La signature de fonction communique-t-elle son intention?

### Format de sortie

Claude produit les constatations par ordre de priorité :

```
🔴 BLOCKING — {title}
File: {path}:{line}
Issue: {what's wrong and why it matters}
Fix:
  {specific code change}

🟠 IMPORTANT — {title}
...

🟡 SUGGESTION — {title}
...

ℹ️ NITS — {list of minor style/naming items}

Summary: X blocking, Y important, Z suggestions
Overall: [Approve / Request changes / Needs discussion]
```

**Niveaux de sévérité:**
- 🔴 **BLOCKING** — doit corriger avant fusion : bug, problème de sécurité, risque de perte de données
- 🟠 **IMPORTANT** — devrait corriger avant fusion : problème de qualité ou de fiabilité significatif
- 🟡 **SUGGESTION** — vaut la peine de discuter : choix de conception, approche alternative
- ℹ️ **NIT** — style mineur, dénomination ou formatage (regrouper ceux-ci à la fin)

### Zones d'examen à signal élevé par type de changement

**Nouveau point de terminaison API:**
- Validation d'entrée sur tous les paramètres
- Authentification et autorisation
- Rate limiting
- Cohérence du format de réponse d'erreur
- Journalisation des événements importants

**Changement de schéma de base de données:**
- La migration est sûre pour le déploiement sans temps d'arrêt
- Les nouvelles colonnes sont nullables ou ont des défauts
- Les index ajoutés pour les nouveaux modèles de requête
- Les clés étrangères ont le comportement ON DELETE approprié

**Code de paiement / facturation:**
- Les clés d'idempotence utilisées pour les opérations de charge
- Validation de la signature du webhook
- Gestion de remboursement/inversion
- Gestion des devises (entiers/cents, pas flottants)
- Séparation du mode de test et du mode de production

**Changement d'authentification:**
- Invalidation de session à la déconnexion
- Algorithme de hachage de mot de passe (bcrypt/argon2, pas MD5/SHA1)
- Logique d'expiration du token et de rafraîchissement
- Protection CSRF sur les points de terminaison modifiant l'état

### Donner des retours efficacement

**Être spécifique, pas vague:**
```
# Bad feedback
"Ceci pourrait être plus efficace"

# Good feedback
🟠 IMPORTANT — Requête N+1 dans l'énumération utilisateur
Line 47: `orders = [get_orders(user.id) for user in users]` exécute une requête par utilisateur.
Remplacer par une seule requête JOIN ou utiliser `select_related('orders')`.
```

**Suggérer le correctif, pas juste le problème:**
```
🔴 BLOCKING — Entrée utilisateur utilisée directement dans la requête SQL
Line 23: f"SELECT * FROM products WHERE name = '{search_term}'"
Risque d'injection SQL. Remplacer par une requête paramétrée :
  cursor.execute("SELECT * FROM products WHERE name = %s", (search_term,))
```

**Reconnaître les bonnes décisions:**
```
✅ Bon appel d'utiliser UPSERT ici au lieu de SELECT + INSERT — évite la condition de concurrence.
```

## Exemple

**PR:** Ajouter un point de terminaison de recherche utilisateur

**Diff (simplifié):**
```python
@app.get("/users/search")
def search_users(query: str):
    results = db.execute(f"SELECT * FROM users WHERE email LIKE '%{query}%'")
    return [dict(r) for r in results]
```

**Résultat d'examen attendu:**
```
🔴 BLOCKING — Injection SQL via requête non paramétrée
File: api/users.py:3
Issue: La requête fournie par l'utilisateur `query` est interpolée directement dans SQL. Un attaquant peut
extraire toutes les données ou supprimer des tables.
Fix:
  results = db.execute(
      "SELECT * FROM users WHERE email LIKE %s",
      (f"%{query}%",)
  )

🟠 IMPORTANT — Aucun contrôle d'authentification ou d'autorisation
File: api/users.py:1
Issue: Le point de terminaison retourne les données utilisateur sans vérifier que l'appelant est authentifié.
Fix: Ajouter `user = Depends(get_current_user)` et vérifier que l'appelant a les permissions de recherche.

🟠 IMPORTANT — Pas de pagination — retournera tous les utilisateurs
File: api/users.py:3
Issue: `SELECT *` sans LIMIT peut retourner des milliers de lignes.
Fix: Ajouter `LIMIT 50` et un paramètre `page`.

🟡 SUGGESTION — SELECT * retourne password_hash et autres champs sensibles
Envisager de sélectionner explicitement seulement les colonnes sûres : id, email, name, created_at.

Summary: 2 blocking, 2 important
Decision: Request changes — les problèmes de sécurité doivent être corrigés avant fusion.
```

---

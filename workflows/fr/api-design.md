# Flux de travail de conception d'API

Flux de travail structuré pour concevoir une nouvelle API — des exigences à la spécification prête pour la mise en œuvre.

## Quand utiliser

Utilisez avant de mettre en œuvre un nouveau point de terminaison API ou une interface de service, en particulier quand:
- Plusieurs équipes ou services consommeront l'API
- L'API sera externe/orientée client
- Le point de terminaison implique une mutation de données ou une logique métier complexe
- Vous concevez une nouvelle limite de service

## Phase 1: Exigences (30 minutes)

**Répondez d'abord à ces questions:**

1. Qui sont les consommateurs?
   - Service interne uniquement / plusieurs services internes / consommateurs d'API externes / clients mobiles?
   
2. Que doit faire chaque consommateur?
   - Énumérez les cas d'usage, pas les points de terminaison

3. Quelles données sont impliquées?
   - Quelles entités sont créées, lues, mises à jour ou supprimées?
   - Quels sont les modèles d'accès aux données (par ID, par utilisateur, par plage de dates)?

4. Quels sont les exigences non fonctionnelles?
   - Cible de latence (p99 < X ms)
   - Débit (X demandes/seconde)
   - Exigences de cohérence (forte / éventuelle)
   - Exigences d'authentification (public / authentifié / service-à-service)

## Phase 2: Conception d'interface (45 minutes)

**Concevez les points de terminaison du point de vue du consommateur:**

1. Commencez par les cas d'usage, pas le modèle de données
   ```
   Cas d'usage: "L'utilisateur veut voir son historique de commandes"
   → GET /api/orders?userId={id}&status=completed&limit=20&cursor={cursor}
   
   Cas d'usage: "L'utilisateur veut annuler une commande"
   → POST /api/orders/{id}/cancel  (point de terminaison d'action, pas PATCH avec statut)
   ```

2. Appliquez les conventions REST (voir rules/common/api-design.md)

3. Concevez les schémas de requête/réponse:
   ```typescript
   // Définir des types TypeScript ou JSON Schema avant la mise en œuvre
   type CreateOrderRequest = {
     customerId: string
     items: Array<{ productId: string; quantity: number }>
     shippingAddressId: string
   }
   
   type Order = {
     id: string
     customerId: string
     status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
     items: OrderItem[]
     total: number
     createdAt: string  // ISO 8601
   }
   ```

4. Concevez les réponses d'erreur pour chaque point de terminaison:
   - Qu'est-ce qui peut mal tourner? (entrée invalide, non trouvée, conflit, échec d'authentification)
   - À quoi ressemble chaque réponse d'erreur?

## Phase 3: Validation et révision (20 minutes)

**Examinez la conception par rapport à ces critères:**

**Perspective du consommateur:**
- Un consommateur peut-il accomplir tous les cas d'usage avec les points de terminaison conçus?
- Les formes de réponse sont-elles prévisibles et cohérentes?
- Les codes d'erreur aident-ils le consommateur à récupérer?

**Perspective de la mise en œuvre:**
- Cela nécessite-t-il des requêtes N+1 pour la mise en œuvre? (concevoir pour éviter)
- Y a-t-il des pièges de latence? (grandes jointures, appels externes synchrones)
- La pagination est-elle conçue pour le volume de données attendu?

**Perspective de sécurité:**
- Chaque point de terminaison a-t-il des exigences d'authentification claires?
- Y a-t-il des points de terminaison qui pourraient divulguer les données entre les utilisateurs?
- La limitation du débit est-elle prise en compte?

**Versioning:**
- Est-ce rétrocompatible avec les consommateurs existants?
- Si breaking: le versioning est-il prévu?

## Phase 4: Documenter et partager (20 minutes)

**Format de spécification API (OpenAPI ou markdown simple):**

```markdown
## POST /api/orders

Créer une nouvelle commande.

**Authentification:** Requise (utilisateur)

**Requête:**
\```json
{
  "customerId": "string (UUID)",
  "items": [{ "productId": "string", "quantity": "integer (> 0)" }],
  "shippingAddressId": "string (UUID)"
}
\```

**Réponse 201:**
\```json
{ "id": "string", "status": "pending", "total": "number" }
\```

**Réponse 400:**
\```json
{ "error": { "code": "validation_error", "message": "string", "details": {} } }
\```

**Réponse 404:**
\```json
{ "error": { "code": "not_found", "message": "Customer not found" } }
\```
```

**Partager avec:**
- Équipes consommatrices (pour rétroaction avant la mise en œuvre)
- Leader d'ingénierie (pour examen architectural)
- Sécurité (si gestion de données sensibles)

## Phase 5: Mise en œuvre

1. Écrivez d'abord les tests (à partir de la spécification — ils deviennent vos tests d'acceptation)
2. Implémentez le gestionnaire
3. Validez manuellement par rapport à la spécification
4. Documentez toutes les écarts par rapport à la spécification d'origine

## Compétences connexes

- `/rules/common/api-design` — conventions REST à appliquer
- `/skills/productivity/spec-driven-workflow` — modèle spécification → test → implémentation
- `/skills/productivity/api-test-builder` — générer des suites de test à partir des spécifications

---

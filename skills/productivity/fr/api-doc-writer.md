---
name: api-doc-writer
description: "Documentation API à partir d'une spec OpenAPI ou du code : endpoints, paramètres, exemples, codes d'erreur, SDKs"
---

# Compétence : Rédacteur de documentation API

## Quand activer
- Vous disposez d'une spec OpenAPI/Swagger et devez produire une documentation de référence lisible par des humains
- Vous rédigez la documentation d'une API REST, GraphQL ou webhook à partir du code ou d'un fichier de spec
- La documentation API existante est incomplète — exemples manquants, codes d'erreur absents, ou documentation d'authentification lacunaire
- Vous devez produire des guides de démarrage rapide pour SDK ou des exemples de code en plusieurs langages
- Vous produisez un guide de migration entre versions d'API (v1 → v2, changements cassants)

## Quand NE PAS utiliser
- Vous devez concevoir l'API elle-même — cette compétence documente les APIs existantes, elle n'en crée pas de nouvelles
- Vous avez besoin d'un changelog à partir de l'historique git — utilisez `/changelog-writer`
- Vous avez besoin d'une architecture complète de site de documentation — utilisez `/doc-site-builder` en premier, puis utilisez cette compétence pour rédiger la section de référence
- L'API est strictement interne et l'audience est votre propre équipe — adaptez la profondeur et le style ; les wikis internes n'ont pas besoin du traitement complet orienté consommateur

## Instructions

### Spec OpenAPI → documentation de référence

```
Convertis cette spec OpenAPI (ou description d'API) en documentation de référence lisible par des humains.

## Entrée
Format de spec : [OpenAPI 3.x / Swagger 2.x / description simple des endpoints]
Nom de l'API : [nom]
Version de l'API : [v1 / v2 / etc.]
URL de base : [https://api.example.com/v1]
Authentification : [Clé API / Bearer token / OAuth 2.0 / Basic]

[Collez le JSON/YAML OpenAPI ici, ou décrivez les endpoints]

## Format de sortie
Pour chaque endpoint, produire une section de documentation :

---

### [Méthode HTTP] [/chemin]
[Une phrase — ce que fait cet endpoint et quand l'utiliser]

**Authentification :** [requise / optionnelle — et comment]

**Requête**

En-têtes :
| En-tête | Requis | Valeur |
|---|---|---|
| `Authorization` | Oui | `Bearer {token}` |
| `Content-Type` | Oui | `application/json` |

Paramètres de chemin :
| Paramètre | Type | Description |
|---|---|---|
| `{id}` | string | L'identifiant unique de la [ressource] |

Paramètres de requête :
| Paramètre | Type | Requis | Défaut | Description |
|---|---|---|---|---|
| `limit` | integer | Non | 20 | Nombre maximum de résultats (1-100) |
| `cursor` | string | Non | — | Curseur de pagination issu de la réponse précédente |

Corps de la requête :
```json
{
  "field_name": "string",        // Requis. Description du champ.
  "optional_field": 42,          // Optionnel. Défaut : 0. Description.
  "nested_object": {
    "child_field": true          // Requis. Description.
  }
}
```

**Réponse**

Réponse de succès — `200 OK` :
```json
{
  "id": "res_abc123",
  "created_at": "2026-06-01T12:00:00Z",
  "status": "active",
  "data": {
    "field": "value"
  }
}
```

Champs de la réponse :
| Champ | Type | Description |
|---|---|---|
| `id` | string | Identifiant unique, préfixé par `res_` |
| `created_at` | ISO 8601 | Horodatage de création de la ressource (UTC) |
| `status` | enum | `active` \| `inactive` \| `pending` |

**Réponses d'erreur**
| Statut | Code d'erreur | Quand cela se produit |
|---|---|---|
| `400` | `invalid_request` | Champ requis manquant ou format invalide |
| `401` | `unauthorized` | Clé API manquante ou invalide |
| `403` | `forbidden` | Authentifié mais permissions insuffisantes |
| `404` | `not_found` | La ressource avec cet ID n'existe pas |
| `429` | `rate_limited` | Limite de taux dépassée — voir la section limites de taux |
| `500` | `internal_error` | Erreur côté serveur — réessayez avec un backoff exponentiel |

**Exemples de code**

```bash
# cURL
curl -X POST https://api.example.com/v1/[chemin] \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "value"
  }'
```

```python
import requests

response = requests.post(
    "https://api.example.com/v1/[chemin]",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"field_name": "value"}
)
response.raise_for_status()
data = response.json()
```

```typescript
const response = await fetch('https://api.example.com/v1/[chemin]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ field_name: 'value' }),
});
const data = await response.json();
```

---

## Sections transversales à produire en parallèle des docs d'endpoints :

### Guide d'authentification
[Rédiger un guide d'installation d'authentification complet — pas seulement une mention]

Sections :
1. Comment obtenir une clé API / token
2. Comment authentifier les requêtes (montrer toutes les méthodes supportées)
3. Rotation des clés / renouvellement du token
4. Scopes et permissions (si applicable)
5. Tester l'authentification (une commande curl qu'ils peuvent exécuter pour vérifier que ça fonctionne)

### Limites de taux
- Valeurs des limites de taux : [X requêtes par minute / heure / jour]
- Quels en-têtes portent les infos de limite de taux : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Comment gérer les 429 : en-tête retry-after, backoff exponentiel
- Limites par endpoint vs limites globales

### Pagination
Si l'API utilise une pagination par curseur ou par offset :
- Expliquer le modèle de pagination (basé sur curseur / offset / page)
- Montrer comment paginer à travers tous les résultats avec un exemple de code (une boucle)
- Expliquer ce qui se passe à la dernière page

### Section Webhooks (si applicable)
- Structure du payload webhook (avec exemple)
- Vérification de signature (avec exemple de code en 3 langages)
- Politique de nouvelle tentative et garanties de livraison
- Comment enregistrer les endpoints webhook
- Comment tester en local (ngrok / Cloudflare Tunnel)

### Guide de gestion des erreurs (transversal)
Ne pas seulement lister les codes d'erreur — rédiger un guide :
- Comment distinguer les erreurs pouvant être relancées (5xx, 429) de celles qui ne le peuvent pas (4xx)
- Exemple d'implémentation de backoff exponentiel
- Clés d'idempotence — quand les utiliser
- Comment lire et utiliser le corps de la réponse d'erreur

### Démarrage rapide avec le SDK
Pour chaque langage de SDK supporté, un exemple minimal fonctionnel :
- Installer le SDK
- S'authentifier
- Effectuer l'appel API le plus courant
- Gérer les erreurs
- Exemple de code complet, exécutable sans modification (pas de valeurs placeholder qui le cassent)
```

### Guide de migration API (mise à niveau de version)

```
Rédige un guide de migration de [API vANCIENNE] vers [API vNOUVELLE].

## Changements cassants à documenter
[Lister chaque changement cassant — endpoint renommé, paramètre supprimé, forme de la réponse modifiée, méthode d'authentification changée]

## Structure du guide de migration :

### Vue d'ensemble
- Ce qui a changé et pourquoi (raison côté utilisateur, pas technique)
- Calendrier : quand v[ANCIENNE] est dépréciée, quand elle est supprimée
- Complexité de la migration : [heures / jours / semaines pour une intégration typique]

### Changements cassants

Pour chaque changement cassant :
**[Titre du changement]**
Ce qui a changé : [description simple]
Avant (v[ANCIENNE]) :
```[langage]
[ancien code]
```
Après (v[NOUVELLE]) :
```[langage]
[nouveau code]
```
Étapes de migration :
1. [Étape spécifique]
2. [Étape spécifique]
Impact : [ce qui se casse si vous ne migrez pas]

### Ajouts non cassants
[Fonctionnalités disponibles dans vNOUVELLE mais pas dans vANCIENNE — lecture optionnelle pour les utilisateurs de v[ANCIENNE]]

### Liste de contrôle de migration
- [ ] Mettre à jour la version du SDK vers [X]
- [ ] Mettre à jour l'URL de base de [ancien] vers [nouveau]
- [ ] [Chaque changement cassant comme une case à cocher]
- [ ] Exécuter la suite de tests
- [ ] Déployer en staging et vérifier
- [ ] Déployer en production

### Obtenir de l'aide pendant la migration
[Lien vers le canal de support, les heures de bureau de migration, ou le formulaire de feedback]
```

### Audit qualité de la documentation — référence API

```
Auditer cette documentation API en termes d'exhaustivité et de qualité.

[Collez la documentation API existante]

Vérifier selon ce référentiel :

EXHAUSTIVITÉ :
- [ ] Chaque endpoint a : description, tous les paramètres documentés, réponse de succès, réponses d'erreur
- [ ] L'authentification est expliquée avec un exemple fonctionnel
- [ ] Les limites de taux sont documentées
- [ ] La pagination est documentée (si applicable)
- [ ] Des exemples de code dans au moins 2 langages pour chaque endpoint
- [ ] Les docs webhook (si applicable) incluent la vérification de signature

EXACTITUDE :
- [ ] Les types de paramètres sont exacts
- [ ] Requis vs optionnel correctement marqué
- [ ] Les valeurs par défaut sont indiquées pour les paramètres optionnels
- [ ] Les codes d'erreur sont réels (pas inventés)

UTILISABILITÉ :
- [ ] Un développeur peut-il intégrer sans lire le code source ?
- [ ] Y a-t-il des exemples de code fonctionnels (pas du pseudocode) ?
- [ ] Le langage est-il clair et précis (pas du texte marketing) ?
- [ ] Les pièges et cas limites sont-ils documentés là où ils existent ?

Pour chaque lacune : recommandation de correction spécifique.
Priorité : quelles lacunes sont les plus susceptibles de causer des échecs d'intégration ou des tickets de support.
```

## Exemple

**Utilisateur :** Documente cet endpoint REST. C'est `POST /v1/payments` qui crée un paiement. Champs requis : amount (entier, en centimes), currency (chaîne ISO 4217), customer_id (chaîne). Optionnel : description (chaîne), metadata (objet). Retourne l'objet paiement avec id, status, amount, currency, created_at. Erreurs : 400 pour montant invalide, 401 pour mauvaise auth, 402 pour échec de paiement (avec un champ decline_code).

**Sortie :**

```markdown
### POST /v1/payments

Créer un nouveau débit de paiement pour un client.

**Authentification :** Requise — Bearer token

**Corps de la requête**
```json
{
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "description": "Facture #1042",
  "metadata": {
    "order_id": "ord_789"
  }
}
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| `amount` | integer | Oui | Montant dans la plus petite unité monétaire (centimes pour USD). Doit être > 0. |
| `currency` | string | Oui | Code devise ISO 4217 en minuscules (`usd`, `eur`, `gbp`). |
| `customer_id` | string | Oui | ID du client à débiter. Doit exister. |
| `description` | string | Non | Une description lisible par l'humain stockée sur le paiement. |
| `metadata` | object | Non | Paires clé-valeur pour votre référence interne. Max 50 clés, 500 caractères par valeur. |

**Réponse de succès — `200 OK`**
```json
{
  "id": "pay_abc123",
  "status": "succeeded",
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**Réponses d'erreur**
| Statut | Code | Quand |
|---|---|---|
| `400` | `invalid_amount` | Le montant est 0, négatif, ou pas un entier |
| `401` | `unauthorized` | Bearer token manquant ou invalide |
| `402` | `payment_failed` | Carte refusée — vérifier `decline_code` dans le corps de la réponse |

Pour les réponses `402`, le corps inclut :
```json
{
  "error": "payment_failed",
  "decline_code": "insufficient_funds",
  "message": "The card has insufficient funds to complete the purchase."
}
```

Valeurs courantes de `decline_code` : `insufficient_funds`, `card_declined`, `expired_card`, `incorrect_cvc`.

**Exemples de code**

```bash
curl -X POST https://api.example.com/v1/payments \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd", "customer_id": "cus_abc123"}'
```

```python
response = requests.post(
    "https://api.example.com/v1/payments",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"amount": 2000, "currency": "usd", "customer_id": customer_id},
)
if response.status_code == 402:
    decline_code = response.json()["decline_code"]
    # gérer le refus
response.raise_for_status()
payment = response.json()
```
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

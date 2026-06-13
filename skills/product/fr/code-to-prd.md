---
name: code-to-prd
description: "Rétro-concevoir une PRD à partir du code existant — extraire ce qui a été construit, déduire les décisions de produit prises et générer un document de spécifications de produit approprié pour la documentation ou la remise"
---

# Code to PRD Skill

## Quand activer
- Documenter ce qui a été construit sans spécification écrite (dette technique en documentation)
- Intégrer un nouveau PM qui hérite de fonctionnalités non documentées
- Se préparer pour une remise de produit ou une transition d'équipe
- Auditer ce qui a réellement été construit par rapport à ce qui était originalement prévu
- Créer une documentation à partir d'un prototype qui a été livré sans spécifications

## Quand ne PAS utiliser
- Rédaction d'une nouvelle PRD avant la construction — utiliser la compétence product-manager-toolkit
- Documenter une API pour les consommateurs externes — utiliser le générateur README
- Créer une documentation destinée aux utilisateurs — public et format différents

## Instructions

### Extraction PRD complète des fonctionnalités

```
Rétro-concevoir une PRD à partir de ce code/fonctionnalité.

Feature/codebase: [décrire ou pointer vers les fichiers pertinents]
Read: [lister les fichiers clés — routes, modèles, composants UI, tests]

Processus d'extraction:

ÉTAPE 1 — CE QUI A ÉTÉ CONSTRUIT (à partir du code):
- Quelles données cette fonctionnalité crée, lit, met à jour ou supprime?
- Quels sont les points d'entrée? (points de terminaison API, pages UI, commandes CLI)
- Quelles sont les sorties? (réponses, e-mails, notifications, effets secondaires)
- Quelles règles de validation existent? (à partir des schémas Zod, protections ou tests)
- Quels états d'erreur sont gérés?

ÉTAPE 2 — DÉDUIRE LES DÉCISIONS DE PRODUIT:
- Pour qui est-ce? (déduire des modèles UX, de la dénomination, des données de test)
- Quel problème cela résout-il? (déduire de la logique et du contexte de la fonctionnalité)
- Qu'ont-ils délibérément NON inclus? (qu'est-ce qui manque que vous attendriez?)
- Quelles sont les contraintes implicites? (exigences d'authentification, limite de débit, limites de données)

ÉTAPE 3 — GÉNÉRER LA PRD:

## Feature: [Name]
**Built:** [date from git history]
**Author:** [from git log]
**Status:** Shipped

### Énoncé du problème
[Quel problème cette fonctionnalité résout — déduit de l'implémentation]

### Utilisateurs
[Pour qui c'est — déduit de la logique d'authentification, des modèles UI, des données de test]

### Ce qui a été construit
#### Parcours utilisateur
[Décrire les flux que le code active]

#### Modèle de données
[Tables/collections affectées + champs clés]

#### Surface API
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| [path] | [GET/POST/etc] | [yes/no/role] | [what it does] |

#### Règles métier
[Logique de validation, limites, permissions trouvées dans le code]

#### Gestion des erreurs
[États d'erreur implémentés et leurs réponses]

### Ce qui n'a PAS été construit (lacunes)
[Choses que vous attendriez mais ne sont pas présentes — validation manquante, pas de pagination, pas de journal d'audit, etc.]

### Questions ouvertes
[Choses qui ne pouvaient pas être déduites du code seul]

Générer la PRD pour la fonctionnalité que je décris.
```

### Analyse d'un seul fichier

```
Extraire les éléments PRD de [fichier].

File: [coller le fichier ou le chemin]

Analyser et extraire:
1. PURPOSE: Que fait ce fichier? (1-2 phrases)
2. INPUTS: Quelles données entrent? (paramètres, corps de requête, vars env)
3. OUTPUTS: Qu'est-ce qu'il retourne ou produit?
4. BUSINESS RULES: Quelle logique/validation/décisions sont intégrées?
5. DEPENDENCIES: Sur quoi compte-t-il? (services, DB, APIs externes)
6. IMPLICIT REQUIREMENTS: Qu'est-ce qui doit être vrai pour que cela fonctionne? (authentification, permissions, forme de données)
7. EDGE CASES HANDLED: Quels modes de défaillance sont explicitement gérés?
8. GAPS: Qu'est-ce qui manque qu'une version de production aurait besoin?
```

### Analyse de l'historique Git

```
Reconstruire l'historique du produit à partir du journal git.

Repository: [répertoire actuel]
Feature branch or path: [p.ex. src/payments/ ou branche main]
Period: [6 derniers mois / depuis v1.0 / tout le temps]

Run: git log --follow --stat -- [path]

À partir de l'historique des commits, extraire:
1. TIMELINE: Quand chaque grande pièce a-t-elle été construite?
2. ITERATIONS: Qu'est-ce qui a changé après la construction initiale? (corrections, ajouts, suppressions de fonctionnalités)
3. DECISIONS VISIBLES EN CODE: Qu'est-ce qui a été refactorisé et pourquoi? (déduire des messages de commit)
4. CE QUI A ÉTÉ SUPPRIMÉ: Une fonctionnalité supprimée?

Output: un récit historique du produit pour cette fonctionnalité/zone.
```

## Exemple

**User:** Nous avons livré une fonctionnalité de facturation il y a 6 mois sans spécification. Un nouveau PM se joint. Générer la PRD à partir du code.

**Claude reads:**
- `src/api/invoices/route.ts` (API endpoints)
- `db/schema.ts` (invoices table)
- `src/services/invoices.ts` (business logic)
- `src/emails/InvoicePaidEmail.tsx` (email template)
- `tests/invoices.test.ts` (test cases)

**Claude's PRD output:**

```markdown
## Feature: Gestion des factures
**Built:** January 2026 (git log shows initial commit: Jan 8 2026)
**Status:** Shipped, in production

### Énoncé du problème
Les clients avaient besoin d'envoyer des factures à leurs clients et de suivre le statut du paiement. Auparavant réalisé manuellement par email avec des PDF en pièce jointe.

### Utilisateurs
Primary: Business owners (déduit de l'authentification nécessitant `role: 'business'`)
Secondary: Leurs clients reçoivent les factures (pas de compte requis pour payer)

### Ce qui a été construit

#### Parcours utilisateur
1. Créer une facture → définir l'email du client, les éléments de ligne, la date d'échéance
2. Envoyer une facture → le client reçoit un email avec un lien de paiement
3. Le client paie → le webhook Stripe marque comme payé → le propriétaire est notifié
4. Le propriétaire affiche la liste des factures → filtrer par statut (brouillon/envoyé/payé/en retard)

#### Modèle de données
**invoices table:**
- id, userId (FK), clientEmail, clientName
- lineItems (JSONB), totalCents
- status: draft | sent | paid | overdue
- dueDate, sentAt, paidAt
- stripePaymentIntentId

#### Surface API
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| /api/invoices | GET | user | List user's invoices |
| /api/invoices | POST | user | Create invoice |
| /api/invoices/:id | PATCH | user (owner) | Update draft invoice |
| /api/invoices/:id/send | POST | user (owner) | Send to client |
| /api/invoices/:id/pay | POST | none | Client payment page |

#### Règles métier
- Seules les factures `draft` peuvent être modifiées (appliquées à la couche de service)
- Le total est calculé côté serveur à partir des lineItems (le client ne peut pas définir le total directement)
- Les factures avec dueDate dans le passé et status=sent sont marquées en retard par un cron quotidien
- Le paiement crée un PaymentIntent Stripe ; le webhook confirme le paiement

### Lacunes (non construites)
- Pas de téléchargement PDF pour les factures payées
- Pas de système de numérotation de facturation (les factures ont des UUID, pas de format INV-001)
- Pas de paiements partiels
- Pas de modèles de facturation
- Pas de calcul de taxes
- Côté client : pas de nouvelle tentative de paiement si la carte est refusée (simplement rediriger vers la page d'erreur)

### Questions ouvertes
- Les factures annulées sont-elles suivies? (aucun point de terminaison d'annulation trouvé — la suppression est la seule option)
- Y a-t-il un plan pour ajouter des factures récurrentes? (aucune preuve dans le code)
```

---

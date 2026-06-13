---
name: spec-driven-workflow
description: "Développement piloté par la spécification : rédiger d'abord la spécification, puis les tests, puis l'implémentation — réduit le rework, clarifie les exigences avant le codage et produit des systèmes mieux documentés"
---

# Compétence Flux de travail piloté par la spécification

## Quand l'activer
- Commencer une fonctionnalité non triviale où les exigences sont ambiguës
- Construire une API ou une interface que d'autres équipes utiliseront
- Réduire le rework causé par la construction de la mauvaise chose
- Pratiquer le développement piloté par les tests (TDD) au niveau des fonctionnalités
- Vouloir que Claude comprenne la spécification avant d'écrire du code

## Quand NE PAS l'utiliser
- Petits correctifs de bugs — simplement les corriger
- Prototypes exploratoires où l'objectif est d'apprendre, pas d'expédier
- Tâches où la spécification est déjà parfaitement claire et écrite
- Correctifs d'urgence qui doivent partir immédiatement

## Instructions

### Modèle spec-first

```
Rédiger une spécification pour [fonctionnalité].

Fonctionnalité : [décrire en anglais simple ce que vous voulez construire]
Utilisateurs : [qui utilisera cette fonctionnalité]
Contexte : [où cela s'inscrit dans le système — quel service, page ou API]
Contraintes : [performance, sécurité, rétro-compatibilité, interfaces existantes]

Modèle de spécification :

## Fonctionnalité : [Nom]

### Résumé
[1-2 phrases — ce que cette fonctionnalité fait et pourquoi]

### Arrière-plan
[Pourquoi construisons-nous cela ? Quel problème résout-il ?]

### Étendue
Dans le champ d'application :
- [Comportement spécifique 1]
- [Comportement spécifique 2]

Hors du champ d'application (explicite) :
- [Chose que nous ne construisons PAS]
- [Cas limite que nous reportons]

### Définition de l'interface
[Pour une API : points de terminaison, entrées, sorties, codes d'état]
[Pour une interface utilisateur : parcours utilisateur, états, transitions]
[Pour une bibliothèque : signatures de fonction, types, valeurs de retour]

Exemple (API) :
POST /api/invoices
Demande :
  { customer_id: string, items: [{sku: string, qty: int, price_cents: int}], due_date: string }
Réponse 201 :
  { invoice_id: string, total_cents: int, pdf_url: string }
Réponse 400 :
  { error: "invalid_customer" | "items_empty" | "invalid_date" }

### Critères d'acceptation (testables)
Format : Compte tenu de [contexte], quand [action], alors [résultat observable]

- COMPTE TENU d'un client valide et d'articles, QUAND le point de terminaison est appelé, ALORS une réponse 201 avec invoice_id est retournée
- COMPTE TENU d'un customer_id invalide, QUAND le point de terminaison est appelé, ALORS une réponse 400 avec error : « invalid_customer » est retournée
- COMPTE TENU d'un tableau d'articles vide, QUAND le point de terminaison est appelé, ALORS une réponse 400 est retournée
- COMPTE TENU d'articles avec prix négatif, QUAND le point de terminaison est appelé, ALORS une réponse 400 est retournée

### Questions ouvertes (résoudre avant de construire)
- [ ] [Question 1 — décision nécessaire]
- [ ] [Question 2 — hypothèse à valider]

### Dépendances
- [Service ou API externe dont cela dépend]
- [Dépendance de service ou d'équipe interne]

Rédiger la spécification complète pour ma fonctionnalité.
```

### Traduction spec-to-test

```
Convertir cette spécification en tests échouant avant implémentation.

Spécification : [collez la spécification ci-dessus]
Langue/framework : [TypeScript/Jest / Python/pytest / Go/testing / Ruby/RSpec]

Règles pour spec-to-test :
1. Un test par critère d'acceptation
2. Tester l'interface (entrées/sorties), pas l'implémentation
3. Les tests doivent être lisibles comme documentation — quelqu'un doit comprendre la fonctionnalité en lisant les tests
4. Les chemins malheureux sont aussi importants que les chemins heureux

Exemple TypeScript/Jest (à partir de la spécification de facture ci-dessus) :

describe('POST /api/invoices', () => {
  describe('success cases', () => {
    it('creates an invoice with valid inputs and returns 201 with invoice_id', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [{ sku: 'SKU-001', qty: 2, price_cents: 2999 }],
        due_date: '2026-12-31',
      });
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        invoice_id: expect.stringMatching(/^inv_/),
        total_cents: 5998,
        pdf_url: expect.stringContaining('https://'),
      });
    });
  });

  describe('validation errors', () => {
    it('returns 400 with invalid_customer when customer_id does not exist', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_nonexistent',
        items: [{ sku: 'SKU-001', qty: 1, price_cents: 1000 }],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_customer');
    });

    it('returns 400 when items array is empty', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('items_empty');
    });
  });
});

Convertir ma spécification en tests échouant. Les tests doivent échouer jusqu'à ce que j'implémente la fonctionnalité.
```

### Implémentation à partir de la spécification

```
Implémenter [fonctionnalité] selon cette spécification et ces tests.

Spécification : [collez la spécification]
Tests : [collez les tests échouant]
Langue/framework : [spécifier]
Contexte de code existant : [collez les interfaces, types ou code adjacent pertinents]

Règles d'implémentation :
1. Faire passer les tests — rien de plus, rien de moins
2. Ne pas construire de fonctionnalités qui ne sont pas dans la spécification (même si elles semblent évidemment nécessaires)
3. Ne pas optimiser prématurément — simple et correct bat intelligent
4. Gérer chaque cas d'erreur dans les critères d'acceptation de la spécification
5. Demander si un critère d'acceptation est ambigu plutôt que d'assumer

Ordre d'implémentation :
1. Définir d'abord les types / interfaces (compile sur aucune sortie, documente la forme)
2. Implémentation du chemin heureux (faire passer le test 201)
3. Validation et gestion des erreurs (faire passer les tests 400)
4. Cas limites (s'il en reste dans la spécification)
5. Exécuter tous les tests — confirmer que tous réussissent avant soumission

Le code produit doit :
- N'avoir pas de TODOs ou de commentaires d'espace réservé
- N'avoir pas de code commenté
- Compiler et exécuter sans modification

Implémenter la fonctionnalité.
```

### Examen des spécifications

```
Examiner cette spécification avant de la construire.

Spécification : [collez]
Objectif : attraper les ambiguïtés, les cas limites manquants et les hypothèses mal alignées avant le codage

Liste de contrôle d'examen :

EXHAUSTIVITÉ :
□ Toutes les entrées sont-elles entièrement spécifiées (types, formats, contraintes) ?
□ Toutes les sorties sont-elles entièrement spécifiées (succès + réponses d'erreur) ?
□ Tous les états d'erreur sont-ils énumérés ?
□ Les critères d'acceptation sont-ils spécifiques et testables ?
□ Les éléments hors du champ d'application sont-ils explicitement indiqués ?

AMBIGUÏTÉ :
□ Y a-t-il un critère ouvert à plusieurs interprétations ?
□ Les termes sont-ils utilisés de manière cohérente tout au long ?
□ Y a-t-il des hypothèses implicites qui devraient être explicites ?
□ La « due_date : string » a-t-elle besoin d'une spécification de format ? (ISO 8601 ? YYYY-MM-DD ? Fuseau horaire conscient ?)

MANQUANTS CAS LIMITES :
□ Que se passe-t-il avec les entrées vides ?
□ Que se passe-t-il avec les entrées de taille maximale ?
□ Que se passe-t-il si une dépendance est indisponible ?
□ Que se passe-t-il avec les demandes simultanées ?
□ Que se passe-t-il après la limitation du débit ?

EXAMEN DE L'INTERFACE :
□ L'API est-elle cohérente avec les points de terminaison existants ?
□ Les conventions de nommage sont-elles suivies ?
□ Le format de réponse est-il cohérent avec les autres points de terminaison ?
□ Les codes d'état sont-ils utilisés correctement (201 pour créer, 200 pour mettre à jour, 404 pour non trouvé) ?

QUESTIONS OUVERTES :
□ Toutes les questions ouvertes sont-elles résolues avant de construire ?
□ Y a-t-il des décisions qui sont reportées mais qui devraient être prises maintenant ?

Produire : liste des lacunes et des questions à résoudre avant le début de la mise en œuvre.
```

## Exemple

**Utilisateur :** Je veux construire une fonctionnalité où les utilisateurs peuvent télécharger un CSV de contacts et les importer en masse. Aidez-moi à spécifier d'abord.

**Spécification de Claude :**

---

## Fonctionnalité : Import en masse de contacts via CSV

### Résumé
Permettre aux utilisateurs de télécharger un fichier CSV contenant des données de contacts. Le système valide chaque ligne, importe les contacts valides et retourne un rapport montrant les succès et les échecs.

### Étendue
Dans le champ d'application :
- Téléchargement de fichier CSV via point de terminaison API
- Validation de chaque ligne (champs obligatoires, format)
- Import de lignes valides en tant que contacts
- Rapport d'erreur par ligne (quelles lignes ont échoué et pourquoi)
- Détection des doublons (même email → ignorer ou mettre à jour, configurable)

Hors du champ d'application :
- Sélecteur de fichier UI (API uniquement pour l'instant)
- Téléchargement du modèle CSV
- Traitement asynchrone pour les fichiers > 10 000 lignes (synchrone pour v1)
- Déduplic des contacts dans les contacts existants (correspondance email uniquement)

### Définition de l'interface

```
POST /api/contacts/import
Content-Type: multipart/form-data

Champs :
  file: fichier CSV (obligatoire)
  duplicate_strategy: "skip" | "update" (optionnel, par défaut : "skip")

Format CSV (ligne d'en-tête obligatoire) :
  email (obligatoire), first_name, last_name, phone, company

Réponse 200 (toujours 200, même si certaines lignes ont échoué) :
{
  total_rows: 847,
  imported: 821,
  skipped: 14,        // duplicates
  failed: 12,          // validation errors
  errors: [
    { row: 3,  email: "bad-email", reason: "invalid_email_format" },
    { row: 17, email: null,       reason: "email_required" },
  ]
}

Réponse 400 (erreurs au niveau du fichier avant le traitement) :
  { error: "no_file_attached" | "invalid_file_type" | "file_too_large" }
  Taille maximale du fichier : 10MB
```

### Critères d'acceptation
- COMPTE TENU d'un CSV valide avec 100 lignes, QUAND importé, ALORS 200 est retourné avec imported: 100
- COMPTE TENU d'un CSV avec 1 email invalide, QUAND importé, ALORS la ligne est en errors[], tous les autres importés
- COMPTE TENU d'aucun fichier attaché, QUAND le point de terminaison est appelé, ALORS 400 avec no_file_attached
- COMPTE TENU d'un fichier .xlsx, QUAND téléchargé, ALORS 400 avec invalid_file_type
- COMPTE TENU de duplicate_strategy: "skip" et d'un email en doublon, QUAND importé, ALORS le doublon est dans le nombre ignoré
- COMPTE TENU de duplicate_strategy: "update" et d'un email en doublon, QUAND importé, ALORS le contact existant est mis à jour

### Questions ouvertes (résoudre avant de construire)
- [ ] Quel est le nombre maximum de lignes par fichier ? (proposé : 10 000 — besoin d'approbation PM)
- [ ] Quels champs sont obligatoires par rapport aux champs optionnels ? (proposé : email uniquement obligatoire)
- [ ] « Company » est-il une chaîne de texte libre ou liée à un enregistrement d'entreprise ?
- [ ] Qui peut appeler ce point de terminaison — tous les utilisateurs ou uniquement les administrateurs ?

---

Résolvez d'abord les questions ouvertes, puis je générerai les tests échouants.

---

# Flux de travail — Sprint de documentation

Un flux de travail étape par étape pour un sprint de documentation concentré — de l'audit du contenu à la rédaction, la révision et la publication — en utilisant les compétences Claude Code tout au long.

---

## Quand exécuter ce flux de travail

- Un nouveau produit ou une nouvelle fonctionnalité est livré et nécessite une documentation avant l'annonce
- Vous avez identifié une lacune documentaire à partir des analyses (taux de sortie élevés, recherches infructueuses, corrélation avec les tickets de support)
- Trimestriel : sprint d'amélioration de la documentation planifié pour réduire la charge de support
- Migration : passage d'un wiki à un site de documentation dédié

---

## Vue d'ensemble du sprint

Un sprint de documentation standard dure 1 semaine pour un périmètre concentré (5-10 pages) :

| Jour | Activité |
|---|---|
| Jour 1 | Audit du contenu et définition du périmètre |
| Jour 2 | Architecture et modèles |
| Jours 3-4 | Sprint de rédaction |
| Jour 5 | Révision, publication et mise en place du retour d'information |

Pour un périmètre plus large (20+ pages), exécutez ce sprint sur 2 semaines avec la même structure.

---

## Étape 1 — Audit du contenu (Jour 1, matin)

Avant de rédiger quoi que ce soit, évaluez l'état de ce qui existe.

**Invite d'audit :**
```
/doc-site-builder

Effectuez un audit du contenu de notre site de documentation.

Produit : [nom]
Inventaire documentaire actuel (collez les titres de page et les URLs ou descriptions) :
[listez toutes les pages existantes]

Évolutions du produit au cours des [90 derniers jours / 6 derniers mois] :
[collez les notes de version récentes, le journal des modifications, ou les annonces de fonctionnalités]

Données d'analyse (si disponibles) :
- Top 10 des pages par pages vues : [collez]
- Top 10 des requêtes de recherche sans résultats : [collez — c'est votre liste de lacunes de contenu]
- Pages avec le taux de sortie le plus élevé : [collez]

Classifiez chaque page existante par type Diátaxis : Tutoriel / Guide pratique / Référence / Explication.
Signalez les pages de type mixte (pages qui essaient d'être deux types à la fois — scindez-les).
Signalez les pages obsolètes (contenu qui a probablement changé avec les mises à jour récentes du produit).
Signalez le contenu manquant (sujets qui devraient exister en fonction du produit et des besoins des utilisateurs mais qui n'existent pas).

Résultat : liste de tâches de contenu priorisée pour ce sprint.
```

**Décision de périmètre :** À partir des résultats de l'audit, sélectionnez 5 à 10 pages à rédiger ou mettre à jour dans ce sprint. Soyez strict sur le périmètre — 5 pages excellentes valent mieux que 15 médiocres.

---

## Étape 2 — Périmètre du sprint et priorisation (Jour 1, après-midi)

**Priorisez la liste de tâches :**

| Priorité | Type de contenu | Quand rédiger en premier |
|---|---|---|
| P1 | Guide de démarrage / Quick Start manquant | Les utilisateurs échouent dès leur premier point de contact |
| P1 | Contenu de référence cassé ou obsolète | Des docs incorrectes sont pires qu'une absence de docs |
| P2 | Guides pratiques manquants pour les tâches courantes | Forte volumétrie de questions de support |
| P2 | Documentation de nouvelle fonctionnalité | Fonctionnalité livrée sans docs |
| P3 | Docs conceptuelles / d'explication | Les utilisateurs ont besoin d'un modèle mental, pas seulement d'instructions |
| P3 | Améliorations cosmétiques | Faible impact — ne sprintez pas là-dessus |

**Format de la liste de tâches du sprint :**

```markdown
## Sprint de documentation — [Date] — Liste de tâches

| Priorité | Page | Type | État actuel | Pourquoi maintenant |
|---|---|---|---|---|
| P1 | Guide de démarrage / Quick Start | Tutoriel | Manquant | Abandon dès le premier contact |
| P1 | Guide d'authentification | Guide pratique | Obsolète (migration v1 → v2 cassée) | Volume de tickets de support |
| P2 | Endpoint POST /v1/events | Référence | Incomplet (pas d'exemples) | Nouvel endpoint livré |
| P2 | Comment configurer les webhooks | Guide pratique | Manquant | Requête de recherche infructueuse principale |
| P3 | Qu'est-ce que [concept central] | Explication | Manquant | Les utilisateurs posent cette question au support |
```

---

## Étape 3 — Alignement sur l'architecture (Jour 2, matin)

Si ce sprint modifie la structure de navigation ou ajoute de nouvelles sections, alignez-vous sur l'architecture de l'information avant de rédiger.

```
/doc-site-builder

Proposez une structure de navigation mise à jour pour ces nouvelles pages.

Navigation existante : [collez la structure de navigation actuelle]
Nouvelles pages à ajouter : [liste tirée de la liste de tâches du sprint]

Contraintes :
- Profondeur maximale de navigation : 2 niveaux (ne créez pas de nouvelles sections de premier niveau sauf si nécessaire)
- Plateforme : [Docusaurus / MkDocs / Mintlify]
- Audience : [développeurs / utilisateurs finaux / administrateurs]

Recommandation : où placer chaque nouvelle page, s'il faut créer de nouvelles sections,
et si des pages existantes doivent être déplacées.

Incluez : une comparaison avant/après de la navigation.
```

---

## Étape 4 — Sélection des modèles (Jour 2, après-midi)

Utilisez le bon modèle pour chaque type de contenu Diátaxis. Tirez depuis `/doc-site-builder` ou utilisez ceux-ci :

**Tutoriel (Guide de démarrage) :**
- Ouverture : ce que vous allez construire / accomplir — l'état final, 1-2 phrases
- Prérequis : liste numérotée — soyez explicite sur les versions
- Étapes : numérotées, chacune produisant un résultat visible
- Vérifiez que ça a fonctionné : la commande ou la vérification qui confirme le succès à chaque étape
- Ce qui vient de se passer : 1-2 phrases expliquant ce que le tutoriel a accompli
- Étapes suivantes : 3 liens maximum — où aller à partir d'ici

**Guide pratique :**
- Titre : "Comment [accomplir la tâche]" — doit être actionnable
- Ouverture : 1 phrase — pour qui c'est et ce que ça accomplit
- Prérequis
- Étapes : voix impérative ("Exécutez la commande", pas "L'utilisateur doit exécuter")
- Dépannage : les 2-3 erreurs les plus susceptibles de se produire et leurs correctifs
- En rapport : 2-3 liens vers des guides pratiques et références connexes

**Page de référence :**
- Ce que c'est (1 phrase)
- Syntaxe / signature
- Tous les paramètres / options dans un tableau
- Exemple minimal fonctionnel
- Notes / cas limites
- Voir aussi

**Explication / Concept :**
- Ce que c'est et pourquoi ça existe
- Comment ça fonctionne (modèle mental, diagramme si utile)
- Quand l'utiliser vs. les alternatives
- Idées reçues courantes
- Référence connexe

---

## Étape 5 — Sprint de rédaction (Jours 3-4)

**Pour la documentation API :**
```
/api-doc-writer

Documentez cet endpoint API.

[collez le code du gestionnaire de route, l'extrait OpenAPI, ou la description de l'endpoint]

Résultat : documentation de référence complète avec :
- Tableau des paramètres de requête (chemin, requête, corps)
- Tableau des champs de réponse
- Tous les codes d'erreur avec explication
- Exemples de code en curl, Python, TypeScript
- Pièges et cas limites (si des cas sont connus)
```

**Pour le README ou le Guide de démarrage :**
```
/readme-generator

Rédigez un guide de démarrage pour [produit/bibliothèque].

Produit : [nom et description en 1 phrase]
Type d'utilisateur : [développeurs / utilisateurs non techniques]
Point de départ : [ce qu'ils ont au début]
État final : [ce qu'ils ont à la fin de ce guide — le moment de valeur]

Incluez : prérequis, installation, premier exemple fonctionnel, configuration courante,
et 3 liens vers les étapes suivantes.

Langage : [TypeScript / Python / tout — correspondez au SDK principal]
```

**Pour les runbooks opérationnels :**
```
/runbook-generator

Rédigez un runbook pour [processus ou type d'incident].

Processus / type d'incident : [décrivez]
Audience : ingénieur d'astreinte qui n'a peut-être jamais vu ça avant
Déclencheur : [quelle condition nécessite ce runbook]

Incluez :
- Symptômes et détection
- Étapes de diagnostic (ordonnées — commencez par la cause la plus probable)
- Étapes de remédiation (commandes exactes, avec la sortie attendue)
- Escalade : qui pager si ça ne se résout pas en X minutes
- Prévention : quoi vérifier pour éviter ça la prochaine fois
```

**Pour les journaux des modifications :**
```
/changelog-writer

Rédigez le journal des modifications pour [version / nom de release].

git log :
[collez git log --oneline pour cette release]

Audience : [développeurs / utilisateurs finaux]
Filtrez : les changements internes, les mises à jour de dépendances, les changements de tests uniquement.
Regroupez : Changements incompatibles → Nouveau → Améliorations → Correctifs.
Incluez : des liens vers la documentation de chaque nouvelle fonctionnalité si la documentation existe.
```

---

## Étape 6 — Revue technique (Jour 4, après-midi)

Chaque page de documentation technique doit être revue par un ingénieur avant publication. La revue permet de détecter :
- Les détails techniques incorrects (noms de paramètres erronés, syntaxe obsolète)
- Les étapes manquantes (quelque chose que le rédacteur supposait évident mais qui ne l'est pas)
- Les exemples de code qui ne s'exécutent pas (l'erreur de documentation la plus courante et la plus dommageable)

**Modèle de demande de revue :**

```markdown
Bonjour [nom de l'ingénieur],

J'ai rédigé la documentation pour [fonctionnalité/endpoint]. Pouvez-vous réviser pour l'exactitude technique ?

En particulier :
1. Tous les noms et types de paramètres sont-ils corrects ?
2. Les exemples de code fonctionnent-ils vraiment ? (Si vous pouvez les exécuter, faites-le — ils doivent produire la sortie documentée.)
3. Est-ce que je manque des cas d'erreur importants ou des cas limites ?
4. Le comportement décrit est-il exact pour la version actuelle ?

[Lien vers le brouillon ou collez le brouillon ici]

Date limite : [date]. Cela bloque la publication.
```

Objectif : délai de réponse de 24 heures de la part des ingénieurs. Si une page nécessite plus de 2 cycles de revue technique, planifiez un appel de 30 minutes à la place.

---

## Étape 7 — Revue de style (Jour 5, matin)

```
Révisez cette page de documentation pour le style et la clarté.

Page : [collez le contenu]

Vérifiez :
1. Le titre est-il actionnable / descriptif — correspond-il à ce qu'un utilisateur rechercherait ?
2. Commence-t-il par le bénéfice pour l'utilisateur, pas par la description du produit ?
3. Tous les exemples de code sont-ils exécutables (pas de valeurs fictives qui les casseraient) ?
4. Est-ce rédigé à la deuxième personne ("vous") — pas "l'utilisateur" ou voix passive ?
5. Les phrases font-elles en moyenne moins de 25 mots ?
6. Y a-t-il quelque chose qui pourrait être supprimé sans perdre de sens ?
7. Les messages d'erreur sont-ils expliqués avec cause + correctif ?

Résultat : modifications spécifiques au niveau de la ligne. Pas de retour général — des changements spécifiques uniquement.
```

---

## Étape 8 — Publication et mise en place du retour d'information (Jour 5, après-midi)

**Liste de contrôle pré-publication :**
- [ ] Revue technique approuvée par un ingénieur
- [ ] Tous les exemples de code testés et produisant la sortie documentée
- [ ] Tous les liens internes vérifiés (pas d'erreurs 404)
- [ ] Métadonnées frontmatter complètes : title, description, last_updated, tags
- [ ] La page apparaît correctement dans la navigation
- [ ] Index de recherche mis à jour (reconstruisez si vous utilisez Algolia, pagefind ou similaire)

**Instrumentation du retour d'information :**

Ajoutez un widget "Cette page vous a-t-elle été utile ?" à chaque nouvelle page. L'implémentation minimale :

```html
<!-- Minimal feedback widget — bottom of every page -->
<div class="feedback">
  <p>Was this page helpful?</p>
  <button onclick="sendFeedback('yes')">Yes</button>
  <button onclick="sendFeedback('no')">No</button>
</div>
```

Suivez : le taux positif par page. Objectif : > 70 % de positif. Les pages en dessous de 50 % nécessitent une investigation.

---

## Étape 9 — Rétrospective du sprint (Fin du Jour 5)

```
Révisez ce sprint de documentation et identifiez les améliorations pour la prochaine fois.

Pages rédigées : [liste]
Pages non terminées : [liste avec raison]
Cycles de revue par page : [moyenne]
Points bloquants : [liste — ex. "attendu 2 jours pour la spec API", "pas d'environnement de staging pour vérifier les exemples"]
Temps par type de page : [Tutoriel : Xh, Guide pratique : Xh, Référence : Xh]

Questions auxquelles répondre :
1. Quelles pages ont pris plus de temps que prévu — pourquoi ?
2. Quels goulots d'étranglement de revue peuvent être éliminés par des changements de processus ?
3. Quel contenu aurait dû être dans le périmètre mais ne l'était pas ?
4. Quel est le prochain sprint à plus fort impact ?
```

---

## Règles de délimitation temporelle

- Audit du contenu : 3 heures maximum. Utilisez les données d'analyse pour prioriser — ne passez pas en revue chaque page.
- Rédaction par page (avec Claude Code) : Tutoriel : 90 min | Guide pratique : 45 min | Référence : 60 min | Explication : 60 min
- Revue technique : SLA de 24 heures de la part des ingénieurs. Si ça glisse, escaladez ou planifiez un appel de synchronisation.
- Test des exemples de code : non négociable. Chaque exemple de code doit être exécuté avant publication.
- Périmètre du sprint : 5-10 pages par semaine. Tout ce qui dépasse signifie que le périmètre est trop large.

---

## Configuration de l'IC pour docs-as-code

Ajoutez ceci à votre dépôt pour imposer la qualité à chaque PR :

```yaml
# .github/workflows/docs-quality.yml
name: Docs Quality

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v14
        
      - name: Spell check
        uses: streetsidesoftware/cspell-action@v6
        
      - name: Check broken links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './docs/**/*.md'
          
      - name: Check frontmatter
        run: |
          # Verify all .md files have required frontmatter: title, description, last_updated
          python scripts/check_frontmatter.py docs/
```

Cela impose la cohérence sans nécessiter une revue du guide de style pour chaque PR.

---

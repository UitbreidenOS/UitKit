# Ultrareview — Revue de Code Adversariale Basée sur Flotte

Ultrareview est le système de revue multi-agents de Claude Code, lancé en aperçu public en avril 2026. Il remplace le modèle de revue par un seul critique de `/code-review` par une flotte coordonnée de sous-agents spécialisés qui examinent le même diff de manière indépendante, se vérifient mutuellement et produisent un rapport synthétisé vérifié pour les faux positifs. Les propriétés clés : adversariale (les agents essaient activement de trouver des failles dans les conclusions les uns des autres), parallèle (les agents s'exécutent simultanément, pas en séquence) et à profondeur évolutive (la taille de la flotte et le niveau d'effort s'adaptent à la taille et à la complexité du diff).

---

## Fonctionnement

### L'architecture de la flotte

Ultrareview génère une flotte de sous-agents critiques, chacun avec un rôle distinct et une lecture différente du même diff. La composition de la flotte varie selon les caractéristiques du diff, mais une exécution typique sur une RP de taille moyenne inclut :

| Agent | Focus |
|---|---|
| **Critique de Sécurité** | OWASP top 10, injection, contournement d'authentification, exposition de données, secrets dans les diffs |
| **Critique de Correction** | Erreurs logiques, cas limites, conditions de course, hors de un, nuls |
| **Critique de Performance** | Requêtes N+1, I/O bloquant, complexité algorithmique, modèles d'allocation mémoire |
| **Critique d'Architecture** | Cohérence de la conception, couplage, respect des motifs, contrats d'interface |
| **Critique de Couverture de Tests** | Ce qui est couvert, ce qui ne l'est pas, si les tests testent réellement le comportement |
| **Vérificateur Adversarial** | Examine les conclusions de tous les autres agents — signale les faux positifs, remonte les problèmes manqués |

Le Vérificateur Adversarial est la pièce distinctif. Il reçoit toutes les conclusions des agents spécialistes et son travail explicite est de les contester : déterminer si chaque conclusion est réelle, un faux positif, ou une préoccupation valide que l'agent d'origine a sous-estimée. Cette vérification du second passage réduit substantiellement le bruit dans la sortie finale.

### Ce qui s'exécute en parallèle par rapport à séquentiellement

Phase 1 (parallèle) : Tous les agents spécialistes examinent le diff simultanément. Chacun lit la même entrée — le diff, les fichiers de contexte pertinents, et toutes les instructions que vous avez fournies — mais applique sa propre approche.

Phase 2 (séquentielle) : Le Vérificateur Adversarial reçoit toutes les conclusions de la Phase 1 et produit la synthèse. C'est intentionnellement séquentiel — le vérificateur a besoin de la vue complète.

Phase 3 : Le rapport synthétisé est assemblé, dédupliqué et retourné à vous.

Le temps d'horloge de bout en bout est typiquement de 90–180 secondes pour une RP de taille moyenne, selon la taille du diff et le nombre de fichiers de contexte lus. Le parallélisme signifie que c'est plus rapide qu'exécuter la même profondeur de revue séquentiellement, malgré l'utilisation de plus de jetons au total.

### Résolution du contexte

Avant de remettre à la flotte, Ultrareview résout le contexte de revue. Il lit :

- Le diff lui-même (lignes modifiées uniquement sauf si `--full-files` est défini)
- Les fichiers adjacents aux fichiers modifiés (pour comprendre les motifs environnants)
- Les fichiers de test qui couvrent le code modifié
- La configuration pertinente (linters, tsconfig, pyproject.toml) pour comprendre quelle analyse statique couvre déjà
- `CLAUDE.md` s'il est présent — pour appliquer les règles de revue spécifiques au dépôt à la flotte

Cette résolution du contexte se produit avant que la flotte soit générée, donc chaque agent reçoit un paquet pré-assemblé, pas un accès brut au dépôt.

---

## Invocation

### Invocation principale

```
/ultrareview
```

Aucun argument nécessaire pour le cas par défaut — Ultrareview récupère le diff courant (modifications en attente et non en attente) et le diff de branche par rapport à la branche distante par défaut.

### Avec une RP spécifique

```
/ultrareview 847
```

Passez un numéro de RP GitHub. Ultrareview récupère le diff de la RP via l'MCP GitHub ou le CLI `gh`. C'est l'invocation la plus courante en pratique — vous la pointez vers une RP, elle l'examine.

### Avec une zone de focus

```
/ultrareview --focus security
/ultrareview --focus performance
/ultrareview --focus correctness
```

Les indices de focus biaisent la composition de la flotte. `--focus security` étend l'effort du critique de sécurité et réduit celui du critique d'architecture. Le Vérificateur Adversarial s'exécute toujours à plein effort quel que soit le focus.

### Avec un niveau d'effort

```
/ultrareview --effort high
/ultrareview --effort max
```

L'effort met à l'échelle la profondeur de chaque agent individuel, pas le nombre d'agents. À `--effort max`, chaque agent utilise la réflexion étendue et lit un ensemble plus large de fichiers de contexte. Le coût augmente considérablement — utilisez `max` uniquement pour les changements critiques en sécurité ou définissant l'architecture.

### Avec contexte fichier complet

```
/ultrareview --full-files
```

Par défaut, les agents voient uniquement les lignes modifiées plus le contexte environnant. `--full-files` donne aux agents le contenu complet de chaque fichier modifié. Utilisez ceci quand le diff est petit mais le comportement dépend fortement de la structure complète du fichier (par exemple, une classe où un changement de méthode affecte les invariants partout).

### Invocation depuis le CLI

```bash
claude --ultrareview 847
claude --ultrareview --focus security --effort high
```

L'invocation CLI est équivalente à la commande slash. Utile pour écrire Ultrareview dans les pipelines CI ou les hooks de pré-fusion.

---

## Tarification

Ultrareview est tarifée par exécution, pas par jeton. Le coût en jetons est toujours engagé (et reflété dans votre facturation de siège ou votre utilisation API), mais le coût par exécution couvre l'infrastructure d'orchestration de la flotte.

### Niveaux de tarification (en avril 2026, aperçu public)

| Niveau | Coût | Notes |
|---|---|---|
| Premières 3 exécutions | Gratuit | Par compte, réinitialisé jamais — allocation d'aperçu ponctuelle |
| Exécution standard | 5 $ | Effort par défaut, diffs jusqu'à ~500 lignes modifiées |
| Exécution large | 10 $ | Diffs 500–2000 lignes modifiées, ou `--effort high` |
| Exécution max | 20 $ | `--effort max`, ou diffs plus de 2000 lignes modifiées |

L'exécution est tarifée au niveau qui correspond à votre invocation *avant* que vous confirmiez. Vous verrez un message de confirmation de coût avant que la flotte soit générée :

```
Ultrareview: Exécution large — estimée 10 $
Diff: 847 lignes modifiées sur 23 fichiers
Flotte: 6 agents + vérificateur adversarial
Continuer ? [o/N]
```

Tapez `o` pour continuer. Si vous refusez, aucun frais n'est engagé.

### Utilité des exécutions gratuites

Utilisez vos trois exécutions gratuites sur vos changements les plus complexes ou sensibles en sécurité récents. Ne les gaspillez pas sur de petites RP — `/code-review` couvre celles-ci bien à coût supplémentaire zéro. Réservez les exécutions gratuites pour :

- Changements du système d'authentification
- RP de migration de base de données
- Code de facturation / paiement
- Première grande feature sur une base de code non familière
- RP que d'autres critiques ont signalées avec des préoccupations mais sans détails

### Coût par rapport au temps d'ingénierie

L'examen d'un ingénieur de niveau intermédiaire coûte 75–150 $ par heure entièrement chargé. Une exécution Ultrareview de 10 $ qui détecte un bug bloquant avant qu'il n'atteigne la production est un retour 10x sur un incident unique. Le calcul change sur les petites RP où `/code-review` est suffisant — ne dépensez pas 5 $ pour examiner un changement de configuration d'une ligne.

---

## `/ultrareview` par rapport à `/code-review`

Comprendre quand utiliser chacun est la décision pratique la plus importante.

| Dimension | `/code-review` | `/ultrareview` |
|---|---|---|
| **Agents** | Critique unique | Flotte de 5–7 spécialistes |
| **Coût** | 0 $ (coût en jetons uniquement) | 5–20 $ par exécution |
| **Temps** | 15–30 secondes | 90–180 secondes |
| **Taux de faux positifs** | Modéré | Faible (vérification adversariale) |
| **Profondeur de sécurité** | Bonne | Approfondie — agent dédié + vérificateur |
| **Analyse inter-fichiers** | Limitée | Complète — les agents peuvent lire les fichiers adjacents |
| **Meilleur pour** | Revue quotidienne, petites RP | RP enjeux élevés, revue de sécurité, changements complexes |
| **Niveaux d'effort** | `low` / `medium` / `high` / `max` | `default` / `high` / `max` |
| **Intégration GitHub RP** | Collage diff manuel | Natif via numéro de RP |

**Utilisez `/code-review` quand :**
- La RP est petite et bien délimitée (< 200 lignes modifiées)
- Vous avez déjà fait une auto-revue et voulez une deuxième passe rapide
- Vous examinez du code d'application non critique dans un délai serré
- Vous voulez itérer rapidement à travers une feature avec des revues fréquentes

**Utilisez `/ultrareview` quand :**
- Le changement est sensible en sécurité (authentification, paiements, accès aux données, secrets)
- La RP est grande et touche plusieurs sous-systèmes
- Vous êtes sur le point de fusionner dans main sur un système de production
- Un autre critique a signalé quelque chose mais n'a pas pu l'articuler précisément
- Vous voulez un enregistrement écrit d'une revue approfondie (la sortie d'Ultrareview a une qualité d'artefact)
- La base de code vous est non familière et vous ne faites pas confiance à la profondeur de votre propre revue

Il n'y a aucune honte à exécuter `/code-review` en premier et à améliorer vers `/ultrareview` quand il met au jour quelque chose d'ambigu. Le coût d'une `code-review` est proche de zéro, utilisez-la librement ; utilisez Ultrareview délibérément.

---

## Lecture de la sortie

Ultrareview produit un rapport structuré. Comprendre le format vous permet de trier plus rapidement.

### Structure du rapport

```
## Rapport Ultrareview
RP #847 · 23 fichiers · 847 lignes modifiées
Flotte: Sécurité, Correction, Performance, Architecture, Tests, Vérificateur Adversarial
Exécution: 142 secondes

---

### Conclusions critiques (doivent être corrigées avant fusion)

🔴 [SÉCURITÉ] Injection SQL dans le point de terminaison de recherche d'utilisateur
Agent: Critique de Sécurité · Vérifié: Vérificateur Adversarial ✓
Fichier: api/search.py:34
...

---

### Conclusions importantes (devraient être corrigées avant fusion)

🟠 [CORRECTION] Condition de course dans le traitement des paiements simultanés
Agent: Critique de Correction · Vérifié: Vérificateur Adversarial ✓
Fichier: billing/processor.py:112
...

---

### Suggestions (vaut la peine d'être discuté)

🟡 [ARCHITECTURE] Le gestionnaire de paiement viole la responsabilité unique
Agent: Critique d'Architecture · Contesté: Vérificateur Adversarial — confiance faible
...

---

### Conclusions rejetées

ℹ️ 3 conclusions des agents spécialistes ont été rejetées par le Vérificateur Adversarial comme faux positifs. Voir l'annexe.

---

### Résumé
Critique: 1 · Important: 3 · Suggestions: 5 · Rejeté: 3
Recommandation: Demander des changements — la conclusion critique doit être résolue.
```

### L'insigne de vérification

Chaque conclusion porte un statut de vérification du Vérificateur Adversarial :

- **Vérifié ✓** — le Vérificateur Adversarial a confirmé que la conclusion est réelle et correctement décrite
- **Escaladé ↑** — le Vérificateur Adversarial a trouvé que la conclusion a sous-estimé ; la gravité peut être augmentée
- **Contesté —** — le Vérificateur Adversarial est en désaccord ; la conclusion est incluse mais signalée comme incertaine
- **Rejeté ✗** — le Vérificateur Adversarial a conclu que la conclusion est un faux positif ; déplacé à l'annexe

Ne sautez pas les conclusions Contestées. Elles sont incluses parce que le Vérificateur Adversarial ne pouvait pas les rejeter avec confiance — ce qui signifie qu'elles valent l'attention d'un œil humain même si l'agent d'origine a surestimé le risque.

### L'annexe des conclusions rejetées

Lisez toujours l'annexe des conclusions rejetées, surtout sur les RP sensibles en sécurité. Le Vérificateur Adversarial est bon mais pas infaillible. Une conclusion de sécurité rejetée qui s'avère réelle est pire qu'un faux positif que vous avez brièvement considéré et rejeté.

Le format de l'annexe :

```
### Annexe: Conclusions rejetées

[Critique de Sécurité] SSRF potentiel via URL fournie par l'utilisateur
Rejeté: L'URL est validée par rapport à une liste d'autorisation à la ligne 12 ; la conclusion suppose
qu'aucune validation n'existe. Confirmée sûre par le Vérificateur Adversarial.

[Critique de Performance] Tri O(n²) dans la liste des utilisateurs
Rejeté: La taille d'entrée est plafonnée à 50 par la limite de pagination à la ligne 8.
La complexité réelle est O(50 log 50) = effectivement constante.
```

Ces rejets sont explicatifs, pas juste oui/non. Si le raisonnement semble faux, faites confiance à votre jugement sur le Vérificateur Adversarial.

### Attribution d'agent

Chaque conclusion nomme l'agent qui l'a soulevée. Cela importe pour deux raisons :

1. **Étalonnage** : Certains agents sont plus conservateurs que d'autres. Si vous avez vu le Critique de Performance signaler des faux positifs sur votre base de code avant, appliquez ce a priori.
2. **Poser des questions de suivi** : Vous pouvez référencer la conclusion et demander à Claude de creuser plus — "Développer sur la conclusion de condition de course à billing/processor.py:112" — et elle reprendra là où le Critique de Correction s'est arrêté.

---

## Conseils pratiques

### Conseil 1: Examiner les conclusions rejetées avant d'approuver

L'habitude la plus actionnelle : avant de cliquer sur approuver, passez 60 secondes à lire l'annexe des conclusions rejetées. Vous cherchez tout cas où le raisonnement du Vérificateur Adversarial suppose quelque chose qui n'est pas vrai de votre base de code spécifique. Cela arrive.

### Conseil 2: Utilisez `--focus security` sur toute RP qui touche l'authentification ou les paiements

Même si vous êtes confiant dans le changement, la composition de la flotte axée sur la sécurité détecte les choses que les revues plus larges manquent. L'agent de sécurité dédié lit l'ensemble du flux d'authentification, pas seulement le diff — il comprend si un changement à une fonction middleware affecte tous les routes authentifiés ou seulement celui adjacent.

```bash
claude --ultrareview 312 --focus security
```

### Conseil 3: Ne faites pas ultrareview sur chaque RP — définir un seuil

Les équipes qui obtiennent le plus de valeur d'Ultrareview définissent un seuil : toute RP dépassant X lignes modifiées, ou toute RP touchant Y répertoires, passe automatiquement par Ultrareview. En dessous de ce seuil, `/code-review` s'exécute. Exemple de seuil :

```
Ultrareview si :
  - diff > 300 lignes modifiées, OU
  - tout fichier dans auth/, billing/, api/admin/ touché, OU
  - migration de schéma incluse
```

Documentez ceci dans votre `CLAUDE.md` pour que Claude Code l'applique automatiquement pendant la revue.

### Conseil 4: Exécutez ultrareview sur vos propres RP avant de demander une revue humaine

Un flux de travail courant : écrire le code, exécuter `/code-review` pour une itération rapide, corriger les problèmes évidents, puis exécuter `/ultrareview` avant de demander une revue humaine. Le critique humain voit alors une RP qui a déjà traversé une analyse adversariale — sa revue peut se concentrer sur les décisions de conception et le contexte plutôt que sur la détection des bugs évidents.

### Conseil 5: Canaliser la sortie vers un fichier pour revue asynchrone

Ultrareview s'exécute pendant 90–180 secondes. Vous n'avez pas besoin de la regarder :

```bash
claude --ultrareview 847 > ultrareview-847.md
```

Ouvrez ensuite le fichier quand vous êtes prêt. Le rapport est autonome et ne nécessite pas de suivi interactif sauf si vous voulez creuser davantage.

### Conseil 6: Utilisez `--full-files` pour les réécritures de classe ou module

Quand une RP restructure une classe mais que le diff ne montre que les méthodes modifiées, les agents peuvent manquer les invariants que les méthodes non modifiées supposent. `--full-files` donne à la flotte la vue complète :

```bash
claude --ultrareview 512 --full-files --focus correctness
```

Coûte plus cher (plus de jetons par agent), mais sur une refactorisatione au niveau de la classe, cela en vaut la peine.

### Conseil 7: Examinez la RP, pas le commit

Pointez Ultrareview vers le diff de RP complet, pas un commit unique. Les revues de commit unique manquent l'effet cumulatif de plusieurs commits — un correctif de sécurité au commit 2 qui est partiellement annulé au commit 4, par exemple. Le diff de niveau RP est toujours la bonne portée.

### Conseil 8: Si le Vérificateur Adversarial escalade une conclusion, traitez-la comme critique

Les escalades (↑) se produisent quand le Vérificateur Adversarial pense qu'un agent d'origine a sous-estimé une conclusion. Ceux-ci sont rares — moins de 5% des conclusions — mais ce sont les cas les plus susceptibles d'être véritablement graves. Une conclusion escaladée signifie que deux agents indépendamment ont convenu que le risque est plus élevé que ce qui a été initialement signalé. Traitez les escalades avec la même urgence qu'un 🔴 Critique, indépendamment de la gravité que l'agent d'origine a assignée.

---

## Pièges connus

### Limites de fenêtre de contexte sur les très grandes RP

Les RP dépassant ~5000 lignes modifiées peuvent dépasser le contexte que les agents peuvent lire de manière cohérente. Ultrareview vous avertira avant exécution si le diff approche cette limite. Options : diviser la RP, utiliser `--focus` pour réduire la portée de l'agent, ou accepter qu'une certaine analyse inter-fichiers sera incomplète.

### Le désaccord entre agents n'est pas un bug

Occasionnellement, le Critique de Correction et le Critique d'Architecture auront des recommandations contradictoires — le correctif de correction implique un motif que l'agent d'architecture signale comme inconsistant avec la base de code. C'est attendu. Le Vérificateur Adversarial note la contradiction mais ne la résout pas toujours — c'est un jugement d'appel pour vous. Cherchez la contradiction explicitement dans les conclusions qui sont Contestées.

### Le niveau gratuit ne continue pas

Vos trois exécutions Ultrareview gratuites sont allouées à la création du compte et ne se réinitialisent pas. Si vous êtes en équipe, chaque membre de l'équipe reçoit sa propre allocation — elles ne se regroupent pas. Un développeur solo reçoit trois exécutions gratuites ; une équipe de 10 reçoit 30 (10 × 3).

### `--effort max` sur une grande RP est coûteux

Une exécution à effort max sur une RP de 2000 lignes peut coûter 20 $ et prendre 4–6 minutes. Le message de confirmation de coût vous montrera ceci avant que vous vous engagiez. N'utilisez pas `--effort max` pour une revue de routine — réservez-le au code qui touchera les limites de sécurité de production.

### Ultrareview ne remplace pas la revue humaine pour les décisions architecturales

L'agent Critique d'Architecture est fort sur l'analyse de la cohérence des motifs et du couplage, mais il ne connaît pas la stratégie de produit de votre équipe, votre tolérance à la dette technique, ou les contraintes sur votre modèle de déploiement. Utilisez les conclusions Ultrareview comme entrées pour la revue humaine d'architecture, pas comme remplacement pour cela.

### Le rapport est scopé au diff, pas au système

Ultrareview examine le diff en contexte mais elle ne peut pas savoir les bugs dans les systèmes adjacents avec lesquels votre changement interagira. Un changement qui est correct en isolation mais casse une hypothèse dans un service externe ne sera pas détecté. C'est une préoccupation au niveau du système qui nécessite une connaissance de domaine humaine.

---

## Exemple de flux de travail de bout en bout

**Scénario :** Vous avez écrit un gestionnaire de webhook de paiement pour Stripe. La RP est 340 lignes modifiées sur 8 fichiers. Avant de demander une revue, vous exécutez Ultrareview.

```bash
# Créer d'abord la RP pour avoir un numéro de RP
gh pr create --title "Add Stripe webhook handler" --draft

# Obtenir le numéro de RP
gh pr list --state open | head -5
# Sortie: 923  Add Stripe webhook handler  feat/stripe-webhooks

# Exécuter ultrareview avec focus sécurité
claude --ultrareview 923 --focus security
```

Message de sortie:
```
Ultrareview: Exécution large — estimée 10 $
Diff: 340 lignes modifiées sur 8 fichiers
Flotte: Sécurité (étendue), Correction, Performance, Architecture, Tests, Vérificateur Adversarial
Focus: Sécurité
Continuer ? [o/N]
```

Vous tapez `o`. 147 secondes plus tard :

```
## Rapport Ultrareview — RP #923
...

### Conclusions critiques

🔴 [SÉCURITÉ] Signature du webhook non vérifiée avant traitement de la charge utile
Agent: Critique de Sécurité · Vérifié: Vérificateur Adversarial ✓
Fichier: webhooks/stripe.py:18
Problème: Le gestionnaire traite la charge utile de l'événement sans d'abord vérifier l'en-tête
Stripe-Signature. Tout appelant peut envoyer des événements webhook faux.
Correctif :
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
  )
  # Lève stripe.error.SignatureVerificationError si invalide

🔴 [SÉCURITÉ] Attaque par relecture possible — pas de validation d'horodatage
Agent: Critique de Sécurité · Escaladé: Vérificateur Adversarial ↑
Fichier: webhooks/stripe.py:18
Problème: Même avec vérification de signature ajoutée, l'horodatage dans l'en-tête Stripe-Signature
doit être validé pour prévenir les demandes relues. Stripe recommande de rejeter
les événements antérieurs à 300 secondes.
Correctif :
  # stripe.Webhook.construct_event valide l'horodatage si vous passez le paramètre de tolérance
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET,
      tolerance=300
  )
```

Deux conclusions critiques détectées avant revue humaine. Vous corrigez les deux, poussez, marquez la RP prête pour revue, et notez dans la description de la RP qu'Ultrareview a été exécuté et les conclusions traitées. Votre critique passe son temps sur la logique métier, pas les fondamentaux de sécurité.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

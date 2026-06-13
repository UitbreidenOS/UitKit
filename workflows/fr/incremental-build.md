# Construire de manière incrémentale avec des portes de confirmation

Construit une fonctionnalité étape par étape avec une révision humaine obligatoire entre chaque phase. Claude s'engage sur les limites de phase avant de commencer et ne peut pas élargir la portée en milieu de phase. Prévient le glissement de portée, détecte les problèmes d'intégration tôt et garde les humains en contrôle de la direction de la construction.

---

## Quand l'utiliser

- Construire une fonctionnalité qui touche plus de trois fichiers ou deux sous-systèmes
- Fonctionnalités à enjeux élevés où l'achèvement partiel est pire que pas d'achèvement (authentification, facturation, migrations)
- Constructions collaboratives où une partie prenante non-ingénieur doit examiner chaque incrément
- Toute tâche où vous avez précédemment regardé Claude construire quelque chose de correct mais pas ce que vous vouliez

---

## Phases

### Phase 0 — Définition de phase (étape première obligatoire)

Avant que tout code ne soit écrit, Claude définit le plan de phase complète. C'est le contrat.

```
Je veux construire : [décrivez la fonctionnalité]

Avant d'écrire tout code, produisez un plan de phase.

Pour chaque phase :
  - Nom de phase (par exemple, "Phase 1 : Modèle de données")
  - Portée : exactement ce qui sera créé ou modifié (noms de fichiers, pas de descriptions)
  - Résultat : ce que l'utilisateur verra ou sera capable de vérifier à la fin de cette phase
  - Critères de succès : comment nous savons que cette phase est correctement terminée (commande de test, vérification manuelle, etc.)
  - Plan de restauration : comment annuler cette phase si nous la rejetons (déposer la table, supprimer les fichiers, revenir le commit)
  - Limite de portée explicite : ce qui n'est PAS inclus dans cette phase

Règles pour le plan de phase :
  - Aucune phase ne devrait toucher plus de 5 fichiers
  - Chaque phase doit être révision indépendante sans nécessiter la phase suivante
  - Les limites de phase doivent être à des coutures naturelles (modèle de données, API, UI — pas "la moitié de l'API")
  - Aucune phase ne peut contenir "et aussi" — si vous êtes tenté d'ajouter de la portée, créez une nouvelle phase

Présentez le plan de phase. Ne commencez pas à coder jusqu'à ce que je l'approuve.
```

L'utilisateur révise et approuve, rejette ou restructure le plan de phase avant que tout travail ne commence. C'est la seule fois pour reformer la portée.

---

### Phase 1–N — Modèle d'exécution

Chaque phase suit la même structure. Remplacez `[N]` et `[nom de phase]` en conséquence.

**Début de phase :**
```
Commencer la Phase [N] : [nom de phase].

Rappel de portée : [collez la portée du plan approuvé]
Limite de portée : [collez ce qui n'est PAS inclus]

Mettez en œuvre uniquement ce qui est dans la portée. Si vous rencontrez quelque chose qui semble nécessaire mais est hors de portée, ARRÊTEZ et dites-moi — ne l'ajoutez pas unilatéralement. Je déciderai si j'élargis cette phase ou j'ajoute une Phase [N+1].
```

**Pendant la phase :**
- Claude écrit du code et exécute les tests uniquement pour la portée de cette phase
- Si Claude découvre une dépendance de portée (Phase 2 nécessite une chose de Phase 3), il s'arrête et l'indique plutôt que de sauter en avant
- Aucun commit jusqu'à ce que l'utilisateur examine

**Invite de fin de phase :**
```
La Phase [N] est terminée. Avant que je la révise :

1. Listez tous les fichiers que vous avez créés ou modifiés
2. Montrez le résultat que je dois vérifier (résultats de test, réponse du serveur, demande de capture d'écran UI, etc.)
3. Confirmez les critères de succès du plan : [collez les critères]
4. Signalez toute déviation de la portée approuvée (même petites)

Ne commencez pas la Phase [N+1] jusqu'à ce que je dis explicitement "procéder".
```

**Décision de porte :**

| Décision | Action |
|---|---|
| "Procéder" | Claude commence la Phase N+1 en utilisant le même modèle d'exécution |
| "Refaire la phase [N]" | Claude revient à l'état avant le début de la Phase N (en utilisant le plan de restauration) et réessaie |
| "Modifier la portée" | Pause — l'utilisateur et Claude renégocient la portée de la Phase N+1 avant de procéder |
| "Arrêter ici" | Le flux de travail se termine ; Claude documente ce qui est complété et ce qui reste |

---

### Phase finale — Vérification d'intégration

Après que toutes les phases soient approuvées individuellement, exécutez une vérification d'intégration.

```
Toutes les phases sont terminées. Exécutez la vérification d'intégration :

1. Exécutez la suite de tests complète (pas seulement les nouveaux tests)
2. Listez toute défaillance de test, avertissement ou erreur de type introduits par cette construction
3. Vérifiez que les plans de restauration pour chaque phase sont toujours valides (n'ont pas été invalidés par les phases ultérieures)
4. Produisez un résumé d'un paragraphe de ce qui a été construit et ce que l'utilisateur peut maintenant faire

Ne corrigez pas les défaillances d'intégration unilatéralement — rapportez-les et attendez les instructions.
```

---

## Règles anti-glissement de portée

Ces règles s'appliquent à Claude tout au long du flux de travail. Collez-les dans CLAUDE.md si vous voulez les appliquer au niveau du projet :

```
Pendant les constructions incrémentales :
- N'ajoutez jamais du code en dehors de la portée de la phase actuelle, même s'il semble clairement nécessaire
- N'effectuez jamais "tandis que je suis dans ce fichier" de changements supplémentaires
- Ne créez jamais de fichiers non listés dans le plan de phase approuvé
- Si quelque chose manque du plan mais est nécessaire, ARRÊTEZ et rapportez — ne l'ajoutez pas silencieusement
- Les commits se produisent aux limites de phase, pas en milieu de phase
```

---

## Exemple

Fonctionnalité : "Ajouter une notification par email quand une commande est expédiée"

Plan de phase (résultat de la Phase 0) :
- **Phase 1 : Modèle d'email** — Créer `emails/order-shipped.html` et `emails/order-shipped.txt`. Succès : le modèle s'affiche avec les données de test. Restauration : supprimez les deux fichiers.
- **Phase 2 : Intégration du service d'email** — Ajouter `sendOrderShippedEmail(orderId)` à `services/email.ts`. Pas d'UI, pas de déclencheurs. Succès : `npm run test:email` passe. Restauration : revenez `services/email.ts`.
- **Phase 3 : Déclencher à l'expédition** — Connectez l'appel de service dans `handlers/shipment.ts` quand le statut change en `shipped`. Succès : le test de bout en bout passe. Restauration : revenez `handlers/shipment.ts`.

L'utilisateur approuve le plan. Claude exécute la Phase 1. L'utilisateur révise le modèle, dit "procéder". Claude exécute la Phase 2. Au cours de la Phase 2, Claude remarque que le service d'email a besoin d'une clé d'API qui n'est pas dans la configuration — il s'arrête et l'indique plutôt que d'ajouter la clé de configuration unilatéralement. L'utilisateur ajoute la clé, dit "procéder". La Phase 3 se termine. La vérification d'intégration passe.

---

# Aperçu de Claude Mythos

Un guide pour l'initiative Claude Mythos d'Anthropic — un programme de recherche en accès anticipé explorant les capacités au-delà des déploiements Claude standard. Écrit pour les utilisateurs avancés de Claude Code, les chercheurs en IA et les développeurs travaillant à la frontière de ce que les systèmes agentiques peuvent faire.

---

## Qu'est-ce que Claude Mythos

Claude Mythos est un programme de recherche en accès anticipé d'Anthropic Labs, annoncé début 2026, axé sur l'exploration des capacités de Claude en dehors des limites du produit standard, généralement disponible. Ce n'est pas une version produit — c'est un programme d'accès structuré pour tester et valider les capacités qui ne sont pas encore prêtes pour la disponibilité générale.

L'initiative cible trois clusters de capacités :

**Chaînes de raisonnement étendues.** Les modèles Claude standard opèrent dans un budget de réflexion fixe. Les variantes Mythos peuvent soutenir des chaînes de raisonnement significativement plus longues que le plafond de tokens standard, permettant une décomposition plus profonde des problèmes qui nécessitent de nombreuses étapes de raisonnement avant d'atteindre une conclusion exploitable. Ce n'est pas simplement une fenêtre de contexte plus grande — l'architecture de raisonnement elle-même est configurée pour permettre plus d'affinement itératif avant de s'engager sur une sortie.

**Utilisation d'outils multi-tour à long horizon.** Les sessions Claude Code standard peuvent accomplir des tâches complexes multi-étapes, mais la pression du contexte et les limites de profondeur des appels d'outils imposent des plafonds pratiques. Mythos est conçu pour maintenir l'état cohérent des tâches à travers 100+ appels d'outils, maintenant la fidélité des objectifs à travers une longue séquence d'actions sans la dégradation courante dans les sessions agentiques étendues.

**Test des capacités de novel avant la sortie générale.** Mythos sert de surface contrôlée pour qu'Anthropic évalue les capacités — y compris le raisonnement multi-modal, les modèles d'interaction d'outils novel et les primitives de coordination d'agents — avant que ces capacités ne soient promues aux modèles de production. Les comportements observés dans Mythos peuvent changer, être supprimés ou apparaître sous une forme différente dans les versions GA ultérieures.

L'accès est sélectif. Les abonnés Pro, Max, Team et Enterprise peuvent demander un accès anticipé via le programme Anthropic Labs. L'accès est accordé sur la base du flux continue, en donnant la priorité aux chercheurs, aux utilisateurs puissants à usage élevé et aux cas d'usage qui génèrent un signal utile pour le travail d'évaluation d'Anthropic.

---

## Comment cela diffère de Claude standard

| Fonctionnalité | Claude (standard) | Claude Mythos |
|---|---|---|
| Budget de réflexion | Jusqu'à ~32K tokens | Étendu — limite de recherche, non publiée |
| Longueur maximale de la session | Fenêtre de contexte standard | Fenêtre de contexte étendue |
| Profondeur des appels d'outils | Limites standard | Utilisation d'outils récursifs plus profonde supportée |
| Disponibilité | Généralement disponible | Aperçu Labs — accès sélectif |
| Identifiant du modèle | claude-sonnet-4-6, claude-opus-4-6 | Variante de recherche — voir le tableau de bord Labs |
| SLA | Oui (pour les niveaux API et Enterprise) | Aucun — les modèles d'aperçu ne portent aucun SLA |
| Latence | Standard | Plus élevée en raison des passages de réflexion étendus |
| Prêt pour la production | Oui | Non — non adapté aux charges de travail de production |

L'identifiant du modèle pour les variantes Mythos n'est pas publié dans la documentation API standard. Si vous avez accès, l'ID de modèle correct apparaîtra dans le tableau de bord Anthropic Labs. Ne pas coder en dur une chaîne de modèle supposée — récupérez-la à partir du tableau de bord et traitez-la comme susceptible de changer entre les mises à jour d'aperçu.

---

## Accéder à Mythos

L'accès n'est pas automatique, même pour les abonnés payants. Le processus :

1. Accédez à `claude.ai/labs` et postulez pour l'aperçu Mythos.
2. Un abonnement Pro, Max (5x ou 20x), Team ou Enterprise actif est requis. Les comptes de niveau gratuit ne sont pas éligibles.
3. Les candidatures sont examinées sur la base du flux continue. Il n'y a pas de SLA publié pour quand l'accès est accordé. La priorité est accordée aux cas d'usage ayant une valeur de recherche claire.
4. Une fois approuvé, l'accès API est fourni via un ID de modèle d'aperçu distinct visible dans le tableau de bord Labs. Cet ID de modèle est distinct de tout ID de modèle de production et change à chaque mise à jour d'aperçu.
5. L'accès interactif Claude.ai (s'il est accordé) apparaît comme un sélecteur de mode distinct — il n'est pas activé par défaut dans l'interface principale.

Si vous êtes sur un plan Team ou Enterprise, la gestion des accès peut nécessiter qu'un administrateur active Mythos pour des postes spécifiques. Vérifiez auprès du contact de compte Anthropic de votre organisation.

Il n'y a pas de chemin de mise à niveau libre-service vers Mythos. C'est un programme avec contrôle d'accès par candidature.

---

## Ce que vous pouvez faire avec Mythos dans Claude Code

Les cas d'usage suivants bénéficient matériellement des capacités Mythos par rapport à Claude Code standard :

**Refactorisations de base de code à long horizon.** Des tâches telles que la migration d'une base de code entière d'un framework à un autre, ou l'application d'un nouveau modèle architectural à travers des centaines de fichiers, nécessitent de maintenir un modèle cohérent de l'état cible tout en exécutant des dizaines de modifications de fichiers. Le support du contexte étendu et de la profondeur des appels d'outils de Mythos rend ces tâches plus fiables — moins d'effondrements de contexte mi-session, meilleure rétention d'objectifs à travers de nombreuses sous-étapes.

**Tâches de recherche complexes multi-étapes.** Quand une tâche nécessite de lire de nombreux documents, synthétiser les informations à travers les sources, former des hypothèses, les tester contre des sources supplémentaires et les réviser, le budget de raisonnement étendu permet des traces de raisonnement plus approfondies avant de s'engager sur les conclusions. C'est distinct du simple fait d'avoir plus de contexte — cela change la qualité des étapes de raisonnement intermédiaires.

**Sessions autonomes étendues.** Les sessions agentiques standard dans Claude Code sont pratiques pour les tâches qui se complètent en dizaines d'étapes. Mythos est conçu pour supporter les sessions qui s'exécutent significativement plus longtemps sans la dégradation typique de la cohérence des tâches. Ceci est pertinent pour les agents entièrement autonomes exécutant de longs cycles de construction-test-correction ou des flux de travail multi-phases.

**Modèles de coordination d'agents novel.** Mythos est la surface appropriée pour tester les modèles d'orchestration qui nécessitent un coordonnateur pour maintenir l'état à travers de nombreux appels d'agents enfants spawned. Si vous développez un système multi-agent qui repousse les limites de coordination standard, Mythos fournit un contexte où ces limites sont suffisamment relâchées pour explorer de nouveaux modèles — avec la compréhension que ce qui fonctionne en aperçu peut nécessiter un ajustement quand le modèle se déplace vers les modèles de production.

---

## Mode de Raisonnement Étendu

Si vous avez accès à Mythos, la réflexion étendue est configurée au niveau de l'API lors de l'appel au modèle d'aperçu.

**Activation du budget de réflexion étendu dans les appels API.** Dans le SDK Anthropic, le paramètre `thinking` accepte une valeur `budget_tokens`. Pour les modèles standard, le plafond documenté s'applique. Pour les modèles d'aperçu Mythos, le plafond effectif est plus élevé — la limite exacte est documentée dans le tableau de bord Labs pour votre niveau d'accès, et est sujette à changement entre les mises à jour d'aperçu.

```python
response = client.messages.create(
    model="<mythos-model-id-from-labs-dashboard>",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 80000  # example — verify your tier's limit in the dashboard
    },
    messages=[{"role": "user", "content": your_prompt}]
)
```

Ne pas supposer de plafond `budget_tokens` spécifique. Récupérez la limite à partir du tableau de bord Labs. Le dépassement de la limite supportée entraînera une erreur d'API, pas une troncature silencieuse.

**Lire la trace de réflexion.** L'objet de réponse inclut un bloc de contenu `thinking` aux côtés du bloc `text`. La trace de réflexion est le raisonnement interne du modèle — elle reflète les étapes entreprises avant de produire la réponse finale. En mode de raisonnement étendu, cette trace peut être substantiellement plus longue qu'en mode standard. Traitez-la comme une sortie de diagnostic plutôt que du contenu destiné à l'utilisateur. C'est utile pour comprendre pourquoi le modèle a atteint une conclusion particulière, identifier où le raisonnement a échoué dans une tâche échouée et calibrer si le raisonnement étendu fournit de la valeur pour une classe de tâches donnée.

**Quand le raisonnement étendu aide.** Le raisonnement étendu est le plus utile pour les tâches où la réponse correcte n'est pas immédiatement dérivable — les problèmes qui nécessitent d'explorer plusieurs approches, les tâches avec de nombreuses contraintes interdépendantes qui doivent être satisfaites simultanément, et les tâches de recherche où la question elle-même a besoin d'affinement avant qu'une réponse ait du sens. Dans ces cas, le budget étendu permet au modèle d'épuiser plus de l'espace du problème avant de s'engager.

**Quand le raisonnement étendu est excessif.** Les tâches simples et bien spécifiées ne bénéficient pas des budgets de réflexion étendus. Une demande de formater un fichier, d'écrire un test unitaire pour une fonction clairement définie, ou de chercher une valeur dans un document ne s'améliore pas avec plus de tokens de raisonnement — cela coûte juste plus et prend plus de temps. Utilisez la réflexion étendue uniquement pour les tâches où la complexité du raisonnement justifie le coût et la latence.

**Coût.** Les tokens de réflexion étendue sont facturés au taux de token-réflexion, qui diffère du taux de token standard d'entrée/sortie. Les tokens de réflexion s'accumulent rapidement en mode de raisonnement étendu. Pour les détails des coûts, voir [guides/billing-and-pricing.md](billing-and-pricing.md). Surveillez votre utilisation pendant les sessions Mythos — les modèles d'aperçu peuvent générer de très longues traces de réflexion sur des tâches complexes.

---

## Limitations et Avertissements

Mythos est un programme d'aperçu. Cette désignation a des implications spécifiques, non-négociables :

**Les changements de comportement entre les mises à jour.** Anthropic met à jour les modèles d'aperçu plus fréquemment que les modèles de production, et sans les garanties de stabilité qui s'appliquent aux versions GA. Un comportement sur lequel vous comptez aujourd'hui peut changer dans la prochaine mise à jour d'aperçu. Ne construisez pas de systèmes de production sur les identifiants de modèle Mythos ou les comportements.

**Pas toutes les fonctionnalités Claude Code sont validées avec les variantes Mythos.** Les fonctionnalités telles que les hooks, certaines intégrations de serveurs MCP et les modèles d'appels d'outils spécifiques sont testées sur les modèles de production. La compatibilité avec les variantes Mythos n'est pas garantie, et les problèmes rencontrés peuvent ne pas être priorisés pour les corrections compte tenu du statut d'aperçu.

**Latence plus élevée.** Les passages de raisonnement étendu prennent du temps. Les tâches qui se complètent en secondes sur les modèles standard peuvent prendre des minutes sur Mythos quand le budget de raisonnement complet est engagé. C'est un comportement attendu, pas un bogue, mais cela disqualifie Mythos de tout cas d'usage sensible à la latence.

**Non adapté aux charges de travail de production.** L'absence de SLA est le signal explicite ici. Si une charge de travail nécessite des garanties de fiabilité, utilisez les modèles GA. Mythos existe pour la recherche et l'exploration, pas pour servir les utilisateurs finaux.

**L'accès peut être révoqué.** En tant que programme d'aperçu, Anthropic se réserve le droit d'ajuster l'accès, de modifier les conditions ou de discontinuer l'aperçu sans préavis. Planifiez en conséquence — ne construisez pas d'infrastructure critique sur l'accès d'aperçu.

**Documentation limitée.** Les capacités de Mythos sont intentionnellement sous-documentées dans les canaux publics. Le tableau de bord Labs est la source faisant autorité pour les limites de votre niveau d'accès, les ID de modèle et les fonctionnalités supportées. Ne vous appuyez pas sur la documentation de tiers comme référence principale.

---

## Rester à jour

Mythos évolue plus vite que le produit standard. Les sources suivantes sont les références autoriser :

- `anthropic.com/research` — Le canal principal d'Anthropic pour annoncer les directions de recherche, les nouvelles capacités et les mises à jour du programme. C'est là où les développements au niveau Mythos sont d'abord discutés publiquement.
- `claude.ai/labs` — Le portail d'accès et le tableau de bord pour les programmes Labs incluant Mythos. Les ID de modèle, les limites de niveau et la disponibilité des fonctionnalités sont documentés ici pour les utilisateurs inscrits.
- `anthropic.com/claude/changelog` — Le journal des modifications public pour les changements de modèle et de produit Claude. Les mises à jour de modèles d'aperçu peuvent apparaître ici avec moins de détails que les changements de modèles de production, mais les mises à jour significatives sont notées.

Il n'y a pas de liste de diffusion dédiée ou de flux RSS pour les mises à jour spécifiques à Mythos au mai 2026. Surveillez les canaux ci-dessus, et faites attention au tableau de bord Labs — les mises à jour de votre ID de modèle disponible ou des limites de budget apparaîtront là avant partout ailleurs.

---

## Guides Associés

- [guides/billing-and-pricing.md](billing-and-pricing.md) — Taux de tokens de réflexion, limites de plan et le changement de facturation du 15 juin qui affecte comment les coûts de raisonnement étendu sont comptabilisés sous les abonnements Pro et Max.
- [guides/context-management.md](context-management.md) — Stratégies pour gérer les fenêtres de contexte étendues, pertinentes pour les sessions Mythos où l'utilisation du contexte est substantiellement plus élevée que dans les sessions standard.

---
name: champion-builder
description: "Stratégie de champion interne : identifier, habiliter et mobiliser l'avocat interne qui fera avancer l'affaire"
---

# Compétence Champion Builder

## Quand activer
- Vous êtes en plein deal et réalisez que personne ne se bat pour vous au sein du compte
- Votre contact principal est engagé mais n'a pris aucune action interne en votre nom
- Vous devez accéder au décideur économique mais n'avez pas de voie d'accès
- L'affaire est bloquée et vous suspectez l'absence d'un avocat interne créant de l'urgence
- Vous souhaitez coacher votre champion sur la vente interne — quoi dire, quoi montrer, à qui

## Quand NE PAS utiliser
- Vous n'avez pas encore eu de réunion avec l'acheteur — faites d'abord une phase de découverte pour identifier un éventuel champion
- Vous avez déjà un champion confirmé et actif qui fait avancer l'affaire — utilisez `/deal-review` pour maintenir la santé du deal
- Vous devez créer un document de plan conjoint formel — utilisez `/mutual-success-plan`
- Vous gérez une négociation multi-parties prenantes — c'est un ensemble de compétences différent du développement de champion

## Instructions

### Identification et évaluation du champion

```
Évaluer si [Nom / Titre] est un champion solide pour cette affaire.

## Contexte
Compte : [nom de l'entreprise]
Contact : [nom, titre]
Interactions jusqu'à présent : [nombre de réunions, sujets abordés]
Taille du deal : $[ACV]
Étape : [étape actuelle]

## Tests de qualification du champion

Exécutez chaque test et indiquez : Réussi / Échoué / Non testé

### Test 1 — ACCÈS
Ce contact vous a-t-il donné accès au décideur économique et aux autres parties prenantes clés ?

Preuves :
- [ ] Vous a présenté au décideur économique (ou proposé de le faire)
- [ ] Vous a communiqué les noms et rôles des autres parties prenantes dans la décision
- [ ] A facilité une réunion au-dessus de son propre niveau

Statut : [Réussi / Échoué / Non testé]
Si échoué : Cette personne est peut-être un coach ou un contact de niveau coach, pas un champion. Un champion ouvre des portes. Un coach donne des conseils.

---

### Test 2 — INFORMATION
Ce contact a-t-il partagé des informations confidentielles ou sensibles qui témoignent de sa confiance ?

Preuves :
- [ ] Vous a parlé de la politique interne ou des dynamiques de prise de décision
- [ ] A partagé les noms des fournisseurs concurrents et leur position relative
- [ ] Vous a parlé des contraintes budgétaires ou des processus d'approbation
- [ ] Vous a averti d'obstacles potentiels avant qu'ils ne deviennent des problèmes

Statut : [Réussi / Échoué / Non testé]
Si échoué : Ils se montrent professionnellement polis, pas défenseurs. Un vrai champion vous traite comme un partenaire de confiance, pas comme un fournisseur.

---

### Test 3 — PLAIDOYER EN VOTRE ABSENCE
Cette personne vend-elle en votre nom quand vous n'êtes pas dans la salle ?

Preuves (demandez indirectement) :
- « Comment décrivez-vous ce que nous faisons à [l'exécutif] ? »
- « À qui d'autre en interne nous avez-vous mentionné ? »
- « Quels retours obtenez-vous de [décideur économique / IT / achats] ? »

Signes de véritable plaidoyer :
- Ils vous ont mentionné à des personnes que vous n'avez pas rencontrées
- Ils vous ont défendu contre des objections soulevées par d'autres
- Ils ont utilisé vos argumentaires ou données ROI dans des conversations internes

Statut : [Réussi / Échoué / Non testé]
Si échoué : Vous avez un contact passif, pas un champion. Vous devez le coacher activement et lui donner des raisons de défendre votre cause.

---

### Test 4 — BÉNÉFICE PERSONNEL
Cette personne gagne-t-elle personnellement si votre deal se conclut ?

Ce qu'elle y gagne :
- [ ] Résout une douleur qui rend son travail plus difficile / embarrassant
- [ ] La fait bien paraître auprès de son manager
- [ ] Atteint un objectif sur lequel elle est personnellement évaluée
- [ ] Supprime un problème dont elle est personnellement responsable

Si le champion ne gagne qu'abstraitement (« notre entreprise sera plus efficace »), la motivation personnelle de se battre pour votre deal est faible.

Statut : [Réussi / Échoué / Non testé]

---

## Résultat de l'évaluation du champion

| Test | Statut |
|---|---|
| Accès | Réussi / Échoué / Non testé |
| Information | Réussi / Échoué / Non testé |
| Plaidoyer en absence | Réussi / Échoué / Non testé |
| Bénéfice personnel | Réussi / Échoué / Non testé |

**Verdict :**
- 4/4 Réussi : Champion solide — habiliter et mobiliser
- 3/4 Réussi : Champion en développement — coacher et fournir des outils
- 2/4 ou moins : Coach / Sponsor, pas un champion — ne PAS compter sur cette personne pour conclure l'affaire. Trouvez un vrai champion ou créez-en un.
```

### Habilitation du champion — l'armer pour vendre en interne

```
Créer un package d'habilitation du champion pour [Nom] chez [Entreprise].

## Contexte
Champion : [nom, titre]
Son objectif : [ce qu'il/elle veut accomplir personnellement et professionnellement]
Son audience : [qui il/elle doit convaincre en interne — nom/titre du décideur économique, autres parties prenantes]
Notre solution : [description en une phrase de ce que vous vendez]
Cas business clé : [le ROI ou résultat mesurable]
Taille du deal : $[ACV]
Calendrier : [date de clôture]

## Contenu du package :

### 1. Script de pitch interne
Ce qu'il/elle dit à [décideur économique / leur équipe / achats] lors du pitch interne de cette solution.

Audience : [nom et titre du décideur économique]

Ouverture (30 secondes) :
« [Nom], j'ai évalué [catégorie de solution] et en ai trouvé une qui s'attaque directement à [point de douleur
spécifique dont nous avons discuté]. Je veux vous montrer pourquoi je pense que cela mérite un examen plus approfondi. »

Le cas business (90 secondes) :
« Actuellement, [situation actuelle qui nous coûte du temps/argent/risque]. Nous avons quantifié cela à [X heures/semaine /
$Y en coût / Z% d'exposition au risque]. [Fournisseur] a fait ses preuves en réduisant cela de [pourcentage ou montant]
pour des entreprises comme la nôtre — [client de référence si disponible]. »

La demande :
« J'aimerais vous organiser une conversation de 30 minutes avec leur équipe pour voir si c'est adapté. D'après
ce que j'ai vu, je pense que cela vaut votre temps. Pouvons-nous planifier quelque chose pour [jour/semaine] ? »

Objection anticipée et comment la gérer :
Q : « Pourquoi ne peut-on pas construire cela en interne ? »
R : « Nous avons étudié cette option. Le seul coût de développement représenterait [X] mois de temps d'ingénierie, et nous
devrions encore le maintenir. La solution de [Fournisseur] est déjà construite et fonctionne à grande échelle. »

---

### 2. Document de cas business d'une page
Un document que le champion peut faire circuler ou joindre à un e-mail d'approbation interne.

Format :
**[Nom de l'entreprise] — Cas business : [Nom de la solution]**

Problème : [1 phrase]
Coût actuel : [$X par an / X heures par semaine / X% de risque]
Solution proposée : [fournisseur et produit en 1 phrase]
Résultat attendu : [résultat spécifique et mesurable, avec preuve — benchmark ou client de référence]
Investissement : $[ACV/an]
Période de remboursement : [X mois à ces économies]
Prochaine étape recommandée : [action spécifique — « approuver le pilote / approuver l'évaluation / approuver le déploiement complet »]
Date limite de décision : [pourquoi nous devons décider avant [date]]

---

### 3. Guide de gestion des objections pour votre champion
Objections courantes que le décideur économique ou les achats soulèveront, avec des réponses :

**« Nous n'avons pas le budget. »**
Réponse : « Ce n'est pas dans le plan budgétaire actuel, mais le cas ROI est suffisamment solide pour justifier
une exception budgétaire. Je peux préparer le cas business pour [Finance/CFO]. La période de remboursement est de [X mois],
ce qui est dans notre seuil standard pour les exceptions. »

**« Pourquoi maintenant ? Nous pouvons faire ça l'année prochaine. »**
Réponse : « Il y a un vrai coût à retarder. Chaque [mois/trimestre] d'attente nous coûte [montant spécifique
ou heures]. Et la tarification de [fournisseur] augmente de [X]% en [mois] — nous pouvons verrouiller la tarification actuelle si nous
signons avant cette date. »

**« Nous avons un fournisseur que nous utilisons depuis des années. Pourquoi changer ? »**
Réponse : « Notre fournisseur actuel gère [X], mais il ne fait pas [lacune spécifique]. Les solutions de contournement que nous
utilisons aujourd'hui coûtent [temps ou argent]. Ce n'est pas un remplacement complet — c'est combler une lacune
que [fournisseur actuel] ne peut pas combler. »

---

### 4. Cartographie des parties prenantes — qui d'autre impliquer
Identifiez qui le champion devrait impliquer de manière proactive (avant qu'ils ne s'y opposent plus tard) :

| Partie prenante | Rôle | Préoccupation probable | Quoi leur dire |
|---|---|---|---|
| [IT/Sécurité] | Revue de sécurité | Gestion des données, conformité | [fournisseur] est certifié SOC 2 Type II. Proposer de les mettre en contact avec leur équipe sécurité. |
| [Finance] | Approbation budgétaire | ROI, remboursement | Voir le document de cas business ci-dessus |
| [Juridique] | Revue contractuelle | Conditions, responsabilité | MSA standard avec cap de responsabilité de [X] mois. La revue juridique prend généralement 2 semaines. |
| [Utilisateurs finaux] | Adoption | Gestion du changement | Pilote avec [N] utilisateurs avant le déploiement complet. Le champion organise une démo interne. |
```

### Ré-engagement du champion (silencieux)

```
Mon champion [Nom] chez [Entreprise] s'est tu. Il/elle était réactif/ve jusqu'à [étape] mais je n'ai pas
eu de nouvelles depuis [N] jours depuis [dernière interaction].

## Contexte
Dernière conversation significative : [résumé de ce qui a été discuté]
Dernier engagement qu'il/elle a pris : [ce qu'il/elle a dit qu'il/elle ferait]
Statut actuel du deal : [étape, date de clôture]
Raisons possibles du silence :
- Priorités internes modifiées
- Le sponsor exécutif a retiré son soutien
- Il/elle est embarrassé(e) par une approbation interne bloquée
- Un concurrent prend de l'avance
- Il/elle a quitté l'entreprise (vérifier LinkedIn)

## Stratégie de ré-engagement

Étape 1 — Contact doux (Jour 1) :
Envoyer un e-mail à valeur ajoutée. Pas « juste pour vérifier ». Donnez-leur quelque chose d'utile.
Modèle :
Objet : [Quelque chose de spécifique à leur secteur ou un déclencheur récent]
« [Nom], j'ai vu [actualité spécifique / rapport du secteur / annonce de concurrent] et j'ai pensé à ce que
vous avez mentionné au sujet de [douleur spécifique]. Je voulais partager [information pertinente / témoignage client /
nouvelle fonctionnalité qui répond à leur douleur]. Heureux de reprendre contact si le moment est opportun. »

Étape 2 — Question directe (Jour 7 si pas de réponse) :
Objet : Question rapide sur [Entreprise] + [notre entreprise]
« [Nom], je veux respecter votre temps. L'évaluation a-t-elle été déprioritisée, ou y a-t-il
quelque chose que je peux vous aider à faire avancer en interne ? Heureux d'adapter notre approche si les priorités
ont changé. »

Étape 3 — Contournement / multi-thread (Jour 14 si toujours silencieux) :
Identifier une autre partie prenante dans le compte et la contacter indépendamment.
« Bonjour [autre partie prenante], je travaillais avec [nom du champion] sur [catégorie de solution]. Je
voulais me présenter et voir s'il y a quelque chose que je peux faire pour soutenir l'évaluation. »

Étape 4 — E-mail de rupture formel (Jour 21) :
Objet : Clôture de [Entreprise] / [Notre entreprise]
« [Nom], je n'ai pas eu de retour et je ne veux pas continuer à déranger votre journée. Je vais
clôturer notre opportunité pour l'instant. Si les choses changent ou si le timing s'améliore, je suis toujours heureux
de reprendre contact. Bonne chance avec [leur objectif]. »

L'e-mail de rupture produit souvent une réponse. S'il n'en produit pas, le deal était déjà mort.
```

## Exemple

**Utilisateur :** Mon champion chez Meridian Health est Maria, la Directrice du Revenue Cycle. Elle a réussi le test d'information (elle m'a parlé de leur CFO difficile à joindre et de leurs règles d'approvisionnement). Mais elle ne m'a pas encore présenté au CFO et quand j'ai demandé, elle a dit « laissez-moi trouver le bon moment. » Le deal est à 120 K$, vieux de 60 jours, date de clôture fin du mois prochain.

**Résultat :**

```markdown
## Évaluation du champion : Maria, Directrice du Revenue Cycle

| Test | Statut | Preuves |
|---|---|---|
| Accès | ÉCHOUÉ | Ne vous a pas présenté au CFO malgré la demande |
| Information | RÉUSSI | A partagé le défi d'accessibilité du CFO et les règles d'approvisionnement |
| Plaidoyer en absence | NON TESTÉ | Aucune preuve dans un sens ou dans l'autre |
| Bénéfice personnel | NON TESTÉ | Savez-vous sur quoi Maria est personnellement évaluée ? |

**Verdict : Champion en développement.** Maria vous fait confiance (test d'information réussi), mais elle ne se
bat pas encore pour le deal. L'échec au test d'accès au CFO est un signal d'alerte jaune à 120 K$ — elle devrait
être plus motivée à faire avancer les choses si elle détient vraiment la douleur.

**Hypothèse sur la cause profonde :** « Laissez-moi trouver le bon moment » est généralement l'une de ces deux choses :
1. Elle ne se sent pas suffisamment confiante dans le cas ROI pour mettre son nom en jeu auprès du CFO
2. Elle a des préoccupations d'autorisation interne — elle ne se sent peut-être pas habilitée à faire cette introduction

**Actions recommandées :**

1. **Donnez-lui le script de pitch.** Planifiez un appel de 30 minutes avec Maria — non pas pour la convaincre davantage, mais
   pour l'aider à vendre en interne. Parcourez exactement ce qu'elle dirait au CFO.
   Dites : « Maria, je veux m'assurer de rendre les choses aussi simples que possible pour vous. Pouvons-nous passer 30
   minutes pour que je vous aide à préparer cette conversation avec le CFO ? »

2. **Construisez le cas business d'une page qu'elle peut envoyer.** À 120 K$, le CFO voudra une trace écrite.
   Donnez à Maria un document qu'elle peut transférer — pour que vous présenter devienne facultatif.
   Le document doit montrer : le coût actuel du problème, le ROI attendu, le calendrier de mise en œuvre,
   et une demande spécifique (conversation de 30 minutes avec le CFO).

3. **Fixez une date limite.** « Maria, notre tarification est valable jusqu'à [fin du mois]. Après cela, je ne peux pas
   garantir les mêmes conditions. Je veux m'assurer que nous avons suffisamment de temps pour la conversation avec le CFO —
   pouvons-nous viser à obtenir cette réunion dans les deux prochaines semaines ? »
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

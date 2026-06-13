# Flux de travail — Évaluation des opportunités d'investissement

Un processus reproductible et étape par étape pour évaluer les opportunités entrantes — de la première analyse à la décision prête pour le comité d'investissement — en utilisant les compétences Claude Code à chaque phase.

---

## Vue d'ensemble

Ce flux de travail couvre un cycle complet d'évaluation d'investissement : environ 2-3 semaines du premier contact à la décision du comité d'investissement pour un deal seed/Série A. Les étapes sont conçues pour être utilisées avec les compétences Claude Code à chaque phase. Les estimations de temps supposent une augmentation par Claude.

**Durée totale (avec Claude) :** 8-12 heures sur 3 semaines pour un deal qui passe au comité d'investissement
**Durée totale (sans Claude) :** 25-40 heures

---

## Phase 1 : Première analyse (Jour 1 — 30-60 minutes)

### Déclencheur
Opportunité entrante provenant de : démarchage à froid d'un fondateur, recommandation d'un LP, co-investisseur, conférence, promotion d'accélérateur, scout.

### Étape 1.1 — Collecter les informations sur l'opportunité

Avant de contacter Claude, collectez :
- Nom de l'entreprise et URL
- Noms des fondateurs et profils LinkedIn
- Deck ou résumé exécutif (si fourni)
- Brève description de leur activité
- Phase et montant de la levée de fonds
- Chiffre d'affaires ou ARR (si communiqué)

### Étape 1.2 — Analyse rapide

```
/deal-screening

Effectuez une première analyse rapide de [nom de l'entreprise].

Ce que je sais :
- Entreprise : [nom], [site web]
- Activité : [collez leur description]
- Phase : [pré-amorçage / amorçage / Série A]
- Levée : $[X]M à $[X]M pre-money (si communiqué)
- Chiffre d'affaires/ARR : $[X]M (si communiqué)
- Parcours des fondateurs : [résumé]

Mandat de mon fonds :
- Phase cible : [amorçage / Série A]
- Secteurs cibles : [liste]
- Ticket cible : $[X]M–$[X]M
- Focus géographique : [US / EU / global]

Options de verdict : PASSER / DEMANDER LE DECK / DEMANDER UNE RÉUNION / SIGNALER AU PARTENAIRE
```

### Étape 1.3 — Entrée dans le registre des opportunités

Si le verdict est DEMANDER LE DECK ou DEMANDER UNE RÉUNION, enregistrez dans votre pipeline :
- Nom de l'entreprise, secteur, phase
- Source de l'introduction
- Notes de première analyse (2-3 phrases)
- Prochaine action et responsable
- Date du premier contact

**Résultat de la phase 1 :** Passer (enregistré comme abandon avec raison) ou passer à la phase 2.

---

## Phase 2 : Analyse du deck et première réunion (Jours 3-7)

### Étape 2.1 — Analyse du deck

```
/deal-screening

Analysez ce pitch deck et extrayez les signaux d'investissement clés.

[Collez le contenu du deck ou les diapositives clés sous forme de texte]

Extrayez :
1. Quel problème résolvent-ils et pour qui ?
2. Quelle est la solution proposée et le modèle économique ?
3. Métriques clés mises en avant : [chiffre d'affaires, croissance, clients, NPS]
4. Affirmation sur la taille du marché : [TAM/SAM] — cela semble-t-il crédible ?
5. Équipe : [qui ils sont, ce qu'ils ont fait avant]
6. Demande : $[X]M à $[X]M pre-money — raisonnable pour la phase ?

Signalez : toute affirmation inhabituelle, invérifiable ou qui mérite des questions spécifiques lors du premier appel.
```

### Étape 2.2 — Préparation de la première réunion

```
/deal-screening

Préparez 12 questions pour un premier appel avec les fondateurs de [entreprise].

Sur la base du deck/de la description, je veux comprendre :
- Le marché est-il réel et suffisamment grand ?
- Ces fondateurs ont-ils le droit de gagner ?
- Que signifient réellement les chiffres de traction précoce ?
- Sur quelles hypothèses l'entreprise repose-t-elle et qui pourraient s'avérer fausses ?

Priorisez pour un appel de 45 minutes. Les 3 premières questions doivent porter sur les fondateurs eux-mêmes, pas sur l'entreprise.
```

### Étape 2.3 — Notes de la première réunion

Pendant l'appel, notez :
- Les réponses directes à vos questions
- Les moments d'hésitation ou les réponses vagues (à signaler pour la due diligence)
- Votre ressenti viscéral sur les fondateurs : clarté, conviction, capacité à être guidé
- Tout ce qu'ils ont dit qui vous a surpris (positivement ou négativement)
- Ce qu'ils n'ont pas dit (lacunes)

### Étape 2.4 — Mémo post-réunion

```
/deal-memo

Rédigez un premier mémo d'investissement basé sur mes notes de la réunion avec les fondateurs.

Mes notes de réunion : [collez les notes]
Ma réaction initiale : [votre ressenti — ce qui vous a enthousiasmé, ce qui vous a préoccupé]

Construisez la structure du mémo. Marquez tout ce que je n'ai pas pu vérifier comme [À VÉRIFIER].
Signalez les 5 questions les plus importantes auxquelles je dois encore répondre avant de pouvoir recommander d'investir.
```

**Résultat de la phase 2 :** Passer (avec raison enregistrée) ou passer à la phase 3. Partagez avec un partenaire pour un go/no-go sur la due diligence complète.

---

## Phase 3 : Due diligence (Jours 7-21)

### Étape 3.1 — Plan de due diligence

```
/diligence-review

Établissez un plan de due diligence pour [entreprise].

Thèse d'investissement : [ce en quoi nous devrions croire pour investir]
Risques clés identifiés dans le mémo : [listez les 5 principaux]
Temps disponible : [X jours] avant la date limite de décision

Générez une liste de contrôle de due diligence priorisée par :
1. Éléments pouvant tuer le deal (à faire en premier)
2. Éléments validant la thèse (à faire en deuxième)
3. Éléments utiles mais non bloquants

Attribuez : [appels clients / technique / financier / juridique / références]
```

### Étape 3.2 — Appels de référence clients (2-4 appels)

```
/diligence-review

J'appelle un client de référence de [entreprise] — [nom du client, titre, entreprise].

Thèse d'investissement que je teste : [votre thèse]
Principaux risques que j'essaie de réduire : [listez 3]

Générez 12 questions qui :
- Sondent l'utilisation réelle du produit (pas des témoignages)
- Demandent quelle alternative ils utiliseraient sans ce produit
- Évaluent à quel point le produit est intégré/fidélisant
- Testent si les affirmations de l'entreprise sur ce client sont exactes
- Révèlent toute insatisfaction qu'ils ne mentionneraient pas spontanément
```

Après chaque appel, enregistrez :
- Utilisation : à quelle fréquence ils l'utilisent, combien d'utilisateurs, quelles fonctionnalités
- Coût de remplacement : annuleraient-ils avec une augmentation de prix de 20 % ?
- Comparaison aux alternatives évaluées
- Toute plainte ou préoccupation
- Signal NPS global : le recommanderaient-ils à un pair ?

### Étape 3.3 — Due diligence financière

```
/diligence-review

J'ai reçu des données financières de [entreprise]. Vérifiez la cohérence et signalez les anomalies.

DONNÉES FINANCIÈRES FOURNIES :
[Collez le P&L mensuel, le calendrier ARR, ou le résumé financier]

Vérifiez :
1. Reconnaissance des revenus : l'ARR est-il calculé de façon cohérente ? (pas de MRR → calcul ARR gonflé)
2. Marge brute : qu'est-ce qui est inclus dans les COGS ? Les coûts d'hébergement sont-ils entièrement pris en compte ?
3. Taux de dépenses : se reconcilie-t-il avec les mouvements du solde bancaire ?
4. Concentration clients : quel % de l'ARR vient des 3 premiers clients ?
5. Churn : comment le churn brut vs. net est-il calculé ?
6. Trésorerie : solde bancaire réel vs. ce qu'impliquent leurs dépenses et leur historique de levées de fonds

Signalez toute métrique qui ne concorde pas. Générez des questions à poser au directeur financier/fondateur.
```

### Étape 3.4 — Comparables et valorisation

```
/comps-analysis

Effectuez une analyse des comparables pour évaluer la valorisation de ce deal.

Entreprise évaluée : [nom]
Métriques : ARR $[X]M, [X]% de croissance, [X]% de marge brute, NRR [X]%
Conditions du deal : levée de $[X]M à $[X]M pre-money = multiple ARR de [X]x

Trouvez des entreprises SaaS publiques comparables et des transactions privées récentes :
- Même secteur ou adjacent
- Échelle de revenus similaire
- Taux de croissance similaire

À quel multiple EV/ARR les comparables se négocient-ils ?
Quelle prime ou décote paierions-nous ?
À quel taux de croissance cette valorisation serait-elle justifiée ?
```

### Étape 3.5 — Due diligence technique (si applicable)

Pour les outils développeurs, l'infrastructure, l'IA, ou tout produit où l'architecture technique est importante :

```
Je dois comprendre l'architecture technique et la défendabilité de [entreprise].

Ce qu'ils m'ont dit :
- Stack technique : [ce qu'ils utilisent]
- Affirmations IA/ML : [le cas échéant]
- Infrastructure : [fournisseur cloud, auto-hébergé, etc.]
- Affirmations sur les avantages concurrentiels : [données propriétaires / algorithmes / intégrations]

Générez une liste de questions de due diligence technique pour un appel avec leur CTO couvrant :
1. Décisions de construire vs. acheter et leur justification
2. Quelle part de la PI centrale est vraiment propriétaire vs. des surcouches
3. Architecture de scalabilité (qu'est-ce qui tombe en panne à 10x le volume actuel)
4. Posture de sécurité et tout historique de violations
5. Recrutements techniques clés et facteur de bus (combien de personnes détiennent des connaissances critiques)
```

### Étape 3.6 — Synthèse de la due diligence

```
/diligence-review

Synthétisez toutes les conclusions de due diligence pour [entreprise] en un résumé pré-comité d'investissement.

Appels clients (N=X) :
[Résumez les thèmes clés]

Revue financière :
[Résumez les conclusions, signalements, éléments validés]

Revue technique :
[Résumez si applicable]

Appels de référence :
[Résumez les références des fondateurs]

Pour chaque risque initial du mémo :
[Risque] | [Statut : Réduit / Encore ouvert / Confirmé comme problème]

Mise à jour de la recommandation : [investir / passer / conditionnel] sur la base de la due diligence. Est-ce que quelque chose a changé depuis le mémo initial ? Quels sont les points encore ouverts ?
```

**Résultat de la phase 3 :** Décision d'investir ou de passer. Si investir, passez à la phase 4.

---

## Phase 4 : Préparation du comité d'investissement (Jours 18-22)

### Étape 4.1 — Mémo pour le comité d'investissement

```
/ic-memo

Convertissez le mémo d'investissement et les conclusions de due diligence en un mémo complet pour le comité d'investissement de [entreprise].

Mémo d'investissement : [collez ou résumez]
Résumé des conclusions de due diligence : [collez]
Conditions proposées : $[X]M à $[X]M pre-money, [X]% de participation

Générez les 9 sections. Marquez [À VÉRIFIER] pour tout ce qui n'est pas confirmé en due diligence.
Mettez en évidence les points ouverts que le comité doit décider s'ils constituent des risques acceptables.
```

### Étape 4.2 — Préparation à la réunion du comité

Préparez-vous à défendre la recommandation :

```
/deal-memo

Je présente [entreprise] au comité d'investissement. Aidez-moi à me préparer aux questions difficiles.

Ma recommandation : [investir / passer]
Membres du comité et leurs préoccupations connues : [listez les partenaires et leurs domaines d'attention habituels]

Générez les 10 questions les plus difficiles auxquelles je ferai face et rédigez mes réponses sur la base de ce que je sais.
Signalez les 2-3 questions pour lesquelles je n'ai pas de réponse solide et que je dois préparer.
```

### Étape 4.3 — Registre des décisions du comité

Après le comité :
- Enregistrez la décision : investir / passer / due diligence supplémentaire
- Si investir : enregistrez les conditions proposées, le calendrier, qui rédige la lettre d'intention
- Si passer : enregistrez la raison principale (utile pour le retour aux fondateurs et l'apprentissage du fonds)
- Si due diligence supplémentaire : enregistrez les points ouverts spécifiques et qui est chargé de les résoudre

**Résultat de la phase 4 :** Décision d'investissement avec justification documentée.

---

## Phase 5 : Mise en place post-investissement (Semaine 4+)

### Étape 5.1 — Mise en place du suivi du portefeuille

Une fois l'investissement finalisé :

```
/portfolio-monitor

Établissez un cadre de suivi pour [entreprise].

Thèse d'investissement : [ce en quoi nous croyions]
Jalons clés attendus en Année 1 : [listez 3-5]
KPIs clés à suivre mensuellement : [ARR, dépenses, NRR, effectifs, marge brute]
Calendrier du conseil : [mensuel / trimestriel]

Générez une fiche de profil d'entreprise pour notre système de suivi du portefeuille.
```

### Étape 5.2 — Première réunion du conseil

Dans les 60 jours suivant la clôture, organisez un lancement du conseil :

```
/portfolio-monitor

Préparez-moi pour la première réunion du conseil avec [entreprise].

Clôture récente : [date]
Thèse d'investissement : [votre thèse]
Priorités des fondateurs partagées lors de la clôture : [ce qu'ils ont dit vouloir faire]
Mes priorités en tant que membre du conseil : [ce que je veux suivre]

Générez : proposition d'ordre du jour du conseil, structure initiale du tableau de bord KPI, plan de jalons des 90 premiers jours à examiner avec les fondateurs.
```

---

## Métriques à suivre (sur l'ensemble de votre pipeline d'opportunités)

| Métrique | Suivi hebdomadaire |
|---|---|
| Opportunités analysées | Total, répartition par source |
| Taux de passage à chaque phase | Phase 1 / 2 / 3 / 4 |
| Qualité des sources | Quelles sources de recommandation mènent à des deals au stade du comité |
| Taux de conversion au comité | Deals présentés vs. approuvés |
| Vitesse des deals | Jours du premier contact au comité |
| Enseignements des appels de référence | % de deals où les appels clients ont changé votre avis |

---

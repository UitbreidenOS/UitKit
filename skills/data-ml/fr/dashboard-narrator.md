---
name: dashboard-narrator
description: "Traduire les données et graphiques d'un tableau de bord en narration en langage clair : insights clés, anomalies, recommandations — rédigé pour les parties prenantes non techniques qui ne lisent pas les graphiques"
---

# Compétence : Narrateur de Tableau de Bord

## Quand activer
- Une partie prenante a besoin d'un résumé écrit de ce que montre le tableau de bord — pas seulement un lien vers celui-ci
- Préparer une revue hebdomadaire ou mensuelle et avoir besoin d'une narration pour accompagner les graphiques
- Votre équipe dirigeante ne consulte pas les tableaux de bord et vous devez lui apporter les données
- Vous avez plusieurs métriques à synthétiser en une histoire cohérente, pas une liste de chiffres
- Traduire un tableau de bord multi-métriques complexe en un briefing pour les dirigeants

## Quand NE PAS utiliser
- Analyse des causes racines nécessitant des requêtes SQL sur des données brutes — utiliser `/sql` pour cela
- Construire le tableau de bord lui-même — utiliser votre outil BI (Looker, Tableau, Metabase)
- Analyse statistique ou tests d'hypothèses — utiliser `/pandas-polars` ou `/sql`
- Alertes de données en temps réel — configurer celles-ci dans le système d'alertes de votre outil BI

## Instructions

### Invite principale de narration de tableau de bord

```
Traduire ces données de tableau de bord en narration en langage clair pour un public non technique.

TABLEAU DE BORD : [nom et ce qu'il suit — ex. "Revue Hebdomadaire d'Activité", "Métriques de Croissance", "Santé Produit"]
PUBLIC : [qui va lire ceci — équipe dirigeante / conseil d'administration / responsable de département / investisseurs]
PÉRIODE DE REPORTING : [cette semaine / ce mois / T? 202?]
PÉRIODE DE COMPARAISON : [vs. la semaine dernière / le mois dernier / la même période l'an dernier]

MÉTRIQUES (coller vos données) :
[Pour chaque métrique, fournir : nom, valeur actuelle, valeur de la période précédente, objectif/plan si applicable]

Format exemple :
- Utilisateurs actifs hebdomadaires : 48 200 (↑ 3,1 % vs. la semaine dernière, objectif : 50 000, -3,6 % vs. objectif)
- Revenus : 1,24 M$ (↑ 8,4 % vs. la semaine dernière, ↑ 22 % vs. la même semaine l'an dernier)
- Taux de conversion : 3,2 % (↓ 0,4 pp vs. la semaine dernière — précédemment 3,6 %)
- Churn clients : 1,8 % mensuel (↑ 0,3 pp vs. le mois dernier — le plus élevé depuis 6 mois)
- CAC : 142 $ (↓ 12 % vs. le mois dernier — en amélioration)
- LTV/CAC : 4,1x (stable)
- NPS : 42 (en baisse depuis 48 le trimestre dernier)

CONTEXTE QUE JE CONNAIS :
[Tout événement commercial qui explique les données — lancement de produit, campagne marketing, changement de prix, saisonnalité, incident]

Rédiger :
1. TITRE (1 phrase) : Quel est l'état général de l'activité cette période ?
2. POINTS POSITIFS (2-3 bullets) : Ce qui s'est amélioré et pourquoi c'est important
3. PRÉOCCUPATIONS (2-3 bullets) : Ce qui s'est dégradé, l'ampleur, et si c'est une tendance ou un événement ponctuel
4. ANOMALIES (si présentes) : Tout ce qui ne correspond pas au schéma habituel — signaux d'investigation
5. RECOMMANDATION : 1-2 actions que l'équipe devrait prendre sur la base de ces données
6. LISTE DE SURVEILLANCE : Métriques à surveiller de près la prochaine période

Rester sous 400 mots. Écrire pour un PDG qui le lit en 90 secondes.
```

---

### Détection et explication des anomalies

```
J'ai une anomalie dans mes données de tableau de bord. Aidez-moi à la décrire clairement et à investiguer les causes possibles.

MÉTRIQUE : [nom de la métrique]
VALEUR ATTENDUE : [ce qu'elle est habituellement ou ce que dit le plan]
VALEUR RÉELLE : [ce qu'elle est cette période]
AMPLEUR : [X % au-dessus/en-dessous du prévu, X écarts-types par rapport à la moyenne sur 30 jours]
DURÉE : [quand cela a commencé — pic ponctuel ou changement durable ?]

CONTEXTE ENVIRONNANT (coller les métriques voisines qui pourraient être corrélées) :
[Autres métriques de la même période]

Causes possibles à investiguer :
1. [événement commercial — quelque chose a-t-il changé opérationnellement ?]
2. [qualité des données — pourrait-il s'agir d'un problème de tracking ou de journalisation ?]
3. [saisonnier ou externe — y a-t-il un schéma connu ou un facteur externe ?]
4. [dépendance amont — une source de données ou un pipeline a-t-il changé ?]

Rédiger :
1. Une description en langage clair de l'anomalie (1-2 phrases) qu'une partie prenante non technique peut comprendre
2. Les 3 explications les plus probables, classées par probabilité
3. Comment déterminer quelle explication est correcte (quoi vérifier)
4. Si cela nécessite une action urgente ou une surveillance
```

---

### Synthèse multi-graphiques (revue hebdomadaire d'activité)

```
J'ai plusieurs tableaux de bord à synthétiser en une seule narration de revue hebdomadaire d'activité.

CONTEXTE COMMERCIAL :
- Entreprise : [brève description]
- Stade : [amorçage / Série A / croissance / établie]
- Modèle économique principal : [SaaS / marketplace / e-commerce / etc.]
- Priorité stratégique actuelle : [croissance / rentabilité / rétention / expansion]

TABLEAU DE BORD 1 — CROISSANCE :
[Coller les métriques : nouveaux utilisateurs, inscriptions, MQL, essais, demandes de démo]

TABLEAU DE BORD 2 — REVENUS :
[Coller les métriques : MRR/ARR, expansion, contraction, churn, NRR]

TABLEAU DE BORD 3 — PRODUIT :
[Coller les métriques : DAU/WAU/MAU, taux d'activation, utilisation des fonctionnalités, NPS]

TABLEAU DE BORD 4 — ÉCONOMIE UNITAIRE (si applicable) :
[Coller les métriques : CAC, LTV, délai de remboursement, marge brute]

ÉVÉNEMENTS DE CETTE SEMAINE :
[Sorties de produits, campagnes, incidents, actualités externes]

Rédiger une narration cohérente de la revue d'activité qui :
1. Ouvre avec l'état de santé général de l'activité (verdict en 1 phrase)
2. Raconte l'histoire de croissance → revenus → produit → efficacité dans une séquence logique
3. Met en évidence les 2-3 choses les plus importantes se produisant sur tous les tableaux de bord
4. Signale toute contradiction (ex. "l'activation s'est améliorée mais le NPS a chuté — à investiguer")
5. Conclut sur ce qu'il faut surveiller la semaine prochaine

Cible : 500 mots maximum. Lisible en 3 minutes. Pas de bullets pour faire des bullets — prose narrative avec des données intégrées.
```

---

### Adaptation au public cible

Ajuster la sortie en fonction du lecteur :

**Pour le PDG :**
```
Cadrer la narration du tableau de bord pour un PDG.
Mettre l'accent sur : L'activité est-elle en bonne voie ? Sur quoi devons-nous nous concentrer ? Y a-t-il des décisions urgentes ?
Omettre : Définitions techniques des métriques, notes méthodologiques.
Commencer par le verdict, étayer avec 3 points de données, conclure par l'action recommandée.
```

**Pour le conseil d'administration :**
```
Cadrer la narration du tableau de bord pour une mise à jour au conseil.
Mettre l'accent sur : Avancement vs. plan, risques clés, efficacité du capital.
Format : 3 bullets — ce qui s'est bien passé, ce qui ne s'est pas passé, ce que nous faisons à ce sujet.
Inclure : Comparaison au plan/objectif, pas seulement période sur période.
Éviter : Détails opérationnels qu'ils n'ont pas besoin d'approuver ou de décider.
```

**Pour une équipe fonctionnelle (marketing, produit, ventes) :**
```
Cadrer la narration du tableau de bord pour l'équipe [marketing / produit / ventes].
Mettre l'accent sur : Les métriques dont ils sont propriétaires et sur lesquelles ils peuvent agir.
Inclure : Les actions spécifiques qu'ils devraient entreprendre sur la base des données.
Ton : Direct, orienté action. Ils veulent savoir quoi faire, pas seulement ce qui s'est passé.
```

---

### Schémas de traduction graphique en texte

Utiliser ces schémas pour décrire des types de graphiques spécifiques :

```
Décrire un graphique en courbe de tendance :
"[Métrique] [direction : a augmenté / a diminué / est resté stable] de [X] à [X] sur [période],
une [ampleur : forte / progressive / modeste] [augmentation/diminution] de [X %].
[Si tendance] : La tendance [à la hausse/à la baisse] a commencé en [mois] et s'est [poursuivie / inversée / stabilisée]."

Décrire un graphique en barres de comparaison :
"[Catégorie A] a surpassé [Catégorie B] de [X %] ([A : X] vs. [B : X]).
[Catégorie C] a affiché la plus grande [augmentation/diminution], [en hausse/en baisse] de [X %] vs. [période précédente]."

Décrire un entonnoir :
"Sur [X] [haut d'entonnoir], [X] % ([N]) ont atteint [Étape 2], et [X] % ([N]) ont converti vers [étape finale].
Le plus grand abandon se produit à [étape], où [X] % [de ceux ayant atteint cette étape] n'ont pas progressé."

Décrire une distribution / histogramme :
"La médiane [métrique] est [X], avec [X] % des [entités] se situant entre [X] et [X].
La queue [droite/gauche] indique que [X] % des [entités] ont des valeurs au-dessus/en-dessous de [seuil]."
```

---

### Checklist de qualité des insights

Avant d'envoyer une narration de tableau de bord, vérifier :

```
Examiner cette narration de tableau de bord pour la qualité.

Est-ce que :
[ ] Elle commence par la conclusion la plus importante, pas la plus évidente ?
[ ] Elle quantifie chaque affirmation (pas "les revenus ont augmenté" — "les revenus ont augmenté de 14 %") ?
[ ] Elle distingue la corrélation de la causalité ?
[ ] Elle sépare les faits des interprétations (faits : "le churn a augmenté de 0,3 pp" ; interprétation : "probablement dû à...") ?
[ ] Elle signale ce que nous ne savons pas ou ne pouvons pas expliquer à partir des données ?
[ ] Elle se termine par une action spécifique, pas un vague "nous devrions surveiller cela" ?
[ ] Elle évite le jargon que le public ne comprendra pas ?

Si un élément échoue, réécrire ces sections.
```

## Exemple

**Utilisateur :** Tableau de bord hebdomadaire — WAU : 48 200 (+3,1 % WoW, objectif 50 K). Taux de conversion : 3,2 % (était 3,6 % la semaine dernière). Revenus : 1,24 M$ (+8,4 % WoW). Churn : 1,8 % (était 1,5 % le mois dernier). NPS : 42 (était 48 le trimestre dernier). Nouvelle fonctionnalité produit lancée mardi. Public : PDG et équipe dirigeante.

**Résultat attendu :** Phrase de verdict d'ouverture ("La croissance s'accélère en termes de revenus mais les signaux de conversion et de rétention méritent attention"). Points positifs : forte croissance des revenus, tendance WAU positive. Préoccupations : la baisse du taux de conversion coïncide avec le lancement de mardi — la nouvelle fonctionnalité perturbe peut-être le flux d'inscription ; la hausse du churn est précoce mais à surveiller sur 3 mois. Recommandation : tester A/B le nouveau flux d'onboarding par rapport à la version précédente ; programmer une analyse des cohortes de churn pour identifier si un segment spécifique conduit le taux de 1,8 %. Liste de surveillance : taux de conversion et churn pour les 2 prochaines semaines.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

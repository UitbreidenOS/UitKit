---
name: legal-research
description: "Assistant de recherche juridique : résumés de jurisprudence, orientation réglementaire, comparaison entre juridictions"
---

# Compétence : Recherche Juridique

## Quand activer
- Résumer de la jurisprudence, des réglementations ou des documents d'orientation avant une réunion ou un mémo
- Comparer le traitement d'une question juridique dans plusieurs juridictions
- Rédiger un mémo de recherche juridique avec des sources citées et une analyse
- Comprendre les implications pratiques d'une nouvelle loi ou d'un changement réglementaire
- Obtenir une première lecture d'un texte législatif ou réglementaire avant de briefer un conseil
- Préparer des questions ou un programme de recherche pour des avocats externes

## Quand NE PAS utiliser
- Donner des conseils juridiques à des clients — Claude est un assistant de recherche, pas un conseil juridique
- Actes de procédure, plaidoiries ou soumissions formelles — nécessitent un avocat agréé
- Décisions irréversibles à enjeux élevés (signature d'un contrat, réponse à un régulateur) — faire appel à un conseil
- Juridictions où les données d'entraînement de Claude peuvent être limitées — toujours valider avec des sources primaires
- Mises à jour de jurisprudence en temps réel — consulter les bases de données actuelles (Westlaw, LexisNexis, Casetext, Free Law Project)

## IMPORTANT

Claude est un assistant de recherche juridique, pas un avocat. Tous les résultats sont destinés à un usage interne uniquement et doivent être validés par rapport à des sources primaires faisant autorité avant utilisation. L'analyse juridique peut évoluer avec de nouvelles décisions, des orientations réglementaires ou des amendements législatifs. Vérifiez toujours l'actualité auprès d'un praticien agréé dans la juridiction concernée.

## Instructions

### Invite pour le mémo de recherche juridique

```
Rédiger un mémo de recherche juridique sur : [QUESTION JURIDIQUE]

Juridiction(s) : [ex. droit anglais et gallois / New York / UE / fédéral américain / multi-juridictionnel]
Contexte : [pourquoi cette question est importante — décision commerciale, problème contractuel, préoccupation de conformité]
Rôle du demandeur : [conseil interne / responsable conformité / partie prenante commerciale]
Profondeur : [note rapide (1-2 pages) / mémo standard (4-6 pages) / recherche approfondie (10+ pages)]

Structure du mémo :
I. Question posée
II. Réponse succincte (1-2 paragraphes — la réponse avec les réserves clés)
III. Faits pertinents pour l'analyse
IV. Discussion
   - Cadre juridique / statuts et réglementations applicables
   - Jurisprudence pertinente (résumer les points clés des décisions)
   - Analyse de l'application du droit à nos faits
   - Contre-arguments ou interprétations alternatives
V. Conclusion et recommandation
VI. Questions ouvertes / Recherches complémentaires nécessaires

Formater les citations comme suit : [Nom de l'affaire, [Année] Référence de juridiction] ou [Loi/Règlement, Article]
Indiquer où une vérification par source primaire est nécessaire : [VÉRIFIER - source requise]
```

### Invite pour le résumé de jurisprudence

```
Résumer l'affaire suivante pour un public non-juriste.

Affaire : [nom de l'affaire / référence / coller le texte de l'affaire]
Contexte : Nous recherchons cette affaire parce que [contexte commercial/juridique].

Produire :
1. Décision en une phrase (ce que le tribunal a décidé)
2. Faits clés (2-3 phrases — uniquement les faits pertinents pour la décision)
3. Principe juridique établi (la règle de droit issue de cette affaire)
4. Implication pratique (comment cela affecte notre situation)
5. Portée de la décision : [contraignante / persuasive / autorité limitée — et dans quels tribunaux]
6. Tout traitement ultérieur (a-t-elle été suivie, distinguée ou infirmée ? — signaler si incertain)

Utiliser un langage accessible pour un public d'affaires. Les termes juridiques doivent être expliqués lors de leur première occurrence.
```

### Invite pour la comparaison entre juridictions

```
Comparer le traitement de [QUESTION JURIDIQUE] dans [JURIDICTIONS].

Question : [description en langage courant de la question juridique]
Juridictions à comparer : [ex. UE, Royaume-Uni, États-Unis-Fédéral, Californie, New York, Singapour]
Notre contexte commercial : [pourquoi nous avons besoin de cette comparaison — choix de loi applicable dans un contrat, conformité sur plusieurs marchés, etc.]

Pour chaque juridiction, fournir :
1. Loi/réglementation applicable (citer le nom du texte législatif ou réglementaire)
2. La règle dans cette juridiction (2-4 phrases)
3. Exigences ou seuils clés
4. Autorité de contrôle et historique d'application (bref)
5. Sanctions en cas de non-conformité
6. Différences clés par rapport aux autres juridictions listées

Format de sortie : tableau comparatif + un paragraphe par juridiction pour les détails.
Signaler : [VÉRIFIER] pour tout montant de sanction, seuil ou date spécifique — ces éléments changent.

Conclure par : "Enseignement pratique pour une entreprise opérant dans toutes ces juridictions" — quelle est l'approche du plus petit dénominateur commun en matière de conformité ?
```

### Invite pour le résumé d'un document d'orientation réglementaire

```
Résumer ce document d'orientation réglementaire.

Source : [Nom du régulateur, titre de l'orientation, date de publication]
[Coller le texte ou fournir l'URL/description]

Produire :
1. Ce que l'orientation couvre (périmètre et objectif)
2. À qui elle s'applique (entités réglementées)
3. Obligations ou attentes clés (liste numérotée — que doivent ou devraient faire les entités réglementées ?)
4. Délais ou périodes transitoires
5. Ce que le régulateur recherchera lors des contrôles
6. En quoi cela diffère ou clarifie l'orientation précédente
7. Étapes pratiques pour la conformité (ce qu'une équipe interne devrait faire suite à cette orientation)

[VÉRIFIER] : Signaler toute disposition où l'orientation est ambiguë ou où je devrais consulter la réglementation primaire.
```

### Invite pour l'analyse de textes législatifs et réglementaires

```
Analyser [LOI/RÈGLEMENT] tel qu'il s'applique à [NOTRE SITUATION].

Texte : [citer complètement — nom, année, article]
Notre situation : [décrire les faits]
Juridiction : [où cela s'applique]

Structure de l'analyse :
1. Texte de la disposition pertinente — citer directement
2. Termes définis — comment la loi définit-elle les termes clés utilisés ?
3. Périmètre — qui et quelles activités cette disposition couvre-t-elle ?
4. Application à nos faits — notre situation entre-t-elle dans le périmètre ?
   - Éléments de la disposition : [lister chaque élément]
   - Nos faits par rapport à chaque élément : [analyser un par un]
   - Conclusion : [dans le périmètre / hors périmètre / incertain]
4. Exceptions ou sphères de sécurité — y en a-t-il de disponibles ?
5. Mécanisme d'application — que peut faire le régulateur ?
6. Recommandation pratique

[VÉRIFIER] toutes les références législatives par rapport à la version actuelle du texte en vigueur.
Note : les textes législatifs sont fréquemment amendés — confirmer la version en vigueur à la date pertinente.
```

### Invite pour la matrice des risques juridiques

```
Construire une matrice des risques juridiques pour [PROJET/TRANSACTION/ACTIVITÉ].

Contexte : [décrire ce que nous faisons — lancement d'un nouveau produit, entrée sur un nouveau marché, M&A, etc.]
Juridictions concernées : [liste]
Parties prenantes : [équipes commerciales impliquées]

Pour chaque risque juridique identifié :
| Risque | Base juridique | Probabilité | Impact | Responsable | Atténuation |
|---|---|---|---|---|---|
| [Description du risque] | [Loi/règlement/affaire] | H/M/F | H/M/F | [Fonction] | [Action] |

Catégories de risques à analyser :
1. Réglementaire : sommes-nous une entité réglementée dans cette juridiction ? Cette activité est-elle réglementée ?
2. Contractuel : quelles obligations contractuelles ou lacunes créent une exposition ?
3. Propriété intellectuelle : cette activité enfreint-elle des droits de tiers, ou ne protège-t-elle pas les nôtres ?
4. Données/Vie privée : quel traitement de données personnelles cela implique-t-il ? Quel cadre s'applique ?
5. Droit du travail : nouvelle juridiction, nouveau type d'activité ou nouvelle catégorie de travailleurs ?
6. Responsabilité : où se situent les expositions d'indemnisation ? Y a-t-il une responsabilité illimitée ?
7. Conformité : contrôles à l'exportation, sanctions, lutte contre la corruption, droit de la concurrence
8. Contentieux : des différends en cours que cette activité pourrait déclencher ou aggraver ?

Signaler tout risque nécessitant l'intervention d'un conseil externe avant de procéder.
```

### Invite pour l'interprétation contractuelle

```
Interpréter cette clause contractuelle dans le contexte du litige suivant.

Clause : "[coller le texte exact de la clause]"
Type de contrat : [SaaS / services / emploi / NDA / M&A]
Droit applicable : [juridiction]
Contexte factuel : [ce qui s'est passé — les faits du litige en 3-5 phrases]
Notre position : [quelle interprétation nous est favorable]
Position probable de la contrepartie : [quelle interprétation lui est favorable]

Analyse :
1. Lecture littérale — que dit la clause telle quelle ?
2. Termes définis — certains mots sont-ils définis dans le contrat ? Comment ?
3. Lecture contextuelle — comment le reste du contrat éclaire-t-il cette clause ?
4. Comment les tribunaux dans [juridiction] interprètent généralement le langage contractuel ambigu
   (ex. contra proferentem, ejusdem generis, noscitur a sociis)
5. Quelle interprétation est la plus solide ? Pourquoi ?
6. Que perd la partie qui a rédigé cette clause si notre interprétation prévaut ?
7. Recommandation pratique : négocier / accepter / contester / solliciter un conseil spécialisé

[VÉRIFIER] : Pour l'interprétation d'une clause contestée, consulter un conseil externe avant de prendre position.
```

### Invite pour la construction d'un programme de recherche juridique

```
Construire un programme de recherche juridique sur [SUJET].

Je dois briefer un conseil externe dans [X jours/semaines] sur [sujet].
Budget pour la recherche du conseil externe : [X heures]
Questions que je sais déjà poser : [lister si connues]

Produire :
1. Questions juridiques à résoudre (classées par priorité)
2. Pour chaque question :
   - Le parcours de recherche (textes législatifs → jurisprudence → sources secondaires)
   - Juridictions à couvrir
   - Complexité probable (élevée/moyenne/faible)
   - Outil de recherche recommandé (Westlaw / LexisNexis / BAILII / EUR-Lex / Google Scholar / Free Law)
3. Questions auxquelles je peux répondre en interne (avec Claude + sources ouvertes)
4. Questions nécessitant un conseil externe
5. Un brief pour le conseil externe : ce dont nous avons besoin, ce que nous savons déjà, de quoi dépend la décision commerciale

Temps de recherche estimé pour le conseil externe : [X heures — ventilé par question]
```

## Exemple

**Utilisateur :** Nous sommes une SaaS britannique et souhaitons savoir si nous pouvons utiliser des données clients pour entraîner notre modèle d'IA. Résumer la position juridique au regard du GDPR.

**Résultat attendu :**
```markdown
# Mémo de Recherche Juridique

**Question posée :**
Une SaaS britannique peut-elle utiliser des données personnelles de clients pour entraîner un modèle d'IA interne en vertu du UK GDPR ?

**Réponse succincte :**
Oui, mais uniquement s'il existe une base légale valide pour le traitement, si la finalité est compatible avec la finalité initiale de collecte, et si les clients en sont informés. En pratique, cela requiert généralement : (a) soit un consentement explicite, une évaluation des intérêts légitimes (LIA), soit une base contractuelle ; (b) une AIPD si l'entraînement de l'IA constitue un traitement à risque élevé ; et (c) une mise à jour des mentions d'information. Utiliser des données pour entraîner une IA d'une manière que les clients n'anticipaient pas — et dont ils n'ont pas été informés — crée un risque significatif d'application du GDPR.
[VÉRIFIER par rapport aux orientations actuelles de l'ICO — orientations sur l'IA et la protection des données mises à jour en 2024]

**Discussion :**

**1. Base légale (Art. 6 UK GDPR)**
Le traitement des données clients pour l'entraînement d'IA requiert une base légale. Les bases les plus couramment applicables :

- **Intérêts légitimes (Art. 6(1)(f)) :** Disponible si le traitement est nécessaire à vos intérêts légitimes et n'est pas outrepassé par les intérêts de la personne concernée. Doit être étayé par une LIA documentée. L'ICO attend de la LIA qu'elle examine : (i) la nature de l'intérêt légitime ; (ii) la nécessité ; (iii) le test de mise en balance par rapport à l'impact sur les individus. Risque : les clients pourraient raisonnablement ne pas s'attendre à ce que leurs données soient utilisées pour l'entraînement d'IA.
[VÉRIFIER - orientations de l'ICO sur l'IA et la protection des données, 2024]

- **Consentement (Art. 6(1)(a)) :** Valide s'il est librement donné, spécifique, éclairé et non ambigu. Nécessite un nouveau consentement si le consentement initial ne visait pas l'entraînement de l'IA. Le droit de retirer le consentement doit être préservé. Barre haute — rarement praticable à grande échelle.

- **Exécution du contrat (Art. 6(1)(b)) :** Disponible uniquement si l'entraînement de l'IA est strictement nécessaire à l'exécution du contrat. Peu probable sauf si le produit *est* un modèle d'IA pour lequel le client a contracté.

**2. Limitation des finalités (Art. 5(1)(b))**
Les données personnelles collectées pour une finalité (ex. utilisation de votre SaaS) ne peuvent être utilisées que pour une finalité compatible. L'entraînement d'un modèle d'IA est probablement une nouvelle finalité. Test de compatibilité (Art. 6(4)) : prendre en compte le lien entre les finalités, le contexte, la nature des données, les conséquences, les garanties appliquées.
[VÉRIFIER] Aucune décision définitive de l'ICO sur la compatibilité de l'entraînement IA — la position actuelle est en évolution.

**3. Obligation d'AIPD (Art. 35 UK GDPR)**
Le traitement à grande échelle de données personnelles utilisant une technologie nouvelle (IA/ML) est identifié par l'ICO comme nécessitant probablement une AIPD. Construire l'AIPD avant le début de l'entraînement.

**4. Mise à jour de la mention d'information (Art. 13-14)**
Vous devez informer les personnes concernées de ce nouveau traitement. Mettre à jour votre mention d'information pour décrire : le fait de l'entraînement IA, la base légale invoquée, toute implication de tiers, et les droits des personnes concernées (y compris le droit d'opposition si vous vous fondez sur les intérêts légitimes).

**Recommandation pratique :**
Avant d'utiliser des données clients pour l'entraînement IA : (1) Documenter une évaluation des intérêts légitimes ; (2) Mettre à jour les mentions d'information ; (3) Réaliser une AIPD ; (4) Mettre en œuvre la minimisation des données — utiliser des données pseudonymisées ou anonymisées dans la mesure du possible (les données vraiment anonymisées n'entrent pas dans le champ du GDPR). Consulter un conseil externe en matière de vie privée sur les faits spécifiques avant de procéder.

**Questions ouvertes :**
- Certaines des données sont-elles des données de catégorie spéciale (Art. 9) — ex. santé, opinions politiques ? Si oui, base Art. 9(2) requise, barre significativement plus haute.
- Les résultats du modèle exposent-ils jamais des données au niveau individuel ? Si oui, des garanties supplémentaires sont nécessaires.
- Des clients non-UE/UK sont-ils impliqués ? Vérifier les règles équivalentes (CCPA, nFADP suisse, etc.)
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

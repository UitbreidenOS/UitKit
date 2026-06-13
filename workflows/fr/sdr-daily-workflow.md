# Flux de travail quotidien SDR

## Quand l'exécuter

Chaque jour ouvrable à 8h00. Conçu pour remplir une journée structurée de 4,5 heures (8h00 - 12h15, avec une brève reprise à 16h45 - 17h00). Déclenchez manuellement ou via un crochet programmé pour l'automatisation quotidienne.

## Entrées requises

- **Listes de comptes de niveau 1 et 2** : export CRM ou feuille de calcul avec noms d'entreprises et contacts clés
- **Statut de la séquence du jour précédent** : comptes actifs, étape et historique des réponses
- **Sources de signal** : mises à jour LinkedIn récentes, annonces de financement, offres d'emploi, flux d'actualités pour les comptes cibles
- **Modèles d'e-mail et cadres** : modèle Short Trigger, modèles de séquence multi-touches
- **Connexion CRM** : accès pour mettre à jour les dossiers de contact et créer des tâches de suivi
- **Notes d'appel** (le cas échéant) : réponses nocturnes ou messages vocaux nécessitant une classification

## Étapes

### Étape 1 : Examen des signaux du matin (30 min, 8h00-8h30)

**Tâche Claude :**
« Passez en revue mes listes de comptes de niveau 1 et 2 pour identifier les nouveaux signaux. Recherchez : embauches de leadership, annonces de financement, changements dans la pile technologique, activité LinkedIn des contacts cibles, offres d'emploi dans les départements cibles. Signalez les signaux prioritaires et recommandez une action par compte. »

**Entrée :** Liste de comptes (noms d'entreprises, contacts cibles), sources de signaux (LinkedIn, Crunchbase, actualités internes)

**Points de décision :**
- Force du signal : Est-ce un déclencheur fort pour la prospection ? (Oui = priorité niveau 1, Peut-être = niveau 2, Non = ignorer)
- Disponibilité du contact : Le décideur cible est-il toujours la bonne personne ? Mettez à jour s'il y a une nouvelle embauche.

**Résultat :** Liste de signaux priorisée (5-15 comptes) avec :
- Nom de l'entreprise
- Type de signal (par exemple, « VP des ventes embauché », « Financement série B annoncé »)
- Nom du contact cible + rôle actuel
- Crochet recommandé (par exemple, « Féliciter l'embauche + mentionner la capacité pertinente »)
- Tier de priorité (Élevé/Moyen)

**Critères de succès :** La liste contient uniquement des comptes avec des signaux actionnables ; pas de pistes obsolètes.

---

### Étape 2 : Sprint de recherche sur les comptes (60 min, 8h30-9h30)

**Tâche Claude :**
« Pour chaque compte à haut signal de l'étape 1, recherchez et générez un dossier. Format : aperçu de l'entreprise, carte des décideurs (avec focus sur l'organigramme), 3 principaux signaux de douleur, crochet de personnalisation recommandé. Utilisez LinkedIn, le site de l'entreprise, les actualités récentes et les offres d'emploi. »

**Entrée :** Liste de signaux priorisée de l'étape 1, outils de recherche d'entreprise (LinkedIn, Crunchbase, G2, sites d'entreprise)

**Points de décision :**
- L'entreprise est-elle un bon candidat pour notre solution ? (Oui = continuer, Non = déprioritiser)
- Pouvez-vous identifier 2+ décideurs ou seulement la cible initiale ? (Multiple = confiance plus élevée)
- Quel est le signal de douleur le plus fort pour cette entreprise ? (Dettes technologiques, mise à l'échelle, pression concurrentielle, etc.)

**Résultat :** Dossier d'entreprise par compte (1-2 pages chacun) :

```
[Nom de l'entreprise]

**Aperçu**
- Secteur d'activité, taille, étape de financement, taux de croissance
- Focus produit/service actuel
- Annonces ou actualités récentes

**Carte des décideurs**
- PDG / Fondateur : [Nom, LinkedIn]
- VP [Fonction pertinente] : [Nom, LinkedIn]
- [Autres influenceurs] : [Noms, rôles]

**3 principaux signaux de douleur**
1. [Signal de douleur + preuves de l'offre d'emploi / LinkedIn / actualités]
2. [Signal de douleur + preuves]
3. [Signal de douleur + preuves]

**Crochet de personnalisation recommandé**
[Raison spécifique et concrète de prendre contact liée au signal + notre solution]
```

**Critères de succès :** Chaque dossier est 80% complet ; vous avez des prochaines étapes claires pour la prospection.

---

### Étape 3 : Lot de prospection (90 min, 9h30-11h00)

**Tâche Claude :**
« Rédigez l'e-mail 1 (Objet + Corps) pour chaque prospect cible en utilisant le cadre Short Trigger. Gardez-le sous 50 mots dans le corps. Ensuite, rédigez les étapes de séquence 2-4 pour les comptes déjà dans des séquences actives (à un rythme de 3, 7, 12 jours). »

**Entrée :** Dossiers d'entreprise de l'étape 2, modèles d'e-mail, cadre Short Trigger, liste de séquences actives du CRM

**Points de décision :**
- S'agit-il d'une nouvelle prospection (E-mail 1) ou d'un suivi dans une séquence active ? (Les chemins diffèrent)
- Ce prospect a-t-il déjà répondu ? (Oui = ignorer le séquençage, passer à l'étape 4)
- Devrions-nous utiliser un appel, vidéo ou e-mail comme étape 2 ? (Dépend des signaux d'engagement)

**Résultat :**
1. **E-mail 1 (Nouvelle prospection)** pour chaque cible :
   - Ligne d'objet (moins de 10 mots, faire référence au signal)
   - Corps (moins de 50 mots, cadre Short Trigger : contexte + problème + appel à l'action)
   - Recommandation de pièce jointe/ressource (le cas échéant)

2. **Étapes de séquence 2-4** pour les séquences actives :
   - Suivi jour 3 : [E-mail ou type de tâche]
   - Suivi jour 7 : [E-mail, prospection vocale ou engagement LinkedIn]
   - Suivi jour 12 : [E-mail ou dernier toucher, pivot possible vers un nouveau signal]

**Critères de succès :** Les e-mails sont personnalisés, moins de 50 mots et font référence au signal. Les séquences suivent le rythme et la logique d'escalade.

---

### Étape 4 : Bloc de suivi (45 min, 11h00-11h45)

**Tâche Claude :**
« Classifiez toutes les réponses nocturnes et les messages vocaux. Catégorisez-les : (1) Engagement positif, (2) Nécessite clarification, (3) Non intéressé, (4) Spam. Rédigez des brouillons de réponses pour les réponses prioritaires. Pour chaque piste chaude, décidez : e-mail, appel aujourd'hui ou suite de la séquence ? »

**Entrée :** Réponses par e-mail/Slack nocturnes, transcriptions de messages vocaux, liste de prospects actifs du CRM

**Points de décision :**
- Sentiment de la réponse : Positif (répondre aujourd'hui), neutre (clarifier + séquence), négatif (enregistrer + passer)
- Préparation à l'appel : Ce prospect est-il prêt pour un appel ? (Signaux forts = oui)
- Continuation de la séquence : Devrions-nous continuer la séquence ou pivoter vers un crochet différent ?

**Résultat :**
1. **Tableau de classification des réponses :**
   - Nom du prospect | Entreprise | Contenu de la réponse | Catégorie | Action recommandée | Urgence
2. **Brouillons de réponses** pour les catégories 1 et 2 (prêts à envoyer ou à personnaliser)
3. **Liste d'appels** pour aujourd'hui avec points de discussion

**Critères de succès :** Toutes les réponses classifiées ; les pistes chaudes reçoivent une attention le jour même ; aucune piste n'est ignorée.

---

### Étape 5 : Mise à jour du CRM (11h45 - 12h15)

**Tâche Claude :**
« Convertissez les notes d'appel, les envois d'e-mail et les réponses en mises à jour CRM structurées. Pour chaque contact : mettez à jour la date de la dernière activité, ajoutez le résultat de l'appel (le cas échéant), créez des tâches de suivi avec dates d'échéance, mettez à jour l'étape d'opportunité, enregistrez les signaux. »

**Entrée :** Notes d'appel de l'étape 4, journal d'envoi d'e-mail de l'étape 3, classification de réponse de l'étape 4, enregistrements CRM actuels

**Points de décision :**
- Cet envoi devrait-il passer à une nouvelle étape d'opportunité ? (Qualifié → En conversation, etc.)
- Quelle est la tâche suivante et quand est-elle due ? (Aujourd'hui, demain, dans 3 jours ?)
- Devrions-nous ajouter un nouveau contact ou une nouvelle entreprise à la base de données ?

**Résultat :**
1. **Instructions de mise à jour CRM en masse** (prêtes à copier-coller dans votre CRM) :
   - Nom du contact | Type d'activité | Date d'activité | Notes de résultat | Tâche suivante | Date d'échéance | Étape d'opportunité
2. **Ajouts de nouveau contact/entreprise** (le cas échéant)
3. **Résumé des tâches de suivi** (nombres de tâches créées par personne)

**Critères de succès :** Toutes les activités enregistrées ; pas de travail en double ; les tâches de suivi sont spécifiques et datées.

---

### Étape 6 : Examen en fin de journée (15 min, 16h45-17h00)

**Tâche Claude :**
« Résumez les métriques d'aujourd'hui et les priorités de demain. Combien de nouveaux comptes ai-je ajoutés ? Combien de séquences sont actives ? Quels signaux dois-je examiner demain ? Dois-je ajuster ma liste de comptes cibles ? »

**Entrée :** Aperçu du tableau de bord CRM, sources de signaux, nombre de séquences actives, résultats du flux de travail d'aujourd'hui

**Points de décision :**
- Sommes-nous à la bonne cadence pour les objectifs hebdomadaires/mensuels ? (Oui = maintenir, Non = escalader)
- Devrions-nous ajouter ou supprimer des comptes de nos listes de niveau 1/2 ? (Données de performance à froid)
- Avons-nous suffisamment de comptes à haut signal pour demain, ou devons-nous chercher de nouveaux comptes ?

**Résultat :**
1. **Métriques quotidiennes :**
   - Nouveaux comptes ajoutés
   - Nouvelles séquences lancées
   - Réponses reçues + taux de réponse %
   - Appels réservés / réunions programmées
   - Séquences actives (total courant)

2. **Priorités de demain :**
   - Comptes à rechercher
   - Séquences à suivre
   - Signaux à surveiller
   - Appels urgents ou suivi nécessaire

3. **Tendance hebdomadaire** (si c'est vendredi) :
   - Nombre total de comptes touchés
   - Taux de conversion (séquence → réunion)
   - Signaux avec la meilleure performance
   - Recommandations pour la semaine prochaine

**Critères de succès :** Les métriques sont exactes ; les priorités sont claires ; vous pouvez commencer demain sans temps de démarrage.

---

## Résultat

Une exécution SDR quotidienne complète qui produit :

1. **Liste des signaux du matin** (Étape 1) : 5-15 comptes priorisés prêts pour la recherche
2. **Dossiers d'entreprise** (Étape 2) : Recherche complète + carte des décideurs + signaux de douleur pour chaque compte
3. **E-mails de prospection** (Étape 3) : E-mail 1 + étapes de séquence 2-4, prêts à mettre en file d'attente
4. **Classification des réponses** (Étape 4) : Toutes les réponses nocturnes triées + pistes chaudes avec brouillons de réponses
5. **Mises à jour du CRM** (Étape 5) : Journal d'activité en masse + tâches de suivi, prêts à télécharger
6. **Aperçu quotidien** (Étape 6) : Métriques + agenda de demain

**Allocation du temps :**
- Bloc 1 (Examen des signaux) : 30 min
- Bloc 2 (Recherche) : 60 min
- Bloc 3 (Lot de prospection) : 90 min
- Bloc 4 (Suivi) : 45 min
- Bloc 5 (Mise à jour du CRM) : 30 min
- Bloc 6 (Fin de journée) : 15 min
- **Total : 4,5 heures** (8h00 - 12h15, + 15 min à 16h45 - 17h00)

---

## Exemple

**Jour : Lundi 2 juin 2026**

### Étape 1 : Examen des signaux du matin (8h00-8h30)

L'utilisateur fournit :
- Liste de comptes niveau 1 : Acme Corp, BuildCo, DataDrive Inc, TechScale Ltd
- Sources de signaux : flux LinkedIn, e-mail Crunchbase, tableau d'offres

**Claude identifie :**
1. **Acme Corp** — VP des ventes embauché (article LinkedIn, il y a 2 jours) → **ÉLEVÉ**
2. **BuildCo** — Financement série B $15M annoncé → **ÉLEVÉ**
3. **DataDrive Inc** — Embauche de 3 ingénieurs data (offres d'emploi sur LinkedIn) → **MOYEN**
4. **TechScale Ltd** — Lancement de nouveau produit annoncé sur leur blog → **MOYEN**

**Résultat :**

```
LISTE DE PRIORITÉ DES SIGNAUX — Lundi 2 juin

🔴 PRIORITÉ ÉLEVÉE
1. Acme Corp | Signal : VP des ventes nouveau (il y a 2 jours) | Contact : TBD (recherche) | Crochet : Féliciter pour l'embauche + notre plateforme d'efficacité des ventes
2. BuildCo | Signal : Série B $15M | Contact : Contact CEO existant | Crochet : Les aider à mettre à l'échelle les opérations commerciales post-financement

🟡 PRIORITÉ MOYEN
3. DataDrive Inc | Signal : Embauche de 3 ingénieurs data | Contact : Responsable du recrutement TBD | Crochet : Mise à l'échelle de l'équipe data = défis d'infrastructure
4. TechScale Ltd | Signal : Lancement de nouveau produit | Contact : Responsable produit existant | Crochet : Analyser la réponse du marché + stratégie commerciale
```

---

### Étape 2 : Sprint de recherche sur les comptes (8h30-9h30)

L'utilisateur fournit : profils LinkedIn, sites d'entreprise, liens Crunchbase

**Claude produit des dossiers :**

```
ACME CORP

**Aperçu**
- Secteur : B2B SaaS (activation des ventes)
- Taille : 150 employés
- Financement : Série A ($8M, 2023)
- Récent : VP des ventes embauché (30 mai 2026)

**Carte des décideurs**
- PDG : Jane Smith (LinkedIn : /in/janesmith) — fondatrice
- VP des ventes : Michael Johnson (LinkedIn : /in/mjohnson) — NOUVELLE EMBAUCHE
- Rôle CRO : TBD (probablement création d'un rôle de VP des ventes pour la croissance)

**3 principaux signaux de douleur**
1. Nouvelle direction commerciale → expansion de l'équipe commerciale, besoin d'infrastructure/outils
2. Financement série A il y a 2+ ans → probablement en train de planifier la série B, besoin de mettre à l'échelle les revenus
3. 150 personnes → passage à la phase de scale-up, les opérations commerciales deviennent critiques

**Crochet recommandé**
« Salut Michael, J'ai vu que tu as rejoint Acme en tant que VP des ventes - félicitations ! Les opérations commerciales sont difficiles lors du démarrage. Nous aidons les équipes comme la tienne à compresser l'intégration de 60 à 30 jours. Un appel rapide cette semaine ? »
```

```
BUILDCO

**Aperçu**
- Secteur : Infrastructure DevOps
- Taille : 45 employés
- Financement : Série B ($15M, 1er juin 2026) — VIENT D'ÊTRE ANNONCÉ
- Taux de croissance : 3x YoY (selon Crunchbase)

**Carte des décideurs**
- PDG : Alex Chen (contact existant, engagé)
- VP du produit : Sarah Lee (LinkedIn : /in/sarahlee)
- VP des ventes : [Pas encore embauché — opportunité de croissance]

**3 principaux signaux de douleur**
1. Financement série B → 3x croissance d'effectifs attendue, les ventes vont exploser
2. 45 → ~150 personnes en 12 mois → défi de mise à l'échelle opérationnelle massif
3. Croissance menée par le produit probable → besoin d'infrastructure commerciale pour convertir l'entrée

**Crochet recommandé**
« Alex, félicitations pour la clôture de la série B de BuildCo ! Avec 3x de croissance à venir, vos opérations commerciales seront le goulot. Prenons un café et parlons comment éviter les erreurs courantes de mise à l'échelle. »
```

---

### Étape 3 : Lot de prospection (9h30-11h00)

L'utilisateur met en file d'attente les e-mails pour envoi

**Claude produit :**

```
E-MAIL 1 — Acme Corp / Michael Johnson (NOUVELLE PROSPECTION)

Objet : Opérations commerciales pour la prochaine phase d'Acme

Corps :
Salut Michael,

Félicitations pour le rôle de VP. Les équipes commerciales montent en puissance plus vite quand les opérations suivent.

Nous compressons l'intégration de 60 à 30 jours. Ça t'intéresse un appel rapide ?

Cordialement,
[Nom]
[Votre entreprise]

---

E-MAIL 1 — BuildCo / Alex Chen (NOUVELLE PROSPECTION)

Objet : Opérations post-série B de BuildCo

Corps :
Alex,

J'ai vu la clôture de la série B. Félicitations. 3x de croissance à venir signifie que les opérations commerciales sont votre goulot.

15 min cette semaine ?

Cordialement,
[Nom]
[Votre entreprise]

---

ÉTAPES DE SÉQUENCE 2-4 (Exemple : prospect DataDrive Inc déjà en séquence, jour 1 envoyé)

Suivi jour 3 : E-mail
Objet : Réflexion rapide sur l'embauche

Corps : « Salut [Nom], Suite à mon e-mail mardi. À mesure que vous agrandissez votre équipe data, les ventes deviennent critiques. La plupart des équipes échouent ici. Assurons-nous que ce n'est pas le cas pour vous. Appel rapide ? »

Suivi jour 7 : Engagement LinkedIn
Action : Commentez leur article récent d'embauche + envoyez un message : « Vu vos plans de croissance d'équipe. Synchronisons-nous sur l'opérationnalisation des ventes pour les équipes data. »

Suivi jour 12 : E-mail (dernier toucher)
Objet : Dernière réflexion

Corps : « Salut [Nom], Je vais me tenir à l'écart de votre boîte de réception après ceci. Mais si vous voulez jamais discuter de la mise à l'échelle des ventes sans le chaos, vous savez où me trouver. »
```

---

### Étape 4 : Bloc de suivi (11h00-11h45)

L'utilisateur fournit des réponses nocturnes (exemple) :

**Claude classifie :**

```
CLASSIFICATION DES RÉPONSES NOCTURNES

Prospect : John Doe (BuildCo)
Réponse : « Salut, ça semble intéressant. Tu peux m'envoyer un lien de démo ? »
Catégorie : 1 — Engagement positif
Action : Envoyer le lien de démo + appeler aujourd'hui
Urgence : ÉLEVÉE

Prospect : Sarah Chen (Acme Corp)
Réponse : « Je apprécie le message. Nous ne cherchons pas à changer d'outils en ce moment. »
Catégorie : 3 — Non intéressé
Action : Enregistrer, ne pas suivre ; revoir dans 90 jours
Urgence : FAIBLE

Prospect : Mike Peters (DataDrive Inc)
Réponse : « Quels sont vos tarifs ? »
Catégorie : 2 — Nécessite clarification
Action : Clarifier les tarifs + proposition de valeur dans un e-mail + offrir un appel
Urgence : MOYEN

---

BROUILLON DE RÉPONSE POUR LES RÉPONSES PRIORITAIRES

À : John Doe (BuildCo)
Objet : Re: Lien de démo

Salut John,

Voici la démo : [lien]. C'est une démonstration de 15 minutes ; la plupart des gens regardent à 2x la vitesse.

Appel gratuit de 30 min mercredi ou jeudi ?

Cordialement,
[Nom]

---

LISTE D'APPELS AUJOURD'HUI
1. John Doe (BuildCo) — Démo envoyée, piste chaude
   Points de discussion : Son rôle, délai pour mettre à l'échelle les ventes, douleurs des outils actuels
```

---

### Étape 5 : Mise à jour du CRM (11h45 - 12h15)

**Claude produit une mise à jour CRM en masse :**

```
MISE À JOUR CRM EN MASSE — Lundi 2 juin

Nom du contact | Type d'activité | Date | Notes | Tâche suivante | Date d'échéance | Étape d'opportunité
John Doe | E-mail envoyé | 2/6 | Lien de démo envoyé | Appel | 2/6 | En conversation
Michael Johnson | E-mail envoyé | 2/6 | Prospection nouvelle embauche VP | Suivi | 5/6 | Prospect
Alex Chen | E-mail envoyé | 2/6 | Félicitations série B | Appel | 3/6 | Prospect
Sarah Chen | E-mail reçu | 2/6 | Pas intéressé maintenant | Revoir | 90 jours | Non qualifié
Mike Peters | E-mail reçu | 2/6 | Question sur les tarifs | Clarifier dans un e-mail | 2/6 | En conversation

---

NOUVELLES TÂCHES DE SUIVI CRÉÉES
- John Doe : Appel (aujourd'hui, 14h00) — suivi démo BuildCo
- Mike Peters : Envoyer e-mail de tarification (aujourd'hui, 13h00) — répondre à la demande
- Alex Chen : Appel (mercredi, 9h00) — débriefing série B
- Michael Johnson : Suivi par e-mail (jeudi, 8h00) — vérifier le niveau d'intérêt
```

---

### Étape 6 : Examen en fin de journée (16h45-17h00)

**Claude produit :**

```
MÉTRIQUES QUOTIDIENNES — Lundi 2 juin

✅ Comptes touchés : 4
✅ Nouvelles séquences lancées : 2 (Acme Corp, BuildCo)
✅ Réponses reçues : 3 (taux de réponse : TBD, petit échantillon)
✅ Appels réservés : 1 (John Doe, 14h00 aujourd'hui)
✅ Séquences actives en cours : 7

---

PRIORITÉS DE DEMAIN (Mardi 3 juin)

🔴 TÂCHES URGENTES D'AUJOURD'HUI
- Appeler John Doe à 14h00 aujourd'hui (suivi démo)
- E-mail Mike Peters avant fin de journée (clarification tarifs)

🟡 AGENDA MARDI
- Rechercher 3 nouveaux comptes à haut signal (relancer l'examen des signaux)
- Suivre jour 7 sur 2 séquences existantes
- Appeler Alex Chen (débriefing série B) — 9h00
- Surveiller les réponses, répondre le jour même

🟢 PERSPECTIVE HEBDOMADAIRE
- 15-20 nouveaux comptes à rechercher
- 3-4 appels réservés idéalement
- 2-3 réunions programmées d'ici vendredi
- Continuer le démarrage à 8h00 quotidien pour la cohérence
```

---



📺 **[S'abonner à notre chaîne YouTube pour d'autres plongées approfondies](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**

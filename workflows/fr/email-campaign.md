# Workflow de campagne e-mail

Un workflow reproductible de bout en bout pour planifier, rédiger, tester, envoyer et analyser des campagnes e-mail — du brief à l'analyse post-envoi.

---

## Vue d'ensemble

**Investissement en temps :** ~45-90 minutes par campagne (remplace 3-5 heures de travail fragmenté).

**Ce que ce workflow couvre :**
- Brief et planification de la campagne
- Conception des tests A/B
- Rédaction et révision des e-mails
- Liste de contrôle pré-envoi
- Analyse post-envoi
- Capitalisation des apprentissages pour les tests futurs

**Prérequis :** Au minimum `/email-campaign`, `/email-ab-tester` et `/email-deliverability` installés.

---

## Phase 1 : Brief de campagne (10 minutes)

### Étape 1 : Définir la campagne

Avant d'écrire le moindre mot, répondez à ces questions. Ce brief évite les campagnes qui semblent bonnes mais ne produisent aucun résultat.

```
/email-campaign

Brief de campagne :

1. Nom de la campagne (référence interne) : [nom]
2. Date et heure d'envoi : [date, heure, fuseau horaire]
3. Segment d'audience : [nom du segment, taille, date du dernier envoi à ce segment]
4. Objectif de la campagne : [l'un des suivants : générer du chiffre d'affaires / réengager les inactifs / annoncer un produit / nourrir / éduquer]
5. CTA principal : [un seul — "acheter maintenant" / "réserver un appel" / "lire l'article" — un seul CTA]
6. Offre ou accroche de contenu : [qu'est-ce qui, dans cet e-mail, mérite d'être ouvert ?]
7. Indicateur de succès : [comment mesurerez-vous l'efficacité de cette campagne ?]
   - Campagnes de revenus : chiffre d'affaires attribué sous 7 jours
   - Réengagement : taux de clics sur le segment inactif
   - Nurture : taux de clics + conversion en aval sous 14 jours

Ce que je N'envoie PAS à ce segment dans les 7 prochains jours : [vérifiez votre calendrier — le sur-mailing détruit l'engagement]

Résultat : brief de campagne validé. Signaler tout manque ou conflit avec le calendrier de campagnes en cours.
```

---

## Phase 2 : Conception du test A/B (10 minutes)

Toute campagne envoyée à > 1 000 abonnés devrait faire l'objet d'un test, sauf si c'est un envoi unique urgent.

```
/email-ab-tester

Campagne : [issu du brief ci-dessus]
Mon backlog de tests A/B — prochaine hypothèse à tester : [tirez de votre backlog de tests]

Concevoir le test :
- Variable à tester (une seule) : [ligne d'objet / CTA / longueur d'e-mail / heure d'envoi / formulation de l'offre]
- Variante A (contrôle) : [meilleure pratique actuelle ou ce que vous choisiriez par défaut]
- Variante B (challenger) : [l'hypothèse que vous testez]
- Taille d'échantillon disponible : [taille du segment × 0,8, garder 20 % pour l'envoi du gagnant]
- Effet minimal détectable : [amélioration relative de 10-15 % en général]

Résultat :
- Confirmation de la variable isolée (ce qui est identique entre les variantes)
- Calcul de la taille d'échantillon (le test est-il suffisamment puissant ?)
- Règle de décision (ce qui constitue un gagnant — niveau de signification, délai de décision)
- Ce que vous apprendrez si A gagne vs. si B gagne
```

**Configuration du split :**
- Groupe de test : 40 % du segment → Variante A (20 %) + Variante B (20 %)
- Groupe gagnant : 60 % du segment → reçoit la variante gagnante 4 heures après la fin de la période de test

---

## Phase 3 : Rédaction (20-30 minutes)

### Étape 1 : Rédiger l'e-mail

```
/email-campaign

Écrire le texte de l'e-mail pour : [nom de la campagne]

Variante : [A ou B — une à la fois]
Ligne d'objet : [issue de la conception du test A/B]
Texte de prévisualisation : [50 caractères max — prolonge la ligne d'objet, ne la répète pas]
Segment : [décrire qui reçoit cet e-mail]
Ton de la marque : [formel / conversationnel / direct / enjoué]
Offre : [précis — "30 € de réduction", "nouveau produit : [nom]", "votre rapport Q3 est prêt"]
Longueur du corps : [court : < 150 mots / moyen : 200-350 mots / long : 350-500 mots — selon le type de campagne]
Texte du bouton CTA : [soyez précis : "Profiter de la vente" et non "Cliquer ici"]
URL de placeholder CTA : [page de destination]

Structure :
- Accroche : [première ligne qui donne envie de lire — faites référence à l'offre ou au problème]
- Corps : [apportez de la valeur en 2-3 courts paragraphes ou points]
- CTA : [une seule action claire]
- Pied de page : désinscription, adresse physique, lien vers le centre de préférences

Produire le HTML complet de l'e-mail avec styles inline (pas de CSS externe — il est supprimé).
Produire également la version texte brut (obligatoire pour la délivrabilité).
```

### Étape 2 : Rédiger la ligne d'objet / l'élément de la variante B

```
/email-campaign

Écrire la Variante B pour : [nom de la campagne]

Le seul élément qui change : [ligne d'objet / premier paragraphe / texte du CTA — la variable A/B]
Variante A [élément] : [coller]
Variante B [élément] : [rédiger le challenger]

Contexte : [quelle est l'hypothèse — pourquoi on pense que B pourrait gagner]
```

### Étape 3 : Passe de révision

Collez les deux brouillons et demandez une révision :

```
Réviser ces deux variantes d'e-mail pour :
1. Clarté — chaque phrase mérite-t-elle sa place ? Supprimer tout ce qui ne rapproche pas le lecteur du CTA.
2. Déclencheurs de spam — des mots ou des formulations susceptibles d'être filtrés comme spam ?
3. Lisibilité mobile — est-ce lisible sur 375 px de large ? Les paragraphes font-ils < 3 phrases ?
4. Mise en avant du CTA — le CTA est-il au-dessus de la ligne de flottaison sur mobile ? Est-il clair ce qui se passe quand on clique ?
5. Préheader / texte de prévisualisation — prolonge-t-il la ligne d'objet plutôt que de la répéter ?

Retourner : les versions nettoyées des deux variantes avec une brève note sur ce qui a changé.
```

---

## Phase 4 : Liste de contrôle pré-envoi (10 minutes)

À effectuer pour chaque campagne avant la planification. Non négociable.

```
/email-deliverability

Liste de contrôle pré-envoi pour : [nom de la campagne]

Détails de l'e-mail :
- Nom de l'expéditeur : [doit être reconnaissable par les abonnés — "Sarah de MaMarque" ou "MaMarque"]
- Adresse d'expédition : [doit correspondre au domaine d'envoi authentifié]
- Adresse de réponse : [boîte de réception surveillée — pas no-reply si vous souhaitez des réponses]
- Ligne d'objet : [coller]
- Texte de prévisualisation : [coller]
- Corps de l'e-mail : [coller ou décrire les éléments clés]
- Lien de désinscription : [présent ? emplacement ?]
- Adresse physique dans le pied de page : [présente ?]
- En-tête List-Unsubscribe : [confirmer que votre ESP l'ajoute automatiquement]
- Paramètres UTM sur tous les liens : [oui/non]

Santé du segment :
- Dernier envoi à ce segment : [date]
- Taux d'ouverture de la dernière campagne à ce segment : [X %]
- Fréquence cette semaine pour ce segment (y compris cette campagne) : [X]

Effectuer une vérification de délivrabilité et une analyse du contenu.
Signaler : tout problème susceptible d'affecter le placement en boîte de réception.
```

**Liste de contrôle technique (à faire manuellement) :**
- [ ] Envoi test à votre propre boîte, une adresse Gmail et une adresse Outlook
- [ ] Vérifier l'aperçu mobile (application Gmail sur iOS)
- [ ] Vérifier que tous les liens ouvrent la bonne destination
- [ ] Confirmer que les pixels de suivi se déclenchent (vérifier GA4 ou votre outil d'analyse)
- [ ] Confirmer que l'envoi est au bon segment (pas à toute votre liste)
- [ ] Confirmer que l'heure d'envoi est dans le bon fuseau horaire

---

## Phase 5 : Envoi et surveillance

### 4 premières heures (fenêtre de test A/B)

```
Surveiller le test :
- Ne pas vérifier les résultats avant [heure de fin du test]
- Résister à l'envie de déclarer un gagnant à 20 % de taux d'ouverture — laisser tourner

Définir un rappel de calendrier pour : [heure de fin du test = 4 heures après l'envoi dans la plupart des ESP]
```

### Décision d'envoi du gagnant

```
/email-ab-tester

Résultats du test pour : [nom de la campagne]

Variante A ([description]) : [X %] indicateur — [N envois]
Variante B ([description]) : [X %] indicateur — [N envois]

Interpréter : ce résultat est-il statistiquement significatif ? Quelle variante gagne ?
Décision : envoyer le gagnant aux 60 % restants du segment.

Si non concluant : [ce que vous ferez — envoyer A (contrôle) par défaut, et noter que ce test a besoin d'un échantillon plus large la prochaine fois]
```

---

## Phase 6 : Analyse post-envoi (15 minutes, 48-72 heures après l'envoi)

### Étape 1 : Vérification des performances

```
/email-ab-tester

Analyse post-envoi pour : [nom de la campagne]

Métriques finales (extraire de l'ESP — attendre 48-72 heures pour que l'attribution se stabilise) :
- Envoyés : [X]
- Délivrés : [X] / Taux de délivrabilité : [X %]
- Ouvertures uniques : [X] / Taux d'ouverture : [X %]
- Clics uniques : [X] / Taux de clics : [X %]
- Taux de clics sur ouvertures (CTOR) : [X %]
- Chiffre d'affaires attribué (72h) : [$X]
- Chiffre d'affaires par e-mail : [$X]
- Désabonnements : [X] / Taux de désabonnement : [X %]
- Signalements comme spam : [X] / Taux de plaintes : [X %]
- Rebonds durs : [X]

Comparaison avec les benchmarks :
- Taux d'ouverture vs. moyenne sur 30 jours pour ce segment : [+X % / -X %]
- Taux de clics vs. moyenne sur 30 jours : [+X % / -X %]
- Chiffre d'affaires vs. cible : [$X cible vs. $X réalisé]

Résultat du test A/B :
- Gagnant : Variante [A/B]
- Le test était-il significatif ? [oui/non]
- Amélioration relative : [X %]

Analyser : qu'est-ce que cela nous dit sur ce segment et ce type de message ?
```

### Étape 2 : Capitalisation des apprentissages

Ne jamais laisser un résultat de campagne sans documentation. Les leçons se capitalisent.

```
/email-ab-tester

Capitaliser les apprentissages de : [nom de la campagne]

Test : [ce qui a été testé]
Résultat : [Variante A/B a gagné / non concluant]
Signification : [oui/non + p-valeur ou niveau de confiance]
Amélioration relative : [X %]

Ce que cela nous dit :
- Sur ce segment : [1-2 insights]
- Sur les formulations de lignes d'objet : [ce qui a fonctionné ou non]
- Sur la formulation de l'offre : [ce qui a fonctionné ou non]
- Sur l'heure d'envoi : [un signal ?]

Principe à ajouter à notre guide e-mail : [généralisation en 1 phrase applicable au-delà de cette campagne]

Cela change-t-il notre approche par défaut pour les futures campagnes de ce type ? [oui/non + ce qui change]

Ajouter au backlog de tests A/B : [quoi tester ensuite, sur la base de ce résultat]
```

---

## Rythme mensuel

### Début de mois — Calendrier des campagnes

```
/email-campaign

Planifier le calendrier e-mail de ce mois.

Contexte business pour [MOIS] :
- Campagnes majeures : [lancements de produits, promotions, événements saisonniers]
- Engagements de contenu : [newsletter, e-mails éducatifs, études de cas]
- Segments à prioriser : [ceux qui n'ont pas été contactés récemment]
- Segments à mettre au repos : [ceux qui ont été trop sollicités]
- Tests A/B planifiés : [quelle hypothèse du backlog lancer ce mois]

Contraintes :
- Plafond de fréquence e-mail : [max X e-mails par abonné par semaine]
- Dates bloquées : [jours à éviter — ex. : jours fériés majeurs]

Produire : calendrier e-mail mensuel avec dates, segments, objectifs et tests A/B indiqués.
```

### Audit mensuel de délivrabilité

```
/email-deliverability

Audit mensuel de délivrabilité pour [MOIS] :

Métriques ce mois :
- Taux de rebond moyen : [X %] (alerte > 2 %)
- Taux moyen de plaintes spam : [X %] (alerte > 0,1 %)
- Taux de placement en boîte de réception (si suivi) : [X %]
- Réputation du domaine dans Google Postmaster Tools : [Élevée / Moyenne / Faible]
- Croissance de la liste vs. attrition : [abonnés nets ajoutés]

Santé de la liste :
- Inactifs > 90 jours : [X abonnés] — action ?
- Inactifs > 180 jours : [X abonnés] — campagne de désabonnement ?
- Nouvelles importations ce mois : [source, volume, statut de vérification]

Vérification de l'authentification :
- SPF : [valide]
- DKIM : [valide]
- DMARC : [niveau de politique — aucun/quarantaine/rejet]

Produire : actions immédiates nécessaires + recommandations d'hygiène de liste.
```

---

## Quand les choses se passent mal

### "Cette campagne atterrit dans l'onglet Promotions"

```
/email-deliverability

Ma campagne est classée dans l'onglet Promotions de Gmail.

Ligne d'objet : [coller]
Adresse d'expédition : [coller]
Résumé de l'e-mail : [décrire — est-il promotionnel ? riche en images ? nombreux liens ?]

Ce qui pousse Gmail à classer dans Promotions :
- Langage promotionnel dans l'objet + le corps
- Rapport image/texte élevé
- Trop de liens / pixels de suivi
- Envoi en masse sans personnalisation
- Domaine d'expédition avec faible historique d'engagement

Ce que je dois faire (par ordre d'impact) :
1. Améliorer l'engagement de la liste (les abonnés engagés reclassifient les messages)
2. Demander aux abonnés de vous déplacer vers Principal avec une campagne de réengagement
3. Réduire le langage promotionnel — tester un ton plus éditorial/personnel
4. Réduire le rapport image/texte
5. Personnaliser — segmentation + tokens de personnalisation

Note : l'onglet Promotions n'est PAS le dossier spam. Les taux d'ouverture depuis Promotions sont plus faibles mais
toujours mesurables. Ne compromettez pas la qualité éditoriale juste pour éviter l'onglet Promotions.
```

### "Les taux d'ouverture ont chuté de 30 % ce mois"

```
/email-deliverability

Enquête de délivrabilité :

Tendance du taux d'ouverture :
- Il y a 3 mois : [X %]
- Il y a 2 mois : [X %]
- Le mois dernier : [X %]
- Ce mois : [X %]

Qu'est-ce qui a changé durant la même période ?
- Nouveau domaine ou IP d'envoi ? [oui/non]
- Migration d'ESP ? [oui/non]
- Importations de liste ? [oui/non — si oui, source et statut de vérification]
- Changement de fréquence d'envoi ? [oui/non]
- Changement de type de contenu ? [oui/non]
- Impact de la Protection de la confidentialité d'iOS / Apple Mail ? [votre audience est-elle fortement iOS ?]

Diagnostiquer :
1. Vérifier Google Postmaster Tools — la réputation du domaine baisse-t-elle ?
2. Vérifier les taux de rebond et de plainte — ont-ils augmenté avant la baisse du taux d'ouverture ?
3. Vérifier la composition de la liste — des abonnés inactifs se sont-ils accumulés sans suppression ?
4. Vérifier l'impact de la Protection de la confidentialité d'Apple Mail — taux d'ouverture ≠ engagement pour les utilisateurs iOS

Produire : liste classée des causes probables et comment tester chaque hypothèse.
```

### "Un flux d'automatisation sous-performe"

```
/email-sequence

Audit du flux sous-performant : [nom du flux]

Statistiques actuelles :
- E-mail 1 : [objet] — ouverture [X %] / clic [X %] / désabonnement [X %]
- E-mail 2 : [objet] — ouverture [X %] / clic [X %]
- E-mail 3 : [objet] — ouverture [X %] / clic [X %]
- Conversion de l'entrée dans le flux vers l'objectif : [X %]

Conversion cible : [ce que vous attendiez]
Segment entrant dans ce flux : [qui et quel déclencheur d'inscription]

Diagnostiquer :
1. Où se situe le plus grand abandon ? (entre quels e-mails ?)
2. Quel est le taux d'ouverture de l'E-mail 1 ? (si < 30 %, la ligne d'objet est le problème)
3. Quel est le CTOR de chaque e-mail ? (si l'ouverture est OK mais le clic faible, le corps/CTA est le problème)
4. L'objectif du flux est-il clairement atteignable depuis le contenu de l'e-mail ?

Recommander : un changement par e-mail, en commençant par le maillon le plus faible.
Rédiger la réécriture de l'e-mail le moins performant.
```

---

## Benchmarks clés

| Indicateur | Sain | À améliorer | Alerte |
|---|---|---|---|
| Taux d'ouverture | > 25 % | 15-25 % | < 15 % |
| Taux de clics | > 2 % | 1-2 % | < 1 % |
| CTOR (clics sur ouvertures) | > 10 % | 6-10 % | < 6 % |
| Taux de désabonnement/campagne | < 0,2 % | 0,2-0,5 % | > 0,5 % |
| Taux de plaintes spam | < 0,05 % | 0,05-0,1 % | > 0,1 % |
| Taux de rebonds durs | < 0,5 % | 0,5-1 % | > 1 % |
| Taux d'ouverture de la série de bienvenue | > 50 % | 35-50 % | < 35 % |
| Taux de succès des tests A/B | 30-50 % | — | < 20 % (hypothèses trop prudentes) |

---

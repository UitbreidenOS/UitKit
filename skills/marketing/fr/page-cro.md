---
name: page-cro
description: "Optimisation du taux de conversion des landing pages : audit au-dessus de la ligne de flottaison, analyse CTA, signaux de confiance, hypothèses de test A/B, interprétation de heatmaps"
---

# Compétence CRO de Page

## Quand l'activer
- Auditer une landing page pour des problèmes de taux de conversion
- Générer des hypothèses de test A/B pour améliorer les inscriptions ou achats
- Interpréter les données de heatmap / session recording
- Examiner votre page d'accueil, page de tarification ou page produit
- Comprendre pourquoi le trafic est élevé mais les conversions sont faibles

## Quand ne pas l'utiliser
- Optimisation de campagnes par email — canal différent
- Texte des annonces payantes — utiliser la compétence campaign-brief
- Recherche UX à partir de zéro — CRO s'appuie sur les données existantes

## Instructions

### Audit complet de landing page

```
Auditer cette landing page pour les problèmes de conversion.

URL ou description : [décrivez ou collez les sections clés]
Objectif : [inscription / achat / demande de démo / téléchargement]
Taux de conversion actuel : [X]% (si connu)
Source de trafic : [payante / organique / email / référence]

Évaluer :

AU-DESSUS DE LA LIGNE DE FLOTTAISON (premier écran, pas de scroll)
- La proposition de valeur est-elle claire en < 5 secondes ?
- Le titre aborde-t-il le problème ou le désir du visiteur ?
- Y a-t-il un CTA unique et évident ?
- L'image/vidéo du héros soutient-elle le message ou distrait-elle ?
- Y a-t-il de la friction (trop de champs, création de compte forcée) ?

CONFIANCE ET CRÉDIBILITÉ
- Preuve sociale présente ? (avis, témoignages, logos, études de cas)
- La preuve sociale est-elle spécifique et crédible (pas juste "5 étoiles") ?
- Badges de sécurité / garanties près de l'achat/inscription ?
- Qui a construit cela ? (section À propos/équipe ou histoire du fondateur)

PROPOSITION DE VALEUR
- Le bénéfice (résultat pour l'utilisateur) est-il clair vs juste les caractéristiques ?
- Y a-t-il une différenciation claire face aux alternatives ?
- Le prix est-il visible ou y a-t-il une anxiété sur les coûts cachés ?
- Y a-t-il un renversement du risque ? (essai gratuit, garantie de remboursement, pas de carte)

ANALYSE CTA
- Combien de CTA sur la page ? (1-2 est idéal pour les landing pages ciblées)
- Texte CTA : spécifique ("Démarrer l'essai gratuit") ou générique ("Soumettre") ?
- Placement CTA : visible sans scroll ? Répété aux arrêts naturels ?
- Contraste CTA : se démarque-t-il visuellement ?

POINTS DE FRICTION
- Longueur du formulaire : moins de champs = conversion plus élevée (ne demander que l'essentiel)
- Vitesse de chargement : les pages lentes tuent les conversions (chaque seconde = ~7% baisse)
- Expérience mobile : optimisée pour le scroll au pouce ?
- Distractions : liens de navigation, fils sociaux détournant les gens ?

Résultat : liste classée des problèmes avec hypothèses de test A/B pour chacun.
```

### Générateur d'hypothèses de test A/B

```
Générer des hypothèses de test A/B pour cette page.

Page actuelle : [décrivez le titre, CTA, mise en page]
Principaux points de friction identifiés : [liste]
Taux de conversion actuel : [X]%

Pour chaque hypothèse :
- Élément à tester : [ce à changer]
- Contrôle : [version actuelle]
- Variante : [changement proposé]
- Impact attendu : [pourquoi cela doit améliorer la conversion]
- Comment mesurer : [métrique principale, métriques secondaires]
- Taille d'échantillon minimum nécessaire : [estimée]
- Priorité : [Élevée / Moyenne / Basse]
```

### Interprétation des heatmaps

```
Interpréter ces résultats de heatmap / scroll map :

Données de clic : [décrivez où les gens cliquent]
Profondeur de scroll : [X]% des visiteurs atteignent [section], [X]% atteignent le CTA
Rage clicks : [éléments recevant des clics répétés frustrés ?]
Dead clicks : [éléments non-cliquables étant cliqués ?]

Diagnostiquer :
1. Que les données de scroll nous disent sur l'intérêt/abandon ?
2. Les gens cliquent-ils où nous voulons qu'ils cliquent ?
3. Qu'est-ce qui a confus ou frustré les utilisateurs (rage clicks) ?
4. Qu'est-ce qui est ignoré qui ne devrait pas l'être ?
5. Top 3 changements à faire basés sur ces données
```

### Audit de page de tarification

```
Auditer cette page de tarification :

[décrivez les tiers, tarification, caractéristiques, CTA]

Client cible : [pour qui c'est]
Principale objection à ce stade : [prix / valeur / risque / complexité]

Vérifier :
- Le plan recommandé est-il clair ? (surbrillance, badge, "Plus populaire")
- Les fonctionnalités sont-elles décrites en termes de résultats, pas juste cases à cocher ?
- Y a-t-il une essai gratuit ou point d'entrée freemium ?
- La tarification annuelle vs mensuelle est-elle présentée clairement ?
- Y a-t-il une table de comparaison vs concurrents ou alternatives DIY ?
- Section FAQ : répond-elle aux vraies objections ?
- Que se passe-t-il quand je clique sur le CTA ? (friction à l'étape suivante ?)
```

## Exemple

**Utilisateur :** Ma page de tarification SaaS a un taux de conversion de 2,1 %. 82% des visiteurs partent sans cliquer sur aucun CTA.

**Audit CRO de Claude :**

Problèmes clés par priorité :
1. **Héros — aucune recommandation claire :** 3 tiers également pondérés sans signal "commencer ici" → paralysie décisionnelle. Fix : Ajouter badge "Plus populaire" au tier moyen, atténuer le tier Enterprise pour le trafic PME.
2. **Les CTA disent "Commencer" :** Générique — aucune différenciation entre les tiers. Fix : Tester "Démarrer l'essai gratuit" (Starter) vs "Planifier une démo" (Pro) vs "Contacter les ventes" (Enterprise).
3. **La toggle annuel/mensuel par défaut est annuelle :** Les visiteurs voient le prix plus élevé en premier = choc des prix. Fix : Test A/B en défaut à la tarification mensuelle.
4. **Pas de renversement du risque :** Pas de mention d'essai au-dessus de la ligne de flottaison. Fix : Ajouter ligne "Essai gratuit de 14 jours, pas de carte" directement sous les CTA.
5. **FAQ ne répond pas à l'objection de prix :** "Cela en vaut-il la peine ?" n'est pas répondu. Fix : Ajouter "Comment cela se compare-t-il à [alternative principale] ?" et calculatrice ROI.

**Top test A/B à exécuter en premier :** Changer le texte CTA de "Commencer" à "Démarrer l'essai gratuit — Pas de carte" → augmentation estimée de 20-35% basée sur données SaaS similaires.

---

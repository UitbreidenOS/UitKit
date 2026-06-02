# Claude pour les Agents Immobiliers

Tout ce dont un agent immobilier résidentiel a besoin pour gérer des annonces, du travail acheteur, des présentations CMA, de la prospection et des communications clients augmentés par l'IA, dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes agent immobilier — en solo ou en équipe — qui gagne sa vie en convertissant des relations en transactions conclues. Votre temps est dévoré par la rédaction de descriptions d'annonces, la recherche de comparables, la rédaction de lettres d'offre, le suivi des leads et la tenue informée de 20 clients actifs. Claude Code élimine le travail d'écriture répétitif pour que vous puissiez être devant les clients plutôt que derrière un clavier.

**Avant Claude Code :** 45 minutes pour rédiger un narratif de CMA. 20 minutes par description d'annonce. 15 minutes par suivi de visite. Des heures de recherche de marché par semaine.

**Après :** Narratif de CMA en 3 minutes. Description d'annonce en 90 secondes. Suivi de visite en 60 secondes. Mise à jour de marché hebdomadaire en 5 minutes.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences immobilières
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/customer-inquiry

# Installer l'agent spécialisé en immobilier
npx claudient add agent roles/real-estate-specialist
```

---

## Votre stack immobilier Claude Code

### Compétences (slash commands)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/real-estate-listing` | Descriptions MLS, suivis de visites, séquences de nurture des leads, posts sociaux — conforme à la loi anti-discrimination | Nouvelle annonce, post-visite, contenu social |
| `/cma-report` | Narratif complet de CMA : sélection des comparables, analyse des ajustements, niveaux de prix, présentation vendeur | Chaque rendez-vous d'inscription |
| `/buyer-offer-writer` | Lettres personnelles et lettres agent-à-agent pour les offres — scénarios émotionnels et compétitifs | Toute soumission d'offre |
| `/cold-outreach` | Lettres de farming, prospection FSBO, prospection d'annonces expirées, contacts sphère d'influence | Campagnes de prospection |
| `/customer-inquiry` | Répondre aux demandes entrantes acheteur/vendeur — qualifier, nurturer, convertir | Nouveaux leads de Zillow, Realtor.com, recommandations |

### Agent

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `real-estate-specialist` | Sonnet | Sessions complètes de préparation d'annonce, préparation de consultation acheteur, recherche de marché |

---

## Flux de travail quotidien

### Matin (20-30 minutes)

**1. Suivi des leads — nouvelles demandes de la nuit**
```
/customer-inquiry

J'ai [X] nouveaux leads de [Zillow / recommandation / porte ouverte]. Voici les détails :

Lead 1 :
Nom : [nom]
Source : [source]
Message : [ce qu'ils ont dit]
Bien sur lequel ils ont demandé : [adresse ou fourchette de prix]
Calendrier : [ce que vous savez]

Rédigez des réponses pour chacun. Chaleureuses, professionnelles, orientées vers un appel téléphonique ou une visite.
```

**2. Suivis de visites — visites d'hier**
```
/real-estate-listing

Suivi post-visite pour :
- Nom de l'acheteur : [nom]
- Bien : [adresse]
- Ce qu'ils ont aimé : [notes de la visite]
- Préoccupations soulevées : [notes]
- Leur calendrier : [X mois]
- Concurrence : [autres biens qu'ils ont vus]

Rédigez un email de suivi personnalisé. Référencez quelque chose de spécifique de la visite. Prochaine étape douce.
```

---

### Préparation du rendez-vous d'inscription (60-90 minutes à l'avance)

**3. Rapport CMA — présentation complète vendeur**
```
/cma-report

Bien sujet : [chambres/salles de bain, superficie, quartier, année de construction, améliorations]

Ventes comparables :
Comp 1 : [détails]
Comp 2 : [détails]
Comp 3 : [détails]

Concurrence active :
Actif 1 : [détails]
Actif 2 : [détails]

Contexte de marché : [taux d'absorption, jours moyen sur le marché, ratio prix demandé/prix vendu]
Calendrier du vendeur : [X semaines]
Ma fourchette de prix recommandée : [X] € – [X] €

Générez le rapport CMA complet et le narratif de présentation vendeur.
```

**4. Marketing de l'annonce — texte MLS et réseaux sociaux**
```
/real-estate-listing

Nouvelle annonce — rédigez la description MLS et les posts pour les réseaux sociaux.

Bien : [chambres/salles de bain, superficie, caractéristiques clés, quartier]
Top 5 des caractéristiques : [liste]
Style de vie de l'acheteur cible : [décrire]
Limite de caractères MLS : [X mots]
```

---

### Situations d'offre

**5. Lettre d'offre acheteur — scénario compétitif**
```
/buyer-offer-writer

Acheteur : [prénoms]
Offre : [X] € sur [X] € demandés
Profil du vendeur : [ce que vous savez — propriétaire de longue date, attaché à l'histoire du bien, etc.]
Ce que les acheteurs aiment dans le bien : [caractéristiques spécifiques]
Points forts des acheteurs : [pré-approbation, apport, renonciations aux conditions]
Contexte compétitif : [offres multiples attendues]

Générez une lettre personnelle (conforme à la loi anti-discrimination) + lettre de l'agent.
```

---

### Tâches hebdomadaires (vendredi — 30 minutes)

**6. Mise à jour de marché pour les clients actifs**
```
/cold-outreach

Rédigez un email de mise à jour de marché hebdomadaire pour mes clients acheteurs actifs.

Statistiques de marché cette semaine :
- Nouvelles annonces dans leur fourchette de prix : [X]
- Baisses de prix : [X]
- Vendus cette semaine : [X]
- Prix de vente moyen : [X] €
- Jours moyens sur le marché : [X] jours
- Mise à jour du taux d'intérêt : [X]%

Critères de recherche de mes clients : [fourchette de prix, zone, type de bien]
Ton : informatif, expert, pas alarmiste. Me positionner comme leur conseiller de confiance.
```

**7. Contact sphère d'influence — farming mensuel**
```
/cold-outreach

Email mensuel de farming à ma sphère d'influence.

Sujet de ce mois : [mise à jour du marché / conseil d'entretien / événement local / annonce de listing]
Ma zone de farming : [quartier]
Objectif : Rester présent à l'esprit, pas vendre.

Rédigez un email de 150 mots qui sonne personnel, pas comme une newsletter. Incluez un fait utile et un CTA doux (café, estimation de la valeur du bien, demande de recommandation).
```

---

## Plan de montée en compétences sur 30 jours (nouveaux agents ou nouveau marché)

### Semaine 1 — Configuration et connaissance du marché
- Installer toutes les compétences immobilières via `npx claudient add skill small-business/[nom]`
- Exécuter `/cma-report` sur 5 ventes récentes dans votre zone de farming pour calibrer votre lecture des comparables
- Utiliser `/real-estate-listing` pour réécrire 3 de vos descriptions d'annonces passées — comparer la qualité
- Cartographier votre sphère d'influence : 50 contacts → exécuter `/cold-outreach` sur votre premier contact

### Semaine 2 — Workflows annonce et acheteur
- Simuler un rendez-vous d'inscription complet avec `/cma-report` sur le bien d'un voisin (exercice)
- Rédiger vos 10 premiers suivis de visite avec `/real-estate-listing` — chronométrer : objectif < 3 min chacun
- Construire une séquence de nurture de 4 contacts avec `/real-estate-listing` pour un acheteur sur 6 mois

### Semaine 3 — Prospection
- Lancer votre première campagne de prospection FSBO avec `/cold-outreach` — 10 FSBO dans votre zone
- Prospection d'annonces expirées : identifier 5 annonces récemment expirées, rédiger une prospection personnalisée
- Mener un farming géographique : zone de 100 maisons, contact mensuel, suivre le taux de réponse

### Semaine 4 — Situations compétitives
- Pratiquer `/buyer-offer-writer` sur la prochaine offre de votre acheteur avant soumission
- Exécuter le prompt de clause d'escalade — comprendre les mécaniques avant d'en avoir besoin dans le moment
- Suivre vos métriques : visites par annonce, taux de réponse aux suivis, conversion rendez-vous CMA

---

## Intégrations d'outils

### Votre CRM

```json
// Ajouter à ~/.claude/settings.json pour un workflow connecté au CRM
// La plupart des agents utilisent Follow Up Boss, LionDesk ou KVCore
{
  "mcpServers": {
    "followupboss": {
      "command": "npx",
      "args": ["-y", "@followupboss/mcp-server"],
      "env": {
        "FUB_API_KEY": "your-key-here"
      }
    }
  }
}
```

Avec le CRM connecté, Claude peut :
- Consulter l'historique complet d'un contact avant de rédiger un suivi
- Enregistrer les interactions après chaque communication client
- Signaler les contacts qui n'ont pas été contactés depuis 30+ jours

### Données MLS
Exportez vos données de comparables en CSV ou collez directement depuis votre MLS → Claude les lit et les formate pour l'analyse CMA. Aucune intégration spéciale nécessaire.

### DocuSign / DotLoop
Claude rédige le texte et les points de discussion — vous collez dans votre plateforme de gestion des transactions. Futur : déclencheurs webhook pour auto-rédiger quand un formulaire est ouvert.

### Canva / matériaux marketing
Utilisez Claude pour générer le texte → collez dans les modèles Canva pour les flyers d'annonce, les posts sociaux et les mailers de farming. Claude respecte les limites de caractères quand vous les spécifiez.

---

## Métriques à suivre

| Métrique | Référence (manuel) | Cible avec Claude |
|---|---|---|
| Temps par description d'annonce | 45 min | 5 min |
| Temps par narratif CMA | 60 min | 10 min |
| Temps par suivi de visite | 15 min | 3 min |
| Fréquence de contact sphère | Mensuel (si vous y pensez) | Hebdomadaire (brouillons automatisés) |
| Taux de conversion rendez-vous inscription | Suivre depuis le premier CMA | Benchmark après 10 CMAs |
| Taux d'acceptation d'offre (côté acheteur) | Suivre | Suivre lettre vs. sans lettre |

---

## Erreurs courantes (et comment Claude Code les évite)

**Erreur 1 : Violations de la loi anti-discrimination dans les annonces**
Claude signale et supprime automatiquement les mentions de catégories protégées. Vous faites quand même la relecture finale — Claude est une protection, pas une garantie.

**Erreur 2 : Suivis de visite génériques qui sont ignorés**
`/real-estate-listing` vous oblige à fournir des notes spécifiques de la visite. Pas de notes = pas d'email. Vous force à écouter pendant les visites.

**Erreur 3 : Présenter un CMA sans narratif**
Les vendeurs ne se souviennent pas des données — ils se souviennent des histoires. `/cma-report` génère le narratif que vous lisez à voix haute. C'est la différence entre un prix et une conversation.

**Erreur 4 : Sur-personnaliser une lettre acheteur et déclencher une responsabilité anti-discrimination**
`/buyer-offer-writer` vérifie les mentions de catégories protégées avant que vous ne soumettez.

**Erreur 5 : Laisser les contacts sphère se refroidir**
Définissez un rappel hebdomadaire → `/cold-outreach` → contact mensuel de la sphère en 5 minutes.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Compétence annonce immobilière](../skills/small-business/real-estate-listing.md)
- [Compétence rapport CMA](../skills/small-business/cma-report.md)
- [Compétence rédaction d'offre acheteur](../skills/small-business/buyer-offer-writer.md)
- [Compétence prospection à froid](../skills/small-business/cold-outreach.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

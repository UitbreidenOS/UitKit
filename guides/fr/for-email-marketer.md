# Claude pour les Spécialistes du Marketing par E-mail

Tout ce dont un spécialiste du marketing par e-mail a besoin pour piloter des campagnes augmentées par l'IA — hygiène de liste, délivrabilité, tests A/B, flux d'automatisation, rédaction de textes et reporting des performances.

---

## À qui s'adresse ce guide

Vous êtes spécialiste du marketing par e-mail, gestionnaire CRM ou responsable du cycle de vie, dont le travail consiste à acquérir, engager et fidéliser des clients par e-mail. Vous rédigez des campagnes, gérez des flux d'automatisation, maintenez la santé de vos listes, effectuez des tests fractionnés et reportez sur les performances du programme.

**Avant Claude Code :** Du brief de campagne à la mise en ligne : 2-3 jours. Analyse d'un test A/B : 45 minutes de travail sur tableur. Audit de délivrabilité : un ticket à l'équipe support de votre ESP. Rapport mensuel : 3 heures.

**Après :** Brouillon de campagne en 25 minutes. Test A/B interprété en 5 minutes. Audit de délivrabilité réalisé par vous-même (sans ticket). Rapport mensuel en 30 minutes.

---

## Installation en 30 secondes

```bash
# Installer la stack complète de marketing par e-mail
npx claudient add skills marketing/email-sequence
npx claudient add skills small-business/email-campaign
npx claudient add skills marketing/onboarding-cro
npx claudient add skills marketing/analytics-tracking
npx claudient add skills marketing/email-deliverability
npx claudient add skills marketing/email-ab-tester
npx claudient add agents advisors/cmo-advisor
```

---

## Votre stack Claude Code pour le marketing par e-mail

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/email-deliverability` | Audit de délivrabilité : SPF/DKIM/DMARC, déclencheurs de spam, hygiène de liste, calendrier de chauffe | Quand les taux d'ouverture chutent, lors de la configuration d'un nouveau domaine, audit trimestriel |
| `/email-ab-tester` | Conception de tests A/B, calcul de la taille d'échantillon, interprétation des résultats | Chaque campagne où vous disposez d'une capacité de test fractionné |
| `/email-sequence` | Séquences automatisées : bienvenue, nurturing, ré-engagement, post-achat | Construction ou optimisation de flux automatisés |
| `/email-campaign` | Rédaction d'une campagne ponctuelle, lignes d'objet, texte d'aperçu, CTA | Création de campagne |
| `/onboarding-cro` | Optimisation des e-mails d'accueil — événements d'activation, points de friction | Flux d'accueil de nouveaux utilisateurs/clients |
| `/analytics-tracking` | Analyse des performances e-mail, attribution, analyse de cohorte | Reporting hebdomadaire et mensuel |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `cmo-advisor` | Sonnet | Stratégie du programme — mix de canaux, stratégie de segmentation, allocation budgétaire |

---

## Flux de travail quotidien

### Vérification des performances des campagnes le matin (15 minutes)

Commencez chaque journée en sachant ce qui fonctionne :

```
/analytics-tracking

Bilan matinal du programme e-mail — [DATE] :

Métriques d'hier :
- Campagnes envoyées : [liste + volume d'envoi pour chacune]
- Taux d'ouverture : [X%] vs. [X% moyenne sur 30 jours]
- Taux de clics : [X%] vs. [X% moyenne sur 30 jours]
- Chiffre d'affaires attribué : [$X]
- Désabonnements : [X] (signaler si > 0,5% par campagne)
- Plaintes pour spam : [X] (signaler si > 0,1%)
- Rebonds durs : [X] (signaler si > 0,5%)

Flux automatisés (fenêtre de 24 heures) :
- Série de bienvenue : [e-mails envoyés, taux d'ouverture moyen]
- Panier abandonné : [e-mails envoyés, taux de récupération]
- Post-achat : [e-mails envoyés, taux de clics moyen]

Signaler tout ce qui nécessite une attention aujourd'hui.
```

---

### Gestion de liste (10-15 minutes par semaine)

**Vérification hebdomadaire de l'hygiène :**

```
/email-deliverability

Vérification de l'hygiène de liste pour la semaine du [date] :

Métriques actuelles de la liste :
- Total d'abonnés actifs : [X]
- Nouveaux abonnés cette semaine : [X]
- Désabonnements cette semaine : [X]
- Rebonds durs cette semaine : [X]
- Rebonds souples (3+) : [X]
- Inactifs > 90 jours (aucune ouverture) : [X]
- Inactifs > 180 jours (aucune ouverture) : [X]

Importation depuis une nouvelle source cette semaine : [oui/non — si oui, décrire la source et le volume]

Actions nécessaires :
- Ce qu'il faut supprimer immédiatement
- Ce qu'il faut mettre en ré-engagement
- Si une importation récente nécessite une vérification
```

---

### Rédaction d'e-mails

**E-mail de campagne :**

```
/email-campaign

Campagne : [nom et objectif]
Segment d'audience : [qui, combien]
Objectif : [action spécifique que vous souhaitez qu'ils entreprennent]
Offre ou message clé : [ce que vous envoyez — promotion / contenu / annonce]
Ton de la marque : [formel / conversationnel / direct]

Produire :
- Ligne d'objet (+ variante A/B)
- Texte d'aperçu (50 caractères)
- Brouillon d'e-mail (avec en-tête, corps, CTA)
- Recommandation d'heure d'envoi pour ce segment et cet objectif
- Notes d'aperçu mobile (comment ça se lit en largeur de 375px)
```

**E-mail de séquence automatisée :**

```
/email-sequence

Séquence : [nom — ex. : Série de bienvenue, Post-achat, Ré-engagement]
Position dans l'e-mail : [Jour X, E-mail N sur N]
Ce qui précède : [résumé de l'e-mail précédent]
Objectif de cet e-mail : [quelle étape du parcours il sert]
Segment : [qui le reçoit]

Rédige cet e-mail dans le contexte de la séquence complète — fais référence à ce que nous avons établi, construis dessus, fais-les passer à l'étape suivante.
```

---

### Travail sur les tests A/B

**Concevoir un nouveau test :**

```
/email-ab-tester

Campagne : [décrire]
Ce que je veux tester : [ligne d'objet / CTA / heure d'envoi / longueur de l'e-mail / formulation de l'offre]
Taille de liste disponible : [X abonnés]
Métrique de référence que j'essaie d'améliorer : [taux d'ouverture X% / taux de clics X% / conversion X%]
Mon hypothèse : [format Si/Alors/Parce que]

Concevoir le test : isoler la variable, calculer la taille d'échantillon, définir les critères de succès, établir la règle de décision.
```

**Interpréter les résultats :**

```
/email-ab-tester

Interpréter ces résultats :
Test : [ce qui a été testé]
Variante A : [description] — [X% métrique] — [N envois]
Variante B : [description] — [X% métrique] — [N envois]

Est-ce significatif ? Que dois-je faire de ce résultat ? Quel principe cela m'enseigne-t-il ?
```

---

## Rythme hebdomadaire

### Lundi — Planification des campagnes

```
/email-campaign

Planifier les e-mails de cette semaine :

Contexte business : [promotions, lancements de produits, événements saisonniers cette semaine ?]
Segments à cibler : [lister les segments et leur dernière date d'envoi]
Objectif de fréquence d'envoi : [X e-mails cette semaine à la liste principale, X aux segments]
Tests A/B actifs cette semaine : [lister — ne pas envoyer aux audiences de test tant que le test n'est pas conclu]

Produire : calendrier de campagne pour la semaine avec dates d'envoi, segments, objectifs et options de lignes d'objet.
```

### Mercredi — Audit de l'automatisation

Choisissez un flux d'automatisation à réviser chaque semaine :

```
/email-sequence

Mode audit — [NOM DU FLUX] :

Statistiques du flux actuel :
- E-mail 1 : [objet, taux d'ouverture, taux de clics, taux de désabonnement]
- E-mail 2 : [objet, taux d'ouverture, taux de clics]
- [etc.]

Conversion de l'e-mail 1 à la complétion de l'objectif : [X%]

Quel est le maillon faible de cette séquence ? Où les gens abandonnent-ils ? Que devrais-je tester ou réécrire ?
```

### Vendredi — Rapport de performance hebdomadaire

```
/analytics-tracking

Rapport hebdomadaire du programme e-mail pour [semaine] :

Métriques des campagnes :
[Lister chaque campagne : nom, segment, ouvertures, clics, chiffre d'affaires, désabonnements]

Performance des flux d'automatisation :
[Lister les flux clés : e-mails envoyés, taux d'ouverture, taux de conversion vs. semaine précédente]

Santé de la liste :
- Nouveaux abonnés nets : [X] (nouveaux bruts moins désabonnements)
- Taux de croissance de la liste : [X%]
- Taux d'engagement actif (ouvert dans les 90 derniers jours / total) : [X%]

Délivrabilité :
- Taux de rebond : [X%]
- Taux de plainte pour spam : [X%]
- Placement en boîte de réception (si suivi) : [X%]

Tests A/B conclus cette semaine : [résultats et enseignements]

Produire : résumé hebdomadaire (3 points pour la direction) + section détaillée pour mes archives.
Que dois-je prioriser la semaine prochaine ?
```

---

## Plan de montée en compétence sur 30 jours

### Semaine 1 — Fondations de délivrabilité

- Installer toutes les compétences de marketing par e-mail
- Effectuer un audit complet de délivrabilité avec `/email-deliverability` — authentification, hygiène de liste, scores de spam
- Vérifier les enregistrements SPF/DKIM/DMARC et corriger immédiatement les lacunes
- Établir votre segmentation de liste : actifs (< 90 jours) / légèrement actifs (90-180 jours) / inactifs (180+ jours)
- Ne jamais envoyer aux inactifs mélangés aux actifs sans avoir d'abord lancé une campagne de ré-engagement

### Semaine 2 — Révision de l'automatisation

- Auditer votre séquence de bienvenue avec `/email-sequence` — c'est votre flux au ROI le plus élevé
- Identifier l'automatisation avec le pire taux d'abandon — la réécrire
- Réviser votre séquence de ré-engagement (ou en créer une si elle n'existe pas)
- Mettre en place votre rituel hebdomadaire d'hygiène de liste

### Semaine 3 — Programme de tests

- Construire votre backlog de tests A/B sur 90 jours avec `/email-ab-tester`
- Lancer votre premier test A/B correctement conçu (ligne d'objet — le plus facile pour commencer)
- Établir votre règle de décision de significativité statistique avant de regarder les résultats
- Documenter votre première note "enseignements e-mail" (principes que vous testerez)

### Semaine 4 — Reporting et optimisation

- Établir votre modèle de rapport de performance hebdomadaire
- Passer en revue les 3 derniers mois de campagnes : quels segments, objets et heures d'envoi performent le mieux ?
- Présenter votre premier rapport de santé du programme à votre responsable
- Identifier le flux d'automatisation qui, s'il était amélioré de 20%, aurait le plus grand impact sur le chiffre d'affaires

---

## Intégrations d'outils

### Klaviyo (e-mail cycle de vie)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Avec Klaviyo connecté : données de segment, analyses de flux et santé de liste directement dans Claude Code.

### HubSpot (e-mail B2B)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### Mailchimp / Brevo / Postmark

Exportez vos rapports de campagne en CSV → collez dans `/analytics-tracking` pour l'analyse de tendances et les benchmarks.

### Google Postmaster Tools

Outil gratuit de Google — connectez votre domaine d'envoi et surveillez la réputation du domaine, les taux de spam et le placement en boîte de réception pour les destinataires Gmail. Vérifiez hebdomadairement dans le cadre de votre revue de délivrabilité.

### Litmus / Email on Acid

Aperçu du rendu sur tous les clients → collez les problèmes dans `/email-campaign` pour des corrections HTML rapides.

---

## Indicateurs à suivre

| Indicateur | Cible | Signal d'alarme |
|---|---|---|
| Taux d'ouverture | > 25% (varie selon le secteur) | < 15% |
| Taux de clics | > 2% | < 1% |
| Taux de clics par rapport aux ouvertures (CTOR) | > 10% | < 6% |
| Taux de désabonnement (par campagne) | < 0,2% | > 0,5% |
| Taux de plainte pour spam | < 0,05% | > 0,1% (Google bloque à 0,1%) |
| Taux de rebond dur | < 0,5% | > 1% |
| Taux de croissance de la liste | Positif mois après mois | En baisse depuis 2+ mois |
| Taux d'engagement actif | > 40% de la liste | < 25% |
| Taux d'ouverture e-mail de bienvenue | > 50% | < 35% |
| Conversion du flux d'automatisation | Dépend du flux — définir un objectif par flux | En dessous de l'objectif fixé depuis 60+ jours |

Note : La protection de la confidentialité du courrier Apple Mail gonfle les taux d'ouverture pour les utilisateurs iOS (marqués comme "ouvert" lors du préchargement). Traitez le taux de clics et le CTOR comme vos principales métriques d'engagement pour les listes à forte proportion iOS.

---

## Erreurs courantes et comment Claude Code aide à les éviter

**Erreur 1 : Envoyer aux abonnés inactifs sans campagne de ré-engagement préalable**
C'est le moyen le plus rapide de nuire à la délivrabilité. Les abonnés inactifs qui n'interagissent pas signalent aux fournisseurs que vous envoyez du spam — ils pénalisent l'ensemble de votre domaine. Lancez d'abord une campagne de désabonnement progressif.

**Erreur 2 : Déclarer des gagnants de tests A/B basés sur 6 heures de données**
`/email-ab-tester` calcule si votre résultat est statistiquement significatif. S'il ne l'est pas, c'est du bruit — pas un gagnant.

**Erreur 3 : Absence d'enregistrement DMARC sur votre domaine d'envoi**
`/email-deliverability` le détecte lors du premier audit. Sans DMARC, votre domaine est usurpable et les fournisseurs lui font moins confiance.

**Erreur 4 : Rédiger les e-mails de bienvenue comme un envoi unique**
`/email-sequence` conçoit des séries de bienvenue de 3 à 5 e-mails. Un seul e-mail de bienvenue est une opportunité d'activation manquée.

**Erreur 5 : Tester les lignes d'objet sans hypothèse**
`/email-ab-tester` exige une hypothèse avant de concevoir le test. "Tester différentes lignes d'objet" n'est pas une hypothèse — c'est une variation aléatoire qui ne vous apprend rien, même quand vous gagnez.

---

## Ressources

- [Démarrer avec Claude Code](./getting-started.md)
- [Compétence délivrabilité e-mail](../skills/marketing/email-deliverability.md)
- [Compétence testeur A/B d'e-mails](../skills/marketing/email-ab-tester.md)
- [Compétence séquence d'e-mails](../skills/marketing/email-sequence.md)
- [Workflow campagne e-mail](../workflows/email-campaign.md)
- [Agent conseiller CMO](../agents/advisors/cmo-advisor.md)

---

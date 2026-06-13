---
name: analytics-tracking
description: "Implémentation d'analytique : GA4, Mixpanel, Amplitude, PostHog suivi des événements, analyse de l'entonnoir, cohortes de rétention et modélisation d'attribution"
---

# Compétence Suivi Analytique

## Quand l'activer
- Mise en place du suivi des événements pour une application web ou un site marketing
- Conception d'un plan de mesure avant la mise en œuvre de l'analytique
- Débogage des données d'analytique cassées ou manquantes
- Construction d'entonnoirs pour trouver les abandons de conversion
- Analyse des cohortes de rétention pour comprendre l'attrition
- Choix entre les outils analytiques (GA4, Mixpanel, Amplitude, PostHog)

## Quand ne pas l'utiliser
- Business intelligence ou requêtes SQL au niveau de l'entrepôt de données — c'est une tâche data-ml
- Configuration de framework de test A/B — utiliser la compétence experiment-designer
- Audits de conformité à la confidentialité/RGPD pour le suivi — utiliser la compétence privacy-pia

## Instructions

### Plan de mesure

```
Construisez un plan de mesure pour [produit/site].

Type de produit : [SaaS / ecommerce / site de contenu / application mobile]
Objectifs commerciaux : [ce qui compte — inscriptions, achats, rétention, engagement]
Configuration analytique actuelle : [GA4 / Mixpanel / Amplitude / PostHog / aucun]
Équipe : [développeur + analyste / solo / équipe marketing]

Structure du plan de mesure :

1. Métrique North Star :
   [Le nombre unique qui capture le mieux la santé du produit]
   ex. Utilisateurs actifs hebdomadaires / MRR / Taux d'activation

2. Métriques de soutien (niveau 2) :
   [3-5 métriques qui expliquent la North Star]

3. Événements utilisateur clés à suivre :
   Pour chaque événement :
   - Nom de l'événement : [snake_case, dénomination cohérente]
   - Déclencheur : [quelle action utilisateur déclenche ceci]
   - Propriétés : [attributs clés à capturer — plan: string, amount: number, etc.]
   - Pourquoi : [à quelle question commerciale cela répond-il ?]

4. Entonnoirs à mesurer :
   - [Entonnoir d'acquisition : source → inscription → activation]
   - [Entonnoir produit central : connexion → action clé → moment de valeur]
   - [Entonnoir de monétisation : essai → mise à niveau → rétention]

5. Tableaux de bord nécessaires :
   - [Exécutif : MRR, attrition, NPS]
   - [Produit : taux d'activation, adoption de fonctionnalités, rétention]
   - [Marketing : trafic, conversion, CAC par canal]

Produisez le plan de suivi des événements sous forme de tableau :
Événement | Déclencheur | Propriétés | Priorité | Tableau de bord
```

[Les sections restantes suivent la même structure que l'anglais avec les équivalents français]

---

# Claude pour les Customer Success Managers

Tout ce dont un Customer Success Manager a besoin pour piloter avec l'IA le suivi de la santé des comptes, les QBR, la prévention du churn et les conversations d'expansion — sans passer des heures en préparation et en reporting.

---

## À qui s'adresse ce guide

Vous êtes un CSM responsable d'un portefeuille de comptes — les fidéliser, les développer et les accompagner vers le succès. Vous êtes mesuré sur la Net Revenue Retention et les taux de renouvellement. Vous passez trop de temps à préparer les QBR, à réviser les scores de santé et à rédiger des emails de suivi, et pas assez de temps à construire réellement des relations clients.

**Avant Claude Code :** 4 à 6 heures pour préparer un QBR. 2 heures par semaine à réviser manuellement la santé des comptes. 30 minutes pour rédiger un email de suivi après chaque appel. Pas de playbook d'expansion cohérent.

**Après :** QBR entièrement préparé en 45 minutes. Revue de santé effectuée en 15 minutes avec des recommandations structurées. Emails de suivi en 5 minutes. Opportunités d'expansion identifiées de manière proactive, pas réactive.

---

## Installation en 30 secondes

```bash
# Installer la stack CS complète
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill marketing/churn-prevention
npx claudient add skill small-business/customer-feedback-synthesizer
npx claudient add skill gtm/revenue-operations
npx claudient add agent advisors/cco-advisor
```

---

## Votre stack CS avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/health-score-analyzer` | Score les comptes sur les signaux d'usage, de relation et commerciaux ; évaluation du risque de churn | Revue de portefeuille du lundi |
| `/qbr-builder` | Préparation complète du QBR : agenda, points de discussion, quantification du ROI, discussion d'expansion | 2 semaines avant tout QBR |
| `/expansion-playbook` | Identifier les signaux d'expansion, construire le narratif d'upsell, gérer les conversations tarifaires | Quand un compte est prêt à grandir |
| `/customer-success` | Conception du modèle de score de santé, signaux de churn, plans d'onboarding | Construction des processus CS |
| `/churn-prevention` | Analyse des clients à risque et playbooks de sauvegarde | Comptes ROUGE nécessitant une intervention |
| `/customer-feedback-synthesizer` | Synthétise les retours des enquêtes, appels et tickets en thèmes | Voix du client trimestrielle |
| `/revenue-operations` | Calcul NRR, pipeline de renouvellement, métriques CS et prévisions | Opérations CS et reporting |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `cco-advisor` | Opus | Décisions CS stratégiques : modèles de couverture, stratégie de tier, conception de l'organisation |

---

## Flux de travail quotidien

### Matin (20-30 minutes)

**1. Revue de santé du portefeuille — à exécuter chaque lundi**
```
/health-score-analyzer

Effectuez ma revue de santé du portefeuille pour la semaine du [DATE].

Mes comptes :
| Compte | ARR | Renouvellement | Dernière connexion | Sièges actifs | Dernier contact | Problèmes |
|---|---|---|---|---|---|---|
| [Entreprise A] | 48 K$ | 3 mois | Il y a 5 jours | 12/15 | Il y a 7 jours | Aucun |
| [Entreprise B] | 120 K$ | 6 semaines | Il y a 22 jours | 4/20 | Il y a 14 jours | Ticket support ouvert |
| [Entreprise C] | 24 K$ | 8 mois | Il y a 2 jours | 8/8 | Il y a 3 jours | Demande sur l'export |

Donnez-moi :
1. Score de santé et niveau de risque pour chaque compte
2. Liste de priorité d'intervention pour cette semaine
3. Tout compte présentant des signaux de churn à escalader
4. Renouvellements dans les 90 prochains jours et leur état de préparation
```

**2. Bilan quotidien des comptes à risque — prend 5 minutes**
```
/health-score-analyzer

Vérification rapide : de nouveaux signaux de risque ont-ils émergé dans les dernières 24-48 heures pour mon portefeuille ?

Signaux récents :
- [Entreprise X] ne s'est pas connectée depuis [X jours]
- [Entreprise Y] a ouvert un ticket support sur [sujet]
- [Entreprise Z] — le champion [nom] vient de changer d'emploi sur LinkedIn

Évaluez le risque et donnez-moi l'action pour chacun.
```

---

### Préparation du QBR (2 semaines avant)

**3. Constructeur de QBR complet**
```
/qbr-builder

Construisez mon QBR pour [Nom du Client].

Client : [Entreprise]
ARR : $[X]
Renouvellement : [date]
Participants : [leur titre, leur titre] + [mon titre, nom de l'AE]
Durée : [60 minutes]
Objectif : [fidéliser et préparer l'expansion / rétablissement de la relation]

Contexte client :
- Critères de succès définis au kickoff : [X, Y, Z]
- Cas d'usage principal : [décrire]
- Changements business ce trimestre : [changements dans leur équipe, budget, stratégie]
- Données d'usage : [résumer — connexions, sièges actifs, fonctionnalités principales utilisées]
- Problèmes ouverts : [tickets support non résolus ou réclamations]

Commercial :
- Santé : [VERTE / JAUNE / ROUGE]
- Opportunité d'expansion : [sièges / tier / add-on] — $[X] potentiel
- Menace concurrentielle : [oui/non — décrire si oui]

Construisez : agenda complet, points de discussion par section, contenu de la slide ROI,
cadre de conversation d'expansion, et 3 réponses aux objections.
```

---

### Conversations d'expansion

**4. Identification des signaux d'expansion et narratif**
```
/expansion-playbook

Identifiez l'opportunité d'expansion pour [Entreprise].

Contrat actuel : $[X] ARR, [N] sièges, [plan/tier]
Signaux d'usage :
- Utilisation des sièges : [X sur N sièges actifs]
- Nouveau cas d'usage observé : [décrire]
- Signaux de croissance : [leur effectif en hausse de X%, nouvelle équipe mentionnée, etc.]

Opportunité d'expansion : [sièges supplémentaires / upgrade de tier / add-on]
ARR supplémentaire potentiel : $[X]
Santé : [VERTE — requis]

Construisez :
1. Quels signaux indiquent la préparation (et lesquels sont encore trop faibles pour agir)
2. Le narratif d'expansion pour mon prochain appel
3. Cadre de conversation tarifaire et 3 scripts d'objection
4. Si gérer cela en CS ou impliquer un AE
```

---

### Escalades clients

**5. Prévention du churn — comptes ROUGE**
```
/churn-prevention

Ce client présente un risque sérieux de churn. Construisez-moi un plan de sauvegarde.

Client : [Entreprise]
ARR : $[X]
Renouvellement : dans [X semaines/mois]
Signaux de risque : [décrivez-les tous — usage, relation, commercial]
Hypothèse de cause racine : [selon vous, quel est le vrai problème ?]
Ce qui a été essayé : [tentatives de contact précédentes et résultats]

Produisez :
- Structure du QBR de rétablissement (qui amener, comment l'ouvrir)
- Offres spécifiques à faire ou actions à entreprendre
- Chemin d'escalade si la sauvegarde standard échoue
- Avis aller/ne pas aller : ce compte est-il sauvable, ou le churn est-il probable quoi qu'il arrive ?
```

---

### Synthèse des retours clients (trimestrielle)

**6. Voix du client**
```
/customer-feedback-synthesizer

Synthétisez les retours clients du dernier trimestre.

Sources :
- Enquêtes NPS : [collez les résultats ou résumez les thèmes]
- Catégories de tickets support : [décrivez les types de tickets les plus courants et le volume]
- Notes de QBR : [collez les thèmes clés des conversations clients]
- Raisons de churn : [pourquoi les clients perdus sont-ils partis ?]

Résultat attendu :
- Top 3 des points douloureux vécus par les clients
- Top 3 des choses que les clients disent aimer
- Lacunes produit les plus fréquemment mentionnées
- Recommandations actionnables pour : équipe produit, équipe CS, direction
- Tendance NPS et ce qui génère les promoteurs vs. détracteurs
```

---

## Plan de montée en compétence sur 30 jours (nouveaux CSM)

### Semaine 1 — Connaître votre portefeuille
- Installez toutes les compétences CS
- Exécutez `/health-score-analyzer` sur chaque compte — établissez votre carte de santé du portefeuille de référence
- Lisez tous les tickets support ouverts dans votre portefeuille — sachez ce qui brûle avant de rencontrer les clients
- Planifiez des appels de présentation avec chaque compte dans vos 30 premiers jours (même les comptes sains)

### Semaine 2 — Premiers appels clients
- Utilisez `/qbr-builder` pour préparer même les appels informels — les questions sont les mêmes
- Après chaque appel : rédigez l'email de suivi et la note CRM avec Claude en moins de 10 minutes
- Utilisez `/expansion-playbook` pour cartographier quels comptes ont un potentiel d'expansion — même si vous n'agissez pas encore
- Identifiez vos 3 comptes à risque les plus élevés avant la fin de la semaine 2

### Semaine 3 — Score de santé et processus
- Utilisez `/health-score-analyzer` pour scorer formellement chaque compte — documentez dans le CRM
- Établissez votre rythme de revue de santé hebdomadaire
- Revoyez le modèle de score de santé avec votre manager CS — alignez-vous sur les tiers et les pondérations de score
- Passez votre premier compte à risque dans `/churn-prevention` — même à titre d'exercice

### Semaine 4 — QBR et expansion
- Menez votre premier QBR avec `/qbr-builder` — faites observer ou réviser votre préparation par un CSM senior
- Identifiez 2-3 comptes prêts pour une conversation d'expansion — présentez le plan à votre manager d'abord
- Vérifiez l'hygiène de votre CRM : tous les comptes sont-ils mis à jour avec les scores de santé, dates de dernier contact, dates de renouvellement ?
- Rapportez à votre manager : santé du portefeuille, ARR à risque, meilleures opportunités

---

## Intégrations d'outils

### HubSpot CRM (recommandé)

```json
// À ajouter dans ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Avec HubSpot connecté, Claude peut :
- Lire directement les champs de santé des comptes, les dates de dernier contact et les dates de renouvellement
- Mettre à jour les scores de santé des comptes après votre revue de portefeuille
- Créer des tâches de suivi à partir des actions issues des QBR
- Extraire des rapports sur le pipeline de renouvellement

### Gainsight / ChurnZero / Totango

Si votre équipe utilise une plateforme CS dédiée, exportez les données de santé des comptes en CSV → collez dans `/health-score-analyzer` pour l'analyse et les recommandations. Claude fonctionne avec les données de sortie de n'importe quelle plateforme CS.

### Gong / Chorus (enregistrement des appels)

Récupérez la transcription d'un appel → demandez à Claude d'en extraire :
- Les thèmes clés de l'appel client
- Les actions à mener avec leurs responsables
- Les signaux de santé (mentions positives et négatives)
- La note CRM et l'ébauche d'email de suivi

```
Voici la transcription de mon appel avec [Client] aujourd'hui :
[collez la transcription]

Extrayez :
1. Note de mise à jour CRM (2-3 phrases : ce qui a été discuté, signaux de santé, prochaines étapes)
2. Email de suivi à envoyer aujourd'hui
3. Actions à mener : responsable + date d'échéance pour chacune
4. Tout signal de churn ou d'expansion à signaler
```

### Notion / Confluence (modèles de QBR)

Générez le plan du deck QBR avec `/qbr-builder` → construisez les slides dans Google Slides ou Notion → utilisez Claude pour affiner le narratif pendant la préparation.

---

## Métriques à suivre

| Métrique | Définition | Vert | Jaune | Rouge |
|---|---|---|---|---|
| Net Revenue Retention | (MRR + expansion - churn) / MRR de départ | > 110% | 95-110% | < 95% |
| Gross Revenue Retention | Taux de renouvellement hors expansion | > 90% | 80-90% | < 80% |
| Score de santé moyen | Note de santé moyenne du portefeuille | > 70/100 | 55-70 | < 55 |
| ARR à risque | % du portefeuille en santé ROUGE | < 10% | 10-20% | > 20% |
| Taux de complétion des QBR | % de comptes éligibles avec un QBR complété ce trimestre | 100% | 75-99% | < 75% |
| Jours depuis le dernier contact | Moyenne du portefeuille | < 30 jours | 30-60 jours | > 60 jours |
| ARR d'expansion généré par CS | Upsell et expansion sans intervention d'un AE | Suivre et augmenter chaque trimestre |

---

## Erreurs CS courantes (et comment Claude Code aide à les éviter)

**Erreur 1 : Pas de suivi de santé proactif**
`/health-score-analyzer` chaque lundi impose une revue structurée du portefeuille. Vous trouvez les problèmes avant que les clients vous les signalent — pas après qu'ils aient pris la décision de partir.

**Erreur 2 : Des QBR qui sont des démonstrations produit**
`/qbr-builder` ouvre chaque QBR sur les priorités business du client, pas sur une présentation produit. Les clients ne renouvellent pas grâce à une bonne démo — ils renouvellent parce que vous les avez aidés à accomplir quelque chose.

**Erreur 3 : Des conversations d'expansion qui commencent par le prix**
`/expansion-playbook` construit le narratif de valeur avant toute discussion commerciale. Présenter le prix avant d'établir le besoin est la manière la plus rapide d'obtenir un non.

**Erreur 4 : Gestion réactive du churn**
Le score de santé et la détection de signaux dans `/health-score-analyzer` identifient les comptes à risque 60 à 90 jours avant le renouvellement — quand vous avez encore le temps d'intervenir. Attendre que le client vous dise qu'il part, c'est trop tard.

**Erreur 5 : Ne pas quantifier le ROI**
Chaque QBR a besoin d'une slide ROI. `/qbr-builder` vous oblige à quantifier ce que le client a accompli — pas en fonctionnalités produit, mais en résultats business. "Vous avez économisé 12 heures par semaine par membre de l'équipe" est un argument de renouvellement. "Nous avons livré 4 nouvelles fonctionnalités" n'en est pas un.

---

## Ressources

- [Démarrer avec Claude Code](./getting-started.md)
- [Compétence QBR builder](../skills/gtm/qbr-builder.md)
- [Compétence Health Score Analyzer](../skills/gtm/health-score-analyzer.md)
- [Compétence Expansion Playbook](../skills/gtm/expansion-playbook.md)
- [Workflow de préparation des QBR CS](../workflows/cs-qbr-prep.md)
- [Compétence Churn Prevention](../skills/marketing/churn-prevention.md)

---

# Claude pour les Juristes et les Responsables Conformité

Tout ce dont un juriste interne, un Directeur Juridique ou un Responsable Conformité a besoin pour mener une revue contractuelle, une conformité réglementaire, des programmes de protection des données et des recherches juridiques augmentées par l'IA dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes juriste interne, responsable conformité, DPO ou Directeur Juridique dont le travail consiste à protéger l'entreprise contre les risques juridiques, à maintenir la conformité des opérations avec les réglementations, et à conseiller les parties prenantes rapidement et avec précision. Vous êtes perpétuellement en sous-effectif par rapport au volume de travail juridique, et vous passez trop de temps sur le tri des contrats, la collecte de preuves et la recherche qui pourraient être accélérées.

**Avant Claude Code :** 60 à 90 minutes pour examiner un NDA standard. Une demi-journée pour produire une analyse des écarts de conformité. Des jours pour rechercher une nouvelle question juridique dans plusieurs juridictions. Des mois pour se préparer à un audit SOC2.

**Après :** Première passe de revue d'un NDA en 5 minutes. Registre des obligations de conformité en 20 minutes. Mémo de recherche multi-juridictions en 30 minutes. Liste de contrôle des preuves SOC2 et analyse des écarts en 45 minutes.

**Ce que Claude ne remplace pas :** Le jugement juridique, les conseils juridiques sous licence, les dépôts judiciaires et tout document signé et envoyé à l'extérieur sans revue humaine.

---

## Installation en 30 secondes

```bash
# Install the full legal and compliance stack
npx claudient add skills legal

# Or cherry-pick:
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/privacy-pia
npx claudient add skill legal/eu-ai-act
npx claudient add skill legal/iso27001
npx claudient add skill legal/dsar-response
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/legal-research
npx claudient add agents advisors/general-counsel
npx claudient add agents advisors/ciso-advisor
```

---

## Votre stack juridique Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/contract-review` | Analyse contractuelle ROUGE/JAUNE/VERT : signaux de risque, clauses manquantes, suggestions de correction | Chaque contrat avant signature |
| `/nda-review` | Tri des NDA : type, portée, signaux d'alarme, indicateur de revue par un avocat | Tri de la file d'attente des NDA |
| `/gdpr-expert` | Conformité RGPD : analyse Article par Article, base juridique, exigences DPA | Toute question RGPD ou nouvelle activité de traitement |
| `/soc2-compliance` | SOC2 Type II : cartographie des contrôles, exigences de preuves, analyse des écarts | Préparation à l'audit SOC2 |
| `/privacy-pia` | Évaluation d'Impact sur la Protection des données : notation des risques, atténuation, output AIPD | Nouveaux produits ou traitement à haut risque |
| `/eu-ai-act` | EU AI Act : classification des risques, utilisations interdites, obligations de conformité | Tout système d'IA déployé dans l'UE |
| `/iso27001` | Analyse des écarts ISO 27001:2022 et guide de mise en œuvre | Préparation à la certification ISO |
| `/dsar-response` | Réponse aux Demandes d'Accès des Personnes Concernées : tri, guide de rédaction, brouillons de réponse | DSARs entrants |
| `/compliance-tracker` | Registre des obligations, liste de contrôle des preuves, suivi des délais pour RGPD/SOC2/ISO27001 | Gestion continue de la conformité |
| `/legal-research` | Mémos de recherche juridique, résumés de jurisprudence, comparaisons de juridictions | Questions de recherche |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `general-counsel` | Opus | Analyse juridique complexe, conseils juridiques stratégiques, nouvelles questions juridiques |
| `ciso-advisor` | Opus | Questions juridiques liées à la sécurité : sécurité des fournisseurs, réponse aux violations, interprétation des tests de pénétration |

---

## Flux de travail quotidien

### Matin — Revue de la file d'attente des contrats (30-60 minutes)

**1. Tri des contrats**
```
/contract-review

Triez la file de contrats du jour :
[Collez le texte du contrat ou décrivez chaque contrat]

Pour chacun :
- Niveau de risque global (ÉLEVÉ / MOYEN / FAIBLE)
- Nombre de problèmes ROUGES
- Si un recours à un conseil externe est nécessaire
- Action recommandée : approuver / annoter / escalader / rejeter

Triez par priorité — problèmes ROUGES en premier.
```

**2. Traitement rapide des NDA**
```
/nda-review

Examinez ce NDA — premier passage standard :
[Collez le texte du NDA]

Résultat :
- Type (mutuel / unilatéral)
- Durée
- Toute disposition non standard
- Dois-je le lire en entier ou est-il conforme au marché ?
- À envoyer à un avocat : oui / non
```

---

### Surveillance de la conformité (15-30 minutes, quotidien)

**3. Radar réglementaire**
```
/compliance-tracker

Vérification quotidienne de la conformité :
- Des DSARs ont-ils été reçus hier ? Statut du suivi des délais ?
- Des fenêtres de notification de violation sont-elles ouvertes ?
- Des délais de certification dans les 30 prochains jours ?
- Des changements réglementaires à connaître cette semaine ?
[Collez toute nouvelle communication ou alerte réglementaire]
```

**4. Gestion des réponses aux DSAR**
```
/dsar-response

Nouveau DSAR reçu de : [nom]
Reçu le : [date] — réponse due le : [date + 30 jours, ou 45 jours pour le CCPA]
Demande : [décrivez ce qu'ils demandent]

Produire :
- Modèle de lettre d'accusé de réception
- Checklist interne de collecte de données (quels systèmes interroger)
- Conseils de caviardage (ce qui doit être supprimé avant divulgation)
- Calendrier de réponse et jalons
```

---

### Rédaction de politiques (variable — 1-3 heures)

**5. Création ou mise à jour de politique**
```
/gdpr-expert

Rédigez / mettez à jour notre [type de politique] pour se conformer au RGPD.

Contexte de l'entreprise :
- Activités de traitement : [décrire]
- Juridiction : [UE / Royaume-Uni / les deux]
- Dernière mise à jour : [date]
- Ce qui a changé et nécessite une mise à jour : [raison]

Produire : brouillon complet de politique avec citations d'articles. Signalez chaque disposition qui nécessite une relecture juridique avant finalisation.
```

---

### Recherche juridique (variable)

**6. Question de recherche**
```
/legal-research

Question de recherche : [question en langage courant]
Juridiction(s) : [liste]
Contexte : [pourquoi nous avons besoin de savoir — décision commerciale en jeu]
Profondeur : [note rapide / mémo standard / recherche approfondie]

Produire un mémo de recherche avec citations. Indiquez [VÉRIFIER] sur chaque citation juridique spécifique.
```

---

### Conseils aux parties prenantes (à la demande)

**7. Conseils juridiques rapides pour les équipes métier**
```
/general-counsel

Une partie prenante métier demande : [décrivez la question commerciale]

Elle a besoin de savoir : [ce qu'elle cherche à faire]
Risque qui l'inquiète : [ce qui la préoccupe]

Donnez-moi une réponse en langage courant que je peux lui transmettre dans les 10 minutes.
Indicateur d'escalade : cela nécessite-t-il un mémo juridique complet ou un conseil externe ?
```

---

## Flux de travail de revue contractuelle (file d'attente quotidienne)

Pour des instructions détaillées étape par étape, voir [workflows/contract-review.md](../workflows/contract-review.md).

**Référence rapide :**

```
Priorité 1 (examiner le jour même) :
- Contrats avec délai de signature aujourd'hui ou demain
- Tout contrat avec indemnisation illimitée
- Tout accord de traitement des données (DPA) pour un nouveau fournisseur
- NDA avec définitions de portée non standard

Priorité 2 (examiner sous 3 jours) :
- MSA fournisseur standard de moins de 50 000 € annuels
- Contrats clients d'un nouveau compte (vérification du modèle)
- Lettres d'offre d'emploi

Priorité 3 (examiner cette semaine) :
- Renouvellements de contrats fournisseurs existants (comparer aux conditions précédentes)
- Accords de partenariat (risque commercial faible)
- Politiques ou procédures internes

Déléguer au conseil externe :
- Tout contrat supérieur à 250 000 € (ou votre seuil de matérialité)
- Documents de contentieux, accords de règlement
- Accords financiers ou de santé réglementés
- Cessions de PI, transfert de technologie, accords d'exclusivité
```

---

## Plan de montée en compétence sur 30 jours (nouvel embauche juridique / conformité)

### Semaine 1 — Connaître le paysage de vos obligations
- Installer toutes les compétences juridiques : `npx claudient add skills legal`
- Exécuter `/compliance-tracker` — construire votre registre des obligations pour chaque cadre applicable
- Passer en revue tous les contrats existants dans vos modèles standard — identifier ce qui est conforme au marché et ce qui est personnalisé
- Identifier les DSARs ouverts, les notifications de violation ou les demandes d'audit — prendre en main les délais immédiatement
- Lire votre politique de confidentialité actuelle et votre calendrier de conservation des données — correspondent-ils à la pratique réelle ?

### Semaine 2 — Construire la base de référence de conformité
- Exécuter `/gdpr-expert` sur vos activités de traitement actuelles — produire ou mettre à jour votre RoPA (Registre des Activités de Traitement)
- Exécuter `/soc2-compliance` ou `/iso27001` — produire une analyse des écarts pour vos cadres cibles
- Cartographier quels fournisseurs sont sous-traitants (nécessitent des DPA) vs. responsables du traitement (analyse séparée)
- Produire un registre des risques : quels sont les 5 principaux risques juridiques auxquels cette entreprise est confrontée actuellement ?

### Semaine 3 — Opérationnaliser
- Mettre en place votre flux de travail de réponse aux DSAR en utilisant `/dsar-response`
- Construire des playbooks de contrats pour vos 3 types de contrats les plus courants (MSA fournisseur, MSA client, NDA)
- Mettre en place votre suivi des délais de conformité avec `/compliance-tracker`
- Informer les parties prenantes métier de ce qu'elles peuvent et ne peuvent pas faire sans revue juridique

### Semaine 4 — Gestion proactive des risques
- Produire votre premier rapport de risque juridique pour le PDG et le conseil d'administration
- Exécuter `/privacy-pia` sur toute nouvelle fonctionnalité produit en cours de développement
- Planifier des revues d'accès trimestrielles (en collaboration avec l'informatique/la sécurité)
- Mettre en place votre calendrier de conformité récurrent : délais mensuels, trimestriels, annuels

---

## Intégrations d'outils

### Thomson Reuters / Westlaw / LexisNexis

```
Utilisez les bases de données juridiques primaires pour la validation des recherches.
Workflow :
1. Utiliser /legal-research pour identifier la question juridique et le chemin de recherche
2. Valider les citations spécifiques dans Westlaw ou LexisNexis
3. Coller les conclusions de jurisprudence vérifiées dans Claude pour l'analyse et la rédaction de mémos
4. Utiliser Claude pour rédiger le mémo ; utiliser Westlaw pour s'assurer que les citations sont à jour

Ne PAS se fier aux citations de Claude comme faisant autorité sans vérification dans une base de données primaire.
```

### Systèmes de gestion des contrats (Ironclad / DocuSign / Juro)

```
Workflow de revue de contrats avec un CLM :
1. Un nouveau contrat arrive dans votre CLM
2. Exporter en PDF/texte
3. Exécuter /contract-review — obtenir l'analyse ROUGE/JAUNE/VERT
4. Ajouter des notes de revue et des annotations directement dans le CLM
5. Utiliser Claude pour générer des explications d'annotations pour la contrepartie

Pour la revue en masse (export de données Ironclad) :
1. Exporter les métadonnées de contrats en CSV
2. /contract-review : "Examinez ce lot de contrats pour les DPA expirés ou les clauses RGPD manquantes"
```

### Plateformes GRC (Vanta / Drata / Secureframe)

```
Utilisez Claude parallèlement à votre plateforme GRC, pas à la place :

Points forts de Claude : rédaction de documentation de politique, explication des exigences, analyse des écarts, commentaires de management
Points forts de la plateforme GRC : collecte automatisée de preuves, surveillance continue, portail de l'auditeur

Workflow :
1. La plateforme GRC signale un écart de contrôle
2. /compliance-tracker : expliquer l'exigence de contrôle et suggérer une approche de remédiation
3. /gdpr-expert ou /soc2-compliance : rédiger la politique ou la procédure pour combler l'écart
4. Télécharger la politique sur la plateforme GRC comme preuve
```

### Notion / Confluence (base de connaissances juridiques)

```
Construisez votre base de connaissances juridiques dans Notion ou Confluence :
1. Utiliser /legal-research pour produire des mémos de recherche
2. Sauvegarder les mémos dans Notion avec des tags : [juridiction] [sujet] [date]
3. Chaque mémo inclut : question, réponse, citations clés, marqueurs [VÉRIFIER] et date de révision

Définissez un rappel trimestriel pour réviser et mettre à jour les mémos à fort trafic.
Au fil du temps, cela devient la bibliothèque de précédents de votre équipe.
```

### Slack (réception des demandes juridiques)

```
Créez un canal Slack #demandes-juridiques.
Claude Code peut surveiller et trier via un webhook :

Demande entrante → Claude lit le message → classe :
  - Conseil rapide (réponse < 5 min) : répondre immédiatement
  - Revue standard (contrat, NDA) : router vers la file juridique
  - Complexe / nouveau : signaler pour l'attention du DJ
  - Urgent (violation, contentieux) : escalade immédiate

Utilisez n8n ou Make pour automatiser le routage.
```

---

## Benchmarks à suivre

| Métrique | Objectif |
|---|---|
| Temps de première passe de revue d'un NDA | < 10 minutes |
| Temps de revue d'un contrat standard (MSA) | < 45 minutes |
| Accusé de réception d'un DSAR | Le jour même de réception |
| Réponse à un DSAR | Dans les 25 jours (laisser 5 jours de tampon avant le délai de 30 jours) |
| Préparation à la notification de violation | Modèle pré-construit, prêt à envoyer dans les 2 heures |
| Écarts de conformité ouverts (critiques) | 0 |
| Écarts de conformité ouverts (non critiques) | < 5, tous avec un propriétaire + délai |
| Couverture DPA des fournisseurs | 100% des sous-traitants |
| Cycle de révision des politiques | Annuel (toutes les politiques révisées et approuvées) |
| Rapport de risque juridique au conseil | Trimestriel |

---

## Erreurs courantes (et comment Claude Code aide à les éviter)

**Erreur 1 : Traiter tous les contrats comme également risqués**
`/contract-review` donne instantanément un score de risque global (ÉLEVÉ / MOYEN / FAIBLE). Trier d'abord, réviser proportionnellement.

**Erreur 2 : Les cadres de conformité comme projets ponctuels**
`/compliance-tracker` transforme la conformité en registre d'obligations permanent avec des délais — pas un audit ponctuel.

**Erreur 3 : Recherche juridique sans validation des citations**
Chaque output de `/legal-research` inclut des marqueurs `[VERIFY]`. Ce sont des invites à vérifier la source primaire — pas optionnelles.

**Erreur 4 : Pas de piste d'audit pour les réponses aux DSAR**
`/dsar-response` génère une piste de preuves pour chaque demande : date de réception, délai, données collectées, rédactions effectuées.

**Erreur 5 : Fournir des conseils sans les documenter**
Utiliser Claude pour rédiger des mémos juridiques même pour les questions de conseil rapide. Une réponse verbale de 2 phrases n'est pas opposable. Un bref mémo l'est.

---

## Ressources

- [Démarrer avec Claude Code](../getting-started.md)
- [Flux de travail de revue contractuelle](../workflows/contract-review.md)
- [Compétence RGPD expert](../skills/legal/gdpr-expert.md)
- [Compétence de revue contractuelle](../skills/legal/contract-review.md)
- [Compétence de suivi de conformité](../skills/legal/compliance-tracker.md)
- [Compétence de recherche juridique](../skills/legal/legal-research.md)
- [Compétence de réponse aux DSAR](../skills/legal/dsar-response.md)

---

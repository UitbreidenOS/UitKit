---
name: compliance-tracker
description: "Suivre les obligations réglementaires, les échéances et les exigences de preuves pour GDPR, SOC2, ISO27001"
---

# Compétence : Suivi de la Conformité

## Quand activer
- Construire ou auditer un registre d'obligations de conformité couvrant plusieurs référentiels
- Suivre les délais de collecte de preuves pour les audits SOC2, ISO 27001 ou GDPR
- Cartographier les contrôles applicables à chaque référentiel afin d'éviter le travail en double
- Surveiller les échéances réglementaires (fenêtres de réponse aux DSAR, délais de notification de violation, renouvellements de certifications)
- Intégrer un nouveau responsable conformité et dresser l'inventaire des obligations en cours
- Se préparer pour un audit et réaliser une analyse des écarts par rapport aux preuves requises

## Quand NE PAS utiliser
- Conseils juridiques propres à une juridiction — cette compétence identifie les obligations, un avocat les interprète
- Veille réglementaire en temps réel — Claude travaille à partir de référentiels connus, pas de flux législatifs en direct
- Préparation de documents de soumission réels — il s'agit d'un outil de suivi et de planification
- Remplacement d'une plateforme GRC (Vanta, Drata, Secureframe) — utilisez ces outils pour la collecte automatisée de preuves

## IMPORTANT

Les exigences de conformité évoluent. Toutes les listes d'obligations doivent être vérifiées par rapport à la version actuelle de chaque norme (GDPR : tel qu'amendé ; SOC2 : critères de services de confiance AICPA 2017 ; ISO 27001 : ISO/IEC 27001:2022). Validez toujours ces résultats auprès de votre conseiller juridique et de vos auditeurs externes avant de les considérer comme définitifs.

## Instructions

### Invite pour le registre d'obligations

```
Construire un registre d'obligations de conformité pour [ENTREPRISE].

Contexte de l'entreprise :
- Secteur : [secteur]
- Juridictions : [liste — ex. UE/EEE, Royaume-Uni, États-Unis, Californie]
- Types de données traitées : [données personnelles / données financières / données de santé / etc.]
- Modèle économique : [SaaS / marketplace / services / etc.]
- Référentiels applicables : [GDPR / UK GDPR / SOC2 Type II / ISO 27001 / CCPA / HIPAA / PCI-DSS]
- Certifications actuelles : [liste avec dates d'expiration, ou "aucune"]
- Chiffre d'affaires annuel (pour les seuils de matérialité) : [optionnel]

Produire un registre d'obligations avec :

Pour chaque référentiel :
1. Obligations clés (condensées — ce que vous devez faire, pas le texte réglementaire complet)
2. Type de preuve requis (politique / enregistrement / journal / audit / rapport)
3. Responsable désigné (fonction, pas nom)
4. Fréquence (continue / annuelle / par événement / par demande)
5. Échéance ou SLA (lorsque limité dans le temps)
6. Statut actuel : [Conforme / Écart / En cours / Non démarré]

Format de sortie : un tableau par référentiel.
```

### Suivi des obligations GDPR

```typescript
interface GDPRObligation {
  article: string             // ex. "Art. 13", "Art. 30"
  obligation: string          // description en langage courant
  evidenceRequired: string[]  // ce qui prouve la conformité
  owner: string               // DPO / Legal / IT / HR / Marketing
  frequency: 'ongoing' | 'annual' | 'per-event' | 'per-request'
  sla: string | null          // délai si applicable
  status: 'compliant' | 'gap' | 'in-progress' | 'not-started'
}

const GDPR_CORE_OBLIGATIONS: GDPRObligation[] = [
  {
    article: 'Art. 13-14',
    obligation: 'Provide privacy notices to data subjects at point of collection',
    evidenceRequired: ['Privacy policy', 'Cookie notice', 'Sign-up flow screenshots'],
    owner: 'Legal / Marketing',
    frequency: 'ongoing',
    sla: 'At time of collection',
    status: 'gap', // placeholder — update to actual
  },
  {
    article: 'Art. 30',
    obligation: 'Maintain Records of Processing Activities (RoPA)',
    evidenceRequired: ['RoPA document', 'Last review date and sign-off'],
    owner: 'DPO / Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 32',
    obligation: 'Implement appropriate technical and organisational measures (TOMs)',
    evidenceRequired: ['Security policy', 'Encryption standards doc', 'Access control records', 'Pen test reports'],
    owner: 'CISO / IT',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 33',
    obligation: 'Report personal data breaches to supervisory authority within 72 hours',
    evidenceRequired: ['Incident response plan', 'Breach notification template', 'Breach log'],
    owner: 'DPO / Legal / IT',
    frequency: 'per-event',
    sla: '72 hours from awareness',
    status: 'gap',
  },
  {
    article: 'Art. 35',
    obligation: 'Conduct DPIA for high-risk processing activities',
    evidenceRequired: ['DPIA register', 'Completed DPIAs for high-risk activities'],
    owner: 'DPO',
    frequency: 'per-event',
    sla: 'Before processing begins',
    status: 'gap',
  },
  {
    article: 'Art. 37',
    obligation: 'Appoint a DPO if required (public authority / large-scale processing)',
    evidenceRequired: ['DPO appointment letter', 'DPO contact published on website'],
    owner: 'Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
]
```

### Suivi des contrôles SOC2

```
Construire un suivi des contrôles SOC2 Type II.

Critères de services de confiance (TSC) dans le périmètre : [TSC — Sécurité (obligatoire) + Confidentialité / Disponibilité / Intégrité de traitement / Vie privée]

Pour chaque catégorie de contrôle, lister :
- Objectif de contrôle
- Activité de contrôle (ce que nous faisons concrètement)
- Type de preuve (l'artefact qu'un auditeur demandera)
- Méthode de collecte (automatisée / manuelle)
- Fréquence
- Responsable
- Statut (en place / partiel / écart)

Contrôles de sécurité courants à suivre :

CC6 — ACCÈS LOGIQUE ET PHYSIQUE :
CC6.1 : Mesures de sécurité d'accès logique pour se protéger contre les menaces
  Preuve : Politique de contrôle d'accès, captures d'écran SSO/MFA, revues d'accès trimestrielles
  Responsable : IT / Sécurité | Fréquence : Continue + revue trimestrielle | Statut : [?]

CC6.2 : Enregistrement et autorisation des nouveaux utilisateurs internes
  Preuve : Document de processus de provisionnement, tickets Jira ou enregistrements HRIS
  Responsable : IT / RH | Fréquence : Par événement | Statut : [?]

CC6.3 : Suppression des accès lorsqu'ils ne sont plus autorisés
  Preuve : Checklist de départ, enregistrements de suppression d'accès
  Responsable : IT / RH | Fréquence : Par événement | Statut : [?]

CC7 — OPÉRATIONS SYSTÈME :
CC7.1 : Détecter et surveiller les changements de configuration
  Preuve : Politique de gestion des changements, journaux de modifications, alertes SIEM
  Responsable : IT / DevOps | Fréquence : Continue | Statut : [?]

CC7.2 : Surveiller les composants système pour détecter les anomalies
  Preuve : Captures d'écran des outils de surveillance (Datadog, CloudWatch, etc.), configuration des alertes
  Responsable : Ingénierie | Fréquence : Continue | Statut : [?]

[Continuer pour tous les contrôles applicables]
```

### Suivi des clauses ISO 27001

```
Construire un suivi de conformité ISO 27001:2022.

Contrôles de l'Annexe A applicables : [utiliser tous / ou lister les domaines spécifiques dans le périmètre]

Format pour chaque clause :

Clause [X.X] : [Nom de la clause]
Exigence : [En langage courant — ce qu'ISO requiert]
Analyse des écarts : [État actuel vs. exigence]
Preuves nécessaires : [Politique / procédure / enregistrement / contrôle technique]
Responsable : [Fonction]
Date cible : [Quand cela sera-t-il terminé]
Statut : [Conforme / En cours / Écart]

Clauses prioritaires à suivre (ISO 27001:2022) :

A.5 — Politiques de sécurité de l'information :
  A.5.1 : Politiques pour la sécurité de l'information → Preuve : Politique SI signée par la direction, revue annuelle
  A.5.2 : Rôles et responsabilités en matière de sécurité de l'information → Preuve : RACI, organigramme avec responsabilités sécurité

A.6 — Contrôles des personnes :
  A.6.1 : Vérification des antécédents → Preuve : Processus de vérification, enregistrements (conformes GDPR)
  A.6.3 : Sensibilisation à la sécurité de l'information → Preuve : Registres de formation, taux de completion

A.8 — Contrôles technologiques :
  A.8.2 : Droits d'accès privilégiés → Preuve : Inventaire des comptes privilégiés, captures d'écran de l'outil PAM
  A.8.5 : Authentification sécurisée → Preuve : Politique d'application MFA, configuration SSO
  A.8.8 : Gestion des vulnérabilités techniques → Preuve : Rapports d'analyse de vulnérabilités, enregistrements de correctifs
  A.8.24 : Utilisation de la cryptographie → Preuve : Document sur les standards de chiffrement, procédure de gestion des clés
  A.8.29 : Tests de sécurité dans le développement → Preuve : Configuration SAST/DAST, rapports de tests d'intrusion

[Générer les clauses restantes en fonction du périmètre]
```

### Invite pour l'analyse des écarts

```
Exécuter une analyse des écarts de conformité.

Référentiel : [GDPR / SOC2 / ISO 27001 / CCPA / HIPAA]
Preuves confirmées en place : [lister ce qui existe]
Écarts connus : [lister ce qui manque]
Date d'audit : [quand est le prochain audit / certification]

Produire :
1. Liste des écarts — ce qui manque par rapport aux exigences du référentiel
2. Estimation des efforts — combien de temps pour combler chaque écart (jours/semaines)
3. Classement par priorité — quels écarts entraîneraient un échec d'audit s'ils ne sont pas comblés
4. Recommandations de responsables — quelle équipe doit combler chaque écart
5. Plan de remédiation — une liste d'actions sur 90 jours ordonnée par priorité

Format :
| Écart | Référentiel | Gravité | Effort | Responsable | Date de clôture cible | Statut |
|---|---|---|---|---|---|---|
| [Écart] | [Référentiel] | [Critique/Élevé/Moyen/Faible] | [X jours] | [Fonction] | [Date] | [Ouvert] |
```

### Invite pour le suivi des échéances

```
Construire un suivi des échéances de conformité.

Inclure toutes les obligations à délai imparti provenant de mes référentiels applicables :

DÉLAIS RÉGLEMENTAIRES (non négociables) :
- GDPR Art. 33 : Violation de données personnelles → autorité de contrôle : 72 heures à partir de la prise de connaissance
- GDPR Art. 34 : Violation de données → personnes à haut risque : "sans délai injustifié"
- GDPR Art. 12 : Réponse DSAR : 30 jours (extensible à 90 jours avec notification)
- UK GDPR : Identique au GDPR (violation en 72h, DSAR en 30 jours)
- CCPA : Réponse DSAR : 45 jours (extensible à 90 jours)
- Violation HIPAA (>500 personnes) : 60 jours à partir de la découverte ; notifier HHS + médias
- Violation HIPAA (<500) : Rapport annuel au HHS (dans les 60 jours suivant la fin de l'année)

DÉLAIS DE CERTIFICATION :
- SOC2 Type II : Fenêtre du rapport annuel — [notre date de début d'audit] : [date]
- ISO 27001 : Audit de surveillance : [date] | Recertification : [date]
- PCI-DSS : Évaluation annuelle due : [date]

DÉLAIS INTERNES :
- Revues d'accès trimestrielles : [prochaine date]
- Revues annuelles des politiques : [prochaine date]
- Formation sécurité des employés : [date limite de completion]
- Évaluations des risques fournisseurs : [prochain lot dû]

Format : vue calendrier par trimestre, avec statut RAG :
🔴 Rouge : < 30 jours restants
🟡 Ambre : 30-90 jours restants
🟢 Vert : > 90 jours restants
```

### Checklist de collecte de preuves

```
Générer une checklist de collecte de preuves pour la préparation de l'audit [RÉFÉRENTIEL].

Pour chaque élément de preuve requis :
- Ce que c'est (en langage courant)
- Où le trouver (système, outil ou responsable du processus)
- Format attendu par les auditeurs (capture d'écran / export / document signé / fichier journal)
- Durée de rétention requise
- Qui est responsable de sa collecte

Grouper par catégorie de contrôle. Signaler les éléments nécessitant une collecte automatisée vs. manuelle.

Format de sortie exemple :
| Élément de preuve | Source | Format | Responsable | Rétention | Méthode de collecte |
|---|---|---|---|---|---|
| Capture d'écran de l'application MFA | Console admin Okta | PNG, daté | IT | 12 mois | Manuelle, mensuelle |
| Enregistrement de completion de la revue d'accès | HRIS + Jira | PDF signé | IT + RH | 12 mois | Manuelle, trimestrielle |
| Rapport d'analyse de vulnérabilités | Qualys / Nessus | Export PDF | Sécurité | 12 mois | Automatisée, mensuelle |
```

## Exemple

**Utilisateur :** Nous sommes une SaaS en Série B traitant des données personnelles européennes. Le GDPR s'applique, nous visons SOC2 Type II. Notre audit est dans 4 mois. Quels sont nos 10 écarts de conformité les plus critiques ?

**Résultat attendu :**
```markdown
# 10 Écarts de Conformité Critiques — Préparation GDPR + SOC2 Type II
[VÉRIFIER par rapport aux versions actuelles des référentiels et à votre conseil juridique]

Priorité | Écart | Référentiel | Risque Audit | Effort | Responsable
---|---|---|---|---|---
1 | Pas de Registre des Activités de Traitement (RoPA) | GDPR Art.30 | Élevé — les auditeurs le demandent en premier | 3-5 jours | DPO/Juridique
2 | Pas de DPA avec les sous-traitants tiers | GDPR Art.28 | Élevé — obligation contractuelle | 1-2 semaines | Juridique
3 | Mentions d'information absentes aux points de collecte | GDPR Art.13 | Élevé — visible par l'auditeur | 3-5 jours | Juridique + Marketing
4 | Pas de processus formel de revue d'accès (trimestriel) | SOC2 CC6.3 | Élevé — testé sur toute la période | 2 semaines pour établir | IT
5 | Pas de journal de gestion des changements pour les systèmes de production | SOC2 CC7.1 | Élevé — nécessite un échantillon de 12 mois | Immédiat — commencer maintenant | DevOps
6 | Plan de réponse aux incidents non testé (pas de simulation) | SOC2 CC7.3 / GDPR Art.33 | Moyen — preuves de test nécessaires | 1 jour de simulation | DPO + IT
7 | Pas d'AIPD formelle pour les traitements à risque élevé (modèle ML) | GDPR Art.35 | Moyen | 1-2 semaines | DPO
8 | Formation à la sensibilisation sécurité non documentée | SOC2 CC2.2 | Moyen — enregistrements de completion nécessaires | 2-3 jours | RH + IT
9 | Chiffrement au repos non confirmé pour tous les stockages de données | SOC2 CC6.7 | Moyen — preuve technique | 1-2 jours d'audit | Ingénierie
10 | Pas de programme de gestion des vulnérabilités (analyse + SLA de correctifs) | SOC2 CC7.1 | Moyen — preuves périodiques nécessaires | 2 semaines pour établir | Sécurité
```

---

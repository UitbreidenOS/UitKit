---
name: soc2-compliance
description: "Conformité SOC 2 : cartographie des critères de services de confiance, matrice de contrôle, analyse des écarts, collecte de preuves, préparation Type I vs Type II et préparation d'audit pour entreprises SaaS"
---

# Compétence de conformité SOC 2

## Quand l'activer
- Préparation pour audit SOC 2 Type I ou Type II
- Cartographie des contrôles aux critères de services de confiance (Sécurité, Disponibilité, Confidentialité, etc.)
- Exécution d'une analyse des écarts avant d'engager un auditeur
- Construction d'un processus de collecte de preuves pour la période d'observation
- Décision des critères de services de confiance à inclure dans votre périmètre
- Réponse aux clients d'entreprise demandant "avez-vous SOC 2?"

## Quand NE PAS l'utiliser
- Conformité RGPD ou confidentialité — utilisez la compétence d'expert RGPD
- Certification ISO 27001 — standard différent, processus d'audit différent
- Conformité HIPAA — requiert un spécialiste
- Après la fin de votre audit, il suffit de maintenir les contrôles — c'est du travail GRC en cours

## Instructions

### Évaluation de préparation SOC 2

```
Évaluez notre préparation SOC 2 pour [Type I / Type II].

Entreprise : [SaaS / infrastructure cloud / service géré]
Date d'audit cible : [X mois]
Critères de services de confiance sélectionnés : [Sécurité (requise) + lesquels optionnels : Disponibilité / Confidentialité / Intégrité du traitement / Confidentialité]
Maturité actuelle de la sécurité : [aucune / basique / intermédiaire / avancée]

Type I vs Type II — choisir selon :
Type I: Conception des contrôles à un moment précis
  - Meilleur pour : premier SOC 2, besoin de vente d'entreprise rapide, phase d'audit 1-2 mois
  - Coût : 20 K-50 K$ frais d'auditeur
  - NE prouve PAS que les contrôles fonctionnent efficacement au fil du temps

Type II: Conception + efficacité opérationnelle sur fenêtre d'observation (min 6 mois)
  - Meilleur pour : clients d'entreprise demandant Type II, programmes matures
  - Coût : 30 K-100 K+$ frais d'auditeur
  - Les preuves doivent couvrir la période d'observation complète

Analyse des écarts de préparation par domaine :

SÉCURITÉ (CC1-CC9 — requis) :

CC6 — Accès logique et physique (critère le plus souvent échoué) :
□ Authentification multifactorielle sur tous les systèmes de production
□ Processus formel d'approvisionnement et de déprovisionnement d'accès (nouveau/changement/départ)
□ Révisions d'accès trimestrielles documentées avec preuves
□ Pas de identifiants partagés en production
□ Gestion des accès privilégiés (PAM) ou justification documentée des privilèges

CC7 — Opérations système :
□ Analyse des vulnérabilités en place (au moins trimestrielle)
□ Processus de correction avec SLA documenté (critique : X jours, haut : Y jours)
□ Détection des intrusions / alertage d'anomalies configurés
□ Plan de réponse aux incidents documenté et testé

CC8 — Gestion des changements :
□ Tous les changements de production passent par un processus d'approbation documenté
□ Examen de code requis avant déploiement
□ Séparation des responsabilités : développeur ne peut pas déployer en production sans approbation
□ Processus de changement d'urgence documenté

CC9 — Gestion des risques et des fournisseurs :
□ Évaluation des risques conduite et documentée (au moins annuellement)
□ Inventaire des fournisseurs avec classification de sécurité
□ Les fournisseurs critiques ont leur propre SOC 2 ou équivalent

DISPONIBILITÉ (A1 — si dans le périmètre) :
□ Surveillance du disponibilité avec alertage
□ Plan de reprise d'activité documenté et testé (RTO/RPO défini)
□ Procédures de sauvegarde avec restauration testée
□ Processus de planification de capacité

Évaluez chaque contrôle : ✅ En place / 🟡 Partiel / 🔴 Écart

Résultat : registre des écarts avec classement des priorités et estimations d'effort.
```

### Matrice de contrôle

```
Construisez une matrice de contrôle SOC 2 pour [entreprise].

Critères de services de confiance dans le périmètre : [liste]
Contrôles actuels : [décrire ce que vous avez en place]

Format de matrice de contrôle (une ligne par contrôle) :

| ID de contrôle | Cartographie TSC | Description du contrôle | Type de contrôle | Propriétaire | Preuve | Statut |
|---|---|---|---|---|---|---|
| CC6.1-01 | CC6.1 | MFA est requis pour tous les utilisateurs accédant aux systèmes de production | Préventif / Technique | CISO | Journaux d'authentification, doc de politique MFA | Implémenté |
| CC6.2-01 | CC6.2 | L'approvisionnement en accès suit le processus IAM documenté | Préventif / Administratif | IT | Tickets IAM, liste de contrôle d'intégration | Implémenté |
| CC7.2-01 | CC7.2 | Les analyses de vulnérabilités s'exécutent hebdomadairement ; les résultats critiques sont corrigés en 30 jours | Détectif / Technique | Ingénierie | Rapports d'analyse, tickets de correction | Partiel |

Types de contrôles :
- Préventif : empêche le risque de se produire (MFA, contrôles d'accès)
- Détectif : détecte quand un risque s'est produit (journalisation, surveillance, révisions)
- Correctif : corrige après détection (réponse aux incidents, gestion des correctifs)

Fréquence du contrôle (important pour preuves Type II) :
- Continu : contrôles automatisés fonctionnant tout le temps (WAF, chiffrement)
- Quotidien : révisions de journaux, vérifications de surveillance automatisées
- Hebdomadaire : analyses de vulnérabilités, vérification de sauvegarde
- Mensuel : révisions d'accès (si mensuels), rapports de correctifs
- Trimestriel : révisions d'accès (si trimestriels), revue des risques
- Annuel : évaluation des risques, test de RD, formation de sensibilité à la sécurité

Pour Type II : chaque contrôle a besoin d'au moins une preuve par période.
Pour les contrôles trimestriels sur 6 mois : besoin de preuves de 2 trimestres.
Pour les contrôles annuels : une instance couvre une période de 12 mois.

Générez la matrice de contrôle complète pour mes critères et contrôles.
```

### Guide de collecte de preuves

```
Planifiez la collecte de preuves pour [période d'observation SOC 2 Type II].

Période d'observation : [date de début] à [date de fin] (généralement 6-12 mois)
Critères de services de confiance : [liste]
Auditeur : [si connu]

Collecte de preuves par fréquence du contrôle :

CONTRÔLES CONTINUS (collectez des exemples périodiques) :
□ Chiffrement au repos : capture d'écran de configuration de stockage, paramètres KMS/certificat
□ Règles pare-feu / WAF : export de jeu de règles actuel (début de période + changements)
□ Détection des intrusions : capture d'écran statut actif, configuration d'alertes

QUOTIDIEN / BASÉ SUR ÉVÉNEMENTS (collectez des exemples couvrant la période complète) :
□ Alertes d'échec de connexion : export de journaux montrant alertes se déclenchant et examinées
□ Événements d'escalade de privilèges : export montrant approbations ou refus
□ Changements système : tickets de gestion des changements pour changements majeurs d'infrastructure

HEBDOMADAIRE (au minimum un exemple par mois) :
□ Résultats d'analyse de vulnérabilité : un rapport par semaine/mois (couvrez la période complète)
□ Vérification de sauvegarde : journaux d'exécution de sauvegarde et une restauration testée

MENSUEL / TRIMESTRIEL (un exemple par occurrence) :
□ Révisions d'accès : liste exportée examinée + approbations/révocations documentées
□ Correctifs de sécurité : rapport de gestion des correctifs montrant correctifs critiques appliqués
□ Révisions des fournisseurs : toutes les révisions de sécurité des fournisseurs complétées

ANNUEL (une fois par période d'audit) :
□ Évaluation des risques : registre des risques complété avec approbation
□ Test de reprise d'activité : rapport de test avec résultats
□ Formation de sensibilité à la sécurité : dossiers de réalisation pour tout le personnel
□ Révision du plan de continuité : révision documentée et approbation

Convention de nommage des preuves (facilite le travail de l'auditeur) :
[ID-Contrôle]_[Fréquence]_[AAAA-MM]_[description]
Exemple : CC6.2-01_quarterly_2026-Q1_access-review-export.csv

Stockage des preuves : créez un dossier partagé par critère → sous-dossier par contrôle → fichiers de preuves chronologiques.

Générez le calendrier de collecte de preuves pour ma période d'observation.
```

### Liste de contrôle de préparation de l'auditeur

```
Préparez le travail sur le terrain d'audit SOC 2.

Type d'audit : [Type I / Type II]
Auditeur : [nom du cabinet si connu]
Date du travail sur le terrain : [plage de dates]

Préparation pré-audit (4-6 semaines avant) :

DOCUMENTATION :
□ Description du système rédigée et examinée (le document narratif sur lequel les auditeurs basent tout)
□ Matrice de contrôle finalisée avec approbation du propriétaire
□ Bibliothèque de politiques complète : politique de sécurité informatique, politique de contrôle d'accès, politique de gestion des changements, politique de réponse aux incidents, politique de gestion des fournisseurs, politique de sauvegarde et récupération
□ Organigramme montrant les rôles pertinents à la sécurité

PREUVES :
□ Toutes les preuves libellées et organisées par contrôle
□ Les écarts de preuves identifiés et expliqués (ou remédié)
□ Pas de politiques "brouillon" — toutes doivent être approuvées et en vigueur

PERSONNEL :
□ Propriétaires de contrôles informés de leurs contrôles et preuves
□ Ils savent : ce que fait le contrôle, à quelle fréquence il s'exécute, où la preuve est
□ Point de contact pour questions d'auditeur assigné par domaine

ACCÈS AUX SYSTÈMES :
□ Accès en lecture seule de l'auditeur à : SIEM, système de billetterie, système RH (pour révisions d'accès), console cloud (lecture seule)
□ Configuration de partage d'écran pour présentations si audit à distance

QUESTIONS FRÉQUENTES DE L'AUDITEUR (préparez les réponses) :
- "Montrez-moi ce qui se passe quand un nouvel employé commence" (processus nouveau + preuves)
- "Que se passe-t-il quand un employé part?" (processus de départ, SLA de révocation d'accès)
- "Montrez-moi comment un changement de production est approuvé" (preuves de gestion des changements)
- "Comment sauriez-vous si vos données ont été violées?" (surveillance + réponse aux incidents)
- "Qui a accès aux données de production?" (liste d'accès + date de dernière révision)

Produisez une liste de contrôle de préparation d'audit pour ma taille d'entreprise et mes critères.
```

## Exemple

**Utilisateur :** Une perspective d'entreprise nous demande SOC 2 Type II. Nous ne l'avons jamais fait. Nous sommes une entreprise SaaS de 15 personnes. Par où commençons-nous?

**Feuille de route pratique de Claude :**

Pour une entreprise SaaS native du cloud de 15 personnes, une certification Type II prend généralement 12-18 mois au total. Voici le calendrier réaliste :

**Mois 1-2 — Évaluation des écarts :**
Exécutez la liste de contrôle ci-dessus. L'écart #1 pour les startups est presque toujours : pas de processus formel d'examen d'accès, pas de gestion des changements documentée, et MFA non appliquée sur tout. Corrigez d'abord ces trois.

**Mois 2-4 — Remédiation :**
Correctifs prioritaires (80% de ce que les auditeurs vérifient) :
- Appliquez MFA partout en production (1 semaine)
- Documentez votre processus nouveau/changement/départ et exécutez-le réellement (2 semaines)
- Démarrez les révisions d'accès trimestrielles et documentez-les avec des captures d'écran (en continu)
- Rédigez 5 politiques principales : sécurité, contrôle d'accès, réponse aux incidents, gestion des changements, gestion des fournisseurs (2 semaines — des modèles existent)
- Configurez les analyses de vulnérabilités (Snyk, Wiz, ou même outils gratuits)

**Mois 4-6 — Démarrez la période d'observation :**
Engagez votre auditeur MAINTENANT, pas après. Dites-leur que vous démarrez la période d'observation. Ils fixent la date de début. La collecte de preuves commence le jour 1.

**Mois 4-10 — Exploitez les contrôles avec preuves :**
Chaque contrôle s'exécute, chaque preuve est capturée et classée. C'est la partie ingrate — révision d'accès trimestrielle? Capturez-la. Analyse de vulnérabilité? Téléchargez le rapport. Test de sauvegarde hebdomadaire? Consignez-le.

**Mois 10-12 — Audit sur le terrain :**
L'auditeur examine vos preuves, interroge les propriétaires de contrôles, publie le rapport.

**Coût réaliste à 15 personnes :**
- Frais d'auditeur : 30-60 K$ pour petit cabinet (Prescient Assurance, A-LIGN, etc. se spécialisent dans SOC 2 à échelle startup)
- Outils de conformité : 0$ (manuel) à 15 K$/an (Vanta, Drata, Secureframe — automatisez la collecte de preuves)
- Temps interne : ingénieur CISO/IT approximativement 30% du temps pendant 3 mois

**Raccourci :** Utilisez Vanta ou Drata. Pour 8-15 K$/an, ils automatisent 80% de la collecte de preuves en se connectant directement à AWS, GitHub, Google Workspace, etc. Vaut le coup pour un premier SOC 2 pour éviter la surcharge manuelle de preuves.

---

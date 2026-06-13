---
name: gdpr-expert
description: "Conformité RGPD : analyse des risques de confidentialité du code, génération de DPIA (art. 35), gestion des droits des personnes (art. 15-22), évaluation de la base légale et accords de traitement des données"
---

# Compétence Expert RGPD

## Quand l'activer
- Analyse d'une base de code ou d'un système pour les risques de conformité RGPD
- Génération d'une analyse d'impact relative à la protection des données (DPIA) en vertu de l'article 35
- Gestion des demandes de droits des personnes (accès, suppression, portabilité, objection)
- Évaluation de la base légale pour une activité de traitement des données
- Examen d'un accord de traitement des données (DPA) avec un fournisseur
- Préparation pour un audit RGPD ou une enquête réglementaire

## Quand ne pas l'utiliser
- Bannières de consentement aux cookies — l'implémentation est une tâche de développement, utiliser la documentation de la bibliothèque
- Conformité CCPA uniquement (États-Unis) — cette compétence se concentre sur le RGPD ; de nombreux principes se chevauchent mais les règles diffèrent
- Conformité HIPAA — cadre différent, utiliser un spécialiste
- Remplacer les conseils d'un responsable de la protection des données qualifié (DPD) dans les situations nouvelles ou à haut risque

## Instructions

### Analyse des risques de confidentialité

```
Analyse ce système pour les risques de conformité RGPD.

Description du système : [décrire ce que le système fait, quelles données il traite]
Pile technologique : [langages, frameworks, bases de données]
Catégories de données traitées : [énumérer — email, nom, IP, localisation, santé, données financières, biométriques]
Utilisateurs : [résidents de l'UE ? B2B ? B2C ?]

Liste de contrôle des risques RGPD par catégorie :

IDENTIFICATION DES DONNÉES PERSONNELLES :
□ Quelles données personnelles sont collectées ? (nom, email, IP, ID de l'appareil, localisation, données comportementales)
□ Quelles données de catégories spéciales sont traitées ? (santé, biométriques, politique, religion, orientation sexuelle)
□ Toutes les données collectées sont-elles vraiment nécessaires ? (minimisation des données — article 5(1)(c))

BASE LÉGALE (Article 6) :
Pour chaque activité de traitement, identifiez la base légale :
- Consentement (art. 6(1)(a)) : librement donné, spécifique, éclairé, sans ambiguïté — non groupé avec les conditions
- Contrat (art. 6(1)(b)) : le traitement est nécessaire pour exécuter un contrat avec la personne
- Obligation légale (art. 6(1)(c)) : requis par le droit de l'UE/État membre
- Intérêts légitimes (art. 6(1)(f)) : doit passer un test d'évaluation des intérêts légitimes (EIL) en 3 parties — pas un fourre-tout
🔴 Signal d'alerte : utilisation « d'intérêts légitimes » sans évaluation documentée des intérêts légitimes

GESTION DU CONSENTEMENT :
□ Le consentement est-il obtenu avant la collecte de données (pas après) ?
□ Le consentement est-il granulaire (séparé pour chaque objectif) ?
□ Les utilisateurs peuvent-ils retirer leur consentement aussi facilement qu'ils l'ont donné ?
□ Un enregistrement de consentement est-il maintenu avec horodatage et version ?

CONSERVATION DES DONNÉES :
□ Y a-t-il une politique de conservation documentée par catégorie de données ?
□ Les données sont-elles automatiquement supprimées ou anonymisées après la période de conservation ?
🔴 Signal d'alerte : « nous conservons les données indéfiniment » ou « jusqu'à ce que l'utilisateur supprime son compte »

SÉCURITÉ (Article 32) :
□ Les données personnelles sont-elles chiffrées au repos et en transit ?
□ Contrôles d'accès : seul le personnel autorisé peut accéder aux données personnelles ?
□ Les données personnelles sont-elles consignées inutilement (journaux de débogage contenant des PII) ?
□ Pseudo-anonymisation en place autant que possible ?

TRAITANTS DE DONNÉES (Article 28) :
□ Y a-t-il un DPA signé avec chaque fournisseur qui traite des données personnelles ?
□ Sous-traitants énumérés et approuvés ?
□ Fournisseur dans un pays tiers ? Clauses contractuelles types (CCT) en place ?

NOTIFICATION DE VIOLATION (Article 33-34) :
□ Pouvez-vous détecter une violation de données dans les 72 heures ?
□ Y a-t-il un processus de notification de violation documenté ?
□ Qui est responsable de la notification de l'autorité de supervision ?

Résultat : registre des risques avec référence de l'article, gravité (🔴/🟡/🟢) et correction recommandée.
```

### Génération de DPIA (Article 35)

```
Générer une analyse d'impact relative à la protection des données pour [activité de traitement].

Activité de traitement : [décrire — par exemple « système de surveillance des employés basé sur l'IA », « ciblage publicitaire comportemental »]
Responsable du traitement : [nom de l'organisation]
DPD (si nommé) : [nom ou « aucun nommé »]
Objectif : [pourquoi vous traitez les données]
Catégories de données : [énumérer]
Destinataires : [qui les données sont partagées avec]
Transferts vers des pays tiers : [oui/non — où]

DPIA est requise (art. 35(3)) lorsque le traitement est susceptible de résulter en RISQUE ÉLEVÉ :
□ Profilage systématique et étendu avec des effets importants sur les personnes
□ Traitement à grande échelle de catégories spéciales de données (art. 9) ou de données pénales (art. 10)
□ Surveillance systématique des zones accessibles au public

WP29 / EDPB ajoute 9 critères — DPIA requise si 2+ s'appliquent :
□ Évaluation ou notation (profilage, notation de crédit)
□ Prise de décision automatisée avec effets juridiques ou similaires significatifs
□ Surveillance systématique
□ Données sensibles ou hautement personnelles
□ Données traitées à grande échelle
□ Données appariées ou combinées
□ Données sur des personnes vulnérables (enfants, employés, patients)
□ Utilisation innovante ou nouvelles solutions technologiques ou organisationnelles
□ Le traitement empêche les personnes d'exercer un droit ou d'utiliser un service

Structure de la DPIA :

1. DESCRIPTION DU TRAITEMENT :
   - Objectifs et base légale
   - Catégories de données et personnes concernées
   - Flux de données (collecte → traitement → stockage → suppression)
   - Traitants et sous-traitants impliqués
   - Périodes de conservation

2. NÉCESSITÉ ET PROPORTIONNALITÉ :
   - Le traitement est-il nécessaire pour l'objectif déclaré ?
   - Le même objectif pourrait-il être atteint avec moins de données ?
   - La base légale choisie est-elle appropriée ?

3. ÉVALUATION DES RISQUES :
   | Risque | Probabilité | Gravité | Risque résiduel après mesures |
   |---|---|---|---|
   | Accès non autorisé aux données personnelles | Moyen | Élevé | Faible (chiffrement + contrôles d'accès) |
   | Violation de données affectant un grand nombre d'individus | Faible | Très élevé | Faible (détection de violation + plan de notification 72h) |
   | Profilage conduisant à la discrimination | Moyen | Élevé | Moyen — nécessite une surveillance |

4. MESURES POUR ABORDER LES RISQUES :
   - Mesures techniques : [chiffrement, pseudo-anonymisation, contrôles d'accès]
   - Mesures organisationnelles : [formation, politiques, contrats DPA]
   - Confidentialité par conception : [minimisation des données, limitation d'objectif intégrée à l'architecture]

5. CONSULTATION DU DPD :
   [Examen et approbation du DPD, ou justification de la non-consultation du DPD]

6. CONSULTATION DE L'AUTORITÉ DE SUPERVISION :
   Requise en vertu de l'art. 36 si le risque résiduel reste ÉLEVÉ après toutes les mesures.
   [Décision : consulter / non requis — justification]

Générer la DPIA pour mon activité de traitement.
[EXAMEN JURIDIQUE REQUIS : DPD ou conseil en confidentialité qualifié doit examiner avant finalisation]
```

### Gestionnaire des droits des personnes

```
Traiter une demande de droits de la personne en vertu des articles 15-22 du RGPD.

Type de demande :
- Article 15 : Droit d'accès (demande d'accès du sujet)
- Article 16 : Droit de rectification
- Article 17 : Droit à l'oubli (« droit à l'oubli »)
- Article 18 : Droit à la limitation du traitement
- Article 19 : Droit à la portabilité des données
- Article 21 : Droit d'objection
- Article 22 : Droit de ne pas faire l'objet de décisions automatisées

Demandeur : [nom, email ou référence]
Date de réception : [date — réponse due dans 30 jours, extensible à 90 pour les cas complexes]
Identité vérifiée : [oui / non — ne pas traiter jusqu'à confirmation de l'identité]

Flux de travail de réponse :

ÉTAPE 1 — Enregistrer et reconnaître (dans les 72 heures) :
« Nous avons reçu votre demande en vertu de [article X] du RGPD. Nous répondrons dans 30 jours. Votre numéro de référence est DSR-[AAAA-MM-JJ-NNN]. »

ÉTAPE 2 — Vérifier l'identité :
Ne pas divulguer de données personnelles ou confirmer la suppression sans vérification d'identité.
Acceptable : pièce d'identité gouvernementale, vérification de compte, questions de sécurité.
En cas de doute : demander une vérification supplémentaire (l'art. 12(6) le permet).

ÉTAPE 3 — Traiter la demande :
Pour article 15 (accès) : compiler toutes les données personnelles détenues, y compris :
  - Catégories de données détenues
  - Objectifs du traitement
  - Destinataires et transferts vers des pays tiers
  - Période de conservation
  - Source des données (si pas directement du sujet)
  - Existence de prise de décision automatisée

Pour article 17 (suppression) : supprimer de :
  - Base de données primaire
  - Sauvegardes (dans un délai raisonnable — noter le calendrier de suppression des sauvegardes)
  - Traitants tiers (les notifier par écrit)
  - Anonymiser si la suppression techniquement impossible
  
  Exceptions — suppression NON requise si le traitement est nécessaire pour :
  - Obligation légale ou réclamations légales
  - Liberté d'expression et d'information
  - Archivage d'intérêt public

Pour article 20 (portabilité) : exporter les données dans un format lisible par machine (JSON, CSV).
  S'applique uniquement à : données fournies par le sujet + traitées sur base du consentement ou du contrat.

ÉTAPE 4 — Documenter la réponse :
Enregistrer : date de la demande, type, vérification d'identité, actions entreprises, date de réponse, exemptions revendiquées.

ÉTAPE 5 — Répondre dans les 30 jours :
Si incapable d'agir : notifier le demandeur avec raison (peut étendre à 90 jours avec notification).
Si manifestement infondée ou excessive : peut imposer des frais raisonnables ou refuser (documenter le raisonnement).

Rédiger la réponse pour mon type de demande spécifique.
```

### Évaluation de la base légale

```
Évaluer la base légale pour [activité de traitement].

Activité de traitement : [décrire précisément — quelles données, quel objectif, quel résultat]
Personnes concernées : [consommateurs / employés / contacts B2B / mineurs]
Relation aux personnes concernées : [client / employé / prospect / public]

Options de base légale en vertu de l'article 6 :

CONSENTEMENT (Art. 6(1)(a)) :
Conditions : librement donné, spécifique, éclairé, sans ambiguïté, séparé des autres termes
Meilleur pour : abonnements à la newsletter, cookies non essentiels, communications marketing
Faiblesse : peut être retiré à tout moment → le traitement doit s'arrêter
🔴 Non valide si : groupé avec le contrat, cases pré-cochées, conditionné à l'accès au service

CONTRAT (Art. 6(1)(b)) :
Conditions : le traitement est strictement nécessaire pour exécuter un contrat AVEC la personne
Meilleur pour : traitement de la commande du client, prestation d'un service payant
🔴 Non valide pour : marketing aux clients existants, analyses, prévention de la fraude

OBLIGATION LÉGALE (Art. 6(1)(c)) :
Conditions : une loi de l'UE ou de l'État membre exige le traitement
Meilleur pour : dossiers fiscaux, exigences en matière de droit du travail, AML/KYC
🔴 Doit citer la loi spécifique — « nous sommes légalement tenus » est insuffisant

INTÉRÊTS VITAUX (Art. 6(1)(d)) :
Conditions : protéger la vie de la personne ou d'une autre personne
Dernier recours uniquement — presque jamais applicable au traitement commercial

TÂCHE DE SERVICE PUBLIC (Art. 6(1)(e)) :
Pour les autorités publiques et celles qui exercent des fonctions publiques. Rarement applicable aux entreprises privées.

INTÉRÊTS LÉGITIMES (Art. 6(1)(f)) :
Conditions : le test en 3 parties de l'EIL doit passer :
  1. Test d'objectif : l'intérêt est-il légitime ?
  2. Test de nécessité : le traitement est-il nécessaire pour cet intérêt ?
  3. Test d'équilibre : les intérêts remplacent-ils les droits de la personne ?

Meilleur pour : prévention de la fraude, sécurité du réseau, marketing B2B, transferts intra-groupe
🔴 IMPOSSIBLE à utiliser : par les autorités publiques ; lorsque les droits fondamentaux prédominent ; pour la surveillance des employés

Pour mon activité, évaluer quelle base s'applique et identifier les faiblesses.
[EXAMEN JURIDIQUE REQUIS avant de s'appuyer sur l'évaluation]
```

## Exemple

**Utilisateur :** Nous construisons un produit SaaS qui utilise l'IA pour analyser les modèles de comportement des utilisateurs et noter la santé des clients pour nos clients B2B. Les données de leurs utilisateurs finaux circulent dans notre système. Quelle est notre exposition au RGPD ?

**Analyse de Claude :**

Vous êtes un **traitant de données** (article 4(8)) — vos clients B2B sont les responsables du traitement. Cela a des implications immédiates :

**Vos obligations en tant que traitant (article 28) :**
- DPA signé avec chaque client B2B avant de traiter les données de ses utilisateurs
- Traiter les données uniquement sur instructions documentées de chaque responsable
- Mettre en œuvre des mesures de sécurité techniques et organisationnelles appropriées
- Soutenir les responsables dans le respect de leurs propres obligations RGPD (demandes d'accès, DPIA, notification de violation)
- Supprimer ou retourner toutes les données à la fin du contrat

**Vérification du déclenchement de DPIA :**
Votre système de notation comportementale basée sur l'IA déclenche probablement une exigence de DPIA car il combine :
- Évaluation/profilage systématique des individus (critère WP29 1)
- Technologie innovante (notation basée sur l'IA) (critère WP29 9)
- Potentiellement à grande échelle (si les clients B2B ont de nombreux utilisateurs finaux)

Les responsables (vos clients B2B) sont responsables de la DPIA — mais ils auront besoin de votre documentation technique sur le fonctionnement de l'IA pour la compléter. Préparer de manière proactive un document « contribution du traitant à la DPIA ».

**Domaines de risque les plus élevés pour vous :**
1. 🔴 Chaîne de sous-traitants — chaque outil que vous utilisez pour exécuter l'IA (AWS, plateforme ML, surveillance) est un sous-traitant. Énumérez-les tous. Votre DPA doit les nommer ou décrire le processus d'approbation.
2. 🔴 Transferts vers des pays tiers — si vos serveurs ou infrastructure ML sont aux États-Unis, vous avez besoin de CCT ou de vous appuyer sur le Cadre de confidentialité UE-États-Unis.
3. 🟡 Transparence — les utilisateurs finaux ne savent probablement pas que leur comportement est noté. Vos clients (responsables) doivent le leur dire.

---

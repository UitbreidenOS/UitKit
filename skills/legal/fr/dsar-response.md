---
name: dsar-response
description: "Flux de travail de réponse DSAR RGPD/CCPA : classer la demande, vérifier l'identité, parcourir les systèmes, appliquer les exemptions, rédiger l'accusé de réception et la réponse substantielle"
---

# Compétence Réponse DSAR

## Quand l'activer
- Un client ou employé soumet une demande d'accès aux données, de suppression, de portabilité ou de correction
- Vous devez confirmer la réception dans le délai réglementaire
- Identifier quels systèmes contiennent les données personnelles du demandeur
- Appliquer les exemptions RGPD ou CCPA avant de répondre
- Rédiger la lettre de réponse substantielle

## Quand NE PAS l'utiliser
- Notifications de violation de données massives — cadre juridique différent (Art. 33/34 RGPD)
- Enquêtes réglementaires — impliquez votre DPO et conseils juridiques
- Demandes clairement harcèlement flou sans but légitime — toujours besoin de traitement approprié

## ⚠️ Important

Les délais sont stricts : **RGPD : 1 mois (prolongeable à 3 mois pour demandes complexes). CCPA : 45 jours.** Manquer le délai est en soi une violation de conformité. Claude aide à structurer le processus — votre DPO ou conseils juridiques doivent vérifier avant d'envoyer une réponse.

## Instructions

### Étape 1 — Classer la demande

```
Un sujet de données a envoyé ce message : « [collez la demande] »

Classer :
1. Quel type de demande est-ce ?
   - Accès (Article 15 RGPD / CCPA droit à savoir)
   - Effacement/suppression (« droit à l'oubli » — Art. 17 RGPD / CCPA droit à supprimer)
   - Portabilité (Art. 20 RGPD — format structuré, lisible par machine)
   - Rectification/correction (Art. 16 RGPD)
   - Restriction du traitement (Art. 18 RGPD)
   - Objection au traitement (Art. 21 RGPD)
   - Plusieurs droits combinés

2. Quelle réglementation s'applique ?
   - RGPD (résident de l'UE/RU ou opérations de l'UE)
   - CCPA (résident de Californie)
   - Les deux / Autre

3. Quel est le délai ?
   - RGPD : [date d'aujourd'hui + 30 jours] = [date]
   - CCPA : [date d'aujourd'hui + 45 jours] = [date]
```

### Étape 2 — Vérifier l'identité

```
Avant de traiter, je dois vérifier l'identité de cette personne.

Le demandeur prétend être : [nom, email, client/employé]
Informations qu'il a fournies : [ce qu'il nous a donné]

Quelles étapes de vérification dois-je prendre ?
- Quelle est la vérification minimale nécessaire ?
- Que puis-je demander sans sur-collecte (risque de ré-identification) ?
- Quand la vérification supplémentaire est-elle justifiée versus onéreuse ?

Rédiger la demande de vérification d'identité que je dois envoyer.
```

### Étape 3 — Audit des systèmes

```
Je dois identifier toutes les données personnelles que nous détenons pour cette personne.

Leurs détails : [nom, email, ID client, ID employé si connu]

Parcourez tous les systèmes que nous pourrions avoir leurs données :
[décrivez votre pile technologique et systèmes de données]

Pour chaque système, quelles données pourrions-nous détenir ?
Format : Système | Types de données | Comment extraire | Période de rétention
```

### Étape 4 — Appliquer les exemptions (le cas échéant)

```
Je suis en train d'examiner cette demande d'effacement/suppression. Vérifier si des exemptions s'appliquent :

Détails de la demande : [décrivez]
Nos motifs légitimes de conserver les données : [décrivez]

Exemptions de l'article 17(3) du RGPD à vérifier :
- Réclamation légale : avons-nous besoin de ces données pour un différend juridique ou un contrat en cours ?
- Obligation légale : sommes-nous tenus par la loi de conserver ces données (par ex. dossiers fiscaux 7 ans) ?
- Intérêt public : cela sert-il la recherche scientifique/historique ?
- Liberté d'expression : journalisme, intérêt public
- Santé publique : intérêts vitaux

Si une exemption s'applique, notez laquelle et rédigez l'explication pour la réponse.
```

### Étape 5 — Rédiger l'accusé de réception

```
Rédiger l'email/lettre d'accusé de réception à envoyer maintenant (dans les 72 heures de la réception).

Inclure :
- Confirmation de réception de leur demande le [date]
- Numéro de référence pour le suivi
- Type de demande reconnue
- Délai de notre réponse ([date])
- Nom/contact de notre DPO ou équipe confidentialité
- Brève note sur la vérification d'identité si nécessaire

Réglementations : [RGPD / CCPA]
Nom de notre entreprise : [nom]
Contact DPO/confidentialité : [nom ou email d'équipe]
```

### Étape 6 — Rédiger la réponse substantielle

```
J'ai complété l'inventaire des données. Voici ce que j'ai trouvé :

Systèmes recherchés : [liste]
Données trouvées : [décrivez les catégories — nom, email, historique d'achat, etc.]
Exemptions appliquées : [aucune / oui : décrivez]
Données retenues : [aucune / décrivez la raison]

Rédiger la lettre de réponse complète pour une demande d'[accès RGPD / suppression CCPA].

Inclure :
- Résumé des données détenues (ou confirmation de suppression)
- Format des données fournies (si demande d'accès)
- Toutes les exemptions appliquées avec référence d'article
- Droit de se plaindre auprès de l'autorité de contrôle
- Bloc de signature

[VÉRIFIEZ] avec DPO avant d'envoyer.
```

## Exemple

**Un client envoie un email :** « Je veux savoir quelles données vous avez sur moi et je veux que vous les supprimiez. »

**Production du workflow Claude :**

**Classification :** Demande combinée d'accès + effacement en vertu du RGPD (client de l'UE identifié par domaine email).

**Délai :** 30 jours à partir d'aujourd'hui = [date].

**Vérification d'identité :** L'email correspond au compte en dossier — risque faible, aucune vérification supplémentaire nécessaire pour un client connu.

**Systèmes à vérifier :** CRM (HubSpot), processeur de paiement (Stripe), plateforme email (Mailchimp), analyse (Mixpanel), tickets de support (Intercom), systèmes de sauvegarde/archive.

**Accusé de réception :** Confirme la réception, numéro de référence, délai de réponse de 30 jours, contact DPO.

**Analyse d'effacement :** Les données de vente/marketing peuvent être supprimées immédiatement. Les dossiers de paiement conservés 7 ans en vertu de la loi fiscale britannique (exemption d'obligation légale, Art. 17(3)(b)). Confirmer l'exemption avant suppression.

**Brouillon de réponse :** Confirme les catégories de données trouvées, confirme la suppression des données de marketing, explique la conservation de 7 ans des dossiers de paiement avec base légale, inclut le droit de se plaindre à l'ICO.

---

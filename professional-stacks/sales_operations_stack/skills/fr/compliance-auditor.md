---
name: compliance-auditor
description: Audit de documentation des contrats, validation de l'hygiène du pipeline, vérification de l'historique d'audit pour les changements de rémunération et rapports réglementaires. Assure 100% de conformité aux contrôles internes.
allowed-tools: Read, Write
effort: medium
---

## Quand activer

Hebdomadaire pour la santé du pipeline, mensuel pour l'audit complet de conformité, ou avant la clôture de trimestre. Requis pour la conformité Sarbanes-Oxley (SOX) ou GAAP de reconnaissance des revenus.

## Quand NE PAS utiliser

Pas pour le coaching de contrats (utilisez quota-tracker). Pas pour l'examen juridique (escalader à l'équipe juridique/conformité).

## Liste de vérification d'audit de conformité

**Hygiène du pipeline (hebdomadaire) :**
1. Tous les contrats ouverts ont : nom, compte, valeur estimée, date de clôture, étape, propriétaire du représentant
2. Aucun enregistrement de contrat en double (fusionner les doublons)
3. Contrats obsolètes (inchangés >60 jours) marqués pour réengagement ou clôture
4. Descriptions des contrats mises à jour au minimum trimestriellement

**Documentation des contrats (pré-clôture) :**
1. Enregistrement du contrat : Bon de commande client ou proposition signée présent et daté
2. Statut du contrat : Envoyé, Signé ou Exécuté (pas Verbal ou Accord oral)
3. Adéquation du client : Aucun drapeau de conformité (vérification de liste de sanctions, contrôle d'exportation)
4. Approbations : Contrat approuvé par l'autorité requise (directeur pour <50K$, VP pour 50K$–250K$, SVP pour >250K$)

**Historique d'audit de commission (mensuel) :**
1. Tous les paiements de commission enregistrés avec : représentant, contrat, montant, date, approbateur
2. Tous les litiges résolus avec documentation : réclamation vs. réel, raison, signature de l'approbateur
3. Tous les ajustements manuels (récupérations, exceptions de bonus) pré-approuvés et documentés

**Reconnaissance des revenus (trimestrielle) :**
1. Les contrats clôturés (gagnés) ont les revenus enregistrés dans le système financier dans les 5 jours
2. Les dates de clôture des contrats correspondent aux enregistrements CRM (vérifier qu'il n'y a pas d'ajustements de date post-clôture)
3. Les montants des contrats correspondent aux montants du contrat (pas de remise non autorisée)

## Modèle de sortie
---
name: privacy-pia
description: "Évaluation d'impact sur la vie privée (PIA/DPIA) : intake d'activité de traitement, vérification de base légale, test de nécessité DPIA, registre des risques, handoff DPO — flux de travail Article 35 RGPD"
---

# Compétence Confidentialité PIA

## Quand l'activer
- Lancer une nouvelle fonctionnalité produit qui traite données personnelles
- Intégrer un nouveau fournisseur qui manipulera données personnelles
- Modifier votre utilisation de données personnelles existantes (nouveau but, nouveau partage)
- DPIA obligatoire en vertu de l'Article 35 RGPD (profilage systématique, traitement à grande échelle, surveillance publique)
- Préparer documentation gouvernance confidentialité pour audit conformité

## Quand NE PAS l'utiliser
- Réponse à violation de données en direct — processus différent (Art. 33/34 RGPD)
- Demandes d'accès de sujets de données — utiliser compétence DSAR
- Soumissions formelles aux autorités de surveillance — nécessite votre DPO + avocat

## ⚠️ Important

Un DPIA est obligatoire en vertu de l'Art. 35 RGPD avant traitement « susceptible de résulter en haut risque. » Échouer à conduire un DPIA requis est elle-même une violation. Claude structure l'évaluation — votre DPO doit examiner et approuver avant le début du traitement.

## Instructions

### Étape 1 — Intake d'activité de traitement

```
Document cette activité de traitement :

Nom d'activité : [ce que vous construisez ou changez]
But : [pourquoi vous traitez ces données — être spécifique]
Sujets de données : [qui — clients / employés / utilisateurs / public]
Catégories de données personnelles :
- Standard : [nom, email, adresse, téléphone, etc.]
- Catégories spéciales (Art. 9 RGPD) : [santé / biométrique / origine ethnique / politique / religieux / orientation sexuelle / condamnations criminelles]
Contrôleur : [votre organisation]
Contrôleurs conjoints (le cas échéant) : [autres organisations avec pouvoir décisionnel]
Processeurs : [fournisseurs / outils manipulant données en votre nom]
Pays impliqués : [où données stockées / transférées vers]
Période de rétention : [combien de temps vous conservez les données]
```

### Étape 2 — Base légale

```
Identifier la base légale pour cette activité de traitement.

RGPD Article 6 bases légales (choisissez une) :
1. Consentement (Art. 6(1)(a)) : librement donné, spécifique, informé, sans équivoque — peut être retiré
2. Contrat (Art. 6(1)(b)) : nécessaire pour contrat avec sujet de données
3. Obligation légale (Art. 6(1)(c)) : requis par loi UE/État membre
4. Intérêts vitaux (Art. 6(1)(d)) : protéger la vie
5. Tâche publique (Art. 6(1)(e)) : intérêt public ou autorité officielle
6. Intérêts légitimes (Art. 6(1)(f)) : vos intérêts vs. droits sujet de données (LIA requis)

Pour données de catégorie spéciale, AUSSI besoin condition Art. 9(2) :
- Consentement explicite
- Obligation de droit du travail
- Intérêts vitaux (personne incapacitée)
- Activités légitimes organisme but non-lucratif
- Manifestement rendu public
- Réclamations légales
- Intérêt public substantiel
- Santé/soins sociaux
- Santé publique
- Archivage/recherche

Documenter la base légale et pourquoi elle s'applique.
[VÉRIFIEZ] avec DPO — sélectionner base incorrecte est problème conformité.
```

## Exemple

**Nouvelle fonctionnalité :** Une app veut utiliser données de localisation + historique d'achat pour construire profils utilisateur pour publicité personnalisée.

**Évaluation Claude :**

**Activité de traitement :** Combiner données de localisation et historique d'achat pour profilage-basé publicité personnalisée.

**Base légale :** Consentement (Art. 6(1)(a)) requis — intérêts légitimes peu susceptibles de dépasser étant donné intrusivité du suivi de localisation.

**DPIA obligatoire :** OUI — profilage systématique (critère 1), appariement de plusieurs datasets (critère EDPB 6), caractère spécial données localisation (suivi persistant). 3+ critères satisfaits.

**Risques principaux :**
- Élevé : données profil utilisées au-delà but publicité (glissement de but) — mitigation : limitation contractuelle but + application technique
- Élevé : données localisation révèlent informations sensibles (santé, pratique religieuse, activité syndicale) — mitigation : agrégation + précision minimum
- Moyen : consentement non librement donné si fonctionnalité-gâtée — mitigation : authentique opt-in, pas pénalité refus

**Recommandation DPO :** DPIA obligatoire avant lancement. Consulter ICO si risque résiduel reste élevé après mitigation.

---

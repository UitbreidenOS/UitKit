---
name: kyc-screener
description: "Criblage KYC/AML : analyse documents, extraction bénéficiaires, grille règles évaluation, contrôles PEP/sanctions, signalement lacunes et routage escalade"
---

# Compétence KYC Screener

## Quand activer

- Intégration nouveau client entreprise et besoin compléter KYC
- Analyse documents entité (certificats constitution, titres fiduciaires, registres actionnaires)
- Identification bénéficiaires et vérification contre listes PEP/sanctions
- Évaluation dossier KYC d'un client par rapport à votre checklist conformité
- Routage cas incomplets ou risque élevé pour due diligence renforcée

## Quand NE PAS utiliser

- Remplacer signature agréée officier conformité sur clients risque élevé
- Surveillance transactions en temps réel (AML) — nécessite logiciel dédié
- Conformité sanctions formelle pour institutions financières — requiert examen juridique spécialiste

## ⚠️ Important

Résultats KYC doivent toujours être examinés et approuvés par agent conformité qualifié. Claude aide structurer et accélérer le processus — ne remplace pas jugement humain sur risque criminalité financière. Tous résultats portent `[VERIFY]`.

## Instructions

### Étape 1 — Analyse et extraction documents

```
Analyser ce document KYC et extraire toutes données structurées :

Type document : [Certificat constitution / Titre fiduciaire / Registre actionnaires / 
               Relevé bancaire / Facture services / Passeport / Permis de conduire]

Document : [coller texte ou décrire contenu]

Extraire :
- Nom entité (nom légal exact)
- Numéro d'enregistrement
- Juridiction constitution
- Adresse enregistrement
- Date constitution
- Administrateurs / dirigeants (noms, fonctions)
- Actionnaires / bénéficiaires (nom, % participation)
- Bénéficiaires ultimes (seuil > 25%, ou inférieur selon politique)

Signaler incohérences ou informations manquantes.
[VERIFY] données extraites par rapport document original.
```

### Étape 2 — Construire structure actionnariat

```
Mapper structure actionnariat d'après documents fournis :

Entités et actionnariat :
[coller ce que vous avez extrait]

Tracer chaîne actionnariat :
- Qui est le propriétaire ultime de cette entité ?
- Y a-t-il holding intermédiaire ?
- Qui franchit seuil bénéficiaire ultime (généralement 25%) ?
- Y a-t-il trusts, nominees, structures complexes ?

Signaler structures :
- Utilisant certificats au porteur (risque élevé)
- Ayant administrateurs mandataires (risque élevé)
- Impliquant couches multiples holding offshore (risque élevé)
- Ne pouvant identifier personne physique bénéficiaire ultime (lacune critique)

[VERIFY] chaîne actionnariat complète et traçable jusqu'à personnes physiques.
```

### Étape 3 — Appliquer grille règles KYC

```
Évaluer ce dossier KYC par rapport exigences :

Type client : [personne physique / entreprise / trust / fonds]
Niveau risque : [standard / moyen / élevé / PEP]
Notre politique KYC nécessite : [décrire exigences ou coller politique]

Documents soumis :
[lister chaque document avec date et émetteur]

Pour chaque document requis, marquer : ✓ Reçu | ✗ Manquant | ⚠ À actualiser (expiré)

Checklist corporatif KYC courant :
- Certificat constitution ✓/✗
- Statuts et règlement ✓/✗
- Registre administrateurs ✓/✗
- Registre actionnaires / déclaration bénéficiaire ultime ✓/✗
- Preuve adresse enregistrement ✓/✗
- Copies passeport certifiées tous bénéficiaires > 25% ✓/✗
- Preuve adresse tous bénéficiaires (< 3 mois) ✓/✗
- Déclaration source fonds / richesse ✓/✗
- Comptes auditées récentes (si disponible) ✓/✗

Générer rapport lacunes lisant items manquants avec priorité (bloquant vs. non-bloquant).
[VERIFY] checklist correspond exigences juridiction.
```

### Étape 4 — Contrôle PEP et sanctions

```
Cribler ces noms/entités par rapport bases données risque :

Noms à cribler : [lister tous administrateurs, bénéficiaires et entité]
Juridictions : [pays incorporation et résidence]

Vérifier par rapport à :
- Liste Sanctions ONU
- Liste SDN OFAC (US)
- Liste Sanctions consolidée UE
- Sanctions HM Treasury UK
- [Liste juridiction]
- PEP (Personne Politiquement Exposée) : chef d'État, haut fonctionnaire gouvernement, 
  magistrat, haute direction entreprise publique, haut militaire,
  famille immédiate et associés connus

Pour chaque correspondance : correspondance nom exact / correspondance partielle / pas correspondance
Signaler correspondances partielles pour examen renforcé.

Note : Criblage temps réel requiert intégration WorldCheck, Refinitiv, Dow Jones ou similaire.
Claude identifie noms à cribler ; criblage doit utiliser bases données vérifiées.
[VERIFY] tous noms par rapport bases données sanctions en direct avant onboarding.
```

### Étape 5 — Évaluation risque et routage

```
Basée sur examen KYC ci-dessus, évaluer risque global :

Facteurs risque présents :
[lister ce que vous avez trouvé — risque juridiction, PEP, structure complexe, etc.]

Appliquer scoring risque :
RISQUE BAS : Entreprise domestique standard, criblage propre, documentation complète
RISQUE MOYEN : Un ou plusieurs facteurs risque élevé — router manager conformité
RISQUE ÉLEVÉ : PEP, juridiction risque élevé, structure complexe, information négative — Due Diligence Renforcée requise
REFUSÉ : Interdit par politique (juridictions GAFI risque élevé, hit sanctions, pas bénéficiaire ultime identifiable)

Décision routage :
- BAS : Manager relation peut procéder
- MOYEN : Examen manager conformité dans [X] jours ouvrables
- ÉLEVÉ : Approbation officier conformité senior + MLRO (Responsable Rapports Blanchiment d'Argent) requise
- REFUSÉ : Documenter décision, référer MLRO pour examen Rapport Activité Suspecte

[VERIFY] décision routage avec officier conformité.
```

## Exemple

**Utilisateur :** Nous intégrons une holding îles Vierges britanniques avec trois couches actionnariat avant d'atteindre bénéficiaires ultimes individuels.

**Analyse Claude :**

**Risque structure :** ÉLEVÉ — Juridiction BVI + couches holding multiples + motif administrateur mandataire.

**Documents nécessaires (en plus standard) :**
- Registre adhérents chaque entité intermédiaire
- Déclaration bénéficiaire ultime notariée pour chaque couche
- Source richesse bénéficiaires dépassant seuil 10% (non juste 25%)
- Déclaration objet holding BVI

**PEP/sanctions :** Cribler tous noms par rapport OFAC + UE + ONU + UK + listes. Structure BVI justifie criblage par rapport base données propriété bénéficiaire FinCEN.

**Routage :** Due Diligence Renforcée requise avant onboarding. Officier conformité senior et MLRO approuvez requis. [VERIFY] toutes découvertes.

---

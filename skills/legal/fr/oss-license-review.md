---
name: oss-license-review
description: "Classification de licence open source : permissive vs copyleft vs réseau copyleft, matrice de compatibilité, obligations de modèle de déploiement, exigences d'attribution et avis"
---

# Compétence Examen de Licence OSS

## Quand l'activer
- Examiner les licences open source des dépendances avant d'expédier un produit
- Déterminer si la licence d'une bibliothèque est compatible avec votre produit commercial
- Comprendre les obligations quand vous distribuez software avec composants OSS
- Vérifier si l'utilisation d'une bibliothèque GPL vous obligerait à ouvrir votre code
- Construire une liste de logiciels (SBOM) pour conformité ou ventes entreprise

## Quand NE PAS l'utiliser
- Avis juridiques formels sur compatibilité de licence pour situations à enjeux élevés — consulter avocat
- Licences de brevets ou indemnification de brevets — domaine différent de la PI
- Marques liées aux noms de projets open source — analyse différente

## Instructions

### Classer une licence unique

```
Classer cette licence et expliquer ce qu'elle signifie pour mon projet :

Licence : [MIT / Apache 2.0 / GPL v2 / GPL v3 / LGPL / AGPL / MPL 2.0 / BSD 2-clause / BSD 3-clause / autre]

Mon projet :
- Type : [SaaS (pas distribution binaire) / app mobile / app de bureau / bibliothèque / intégré]
- Comment j'utilise cette bibliothèque : [lié / regroupé / modifié / inmodifié]
- Distribution : [oui — public / interne seulement / pas de distribution]

Dites-moi :
1. Quelle catégorie est cette licence (permissive / copyleft faible / copyleft fort / copyleft réseau) ?
2. Quelles sont mes obligations spécifiques ?
3. Suis-je obligé de libérer mon code source ?
4. Quelles exigences d'attribution/avis s'appliquent ?
5. Y a-t-il une subvention de brevet ?
```

### Matrice de compatibilité de licence

```
Mon projet est licencié sous : [MIT / Apache 2.0 / propriétaire commercial / autre]

Je veux utiliser ces dépendances OSS :
1. [nom de la bibliothèque] — [licence]
2. [nom de la bibliothèque] — [licence]
3. [nom de la bibliothèque] — [licence]

Pour chaque dépendance :
- Cette licence est-elle compatible avec la licence de mon projet ?
- Quelles obligations cela crée-t-il ?
- Puis-je distribuer mon produit sans libérer mon code source ?
- Considérations spéciales pour SaaS/cloud deployment ?
```

## Exemple

**Utilisateur :** Nous construisons un produit SaaS et avons découvert que nous utilisons une bibliothèque sous licence AGPL pour la génération de PDF. Nous ne l'avions pas réalisé. Qu'est-ce que cela signifie ?

**Analyse Claude :**

**Problème critique — AGPL dans un produit SaaS.**

AGPL v3 Section 13 étend le copyleft GPL à l'utilisation réseau : « si vous modifiez le Programme, votre version modifiée doit offrir éminence à tous les utilisateurs interagissant avec elle à distance via un réseau informatique (si votre version supporte cette interaction) une opportunité de recevoir la Source Correspondante. »

**Ce que cela signifie pour votre SaaS :**
- Si vous avez modifié la bibliothèque de quelque manière, vous pouvez être obligé de libérer votre code source d'application entière aux utilisateurs qui interagissent avec lui sur le réseau
- Même si vous l'avez utilisé inmodifié, les exigences AGPL « source correspondante » sont interprétées largement par certaines juridictions

**Vos options :**
1. **Remplacer la bibliothèque** avec alternative MIT/Apache-licenciée (recommandé si vous voulez garder source fermée)
2. **Acheter licence commerciale** si la bibliothèque offre (modèle commun — vérifiez site web)
3. **Open source votre SaaS** sous licence compatible (rarement désiré)
4. **Consulter avocat** pour évaluer votre risque spécifique

**Action immédiate :** Cessez de distribuer le produit actuel jusqu'à résolution. [VÉRIFIEZ] interprétation avec avocat IP.

---

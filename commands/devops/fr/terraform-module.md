---
description: Générer un module Terraform réutilisable pour le composant d'infrastructure décrit
argument-hint: "[component: e.g. vpc, rds, ecs-service, s3-bucket]"
---
Générer un module Terraform de qualité production pour : $ARGUMENTS

Fournisseur cible : inférer du contexte (AWS/GCP/Azure) ou par défaut AWS si ambigu. Utiliser la dernière version stable du fournisseur.

Générer la structure de fichiers suivante :
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimal — tableau entrées/sorties uniquement)
```

Standards à suivre :

`versions.tf`:
- Épingler `required_version` Terraform à `>= 1.5`
- Épingler la version du fournisseur avec une contrainte `~>` à la version mineure la plus récente

`variables.tf`:
- Chaque variable a une `description` et un `type` — pas de types `any`
- Utiliser des blocs `validation` pour les valeurs avec des contraintes connues (plages CIDR, types d'instances autorisés, formats de tags)
- Variables sensibles marquées `sensitive = true`
- Fournir `default` uniquement quand une valeur sûre et largement applicable existe — laisser les entrées obligatoires sans défauts

`main.tf`:
- Appliquer les tags/labels standard : `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Utiliser `for_each` plutôt que `count` pour les ressources multi-instances
- Pas de région hardcodée, d'ID de compte ou d'ARN — dériver des sources de données (`aws_caller_identity`, `aws_region`)
- Activer le chiffrement au repos sur toutes les ressources de stockage
- Activer la protection contre la suppression sur les ressources avec état (RDS, DynamoDB) — exposer comme variable par défaut à `true`

`outputs.tf`:
- Exporter l'ID de ressource, l'ARN (si applicable), et tout endpoint/noms DNS dont les consommateurs auront besoin
- Marquer les sorties sensibles `sensitive = true`

Après le contenu du fichier, afficher :
1. Un exemple de bloc `module {}` montrant comment un module racine appellerait ceci
2. Toutes les permissions IAM dont le rôle d'exécution Terraform a besoin pour gérer ces ressources
3. Les pièges connus au moment de la destruction (par exemple, seaux S3 non vides, exigences de snapshot RDS)

# Règles Terraform

## S'applique à
Tous les fichiers Terraform (`*.tf`, `*.tfvars`) et les configurations OpenTofu.

## Règles

1. **Utilisez l'état distant avec le verrouillage d'état** — ne stockez jamais `terraform.tfstate` dans le contrôle de version. Utilisez S3 + DynamoDB, GCS, ou Terraform Cloud. L'état contient des secrets en texte clair et les applications concurrentes corrompent l'état local.

2. **Épinglez les versions des fournisseurs et des modules** — `version = "~> 5.0"` et non `version = "latest"`. Les fournisseurs sans version cassent silencieusement les applications lors des versions en amont. Exécutez `terraform init -upgrade` délibérément, pas accidentellement.

3. **Ne commitez jamais les fichiers `*.tfvars` contenant des secrets** — utilisez des variables d'environnement (`TF_VAR_*`), une intégration de gestionnaire de secrets, ou Vault. Ajoutez `*.tfvars` à `.gitignore` pour les environnements avec des valeurs sensibles.

4. **Séparez l'état par environnement** — `dev/`, `staging/`, `prod/` ont chacun leur propre configuration de backend d'état. Un `terraform destroy` dans dev ne doit jamais toucher la production.

5. **Utilisez des modules pour les modèles d'infrastructure réutilisables** — un module doit représenter une unité cohérente (VPC, cluster EKS, instance RDS). Ne copiez pas les blocs de ressources dans les environnements ; paramétrez-les.

6. **Exécutez toujours `terraform plan` dans CI avant `apply`** — la sortie du plan est l'ensemble des modifications. Examinez-la. Échouez le pipeline si le plan affiche des suppressions inattendues.

7. **Marquez les sorties sensibles avec `sensitive = true`** — empêche les valeurs d'apparaître dans la sortie `terraform plan`/`apply` et dans les journaux CI.

8. **Utilisez `lifecycle { prevent_destroy = true }` sur les ressources avec état** — les bases de données, les buckets S3 avec des données, et les clés KMS ne doivent pas être accidentellement détruits par un plan. Rendre la destruction une action délibérée.

9. **Nommez les ressources avec un préfixe d'environnement et une convention de suffixe cohérente** — `prod-payments-rds` et non `database`. Les noms sans ambiguïté survivent dans les consoles AWS, les journaux, et les ventilations de facturation.

10. **Utilisez les sources `data` pour les ressources pré-existantes, `resource` pour les ressources gérées** — importer un VPC que vous n'avez pas créé avec Terraform dans un bloc `resource` fait de Terraform la source de vérité pour quelque chose qu'il ne possède pas entièrement.

11. **Validez et formatez dans CI** — `terraform validate` détecte les erreurs de configuration. `terraform fmt -check` applique un formatage canonique. Les deux doivent échouer la construction s'ils échouent.

12. **Utilisez `for_each` plutôt que `count` pour les collections de ressources** — `count` utilise un index positionnel ; supprimer l'index 0 décale tous les autres. `for_each` utilise des clés de mappage stables et évite les remplacements involontaires.

13. **Documentez les variables avec `description` et définissez les types explicitement** — `type = string` et non implicite. `description` apparaît dans la sortie `terraform-docs` et dans l'interface utilisateur Terraform Cloud.

14. **Examinez la sortie `terraform plan` pour `forces replacement`** — un remplacement de ressource détruit et recrée. Pour les ressources avec état (bases de données, adresses IP), c'est presque toujours erroné et nécessite une gestion explicite.

15. **Utilisez les blocs `moved` lors de la refactorisation des adresses de ressources** — renommer une ressource sans un bloc `moved` provoque une destruction + création. Le bloc `moved` instruits Terraform de migrer l'état en toute sécurité.


---

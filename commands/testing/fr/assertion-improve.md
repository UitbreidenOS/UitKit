---
description: Renforcer les assertions faibles ou superficielles dans les tests existants
argument-hint: "[test file or directory]"
---
Examinez et améliorez les assertions dans : $ARGUMENTS

Étapes :

1. Lisez le fichier cible ou tous les fichiers de test sous le répertoire cible.

2. Identifiez les motifs d'assertions faibles — notez chacun avec le chemin du fichier et le numéro de ligne :

   **Appariements trop larges**
   - `toBeTruthy` / `toBeFalsy` quand une valeur spécifique est vérifiable
   - `toBeDefined` quand la structure ou le type peut être asserré
   - `toContain` sur des objets entiers quand une correspondance exacte serait appropriée

   **Couverture incomplète**
   - Tests qui affirment la valeur de retour mais pas l'effet secondaire (ou vice versa)
   - Chemins d'erreur qui vérifient seulement `throw` sans vérifier le message d'erreur ou le type
   - Fonctions asynchrones dont le cas de rejet n'est pas testé

   **Surexposition des snapshots**
   - Les snapshots couvrant des arbres de composants entiers et volumineux où des assertions de propriété ciblées seraient plus stables et lisibles
   - Snapshots qui codifient les détails d'implémentation non pertinents (par exemple, les noms de classes CSS internes)

   **Vérifications des limites manquantes**
   - Fonctions acceptant des tableaux/chaînes mais pas de test pour l'entrée vide
   - Fonctions numériques sans test à zéro, négatif ou limite maximale
   - Paramètres nullables sans test null/undefined

   **Nombre d'assertions**
   - Tests sans assertions (faux passage)
   - Tests avec une seule `expect` qui ne peut pas distinguer entre deux modes de défaillance similaires

3. Pour chaque constatation, affichez :
   - L'assertion actuelle
   - Pourquoi elle est faible
   - Un remplacement qui est plus spécifique, significatif ou complet

4. Appliquez tous les changements qui sont sans ambiguïté des améliorations — ne changez pas les tests réussis en tests échoués.

5. N'ajoutez pas de nouveaux cas de test ; améliorez uniquement les assertions au sein des tests existants.

6. Résumez : X assertions examinées, Y remplacées, Z signalées mais non modifiées (avec raison).

---
description: Renforcer les assertions faibles ou superficielles dans les tests existants
argument-hint: "[fichier de test ou répertoire]"
---
Examinez et améliorez les assertions dans : $ARGUMENTS

Étapes :

1. Lisez le fichier cible ou tous les fichiers de test du répertoire cible.

2. Identifiez les motifs d'assertions faibles — notez chacun avec le chemin du fichier et le numéro de ligne :

   **Matchers trop larges**
   - `toBeTruthy` / `toBeFalsy` quand une valeur spécifique est vérifiable
   - `toBeDefined` quand la forme ou le type peut être affirmé
   - `toContain` sur des objets complets quand une correspondance exacte serait appropriée

   **Couverture incomplète**
   - Les tests qui affirment la valeur de retour mais pas l'effet secondaire (ou vice versa)
   - Les chemins d'erreur qui vérifient seulement `throw` sans vérifier le message d'erreur ou le type
   - Les fonctions asynchrones dont le cas de rejet n'est pas testé

   **Abus de snapshots**
   - Les snapshots couvrant des arbres de composants entiers volumineux où des assertions de propriété ciblées seraient plus stables et lisibles
   - Les snapshots qui codifient des détails d'implémentation sans pertinence (par exemple, les noms de classes CSS internes)

   **Vérifications des limites manquantes**
   - Les fonctions acceptant des tableaux/chaînes mais aucun test pour l'entrée vide
   - Les fonctions numériques sans test à zéro, négatif ou avec limite maximale
   - Les paramètres nullables sans test pour null/undefined

   **Nombre d'assertions**
   - Les tests avec zéro assertion (faux passage)
   - Les tests avec un seul `expect` qui ne peut pas distinguer entre deux modes d'échec similaires

3. Pour chaque constatation, montrez :
   - L'assertion actuelle
   - Pourquoi c'est faible
   - Un remplacement plus spécifique, significatif ou complet

4. Appliquez tous les changements qui sont sans ambiguïté des améliorations — ne modifiez pas les tests réussis en tests échoués.

5. N'ajoutez pas de nouveaux cas de test ; améliorez uniquement les assertions dans les tests existants.

6. Résumé : X assertions examinées, Y remplacées, Z signalées mais non modifiées (avec raison).

---
description: Trouver et éliminer la logique, les données ou les structures dupliquées
argument-hint: "[fichier ou répertoire]"
---
Dédupliquez le code dans $ARGUMENTS.

1. Analysez la portée pour détecter les duplications :
   - Corps de fonctions identiques ou quasi-identiques (>5 lignes avec variation triviale)
   - Structures de données ou blocs de configuration copiés-collés avec des différences mineures
   - Logique en ligne répétée qui pourrait être extraite une seule fois (par exemple, la même validation, le même comparateur de tri, la même transformation)
   - Définitions de type dupliquées ou déclarations d'interface
   - Plusieurs fonctions qui ne diffèrent que par une seule valeur de paramètre — candidates pour la paramétrisation

2. Pour chaque cluster de duplications trouvé :
   - Identifiez la version canonique à conserver (préférez la plus complète, la mieux nommée ou la plus récemment modifiée)
   - Déterminez si les copies diffèrent par les données (→ paramétrisez) ou par le comportement (→ gardez-les séparées, ce ne sont pas des duplications)
   - Produisez une seule implémentation partagée : extrayez une fonction, une constante ou un type selon le cas

3. Remplacez tous les sites dupliqués par des appels à l'implémentation partagée. Ne laissez pas les anciennes copies en place.

4. Après le remplacement, supprimez tous les imports ou helpers qui existaient uniquement pour supporter les copies supprimées.

5. Résultat : pour chaque dédupliquage, listez le symbole partagé créé, le nombre de sites remplacés et où chacun était situé.

Contraintes :
- « Similaire » ne signifie pas « dupliqué ». Fusionnez uniquement le code qui a la même intention et la même sémantique — ne forcez pas du code non lié à une abstraction partagée simplement parce qu'il se ressemble.
- N'introduisez pas une nouvelle couche d'abstraction (classe, module, mixin) juste pour dédupliquer une seule paire de deux fonctions. Une simple extraction de fonction est suffisante.
- Préservez tous les comportements existants. Si l'effondrement des duplications nécessite des changements subtils à un site d'appel, signalez-les explicitement.
- Ne dédupliquez pas les tests — la redondance des tests est souvent intentionnelle.

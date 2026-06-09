---
description: Expliquer l'historique et l'intention derrière un fichier ou des lignes spécifiques en utilisant git blame et log
argument-hint: "<file> [start-line:end-line]"
---
Parse $ARGUMENTS:
- First token is the file path (required).
- Optional second token is a line range in the format `start:end` (e.g., `42:67`).

Si aucun fichier n'est fourni, demandez à l'utilisateur d'en fournir un et arrêtez-vous.

Run the following, substituting the parsed values:
- `git blame -w -M -C --line-porcelain <file>` (or `-L <start>,<end>` if a range was given)
- `git log --follow --oneline -- <file>` to get the full rename/move history
- For the top 5 most-cited commits in the blame output: `git show <sha> --stat --format="%H %ae %ad %s%n%b"` to fetch their full context

Produisez une explication organisée comme suit :

**Vue d'ensemble du fichier**
Un paragraphe : ce que le fichier fait, son ancienneté, le nombre d'auteurs qui l'ont modifié, et la forme générale de son historique (stable ou fréquemment modifié).

**Attribution ligne par ligne (ou bloc par bloc)**
Pour chaque commit distinct qui possède des lignes dans la plage de blame :
- SHA du commit (court), auteur, date
- Lignes possédées (plage ou nombre)
- Ce que ce commit a changé et *pourquoi* (déduit du message de commit et du contexte de diff)
- Que le changement faisait partie d'une refonte plus large, d'une correction de bug, d'une fonctionnalité ou d'une annulation

**Insight clé**
Deux à quatre phrases : ce que l'historique révèle sur l'intention de conception ou les contraintes derrière le code actuel — par exemple, un contournement pour un bug connu, un contrat API qui ne peut pas changer, une contrainte de performance documentée uniquement dans l'historique des commits.

**Lignes risquées**
Signalez les lignes qui :
- Ont été modifiées pour la dernière fois il y a plus de 2 ans par un auteur qui n'apparaît plus dans les commits récents
- Ont été modifiées 4 fois ou plus (fort changement)
- Ont été introduites par un message de commit contenant « hack », « workaround », « tmp », « fixme » ou « revert »

Ne modifiez aucun fichier. Ne lancez pas `git checkout` ni aucune opération d'écriture.

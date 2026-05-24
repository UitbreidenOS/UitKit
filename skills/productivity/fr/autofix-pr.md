# /autofix-pr — Application Automatique des Corrections de PR

## Quand activer
L'utilisateur veut que Claude applique automatiquement les suggestions d'examen du code sans intervention manuelle ; l'utilisateur mentionne `/autofix-pr` ; l'utilisateur veut un raffinement automatique de PR après avoir poussé le code et reçu des commentaires d'examinateur.

## Quand ne PAS utiliser
L'utilisateur veut examiner chaque changement avant qu'il soit appliqué ; dépôts sans intégration GitHub ; PR avec des commentaires d'examen architectural complexes qui nécessitent des appels de jugement ; situations où tout auto-commit sur la branche violerait la politique d'équipe.

## Instructions

**Ce qu'il fait :**
`/autofix-pr` permet l'application automatique des suggestions d'examen de PR non-destructrices. Claude lit les commentaires d'examen ouverts sur le PR actuel et applique les correctifs qui répondent aux critères d'auto-application sans attendre une confirmation manuelle.

**Ce que Claude applique automatiquement :**
- Corrections de formatage (indentation, espaces de fin, lignes vides)
- Corrections de typos dans le code et les commentaires
- Renommages de variables simples où l'examinateur a indiqué le nouveau nom explicitement
- Refactorisations évidentes avec une description claire et non ambiguë ("extraire cela dans une fonction d'aide nommée X")
- Correctifs de règles de linting (imports non utilisés, points-virgules manquants, const vs let)

**Ce que Claude n'applique PAS automatiquement :**
- Changements architecturaux (déplacement de fichiers, restructuration de modules)
- Réécritures de logique ou changements d'algorithme
- Tout ce qui nécessite un jugement concernant les compromis
- Suggestions formulées sous forme de questions ("peut-être considérer…?")
- Suggestions ambiguës où plusieurs interprétations valides existent

**Gestion des commentaires ambigus :**
Claude vous montre le commentaire, explique pourquoi il est ambigu, et demande avant d'appliquer. Vous répondez, Claude applique, passe au suivant.

**Exigences :**
- Le dépôt doit être connecté à Claude Code (même session qui a ouvert le PR, ou une session dans le même dépôt local)
- L'intégration GitHub doit être active
- Le PR doit être ouvert et avoir des commentaires d'examinateur

**Visibilité :**
Chaque correctif auto-appliqué apparaît comme un commit dans la chronologie PR avec une note indiquant qu'il a été auto-appliqué. Les examinateurs voient exactement ce qui a changé et pourquoi.

**Basculer :**
- `/autofix-pr` — activer pour cette session
- `/autofix-pr off` — désactiver

## Exemple

PR a 12 commentaires d'examen. 9 sont : "utiliser `const` au lieu de `let`", "ajouter un point-virgule manquant à la ligne 47", "le nom de variable doit être `userId` pas `user_id`", "supprimer l'import non utilisé". Claude applique automatiquement les 9, les commit comme un unique commit de nettoyage, et surface les 3 commentaires architecturaux restants pour examen manuel : "Les 3 commentaires suivants nécessitent votre apport avant que je puisse les appliquer."

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

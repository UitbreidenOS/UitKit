---
description: Rédigez un enregistrement de décision architecturale ou technique (ADR) à partir d'une description
argument-hint: "[decision topic and context]"
---
Rédigez un document de décision pour ce qui suit : $ARGUMENTS

Utilisez cette structure :

**Statut :** Proposé | Accepté | Déprécié | Supercédé  
(Par défaut « Proposé » à moins que $ARGUMENTS ne spécifie autrement.)

**Contexte**  
Quelle situation force une décision maintenant. Incluez les contraintes, les pratiques antérieures, et pourquoi le statu quo est insuffisant. 3–6 phrases.

**Décision**  
Un paragraphe. Énoncez la décision directement dans la première phrase. Ne cachez pas le message principal.

**Options Considérées**

Pour chaque option (2–4 au total, y compris celle choisie) :
- **Option N : [Nom]** — description d'une phrase
  - Pro : ...
  - Pro : ...
  - Con : ...
  - Con : ...

**Conséquences**

Conséquences positives (ce qui s'améliore ou devient possible).  
Conséquences négatives / compromis (ce qui devient plus difficile, ce qui est perdu).  
Risques (ce qui pourrait mal tourner, et atténuation si connu).

**Conditions de Révision**  
Liste à puces : conditions spécifiques sous lesquelles cette décision devrait être révisée. Soyez précis — pas « si les exigences changent » mais « si le volume de requêtes dépasse 10k/s » ou « si le fournisseur X supprime l'API Y ».

Règles :
- Rédigez pour un lecteur qui rencontrera ce document dans 18 mois sans autre contexte.
- Ne recommandez pas l'option « évidemment correcte » sans énumérer les véritables inconvénients.
- N'ajoutez pas de contexte qui est une connaissance commune pour un ingénieur senior.
- Si $ARGUMENTS ne fournit pas assez de contexte pour nommer les options réelles, énoncez les deux alternatives les plus courantes de l'industrie et notez que le lecteur devrait les valider.
- Limitez la longueur totale à moins de 600 mots à moins que la décision soit exceptionnellement complexe.

Sortie du document uniquement.

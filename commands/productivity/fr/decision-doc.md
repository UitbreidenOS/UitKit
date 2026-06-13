---
description: Rédiger un document d'enregistrement de décision architecturale ou technique (ADR) à partir d'une description
argument-hint: "[sujet de décision et contexte]"
---
Rédigez un document de décision pour ce qui suit : $ARGUMENTS

Utilisez cette structure :

**Statut :** Proposé | Accepté | Déprécié | Remplacé  
(Défaut à « Proposé » à moins que $ARGUMENTS ne spécifie autrement.)

**Contexte**  
La situation qui force une décision maintenant. Incluez les contraintes, l'état de l'art, et pourquoi le statu quo est insuffisant. 3–6 phrases.

**Décision**  
Un paragraphe. Énoncez la décision directement dans la première phrase. Ne cachez pas l'essentiel.

**Options Considérées**

Pour chaque option (2–4 au total, y compris celle choisie) :
- **Option N : [Nom]** — description d'une phrase
  - Avantage : ...
  - Avantage : ...
  - Inconvénient : ...
  - Inconvénient : ...

**Conséquences**

Conséquences positives (ce qui s'améliore ou devient possible).  
Conséquences négatives / compromis (ce qui devient plus difficile, ce qui est perdu).  
Risques (ce qui pourrait mal se passer, et atténuation si connue).

**Conditions de Révision**  
Liste à puces : conditions spécifiques sous lesquelles cette décision devrait être révisée. Soyez concret — pas « si les exigences changent » mais « si le volume de requêtes dépasse 10k/s » ou « si le fournisseur X abandonne l'API Y ».

Règles :
- Rédigez pour un lecteur qui rencontrera ce document dans 18 mois sans autre contexte.
- Ne recommandez pas l'option « évidemment correcte » sans énumérer les vrais inconvénients.
- Ne remplissez pas avec des antécédents qui sont des connaissances communes pour un ingénieur senior.
- Si $ARGUMENTS ne fournit pas assez de contexte pour nommer de vraies options, énoncez les deux alternatives les plus courantes de l'industrie et notez que le lecteur devrait les valider.
- Gardez la longueur totale sous 600 mots à moins que la décision soit inhabituellement complexe.

Produisez uniquement le document.

# Règles de Code Review

## S'applique à
Tous les examens des demandes de fusion — conduite de l'auteur et du relecteur.

## Règles

### En tant qu'auteur

1. **Gardez les PRs petites et focalisées** — un changement logique par PR. Une PR qui touche l'authentification, la facturation et le routage simultanément représente trois PRs. Les petites PRs reçoivent une meilleure relecture, fusionnent plus rapidement et s'inversent proprement.

2. **Écrivez la description de la PR pour le relecteur, pas pour vous-même** — expliquez ce qui a changé, pourquoi cela a changé et quel est le risque. Incluez un plan de test. « Bug corrigé » n'est pas une description.

3. **Auto-examinez avant de demander une relecture** — lisez votre propre diff comme si vous ne l'aviez jamais écrit. Attrapez les fautes de frappe, les artefacts de débogage, le code commenté et les cas limites manquants avant de demander l'avis d'autres.

4. **Répondez à chaque commentaire** — confirmez, résolvez ou discutez. Le silence signale un désengagement. Si vous êtes en désaccord, dites-le avec un raisonnement. Si vous êtes d'accord, appliquez la modification et marquez comme résolu.

5. **Annotez les choix non évidents** — si vous avez fait quelque chose de surprenant et la raison n'est pas capturée dans un commentaire de code, expliquez-le dans la description de la PR ou comme réponse à la question « pourquoi ? » attendue.

### En tant que relecteur

6. **Distinguez les blocages des suggestions** — préfixez clairement les commentaires : `blocking:`, `nit:`, `question:`, `suggestion:`. Les relecteurs qui marquent tout comme bloquant ralentissent la livraison. Réservez le blocage à la correction et à la sécurité.

7. **Examinez l'intention, pas seulement les lignes** — le changement réalise-t-il ce que la description de la PR prétend ? Y a-t-il des cas limites que les tests ne couvrent pas ? Seriez-vous à l'aise de posséder ce code ?

8. **Suggérez, ne dictez pas le style** — les commentaires de style doivent référencer une règle documentée. « J'aurais fait de cette façon » n'est pas un commentaire bloquant à moins que la règle existe. Le style sans règle est une préférence.

9. **Approuvez quand c'est assez bon, pas parfait** — le coût d'une PR bloquée s'accumule. Si les nits restants sont mineurs et non bloquants, approuvez et laissez l'auteur décider. Le parfait est l'ennemi de la livraison.

10. **Ne révisez pas les PRs obsolètes sans reconnaître la refonte** — si une PR a été refondue depuis votre dernière révision, notez-le et révisez le diff à partir de zéro. Les révisions obsolètes créent une fausse confiance.

### Processus

11. **Première révision dans une journée ouvrable** — les PRs se dégradent. Le contexte s'efface. Les révisions retardées démotivent les auteurs et bloquent le travail dépendant. Définissez les attentes de l'équipe et honorez-les.

12. **Évitez la révision par comité sur chaque PR** — un relecteur requis est généralement suffisant. Plusieurs approbateurs requis pour chaque changement créent des goulots d'étranglement. Réservez les exigences multi-relecteur pour les chemins à haut risque (authentification, paiements, migrations de données).

13. **Vérifiez les signaux automatisés avant de faire une relecture** — CI doit passer avant la révision humaine. Si les tests échouent ou que le linting est cassé, renvoyez la PR à l'auteur. Ne révisez pas le code que la machine a déjà rejeté.

14. **N'approuvez pas ce que vous ne comprenez pas** — « LGTM » sur du code que vous ne pouvez pas expliquer est un risque. Posez des questions jusqu'à ce que vous compreniez le changement. Une question n'est pas un blocage.

15. **Documentez les modèles qui valent la peine d'être répétés** — si une révision découvre un modèle qui devrait être appliqué largement, ne le corrigez pas seulement dans cette PR. Déposez une règle, ajoutez un lint ou mettez à jour le guide de codage.


---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec les communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

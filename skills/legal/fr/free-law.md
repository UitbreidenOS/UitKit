# Free Law Project (CourtListener) — Recherche Légale Gratuite US

## Quand activer
Recherche de décisions des cours fédérales et d'État américaines sans abonnement payant ; recherche de dépôts PACER, de numéros de dossier, ou de dossiers de juges ; recherches massives de jurisprudence où un service payant serait trop coûteux ; recherche juridique en accès libre pour travail universitaire ou d'intérêt public.

## Quand ne PAS utiliser
La recherche nécessitant des sources secondaires (analyse de revue de droit, notes d'orientation Practical Law, notes de tête Westlaw) — utiliser le MCP Thomson Reuters pour ceux-ci ; recherche en dehors des cours fédérales américaines où la couverture CourtListener est clairsemée ou absente ; travail sensible au temps nécessitant une couverture de opinions garantie le même jour (certaines opinions récentes ont des délais de publication).

## Instructions

**Ce qu'il est :**
Free Law Project gère CourtListener — la plus grande base de données légale américaine gratuite et en accès libre. L'intégration MCP (mai 2026) ne nécessite aucun abonnement, aucun achat de clé API, et aucune facturation par requête.

**Couverture :**
- Opinions des cours d'appel et de district fédérales (complètes)
- Opinions de la Cour suprême américaine (complètes)
- Dépôts PACER et données de dossiers (cours fédérales)
- Dossiers biographiques des juges, historique de récusation, divulgations financières
- Enregistrements d'arguments oraux (le cas échéant)
- La couverture des cours d'État varie considérablement selon l'État — vérifiez avant de compter sur l'exhaustivité de la cour d'État

**Limites de débit :**
Le niveau gratuit a des limites de débit. Structurez les requêtes pour être spécifiques et ciblées — évitez les requêtes larges rapides. Regroupez les recherches connexes en requêtes uniques le cas échéant.

**Types de requête :**

Recherche de cas par mot-clé :
```
Trouvez les opinions de la 9e Circuit de 2023-2026 impliquant du contenu généré par IA
et la violation du droit d'auteur. Retournez les citations et un résumé de conclusion d'un paragraphe.
```

Recherche de citation :
```
Récupérez le texte complet de Twitter, Inc. v. Taamneh, 598 U.S. 471 (2023).
```

Dossiers des juges :
```
Quels cas le juge Jacqueline Scott Corley a-t-il jugés impliquant
la Section 230 depuis 2021?
```

Recherche de dossier :
```
Trouvez le dossier actuel pour FTC v. Meta Platforms dans le district nord
de Californie. Listez les motions en attente.
```

**Limitations — sachez avant de chercher :**
- Les cours fédérales américaines sont la force principale ; la couverture des cours d'État est incohérente
- Pas de sources secondaires, pas d'articles de revue de droit, pas de contenu Practical Law
- Certaines opinions récentes ont un délai de publication (jours à semaines)
- La couverture complète des dossiers PACER nécessite un compte PACER pour certains dépôts scellés ou restreints

**Associez avec le MCP Thomson Reuters :**
CourtListener pour le volume de sources primaires gratuites + MCP TR pour l'analyse de source secondaire et la profondeur de Westlaw. Exemple de workflow : utilisez CourtListener pour identifier les cas pertinents en masse, puis tirez l'analyse Westlaw sur les cas clés via le MCP TR.

**Avertissement de sortie OBLIGATOIRE — inclure sur chaque sortie de recherche :**
> À des fins de recherche uniquement — vérifiez avec un conseil autorisé avant de vous fier à une quelconque analyse juridique.

**Format de citation :** Incluez toujours la citation complète : nom du cas, volume, rapporteur, première page, cour, année. Exemple : `NetChoice, LLC v. Paxton, 49 F.4th 439 (5th Cir. 2022)`.

## Exemple

```
Trouvez toutes les opinions de la 9e Circuit de 2023-2026 impliquant du contenu généré par IA
et la violation du droit d'auteur. Retournez les citations Bluebook et un résumé
d'une phrase de chaque conclusion.
```

Claude interroge CourtListener via MCP, retourne une liste d'opinions correspondantes avec citations et résumés de conclusions, note quels cas ont des pétitions de certiorari en attente, et ajoute l'avertissement de recherche obligatoire.

---

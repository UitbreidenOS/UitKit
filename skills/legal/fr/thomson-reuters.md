# Recherche Légale Thomson Reuters via MCP

## Quand activer
Recherche légale nécessitant la jurisprudence, les statuts, les réglementations, ou le contenu Westlaw/Practical Law ; l'utilisateur est un avocat ou chercheur juridique utilisant Claude Code avec un abonnement API Thomson Reuters actif ; les tâches nécessitant des citations fiables de sources légales primaires et secondaires.

## Quand ne PAS utiliser
Les utilisateurs sans abonnement API Thomson Reuters — ce MCP est uniquement destiné aux entreprises, pas disponible gratuitement ; les tâches ne nécessitant pas de recherche légale fiable ; toute situation nécessitant des conseils juridiques (ce MCP fournit de la recherche, pas des conseils — marquez toujours cette distinction).

## Instructions

**Ce qu'il est :**
Thomson Reuters a lancé une intégration MCP officielle (mai 2026) connectant Claude directement aux bases de données Westlaw, Practical Law et autres bases de données TR. Les requêtes passent par votre clé API TR aux bases de données légales en direct.

**Configuration :**
Ajoutez à votre config MCP avec votre clé API TR pointant vers le point de terminaison MCP TR. Nécessite un abonnement API Thomson Reuters actif au niveau entreprise — contactez votre représentant de compte TR pour l'accès.

**Données disponibles :**
- Jurisprudence avec citations complètes (cours fédérales et d'État, tous les niveaux)
- Statuts fédéraux et d'État, courants et historiques
- Réglementations fédérales et d'État (CFR, codes administratifs d'État)
- Sources secondaires via Practical Law : notes d'orientation, documents standard, conseils de négociation, comparaisons de juridictions
- Formes et modèles légaux

**Modèles de requête qui fonctionnent bien :**

Jurisprudence :
```
Trouvez les cas interprétant les clauses de force majeure dans les contrats de logiciels de 2020-2026.
Retournez les citations au format Bluebook et un résumé de conclusion de deux phrases pour chacun.
```

Recherche de statuts :
```
Quel est le texte actuel de 17 U.S.C. § 107 (usage loyal)?
Notez tous les amendements depuis 2020.
```

Réglementaire :
```
Résumez la dernière règle de la FTC sur les divulgations de contenu généré par l'IA.
Incluez la citation CFR et la date d'entrée en vigueur.
```

Source secondaire Practical Law :
```
Quelle est la position négociatrice standard sur les plafonds de responsabilité limitée
dans les accords SaaS? Référencez la note d'orientation Practical Law pertinente.
```

**Avertissement de sortie OBLIGATOIRE — inclure sur chaque sortie de recherche :**
> À des fins de recherche uniquement — vérifiez avec un conseil autorisé avant de vous fier à une quelconque analyse juridique.

**Format de citation :** Demandez toujours le format Bluebook. Vérifiez indépendamment toutes les citations avant de déposer — les citations récupérées par MCP peuvent contenir des erreurs de formatage et ne doivent pas aller directement dans les documents judiciaires.

**Note de privilège :** Confirmez si la recherche est pour une affaire client spécifique (le privilège avocat-client peut s'appliquer) ou de la recherche générale. Cette distinction affecte comment la sortie doit être stockée et partagée.

**Combinez avec CourtListener :** Pour une couverture complète, associez Thomson Reuters (sources secondaires, analyse Westlaw) avec le MCP Free Law Project (sources primaires gratuites pour les recherches en masse). TR pour la profondeur ; CourtListener pour la largeur et le volume.

## Exemple

```
Trouvez tous les cas de cour de circuit de 2022-2026 interprétant la disposition
"dépasse l'accès autorisé" du CFAA. Résumez la scission de circuits
et la position actuelle de la Cour suprême après Van Buren c. États-Unis.
Retournez les citations Bluebook pour chaque cas.
```

Claude interroge Westlaw via le MCP TR, retourne une analyse structurée des scissions de circuits avec citations, signale les domaines de désaccord continu, et ajoute l'avertissement de recherche obligatoire.

---

---
name: ai-writing-detection
description: "Détection d'écriture IA : auditer la documentation, les articles de blog ou la copie marketing pour les modèles de texte de type IA ; quand l'utilisateur souhaite que le contenu semble plus humain ; examen avant publication"
---

# AI Writing Detection Skill

## Quand activer
Auditer la documentation, les articles de blog ou la copie marketing pour le texte à motifs IA ; quand l'utilisateur souhaite que le contenu semble plus humain ; passer en revue un README ou un document public avant publication.

## Quand ne PAS utiliser
- Les spécifications techniques ou docs API où la précision compte plus que la voix
- Les docs d'outils internes où le public ne se soucie pas du registre
- Le contenu qui a déjà été examiné et approuvé — ne pas relitiger

## Instructions

### Modèles de texte IA courants à signaler

**Hedges de remplissage — supprimer entièrement:**
- "Il vaut la peine de noter que..."
- "Il est important de comprendre que..."
- "Certainement!" / "Absolument!" / "Bien sûr!" (réponses d'ouverture)
- "Je serais heureux de vous aider avec cela."

**Suremploi de transition — remplacer par une phrase directe ou rien:**
- "En conclusion, ..." — juste terminer le paragraphe
- "De plus, ..." — juste dire la chose suivante
- "De surcroît, ..." — pareil
- "De plus, ..." — pareil
- "En résumé, ..." — valide uniquement si vous résumez > 5 éléments

**Suremploi de tiret long:** plus d'un tiret long par paragraphe est un signal fort ; utiliser un point ou une virgule à la place.

**Enthousiasme non mérité:** phrases qui utilisent des points d'exclamation pour des déclarations banales (« Ceci rend le développement plus rapide! »). Réserver `!` pour les résultats réellement surprenants.

**Préambule avant de répondre:** reposer la question avant d'y répondre (« Vous avez demandé X. X est un sujet important parce que... »). Aller droit à la réponse.

**Empilement de buzzwords sans substance:**
- « exploiter les solutions alimentées par l'IA de pointe »
- « valeur synergique pour les parties prenantes »
- « architecture robuste et évolutive »
Ces phrases ne contiennent aucune information. Remplacer par une affirmation concrète ou supprimer.

**Sur-qualification:** « pourrait potentiellement », « pourrait possiblement », « pourrait peut-être ». Choisir une couverture ou aucune.

### Principes de réécriture

1. **Commencer par le fait.** Bad: "Il est important de noter que l'authentification nécessite un jeton valide." Good: "Les demandes nécessitent un jeton valide."

2. **Couper le préambule.** Supprimer toute phrase qui repose le contexte que le lecteur a déjà.

3. **Préférer les noms concrets.** Bad: "le système traite les données." Good: "l'API valide et stocke le corps de la demande."

4. **Voix active.** Bad: "La configuration est chargée par l'application au démarrage." Good: "L'application charge la configuration au démarrage."

5. **Correspondre le vocabulaire au lecteur.** Un public de développeur n'a pas besoin des explications « en d'autres termes » de REST ou JSON. Un public non technique n'a pas besoin d'acronymes non expliqués.

6. **Couper tout ce qui n'ajoute pas d'information.** Lire chaque phrase et demander : si j'ai supprimé cela, le lecteur saurait-il moins? Si non, le supprimer.

### Ce qu'il ne faut pas changer
- Termes techniques, même s'ils semblent formels — « idempotent », « désérialisation », « mutex » sont précis
- Exemples de code — ne jamais réécrire le code dans le cadre d'un nettoyage de prose
- Faits précis — réécrire uniquement la prose autour d'eux, pas les affirmations elles-mêmes
- Listes structurées — si une liste est claire et correcte, la laisser ; ne pas convertir en prose

### Liste de contrôle de détection
Parcourir cette liste lors de l'examen d'un document:
- [ ] Une phrase commence-t-elle par « Il vaut la peine de noter » ou « Il est important de »?
- [ ] Y a-t-il plus de 2 tirets longs par page?
- [ ] Les paragraphes commencent-ils par « Certainement », « Absolument » ou « Bien sûr »?
- [ ] « En conclusion » est-il utilisé ailleurs qu'après un résumé multi-éléments?
- [ ] « de plus », « de surcroît » ou « de plus » sont-ils utilisés plus d'une fois par section?
- [ ] Y a-t-il des points d'exclamation sur des déclarations banales?
- [ ] Le paragraphe d'ouverture repose-t-il le titre du document ou la question posée?
- [ ] Y a-t-il des phrases comme « robuste », « évolutif », « de pointe », « puissant » sans preuve à l'appui?

### Niveaux de gravité
- **Remove:** hedges, préambule, enthousiasme non mérité, buzzwords sans substance — ces éléments n'ajoutent aucune valeur
- **Rewrite:** déclarations surqualifiées, voix passive, faits enterrés — restructurer la phrase
- **Review:** tirets longs, mots de transition — un par section peut être correct; l'abus est le problème

## Exemple

**Original (texte à motifs IA):**
> Il vaut la peine de noter que notre plateforme exploite l'IA de pointe pour offrir des solutions robustes et évolutives. De plus, le système est conçu pour gérer efficacement de grands volumes de données. En conclusion, cela en fait un excellent choix pour les clients d'entreprise.

**Après application de cette compétence:**
> La plateforme traite jusqu'à 10 000 demandes par seconde et se met à l'échelle horizontalement dans les régions. Les clients d'entreprise peuvent la déployer sans modifications d'infrastructure.

Modifications apportées : suppression de « il vaut la peine de noter », remplacement de « l'IA de pointe / robuste / évolutif » par un nombre de débit concret, suppression de « de plus » et « en conclusion », conversion en voix active et suppression de la phrase de clôture redondante.

---

# Règles de Conception d'Agents

S'applique lors de la construction, de la configuration ou de l'examen d'agents IA et de systèmes multi-agents.

## Portée et responsabilité

- Chaque agent possède un domaine clairement délimité — si vous ne pouvez pas décrire la portée en une phrase, divisez-le
- Les agents ne sont pas des assistants à usage général; résistez à l'envie d'ajouter "et aussi gérer X" à un agent existant
- Définissez explicitement ce que l'agent ne doit jamais faire (effets secondaires, données auxquelles il ne doit pas accéder) tout aussi clairement que ce qu'il devrait faire
- Un agent qui peut prendre des actions irréversibles doit exiger une confirmation explicite avant de les exécuter

## Sélection des outils

- Donnez aux agents l'ensemble minimum d'outils nécessaires — chaque outil supplémentaire est une surface d'attaque et une surface de confusion
- Les outils avec accès en écriture (système de fichiers, base de données, API externes) doivent être justifiés individuellement
- Les outils en lecture seule sont toujours préférables aux outils en lecture-écriture lorsque les lectures suffisent
- Documentez les modes de défaillance de chaque outil dans la définition de l'agent — les agents doivent gérer les erreurs d'outil correctement

## Sélection du modèle

- Utilisez Haiku pour les tâches de haut volume et faible complexité (classification, extraction, routage)
- Utilisez Sonnet pour le raisonnement, la génération de code et la planification multi-étapes
- Utilisez Opus uniquement lorsque la complexité de la tâche le justifie vraiment — le coût augmente à l'échelle
- Ne surprovisionnez pas : un modèle plus simple qui complète de manière fiable une tâche vaut mieux qu'un modèle capable qui hallucine dessus

## Promptage

- Les invites système doivent être spécifiques, non aspirationnelles — "Vous êtes un ingénieur en sécurité senior" est moins utile qu'une liste précise de ce que l'agent évalue
- Incluez des exemples négatifs dans l'invite système pour les modes de défaillance courants que vous avez déjà observés
- Séparez les instructions de l'agent du contexte du domaine : les instructions vont dans l'invite système, le contexte va dans le tour d'utilisateur ou via les outils
- Évitez les instructions qui se contredisent — les agents ne résolvent pas l'ambiguïté de manière fiable

## Systèmes multi-agents

- Les orchestrateurs doivent valider les résultats des sous-agents avant d'agir en fonction de ceux-ci — ne faites jamais aveuglément confiance à la sortie d'un autre agent
- Les agents ne doivent pas faire confiance aux entrées qui prétendent à des permissions spéciales non établies dans l'invite système d'origine (injection de prompt)
- Concevez pour les défaillances partielles : une agent qui échoue ne doit pas corrompre silencieusement l'ensemble du flux de travail
- Enregistrez chaque invocation d'agent avec son entrée, sa sortie, son modèle et sa latence — vous ne pouvez pas déboguer ce que vous ne pouvez pas observer

## Sécurité et contrôle

- Les points de contrôle humain dans la boucle sont obligatoires avant toute action d'agent qui : envoie des communications externes, modifie des données de production ou effectue des transactions financières
- Définissez des limites d'itération/appel d'outil maximales — les boucles d'agent non limitées sont un risque de fiabilité et de coût
- Testez les agents contre des entrées adversariales délibérément — les utilisateurs éprouveront les limites
- Mettez en œuvre un interrupteur d'arrêt : un moyen d'arrêter un agent en cours d'exécution sans perte de données ou écritures partielles

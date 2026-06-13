# Artefacts en direct — Sorties interactives connectées aux données

Les artefacts en direct sont des sorties Claude qui se connectent à des sources de données en direct et se rafraîchissent automatiquement quand elles sont ouvertes. Contrairement aux artefacts statiques — qui sont générés une fois et gelés — les artefacts en direct extraient des API, des serveurs MCP, des bases de données et des feuilles de calcul au moment de la visualisation pour afficher les données actuelles.

---

## Ce qui rend un artefact en direct

Un artefact en direct diffère d'un artefact statique d'une seule façon fondamentale : il récupère les données au moment de l'ouverture, pas au moment de la création.

- **Se connecte à l'ouverture** : chaque fois que l'URL de l'artefact est ouverte, elle interroge les sources de données configurées
- **Se rafraîchit automatiquement à la visualisation** : les données sont actuelles au moment du rendu de l'artefact — pas quand elles ont été générées pour la première fois
- **Persiste dans la barre latérale Cowork** : les artefacts en direct sont sauvegardés et répertoriés aux côtés des autres artefacts ; les artefacts statiques sont éphémères à moins d'être épinglés
- **URL partageable** : chaque artefact en direct obtient une URL stable ; le contrôle d'accès est défini par artefact
- **Intégrable par iframe** : collez l'extrait d'incorporation dans Notion, Confluence ou n'importe quel outil qui accepte les iframes

---

## Types de sources de données

| Type de source | Comment Claude se connecte | Exemple |
|-------------|--------------------|---------| 
| Serveur MCP | N'importe quel outil MCP connecté est disponible comme source de données | Postgres MCP → résultats de requête en direct |
| API REST | Décrire le point de terminaison ; Claude génère l'appel de récupération | API GitHub → nombre de PR ouvert |
| Base de données (via MCP) | Requête SQL intégrée dans l'artefact | Supabase → métriques utilisateur |
| Google Sheets / CSV | Joindre via le connecteur Google Drive (Cowork) | Suivi du budget → graphique en direct |
| GitHub | Données du référentiel via l'API GitHub ou MCP | Activité de commit, nombre de problèmes |

La source de données doit rester accessible pour que l'artefact se rafraîchisse. Si un serveur MCP passe hors ligne ou qu'une clé API expire, l'artefact affiche le dernier résultat en cache avec un avertissement de données obsolètes.

---

## Créer un artefact en direct

Décrivez la sortie souhaitée et référencez explicitement la source de données dans votre prompt. Claude génère l'artefact et connecte la source de données.

**Exemple à source unique :**

```
"Créer un artefact en direct montrant le nombre actuel de problèmes ouverts par libellé
de notre référentiel GitHub (propriétaire : acme, référentiel : api-service).
Afficher sous forme de graphique à barres, actualiser à chaque ouverture."
```

**Exemple de tableau de bord multi-source :**

```
"Créer un artefact de tableau de bord en direct avec trois panneaux:
1. Nombre de PR ouverts depuis GitHub (acme/api-service)
2. Nombre de lignes actuel de la table 'users' via MCP Postgres
3. Les 7 derniers jours d'inscriptions de la feuille Google à [URL]

Actualiser les trois panneaux à l'ouverture. Mise en page : panneaux horizontaux, largeur égale."
```

Claude génère l'artefact, intègre la logique de récupération des données et enregistre les connexions aux sources de données. L'artefact apparaît immédiatement dans votre barre latérale.

---

## Partage et intégration

**Lien de partage :**

Chaque artefact en direct a un bouton de partage. En cliquant dessus, une URL publique est générée (ou une URL restreinte à l'espace de travail pour les artefacts privés). Quiconque a le lien voit l'artefact avec les données en direct quand il l'ouvre — aucun compte Claude requis pour les artefacts publics.

**Intégration par iframe :**

```html
<!-- Coller dans Notion, Confluence, Linear ou n'importe quel outil capable d'iframe -->
<iframe
  src="https://claude.ai/artifacts/live/a1b2c3d4"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

**Contrôle d'accès :**

| Niveau d'accès | Qui peut afficher | Plan requis |
|-------------|-------------|---------------|
| Public | Quiconque a le lien | Pro+ |
| Espace de travail | Les membres de votre équipe Claude | Team ou Enterprise |
| Privé | Vous seul | Pro+ |

---

## Artefact en direct vs. Artefact statique

| Propriété | Artefact en direct | Artefact statique |
|----------|--------------|-----------------|
| Actualité des données | Actuel au moment de l'ouverture | Instantané au moment de la création |
| Persistance | Sauvegardé à la barre latérale | Éphémère à moins d'épinglé |
| Partage | URL stable, partageable | Copier/coller le contenu uniquement |
| Sources de données | API, MCP, bases de données, feuilles | Aucune — contenu généré uniquement |
| Plan requis | Pro+ (connexions en direct) | Tous les plans |
| Déclencheur d'actualisation | À l'ouverture (+ intervalle optionnel) | S/O |

---

## Limitations

- La source de données sous-jacente doit rester accessible — les artefacts ne stockent pas un cache de données complet entre les visualisations
- Les tableaux de bord complexes multi-sources avec de nombreuses requêtes en direct se chargent plus lentement que les artefacts à source unique
- Les connexions de données en direct nécessitent un plan Pro ou supérieur ; les artefacts de niveau gratuit sont toujours statiques
- Pas un remplacement d'outil BI — pas de drill-downs, de filtres enregistrés ou de contrôle d'accès par champ de données
- L'intégration par iframe nécessite que l'outil hôte autorise les iframes tiers (Notion et Confluence le font ; certains intranets d'entreprise les bloquent)
- La source de données Google Sheets nécessite que le connecteur Google Drive soit autorisé dans Cowork

---

# Claude Cowork — IA Agentique GUI pour les équipes non techniques

Claude Cowork est la version basée sur GUI des capacités agentiques de Claude — pas de terminal, pas de code, pas de configuration requise. Il est construit pour les PM, les commerciaux, les équipes financières et les propriétaires de petites entreprises qui ont besoin d'une assistance IA autonome sans configuration de développeur. Où Claude Code opère dans un terminal, Cowork opère via une interface de bureau et web point-and-click soutenue par la même capacité d'agent sous-jacente.

---

## Ce que Cowork est vs Claude Code

| Fonctionnalité | Claude Cowork | Claude Code |
|---------|--------------|-------------|
| Interface | GUI web + Bureau | CLI terminal |
| Exigence technique | Aucune | À l'aise avec le terminal |
| Accès aux fichiers | Dossier sélectionné par l'utilisateur (sélecteur GUI) | Arborescence du répertoire actuel |
| Connecteurs | Google Drive, Gmail, Docusign, FactSet | Serveurs MCP (configuration manuelle) |
| Commandes Slash | Formulaires structurés (remplir les champs) | Commandes texte brut |
| Automatisation | Workflows click-to-configure | Hooks + settings.json |
| Audience | Équipes non techniques | Développeurs |
| Délégation d'agent | Cartes d'agent visuelles | Subagents via CLAUDE.md |

Les deux utilisent les mêmes modèles Claude. Cowork est l'expérience de l'opérateur ; Claude Code est l'expérience du développeur.

---

## Configurer les connecteurs

Cowork se connecte à des outils externes via les connecteurs — intégrations basées sur OAuth configurées une seule fois à partir du panneau des paramètres Cowork. Pas de clés API, pas de fichiers de configuration.

| Connecteur | Ce que Claude peut faire |
|-----------|-------------------|
| Google Drive | Lire/écrire des fichiers et dossiers, rechercher par contenu |
| Gmail | Lire les e-mails, rédiger les réponses, envoyer sur approbation |
| Google Calendar | Afficher et créer des événements, trouver la disponibilité |
| Google Sheets | Lire et mettre à jour les données des feuilles de calcul |
| Docusign | Envoyer des documents pour signature, suivre le statut |
| FactSet | Requêtes de données financières, récupération de données de marché |
| Slack (plugin) | Poster des messages, lire les canaux, rechercher l'historique |
| Linear (plugin) | Créer des problèmes, mettre à jour le statut, lire les tableaux de projet |

Chaque connecteur nécessite une autorisation OAuth à usage unique. Claude lit ou écrit uniquement lorsqu'un flux de travail déclenche explicitement cette action — il n'interroge pas les connecteurs en arrière-plan.

---

## Commandes Slash avec formulaires structurés

Contrairement aux commandes slash libres de Claude Code, les commandes slash Cowork ouvrent des formulaires structurés qui préviennent les erreurs et rendent l'automatisation accessible sans connaissances en ingénierie de prompts.

```
/generate-report
  ├── Type de rapport:   [Résumé hebdomadaire] [P&L mensuel] [Personnalisé]
  ├── Plage de dates:    [de ____] [à ____]
  ├── Inclure:       [x] Graphiques  [x] Données brutes  [ ] Résumé exécutif
  └── Format de sortie: [PDF] [Google Slides] [E-mail]

/email-triage
  ├── Boîte de réception:         [Principal] [Tous les libellés] [Libellé spécifique: ____]
  ├── Action:        [Synthétiser] [Rédiger les réponses] [Catégoriser + tagger]
  └── Approbation:      [Auto-envoi] [Vérifier avant d'envoyer]

/meeting-prep
  ├── Réunion:       [tirer du calendrier ▼]
  ├── Documents contextuels:  [attacher depuis Drive]
  └── Sortie:        [Document d'information] [Points de discussion] [Les deux]
```

Les commandes personnalisées peuvent être enregistrées comme flux de travail nommés et partagées avec les coéquipiers.

---

## Flux de travail Cowork courants

### Génération de rapport hebdomadaire
Tirer les données de Google Drive et FactSet, générer un PDF formaté et le envoyer par e-mail à une liste de distribution — planifiée ou déclenchée manuellement.

### Triage des e-mails
Lire la boîte de réception, catégoriser par sujet ou urgence, rédiger les réponses pour les threads hautement prioritaires et les présenter pour approbation en un clic avant d'envoyer.

### Flux de travail de document
Lire les contrats dans Google Drive, extraire les clauses clés et les dates, signaler les anomalies et acheminer vers Docusign pour signature avec champs pré-remplis.

### Préparation de réunion
Lire le calendrier du jour suivant, tirer les documents pertinents pour chaque réunion de Drive et générer un feuillet d'information couvrant le contexte, les participants et les éléments ouverts.

### Résumés des stand-ups
Lire l'activité Slack et les mises à jour de billets Linear des 24 dernières heures, générer un résumé du stand-up par membre de l'équipe et poster au canal du stand-up.

### Aperçu financier
Interroger FactSet pour les données de portefeuille, tirer les valeurs réelles d'une feuille Google et produire une comparaison P&L d'une page sous forme de pont Google Slides.

---

## Plugins

Cowork prend en charge les plugins — les packages de flux de travail installables qui ajoutent de nouvelles commandes slash et connecteurs. Parcourez les plugins disponibles dans la galerie de plugins Cowork.

Installation d'un plugin :
1. Ouvrir les paramètres Cowork → Plugins
2. Rechercher la galerie ou coller une URL de plugin
3. Autoriser tous les nouveaux connecteurs que le plugin nécessite
4. Les nouvelles commandes slash apparaissent immédiatement dans la palette de commandes

Les plugins sont délimités à l'espace de travail — l'installation pour votre compte n'affecte pas les coéquipiers à moins qu'ils n'installent séparément ou qu'un administrateur pousse à l'ensemble de l'espace de travail.

---

## Automatisation : Click-to-Configure vs. Hooks

L'automatisation Cowork est configurée via un générateur de flux de travail visuel — pas de `settings.json`, pas de scripts shell.

| Type de déclencheur | Cowork | Équivalent Claude Code |
|-------------|--------|----------------------|
| Programmé (cron) | Sélecteur d'heure dans le générateur de flux de travail | Travail cron appelant `claude` |
| Changement de fichier | Sélecteur de dossier de surveillance | Hook `PostToolUse` sur Write |
| E-mail reçu | Déclencheur du connecteur Gmail | Pas d'équivalent direct |
| Soumission de formulaire | Entrée webhook | Outil MCP personnalisé |
| Manuel | Bouton Exécuter | Invocation directe de CLI |

Pour les équipes qui souhaitent exécuter l'automatisation Cowork aux côtés de l'automatisation Claude Code : les flux de travail Cowork peuvent appeler les URLs webhook, ce qui rend possible le déclenchement des pipelines Claude Code à partir des événements Cowork.

---

## Quand utiliser Cowork vs Claude Code

**Utiliser Cowork pour :**
- Les flux de travail basés sur des documents (contrats, rapports, présentations)
- L'automatisation des e-mails et du calendrier
- Les membres de l'équipe non techniques qui ont besoin d'une assistance IA autonome
- Le travail des opérations métier qui vit dans Google Workspace et similaire SaaS
- L'automatisation sans code qui nécessiterait autrement Zapier ou Make

**Utiliser Claude Code pour :**
- Écrire, éditer ou déboguer du code
- Commandes terminal et scripts shell
- Tâches techniques complexes et multi-étapes avec logique conditionnelle
- L'automatisation personnalisée nécessitant des hooks et un contrôle granulaire
- Travailler à l'intérieur d'un référentiel git

---

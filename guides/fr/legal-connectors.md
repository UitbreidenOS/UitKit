# Connecteurs de données légales pour Claude

## Vue d'ensemble

Les données d'entraînement LLM ont une date limite stricte — chaque statut modifié le trimestre dernier, chaque division de circuit décidée le mois dernier, chaque lettre d'orientation réglementaire publiée la semaine dernière est invisible pour les poids du modèle. Le travail juridique est spécifique à la juridiction, spécifique à l'affaire et dépendant de l'état actuel d'une manière qui rend les connaissances hors ligne presque inutiles au-delà du raisonnement général. Les connecteurs de données résolvent ce problème en reliant Claude aux sources directes d'autorité : Westlaw pour le droit de contrôle, iManage pour les documents d'affaires clients, CourtListener pour les dossiers publics et les bases de données de conformité pour les sanctions et l'identification des propriétaires réels. Le résultat est un système où Claude rédige, analyse et raisonne sur les données réelles plutôt que sur les approximations mémorisées — ce qui est le seul standard acceptable pour le travail juridique.

---

## Catégories de connecteurs

| Catégorie | Exemples | Ce que Claude peut faire |
|---|---|---|
| Bases de données de recherche juridique | Westlaw, LexisNexis, Bloomberg Law | Citer les statuts, extraire la jurisprudence, résumer les décisions |
| Gestion de documents | iManage, NetDocuments | Rechercher les affaires, rédiger à partir de précédents |
| Intelligence contractuelle | Kira, Luminance, Ironclad | Extraire les clauses, signaler les écarts, redliner |
| Données juridiques publiques | CourtListener (Free Law Project), PACER | Recherche de cas, suivi des dossiers |
| Données de conformité | Refinitiv/LSEG, FactSet | Recherches réglementaires, dépistage des sanctions |
| eDiscovery | Relativity | Examen du privilège, marquage des questions |

---

## Thomson Reuters / Westlaw MCP

### Ce qu'il fournit

Le serveur Thomson Reuters MCP expose l'ensemble complet du contenu Westlaw : les statuts fédéraux et étatiques américains, les réglementations (CFR, Federal Register), la jurisprudence avec les signaux du citateur KeyCite, les Restatements et les guides pratiques Practical Law. La couverture s'étend à certaines juridictions internationales et au contenu réglementaire transfrontalier.

- Statuts : USCA, codes annotés d'État, versions complètes historiques
- Réglementations : CFR actuel et historique, avis du Federal Register, orientation des agences
- Jurisprudence : cours fédérales (tous les circuits), cours suprêmes et d'appel d'État, validation KeyCite
- Secondaire : listes de contrôle Practical Law, documents standard, mises à jour juridiques

### Prérequis

1. Abonnement Westlaw actif avec niveau d'accès API (contactez votre gestionnaire de compte TR — l'accès API n'est pas inclus dans les licences de siège standard)
2. Clé API de [developer.thomsonreuters.com](https://developer.thomsonreuters.com)
3. L'identifiant client Westlaw de votre organisation

### Configuration

Installez le serveur :

```bash
npm install -g @thomsonreuters/westlaw-mcp
```

Ajoutez à `~/.claude.json` ou `.claude/mcp.json` du projet :

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id",
        "TR_JURISDICTION": "US",
        "TR_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Pour une configuration scoped au projet où différentes affaires nécessitent différents défauts de juridiction :

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp", "--jurisdiction=DE", "--content=cases,statutes"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id"
      }
    }
  }
}
```

### Exemples de prompts

```
Trouvez la jurisprudence du Delaware sur les normes de devoir fiduciaire pour les administrateurs
dans le contexte d'une transaction de fusion. Concentrez-vous sur les décisions post-Corwin de
la Cour de chancellerie. Résumez la règle du jugement commercial par rapport au cadre
d'équité entière et ce qui déclenche chacun.
```

```
Extrayez le texte complet de l'article 17 du RGPD (droit à l'effacement) et résumez les
six fondements d'effacement, la timeline de trois mois pour les contrôleurs et toute
interprétation actuelle de la cour de l'UE qui rétrécit ou élargit le champ d'application des
exceptions « d'intérêt public ».
```

```
Récupérez les articles 7501 à 7514 de la CPLR de New York (dispositions d'arbitrage),
citez les décisions les plus récentes de la Cour d'appel les appliquant et signalez
tout amendement 2024-2025.
```

```
Obtenez l'orientation actuelle du CFPB sur l'application de la réglementation UDAAP depuis le CFR
et résumez la position de l'agence telle que reflétée dans les trois ordres de consentement les plus récents.
```

### Note de coût

Les appels API sont prélevés sur votre quota API Thomson Reuters, pas sur les crédits Claude API. TR facture par élément de contenu récupéré, pas par requête. Les cas d'utilisation à volume élevé (recherche d'affaires en masse) doivent utiliser des motifs de récupération en masse plutôt que des requêtes individuelles par document. Vérifiez votre contrat TR pour la tarification par unité et les plafonds mensuels.

---

## MCP LexisNexis

### Ce qu'il fournit

LexisNexis expose la jurisprudence, les statuts, les signaux du citateur Shepard's, les documents Practical Guidance, les actualités juridiques (intégration Law360) et la couche de contenu Lexis+ AI. Shepard's est le différenciateur critique — il fournit l'historique des citations directes et indirectes, les drapeaux de traitement négatif (annulées, distinguées, questionnées) et l'historique ultérieur pour chaque cas.

- Jurisprudence : fédéral, les 50 États, plus certaines juridictions internationales
- Statuts : USCA, codes d'État, annotés avec citations de cas
- Shepard's : historique du citateur complet avec codes de traitement
- Practical Guidance : listes de contrôle spécifiques à la juridiction et documents modèles
- Actualités : Law360, services de dépêches juridiques, annonces réglementaires

### Prérequis

Abonnement Lexis+ actif avec niveau API. Obtenez les identifiants de [developer.lexisnexis.com](https://developer.lexisnexis.com). L'accès API nécessite un avenant de contrat séparé de l'abonnement de recherche standard.

### Configuration

```bash
npm install -g @lexisnexis/lexis-mcp
```

```json
{
  "mcpServers": {
    "lexisnexis": {
      "command": "npx",
      "args": ["-y", "@lexisnexis/lexis-mcp"],
      "env": {
        "LEXIS_CLIENT_ID": "your-lexis-client-id",
        "LEXIS_CLIENT_SECRET": "your-lexis-client-secret",
        "LEXIS_SCOPE": "research shepards practicalguidance",
        "LEXIS_REGION": "us"
      }
    }
  }
}
```

Le serveur gère automatiquement le renouvellement du token OAuth2 en utilisant `LEXIS_CLIENT_ID` et `LEXIS_CLIENT_SECRET`. Les tokens expirent toutes les heures ; le serveur MCP gère le renouvellement sans intervention.

### Exemple : rédaction d'un mémorandum d'opinion

```
En utilisant LexisNexis, recherchez l'exécutabilité des accords de non-concurrence en Californie.
Extrayez le statut de contrôle (Cal. Bus. & Prof. Code §16600), la décision Edwards v. Arthur Andersen
et toutes les décisions de la Cour d'appel de 2020 à aujourd'hui qui abordent l'exception de
« contrainte étroite ». Puis rédigez un mémorandum d'opinion de deux pages conseillant une
entreprise SaaS sur l'exécutabilité de son NCA standard pour un ingénieur logiciel à San Jose.
Citez chaque cas avec un signal Shepard's.
```

Claude appellera LexisNexis pour récupérer le texte du statut, extraire les cas, vérifier les signaux Shepard's sur chaque citation et rédiger le mémorandum avec des citations intégrées. Le mémorandum notera tout cas avec traitement Shepard's négatif.

---

## Free Law Project / CourtListener MCP

### Ce qu'il fournit

CourtListener est une plateforme de recherche juridique gratuite et open-source maintenue par le Free Law Project. Elle indexe plus de 8 millions d'opinions judiciaires américaines provenant de cours fédérales et étatiques, de données de dossiers PACER, d'enregistrements de plaidoiries orales et de profils de juges, y compris l'historique des abstentions et les divulgations financières.

Parce qu'elle opère sur des opinions judiciaires du domaine public, il n'y a pas de frais par requête et aucune exigence d'abonnement. Cela la rend appropriée pour les workflows à volume élevé : surveillance en masse des dossiers, suivi du contentieux dans de multiples affaires et recherche de juges.

Couverture :
- Cour suprême des États-Unis (historique complet)
- Les 13 cours d'appel du circuit américain
- Toutes les cours de district américains (intégration PACER où disponible)
- Cours suprêmes et d'appel des États (varie selon l'État)
- Dossiers PACER avec mises à jour en temps réel
- Cours de faillite

GitHub : [github.com/freelawproject/courtlistener](https://github.com/freelawproject/courtlistener)

### Configuration

#### Option A : point de terminaison distant (Free Law Project hébergé)

```json
{
  "mcpServers": {
    "courtlistener": {
      "type": "remote",
      "url": "https://mcp.courtlistener.com/sse",
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com"
      }
    }
  }
}
```

Obtenez un token API gratuit à [courtlistener.com/sign-in/](https://www.courtlistener.com/sign-in/).

#### Option B : installation npm locale

```bash
npm install -g @freelawproject/courtlistener-mcp
```

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com",
        "CL_BASE_URL": "https://www.courtlistener.com/api/rest/v4"
      }
    }
  }
}
```

### Meilleurs cas d'utilisation

- Rechercher les décisions antérieures d'un juge avant de déposer — extraire toutes les opinions du juge par nom, filtrer par type de cas
- Suivi des dossiers actifs pour un client ou une contrepartie — surveiller les entrées PACER au fur et à mesure qu'ils déposent
- Trouver toutes les décisions de circuit sur une question juridique étroite sans abonnement payant
- Extraction du texte d'opinion pour la formation, l'analyse ou les bases de données de précédents internes
- Surveillance des faillites — suivi des dépôts de débiteurs par industrie ou géographie

### Exemples de prompts

```
Recherchez dans CourtListener toutes les opinions du deuxième circuit de 2022 à aujourd'hui
qui citent Ashcroft v. Iqbal et abordent la norme de plaidoirie pour les réclamations
en fraude en vertu de la règle 9(b). Retournez les citations, les décisions et tous les
divisions de circuit avec d'autres circuits.
```

```
Extrayez le dossier PACER pour [numéro de cause] au tribunal de district du district sud
de New York et résumez toutes les entrées des 30 derniers jours. Signalez tout motions
de découverte, modifications d'ordre de planification ou dépôts de jugement sommaire.
```

---

## iManage / NetDocuments (connecteurs DMS)

### Comment les systèmes de gestion de documents se connectent via MCP

Les cabinets d'avocats et les départements juridiques stockent leur produit de travail dans des systèmes de gestion de documents (DMS) — pas sur les systèmes de fichiers locaux. iManage Work et NetDocuments sont les deux plateformes dominantes. Les connecteurs MCP pour ces systèmes donnent à Claude un accès direct aux documents d'affaires : précédents, ébauches antérieures, contrats exécutés, correspondances et produit de travail.

La différence architecturale clé par rapport aux bases de données juridiques publiques : les connecteurs DMS opèrent à l'intérieur de votre périmètre réseau et s'authentifient contre le fournisseur d'identité de votre cabinet. Les documents récupérés via ces connecteurs sont couverts par le privilège avocat-client et la protection du produit de travail — voir la section Sécurité et privilège pour les exigences de manutention.

### MCP iManage Work

iManage Work MCP expose l'API iManage Work REST via une interface MCP. Il supporte la recherche de documents par affaire, client, type de document, auteur, plage de dates et contenu full-text. Il peut récupérer le contenu du document, archiver et désarchiver les documents, et publier les nouvelles versions de documents.

#### Prérequis

- iManage Work 10.x ou ultérieur avec API REST activée
- Application OAuth2 enregistrée dans votre centre de contrôle iManage
- ID client et secret de votre administrateur iManage
- IDs de workspace et de bibliothèque pour votre déploiement

#### Configuration

```bash
npm install -g @imanage/work-mcp
```

```json
{
  "mcpServers": {
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "https://work.yourfirm.com",
        "IMANAGE_CLIENT_ID": "your-oauth2-client-id",
        "IMANAGE_CLIENT_SECRET": "your-oauth2-client-secret",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_CUSTOMER_ID": "your-customer-id",
        "IMANAGE_SCOPE": "user openid read write"
      }
    }
  }
}
```

Le serveur MCP gère le flux du code d'autorisation OAuth2 au premier lancement, ouvrant une fenêtre du navigateur pour l'authentification des utilisateurs. Les appels ultérieurs utilisent le token d'accès rafraîchi stocké dans le cache de credentials local du serveur.

#### Opérations disponibles

- `search_documents` — recherche full-text et métadonnées dans les affaires
- `get_document` — récupérer le contenu du document par ID de document
- `search_matters` — trouver les affaires par nom de client, numéro d'affaire ou groupe de pratique
- `checkout_document` — archiver un document pour édition (le verrouille dans iManage)
- `checkin_document` — archiver une nouvelle version après édition
- `list_matter_documents` — lister tous les documents dans un espace de travail d'affaire spécifique
- `get_document_versions` — récupérer l'historique des versions pour un document

#### Exemples de prompts

```
Recherchez dans iManage tous les NDA exécutés avec Acme Corp au cours des deux dernières années.
Retournez le titre du document, la date, l'auteur et le numéro d'affaire. Puis récupérez
le NDA exécuté le plus récent et résumez les termes clés : durée, droit applicable, portée
des informations confidentielles et exclusions.
```

```
Trouvez tous les lettres d'engagement M&A dans l'espace de travail de l'affaire Davis à partir
de 2023. Listez-les par date et extrayez la structure des frais de chacun. J'ai besoin
de comparer comment nos conditions d'engagement ont évolué au cours de ces transactions.
```

```
Récupérez le dernier brouillon de l'accord de fusion dans l'affaire 2024-0892.
Archivez-le sous mon nom, puis identifiez toutes les représentations et garanties
qui référencent un changement d'importance substantielle et résumez le langage de
définition MAC actuel.
```

### MCP NetDocuments

NetDocuments utilise un modèle similaire à iManage. Les différences structurelles clés : NetDocuments organise le contenu en cabinets et dossiers plutôt que des espaces de travail et des bibliothèques centrées sur les affaires, et son API utilise un modèle d'authentification différent (OAuth2 avec les scopes spécifiques à NetDocuments).

#### Configuration

```bash
npm install -g @netdocuments/nd-mcp
```

```json
{
  "mcpServers": {
    "netdocuments": {
      "command": "npx",
      "args": ["-y", "@netdocuments/nd-mcp"],
      "env": {
        "ND_BASE_URL": "https://api.netdocuments.com/v2",
        "ND_CLIENT_ID": "your-nd-client-id",
        "ND_CLIENT_SECRET": "your-nd-client-secret",
        "ND_REPOSITORY_ID": "your-repository-id",
        "ND_REDIRECT_URI": "http://localhost:4321/callback"
      }
    }
  }
}
```

NetDocuments utilise les IDs de cabinet pour limiter les recherches. Définissez `ND_DEFAULT_CABINET` dans l'environnement si votre cabinet utilise une structure de cabinet cohérente, ou passez l'ID du cabinet par requête.

#### Opérations disponibles

- `search` — recherche full-text dans tous les cabinets accessibles
- `get_document` — récupérer le contenu du document par ndID
- `list_folder` — lister les documents dans un chemin de dossier ou de cabinet
- `search_by_attribute` — filtrer par métadonnées personnalisées (client, affaire, type de document)
- `get_document_history` — historique des versions et d'archivage

---

## Ironclad Contract Intelligence

### Ce qu'il fournit

Ironclad est une plateforme de gestion du cycle de vie des contrats (CLM). Son serveur MCP expose la recherche du référentiel de contrats, l'extraction de clauses structurées, les requêtes de statut du workflow et les points de terminaison déclencheurs de workflow. C'est le point d'intégration quand les opérations contractuelles (routage d'approbation, workflows de négociation de contrepartie, collecte de signatures) doivent être orchestrées aux côtés des capacités de rédaction et d'analyse de Claude.

Le modèle de données d'Ironclad est centré sur les enregistrements — chaque contrat est un enregistrement avec des attributs structurés (parties, date d'entrée en vigueur, expiration, juridiction, droit applicable) plus le texte complet du contrat et les données de clause extraites.

### Prérequis

- Compte Ironclad avec accès API (disponible dans les plans Growth et Enterprise)
- Token API depuis Ironclad Settings → API & Integrations
- Votre sous-domaine Ironclad (par exemple, `yourcompany.ironcladapp.com`)

### Configuration

```bash
npm install -g @ironcladapp/ironclad-mcp
```

```json
{
  "mcpServers": {
    "ironclad": {
      "command": "npx",
      "args": ["-y", "@ironcladapp/ironclad-mcp"],
      "env": {
        "IRONCLAD_API_TOKEN": "your-ironclad-api-token",
        "IRONCLAD_SUBDOMAIN": "yourcompany",
        "IRONCLAD_API_VERSION": "v1"
      }
    }
  }
}
```

### Opérations disponibles

- `search_contracts` — rechercher par nom de partie, type, statut, plage de dates ou texte complet
- `get_contract` — récupérer l'enregistrement de contrat complet incluant les attributs structurés et le texte brut
- `get_clause` — extraire un type de clause spécifique d'un contrat (par exemple, limitation de responsabilité, indemnification)
- `list_workflows` — lister les workflows actifs par type et statut
- `trigger_workflow` — initier un workflow de contrat (envoyer pour approbation, envoyer pour signature)
- `compare_clause` — comparer une clause par rapport à un standard de playbook

### Exemples de prompts

```
Recherchez dans Ironclad tous les accords d'abonnement SaaS avec des clauses de renouvellement
expirant au Q3 2026. Retournez le nom de la partie, la valeur du contrat, la date limite d'avis
de renouvellement automatique et le statut actuel. Signalez tout celui où la date limite d'avis
est dans les 45 jours.
```

```
Récupérez la clause de limitation de responsabilité du contrat ID IC-2024-4421
et comparez-la à notre cap de playbook standard de 12 mois de frais. Signalez
tout écart et rédigez un langage de redline proposé pour le ramener à standard.
```

```
Trouvez tous les accords de fournisseur où nous avons accepté une responsabilité illimitée
pour les violations de données. Listez-les par valeur, juridiction et date d'expiration
pour que je puisse hiérarchiser la renégociation.
```

```
Déclenchez le workflow de renouvellement standard pour le contrat IC-2024-0234 et
notifiez le gestionnaire de compte assigné que la date limite d'avis de renouvellement
automatique est dans 30 jours.
```

---

## Kira / Luminance (révision de contrats alimentée par l'IA)

### Ce sont des outils natifs de l'IA — comment ils complètent Claude

Kira Systems (maintenant partie de Litera) et Luminance sont des plateformes d'apprentissage automatique construites spécifiquement pour la révision de contrats. Ils sont entraînés sur des millions de contrats juridiques et produisent des données extraites structurées — emplacements de clauses, texte de clause, noms de parties, dates, termes définis — comme sortie structurée.

Le modèle d'intégration n'est pas MCP natif en mai 2026. Ni Kira ni Luminance ne livrent un serveur MCP. Au lieu de cela, les deux plateformes exposent des API REST qui retournent du JSON structuré, et l'intégration avec Claude est via un modèle intermédiaire :

1. **Kira ou Luminance** extrait des données de clause structurées de contrats téléchargés (lot ou document unique)
2. Un **script de bridge** léger appelle l'API Kira/Luminance et formate la sortie comme réponse d'outil
3. **Claude** reçoit l'extraction structurée et effectue l'analyse d'ordre supérieur : rédige le mémorandum, compare au playbook, identifie le risque, rédige le résumé exécutif

### Bridge API Kira (modèle de serveur MCP personnalisé)

```bash
# Échafaud un serveur MCP personnalisé pour bridger l'API REST de Kira
npx @modelcontextprotocol/create-server kira-bridge
```

Le bridge expose deux outils :

```json
{
  "tools": [
    {
      "name": "kira_extract",
      "description": "Submit a document to Kira for clause extraction and return structured results",
      "inputSchema": {
        "type": "object",
        "properties": {
          "document_url": { "type": "string" },
          "provision_types": {
            "type": "array",
            "items": { "type": "string" },
            "description": "e.g. ['limitation_of_liability', 'indemnification', 'governing_law']"
          }
        }
      }
    },
    {
      "name": "kira_batch_status",
      "description": "Check status of a Kira batch extraction job",
      "inputSchema": {
        "type": "object",
        "properties": {
          "job_id": { "type": "string" }
        }
      }
    }
  ]
}
```

Configurez dans `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "kira": {
      "command": "node",
      "args": ["/path/to/kira-bridge/build/index.js"],
      "env": {
        "KIRA_API_KEY": "your-kira-api-key",
        "KIRA_BASE_URL": "https://api.kirasystems.com/v2",
        "KIRA_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

### Modèle Luminance

L'API REST de Luminance suit le même modèle. La réponse d'extraction de Luminance inclut à la fois le texte de la clause et la classification de risque propre de Luminance, que Claude peut utiliser comme signal de démarrage avant d'appliquer sa propre analyse.

### Quand utiliser ce modèle vs. DMS natif

Utilisez Kira/Luminance comme couche d'extraction quand :
- Vous examininez de grands portefeuilles de contrats (50+ documents) où l'extraction structurée est plus rapide que le traitement brut PDF par Claude
- Votre workflow nécessite des enregistrements d'extraction vérifiables (Kira/Luminance enregistre chaque extraction)
- Vous avez besoin des modèles de provisions pré-entraînés de Kira/Luminance pour un type de contrat spécifique (par exemple, baux immobiliers, cessions de propriété intellectuelle)

Utilisez Claude directement sur les documents bruts quand :
- Vous avez 1-10 contrats et les frais généraux du pipeline d'extraction ne sont pas justifiés
- Le type de contrat est inhabituel et les modèles pré-entraînés sont peu susceptibles de bien performer
- Vous effectuez une analyse libre qui ne mappe pas sur les types de provision définis

---

## FactSet / Bloomberg Law (croisement finance-juridique)

### Ce qu'ils fournissent

Les cas d'utilisation de croisement finance-juridique — KYC, dépistage des sanctions, recherche de propriétaire réel, analyse de dépôts SEC et suivi des changements réglementaires — nécessitent des sources de données qui se situent à l'intersection de l'intelligence légale et financière. FactSet et Bloomberg Law sont les principales plateformes ici.

**FactSet MCP** expose :
- Données d'entreprise : identifiants d'entités légales, structure d'entreprise, chaînes de propriété réelle
- Dépôts réglementaires : SEC EDGAR (10-K, 10-Q, 8-K, déclarations de procuration, S-1s)
- Sanctions et listes de surveillance : OFAC SDN, liste consolidée UE, sanctions ONU
- Classements ESG et de conformité : scores de conformité tiers
- Données de propriété : avoirs institutionnels, transactions d'initiés

**Bloomberg Law** expose :
- Actualités juridiques et surveillance des dossiers
- Suivi réglementaire (réglementation des agences, périodes de commentaires)
- Précédents transactionnels (base de données des conditions de transaction)
- Guidance pratique et analyse Bloomberg Law

### Configuration FactSet MCP

```bash
npm install -g @factset/factset-mcp
```

```json
{
  "mcpServers": {
    "factset": {
      "command": "npx",
      "args": ["-y", "@factset/factset-mcp"],
      "env": {
        "FACTSET_USERNAME": "your-factset-username",
        "FACTSET_API_KEY": "your-factset-api-key",
        "FACTSET_SCOPE": "company ownership sanctions filings",
        "FACTSET_ENVIRONMENT": "production"
      }
    }
  }
}
```

FactSet utilise l'authentification par nom d'utilisateur + clé API. Générez une clé API à [developer.factset.com](https://developer.factset.com). Notez que les produits API FactSet sont sous licence séparée — confirmez que votre contrat FactSet inclut les ensembles de données que vous avez l'intention d'interroger (Propriété, dépôts EDGAR et dépistage de liste de surveillance sont des modules séparés).

### Configuration Bloomberg Law MCP

Bloomberg Law MCP est disponible pour les abonnés Bloomberg Terminal avec le produit Law activé. Configurez via la passerelle Bloomberg MCP :

```json
{
  "mcpServers": {
    "bloomberg-law": {
      "command": "npx",
      "args": ["-y", "@bloomberg/blaw-mcp"],
      "env": {
        "BLAW_API_KEY": "your-bloomberg-law-api-key",
        "BLAW_CLIENT_ID": "your-client-id",
        "BLAW_BASE_URL": "https://api.blaw.com/v1"
      }
    }
  }
}
```

### Cas d'utilisation

```
Recherchez la structure de propriété bénéficiaire ultime pour Meridian Holdings Ltd
(LEI : 254900...). Tracez toutes les entités avec plus de 10% de propriété, identifiez
tout individu sur l'OFAC SDN ou la liste consolidée UE et signalez tout juridiction
avec des classifications de risque FATF élevées.
```

```
Récupérez tous les dépôts 8-K pour Acme Corp des 12 derniers mois depuis SEC EDGAR.
Résumez chaque événement matériel divulgué, signalez tout litiges ou avis
d'enquête gouvernementale et identifiez les changements dans les facteurs de risque déclarés
de l'entreprise liés à la conformité réglementaire.
```

```
Dépistez la liste jointe de 45 noms de fournisseurs par rapport à OFAC SDN, UE consolidée
sanctions et listes UK OFSI. Retournez les correspondances avec le score de confiance de correspondance,
l'entrée de liste correspondante et la base de la désignation.
```

```
Suivez toute l'activité de réglementation CFPB de janvier 2025 à présent. Listez chaque
règle proposée, son statut de période de commentaires et résumez les objections principales de l'industrie
déposées lors des périodes de commentaires publics.
```

---

## Construction d'un pipeline de recherche juridique

### Exemple de bout en bout : mémorandum de risque sur la clause d'arbitrage

Un associé demande : « Rédigez un mémorandum de risque sur notre clause d'arbitrage selon la loi de New York pour l'affaire Johnson. »

Cela nécessite trois sources de données travaillant ensemble : la jurisprudence actuelle en matière d'arbitrage de New York, le texte du statut de contrôle et la clause d'arbitrage réelle du client du DMS.

#### Étape 1 : CourtListener MCP — extraire les cas d'arbitrage NY

Claude appelle `search_opinions` sur CourtListener :
- Court : `ny` (Cour d'appel de New York) et `ca2` (deuxième circuit)
- Requête : `arbitration clause enforcement CPLR 7501`
- Plage de dates : 2020-01-01 à présent
- Retourne : 12 opinions avec texte complet

#### Étape 2 : Westlaw MCP — extraire NY CPLR §7501 et réglementations connexes

Claude appelle `get_statute` sur le Westlaw MCP :
- Citation : `N.Y. C.P.L.R. §7501`
- Inclut : version annotée avec citations de cas
- Récupère aussi : §7503 (application pour contraindre l'arbitrage), §7511 (annulation de l'sentence)

#### Étape 3 : iManage MCP — récupérer la clause d'arbitrage actuelle du client

Claude appelle `search_documents` sur iManage :
- Affaire : Johnson (récupérée par numéro d'affaire du contexte de l'utilisateur)
- Type de document : Accord
- Filtre texte complet : `arbitration`
- Retourne : l'accord de services exécuté actuel contenant la clause d'arbitrage

#### Étape 4 : Claude rédige le mémorandum

Avec les trois sources récupérées, Claude rédige le mémorandum — citant les sources CourtListener et Westlaw dans le texte, citant la clause réelle du client et signalant le risque spécifique (par exemple, la clause manque d'une désignation de siège, que les cours de New York ont traitée comme un défaut d'exécutabilité selon le précédent actuel de la Cour d'appel).

### Configuration CLAUDE.md pour câbler les trois MCP

Ajoutez ceci à `.claude/CLAUDE.md` pour un projet spécifique à une affaire :

```markdown
# Matter: Johnson — Arbitration Research Project

## MCP configuration

This project connects to three data sources:
- **westlaw**: current NY statutes and case law
- **courtlistener**: public federal and NY state court opinions
- **imanage**: Johnson matter documents (matter ID: 2024-JOH-0112)

## Research workflow

When asked to research a legal issue for this matter:
1. Always pull the controlling statute from westlaw first
2. Retrieve relevant case law from both westlaw (for KeyCite signals) and courtlistener (for full opinion text)
3. Check iManage for any existing research memos or prior analysis before starting new research
4. Draft memos in IRAC structure: Issue, Rule, Application, Conclusion
5. Include citation signals (KeyCite/Shepard's) next to every case citation

## Privilege note

All documents retrieved from iManage are privileged. Do not include document content in any output that will be shared outside the firm.
```

### Configuration MCP pour le projet d'affaire

Créez `.claude/mcp.json` dans le répertoire du projet d'affaire :

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "${TR_API_KEY}",
        "TR_CLIENT_ID": "${TR_CLIENT_ID}",
        "TR_JURISDICTION": "NY",
        "TR_CONTENT_TYPES": "cases,statutes"
      }
    },
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "${COURTLISTENER_API_TOKEN}"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "${IMANAGE_HOST}",
        "IMANAGE_CLIENT_ID": "${IMANAGE_CLIENT_ID}",
        "IMANAGE_CLIENT_SECRET": "${IMANAGE_CLIENT_SECRET}",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_DEFAULT_MATTER": "2024-JOH-0112"
      }
    }
  }
}
```

Utilisez les références de variable d'environnement (`${VAR_NAME}`) plutôt que les secrets codés en dur dans les fichiers de configuration engagés. Injectez les valeurs à partir d'un gestionnaire de secrets ou d'un fichier `.env` qui est ignoré par git.

---

## Sécurité et privilège

### Privilège avocat-client

La contrainte de sécurité la plus importante dans les déploiements juridiques MCP est le privilège avocat-client. Les documents stockés dans iManage et NetDocuments sont le produit de travail privilégié. Les router via un serveur MCP cloud tiers — même un fourni par le vendeur — soulève un risque de divulgation involontaire : le transit pourrait être argumenté comme une renonciation selon la juridiction et les conditions de service du serveur.

**Règle :** Pour tout serveur MCP qui gère des documents d'affaires privilégiés, déployez auto-hébergé ou sur site. N'utilisez pas les points de terminaison MCP hébergés dans le cloud des fournisseurs pour les connecteurs DMS sauf si le conseil en éthique de votre cabinet a révisé les termes spécifiques du fournisseur et confirmé aucun risque de privilège.

Pour les connecteurs iManage et NetDocuments :

```bash
# Self-hosted deployment — run on firm infrastructure, not vendor cloud
docker run -d \
  --name imanage-mcp \
  --network internal \
  -e IMANAGE_HOST=https://work.yourfirm.com \
  -e IMANAGE_CLIENT_ID=$IMANAGE_CLIENT_ID \
  -e IMANAGE_CLIENT_SECRET=$IMANAGE_CLIENT_SECRET \
  -p 127.0.0.1:3100:3100 \
  firmregistry.yourfirm.com/imanage-mcp:latest
```

Pointez la configuration Claude vers l'hôte interne :

```json
{
  "mcpServers": {
    "imanage": {
      "type": "remote",
      "url": "http://127.0.0.1:3100/sse"
    }
  }
}
```

### Journalisation d'audit

Chaque appel d'outil MCP doit être enregistré avec : horodatage, nom de l'outil, paramètres (assainis des PII le cas échéant), statut de réponse et l'ID de session Claude. Utilisez un hook Stop pour capturer et archiver la transcription complète de la conversation après chaque session.

Ajoutez à `.claude/settings.json` :

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/legal-audit-log.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/mcp-call-log.sh"
          }
        ]
      }
    ]
  }
}
```

`mcp-call-log.sh` reçoit les détails de l'appel d'outil via stdin en JSON. Écrivez l'entrée du journal dans votre SIEM du cabinet ou ajoutez à un fichier d'audit spécifique à l'affaire :

```bash
#!/bin/bash
# mcp-call-log.sh
# Logs every MCP call to a matter-specific audit file
# Receives tool call JSON on stdin

INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
MATTER_ID=$(echo "$INPUT" | jq -r '.tool_input.matter_id // "none"')

LOG_DIR="/var/log/claude-legal-audit"
LOG_FILE="$LOG_DIR/mcp-calls-$(date +%Y-%m-%d).jsonl"

mkdir -p "$LOG_DIR"
echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"tool\":\"$TOOL_NAME\",\"matter\":\"$MATTER_ID\"}" >> "$LOG_FILE"
```

### Résidence des données

Avant de déployer tout serveur MCP, confirmez :

1. **Région du fournisseur cloud** — Si votre accord de données du client spécifie la résidence des données exclusivement à États-Unis (courant dans les matières gouvernementales, de santé et de services financiers), vérifiez que tout serveur MCP SaaS ou connecteur DMS hébergé dans le cloud opère dans une région conforme. Vérifiez les accords de traitement des données du fournisseur et les listes de sous-traitants.

2. **Routage API Westlaw / LexisNexis** — TR et LexisNexis routent les appels API via l'infrastructure basée aux États-Unis par défaut, mais confirmez si vos affaires impliquent des clients non-États-Unis assujettis au RGPD, aux SCCs ou aux exigences de localisation des données locales. L'envoi de données d'affaires client de l'UE via des points de terminaison API américains peut nécessiter une base juridique en vertu du chapitre V du RGPD.

3. **Stockage du journal** — Les journaux d'audit écrits par les hooks Stop et PreToolUse doivent être stockés dans un emplacement cohérent avec la politique de rétention des données de votre cabinet. Ne les écrivez pas sur un ordinateur portable personnel ou un lecteur partagé qui manque de contrôles d'accès appropriés.

4. **Credentials du serveur MCP** — Les clés API pour Westlaw, LexisNexis, FactSet et iManage sont des credentials du cabinet, pas des credentials personnelles. Traitez-les comme des secrets : stockez dans un gestionnaire de secrets géré par le cabinet (HashiCorp Vault, AWS Secrets Manager), rotez selon un calendrier et révoquez immédiatement au départ d'un avocat.

5. **Contamination inter-affaires** — Quand vous exécutez Claude sur plusieurs affaires dans la même session, vérifiez que les résultats de recherche iManage ou NetDocuments ne remontent pas de documents d'affaires que l'utilisateur n'est pas autorisé à accéder. Configurez l'étendue du serveur MCP au niveau de l'affaire, pas au niveau de l'utilisateur, là où le DMS le supporte.

---

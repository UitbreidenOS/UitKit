# Stack Opérations Commerciales

> Moteur d'exécution autonome des opérations commerciales — analyses de pipeline, gestion territoriale, prévisions de ventes, suivi des quotas, analyse de la vélocité des transactions et intelligence des revenus pour les équipes de vente haute performance.

---

## Démarrage rapide

1. **Copiez ce dossier** dans votre espace de travail ou projet Claude Code.
2. **Configurez votre CRM** — Ajoutez les identifiants Salesforce ou HubSpot à `settings.json` (voir `mcp/connections.md`).
3. **Passez en revue votre CLAUDE.md** — Personnalisez les domaines des opérations commerciales et les contraintes de votre entreprise.
4. **Lancez `/analyze-pipeline`** — Obtenez un instantané d'intégrité du pipeline en temps réel avec le vieillissement des transactions, les taux de conversion et les transactions à risque.
5. **Lancez `/optimize-territory`** — Analysez l'équilibre territorial, l'équité des quotas et la distribution des comptes. Identifiez les lacunes.
6. **Lancez `/build-forecast`** — Générez une prévision roulante de 13 mois avec les scénarios engagement/meilleur cas/upside.

---

## Ce qui est à l'intérieur

| Fichier/Dossier | Type | Objectif |
|---|---|---|
| `CLAUDE.md` | Config | Règles d'espace de travail, objectifs de ventes, méthodologie des quotas, repères de vélocité et garde-fous de performance. Commencez ici. |
| `session-log.md` | Journal | Mise à jour automatique à chaque action : prévisions générées, analyse de vélocité, changements territoriaux, ajustements de quotas, signaux de coaching. |
| `skills/` | Répertoire | 8 compétences réutilisables pour la gestion du pipeline, la planification des quotas, la prévision et l'analyse des performances. |
| `commands/` | Répertoire | 3 commandes slash pour les flux de travail courants des opérations commerciales. |
| `hooks/` | Répertoire | 4 crochets automatisés pour les alertes en temps réel et la conformité. |
| `mcp/` | Répertoire | Configurations Salesforce et HubSpot. |

---

## Compétences (8)

| Compétence | Déclencheur | Outils utilisés | Objectif |
|---|---|---|---|
| `pipeline-forecaster` | `/forecast-pipeline` | API Salesforce, WebSearch | Générer une prévision trimestrielle, confiance par étape, détection des goulots, notation du risque |
| `deal-velocity-analyzer` | `/analyze-velocity` | API Salesforce, Exa | Suivi du temps du cycle des transactions par représentant/secteur vertical, identification des transactions bloquées, comparaison avec l'industrie |
| `quota-planner` | `/plan-quota` | API Salesforce, Read | Allouer les quotas de haut en bas par territoire/secteur vertical, ajuster selon le rendement, planifier la montée en charge pour les nouvelles embauches |
| `sales-cycle-analyzer` | Diagnostic | API Salesforce, WebSearch | Analyser la taille moyenne des transactions, la durée du cycle, le taux de clôture par secteur vertical/région ; générer un rapport de tendance |
| `territory-optimizer` | Stratégique | API Salesforce, Read | Mapper les comptes aux représentants par région/secteur vertical, calculer la couverture, signaler les cibles à fort potentiel non assignées |
| `performance-auditor` | Conformité | API Salesforce, Exa | Auditer la précision des prévisions, le rendement des quotas, la santé du pipeline, signaler les mauvaises prévisions et les fuites de quotas |
| `revenue-intelligence` | Stratégique | API Salesforce, WebSearch, Exa | Mettre en avant les victoires/pertes concurrentielles, les modèles d'expansion des clients, le risque de désabonnement, les changements de marché |
| `commission-modeler` | `/model-commission` | API Salesforce, Read | Modéliser les paiements de commissions, planifier l'alignement des incitations, calculer l'impact des changements de quotas |

---

## Commandes (3)

| Commande | Ce qu'elle fait |
|---|---|
| `/forecast-pipeline` | Générer une prévision trimestrielle à partir des données de pipeline en direct. Confiance par étape, alertes de goulot, méthodologie de prévision. Résultat dans le journal de session. |
| `/analyze-velocity` | Suivi du temps du cycle des transactions, du temps du cycle par représentant, des transactions bloquées, de la vélocité par rapport à la référence historique. Générer un rapport. |
| `/optimize-territory` | Mapper les comptes à fort potentiel à la capacité de vente disponible. Signaler les lacunes de couverture et les sur-allocations. Recommander la réalignement territorial. |

---

## Crochets (4)

| Crochet | Événement | Ce qu'il protège |
|---|---|---|
| `quota-alert` | PostToolUse | Signale quand la prévision d'un représentant chute >20% d'une semaine à l'autre ou tombe sous le seuil de quota sans justification |
| `velocity-warning` | PostToolUse | Alerte quand une transaction est bloquée (pas d'activité >30 jours) ou que le temps du cycle dépasse le 90e percentile |
| `forecast-sync` | PostToolUse | Valide automatiquement les totaux des prévisions par rapport au pipeline du CRM, signale les écarts >5K$ |
| `session-summary` | Stop | Enregistrement automatique dans `session-log.md` à la fin de la session : prévisions générées, rapports de vélocité, changements territoriaux, signaux de coaching |

---

## Configuration MCP

### Salesforce (Recommandé pour Enterprise)

Obtenez votre URL d'instance, ID client et jeton de sécurité. Ajoutez à `settings.json` :

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-salesforce"],
      "env": {
        "SALESFORCE_INSTANCE_URL": "https://votreorg.salesforce.com",
        "SALESFORCE_CLIENT_ID": "votre-clé-consommateur",
        "SALESFORCE_CLIENT_SECRET": "votre-secret-consommateur",
        "SALESFORCE_USERNAME": "votre-nom@votreorg.com",
        "SALESFORCE_PASSWORD": "votre-mot-de-passe",
        "SALESFORCE_SECURITY_TOKEN": "votre-jeton-sécurité"
      }
    }
  }
}
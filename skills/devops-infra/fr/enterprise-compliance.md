# Déploiement Claude Code Entreprise — Conformité et Sécurité

## Quand activer
Déploiement de Claude Code dans une industrie réglementée (finance, santé, gouvernement) ; examen de sécurité entreprise de l'outillage IA ; exigences de résidence ou de souveraineté des données ; questions sur le déploiement sur site ou en cloud privé ; exigences de conformité HIPAA, SOC2, PCI ou FedRAMP.

## Quand ne PAS utiliser
Développeurs individuels ou petites équipes sans exigences de conformité ; utilisation standard de Claude Code sans contraintes de traitement des données entreprise ; équipes qui ont déjà complété leur examen de conformité et ont juste besoin d'aide sur les features.

## Instructions

**Identité et authentification :**
- Utilisez `ANTHROPIC_WORKSPACE_ID` pour la fédération d'identité de charge de travail — élimine les clés API longue durée des variables d'environnement et des secrets CI
- SSO entreprise via SAML 2.0 ou OIDC pour le contrôle d'accès de l'équipe (Okta, Azure AD, Google Workspace tous supportés)
- Faites tourner les clés API trimestriellement au minimum si la fédération d'identité de charge de travail n'est pas en place

**Zéro Rétention de Données (ZDR) :**
- Disponible sur les plans Entreprise
- Les prompts et réponses ne sont pas loggés ou stockés par Anthropic
- Requis pour HIPAA ; requis pour certains scénarios PCI DSS
- Obtenez un BAA signé d'Anthropic avant d'envoyer des PHI — ZDR seul ne constitue pas un BAA
- Confirmez que ZDR est actif sur votre espace de travail avant d'autoriser les données réglementées dans les sessions

**Configuration du réseau :**
- Claude Code nécessite uniquement HTTPS sortant — aucun port entrant requis
- Fonctionne derrière les proxys d'entreprise : définissez la variable d'environnement `HTTPS_PROXY`
- Aucune règle de pare-feu spéciale au-delà du port 443 sortant vers les points de terminaison Anthropic
- Pour les déploiements de point de terminaison privés, définissez `ANTHROPIC_BASE_URL` sur votre point de terminaison Bedrock ou Vertex

**Résidence des données — utilisez les fournisseurs cloud pour le traitement régional :**

| Exigence de région | Fournisseur et région |
|---|---|
| US uniquement | API Anthropic direct (us-east-1) ou Bedrock us-east-1 |
| EU uniquement | Bedrock eu-west-1 ou Vertex AI eu-west-4 |
| APAC | Bedrock ap-northeast-1 |

L'API Anthropic direct traite uniquement dans les centres de données américains — utilisez Bedrock ou Vertex pour les exigences de résidence non-US.

**Audit logging :**
Tous les appels d'outils Claude Code se loggent aux fichiers de session `.claude/` localement. Pour l'intégration SIEM :
- Envoyez les logs à Splunk, Datadog ou Elastic via un hook PostToolUse
- Champs log : timestamp, nom de l'outil, résumé d'entrée, code de sortie, ID de session
- Conservez les logs selon votre calendrier de rétention réglementaire (7 ans pour la plupart des réglementations financières)

**Santé (HIPAA) :**
- ZDR + Bedrock ou Vertex requises (ne jamais l'API directe pour PHI)
- BAA d'Anthropic requis — obtenir avant la première session PHI
- Déployez Claude Code dans un VPC avec des points de terminaison privés ; pas d'egress internet public pour les sessions gérant les PHI
- Ne collez jamais de PHI dans les prompts sans confirmation de ZDR active

**Finance (SOC2/PCI) :**
- Hook secret scanner obligatoire sur toutes les sessions de développeur (prévenir les commits de clés accidentels)
- Désactivez l'accès internet dans les environnements CI exécutant Claude Code
- Auditez tous les appels d'outils — logguez au minimum toute écriture de fichier et commande shell
- Hook d'examen du code requis avant tout déploiement en production initié par Claude Code
- Champ d'application PCI DSS : confirmez avec votre QSA si les sessions Claude Code touchent les environnements de données des titulaires de cartes

**Gouvernement (FedRAMP) :**
- Déploiement autorisé FedRAMP via AWS GovCloud avec Bedrock
- Vérifiez le statut d'autorisation FedRAMP actuel sur la marketplace FedRAMP avant l'approvisionnement — les niveaux d'autorisation et le champ d'application changent
- Les points de terminaison GovCloud nécessitent des identifiants API séparés du AWS commercial

**Air-gapped / réseau privé :**
- Claude Code peut fonctionner entièrement contre des points de terminaison Bedrock ou Vertex privés
- Définissez `ANTHROPIC_BASE_URL` sur l'URL de votre point de terminaison privé
- Tous les serveurs MCP référencés dans `.claude/mcp.json` doivent également être accessibles sans accès internet public
- Aucune télémétrie ou vérification de mise à jour ne fait appel à la maison si `ANTHROPIC_BASE_URL` est défini sur un point de terminaison privé

## Exemple

Entreprise de services financiers déployant à 50 ingénieurs :
- SSO via Okta SAML lié à `ANTHROPIC_WORKSPACE_ID`
- Bedrock eu-west-1 pour l'exigence de résidence des données EU
- `HTTPS_PROXY` défini au niveau organisationnel via environnement géré par IT
- Hook secret scanner appliqué à toutes les sessions via `CLAUDE.md` partagé à la racine du monorepo
- Hook PostToolUse envoie les logs d'audit à Splunk avec ID de session et nom d'outil
- Accord ZDR en place ; BAA non requis (pas de PHI)
- Aucun accès API Anthropic direct — tout le trafic route via le point de terminaison Bedrock privé

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

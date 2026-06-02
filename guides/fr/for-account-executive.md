# Claude pour les Chargés de Compte (Account Executives)

Tout ce dont un Chargé de Compte a besoin pour gérer ses affaires avec l'assistance de l'IA — revues de deals, plans de succès mutuels, développement des champions, réponses aux appels d'offres, positionnement concurrentiel et gestion des prévisions.

---

## À qui s'adresse ce guide

Vous êtes un Chargé de Compte (AE) qui gère un portefeuille de deals mid-market ou enterprise. Votre journée est faite de revues de deals, d'appels clients, de gestion de champions, de rédaction de propositions, de négociations et d'appels de prévisions avec votre manager. Vous passez trop de temps sur des tâches administratives — préparer des slides pour les revues de deals, reformater des réponses aux appels d'offres, scorer manuellement le MEDDPICC, rédiger des emails de suivi après les appels. Claude Code gère les processus pour que vous puissiez vous concentrer sur l'activité qui conclut réellement les deals : parler aux acheteurs.

**Avant Claude Code :** 45 minutes pour préparer une slide de revue de deal. 2 heures pour rédiger une section de réponse à un appel d'offres. 30 minutes pour écrire un plan de succès mutuel de zéro. Un scoring MEDDPICC manuel toujours obsolète.

**Après :** Revue de deal en 15 minutes avec MEDDPICC scoré et signaux de risque identifiés. Section de réponse à un appel d'offres en 10 minutes. Ébauche de plan de succès mutuel en 20 minutes. Package d'activation du champion en 15 minutes.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences AE
npx claudient add skills gtm

# Ou choisir à la carte :
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
npx claudient add skill gtm/revenue-operations
npx claudient add agents advisors/cro-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Votre stack AE avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/deal-review` | Scoring MEDDPICC, signaux de risque, catégorie de prévision, prochaines étapes | Revue hebdomadaire du pipeline, avant l'appel manager |
| `/champion-builder` | Identification du champion, package d'activation, scripts de réengagement | Quand le champion est faible ou silencieux |
| `/mutual-success-plan` | Plan de clôture conjoint : jalons, parties prenantes, engagements mutuels | Deals en phase avancée (Évaluation → Négociation) |
| `/deal-desk` | Structuration du deal, approbation de remise, révision des conditions contractuelles | Conditions complexes, tarification non standard |
| `/rfp-responder` | Sections de réponse aux appels d'offres/RFI, matrices de conformité, résumés exécutifs | Tout appel d'offres ou RFI reçu |
| `/commercial-forecaster` | Analyse du pipeline et des prévisions, scoring des deals, projections de revenus | Appels de prévision hebdomadaires |
| `/crm-hygiene` | Nettoyage des contacts/deals, audit du pipeline stagnant, déduplication | Hygiène CRM mensuelle |
| `/hubspot` | Lecture/écriture directe dans HubSpot CRM | Enregistrement de notes, mise à jour des étapes de deal |
| `/revenue-operations` | Métriques du pipeline, taux de conversion par étape, analyse ARR | QBR, planification territoriale |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `cro-advisor` | Opus | Deals complexes multi-parties prenantes, stratégie de négociation, gestion des objections au niveau exécutif |
| `competitive-analyst` | Sonnet | Intelligence concurrentielle en temps réel, positionnement face à des concurrents identifiés |

---

## Flux de travail quotidien

### Matin — Revue du pipeline (15-30 minutes)

**1. Identification des deals prioritaires :**
```
/commercial-forecaster

Revue matinale du pipeline. Montrez-moi :
- Quels deals sont en Commit cette semaine ?
- Quels deals en Commit présentent le risque le plus élevé (lacunes MEDDPICC, date de clôture glissée) ?
- Quels deals Best Case ont progressé ou reculé au cours des 7 derniers jours ?
- Des deals que je n'ai pas touchés depuis 14+ jours ?

Données CRM : [collez votre pipeline ouvert depuis HubSpot/Salesforce, ou connectez via MCP]
```

**2. Revue de deal pour l'appel manager de la semaine :**
```
/deal-review

Revue MEDDPICC pour [nom du deal].

Entreprise : [nom]
Taille du deal : $[ACV]
Étape : [étape]
Date de clôture : [date]

[collez vos notes de découverte, fils d'emails ou notes de réunion]

Scorez chaque dimension MEDDPICC, identifiez les 3 principaux risques et recommandez une catégorie de prévision.
```

---

### Travail sur les deals actifs (l'essentiel de la journée)

**3. Développement du champion :**
```
/champion-builder

Évaluez [nom du contact] en tant que champion pour [deal].

Interactions jusqu'à présent : [résumé des réunions et emails]
Tests du champion : [quelles preuves avez-vous pour chacun des 4 tests ?]

Dites-moi :
- Cette personne est-elle un champion solide, un contact passif ou un coach ?
- Quelles preuves étayent cette évaluation ?
- Quelle action spécifique dois-je prendre aujourd'hui pour renforcer ou trouver un meilleur champion ?
```

**4. Plan de succès mutuel (deals en phase avancée) :**
```
/mutual-success-plan

Créez un plan de succès mutuel pour [deal].

Acheteur : [entreprise], Champion : [nom/titre], Acheteur économique : [nom/titre]
Taille du deal : $[ACV], Clôture cible : [date]
Étape actuelle : transition Évaluation → Négociation
Étapes restantes avant signature : [ce que vous savez qu'il reste]

Produisez un document MSP complet que je peux partager avec le champion aujourd'hui.
Inclure : définition du succès, tableau des jalons, engagements mutuels, registre des risques.
```

**5. Réponse à l'appel d'offres :**
```
/rfp-responder

Répondez à cette section d'appel d'offres.

Question de l'appel d'offres : [collez la question]
Notre produit : [description en un paragraphe]
Nos différenciateurs pour cet acheteur : [spécifiques à ce compte et à ses critères]
Limite de mots : [si spécifiée]

Rédigez une réponse qui répond directement, démontre l'adéquation et n'utilise pas de formules creuses.
```

---

### Après l'appel — Enregistrement et suivi (10-15 minutes)

**6. Débriefing d'appel et mise à jour CRM :**
```
Je viens de terminer un appel avec [nom, titre] chez [entreprise].

Points clés :
[points de ce qui a été discuté — prenez 2 minutes de notes brutes immédiatement après l'appel]

Produisez :
1. Une note CRM (3-4 paragraphes — ce qui a été discuté, ce qu'on a appris, les prochaines étapes convenues)
2. Un email de suivi à envoyer aujourd'hui
3. Mise à jour MEDDPICC : quelles dimensions ont changé d'après ce que j'ai entendu ?
4. La chose la plus importante à faire avant le prochain appel avec ce compte

/hubspot — Enregistrez la note CRM pour [nom du contact] chez [entreprise].
```

---

### Fin de semaine — Prévisions et hygiène du pipeline

**7. Préparation des prévisions :**
```
/commercial-forecaster

Préparez mes prévisions hebdomadaires.

Mes deals :
[collez votre liste de pipeline avec étape, ACV, date de clôture et catégorie de prévision actuelle]

Pour chaque deal en Commit : scorez la confiance de 1 à 10 avec justification.
Pour chaque deal Best Case : que devrait-il se passer pour passer en Commit cette semaine ?
Pour tout deal à retirer des prévisions : signalez-le.

Mon quota hebdomadaire : $[X] en nouveau ARR.
```

**8. Hygiène du pipeline :**
```
/crm-hygiene

Auditez mon pipeline pour détecter les données obsolètes et inexactes.

Mon pipeline ouvert : [collez la liste des deals avec date de dernière activité, étape, date de clôture]

Signalez :
- Deals avec date de clôture dans le passé qui ne sont pas Closed Won ou Lost
- Deals sans activité depuis 30+ jours (selon les normes par étape : Découverte >30 jours, Évaluation >45 jours)
- Deals où l'étape ne correspond pas au score MEDDPICC
- Doublons de contacts ou d'entreprises

Pour chaque deal stagnant : recommandez une action — mettre à jour / désactiver / enquêter.
```

---

## Plan de montée en compétence sur 30 jours (nouveaux AE ou changement de segment)

### Semaine 1 — Installation et inventaire des deals
- Installez toutes les compétences GTM : `npx claudient add skills gtm`
- Connectez HubSpot via MCP (voir les intégrations d'outils ci-dessous)
- Exécutez `/deal-review` sur chaque deal de votre pipeline hérité — obtenez un score MEDDPICC de référence
- Exécutez `/commercial-forecaster` sur l'ensemble de votre pipeline — identifiez quels deals sont réels vs. stagnants

### Semaine 2 — Découverte et développement du champion
- Exécutez l'évaluation `/champion-builder` sur vos 3 deals les plus importants — qui est votre vrai champion ?
- Utilisez l'agent `/cro-advisor` pour votre deal de plus grande valeur — obtenez une stratégie pour chaque lacune MEDDPICC
- Observez ou examinez des réponses aux appels d'offres pour votre produit avec `/rfp-responder` pour vous exercer
- Configurez votre modèle de revue de deal pour que la préparation avant les appels manager prenne moins de 15 minutes

### Semaine 3 — Phase avancée et mécanique de clôture
- Utilisez `/mutual-success-plan` pour chaque deal en Évaluation ou plus avancé — créez un plan de clôture
- Exécutez `/deal-desk` sur tout deal avec des conditions non standard — comprenez votre autorité de remise
- Exercez-vous avec `/competitive-analyst` pour vos 2-3 principaux concurrents — sachez comment gagner la comparaison
- Examinez la précision de vos prévisions des semaines 1-2 par rapport aux résultats réels

### Semaine 4 — Optimisation et reporting
- Préparation du QBR : utilisez `/revenue-operations` pour extraire vos métriques de pipeline et taux de conversion
- Identifiez votre dimension MEDDPICC la plus faible sur tous les deals — laquelle détruit le plus souvent vos deals ?
- Utilisez `/crm-hygiene` pour nettoyer le pipeline que vous avez hérité — supprimez les deals morts, mettez à jour les étapes
- Effectuez une évaluation des champions sur chaque deal actif — cartographiez où vous êtes exposé

---

## Intégrations d'outils

### HubSpot (CRM recommandé)

```json
// À ajouter dans ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Avec HubSpot MCP connecté :
- Enregistrez les notes d'appel directement : `Claude, enregistre cette note d'appel pour [contact] chez [entreprise] dans HubSpot`
- Mettez à jour l'étape du deal : `Déplacez [nom du deal] en Négociation dans HubSpot`
- Extrayez le pipeline ouvert : `Obtenez tous mes deals ouverts dans HubSpot, incluez l'étape, l'ACV et la date de clôture`
- Créez une tâche de suivi : `Créez une tâche HubSpot pour faire un suivi avec [contact] le [date]`

### Gong / Chorus (enregistrement des appels)

Collez les transcriptions d'appels dans Claude Code pour :
- Mise à jour MEDDPICC post-appel
- Rédaction de l'email de suivi
- Mise à jour de l'évaluation du champion d'après ce que vous avez entendu
- Génération de note CRM

```
Voici la transcription de mon appel avec [contact] chez [entreprise] :
[collez la transcription Gong]

Extrayez :
1. Quelles dimensions MEDDPICC ont été confirmées ou mises à jour
2. Tout signal d'alarme à signaler à mon manager
3. L'email de suivi à envoyer aujourd'hui
4. La note CRM à enregistrer
```

### Salesforce

Collez les données d'opportunité Salesforce dans n'importe quel prompt `/deal-review` ou `/commercial-forecaster`. Pour une intégration Salesforce directe, configurez le serveur MCP Salesforce si disponible dans votre stack.

### DocuSign / PandaDoc (gestion des contrats)

Utilisez `/deal-desk` pour examiner les conditions commerciales avant d'envoyer à l'équipe juridique. Collez les clauses clés dans `/deal-desk` pour une évaluation des risques avant la validation finale.

### Slack (canaux de deal room)

Pour les deals importants, maintenez un canal Slack `#deal-[entreprise]`. Collez les mises à jour de ce canal dans `/deal-review` pour un contrôle rapide de la santé du deal avant un appel manager.

---

## Métriques à suivre

Extrayez-les depuis HubSpot ou Salesforce chaque semaine avec `/revenue-operations` :

| Métrique | Cible (AE en montée en charge) | Cible (quota plein) |
|---|---|---|
| Deals avec MEDDPICC complet | >80% du pipeline actif | 100% |
| MSP en place pour les deals en phase avancée | >90% des deals en Évaluation+ | 100% |
| Précision des prévisions (Commit → Won) | >60% | >80% |
| Durée moyenne du cycle de vente | Comparer à la moyenne de l'équipe | Égale ou inférieure à la moyenne de l'équipe |
| Taux de clôture (Évaluation → Won) | Comparer à la cohorte | Égal ou supérieur à la cohorte |
| Activité par deal par semaine | 2+ contacts significatifs | 2+ contacts significatifs |
| Couverture du pipeline (vs. quota) | 3x | 4x |
| Taux de mise à jour CRM (notes enregistrées) | 90% dans les 24h | 100% |

---

## Erreurs courantes (et comment Claude Code aide à les éviter)

**Erreur 1 : Avancer des deals sans acheteur économique confirmé**
`/deal-review` signale l'absence d'acheteur économique comme une lacune MEDDPICC critique. Il ne vous laissera pas qualifier un deal en Commit sans cela.

**Erreur 2 : Traiter un contact passif comme un champion**
`/champion-builder` applique les quatre tests du champion. Un contact qui ne vous a pas donné accès à l'acheteur économique est un coach, pas un champion. La compétence vous le dit explicitement.

**Erreur 3 : Construire un plan de succès mutuel que l'acheteur ne verra jamais**
Un MSP ne fonctionne que si les deux parties y adhèrent. La compétence inclut un modèle d'email pour l'envoyer à votre champion pour révision avant que l'acheteur économique le voie.

**Erreur 4 : Laisser des deals stagnants en Commit**
`/commercial-forecaster` signale les deals avec une dernière activité de plus de 14 jours. Les deals en Commit sans activité sont de l'inflation de prévisions, pas du pipeline.

**Erreur 5 : Des réponses aux appels d'offres qui ne répondent pas à la vraie question**
`/rfp-responder` répond d'abord à la question spécifique de l'appel d'offres, puis étaye avec des preuves — il n'enterre pas la réponse dans un paragraphe marketing.

---

## Ressources

- [Démarrer avec Claude Code](../getting-started.md)
- [Workflow du cycle de vente AE](../workflows/ae-deal-cycle.md)
- [Compétence deal desk](../skills/gtm/deal-desk.md)
- [Compétence RFP responder](../skills/gtm/rfp-responder.md)
- [Agent CRO Advisor](../agents/advisors/cro-advisor.md)
- [Agent Competitive Analyst](../agents/roles/competitive-analyst.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

# Claude pour les SDR

Tout ce dont un Sales Development Representative a besoin pour mener une prospection, une prospection sortante, une gestion des réponses et une gestion du pipeline augmentés par l'IA, dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes SDR, BDR ou commercial dont le travail est de générer un pipeline qualifié — trouver les bons comptes, prendre contact, décrocher des rendez-vous et passer la main aux AE. Vous passez trop de temps sur la recherche, la rédaction d'emails et la gestion de la boîte de réception. Claude Code réduit cela de 30 à 40 fois.

**Avant Claude Code :** 20 minutes par compte recherché. 15 minutes par email personnalisé. 2 à 4 heures par jour dans la boîte de réception. Mises à jour manuelles du CRM après chaque appel.

**Après :** Brief complet sur un compte en 30 secondes. Email personnalisé en 30 secondes. Boîte de réception triée et réponses rédigées en 8 minutes. CRM mis à jour automatiquement depuis les transcriptions d'appels.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences, agents et workflows SDR
npx claudient add skills gtm
npx claudient add agents roles/sdr-agent

# Ou choisissez ce dont vous avez besoin :
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/sdr-agent
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

---

## Votre stack SDR Claude Code

### Compétences (slash commands)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/sdr-research-brief` | Dossier de compte en 30 secondes avec déclencheurs, score ICP, carte des parties prenantes | Avant toute prospection |
| `/sdr-agent` | Workflow SDR de bout en bout — recherche → rédaction → approbation → envoi → enregistrement | Sessions complètes de pipeline |
| `/sdr-reply-classifier` | Triage de la boîte de réception : classifier l'intention, rédiger une réponse, mettre à jour le CRM | Deux fois par jour |
| `/sdr-call-prep` | Talk tracks, scripts d'objections, questions de discovery pour tout appel | 30 min avant d'appeler |
| `/sdr-call-analysis` | Transcription post-appel → note CRM + retour coaching + suivi | Après chaque appel |
| `/sdr-objection-handler` | Réponse dynamique aux objections sur le prix, la concurrence, le timing, la confiance | À la demande, sur tout canal |
| `/sdr-territory-mapper` | Analyse des espaces blancs, comptes prioritaires, plan de territoire | Planification hebdomadaire/trimestrielle |
| `/sdr-lead-scorer` | Score d'adéquation ICP de 0 à 100 avec niveau et action recommandée | Priorisation des listes de leads |
| `/email-automation` | Conception de séquences multi-étapes, délivrabilité, routage des réponses | Construction de nouvelles séquences |
| `/lead-enrichment` | Pipeline Apollo/Clearbit/Firecrawl pour enrichir et scorer les leads | Enrichissement en masse |
| `/crm-hygiene` | Nettoyage HubSpot/Salesforce, déduplication, contacts obsolètes, propriété | Santé mensuelle du CRM |
| `/hubspot` | Accès natif au CRM HubSpot — lecture/écriture contacts, deals, notes | Travail direct sur le CRM |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `sdr-agent` | Opus (recherche) / Sonnet (rédaction) | Sessions complètes recherche-prospection |
| `market-researcher` | Sonnet | Recherche approfondie sur un compte ou un marché |
| `competitive-analyst` | Sonnet | Intelligence concurrentielle pour la préparation aux objections |

---

## Flux de travail quotidien

### Matin (30-60 minutes)

**1. Brief de territoire — sur quoi se concentrer aujourd'hui**
```
/sdr-territory-mapper

Montrez-moi les comptes prioritaires d'aujourd'hui :
- Quels comptes de niveau A n'ont pas encore été contactés ?
- Y a-t-il de nouveaux signaux déclencheurs sur les comptes de mon pipeline ?
- Quelles séquences sont au Jour 3 ou Jour 7 (besoin de suivi aujourd'hui) ?
```

**2. Scoring des leads — nouveaux leads de la nuit**
```
/sdr-lead-scorer

[Coller les nouveaux leads entrants, inscriptions à des événements ou exports Apollo]

Scorer par rapport à l'ICP et me donner la liste de niveau A à appeler aujourd'hui.
```

**3. Batch de prospection — recherche + rédaction pour les cibles du jour**
```
/sdr-agent

Recherchez et rédigez une prospection personnalisée pour :
1. [Entreprise 1] — contact : [Nom, Titre]
2. [Entreprise 2] — contact : [Nom, Titre]
3. [Entreprise 3] — contact : [Nom, Titre]

Mon produit : [une ligne]
Mon ICP : [définition]
Montrez-moi tous les brouillons pour revue avant de programmer l'envoi.
```

---

### Milieu de journée (15-20 minutes)

**4. Triage de la boîte de réception — classification des réponses**
```
/sdr-reply-classifier

Voici mes réponses de ce matin :

Réponse 1 (de : nom@entreprise.com) :
[coller la réponse]

Réponse 2 (de : nom@entreprise.com) :
[coller la réponse]

Classifiez chacune, rédigez des réponses pour les réponses intéressées/objections,
mettez à jour le CRM, signalez-moi tout lead chaud.
```

---

### Avant un appel (2-5 minutes)

**5. Préparation d'appel — tout appel dans l'heure suivante**
```
/sdr-call-prep

Nom : [nom du prospect]
Titre : [titre]
Entreprise : [entreprise]
Type d'appel : [à froid / suivi / discovery]
Objectif : [décrocher une discovery de 20 min]
Mon produit : [une ligne]
Déclencheur récent : [ce que vous savez sur lui/elle]

Donnez-moi : script d'ouverture, talk track, 3 principales objections + réponses, messagerie vocale.
```

---

### Après un appel (2-5 minutes)

**6. Analyse d'appel — enregistrer et apprendre**
```
/sdr-call-analysis

[Coller la transcription ou les notes de l'appel]

Prospect : [nom, titre, entreprise]
Type d'appel : appel à froid
Objectif : décrocher un rendez-vous discovery
Résultat : [ce qui s'est passé]

Extraire : note CRM, prochaine étape, objections soulevées, retour coaching, brouillon d'email de suivi.
```

---

### Hebdomadaire (vendredi — 30 minutes)

**7. Revue de territoire et rapport pipeline**
```
/sdr-territory-mapper

Revue hebdomadaire :
- Rendez-vous décrochés cette semaine : [N]
- Séquences lancées : [N]
- Réponses reçues : [N]
- Espace blanc restant : [N]

Montrez-moi : quels comptes prioriser la semaine prochaine, les déclencheurs que j'ai manqués,
et si je suis sur la bonne trajectoire pour mon quota mensuel de rendez-vous.
```

---

## Plan de montée en compétences sur 30 jours (nouveaux SDR)

### Semaine 1 — Configuration et maîtrise de la recherche
- Installer toutes les compétences SDR via `npx claudient add skills gtm`
- Configurer l'MCP HubSpot (voir la compétence `/hubspot` pour la configuration)
- Exécuter `/sdr-territory-mapper` sur votre liste de comptes initiale
- Scorer 50+ comptes avec `/sdr-lead-scorer` — se familiariser avec votre ICP
- Lire : bibliothèque complète de `/sdr-objection-handler` avant votre premier appel

### Semaine 2 — Lancement de la prospection
- Utiliser `/sdr-research-brief` pour chaque compte avant le premier contact
- Rédiger les 20 premiers emails avec `/sdr-agent` — relire chacun attentivement
- Commencer à suivre : temps par email (objectif : moins de 5 minutes avec Claude)
- Utiliser `/sdr-call-prep` pour chaque appel à froid — pas d'improvisation

### Semaine 3 — Gestion des réponses et analyse des appels
- Exécuter `/sdr-reply-classifier` sur chaque réponse — ne pas trier manuellement
- Enregistrer chaque appel, exécuter `/sdr-call-analysis` sur la transcription
- Comparer votre gestion des objections au playbook — identifier l'1 objection sur laquelle vous perdez le plus souvent
- Utiliser `/sdr-objection-handler` pour travailler les objections où vous êtes le plus faible

### Semaine 4 — Optimisation
- Mener votre première session de planification de territoire avec `/sdr-territory-mapper`
- Revoir toutes les analyses d'appels — quels patterns émergent ?
- Identifier vos meilleures accroches d'email (taux de réponse le plus élevé) et construire des variantes
- Rendre compte à votre manager avec les données de votre CRM

---

## Intégrations d'outils

### HubSpot (CRM recommandé)

```json
// Ajouter à ~/.claude/settings.json
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

Avec cette connexion, Claude peut :
- Lire et écrire des contacts, entreprises, deals et notes
- Mettre à jour les étapes du cycle de vie et les affectations de responsables
- Créer des tâches de suivi depuis l'analyse des appels
- Effectuer la maintenance du CRM sur votre territoire

### Gmail / Outlook
Utilisez Claude Code pour rédiger des emails → collez dans votre client email → envoyez.
Pour l'envoi automatisé, intégrez via n8n ou Make avec le nœud Gmail.

### Apollo.io / Seamless.ai
Exportez les leads en CSV → collez dans `/sdr-lead-scorer` → obtenez une liste priorisée.
Pour l'enrichissement en temps réel, utilisez la compétence `/lead-enrichment` avec l'API Apollo.

### Gong / Aircall / Fireflies
Obtenez la transcription de l'appel → collez dans `/sdr-call-analysis` → extrayez la note CRM, le coaching, le suivi.
Pour l'analyse post-appel automatisée, configurez un webhook qui déclenche `/sdr-call-analysis` quand un enregistrement est prêt.

### n8n (orchestration d'automatisation)
```
Automatisez la boucle complète :
- Nouveau lead entrant → /sdr-lead-scorer → router vers SDR ou nurture
- Nouvelle réponse reçue → /sdr-reply-classifier → brouillon + alerte Slack
- Appel terminé → transcription → /sdr-call-analysis → mise à jour HubSpot
```

---

## Métriques à suivre

Utilisez Claude Code pour extraire ces métriques depuis HubSpot chaque semaine :

| Métrique | Cible (début) | Cible (SDR confirmé) |
|---|---|---|
| Comptes recherchés/jour | 10 | 20 |
| Emails de prospection envoyés/semaine | 50 | 150 |
| Taux de réponse | > 5 % | > 8 % |
| Taux de réponse positive | > 1,5 % | > 3 % |
| Rendez-vous décrochés/semaine | 3-5 | 8-12 |
| Taux appel-vers-rendez-vous | 5 % | 10 % |
| Temps par compte (recherche + rédaction) | < 10 min | < 5 min |
| Taux de mise à jour du CRM | 90 % | 100 % |

---

## Erreurs courantes (et comment Claude Code les évite)

**Erreur 1 : Envoyer une prospection générique**
Claude Code vous oblige à rechercher un déclencheur avant de rédiger. Pas de déclencheur = pas d'email.

**Erreur 2 : Ne pas enregistrer les appels dans le CRM**
`/sdr-call-analysis` génère la note CRM pour vous — collez et c'est fait.

**Erreur 3 : Mauvaise gestion des objections**
`/sdr-objection-handler` contient plus de 20 scripts. Exécutez-les avant chaque appel. Travaillez ceux que vous ratez.

**Erreur 4 : Contacter des prospects ayant exercé leur droit d'opposition**
`/crm-hygiene` maintient votre CRM propre. Vérifiez toujours avant d'ajouter à une séquence.

**Erreur 5 : Se concentrer sur les mauvais comptes**
`/sdr-territory-mapper` et `/sdr-lead-scorer` priorisent pour vous. Travaillez les comptes de niveau A en premier.

---

## Ressources

- [Démarrer avec Claude Code](../getting-started.md)
- [Configuration de l'MCP HubSpot](../mcp/hubspot.md)
- [Workflow quotidien SDR](../workflows/sdr-daily.md)
- [Guide des séquences email](../skills/gtm/email-automation.md)
- [Bibliothèque complète de gestion des objections](../skills/gtm/sdr-objection-handler.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

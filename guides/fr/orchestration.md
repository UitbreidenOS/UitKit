# Protocole d'Orchestration

Un motif léger pour coordonner les personas, les agents et les compétences sur des travaux complexes multi-domaines.

Pas de framework requis. Pas de dépendances. Juste un promptage structuré.

---

## Concept central

La plupart des vrais travaux traversent les frontières des domaines. Un lancement de produit nécessite l'ingénierie, le marketing et la stratégie. Un examen architectural nécessite la sécurité, une analyse des coûts et une évaluation d'équipe.

L'orchestration connecte l'expertise appropriée à chaque phase de travail :

- **Agents** définissent *qui* pense — identité, jugement, style de communication
- **Compétences** définissent *comment* exécuter — étapes, modèles, exemples, motifs
- **Phases** définissent *quand* basculer — à mesure que le travail passe d'un domaine à un autre

Vous les combinez. Le motif est toujours le même.

---

## Le motif

### 1. Définir l'objectif

Énoncez ce que vous voulez accomplir, pas comment l'accomplir.

```
Objectif : Lancer un nouveau produit SaaS pour les petits cabinets comptables.
Contraintes : équipe de 2 personnes, budget de 5 000 dollars, délai de 6 semaines.
Critères de succès : 50 clients payants dans les 30 premiers jours.
```

### 2. Sélectionner le bon agent

Choisissez l'agent dont le jugement convient à la phase actuelle. Les agents portent des opinions, des priorités et des cadres décisionnels.

| Situation | Agent | Pourquoi |
|---|---|---|
| Décisions architecturales, pile technologique, acheter ou construire | `cto-advisor` | Jugement d'ingénierie |
| Stratégie de lancement, canaux de croissance, contenu | `cmo-advisor` | Expertise GTM et canal |
| Modèle financier, unité d'économie, levée de fonds | `cfo-advisor` | Décisions basées sur les chiffres |
| Feuille de route produit, priorisation, recherche utilisateur | `cpo-advisor` | Focus sur les résultats utilisateur |
| Opérations, processus, structure d'équipe | `coo-advisor` | Exécution d'abord |
| Tout à la fois, seul | `ceo-advisor` | Priorisation multi-domaines |

**Activation :**
```
/agents/advisors/cto-advisor
```

### 3. Charger les compétences pour l'exécution

Les agents savent *quoi* faire. Les compétences savent *comment* le faire avec précision. Chargez les compétences dont votre phase actuelle a besoin.

```
/skills/devops-infra/aws-architect       — motif d'infrastructure
/skills/backend/nodejs/nextjs            — framework frontend
/skills/devops-infra/cicd               — pipeline de déploiement
```

L'agent conduit les décisions. Les compétences fournissent des étapes structurées, des modèles et des motifs concrets.

### 4. Travailler par phases

Divisez l'objectif en phases. Chaque phase peut utiliser différents agents et compétences.

```
Phase 1 : Fondation technique (Semaine 1-2)
  Agent : cto-advisor
  Compétences : aws-architect, codebase-onboarding, cicd
  Résultat : Doc architecture, squelette déployé, pipeline CI

Phase 2 : Préparation du lancement (Semaine 3-4)
  Agent : cmo-advisor
  Compétences : copywriting, content-strategy, seo-audit
  Résultat : Page d'accueil, calendrier de contenu, plan de lancement

Phase 3 : Go-to-Market (Semaine 5-6)
  Agent : ceo-advisor
  Compétences : email-sequence, analytics-tracking, pricing-strategy
  Résultat : Produit lancé, suivi, premiers clients
```

### 5. Transférer entre les phases

Lorsque vous changez de phase, résumez toujours ce qui a été décidé et ce qui est ouvert :

```
Phase 1 terminée.
Décisions : AWS serverless (Lambda + DynamoDB), frontend Next.js, CI GitHub Actions
Artefacts créés : architecture-doc.md, déployé en staging
Questions ouvertes : modèle de tarification (décision Phase 3)

Passage à la Phase 2. Chargement des compétences cmo-advisor + copywriting + content-strategy.
```

---

## Motifs d'orchestration courants

### Motif A : Sprint en solo

Une personne, un objectif, plusieurs domaines. Changez d'agents à mesure que vous progressez dans les phases.

```
Semaine 1 : cto-advisor + compétences d'ingénierie → Construire le produit
Semaine 2 : cmo-advisor + compétences marketing  → Préparer le lancement
Semaine 3 : ceo-advisor + compétences GTM        → Livrer et itérer
```

Meilleur pour : projets parallèles, MVPs, fondateurs en solo, startups en une personne.

### Motif B : Plongée profonde dans un domaine

Un domaine, profondeur maximale. Agent unique, compétences multiples empilées.

```
Agent : cto-advisor
Compétences chargées simultanément :
  - aws-architect       → conception d'infrastructure
  - cloud-security      → posture de sécurité
  - slo-architect       → cibles de fiabilité
  - chaos-engineering   → test de mode défaillance

Tâche : Examen complet de la préparation à la production
```

Meilleur pour : examens architecturaux, audits de conformité, plongées techniques approfondies avant le lancement.

### Motif C : Examen multi-agent

Différents agents examinent le même problème sous différentes lentilles.

```
Étape 1 : cto-advisor conçoit l'architecture technique
Étape 2 : cfo-advisor examinne le modèle de coût de la construction vs achat
Étape 3 : ceo-advisor prend l'appel final de compromis
```

Meilleur pour : décisions critiques, préparation d'investisseurs, recommandations au niveau du conseil d'administration, pivots majeurs.

### Motif D : Chaîne de compétences

Pas d'agent requis. Chaînez les compétences séquentiellement pour le travail procédural.

```
1. /product-discovery    → Identifier le problème et le valider
2. /experiment-designer  → Concevoir le test
3. /analytics-tracking   → Configurer la mesure
4. /product-analytics    → Interpréter les résultats
```

Meilleur pour : workflows répétables, pipelines de contenu, listes de contrôle de conformité, processus de recherche.

---

## Exemple : Lancement complet du produit (6 semaines)

**Configuration :**
```
Objectif : Lancer un outil de facturation B2B pour les indépendants
Équipe : 1 développeur + 1 marketeur
Délai : 6 semaines
Budget : 5 000 dollars
```

**Semaine 1-2 : Construire**
```
Agent : cto-advisor
Compétences : aws-architect, nextjs, postgresql, stripe

Livrables :
- Décision architecturale (serverless : Lambda + DynamoDB + Stripe)
- MVP déployé : auth, facturation, collecte de paiement
- Pipeline CI/CD (GitHub Actions → AWS)
```

**Semaine 3-4 : Préparer le lancement**
```
Agent : cmo-advisor
Compétences : copywriting, seo-audit, content-strategy, email-sequence

Livrables :
- Page d'accueil en direct (hero, tarification, preuve sociale)
- 3 messages de blog programmés (ciblés SEO)
- Séquence d'emails de bienvenue configurée (5 emails, goutte de 14 jours)
- Liste de contrôle du jour du lancement
```

**Semaine 5 : Lancer**
```
Agent : ceo-advisor
Compétences : pricing-strategy, analytics-tracking, onboarding-cro

Livrables :
- Tarification finalisée (3 niveaux : Solo 19 $ / Pro 49 $ / Team 99 $)
- Suivi des analyses vérifié de bout en bout
- Soumission Product Hunt préparée
- Liste de contrôle d'intégration activée (5 étapes en application)
```

**Semaine 6 : Itérer**
```
Agent : ceo-advisor
Compétences : product-analytics, experiment-designer, customer-success

Livrables :
- Métriques de la semaine 1 : inscriptions, taux d'activation, premier paiement
- Point de friction principal identifié (étape d'intégration 3)
- Expérience conçue et lancée
- Feuille de route du mois 2 esquissée
```

---

## Règles

1. **Un agent à la fois.** Changer est bien, mais ne mélez pas deux agents dans le même tour de conversation.
2. **Les compétences s'empilent librement.** Chargez autant de compétences que la tâche en a besoin. Elles ne sont pas en conflit.
3. **Les agents sont optionnels.** Pour le travail procédural, les chaînes de compétences seules suffisent.
4. **Le contexte se poursuit.** Lorsque vous changez de phase, résumez toujours les décisions et les artefacts d'abord.
5. **Vous décidez.** L'orchestration est une suggestion. Ignorez n'importe quelle phase, agent ou compétence à tout moment.

---

## Référence rapide

**Activation d'agent :**
```
/agents/advisors/cto-advisor
/agents/advisors/cmo-advisor
/agents/advisors/cfo-advisor
/agents/advisors/cpo-advisor
/agents/advisors/coo-advisor
/agents/advisors/ceo-advisor
/agents/advisors/general-counsel
/agents/roles/incident-commander
/agents/roles/senior-backend
/agents/roles/senior-frontend
/agents/roles/red-team
```

**Activation de compétence :**
```
/skills/devops-infra/aws-architect
/skills/marketing/content-strategy
/skills/product/product-discovery
[voir le répertoire skills/ pour le catalogue complet]
```

**Modèle de transfert de phase :**
```
Phase [N] terminée.
Décisions : [énumérer les décisions clés prises]
Artefacts : [énumérer les fichiers ou documents créés]
Éléments ouverts : [ce que la phase suivante doit résoudre]
Passage à : [agent] + [compétences]
```

---

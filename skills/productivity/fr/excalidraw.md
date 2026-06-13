---
name: excalidraw
description: "Génération de diagrammes Excalidraw : créer des diagrammes d'architecture, des organigrammes, des cartes de systèmes et des wireframes en tant que fichiers JSON Excalidraw — enregistrables, contrôlables en version et modifiables sur excalidraw.com"
---

# Excalidraw Skill

## Quand activer
- Créer un diagramme d'architecture pour une base de code ou un système
- Dessiner une carte de dépendance de service pour les microservices
- Construire un diagramme de flux de données ou d'infrastructure
- Générer un wireframe ou un croquis UI
- Produire un diagramme à intégrer dans un README ou une documentation

## Quand ne PAS utiliser
- Les organigrammes simples qui s'affichent dans GitHub/Notion — utiliser la compétence mermaid
- Les diapositives de présentation — exporter en PNG et utiliser dans votre outil de diapositives
- La collaboration blanche en temps réel — ouvrir directement excalidraw.com

## Instructions

### Diagramme d'architecture

```
Générer un diagramme d'architecture Excalidraw pour [système].

System: [décrire — services, bases de données, APIs externes, flux de données]
Style: [minimal / detailed / colour-coded by layer]
Save to: [docs/architecture.excalidraw or path of choice]

Conventions de diagramme:
- Rectangles avec coins arrondis: services et applications
- Cylindres: bases de données et stockage
- Diamants: points de décision ou passerelles
- Parallélogrammes: services externes ou tiers
- Flèches: direction du flux de données
- Codage couleur: frontend (blue), backend (orange), data (green), external (grey)

Exemple de description de système:
"Next.js frontend on Vercel, Express API on Railway,
PostgreSQL on Neon, Redis on Upstash, Stripe for payments"

Output: JSON Excalidraw valide sauvegardé dans le chemin spécifié.
```

### Carte de dépendance de service

```
Créer une carte de dépendance de service Excalidraw pour [architecture].

Services: [lister tous les services]
Dependencies: [quels services appellent lesquels]
Highlight: [critical path / bottlenecks / single points of failure]

Montrer:
- Chaque service en tant que boîte étiquetée
- Les appels synchrones en tant que flèches pleines
- Les appels asynchrones/pilotés par événements en tant que flèches pointillées
- Les dépendances externes dans une couleur différente
- Les annotations pour les protocoles (REST, gRPC, events)
```

### Diagramme d'infrastructure

```
Dessiner un diagramme d'infrastructure Excalidraw pour [déploiement].

Cloud: [AWS / GCP / Azure / multi-cloud]
Components: [lister — load balancer, compute, database, cache, CDN, etc.]
Regions/zones: [single region / multi-AZ / multi-region]

Conventions:
- Grouper les composants par limite VPC / réseau en utilisant des formes de conteneur
- Montrer les limites de sous-réseau public/privé
- Étiqueter chaque composant avec son nom de service cloud (p.ex. « ALB », « ECS Fargate », « RDS Aurora »)
- Montrer le flux de trafic avec des flèches directionnelles
```

### Wireframe

```
Créer un wireframe Excalidraw pour [écran/composant].

Screen: [décrire — dashboard, form, landing page, mobile screen]
Key elements: [lister les composants UI — nav, sidebar, cards, table, form, buttons]
Layout: [desktop / mobile / both]
Fidelity: [low (boxes only) / medium (labels + rough shapes)]

Utiliser le style fait à la main d'Excalidraw pour les wireframes (ressemble intentionnellement approximatif).
Étiqueter chaque composant avec son but.
```

### Ouverture et édition

```bash
# Ouvrir dans VS Code (nécessite l'extension Excalidraw VS Code)
code docs/architecture.excalidraw

# Ouvrir dans le navigateur
open https://excalidraw.com
# Then: File → Open → select your .excalidraw file

# Exporter vers PNG/SVG depuis Excalidraw:
# Menu → Export image → PNG or SVG

# Intégrer dans README:
# Exporter en SVG → committer au repo → référencer dans markdown:
# ![Architecture](docs/architecture.svg)
```

### Excalidraw MCP (si configuré)

Si le serveur MCP Excalidraw est configuré, Claude peut générer des diagrammes directement :
```
Utiliser le MCP Excalidraw pour dessiner un diagramme d'architecture pour notre app:
- React frontend → Express API → PostgreSQL + Redis
- Deployed on Vercel + Railway
Save as docs/architecture.excalidraw
```

Voir `mcp/excalidraw.md` pour les instructions de configuration.

## Exemple

**User:** Créer un diagramme d'architecture pour une app SaaS : frontend Next.js, API routes + Prisma + PostgreSQL, webhooks Stripe, Resend pour email, Cloudflare CDN.

**Claude generates:**

```json
{
  "type": "excalidraw",
  "version": 2,
  "elements": [
    {
      "type": "rectangle",
      "x": 100, "y": 100,
      "width": 180, "height": 60,
      "strokeColor": "#3b82f6",
      "backgroundColor": "#dbeafe",
      "label": { "text": "Next.js Frontend\n(Vercel)" }
    },
    {
      "type": "rectangle",
      "x": 380, "y": 100,
      "width": 180, "height": 60,
      "strokeColor": "#f97316",
      "backgroundColor": "#ffedd5",
      "label": { "text": "API Routes\n(Next.js / Railway)" }
    },
    {
      "type": "ellipse",
      "x": 380, "y": 240,
      "width": 180, "height": 60,
      "strokeColor": "#10b981",
      "backgroundColor": "#d1fae5",
      "label": { "text": "PostgreSQL\n(Neon)" }
    }
  ]
}
```

*Enregistrer à `docs/architecture.excalidraw` et ouvrir à excalidraw.com pour voir et éditer.*

---

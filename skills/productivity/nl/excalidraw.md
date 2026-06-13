---
name: excalidraw
description: "Excalidraw diagram generation: create architecture diagrams, flowcharts, system maps, and wireframes as Excalidraw JSON files — saveable, version-controllable, and editable in excalidraw.com"
---

# Excalidraw Skill

## Wanneer activeren
- Een architectuurdiagram maken voor een codebase of systeem
- Een service-afhankelijkheidskaart tekenen voor microservices
- Een gegevens flow- of infrastructuurdiagram bouwen
- Een wireframe of UI-schets genereren
- Een diagram produceren om in een README of docs in te sluiten

## Wanneer NIET gebruiken
- Eenvoudige stroomdiagrammen die in GitHub/Notion weergeven — gebruik de mermaid skill in plaats daarvan
- Presentatieslides — exporteer naar PNG en gebruik in uw slide tool
- Real-time gezamenlijk whiteboarden — open excalidraw.com rechtstreeks

## Instructies

### Architectuurdiagram

```
Generate an Excalidraw architecture diagram for [system].

System: [describe — services, databases, external APIs, data flows]
Style: [minimal / detailed / colour-coded by layer]
Save to: [docs/architecture.excalidraw or path of choice]

Diagram conventions:
- Rectangles with rounded corners: services and applications
- Cylinders: databases and storage
- Diamonds: decision points or gateways
- Parallelograms: external services or third-parties
- Arrows: data flow direction
- Colour coding: frontend (blue), backend (orange), data (green), external (grey)

Example system description:
"Next.js frontend on Vercel, Express API on Railway,
PostgreSQL on Neon, Redis on Upstash, Stripe for payments"

Output: valid Excalidraw JSON saved to the specified path.
```

### Service-afhankelijkheidskaart

```
Create an Excalidraw service dependency map for [architecture].

Services: [list all services]
Dependencies: [which services call which]
Highlight: [critical path / bottlenecks / single points of failure]

Show:
- Each service as a labelled box
- Synchronous calls as solid arrows
- Async/event-driven calls as dashed arrows
- External dependencies in a different colour
- Annotations for protocols (REST, gRPC, events)
```

### Infrastructuurdiagram

```
Draw an Excalidraw infrastructure diagram for [deployment].

Cloud: [AWS / GCP / Azure / multi-cloud]
Components: [list — load balancer, compute, database, cache, CDN, etc.]
Regions/zones: [single region / multi-AZ / multi-region]

Conventions:
- Group components by VPC / network boundary using container shapes
- Show public/private subnet boundaries
- Label each component with its cloud service name (e.g. "ALB", "ECS Fargate", "RDS Aurora")
- Show traffic flow with directional arrows
```

### Wireframe

```
Create an Excalidraw wireframe for [screen/component].

Screen: [describe — dashboard, form, landing page, mobile screen]
Key elements: [list UI components — nav, sidebar, cards, table, form, buttons]
Layout: [desktop / mobile / both]
Fidelity: [low (boxes only) / medium (labels + rough shapes)]

Use Excalidraw's hand-drawn style for wireframes (looks intentionally rough).
Label every component with its purpose.
```

### Openen en bewerken

```bash
# Open in VS Code (requires Excalidraw VS Code extension)
code docs/architecture.excalidraw

# Open in browser
open https://excalidraw.com
# Then: File → Open → select your .excalidraw file

# Export to PNG/SVG from Excalidraw:
# Menu → Export image → PNG or SVG

# Embed in README:
# Export to SVG → commit to repo → reference in markdown:
# ![Architecture](docs/architecture.svg)
```

### Excalidraw MCP (indien geconfigureerd)

Als de Excalidraw MCP-server is geconfigureerd, kan Claude diagrammen rechtstreeks genereren:
```
Use the Excalidraw MCP to draw an architecture diagram for our app:
- React frontend → Express API → PostgreSQL + Redis
- Deployed on Vercel + Railway
Save as docs/architecture.excalidraw
```

Zie `mcp/excalidraw.md` voor setup-instructies.

## Voorbeeld

**Gebruiker:** Maak een architectuurdiagram voor een SaaS-app: Next.js frontend, API routes + Prisma + PostgreSQL, Stripe webhooks, Resend voor e-mail, Cloudflare CDN.

**Claude genereert:**

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

*Save to `docs/architecture.excalidraw` and open at excalidraw.com to view and edit.*

---

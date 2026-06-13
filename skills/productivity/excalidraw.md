---
name: excalidraw
description: "Excalidraw diagram generation: create architecture diagrams, flowcharts, system maps, and wireframes as Excalidraw JSON files — saveable, version-controllable, and editable in excalidraw.com"
updated: 2026-06-13
---

# Excalidraw Skill

## When to activate
- Creating an architecture diagram for a codebase or system
- Drawing a service dependency map for microservices
- Building a data flow or infrastructure diagram
- Generating a wireframe or UI sketch
- Producing a diagram to embed in a README or docs

## When NOT to use
- Simple flowcharts that render in GitHub/Notion — use the mermaid skill instead
- Presentation slides — export to PNG and use in your slide tool
- Real-time collaborative whiteboarding — open excalidraw.com directly

## Instructions

### Architecture diagram

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

### Service dependency map

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

### Infrastructure diagram

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

### Opening and editing

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

### Excalidraw MCP (if configured)

If the Excalidraw MCP server is configured, Claude can generate diagrams directly:
```
Use the Excalidraw MCP to draw an architecture diagram for our app:
- React frontend → Express API → PostgreSQL + Redis
- Deployed on Vercel + Railway
Save as docs/architecture.excalidraw
```

See `mcp/excalidraw.md` for setup instructions.

## Example

**User:** Create an architecture diagram for a SaaS app: Next.js frontend, API routes + Prisma + PostgreSQL, Stripe webhooks, Resend for email, Cloudflare CDN.

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

*Save to `docs/architecture.excalidraw` and open at excalidraw.com to view and edit.*

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

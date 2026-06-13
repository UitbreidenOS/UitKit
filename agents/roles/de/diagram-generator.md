---
name: diagram-generator
description: "Diagramm-Generator-Agent — konvertiert Code, Architektur-Beschreibungen und Datenmodelle in Mermaid-Diagramme, ASCII-Kunst und Excalidraw-kompatibles JSON"
---

# Diagram Generator Agent

## Zweck
Konvertiert Code-Struktur, Architektur-Beschreibungen, API-Flows und Datenmodelle in klare visuelle Diagramme mittels Mermaid-Syntax, ASCII-Kunst oder Excalidraw-JSON – ohne Claude Code zu verlassen.

## Model-Anleitung
Haiku – Diagramm-Generierung ist strukturierte Ausgabe mit klaren Mustern; Haiku handhabt das effizient und kostengünstig.

## Tools
- Read (Quellendateien, Schema-Dateien, CLAUDE.md, Architektur-Dokumentation)
- Write (Diagramm-Ausgabedateien)

## Wann hierher delegieren
- Generierung eines Architektur-Diagramms aus einer Codebasis-Beschreibung
- Konvertierung eines Prisma/Drizzle-Schemas in ein ER-Diagramm
- Erstellung eines Sequenz-Diagramms für einen API-Flow oder Authentifizierungsprozess
- Zeichnung einer Service-Abhängigkeitskarte aus Microservices-Code
- Generierung eines Ablaufdiagramms aus einer komplexen Funktion oder einem Workflow

## Anweisungen

### Mermaid-Diagramme (GitHub-nativ, dokumentationsfreundlich)

**Architektur-Diagramm:**
```
Lesen Sie die Codebasis und generieren Sie ein Mermaid-Architektur-Diagramm.

Fokus auf: Services, Datenbanken, externe APIs und Datenfluss zwischen ihnen.

Ausgabeformat:
```mermaid
graph TB
  subgraph Frontend
    UI[React App]
  end
  subgraph Backend
    API[Express API]
    WS[WebSocket Server]
  end
  subgraph Data
    DB[(PostgreSQL)]
    Cache[(Redis)]
  end
  UI --> API
  UI --> WS
  API --> DB
  API --> Cache
```
```

**ER-Diagramm aus Schema:**
```
Lesen Sie das Datenbankschema (Prisma/Drizzle/SQL) und generieren Sie ein Mermaid-ER-Diagramm.

```mermaid
erDiagram
  USER {
    string id PK
    string email UK
    string name
    datetime createdAt
  }
  ORDER {
    string id PK
    string userId FK
    decimal total
    string status
  }
  USER ||--o{ ORDER : "places"
```
```

**Sequenz-Diagramm:**
```
Generieren Sie ein Sequenz-Diagramm für [Flow].

```mermaid
sequenceDiagram
  participant C as Client
  participant A as API
  participant D as Database
  participant E as Email Service
  
  C->>A: POST /auth/register {email, password}
  A->>D: Check if email exists
  D-->>A: Not found
  A->>D: Create user record
  D-->>A: User created
  A->>E: Send welcome email
  A-->>C: 201 Created {userId, token}
```
```

**Ablaufdiagramm:**
```
Generieren Sie ein Ablaufdiagramm für [Funktion/Prozess].

```mermaid
flowchart TD
  Start([Start]) --> Input[Receive payment data]
  Input --> Validate{Valid?}
  Validate -->|No| Error[Return 422]
  Validate -->|Yes| Charge[Charge card via Stripe]
  Charge --> Success{Succeeded?}
  Success -->|No| Retry{Retries left?}
  Retry -->|Yes| Charge
  Retry -->|No| Fail[Return 402]
  Success -->|Yes| Save[Save to database]
  Save --> Notify[Send confirmation email]
  Notify --> Done([Done])
```
```

### ASCII-Diagramme (Terminal-freundlich)

Für README-Dateien und Dokumentation, die als reiner Text dargestellt werden müssen:

```
Architektur (ASCII):

┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│   Express API   │
│  (Vercel)       │     │   (Railway)     │
└─────────────────┘     └────────┬────────┘
                                  │
                    ┌─────────────┴──────────┐
                    │                        │
             ┌──────▼──────┐     ┌──────────▼────┐
             │ PostgreSQL  │     │    Redis       │
             │  (Neon)     │     │   (Upstash)    │
             └─────────────┘     └───────────────┘
```

### Excalidraw JSON

Für reichhaltigere Diagramme mit visueller Gestaltung (öffnen Sie auf excalidraw.com):

```
Generieren Sie Excalidraw-JSON für [Diagrammtyp].
Speichern Sie unter: docs/architecture.excalidraw
Format: Gültiges Excalidraw-JSON mit Element-Array
Beinhalte: Boxen für Services, Pfeile für Verbindungen, Labels
```

## Anwendungsbeispiel

**Benutzer:** Ich habe gerade eine Next.js-App mit Supabase, Stripe und Resend gebaut. Generieren Sie das Architektur-Diagramm für meine README.

**Agent-Ausgabe:**

```mermaid
graph TB
  subgraph "Frontend (Vercel)"
    UI[Next.js App Router]
    SC[Server Components]
    CA[Client Actions]
  end
  
  subgraph "Backend (Next.js API)"
    SA[Server Actions]
    WH[Webhook Handler]
  end
  
  subgraph "External Services"
    SB[(Supabase\nPostgres + Auth)]
    ST[Stripe\nPayments]
    RS[Resend\nEmail]
  end
  
  UI --> SC
  UI --> CA
  SC --> SA
  CA --> SA
  SA --> SB
  SA --> ST
  SA --> RS
  ST -->|webhooks| WH
  WH --> SB
```

Gespeichert unter: `docs/architecture.md`

---

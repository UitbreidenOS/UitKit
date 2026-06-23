# CLAUDE.md — Kubernetes Microservices (Annotated Example)
> Multi-service architecture on Kubernetes — shows how to express service boundaries, cross-service change discipline, and the blast-radius awareness Claude needs when touching shared infrastructure.

<!-- ANNOTATION: The first paragraph establishes blast radius awareness. Changes in a microservices repo affect multiple deployed services. Claude needs to understand that changing a shared proto or schema is not local — it propagates to all consumers. -->
This is a Kubernetes microservices architecture. Changes to shared contracts (protobuf schemas, event schemas, shared libraries) affect multiple deployed services. Always identify downstream consumers before changing shared code, and note them in the PR description.

## Services

```
services/
  gateway/         # API gateway — Kong config + custom plugins
  auth/            # Authentication service (Go, port 8001)
  users/           # User management (Go, port 8002)
  orders/          # Order processing (Python/FastAPI, port 8003)
  payments/        # Payment processing (Go, port 8004)
  notifications/   # Email/SMS/push (Node.js, port 8005)
  analytics/       # Event processing (Python, port 8006)
infra/
  k8s/             # Kubernetes manifests (Kustomize)
  terraform/       # Cloud infrastructure (GCP)
  helm/            # Helm charts for third-party services
proto/
  *.proto          # Protobuf definitions (shared contracts)
shared/
  events/          # Kafka event schemas (Avro)
  libs/            # Shared Go modules
```

## Service Ownership

<!-- ANNOTATION: Naming service owners prevents Claude from making cross-service changes without flagging that another team needs to be involved. This is a sociotechnical constraint, not just a technical one. -->
| Service | Language | Team | On-call |
|---|---|---|---|
| gateway | Kong DSL | Platform | platform@ |
| auth | Go | Platform | platform@ |
| users | Go | Product | product@ |
| orders | Python | Commerce | commerce@ |
| payments | Go | Payments | payments@ |

When making changes that cross service boundaries, note the owning team in the PR.

## Protobuf / API Contracts

<!-- ANNOTATION: Protobuf field numbering is an irreversible decision. Once a field number is used, it can never be reused even if the field is removed. Claude must understand this to not suggest "cleaning up" unused field numbers. -->
- Protobuf definitions in `proto/` are the source of truth for inter-service RPC
- Field numbers are permanent — never reuse a field number even after removing the field
- Backwards-compatible changes: add new optional fields, add enum values at the end
- Breaking changes: remove fields, change field types, change field numbers
- Run `buf lint` and `buf breaking --against` before any proto change
- All proto changes require review from at least one consumer service team

## Kubernetes Manifests

<!-- ANNOTATION: Kustomize overlays separate environment configs from base config. Claude should not edit base manifests directly for environment-specific changes — it should use the overlay pattern. -->
- Manifests use Kustomize overlays — `infra/k8s/base/` is never environment-specific
- Environment overrides go in `infra/k8s/overlays/{dev,staging,prod}/`
- Do not hardcode image tags in base manifests — use `newTag` in Kustomize overlays
- Resource limits and requests must be set on every container
- Never set `replicas` in base — set it in overlays
- `kubectl apply -k infra/k8s/overlays/dev` for local cluster testing

## Service-to-Service Communication

- Synchronous: gRPC (defined in `proto/`)
- Asynchronous: Kafka (schema in `shared/events/`)
- Health checks: all services expose `/healthz` (liveness) and `/readyz` (readiness)
- Service discovery: Kubernetes DNS (`{service}.{namespace}.svc.cluster.local`)
- Do not use direct IP addresses or NodePort services for inter-service communication

## Kafka Events

<!-- ANNOTATION: Avro schema compatibility rules are less well-known than protobuf rules. Making them explicit prevents Claude from suggesting schema changes that break consumer deserialization. -->
- Event schemas in `shared/events/` use Avro with Schema Registry
- Schema compatibility mode: `BACKWARD` — new schema can read data written with old schema
- Adding a field: must have a default value
- Removing a field: deprecate first, remove after all consumers have been updated
- Run `schema-registry-compat-check` before merging event schema changes

## Local Development

```bash
# Requires: Docker Desktop with Kubernetes enabled, skaffold, kubectx
skaffold dev --profile local    # Builds + deploys all services to local cluster
skaffold dev --module auth       # Single service hot-reload
kubectl logs -f deployment/auth  # Tail service logs
```

## Observability

<!-- ANNOTATION: Three pillars of observability naming tells Claude to add proper instrumentation to any new code, not just write the happy path. -->
- Metrics: Prometheus (scrape annotation `prometheus.io/scrape: "true"` on pods)
- Logs: structured JSON to stdout — no custom log sinks
- Traces: OpenTelemetry → Jaeger — all new services must include the OTel middleware
- Alerts are in `infra/k8s/base/monitoring/` — update them when adding new critical paths

## What Not To Do

<!-- ANNOTATION: "Don't change a proto field number" is listed here even though it's in the proto section — important rules bear repetition in the "what not to do" section because that's where people look when something goes wrong. -->
- Do not change or reuse protobuf field numbers
- Do not hardcode inter-service URLs — use Kubernetes DNS
- Do not commit secrets to `infra/k8s/` — use sealed-secrets or external-secrets operator
- Do not add resource-unlimited containers (`resources: {}`)
- Do not make cross-service database joins — each service owns its data
- Do not bypass the API gateway for external-facing endpoints

---
name: "Network Design"
description: "Designing cloud network architecture from scratch, planning VPC CIDR ranges and subnet layouts, implementing"
---

# Network Design

## When to activate
Designing cloud network architecture from scratch, planning VPC CIDR ranges and subnet layouts, implementing zero-trust network principles, selecting and configuring load balancers (ALB/NLB/GWLB), designing service mesh deployments (Istio or Linkerd), setting up Route 53 DNS with health checks, or reviewing existing network architecture for security and performance gaps.

## When NOT to use
On-premises network design (different tooling and constraints). Simple single-tier applications where a default VPC and security group suffice. Application-level API gateway configuration that does not involve network topology. CDN configuration not tied to routing or DNS architecture.

## Instructions

### 3-Tier VPC Architecture

The standard 3-tier layout separates ingress, compute, and data into distinct network zones with no direct internet-to-data path:

```
VPC: 10.0.0.0/16

Public subnets (internet-facing load balancers, NAT gateways):
  10.0.0.0/24  — AZ-a
  10.0.1.0/24  — AZ-b
  10.0.2.0/24  — AZ-c

Private subnets (application servers, ECS tasks, Lambda):
  10.0.10.0/24 — AZ-a
  10.0.11.0/24 — AZ-b
  10.0.12.0/24 — AZ-c

Isolated subnets (databases, Elasticache — no internet route):
  10.0.20.0/24 — AZ-a
  10.0.21.0/24 — AZ-b
  10.0.22.0/24 — AZ-c
```

Terraform VPC module:

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.env}-vpc"
  cidr = "10.0.0.0/16"

  azs              = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets   = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
  private_subnets  = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
  database_subnets = ["10.0.20.0/24", "10.0.21.0/24", "10.0.22.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = var.env != "prod"   # cost: one NAT in dev, one per AZ in prod
  one_nat_gateway_per_az = var.env == "prod"

  enable_dns_hostnames = true
  enable_dns_support   = true

  # Required tags for EKS/ELB auto-discovery
  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
}
```

Plan CIDR ranges to allow future VPC peering without overlap. Use RFC 1918 ranges and document allocations. `/16` VPC gives 65,536 addresses — more than enough for most workloads. Reserve `10.1.0.0/16` and `10.2.0.0/16` for additional VPCs in a multi-account setup.

### Zero-Trust Principles

Zero trust means: no implicit trust based on network location. Every request is authenticated, authorized, and encrypted regardless of source.

Three implementation pillars:

1. **Verify every request** — all service-to-service calls require a valid identity (mTLS certificate or JWT). Network adjacency is not proof of legitimacy.
2. **Micro-segmentation** — security groups restrict traffic at the resource level, not the subnet level. A compromised app server cannot reach the database if no security group rule allows it.
3. **Least privilege** — IAM roles scoped to the minimum required actions. No `*` actions. No `*` resources except where unavoidable (e.g., CloudWatch logs creation).

### Security Groups

Start with deny-all, open only named ports from named sources. Never use `0.0.0.0/0` in ingress rules except for the public-facing load balancer:

```hcl
# ALB — public ingress only
resource "aws_security_group" "alb" {
  name   = "${var.env}-alb"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # redirect to 443
  }
  egress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}

# App — only from ALB
resource "aws_security_group" "app" {
  name   = "${var.env}-app"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.rds.id]
  }
}

# RDS — only from app
resource "aws_security_group" "rds" {
  name   = "${var.env}-rds"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}
```

### Load Balancer Selection

| Load Balancer | Layer | Use When |
|---|---|---|
| ALB | L7 (HTTP/HTTPS) | Standard web/API traffic. Host/path routing, WebSocket, gRPC, OIDC auth offload. |
| NLB | L4 (TCP/UDP) | Ultra-low latency, static IPs, non-HTTP protocols (MQTT, gRPC streaming, gaming). |
| GWLB | L3 (IP) | Inserting third-party virtual appliances (firewalls, IDS/IPS) transparently. |

ALB target group with health check:

```hcl
resource "aws_lb_target_group" "app" {
  name        = "${var.env}-app-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"   # for ECS Fargate

  health_check {
    path                = "/health"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }

  deregistration_delay = 30  # drain in-flight requests before deregistering
}
```

### Route 53: Split-Horizon DNS, Health Checks, Failover

Split-horizon: internal resources resolve to private IPs, external to public IPs:

```hcl
# Public zone — external DNS
resource "aws_route53_zone" "public" {
  name = "api.example.com"
}

# Private zone — internal DNS (VPC-scoped)
resource "aws_route53_zone" "private" {
  name = "api.internal.example.com"
  vpc {
    vpc_id = module.vpc.vpc_id
  }
}
```

Health checks and failover routing for active/passive multi-region:

```hcl
resource "aws_route53_health_check" "primary" {
  fqdn              = "us-east-1.api.example.com"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 10
}

resource "aws_route53_record" "api_primary" {
  zone_id        = aws_route53_zone.public.zone_id
  name           = "api.example.com"
  type           = "A"
  set_identifier = "primary"
  health_check_id = aws_route53_health_check.primary.id
  failover_routing_policy { type = "PRIMARY" }
  alias {
    name                   = aws_lb.primary.dns_name
    zone_id                = aws_lb.primary.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api_secondary" {
  zone_id        = aws_route53_zone.public.zone_id
  name           = "api.example.com"
  type           = "A"
  set_identifier = "secondary"
  failover_routing_policy { type = "SECONDARY" }
  alias {
    name                   = aws_lb.secondary.dns_name
    zone_id                = aws_lb.secondary.zone_id
    evaluate_target_health = true
  }
}
```

### Service Mesh: Sidecar Pattern

A service mesh injects a sidecar proxy (Envoy for Istio, micro-proxy for Linkerd) into every pod. The mesh handles three things without any application code changes:

1. **Traffic management** — retries, circuit breaking, traffic splitting for canary deployments
2. **mTLS automatic** — all pod-to-pod traffic encrypted and authenticated by certificates managed by the mesh control plane
3. **Observability from mesh** — request traces (Jaeger/Zipkin), golden signal metrics (request rate, error rate, latency), and topology maps

Istio traffic split for canary:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: payment-service
spec:
  hosts:
    - payment-service
  http:
    - route:
        - destination:
            host: payment-service
            subset: stable
          weight: 90
        - destination:
            host: payment-service
            subset: canary
          weight: 10
```

Choose **Linkerd** over Istio for simplicity if you do not need advanced traffic management features — Linkerd has a significantly smaller control plane and lower resource overhead.

## Example

Design AWS network for a 3-tier e-commerce app:

1. VPC `10.0.0.0/16` across 3 AZs. Public subnets (`/24` each) for ALB and NAT gateways. Private subnets for ECS Fargate tasks. Isolated subnets for RDS with no internet route.
2. Security groups: ALB accepts 443 from `0.0.0.0/0`, forwards to ECS on port 8080. ECS allows 8080 from ALB only, egress to RDS on 5432. RDS allows 5432 from ECS only.
3. ALB with HTTPS listener, ACM certificate, and HTTP→HTTPS redirect. Target group with `/health` health check, `deregistration_delay=30`.
4. Route 53 public zone `api.example.com` with HTTPS health check and active/passive failover to a secondary region ALB. Private zone `api.internal.example.com` for service-to-service calls resolving to private IPs.
5. Istio service mesh with mTLS enforced across all ECS tasks. VirtualService configured for canary deployments at 10% traffic split.

---

# Netwerkontwerp

## Wanneer activeren
Ontwerp cloud-netwerkarchitectuur vanaf nul, plan VPC CIDR-bereiken en subnetlay-outs, implementeer zero-trust netwerkprincipes, selecteer en configureer load balancers (ALB/NLB/GWLB), ontwerp service mesh-implementaties (Istio of Linkerd), stel Route 53 DNS in met health checks, of beoordeel bestaande netwerkarchitectuur op beveiligings- en performancegaten.

## Wanneer niet gebruiken
On-premises netwerkontwerp (ander tooling en beperkingen). Eenvoudige single-tier toepassingen waarbij een standaard VPC en security group volstaan. Configuratie van application-level API gateway die niet betrokken is bij nettopologie. CDN-configuratie niet gekoppeld aan routering of DNS-architectuur.

## Instructies

### 3-Tier VPC-architectuur

De standaard 3-tier indeling scheidt ingress, compute en data in aparte netwerkzones zonder direct internet-naar-data pad:

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

Terraform VPC-module:

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

Plan CIDR-bereiken om toekomstig VPC-peering zonder overlap mogelijk te maken. Gebruik RFC 1918-bereiken en documenteer toewijzingen. Een `/16` VPC geeft 65.536 adressen — meer dan genoeg voor de meeste workloads. Reserveer `10.1.0.0/16` en `10.2.0.0/16` voor aanvullende VPC's in een multi-account setup.

### Zero-Trust-principes

Zero trust betekent: geen impliciete vertrouwen op basis van netwerklocatie. Elk verzoek wordt geverifieerd, geautoriseerd en versleuteld ongeacht de bron.

Drie implementatiepilaars:

1. **Verifieer elk verzoek** — alle service-to-service aanroepen vereisen een geldige identiteit (mTLS-certificaat of JWT). Netwerkbuurt is geen bewijs van legitimiteit.
2. **Mikrosegmentatie** — security groups beperken verkeer op resourceniveau, niet subnetniveau. Een gecompromitteerde app-server kan niet de database bereiken als geen security group regel dit toestaat.
3. **Principe van minste privilege** — IAM-rollen beperkt tot minimaal vereiste acties. Geen `*` acties. Geen `*` resources behalve waar onvermijdelijk (bijv. CloudWatch logs creatie).

### Security Groups

Begin met deny-all, open alleen benoemde poorten van benoemde bronnen. Gebruik nooit `0.0.0.0/0` in ingress-regels behalve voor de public-facing load balancer:

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

### Load Balancer-selectie

| Load Balancer | Laag | Gebruik wanneer |
|---|---|---|
| ALB | L7 (HTTP/HTTPS) | Standaard web-/API-verkeer. Host/path routing, WebSocket, gRPC, OIDC auth offload. |
| NLB | L4 (TCP/UDP) | Ultra-lage latentie, statische IP's, niet-HTTP protocollen (MQTT, gRPC streaming, gaming). |
| GWLB | L3 (IP) | Transparante inzet van virtuele appliances van derden (firewalls, IDS/IPS). |

ALB target group met health check:

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

Split-horizon: interne resources worden opgelost naar private IP's, externe naar public IP's:

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

Health checks en failover routing voor actief/passief multi-region:

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

### Service Mesh: Sidecar-patroon

Een service mesh injecteert een sidecar proxy (Envoy voor Istio, micro-proxy voor Linkerd) in elke pod. Het mesh behandelt drie dingen zonder wijzigingen in applicatiecode:

1. **Verkeersbeheer** — retries, circuit breaking, traffic splitting voor canary-implementaties
2. **Automatische mTLS** — alle pod-to-pod verkeer versleuteld en geverifieerd door certificaten beheerd door de mesh control plane
3. **Observabiliteit uit mesh** — request traces (Jaeger/Zipkin), golden signal metrics (request rate, error rate, latency), en topology maps

Istio traffic split voor canary:

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

Kies **Linkerd** boven Istio voor eenvoud als u geen geavanceerde traffic management functies nodig heeft — Linkerd heeft een aanzienlijk kleinere control plane en lager resource overhead.

## Voorbeeld

Ontwerp AWS-netwerk voor een 3-tier e-commerce applicatie:

1. VPC `10.0.0.0/16` over 3 AZ's. Public subnets (`/24` elk) voor ALB en NAT gateways. Private subnets voor ECS Fargate tasks. Isolated subnets voor RDS zonder internet route.
2. Security groups: ALB accepteert 443 van `0.0.0.0/0`, forwards naar ECS op port 8080. ECS staat 8080 toe van ALB alleen, egress naar RDS op 5432. RDS staat 5432 toe van ECS alleen.
3. ALB met HTTPS listener, ACM certificaat, en HTTP→HTTPS redirect. Target group met `/health` health check, `deregistration_delay=30`.
4. Route 53 public zone `api.example.com` met HTTPS health check en actief/passief failover naar secundaire regio ALB. Private zone `api.internal.example.com` voor service-to-service oproepen die naar private IP's worden opgelost.
5. Istio service mesh met mTLS afgedwongen over alle ECS tasks. VirtualService geconfigureerd voor canary-implementaties met 10% traffic split.

---

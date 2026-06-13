# Netzwerkdesign

## Wann aktivieren
Entwerfen Sie Cloud-Netzwerkarchitektur von Grund auf, planen Sie VPC-CIDR-Bereiche und Subnet-Layouts, implementieren Sie Zero-Trust-Netzwerkprinzipien, wählen und konfigurieren Sie Load Balancer (ALB/NLB/GWLB), gestalten Sie Service-Mesh-Deployments (Istio oder Linkerd), richten Sie Route 53 DNS mit Health Checks ein, oder überprüfen Sie vorhandene Netzwerkarchitektur auf Sicherheits- und Performance-Lücken.

## Wann nicht verwenden
On-Premises-Netzwerkdesign (andere Tools und Einschränkungen). Einfache Single-Tier-Anwendungen, bei denen ein Standard-VPC und eine Security Group ausreichend sind. Konfiguration von Application-Level-API-Gateways, die nicht mit der Netzwerktopologie zusammenhängen. CDN-Konfiguration nicht gebunden an Routing oder DNS-Architektur.

## Anweisungen

### 3-Tier-VPC-Architektur

Das Standard-3-Tier-Layout trennt Ingress, Compute und Daten in unterschiedliche Netzwerkzonen ohne direkten Internet-zu-Daten-Pfad:

```
VPC: 10.0.0.0/16

Public subnets (Internet-facing Load Balancer, NAT Gateways):
  10.0.0.0/24  — AZ-a
  10.0.1.0/24  — AZ-b
  10.0.2.0/24  — AZ-c

Private subnets (Application Server, ECS Tasks, Lambda):
  10.0.10.0/24 — AZ-a
  10.0.11.0/24 — AZ-b
  10.0.12.0/24 — AZ-c

Isolated subnets (Databases, Elasticache — no internet route):
  10.0.20.0/24 — AZ-a
  10.0.21.0/24 — AZ-b
  10.0.22.0/24 — AZ-c
```

Terraform-VPC-Modul:

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

Planen Sie CIDR-Bereiche, um zukünftiges VPC-Peering ohne Überlappung zu ermöglichen. Verwenden Sie RFC-1918-Bereiche und dokumentieren Sie Zuordnungen. Ein `/16` VPC bietet 65.536 Adressen — mehr als ausreichend für die meisten Workloads. Reservieren Sie `10.1.0.0/16` und `10.2.0.0/16` für zusätzliche VPCs in einer Multi-Account-Einrichtung.

### Zero-Trust-Prinzipien

Zero Trust bedeutet: kein implizites Vertrauen basierend auf Netzwerkstandort. Jede Anfrage wird authentifiziert, autorisiert und verschlüsselt, unabhängig von der Quelle.

Drei Implementierungssäulen:

1. **Verifizieren Sie jede Anfrage** — alle Service-zu-Service-Aufrufe erfordern eine gültige Identität (mTLS-Zertifikat oder JWT). Netzwerk-Nachbarschaft ist kein Beweis der Legitimität.
2. **Mikrosegmentierung** — Security Groups beschränken Datenverkehr auf Ressourcenebene, nicht auf Subnet-Ebene. Ein kompromittierter App-Server kann nicht auf die Datenbank zugreifen, wenn keine Security-Group-Regel dies zulässt.
3. **Prinzip der geringsten Berechtigung** — IAM-Rollen auf minimale erforderliche Aktionen begrenzt. Keine `*`-Aktionen. Keine `*`-Ressourcen außer wo unvermeidbar (z.B. CloudWatch Logs-Erstellung).

### Security Groups

Beginnen Sie mit deny-all, öffnen Sie nur benannte Ports von benannten Quellen. Verwenden Sie niemals `0.0.0.0/0` in Ingress-Regeln außer für den public-facing Load Balancer:

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

### Load-Balancer-Auswahl

| Load Balancer | Schicht | Verwendung |
|---|---|---|
| ALB | L7 (HTTP/HTTPS) | Standard-Web-/API-Traffic. Host/Path-Routing, WebSocket, gRPC, OIDC-Auth-Offload. |
| NLB | L4 (TCP/UDP) | Ultra-niedrige Latenz, statische IPs, Nicht-HTTP-Protokolle (MQTT, gRPC Streaming, Gaming). |
| GWLB | L3 (IP) | Transparente Einfügung von Appliances von Drittanbietern (Firewalls, IDS/IPS). |

ALB Target Group mit Health Check:

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

### Route 53: Split-Horizon-DNS, Health Checks, Failover

Split-Horizon: Interne Ressourcen werden zu privaten IPs aufgelöst, externe zu öffentlichen IPs:

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

Health Checks und Failover-Routing für aktiv/passiv Multi-Region:

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

### Service Mesh: Sidecar-Muster

Ein Service Mesh injiziert einen Sidecar-Proxy (Envoy für Istio, Micro-Proxy für Linkerd) in jeden Pod. Das Mesh handhabt drei Dinge ohne Änderungen am Anwendungscode:

1. **Traffic Management** — Retries, Circuit Breaking, Traffic Splitting für Canary-Deployments
2. **Automatisches mTLS** — Gesamter Pod-zu-Pod-Datenverkehr verschlüsselt und authentifiziert durch Zertifikate, die vom Mesh Control Plane verwaltet werden
3. **Observability vom Mesh** — Request Traces (Jaeger/Zipkin), Golden Signal Metrics (Request Rate, Error Rate, Latency), und Topology Maps

Istio Traffic Split für Canary:

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

Wählen Sie **Linkerd** über Istio für Einfachheit, wenn Sie keine erweiterten Traffic-Management-Funktionen benötigen — Linkerd hat eine erheblich kleinere Control Plane und geringeren Resource-Overhead.

## Beispiel

Entwerfen Sie ein AWS-Netzwerk für eine 3-Tier-E-Commerce-Anwendung:

1. VPC `10.0.0.0/16` über 3 AZs. Public Subnets (`/24` jeweils) für ALB und NAT Gateways. Private Subnets für ECS Fargate Tasks. Isolated Subnets für RDS ohne Internet-Route.
2. Security Groups: ALB akzeptiert 443 von `0.0.0.0/0`, leitet an ECS auf Port 8080 weiter. ECS erlaubt 8080 nur von ALB, Egress zu RDS auf 5432. RDS erlaubt 5432 nur von ECS.
3. ALB mit HTTPS-Listener, ACM-Zertifikat und HTTP→HTTPS-Umleitung. Target Group mit `/health` Health Check, `deregistration_delay=30`.
4. Route 53 öffentliche Zone `api.example.com` mit HTTPS Health Check und aktiv/passiv Failover zu sekundärem Regions-ALB. Private Zone `api.internal.example.com` für Service-zu-Service-Aufrufe mit Auflösung zu privaten IPs.
5. Istio Service Mesh mit mTLS über alle ECS Tasks erzwungen. VirtualService für Canary-Deployments mit 10% Traffic Split konfiguriert.

---

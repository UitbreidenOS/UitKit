# Conception de Réseau

## Quand activer
Conception d'architecture réseau cloud à partir de zéro, planification de plages CIDR VPC et mises en page de sous-réseaux, implémentation de principes de réseau zero-trust, sélection et configuration de load balancers (ALB/NLB/GWLB), conception de déploiements de service mesh (Istio ou Linkerd), configuration de Route 53 DNS avec health checks, ou révision d'architecture réseau existante pour les lacunes de sécurité et performance.

## Quand ne pas utiliser
Conception de réseau sur site (tooling et contraintes différents). Applications simples à un seul tier où un VPC par défaut et un security group suffisent. Configuration d'API gateway au niveau applicatif qui ne concerne pas la topologie réseau. Configuration de CDN non liée au routage ou à l'architecture DNS.

## Instructions

### Architecture VPC à 3 Niveaux

La disposition standard à 3 niveaux sépare l'ingress, le compute et les données en zones réseau distinctes sans chemin direct d'internet vers les données :

```
VPC: 10.0.0.0/16

Public subnets (load balancers internet-facing, NAT gateways):
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

Module VPC Terraform :

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

Planifiez les plages CIDR pour permettre le peering VPC futur sans chevauchement. Utilisez les plages RFC 1918 et documentez les allocations. Un VPC `/16` donne 65 536 adresses — plus que suffisant pour la plupart des charges de travail. Réservez `10.1.0.0/16` et `10.2.0.0/16` pour des VPC supplémentaires dans une configuration multi-compte.

### Principes Zero-Trust

Zero trust signifie : pas de confiance implicite basée sur la localisation réseau. Chaque requête est authentifiée, autorisée et chiffrée indépendamment de la source.

Trois piliers de mise en œuvre :

1. **Vérifier chaque requête** — tous les appels service-à-service nécessitent une identité valide (certificat mTLS ou JWT). La proximité réseau n'est pas une preuve de légitimité.
2. **Micro-segmentation** — les security groups limitent le trafic au niveau des ressources, pas au niveau du sous-réseau. Un serveur applicatif compromis ne peut pas atteindre la base de données si aucune règle de security group ne le permet.
3. **Principe du moindre privilège** — les rôles IAM limités aux actions minimales requises. Pas d'actions `*`. Pas de ressources `*` sauf si inévitable (p. ex., création de logs CloudWatch).

### Security Groups

Commencez par deny-all, ouvrez uniquement les ports nommés à partir de sources nommées. N'utilisez jamais `0.0.0.0/0` dans les règles d'ingress sauf pour le load balancer public :

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

### Sélection de Load Balancer

| Load Balancer | Couche | Utiliser Quand |
|---|---|---|
| ALB | L7 (HTTP/HTTPS) | Trafic web/API standard. Host/path routing, WebSocket, gRPC, OIDC auth offload. |
| NLB | L4 (TCP/UDP) | Ultra-faible latence, IPs statiques, protocoles non-HTTP (MQTT, gRPC streaming, jeux). |
| GWLB | L3 (IP) | Insertion d'appliances virtuelles tierces (firewalls, IDS/IPS) de manière transparente. |

Target group ALB avec health check :

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

### Route 53 : Split-Horizon DNS, Health Checks, Failover

Split-horizon : les ressources internes se résolvent en IPs privées, les externes en IPs publiques :

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

Health checks et failover routing pour multi-région actif/passif :

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

### Service Mesh : Modèle Sidecar

Un service mesh injecte un proxy sidecar (Envoy pour Istio, micro-proxy pour Linkerd) dans chaque pod. Le mesh gère trois choses sans modification de code applicatif :

1. **Gestion du trafic** — retries, circuit breaking, traffic splitting pour déploiements canary
2. **mTLS automatique** — tout trafic pod-à-pod chiffré et authentifié par certificats gérés par le control plane du mesh
3. **Observabilité du mesh** — request traces (Jaeger/Zipkin), golden signal metrics (request rate, error rate, latency), et topology maps

Traffic split Istio pour canary :

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

Choisissez **Linkerd** plutôt qu'Istio pour la simplicité si vous n'avez pas besoin de fonctionnalités avancées de gestion du trafic — Linkerd a un control plane significativement plus petit et une surcharge de ressources plus faible.

## Exemple

Conception du réseau AWS pour une application e-commerce à 3 niveaux :

1. VPC `10.0.0.0/16` sur 3 AZs. Public subnets (`/24` chacun) pour ALB et NAT gateways. Private subnets pour tâches ECS Fargate. Isolated subnets pour RDS sans route internet.
2. Security groups : ALB accepte 443 de `0.0.0.0/0`, forward vers ECS sur port 8080. ECS autorise 8080 d'ALB uniquement, egress vers RDS sur 5432. RDS autorise 5432 d'ECS uniquement.
3. ALB avec listener HTTPS, certificat ACM, et redirection HTTP→HTTPS. Target group avec health check `/health`, `deregistration_delay=30`.
4. Zone publique Route 53 `api.example.com` avec health check HTTPS et failover actif/passif vers ALB de région secondaire. Zone privée `api.internal.example.com` pour appels service-à-service se résolvant en IPs privées.
5. Service mesh Istio avec mTLS appliqué sur toutes les tâches ECS. VirtualService configurée pour déploiements canary avec split de trafic à 10%.

---

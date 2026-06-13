# Diseño de Red

## Cuándo activar
Diseñar arquitectura de red en la nube desde cero, planificar rangos CIDR de VPC y diseños de subredes, implementar principios de red zero-trust, seleccionar y configurar load balancers (ALB/NLB/GWLB), diseñar implementaciones de service mesh (Istio o Linkerd), configurar Route 53 DNS con health checks, o revisar arquitectura de red existente para brechas de seguridad y rendimiento.

## Cuándo no usar
Diseño de redes locales (herramientas y restricciones diferentes). Aplicaciones simples de un solo nivel donde un VPC predeterminado y un grupo de seguridad son suficientes. Configuración de API gateway a nivel de aplicación que no implique topología de red. Configuración de CDN no vinculada al enrutamiento o arquitectura de DNS.

## Instrucciones

### Arquitectura VPC de 3 Niveles

El diseño estándar de 3 niveles separa ingress, compute y datos en zonas de red distintas sin ruta directa de internet a datos:

```
VPC: 10.0.0.0/16

Public subnets (load balancers que enfrentan internet, NAT gateways):
  10.0.0.0/24  — AZ-a
  10.0.1.0/24  — AZ-b
  10.0.2.0/24  — AZ-c

Private subnets (servidores de aplicaciones, tareas de ECS, Lambda):
  10.0.10.0/24 — AZ-a
  10.0.11.0/24 — AZ-b
  10.0.12.0/24 — AZ-c

Isolated subnets (bases de datos, Elasticache — sin ruta de internet):
  10.0.20.0/24 — AZ-a
  10.0.21.0/24 — AZ-b
  10.0.22.0/24 — AZ-c
```

Módulo VPC de Terraform:

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

Planifique rangos CIDR para permitir peering de VPC futuro sin superposición. Use rangos RFC 1918 y documente asignaciones. Una VPC `/16` proporciona 65.536 direcciones — más que suficiente para la mayoría de cargas de trabajo. Reserve `10.1.0.0/16` y `10.2.0.0/16` para VPC adicionales en una configuración de múltiples cuentas.

### Principios de Zero-Trust

Zero trust significa: no hay confianza implícita basada en la ubicación de la red. Cada solicitud se autentica, autoriza y cifra independientemente de la fuente.

Tres pilares de implementación:

1. **Verificar cada solicitud** — todas las llamadas de servicio a servicio requieren una identidad válida (certificado mTLS o JWT). La proximidad de red no es prueba de legitimidad.
2. **Microsegmentación** — los grupos de seguridad restringen el tráfico a nivel de recursos, no a nivel de subred. Un servidor de aplicación comprometido no puede alcanzar la base de datos si ninguna regla de grupo de seguridad lo permite.
3. **Principio de menor privilegio** — roles de IAM limitados a las acciones mínimas requeridas. Sin acciones `*`. Sin recursos `*` excepto donde sea inevitable (p.ej., creación de registros de CloudWatch).

### Grupos de Seguridad

Comience con deny-all, abra solo puertos nombrados de fuentes nombradas. Nunca use `0.0.0.0/0` en reglas de ingress excepto para el load balancer que enfrenta público:

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

### Selección de Load Balancer

| Load Balancer | Capa | Usar Cuando |
|---|---|---|
| ALB | L7 (HTTP/HTTPS) | Tráfico web/API estándar. Enrutamiento de host/ruta, WebSocket, gRPC, descarga de autenticación OIDC. |
| NLB | L4 (TCP/UDP) | Latencia ultra baja, IPs estáticas, protocolos no HTTP (MQTT, streaming gRPC, juegos). |
| GWLB | L3 (IP) | Inserción transparente de dispositivos virtuales de terceros (firewalls, IDS/IPS). |

Grupo de destino ALB con health check:

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

### Route 53: DNS Split-Horizon, Health Checks, Failover

Split-horizon: los recursos internos se resuelven en IPs privadas, los externos en IPs públicas:

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

Health checks y enrutamiento de failover para activo/pasivo multi-región:

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

### Service Mesh: Patrón Sidecar

Un service mesh inyecta un proxy sidecar (Envoy para Istio, micro-proxy para Linkerd) en cada pod. El mesh maneja tres cosas sin cambios de código de aplicación:

1. **Gestión de tráfico** — reintentos, circuit breaking, división de tráfico para implementaciones canary
2. **mTLS automático** — todo el tráfico pod-a-pod cifrado y autenticado por certificados gestionados por el control plane del mesh
3. **Observabilidad desde mesh** — request traces (Jaeger/Zipkin), métricas golden signal (request rate, error rate, latency), y mapas de topología

Split de tráfico Istio para canary:

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

Elija **Linkerd** sobre Istio para simplicidad si no necesita características avanzadas de gestión de tráfico — Linkerd tiene un control plane significativamente más pequeño y una sobrecarga de recursos más baja.

## Ejemplo

Diseñe red AWS para una aplicación de e-commerce de 3 niveles:

1. VPC `10.0.0.0/16` en 3 AZs. Subnets públicos (`/24` cada uno) para ALB y NAT gateways. Subnets privados para tareas de ECS Fargate. Subnets aislados para RDS sin ruta de internet.
2. Grupos de seguridad: ALB acepta 443 de `0.0.0.0/0`, reenvía a ECS en puerto 8080. ECS permite 8080 solo desde ALB, egress a RDS en 5432. RDS permite 5432 solo desde ECS.
3. ALB con escucha HTTPS, certificado ACM, y redirección HTTP→HTTPS. Grupo de destino con health check `/health`, `deregistration_delay=30`.
4. Zone pública Route 53 `api.example.com` con health check HTTPS y failover activo/pasivo a ALB de región secundaria. Zone privada `api.internal.example.com` para llamadas de servicio a servicio que se resuelven en IPs privadas.
5. Service mesh Istio con mTLS aplicado en todas las tareas de ECS. VirtualService configurada para implementaciones canary con split de tráfico del 10%.

---

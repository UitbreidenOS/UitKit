# Cloud Provisioning Skill

## When to activate

When provisioning cloud infrastructure (AWS, GCP, Azure) from scratch, designing network topologies, setting up databases, managing security groups, or building multi-region deployments using IaC.

## When NOT to use

For exploring cloud consoles or one-off testing; always code infrastructure with Terraform or CloudFormation.

## Instructions

### Cloud Architecture Design

Every cloud deployment must include:

1. **Network Architecture:**
   - VPC/vNet with public and private subnets across multiple availability zones
   - NAT gateways for private subnet egress
   - Internet gateways for public subnet ingress
   - Route tables for traffic routing
   - Security groups as stateful firewalls

2. **Compute Strategy:**
   - Containerized workloads via ECS/AKS/GKE
   - Managed Kubernetes for scalability
   - Auto-scaling groups or node pools for dynamic capacity
   - Instance type selection based on workload profile (CPU, memory, network)

3. **Data Layer:**
   - RDS/Cloud SQL for transactional databases (HA with multi-AZ)
   - S3/GCS for object storage (versioning, lifecycle policies)
   - DynamoDB/Firestore for NoSQL (on-demand or provisioned)
   - ElastiCache/Memorystore for caching

4. **Security:**
   - IAM roles with least privilege policies
   - Encryption at rest (KMS/Cloud KMS/Key Vault)
   - Encryption in transit (TLS/mTLS)
   - VPC endpoints for AWS service access without internet exposure
   - Network policies and security group rules

5. **Observability:**
   - CloudWatch/Cloud Logging for centralized logging
   - Prometheus/Cloud Monitoring for metrics
   - X-Ray/Cloud Trace for distributed tracing
   - Alerting policies for critical thresholds

### AWS VPC Template

```hcl
# AWS VPC with public and private subnets across 3 AZs

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "production-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway   = true
  single_nat_gateway   = false  # One NAT per AZ for resilience
  enable_vpn_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  enable_flow_logs                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true
  
  tags = {
    environment = "production"
    owner       = "platform-team"
  }
}

# Security group for web tier
resource "aws_security_group" "alb" {
  name        = "alb-sg"
  description = "Security group for application load balancer"
  vpc_id      = module.vpc.vpc_id
  
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
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "alb-sg"
  }
}

# Security group for application tier
resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Security group for application servers"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "app-sg"
  }
}

# Security group for database tier
resource "aws_security_group" "database" {
  name        = "database-sg"
  description = "Security group for RDS databases"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "database-sg"
  }
}
```

### AWS RDS Template (High Availability)

```hcl
# High-availability RDS with automated backups and encryption

resource "aws_db_subnet_group" "main" {
  name       = "main-db-subnet-group"
  subnet_ids = module.vpc.database_subnets
  
  tags = {
    Name = "main-db-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  identifier     = "production-postgres"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn
  
  db_name  = "productiondb"
  username = "postgres"
  password = random_password.db_password.result
  
  db_subnet_group_name            = aws_db_subnet_group.main.name
  vpc_security_group_ids          = [aws_security_group.database.id]
  parameter_group_name            = aws_db_parameter_group.main.name
  publicly_accessible             = false
  
  multi_az               = true
  backup_retention_period = 30
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"
  
  enable_cloudwatch_logs_exports = ["postgresql"]
  enable_iam_database_authentication = true
  deletion_protection     = true
  skip_final_snapshot     = false
  final_snapshot_identifier = "production-postgres-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = {
    Name        = "production-postgres"
    environment = "production"
  }
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "rds/production-postgres/password"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}
```

### GCP Cloud SQL Template

```hcl
# GCP Cloud SQL with automated backups and private IP

resource "google_sql_database_instance" "main" {
  name             = "production-postgres"
  database_version = "POSTGRES_15"
  region           = "us-central1"
  
  settings {
    tier              = "db-custom-4-16384"
    availability_type = "REGIONAL"  # HA with automatic failover
    disk_type         = "PD_SSD"
    disk_size         = 100
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
      require_ssl     = true
    }
    
    database_flags {
      name  = "cloudsql_iam_authentication"
      value = "on"
    }
    
    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
    }
    
    deletion_protection_enabled = true
    
    user_labels = {
      environment = "production"
      owner       = "platform-team"
    }
  }
}

resource "google_sql_database" "main" {
  name     = "productiondb"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "main" {
  name     = "postgres"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}
```

### Azure Virtual Network Template

```hcl
# Azure VNet with subnets and Network Security Groups

resource "azurerm_resource_group" "main" {
  name     = "rg-production"
  location = "East US"
  
  tags = {
    environment = "production"
    owner       = "platform-team"
  }
}

resource "azurerm_virtual_network" "main" {
  name                = "vnet-production"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    environment = "production"
  }
}

resource "azurerm_subnet" "app" {
  name                 = "subnet-app"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
  
  service_endpoints = ["Microsoft.Sql", "Microsoft.Storage", "Microsoft.KeyVault"]
}

resource "azurerm_network_security_group" "app" {
  name                = "nsg-app"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  tags = {
    environment = "production"
  }
}
```

## Example

**Scenario:** Provision production AWS infrastructure for a microservices platform: VPC with public/private subnets, ALB, RDS database, and ECS cluster.

**Solution:**

1. **VPC design:** 3 public subnets (ALB), 3 private subnets (app), 3 private subnets (database), 1 NAT per AZ

2. **Security groups:**
   - ALB SG: Allow HTTPS (443) from 0.0.0.0/0
   - App SG: Allow 8080 from ALB SG only
   - Database SG: Allow 5432 from App SG only

3. **RDS instance:** Multi-AZ PostgreSQL with encrypted storage, automated backups (30-day retention), IAM authentication, deletion protection

4. **Monitoring:** VPC Flow Logs, CloudWatch metrics, RDS Enhanced Monitoring, X-Ray tracing

5. **Deployment:**
   - Terraform: 5 modules (VPC, security groups, RDS, KMS, monitoring)
   - Plan review: Security validation, cost estimation
   - Deploy: Terraform apply with approval gate
   - Verify: Run integration tests, monitor logs, validate health checks

This design provides:
- High availability across 3 AZs
- Security isolation via security groups and VPC design
- Automated backups and disaster recovery
- Centralized logging and monitoring
- Cost optimization through resource tagging and right-sizing

# Provision Cloud Command

## When to activate

When provisioning cloud infrastructure (AWS, GCP, Azure) from scratch, designing network architectures, deploying managed services, or scaling cloud deployments with IaC.

## When NOT to use

For infrastructure changes via cloud consoles; always use Terraform or CloudFormation stored in version control.

## Instructions

### Cloud Provisioning Process

```
/provision-cloud --provider <aws|gcp|azure> --region <region> --environment <dev|staging|prod> --service <vpc|kubernetes|database|all>
```

This command generates IaC for cloud infrastructure:

1. **VPC/Network Design:**
   - Multiple availability zones for high availability
   - Public subnets for load balancers and NAT gateways
   - Private subnets for application servers and databases
   - Route tables and network ACLs for traffic control

2. **Compute Layer:**
   - Auto Scaling Groups or Node Pools for dynamic capacity
   - Instance type selection based on workload (CPU, memory, network)
   - Launch templates with security hardening
   - Monitoring and auto-healing

3. **Data Layer:**
   - Managed databases (RDS, Cloud SQL, Azure Database)
   - Multi-AZ for high availability
   - Automated backups and point-in-time recovery
   - Encryption at rest and in transit

4. **Security:**
   - IAM roles with least-privilege policies
   - Security groups and network policies
   - KMS/Cloud KMS encryption keys
   - VPC endpoints to avoid internet exposure

5. **Observability:**
   - Centralized logging (CloudWatch, Stackdriver, Monitor)
   - Metrics collection and alerting
   - Distributed tracing
   - Cost monitoring

### AWS Provisioning Example

```hcl
# AWS VPC with ECS cluster and RDS

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  
  name = "production-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  database_subnets = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]
  
  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_vpn_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    environment = "production"
  }
}

module "ecs_cluster" {
  source = "terraform-aws-modules/ecs/aws//modules/cluster"
  version = "~> 5.0"
  
  cluster_name = "production-cluster"
  
  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/ecs/production-cluster"
      }
    }
  }
  
  tags = {
    environment = "production"
  }
}

module "ecs_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"
  version = "~> 5.0"
  
  name        = "api-service"
  cluster_arn = module.ecs_cluster.arn
  
  cpu    = 256
  memory = 512
  
  container_name  = "api"
  container_image = "myregistry/api:1.0.0"
  container_port  = 8080
  
  service_registries = [{
    registry_arn = aws_service_discovery_service.api.arn
  }]
  
  desired_count = 3
  
  deployment_configuration = {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }
  
  network_configuration = {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  
  tags = {
    environment = "production"
  }
}

module "rds" {
  source = "terraform-aws-modules/rds/aws"
  version = "~> 5.0"
  
  identifier = "production-postgres"
  
  engine               = "postgres"
  engine_version       = "15.3"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = "db.t3.medium"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_encrypted     = true
  
  db_name  = "productiondb"
  username = "postgres"
  password = random_password.db.result
  
  multi_az               = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 30
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  deletion_protection             = true
  
  skip_final_snapshot       = false
  final_snapshot_identifier = "production-postgres-final-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = {
    environment = "production"
  }
}

resource "random_password" "db" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "rds/production-postgres/password"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db.result
}
```

### GCP Provisioning Example

```hcl
# GCP VPC with Cloud Run and Cloud SQL

resource "google_compute_network" "main" {
  name                    = "production-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "app" {
  name          = "app-subnet"
  ip_cidr_range = "10.0.0.0/20"
  region        = "us-central1"
  network       = google_compute_network.main.id
  
  private_ip_google_access = true
}

resource "google_compute_subnetwork" "database" {
  name          = "database-subnet"
  ip_cidr_range = "10.1.0.0/20"
  region        = "us-central1"
  network       = google_compute_network.main.id
  
  private_ip_google_access = true
}

resource "google_cloud_run_service" "api" {
  name     = "api-service"
  location = "us-central1"
  
  template {
    spec {
      service_account_name = google_service_account.api.email
      
      containers {
        image = "gcr.io/my-project/api:1.0.0"
        
        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
        
        env {
          name  = "LOG_LEVEL"
          value = "INFO"
        }
        
        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_url.id
              key  = "latest"
            }
          }
        }
      }
      
      timeout_seconds = 300
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "100"
        "autoscaling.knative.dev/minScale" = "3"
      }
    }
  }
  
  traffic {
    percent          = 100
    latest_revision  = true
  }
}

resource "google_sql_database_instance" "main" {
  name             = "production-postgres"
  database_version = "POSTGRES_15"
  region           = "us-central1"
  
  settings {
    tier              = "db-custom-4-16384"
    availability_type = "REGIONAL"
    disk_type         = "PD_SSD"
    disk_size         = 100
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
      require_ssl     = true
    }
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
    }
    
    insights_config {
      query_insights_enabled = true
    }
    
    deletion_protection_enabled = true
  }
}

resource "google_secret_manager_secret" "db_url" {
  secret_id = "database-url"
  
  replication {
    automatic = true
  }
}
```

### Azure Provisioning Example

```hcl
# Azure Resource Group with App Service and Database

resource "azurerm_resource_group" "main" {
  name     = "rg-production"
  location = "East US"
  
  tags = {
    environment = "production"
  }
}

resource "azurerm_virtual_network" "main" {
  name                = "vnet-production"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "app" {
  name                 = "subnet-app"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
  
  service_endpoints = ["Microsoft.Sql", "Microsoft.Storage"]
}

resource "azurerm_app_service_plan" "main" {
  name                = "asp-production"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  kind     = "Linux"
  reserved = true
  
  sku {
    tier = "PremiumV2"
    size = "P1v2"
  }
}

resource "azurerm_app_service" "api" {
  name                = "api-production"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  app_service_plan_id = azurerm_app_service_plan.main.id
  
  site_config {
    linux_fx_version = "DOCKER|myregistry.azurecr.io/api:1.0.0"
    min_tls_version  = "1.2"
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  tags = {
    environment = "production"
  }
}

resource "azurerm_postgresql_server" "main" {
  name                = "postgres-production"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  administrator_login              = "postgres"
  administrator_login_password     = random_password.db.result
  
  sku_name   = "B_Gen5_2"
  version    = "11"
  storage_mb = 102400
  
  backup_retention_days             = 30
  geo_redundant_backup_enabled      = true
  public_network_access_enabled     = false
  ssl_enforcement_enabled           = true
  
  tags = {
    environment = "production"
  }
}

resource "azurerm_postgresql_database" "main" {
  name                = "productiondb"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_postgresql_server.main.name
  charset             = "UTF8"
  collation           = "en_US.utf8"
}
```

## Pre-Deployment Checklist

- [ ] Network design reviewed (CIDR ranges, subnets, routing)
- [ ] Compute capacity planned (instance types, auto-scaling)
- [ ] Database HA configured (multi-AZ, backups, encryption)
- [ ] Security groups restrict traffic appropriately
- [ ] IAM roles follow least-privilege principle
- [ ] Encryption configured (at rest and in transit)
- [ ] Monitoring and alerting set up
- [ ] Cost estimation reviewed and approved
- [ ] Disaster recovery plan documented
- [ ] OPA policies pass validation

## Deployment Workflow

1. Run `/design-terraform` to plan architecture
2. Implement IaC with cloud-specific modules
3. Run `/test-infrastructure` to validate
4. Push to Git with Terraform plan artifacts
5. Code review: architecture, security, cost
6. Approval from infrastructure team
7. Deploy: `terraform apply -auto-approve`
8. Verify: health checks, monitoring, alerts active
9. Document: RTO/RPO, failover procedures, runbooks

## Next Steps

1. Use this command to generate infrastructure code
2. Review generated Terraform for your cloud provider
3. Customize for your specific requirements
4. Validate with `/test-infrastructure`
5. Deploy through GitOps pipeline with approvals

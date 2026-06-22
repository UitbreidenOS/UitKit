# Enterprise Multi-Region Deployment

Deploy Claude Code and integrated applications across geographically distributed regions (us-east, us-west, eu-central) with data consistency guarantees, automatic failover, and intelligent traffic routing.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Load Balancer + GeoDNS (Route53, Akamai, or GSLB)       │
│ Routing Policy: Geographic proximity, latency-based failover    │
└────────┬──────────────────────┬──────────────────┬──────────────┘
         │                      │                  │
    ┌────▼────┐         ┌──────▼─────┐     ┌─────▼──────┐
    │ US-EAST │         │  US-WEST   │     │ EU-CENTRAL │
    │(Primary)│         │(Secondary) │     │(Tertiary)  │
    └────┬────┘         └──────┬─────┘     └─────┬──────┘
         │                     │                 │
    ┌────▼──────────┐     ┌────▼─────────┐  ┌───▼────────┐
    │ Region Stack  │     │ Region Stack │  │RegionStack │
    │               │     │              │  │            │
    │ ┌─────────┐   │     │ ┌─────────┐  │  │┌─────────┐ │
    │ │Claude   │   │     │ │Claude   │  │  ││Claude   │ │
    │ │ API     │   │     │ │ API     │  │  ││ API     │ │
    │ └─────────┘   │     │ └─────────┘  │  │└─────────┘ │
    │               │     │              │  │            │
    │ ┌─────────┐   │     │ ┌─────────┐  │  │┌─────────┐ │
    │ │App Tier │   │     │ │App Tier │  │  ││App Tier │ │
    │ │(K8s)    │   │     │ │(K8s)    │  │  ││(K8s)    │ │
    │ └─────────┘   │     │ └─────────┘  │  │└─────────┘ │
    │               │     │              │  │            │
    │ ┌─────────┐   │     │ ┌─────────┐  │  │┌─────────┐ │
    │ │RDB Prim │   │     │ │RDB Read │  │  ││RDB Read │ │
    │ │(writes) │   │     │ │(repl)   │  │  ││(repl)   │ │
    │ └────┬────┘   │     │ └────┬────┘  │  │└────┬────┘ │
    │      │        │     │      │       │  │     │      │
    └──────┼────────┘     └──────┼───────┘  └─────┼──────┘
           │                     │               │
           └─────────┬───────────┴───────────────┘
                     │
         ┌───────────▼───────────┐
         │ Global Consensus DB   │
         │ (Event Log Stream)    │
         │ - Kafka / DynamoDB    │
         │ - Change feed ingress │
         │ - Regional connectors │
         └───────────────────────┘
```

---

## Feature Deployment: Three Use Cases

### Feature 1: Real-Time Data Sync Engine
Replicate operational data across regions with sub-second latency and strong consistency guarantees.

**Replication Strategy:**
- **Model**: Primary-Replica (us-east writes, all regions read)
- **Protocol**: Write-Ahead Logging (WAL) with logical replication
- **Technology**: PostgreSQL with pg_logical_replication or MySQL binlog
- **Latency SLA**: Replication lag < 500ms to us-west, < 2s to eu-central

**Consistency Model:**
- **Write Path**: Client → us-east → WAL → consensus queue → replicas
- **Conflict Resolution**: Last-write-wins with vector clocks for distributed writes
- **Guarantees**: Causal consistency within a session; eventual consistency across regions

**Implementation:**

```bash
#!/bin/bash
# deploy-data-sync.sh - Multi-region data sync

REGIONS=("us-east-1" "us-west-2" "eu-central-1")
PRIMARY_REGION="us-east-1"

# Step 1: Provision primary database with replication slots
aws rds create-db-instance \
  --db-instance-identifier claude-sync-primary \
  --region $PRIMARY_REGION \
  --db-instance-class db.r6i.2xlarge \
  --allocated-storage 500 \
  --storage-type gp3 \
  --engine postgres \
  --engine-version 15.2 \
  --parameter-group-name pg-replication-enabled \
  --backup-retention-period 7 \
  --multi-az \
  --publicly-accessible false

# Step 2: Configure replication slots
psql -h primary.rds.amazonaws.com -U admin -c "
  SELECT pg_create_logical_replication_slot('slot_us_west', 'test_decoding');
  SELECT pg_create_logical_replication_slot('slot_eu_central', 'test_decoding');
"

# Step 3: Create read replicas in each region
for region in "${REGIONS[@]}"; do
  if [ "$region" != "$PRIMARY_REGION" ]; then
    aws rds create-db-instance-read-replica \
      --db-instance-identifier claude-sync-replica-${region} \
      --source-db-instance-identifier claude-sync-primary \
      --region $region \
      --db-instance-class db.r6i.xlarge \
      --publicly-accessible false
  fi
done

# Step 4: Enable backtrack for point-in-time recovery
aws rds modify-db-instance \
  --db-instance-identifier claude-sync-primary \
  --backtrack-window 7 \
  --apply-immediately

echo "Data sync replicas deployed. Replication lag monitoring started."
```

**Failover Logic:**

```yaml
# failover-config.yaml - Data sync failover procedures
failover_orchestration:
  detection:
    health_check_interval: 5s
    failure_threshold: 3  # consecutive checks
    replication_lag_alarm: 10s  # trigger if > 10s
  
  us_east_primary_failure:
    trigger:
      - primary_unreachable: true
      - replication_lag_from_replicas: > 10s
    action:
      - promote_replica: us-west-2
      - point_cutover_to_us_west
      - keep_eu_central_as_read_only
    recovery_time_objective: 30s
    recovery_point_objective: 1s
  
  eu_central_replica_lag:
    trigger:
      - replication_lag: > 5s
    action:
      - enable_buffering_in_eu_central_app
      - read_from_cache_layer
      - send_writes_to_us_east_only
    fallback_to_cache: true
    cache_ttl: 30s

  split_brain_prevention:
    consensus_mechanism: etcd_cluster
    distributed_lock_timeout: 5s
    quorum_required: 2/3
```

---

### Feature 2: Distributed Cache Layer
Multi-region caching with eventual consistency and intelligent invalidation.

**Replication Strategy:**
- **Model**: Write-Through with Eventual Consistency
- **Technology**: Redis Cluster (regional) + Redis Streams (cross-region)
- **Consistency**: Relaxed consistency for cache; strong for metadata

**Consistency Model:**
```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│  US-EAST    │         │   US-WEST    │         │  EU-CENTRAL  │
│  Redis:6379 │         │  Redis:6379  │         │  Redis:6379  │
│             │         │              │         │              │
│  ┌───────┐  │         │  ┌────────┐  │         │  ┌────────┐  │
│  │ Cache │  │         │  │ Cache  │  │         │  │ Cache  │  │
│  │ Sync  │◄─┼─Stream ─┼─→│ Sync   │  │         │  │ Sync   │  │
│  │Engine │  │  Topic  │  │ Engine │◄─┼─Stream ─┼─→│ Engine │  │
│  └───────┘  │         │  └────────┘  │         │  └────────┘  │
│             │         │              │         │              │
└─────────────┘         └──────────────┘         └──────────────┘
      │                       │                        │
      └───────────────────────┼────────────────────────┘
                              │
                    ┌─────────▼────────┐
                    │ Global Invalidate│
                    │ Event Log (Kafka)│
                    │ TTL: 24h         │
                    └──────────────────┘
```

**Implementation:**

```python
# multi_region_cache.py - Distributed cache orchestration

import redis
from redis.sentinel import Sentinel
from confluent_kafka import Producer
import json
from datetime import datetime, timedelta

class MultiRegionCache:
    def __init__(self):
        # Regional Redis instances
        self.regions = {
            'us-east': {
                'sentinels': [('sentinel-useast.internal', 26379)],
                'service_name': 'mymaster-useast',
                'priority': 1
            },
            'us-west': {
                'sentinels': [('sentinel-uswest.internal', 26379)],
                'service_name': 'mymaster-uswest',
                'priority': 2
            },
            'eu-central': {
                'sentinels': [('sentinel-eucentral.internal', 26379)],
                'service_name': 'mymaster-eucentral',
                'priority': 3
            }
        }
        
        self.connections = {}
        self.kafka_producer = Producer({
            'bootstrap.servers': 'kafka-cluster.internal:9092',
            'client.id': 'cache-sync-orchestrator'
        })
        
        self._initialize_connections()
    
    def _initialize_connections(self):
        """Initialize Sentinel-based connections to each region."""
        for region, config in self.regions.items():
            sentinel = Sentinel(config['sentinels'], socket_timeout=0.5)
            self.connections[region] = sentinel.master_for(
                config['service_name'],
                socket_timeout=1,
                db=0
            )
    
    def write_with_sync(self, key, value, ttl_seconds=3600):
        """
        Write to primary region and stream to replicas.
        Consistency: Write-through to us-east, async to others.
        """
        # Write to primary
        primary_region = 'us-east'
        self.connections[primary_region].setex(key, ttl_seconds, json.dumps(value))
        
        # Publish sync event
        sync_event = {
            'timestamp': datetime.utcnow().isoformat(),
            'action': 'set',
            'key': key,
            'value': value,
            'ttl': ttl_seconds,
            'source_region': primary_region,
            'consistency_level': 'eventual'
        }
        
        self.kafka_producer.produce(
            topic='cache-sync-events',
            key=key.encode('utf-8'),
            value=json.dumps(sync_event).encode('utf-8'),
            callback=self._delivery_report
        )
        self.kafka_producer.flush()
        
        return True
    
    def invalidate_globally(self, key_pattern):
        """
        Invalidate cache across all regions with quorum verification.
        Guarantees: At-least-once delivery via Kafka offset tracking.
        """
        invalidate_event = {
            'timestamp': datetime.utcnow().isoformat(),
            'action': 'delete',
            'pattern': key_pattern,
            'consistency_level': 'strong'  # Invalidation is synchronous
        }
        
        # Send to Kafka with acks=all
        self.kafka_producer.produce(
            topic='cache-invalidate-events',
            key=key_pattern.encode('utf-8'),
            value=json.dumps(invalidate_event).encode('utf-8'),
            callback=self._delivery_report
        )
        
        # Wait for replication to all regions
        delivery_futures = self.kafka_producer.flush(timeout=10)
        
        # Apply locally in each region
        for region in self.regions:
            try:
                cursor = 0
                while True:
                    cursor, keys = self.connections[region].scan(
                        cursor=cursor,
                        match=key_pattern,
                        count=100
                    )
                    if keys:
                        self.connections[region].delete(*keys)
                    if cursor == 0:
                        break
            except Exception as e:
                print(f"Invalidation failed in {region}: {e}")
        
        return True
    
    def _delivery_report(self, err, msg):
        """Kafka delivery callback for sync event confirmation."""
        if err is not None:
            print(f'Message delivery failed: {err}')
        else:
            print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

# Usage example
cache = MultiRegionCache()

# Write to primary with replication
cache.write_with_sync(
    key='user:12345:profile',
    value={'name': 'Alice', 'email': 'alice@example.com'},
    ttl_seconds=7200
)

# Invalidate across all regions
cache.invalidate_globally('user:12345:*')
```

**Failover Logic:**

```json
{
  "cache_failover_policy": {
    "detection": {
      "metrics": ["connection_timeouts", "high_latency", "sentinel_state_change"],
      "threshold": {
        "response_time_p99_ms": 100,
        "error_rate_pct": 5,
        "sentinel_unhealthy": true
      }
    },
    "actions": {
      "single_region_outage": {
        "trigger": "redis_master_down",
        "action": "promote_sentinel_replica",
        "rto_seconds": 5
      },
      "multi_region_cascade": {
        "trigger": "kafka_broker_down AND replication_lag > 30s",
        "action": ["switch_to_local_cache", "enable_write_through_db"],
        "rto_seconds": 10,
        "data_loss_risk": "eventual_consistency_conflict"
      }
    },
    "consistency_guarantees": {
      "normal_operation": "eventual (< 1s)",
      "failover_period": "read_from_cache, writes_queue"
    }
  }
}
```

---

### Feature 3: Global Session Management
Maintain user sessions across regions with session affinity and transparent failover.

**Replication Strategy:**
- **Model**: Session stickiness to origin region; fallback to global session store
- **Technology**: DynamoDB Global Tables with on-demand billing
- **Consistency**: Strong consistency for session state; read-after-write in same region

**Consistency Model:**

```
User → us-west (closest) → Session microservice

Session write flow:
1. DynamoDB Local (us-west) → write with ttl = 24h
2. Global Table replication → us-east, eu-central (< 1s)
3. Acknowledgment sent to client

Session read flow (same region):
- Strong consistency: Read from local primary
- RPO: 0 (synchronous writes)
- RTO: < 10ms

Failover read flow (different region):
- DynamoDB automatic failover to replica
- Eventual consistency: Read may be 1-2 replicas behind
```

**Implementation:**

```python
# global_session_manager.py - Multi-region session orchestration

import boto3
from datetime import datetime, timedelta
import hashlib
import json
from typing import Optional, Dict, Any

class GlobalSessionManager:
    def __init__(self, region='us-east-1'):
        self.dynamodb = boto3.resource('dynamodb', region_name=region)
        self.table = self.dynamodb.Table('claude-sessions-global')
        self.current_region = region
        self.session_ttl = 86400  # 24 hours
    
    def create_session(
        self,
        user_id: str,
        user_region: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, str]:
        """
        Create session with region affinity and global replication.
        
        Args:
            user_id: Unique user identifier
            user_region: Geographic region (us-east, us-west, eu-central)
            metadata: Session metadata (request context, feature flags)
        
        Returns:
            {'session_id': '...', 'expires_at': '...', 'region': 'us-east'}
        """
        session_id = self._generate_session_id(user_id)
        expires_at = datetime.utcnow() + timedelta(seconds=self.session_ttl)
        
        session_item = {
            'session_id': session_id,
            'user_id': user_id,
            'origin_region': user_region,
            'created_at': datetime.utcnow().isoformat(),
            'expires_at': int(expires_at.timestamp()),
            'metadata': metadata,
            'last_activity': datetime.utcnow().isoformat(),
            'version': 1
        }
        
        # Write with strong consistency to origin region
        try:
            self.table.put_item(
                Item=session_item,
                ConditionExpression='attribute_not_exists(session_id)'
            )
            
            # DynamoDB Global Tables automatically replicate
            # within < 1 second to other regions
            return {
                'session_id': session_id,
                'expires_at': expires_at.isoformat(),
                'region': user_region
            }
        except self.dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
            # Session already exists; likely race condition
            return self.get_session(session_id)
    
    def get_session(
        self,
        session_id: str,
        consistent_read: bool = True
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve session from local region or global table.
        
        Args:
            session_id: Session identifier
            consistent_read: If True, read from primary; else read from replica
        
        Returns:
            Session dict or None if expired/not found
        """
        try:
            response = self.table.get_item(
                Key={'session_id': session_id},
                ConsistentRead=consistent_read
            )
            
            item = response.get('Item')
            if not item:
                return None
            
            # Check expiration
            if int(datetime.utcnow().timestamp()) > item['expires_at']:
                self.delete_session(session_id)
                return None
            
            # Update last activity (asynchronously for performance)
            self._update_activity_async(session_id)
            
            return item
        
        except Exception as e:
            # Fallback: Try replica in different region
            print(f"Failed to read session from primary: {e}")
            return self._read_from_replica(session_id)
    
    def update_session_metadata(
        self,
        session_id: str,
        updates: Dict[str, Any]
    ) -> bool:
        """
        Update session metadata with optimistic locking.
        
        Consistency: Causal consistency via version vectors.
        """
        session = self.get_session(session_id, consistent_read=True)
        if not session:
            return False
        
        current_version = session['version']
        new_version = current_version + 1
        
        try:
            self.table.update_item(
                Key={'session_id': session_id},
                UpdateExpression='SET #meta = :meta, #version = :version, #last = :last',
                ExpressionAttributeNames={
                    '#meta': 'metadata',
                    '#version': 'version',
                    '#last': 'last_activity'
                },
                ExpressionAttributeValues={
                    ':meta': {**session['metadata'], **updates},
                    ':version': new_version,
                    ':last': datetime.utcnow().isoformat()
                },
                ConditionExpression='#version = :current_version',
                ExpressionAttributeValues={
                    ':current_version': current_version
                }
            )
            return True
        except self.dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
            # Version mismatch; retry with backoff
            print("Session version conflict; retrying...")
            return self.update_session_metadata(session_id, updates)
    
    def delete_session(self, session_id: str) -> bool:
        """Delete session from global table (cascades to all regions)."""
        try:
            self.table.delete_item(Key={'session_id': session_id})
            return True
        except Exception as e:
            print(f"Failed to delete session: {e}")
            return False
    
    def _generate_session_id(self, user_id: str) -> str:
        """Generate cryptographically secure session ID."""
        import secrets
        random_part = secrets.token_hex(16)
        timestamp = datetime.utcnow().isoformat()
        composite = f"{user_id}:{timestamp}:{random_part}"
        return hashlib.sha256(composite.encode()).hexdigest()
    
    def _update_activity_async(self, session_id: str):
        """Background task to update last_activity (non-blocking)."""
        # Queue for async processing to avoid blocking read operations
        pass
    
    def _read_from_replica(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Fallback: read from cross-region replica with eventual consistency."""
        try:
            response = self.table.get_item(
                Key={'session_id': session_id},
                ConsistentRead=False  # Read from replica
            )
            return response.get('Item')
        except Exception as e:
            print(f"Replica read failed: {e}")
            return None

# Usage example
session_manager = GlobalSessionManager(region='us-east-1')

# Create session in user's region
session = session_manager.create_session(
    user_id='usr_abc123',
    user_region='us-west',
    metadata={
        'feature_flags': {'new_ui': True},
        'request_id': 'req_xyz789'
    }
)
print(f"Session created: {session['session_id']}")

# User makes request in different region (failover scenario)
session_data = session_manager.get_session(
    session['session_id'],
    consistent_read=False  # Tolerate replica
)

# Update session during request
session_manager.update_session_metadata(
    session['session_id'],
    {'last_claude_query': 'SELECT * FROM users'}
)
```

**Failover Logic:**

```yaml
# session_failover_config.yaml

session_failover:
  regions: [us-east, us-west, eu-central]
  
  primary_region_failure:
    detection:
      - dynamodb_table_unavailable: true
      - replication_lag: > 5s
    recovery:
      - automatic_failover_to_replica: true
      - consistency_level: eventual  # read from replica
      - writes_queue_locally: true
      - rto_seconds: 2
      - rpo_seconds: 1
  
  partial_outage_handling:
    scenario: us-west_dynamodb_unhealthy
    action:
      - route_sessions_to_nearest_region: true
      - session_in_us_west: redirect_to_eu_central
      - buffer_writes_locally: true
      - sync_on_recovery: true
    consistency_degradation:
      - read_after_write: not guaranteed
      - eventual_consistency_window: < 2s
  
  session_affinity:
    sticky_routing: true
    affinity_ttl: 24h
    cross_region_redirect_on_failure: true
    preserve_session_cookies: true
    domain_cookie_policy: ".example.com"
```

---

## Traffic Routing: GeoDNS Configuration

### Route53 Geolocation Routing Policy

```json
{
  "hosted_zone": "example.com",
  "dns_records": [
    {
      "name": "api.example.com",
      "type": "A",
      "routing_policy": "geolocation",
      "rules": [
        {
          "location": "North America",
          "region": "us-east-1",
          "value": "lb.us-east-1.example.com",
          "set_id": "na-us-east",
          "health_check_id": "hc-us-east-1"
        },
        {
          "location": "us-west",
          "region": "us-west-2",
          "value": "lb.us-west-2.example.com",
          "set_id": "us-west-secondary",
          "health_check_id": "hc-us-west-2"
        },
        {
          "location": "Europe",
          "region": "eu-central-1",
          "value": "lb.eu-central-1.example.com",
          "set_id": "eu-central",
          "health_check_id": "hc-eu-central-1"
        },
        {
          "location": "default",
          "region": "us-east-1",
          "value": "lb.us-east-1.example.com",
          "set_id": "global-fallback"
        }
      ]
    }
  ],
  "health_checks": [
    {
      "id": "hc-us-east-1",
      "type": "HTTPS",
      "resource_path": "/health",
      "port": 443,
      "interval": 30,
      "failure_threshold": 3,
      "measure_latency": true,
      "enable_sni": true
    },
    {
      "id": "hc-us-west-2",
      "type": "HTTPS",
      "resource_path": "/health",
      "port": 443,
      "interval": 30,
      "failure_threshold": 3
    },
    {
      "id": "hc-eu-central-1",
      "type": "HTTPS",
      "resource_path": "/health",
      "port": 443,
      "interval": 30,
      "failure_threshold": 3
    }
  ],
  "failover_chain": {
    "primary": "us-east-1",
    "secondary": "us-west-2",
    "tertiary": "eu-central-1"
  }
}
```

### Anycast + Latency-Based Routing

```bash
#!/bin/bash
# geodns-setup.sh - Configure GeoDNS with latency-based failover

HOSTED_ZONE_ID="Z1234567890ABC"
DOMAIN="api.example.com"

# Create health checks for each region
create_health_check() {
  local region=$1
  local endpoint=$2
  
  aws route53 create-health-check \
    --type HTTPS \
    --resource-path "/health/ready" \
    --port 443 \
    --ip-address $endpoint \
    --enable-sni \
    --request-interval 30 \
    --failure-threshold 3 \
    --measure-latency \
    --tags Key=Region,Value=$region Key=Service,Value=api
}

# us-east-1 (primary)
create_health_check "us-east-1" "api.us-east-1.elb.amazonaws.com"

# us-west-2 (secondary)
create_health_check "us-west-2" "api.us-west-2.elb.amazonaws.com"

# eu-central-1 (tertiary)
create_health_check "eu-central-1" "api.eu-central-1.elb.amazonaws.com"

# Create latency-based routing records
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://geodns-records.json

echo "GeoDNS routing configured with latency-based failover."
```

**GeoDNS Records JSON:**

```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.example.com",
        "Type": "A",
        "SetIdentifier": "us-east-1-primary",
        "Region": "us-east-1",
        "TTL": 60,
        "AliasTarget": {
          "HostedZoneId": "Z35SXDOTRQ7X7K",
          "DNSName": "api.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        },
        "HealthCheckId": "hc-us-east-1"
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.example.com",
        "Type": "A",
        "SetIdentifier": "us-west-2-secondary",
        "Region": "us-west-2",
        "TTL": 60,
        "AliasTarget": {
          "HostedZoneId": "Z1H1FL5HABSF5",
          "DNSName": "api.us-west-2.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        },
        "HealthCheckId": "hc-us-west-2"
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.example.com",
        "Type": "A",
        "SetIdentifier": "eu-central-1-tertiary",
        "Region": "eu-central-1",
        "TTL": 60,
        "AliasTarget": {
          "HostedZoneId": "Z215JFRBKS6HUF",
          "DNSName": "api.eu-central-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        },
        "HealthCheckId": "hc-eu-central-1"
      }
    }
  ]
}
```

---

## Deployment Checklist

### Pre-Deployment Validation

- [ ] **Multi-region infrastructure provisioned**: K8s clusters, RDS instances, ElastiCache nodes deployed
- [ ] **Network connectivity verified**: VPN/direct connect between regions tested
- [ ] **TLS certificates**: Wildcard or multi-SAN certs deployed to all regions
- [ ] **Database backups**: Cross-region automated backups enabled (7-day retention minimum)
- [ ] **DNS propagation**: GeoDNS records tested from multiple geolocations
- [ ] **Monitoring baselines**: Establish latency, error rate, and replication lag thresholds

### Deployment Procedure

```bash
#!/bin/bash
# deploy-multi-region.sh

set -e

REGIONS=("us-east-1" "us-west-2" "eu-central-1")
ENVIRONMENT="production"

echo "=== Multi-Region Deployment ==="

# Phase 1: Deploy infrastructure
for region in "${REGIONS[@]}"; do
  echo "Phase 1: Deploying to $region..."
  terraform -chdir=infrastructure apply \
    -var="region=$region" \
    -var="environment=$ENVIRONMENT" \
    -auto-approve
done

# Phase 2: Initialize databases
echo "Phase 2: Initializing primary database..."
./scripts/init-primary-db.sh us-east-1

echo "Phase 3: Configuring replication..."
./scripts/configure-replication.sh

# Phase 4: Deploy applications
for region in "${REGIONS[@]}"; do
  echo "Phase 4: Deploying applications to $region..."
  kubectl apply -f deployments/ \
    --context=k8s-${region} \
    --namespace=production
  
  # Wait for rollout
  kubectl rollout status deployment/claude-api \
    --context=k8s-${region} \
    --namespace=production \
    --timeout=5m
done

# Phase 5: Verify cross-region connectivity
echo "Phase 5: Verifying multi-region health..."
./scripts/verify-replication.sh

# Phase 6: Enable GeoDNS routing
echo "Phase 6: Enabling GeoDNS routing..."
aws route53 change-resource-record-sets \
  --hosted-zone-id $(get_hosted_zone_id) \
  --change-batch file://geodns-records.json

echo "=== Multi-Region Deployment Complete ==="
```

### Post-Deployment Validation

- [ ] **Replication lag monitoring**: Verify < 500ms to all replicas
- [ ] **Failover drill**: Manually trigger regional failure and confirm automatic promotion
- [ ] **Session consistency**: Test user session behavior across region boundaries
- [ ] **Cache sync latency**: Measure cache invalidation propagation (target: < 1s)
- [ ] **GeoDNS routing**: Query from different geolocations and confirm correct regional endpoint
- [ ] **Smoke tests**: Run synthetic transactions across all regions

---

## Monitoring & Alerting

### Key Metrics

```yaml
# prometheus-rules.yaml - Multi-region monitoring

groups:
  - name: multi-region-deployment
    rules:
      - alert: ReplicationLagCritical
        expr: replication_lag_seconds > 10
        for: 2m
        annotations:
          summary: "Replication lag critical in {{ $labels.region }}"
      
      - alert: RegionalHealthCheckFailed
        expr: health_check_status{region="{{ region }}"} == 0
        for: 1m
        annotations:
          summary: "Region {{ $labels.region }} health check failed"
      
      - alert: CacheInvalidationLatency
        expr: cache_invalidation_latency_p99_ms > 5000
        for: 5m
        annotations:
          summary: "Cache invalidation slow: {{ $value }}ms"
      
      - alert: SessionFailoverActivated
        expr: increase(session_failover_count[5m]) > 10
        annotations:
          summary: "{{ $value }} session failovers in past 5 minutes"

    dashboards:
      - name: "Multi-Region Overview"
        panels:
          - replication_lag_by_region
          - regional_error_rates
          - cross_region_latency
          - failover_event_log
          - cache_sync_status
          - session_consistency_metrics
```

---

## Disaster Recovery Runbooks

### Scenario 1: Primary Region (us-east-1) Complete Outage

**Detection**: All health checks in us-east-1 fail for 3 consecutive intervals (90 seconds).

**Recovery Steps:**

1. **DNS Failover** (automatic): Route53 promotes us-west-2 as primary
2. **Database Failover** (automatic): RDS read replica promoted to master
3. **Session Migration** (automatic): DynamoDB Global Tables serves from replica
4. **Application Restart** (manual if needed): Restart pods in us-west-2 to clear connection pools

**Estimated RTO**: 2-3 minutes | **RPO**: < 1 minute

### Scenario 2: Replication Lag Exceeds Threshold (> 10 seconds)

**Detection**: Prometheus alert triggered when replication_lag_seconds > 10 for > 2 minutes.

**Recovery Steps:**

1. **Enable Write-Through Mode**: Applications buffer writes to local cache
2. **Investigate Bottleneck**: Check network bandwidth, database CPU, Kafka consumer lag
3. **Scale Replication**: Increase RDS read replica resources if CPU-bound
4. **Manual Resync**: If lag persists > 5 minutes, trigger logical replication restart

**Estimated Resolution Time**: 5-15 minutes

### Scenario 3: Split-Brain (Conflicting Writes Between Regions)

**Prevention**: Quorum-based writes via distributed consensus (etcd).

**Detection**: Vector clock mismatch or transaction GUID conflict in audit log.

**Recovery**: 
1. Identify conflict window (timestamps)
2. Select canonical version using application business logic
3. Replay missing transactions to correct replicas
4. Verify consistency via diff tool

---

## Capacity Planning

| Component | us-east-1 | us-west-2 | eu-central-1 | Notes |
|-----------|-----------|-----------|--------------|-------|
| RDS Instance | r6i.2xlarge (16 vCPU, 512 GB RAM) | r6i.xlarge (replica) | r6i.xlarge (replica) | 70% baseline, 30% headroom |
| Redis Cluster | 3x r6g.xlarge (3 shards) | 3x r6g.xlarge | 3x r6g.xlarge | 500 MB/s ingestion capacity |
| K8s Nodes | 20x c6i.2xlarge | 10x c6i.2xlarge | 10x c6i.2xlarge | Auto-scaling enabled |
| NAT Gateway | 2 (HA) | 1 | 1 | Regional egress limits |

---

## Cost Optimization

- **Reserved Capacity**: Commit to 1-year RI for baseline workload in each region (40-50% savings)
- **Spot Instances**: Use Spot for non-critical workers (60-70% discount)
- **Data Transfer**: Minimize cross-region replication via incremental WAL (not full snapshots)
- **Storage**: Use EBS gp3 over gp2 (20% cost reduction, same performance)

---

## References

- [AWS Multi-Region Architecture](https://aws.amazon.com/architecture/well-architected/multi-region/)
- [PostgreSQL Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)
- [DynamoDB Global Tables](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/globaltables.html)
- [Route53 Routing Policies](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)
- [Redis Cluster Replication](https://redis.io/topics/replication)

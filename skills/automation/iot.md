---
name: iot
updated: 2026-06-13
---

# IoT Development

## When to activate
Connecting IoT devices to cloud infrastructure, designing MQTT topic hierarchies, setting up AWS IoT Core or Azure IoT Hub device connectivity, implementing device shadow patterns for configuration push, building OTA firmware update pipelines with staged rollouts, managing device fleets at scale, or deploying edge computing workloads with AWS Greengrass or Azure IoT Edge.

## When NOT to use
General embedded firmware without connectivity requirements (use `embedded.md`). Server-side event processing where the data source is not a physical device (use `kafka.md` for event streaming). Pure mobile app development that happens to communicate with hardware over Bluetooth (that is a mobile skill, not IoT architecture).

## Instructions

### MQTT Topic Hierarchy Design

Design topic hierarchies to be routable, filterable, and ACL-enforceable. Use structured paths that encode device identity and message type:

```
# Telemetry (device → cloud)
device/{device_id}/telemetry
device/{device_id}/telemetry/temperature
device/{device_id}/telemetry/vibration

# Commands (cloud → device)
device/{device_id}/command
device/{device_id}/command/reboot
device/{device_id}/command/config_update

# Fleet-wide topics (broadcast)
fleet/+/status           # + matches single level (one device)
fleet/#/firmware         # # matches any number of levels

# Device lifecycle
device/{device_id}/connected
device/{device_id}/disconnected

# Shadow (AWS IoT Core convention)
$aws/things/{device_id}/shadow/update
$aws/things/{device_id}/shadow/update/accepted
$aws/things/{device_id}/shadow/update/delta
```

Never use deeply nested topics for single-message types — keep it flat enough to subscribe with wildcards efficiently.

### MQTT QoS Levels

| QoS | Guarantee | Use For |
|---|---|---|
| 0 (at most once) | Fire-and-forget, no acknowledgement | High-frequency sensor telemetry where some loss is acceptable |
| 1 (at least once) | Broker stores until PUBACK received | Commands, alerts, any message that must arrive |
| 2 (exactly once) | 4-way handshake, no duplicates | Financial transactions, billing events, actions with side effects |

Default to QoS 1 for commands — exactly-once (QoS 2) adds latency and broker overhead that is rarely justified. Use QoS 0 for telemetry at >10 Hz where occasional loss is acceptable and bandwidth matters.

### AWS IoT Core Architecture

```python
# Device-side: AWS IoT SDK (Python)
import awsiot.greengrasscoreipc
from awscrt import mqtt
from awsiot import mqtt_connection_builder

connection = mqtt_connection_builder.mtls_from_path(
    endpoint="xxxxx.iot.us-east-1.amazonaws.com",
    cert_filepath="/certs/device.crt",
    pri_key_filepath="/certs/device.key",
    ca_filepath="/certs/AmazonRootCA1.pem",
    client_id=DEVICE_ID,
    clean_session=False,
    keep_alive_secs=30,
)

connect_future = connection.connect()
connect_future.result()   # block until connected

# Publish telemetry
payload = json.dumps({
    "device_id": DEVICE_ID,
    "temperature": read_sensor(),
    "timestamp": int(time.time() * 1000),
})
connection.publish(
    topic=f"device/{DEVICE_ID}/telemetry/temperature",
    payload=payload,
    qos=mqtt.QoS.AT_LEAST_ONCE,
)
```

IoT Core Rules Engine — route telemetry to downstream services without a Lambda intermediary for simple transforms:

```json
{
  "sql": "SELECT device_id, temperature, timestamp FROM 'device/+/telemetry/temperature' WHERE temperature > 80",
  "actions": [
    {
      "dynamoDBv2": {
        "roleArn": "arn:aws:iam::123456789012:role/iot-dynamo-role",
        "putItem": {
          "tableName": "TemperatureAlerts"
        }
      }
    },
    {
      "sns": {
        "targetArn": "arn:aws:sns:us-east-1:123456789012:temperature-alerts",
        "roleArn": "arn:aws:iam::123456789012:role/iot-sns-role",
        "messageFormat": "JSON"
      }
    }
  ]
}
```

X.509 certificate provisioning — one cert per device, never share certificates across devices:

```bash
# Create Thing, certificate, and attach policy in one workflow
aws iot create-thing --thing-name "sensor-001"
aws iot create-keys-and-certificate \
  --set-as-active \
  --certificate-pem-outfile device.crt \
  --private-key-outfile device.key

aws iot attach-thing-principal \
  --thing-name "sensor-001" \
  --principal "arn:aws:iot:us-east-1:123456789012:cert/abc123"

aws iot attach-policy \
  --policy-name "SensorPolicy" \
  --target "arn:aws:iot:us-east-1:123456789012:cert/abc123"
```

Least-privilege IoT policy — device can only publish its own telemetry and subscribe to its own commands:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "arn:aws:iot:*:*:client/${iot:Connection.Thing.ThingName}"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "arn:aws:iot:*:*:topic/device/${iot:Thing.ThingName}/telemetry/*"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Subscribe",
      "Resource": "arn:aws:iot:*:*:topicfilter/device/${iot:Thing.ThingName}/command/*"
    },
    {
      "Effect": "Allow",
      "Action": ["iot:Receive"],
      "Resource": "arn:aws:iot:*:*:topic/device/${iot:Thing.ThingName}/command/*"
    }
  ]
}
```

### Device Shadow Pattern

The shadow decouples desired configuration from the device's current state. The cloud sets `desired`, the device applies it and reports back via `reported`. The `delta` topic contains only the keys where desired and reported differ — the device only needs to act on that:

```python
# Device subscribes to delta — only fires when desired != reported
def on_shadow_delta(topic, payload, **kwargs):
    delta = json.loads(payload)["state"]

    if "sampling_interval_ms" in delta:
        set_sampling_interval(delta["sampling_interval_ms"])

    # Report the new state back
    connection.publish(
        topic=f"$aws/things/{DEVICE_ID}/shadow/update",
        payload=json.dumps({
            "state": {
                "reported": {
                    "sampling_interval_ms": delta["sampling_interval_ms"]
                }
            }
        }),
        qos=mqtt.QoS.AT_LEAST_ONCE,
    )

connection.subscribe(
    topic=f"$aws/things/{DEVICE_ID}/shadow/update/delta",
    qos=mqtt.QoS.AT_LEAST_ONCE,
    callback=on_shadow_delta,
)
```

Cloud side — push configuration to a device without knowing if it is online:

```python
import boto3

iot_data = boto3.client("iot-data", region_name="us-east-1")
iot_data.update_thing_shadow(
    thingName="sensor-001",
    payload=json.dumps({
        "state": {
            "desired": {
                "sampling_interval_ms": 5000
            }
        }
    }),
)
# Device receives delta when it connects — even if currently offline
```

### OTA Firmware Update Pipeline

Stage rollouts to limit blast radius — never push to the full fleet at once:

```
Stage 1: 1% of fleet (canary devices)  → monitor error rate for 24h
Stage 2: 10% of fleet                  → monitor for 48h
Stage 3: 50% of fleet                  → monitor for 24h
Stage 4: 100% of fleet
```

Sign firmware before distribution — devices verify signature before flashing:

```python
# Sign with AWS Signer or custom key
import boto3

signer = boto3.client("signer")
response = signer.start_signing_job(
    source={
        "s3": {
            "bucketName": "firmware-bucket",
            "key": f"firmware/v{VERSION}/firmware.bin",
            "version": s3_version,
        }
    },
    destination={"s3": {"bucketName": "firmware-signed"}},
    profileName="iot-signing-profile",
)
```

AWS IoT Jobs for fleet management:

```json
{
  "operation": "firmware_update",
  "firmwareVersion": "2.4.1",
  "firmwareUrl": "https://firmware-signed.s3.amazonaws.com/firmware-v2.4.1.bin",
  "checksum": "sha256:abc123...",
  "rolloutConfig": {
    "maximumPerMinute": 10
  },
  "abortConfig": {
    "criteriaList": [{
      "failureType": "FAILED",
      "action": "CANCEL",
      "thresholdPercentage": 5,
      "minNumberOfExecutedThings": 10
    }]
  }
}
```

`abortConfig` automatically cancels the job if >5% of devices fail after at least 10 have attempted — essential for automatic rollback.

### LoRaWAN for Long-Range Low-Power Devices

Spreading factor trade-off — higher SF = longer range but slower data rate and more airtime:

| SF | Range | Data Rate | Battery Use |
|---|---|---|---|
| SF7 | ~2 km urban | ~5.5 kbps | Lowest |
| SF9 | ~5 km | ~1.8 kbps | Medium |
| SF12 | ~15 km | ~0.3 kbps | Highest |

Use SF7 for dense urban deployments where gateways are close; SF12 for rural/industrial with sparse gateway coverage. LoRaWAN payload max is 51 bytes at SF12 — encode telemetry with Cayenne LPP or custom binary encoding, not JSON.

## Example

Design IoT architecture for 1,000 industrial temperature sensors:

1. **MQTT topic hierarchy**: `device/{device_id}/telemetry/temperature` (QoS 0 at 1 Hz), `device/{device_id}/command` (QoS 1), shadow at `$aws/things/{device_id}/shadow/update`.
2. **AWS IoT Core**: each sensor registered as a Thing with unique X.509 certificate. Least-privilege IoT policy restricts publish/subscribe to own topics only. Rules Engine routes temperature > 85°C alerts to SNS → PagerDuty.
3. **Device shadow**: cloud sets `desired.sampling_interval_ms` when an operator adjusts frequency. Device applies on next connection, reports back via `reported`. No synchronous connection required.
4. **OTA update rollout**: firmware signed with AWS Signer. IoT Job targets group `sensors-canary` (10 devices) first. After 24h with <5% failure rate, expands to `sensors-10pct`, `sensors-50pct`, `sensors-all`. `abortConfig` auto-cancels if failure rate exceeds 5%.
5. **Monitoring**: CloudWatch dashboard shows message ingestion rate, shadow sync latency, and OTA job execution status per stage.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

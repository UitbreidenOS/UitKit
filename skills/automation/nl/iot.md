# IoT Development

## Wanneer activeren
IoT devices verbinden naar cloud infrastructure, ontwerpen van MQTT topic hierarchies, instellen van AWS IoT Core of Azure IoT Hub device connectivity, implementeren van device shadow patronen voor configuration push, bouwen van OTA firmware update pipelines met staged rollouts, managen van device fleets op schaal, of deployen van edge computing workloads met AWS Greengrass of Azure IoT Edge.

## Wanneer NIET gebruiken
Algemene embedded firmware zonder connectivity vereisten (gebruik `embedded.md`). Server-side event processing waarbij data source geen physical device is (gebruik `kafka.md` voor event streaming). Pure mobile app development die happens to communicate met hardware over Bluetooth (dat is mobile skill, niet IoT architecture).

## Instructies

### MQTT Topic Hierarchy Design

Ontwerp topic hierarchies om routable, filterable, en ACL-enforceable te zijn. Gebruik structured paths die device identity en message type encoden:

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

Gebruik nooit diep geneste topics voor single-message types — houd flat genoeg om efficient met wildcards te subscriben.

### MQTT QoS Levels

| QoS | Guarantee | Use For |
|---|---|---|
| 0 (at most once) | Fire-and-forget, no acknowledgement | High-frequency sensor telemetry waar sommige loss acceptable is |
| 1 (at least once) | Broker stores until PUBACK received | Commands, alerts, elke message die moet aankomen |
| 2 (exactly once) | 4-way handshake, no duplicates | Financial transactions, billing events, actions met side effects |

Standaard naar QoS 1 voor commands — exactly-once (QoS 2) voegt latency en broker overhead toe die zelden justified zijn. Gebruik QoS 0 voor telemetry op >10 Hz waarbij occasional loss acceptable is en bandwidth matters.

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

IoT Core Rules Engine — route telemetry naar downstream services zonder Lambda intermediair voor eenvoudige transforms:

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

X.509 certificate provisioning — één cert per device, deel nooit certificates over devices:

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

Least-privilege IoT policy — device kan alleen eigen telemetry publishen en eigen commands subscriben:

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

Shadow decoupleert desired configuration van device huidige staat. Cloud sets `desired`, device applied het en reports terug via `reported`. `delta` topic bevat alleen keys waar desired en reported differ — device hoeft alleen daarop in te werken:

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

Cloud side — push configuration naar device zonder te weten of het online is:

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
# Device receives delta wanneer het connect — zelfs als currently offline
```

### OTA Firmware Update Pipeline

Stage rollouts om blast radius te limiteren — push nooit naar volledige fleet tegelijk:

```
Stage 1: 1% of fleet (canary devices)  → monitor error rate for 24h
Stage 2: 10% of fleet                  → monitor for 48h
Stage 3: 50% of fleet                  → monitor for 24h
Stage 4: 100% of fleet
```

Teken firmware voordat distributie — devices verifiëren signature voordat flashing:

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

AWS IoT Jobs voor fleet management:

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

`abortConfig` cancelt automatisch job als >5% devices fail na minstens 10 pogingen — essentieel voor automatic rollback.

### LoRaWAN for Long-Range Low-Power Devices

Spreading factor trade-off — hogere SF = langer bereik maar langzamer data rate en meer airtime:

| SF | Range | Data Rate | Battery Use |
|---|---|---|---|
| SF7 | ~2 km urban | ~5.5 kbps | Lowest |
| SF9 | ~5 km | ~1.8 kbps | Medium |
| SF12 | ~15 km | ~0.3 kbps | Highest |

Gebruik SF7 voor dicht urban deployments waarbij gateways dicht zijn; SF12 voor rural/industrial met sparse gateway coverage. LoRaWAN payload max is 51 bytes op SF12 — encodeer telemetry met Cayenne LPP of custom binary encoding, niet JSON.

## Voorbeeld

Ontwerp IoT architecture voor 1.000 industriële temperature sensors:

1. **MQTT topic hierarchy**: `device/{device_id}/telemetry/temperature` (QoS 0 op 1 Hz), `device/{device_id}/command` (QoS 1), shadow op `$aws/things/{device_id}/shadow/update`.
2. **AWS IoT Core**: elke sensor geregistreerd als Thing met unieke X.509 certificate. Least-privilege IoT policy beperkt publish/subscribe naar eigen topics alleen. Rules Engine routes temperature > 85°C alerts naar SNS → PagerDuty.
3. **Device shadow**: cloud sets `desired.sampling_interval_ms` wanneer operator frequentie aanpast. Device applied op volgende connection, reports terug via `reported`. Geen synchrone connection vereist.
4. **OTA update rollout**: firmware getekend met AWS Signer. IoT Job targets group `sensors-canary` (10 devices) eerst. Na 24h met <5% failure rate, expandeert naar `sensors-10pct`, `sensors-50pct`, `sensors-all`. `abortConfig` auto-cancels als failure rate exceeds 5%.
5. **Monitoring**: CloudWatch dashboard toont message ingestion rate, shadow sync latency, en OTA job execution status per stage.

---

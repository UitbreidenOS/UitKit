# IoT Development

## Wann aktivieren
Verbindung von IoT-Geräten zu Cloud-Infrastruktur, Design von MQTT-Topic-Hierarchien, Setup von AWS IoT Core oder Azure IoT Hub Device Connectivity, Implementierung von Device-Shadow-Patterns für Config-Push, Aufbau von OTA-Firmware-Update-Pipelines mit stufenweise Rollouts, Verwaltung von Device-Flotten im Großmaßstab oder Bereitstellung von Edge-Computing-Workloads mit AWS Greengrass oder Azure IoT Edge.

## Wann NICHT verwenden
Allgemeine Embedded-Firmware ohne Konnektivitätsanforderungen (verwenden Sie `embedded.md`). Server-seitige Event-Verarbeitung, bei der die Datenquelle keine physikalische Geräte ist (verwenden Sie `kafka.md` für Event-Streaming). Reine Mobile-App-Entwicklung, die zufällig mit Hardware über Bluetooth kommuniziert (das ist eine Mobile-Skill, keine IoT-Architektur).

## Anweisungen

### MQTT-Topic-Hierarchie-Design

Designen Sie Topic-Hierarchien so, dass sie routable, filterbar und ACL-durchsetzbar sind. Verwenden Sie strukturierte Pfade, die Device-Identität und Message-Typ kodieren:

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

Verwenden Sie niemals tiefe verschachtelte Topics für Single-Message-Typen — halten Sie sie flach genug, um mit Wildcards effizient zu abonnieren.

### MQTT QoS-Level

| QoS | Guarantee | Use For |
|---|---|---|
| 0 (at most once) | Fire-and-forget, keine Bestätigung | Hochfrequente Sensor-Telemetrie, bei der etwas Verlust akzeptabel ist |
| 1 (at least once) | Broker speichert bis PUBACK empfangen | Commands, Alerts, jede Message, die ankommen muss |
| 2 (exactly once) | 4-Wege-Handshake, keine Duplikate | Finanzielle Transaktionen, Abrechnungs-Events, Aktionen mit Nebenwirkungen |

Standardmäßig QoS 1 für Commands — Exactly-Once (QoS 2) fügt Latenz und Broker-Overhead hinzu, der selten gerechtfertigt ist. Verwenden Sie QoS 0 für Telemetrie bei >10 Hz, wenn gelegentlicher Verlust akzeptabel ist und Bandbreite wichtig ist.

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

IoT Core Rules Engine — Route Telemetrie zu nachgelagerten Services ohne Lambda-Intermediär für einfache Transforms:

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

X.509-Zertifikat-Provisioning — ein Cert pro Device, nie Zertifikate über Devices hinweg teilen:

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

Least-Privilege IoT Policy — Device kann nur seine eigene Telemetrie publizieren und seine eigenen Commands abonnieren:

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

### Device-Shadow-Pattern

Der Shadow entkoppelt gewünschte Konfiguration vom aktuellen Device-Status. Die Cloud setzt `desired`, das Device wendet es an und meldet über `reported` zurück. Das `delta`-Topic enthält nur die Keys, wo desired und reported unterscheiden — das Device muss nur auf diese einwirken:

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

Cloud-seitig — Push-Konfiguration an ein Device ohne zu wissen, ob es online ist:

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

Stufenweise Rollouts zur Begrenzung der Blast-Radius — nie auf die ganze Fleet auf einmal pushen:

```
Stage 1: 1% of fleet (canary devices)  → monitor error rate for 24h
Stage 2: 10% of fleet                  → monitor for 48h
Stage 3: 50% of fleet                  → monitor for 24h
Stage 4: 100% of fleet
```

Firmware vor Distribution signieren — Devices überprüfen Signatur vor Flashen:

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

AWS IoT Jobs für Fleet-Management:

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

`abortConfig` bricht den Job automatisch ab, wenn >5% der Devices nach mindestens 10 Versuchen fehlschlagen — wesentlich für automatisches Rollback.

### LoRaWAN für Long-Range Low-Power Devices

Spreading-Factor-Trade-off — höher SF = längere Reichweite, aber langsamere Datenrate und mehr Airtime:

| SF | Range | Data Rate | Battery Use |
|---|---|---|---|
| SF7 | ~2 km urban | ~5,5 kbps | Lowest |
| SF9 | ~5 km | ~1,8 kbps | Medium |
| SF12 | ~15 km | ~0,3 kbps | Highest |

Verwenden Sie SF7 für dichte urbane Bereitstellungen, bei denen Gateways nah beieinander sind; SF12 für ländliche/industrielle mit spärlicher Gateway-Abdeckung. LoRaWAN-Payload-Max ist 51 Bytes bei SF12 — kodieren Sie Telemetrie mit Cayenne LPP oder benutzerdefiniertem Binary-Encoding, nicht JSON.

## Beispiel

Design IoT-Architektur für 1.000 industrielle Temperatur-Sensoren:

1. **MQTT-Topic-Hierarchie**: `device/{device_id}/telemetry/temperature` (QoS 0 bei 1 Hz), `device/{device_id}/command` (QoS 1), Shadow bei `$aws/things/{device_id}/shadow/update`.
2. **AWS IoT Core**: Jeder Sensor als Thing mit eindeutigem X.509-Zertifikat registriert. Least-Privilege IoT Policy beschränkt Publish/Subscribe auf eigene Topics. Rules Engine routet Temperatur > 85°C Alerts zu SNS → PagerDuty.
3. **Device Shadow**: Cloud setzt `desired.sampling_interval_ms`, wenn ein Operator die Häufigkeit anpasst. Device wendet bei nächster Verbindung an, meldet über `reported` zurück. Keine synchrone Verbindung erforderlich.
4. **OTA Update Rollout**: Firmware mit AWS Signer signiert. IoT Job zielt zuerst auf Group `sensors-canary` (10 Devices). Nach 24h mit <5% Fehlerrate, erweitert auf `sensors-10pct`, `sensors-50pct`, `sensors-all`. `abortConfig` bricht automatisch ab, wenn Fehlerrate >5% überschreitet.
5. **Monitoring**: CloudWatch Dashboard zeigt Message-Ingestion-Rate, Shadow-Sync-Latenz und OTA-Job-Ausführungsstatus pro Stage.

---

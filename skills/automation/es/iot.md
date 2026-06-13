# Desarrollo de IoT

## Cuándo activar
Conexión de dispositivos IoT a infraestructura en la nube, diseño de jerarquías de temas MQTT, configuración de conectividad de dispositivos de AWS IoT Core o Azure IoT Hub, implementación de patrones de sombra de dispositivo para inserción de configuración, construcción de tuberías de actualización de firmware OTA con despliegues por etapas, gestión de flotas de dispositivos a escala, o despliegue de cargas de trabajo de computación perimetral con AWS Greengrass o Azure IoT Edge.

## Cuándo NO usar
Firmware embebido general sin requisitos de conectividad (usar `embedded.md`). Procesamiento de eventos del lado del servidor donde la fuente de datos no es un dispositivo físico (usar `kafka.md` para streaming de eventos). Desarrollo de aplicaciones móviles puro que sucede comunicarse con hardware a través de Bluetooth (eso es una habilidad de móvil, no arquitectura IoT).

## Instrucciones

### Diseño de Jerarquía de Temas MQTT

Diseñar jerarquías de temas que sean enrutables, filtrables y exigibles de ACL. Usar rutas estructuradas que codifiquen identidad de dispositivo y tipo de mensaje:

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

Nunca usar temas profundamente anidados para tipos de mensaje único — mantenerlo lo suficientemente plano para suscribirse con comodines de forma eficiente.

### Niveles de QoS de MQTT

| QoS | Guarantee | Use For |
|---|---|---|
| 0 (at most once) | Fire-and-forget, no acknowledgement | High-frequency sensor telemetry where some loss is acceptable |
| 1 (at least once) | Broker stores until PUBACK received | Commands, alerts, any message that must arrive |
| 2 (exactly once) | 4-way handshake, no duplicates | Financial transactions, billing events, actions with side effects |

Por defecto QoS 1 para comandos — exactamente-una (QoS 2) agrega latencia y gasto general del broker que raramente se justifica. Usar QoS 0 para telemetría a >10 Hz donde pérdida ocasional es aceptable y el ancho de banda importa.

### Arquitectura AWS IoT Core

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

Motor de Reglas de IoT Core — enrutar telemetría a servicios descendentes sin intermediario Lambda para transformaciones simples:

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

Aprovisionamiento de certificado X.509 — un certificado por dispositivo, nunca compartir certificados entre dispositivos:

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

Política de IoT de mínimos privilegios — dispositivo solo puede publicar su propia telemetría y suscribirse a sus propios comandos:

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

### Patrón de Sombra de Dispositivo

La sombra desacopla configuración deseada del estado actual del dispositivo. La nube establece `desired`, el dispositivo lo aplica e informa vía `reported`. El tema `delta` contiene solo las claves donde desired y reported difieren — el dispositivo solo necesita actuar en eso:

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

Lado de la nube — insertar configuración a un dispositivo sin saber si está en línea:

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

### Tubería de Actualización de Firmware OTA

Despliegues por etapas para limitar radio de explosión — nunca insertar a la flota completa a la vez:

```
Stage 1: 1% of fleet (canary devices)  → monitor error rate for 24h
Stage 2: 10% of fleet                  → monitor for 48h
Stage 3: 50% of fleet                  → monitor for 24h
Stage 4: 100% of fleet
```

Firmar firmware antes de distribución — dispositivos verifican firma antes de programar:

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

Trabajos de AWS IoT para gestión de flotas:

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

`abortConfig` automáticamente cancela el trabajo si >5% de dispositivos fallan después de al menos 10 intentos — esencial para reversión automática.

### LoRaWAN para Dispositivos de Largo Alcance y Bajo Consumo de Energía

Comercio de factor de dispersión — SF más alto = alcance más largo pero tasa de datos más lenta y más tiempo de aire:

| SF | Range | Data Rate | Battery Use |
|---|---|---|---|
| SF7 | ~2 km urban | ~5.5 kbps | Lowest |
| SF9 | ~5 km | ~1.8 kbps | Medium |
| SF12 | ~15 km | ~0.3 kbps | Highest |

Usar SF7 para despliegues urbanos densos donde puertas de enlace están cerca; SF12 para cobertura rural/industrial con sparse. Carga máxima de LoRaWAN es 51 bytes en SF12 — codificar telemetría con Cayenne LPP o codificación binaria personalizada, no JSON.

## Ejemplo

Diseño de arquitectura IoT para 1,000 sensores de temperatura industrial:

1. **Jerarquía de temas MQTT**: `device/{device_id}/telemetry/temperature` (QoS 0 a 1 Hz), `device/{device_id}/command` (QoS 1), sombra en `$aws/things/{device_id}/shadow/update`.
2. **AWS IoT Core**: cada sensor registrado como una Cosa con certificado X.509 único. Política IoT de mínimos privilegios restringe publicación/suscripción a temas propios solamente. Motor de Reglas enruta alertas de temperatura > 85°C a SNS → PagerDuty.
3. **Sombra de dispositivo**: nube establece `desired.sampling_interval_ms` cuando un operador ajusta frecuencia. Dispositivo aplica en siguiente conexión, informa vía `reported`. Sin conexión sincrónica requerida.
4. **Despliegue de actualización OTA**: firmware firmado con AWS Signer. Trabajo de IoT dirige grupo `sensors-canary` (10 dispositivos) primero. Después de 24h con <5% tasa de fallo, expande a `sensors-10pct`, `sensors-50pct`, `sensors-all`. `abortConfig` auto-cancela si tasa de fallo excede 5%.
5. **Monitoreo**: panel CloudWatch muestra tasa de ingesta de mensajes, latencia de sincronización de sombra, y estado de ejecución de trabajo OTA por etapa.

---

# Développement IoT

## Quand activer
Connexion des appareils IoT à l'infrastructure cloud, conception des hiérarchies de sujets MQTT, configuration de la connectivité des appareils AWS IoT Core ou Azure IoT Hub, implémentation de motifs d'ombre d'appareil pour la poussée de configuration, construction de pipelines de mise à jour de firmware OTA avec déploiements par étapes, gestion des flottes d'appareils à l'échelle, ou déploiement des charges de travail de calcul périphérique avec AWS Greengrass ou Azure IoT Edge.

## Quand ne PAS utiliser
Firmware embarqué général sans exigences de connectivité (utiliser `embedded.md`). Traitement d'événements côté serveur où la source de données n'est pas un appareil physique (utiliser `kafka.md` pour le streaming d'événements). Développement pur d'applications mobiles qui communiquent par hasard avec du matériel sur Bluetooth (c'est une compétence mobile, pas une architecture IoT).

## Instructions

### Conception de hiérarchie de sujets MQTT

Concevoir les hiérarchies de sujets pour être routable, filtrable, et faire respecter les ACL. Utiliser des chemins structurés qui codent l'identité de l'appareil et le type de message :

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

Ne jamais utiliser des sujets profondément imbriqués pour des types de messages uniques — le garder assez plat pour s'abonner efficacement avec des wildcards.

### Niveaux de QoS MQTT

| QoS | Garantie | À utiliser pour |
|---|---|---|
| 0 (au plus une fois) | Tir et oubli, pas de confirmation | La télémétrie de capteur haute fréquence où la perte partielle est acceptable |
| 1 (au moins une fois) | Le courtier stocke jusqu'à PUBACK reçu | Commandes, alertes, tout message qui doit arriver |
| 2 (exactement une fois) | Poignée de main 4 voies, pas de doublons | Transactions financières, événements de facturation, actions avec effets secondaires |

Par défaut, QoS 1 pour les commandes — exactement une fois (QoS 2) ajoute une latence et un surcoût du courtier rarement justifiés. Utiliser QoS 0 pour la télémétrie à >10 Hz où la perte occasionnelle est acceptable et la bande passante compte.

### Architecture AWS IoT Core

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

Moteur de règles IoT Core — router la télémétrie vers les services en aval sans intermédiaire Lambda pour les transformations simples :

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

Provisionnement de certificats X.509 — un cert par appareil, ne jamais partager les certificats sur les appareils :

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

Politique IoT du moindre privilège — l'appareil ne peut publier que sa propre télémétrie et s'abonner à ses propres commandes :

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

### Modèle d'ombre d'appareil

L'ombre découple la configuration souhaitée de l'état actuel de l'appareil. Le cloud définit `desired`, l'appareil l'applique et le signale via `reported`. Le sujet `delta` contient seulement les clés où desired et reported diffèrent — l'appareil doit agir uniquement sur cela :

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

Côté cloud — pousser la configuration vers un appareil sans savoir s'il est en ligne :

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

### Pipeline de mise à jour de firmware OTA

Mettre en scène les déploiements pour limiter le rayon d'effet — ne jamais pousser vers la flotte complète à la fois :

```
Étape 1 : 1% de la flotte (appareils canary)  → surveiller le taux d'erreur pendant 24h
Étape 2 : 10% de la flotte                     → surveiller pendant 48h
Étape 3 : 50% de la flotte                     → surveiller pendant 24h
Étape 4 : 100% de la flotte
```

Signer le firmware avant la distribution — les appareils vérifient la signature avant le flash :

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

Travaux AWS IoT pour la gestion de flotte :

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

`abortConfig` annule automatiquement le travail si >5% des appareils échouent après qu'au moins 10 aient tenté — essentiel pour la restauration automatique.

### LoRaWAN pour les appareils longue portée et basse puissance

Compromis du facteur d'étalement — SF plus élevé = portée plus longue mais débit de données plus lent et plus de temps radio :

| SF | Portée | Débit de données | Utilisation de batterie |
|---|---|---|---|
| SF7 | ~2 km urbain | ~5,5 kbps | Le plus bas |
| SF9 | ~5 km | ~1,8 kbps | Moyen |
| SF12 | ~15 km | ~0,3 kbps | Le plus haut |

Utiliser SF7 pour les déploiements urbains denses où les passerelles sont proches ; SF12 pour les zones rurales/industrielles avec couverture de passerelle clairsemée. La charge utile LoRaWAN max est 51 octets à SF12 — encoder la télémétrie avec Cayenne LPP ou codage binaire personnalisé, pas JSON.

## Exemple

Concevoir l'architecture IoT pour 1 000 capteurs de température industriels :

1. **Hiérarchie de sujet MQTT** : `device/{device_id}/telemetry/temperature` (QoS 0 à 1 Hz), `device/{device_id}/command` (QoS 1), ombre à `$aws/things/{device_id}/shadow/update`.
2. **AWS IoT Core** : chaque capteur enregistré comme un Thing avec certificat X.509 unique. La politique IoT du moindre privilège restreint la publication/souscription uniquement aux propres sujets. Rules Engine route les alertes de température > 85°C vers SNS → PagerDuty.
3. **Ombre d'appareil** : le cloud définit `desired.sampling_interval_ms` quand un opérateur ajuste la fréquence. L'appareil applique à la prochaine connexion, signale via `reported`. Aucune connexion synchrone requise.
4. **Déploiement de mise à jour OTA** : firmware signé avec AWS Signer. IoT Job cible d'abord le groupe `sensors-canary` (10 appareils). Après 24h avec <5% de taux d'échec, s'étend à `sensors-10pct`, `sensors-50pct`, `sensors-all`. `abortConfig` annule automatiquement si le taux d'échec dépasse 5%.
5. **Surveillance** : tableau de bord CloudWatch affiche le taux d'ingestion de messages, la latence de synchronisation d'ombre, et l'état d'exécution du travail OTA par étape.

---

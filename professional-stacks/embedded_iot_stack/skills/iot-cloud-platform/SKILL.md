---
name: iot-cloud-platform
description: Connect IoT devices to cloud — AWS IoT, Azure IoT, MQTT, device shadows, fleet management, and data pipelines
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Connecting IoT devices to AWS IoT Core or Azure IoT Hub
- Implementing MQTT communication patterns
- Designing device shadow/digital twin systems
- Building IoT data pipelines and analytics
- Managing device fleets (provisioning, monitoring, OTA)

## When NOT to use

- For consumer mobile app backends
- For web application cloud architecture
- For non-IoT cloud deployments

## Instructions

1. **Choose platform.** AWS IoT Core (X.509 certs, Shadow, Rules), Azure IoT Hub (DPS, Twins, Streams), or self-hosted (EMQX + TimescaleDB).
2. **Device identity.** X.509 certificates (most secure), SAS tokens (simpler), JIT provisioning. Unique per device.
3. **MQTT patterns.** Publish telemetry (device → cloud). Subscribe to commands (cloud → device). QoS 1 for reliability.
4. **Device shadow/twin.** Desired state (cloud → device), Reported state (device → cloud). Device syncs on reconnect.
5. **Data pipeline.** MQTT → Rule Engine → Lambda/Function → Time-series DB → Dashboard. Batch for analytics.
6. **Fleet management.** AWS Fleet Provisioning or Azure DPS. Group devices. Monitor connection health. Alert on offline devices.
7. **Security.** TLS 1.2+ for all communication. Rotate certificates. Least-privilege IAM policies. Audit logging.

## Example

```
IoT Architecture: Smart Building Sensors (500 devices)

Device → Cloud:
  MQTT Publish: sensors/{deviceId}/telemetry
  Payload: {"temp": 22.5, "humidity": 45.2, "co2": 650}
  Frequency: every 5 minutes
  QoS: 1

Cloud → Device:
  MQTT Subscribe: sensors/{deviceId}/commands
  Shadow: sensors/{deviceId}/shadow (desired/reported)

Pipeline:
  IoT Rule → Lambda → DynamoDB (latest state)
  IoT Rule → Kinesis → S3 (historical data)
  IoT Rule → SNS (alerts when thresholds exceeded)

Fleet:
  Provisioning: JITR with fleet provisioning templates
  Monitoring: CloudWatch alarms for disconnections >5min
  OTA: AWS IoT Jobs for firmware deployment
```

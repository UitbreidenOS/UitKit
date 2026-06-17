---
name: ble-connectivity
description: Implement BLE connectivity — GATT services, pairing, advertising, and BLE Mesh networking
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Implementing BLE GATT services and characteristics
- Designing BLE advertising and scanning strategies
- Implementing BLE pairing and bonding
- Building BLE Mesh networks for IoT
- Debugging BLE connection issues and throughput

## When NOT to use

- For WiFi-only IoT devices
- For classical Bluetooth audio (A2DP)
- For NFC or RFID systems

## Instructions

1. **Define GATT profile.** Services (group related data), Characteristics (individual values), Descriptors (metadata). Use standard SIG profiles where possible.
2. **Advertising.** Include service UUIDs. Use scan response for extra data. Interval trade-off: fast = discoverable, slow = power efficient.
3. **Connection parameters.** Interval (7.5ms-4s), latency (skip intervals), timeout. Negotiate for use case: low latency vs power.
4. **Pairing.** Just Works (no MITM protection), Passkey (MITM protection), OOB (out-of-band key). Choose based on security needs.
5. **Throughput.** DLE (Data Length Extension) for larger packets. MTU negotiation. Notifications > Indications (no ack needed).
6. **BLE Mesh.** Provisioning, relay nodes, publish/subscribe model. For many-to-many communication (lighting, sensors).
7. **Debugging.** BLE sniffer (nRF Sniffer). Connection event logging. RSSI monitoring for range issues.

## Example

```
BLE GATT Profile: Environmental Sensor

Service: Environmental Sensing (0x181A)
  Characteristic: Temperature (0x2A6E) — sint16, 0.01°C resolution, notify
  Characteristic: Humidity (0x2A6F) — uint16, 0.01% resolution, notify
  Characteristic: Pressure (0x2A6D) — uint32, 0.1 Pa resolution, read

Service: Device Information (0x180A)
  Characteristic: Manufacturer (0x2A29) — string, read
  Characteristic: Firmware Rev (0x2A26) — string, read

Advertising: 100ms interval, include Environmental Sensing UUID
Connection: 30ms interval, 0 latency, 4s timeout
```

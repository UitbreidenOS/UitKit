---
name: low-power-design
description: Optimize embedded power consumption — sleep modes, peripheral shutdown, battery life estimation, and power profiling
allowed-tools: [Read, Grep]
effort: high
---

## When to activate

- Optimizing battery life for embedded devices
- Designing sleep/wake strategies
- Profiling power consumption with current meters
- Estimating battery life from power budgets
- Implementing dynamic voltage and frequency scaling

## When NOT to use

- For mains-powered devices
- For high-performance computing (power is secondary)
- For battery charger circuit design

## Instructions

1. **Power budget.** Measure each component: MCU active, MCU sleep, radio TX/RX, sensors, LEDs. Create power budget spreadsheet.
2. **Sleep modes.** Stop (CPU halt, RAM retained), Standby (most clocks off), Shutdown (only RTC + backup RAM). Wake sources: GPIO, RTC, UART.
3. **Duty cycling.** Active for X ms, sleep for Y ms. Duty cycle = X/(X+Y). Lower duty cycle = longer battery life.
4. **Peripheral management.** Disable unused peripherals. Clock gating. Power down sensors between reads. Radio off between transmissions.
5. **Software optimization.** Minimize active time. Batch sensor reads. Process locally before transmitting. Use DMA for transfers.
6. **Battery estimation.** Battery capacity (mAh) / Average current (mA) = Hours. Account for self-discharge, temperature, load profile.
7. **Profiling.** Current meter (Nordic PPK2, Otii). Log at high sample rate. Identify unexpected wake sources and idle current.

## Example

```
Power Budget: Environmental Sensor (CR2032, 225mAh)

Mode          | Duration | Current  | Energy/cycle
--------------|----------|----------|-------------
Sleep         | 295s     | 2.5 µA   | 0.206 µAh
Wake + Sense  | 50ms     | 3.2 mA   | 0.044 µAh
BLE TX        | 5ms      | 12 mA    | 0.017 µAh
Total/cycle   | 300s     |          | 0.267 µAh

Average current: 0.267 µAh / (300/3600)h = 3.2 µA
Battery life: 225 mAh / 0.0032 mA = 70,312 hours ≈ 8.0 years
```

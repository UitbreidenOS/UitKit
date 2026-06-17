---
name: firmware-architecture
description: Design firmware architecture — HAL abstraction, driver layers, application logic, and cross-platform portability
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Designing firmware architecture for a new embedded product
- Creating hardware abstraction layers (HAL)
- Structuring driver and application layers
- Porting firmware across microcontroller families
- Planning memory layout and linker scripts

## When NOT to use

- For application-level software architecture
- For hardware PCB design
- For cloud backend architecture

## Instructions

1. **Define layers.** Hardware → HAL → Driver → Service → Application. Each layer only calls the layer below.
2. **HAL design.** Abstract MCU-specific registers behind portable interfaces. `hal_gpio_set(pin, value)` not `GPIOB->BSRR = ...`.
3. **Driver pattern.** Init → Configure → Read/Write → Deinit. Non-blocking with callbacks or DMA where possible.
4. **Memory layout.** Flash: bootloader + app + OTA slot + config. RAM: stack, heap, static, DMA buffers. Use linker script explicitly.
5. **Build system.** CMake for cross-compilation. Separate HAL per target (STM32, ESP32, nRF52). Common application code.
6. **Error handling.** Return codes (not exceptions). Assert in debug, graceful degrade in release. Watchdog for hard faults.
7. **Documentation.** Pin assignments, peripheral mapping, memory map, interrupt priority table.

## Example

```
Firmware Architecture: Environmental Sensor Node

Layers:
  Application: DataLogger, AlertManager, ConfigManager
  Service:     SensorService, NetworkService, StorageService
  Driver:      BME280, nRF24L01, SPIFlash, UART
  HAL:         GPIO, SPI, I2C, UART, Timer, ADC (MCU-specific)
  Hardware:    STM32L4 + BME280 + nRF24L01

Memory Map:
  0x08000000: Bootloader (16KB)
  0x08004000: Application (240KB)
  0x08040000: OTA Slot (240KB)
  0x0807C000: Config/NVS (16KB)
```

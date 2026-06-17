---
name: rtos-patterns
description: RTOS task design — FreeRTOS/Zephyr scheduling, IPC mechanisms, resource management, and real-time guarantees
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Designing task architecture for RTOS-based firmware
- Choosing IPC mechanisms (queues, semaphores, events)
- Optimizing task priorities and stack sizes
- Debugging priority inversion, deadlocks, or stack overflows
- Migrating from bare-metal to RTOS

## When NOT to use

- For bare-metal super-loop firmware (no RTOS)
- For Linux-based embedded systems
- For high-level application architecture

## Instructions

1. **Task decomposition.** One task per responsibility. Sensor task, network task, UI task. Minimize task count (each = RAM overhead).
2. **Priority assignment.** Rate Monotonic: shorter period = higher priority. Critical tasks above all. Idle task for power saving.
3. **IPC selection.** Queues (producer/consumer), Semaphores (resource counting), Mutexes (shared resource), Events (flag signaling).
4. **Stack sizing.** Measure with watermark pattern (fill stack with known value, measure unused). Add 25% margin.
5. **Avoid pitfalls.** No dynamic allocation after init. No printf in ISR. Short ISRs (set flag, process in task). Priority inheritance for mutexes.
6. **Power management.** Tickless idle. `vTaskSuspend` unused tasks. `configUSE_TICKLESS_IDLE = 1`.
7. **Debugging.** Stack overflow detection. Task runtime monitoring. Idle task hook for CPU usage calculation.

## Example

```
RTOS Task Design: Sensor Gateway

Tasks (by priority):
  1. RadioTask     (pri=5, stack=2KB, period=event-driven) — BLE receive/send
  2. SensorTask    (pri=4, stack=1KB, period=100ms) — BME280 read + filter
  3. DataTask      (pri=3, stack=1.5KB, period=event-driven) — aggregate + store
  4. CloudTask     (pri=2, stack=4KB, period=event-driven) — MQTT publish
  5. UITask        (pri=1, stack=2KB, period=500ms) — LED + button handling
  6. IdleTask      (pri=0) — WFI for power saving

IPC:
  SensorTask → DataTask: xQueue (sensor readings)
  RadioTask → DataTask: xQueue (commands from phone)
  DataTask → CloudTask: xQueue (batched data)
  All → UITask: xEventGroup (status flags)

Total RAM: 10.5KB tasks + 2KB system = 12.5KB (MCU has 64KB)
```

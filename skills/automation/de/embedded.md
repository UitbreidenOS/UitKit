# Embedded Systems

## Wann aktivieren
Schreiben von Firmware für Mikrocontroller (STM32, ESP32, nRF52, RP2040), Designen von FreeRTOS-Task-Architekturen, Implementierung von HAL-Peripherie-Treibern, Schreiben von Interrupt-Service-Routinen, Konfiguration von DMA-Übertragungen, Optimierung von Code für speicherbeschränkte Geräte oder Debuggen von zeitkritischen Problemen in Bare-Metal- oder RTOS-Umgebungen.

## Wann NICHT verwenden
Linux-basierte Embedded-Systeme (Raspberry Pi, Yocto), bei denen die Standardprogrammierung für Linux gilt. Hochrangige IoT-Konnektivität ohne Firmware-Bedenken (verwenden Sie `iot.md`). FPGA-HDL-Design. Generelle C/C++-Anwendungsentwicklung auf Desktop-Hardware. Scripting für Embedded-Linux-Geräte, bei denen Python/Shell angemessen ist.

## Anweisungen

### Speicherlayout

Das Verständnis der Linker-Abschnitte ist für das Debugging von Hard Faults und das Sizing von Firmware wesentlich:

```
Flash (read-only, persistent):
  .text    — compiled machine code
  .rodata  — read-only constants (const char*, lookup tables)
  .data    — initial values for initialized globals (copied to RAM at startup)

RAM (read-write, volatile):
  .data    — initialized globals (copied from flash at startup)
  .bss     — uninitialized globals (zero-filled at startup)
  .heap    — grows upward (malloc region)
  [gap]
  .stack   — grows downward from top of RAM

Hard fault on cortex-M → check PSP/MSP for stack overflow into heap
```

Berechnen Sie Stack-Nutzung mit FreeRTOS `uxTaskGetStackHighWaterMark()`, um den minimalen Stack-Spielraum zu finden, der seit Task-Erstellung beobachtet wurde. Setzen Sie Task-Stacks 20-30% größer als gemessenes Peak.

Überprüfen Sie Firmware-Größe vor dem Flashen:

```bash
arm-none-eabi-size build/firmware.elf
# text: flash usage | data: initialized globals | bss: uninitialized globals
```

### `volatile` für Hardware-Register

Der Compiler darf Register-Lesevorgänge in CPU-Registern zwischenspeichern und wiederholte Ladevorgänge eliminieren, die er für "redundant" hält. `volatile` verhindert dies:

```c
// Wrong — compiler may read USART_SR once and cache it
while (!(USART1->SR & USART_SR_TXE));

// Correct — USART1->SR is volatile, re-read each loop iteration
// (CMSIS headers already define register structs as volatile)
while (!(USART1->SR & USART_SR_TXE));

// Shared flag between ISR and main loop — must be volatile
volatile bool g_data_ready = false;

void USART1_IRQHandler(void) {
    g_data_ready = true;   // set in ISR
}

void main_loop(void) {
    if (g_data_ready) {    // read in main — volatile prevents caching
        process_data();
        g_data_ready = false;
    }
}
```

Für atomaren Zugriff auf mehrbyte-Variablen, die mit ISRs geteilt werden, deaktivieren Sie Interrupts um den kritischen Abschnitt:

```c
uint32_t read_counter_atomic(void) {
    __disable_irq();
    uint32_t val = g_counter;
    __enable_irq();
    return val;
}
```

### ISR-Constraints

ISRs laufen mit deaktivierter Preemption (oder bei erhöhter Priorität auf Cortex-M). Verstöße verursachen Priority Inversion, verpasste Deadlines und Hard Faults:

- Keine blockierenden Aufrufe (`vTaskDelay`, `HAL_Delay`, `osDelay`)
- Keine dynamische Speicherzuordnung (`malloc`, `pvPortMalloc` — kann deadlocken, wenn Heap-Mutex gespeichert ist)
- Kein UART `printf` (verwendet intern HAL-blockierende Verzögerungen)
- Kein FreeRTOS `xQueueSend` — verwenden Sie `xQueueSendFromISR` mit `BaseType_t pxHigherPriorityTaskWoken`
- Ziel-ISR-Ausführungszeit < 1 µs für hochfrequente Interrupts; < 10 µs als allgemeine Regel

```c
static QueueHandle_t g_sensor_queue;

void SPI1_IRQHandler(void) {
    BaseType_t higher_prio_task_woken = pdFALSE;
    SensorReading reading = read_dma_buffer();

    xQueueSendFromISR(g_sensor_queue, &reading, &higher_prio_task_woken);

    // Yield to higher priority task immediately if it was unblocked
    portYIELD_FROM_ISR(higher_prio_task_woken);
}
```

### FreeRTOS-Patterns

Task-Prioritäten: höhere Zahl = höhere Priorität auf den meisten Ports. Weisen Sie sorgfältig zu:

```
Priority 5 (highest) — critical real-time tasks (motor control, safety)
Priority 4 — sensor acquisition
Priority 3 — data processing
Priority 2 — communication (UART, BLE, WiFi)
Priority 1 — logging, housekeeping
Priority 0 — idle task (never block, never starve)
```

Queue für ISR-zu-Task-Datentransfer:

```c
void sensor_task(void *params) {
    SensorReading reading;
    for (;;) {
        // Block until ISR sends data — no CPU burn
        if (xQueueReceive(g_sensor_queue, &reading, pdMS_TO_TICKS(100)) == pdTRUE) {
            process_reading(&reading);
        } else {
            // Timeout — sensor may have failed, log warning
            log_warn("Sensor timeout");
        }
    }
}
```

Mutex für Shared-Resource-Schutz:

```c
static SemaphoreHandle_t g_spi_mutex;

bool spi_transceive(uint8_t *tx, uint8_t *rx, size_t len) {
    if (xSemaphoreTake(g_spi_mutex, pdMS_TO_TICKS(50)) != pdTRUE) {
        return false;   // timeout — another task holds bus
    }
    HAL_SPI_TransmitReceive(&hspi1, tx, rx, len, HAL_MAX_DELAY);
    xSemaphoreGive(g_spi_mutex);
    return true;
}
```

Rufen Sie niemals `vTaskDelay(0)` in einer Schleife auf, um zu ertragennen — verwenden Sie `taskYIELD()` für einen expliziten Yield ohne zeitliche Verzögerung.

### DMA für Hochdurchsatz-Peripherie

DMA überträgt Daten zwischen Peripherie und Speicher ohne CPU-Beteiligung. Verwenden Sie für SPI, UART, ADC, wenn die Übertragungsgröße > 4 Bytes ist:

```c
// ADC with DMA — continuous conversion, no CPU involvement
void adc_dma_init(void) {
    hadc1.Init.ContinuousConvMode  = ENABLE;
    hadc1.Init.DMAContinuousRequests = ENABLE;
    HAL_ADC_Init(&hadc1);

    // DMA callback fires when buffer is full
    HAL_ADC_Start_DMA(&hadc1, (uint32_t*)g_adc_buffer, ADC_BUFFER_SIZE);
}

// Double-buffering — process first half while DMA fills second half
void HAL_ADC_ConvHalfCpltCallback(ADC_HandleTypeDef *hadc) {
    // Process g_adc_buffer[0..HALF]
    process_adc_samples(g_adc_buffer, ADC_BUFFER_SIZE / 2);
}

void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef *hadc) {
    // Process g_adc_buffer[HALF..END]
    process_adc_samples(&g_adc_buffer[ADC_BUFFER_SIZE / 2], ADC_BUFFER_SIZE / 2);
}
```

SPI-DMA für Display- oder Sensor-Burst-Lesevorgänge — Übertragung starten, Task erteilen, in Callback fortsetzen:

```c
static SemaphoreHandle_t g_spi_dma_done;

void spi_dma_send(uint8_t *data, size_t len) {
    HAL_SPI_Transmit_DMA(&hspi1, data, len);
    xSemaphoreTake(g_spi_dma_done, portMAX_DELAY);  // block until DMA complete
}

void HAL_SPI_TxCpltCallback(SPI_HandleTypeDef *hspi) {
    BaseType_t woken = pdFALSE;
    xSemaphoreGiveFromISR(g_spi_dma_done, &woken);
    portYIELD_FROM_ISR(woken);
}
```

### Fixed-Point-Arithmetik

Vermeiden Sie Floating-Point auf MCUs ohne FPU (Cortex-M0, M0+). Q16.16-Format: obere 16 Bits = Integer-Teil, untere 16 Bits = Bruch-Teil.

```c
typedef int32_t fixed16_t;  // Q16.16

#define FLOAT_TO_FIXED(x)   ((fixed16_t)((x) * 65536.0f))
#define FIXED_TO_FLOAT(x)   ((float)(x) / 65536.0f)
#define FIXED_MUL(a, b)     ((fixed16_t)(((int64_t)(a) * (b)) >> 16))
#define FIXED_DIV(a, b)     ((fixed16_t)(((int64_t)(a) << 16) / (b)))

// PID controller in fixed-point
fixed16_t pid_update(PIDController *pid, fixed16_t setpoint, fixed16_t measured) {
    fixed16_t error = setpoint - measured;
    pid->integral += error;
    fixed16_t derivative = error - pid->prev_error;
    pid->prev_error = error;

    return FIXED_MUL(pid->kp, error)
         + FIXED_MUL(pid->ki, pid->integral)
         + FIXED_MUL(pid->kd, derivative);
}
```

### Watchdog-Timer

Der Watchdog setzt den MCU zurück, wenn die Hauptschleife oder kritische Task ihn nicht speist — wesentlich für unbeaufsichtigte Bereitstellungen:

```c
// Initialize independent watchdog — 4s timeout
void watchdog_init(void) {
    hiwdg.Instance       = IWDG;
    hiwdg.Init.Prescaler = IWDG_PRESCALER_64;
    hiwdg.Init.Reload    = 2000;   // 2000 * (64/32000Hz) = 4 seconds
    HAL_IWDG_Init(&hiwdg);
}

// Feed in main loop or highest-priority task
void watchdog_feed(void) {
    HAL_IWDG_Refresh(&hiwdg);
}

// In FreeRTOS: create a watchdog task that blocks on a flag set by all critical tasks
void watchdog_task(void *params) {
    for (;;) {
        // Wait for all critical tasks to signal alive
        xEventGroupWaitBits(g_alive_bits, ALL_TASKS_ALIVE_MASK,
                            pdTRUE, pdTRUE, pdMS_TO_TICKS(2000));
        watchdog_feed();
    }
}
```

## Beispiel

Design von FreeRTOS-Firmware für STM32F4, die Temperatur/Druck von BMP388 über SPI DMA liest, verarbeitet in einer Task, formatierte Ausgaben über UART:

1. **SPI DMA**: `spi_dma_send` und `spi_dma_receive` verwenden DMA mit einem Semaphor, das in `HAL_SPI_TxRxCpltCallback` signalisiert wird. Sensor-Treiber rufen diese auf — null CPU-Zyklen während der Übertragung.
2. **ISR → task**: `EXTI`-Interrupt löst auf BMP388-Daten-Ready-Pin aus. ISR ruft `xQueueSendFromISR` mit einem Trigger-Token in `g_sensor_queue` auf. Keine Verarbeitung in ISR.
3. **Sensor-Task** (Priorität 4): blockiert auf `xQueueReceive(g_sensor_queue)`. Bei Trigger, initiiert SPI-DMA-Lese-, blockiert auf DMA-Semaphor, konvertiert rohe ADC-Werte mit Fixed-Point Q16.16 Math (kein FPU erforderlich auf M4 in dieser Konfiguration für Portabilität), sendet Ergebnis zu `g_result_queue`.
4. **UART-Task** (Priorität 2): blockiert auf `g_result_queue`, formatiert Auslesung als binären Frame, ruft `HAL_UART_Transmit_DMA` auf.
5. **Watchdog-Task** (Priorität 5): wartet auf Event-Group-Bits, die von Sensor- und UART-Tasks in jedem Zyklus gesetzt werden. Wenn beide Bits nicht innerhalb von 2s gesetzt sind, setzt IWDG das Gerät zurück. Stack-High-Water-Mark wird in Debug-Builds überprüft und bei Boot über UART geprotokolliert.

---

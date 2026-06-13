# Embedded Systems

## Wanneer activeren
Schrijven van firmware voor microcontrollers (STM32, ESP32, nRF52, RP2040), ontwerpen van FreeRTOS task architectures, implementeren van HAL peripheral drivers, schrijven van interrupt service routines, configureren van DMA transfers, optimaliseren van code voor memory-constrained devices, of debuggen van timing-sensitive issues in bare-metal of RTOS environments.

## Wanneer NIET gebruiken
Linux-gebaseerde embedded systems (Raspberry Pi, Yocto) waarbij standaard Linux programmering geldt. High-level IoT connectivity zonder firmware concerns (gebruik `iot.md`). FPGA HDL design. Algemene C/C++ applicatie development op desktop hardware. Scripting voor embedded Linux devices waarbij Python/shell geschikt is.

## Instructies

### Memory Layout

Het begrijpen van linker sections is essentieel voor debugging hard faults en sizing firmware:

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

Bereken stack usage met FreeRTOS `uxTaskGetStackHighWaterMark()` om minimale stack headroom gevonden sinds task creation te vinden. Stel task stacks 20-30% groter in dan gemeten peak.

Controleer firmware size voor flashing:

```bash
arm-none-eabi-size build/firmware.elf
# text: flash usage | data: initialized globals | bss: uninitialized globals
```

### `volatile` for Hardware Registers

Compiler mag register reads cachen in CPU registers en herhaalde loads elimineren die het "redundant" acht. `volatile` voorkomt dit:

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

Voor atomic access tot multi-byte variabelen gedeeld met ISRs, disable interrupts rond critical section:

```c
uint32_t read_counter_atomic(void) {
    __disable_irq();
    uint32_t val = g_counter;
    __enable_irq();
    return val;
}
```

### ISR Constraints

ISRs draaien met preemption disabled (of op elevated priority op Cortex-M). Violations veroorzaken priority inversion, gemiste deadlines, en hard faults:

- Geen blocking calls (`vTaskDelay`, `HAL_Delay`, `osDelay`)
- Geen dynamic memory allocation (`malloc`, `pvPortMalloc` — kan deadlock als heap mutex gehouden)
- Geen UART `printf` (intern uses HAL blocking delays)
- Geen FreeRTOS `xQueueSend` — gebruik `xQueueSendFromISR` met `BaseType_t pxHigherPriorityTaskWoken`
- Target ISR execution time < 1 µs voor high-frequency interrupts; < 10 µs als general rule

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

### FreeRTOS Patterns

Task priorities: hoger getal = hogere priority op meeste ports. Wijs zorgvuldig toe:

```
Priority 5 (highest) — critical real-time tasks (motor control, safety)
Priority 4 — sensor acquisition
Priority 3 — data processing
Priority 2 — communication (UART, BLE, WiFi)
Priority 1 — logging, housekeeping
Priority 0 — idle task (never block, never starve)
```

Queue voor ISR-to-task data transfer:

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

Mutex voor shared resource protection:

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

Roep nooit `vTaskDelay(0)` in loop aan om te yielden — gebruik `taskYIELD()` voor explicit yield zonder time delay.

### DMA for High-Throughput Peripherals

DMA transfers data tussen peripheral en memory zonder CPU involvement. Gebruik voor SPI, UART, ADC wanneer transfer size > 4 bytes:

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

SPI DMA voor display of sensor burst reads — start transfer, yield task, resume in callback:

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

### Fixed-Point Arithmetic

Vermijd floating-point op MCUs zonder FPU (Cortex-M0, M0+). Q16.16 format: upper 16 bits = integer part, lower 16 bits = fractional part.

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

### Watchdog Timer

De watchdog zet MCU opnieuw in als main loop of critical task stopt het te voeden — essentieel voor unattended deployments:

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

## Voorbeeld

Ontwerp FreeRTOS firmware voor STM32F4 lezen temperature/pressure van BMP388 via SPI DMA, verwerking in task, formatted readings uitvoeren over UART:

1. **SPI DMA**: `spi_dma_send` en `spi_dma_receive` gebruiken DMA met semaphore gesignaleerd in `HAL_SPI_TxRxCpltCallback`. Sensor driver roept deze aan — zero CPU cycles during transfer.
2. **ISR → task**: `EXTI` interrupt vuur op BMP388 data-ready pin. ISR roept `xQueueSendFromISR` met trigger token in `g_sensor_queue`. Geen processing in ISR.
3. **Sensor task** (priority 4): blokkeert op `xQueueReceive(g_sensor_queue)`. Op trigger, initieert SPI DMA read, blokkeert op DMA semaphore, converteert raw ADC values met fixed-point Q16.16 math (geen FPU nodig op M4 in deze config voor portability), posted result naar `g_result_queue`.
4. **UART task** (priority 2): blokkeert op `g_result_queue`, formatted reading als binary frame, roept `HAL_UART_Transmit_DMA` aan.
5. **Watchdog task** (priority 5): wacht op event group bits ingesteld door sensor en UART tasks elke cycle. Als beide bits niet zijn ingesteld binnen 2s, IWDG zet device opnieuw in. Stack high water mark gecontroleerd in debug builds en gelogd over UART op boot.

---

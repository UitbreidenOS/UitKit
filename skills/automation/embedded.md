---
name: embedded
updated: 2026-06-13
---

# Embedded Systems

## When to activate
Writing firmware for microcontrollers (STM32, ESP32, nRF52, RP2040), designing FreeRTOS task architectures, implementing HAL peripheral drivers, writing interrupt service routines, configuring DMA transfers, optimizing code for memory-constrained devices, or debugging timing-sensitive issues in bare-metal or RTOS environments.

## When NOT to use
Linux-based embedded systems (Raspberry Pi, Yocto) where standard Linux programming applies. High-level IoT connectivity without firmware concerns (use `iot.md`). FPGA HDL design. General C/C++ application development on desktop hardware. Scripting for embedded Linux devices where Python/shell is appropriate.

## Instructions

### Memory Layout

Understanding the linker sections is essential for debugging hard faults and sizing firmware:

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

Calculate stack usage with FreeRTOS `uxTaskGetStackHighWaterMark()` to find the minimum stack headroom observed since task creation. Set task stacks 20-30% larger than measured peak.

Check firmware size before flashing:

```bash
arm-none-eabi-size build/firmware.elf
# text: flash usage | data: initialized globals | bss: uninitialized globals
```

### `volatile` for Hardware Registers

The compiler is allowed to cache register reads in CPU registers and eliminate repeated loads it deems "redundant." `volatile` prevents this:

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

For atomic access to multi-byte variables shared with ISRs, disable interrupts around the critical section:

```c
uint32_t read_counter_atomic(void) {
    __disable_irq();
    uint32_t val = g_counter;
    __enable_irq();
    return val;
}
```

### ISR Constraints

ISRs run with preemption disabled (or at elevated priority on Cortex-M). Violations cause priority inversion, missed deadlines, and hard faults:

- No blocking calls (`vTaskDelay`, `HAL_Delay`, `osDelay`)
- No dynamic memory allocation (`malloc`, `pvPortMalloc` — can deadlock if heap mutex is held)
- No UART `printf` (internally uses HAL blocking delays)
- No FreeRTOS `xQueueSend` — use `xQueueSendFromISR` with `BaseType_t pxHigherPriorityTaskWoken`
- Target ISR execution time < 1 µs for high-frequency interrupts; < 10 µs as a general rule

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

Task priorities: higher number = higher priority on most ports. Assign carefully:

```
Priority 5 (highest) — critical real-time tasks (motor control, safety)
Priority 4 — sensor acquisition
Priority 3 — data processing
Priority 2 — communication (UART, BLE, WiFi)
Priority 1 — logging, housekeeping
Priority 0 — idle task (never block, never starve)
```

Queue for ISR-to-task data transfer:

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

Mutex for shared resource protection:

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

Never call `vTaskDelay(0)` in a loop to yield — use `taskYIELD()` for an explicit yield without a time delay.

### DMA for High-Throughput Peripherals

DMA transfers data between peripheral and memory without CPU involvement. Use for SPI, UART, ADC when transfer size > 4 bytes:

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

SPI DMA for display or sensor burst reads — start transfer, yield task, resume in callback:

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

Avoid floating-point on MCUs without FPU (Cortex-M0, M0+). Q16.16 format: upper 16 bits = integer part, lower 16 bits = fractional part.

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

The watchdog resets the MCU if the main loop or critical task stops feeding it — essential for unattended deployments:

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

## Example

Design FreeRTOS firmware for STM32F4 reading temperature/pressure from BMP388 via SPI DMA, processing in a task, outputting formatted readings over UART:

1. **SPI DMA**: `spi_dma_send` and `spi_dma_receive` use DMA with a semaphore signaled in `HAL_SPI_TxRxCpltCallback`. Sensor driver calls these — zero CPU cycles during transfer.
2. **ISR → task**: `EXTI` interrupt fires on BMP388 data-ready pin. ISR calls `xQueueSendFromISR` with a trigger token into `g_sensor_queue`. No processing in ISR.
3. **Sensor task** (priority 4): blocks on `xQueueReceive(g_sensor_queue)`. On trigger, initiates SPI DMA read, blocks on DMA semaphore, converts raw ADC values using fixed-point Q16.16 math (no FPU needed on M4 in this config for portability), posts result to `g_result_queue`.
4. **UART task** (priority 2): blocks on `g_result_queue`, formats reading as binary frame, calls `HAL_UART_Transmit_DMA`.
5. **Watchdog task** (priority 5): waits on event group bits set by sensor and UART tasks each cycle. If both bits are not set within 2s, the IWDG resets the device. Stack high water mark checked in debug builds and logged over UART at boot.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

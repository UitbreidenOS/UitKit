# Sistemas Embebidos

## Cuándo activar
Escritura de firmware para microcontroladores (STM32, ESP32, nRF52, RP2040), diseño de arquitecturas de tareas FreeRTOS, implementación de controladores periféricos HAL, escritura de rutinas de servicio de interrupciones, configuración de transferencias DMA, optimización de código para dispositivos con memoria limitada, o depuración de problemas sensibles al tiempo en entornos bare-metal o RTOS.

## Cuándo NO usar
Sistemas embebidos basados en Linux (Raspberry Pi, Yocto) donde se aplica programación estándar de Linux. Conectividad IoT de alto nivel sin preocupaciones de firmware (usar `iot.md`). Diseño FPGA HDL. Desarrollo de aplicaciones C/C++ general en hardware de escritorio. Scripting para dispositivos embebidos Linux donde Python/shell es apropiado.

## Instrucciones

### Diseño de Memoria

Entender las secciones del vinculador es esencial para depuración de fallos duros y dimensionamiento de firmware:

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

Calcular el uso de pila con FreeRTOS `uxTaskGetStackHighWaterMark()` para encontrar el margen de pila mínimo observado desde la creación de la tarea. Establecer pilas de tarea 20-30% más grandes que el pico medido.

Verificar el tamaño del firmware antes de programar:

```bash
arm-none-eabi-size build/firmware.elf
# text: flash usage | data: initialized globals | bss: uninitialized globals
```

### `volatile` para Registros de Hardware

El compilador puede cachear lecturas de registros en registros de CPU y eliminar cargas repetidas que considera "redundantes." `volatile` previene esto:

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

Para acceso atómico a variables de varios bytes compartidas con ISRs, desabilitar interrupciones alrededor de la sección crítica:

```c
uint32_t read_counter_atomic(void) {
    __disable_irq();
    uint32_t val = g_counter;
    __enable_irq();
    return val;
}
```

### Restricciones de ISR

Los ISRs se ejecutan con preemption deshabilitada (o a prioridad elevada en Cortex-M). Las violaciones causan inversión de prioridad, vencimiento de plazos y fallos duros:

- Sin llamadas de bloqueo (`vTaskDelay`, `HAL_Delay`, `osDelay`)
- Sin asignación de memoria dinámica (`malloc`, `pvPortMalloc` — puede tener bloqueo si se mantiene el mutex del montículo)
- Sin UART `printf` (internamente usa retrasos de bloqueo HAL)
- Sin FreeRTOS `xQueueSend` — usar `xQueueSendFromISR` con `BaseType_t pxHigherPriorityTaskWoken`
- Tiempo de ejecución de ISR objetivo < 1 µs para interrupciones de alta frecuencia; < 10 µs como regla general

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

### Patrones FreeRTOS

Prioridades de tarea: número más alto = prioridad más alta en la mayoría de puertos. Asignar cuidadosamente:

```
Priority 5 (highest) — critical real-time tasks (motor control, safety)
Priority 4 — sensor acquisition
Priority 3 — data processing
Priority 2 — communication (UART, BLE, WiFi)
Priority 1 — logging, housekeeping
Priority 0 — idle task (never block, never starve)
```

Cola para transferencia de datos de ISR a tarea:

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

Mutex para protección de recursos compartidos:

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

Nunca llamar a `vTaskDelay(0)` en un bucle para ceder — usar `taskYIELD()` para un rendimiento explícito sin retraso de tiempo.

### DMA para Periféricos de Alto Rendimiento

DMA transfiere datos entre periférico y memoria sin intervención de la CPU. Usar para SPI, UART, ADC cuando el tamaño de transferencia > 4 bytes:

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

SPI DMA para pantalla o lecturas de ráfaga de sensor — iniciar transferencia, ceder tarea, reanudar en callback:

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

### Aritmética de Punto Fijo

Evitar punto flotante en MCUs sin FPU (Cortex-M0, M0+). Formato Q16.16: los 16 bits superiores = parte entera, los 16 bits inferiores = parte fraccionaria.

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

### Temporizador Perro Guardián

El perro guardián reinicia el MCU si el bucle principal o tarea crítica deja de alimentarlo — esencial para despliegues desatendidos:

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

## Ejemplo

Diseño de firmware FreeRTOS para STM32F4 leyendo temperatura/presión de BMP388 vía SPI DMA, procesando en una tarea, mostrando lecturas formateadas por UART:

1. **SPI DMA**: `spi_dma_send` y `spi_dma_receive` usan DMA con un semáforo señalado en `HAL_SPI_TxRxCpltCallback`. El controlador de sensor llama a estos — cero ciclos de CPU durante transferencia.
2. **ISR → tarea**: interrupción `EXTI` se dispara en pin de datos-listos de BMP388. ISR llama a `xQueueSendFromISR` con token de disparador en `g_sensor_queue`. Sin procesamiento en ISR.
3. **Tarea de sensor** (prioridad 4): se bloquea en `xQueueReceive(g_sensor_queue)`. En disparador, inicia lectura DMA SPI, se bloquea en semáforo DMA, convierte valores ADC brutos usando matemática de punto fijo Q16.16 (sin FPU necesaria en M4 en esta configuración para portabilidad), publica resultado en `g_result_queue`.
4. **Tarea UART** (prioridad 2): se bloquea en `g_result_queue`, formatea lectura como frame binario, llama a `HAL_UART_Transmit_DMA`.
5. **Tarea de perro guardián** (prioridad 5): espera en bits de grupo de eventos establecidos por tareas de sensor y UART cada ciclo. Si ambos bits no están establecidos dentro de 2s, el IWDG reinicia el dispositivo. Marca de agua alta de pila verificada en compilaciones de depuración y registrada por UART al arranque.

---

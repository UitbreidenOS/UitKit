# Systèmes embarqués

## Quand activer
Écrire le firmware pour les microcontrôleurs (STM32, ESP32, nRF52, RP2040), concevoir les architectures de tâches FreeRTOS, implémenter les pilotes périphériques HAL, écrire les routines de service d'interruption, configurer les transferts DMA, optimiser le code pour les appareils à mémoire limitée, ou déboguer les problèmes sensibles au timing dans les environnements bare-metal ou RTOS.

## Quand ne PAS utiliser
Les systèmes embarqués basés sur Linux (Raspberry Pi, Yocto) où la programmation Linux standard s'applique. Connectivité IoT haut niveau sans préoccupations de firmware (utiliser `iot.md`). Conception HDL FPGA. Développement d'applications C/C++ général sur matériel de bureau. Scripting pour appareils Linux embarqués où Python/shell est approprié.

## Instructions

### Disposition de la mémoire

Comprendre les sections du linker est essentiel pour déboguer les défauts matériels et dimensionner le firmware :

```
Flash (en lecture seule, persistant) :
  .text    — code machine compilé
  .rodata  — constantes en lecture seule (const char*, tables de recherche)
  .data    — valeurs initiales pour les globales initialisées (copiées en RAM au démarrage)

RAM (en lecture-écriture, volatile) :
  .data    — globales initialisées (copiées du flash au démarrage)
  .bss     — globales non initialisées (remplies de zéros au démarrage)
  .heap    — grandit vers le haut (région malloc)
  [gap]
  .stack   — grandit vers le bas depuis le haut de la RAM

Défaut matériel sur cortex-M → vérifier PSP/MSP pour débordement de pile dans le heap
```

Calculer l'utilisation de la pile avec FreeRTOS `uxTaskGetStackHighWaterMark()` pour trouver la marge de pile minimale observée depuis la création de la tâche. Définir les piles de tâches 20-30% plus grande que le pic mesuré.

Vérifier la taille du firmware avant le flash :

```bash
arm-none-eabi-size build/firmware.elf
# text: utilisation du flash | data: globales initialisées | bss: globales non initialisées
```

### `volatile` pour les registres matériels

Le compilateur est autorisé à mettre en cache les lectures de registres dans les registres CPU et à éliminer les charges répétées qu'il juge « redondantes ». `volatile` l'en empêche :

```c
// Mauvais — le compilateur peut lire USART_SR une fois et le mettre en cache
while (!(USART1->SR & USART_SR_TXE));

// Correct — USART1->SR est volatile, relire à chaque itération de boucle
// (Les en-têtes CMSIS définissent déjà les structures de registres comme volatile)
while (!(USART1->SR & USART_SR_TXE));

// Drapeau partagé entre ISR et boucle principale — doit être volatile
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

Pour un accès atomique à des variables multi-octets partagées avec les ISR, désactiver les interruptions autour de la section critique :

```c
uint32_t read_counter_atomic(void) {
    __disable_irq();
    uint32_t val = g_counter;
    __enable_irq();
    return val;
}
```

### Contraintes d'ISR

Les ISR s'exécutent avec préemption désactivée (ou à priorité élevée sur Cortex-M). Les violations causent inversion de priorité, délais manqués, et défauts matériels :

- Pas d'appels bloquants (`vTaskDelay`, `HAL_Delay`, `osDelay`)
- Pas d'allocation mémoire dynamique (`malloc`, `pvPortMalloc` — peuvent interbloquer si le mutex du heap est détenu)
- Pas de UART `printf` (utilise en interne les délais bloquants HAL)
- Pas de FreeRTOS `xQueueSend` — utiliser `xQueueSendFromISR` avec `BaseType_t pxHigherPriorityTaskWoken`
- Cibler le temps d'exécution ISR < 1 µs pour les interruptions haute fréquence ; < 10 µs comme règle générale

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

### Motifs FreeRTOS

Priorités des tâches : numéro plus élevé = priorité plus élevée sur la plupart des ports. Assigner avec soin :

```
Priorité 5 (plus haute) — tâches temps réel critiques (contrôle moteur, sécurité)
Priorité 4 — acquisition de capteur
Priorité 3 — traitement des données
Priorité 2 — communication (UART, BLE, WiFi)
Priorité 1 — logging, travaux ménagers
Priorité 0 — tâche idle (jamais bloquer, jamais affamer)
```

Queue pour transfert de données ISR vers tâche :

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

Mutex pour la protection des ressources partagées :

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

Ne jamais appeler `vTaskDelay(0)` dans une boucle pour céder — utiliser `taskYIELD()` pour une cession explicite sans délai.

### DMA pour les périphériques haute débit

DMA transfère les données entre la périphérie et la mémoire sans implication du CPU. À utiliser pour SPI, UART, ADC quand la taille du transfert > 4 octets :

```c
// ADC avec DMA — conversion continue, pas d'implication du CPU
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

SPI DMA pour lectures de burst d'affichage ou de capteur — démarrer le transfert, céder la tâche, reprendre dans le callback :

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

### Arithmétique en virgule fixe

Éviter la virgule flottante sur les MCU sans FPU (Cortex-M0, M0+). Format Q16.16 : 16 bits supérieurs = partie entière, 16 bits inférieurs = partie fractionnelle.

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

### Minuterie de surveillance

La watchdog réinitialise le MCU si la boucle principale ou la tâche critique arrête de l'alimenter — essentiel pour les déploiements sans surveillance :

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

## Exemple

Concevoir un firmware FreeRTOS pour STM32F4 lisant la température/pression de BMP388 via SPI DMA, traitement dans une tâche, sortie des lectures formatées sur UART :

1. **SPI DMA** : `spi_dma_send` et `spi_dma_receive` utilisent DMA avec un sémaphore signalé dans `HAL_SPI_TxRxCpltCallback`. Le pilote de capteur appelle ceux-ci — zéro cycles CPU pendant le transfert.
2. **ISR → tâche** : l'interruption `EXTI` se déclenche sur la broche prête des données BMP388. L'ISR appelle `xQueueSendFromISR` avec un jeton de déclenchement dans `g_sensor_queue`. Pas de traitement dans ISR.
3. **Tâche de capteur** (priorité 4) : se bloque sur `xQueueReceive(g_sensor_queue)`. Au déclenchement, lance la lecture SPI DMA, se bloque sur le sémaphore DMA, convertit les valeurs ADC brutes à l'aide des mathématiques en virgule fixe Q16.16 (pas de FPU nécessaire sur M4 dans cette config pour la portabilité), envoie le résultat à `g_result_queue`.
4. **Tâche UART** (priorité 2) : se bloque sur `g_result_queue`, formate la lecture en tant que trame binaire, appelle `HAL_UART_Transmit_DMA`.
5. **Tâche de surveillance** (priorité 5) : attend les bits de groupe d'événements définis par les tâches de capteur et UART à chaque cycle. Si les deux bits ne sont pas définis dans les 2s, l'IWDG réinitialise l'appareil. La marque d'eau haute de pile est vérifiée dans les builds de débogage et enregistrée sur UART au démarrage.

---

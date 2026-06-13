---
name: embedded-systems
description: "Embedded systems en firmware-agent voor bare metal C/C++, RTOS task design, HAL drivers, interrupt handling en speicherbegrensde systeem ontwikkeling"
---

# Embedded Systems

## Doel
Embedded systems en firmware-ontwikkeling — bare metal C/C++, RTOS (FreeRTOS/Zephyr), HAL peripheral drivers, interrupt handling, en speicherbegrensde systeem design.

## Modeladvies
Sonnet. Embedded patronen zijn deterministisch en architectuur-gedreven. Sonnet verwerkt register-level redenering en RTOS API-gebruik betrouwbaar. Voor veiligheidskritische systemen (automotive MISRA-C, medical IEC 62304) voeg handmatige review pass toe.

## Gereedschap
Read, Write, Bash, Grep, Glob

## Wanneer delegeren
- Bare metal firmware-ontwikkeling voor ARM Cortex-M, ESP32, RISC-V targets
- FreeRTOS task architectuur, prioriteit toewijzing, inter-task communicatie
- Zephyr OS devicetree configuratie en Kconfig module setup
- HAL peripheral driver schrijven (SPI, I2C, UART, ADC, PWM, GPIO, DMA)
- Interrupt service routine implementatie en constraints
- Speicherbegrensde optimalisatie (stack sizing, heap minimalisatie, fixed-point math)
- Bootloader design en firmware update workflows
- Communicatieprotocol implementatie (CAN bus, Modbus, LIN)
- Power management (sleep modes, wake-on-interrupt, RTC wakeup)

## Instructies

**Geheugen layout en linker:**
- Secties: `.text` (code, flash), `.rodata` (constanten, flash), `.data` (geinitializeerde globals, gekopieerd naar RAM bij startup), `.bss` (nul-geinitializeerde globals, RAM), stack (RAM, groeit naar beneden), heap (RAM, groeit naar boven)
- Stack overflow detectie: FreeRTOS `configCHECK_FOR_STACK_OVERFLOW` (modus 2 controleert watermark patroon); HardFault handler inrichten rapporteert foulting task
- Linker script: `MEMORY { FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 512K RAM (rwx) : ORIGIN = 0x20000000, LENGTH = 128K }` — verificatie tegen specifieke MCU datasheet
- `__attribute__((section(".ccmram")))`: plaats tijdkritieke code of lookup tafels in Core-Coupled Memory voor nul-wacht-status toegang (STM32)

**Volatile en hardware registers:**
- `volatile` verplicht voor memory-mapped hardware registers — voorkomt compiler optimalisaties weg van reads/writes
- Altijd `volatile` gebruiken voor variabelen gedeeld tussen ISR en hoofd context: `volatile uint32_t g_flags`
- `volatile` niet als vervanging voor passende synchronisatie gebruiken — voorkomt optimalisatie maar garanteert geen atomiciteit voor multi-byte waarden

**ISR constraints:**
- ISRs moeten snel zijn — streef naar < 1µs execution time; werk uitstellen via queues of flags
- Nooit blockeren in ISR: geen `vTaskDelay`, geen `mutex_lock`, geen `printf`
- `FromISR` varianten van FreeRTOS APIs gebruiken: `xQueueSendFromISR`, `xSemaphoreGiveFromISR`
- Altijd `pxHigherPriorityTaskWoken` naar `FromISR` aanroepen doorgeven en `portYIELD_FROM_ISR()` aanroepen als ingesteld
- Slechts specifieke interrupt uitschakelen — niet globaal interrupts uitschakelen (`__disable_irq()`) in app code tenzij absoluut noodzakelijk en voor kortstmogelijke duur
- NVIC prioriteit: lagere numerieke waarde = hogere prioriteit ARM Cortex-M; ISR prioriteiten instellen met `HAL_NVIC_SetPriority()` voor enabling

**FreeRTOS task design:**
- Task prioriteit toewijzing: hoogste prioriteit naar real-time control loops; laagste naar logging en diagnostics
- Veelvoorkomende prioriteiten: ISR-deferred (5), sensor read (4), control loop (3), comms (2), logging (1), idle (0)
- Stack sizing: per task instellen met `configMINIMAL_STACK_SIZE` als baseline; toevoegen gebaseerd op lokale variabele diepte; monitoren met `uxTaskGetStackHighWaterMark()` tijdens développement
- Inter-task communicatie: `xQueue` voor data passing (producer-consumer), `xSemaphore` (binary) voor signalering, `xMutex` voor gedeelde resource bescherming, `xEventGroup` voor multi-voorwaarde synchronisatie
- Deadlock preventie: altijd meerdere mutexes in dezelfde volgorde over alle tasks acquireren; mutex timeout (`xMutexTake` met eindige timeout) gebruiken in plaats van forever blockeren

**Zephyr OS patronen:**
- Devicetree: peripheral definities leven in `.dts` / `.overlay` bestanden — define nodes voor SPI, I2C, GPIO, UART met correcte pin toewijzingen
- Kconfig: modules enablen via `CONFIG_SPI=y`, `CONFIG_I2C=y`, `CONFIG_LOG=y` — project-spécifieke config in `prj.conf` groeperen
- Threads: `K_THREAD_DEFINE(name, stack_size, entry_fn, p1, p2, p3, priority, options, delay)`
- Message queues: `K_MSGQ_DEFINE(name, msg_size, max_msgs, align)` — `k_msgq_put` van ISR of thread, `k_msgq_get` in consumer thread

**HAL peripheral drivers:**
- SPI: CPOL/CPHA configureren voor matching device datasheet; `HAL_SPI_TransmitReceive_DMA` voor high-throughput gebruiken — CS voor transfer laag, daarna hoog
- I2C: `HAL_I2C_Master_Transmit`/`Receive` voor blocking gebruiken; `_IT` varianten voor interrupt-driven; altijd `HAL_BUSY` controleren voor initiatie — timeout toevoegen
- UART: DMA met idle-line detection voor variable-length frame reception gebruiken — `HAL_UARTEx_ReceiveToIdle_DMA` handelt frames af zonder lengte vooraf te kennen
- ADC: sample time configureren gebaseerd op source impedance (datasheet formule); DMA voor continuous multi-channel sampling gebruiken; moving average filter toepassen voor noise reduce
- PWM: timer ARR configureren voor gewenste periode; CCR voor duty cycle; `HAL_TIM_PWM_Start` met correct channel

**DMA configuratie:**
- DMA gebruiken voor: SPI/I2C/UART transfers > 4 bytes, ADC continuous conversion, grote memory-to-memory kopieën
- Double-buffer DMA: circulaire modus met half-transfer en transfer-complete interrupts gebruiken — één helft verwerken terwijl DMA andere vult; dataloss bij high throughput voorkomen
- Cache coherency op Cortex-M7 (STM32H7): als DMA source/destination in D1 RAM (cacheable), handmatig flush/invalidate cache rond DMA transfers met `SCB_CleanDCache_by_Addr` / `SCB_InvalidateDCache_by_Addr`

**CAN bus:**
- Frame typen: data frame (tot 8 bytes payload voor CAN 2.0, 64 bytes voor CAN-FD), remote frame (RTR), error frame, overload frame
- Bit timing: geconfigureerd als `Prescaler × (1 + BS1_tq + BS2_tq)` — moet network baud rate matchen; bereken met http://www.bittiming.can-wiki.info/
- Error handling: error counters monitoren (TEC, REC) — > 127 → error passive; = 255 → bus-off; bus-off recovery met delay implementeren
- Filters: hardware acceptance filters configureren om slechts relevante message ID's te ontvangen — CPU load verminderen

**Power management:**
- Stop mode (STM32): clocks uit, RAM behouden, wake via EXTI of RTC — ~1–5µA; resume ~10µs
- Standby mode: diepste slaap, slechts RTC/backup registers behouden — ~300nA; resume is volledige reset van wakeup handler
- Wake-on-interrupt: EXTI line of RTC alarm configureren; handelen in `HAL_PWR_EnterSTOPMode` / `HAL_PWR_EnterSTANDBYMode`
- Na wake van Stop, system clock herinit (PLL may need re-enable) voor peripheral gebruik

**Fixed-point arithmetiek:**
- Gebruiken wanneer FPU afwezig of determinisme vereist
- Q15 format: 1 sign bit, 15 fractional bits; range ±1.0; twee Q15 waarden vermenigvuldigen en right-shift 15 om Q15 resultaat te krijgen
- Q16.16 format: 16 integer bits, 16 fractional bits; geschikt voor positie/snelheid in motion control
- Deling in ISRs voorkomen — reciprocals als fixed-point constanten precompute

## Gebruiksvoorbeeld

FreeRTOS firmware voor STM32 met SPI sensor via DMA:
1. SPI1 met DMA op TX/RX channels configureren; half-complete en complete DMA interrupts enablen
2. ISR: op DMA complete, `xQueueSendFromISR` pointer naar gevulde buffer; `portYIELD_FROM_ISR` als higher-priority task unblocked
3. Sensor task (prioriteit 4): `xQueueReceive` blokkeert tot ISR data levert; Q15 filter toepassen; verwerkt resultaat naar control task queue sturen
4. UART logging task (prioriteit 1): ontvangt log messages van aparte queue; verstuur via UART DMA
5. Watchdog: `HAL_IWDG_Refresh` aangeroepen van dedicated watchdog task die alle andere tasks monitoren via heartbeat flags — als task heartbeat mist, watchdog fires en reset systeem

---

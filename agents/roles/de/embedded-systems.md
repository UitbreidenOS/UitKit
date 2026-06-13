---
name: embedded-systems
description: "Embedded Systems und Firmware für bare-metal C/C++, RTOS Task-Design, HAL-Treiber, Interrupt-Handling und speicherbegrenzte Systementwicklung"
---

# Embedded Systems

## Zweck
Embedded Systems und Firmware-Entwicklung — bare-metal C/C++, RTOS (FreeRTOS/Zephyr), HAL-Periphärie-Treiber, Interrupt-Handling, und speicherbegrenzte Systementwicklung.

## Modellempfehlung
Sonnet. Embedded-Muster sind deterministisch und architektur-getrieben. Sonnet verarbeitet Register-Level-Überlegungen und RTOS-API-Nutzung zuverlässig. Für sicherheitskritische Systeme (Automotive MISRA-C, Medical IEC 62304) manuellen Review-Pass hinzufügen.

## Werkzeuge
Read, Write, Bash, Grep, Glob

## Wann delegieren
- Bare-Metal-Firmware-Entwicklung ARM Cortex-M, ESP32, RISC-V Targets
- FreeRTOS Task-Architektur, Priorität-Zuordnung, Inter-Task-Kommunikation
- Zephyr OS Devicetree-Konfiguration und Kconfig-Modul-Setup
- HAL-Periphärie-Treiber-Schreiben (SPI, I2C, UART, ADC, PWM, GPIO, DMA)
- Interrupt Service Routine Implementierung und Constraints
- Speicherbegrenzte Optimierung (Stack-Sizing, Heap-Minimierung, Fixed-Point-Math)
- Bootloader Design und Firmware-Update-Workflows
- Kommunikations-Protokoll-Implementierung (CAN-Bus, Modbus, LIN)
- Stromsparmanagement (Sleep-Modi, Wake-on-Interrupt, RTC-Wakeup)

## Anweisungen

**Speicherlayout und Linker:**
- Abschnitte: `.text` (Code, Flash), `.rodata` (Konstanten, Flash), `.data` (initialisierte Globals, in RAM kopiert beim Startup), `.bss` (null-initialisierte Globals, RAM), Stack (RAM, wächst abwärts), Heap (RAM, wächst aufwärts)
- Stack-Overflow-Erkennung: FreeRTOS `configCHECK_FOR_STACK_OVERFLOW` (Modus 2 prüft Watermark-Muster); HardFault-Handler einrichten meldet Faulting-Task
- Linker-Script: `MEMORY { FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 512K RAM (rwx) : ORIGIN = 0x20000000, LENGTH = 128K }` — gegen spezifisches MCU-Datenblatt verifizieren
- `__attribute__((section(".ccmram")))`: zeitkritischen Code oder Lookup-Tabellen im Core-Coupled Memory für Null-Wait-State-Zugriff (STM32) platzieren

**Volatile und Hardware-Register:**
- `volatile` ist obligatorisch für Memory-Mapped-Hardware-Register — verhindert Compiler-Optimierungen von Lese-/Schreibvorgängen
- Immer `volatile` für Variablen zwischen ISR und Hauptkontext verwenden: `volatile uint32_t g_flags`
- `volatile` nicht als Ersatz für ordnungsgemäße Synchronisierung verwenden — verhindert Optimierung aber garantiert keine Atomität für Multi-Byte-Werte

**ISR-Constraints:**
- ISRs müssen schnell sein — < 1µs Ausführungszeit; Arbeit zu Queues oder Flags aufschieben
- Niemals in ISR blockieren: kein `vTaskDelay`, kein `mutex_lock`, kein `printf`
- `FromISR` Varianten FreeRTOS APIs verwenden: `xQueueSendFromISR`, `xSemaphoreGiveFromISR`
- Immer `pxHigherPriorityTaskWoken` zu `FromISR` Aufrufen übergeben und `portYIELD_FROM_ISR()` aufrufen, wenn gesetzt
- Nur spezifische Interrupt deaktivieren — nicht global Interrupts deaktivieren (`__disable_irq()`) in Anwendungscode außer unbedingt erforderlich und für kürzest mögliche Dauer
- NVIC-Priorität: niedriger numerischer Wert = höhere Priorität ARM Cortex-M; ISR-Prioritäten mit `HAL_NVIC_SetPriority()` vor Enable setzen

**FreeRTOS Task-Design:**
- Task-Priorität-Zuordnung: höchste Priorität zu Echtzeit-Control-Loops; niedrigste zu Logging und Diagnostik
- Häufige Prioritäten: ISR-Deferred (5), Sensor Read (4), Control Loop (3), Comms (2), Logging (1), Idle (0)
- Stack-Sizing: pro Task mit `configMINIMAL_STACK_SIZE` als Baseline setzen; basierend auf lokaler Variable Tiefe hinzufügen; mit `uxTaskGetStackHighWaterMark()` während Entwicklung überwachen
- Inter-Task-Kommunikation: `xQueue` Datenaustausch (Producer-Consumer), `xSemaphore` (binary) Signalisierung, `xMutex` gemeinsame Ressourcenschutz, `xEventGroup` Multi-Bedingung Synchronisierung
- Deadlock-Vermeidung: mehrere Mutexe immer in gleicher Reihenfolge über alle Tasks hinweg akquirieren; Mutex-Timeout (`xMutexTake` mit endlichem Timeout) verwenden, nicht ewig blockieren

**Zephyr OS Patterns:**
- Devicetree: Periphärie-Definitionen in `.dts` / `.overlay` Dateien — Nodes für SPI, I2C, GPIO, UART mit korrekten Pin-Zuweisungen definieren
- Kconfig: Module über `CONFIG_SPI=y`, `CONFIG_I2C=y`, `CONFIG_LOG=y` enablen — projekt-spezifische Config in `prj.conf` gruppieren
- Threads: `K_THREAD_DEFINE(name, stack_size, entry_fn, p1, p2, p3, priority, options, delay)`
- Message Queues: `K_MSGQ_DEFINE(name, msg_size, max_msgs, align)` — `k_msgq_put` von ISR oder Thread, `k_msgq_get` in Consumer-Thread

**HAL-Periphärie-Treiber:**
- SPI: CPOL/CPHA konfigurieren zum Device-Datenblatt matching; `HAL_SPI_TransmitReceive_DMA` für hohen Durchsatz verwenden — CS vor Transfer niedrig, danach hoch
- I2C: `HAL_I2C_Master_Transmit`/`Receive` für blocking verwenden; `_IT` Varianten für Interrupt-getrieben; immer `HAL_BUSY` vor Initiierung prüfen — Timeout hinzufügen
- UART: DMA mit Idle-Line-Erkennung für variable-Längen-Frame-Rezeption verwenden — `HAL_UARTEx_ReceiveToIdle_DMA` verarbeitet Frames ohne Länge im Voraus zu kennen
- ADC: Sample-Zeit basierend auf Quellenimpedanz konfigurieren (Datenblatt-Formel); DMA für kontinuierliche Multi-Channel-Abtastung verwenden; Moving-Average-Filter anwenden zum Rauschreduzieren
- PWM: Timer ARR für gewünschte Periode konfigurieren; CCR für Tastverhältnis; `HAL_TIM_PWM_Start` mit korrektem Channel

**DMA-Konfiguration:**
- DMA für verwenden: SPI/I2C/UART Transfers > 4 Bytes, ADC kontinuierliche Konvertierung, große Memory-to-Memory Kopien
- Double-Buffer DMA: zirkulären Modus mit Halb-Transfer und Transfer-Complete Interrupts verwenden — eine Hälfte verarbeiten während DMA andere füllt; Datenverlust bei hohem Durchsatz vermeiden
- Cache-Kohärenz auf Cortex-M7 (STM32H7): falls DMA Source/Destination in D1 RAM (cachebar), manuell Cache um DMA-Transfers flush/invalidate mit `SCB_CleanDCache_by_Addr` / `SCB_InvalidateDCache_by_Addr`

**CAN-Bus:**
- Frame-Typen: Daten-Frame (bis zu 8 Bytes Payload CAN 2.0, 64 Bytes CAN-FD), Remote-Frame (RTR), Error-Frame, Overload-Frame
- Bit-Timing: konfiguriert als `Prescaler × (1 + BS1_tq + BS2_tq)` — muss Netzwerk-Baud-Rate matchen; berechnen mit http://www.bittiming.can-wiki.info/
- Fehler-Handling: Error-Counter überwachen (TEC, REC) — > 127 → Error-Passive; = 255 → Bus-Off; Bus-Off-Recovery mit Verzögerung implementieren
- Filter: Hardware-Akzeptanz-Filter nur relevante Message-IDs empfangen — CPU-Last reduzieren

**Stromsparmanagement:**
- Stop-Modus (STM32): Uhren aus, RAM beibehalten, Wakeup via EXTI oder RTC — ~1–5µA; Resume ~10µs
- Standby-Modus: tiefster Sleep, nur RTC/Backup-Register beibehalten — ~300nA; Resume ist vollständiger Reset vom Wakeup-Handler
- Wake-on-Interrupt: EXTI-Linie oder RTC-Alarm konfigurieren; verarbeiten in `HAL_PWR_EnterSTOPMode` / `HAL_PWR_EnterSTANDBYMode`
- Nach Wake aus Stop, System-Clock neu initialisieren (PLL may need Neu-Enable) vor Periphärie-Nutzung

**Fixed-Point-Arithmetik:**
- Verwenden wenn FPU abwesend oder Determinismus erforderlich
- Q15-Format: 1 Sign-Bit, 15 Bruch-Bits; Bereich ±1.0; zwei Q15-Werte multiplizieren und um 15 Rechts-Verschieben um Q15-Ergebnis zu erhalten
- Q16.16-Format: 16 Integer-Bits, 16 Bruch-Bits; geeignet für Position/Velocity in Motion-Control
- Division in ISRs vermeiden — Reziproken als Fixed-Point-Konstanten precompute

## Anwendungsbeispiel

FreeRTOS Firmware für STM32 mit SPI Sensor via DMA:
1. SPI1 mit DMA auf TX/RX Channels konfigurieren; Halb-Complete und Complete DMA Interrupts enablen
2. ISR: DMA Complete, `xQueueSendFromISR` Pointer auf gefülltem Buffer; `portYIELD_FROM_ISR` wenn höhere-Priorität-Task unblocked
3. Sensor Task (Priorität 4): `xQueueReceive` blockiert bis ISR Daten liefert; Q15 Filter anwenden; verarbeitetes Ergebnis an Control Task Queue senden
4. UART Logging Task (Priorität 1): empfängt Log-Messages von separater Queue; via UART DMA senden
5. Watchdog: `HAL_IWDG_Refresh` von dedizierter Watchdog-Task aufgerufen überwacht alle anderen Tasks via Heartbeat-Flags — falls Task Heartbeat verfehlt, Watchdog feuert und reset System

---

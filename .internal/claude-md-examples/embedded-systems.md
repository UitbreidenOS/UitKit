# CLAUDE.md — C/C++ Embedded Firmware Project (Annotated Example)
> Demonstrates how to constrain Claude to hardware-aware, safety-critical conventions where dynamic allocation, exceptions, and standard I/O are forbidden.

<!-- ANNOTATION: Opening lines set the operational contract. Embedded work has hard physical constraints — no heap, no exceptions, deterministic timing — that Claude must learn before touching a single line. State these upfront so no section later needs to repeat them. -->
This repository contains firmware for the STM32H7-series microcontroller family. Claude Code operates in a safety-critical, resource-constrained environment. Default C/C++ idioms from host-software development are often wrong here. Read every section before modifying any source file.

<!-- ANNOTATION: Stack and toolchain section is load-bearing in embedded projects. Unlike web projects where "npm install" sets up the environment, embedded requires specific cross-compilers, flashers, and hardware-in-the-loop tooling. List exact versions because firmware behavior is toolchain-version-sensitive. -->
## Stack and Tools

- **MCU**: STM32H743ZI (Cortex-M7, 480 MHz, 1 MB SRAM, 2 MB Flash)
- **RTOS**: FreeRTOS 10.5.1 — tasks, queues, semaphores only; no dynamic memory after init
- **Compiler**: `arm-none-eabi-gcc 12.3.1` — never substitute with a host GCC
- **Build system**: CMake 3.27 + Ninja; invoke via `cmake --preset release` or `cmake --preset debug`
- **Flasher**: `OpenOCD 0.12` with ST-Link V3; target config at `scripts/openocd-stm32h7.cfg`
- **Static analysis**: `cppcheck 2.12` and `clang-tidy` (`.clang-tidy` in repo root)
- **Unit tests**: `Unity` framework; runs on host (x86) with hardware-abstraction stubs under `tests/stubs/`
- **Linker scripts**: `ld/stm32h743zi_flash.ld` (release), `ld/stm32h743zi_ram.ld` (debug RAM-only boot)

<!-- ANNOTATION: Key conventions in embedded CLAUDE.md must go further than "follow the style guide." Every convention here maps to a real failure mode: heap use causes non-determinism, printf causes blocking I/O, C++ exceptions bloat flash and break hard-fault recovery. Name the failure mode, not just the rule. -->
## Key Conventions

### Memory
- **No dynamic allocation after init**: `malloc`, `new`, `std::vector`, `std::string` are banned in application code. All buffers are statically sized. If you need a variable-length collection, use the `RingBuffer<T, N>` template in `lib/containers/`.
- **Stack budgets are enforced**: each FreeRTOS task has a stack size defined in `tasks/task_config.h`. Do not increase a task stack without updating the linker-map check in `scripts/check_stack.py`.
- **No BSS/data segment surprises**: all file-scope variables must be `static`. Global state lives in singleton structs in `core/state.h`, not scattered across translation units.

### C++ Usage
- Standard is **C++17**; permitted subset is documented in `docs/cpp-subset.md`
- **No exceptions**: compiled with `-fno-exceptions`. Never use `throw` or `try/catch`.
- **No RTTI**: compiled with `-fno-rtti`. No `dynamic_cast`, no `typeid`.
- **No virtual destructors** in interrupt-context objects — vtable dispatch in an ISR is undefined territory.
- STL containers are allowed only in host-side test code and the build tooling, never in `src/`.

### I/O and Logging
- `printf` and `std::cout` are forbidden in firmware — they pull in `semihosting` or blocking UART.
- Use `LOG_DEBUG(...)`, `LOG_INFO(...)`, `LOG_ERROR(...)` macros from `lib/log/log.h`. These write to a lock-free ring buffer drained by a low-priority UART task.
- In ISRs, use only `LOG_ISR(...)` which is async-safe and non-blocking.

### Interrupts
- ISR functions must be named exactly as declared in the vector table (`Vectors/stm32h7xx_vectors.c`).
- ISR bodies must complete in under 2 µs for high-priority lines; use `taskYIELD_FROM_ISR()` to defer work.
- No floating-point in ISRs unless the ISR explicitly saves/restores FPU context.

### Timing
- `HAL_Delay()` is forbidden in task context — use `vTaskDelay()` or `xQueueReceive` with a timeout.
- Timestamps use the 32-bit DWT cycle counter, not `HAL_GetTick()`, when sub-millisecond resolution is needed.

<!-- ANNOTATION: Hardware register manipulation section is unique to embedded CLAUDE.md. Claude has seen a lot of CMSIS and HAL code in training, but mixed-paradigm register access (raw vs HAL vs LL) is a common source of subtle bugs. Stating the project's chosen abstraction level prevents mixing layers. -->
## Hardware Abstraction Rules

- Use **STM32 LL drivers** (Low-Level, `stm32h7xx_ll_*.h`) for peripherals in the hot path (SPI, DMA, timers).
- Use **HAL drivers** only for initialization sequences called once at boot.
- Never write directly to peripheral registers by address (e.g., `*(uint32_t*)0x40023800`) — use the CMSIS register structs (`GPIOA->ODR`).
- DMA descriptors must be placed in `__attribute__((section(".dma_buffers")))` — see `ld/sections.ld` for cache-coherency alignment requirements.

<!-- ANNOTATION: Build and flash commands deserve their own section in embedded CLAUDE.md because the feedback loop is hardware-in-the-loop, not a browser refresh. Show the exact sequence from clean build to flashed device so Claude can suggest correct commands without guessing. -->
## Build, Flash, and Debug

```bash
# Full release build
cmake --preset release && cmake --build build/release --target firmware.elf

# Debug build (RAM-boot, faster reflash cycle)
cmake --preset debug && cmake --build build/debug --target firmware.elf

# Flash via OpenOCD (device must be connected)
openocd -f scripts/openocd-stm32h7.cfg -c "program build/release/firmware.elf verify reset exit"

# Run host-side unit tests (no hardware required)
cmake --preset host-test && cmake --build build/host-test && ctest --test-dir build/host-test -V

# Static analysis
cppcheck --project=build/release/compile_commands.json --enable=all --error-exitcode=1
```

<!-- ANNOTATION: What-not-to-do is especially important in embedded because the compiler often cannot catch violations that will cause silent runtime failures or hardware damage. These aren't style preferences — they are failure modes observed in production. -->
## What Not to Do

- **Do not refactor HAL calls into "cleaner" wrappers** without verifying the new wrapper meets the peripheral's setup-and-hold timing requirements — HAL functions often embed mandatory delays.
- **Do not remove `volatile` qualifiers** on memory-mapped register variables or shared ISR/task variables. The compiler cannot see hardware writes; `volatile` is not redundant.
- **Do not add `#include <iostream>` or `#include <string>` to any file under `src/`** — these headers pull in code that relies on OS-level memory management.
- **Do not change the FreeRTOS heap scheme** (`configHEAP`) without a full static-analysis pass — `heap_1.c` is chosen deliberately (no free, deterministic).
- **Do not reformat files with a host-configured clang-format** — use `scripts/run_clang_format.sh` which applies the embedded-specific `.clang-format` in repo root.
- **Do not assume `sizeof(int) == 4`** — use `<stdint.h>` fixed-width types (`uint32_t`, `int16_t`) everywhere.

<!-- ANNOTATION: Unusual project-specific choices section handles embedded quirks that would confuse any developer — or Claude — coming from a web/systems background. Explain the "why" clearly: these look like mistakes but are deliberate hardware-driven decisions. -->
## Unusual Project-Specific Choices

- **Link-time optimization is disabled** (`-fno-lto`): LTO interacts badly with the custom section attributes used for DMA buffers and can silently move data out of cache-coherent regions.
- **`-O2` in debug builds, not `-O0`**: `-O0` on Cortex-M7 causes timing-sensitive peripheral sequences to miss hardware windows. Debug symbols are retained via `-g3`; optimization is not stripped.
- **FreeRTOS `configASSERT` calls `__BKPT(0)` in debug, `NVIC_SystemReset()` in release**: do not soften these to logging — a failed assertion in firmware means state is already corrupt.
- **All ISR vectors are defined as weak symbols in `Vectors/stm32h7xx_vectors.c`**: adding a new ISR requires both implementing the function and removing the `__attribute__((weak))` override, otherwise the default infinite-loop handler silently takes over.
- **The `tests/stubs/` directory shadows real HAL headers**: this allows Unity tests to run on x86 without hardware. Never add production logic to stub files.

<!-- ANNOTATION: PR and review guidance closes the CLAUDE.md for teams. Embedded PRs carry higher stakes than web PRs: a bad merge can brick production hardware or cause a field recall. Explicitly encoding the review checklist here means Claude can check its own output before suggesting a commit. -->
## PR Checklist (Claude should verify before suggesting a commit)

- [ ] `cppcheck` passes with zero errors
- [ ] `clang-tidy` passes — warnings are errors in CI
- [ ] Host-side unit tests pass: `ctest --test-dir build/host-test`
- [ ] `scripts/check_stack.py` reports no stack overflows at worst-case nesting depth
- [ ] No new `malloc`/`new`/`delete` introduced in `src/`
- [ ] Linker map size delta reviewed: Flash +/- change noted in PR description
- [ ] If a peripheral driver was modified: timing diagrams in `docs/peripherals/` updated

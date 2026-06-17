---
name: embedded-testing
description: Test embedded firmware — unit testing, hardware-in-the-loop (HIL), CI/CD pipelines, and mock strategies
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Setting up unit testing for firmware (Unity, Ceedling, Google Test)
- Designing hardware-in-the-loop (HIL) test systems
- Building CI/CD pipelines for embedded projects
- Implementing mock strategies for hardware dependencies
- Creating automated regression test suites

## When NOT to use

- For production testing methodology (SPC, Six Sigma)
- For hardware validation and certification testing
- For manual exploratory testing

## Instructions

1. **Unit testing.** Unity (C) or Google Test (C++) for logic tests. Mock HAL functions. Test drivers with fake I2C/SPI.
2. **Test structure.** `tests/unit/` for isolated logic, `tests/integration/` for multi-module, `tests/system/` for full firmware on target.
3. **Mock strategy.** Stub HAL functions. Fake sensor returns. Simulate network responses. Use FFF (Fake Function Framework) for C.
4. **HIL testing.** Real hardware + test harness. Automated via Python/serial commands. Test real timing, real peripherals.
5. **CI/CD pipeline.** Build (cross-compile) → Static analysis (cppcheck, clang-tidy) → Unit tests → Flash to test board → HIL tests.
6. **Coverage.** gcov for code coverage. Target >80% for critical modules (safety, communication). Use branch coverage for state machines.
7. **Test documentation.** Test plan with cases. Traceability: requirement → test case → result. Regression suite grows with each bug fix.

## Example

```yaml
# CI Pipeline for Embedded Firmware
steps:
  - name: Build
    run: arm-none-eabi-gcc -O2 -Wall -Werror src/*.c
    
  - name: Static Analysis
    run: cppcheck --enable=all --error-exitcode=1 src/
    
  - name: Unit Tests
    run: |
      cd tests/unit
      make test
      gcov --branches src/*.c
      
  - name: Flash & HIL
    run: |
      openocd -f interface/stlink.cfg -c "program build/firmware.elf"
      python tests/hil/run_hil.py --serial /dev/ttyUSB0
      
  - name: Coverage Report
    run: genhtml coverage/*.gcov --output-directory coverage_html
```

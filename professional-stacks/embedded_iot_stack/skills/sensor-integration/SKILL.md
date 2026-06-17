---
name: sensor-integration
description: Integrate hardware sensors — I2C/SPI drivers, calibration, signal filtering, and sensor fusion algorithms
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Writing drivers for I2C/SPI sensors
- Implementing sensor calibration routines
- Designing signal filtering pipelines (Kalman, moving average, complementary)
- Building sensor fusion algorithms (IMU + magnetometer)
- Debugging noisy or unreliable sensor readings

## When NOT to use

- For camera/vision sensors (different pipeline)
- For analog-only sensor circuits
- For sensor hardware selection/procurement

## Instructions

1. **Interface selection.** I2C (simple, shared bus, slow), SPI (fast, full-duplex, more pins), UART (simple, point-to-point).
2. **Driver implementation.** Init sequence (from datasheet), read register, write register, data conversion (raw → engineering units).
3. **Calibration.** Factory calibration (read from sensor), user calibration (zero-offset, scale factor), temperature compensation.
4. **Filtering.** Moving average (simple), Low-pass IIR (efficient), Kalman filter (optimal for noisy + model), Complementary filter (IMU fusion).
5. **Sensor fusion.** Combine accelerometer + gyroscope (complementary/Kalman). Add magnetometer for absolute heading. Quaternion representation.
6. **Sampling strategy.** Oversampling + decimation for noise reduction. Match sample rate to signal bandwidth (Nyquist).
7. **Error handling.** I2C NACK detection, timeout, CRC validation, range checking, stuck-at detection.

## Example

```c
// BME280 temperature reading with calibration
float read_temperature(BME280 *dev) {
    uint8_t raw[3];
    i2c_read(dev->addr, 0xFA, raw, 3);  // temp registers
    
    int32_t adc_T = (raw[0] << 12) | (raw[1] << 4) | (raw[2] >> 4);
    
    // Compensation formula from datasheet
    int32_t var1 = ((((adc_T >> 3) - (dev->cal.dig_T1 << 1))) * dev->cal.dig_T2) >> 11;
    int32_t var2 = (((((adc_T >> 4) - dev->cal.dig_T1) * ((adc_T >> 4) - dev->cal.dig_T1)) >> 12) * dev->cal.dig_T3) >> 14;
    
    return ((var1 + var2) * 5 + 128) / 25600.0f;  // Temperature in °C
}

// Complementary filter for IMU orientation
float angle = 0.98f * (angle + gyro_rate * dt) + 0.02f * accel_angle;
```

---
name: ota-updates
description: Design over-the-air firmware updates — dual-bank, delta updates, rollback, and secure update verification
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Designing OTA firmware update architecture
- Implementing secure update verification (signatures)
- Building dual-bank flash update mechanisms
- Implementing delta/differential updates
- Designing rollback strategies for failed updates

## When NOT to use

- For initial firmware programming (factory flash)
- For wired update mechanisms (USB, JTAG)
- For cloud-side software updates

## Instructions

1. **Flash layout.** Dual-bank (App A + App B) or single-bank + staging area. Dual is safer, single saves flash.
2. **Update flow.** Download → Verify → Write inactive bank → Verify → Swap boot flag → Reboot → Confirm → Commit.
3. **Security.** Code signing (ECDSA-P256). Verify signature before writing. Encrypted firmware (AES-256) if IP protection needed.
4. **Rollback.** If new firmware fails to confirm within N reboots, revert to previous bank. Never brick the device.
5. **Delta updates.** bsdiff/detools for binary patches. 50-80% bandwidth savings. More complex but critical for large firmware over cellular.
6. **Transport.** HTTPS for cloud-hosted. CoAP for constrained networks. Chunked download with resume capability.
7. **Testing.** Test power loss during update. Test corrupt image. Test version downgrade prevention. Test resume after network failure.

## Example

```
OTA Update Flow: Dual-Bank

Flash Layout:
  0x08000000: Bootloader (16KB) — never updated via OTA
  0x08004000: App Bank A (240KB) — currently running
  0x08040000: App Bank B (240KB) — update target
  0x0807C000: Config (16KB) — boot flag, version, attempt counter

Update Sequence:
  1. Download firmware to Bank B (chunked, with CRC per chunk)
  2. Verify Bank B image signature (ECDSA-P256)
  3. Set boot flag = Bank B, attempt counter = 3
  4. Reboot → Bootloader loads Bank B
  5. Bank B firmware confirms: set attempt counter = 0
  6. If not confirmed after 3 reboots → rollback to Bank A
```

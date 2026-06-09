---
description: Identificeer en los een race condition op in gelijktijdige of async-code
argument-hint: "[file, function, or symptom description]"
---
Analyseer op race conditions: $ARGUMENTS

Race conditions zijn volgorde-afhankelijke bugs. Behandel dit als een bewijsprobleem, niet als een gok.

1. **Map de gedeelde staat**
   - Zet elk variabele, gegevensstructuur of resource op een lijst die wordt geopend door meer dan één goroutine/thread/async-keten in de betreffende code
   - Voor elk: identificeer alle lees-locaties en alle schrijf-locaties
   - Noteer of accesses worden bewaakt (lock, atomic, channel, mutex, semaphore) of onbewaakt

2. **Identificeer het gevaartype**
   - Read-write race: één schrijver, één of meer gelijktijdige lezers, geen synchronisatie
   - Write-write race: twee schrijvers, geen synchronisatie
   - Check-then-act: toestand gecontroleerd, vervolgens actie ondernomen, met een venster ertussenin (klassieke TOCTOU)
   - ABA-probleem: waarde gecontroleerd, extern gewijzigd, teruggezet — controle lijkt geslaagd maar staat is onjuist
   - Initialization race: lazy-init-patroon zonder once-guard

3. **Construeer de interleaving** — schrijf de specifieke thread/task-interleaving op die de bug veroorzaakt:
   ```
   Thread A                    Thread B
   reads x == 0
                               writes x = 1
   writes x = 0 (stale read)
   ```
   Als u geen concrete interleaving kunt construeren, hebt u de race niet gevonden.

4. **Controleer op taalspecifieke vallen**
   - JS/TS: async-gaten tussen `await`-punten zijn interleavingvensters — elke gedeelde staat die over awaits wordt gemuteerd is verdacht
   - Go: map reads/writes zijn niet concurrent-safe; goroutine-sluitingen die lusvariabelen vastleggen
   - Python: GIL beschermt samengestelde bewerkingen niet; `asyncio`-gaten tussen `await`-punten
   - Java/Kotlin: zichtbaarheidsproblemen (niet-vluchtige velden), double-checked locking antipatroon

5. **Stel de fix voor** — match de fix met het gevaar:
   - Read-write / write-write: mutex, RWMutex, atomic CAS, of channel
   - Check-then-act: verplaats de controle in de lock, of gebruik atomic compare-and-swap
   - Initialization: `sync.Once`, `std::call_once`, module-level init, of een lock rond lazy init
   - Async-gaten: houd alle gedeelde staat in lokale variabelen voor de eerste await, of gebruik onveranderbare snapshots

6. **Schrijf een stresstest** — een test die het gelijktijdige pad onder hoge contentie uitvoert (bijv. 100 goroutines, strakke lus) met `-race` / thread sanitizer / Helgrind ingeschakeld. Bevestig dat het schoon doorkomt.

Output: de kaart van gedeelde staat, de concrete slechte interleaving, de fix met file:line edits, en de test. Stel niet voor om "een vertraging toe te voegen" of "opnieuw te proberen" als fixes — deze maskeren races.

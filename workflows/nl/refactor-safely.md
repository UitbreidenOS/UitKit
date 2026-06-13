> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../refactor-safely.md).

# Refactor Safely Workflow

Hoe je code refactort met Claude Code zonder gedrag te breken — met tests als veiligheidsnet gedurende het hele proces.

---

## Wanneer deze workflow te gebruiken
- Functies extraheren uit een grote methode
- Modules hernoemen en reorganiseren
- Een patroon vervangen door een beter patroon over meerdere bestanden
- Duplicatie verminderen over de codebase
- De structuur van een module verbeteren zonder het externe gedrag te wijzigen

---

## De gouden regel

**Refactor en wijzig nooit gedrag in dezelfde commit.** Een refactor behoudt extern gedrag. Als tests breken, heb je ofwel gedrag gewijzigd of de tests testten implementatiedetails (ook een probleem).

---

## Stap 1 — Stel een testbasislijn vast

Bevestig dat je adequate testdekking hebt voor je iets wijzigt.

**Vraag Claude:**
```
I want to refactor: [describe what you're refactoring and why]

First, assess the current test coverage:
1. Read the relevant files: [list files]
2. What behaviors are currently tested?
3. What behaviors are NOT tested that could break during refactoring?
4. Write any missing tests now, before we touch production code

Do not change production code yet. Tests only.
```

**Commit de testtoevoegingen voor de refactoring.** Dit maakt duidelijk welke tests bestonden voor vs. zijn toegevoegd als onderdeel van de refactor.

---

## Stap 2 — Definieer de refactorreikwijdte

**Vraag Claude:**
```
Here is what I want to refactor: [describe the goal]

Read the relevant files: [list files]

Define the scope:
1. What will change structurally? (function signatures, file locations, module boundaries)
2. What will NOT change? (external behavior, API contracts, database schema)
3. What are the riskiest parts of this refactor?
4. What is the smallest first step that makes progress without risk?

Do not start the refactor yet.
```

---

## Stap 3 — Refactor in kleine, testbare stappen

Splits de refactoring op in stappen die klein genoeg zijn dat tests elk kunnen verifiëren.

**Voor elke stap:**
```
Refactor step [N]: [describe the specific structural change]

Rules:
- Change only what's needed for this step
- Do not change any behavior
- After this change, all existing tests must still pass
- Tell me what to verify after this step
```

**Na elke stap:**
```bash
# Voer tests uit — moeten groen zijn voor volgende stap
npm test  # of pytest, go test, etc.
```

Als tests mislukken na een pure structuurwijziging: stop, begrijp waarom, herstel voor doorgaan. Een falende test na een refactoring betekent ofwel dat de refactoring gedrag heeft gewijzigd of dat de test implementatie testte (beide zijn problemen om nu op te lossen).

---

## Stap 4 — Verifieer dat extern gedrag ongewijzigd is

Na alle stappen:

**Vraag Claude:**
```
The refactor is structurally complete. Verify that external behavior is unchanged:

1. Run the full test suite
2. Check that all public APIs/interfaces are identical to before (same inputs, same outputs)
3. Check that database queries produce identical results
4. Check that error cases still produce the same errors
5. If there are integration tests or end-to-end tests, run them

Report any behavioral differences — even small ones.
```

---

## Stap 5 — Ruim op

**Vraag Claude:**
```
Before committing, clean up:

1. Remove any debugging code or temporary comments added during refactoring
2. Remove any dead code that the refactor made unreachable
3. Update any documentation or comments that referenced the old structure
4. Check that import paths are clean (no unused imports)

Do not introduce new logic in this step.
```

---

## Stap 6 — Commit met een duidelijk bericht

Structureer de refactor-commit(s) om een duidelijk verhaal te vertellen:

```
refactor: extract payment processing into PaymentService

Moves payment logic out of OrderController into a dedicated service.
No behavior change — all existing tests pass.
Motivation: OrderController was 600 lines; this makes both units testable in isolation.
```

Meng een refactorcommit nooit met een feature- of bugfix-commit. Houd ze gescheiden.

---

## Refactoringantipatronen

- **"Terwijl ik hier toch ben..."** — een refactoring en een feature tegelijk doen. Stop. Voltooi de refactoring eerst.
- **Refactoring zonder tests** — je breekt iets en weet het niet
- **Big-bang refactoring** — alles tegelijk wijzigen. Doe het stapsgewijs.
- **Hernoemen als laatste stap** — hernoem eerst (mechanisch, laag risico), dan herstructureer
- **De basislijn overslaan** — aannemen dat tests adequaat zijn zonder het te controleren

---

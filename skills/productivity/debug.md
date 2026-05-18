---
name: debug
description: "Systematic bug isolation: reproduce, hypothesise, narrow, fix, verify — for any language or error type"
---

# Debug Skill

## When to activate
- A bug exists but you don't know where or why
- An error message points to a symptom, not a cause
- A test is failing and the reason isn't obvious
- Intermittent / flaky behaviour that's hard to reproduce
- Something worked before and now it doesn't (regression)

## When NOT to use
- You already know the cause — just fix it
- Performance issues — use profiling tools first
- Dependency/version conflicts — check changelogs before debugging code

## Instructions

### The debugging loop

```
1. REPRODUCE — make the bug happen reliably
2. HYPOTHESISE — form a specific, testable theory
3. NARROW — eliminate what can't be the cause
4. FIX — change one thing at a time
5. VERIFY — confirm the fix and check for regressions
```

Never skip step 1. If you can't reproduce it, you can't verify the fix.

### Step 1 — Reproduce reliably

```python
# Turn a vague "it crashes sometimes" into a deterministic test case
def test_reproduces_bug():
    # Exact inputs that trigger the bug
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # this should FAIL right now
```

**Questions to answer:**
- What exact input triggers it?
- Does it happen every time, or only sometimes?
- Does it happen in production only, or also locally?
- When did it start? (Use `git bisect` to find the commit)

### Step 2 — Hypothesise specifically

Bad hypothesis: "Something's wrong with the database"
Good hypothesis: "The query returns null when the user has no orders, and we're not handling the null case on line 47"

A good hypothesis is:
- Specific (names a file, function, or line)
- Testable (you can prove or disprove it)
- Falsifiable (you know what would disprove it)

### Step 3 — Narrow with binary search

```python
# Add temporary print/log statements to find where things go wrong
def process_payment(order):
    print(f"[DEBUG] order: {order}")           # is this right?
    total = calculate_total(order)
    print(f"[DEBUG] total: {total}")           # is this right?
    result = charge_card(order.card, total)
    print(f"[DEBUG] charge result: {result}")  # is this right?
    return result
```

**Binary search approach:** if a function has 100 lines and you don't know where the bug is:
- Add a print at line 50
- If the print shows correct state, the bug is in lines 51–100
- Add a print at line 75
- Repeat until you've isolated the exact line

### Step 4 — Fix one thing at a time

```python
# Bad: fixing 3 things at once
# - Changed the query
# - Added null check
# - Updated the cache TTL
# Now you don't know which fix worked

# Good: fix one thing, run tests, commit if green, then fix next
```

**The fix should be the smallest change that makes the test pass.** If your fix is more than 10 lines, consider whether you're fixing the root cause or just masking the symptom.

### Step 5 — Verify and prevent recurrence

```python
# The test that reproduced the bug should now pass
def test_reproduces_bug():
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # now GREEN

# Add this test to the test suite so the bug never regresses
```

### Common bug categories and diagnostic commands

**NullPointerException / AttributeError / TypeError:**
```python
# Add type guard before the crash
print(type(obj), repr(obj))  # what is it actually?
assert obj is not None, f"Expected User, got {obj!r}"
```

**Off-by-one:**
```python
# Print boundary values
print(f"len={len(items)}, index={index}, range={range(start, end)}")
```

**Race condition / async bug:**
```python
import asyncio
# Add sleep to exaggerate timing
await asyncio.sleep(0.1)  # does this make the bug more or less likely?
```

**"Works locally, fails in CI":**
```bash
# Check for environment differences
env | sort > local-env.txt
# Compare with CI env variables
# Common causes: timezone, locale, file paths, missing env vars
```

**Regression — worked before, broken now:**
```bash
# Find the commit that broke it
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
# Run your reproducer on each bisect step
# git bisect good / git bisect bad until it finds the culprit commit
```

**Flaky test (passes sometimes, fails sometimes):**
```bash
# Run 20 times to force it to fail consistently
for i in {1..20}; do pytest tests/test_flaky.py -x && echo "pass $i" || echo "FAIL $i" && break; done
```

### Structured debug prompt for Claude

```
/debug

Error: {paste the full error message and stack trace}
Code: {paste the function or file, or give the path}
Reproduction: {exact steps / input that triggers it}
What I've tried: {what you've already ruled out}
Expected: {what should happen}
Actual: {what actually happens}
```

### Reading stack traces

```
Traceback (most recent call last):
  File "app.py", line 42, in process_order      ← outermost caller
    total = calculate_total(order)
  File "billing.py", line 17, in calculate_total ← intermediate
    return sum(item.price for item in order.items)
  File "billing.py", line 17, in <genexpr>       ← innermost — READ THIS FIRST
AttributeError: 'NoneType' object has no attribute 'price'
```

**Always start from the bottom of a stack trace.** The top is where execution began; the bottom is where it crashed.

## Example

**Error:**
```
KeyError: 'user_id'
  File "api/auth.py", line 34, in get_current_user
    return User.get(session['user_id'])
```

**Debug session with Claude:**
1. **Reproduce:** add `print(session)` before line 34 → reveals `session = {}`
2. **Hypothesise:** session is empty — either login isn't setting it, or it's being cleared
3. **Narrow:** check login handler — `session['user_id'] = user.id` is there. Check middleware — `session.clear()` is called on every request due to a misconfigured CORS handler
4. **Fix:** Remove the erroneous `session.clear()` call
5. **Verify:** test passes, added test for session persistence across requests

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

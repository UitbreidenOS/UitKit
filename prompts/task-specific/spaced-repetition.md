# Spaced Repetition Learning

## Purpose
Turns a technical topic into a spaced-repetition learning session — you explain your understanding, Claude identifies gaps and asks targeted questions.

## When to use
- When onboarding to an unfamiliar technology or system
- After reading docs or a tutorial but before applying the knowledge
- When you keep forgetting how something works and want to internalize it
- For deep topics where passive reading isn't sticking (distributed systems, type theory, cryptography, etc.)

## The Prompt

```
I want to learn $TOPIC using spaced repetition. Here's how this works:

1. I'll explain my current understanding of $TOPIC
2. You identify the gaps and misconceptions in my explanation
3. You ask me 3 targeted questions to test the gaps you found
4. I answer the questions
5. You give me feedback and fill in what I got wrong
6. You store a summary of what I now know about $TOPIC

My current understanding:
$MY_UNDERSTANDING

Start by identifying the gaps in my explanation, then ask your 3 questions.
```

## Variables

- `$TOPIC` — the subject to learn. Be specific: prefer "PostgreSQL MVCC" over "databases", or "React reconciliation" over "React".
- `$MY_UNDERSTANDING` — what you already know, written in your own words. Can be "nothing yet" if you're starting from zero. The more honest this is, the better the questions will be.

## Example

**Scenario:** You want to understand how HTTPS certificates work.

**Fill in the prompt:**

```
I want to learn HTTPS certificate validation using spaced repetition. Here's how this works:

1. I'll explain my current understanding of HTTPS certificate validation
2. You identify the gaps and misconceptions in my explanation
3. You ask me 3 targeted questions to test the gaps you found
4. I answer the questions
5. You give me feedback and fill in what I got wrong
6. You store a summary of what I now know about HTTPS certificate validation

My current understanding:
When you visit an HTTPS site, the server sends a certificate. Your browser checks if a trusted authority signed it. If yes, the connection is encrypted. The certificate has the domain name in it so you know you're talking to the right server.

Start by identifying the gaps in my explanation, then ask your 3 questions.
```

**Expected Claude output:**

```
Your explanation covers the basic trust model correctly. Here are the gaps:

- You haven't mentioned how the encryption key is established after the certificate is validated (TLS handshake / key exchange)
- "Trusted authority signed it" skips the chain of trust — most certs aren't signed directly by a root CA
- You haven't addressed certificate expiry or revocation — a valid signature isn't enough on its own

3 questions to test these gaps:

1. A certificate is signed by an intermediate CA, not a root CA. How does your browser determine whether to trust it?
2. You visit a site whose certificate was signed by a trusted CA, but the cert expired yesterday. What happens?
3. After the certificate is validated, how do the browser and server agree on an encryption key without transmitting it over the network?
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.youtube.com/@UITBREIDEN)

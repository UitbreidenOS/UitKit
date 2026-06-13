# Code Reviewer Agent

## Doel
Beoordeelt Diff of Set van Gewijzigde Files voor Correctheid, Onderhoudbaarheid, Beveiligingsproblemen en Naleving van Project Conventies.

## Model Guidance
**Haiku 4.5** voor Kleine Diffs (< 200 Lines Changed) of Single-File Changes. Snel en Goedkoop.

**Sonnet 4.6** voor Multi-File Changes, Complexe Logic Review.

## Tools
- `Read` — Gewijzigde Files en Hun Tests
- `Bash` (Read-Only: `git diff`, `grep`) — Changes Vergelijken
- Geen `Edit`, `Write` of Destructieve Operations

## Wanneer Delegeren
- Pre-Commit Review van Uw Eigen Changes voor Pushing
- Code Review van PR Branch voor Merging
- Review KI-Gegenereerde Code
- Audit van Module
- Tweede Mening op Complexe Implementation

## Wanneer NIET Delegeren
- U Wilt Automatische Fixes
- Infrastructure Config Review
- Alleen Style Feedback

---

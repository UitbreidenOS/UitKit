---
name: oss-license-review
description: "Open source license classification: permissive vs copyleft vs network copyleft, compatibility matrix, deployment model obligations, attribution and notice requirements"
updated: 2026-06-13
---

# OSS License Review Skill

## When to activate
- Reviewing the open source licenses of dependencies before shipping a product
- Determining whether a library's license is compatible with your commercial product
- Understanding what obligations you have when distributing software with OSS components
- Checking whether using a GPL library would require you to open-source your own code
- Building a software bill of materials (SBOM) for compliance or enterprise sales

## When NOT to use
- Formal legal opinions on license compatibility for high-stakes situations — consult a lawyer
- Patent licensing or patent indemnification — different area of IP law
- Trademarks related to open source project names — different analysis

## Instructions

### Classify a single license

```
Classify this license and explain what it means for my project:

License: [MIT / Apache 2.0 / GPL v2 / GPL v3 / LGPL / AGPL / MPL 2.0 / BSD 2-clause / BSD 3-clause / other]

My project:
- Type: [SaaS (no binary distribution) / mobile app / desktop app / library / embedded]
- How I use this library: [linked / bundled / modified / unmodified]
- Distribution: [yes — public / internal only / no distribution]

Tell me:
1. What category is this license (permissive / weak copyleft / strong copyleft / network copyleft)?
2. What are my specific obligations?
3. Am I required to release my source code?
4. What attribution/notice requirements apply?
5. Is there a patent grant?
```

### License compatibility matrix

```
My project is licensed as: [MIT / Apache 2.0 / proprietary commercial / other]

I want to use these OSS dependencies:
1. [library name] — [license]
2. [library name] — [license]
3. [library name] — [license]

For each dependency:
- Is this license compatible with my project's license?
- What obligations does it create?
- Can I distribute my product without releasing my source code?
- Any special considerations for SaaS/cloud deployment?
```

### The key license categories

```
Explain the key open source license categories and their practical implications:

PERMISSIVE (use freely, minimal obligations):
- MIT: use, modify, distribute freely — just keep the copyright notice
- Apache 2.0: same as MIT + patent grant + change documentation required
- BSD 2/3-clause: similar to MIT, slightly different attribution wording

WEAK COPYLEFT (modifications to the library must be shared, but not your app):
- LGPL v2.1/v3: modifications to the LGPL library itself must be open-sourced
  Dynamic linking usually safe; static linking may trigger obligations
- MPL 2.0: file-level copyleft — modified MPL files must be open-sourced

STRONG COPYLEFT (entire linked work may need to be open-sourced):
- GPL v2: distribution triggers full source release for linked/combined works
- GPL v3: same as v2 + anti-tivoisation + patent termination provisions

NETWORK COPYLEFT (SaaS use triggers source release):
- AGPL v3: running a modified AGPL program as a network service = distribution
  Using AGPL library in your SaaS may require you to release your entire codebase
```

### Dependency audit

```
Audit my project's dependencies for license risks.

[paste your package.json / requirements.txt / pom.xml / go.mod / Cargo.toml]

My project type: [SaaS / proprietary app / open source lib]
My commercial intent: [selling as product / internal only / open source]

Flag:
1. Any copyleft licenses that could affect my ability to keep source closed
2. Any AGPL licenses (highest risk for SaaS)
3. Licenses that are incompatible with each other
4. Any licenses without clear patent grant (relevant for commercial use)
5. Licenses that require specific attribution in your product UI or docs
```

### Attribution and notice requirements

```
I need to include proper attribution in my product for these OSS components:

[list libraries and their licenses]

Generate the attribution notices I need to include, in the format required by each license.
Tell me where to put them: in the app UI, in documentation, in the distributed binary, or in source files.
```

## Example

**User:** We're building a SaaS product and found we're using an AGPL-licensed library for PDF generation. We didn't realise. What does this mean?

**Claude's analysis:**

**Critical issue — AGPL in a SaaS product.**

AGPL v3 Section 13 extends GPL copyleft to network use: "if you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network (if your version supports such interaction) an opportunity to receive the Corresponding Source."

**What this means for your SaaS:**
- If you modified the library in any way, you may be required to release your entire application source code to users who interact with it over the network
- Even if you used it unmodified, AGPL's "corresponding source" requirements are interpreted broadly by some jurisdictions

**Your options:**
1. **Replace the library** with an MIT/Apache-licensed alternative (recommended if you want to keep source closed)
2. **Purchase a commercial license** if the library offers a commercial/enterprise license without AGPL restrictions (common pattern — check their website)
3. **Open source your SaaS** under a compatible license (rarely the desired outcome)
4. **Consult a lawyer** to assess your specific risk given your jurisdiction, use case, and whether you modified the library

**Immediate action:** Stop distributing the current product until you have a resolution. [VERIFY] interpretation with an IP lawyer.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)

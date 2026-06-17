# CVE Feed MCP

## Purpose
Provide real-time CVE (Common Vulnerabilities and Exposures) feed integration for security analysis, vulnerability tracking, and threat intelligence workflows.

## Configuration

Add this to `.claude/settings.json` under the `mcp` section:

```json
{
  "mcp": {
    "cve-feed": {
      "type": "stdio",
      "command": "node",
      "args": ["path/to/cve-feed-server.js"],
      "env": {
        "CVE_API_KEY": "${CVE_API_KEY}",
        "FEED_UPDATE_INTERVAL": "3600"
      }
    }
  }
}
```

## Environment Setup

1. Obtain a CVE feed API key (e.g., from NVD, Snyk, or similar provider)
2. Set `CVE_API_KEY` in your environment or `.claude/settings.local.json`
3. Optional: Adjust `FEED_UPDATE_INTERVAL` (seconds) for polling frequency

## Capabilities

- Query recent CVE disclosures
- Filter by severity, affected software, or date range
- Retrieve CVSS scores and remediation details
- Monitor specific packages or components

## When to Use

- Security-focused agents analyzing vulnerability exposure
- Threat assessment and incident response workflows
- Dependency audit and supply chain security reviews
- Compliance and risk management tasks

## References

- [NIST National Vulnerability Database](https://nvd.nist.gov/)
- [Snyk Vulnerability Database](https://snyk.io/vuln)
- [CVE Official Website](https://www.cve.org/)

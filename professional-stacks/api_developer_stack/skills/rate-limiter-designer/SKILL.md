---
name: rate-limiter-designer
description: Design rate limiting and throttling strategies for APIs with proper headers, quotas, and backpressure handling
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Implementing rate limiting for API endpoints
- Designing usage quotas and tiered access plans
- Configuring backpressure and circuit breaker patterns
- Setting up rate limit headers (RFC 6585)
- Preventing API abuse and DDoS

## When NOT to use

- For DDoS mitigation at the network layer
- For CDN caching strategies
- For load balancer configuration

## Instructions

1. **Define rate limit scope.** Per-user, per-IP, per-endpoint, or global? Tiered by plan (free/pro/enterprise)?
2. **Select algorithm.** Token bucket (burst-friendly), sliding window (accurate), or fixed window (simple).
3. **Set limits.** Free tier: 100 req/min. Pro: 1000 req/min. Enterprise: 10000 req/min. Per-endpoint overrides for expensive operations.
4. **Implement headers.** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After` on 429.
5. **Design 429 response.** Include current limit, remaining quota, reset timestamp, and upgrade CTA.
6. **Add backpressure.** When system load >80%, progressively reduce limits starting with free tier.
7. **Monitor and tune.** Track 429 rates, false positives, and abuse patterns. Adjust limits quarterly.

## Example

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718280000
Retry-After: 42

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded 100 requests per minute. Upgrade to Pro for 1000 req/min.",
    "docsUrl": "https://api.example.com/docs/rate-limits"
  }
}
```

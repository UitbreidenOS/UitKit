# FinTech Agent Stack - Quick Start Guide

## Installation & Setup

The FinTech Agent Stack is a standalone Node.js module with no external dependencies.

```bash
cd profilers/
```

## Running the Stack

### Basic Execution

```bash
# Default: 100 iterations, text output
node fintech-agent-stack.js

# Custom iterations
node fintech-agent-stack.js --iterations=50

# JSON output for data processing
node fintech-agent-stack.js --iterations=100 --output=json
```

### Run Test Suite

```bash
# Execute all 40 tests
node fintech-agent-stack.test.js

# Expected output: 40 PASS, 0 FAIL
```

### Run Integration Examples

```bash
# See real-world usage patterns
node fintech-agent-stack-integration-example.js
```

## Quick Code Examples

### Customer Onboarding

```javascript
const { ComplianceChecker } = require('./fintech-agent-stack');
const compliance = new ComplianceChecker('onboarding');

const customer = {
  id: 'CUST-001',
  name: 'Alice Johnson',
  country: 'US',
  businessType: 'trading',
  documentType: 'passport',
  documents: ['kyc-form', 'id-verification', 'address-proof'],
};

const kycResult = compliance.verifyKYC(customer);
console.log('KYC Status:', kycResult.passed ? 'APPROVED' : 'REJECTED');
```

### Transaction Screening

```javascript
const transaction = {
  id: 'TX-001',
  senderId: 'CUST-001',
  receiverId: 'CUST-002',
  amount: 50000,
  purpose: 'payment',
  merchant: 'BANK',
};

const screeningResult = compliance.screenTransaction(transaction);
console.log('Transaction:', screeningResult.approved ? 'APPROVED' : 'BLOCKED');
```

### Portfolio Risk Analysis

```javascript
const { RiskAssessor } = require('./fintech-agent-stack');
const riskAssessor = new RiskAssessor('portfolio-monitor');

const portfolio = {
  id: 'PORT-001',
  holdings: [
    { symbol: 'AAPL', value: 100000, weight: 0.5, volatility: 0.2, beta: 1.2, liquidity: 0.9, sector: 'tech', counterparty: 'NASDAQ' },
    { symbol: 'JPM', value: 100000, weight: 0.5, volatility: 0.25, beta: 1.3, liquidity: 0.92, sector: 'finance', counterparty: 'NYSE' },
  ],
  totalValue: 200000,
};

const riskResult = riskAssessor.assessPortfolioRisk(portfolio);
console.log('Risk Score:', riskResult.overallRiskScore);
console.log('Volatility:', (riskResult.volatility * 100).toFixed(2) + '%');
console.log('VaR (95%):', '$' + riskResult.valueAtRisk.value.toFixed(2));
```

### Fraud Detection

```javascript
const { FraudDetector } = require('./fintech-agent-stack');
const fraudDetector = new FraudDetector('fraud-prevention');

const transaction = {
  id: 'TX-001',
  userId: 'USER-001',
  amount: 100000,
  merchant: 'CRYPTO-EXCHANGE',
  timestamp: Date.now(),
  location: 'ONLINE',
};

const fraudResult = fraudDetector.detectFraud(transaction);
console.log('Fraud Score:', fraudResult.fraudScore);
console.log('Risk Level:', fraudResult.riskLevel);
console.log('Action:', fraudResult.isFraud ? 'BLOCK' : 'APPROVE');
```

### Trade Analysis

```javascript
const { TradeAnalyzer } = require('./fintech-agent-stack');
const tradeAnalyzer = new TradeAnalyzer('trade-execution');

const trade = {
  id: 'TRADE-001',
  buyerId: 'BUYER-001',
  sellerId: 'SELLER-001',
  security: 'AAPL',
  quantity: 1000,
  price: 195.50,
  createdAt: Date.now(),
  expiryDate: Date.now() + 48 * 60 * 60 * 1000,
};

const tradeResult = tradeAnalyzer.analyzeTrade(trade);
console.log('Execution Valid:', tradeResult.executionValidation.valid);
console.log('Market Impact:', tradeResult.marketImpact.priceImpact);
console.log('Settlement Days:', tradeResult.settlementRisk.daysToExpiry.toFixed(2));
```

## Key Features

### Compliance (AML/KYC/GDPR/CCPA/SOX)

✓ Customer identity verification
✓ Beneficial ownership reporting
✓ PEP screening
✓ Sanctions list screening
✓ Transaction monitoring
✓ GDPR consent management
✓ CCPA opt-out handling
✓ Immutable audit logging
✓ 7-year audit retention

### Risk Assessment

✓ Diversification scoring
✓ Concentration analysis
✓ Volatility calculation
✓ Value at Risk (VaR) computation
✓ Counterparty exposure analysis
✓ Market risk assessment
✓ Liquidity risk scoring
✓ Risk limit monitoring

### Fraud Detection

✓ Amount anomaly detection
✓ Transaction frequency analysis
✓ Location anomaly detection
✓ Behavioral profile tracking
✓ Merchant risk assessment
✓ Velocity checking
✓ Fraud scoring (0-100)
✓ Risk level classification

### Trade Analysis

✓ Execution validation
✓ Market impact analysis
✓ Settlement risk assessment
✓ Counterparty validation
✓ Price/volume validation
✓ Timeline compliance checking
✓ Settlement tracking

## Performance Metrics

Typical performance (50 iterations):
- **8,200+ events/second**
- **50 compliance checks**
- **50 risk assessments**
- **88% fraud detection rate**
- **~30ms total duration**

## Configuration

Most configuration is automatic, but key thresholds can be adjusted in the source:

```javascript
CONFIG.FRAUD_SCORE_THRESHOLD = 75;      // Fraud alert threshold
CONFIG.RISK_LIMIT_THRESHOLD = 90;       // Portfolio risk limit
CONFIG.COMPLIANCE_CACHE_TTL = 3600000;  // 1 hour KYC cache
```

## Testing

```bash
# Run full test suite (40 tests)
node fintech-agent-stack.test.js

# Tests cover:
# - KYC verification
# - Transaction screening
# - Portfolio risk assessment
# - Fraud detection
# - Trade analysis
# - Audit logging
# - Integration
# - Performance
```

## Event Monitoring

All agents emit events for monitoring and logging:

```javascript
compliance.on('kyc-checked', (event) => {
  console.log('KYC checked:', event.customerId, event.passed);
});

risk.on('risk-assessed', (event) => {
  console.log('Risk assessed:', event.portfolioId, event.risk);
});

fraud.on('fraud-check', (event) => {
  console.log('Fraud check:', event.transactionId, event.fraudScore);
});

trade.on('trade-analyzed', (event) => {
  console.log('Trade analyzed:', event.tradeId, event.risks);
});
```

## Agent Statistics

Get operational metrics from any agent:

```javascript
const stats = compliance.getStats();
console.log('Transactions processed:', stats.processedTransactions);
console.log('Transactions blocked:', stats.blockedTransactions);
console.log('Block rate:', stats.blockRate.toFixed(2) + '%');
console.log('Audit log entries:', stats.auditLogEntries);
```

## Common Use Cases

### 1. New Customer Onboarding
- Verify KYC (identity, documents, beneficial ownership)
- Screen against sanctions lists
- Assess country risk
- Record GDPR/CCPA consent
- Approve customer opening

### 2. Transaction Processing
- Screen sender KYC status
- Check transaction amount against limits
- Verify GDPR compliance
- Verify CCPA preferences
- Approve/reject transaction

### 3. Portfolio Monitoring
- Calculate overall risk score
- Monitor diversification
- Track VaR
- Check concentration limits
- Alert on limit breaches

### 4. Fraud Prevention
- Analyze transaction patterns
- Detect behavioral anomalies
- Flag high-risk merchants
- Check transaction velocity
- Alert on fraud indicators

### 5. Trade Execution
- Validate trade parameters
- Calculate market impact
- Assess settlement risk
- Check execution timeline
- Record settlement

## Troubleshooting

### All transactions blocked?
- Check that customer KYC was properly verified
- Verify GDPR/CCPA consent was recorded
- Check transaction amounts are within limits

### High fraud scores?
- Review merchant categories
- Check transaction amounts vs. profile
- Verify location changes
- Examine frequency patterns

### High portfolio risk?
- Review asset allocation and diversification
- Check concentration in single position
- Examine volatility of holdings
- Consider rebalancing

## Next Steps

1. **Read FINTECH_AGENT_STACK_README.md** for comprehensive documentation
2. **Run fintech-agent-stack-integration-example.js** to see real workflows
3. **Review fintech-agent-stack.test.js** for advanced usage examples
4. **Customize CONFIG** for your organization's thresholds
5. **Integrate into your systems** using the module exports

## API Reference

### ComplianceChecker
- `verifyKYC(customer)` - KYC verification
- `screenTransaction(transaction)` - Transaction screening
- `recordConsent(customerId, type, granted)` - Record consent
- `getStats()` - Get metrics

### RiskAssessor
- `assessPortfolioRisk(portfolio)` - Analyze portfolio risk
- `setRiskLimit(portfolioId, limit)` - Set risk threshold
- `getStats()` - Get metrics

### FraudDetector
- `detectFraud(transaction)` - Analyze for fraud
- `getOrCreateProfile(userId)` - Get user profile
- `getStats()` - Get metrics

### TradeAnalyzer
- `analyzeTrade(trade)` - Analyze trade
- `recordSettlement(tradeId, date)` - Record settlement
- `getStats()` - Get metrics

## Support

For detailed examples, see:
- **fintech-agent-stack-integration-example.js** - Real-world workflows
- **fintech-agent-stack.test.js** - Usage patterns and test cases
- **FINTECH_AGENT_STACK_README.md** - Complete documentation

## License

Part of Claudient financial services ecosystem.

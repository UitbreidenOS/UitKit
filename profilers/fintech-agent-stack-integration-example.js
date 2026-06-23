/**
 * fintech-agent-stack-integration-example.js
 *
 * Complete integration example showing how to use the FinTech Agent Stack
 * in a real-world financial services workflow.
 *
 * Demonstrates:
 * - Customer onboarding with KYC verification
 * - Real-time transaction screening
 * - Portfolio risk monitoring
 * - Fraud detection and alerting
 * - Trade execution with settlement tracking
 * - Compliance audit logging
 */

const {
  FintechAgentStack,
  ComplianceChecker,
  RiskAssessor,
  FraudDetector,
  TradeAnalyzer,
} = require('./fintech-agent-stack');

// ============================================================================
// EXAMPLE 1: CUSTOMER ONBOARDING WORKFLOW
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 1: Customer Onboarding with KYC');
console.log('═══════════════════════════════════════════════════════════════\n');

function onboardCustomer() {
  const compliance = new ComplianceChecker('onboarding-service');

  // Create new customer
  const newCustomer = {
    id: 'CUST-NEW-2024-001',
    name: 'Jane Smith',
    country: 'US',
    businessType: 'investment',
    documentType: 'passport',
    isPEP: false,
    documents: ['kyc-form', 'id-verification', 'address-proof', 'proof-of-funds'],
    uboDeclaration: [
      { name: 'Jane Smith', ownership: 100 }
    ],
  };

  console.log('Customer Data:');
  console.log(`  ID: ${newCustomer.id}`);
  console.log(`  Name: ${newCustomer.name}`);
  console.log(`  Country: ${newCustomer.country}`);
  console.log(`  Business Type: ${newCustomer.businessType}\n`);

  // Perform KYC verification
  const kycResult = compliance.verifyKYC(newCustomer);

  console.log('KYC Verification Results:');
  console.log(`  ✓ Identity Verified: ${kycResult.checks.identityVerified.passed}`);
  console.log(`  ✓ Documents Complete: ${kycResult.checks.documentationComplete.passed}`);
  console.log(`  ✓ PEP Screening: ${!kycResult.checks.pepScreening.isPEP ? 'Not a PEP' : 'PEP Alert'}`);
  console.log(`  ✓ Sanctions Cleared: ${kycResult.checks.sanctionsScreening.passed}`);
  console.log(`  ✓ Country Risk: ${kycResult.checks.countryRiskAssessment.riskLevel}`);
  console.log(`  ✓ Overall KYC Status: ${kycResult.passed ? 'APPROVED' : 'REJECTED'}\n`);

  // Record GDPR and CCPA consent
  compliance.recordConsent(newCustomer.id, 'gdpr', true);
  compliance.recordConsent(newCustomer.id, 'ccpaOptOut', false);
  console.log('Consent Recorded: GDPR=TRUE, CCPA OptOut=FALSE\n');

  return { compliance, customer: newCustomer };
}

// ============================================================================
// EXAMPLE 2: TRANSACTION SCREENING
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 2: Real-Time Transaction Screening');
console.log('═══════════════════════════════════════════════════════════════\n');

function screenTransactions(compliance, customer) {
  const transactions = [
    {
      id: 'TX-2024-001',
      senderId: customer.id,
      receiverId: 'CUST-EXT-002',
      amount: 25000,
      purpose: 'investment-transfer',
      merchant: 'WIRE-TRANSFER',
      timestamp: Date.now(),
    },
    {
      id: 'TX-2024-002',
      senderId: customer.id,
      receiverId: 'CUST-EXT-003',
      amount: 500000, // Large transaction
      purpose: 'corporate-payment',
      merchant: 'BANK',
      timestamp: Date.now(),
    },
    {
      id: 'TX-2024-003',
      senderId: customer.id,
      receiverId: 'CUST-EXT-004',
      amount: 150000000, // Over limit
      purpose: 'large-transfer',
      merchant: 'WIRE-TRANSFER',
      timestamp: Date.now(),
    },
  ];

  console.log('Screening Transactions:\n');

  transactions.forEach((tx) => {
    const result = compliance.screenTransaction(tx);
    console.log(`Transaction: ${tx.id}`);
    console.log(`  Amount: $${tx.amount.toLocaleString()}`);
    console.log(`  Status: ${result.approved ? '✓ APPROVED' : '✗ BLOCKED'}`);
    console.log(`  Sender KYC: ${result.senderKYC ? 'Pass' : 'Fail'}`);
    console.log(`  Amount Check: ${result.amountCheck ? 'Pass' : 'Fail'}`);
    console.log(`  GDPR Compliant: ${result.gdprCompliant.processingConsent ? 'Yes' : 'No'}`);
    console.log(`  CCPA Compliant: ${result.ccpaCompliant.optOutRespected ? 'Respected' : 'Not Respected'}`);
    console.log('');
  });
}

// ============================================================================
// EXAMPLE 3: PORTFOLIO RISK MONITORING
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 3: Portfolio Risk Monitoring');
console.log('═══════════════════════════════════════════════════════════════\n');

function monitorPortfolios() {
  const riskAssessor = new RiskAssessor('portfolio-monitoring');

  // Customer's investment portfolio
  const portfolio = {
    id: 'PORT-2024-001',
    holdings: [
      {
        symbol: 'AAPL',
        value: 100000,
        weight: 0.25,
        volatility: 0.22,
        beta: 1.15,
        liquidity: 0.95,
        sector: 'technology',
        counterparty: 'NASDAQ',
      },
      {
        symbol: 'MSFT',
        value: 75000,
        weight: 0.1875,
        volatility: 0.2,
        beta: 0.95,
        liquidity: 0.96,
        sector: 'technology',
        counterparty: 'NASDAQ',
      },
      {
        symbol: 'JPM',
        value: 80000,
        weight: 0.2,
        volatility: 0.25,
        beta: 1.3,
        liquidity: 0.92,
        sector: 'finance',
        counterparty: 'NYSE',
      },
      {
        symbol: 'XOM',
        value: 65000,
        weight: 0.1625,
        volatility: 0.28,
        beta: 1.1,
        liquidity: 0.88,
        sector: 'energy',
        counterparty: 'NYSE',
      },
      {
        symbol: 'JNJ',
        value: 80000,
        weight: 0.2,
        volatility: 0.18,
        beta: 0.7,
        liquidity: 0.93,
        sector: 'healthcare',
        counterparty: 'NYSE',
      },
    ],
    totalValue: 400000,
  };

  console.log('Portfolio: ' + portfolio.id);
  console.log(`Total Value: $${portfolio.totalValue.toLocaleString()}`);
  console.log(`Holdings: ${portfolio.holdings.length} positions\n`);

  // Assess portfolio risk
  const riskResult = riskAssessor.assessPortfolioRisk(portfolio);

  console.log('Risk Analysis Results:');
  console.log(`  Overall Risk Score: ${riskResult.overallRiskScore}/100`);
  console.log(`  Volatility: ${(riskResult.volatility * 100).toFixed(2)}%`);
  console.log(`  Diversification: ${riskResult.diversification.toFixed(2)}/100`);
  console.log(`  Max Concentration: ${riskResult.concentration.maxPositionWeight * 100}%`);
  console.log(`  VaR (95% confidence): $${riskResult.valueAtRisk.value.toFixed(2)}`);
  console.log(`  VaR Percentage: ${riskResult.valueAtRisk.percentage.toFixed(2)}%`);
  console.log(`  Liquidity Score: ${riskResult.liquidityRisk.liquidityScore.toFixed(2)}/100`);
  console.log(`  Counterparties: ${riskResult.counterpartyRisk.uniqueCounterparties}`);
  console.log(`  Sectors: ${riskResult.marketRisk.sectors}`);
  console.log(`  Portfolio Beta: ${riskResult.marketRisk.beta.toFixed(2)}`);

  if (riskResult.breachesLimit) {
    console.log(`\n  ⚠ WARNING: Risk limit breach detected!`);
  } else {
    console.log(`\n  ✓ Risk within acceptable limits`);
  }

  console.log('');
}

// ============================================================================
// EXAMPLE 4: FRAUD DETECTION
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 4: Real-Time Fraud Detection');
console.log('═══════════════════════════════════════════════════════════════\n');

function detectFraud() {
  const fraudDetector = new FraudDetector('fraud-prevention');

  // Simulate transaction sequence
  const transactions = [
    {
      id: 'TX-FRAUD-001',
      userId: 'USER-FRAUD-TEST',
      amount: 500,
      merchant: 'STARBUCKS',
      timestamp: Date.now() - 10000,
      location: 'NEW_YORK',
    },
    {
      id: 'TX-FRAUD-002',
      userId: 'USER-FRAUD-TEST',
      amount: 50000, // Unusual amount
      merchant: 'JEWELRY',
      timestamp: Date.now() - 5000,
      location: 'MIAMI', // Different location
    },
    {
      id: 'TX-FRAUD-003',
      userId: 'USER-FRAUD-TEST',
      amount: 100000, // Very large amount
      merchant: 'CRYPTO-EXCHANGE',
      timestamp: Date.now(),
      location: 'ONLINE',
    },
  ];

  console.log('Fraud Detection Results:\n');

  transactions.forEach((tx) => {
    const result = fraudDetector.detectFraud(tx);
    const riskColor = result.fraudScore > 75 ? '⚠' : result.fraudScore > 50 ? '◆' : '✓';

    console.log(`${riskColor} Transaction: ${tx.id}`);
    console.log(`  Amount: $${tx.amount.toLocaleString()}`);
    console.log(`  Merchant: ${tx.merchant}`);
    console.log(`  Location: ${tx.location}`);
    console.log(`  Fraud Score: ${result.fraudScore}/100`);
    console.log(`  Risk Level: ${result.riskLevel.toUpperCase()}`);
    console.log(`  Recommended Action: ${result.isFraud ? 'BLOCK' : 'APPROVE'}`);
    console.log('');
  });

  const stats = fraudDetector.getStats();
  console.log(`Fraud Detector Stats:`);
  console.log(`  Transactions Analyzed: ${stats.transactionsAnalyzed}`);
  console.log(`  Anomalies Detected: ${stats.anomaliesDetected}`);
  console.log(`  Detection Rate: ${stats.detectionRate.toFixed(2)}%\n`);
}

// ============================================================================
// EXAMPLE 5: TRADE EXECUTION & SETTLEMENT
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 5: Trade Execution & Settlement Tracking');
console.log('═══════════════════════════════════════════════════════════════\n');

function executeTrades() {
  const tradeAnalyzer = new TradeAnalyzer('trade-execution');

  const trades = [
    {
      id: 'TRADE-2024-001',
      buyerId: 'BUYER-001',
      sellerId: 'SELLER-001',
      security: 'AAPL',
      quantity: 1000,
      price: 195.5,
      createdAt: Date.now(),
      expiryDate: Date.now() + 48 * 60 * 60 * 1000, // 2 days
    },
    {
      id: 'TRADE-2024-002',
      buyerId: 'BUYER-002',
      sellerId: 'SELLER-002',
      security: 'GOOGL',
      quantity: 500,
      price: 142.3,
      createdAt: Date.now(),
      expiryDate: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
    },
    {
      id: 'TRADE-2024-003',
      buyerId: 'BUYER-003',
      sellerId: 'SELLER-003',
      security: 'TSLA',
      quantity: 2000,
      price: 250.0,
      createdAt: Date.now(),
      expiryDate: Date.now() + 72 * 60 * 60 * 1000, // 3 days
    },
  ];

  console.log('Trade Analysis:\n');

  trades.forEach((trade) => {
    const result = tradeAnalyzer.analyzeTrade(trade);

    console.log(`Trade: ${trade.id}`);
    console.log(`  Security: ${trade.security}`);
    console.log(`  Quantity: ${trade.quantity.toLocaleString()}`);
    console.log(`  Price: $${trade.price}`);
    console.log(`  Trade Value: $${(trade.quantity * trade.price).toLocaleString()}`);
    console.log(`  Execution Valid: ${result.executionValidation.valid ? 'Yes' : 'No'}`);
    console.log(`  Market Impact: ${result.marketImpact.priceImpact}`);
    console.log(`  Settlement Days: ${result.settlementRisk.daysToExpiry.toFixed(2)}`);
    console.log(`  Settlement Risk: ${result.settlementRisk.settlementRisk}`);
    console.log(`  Price Valid: ${result.priceValidation.valid ? 'Yes' : 'No'} (${result.priceValidation.deviation.toFixed(2)}% deviation)`);
    console.log(`  Volume Valid: ${result.volumeValidation.valid ? 'Yes' : 'No'}`);

    if (result.settlementRisk.settlementRisk !== 'high') {
      // Record settlement
      const settlementDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      tradeAnalyzer.recordSettlement(trade.id, settlementDate.toISOString());
      console.log(`  Settlement: Scheduled for ${settlementDate.toLocaleDateString()}`);
    }

    console.log('');
  });

  const stats = tradeAnalyzer.getStats();
  console.log(`Trade Analyzer Stats:`);
  console.log(`  Trades Analyzed: ${stats.tradesAnalyzed}`);
  console.log(`  Trades with Risk: ${stats.tradesWithRisk}`);
  console.log(`  Settled Trades: ${stats.settledTrades}\n`);
}

// ============================================================================
// EXAMPLE 6: COMPLIANCE REPORTING
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 6: Compliance & Audit Reporting');
console.log('═══════════════════════════════════════════════════════════════\n');

function generateComplianceReport(compliance) {
  console.log('Compliance Agent Statistics:');
  const stats = compliance.getStats();
  console.log(`  Transactions Processed: ${stats.processedTransactions}`);
  console.log(`  Transactions Blocked: ${stats.blockedTransactions}`);
  console.log(`  Block Rate: ${stats.blockRate.toFixed(2)}%`);
  console.log(`  KYC Cache Entries: ${stats.cacheSize}`);
  console.log(`  Audit Log Entries: ${stats.auditLogEntries}`);
  console.log(`  Agent Uptime: ${(stats.uptime / 1000).toFixed(2)}s\n`);

  // Export audit trail
  console.log('Sample Audit Log Entries:');
  compliance.auditLog.logs.slice(0, 3).forEach((entry) => {
    console.log(`  [${entry.timestamp}] ${entry.agent} - ${entry.event}`);
    console.log(`    Compliance: ${entry.compliance.join(', ')}`);
  });
  console.log('');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║           FinTech Agent Stack - Integration Examples         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Run examples
const { compliance, customer } = onboardCustomer();
screenTransactions(compliance, customer);
monitorPortfolios();
detectFraud();
executeTrades();
generateComplianceReport(compliance);

console.log('═══════════════════════════════════════════════════════════════');
console.log('Examples completed successfully!');
console.log('═══════════════════════════════════════════════════════════════\n');

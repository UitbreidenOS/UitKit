/**
 * fintech-agent-stack.test.js
 *
 * Unit and integration tests for the FinTech Agent Stack
 * Tests compliance, risk assessment, fraud detection, and trade analysis
 */

const {
  FintechAgentStack,
  ComplianceChecker,
  RiskAssessor,
  FraudDetector,
  TradeAnalyzer,
  ComplianceAuditLog,
} = require('./fintech-agent-stack');

// ============================================================================
// TEST UTILITIES
// ============================================================================

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    failedTests++;
  } else {
    console.log(`✓ PASS: ${message}`);
    passedTests++;
  }
}

function describe(suite) {
  console.log(`\n━━━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`${suite}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// ============================================================================
// COMPLIANCE CHECKER TESTS
// ============================================================================

describe('ComplianceChecker - KYC Verification');
{
  const checker = new ComplianceChecker('test-compliance');

  // Test 1: Valid customer KYC
  const validCustomer = {
    id: 'CUST-001',
    name: 'Alice Johnson',
    country: 'US',
    businessType: 'trading',
    documentType: 'passport',
    isPEP: false,
    documents: ['kyc-form', 'id-verification', 'address-proof'],
  };
  const result = checker.verifyKYC(validCustomer);
  assert(
    result.passed !== undefined,
    'KYC result should have passed property'
  );
  assert(
    result.checks !== undefined,
    'KYC result should have checks property'
  );

  // Test 2: Invalid customer (missing documents)
  const invalidCustomer = {
    id: 'CUST-002',
    name: 'Bob Smith',
    country: 'US',
    businessType: 'trading',
    documentType: undefined,
    documents: [],
  };
  const invalidResult = checker.verifyKYC(invalidCustomer);
  assert(
    invalidResult.passed === false,
    'KYC should fail for customer without proper documents'
  );

  // Test 3: PEP screening
  const pepCustomer = {
    id: 'CUST-003',
    name: 'Carol Diplomat',
    country: 'US',
    businessType: 'trading',
    documentType: 'passport',
    isPEP: true,
    documents: ['kyc-form', 'id-verification', 'address-proof'],
  };
  const pepResult = checker.verifyKYC(pepCustomer);
  assert(
    pepResult.checks.pepScreening.isPEP === true,
    'PEP screening should identify politically exposed persons'
  );

  // Test 4: Cache functionality
  const cacheCustomer = {
    id: 'CUST-004',
    name: 'Dave Test',
    country: 'US',
    businessType: 'trading',
    documentType: 'passport',
    documents: ['kyc-form'],
  };
  checker.verifyKYC(cacheCustomer);
  checker.verifyKYC(cacheCustomer);
  assert(
    checker.kycCache.size > 0,
    'KYC cache should store results'
  );
}

// ============================================================================
// TRANSACTION SCREENING TESTS
// ============================================================================

describe('ComplianceChecker - Transaction Screening');
{
  const checker = new ComplianceChecker('test-compliance-2');

  // Test 5: Valid transaction
  const transaction = {
    id: 'TX-001',
    senderId: 'CUST-001',
    receiverId: 'CUST-002',
    amount: 50000,
    purpose: 'payment',
    merchant: 'RETAILER',
  };
  const txResult = checker.screenTransaction(transaction);
  assert(
    txResult.approved !== undefined,
    'Transaction screening should return approval status'
  );
  assert(
    txResult.gdprCompliant !== undefined,
    'Transaction screening should check GDPR compliance'
  );
  assert(
    txResult.ccpaCompliant !== undefined,
    'Transaction screening should check CCPA compliance'
  );

  // Test 6: Blocked transaction (large amount)
  const largeTransaction = {
    id: 'TX-002',
    senderId: 'CUST-001',
    receiverId: 'CUST-002',
    amount: 50000000, // Over limit
    purpose: 'payment',
    merchant: 'BANK',
  };
  const blockedResult = checker.screenTransaction(largeTransaction);
  assert(
    blockedResult.approved === false,
    'Transaction should be blocked when amount exceeds limit'
  );
}

// ============================================================================
// RISK ASSESSOR TESTS
// ============================================================================

describe('RiskAssessor - Portfolio Analysis');
{
  const assessor = new RiskAssessor('test-risk');

  // Test 7: Portfolio risk assessment
  const portfolio = {
    id: 'PORT-001',
    holdings: [
      {
        symbol: 'TECH-01',
        value: 100000,
        weight: 0.25,
        volatility: 0.2,
        beta: 1.2,
        liquidity: 0.9,
        sector: 'tech',
        counterparty: 'CP-1',
      },
      {
        symbol: 'FIN-01',
        value: 150000,
        weight: 0.3,
        volatility: 0.15,
        beta: 0.9,
        liquidity: 0.85,
        sector: 'finance',
        counterparty: 'CP-2',
      },
    ],
    totalValue: 400000,
  };
  const riskResult = assessor.assessPortfolioRisk(portfolio);
  assert(
    riskResult.overallRiskScore !== undefined,
    'Portfolio assessment should calculate overall risk score'
  );
  assert(
    riskResult.volatility !== undefined,
    'Portfolio assessment should include volatility'
  );
  assert(
    riskResult.valueAtRisk !== undefined,
    'Portfolio assessment should calculate VaR'
  );

  // Test 8: Diversification calculation
  const diversePortfolio = {
    id: 'PORT-002',
    holdings: Array(5)
      .fill(0)
      .map((_, i) => ({
        symbol: `SYM-${i}`,
        value: 50000,
        weight: 0.2,
        volatility: 0.1,
        beta: 1.0,
        liquidity: 0.8,
        sector: 'tech',
        counterparty: `CP-${i}`,
      })),
    totalValue: 250000,
  };
  const divResult = assessor.assessPortfolioRisk(diversePortfolio);
  assert(
    divResult.diversification > 0,
    'Diversification score should be positive'
  );
  assert(
    divResult.diversification <= 100,
    'Diversification score should not exceed 100'
  );
}

// ============================================================================
// FRAUD DETECTOR TESTS
// ============================================================================

describe('FraudDetector - Anomaly Detection');
{
  const detector = new FraudDetector('test-fraud');

  // Test 9: Normal transaction
  const normalTx = {
    id: 'TX-001',
    userId: 'USER-001',
    amount: 1000,
    merchant: 'RETAILER',
    timestamp: Date.now(),
    location: 'US',
  };
  const fraudResult = detector.detectFraud(normalTx);
  assert(
    fraudResult.fraudScore !== undefined,
    'Fraud detection should return fraud score'
  );
  assert(
    fraudResult.fraudScore >= 0 && fraudResult.fraudScore <= 100,
    'Fraud score should be between 0 and 100'
  );

  // Test 10: Suspicious transaction (amount anomaly)
  const suspiciousTx = {
    id: 'TX-002',
    userId: 'USER-002',
    amount: 100000, // Large amount
    merchant: 'RETAILER',
    timestamp: Date.now(),
    location: 'US',
  };
  const suspiciousResult = detector.detectFraud(suspiciousTx);
  assert(
    suspiciousResult.riskLevel !== undefined,
    'Fraud detection should classify risk level'
  );

  // Test 11: High-risk merchant
  const highRiskTx = {
    id: 'TX-003',
    userId: 'USER-003',
    amount: 5000,
    merchant: 'CRYPTO-EXCHANGE',
    timestamp: Date.now(),
    location: 'US',
  };
  const highRiskResult = detector.detectFraud(highRiskTx);
  assert(
    highRiskResult.fraudScore >= 15,
    'High-risk merchant should increase fraud score'
  );

  // Test 12: Behavioral profile tracking
  detector.detectFraud({
    id: 'TX-004',
    userId: 'USER-004',
    amount: 500,
    merchant: 'BANK',
    timestamp: Date.now(),
    location: 'US',
  });
  assert(
    detector.behavioralProfiles.size > 0,
    'Behavioral profiles should be tracked'
  );
}

// ============================================================================
// TRADE ANALYZER TESTS
// ============================================================================

describe('TradeAnalyzer - Trade Validation');
{
  const analyzer = new TradeAnalyzer('test-trade');

  // Test 13: Valid trade
  const trade = {
    id: 'TRADE-001',
    buyerId: 'BUYER-001',
    sellerId: 'SELLER-001',
    security: 'APPL',
    quantity: 100,
    price: 150,
    createdAt: Date.now(),
    expiryDate: Date.now() + 48 * 60 * 60 * 1000,
  };
  const tradeResult = analyzer.analyzeTrade(trade);
  assert(
    tradeResult.executionValidation !== undefined,
    'Trade analysis should validate execution'
  );
  assert(
    tradeResult.marketImpact !== undefined,
    'Trade analysis should calculate market impact'
  );
  assert(
    tradeResult.settlementRisk !== undefined,
    'Trade analysis should assess settlement risk'
  );

  // Test 14: Trade with settlement risk
  const urgentTrade = {
    id: 'TRADE-002',
    buyerId: 'BUYER-002',
    sellerId: 'SELLER-002',
    security: 'MSFT',
    quantity: 100,
    price: 300,
    createdAt: Date.now(),
    expiryDate: Date.now() + 1 * 60 * 60 * 1000, // Expires in 1 hour
  };
  const urgentResult = analyzer.analyzeTrade(urgentTrade);
  assert(
    urgentResult.settlementRisk.daysToExpiry < 2,
    'Settlement risk should be high for near-expiry trades'
  );

  // Test 15: Invalid trade (missing data)
  const invalidTrade = {
    id: 'TRADE-003',
    buyerId: null,
    sellerId: 'SELLER-003',
    security: 'GOOG',
    quantity: 50,
    price: 2800,
    createdAt: Date.now(),
    expiryDate: Date.now() + 48 * 60 * 60 * 1000,
  };
  const invalidTradeResult = analyzer.analyzeTrade(invalidTrade);
  assert(
    invalidTradeResult.executionValidation.valid === false,
    'Trade validation should fail for missing buyer'
  );
}

// ============================================================================
// COMPLIANCE AUDIT LOG TESTS
// ============================================================================

describe('ComplianceAuditLog - Logging & Export');
{
  // Test 16: Audit log recording
  const log = new ComplianceAuditLog();
  const entry = log.record('TestAgent', 'TEST_EVENT', { testData: 'value' }, [
    'SOX',
    'GDPR',
  ]);
  assert(
    entry.hash !== undefined,
    'Audit log entry should include hash'
  );
  assert(
    entry.compliance.includes('SOX'),
    'Audit log should record compliance requirements'
  );
  assert(
    log.logs.length === 1,
    'Audit log should contain recorded entry'
  );

  // Test 17: JSON export
  const log2 = new ComplianceAuditLog();
  log2.record('Agent1', 'EVENT1', { data: 'test' }, ['SOX']);
  const jsonExport = log2.export('json');
  assert(
    jsonExport.includes('EVENT1'),
    'JSON export should include recorded events'
  );

  // Test 18: CSV export
  const log3 = new ComplianceAuditLog();
  log3.record('Agent1', 'EVENT1', { data: 'test' }, ['SOX']);
  const csvExport = log3.export('csv');
  assert(
    csvExport.includes('timestamp'),
    'CSV export should include headers'
  );
  assert(
    csvExport.includes('EVENT1'),
    'CSV export should include event data'
  );
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('FintechAgentStack - Full Stack Integration');
{
  // Test 19: Stack instantiation
  const stack = new FintechAgentStack();
  assert(
    stack.agents.compliance !== undefined,
    'Stack should have compliance agent'
  );
  assert(
    stack.agents.risk !== undefined,
    'Stack should have risk agent'
  );
  assert(
    stack.agents.fraud !== undefined,
    'Stack should have fraud agent'
  );
  assert(
    stack.agents.trade !== undefined,
    'Stack should have trade agent'
  );

  // Test 20: Mock data generation
  const customer = stack.generateMockCustomer();
  assert(
    customer.id !== undefined && customer.id.startsWith('CUST'),
    'Mock customer should have valid ID'
  );
  const transaction = stack.generateMockTransaction(customer);
  assert(
    transaction.senderId === customer.id,
    'Mock transaction should use customer as sender'
  );
  const portfolio = stack.generateMockPortfolio();
  assert(
    portfolio.holdings.length > 0,
    'Mock portfolio should have holdings'
  );
  const trade = stack.generateMockTrade();
  assert(
    trade.buyerId !== undefined && trade.sellerId !== undefined,
    'Mock trade should have buyer and seller'
  );
}

// ============================================================================
// PERFORMANCE & STRESS TESTS
// ============================================================================

describe('FinTech Stack - Performance');
{
  // Test 21: High-volume transaction screening
  const checker = new ComplianceChecker('perf-test');
  const startTime = performance.now();

  for (let i = 0; i < 100; i++) {
    checker.screenTransaction({
      id: `TX-${i}`,
      senderId: `SEND-${i}`,
      receiverId: `RECV-${i}`,
      amount: Math.random() * 100000,
      purpose: 'payment',
      merchant: 'RETAILER',
    });
  }

  const duration = performance.now() - startTime;
  console.log(`  (Processed 100 transactions in ${duration.toFixed(2)}ms)`);
  assert(
    checker.processedTransactions === 100,
    'Should process all transactions'
  );

  // Test 22: Portfolio risk assessment performance
  const assessor = new RiskAssessor('perf-test-2');
  const startTime2 = performance.now();

  for (let i = 0; i < 50; i++) {
    assessor.assessPortfolioRisk({
      id: `PORT-${i}`,
      holdings: Array(10)
        .fill(0)
        .map((_, j) => ({
          symbol: `SYM-${j}`,
          value: Math.random() * 100000,
          weight: Math.random() * 0.2,
          volatility: Math.random() * 0.3,
          beta: Math.random() * 2,
          liquidity: Math.random(),
          sector: 'tech',
          counterparty: `CP-${j}`,
        })),
      totalValue: 500000,
    });
  }

  const duration2 = performance.now() - startTime2;
  console.log(
    `  (Assessed 50 portfolios in ${duration2.toFixed(2)}ms)`
  );
  assert(
    assessor.assessmentsRun === 50,
    'Should complete all assessments'
  );
}

// ============================================================================
// TEST RESULTS SUMMARY
// ============================================================================

console.log('\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✓ Passed: ${passedTests}`);
console.log(`✗ Failed: ${failedTests}`);
console.log(`Total: ${passedTests + failedTests}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

process.exit(failedTests > 0 ? 1 : 0);

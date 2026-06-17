# Data Sources Guide

Finance/CFO Stack works with multiple data sources. Choose based on your setup.

## Primary Data Sources

| Source | Type | Best For | Integration |
|---|---|---|---|
| **QuickBooks Online** | Accounting | Small/mid-market companies | OAuth API |
| **Netsuite** | ERP | Enterprise, multi-subsidiary | OAuth API |
| **Xero** | Accounting | SMB, non-profit | OAuth API |
| **Spreadsheet** (CSV/Excel) | Manual upload | Ad-hoc analysis, historical data | File upload |

## Setup by Use Case

### Use Case 1: Real-Time GL Access
Choose: QuickBooks or Netsuite.
1. Authenticate via OAuth (one-time setup).
2. Claude pulls latest GL, balance sheet, income statement on demand.
3. Use for variance analysis, cash flow forecasting, balance sheet health.

### Use Case 2: Ad-Hoc Analysis (No System Integration)
1. Export budget and actual data from accounting software to CSV/Excel.
2. Upload file to session.
3. Claude parses data and runs analysis.
4. Best for: One-off deep dives, custom scenarios, modeling.

### Use Case 3: Hybrid (Real-time + Manual)
1. Use real-time GL pull for monthly variance analysis.
2. Upload supplemental data (headcount, capex forecast) as CSV.
3. Combine data in analysis; log to session.

## Data Format Requirements

### GL Export (CSV)
Headers: Account, Category, Period, Amount, Description
Example:
```
Account,Category,Period,Amount,Description
4100,Revenue,2026-05,100000,Product revenue
5100,COGS,2026-05,35000,Cost of goods
```

### Budget File (Excel)
Sheets: Budget by month/category. Include: Category, Budget, Actual, Variance.

### Headcount Data (CSV)
Headers: Date, Function, Headcount, Salary (avg), Benefits Rate
Example:
```
Date,Function,Headcount,Salary,Benefits_Rate
2026-05,Engineering,18,120000,0.30
```

## Troubleshooting

**No real-time access to accounting system?**
- Use spreadsheet export method (CSV/Excel).
- Claude can still run all analyses; just requires manual data upload each session.

**Multiple data sources?**
- Best practice: Reconcile data before analysis (e.g., ensure GL exports and budget match).
- Flag any discrepancies to user before proceeding.

---

For integration setup, see `connections.md`.

---
name: data-modeling
description: Designs and validates normalized or dimensional data models. Assesses schema design for analytics readiness, identifies grain, cardinality, and fact vs. dimension patterns. Outputs entity-relationship diagram and modeling documentation.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

When designing a new analytics data warehouse, evaluating existing schema for analytics use cases, or refactoring data models to support new metrics. Run before building dbt models or star schema implementations.

## When NOT to use

Not for SQL optimization — use sql-optimizer skill instead. Not for business logic implementation without understanding the underlying data structure first. Not without clear requirements about analytical grain and fact tables.

## Modeling Checklist

1. **Define analytical grain** — Identify the atomic level of measurement (transaction, event, daily user, etc.)
2. **Identify fact tables** — Tables that measure business events with foreign keys to dimensions
3. **Identify dimension tables** — Tables that describe entities (customers, products, dates, etc.)
4. **Check cardinality** — Understand primary key relationships and fan-out patterns
5. **Verify normalization** — Assess if 3NF, star schema, or denormalized design is appropriate
6. **Flag snowflaking** — Detect unnecessary dimension hierarchy levels that could be flattened
7. **Map conformed dimensions** — Identify dimensions reused across fact tables to ensure consistency
8. **Document lineage** — Trace data from source systems through transformations to final tables

## Modeling Patterns

**Star schema** — Central fact table surrounded by denormalized dimension tables. Fast for analytical queries; simple joins; easiest for BI tools.

**Snowflake schema** — Fact table with normalized dimensions (dimensions broken into sub-dimensions). Saves storage; harder to query; more joins required.

**3rd Normal Form (3NF)** — Fully normalized relational schema. Optimized for transactional consistency; not optimized for analytics (requires many joins).

**Data vault** — Hubs (core entities), links (relationships), satellites (attributes over time). Scalable; supports slowly changing dimensions; complex queries.

**Kimball methodology** — Dimensional modeling focused on business processes; conformed dimensions; iterative design.

## Design Template

```markdown
# Data Model Design

**Project:** [Project name]  
**Purpose:** [Analytics use case — e.g., revenue attribution, churn prediction]  
**Grain:** [Atomic level of fact — e.g., transaction, daily_user, event]  
**Design Pattern:** [Star / Snowflake / 3NF / Data Vault]  
**Version:** 1.0  
**Last Updated:** [date]

---

## Business Requirements

- [Key metric 1]
- [Key metric 2]
- [Key metric 3]

---

## Fact Tables

### fact_transactions

| Column | Type | Description | Grain |
|--------|------|-------------|-------|
| transaction_id | INT | Primary key | transaction |
| customer_id | INT | Foreign key to dim_customers | |
| product_id | INT | Foreign key to dim_products | |
| order_date_id | INT | Foreign key to dim_date | |
| transaction_amount | DECIMAL(10,2) | Revenue in USD | |
| quantity | INT | Units sold | |

**Primary Key:** transaction_id  
**Grain:** One row per transaction  
**Volume:** ~100M rows; grows ~10M/month  

---

## Dimension Tables

### dim_customers

| Column | Type | Description | SCD Type |
|--------|------|-------------|----------|
| customer_id | INT | Primary key | 0 |
| customer_name | VARCHAR | | 1 |
| email | VARCHAR | | 1 |
| country | VARCHAR | | 1 |
| segment | VARCHAR | Premium / Standard / Trial | 1 |
| created_date | DATE | | 0 |

**Cardinality:** ~50K unique customers  
**Update Frequency:** Daily  
**SCD Type:** 1 (overwrite) for attributes; Type 2 would be needed for segment history  

### dim_products

| Column | Type | Description | SCD Type |
|--------|------|-------------|----------|
| product_id | INT | Primary key | 0 |
| product_name | VARCHAR | | 1 |
| category | VARCHAR | | 1 |
| price | DECIMAL(8,2) | | 1 |

**Cardinality:** ~5K products  
**Update Frequency:** Weekly  
**SCD Type:** 1  

### dim_date

| Column | Type | Description |
|--------|------|-------------|
| date_id | INT | YYYYMMDD format |
| calendar_date | DATE | |
| year | INT | |
| month | INT | |
| day_of_week | INT | 1=Monday, 7=Sunday |
| is_weekend | BOOLEAN | |

**Cardinality:** ~3K rows (10 years)  
**Update Frequency:** Static (except current year)  

---

## Entity-Relationship Diagram

\`\`\`
                    dim_customers
                          |
                          | (customer_id)
                          |
fact_transactions -- dim_products
                          |
                          | (product_id)
                          |
                    dim_date
                          |
                          | (order_date_id)
                          |
\`\`\`

---

## Conformed Dimensions

- **dim_customers** — Used by: fact_transactions, fact_orders, fact_support_tickets
- **dim_date** — Used by: all fact tables
- **dim_products** — Used by: fact_transactions, fact_returns

_Ensure customer_id, date_id, product_id are consistent across all uses._

---

## Data Quality Checks

| Check | Frequency | Threshold |
|-------|-----------|-----------|
| NULL values in fact tables | Daily | <1% per column |
| Orphaned foreign keys | Daily | 0 |
| Duplicate transaction_ids | Daily | 0 |
| Revenue monotonicity | Daily | Increase ≥ yesterday |

---

## Slowly Changing Dimensions

### dim_customers (segment)

**Strategy:** SCD Type 1 (overwrite)  
**Reason:** Current segment state is what matters for analytics; history not required  
**Implementation:** UPDATE dim_customers SET segment = 'Premium' WHERE customer_id = X  

### dim_products (price)

**Strategy:** SCD Type 2 (slowly changing with history)  
**Reason:** Need historical prices to correctly attribute margin and compare products over time  
**Implementation:** New rows for each price change; current_flag indicator  

---

## Assumptions & Constraints

- Customer IDs are stable (never reassigned)
- Order dates are in UTC; no timezone conversion needed
- Product catalog is complete (no missing products)
- No late-arriving facts expected (data arrives within 24h of event)

---

## Implementation Roadmap

- Phase 1: fact_transactions, dim_customers, dim_products, dim_date
- Phase 2: Add fact_returns, fact_customer_attributes (SCD Type 2)
- Phase 3: Add fact_support_tickets, fact_marketing_spend

---


```

## Example

See Design Template above — adapt for your business domain.

---

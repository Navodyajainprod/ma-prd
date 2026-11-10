---
title: "Packed Pricing, Credit Bundles & Country Rates"
product: "admin"
module: "plans"
channel: "pricing"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | PLANS |
| Channel | PRICING |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Packed Pricing tab defines credit top-up packages (e.g. 1,000, 5,000, 10,000 credits), additional team member seat packs, and country-specific telephony and SMS per-minute rate cards for over 50 countries.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Credit Top-Up Bundles & Seat Pack Pricing
#### 1. What it does
Configures self-service credit bundle prices for practice wallet top-ups and sets pricing for additional clinician seat licenses beyond plan quotas.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Credit Bundles Pricing Table | Data Table | Defines Bundle Name, Credits Amount, Retail Price, and Unit Discount Percentage | e.g. 5,000 credits @ $90 |
| F-1.2: Seat Pack License Rate | Number Input | Sets price per additional user seat per month (e.g. $29/seat/mo) | Auto-billed on invoice |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin updates credit bundle pricing | Sets 10,000 credits to $160 (20% discount) | **Tenants purchasing 10,000 credits receive discounted rate on Stripe checkout** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Finance Administrator | When pricing consumption credits, I want volume discount tiers, so that high-usage clinics are incentivized to buy larger bundles. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Purchasing a credit bundle charges the configured price and immediately credits the tenant wallet. |

### F-2: Country-Specific Telephony & SMS Rate Cards
#### 1. What it does
Maintains international rate cards for carrier telephony: inbound call per-minute rate, outbound call rate, and SMS segment costs for over 50 countries (US, UK, India, Canada, Germany, Australia, etc.).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Country Rates Data Table | Data Table | Columns: Country, ISO Code, Inbound Rate ($/min), Outbound Rate ($/min), SMS Rate ($/segment) | Searchable by country name |
| F-2.2: Rate Card Bulk Editor | Modal | Adjusts base telephony markup percentage across all international routes | Calculates net margin |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin checks United Kingdom rate | Table shows UK: Inbound $0.01/min, Outbound $0.02/min, SMS $0.02/segment | **Calls placed to UK numbers deduct credits based on these exact rates** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Telecom Manager | When routing international patient calls, I want precise country rate cards, so that telephony usage is billed accurately without carrier losses. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Telephony call billing calculates duration in seconds and deducts credits matching destination country rates. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Credit Top-Up Bundles & Seat Pack Pricing | F-1.1, F-1.2 | Configures self-service credit bundle prices for practice wallet top-ups and sets pricing for additional clinician seat licenses beyond plan quotas. |
| F-2 | Country-Specific Telephony & SMS Rate Cards | F-2.1, F-2.2 | Maintains international rate cards for carrier telephony: inbound call per-minute rate, outbound call rate, and SMS segment costs for over 50 countries (US, UK, India, Canada, Germany, Australia, etc. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Finance Administrator | When pricing consumption credits, I want volume discount tiers, so that high-usage clinics are incentivized to buy larger bundles. | F-1 |
| 2 | Telecom Manager | When routing international patient calls, I want precise country rate cards, so that telephony usage is billed accurately without carrier losses. | F-2 |

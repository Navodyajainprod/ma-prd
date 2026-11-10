---
title: "Insurance Claims, EDI Billing & Clearinghouse"
product: "client"
module: "claims"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | CLAIMS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Insurance & Claims module facilitates healthcare reimbursement: verifying patient insurance eligibility, generating standard electronic EDI 837 claims with ICD-10 and CPT codes, and tracking clearinghouse submission statuses.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Electronic EDI Claim Generation & Diagnosis Code Mapping
#### 1. What it does
Generates electronic insurance claims linking patient encounter charges to ICD-10 diagnosis codes and CPT procedure codes with provider NPI numbers for submission to clearinghouses.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Claim Builder Form | Form | Captures Payer ID, Policy Number, Primary Diagnosis ICD-10, Procedure CPT, and Billed Amount | Validates mandatory claim fields |
| F-1.2: Real-Time Scrubber Validation | Logic | Validates claim rules to prevent rejections (checks missing NPI, invalid code format) | Flags errors in red |
| F-1.3: Clearinghouse Submission Status | Status Badge | Tracks claim lifecycle: Draft, Submitted, Acknowledged, Paid, Denied | Displays denial reason code |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Biller submits claim for dermatology biopsy | Attaches ICD-10 'L82.1' and CPT '11102', clicks 'Submit Claim' | **Claim passes automated scrubber and submits to clearinghouse with confirmation #CLM-892** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Insurance Biller | When billing commercial insurers, I want pre-submission claim scrubbing, so that avoidable coding errors and claim denials are eliminated. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Claims missing required ICD-10 diagnosis or provider NPI are blocked from submission with specific field error alerts. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Electronic EDI Claim Generation & Diagnosis Code Mapping | F-1.1, F-1.2, F-1.3 | Generates electronic insurance claims linking patient encounter charges to ICD-10 diagnosis codes and CPT procedure codes with provider NPI numbers for submission to clearinghouses. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Insurance Biller | When billing commercial insurers, I want pre-submission claim scrubbing, so that avoidable coding errors and claim denials are eliminated. | F-1 |

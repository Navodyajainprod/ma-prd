---
title: "Webforms, Digital Intake & Signature Collection"
product: "client"
module: "web-forms"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | WEB-FORMS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Webforms & Intake module allows clinics to build responsive digital patient intake questionnaires with customizable fields, digital signature collection, iframe embedding, and automated CRM patient chart ingestion.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Visual Intake Form Builder & Shareable Public URL
#### 1. What it does
Enables dragging and dropping form fields (Personal Info, Medical History Checkboxes, Insurance Card Upload, Digital Signature) to construct digital intake questionnaires that can be shared via link or embedded on the clinic website.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Drag-and-Drop Form Builder | Visual Builder | Palette of field components: Text, Phone, Date of Birth, Checkbox Group, File Upload, Signature Pad | Live preview toggle |
| F-1.2: Public Shareable URL & Embed Code | Code Generator | Generates public web link and HTML iframe embed snippet for clinic website integration | SSL encrypted link |
| F-1.3: Automated Patient Chart Ingestion | Logic | Form submissions automatically populate new or existing patient charts and create an intake timeline event | Eliminates manual data entry |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic sends intake form link before visit | Patient receives SMS link, fills medical history and signs on phone screen | **Submitted form syncs to patient's chart in Client and notifies front desk** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Coordinator | Before patients arrive, I want them to complete intake forms digitally on their phone, so that waiting room clipboards are eliminated. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Submitted webforms automatically create or update patient demographic and medical records in the CRM. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Visual Intake Form Builder & Shareable Public URL | F-1.1, F-1.2, F-1.3 | Enables dragging and dropping form fields (Personal Info, Medical History Checkboxes, Insurance Card Upload, Digital Signature) to construct digital intake questionnaires that can be shared via link or embedded on the clinic website. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Coordinator | Before patients arrive, I want them to complete intake forms digitally on their phone, so that waiting room clipboards are eliminated. | F-1 |

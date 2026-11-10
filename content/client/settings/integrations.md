---
title: "Third-Party Integrations, Twilio SIP & Webhooks"
product: "client"
module: "settings"
channel: "integrations"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | INTEGRATIONS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Integrations tab manages external service connections: Twilio SIP Telephony credentials, Meta WhatsApp Business API tokens, Stripe Connect payment gateway keys, and outbound custom webhook dispatchers.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Twilio Telephony & Meta WhatsApp API Credential Binding
#### 1. What it does
Stores API credentials and verifies connectivity for carrier telecom trunks (Twilio Account SID, Auth Token) and Meta WhatsApp Cloud API (WABA ID, Access Token).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Twilio SIP Connection Card | Config Card | Input fields for Account SID, Auth Token, and default Caller ID phone number | Includes 'Test Connection' button |
| F-1.2: Meta WhatsApp Cloud Card | Config Card | Input fields for WABA ID, Phone Number ID, and Permanent System Token | Verifies Meta webhook handshake |
| F-1.3: Connection Status Indicator | UI Badge | Displays live 'Connected' (green) or 'Disconnected' (red) ping status | Diagnostic error tooltips |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin enters Twilio credentials | Pastes SID and Auth Token, clicks 'Test Connection' | **System verifies SIP trunk and displays green 'Connected' badge with active phone numbers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When connecting our telephony, I want real-time API connection testing, so that I can verify call routing before going live. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given valid Twilio credentials, testing connection returns HTTP 200 and displays green connected badge. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Twilio Telephony & Meta WhatsApp API Credential Binding | F-1.1, F-1.2, F-1.3 | Stores API credentials and verifies connectivity for carrier telecom trunks (Twilio Account SID, Auth Token) and Meta WhatsApp Cloud API (WABA ID, Access Token). |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When connecting our telephony, I want real-time API connection testing, so that I can verify call routing before going live. | F-1 |

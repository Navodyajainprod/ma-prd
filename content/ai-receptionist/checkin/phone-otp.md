---
title: "Phone Keypad, 4-Digit OTP & Household Picker"
product: "ai-receptionist"
module: "checkin"
channel: "phone-otp"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Phone & OTP Verification (`/reception/appointment` / `/reception/walk-in`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Patient Profile & Household Phone Matching | Phone lookups match across registered clinic patient phone fields and surface linked household dependents under one shared family number. | [View in Client](/client/clients) |
| Client | Invoice & Balance Verification | When a visitor opens Billing on the kiosk, completing Phone and OTP verification unlocks their live clinic invoice list safely. | [View in Client](/client/invoices) |
| Companion | Shared Family Billing | Settled and pending balances viewed after kiosk phone verification match the patient's mobile Companion billing portal. | [View in Companion](/companion/billing) |
| Companion | Visit Updates | Patients verified by phone on the kiosk receive synchronized queue and visit progress updates in Companion Today. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Phone Keypad, 4-Digit OTP & Household Picker** workflow authenticates visitors who prefer phone verification, arrive for billing inquiries, have not enrolled facial biometrics, or visit as part of a multi-member family sharing one mobile number.
- Designed for quick standing lobby use, large high-contrast touch keys (`0–9`, Backspace, Clear), voice digit dictation, 4-digit SMS verification codes, and household profile selection route visitors cleanly into Scheduled Check-In, Walk-In Registration, Next-Step Guidance, or Billing.

## 2. Feature Requests

### F-1: 10-Digit Touch Keypad, Voice Entry & Validation (`Phone Number Check-in`)
#### 1. What it does
Visitors arriving on **Phone Number Check-in** enter their mobile number using large ergonomic touch buttons (`0–9`, Backspace, Clear) or by speaking digits aloud to Aria. The kiosk automatically normalizes formatting (supporting national formats and stripping leading country codes such as `+1` or `+91` cleanly to compare the trailing 10 digits) and enables **Send Code** once a valid phone number (minimum 7–10 digits) is entered, showing a clear inline notice if fewer digits are submitted.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Large Numeric Keypad | Touch Controls | Renders oversized 0–9 digit keys plus Backspace and Clear for glare/gloved ease | Works alongside spoken digit input |
| F-1.2: Country-Code Normalization | Matching Rule | Ignores spacing, dashes, and leading `+91` / `+1` prefixes when matching clinic numbers | Reduces format mismatches |
| F-1.3: Minimum Length Guard | Inline Validation | Requires at least 7 digits before dispatching an OTP request | Displays clear error hint if too short |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Caregiver enters 10-digit mobile number on keypad | Taps digits and selects Send Code | **Kiosk dispatches 4-digit OTP and opens Security Code Verification** |
| 2 | Visitor only enters 4 digits and submits | Taps Send Code early | **Clear validation message requests a valid phone number without leaving screen** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Walk-In / Unenrolled Visitor | When I do not have face check-in set up, I want an easy-to-tap keypad with voice option, so that I can verify my phone number rapidly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given fewer than 7 digits entered, when **Send Code** is tapped, then an inline error notice MUST appear and OTP dispatch MUST wait. |
| F-1-2 | Given a valid phone number, when **Send Code** succeeds, then the kiosk advances to **Security Code Verification**. |

---

### F-2: 4-Digit SMS OTP Entry, 5-Minute Validity & Resend Cooldown (`Security Code Verification`)
#### 1. What it does
On **Security Code Verification**, visitors enter the **4-digit security code** via four large OTP digit boxes using the numeric keypad or voice commands (demo builds guide visitors clearly with `1 2 3 4`, while validating active challenges within a **5-minute expiration window**). Once the 4th digit is entered, verification triggers automatically (with manual **Verify Code** confirmation available). Visitors can request a fresh code via **Resend Code** (rate-limited by a **30-second cooldown** timer) or step back to edit their phone number; invalid codes show a clear retry notice.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 4-Digit Auto-Verify Boxes | Input UI | Highlights active slot cleanly and submits immediately upon entering the 4th digit | Supports Backspace and spoken numbers |
| F-2.2: 5-Minute Code Expiration | Security Window | Expires unverified OTP codes after 5 minutes | Prompts visitor to request a fresh code |
| F-2.3: Resend Code & 30s Cooldown | Action Control | Prevents SMS flooding via a visible 30-second resend timer | Allows quick recovery if message delayed |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor enters valid 4-digit OTP | Taps 4 digits (`1 2 3 4` in demo) | **Auto-verifies upon 4th digit and searches matching clinic profiles** |
| 2 | Wrong PIN entered | Enters incorrect 4 digits | **Displays error prompt to check code and re-enter** |
| 3 | SMS didn't arrive within 30 seconds | Waits for cooldown timer and taps Resend Code | **Issues fresh 5-minute OTP and restarts 30-second resend timer** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Visitor | When verifying by SMS, I want the kiosk to check my code right after I tap the fourth digit, so that I don't need extra submit clicks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given the 4th OTP digit is entered, then verification runs automatically and rejects expired (>5 min) or mismatched codes with an inline message. |
| F-2-2 | Given an OTP was just dispatched, then **Resend Code** remains locked during the 30-second cooldown window. |

---

### F-3: Multi-Member Household Selector (`Select Patient Profile`)
#### 1. What it does
Clinics frequently share one primary family mobile number across parents, spouses, and children. When OTP verification finds **multiple patient profiles** under the verified number, the kiosk opens **Select Patient Profile** listing large cards with each member's name, relationship or age metadata, and profile status so the visitor picks the exact person checking in or whose bill is being paid.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Family Profile Cards | Selection List | Renders selectable cards for each matching patient sharing the phone number | Spoken prompt adapts for check-in vs billing |
| F-3.2: Single-Match Fast Track | Shortcut | Bypasses the selection screen completely when only one profile matches | Minimizes unnecessary taps |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Mother checks in her son using her own phone number | Verifies OTP and sees both her profile and her son's profile | **Selects her son's card and proceeds directly to his visit details** |
| 2 | Single individual verifies personal mobile | Enters OTP for phone linked to one profile | **Skips household picker and opens their summary or billing ledger directly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Parent / Family Caregiver | When several family members share my phone number, I want to choose the right person cleanly from a list, so that I check in or pay for the right family member. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given more than one patient profile matches the verified phone number, then **Select Patient Profile** MUST render all matched members before exposing clinical or billing details. |
| F-3-2 | Given exactly one patient profile matches, then the kiosk MUST bypass the picker screen automatically. |

---

### F-4: Context-Aware Routing Across Appointments, Walk-Ins, Billing & Next Steps
#### 1. What it does
After phone OTP (and optional household selection) completes, the kiosk branches automatically based on why the visitor started the flow:
- **Check-In / Appointment Flow:** Checks today's appointments for the selected profile — if scheduled today, opens **Visit Summary & Room Assignment**; if already a known profile without an appointment today, opens **Walk-In Service & Doctor Selection**; if no profile exists at all, launches **New Patient Details** walk-in registration.
- **Billing & Payment Flow:** Opens **Billing & Touchless QR Payment** for the chosen profile; if no billing records match the phone number, displays `"No billing records found for this phone number."` safely on the phone screen without launching walk-in clinical registration.
- **My Visit / Next-Step Flow:** Unlocks the visitor's active queue ticket tracker or personalized Care Process Stage card.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Check-In 3-Way Branch | Flow Dispatcher | Routes to Today's Appointment, Returning Walk-In, or New Patient Onboarding seamlessly | Handles both known and first-time visitors |
| F-4.2: Billing Guardrail | Financial Isolation | Shows unpaid/settled bills on match; keeps zero-match users safely on Phone Check-in | Prevents accidental clinical onboarding from Billing |
| F-4.3: Visit & Next-Step Unlock | Status Router | Opens active token status or workflow stage guidance cleanly after verification | Preserves original user intent across OTP |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | First-time walk-in enters phone number and OTP | Completes Phone & OTP from Appointment check-in | **Zero profile matches found; opens New Patient Details to register** |
| 2 | Unrecognized caller enters wrong number inside Billing | Completes OTP from Billing flow | **Kiosk displays "No billing records found for this phone number." and stays on phone retry screen** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Visitor | Whatever task I started with (check-in, paying a bill, or checking next steps), I want verifying my phone once to land me straight on that exact screen. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given zero matching patient profiles are found during Appointment/Walk-In check-in, then the kiosk MUST transition to **New Patient Details**. |
| F-4-2 | Given zero billing records match during a Billing inquiry, then the kiosk MUST display `"No billing records found for this phone number."` and remain on **Phone Number Check-in**. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | 10-Digit Touch Keypad & Voice Input | F-1.1 to F-1.3 | Oversized numeric keypad and voice digit entry with country-code normalization. |
| F-2 | 4-Digit SMS OTP & 30s Resend | F-2.1 to F-2.3 | Auto-submitting 4-digit OTP challenge with 5-minute validity and 30-second resend cooldown. |
| F-3 | Multi-Member Household Picker | F-3.1 to F-3.2 | Disambiguates family members sharing one mobile number while fast-tracking single matches. |
| F-4 | Context-Aware Post-Auth Routing | F-4.1 to F-4.3 | Branches smoothly into Scheduled Check-In, Walk-In Registration, Billing Ledger, or My Visit. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Visitor Without Face Biometrics | Verify phone identity quickly via large keypad or voice digits with instant OTP confirmation. | F-1, F-2 |
| 2 | Family Caregiver | Select the right household member cleanly and land directly on the task I came to complete. | F-3, F-4 |

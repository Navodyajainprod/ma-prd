---
title: "Phone Keypad, 4-Digit OTP & Household Picker"
product: "ai-receptionist"
module: "checkin"
channel: "phone-otp"
route: "/reception/appointment and /reception/walk-in"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | CHECK-IN: PHONE AND OTP VERIFICATION |
| Route | `/reception/appointment` and `/reception/walk-in` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The phone route into the kiosk: a touch keypad with spoken digits, a four-digit code step, a household picker and a router that sends the visitor to check-in, walk-in, Billing, My Visit or Next Step. |
| **Who uses it** | Patient (a visitor, a caregiver or a household member). No sign-in and no role is checked. |
| **Where you start it** | **Use phone number instead** on the face screen, the walk-in route, or the **Billing** tile. Billing always starts here. |
| **Where the result goes** | Visit Summary, walk-in service selection, New Patient Details, the billing ledger, My Visit or the Next Step card. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | Phone lookup and household | The kiosk looks up clients by phone. It matches the trailing digits and also partial and substring matches once 7 digits are typed. Several clients on one number show the household picker (G11-E-04). | [View Clients](/client/clients) |
| Client (Invoices) | Billing after verification | After the code step, the kiosk lists unpaid invoices. When the patient has none, it lists every unpaid invoice in the system (G11-E-05). | [View Invoices](/client/invoices) |
| Companion (Billing) | Same balances | The kiosk and the portal read the same invoices. No sign-in link between them exists. | [View Companion Billing](/companion/billing) |
| Companion (Today) | Visit progress | No hand-off was found. Nothing from the phone check reaches Companion Today. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson cannot use the face scan, so she taps **Use phone number instead**. She types her number on a large keypad. **Send code** works once seven digits are in. The kiosk moves to **Security Code Verification** and Aria says, "enter 1 2 3 4". Sarah types the four digits and the box checks them on the fourth. Her number is shared with her son, so a household picker lists both profiles. She picks her own. The kiosk finds her appointment and opens her Visit Summary. No text message was ever sent. Any number would have accepted the same four digits.

### What is real and what is not

- **Real in the prototype:** the keypad, spoken digits, the seven-digit minimum, the four auto-verify boxes, the household picker with its single-match shortcut, the check-in three-way branch, and the billing message "No billing records found for this phone number."
- **Simulated:** **Send code** succeeds for any number. The code 1234 or 0000 works for every number. The phone lookup also matches partial numbers. After verification, Billing can show other patients' bills, My Visit needs no identity check and Next Step picks a household member silently.
- **Not built:** real SMS delivery, code expiry, **Resend Code**, an attempt limit and lockout, and any use of the verification token.

### Journey position

```
Keypad ─▶ Send code ─▶ 4-digit code ─▶ Lookup ─▶ Household picker ─┬▶ Visit Summary / walk-in / New Patient
                                                                   ├▶ Billing ledger
                                                                   └▶ My Visit / Next Step
```

## 2. Feature Requests

### F-1: Keypad, voice digits and validation

#### 1. What it does
On **Phone Number Check-in** Sarah taps large keys 0 to 9 with Backspace and Clear, or speaks her digits. The kiosk takes up to 15 digits and needs at least 7 before **Send code** works. **Send code** then succeeds for any number.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Touch keypad | Keypad | Keys 0 to 9, Backspace and Clear. Up to 15 digits | ● Works | |
| F-1.2: Spoken digits | Voice | Spoken digits are added to the field | ● Works | |
| F-1.3: Seven-digit minimum | State | Fewer than 7 digits shows an inline notice and **Send code** waits | ● Works | |
| F-1.4: Send code | Action | Returns success for any number and moves to the code step | ◐ Simulated | Nothing is sent (G11-E-03). Decision needed: D-46 |
| F-1.5: Number matching | Rule | The earlier PRD said to drop country codes and match the last 10 digits. The kiosk matches exact, last 10 digits, ends-with and contains (either way) once 7 digits are typed | ◐ Simulated | A few digits can return another patient (G11-E-04) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah types her 10-digit number | Taps **Send code** | **The kiosk opens Security Code Verification** |
| 2 | A visitor types only 4 digits | Taps **Send code** | **A notice asks for a valid number and the screen stays** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I have no face check-in, I want a large keypad with a voice option, so that I can enter my number quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** fewer than 7 digits, **when** **Send code** is pressed, **then** an inline notice shows and the code step does not open. |
| F-1-2 | **Given** 7 or more digits, **when** **Send code** is pressed, **then** the code step opens for any number. No message is sent. |

### F-2: Four-digit code step

#### 1. What it does
Sarah types four digits into four large boxes. The kiosk checks them on the fourth digit. The boxes accept 1234 or 0000 for every number. Aria announces "enter 1 2 3 4" aloud and the error text repeats it. Nothing is sent, nothing expires, and there is no resend or lockout.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Four auto-verify boxes | Input | Verifies on the fourth digit | ● Works | |
| F-2.2: Code check | Verification | Accepts 1234 or 0000 for any number | ◐ Simulated | Not a verification (G11-E-03). Decision needed: D-46 |
| F-2.3: Demo code announced | Voice | Aria and the error text give the code away | ◐ Simulated | G11-E-03 |
| F-2.4: Five-minute expiry | Rule | An expiry value is returned but never checked | ○ Not built | G11-E-03 |
| F-2.5: Resend Code with 30 s cooldown | Button | No resend control exists | ○ Not built | Decision needed: D-46 |
| F-2.6: Attempt limit and lockout | Rule | No limit after wrong codes | ○ Not built | Decision needed: D-46 |
| F-2.7: SMS delivery | Channel | No text message is sent | ○ Not built | Decision needed: D-46 |
| F-2.8: Verification token | Session | A token is stored and ignored by every lookup | ◐ Simulated | Decision needed: D-41 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah enters 1 2 3 4 | Taps four digits | **The code is accepted on the fourth digit and profiles are searched** |
| 2 | A visitor enters 0 0 0 0 with a stranger's number | Taps four digits | **The code is accepted** |
| 3 | A visitor enters a wrong code | Taps four digits | **An error shows and repeats the demo code** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I verify by text message, I want the kiosk to check my code after the fourth digit, so that I need no extra tap. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the fourth digit is entered, **then** verification runs on its own. |
| F-2-2 | **Given** the code is 1234 or 0000, **then** it is accepted for any number. |
| F-2-3 | **Given** a code older than 5 minutes, **then** it is still accepted. No resend control and no lockout exist. |

### F-3: Household picker

#### 1. What it does
Many families share one number. When the number matches more than one client, **Select Patient Profile** shows a card for each person. Sarah's number matches her and her son. She picks one. When only one profile matches, the picker is skipped.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Family profile cards | List | One card per matching client | ● Works | |
| F-3.2: Single-match shortcut | Rule | Skips the picker when one profile matches | ● Works | |
| F-3.3: Picker in the Next Step flow | Rule | The Next Step flow by phone picks the first matching member without asking | ◐ Simulated | G11-E-07 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah checks in her son | Verifies and picks his card | **His visit details open** |
| 2 | One profile on the number | Verifies | **The picker is skipped** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When family members share my number, I want to choose the right person, so that I check in or pay for the right one. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** more than one client matches the number, **then** the picker lists them before any visit or bill shows. |
| F-3-2 | **Given** one client matches, **then** the picker is skipped. |
| F-3-3 | **Given** the Next Step flow by phone, **then** the first matching member is used without a picker. |

### F-4: Routing by what the visitor came to do

#### 1. What it does
After the code and the picker, the kiosk branches by the flow the visitor started. For check-in it opens the Visit Summary when there is an appointment, walk-in service selection for a known patient with none, or New Patient Details for an unknown number. For Billing it opens the ledger, or shows "No billing records found for this phone number." and stays on the keypad. My Visit and Next Step open their own screens.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Check-in three-way branch | Router | Appointment, known patient without one, or unknown number to New Patient Details | ● Works | |
| F-4.2: Billing zero-match message | State | Shows "No billing records found for this phone number." and stays on the phone screen | ● Works | Works when no client exists |
| F-4.3: Billing shows the verified patient's bills | Lookup | When a verified patient has no invoices, the lookup lists every unpaid invoice in the system | ◐ Simulated | G11-E-05. Decision needed: D-39 |
| F-4.4: Next Step by phone | Router | Opens the Next Step card for the first matching member | ◐ Simulated | G11-E-07 |
| F-4.5: My Visit after verification | Router | My Visit takes the first ticket of the first queue and needs no identity | ◐ Simulated | G11-E-06 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A first-time visitor starts check-in | Completes phone and code | **No profile matches and New Patient Details opens** |
| 2 | A visitor with an unknown number starts Billing | Completes phone and code | **The kiosk shows the no-records message and stays on the keypad** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I verify my phone once, I want to land on the screen I came for, so that I do not start again. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** no client matches during check-in, **then** New Patient Details opens. |
| F-4-2 | **Given** no client matches during Billing, **then** the no-records message shows and the keypad stays. |
| F-4-3 | **Given** a client matches during Billing and has no invoices, **then** every unpaid invoice in the system is listed. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Keypad, voice digits and validation | F-1.1 – F-1.5 | ● / ◐ | Keypad works; send and matching are simulated. |
| F-2 | Four-digit code step | F-2.1 – F-2.8 | ◐ / ○ | Any number takes 1234 or 0000; no expiry, resend or lockout. |
| F-3 | Household picker | F-3.1 – F-3.3 | ● / ◐ | Picker works; Next Step skips it. |
| F-4 | Routing by purpose | F-4.1 – F-4.5 | ● / ◐ | Branches work; bills and My Visit are not scoped to the patient. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Enter my number quickly without face check-in | F-1 |
| 2 | Patient | Have my code checked after the fourth digit | F-2 |
| 3 | Patient | Choose the right family member | F-3 |
| 4 | Patient | Land on the screen I came for | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Verify any number with 1234 or 0000 and open that patient's visit or bills | Nothing |

The earlier PRD says a verified phone unlocks bills and visit data safely. In the prototype the code is not a verification. Decision needed: D-41 and D-46.

## 5. Metrics and definitions

No metric is shown. The code step uses fixed values: 4 digits, minimum 7 phone digits, maximum 15. The 5-minute validity and 30-second resend of the earlier PRD are not applied.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Phone and code (2.1) | Any number takes 1234 or 0000. Lookup also matches partial numbers (G11-E-03, G11-E-04). |
| | Billing lookup (2.9) | Bills of other patients can show (G11-E-05). |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-46 | How is the OTP delivered in production, how long does it live, and what are the retry and lockout limits? | F-1.4, F-2.2, F-2.5 – F-2.7 |
| D-41 | What may a successful verification authorise, and for how long? | F-2.8, Section 4 |
| D-39 | What may appear on screen after verification, including bills? | F-4.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |

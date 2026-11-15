---
title: "Live Sync, Duplicate Protection & Kiosk Resilience"
product: "ai-receptionist"
module: "settings"
channel: "architecture"
route: "/reception"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | SETTINGS: LIVE SYNC, DUPLICATE PROTECTION & KIOSK RESILIENCE |
| Route | `/reception` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The behind-the-scenes rules that keep the kiosk and the clinic screens in step: how settings reach a running kiosk, the 24-hour duplicate guard, queue progress, the 60-second privacy reset and the fallbacks for voice and camera. There is no screen of its own. |
| **Who uses it** | Practice Admin (relies on it after saving settings). Front-desk Staff (watch the desk screens). Patients (use the kiosk). |
| **Where you start it** | Nothing is started. It runs when settings are saved at `/settings/reception` and while a visitor uses the kiosk at `/reception`. |
| **Where the result goes** | Open kiosk tabs in the same browser, the kiosk's own ticket store, and the browser's local storage. No server is involved. |
| **How real is it** | 0 features work, 3 are partly simulated, 1 is not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings) | Settings reach the kiosk | Saving the AI Receptionist tab updates open kiosk tabs in the same browser. Other devices are not reached. | [View Reception Settings](/client/settings/reception) |
| Client (Appointments) | Arrived status | Not connected. Kiosk check-in does not change the clinic's appointment. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | QR settlement | A kiosk payment is recorded on the invoice in the same browser. Nothing checks that money arrived. | [View Invoices](/client/invoices) |
| Client (Audit Logs) | Kiosk audit events | Not connected. Events stay in the kiosk browser's storage. | [View Audit Logs](/client/settings/audit-logs) |
| Client (Call Logs) | Call Staff alert | Not connected. No alert reaches the front desk. | [View Call Logs](/client/call-logs) |
| Companion | Queue number and receipts | Not covered by this analysis. | [View Companion Today](/companion/today) |
| AI Receptionist (Kiosk) | Privacy reset and speech | The kiosk shell runs the countdown and the voice fallback described here. | [View Kiosk Shell](/ai-receptionist/avatar/kiosk-shell) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, saves new settings at `/settings/reception`. In another tab of the same browser the kiosk is open at the front desk. The kiosk picks up the change without a refresh. Meera Iyer watches a patient tap **Confirm** twice on a slow screen. Two tickets are made, because the kiosk never asks for the duplicate guard. The patient walks away mid-way. After 60 seconds the screen returns to Welcome. If the camera is unplugged, the patient is told to use a phone number instead. Meera notices that the kiosk's check-in does not turn the appointment to Arrived on her desk screen. All of this lives in one browser, so a kiosk on a separate device would see none of it.

### What is real and what is not

- **Real in the prototype:** settings changes reaching open kiosks in the same browser, the 60-second countdown and return to Welcome, the voice fallback to browser speech, and the camera-unavailable message.
- **Simulated:** invoice settlement, audit events and room updates. They work inside one browser only. The 24-hour duplicate guard exists but is not used by the kiosk.
- **Not built:** sync across devices, staff alerts, Arrived on the clinic appointment, and live recalculation of People Ahead.

### Journey position

```
Settings save ─▶ browser storage ─▶ Kiosk tab (same browser)
Kiosk check-in ─▶ kiosk store ─╳▶ clinic appointment (not connected)
Kiosk idle 60s ─▶ Welcome
```

## 2. Feature Requests

### F-1: Live sync between settings, kiosk and desk

#### 1. What it does
Everything lives in the browser's local storage. Saving settings sends a change event and a storage event. A kiosk tab in the same browser listens and reloads. Rooms are read each time the kiosk asks for stations or directions. Nothing crosses devices.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Settings reach open kiosks | Sync | The kiosk subscribes to the change and storage events and reloads its settings | ● Works | Same browser profile only (G9-AR-01) |
| F-1.2: Which organisation's settings the kiosk reads | Rule | Save also writes one shared "last saved" key. A kiosk with no or an unknown organisation falls back to it and shows whoever saved last | ◐ Simulated | Branding, contacts and terminals can leak between organisations (G9-E-13) |
| F-1.3: Room edits reach the kiosk | Sync | Re-read on each request for stations or directions | ◐ Simulated | Service rooms only (G9-AR-02, G9-E-15) |
| F-1.4: Arrived on the clinic appointment | Sync | Earlier intent: check-in turns the desk appointment to Arrived at once | ○ Not built | The kiosk uses its own copy of appointments (XM-02, G11-E-42). Decision needed: D-122 |
| F-1.5: Invoice settlement | Sync | The QR "I Have Paid" button records a payment on the invoice in the same browser | ◐ Simulated | The visitor's tap is enough. If the invoice is not found, a new paid invoice is created (G11-E-16, G11-E-17). Decision needed: D-63 |
| F-1.6: Audit events | Log | Check-ins, biometrics and directions views are logged | ◐ Simulated | Kept in the kiosk browser only, not in the clinic audit log (G11-E-13). Decision needed: D-42 |
| F-1.7: Call Staff alert on the desk | Notification | Earlier intent: a lobby alert notifies reception | ○ Not built | The overlay shows but nobody is told (G11-E-31). Decision needed: D-128 |
| F-1.8: Sync across devices | Sync | Earlier intent: kiosk terminal and desk browser on different machines stay in step | ○ Not built | Browser storage only (G9-AR-07). Decision needed: D-02 |

#### 3. Worked example
Rohan saves a new clinic name.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Kiosk tab open in the same browser | Presses **Save settings** | **The kiosk shows the new name without a refresh** |
| 2 | Kiosk on a different computer | Presses **Save settings** | **That kiosk does not change** |
| 3 | Kiosk opened with no organisation in its address | Opens it after another organisation saved | **It shows the organisation that saved last** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When a visitor checks in or pays at the kiosk, I want my screens to update, so that I never call someone already checked in. |
| F-1-J2 | Practice Admin | When I save settings, I want every kiosk to follow, so that the lobby matches the clinic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a kiosk tab open in the same browser, **when** settings are saved, **then** the kiosk reloads them. A kiosk on another device is not updated. |
| F-1-2 | **Given** a kiosk with an unknown organisation, **when** it loads, **then** it uses the last saved settings of any organisation. |
| F-1-3 | **Given** a kiosk check-in, **then** the clinic appointment is not changed. |

### F-2: Duplicate-action protection (24 hours)

#### 1. What it does
The kiosk's data layer can remember a request for 24 hours and return the first answer to a repeat. It covers check-in, walk-in booking, ticket creation and ticket advance. Meera sees that the kiosk does not use it. The Confirm button stays active and no key is sent.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: 24-hour guard in the data layer | Rule | Returns the first result for a repeated key within 24 hours | ○ Not built | The code exists but the kiosk never passes a key, so it is never used (G11-E-23) |
| F-2.2: Double tap on Confirm check-in | State | A second tap creates a second journey and ticket. The button is not disabled | ○ Not built | G11-E-23 |
| F-2.3: Payment guard | Rule | Earlier intent: a repeat payment returns the settled receipt | ○ Not built | Payment recording has no guard in the code. Not run twice to confirm (unverified) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Slow screen | Patient taps **Confirm** twice | **Two tickets can be created** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I tap a confirm button twice by mistake, I want one check-in and one token, so that my visit is not doubled. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Confirm check-in is tapped twice, **then** two journeys and two tickets are created. |
| F-2-2 | **Given** the data layer receives the same key twice within 24 hours, **then** it returns the first result. The kiosk sends no key. |

### F-3: Queue progress and People Ahead

#### 1. What it does
Staff can mark a ticket as No Show or Left from the client's visit card. The kiosk does not recalculate anything when they do. Meera sees the same wait number that was saved when the ticket was issued.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Ticket statuses | Status | Waiting, In Service, Completed, No Show. Left is stored as Cancelled | ◐ Simulated | G9-AR-04 |
| F-3.2: Mark No Show or Left | Action | Staff change the ticket status | ● Works | |
| F-3.3: People Ahead recalculation | Metric | Earlier intent: counts and waits drop when a ticket above leaves | ○ Not built | Status changes, nothing recalculates (G11-I-133). Decision needed: D-123 |
| F-3.4: Estimated wait | Metric | The value is saved when the ticket is issued. My Visit falls back to 5 minutes | ◐ Simulated | The token screen shows "token minus 4" and "at least 1": **Hardcoded, formula undefined** (G11-E-22) |
| F-3.5: Live refresh on kiosk screens | Sync | Earlier intent: screens refresh when staff move tickets | ○ Not built | The client supports a subscription. No screen uses it (G11-I-131) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Tickets `L-005`, `L-006`, `L-007` wait | Staff mark `L-005` as **Left** | **The ticket is stored as cancelled. The other waits do not change** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When someone ahead of me goes in or leaves, I want my count to drop, so that I am at the door on time. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** staff mark a ticket Left, **then** it is stored as Cancelled. |
| F-3-2 | **Given** a ticket status changes, **then** the other tickets' waits are not recalculated. |

### F-4: Privacy reset and hardware resilience

#### 1. What it does
On every kiosk screen after the home screen, a countdown starts at 60 seconds. Touching, typing or moving the pointer restores it. At zero the kiosk returns to Welcome. Voice and camera have fallbacks so Meera's lobby is never stuck.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: 60-second countdown | Timer | Visible countdown, reset by touch, key or pointer. At zero the kiosk returns to Welcome | ● Works | |
| F-4.2: Wipe of visitor details | Rule | Clears the visitor's details on screen | ◐ Simulated | Invoices, QR state and next-step data are not cleared. "Different Patient" keeps the phone and code in memory (G11-E-10, G11-E-11). Decision needed: D-129 |
| F-4.3: Reset on scroll and speech | Rule | Earlier intent: scroll and spoken input restart the timer | ○ Not built | G11-I-06 |
| F-4.4: Voice fallback | Fallback | If cloud transcription takes over 8 seconds or fails, browser speech is used | ● Works | Visitor audio goes to a server speech service with no notice (G11-I-31). Decision needed: D-34 |
| F-4.5: Camera unavailable | State | Shows a message and offers phone-number check-in | ● Works | |
| F-4.6: Services or doctors fail to load | State | Only logged. The picker is empty with no message | ○ Not built | G11-E-41 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient checks a balance, is called in, forgets Start over | Walks away | **After 60 seconds the screen returns to Welcome** |
| 2 | Camera unplugged | Patient tries face check-in | **A message offers check-in by phone number** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When patients leave a lobby screen, I want details cleared within 60 seconds, so that strangers do not see them. |
| F-4-J2 | Practice Admin | When a camera is unplugged or speech is slow, I want visitors to finish by touch or phone, so that the kiosk stays usable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a kiosk screen after home, **when** 60 seconds pass with no input, **then** the kiosk returns to Welcome. |
| F-4-2 | **Given** the camera cannot start, **then** a message shows and phone-number check-in stays available. |
| F-4-3 | **Given** cloud transcription takes over 8 seconds, **then** browser speech is used. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Live sync | F-1.1 – F-1.8 | ● / ◐ / ○ | Same browser only. Appointments, alerts and devices not connected. |
| F-2 | Duplicate protection | F-2.1 – F-2.3 | ○ Not built | Guard exists in code and is not used. |
| F-3 | Queue progress | F-3.1 – F-3.5 | ◐ / ○ | Statuses change. Nothing recalculates. |
| F-4 | Privacy and resilience | F-4.1 – F-4.6 | ● / ◐ / ○ | Countdown and fallbacks work. Wipe is partial. |

### 3.2 Jobs to be done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | See kiosk activity on my screens | F-1 |
| 2 | Practice Admin | Have saved settings reach every kiosk | F-1 |
| 3 | Patient | Avoid doubled check-ins | F-2 |
| 4 | Patient | See my place in the queue fall | F-3 |
| 5 | Practice Admin | Clear details within 60 seconds | F-4 |
| 6 | Practice Admin | Keep the kiosk usable when hardware fails | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Save the settings that the kiosk picks up | Nothing |
| Admin, Manager, Agent, Reception | Mark tickets No Show or Left on the client's visit card | Opening the AI Receptionist settings |
| Kiosk visitor | Use the kiosk with no sign-in | Everything outside the kiosk |

The earlier PRD named a front-desk receptionist, a clinic owner and a privacy officer without access rules. Decision needed: D-16.

## 5. Metrics and definitions

The kiosk token screen shows "now serving" as the token number minus 4 and People Ahead as at least 1. **Hardcoded, formula undefined.** Estimated wait is saved at issue time (G11-E-22).

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in to Billing | Patient taps confirm | No duplicate guard is used, so a double tap can make two tickets. |
| | Check-in marks the appointment | Not connected. The clinic appointment is unchanged. |
| | Check-in audit | Stays in the kiosk browser's storage. |
| | QR payment | Recorded on the invoice in the same browser. Nothing checks the money. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-02 | Does the PRD state backend needs such as sync across devices? | F-1.8 |
| D-16 | Which roles may reach AI Receptionist settings? | Section 4 |
| D-34 | Is consent needed before kiosk speech goes to a server? | F-4.4 |
| D-42 | Which kiosk events must reach the clinic audit log? | F-1.6 |
| D-63 | May the kiosk mark an invoice Paid on the visitor's word? | F-1.5 |
| D-122 | Should check-in set the appointment to Arrived? | F-1.4 |
| D-123 | How are People Ahead and wait defined, and do they update live? | F-3.3, F-3.4 |
| D-128 | How is the front desk alerted by Call Staff? | F-1.7 |
| D-129 | Should the 60-second timer pause during payment save or face capture? | F-4.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |

---
title: "Visits: Booking, Prepaid Booking and Visit List"
product: "companion"
module: "appointments"
route: "/patient/book"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | APPOINTMENTS |
| Route | `/patient/book` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A Visits screen with **Upcoming** and **Past** tabs and a three-step **Book** sheet: service and clinician, date and time, and a payment step only for prepaid services. |
| **Who uses it** | Patient. Meera Iyer sees the booking on the clinic calendar. Nothing on `/patient` is protected (G12-E-01). |
| **Where you start it** | **Visits** in the portal drawer, the next-appointment row on Today, or the Care Bot. |
| **Where the result goes** | A new appointment in the clinic calendar with source "MA-Client", an invoice and payment for prepaid services, and a new pipeline stage for the patient. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Appointments) | Calendar and list | A patient booking appears with source "MA-Client" and an assigned room. It skips the clinic's "appointment automation required" check. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Prepaid booking | The appointment service creates the invoice first with a placeholder 150 line plus 8 percent tax. The portal then records its own amount as paid, so total and paid differ. | [View Invoices](/client/invoices) |
| Client (Services) | Services and team | Services, prices, prepaid flags and clinician working hours decide what can be booked. | [View Services](/client/services) |
| Client (Processes) | Pipeline stage | Booking sets the stage to "Payment Done" or "Client Checked In" and adds "Patient Care Journey". | [View Process Kanban](/client/processes/kanban) |
| Client (Appointments) | Staff cancels | Cancelling a prepaid portal booking voids its invoice even when paid. The portal has no cancel control. | [View Appointments](/client/appointments/list) |
| Companion | Billing | A prepaid booking's invoice later appears on Billing. | [View Companion Billing](/companion/billing) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Visits** and sees her Upcoming and Past tabs. She presses **Book**. She picks a prepaid follow-up service and "Any Available Clinician". A banner shows the prepaid amount. She picks a week day and the first slot is already selected. A summary shows fee plus tax with a Card or touchless QR tab. She presses Confirm and confetti falls. The message says her payment was received. No money moved. Meera Iyer sees the booking on the clinic calendar. The invoice total does not match what Sarah "paid". Sarah cannot cancel or reschedule from the portal.

**Naming note:** the drawer says "Visits". The earlier PRD called this "Patient Appointment Booking & Visit History". Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the Upcoming and Past lists, the service and clinician picker, slot generation from working hours, the booking and its room assignment.
- **Simulated:** the prepaid payment (no charge, test card prefilled), the invoice (placeholder line), the booking stages (patient looks checked in or paid early) and the fallback "$75" fee label.
- **Not built:** reschedule and cancel, slot lock during checkout, calendar invite, confirmation SMS, provider photos and bios, specialty filter, refund.

### Journey position

```
Visits ─▶ Book ─▶ Slot ─▶ (Pay) ─▶ Appointment + stage ─┬▶ Clinic calendar
                                                        └▶ Invoice and payment (prepaid)
```

## 2. Feature Requests

### F-1: Visit list

#### 1. What it does
Sarah opens Visits. **Upcoming** lists visits not completed or cancelled. **Past** lists completed or cancelled ones. Each row shows status, doctor, room and date.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Upcoming tab | List | Appointments not completed and not cancelled | ◐ Simulated | A No-show counts as upcoming. Namesakes can see each other's visits (G6-E-04) |
| F-1.2: Past tab | List | Completed or cancelled appointments | ◐ Simulated | Same patient matching as Upcoming (G6-E-04) |
| F-1.3: Visit row | Row | Status, doctor, room and date | ● Works | |
| F-1.4: Encounter history | List | Past medical encounters | ○ Not built | The lists show appointments only |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah had a visit last month | Opens **Past** | **The visit shows with its status, doctor, room and date** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I plan my care, I want to see my upcoming and past visits, so that I remember what is booked. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** an appointment that is not completed or cancelled, **then** it is listed under Upcoming. |
| F-1-2 | **Given** a completed or cancelled appointment, **then** it is listed under Past. |

### F-2: Book a visit

#### 1. What it does
Sarah presses **Book**. Step 1 asks for a service (with its price), a clinician or **Any Available Clinician**, and a location. Step 2 asks for a date by week and a time. The first slot is selected for her. A non-prepaid service shows **Confirm Booking**. The appointment is created at once and a room is assigned.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Book sheet | Sheet | A three-step sheet | ● Works | |
| F-2.2: Service picker | Selector | Services with price | ◐ Simulated | A "$75" label shows when a service has no price (G12-E-17) |
| F-2.3: Clinician picker | Selector | A clinician, or Any Available, which merges slots across eligible clinicians | ● Works | |
| F-2.4: Date and time | Slot grid | Week navigation. Slots come from the clinician's working hours and the service slot length (else 30 minutes), minus non-cancelled appointments | ● Works | |
| F-2.5: First slot preselected | Rule | The first open slot is chosen | ● Works | |
| F-2.6: No open slots | State | "No open slots on this date" | ● Works | |
| F-2.7: Confirm Booking | Button | Creates the appointment with source "MA-Client" and assigns a room | ◐ Simulated | Skips the "appointment automation required" check. Email and phone become placeholders (G12-I-43). Decision needed: D-72 |
| F-2.8: Stage after booking | Rule | Sets "Client Checked In" (not prepaid) or "Payment Done" and adds "Patient Care Journey" | ◐ Simulated | The patient looks checked in or paid before arriving (G12-E-15) |
| F-2.9: Booking error | State | "Failed to book appointment" | ● Works | |
| F-2.10: Slot lock during checkout | Rule | Chosen slot held | ○ Not built | Two patients can pick the same slot. Decision needed: D-64 |
| F-2.11: Reschedule or cancel | Action | With reason and 24-hour notice | ○ Not built | No button exists. Decision needed: D-117 |
| F-2.12: Calendar invite and confirmation SMS | Message | Sent after booking | ○ Not built | |
| F-2.13: Provider photos, bios, specialty filter | Browser | Described in the earlier PRD | ○ Not built | |

#### 3. Worked example
Sarah books a follow-up with Dr. Anita Rao.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Step 1 | Picks the service and **Any Available Clinician** | **The price shows. Slots from all eligible clinicians are merged** |
| 2 | Step 2 | Keeps the first slot and presses **Confirm Booking** | **The appointment is created with a room. The patient's stage becomes Client Checked In** |
| 3 | Sarah wants to move it | Looks for a button | **No reschedule or cancel control exists** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I need advice, I want to book from my phone, so that I do not call during office hours. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a clinician and date, **when** step 2 opens, **then** slots are working hours minus existing non-cancelled appointments. |
| F-2-2 | **Given** no slot, **then** the message "No open slots on this date" shows. |
| F-2-3 | **Given** Confirm Booking, **then** an appointment is created even if the clinic requires an automation. |
| F-2-4 | **Given** two patients on the same slot, **then** nothing prevents both from booking. |

### F-3: Prepaid booking

#### 1. What it does
If the service is prepaid or has a deposit, a banner on step 1 states the amount. Step 3 shows fee plus tax and a **Card** or touchless **QR** tab. Confirm books the visit and shows confetti and "Appointment booked & prepaid payment received!".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Prepaid banner | Banner | States the prepaid amount on step 1 | ● Works | |
| F-3.2: Amount rule | Rule | Amount is the full price or the deposit. Tax is amount times the service tax percent. Total is amount plus tax | ● Works | Decision needed: D-64 |
| F-3.3: Payment step | Form | Card or QR (UPI) summary | ◐ Simulated | The test card is prefilled and never validated. The QR payee is fixed (G12-E-16). Decision needed: D-62 |
| F-3.4: Invoice | Hand-off | The appointment service creates it first with a placeholder 150 line plus 8 percent tax | ◐ Simulated | Total is 162 whatever the service costs (G7-E-10, XM-03) |
| F-3.5: Payment record | Hand-off | Records fee plus tax as paid against that invoice | ◐ Simulated | No charge is made. Total and paid differ, so the invoice is Partial or over-paid (G12-E-16) |
| F-3.6: Success message | Toast | Confetti and "Appointment booked & prepaid payment received!" | ◐ Simulated | Shown with no money moved |
| F-3.7: Gateway confirmation before booking | Rule | Booking confirmed only after payment is confirmed | ○ Not built | Decision needed: D-62 |
| F-3.8: Refund or credit on cancel | Rule | A cancelled prepaid booking is refunded | ○ Not built | Staff cancel voids the invoice even when paid (G6-E-23). Decision needed: D-117 |

#### 3. Worked example
Sarah prepays a service with a $50 deposit and 5 percent tax.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Step 3 summary | Reads fee plus tax | **$52.50 is shown** |
| 2 | She presses Confirm | Confirms | **The booking is made and a payment of $52.50 is recorded with no charge** |
| 3 | Daniel Brooks opens the invoice | Looks at it | **Total is the placeholder 162 and the paid amount differs** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When a service needs prepayment, I want to pay while booking, so that my slot is secured. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a prepaid service, **when** the patient confirms, **then** a payment is recorded with no charge and no proof. |
| F-3-2 | **Given** a prepaid booking, **then** the invoice total is built from the placeholder line and may not equal the amount recorded as paid. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Visit list | F-1.1 – F-1.4 | ◐ / ● / ○ | Tabs work; matching is loose. |
| F-2 | Book a visit | F-2.1 – F-2.13 | ● / ◐ / ○ | Booking works; no lock, cancel or invite. |
| F-3 | Prepaid booking | F-3.1 – F-3.8 | ◐ / ● / ○ | Payment recorded with no charge; invoice mismatch. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See my upcoming and past visits | F-1 |
| 2 | Patient | Book from my phone | F-2 |
| 3 | Patient | Pay while booking to secure my slot | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the link | Book and prepay for any patient by changing the path or `?clientId=` | Nothing |
| Clinic staff | See portal bookings on the calendar and cancel them | Nothing |

The earlier PRD named the patient only. Decision needed: D-46.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Prepaid amount | Banner and step 3 | Full service price, or the configured deposit |
| Tax | Step 3 | Amount times the service tax percent |
| Total due | Step 3 | Amount plus tax |
| Slot length | Step 2 | Service slot duration, else duration, else 30 minutes |
| Fallback fee label | Service picker | $75. **Hardcoded, formula undefined** (G12-E-17) |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal with Appointments and Invoices | Patient confirms a booking | Client id is passed. Email and phone are placeholders. It skips the automation gate. |
| | Booking confirmed | Stage becomes "Client Checked In" or "Payment Done". |
| | Prepaid service booked | The appointment service creates the invoice with a placeholder line. The portal records its own amount as paid. |
| | Staff books an appointment | Visits matches by id, email, name or phone. A No-show shows as upcoming. |
| | Cancellation from the portal | No control exists. |
| | Staff cancels a prepaid appointment | The invoice is voided even when paid. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Visits or Appointments? | Naming note |
| D-46 | What is the patient authentication model? | Roles |
| D-62 | Which gateway and rails, and what counts as paid? | F-3.3, F-3.7 |
| D-64 | Is the prepaid invoice the full price or the deposit, and how long is a slot held? | F-2.10, F-3.2 |
| D-72 | Should portal bookings follow the "appointment automation required" setting? | F-2.7 |
| D-117 | What are the patient reschedule and cancel rules, and refund on cancel? | F-2.11, F-3.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |

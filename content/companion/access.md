---
title: "Companion: Sign-in, Session and Profile"
product: "companion"
module: "access"
route: "/patient/login"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | ACCESS |
| Route | `/patient/login` (registration is a step inside it, the shell wraps every `/patient` page, and the profile is at `/patient/profile`) |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The patient portal's front door: a four-step sign-in, a registration step, the shell (side drawer, bell, clinic switcher, floating bot button) and a Profile with Personal, Security and Notifications tabs. |
| **Who uses it** | Patient. There is no caregiver or family role. No page checks who is signed in. |
| **Where you start it** | `/patient/login`. Any `/patient` page opens without signing in. |
| **Where the result goes** | The shared client record that the clinic uses. A new patient becomes a client, and profile edits change that record. |
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
| Client (Clients) | Patient record | Registration adds a client with source "Self Gen". Profile edits write name, email and phone straight into the client record, with no re-verification. | [View Clients](/client/clients) |
| Client (Process) | Starting processes | A new patient is assigned three processes (Patient Care Journey, Client Intake, Appointment Scheduling) and the stage "Client Checked In". | [View Process List](/client/processes/list) |
| Companion | Today | Login opens `/patient/<id>`, which is the Today page. | [View Companion Today](/companion/today) |
| Companion | Billing | A visitor who is not matched can see other patients' invoices on Today and Bill (G12-E-10). | [View Companion Billing](/companion/billing) |
| Companion | Messages and Care Bot | The shell hides the floating bot button on bot and message screens. | [View Companion Chat](/companion/chat/chat) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens the portal on her phone and types her phone number. The app waits a moment and finds her record. It shows a six-digit code screen. She types the digits it gave her, or any other digits, or nothing, and presses **Verify**. She is in. A welcome message appears and the address becomes `/patient/<her id>`. The side drawer lists Today, Visits, Tasks, Documents, Forms, Billing and Messages. She taps her avatar and opens Profile. She changes her emergency contact and saves, and the clinic's record changes at once. If she edits the number in the address bar, she sees someone else's portal. If she skips the login page and opens `/patient`, she lands on the portal anyway.

### What is real and what is not

- **Real in the prototype:** the identifier and registration field checks, the drawer, the bell and the floating bot button, saving profile details into the client record, and sign out.
- **Simulated:** the one-time code is never checked. Nothing on `/patient` is protected. The address or `?clientId=` switches the patient. Registration creates a client after an unchecked code. The password change and the notification toggles keep nothing that sign-in or messaging reads.
- **Not built:** code delivery, expiry, resend and lockout, route protection, a caregiver role and re-verification of a changed phone or email.

### Journey position

```
/patient/login ─▶ Identifier ─▶ Code (not checked) ─▶ Portal shell ─┬▶ Today, Visits, Bill, Forms
                       └──▶ Register ─▶ New client                   └▶ Profile ─▶ Client record
```

## 2. Feature Requests

### F-1: Sign in with phone or email

#### 1. What it does
Sarah enters a phone or email. Empty input shows "Please enter your phone number or email address". After a short fake delay the app searches the clinic's clients by client id, email or phone. A phone matches when it is equal, or when one number ends with the other. A match goes to a six-digit code screen. No match goes to registration. On **Verify** the app logs in the matched client. If no client matched, it logs in the first client in the list. It never checks the code.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Identifier step | Form | Accepts a phone, an email or a client id. Empty input shows an inline message | ◐ Simulated | A raw client id and a partial phone also match. A "not found" result reveals which contacts exist (G12-E-04) |
| F-1.2: Code step | Input | Six digits, then **Verify** | ◐ Simulated | The code is never checked. Any value, even empty, logs in (G12-E-03). Decision needed: D-46 |
| F-1.3: Not found | Redirect | An unmatched identifier opens "Create your account" with the value filled in | ◐ Simulated | See F-2 |
| F-1.4: Login result | Rule | Saves the active patient id to session and local storage, shows a welcome toast and opens `/patient/<id>` | ● Works | |
| F-1.5: Code delivery, expiry, resend, lockout | Rule | A code is sent, expires and locks after failures | ○ Not built | Decision needed: D-46 |
| F-1.6: Sign out | Action | Removes the stored patient id and returns to login | ◐ Simulated | No session lifetime exists. The patient can reopen any `/patient` page at once |

#### 3. Worked example
Sarah signs in.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Login page | Enters her phone | **A six-digit code screen opens** |
| 2 | She does not have the code | Presses **Verify** with the box empty | **She is signed in as her own record** |
| 3 | Someone types another patient's phone | Enters it and presses **Verify** with any code | **That patient's portal opens. No proof is asked for** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I open the portal, I want to sign in with just my phone or email, so that I can reach my care information quickly and privately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** an empty identifier, **when** the user continues, **then** an inline message asks for a phone or email. |
| F-1-2 | **Given** a matched identifier, **when** Verify is pressed with any code or none, **then** the matched client is logged in. |
| F-1-3 | **Given** a matched identifier is not found, **then** registration opens with the value filled in. |
| F-1-4 | **Given** a login, **then** the active patient id is stored and `/patient/<id>` opens. |

### F-2: Register as a new patient

#### 1. What it does
Sarah's neighbour is new. His number matches no client, so he sees "Create your account". He enters a name of at least two characters, a phone of at least seven digits and a valid email. A code screen follows and accepts anything. Then a new client is created in the same list the clinic uses.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Details form | Form | Name (2+ characters), phone (7+ digits), email format | ● Works | There is no `/patient/register` route. Registration is a step in the login screen |
| F-2.2: Client creation | Cross-product | Creates a client with a random `CL-` plus 3-digit id, source "Self Gen", fixed US country and "New York, NY", three processes and stage "Client Checked In" | ◐ Simulated | Created after an unchecked code. Ids can collide. No duplicate phone or email check (G12-E-06). Decision needed: D-46 |
| F-2.3: Consent, terms, identity check | Step | None exists | ○ Not built | |

#### 3. Worked example
A new patient registers.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Unknown number | Fills name, phone and email | **A code screen opens** |
| 2 | Any code | Presses **Verify** | **A client with source "Self Gen" appears in Clients** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I am new to the clinic, I want to create my profile on my phone, so that I can book without calling. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a name under 2 characters, a phone under 7 digits or a bad email, **then** registration does not continue. |
| F-2-2 | **Given** valid details and any code, **then** a client is created with source "Self Gen" and the three starting processes. |
| F-2-3 | **Given** a phone or email that already exists, **then** a second client is still created. |

### F-3: Session and portal shell

#### 1. What it does
Every `/patient` page sits outside the staff sign-in wrapper, so no page needs a login. The active patient is the first of: the id in the address path, `?clientId=` or `?id=` in the query, the stored id, or `CL-001`. If that id is not found, the first client in the list is used, and if there are none a hard-coded "Sarah Johnson" is used. The shell adds a side drawer, a bell, an avatar that opens Profile, a floating bot button and a clinic switcher. A dashed **Switch Patient (Dev)** button lists every patient.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Side drawer | Navigation | Today, Visits, Tasks, Documents, Forms, Billing, Messages | ● Works | Pharmacy is not in the drawer |
| F-3.2: Bell, avatar, floating bot button | Controls | A bell, an avatar to Profile, and a Care Bot button hidden on bot and message screens | ● Works | |
| F-3.3: Route protection | Rule | A visitor with no session is sent to sign-in | ○ Not built | Nothing on `/patient` is protected. With no session the portal uses `CL-001`, or the first client if that id is missing (G12-E-01) |
| F-3.4: Active patient | Rule | The address path, `?clientId=` or `?id=` sets the patient with no check | ◐ Simulated | Changing the URL shows another patient's data (G12-E-02). Decision needed: D-46 |
| F-3.5: Clinic switcher | Control | Lists all organizations to any visitor | ◐ Simulated | Decision needed: D-121 |
| F-3.6: Switch Patient (Dev) | Button | Opens a searchable list of every patient | ◐ Simulated | Present in the shipped drawer, lists every name (G12-E-05) |

#### 3. Worked example
Sarah checks someone else's page by accident.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She has never signed in on this browser | Opens `/patient` | **The portal opens for `CL-001`** |
| 2 | She edits the address to another id | Changes it | **Another patient's portal opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I use the portal, I want one menu for everything about my care, so that I do not hunt for screens. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a visitor with no session, **when** `/patient` opens, **then** the portal opens with a default patient and no sign-in is asked for. |
| F-3-2 | **Given** an address with another patient's id or `?clientId=`, **then** that patient's portal opens. |
| F-3-3 | **Given** the drawer, **then** it lists seven destinations and a Switch Patient (Dev) button. |

### F-4: Profile

#### 1. What it does
Sarah opens Profile. **Personal** edits name, email, phone, gender, birth date, emergency contact, language and a photo up to 5 MB. Save writes straight into the clinic's client record and refreshes the portal. **Security** offers a new password. **Notifications** shows SMS, WhatsApp, email and bills toggles.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Personal tab | Form | Edits the listed fields and saves to the client record | ◐ Simulated | Name, email and phone are sign-in identifiers and change with no re-verification or audit (G12-E-08). Decision needed: D-145 |
| F-4.2: Emergency contact default | Rule | A blank emergency contact shows a made-up "Priya Johnson" | ◐ Simulated | (G12-E-09) |
| F-4.3: Security tab | Form | New password needs 4+ characters and a matching confirmation | ◐ Simulated | The current password is not checked. The new one is stored as plain text and sign-in never uses it (G12-E-07). Decision needed: D-46 |
| F-4.4: Notifications tab | Toggles | SMS, WhatsApp, email and bills toggles show "Notification preferences saved" | ◐ Simulated | Only screen state changes (G12-E-09). Decision needed: D-145 |
| F-4.5: Re-verification of phone or email | Rule | Changing an identifier requires a new code | ○ Not built | Decision needed: D-145 |

#### 3. Worked example
Sarah updates her details.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She has a new phone | Edits it and presses save | **The clinic's client record shows the new phone at once** |
| 2 | She turns off SMS alerts | Switches the toggle | **A "saved" message shows and nothing is kept** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When my details change, I want to update them myself, so that I do not call the clinic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a saved Personal tab, **then** the client record holds the new values at once. |
| F-4-2 | **Given** a password change, **then** the current password is not checked. |
| F-4-3 | **Given** a notification toggle, **then** a saved message shows and no preference is stored. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Sign in | F-1.1 – F-1.6 | ◐ / ● / ○ | Looks like sign-in; the code is never checked. |
| F-2 | Register | F-2.1 – F-2.3 | ● / ◐ / ○ | Creates a client after any code; no duplicate check. |
| F-3 | Session and shell | F-3.1 – F-3.6 | ● / ◐ / ○ | Nothing protected; the URL picks the patient. |
| F-4 | Profile | F-4.1 – F-4.5 | ◐ / ○ | Edits hit the clinic record; password and toggles keep nothing useful. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Sign in quickly and privately | F-1 |
| 2 | Patient | Create my profile on my phone | F-2 |
| 3 | Patient | Reach everything from one menu | F-3 |
| 4 | Patient | Keep my details current | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the portal address | Open any `/patient` page, see any patient by changing the address or `?clientId=`, list every patient, list every clinic | Nothing |
| Patient who signs in | Edit own profile, which writes to the clinic record | Nothing further. The code is not checked |
| Caregiver or family member | No such role exists | Not applicable |

The earlier Companion PRDs say "authenticated patients" and define no sign-in, session or access rule. Decision needed: D-46.

## 5. Metrics and definitions

The module shows no metric.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal ↔ Appointments / Invoices | Entry to the portal | Any visitor reaches the portal. With no session the active patient is `CL-001`, so the Bill and Pay fallbacks can show other patients' invoices. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-46 | What is the patient authentication model: real code by SMS or email, lifetime, retry limits, session length, passwords, client id login and duplicates at registration? | F-1.2, F-1.5, F-2.2, F-3.4, F-4.3 |
| D-145 | Which profile fields can a patient edit directly, does changing phone or email need re-verification, and where do notification preferences live? | F-4.1, F-4.4, F-4.5 |
| D-121 | Should a patient ever see a clinic switcher? | F-3.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

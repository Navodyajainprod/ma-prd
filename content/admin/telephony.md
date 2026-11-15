---
title: "Telephony: Providers and Phone Numbers"
product: "admin"
module: "telephony"
route: "/admin/integrations/telephony"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | TELEPHONY |
| Route | `/admin/integrations/telephony` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | One page with a **Providers** tab and a **Numbers** tab. Providers lists carriers (Twilio, Exotel, Plivo, Telnyx) with LiveKit and Dograh SIP credentials and a subscription due date. Numbers is the platform phone-number inventory with assignment to organizations. This screen has no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No action is checked: any signed-in user who opens the URL can do everything on the page. |
| **Where you start it** | **Telephony** under INTEGRATIONS in the admin sidebar (`/admin/integrations/telephony`). The tab is kept in `?tab=providers` or `?tab=numbers`. Older addresses such as `/admin/telephony` redirect here. |
| **Where the result goes** | Browser storage for providers and numbers, and the admin audit log. Assigned numbers never reach a tenant's Integrations screen or the AI Receptionist. |
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
| Client (Settings Integrations) | Assigned numbers and carriers | Not connected. The tenant's Telephony integration and its phone numbers are local hardcoded data. A number assigned here never appears there. | [View Client Integrations](/client/settings/integrations) |
| AI Receptionist | Numbers for the receptionist | Not connected. Nothing in the receptionist reads the admin number inventory. | [View AI Receptionist Settings](/ai-receptionist/settings/architecture) |
| Client (Call Logs) | Cross-organization call log | Not built. The admin call log page exists in code but is not mounted. `/admin/telephony/calls` lands on Providers. The tenant call log is a separate screen. | [View Call Logs](/client/call-logs) |
| Admin (Audit Logs) | Audit entries | Revealing a secret, assigning, editing and releasing numbers write entries. Some carry the wrong action name. | [View Audit Logs](/admin/audit-logs) |
| Admin (Organizations) | Assign Organization | The assignment picks an organization but always saves the code ORG-0001. | [View Organizations](/admin/organizations) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Telephony** and lands on the Providers tab. Each carrier is a card with a count of numbers in use, a due-date pill and its LiveKit and Dograh credentials. He sees an amber pill on one carrier, so he knows the subscription is due within a week. He presses the reveal icon to read a secret and copies it. A toast confirms. He switches to the Numbers tab, filters by provider and presses **Assign Organization** on a free number. The number shows the clinic and the status In Use. He expects the clinic to see the number in its own Integrations screen. It does not. The audit log records his reveal as a "login" and the actor as a fixed name that is not him.

### What is real and what is not

- **Real in the prototype:** the two tabs, the provider cards, the due-date pill, copy to clipboard, the numbers table, adding a number, assigning an organization, editing target countries and releasing a number.
- **Simulated:** the "numbers in use" count, the organization code on assignment, the organization filter on seeded numbers, the reveal and release audit entries, the add-provider and add-number checks, and the CSV export.
- **Not built:** configuring or deleting a provider, testing a connection, unassigning a number, the cross-organization call log, a read-only role, and any link from assigned numbers to tenants.

### Journey position

```
Provider ─▶ Phone number ─▶ Assign organization ─▶ Audit log   |   Tenant Integrations and AI Receptionist (not connected)
```

## 2. Feature Requests

### F-1: Providers

#### 1. What it does
Leo opens the **Providers** tab. Each carrier card shows its name, "N number(s) in use", a due-date pill and LiveKit and Dograh usernames and secrets. Secrets are hidden until he reveals them. **Add Provider** opens a drawer. A search box filters the cards.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Tabs | Tabs | Providers and Numbers, kept in `?tab=` | ● Works | |
| F-1.2: Provider card | Card | Carrier name, numbers in use, due-date pill, LiveKit and Dograh username and secret | ◐ Simulated | "N numbers in use" is a stored count that is never recalculated (G13-E-92). Decision needed: D-96 |
| F-1.3: Due-date pill | Display | Grey normally, amber at 7 days or fewer, red when overdue | ● Works | Computed from the due date |
| F-1.4: Reveal secret | Button | Shows the secret and writes an audit entry "Revealed plaintext SIP secret" with a toast | ◐ Simulated | The entry is logged with action "login". Hiding the secret is not logged (G13-E-86) |
| F-1.5: Copy | Button | Copies the secret to the clipboard | ● Works | |
| F-1.6: Add Provider | Drawer | Carrier, LiveKit and Dograh credentials and due date are all required. The provider is saved as Connected | ◐ Simulated | No duplicate-carrier check and no connection test (G13-E-87) |
| F-1.7: Configure provider | Drawer | A configure drawer exists in code | ○ Not built | It cannot be opened (G13-E-88) |
| F-1.8: Delete provider, test connection | Action | Neither exists | ○ Not built | (G13-E-88) |
| F-1.9: Read-only role | Rule | The seeded SupportSpecialist role is read-only on providers | ○ Not built | Nothing enforces it (G13-E-100). Decision needed: D-12 |
| F-1.10: Empty state | State | No message when no provider matches | ○ Not built | Empty is handled on Numbers only |

#### 3. Worked example
Leo checks credentials before a renewal.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | One carrier's pill is amber | Reads the card | **The due date is within 7 days** |
| 2 | He needs the SIP secret | Presses the reveal icon | **The secret shows and the audit log records it as a "login"** |
| 3 | He adds a carrier twice by mistake | Saves the drawer twice | **Both are saved. No duplicate check exists** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When managing carriers, I want credentials and renewal dates in one place, so that no carrier lapses. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a provider card, **when** the reveal icon is pressed, **then** the secret shows and an audit entry is written with action "login". |
| F-1-2 | **Given** a due date within 7 days, **then** the pill is amber. A past due date is red. |
| F-1-3 | **Given** Add Provider, **when** the carrier already exists, **then** it is saved again. |
| F-1-4 | **Given** a provider card, **then** it has no configure, delete or test action. |

### F-2: Phone numbers

#### 1. What it does
Leo opens the **Numbers** tab. A table lists Number, Country, Provider, Org ID, Organization and Target Countries. Filters hold Provider, Organization (with Unassigned Only) and Country. A row menu holds **Assign Organization**, **Edit Target Countries** and **Release Number**. **Add Number** opens a drawer. **Export** downloads a CSV.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Numbers table | Table | One row per number. Released numbers are hidden | ● Works | |
| F-2.2: Filters | Filters | Provider, Organization and Country | ◐ Simulated | The organization filter cannot match the seeded numbers because the ids differ (G13-E-90) |
| F-2.3: Assign Organization | Modal | An organization is required. The number becomes In Use and a history entry and audit entry are written | ◐ Simulated | The organization code is always saved as ORG-0001 (G13-E-90). Decision needed: D-61 |
| F-2.4: Edit Target Countries | Modal | Picks from 11 countries | ● Works | An empty list is accepted |
| F-2.5: Release Number | Row action | Asks a browser confirm, sets the status to Released and hides the row | ◐ Simulated | History says "Suspended" and the audit log says "deleted" (G13-E-91) |
| F-2.6: Add Number | Drawer | Saves a number that is Unassigned at $15 a month | ◐ Simulated | Only non-blank is checked. No format or duplicate check (G13-E-87) |
| F-2.7: Export | Button | Exports the filtered numbers as CSV | ◐ Simulated | Some cells are double-quoted (G13-E-89) |
| F-2.8: Empty state | State | An empty message on the table | ● Works | |
| F-2.9: Unassign a number | Action | A number cannot be taken back from an organization | ○ Not built | |

#### 3. Worked example
Leo gives a new clinic a phone line.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A line is free | Presses **Assign Organization** and picks the clinic | **The row shows the clinic and In Use** |
| 2 | He filters to that clinic | Chooses the clinic in the Organization filter | **A seeded number may not appear because the ids differ** |
| 3 | The line is no longer needed | Presses **Release Number** and confirms | **The row disappears and the audit log says "deleted"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When a clinic needs a line, I want to assign one from inventory, so that the clinic can take calls. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a number is assigned, **then** its status is In Use and the organization code saved is ORG-0001. |
| F-2-2 | **Given** Release Number is confirmed, **then** the number is hidden and recorded as Suspended in history and deleted in the audit log. |
| F-2-3 | **Given** Add Number, **when** the number is non-blank, **then** it is saved with no format or duplicate check. |

### F-3: Hand-offs to tenants and the audit log

#### 1. What it does
Leo assumes assigning a number makes it usable. It does not reach any tenant screen. The only place the page writes to is the audit log.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Audit entries | Hand-off | Reveal, assign, edit and release write audit entries | ◐ Simulated | Wrong action names and a hardcoded actor (G13-E-86, G13-E-91, G13-E-95) |
| F-3.2: Numbers in the tenant's Integrations | Hand-off | The tenant's Telephony integration should list the assigned numbers | ○ Not built | The tenant panel uses local hardcoded numbers. Decision needed: D-61 |
| F-3.3: Numbers in the AI Receptionist | Hand-off | The receptionist should use the assigned number | ○ Not built | Decision needed: D-61 |
| F-3.4: Cross-organization call log | Page | A call log across organizations exists in code | ○ Not built | The page is not mounted. `/admin/telephony/calls` redirects to Providers (G13-E-93). Decision needed: D-61 |

#### 3. Worked example
Leo hands a clinic its line.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The number is assigned | Opens the clinic's Integrations screen | **The number is not listed** |
| 2 | He wants to see its calls | Opens `/admin/telephony/calls` | **Providers opens instead** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | After I assign a number, I want the clinic to see and use it, so that I do not set it up twice. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a number is assigned, **then** a tenant's Integrations screen is unchanged. |
| F-3-2 | **Given** the address `/admin/telephony/calls`, **then** the Providers tab opens. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Providers | F-1.1 – F-1.10 | ● / ◐ / ○ | Cards and due dates work; configure, delete and test are missing. |
| F-2 | Phone numbers | F-2.1 – F-2.9 | ● / ◐ / ○ | Inventory and assignment work; org code and release logging are wrong. |
| F-3 | Hand-offs | F-3.1 – F-3.4 | ◐ / ○ | Only the audit log receives anything. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Keep carrier credentials and renewals in one place | F-1 |
| 2 | Platform Admin | Assign a phone line to a clinic from inventory | F-2 |
| 3 | Platform Admin | Have the clinic see and use an assigned number | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Reveal and copy secrets, add providers and numbers, assign, edit, release, export | Nothing. The role is read from browser storage and defaults to SystemAdmin |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The sidebar entry shows when the role can view providers or numbers. The seeded SupportSpecialist role is read-only on providers, but no action is checked (G13-E-100). The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| N numbers in use | Provider card | **Hardcoded, formula undefined.** A stored count that is never recalculated (G13-E-92). Decision needed: D-96 |
| Due-date pill | Provider card | Days left below 0 is red overdue. 7 or fewer is amber. Otherwise grey |
| Monthly charge | Add Number | A fixed $15 a month on every new number |

## 6. Cross-module journeys this module appears in

This page is not a step in any of the four journeys: Call to Claim, Kiosk check-in to Billing, Web form to Task, and Patient portal with Appointments and Invoices. No call in those journeys uses an admin number.

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Must permissions block direct URL access and each action, such as read-only on providers? | F-1.9 |
| D-61 | Who owns numbers and carriers, and should admin numbers appear in client Integrations, the AI Receptionist and a cross-organization call log? | F-2.3, F-3.2, F-3.3, F-3.4 |
| D-96 | How is "numbers in use" defined per provider? | F-1.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

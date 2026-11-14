---
title: "Product & Services Catalog Management"
product: "client"
module: "services"
route: "/services"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SERVICES |
| Route | `/services` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | One catalogue of everything the practice sells, with price, tax, CPT code and optional booking rules (slot length, locations, rooms, staff, upfront payment). A searchable table, an Add / Edit drawer and an export. |
| **Who uses it** | Practice Admin and Practice Manager (maintain prices and bookable services). No role is checked: any signed-in user can add, edit and delete items. |
| **Where you start it** | **Product & Services** in the sidebar (`/services`), then **Add Product**. |
| **Where the result goes** | The staff appointment drawer, the patient booking portal, the invoice line picker, the AI Receptionist rooms list, the kiosk, Team settings, client profiles, automation rules and process cards. |
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
| Client (Appointments) | Service picker in the booking drawer | The staff drawer lists only items that are active and ticked **Available for appointment**. | [View Appointments](/client/appointments/list) |
| Companion | Patient booking portal | The portal uses the same filter and charges price or deposit plus the item's tax for prepaid items. The invoice that results does not match the payment (XM-03). | [View Companion Appointments](/companion/appointments) |
| Client (Invoices) | Invoice line picker | Lines are picked from the catalogue. The picker also lists inactive items and built-in sample services that are not in the catalogue (G7-E-05). Labels are copied as text, with no live link. | [View Invoices](/client/invoices) |
| Client (Settings) | AI Receptionist rooms | Saving a bookable item with a room number syncs that room into the AI Receptionist rooms list. | [View Reception Settings](/client/settings/reception) |
| AI Receptionist | Kiosk catalogue and invoice labels | The kiosk reads the catalogue when it books a visit. Its invoice rows show service labels copied as text at invoice creation. | [View Kiosk Invoices](/ai-receptionist/billing/invoices) |
| Client (Settings) | Team assignment | Adding a team member can assign them to services. | [View Team Settings](/client/settings/team) |
| Client (Clients) | Products per client | A client profile can hold products assigned to that client. | [View Clients](/client/clients) |
| Client (Workflows) | Automation rules and process cards | Automation rules, process cards and step parameters can read the catalogue. | [View Workflows](/client/workflows) |
| Client (Claims) | Code to claim line | Not connected. A claim's procedure codes are typed by hand. The catalogue's CPT code is not read. | [View Claims](/client/claims) |

## 1. Module Summary

### The story in one minute

Rohan Mehta opens **Product & Services** to add a new consultation. The page header reads "Product / Services". He presses **Add Product**, and a side drawer opens on its **Overview** tab. He types the name, picks a category, enters CPT code 99204, a price of 180 and a tax percent. He ticks **Available for appointment**, and an **Availability** tab appears. There he sets a 30 minute slot, one location, two seats and Room 4, then saves. A toast confirms the product. The item is now selectable when Meera books an appointment, and its room appears in the AI Receptionist rooms list. Sarah Johnson can pick it in the booking portal. Nobody is asked to confirm when Rohan later deletes an old item.

**Naming note:** the sidebar says "Product & Services", the page says "Product / Services" and the button says "Add Product". The earlier PRD said "Product & Services Catalog", "Add Service Modal" and the categories Consultations, Procedures, Diagnostics and Pharmacy. The prototype uses a drawer and the categories Consultation, Dental, Diagnostics, Treatment, Surgical and General, plus custom ones. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the catalogue table with search, category chips and export, the Add / Edit drawer with name validation, the Availability tab with locations, seats, rooms and prepaid rules, delete, and the feed into the appointment drawer, the portal and the AI Receptionist rooms.
- **Simulated:** the invoice line picker (it lists inactive and sample items), the single USD currency, a duration that stays 30 minutes for non-bookable items, and the delete with no confirmation.
- **Not built:** the Active toggle and Status column, a unique item-code check, sorting, role control, and any link from a catalogue code to a claim.

### Journey position

```
Add Product ─▶ Available for appointment ─▶ Staff booking ─┬▶ Patient portal booking
                                                            ├▶ Invoice line picker
                                                            └▶ AI Receptionist rooms
```

## 2. Feature Requests

### F-1: Catalogue list, search and export

#### 1. What it does
Rohan opens `/services` and sees a table with 20 items per page. Above it are a search box, the chip **All Services** and chips for the first four categories, each with a live count. Typing searches name, description, category and CPT code. Each row shows the product with **Appointment** and **Prepaid** badges, the CPT or code, category, duration, price, tax, responsible, created and activity. **Export** opens a modal where he picks the fields.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Catalogue table | Table | Product / Service, CPT / Code, Category, Duration, Price, Tax, Responsible, Created, Activity, 20 per page | ● Works | The earlier PRD listed Code, Service Name, Category, Price, Tax Rate, Duration, Status (G7-S-02) |
| F-1.2: Search | Search | Matches name, description, category and CPT code | ● Works | The earlier PRD said name and code only (G7-S-01) |
| F-1.3: Category chips | Chips | **All Services** plus the first four categories, each with a count | ● Works | Other categories get no chip (G7-S-15). Decision needed: D-74 |
| F-1.4: Export | Modal | Choose name, category, price, duration, CPT, description, tax, colour | ◐ Simulated | File download not re-checked in code (unverified) |
| F-1.5: Empty state | State | "No products or services found matching your filters." | ● Works | |
| F-1.6: Loading and error states | State | None exist | ○ Not built | All data is browser-local |
| F-1.7: Status column | Column | Described in the earlier PRD | ○ Not built | The table has no Status column (G7-S-02). Decision needed: D-74 |
| F-1.8: Sorting | Table | The table has no sortable columns | ○ Not built | |

#### 3. Worked example
Rohan looks for a consultation.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants a CPT code | Types **99204** in search | **Only rows whose name, description, category or code match are listed** |
| 2 | He wants a category | Presses a category chip | **The list narrows and the chip shows its count** |
| 3 | Nothing matches | Types a word that matches no item | **"No products or services found matching your filters."** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When updating our clinic fee schedule, I want a centralized catalog, so that appointment booking and billing use consistent pricing. |
| F-1-J2 | Practice Admin | When I need to check a price or code, I want to search the catalogue, so that I find the item at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the catalogue, **when** the user types in search, **then** items match on name, description, category or CPT code. |
| F-1-2 | **Given** more than 20 items, **then** the table pages at 20 per page. |
| F-1-3 | **Given** no item matches, **then** the empty message is shown. |
| F-1-4 | **Given** the table, **then** it has no Status column and no sorting. |

### F-2: Add, edit and delete an item

#### 1. What it does
**Add Product** opens a drawer titled "Add New Product". Clicking a row opens "Product Details" for editing. The **Overview** tab has Service Details (name, category, CPT code, description) and Pricing (price, tax), plus any custom fields. A footer tick, **Available for appointment**, reveals the **Availability** tab: slot duration, **Require Upfront Payment (Prepaid)** with a full amount or a fixed deposit, and one or more location rules with seats, room number, room label, directions and assigned users. A row menu holds **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Overview tab | Form | Name, category, CPT code, description, price and tax percent. Defaults are category General, price 0, tax 0 | ● Works | The earlier PRD called this a modal (G7-S-03) |
| F-2.2: Validation | State | A name is required. A bookable item needs at least one location | ● Works | Errors appear as toasts only, with no inline field errors (G7-S-05) |
| F-2.3: Unique item code | Rule | The earlier PRD said the code is validated as unique | ○ Not built | Duplicate CPT codes are allowed (G7-S-04) |
| F-2.4: Available for appointment | Tick | Shows the Availability tab and marks the item bookable | ● Works | |
| F-2.5: Availability tab | Form | Slot duration, locations, seats (minimum 1), room number, room label, directions, assigned users. A blank user list means all staff | ● Works | G7-S-11 |
| F-2.6: Prepaid rule | Form | Full amount equals the item price. Deposit is the entered amount. Kept only when the item is bookable | ● Works | What the portal and invoice do with it is in F-3 (G7-S-12) |
| F-2.7: Duration | Field | Duration is the slot length from Availability. A non-bookable item stays at 30 minutes | ◐ Simulated | No duration field exists for non-bookable items (G7-S-08). Decision needed: D-74 |
| F-2.8: Currency | Rule | Every item is saved in USD | ◐ Simulated | A 10-currency list exists in code and is unused (G7-S-09). Decision needed: D-60 |
| F-2.9: Custom fields and sections | Form | Custom fields and sections appear in the drawer | ● Works | G7-S-16 |
| F-2.10: Edit | Action | Click a row or name to open the pre-filled drawer | ● Works | |
| F-2.11: Save toast | State | Toast "<name> added" or "<name> updated" | ● Works | |
| F-2.12: Delete | Row action | Removes the item at once | ◐ Simulated | No confirmation, even if invoices or appointments refer to it (G7-E-04). Decision needed: D-32 |
| F-2.13: Active / inactive toggle | Switch | Described in the earlier PRD and still promised by the help text "Toggle items active/inactive" | ○ Not built | The handler is not wired to any control, the flag is hidden and every save sets the item active (G7-E-01, G7-E-02, G7-E-03). Decision needed: D-74 |
| F-2.14: Role control | Rule | Any signed-in user can add, edit and delete items, including prices | ○ Not built | G7-S-25. Decision needed: D-15 |

#### 3. Worked example
Rohan adds a bookable dermatology consultation.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer is open on Overview | Enters the name, code **CPT-99204**, price **180** and ticks **Available for appointment** | **The Availability tab appears** |
| 2 | He sets a 30 minute slot but adds no location | Presses save | **A toast says "Please add at least one location in Availability" and nothing is saved** |
| 3 | He adds a location with Room 4 | Presses save | **The item is saved, a toast names it and Room 4 is added to the AI Receptionist rooms** |
| 4 | He adds another item with the same code | Presses save | **It is saved. Duplicate codes are not blocked** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When we launch a new service, I want to set its price, tax, slot length, rooms and staff in one place, so that it can be booked at once. |
| F-2-J2 | Practice Admin | When a service is retired, I want to switch it off without deleting it, so that old records stay intact. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** no name, **when** the user saves, **then** a toast says the service name is required and nothing is saved. |
| F-2-2 | **Given** Available for appointment is ticked with no location, **when** the user saves, **then** a toast asks for a location. |
| F-2-3 | **Given** a bookable item, **when** it is saved, **then** its rooms are copied to the AI Receptionist rooms list. |
| F-2-4 | **Given** Delete is chosen, **then** the item is removed at once with no confirmation. |
| F-2-5 | **Given** any save, **then** the item is active. No control turns an item inactive. |

### F-3: Where the catalogue is used

#### 1. What it does
The catalogue feeds other screens. Meera picks a service in the appointment drawer. Sarah picks one in the portal. Daniel picks lines from it on an invoice. Not every consumer follows the same rules.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Appointment drawer picker | Hand-off | Lists items that are active and Available for appointment | ● Works | G7-S-19 |
| F-3.2: Patient booking portal | Hand-off | Same filter. A prepaid item charges price or deposit plus the item's tax | ◐ Simulated | The invoice is built with a placeholder line, so total and payment differ (XM-03) |
| F-3.3: Invoice line picker | Hand-off | Lists every catalogue item, including inactive ones, plus built-in sample services that are not in the catalogue | ◐ Simulated | The active flag is not honoured here although the appointment drawer filters on it (G7-E-05). Labels are copied as text (G7-S-22) |
| F-3.4: AI Receptionist rooms | Hand-off | Saving a bookable item syncs its rooms to the rooms list. The kiosk reads the catalogue | ● Works | G7-S-21 |
| F-3.5: Team, client, rules, process cards | Hand-off | Team settings assign staff to services. Client profiles hold assigned products. Rules, process cards and step parameters read the catalogue | ● Works | G7-S-23, G7-S-24 |
| F-3.6: Catalogue code to claim | Hand-off | Nothing reads the catalogue's CPT code when a claim is made | ○ Not built | Claim codes are typed by hand (G7-C-06) |

#### 3. Worked example
Rohan marks nothing inactive, because no control exists. A service is removed from the active list only by deleting it.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An item is bookable | Meera opens the booking drawer | **The item is in the picker** |
| 2 | Daniel creates an invoice | Opens the line picker | **The same item is there, plus built-in sample services not in the catalogue** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front-desk Staff | When booking a visit, I want only bookable services in the picker, so that I do not book something we do not offer. |
| F-3-J2 | Patient | When I book online, I want to see the price and any deposit, so that I know what I pay. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an item that is active and bookable, **then** it appears in the staff appointment drawer and the portal. |
| F-3-2 | **Given** an inactive item, **when** an invoice line is added, **then** the picker still lists it. |
| F-3-3 | **Given** a claim, **then** no catalogue code is filled in. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Catalogue list, search and export | F-1.1 – F-1.8 | ● / ○ | Table, search and chips work; no Status column or sorting. |
| F-2 | Add, edit and delete | F-2.1 – F-2.14 | ● / ◐ / ○ | Drawer works; no unique code, toggle or role check. |
| F-3 | Where the catalogue is used | F-3.1 – F-3.6 | ● / ◐ / ○ | Booking and rooms work; invoice picker ignores the active flag. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Keep one catalogue so booking and billing use the same prices | F-1 |
| 2 | Practice Admin | Search the catalogue for a price or code | F-1 |
| 3 | Practice Admin | Set price, tax, slot, rooms and staff in one place | F-2 |
| 4 | Practice Admin | Retire a service without deleting it | F-2 |
| 5 | Front-desk Staff | See only bookable services when booking | F-3 |
| 6 | Patient | See the price and deposit when booking online | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Add, edit and delete catalogue items, set prices and tax, export | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

A separate admin catalogue exists at `/admin/services`. It is outside this page. The earlier PRD names the Practice Manager and says nothing about who may change prices. Decision needed: D-15.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| All Services count | Quick-filter chip | Count of all catalogue items |
| Category count | Chips for the first four categories | Count of items whose category equals the chip |
| Item id | New item | Highest existing id plus 1 |
| Prepaid deposit | Availability tab | Full equals the item price. Deposit equals the entered amount, minimum 0 |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → **Appointment** → Scribe → Invoice → Claim | Staff books an appointment | The drawer lists active, bookable services. The price and tax feed the invoice lines. |
| | Invoice creation | The line picker lists inactive items and sample services. |
| | Claim | The catalogue code is not read. |
| Patient portal ↔ **Appointments** / Invoices | Patient books | The portal uses the same filter. A prepaid item produces an invoice with a placeholder line. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Product & Services or Services, and which category list? | Naming note |
| D-15 | Which roles may manage the catalogue? | F-2.14 |
| D-32 | Can an item be deleted once referenced, or only deactivated? | F-2.12 |
| D-60 | Is the catalogue single-currency (USD) or per item or organisation? | F-2.8 |
| D-74 | Should inactive items exist (toggle, Status column, historic invoices), which category list is canonical and should non-bookable items have an editable duration? | F-1.3, F-1.7, F-2.7, F-2.13 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |

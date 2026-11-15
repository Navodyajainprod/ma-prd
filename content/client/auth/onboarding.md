---
title: "Practice Onboarding Wizard and Plan Recommendation"
product: "client"
module: "auth"
channel: "onboarding"
route: "/onboarding"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | AUTH |
| Route | `/onboarding` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A five-step wizard (six on the paid path from Pricing) that captures the practice profile, works out a recommended plan and builds an empty workspace after a six-second loader. |
| **Who uses it** | Practice Admin, right after sign-up or after payment. The route is public and no role is checked. |
| **Where you start it** | After the verification code on `/verify`, after `/payment`, or from an invite. The typo address `/onbaording` opens the same page. |
| **Where the result goes** | A new organisation record, the Services list, the Knowledge Base, a free plan, then the dashboard with the **How it works** guide opened. |
| **How real is it** | 0 features work, 4 are partly simulated, 1 is not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Services) | First services | Services typed in step 3 are seeded as the first Services list. | [View Services](/client/services) |
| Client (Knowledge Base) | First documents | Documents uploaded in step 5 become knowledge sources. | [View Knowledge Base](/client/knowledge-base) |
| Client (Settings) | Plan assigned | The free plan of the matched product is assigned. The recommended tier is saved on the organisation but not bought. | [View Billing](/client/settings/billing) |
| Admin | Organisation record | A new organisation with a timestamp id and status Active is added. Admin Organizations lists it. | [View Admin Organizations](/admin/organizations) |
| Admin | Industry blueprints | Not connected. Onboarding stores the industry as a label and applies no blueprint, workflow or sidebar template. | [View Industries](/admin/industry-category/industries) |
| Client (Settings) | Organisation profile | Name, industry, country, locations and hours are saved on the organisation record that Settings later shows. | [View Organization](/client/settings/organization) |
| Client | Sign-up and payment | Onboarding follows verify, or payment on the paid path, and an invite skips the questions. | [View Sign-in and Sign-up](/client/auth/access) |

## 1. Module Summary

### The story in one minute

Rohan Mehta has just verified his clinic email. The wizard opens with his website and a guessed organisation name already filled in. He confirms the name, picks an industry and a service category and chooses his country. On the next step he adds the clinic address, the days and the opening hours. Then he lists three services with short descriptions. On **Your workspace** he ticks the needs he has, says he has twelve staff and about forty calls a day, and names the countries he calls. He uploads two documents and finishes. A loader runs for six and a half seconds with stages and a percentage. Then the dashboard opens with empty lists, his services, his documents and the **How it works** guide. A plan is recommended in the background and saved on the organisation. Nothing on screen shows it, and no sidebar template or industry workflow is applied.

### What is real and what is not

- **Real in the prototype:** the five steps with back, the add and delete of locations, the seeded services and documents, the empty workspace, the free plan, the invite path that skips the questions, and the recommendation formulas.
- **Simulated:** the loader percentage is a timer. The website falls back to a sample clinic site. Phone, currency and country use fixed values. A seeding failure is hidden and the user is told setup is complete. Reopening `/onboarding` after completion starts a second organisation.
- **Not built:** applying industry blueprints, workflows, automations or a sidebar template from the answers, showing the recommendation to the user, a trial and conversion step, and the voice and quick-form onboarding variants (built in code but not reachable).

### Journey position

```
Verify ─▶ Step 1 ─▶ Step 2 ─▶ Step 3 ─▶ Step 4 ─▶ Step 5 ─▶ Loader ─▶ Workspace + free plan ─▶ Dashboard
```

## 2. Feature Requests

### F-1: Wizard steps

#### 1. What it does
Rohan answers five short steps. Each has a back button. Step 1 is **About your organisation**, step 2 **About your location**, step 3 **Product and service**, step 4 **Your workspace** and step 5 **Knowledge base**. Someone who came from the pricing page sees a sixth step, **Payment**. An invited owner sees none of the steps and goes straight to the loader.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Step 1, About your organisation | Step | Organisation name, industry, service category and country. Name is pre-filled from the website or email | ◐ Simulated | The website falls back to a hardcoded sample site and default names use sample clinic data such as Eye Mantra (G14-E-11) |
| F-1.2: Step 2, About your location | Step | One or more locations with address, operating days and hours. Add and delete work | ● Works | Locations are saved as text on the organisation only |
| F-1.3: Step 3, Product and service | Step | Services with descriptions | ● Works | They become the first Services list |
| F-1.4: Step 4, Your workspace | Step | A multi-select of needs, team size, call volume per day and countries called | ● Works | Drives the plan recommendation only (see F-2) |
| F-1.5: Step 5, Knowledge base | Step | Upload practice documents | ● Works | They become knowledge sources |
| F-1.6: Back on every step | Button | Returns to the previous step | ● Works | |
| F-1.7: Step 6, Payment | Step | On the paid path from Pricing the last button reads **Continue to payment** and sends the user to `/payment`. After payment the user comes back to finish tailoring | ● Works | See the payment PRD. Currency is INR and default country India on this path, versus USD and United States on the open path |
| F-1.8: Currency, country and phone defaults | Rule | INR and India on the paid path, USD and United States on the open path. Every new organisation gets the same fixed sample phone number | ◐ Simulated | (G14-E-15). Decision needed: D-62 |
| F-1.9: Invite path | Rule | Questions are skipped, the loader runs at once and the workspace is built from the stored invite. The plan comes from the invite, with Starter as fallback | ● Works | |
| F-1.10: Entry and guard | Rule | The route is public. A user who skipped onboarding can open the dashboard without it | ○ Not built | No onboarding-complete guard (G14-E-09). Decision needed: D-48 |

#### 3. Worked example
Rohan sets up the clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Step 1 opens | Confirms the pre-filled name, picks industry and country | **He can continue to step 2** |
| 2 | Step 2 | Adds two locations and deletes one | **One location remains** |
| 3 | Step 5 on the open path | Uploads two documents and finishes | **The loader starts** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I join, I want to describe my practice once, so that the product starts with my details. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the open path, **then** there are five steps. **Given** the pricing path, **then** there are six. |
| F-1-2 | **Given** no website was provided, **when** step 1 opens, **then** a hardcoded sample website is used. |
| F-1-3 | **Given** an invite session, **when** `/onboarding` opens, **then** the questions are skipped and the loader starts at once. |
| F-1-4 | **Given** a signed-in user who has not finished the wizard, **when** the dashboard address is opened, **then** it opens. |

### F-2: Plan recommendation

#### 1. What it does
At the end of step 4 the wizard works out a product and a tier from the needs Rohan ticked. The result is written to the organisation record. No screen shows it to him.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Product choice | Rule | The product family with the most ticked needs wins. A tie goes to the first ticked need. With none ticked it is AI Receptionist | ● Works | |
| F-2.2: Tier choice | Rule | The highest of three: the lowest tier that contains every ticked need, the tier for team size, and the tier for calls per day (receptionist only). Scribe team limits are 3, 10 and 25. Other products are 8, 25 and 100 | ● Works | |
| F-2.3: Free start | Rule | The open path assigns the free plan of the matched product. The recommended tier is saved but not bought | ● Works | |
| F-2.4: Showing the recommendation | Screen | No screen shows the recommendation or lets the user accept it | ○ Not built | Decision needed: D-48 |
| F-2.5: Trial length and conversion to paid | Rule | Free accounts have no trial length and no conversion step | ○ Not built | Decision needed: D-48 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Twelve staff, receptionist needs ticked, forty calls a day | Finishes step 4 | **The organisation stores AI Receptionist and the tier that fits the highest of the three rules. The user sees nothing** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When I describe my practice, I want a sensible plan suggested, so that I do not overpay or under-buy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** several needs from different products, **then** the product with the most needs is chosen. |
| F-2-2 | **Given** no needs, **then** the product is AI Receptionist. |
| F-2-3 | **Given** step 4 is finished, **then** the recommended category and tier are saved on the organisation and nothing is shown. |

### F-3: Finish and build the workspace

#### 1. What it does
When Rohan finishes the last step a full-screen loader shows stages and a percentage for about six and a half seconds. The percentage follows a timer. Then a new organisation is created, locations, services and documents are stored, every business list is emptied, a free plan is assigned and the dashboard opens with the **How it works** guide.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Build loader | Screen | A 6.5 second loader with stages and a percentage | ◐ Simulated | The percentage is a timer, not real progress |
| F-3.2: New organisation | Rule | Creates an organisation with a timestamp id, status Active, name, industry, country, locations, services, call volume, countries, team size, needs and documents | ◐ Simulated | Phone and currency are fixed values (G14-E-15). Missing names fall back to sample clinic data (G14-E-11) |
| F-3.3: Empty workspace | Rule | Clients, calls, processes, appointments, deals, invoices, payments and claims lists start empty | ● Works | |
| F-3.4: Free plan | Rule | A free plan for the matched product is assigned on the open path | ● Works | The paid and invite paths assign their own plan |
| F-3.5: Completion | Rule | Marks onboarding complete, signs the user in, shows a toast and opens the dashboard with the **How it works** guide | ● Works | |
| F-3.6: Seeding failure | State | If building the workspace fails, the organisation is added another way, a console warning is written and the user is told setup is complete | ◐ Simulated | (G14-E-12) |
| F-3.7: Reopening after completion | Rule | If onboarding is already marked complete when `/onboarding` opens, the loader runs again and a second organisation with a new id is created | ◐ Simulated | Confirmed in the prototype code (G14-E-10). Decision needed: D-48 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Last step done | Presses finish | **A six second loader runs, then the dashboard opens with empty lists and the guide** |
| 2 | Onboarding was finished last week | Opens `/onboarding` again | **The loader runs and a second organisation is created** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When setup ends, I want a clean workspace with my services and documents, so that no sample data confuses my team. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the last step is finished, **then** a new organisation is created with status Active and all business lists are empty. |
| F-3-2 | **Given** onboarding is already complete, **when** `/onboarding` opens, **then** the loader runs and a new organisation is created. |
| F-3-3 | **Given** building the workspace throws an error, **then** the user is still told setup is complete. |

### F-4: What the answers configure

#### 1. What it does
Rohan's answers fill the organisation record and seed two lists. They do not choose the sidebar, industry workflows or automations.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Organisation record | Rule | Industry, service category, country, operating countries, international-calls flag, team size, call volume and needs are saved | ● Works | |
| F-4.2: Telephony | Rule | Telephony choice is fixed to default | ◐ Simulated | Not an answer from the user |
| F-4.3: Services | Seed | Step 3 services become the Services list | ● Works | |
| F-4.4: Knowledge sources | Seed | Step 5 documents become knowledge sources | ● Works | |
| F-4.5: Locations | Rule | Locations and hours are saved as text on the organisation | ◐ Simulated | No location record is created |
| F-4.6: Industry blueprints | Rule | The industry is saved as a label only | ○ Not built | The industry PRD expects blueprints for instant onboarding (G14-I-04). Decision needed: D-50 |
| F-4.7: Sidebar template | Rule | No sidebar template is set from the answers | ○ Not built | Decision needed: D-50 |
| F-4.8: Industry workflows and automations | Rule | None are created from the answers | ○ Not built | Decision needed: D-50 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A dental clinic finishes the wizard | Opens the dashboard | **Services and documents are loaded. The sidebar and workflows are the defaults** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When I name my industry, I want the product to set up the right workflows, so that I start with a fit workspace. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** the wizard is finished, **then** services and documents are seeded and the industry is stored as a label. |
| F-4-2 | **Given** any answers, **then** no sidebar template, industry workflow or automation is created. |

### F-5: Voice and quick-form variants

#### 1. What it does
Two other onboarding screens exist in code. One is a spoken conversation. The other is a single form. Neither is imported or routed, so Rohan can never open them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Voice onboarding | Screen | A voice conversation that fills the same data shape as the wizard | ○ Not built | Not reachable (G14-E-13). Decision needed: D-49 |
| F-5.2: Quick-form onboarding | Screen | One form with the same fields | ○ Not built | Not reachable (G14-E-13). Decision needed: D-49 |
| F-5.3: Specialty guessing and sample locations | Helper | Would guess the specialty from website text, fall back to General Physician and invent sample locations | ○ Not built | Only used by the unreachable screens |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan looks for a faster way to onboard | Opens `/onboarding` | **Only the five-step wizard is available** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | When I am busy, I want to onboard by talking or by one short form, so that setup takes minutes. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** any address, **then** no route opens the voice or quick-form onboarding. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Wizard steps | F-1.1 – F-1.10 | ● / ◐ / ○ | Steps work; sample defaults and no completion guard. |
| F-2 | Plan recommendation | F-2.1 – F-2.5 | ● / ○ | Formulas run; the result is saved and never shown. |
| F-3 | Finish and build the workspace | F-3.1 – F-3.7 | ● / ◐ | Empty workspace works; reopening creates a second organisation. |
| F-4 | What the answers configure | F-4.1 – F-4.8 | ● / ◐ / ○ | Record and seeds work; no blueprint or sidebar template. |
| F-5 | Voice and quick-form variants | F-5.1 – F-5.3 | ○ Not built | Built in code, not reachable. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Describe my practice once | F-1 |
| 2 | Practice Admin | Get a sensible plan suggested | F-2 |
| 3 | Practice Admin | Start with a clean workspace | F-3 |
| 4 | Practice Admin | Have my industry set up the right workflows | F-4 |
| 5 | Practice Admin | Onboard by voice or one short form | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone, signed in or not | Open `/onboarding` and run the wizard, again after completion | Nothing. The route is public |
| Invited owner | Skip the questions and go straight to the loader | Nothing |
| Any signed-in user | Open the dashboard without finishing onboarding | Nothing |

No earlier PRD covers onboarding. Decision needed: D-48.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Recommended product | Saved on the organisation | The product family with the most ticked needs. Tie goes to the first ticked need. Default AI Receptionist |
| Recommended tier | Saved on the organisation | The highest of: lowest tier containing every ticked need, tier by team size (Scribe 3, 10, 25, other products 8, 25, 100), tier by calls per day (receptionist only) |
| Build progress percentage | Loader | Elapsed time divided by 6.5 seconds. **Hardcoded, formula undefined** as real progress |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-48 | Should free accounts have a trial and conversion step, and should the app block users until onboarding and payment are complete (and what happens on reopening)? | F-1.10, F-2.4, F-2.5, F-3.7 |
| D-49 | Are the voice and quick-form onboarding variants shipped, replacing the wizard, or deleted, and which is the default? | F-5.1, F-5.2 |
| D-50 | Should onboarding answers choose industry workflow templates, automations or the sidebar template? | F-4.6, F-4.7, F-4.8 |
| D-62 | Which currency and payment rails apply, INR for the pricing path and USD otherwise? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

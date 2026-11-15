---
title: "Admin: Automations"
product: "admin"
module: "automations"
route: "/admin/automations"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | AUTOMATIONS |
| Route | `/admin/automations` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of global trigger and action rules called "Admin Global Rules", scoped by industry and location, with a flow builder to create them. This screen has no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the address can create, pause and delete rules. |
| **Where you start it** | **Automations** in the admin sidebar (`/admin/automations`). The alias `/admin/automation` shows the same page. |
| **Where the result goes** | The shared automation store that the client Automation page also reads. Tenants in scope see the rule and can switch it off or delete it. See [Automation](/client/automation). |
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
| Client (Automation) | Admin rules in tenant list | The client Automation page lists admin rules whose scope matches the organisation. | [View Automation](/client/automation) |
| Client (Automation) | Tenant toggle and delete | Tenants can switch off or delete admin rules with no permission check (G13-E-51). Decision needed: D-17. | [View Automation](/client/automation) |
| Admin (Workflows) | Stage automations | Automations added to a workflow stage also appear in this list. | [View Admin Workflows](/admin/admin-workflows) |

## 1. Module Summary

### The story in one minute

Leo Martin is a Platform Admin. He opens **Automations**. The list is empty, and the chips read All 0, Active 0 and Paused 0. He presses **New Rule** and types "No-show follow-up". The flow builder opens and he chooses a trigger and an action. The builder refuses a rule that loops back on itself. He saves, and because it is a draft the rule is Paused. He clicks the status to make it Active. The Last Run column shows a dash. A clinic in scope now sees the rule in its own Automation page. The clinic can switch it off or delete it, which Leo never intended.

### What is real and what is not

- **Real in the prototype:** the list with filters and counts, creating a rule in the flow builder with validation, pausing and activating, deleting after a confirmation, and setting the scope.
- **Simulated:** Last Run (never recorded), the Permissions panel (does nothing), and the tenant side, where admin rules can be toggled and deleted.
- **Not built:** duplicate, import and export, and loading and error states.

### Journey position

```
Admin rule ─▶ Shared automation store ─▶ Client Automation list (tenants can toggle and delete)
```

## 2. Feature Requests

### F-1: Global rules list

#### 1. What it does
Leo opens **Automations**. A search box, filters and the chips **All**, **Active** and **Paused** sit above the table. The table shows Rule Name, Trigger Event, Admin Scope, Status and Last Run. Rules created from a workflow stage also appear here. A built-in seed rule is hidden, so the list starts empty.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Search, filters and chips | Controls | Search, filters and All, Active, Paused chips with counts | ● Works | |
| F-1.2: Rules table | Table | Rule Name, Trigger Event, Admin Scope and a clickable Status | ● Works | |
| F-1.3: Last Run | Column | Should show the time of the last execution | ◐ Simulated | The time is never recorded, so it always shows a dash (G13-E-50) |
| F-1.4: Stage automations | List | Automations added on a workflow stage appear in the list | ● Works | |
| F-1.5: Loading and error states | State | None exist | ○ Not built | See G13-X-05 |

#### 3. Worked example
Leo checks what is live.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two rules exist, one Paused | Presses the **Active** chip | **Only the active rule is listed** |
| 2 | He looks for when it last ran | Reads **Last Run** | **A dash is shown** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I review the rules that apply everywhere, I want to see which are active and when they last ran, so that I can trust them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the rules list, **when** a chip is pressed, **then** the table shows only rules with that status. |
| F-1-2 | **Given** any rule, **then** Last Run shows a dash because no run time is stored. |

### F-2: Create and manage a rule

#### 1. What it does
**New Rule** asks for a Rule Name, a description and a scope. The shared flow builder opens next. A rule that points at the wrong entity or that loops is rejected. Save always writes the rule as Active: the Draft option is not reachable (same builder as the client Automation page). Each row has a menu with **Configure Scope Rules**, **View / Edit** and **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: New Rule modal | Modal | Rule Name is required (message "Please enter a rule name to continue."), Description, Scope, then the flow builder | ● Works | |
| F-2.2: Target and loop checks | Rule | Rules with an invalid entity target or a loop are rejected | ● Works | |
| F-2.3: Draft status | Rule | The earlier PRD said a draft starts Paused. The builder has a Draft option in code but no control opens it, and Save always writes Active, so editing a paused rule and saving makes it Active | ○ Not built | Same drawer as the client Automation page |
| F-2.4: Toggle status | Action | Clicking the status switches Active and Paused | ● Works | No toast |
| F-2.5: Delete | Row action | Asks "Delete rule" in a browser confirmation, then removes the rule | ● Works | |
| F-2.6: Configure Scope Rules | Panel | Rule N with Industry Category, Industries and an optional Country. No rules means all tenants | ● Works | |
| F-2.7: Permissions panel | Panel | Hide, Edit, Add and Delete boxes for tenants | ◐ Simulated | Always ticked and clicks do nothing (G13-E-34). Decision needed: D-17 |
| F-2.8: Duplicate, import and export | Action | No such controls exist | ○ Not built | |

#### 3. Worked example
Leo adds a no-show follow-up rule.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He presses **New Rule** and leaves the name empty | Continues | **"Please enter a rule name to continue." shows** |
| 2 | He names it and builds a trigger and action | Saves as a draft | **The rule is listed as Paused** |
| 3 | He wants it live | Clicks the status | **It becomes Active** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When a rule should apply everywhere, I want to build it once and set its scope, so that every matching clinic gets it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** New Rule, **when** the name is empty, **then** a message asks for it and the flow does not continue. |
| F-2-2 | **Given** a draft rule, **when** it is saved, **then** its status is Paused. |
| F-2-3 | **Given** Delete, **then** a browser confirmation shows before the rule is removed. |
| F-2-4 | **Given** the Permissions panel, **when** a box is clicked, **then** nothing changes. |

### F-3: Effect on tenants

#### 1. What it does
Admin rules and client rules live in one shared store. A clinic's Automation page lists the admin rules that match its scope. The clinic can use the same switch and delete as for its own rules.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Scoped rules on the client | Rule | The client Automation page shows admin rules that match the organisation | ● Works | |
| F-3.2: Tenant toggle and delete | Rule | A tenant can pause or delete an admin rule | ◐ Simulated | No permission check, so the rule's permissions are ignored (G13-E-51). Decision needed: D-17 |
| F-3.3: Shared store | Rule | Admin and client read and write one stored list of rules | ● Works | A tenant delete removes the rule for the admin as well |

#### 3. Worked example
A clinic dislikes a global rule.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The rule shows in the clinic's Automation page | Deletes it | **The rule is deleted from the shared store and disappears from Leo's list too** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When I publish a global rule, I want to decide whether clinics may change it, so that platform standards hold. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an admin rule in scope, **then** it is listed on the client Automation page. |
| F-3-2 | **Given** an admin rule, **when** a tenant toggles or deletes it, **then** the change is applied whatever the rule's permissions say. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Global rules list | F-1.1 – F-1.5 | ● / ◐ / ○ | List and counts work; Last Run is always empty. |
| F-2 | Create and manage a rule | F-2.1 – F-2.8 | ● / ◐ / ○ | Builder, validation and delete work; permissions do nothing. |
| F-3 | Effect on tenants | F-3.1 – F-3.3 | ● / ◐ | Tenants see scoped rules and can delete them. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | See which global rules are active and when they last ran | F-1 |
| 2 | Platform Admin | Build a rule once and set its scope | F-2 |
| 3 | Platform Admin | Decide whether clinics may change a global rule | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/automations`, create, pause and delete rules | Nothing. The admin routes only check sign-in |
| Tenant user | Toggle and delete admin rules from the client Automation page | Nothing (G13-E-51) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The role comes from browser storage and defaults to SystemAdmin. The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| All, Active, Paused counts | Chips | Count of rules by status |
| Last Run | Table | Stored timestamp that is never set. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

This screen appears in none of the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-17 | Which roles may edit automations, and may tenants change admin rules? | F-2.7, F-3.2 |
| D-12 | Must permissions block direct URL access and each action, not only hide sidebar items? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

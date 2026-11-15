---
title: "Admin: Workflows"
product: "admin"
module: "admin-workflows"
route: "/admin/workflows"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | ADMIN-WORKFLOWS |
| Route | `/admin/workflows` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The "Admin Workflow Architect": a two-panel designer for the pipelines tenants use (Processes, Appointments, Invoices, Insurance, Claims and Tasks). It edits the same stored workflows as the client Workflows page, with no template layer between them. This screen has no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the address can edit every workflow. |
| **Where you start it** | **Workflows** in the admin sidebar (`/admin/workflows`). The aliases `/admin/workflow`, `/admin/process-templates` and `/admin/process-template` show the same page. The admin logo link also points here. |
| **Where the result goes** | Straight into the live workflow store that the client Process board and the client Workflows page read. See [Workflows](/client/workflows) for how the page behaves for tenants. |
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
| Client (Workflows) | Same workflow store | The client Process board and Workflows page read and write the same stored list. An admin edit changes live tenant workflows at once, filtered by the tenant's scope. Decision needed: D-51. | [View Workflows](/client/workflows) |
| Client (Workflows) | Hide permission | The client hides a workflow when the admin Hide box is unticked, the opposite of the tooltip (G13-E-48). Decision needed: D-51. | [View Workflows](/client/workflows) |
| Admin (Automations) | Stage automations | Automations added to a stage also appear in the admin Automations list. | [View Admin Automations](/admin/automations) |
| Admin (Product / Services) | Products and Services on a workflow | The workflow settings panel has a Products & Services section. | [View Admin Product / Services](/admin/products-services) |
| Client (Knowledge Base) | Add Knowledge Base | The button on a workflow opens the client Knowledge Base, not the admin one. | [View Knowledge Base](/client/knowledge-base) |
| Admin (AI Voices & Models) | Calling voices and models | New workflows are preset to "OpenAI - GPT-4o" and voice "Ava". Whether admin-active voices and models apply is unverified. | [View AI Voices & Models](/admin/ai-voices-models) |

## 1. Module Summary

### The story in one minute

Leo Martin is a Platform Admin. He opens **Workflows** and sees the Admin Workflow Architect. Workflow cards stand on the left with their stages. The right panel shows the one he picks. He adds a stage called "Insurance Verify" before Won and sets its Action to **Handle By Human**. He drags it into place. Then he adds a stage automation and presses the test chat to see how the stage talks. Everything he saves is written to the same store the clinics use, so the stage shows up on a clinic's Process board straight away. He has no way to delete a whole workflow. When he edits a Claims workflow, it is lost the next time workflows are saved.

### What is real and what is not

- **Real in the prototype:** adding a workflow, adding, editing, reordering and deleting stages, stage and workflow settings, stage automations and the entity counts.
- **Simulated:** Temporary Disable, the scope permissions after creation, the Hide permission, the Claims workflows that are dropped on save, the left-panel stage delete without confirmation, and the test chat.
- **Not built:** deleting a workflow, draft, publish and versions, loading and error states, and seven modals that cannot be reached from the page.

### Journey position

```
Admin edits workflow ─▶ Live workflow store ─▶ Client Process board and Workflows page
```

## 2. Feature Requests

### F-1: Workflow list and settings

#### 1. What it does
Leo opens **Workflows**. The header carries **Test Process** and **How Workflow Works**. A search box and an Entity dropdown (Processes, Appointments, Invoices, Insurance, Claims, Tasks, each with a count) and Category, Industry and Location filters narrow the list. **Add Workflow** is hidden when the entity is Tasks. He opens a workflow and edits its name, description and scope inline. The page logic for workflows is the same as the client page: see [Workflows](/client/workflows).

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Entity filter and counts | Dropdown | Lists the six entity types with a count each | ● Works | |
| F-1.2: Add Workflow | Modal | Process Name and Process Description are required (message "Please fill all fields"), Entity Type, Scope and Permissions. Default stages are generated for the entity | ● Works | New workflows are preset to AI "OpenAI - GPT-4o" and voice "Ava" |
| F-1.3: Inline name and description | Text | Edit in place on the right panel | ● Works | An empty name or description is accepted |
| F-1.4: Scope chip and Scope Rules | Modal | Industry Category, Industries and Country rules decide which tenants see the workflow | ◐ Simulated | After creation the permission boxes are not connected (G13-E-49). Decision needed: D-51 |
| F-1.5: Temporary Disable | Toggle | Appears on the workflow panel | ◐ Simulated | The setting is not saved (G13-E-47) |
| F-1.6: Delete a workflow | Action | No control deletes a whole workflow | ○ Not built | The handler exists but nothing calls it (G13-E-45). Decision needed: D-51 |
| F-1.7: Other modals | Modal | Seven further modals and one step card are in the code | ○ Not built | Not reachable from the page (G13-E-49) |
| F-1.8: Loading and error states | State | None exist | ○ Not built | See G13-X-05 |

#### 3. Worked example
Leo adds a workflow for follow-up calls.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He presses **Add Workflow** and leaves the description empty | Presses save | **A message says "Please fill all fields" and nothing is saved** |
| 2 | He completes the form | Saves | **The workflow appears with default stages for its entity** |
| 3 | He turns on **Temporary Disable** | Leaves and returns | **The toggle is off again** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I introduce a new care journey, I want to create a workflow with the right entity and scope, so that the right clinics get it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the Add Workflow modal, **when** the name or description is empty, **then** "Please fill all fields" shows and nothing is saved. |
| F-1-2 | **Given** a workflow, **when** the user turns on Temporary Disable and leaves, **then** the setting is not kept. |
| F-1-3 | **Given** the page, **then** no control deletes a workflow. |

### F-2: Stages

#### 1. What it does
Each workflow card on the left lists its stages. Leo adds a stage and it lands before Won and Lost. He edits a stage, drags it to reorder, or deletes it. On the right panel a delete asks for confirmation and refuses predefined stages. The small delete icon on the left card does not.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Add stage | Modal | The stage name is required. The stage is placed before Won and Lost | ● Works | |
| F-2.2: Edit stage | Modal | Changes the stage name and settings | ● Works | |
| F-2.3: Reorder | Drag | Drag stages in the left panel | ● Works | |
| F-2.4: Delete stage on the right panel | Button | Asks for confirmation. Predefined stages cannot be deleted | ● Works | |
| F-2.5: Delete stage on the left panel | Icon | Removes the stage at once | ◐ Simulated | No confirmation and no predefined-stage check (G13-E-44). Decision needed: D-06 |

#### 3. Worked example
Leo tidies the stages of an Insurance workflow.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A predefined stage is selected | Presses delete on the right panel | **A message refuses it** |
| 2 | The same predefined stage on the left card | Presses its delete icon | **The stage is removed at once** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When a journey changes, I want to add, order and remove stages safely, so that clinics do not lose required steps. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a new stage, **then** it is placed before Won and Lost. |
| F-2-2 | **Given** the right-panel delete, **then** a confirmation shows and predefined stages are refused. |
| F-2-3 | **Given** the left-panel delete icon, **then** the stage is removed with no confirmation and no predefined check. |

### F-3: Stage and workflow behaviour

#### 1. What it does
Leo picks a stage and sets how the AI treats it. The stage view has **General** and **Automations** tabs. The workflow view holds Products & Services, Knowledge Base, Enable Calling, Enable Chatbot and Client Portal & AI Receptionist. He can try the result in a test chat.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Stage settings | Panel | Action (Client Reach Out To Us, Reach Out To The Client, No Action, Handle By Human), when to move, call trigger and AI Prompt single or comprehensive | ● Works | |
| F-3.2: Workflow settings | Panel | Products & Services, Knowledge Base, Enable Calling, Enable Chatbot, Client Portal & AI Receptionist | ● Works | Add Knowledge Base opens the client Knowledge Base |
| F-3.3: Stage automations | Tab | Add, edit, toggle and delete automations on a stage. A badge shows how many a stage has | ● Works | |
| F-3.4: Preview and Test | Drawer | A client-style preview and a chat simulator via **Test Process** | ◐ Simulated | A simulator. What it calls is unverified |

#### 3. Worked example
Leo wants a human to handle insurance checks.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A stage is open on the General tab | Sets Action to **Handle By Human** | **The stage setting is saved** |
| 2 | He opens the Automations tab | Adds an automation | **The stage badge shows one automation and the rule also appears in Admin Automations** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When I design a stage, I want to say who handles it and what runs on entry, so that clinics get a working journey. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a stage, **when** an Action is chosen, **then** it is saved with the stage. |
| F-3-2 | **Given** a stage automation is added, **then** the badge on the stage counts it. |

### F-4: Effect on tenants

#### 1. What it does
There is no template. When Leo saves, the clinics' own Process board changes. Tenants see only the workflows that match their scope. A Hide box in the workflow's permissions changes what tenants see, but its meaning is undecided.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Same store as client | Rule | Admin and client edit one stored list of workflows and stages | ● Works | Admin edits change live tenant workflows at once. Decision needed: D-51 |
| F-4.2: Scope filter on the client | Rule | The client shows a workflow only if its scope matches the organisation | ● Works | |
| F-4.3: Claims workflows | Rule | Workflows of every entity type, including Claims, are saved | ◐ Simulated | Claims workflows are dropped every time workflows are saved (G13-E-46) |
| F-4.4: Hide permission | Rule | The client hides a workflow when the Hide box is unticked | ◐ Simulated | The tooltip says the opposite (G13-E-48). Decision needed: D-51 |
| F-4.5: Draft, publish and versions | Rule | An edit should not change tenants until published | ○ Not built | Decision needed: D-51 |

#### 3. Worked example
Leo edits a Claims workflow.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A Claims workflow exists | Changes a stage and saves | **The save runs** |
| 2 | Workflows are saved again | Reopens Workflows | **The Claims workflow is gone** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | Before a change goes to clinics, I want to publish it deliberately, so that I do not break a live pipeline. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** an admin edit, **then** the client workflow store changes at once. No draft or publish step exists. |
| F-4-2 | **Given** a Claims workflow, **when** workflows are saved, **then** it is dropped. |
| F-4-3 | **Given** the Hide box is unticked, **then** the client hides the workflow. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Workflow list and settings | F-1.1 – F-1.8 | ● / ◐ / ○ | Add works; disable not saved; no delete. |
| F-2 | Stages | F-2.1 – F-2.5 | ● / ◐ | Stage editing works; left-panel delete is unguarded. |
| F-3 | Stage and workflow behaviour | F-3.1 – F-3.4 | ● / ◐ | Settings and automations work; test chat is a simulator. |
| F-4 | Effect on tenants | F-4.1 – F-4.5 | ● / ◐ / ○ | Edits go live at once; Claims workflows are lost. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Create a workflow with the right entity and scope | F-1 |
| 2 | Platform Admin | Add, order and remove stages safely | F-2 |
| 3 | Platform Admin | Say who handles a stage and what runs on entry | F-3 |
| 4 | Platform Admin | Publish a change deliberately | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/workflows` and edit every workflow and stage | Nothing. The admin routes only check sign-in |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The role comes from browser storage and defaults to SystemAdmin. The sidebar hides the item for admin roles without the module, but the address still opens (G13-E-98). The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Entity counts | Entity dropdown | Number of stored workflows per entity type |
| Automation badge | Stage card | Number of automations attached to the stage |

## 6. Cross-module journeys this module appears in

This screen appears in none of the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-51 | Should admins edit a published template through draft and version instead of live tenant workflows, should workflows be deletable, and does the Hide tick mean tenants may hide or visible to tenants? | F-1.4, F-1.6, F-4.1, F-4.4, F-4.5 |
| D-06 | Should every destructive action ask for confirmation? | F-2.5 |
| D-12 | Must permissions block direct URL access and each action, not only hide sidebar items? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

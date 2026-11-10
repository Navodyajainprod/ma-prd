---
title: "Workflow Designer Canvas & Trigger-Action Pipelines"
product: "client"
module: "workflows"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | WORKFLOWS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Workflow Designer provides an interactive node-based canvas for authoring automated clinical care pathways. Coordinators can connect Trigger nodes (e.g. Appointment Booked, Patient Arrived), Condition nodes (e.g. If First Visit, If High Risk), and Action nodes (e.g. Send SMS, Create Task, Generate Bill).
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Interactive Node Canvas & Visual Pipeline Authoring
#### 1. What it does
Provides an infinite draggable canvas with zoom controls, mini-map navigation, and drag-and-drop node palette allowing users to wire clinical automation pipelines with curved connection lines.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Drag-and-Drop Node Canvas | Visual Canvas | Interactive canvas with pan, zoom (25% - 200%), and grid snapping | Supports complex branching |
| F-1.2: Node Palette Drawer | Palette | Draggable node catalog categorized into Triggers, Conditions, Actions, and Delays | Searchable node list |
| F-1.3: Bezier Connection Wires | Wire Connector | Click and drag from node output ports to input ports with visual connection line | Validates compatible port types |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator designs post-op care flow | Drags 'Patient Checked Out' trigger, connects 'Wait 24h' delay node, connects 'Send WhatsApp Care Check' action | **Activates workflow; post-op patients automatically receive check-in message 24 hours later** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Coordinator | When establishing standardized care protocols, I want a visual workflow canvas, so that I can design patient follow-up pipelines without writing code. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Valid connections between trigger, condition, and action nodes execute in sequence when trigger events occur. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Interactive Node Canvas & Visual Pipeline Authoring | F-1.1, F-1.2, F-1.3 | Provides an infinite draggable canvas with zoom controls, mini-map navigation, and drag-and-drop node palette allowing users to wire clinical automation pipelines with curved connection lines. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Coordinator | When establishing standardized care protocols, I want a visual workflow canvas, so that I can design patient follow-up pipelines without writing code. | F-1 |

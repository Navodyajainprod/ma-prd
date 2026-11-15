---
title: "Glossary and naming: names as shown today"
product: "reference"
module: "reference"
channel: "glossary"
status: "In Review"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | REFERENCE |
| Module | GLOSSARY |
| Status | In Review |
| Last updated | 2026-11-14 |

## 1. How to read this page

This page lists the names the prototype shows on screen today. Many concepts have more than one name. This page does not pick a winner. Each conflict is marked as a decision pending, with the decision id from the decisions list.

The Earlier PRD wording column shows what the earlier PRD files called the same thing. Where a name appears only in a route or a file name, the table says so.

## 2. Names as shown today

### Process, Workflows, Deals and Pipeline

Two separate things share these words, and the sidebar labels are crossed. The sidebar item **Process** opens `/deals`, the Kanban board of client records moving through stages. The sidebar item **Workflows** opens `/process`, the designer of stages, rules and the AI persona per stage.

| Concept | Name on screen | Where it appears | Earlier PRD wording | Decision |
| :--- | :--- | :--- | :--- | :--- |
| Kanban board of client records | Process (sidebar), page title Process, badge Pipeline | Route `/deals`. Toasts say Deal moved and Deal deleted. Help says How Process Works. | Process and Deals, deal cards, Clinical Process Pipeline (`/client/processes/kanban`) | Decision needed: D-01 |
| Designer of stages, rules and AI persona | Workflows (sidebar), page says Workflow, badge Workflow Architect | Route `/process`. Panels say Process Settings, Edit Process Details, Search processes. | The earlier Workflows page describes a trigger and action canvas, which is a different thing | Decision needed: D-01 |
| One client record in a stage | Deal, process, client process or workflow, depending on the screen | Kanban toasts, Process List, buttons such as Add Workflow | Deal cards | Decision needed: D-01 |
| Trigger and action rules | Automation | Route `/automation` and admin Automations | Automation, and overlaps with the earlier Workflows page | Decision needed: D-08 |
| Admin-owned templates cloned to clinics | Workflows (admin sidebar) | `/admin/workflows`, `/admin/process-templates` | Admin pages | Decision needed: D-01 |

### Other concepts

| Concept | Name on screen | Where it appears | Earlier PRD wording | Decision |
| :--- | :--- | :--- | :--- | :--- |
| The people records | Contact (sidebar label), Contacts (page header), Clients (route `/clients`, not-found message Client not found) | Sidebar, Clients page, Call Logs and Invoices column Patient Name | Contact and Patient EHR Directory, Patients | Decision needed: D-01 |
| Category of a contact | Lead, Client, Supplier, Vendor, plus custom categories | Contact category dropdown | Tabs Leads, Patients, Archived. Archived and Pending are not built. | Decision needed: D-01 |
| People on patient-facing screens | Patient | Kiosk copy, patient routes `/patient/*`, Patient Account banner | Patient | Decision needed: D-01 |
| A scheduled slot | Appointment | Sidebar Appointments, route `/appointments` | Appointments | Decision needed: D-114 |
| The same thing in the patient app | Visits (drawer label for `/patient/book`) | Patient app drawer, step Confirm booking, Booked stage | Visits | Decision needed: D-114 |
| The day-of journey | My Visit, Visit Summary | Kiosk | Visit journey | Decision needed: D-114 |
| Sidebar item for the catalogue | Product & Services | Clinic sidebar | Services | Decision pending (no decision id assigned yet) |
| Same catalogue, other names | Services (route `/services`), Product / Services (admin), Products & Services rooms (AI Receptionist rooms table) | Route, admin sidebar, rooms table | Services | Decision pending (no decision id assigned yet) |
| The patient app | Companion (Chats channel, widget settings), Patient portal (route `/patient`, layout), Client Portal (task share target) | Several settings and share screens | Companion | Decision pending (no decision id assigned yet) |
| Source label on portal bookings | MA-Client | Appointment source | Not mentioned | Decision pending (no decision id assigned yet) |
| The chatbot in the patient app | Care Bot | Floating button, Messages | Care Bot, Care Chat | Decision pending (no decision id assigned yet) |
| Clinic staff list | Team (sidebar and Settings, route `/settings/team`) with sub-tabs Users, Roles, Departments | Settings | Team and Roles, Users | Decision needed: D-05 |
| Login accounts | Users (route `/users`, client User Management) | Legacy page outside Settings | Users | Decision needed: D-05 |
| Platform staff list | User Management, with an Administrator column | `/admin/users` | Users | Decision needed: D-11 |
| Physical place a patient goes | Room (Clinic Rooms & Desks, Room Label, appointment column Room), Desk (Desk N, OPD Desk), Station (queue ticket at the room's station) | Settings rooms drawer, kiosk | Stations | Decision needed: D-124 |
| The kiosk device | Kiosk (Kiosk & Terminals, route `/reception`), Terminal (Receptionist terminals, Reception Terminal N) | Settings, kiosk header | Kiosk shell | Decision needed: D-124 |
| Queue item given to a patient | Token (Token Issued, No Active Token Today), Ticket (code and ticket log), Queue number | Kiosk, earlier PRD | Token prefixes D-, P-, L-, B-, R-, queue number | Decision needed: D-124 |
| The kiosk voice | Aria (Greeting Phrase spoken by Aria) | Kiosk, settings | Aria | Decision pending (no decision id assigned yet) |
| The AI product | AI Receptionist (sidebar, Settings tab, kiosk header) | Sidebar, kiosk | AI Receptionist | Decision pending (no decision id assigned yet) |
| The kiosk screen | Clinic AI Avatar, Voice and Touch Enabled (route `/reception/avatar`) | Kiosk | Avatar | Decision pending (no decision id assigned yet) |
| The human front desk | Receptionist, Reception Settings, Receptionist terminals | Settings, route `/reception` | Receptionist, as the AI in the settings page and as a human role elsewhere | Decision pending (no decision id assigned yet) |
| A Knowledge Base item | Knowledge source (header, delete message), Reference material, presets Text Articles, File Documents, URLs & Links (coming soon) | Knowledge Base page | Markdown Article Viewer, articles | Decision needed: D-04 |
| Plan tiers | Free, Starter, Growth, Scale, Professional, Custom in the data type. The admin filter shows Free (Onboarding), Starter, Growth, Professional. Scale becomes Professional on read. | Admin Plans | Starter, Growth, Enterprise | Decision needed: D-54 |
| Web forms | Webforms (menu), Web Forms (page title), Forms and Form Templates (admin), Form Flows (code), Forms (patient app) | Several | Web Forms | Decision pending (no decision id assigned yet) |
| Custom fields | Sections / Fields (menu), Custom Fields (admin) | Settings, admin | Custom fields, fields, sections | Decision pending (no decision id assigned yet) |
| Audit record | Audit Logs (menu), Logs (admin), Activity (timeline in drawers) | Settings, admin | HIPAA Security Audit Logs and Access History | Decision needed: D-42 |

The names Process, Workflows, Deals, Pipeline, Contact, Client and Patient also appear in the sidebar file and an unused navigation file with different labels. The tenant sidebar shows labels from the menu context, not from the navigation file. Which file is canonical is a decision pending.

## 3. Status vocabularies as built

### Invoice statuses

| Source | Values | Decision |
| :--- | :--- | :--- |
| Code status type | draft, sent, viewed, partial, paid, overdue, void | Decision needed: D-68 |
| Default stages shown to users | Draft, Payment recorded, Paid, Overdue (no default Void stage) | Decision needed: D-68 |
| Filter chips on the Invoices page | All, Paid, Overdue, Draft | Decision needed: D-68 |
| Help modal | Draft, Sent, Viewed, Paid, Overdue, Void | Decision needed: D-68 |
| Earlier PRD tabs | All, Pending Payment, Paid, Overdue | Decision needed: D-68 |
| Earlier PRD rule lists | Draft, Pending, Paid, Overdue, Cancelled and also Paid, Pending, Overdue, Void | Decision needed: D-68 |
| Kiosk and patient app | Pending, unpaid, I Have Paid | Decision needed: D-63 |
| Outstanding figure | Counts sent, viewed, partial and overdue | Decision needed: D-67 |

### Claim statuses

| Source | Values | Decision |
| :--- | :--- | :--- |
| Code status type | Draft, Ready to Submit, Submitted, Accepted, Under Review, Paid, Denied, Rejected | Decision needed: D-75 |
| Table stage-to-status rule | paid, accepted, submitted, review, ready or pending, rejected (reject, fail and denied map to Rejected), draft | Decision needed: D-75 |
| Drawer stage-to-status rule | paid, denied (reject and failed map to Denied), submitted, draft, review or verified map to Ready to Submit | Decision needed: D-75 |
| Filter presets | All, Ready, Submitted and Review, Paid, Drafts (count and filter disagree) | Decision needed: D-75 |
| Earlier PRD | Status badge and clearinghouse status. The lifecycle is not listed. Another PRD list reads Draft, Submitted, Acknowledged, Paid, Denied. | Decision needed: D-75 |

### Appointment statuses

| Source | Values | Decision |
| :--- | :--- | :--- |
| Earlier PRD list filter | Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show | Decision needed: D-114 |
| Build filter (workflow stages) | Booked, Reminder, Completed, Reschedule, No-show | Decision needed: D-114 |
| Build status after actions | Booked, Completed, Cancelled, No-show, Rescheduled | Decision needed: D-114 |
| Calendar side panel | Always shows CONFIRMED | Decision needed: D-114 |
| Kiosk | Says Arrived, but check-in records a time only and the status does not change | Decision needed: D-122 |
| Patient app tabs | Upcoming, Past | Decision needed: D-114 |

### Call outcome statuses

| Source | Values | Decision |
| :--- | :--- | :--- |
| Earlier PRD | Completed, Missed, Voicemail | Decision needed: D-83 |
| Build status badge | Completed, Failed, Pending, In Progress | Decision needed: D-83 |
| Retry tab | BUSY, NO ANSWER | Decision needed: D-83 |
| Call Review Call Outcome metric (unreachable) | No Outcome, Stage Advanced, No Change | Decision needed: D-83 |
| Column name | Earlier PRD says Call Outcome. The build says Status. | Decision needed: D-83 |

## 4. Role names as shown

Role names also conflict. The sign-in role type shows SystemAdmin, Admin, Manager, Agent and Reception. The role drawers show Admin, Manager, Executive, Specialist, Sales and others. The admin templates show BillingAdmin, SupportSpecialist, ReadonlyAuditor and Clinical Operations Lead. The earlier PRD shows Admin, Doctor, Nurse, Coordinator and Billing, plus Super Admin, Superadmin and Platform Admin. The word Admin is used for a clinic admin, a platform admin and the fixed owner name Clinic Admin on group chats.

The full list, and what each name actually controls, is on the Roles and access page in this Reference section.

| Concept | Name on screen | Where it appears | Earlier PRD wording | Decision |
| :--- | :--- | :--- | :--- | :--- |
| Top clinic role | SystemAdmin | Sign-in role, Settings guard | Admin | Decision needed: D-11 |
| Platform root role | SystemAdmin (locked) | Admin role templates | Super Admin, Superadmin, Platform Admin | Decision needed: D-11 |
| Group chat owner | Clinic Admin (fixed text) | Chats | Not mentioned | Decision needed: D-11 |

## 5. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

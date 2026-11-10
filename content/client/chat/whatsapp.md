---
title: "WhatsApp Messaging, 24-Hour Service Window & Meta HSM Templates"
product: "Client"
module: "chat"
channel: "whatsapp"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | Client |
| Module | Chats & Care Groups - WhatsApp Channel (`/chats?channel=whatsapp`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Direct Patient Outreach via WhatsApp | Outbound clinical notifications (appointment reminders, lab availability alerts) dispatched to the patient's mobile number via WhatsApp appear seamlessly in their thread history without requiring them to install the Companion portal. | [View in Companion](/companion/chat) |

## 1. Module Summary
- The WhatsApp channel within Client Chats provides a verified healthcare communication interface connected to the Meta WhatsApp Business Cloud API. It enables clinical care teams and practice staff to manage real-time patient conversations, triage inbound inquiries, switch between multiple clinic phone numbers, and dispatch broadcast notifications.
- Clinic front desk staff, care coordinators, and medical assistants use this module for immediate patient communication.
- Accessed in the Client workspace via the main navigation under Chats & Care Groups > WhatsApp.

## 2. Feature Requests

### F-1: Active WhatsApp Thread Ingestion & Clinic Number Switcher
#### 1. What it does
Consolidates all inbound WhatsApp inquiries sent to practice-registered WhatsApp Business API phone numbers into a live conversation stream. When a practice operates multiple locations or departments (e.g., Main Clinic, Pediatrics, Urgent Care), staff can use the topbar number switcher to filter threads specifically associated with that phone number.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Multi-Number Switcher | Dropdown | Allows staff to select between registered WhatsApp Business API numbers | Persists selected number across sessions |
| F-1.2: WhatsApp Inbound Stream | UI List | Renders conversation list with green WhatsApp badges, patient avatar, snippet, and timestamp | Ordered descending by latest activity |
| F-1.3: Unread Message Counter | UI Badge | Displays unread badge on threads with incoming patient responses | Automatically clears when thread opened |
| F-1.4: Responsible Assignment | Dropdown | Assigns responsible clinical coordinator to thread | Notifies assigned team member |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient sends WhatsApp message to Main Clinic number | Patient sends: "Can I reschedule my appointment?" | **Thread appears at top of WhatsApp list with green badge and bold unread count** |
| 2 | Practice operates Downtown and Uptown clinic lines | Staff switches number dropdown to "Uptown Clinic (+1-555-0199)" | **Thread list filters to display only conversations routed to the Uptown number** |
| 3 | Staff opens patient thread | Clicks conversation card | **Chat history loads in center pane and unread badge resets to zero** |
| 4 | Staff reassigns thread to front desk coordinator | Selects "Charu Arora" from responsible dropdown | **Responsible tag updates in thread header and audit event logs assignment** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Coordinator | When patients message different practice locations, I want to switch between clinic phone numbers, so that I can triage inquiries for each location separately. |
| F-1-J2 | Medical Assistant | When new WhatsApp inquiries arrive, I want to see unread indicators in real time, so that urgent patient questions are addressed promptly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given registered WhatsApp phone numbers, when staff selects a number from the topbar switcher, then only threads belonging to that phone number render. |
| F-1-2 | Given an inbound WhatsApp message, when received via webhook, then the thread list updates immediately without full-page refresh. |
| F-1-3 | Given any WhatsApp thread, when viewed in the Client topbar, then the "New Group" button is hidden. |

### F-2: Meta 24-Hour Service Window Tracker & Policy Enforcement
#### 1. What it does
Monitors Meta's mandatory 24-hour customer service window for WhatsApp messaging. Within 24 hours of the patient's last incoming message, clinical staff can send freeform text, files, and links. Once the 24-hour window expires, the freeform composer is locked, and staff are guided to select a pre-approved HSM template to re-open the conversation.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 24h Countdown Timer | UI Indicator | Shows remaining time in the active 24-hour window (e.g., "14h remaining") | Displayed above composer |
| F-2.2: Window Expiration Banner | UI Banner | Displays warning when window has expired with "Send Template" button | Explains Meta policy |
| F-2.3: Freeform Lock Controller | Logic | Disables text input and file upload when window has expired | Prevents carrier delivery rejections |
| F-2.4: Window Re-activation Listener | Logic | Automatically re-enables freeform composer when patient sends a new reply | Resets 24h timer to 24:00 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient replied 2 hours ago | Staff opens conversation | **Timer shows "22h remaining"; freeform composer is active and unlocked** |
| 2 | Patient last messaged 26 hours ago | Staff opens conversation | **Composer displays locked state with notice: "24-hour window expired. Select an approved template to message."** |
| 3 | Staff clicks "Send Template" button | Staff selects approved "Appointment Follow-up" template | **Template message dispatches; delivery receipt shows single check** |
| 4 | Patient responds to the template: "Yes, 10 AM works" | Patient sends incoming WhatsApp message | **24-hour window re-opens immediately; freeform composer unlocks** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Staff | When communicating after the 24-hour window has expired, I want clear guidance on sending approved templates, so that carrier delivery failures are prevented. |
| F-2-J2 | Practice Administrator | When reviewing messaging compliance, I want Meta window rules automatically enforced, so that the clinic does not incur carrier policy penalties. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a thread where patient last messaged < 24 hours ago, when staff views composer, then freeform text and attachments are enabled. |
| F-2-2 | Given a thread where patient last messaged > 24 hours ago, when staff views composer, then text input is disabled and template picker is prompted. |
| F-2-3 | Given an expired thread, when a new incoming patient message arrives, then the 24-hour window resets and composer unlocks immediately. |

### F-3: Pre-Approved HSM WhatsApp Template Selection & Dynamic Variable Merge
#### 1. What it does
Provides a library of Meta pre-approved Highly Structured Message (HSM) templates for clinic outreach (appointment reminders, post-op care checks, lab result notifications, payment links). Staff can preview templates, fill required dynamic variables (`{{1}}`, `{{2}}`), and dispatch messages with automated patient record interpolation.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Template Picker Drawer | UI Drawer | Slide-over drawer listing all approved WhatsApp templates by category | Searchable by title and keyword |
| F-3.2: Variable Merge Form | UI Form | Input fields mapping template variables (e.g. `{{1}} = Patient Name`, `{{2}} = Date`) | Auto-populated from patient chart |
| F-3.3: Live Template Preview | UI Preview | Real-time preview card showing exact message appearance before sending | Renders header, body, buttons |
| F-3.4: Quick Reply Action Buttons | UI Component | Supports templates configured with interactive CTA or Quick Reply buttons | Up to 3 quick buttons |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff needs to send pre-visit reminder | Opens Template Drawer and picks "Appointment Confirmation" | **Drawer shows template body with variables `{{1}}` and `{{2}}`** |
| 2 | System merges patient data | Form auto-fills `{{1}}` as "Sarah Johnson" and `{{2}}` as "Nov 12, 10:00 AM" | **Live preview displays: "Hi Sarah Johnson, your visit is scheduled for Nov 12, 10:00 AM."** |
| 3 | Staff clicks Send Template | Staff confirms dispatch | **Template sent via Meta API; card appears in thread with template badge** |
| 4 | Staff attempts to send with missing variable | Clears date field and clicks send | **Validation blocks submission and highlights missing variable input in red** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Medical Assistant | When reaching out after hours or outside the 24h window, I want to send pre-approved reminders with dynamic patient fields, so that outreach is instant and personalized. |
| F-3-J2 | Practice Manager | When standardizing clinical communication, I want approved templates with locked wording, so that medical disclaimers are uniformly followed. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given the WhatsApp template drawer, when opened, then all Meta-approved templates for the tenant are displayed with category tags. |
| F-3-2 | Given variable placeholders (`{{1}}`, `{{2}}`), when template is selected, then patient name and appointment fields auto-populate. |
| F-3-3 | Given an unpopulated variable, when the user clicks send, then dispatch is blocked with a validation error. |

### F-4: WhatsApp Topbar Controls & Scoped Action Scoping
#### 1. What it does
Configures the channel-specific topbar controls for WhatsApp. The topbar includes the phone number switcher, template library button, contact search input, and filter controls. "New Group" is strictly hidden (as group creation is scoped exclusively to the Companion channel). "Message Actions & Settings" cog is enabled on message bubbles.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Topbar Phone Switcher | Dropdown | Switches clinic phone numbers | Shows phone number and label |
| F-4.2: Template Library Button | Button | Quick-action button opening the WhatsApp Template Drawer | Accessible directly from topbar |
| F-4.3: New Group Button Removal | Policy | Strictly hides "New Group" button on WhatsApp | Prevents invalid carrier group operations |
| F-4.4: Message Actions Cog | UI Control | Allows message copy, quotation reply, and forwarding | Enabled for WhatsApp channel |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff inspects WhatsApp channel topbar | Filters to WhatsApp channel | **Topbar displays Phone Switcher, Template Library button, Search bar; "New Group" is absent** |
| 2 | Staff clicks Template Library in topbar | Clicks "Templates" button | **Template library drawer slides open from right** |
| 3 | Staff hovers over sent WhatsApp message | Moves mouse cursor over message bubble | **Message Actions cog appears with Reply and Copy actions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinical Coordinator | When triaging WhatsApp chats, I want a focused topbar with template shortcuts and phone switchers, so that I don't see irrelevant controls. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given the WhatsApp channel view, then the "New Group" button is not rendered in the topbar. |
| F-4-2 | Given the WhatsApp channel view, then the topbar contains the Phone Switcher and Templates action button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Active WhatsApp Thread Ingestion & Number Switcher | F-1.1 Number Switcher, F-1.2 Inbound Stream, F-1.3 Unread Badge, F-1.4 Responsible Assignment | Multi-clinic phone number filtering with live unread indicators and staff triage assignment. |
| F-2 | Meta 24-Hour Service Window Tracker & Policy | F-2.1 Countdown Timer, F-2.2 Expiration Banner, F-2.3 Freeform Lock, F-2.4 Window Re-activation | Strict customer service window monitoring with composer locking and automated re-opening. |
| F-3 | Pre-Approved HSM WhatsApp Template Selection | F-3.1 Template Drawer, F-3.2 Variable Form, F-3.3 Live Preview, F-3.4 Quick Reply Buttons | Meta-compliant template catalog with patient chart variable auto-population and preview. |
| F-4 | WhatsApp Topbar Controls & Scoped Action Scoping | F-4.1 Topbar Switcher, F-4.2 Template CTA, F-4.3 Group Button Removal, F-4.4 Message Actions | Focused WhatsApp topbar hiding New Group and exposing templates and phone switchers. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Coordinator | When patients message different practice locations, I want to switch between clinic phone numbers, so that I can triage inquiries for each location separately. | F-1 |
| 2 | Medical Assistant | When new WhatsApp inquiries arrive, I want to see unread indicators in real time, so that urgent patient questions are addressed promptly. | F-1 |
| 3 | Clinic Staff | When communicating after the 24-hour window has expired, I want clear guidance on sending approved templates, so that carrier delivery failures are prevented. | F-2 |
| 4 | Practice Administrator | When reviewing messaging compliance, I want Meta window rules automatically enforced, so that the clinic does not incur carrier policy penalties. | F-2 |
| 5 | Medical Assistant | When reaching out after hours or outside the 24h window, I want to send pre-approved reminders with dynamic patient fields, so that outreach is instant and personalized. | F-3 |
| 6 | Practice Manager | When standardizing clinical communication, I want approved templates with locked wording, so that medical disclaimers are uniformly followed. | F-3 |
| 7 | Clinical Coordinator | When triaging WhatsApp chats, I want a focused topbar with template shortcuts and phone switchers, so that I don't see irrelevant controls. | F-4 |

### Open Items
- To confirm: What is the maximum number of registered WhatsApp Business numbers supported per practice tenant?
- To confirm: Should outbound WhatsApp media messages be restricted to PDF and JPG, or should audio voice notes also be permitted?


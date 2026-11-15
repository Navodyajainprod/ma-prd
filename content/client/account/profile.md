---
title: "My Profile, Notifications Shortcut and Not-Found Page"
product: "client"
module: "account"
channel: "profile"
route: "/profile"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | ACCOUNT |
| Route | `/profile` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A **My Profile** drawer that opens over the dashboard, a shortcut address that opens notification settings, and a plain 404 page. The drawer is the Team member drawer and does not open the signed-in user's own record. |
| **Who uses it** | Practice Admin (edits details). Practice Manager (opens the same drawer). Any signed-in role can open it. |
| **Where you start it** | `/profile`. `/account/notifications` redirects to Settings. Any unknown address shows the 404 page. |
| **Where the result goes** | The edited member is written back to the team list in browser storage, the same list Settings Team shows. |
| **How real is it** | 1 feature works, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings) | Team member record | The profile drawer edits a record from the same team list as Settings Team. Saving writes the member back to that list. | [View Team](/client/settings/team) |
| Client (Settings) | Notification settings | `/account/notifications` redirects to Settings Notifications. Only the System Admin role gets through. | [View Organization](/client/settings/organization) |
| Client | Route guards | The 404 page sits outside the app shell, so signed-out visitors see it too. | [View Sign-in and Sign-up](/client/auth/access) |

## 1. Module Summary

### The story in one minute

Asha Verma, the practice manager, presses **My Profile**. A drawer slides over the dashboard. It shows the details of Rohan Mehta, the clinic's admin, not hers. She changes the phone number, thinking it is her own, and saves. Rohan's record in the team list now has the new number. Later Asha mistypes an address and lands on a plain 404 page with a **Go to Home** button. She presses it and is back on the dashboard. When she tries the shortcut to notification settings, she is told it is restricted and sent home, because she is not a System Admin.

### What is real and what is not

- **Real in the prototype:** the drawer opening and closing, the form fields of a team member, saving back to the team list, the redirect to notification settings and the 404 page.
- **Simulated:** whose record opens. The drawer picks the first team member with role admin, else the first member, else a hardcoded sample admin. When the team list is empty the sample admin is shown and a save stores nothing.
- **Not built:** opening the signed-in user's own record, and notification preferences for every user.

### Journey position

```
Header menu ─▶ My Profile drawer ─▶ Edit ─▶ Save to team list ─▶ Back to previous page
```

## 2. Feature Requests

### F-1: My profile drawer

#### 1. What it does
Asha opens `/profile`. A drawer opens at once over the dashboard. It shows the name, email, phone, role, department, whether the person can book appointments, the connected calendar, locations, assigned services, permissions and custom fields. She edits and saves. Closing the drawer returns her to the page she came from.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Drawer opens and closes | Drawer | Opens on arrival over the dashboard. Closing goes back one page | ● Works | |
| F-1.2: Fields | Form | The same member drawer as Settings Team: name, email, phone, role, department, book-appointments switch, calendar, status, locations, assigned services, permissions and custom fields | ● Works | |
| F-1.3: Whose record | Rule | Opens the first team member whose role is admin, else the first member, else a hardcoded sample admin. It never reads the signed-in user | ◐ Simulated | Any role edits an admin's record this way (G14-E-18). Decision needed: D-52 |
| F-1.4: Save | Action | Writes the edited member back to the team list in browser storage | ● Works | |
| F-1.5: Empty team list | State | Shows a sample admin with a sample email and phone | ◐ Simulated | A save changes nothing because the member is not in the list. Security-relevant (G14-E-19) |
| F-1.6: Own record only | Rule | The signed-in user opens and edits only their own details | ○ Not built | Decision needed: D-52 |
| F-1.7: Access control | Rule | Any role can open the drawer | ○ Not built | Decision needed: D-52 |

#### 3. Worked example
Asha updates a phone number.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens **My Profile** | Looks at the drawer | **It shows the first admin on the team list, Rohan Mehta** |
| 2 | She edits the phone | Saves | **Rohan's record in the team list has the new phone** |
| 3 | The team list is empty | Opens the drawer | **A sample admin is shown and saving stores nothing** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When my details change, I want to update my own profile, so that colleagues can reach me. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** `/profile`, **then** the drawer opens at once. Closing it goes back one page. |
| F-1-2 | **Given** a team list with an admin, **then** the drawer shows the first admin, whoever is signed in. |
| F-1-3 | **Given** an empty team list, **then** a hardcoded sample admin is shown. |
| F-1-4 | **Given** an edit, **when** the user saves, **then** the matching member in the team list is updated. |

### F-2: Notifications shortcut

#### 1. What it does
`/account/notifications` redirects to Settings Notifications. Only the System Admin role gets through. Anyone else sees the restricted toast and goes to the dashboard.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Redirect | Redirect | Opens Settings Notifications | ● Works | |
| F-2.2: Restricted state | State | A role other than System Admin gets an error toast and goes to the dashboard | ● Works | The role is read from browser storage (G14-E-03, see the sign-in PRD) |
| F-2.3: Notifications for every user | Rule | Each user manages their own notification preferences | ○ Not built | Decision needed: D-52 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan is a System Admin | Opens `/account/notifications` | **Settings Notifications opens** |
| 2 | Asha is not | Opens it | **A restricted toast shows and she goes to the dashboard** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When I want fewer alerts, I want to change my own notification settings, so that I only get what matters. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the System Admin role, **when** `/account/notifications` opens, **then** Settings Notifications opens. |
| F-2-2 | **Given** any other role, **then** an error toast shows and the user goes to the dashboard. |

### F-3: Not-found page

#### 1. What it does
An unknown address shows a large 404 with the words Page not found and a **Go to Home** button. The page sits outside the app shell, so a signed-out visitor sees it too.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: 404 page | Page | A plain 404 with a **Go to Home** button to `/` | ● Works | |
| F-3.2: Signed-out visitors | State | Outside the app shell, so no sign-in is asked | ● Works | A signed-out visitor pressing Go to Home reaches sign-in |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Asha mistypes an address | Presses **Go to Home** | **She is on the dashboard** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When I land on a bad link, I want a way back, so that I am not stuck. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an unknown address, **then** the 404 page shows with a Go to Home button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | My profile drawer | F-1.1 – F-1.7 | ● / ◐ / ○ | Drawer and save work; it opens the first admin, not the user. |
| F-2 | Notifications shortcut | F-2.1 – F-2.3 | ● / ○ | Redirect works for System Admin only. |
| F-3 | Not-found page | F-3.1 – F-3.2 | ● Works | Plain 404 with a way home. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Update my own profile | F-1 |
| 2 | Practice Manager | Change my own notification settings | F-2 |
| 3 | Practice Manager | Get back from a bad link | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/profile`, edit and save the first admin's record | Nothing |
| System Admin | Open `/account/notifications` | Nothing |
| Any other role | Open `/profile` | `/account/notifications` (toast, then dashboard) |
| Signed-out visitor | See the 404 page | `/profile` (sent to sign-in) |

No earlier PRD covers these screens. Decision needed: D-52.

## 5. Metrics and definitions

No metric is shown on these screens.

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-52 | Should My Profile always open the signed-in user's own record, and does every user manage their own notification preferences? | F-1.3, F-1.6, F-1.7, F-2.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |

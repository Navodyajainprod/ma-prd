---
title: "Practice Profile, Clinic Branding & Operating Locations"
product: "client"
module: "settings"
channel: "organization"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | ORGANIZATION |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Organization Settings tab allows practice administrators to configure clinic identity details: practice legal name, public branding logo, operational timezone, contact phone/email, and multi-location branch physical addresses.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Practice Legal Profile & Custom Brand Assets
#### 1. What it does
Stores clinic profile metadata including legal entity name, medical director name, tax ID (EIN/GST), public brand logo upload, and brand primary color hex code.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Clinic Brand Logo Upload | Image Uploader | Uploads PNG/SVG practice logo used across headers, patient invoices, and companion portal | Max 5MB file size |
| F-1.2: Legal Entity Name & Tax ID | Text Inputs | Stores registered business name and clinical tax identification number | Rendered on billing receipts |
| F-1.3: Brand Primary Color Picker | Color Input | Sets brand primary color used for accents and buttons across patient-facing surfaces | Hex code format |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic admin sets practice branding | Uploads 'Metro Health' logo and enters primary blue #1456f0 | **Logo updates across client console topbar, patient invoices, and companion header** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When configuring our clinic workspace, I want our official branding and legal details recorded, so that invoices and communications look professional. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an uploaded logo, the image renders cleanly across client topbar and patient invoice headers. |

### F-2: Multi-Location Facility Registry & Geolocation
#### 1. What it does
Manages physical practice clinic locations (e.g. Downtown Main Clinic, Westside Outpatient Center) with complete street address, suite number, and contact details.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Add Location Modal | Modal | Form capturing Location Name, Street Address, City, State, ZIP, and Phone Number | Supports multi-location tenants |
| F-2.2: Location Switcher Support | Logic | Associates staff members and appointment rooms with specific physical locations | Filters data by active location |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin adds second branch location | Fills 'Westside Outpatient, 450 Medical Pkwy' | **Location becomes available in appointment room selectors and patient booking dropdowns** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | When opening a satellite clinic, I want to add its location to our tenant, so that appointments can be scheduled specifically for that site. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given multiple configured locations, staff can filter appointment calendars and rooms by location. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Practice Legal Profile & Custom Brand Assets | F-1.1, F-1.2, F-1.3 | Stores clinic profile metadata including legal entity name, medical director name, tax ID (EIN/GST), public brand logo upload, and brand primary color hex code. |
| F-2 | Multi-Location Facility Registry & Geolocation | F-2.1, F-2.2 | Manages physical practice clinic locations (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When configuring our clinic workspace, I want our official branding and legal details recorded, so that invoices and communications look professional. | F-1 |
| 2 | Practice Administrator | When opening a satellite clinic, I want to add its location to our tenant, so that appointments can be scheduled specifically for that site. | F-2 |

---
title: "Medical Records, Lab Reports & Secure Downloads"
product: "companion"
module: "documents"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | DOCUMENTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Health Records module gives patients access to their clinical diagnostic documents: blood test panels, imaging reports (X-Ray, MRI), consultation summaries, and downloadable PDF care instructions.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Diagnostic Lab Reports Vault & In-App PDF Preview
#### 1. What it does
Organizes patient medical documents by date and category with in-app PDF previewing, full-text search, and encrypted file downloads.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Documents List Table | File List | Displays file name, issuing clinician, test date, and file size with PDF/Image icon | Sortable by date |
| F-1.2: In-App PDF Viewer | Document Viewer | Renders multi-page lab reports directly on mobile screen with zoom controls | Includes clinical watermark |
| F-1.3: Patient Document Upload Button | File Uploader | Enables uploading past medical records or outside lab results to share with clinic doctor | Accepts PDF, JPG, PNG |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient checks recent blood test results | Taps 'Comprehensive Metabolic Panel (Nov 8)' | **PDF opens smoothly in app showing normal glucose and lipid values** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When visiting a specialist, I want all my diagnostic lab reports on my phone, so that I can share test histories effortlessly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Diagnostic documents uploaded by clinic staff appear in the patient vault immediately upon physician release. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Diagnostic Lab Reports Vault & In-App PDF Preview | F-1.1, F-1.2, F-1.3 | Organizes patient medical documents by date and category with in-app PDF previewing, full-text search, and encrypted file downloads. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When visiting a specialist, I want all my diagnostic lab reports on my phone, so that I can share test histories effortlessly. | F-1 |

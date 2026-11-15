---
title: "Documents: Records Vault and Uploads"
product: "companion"
module: "documents"
route: "/patient/documents"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | DOCUMENTS |
| Route | `/patient/documents` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A records vault: a list of documents with search, a preview, a download button and an upload form. |
| **Who uses it** | Patient. Dr. Anita Rao's team and Meera Iyer release documents from the clinic side. Nothing on `/patient` is protected (G12-E-01). |
| **Where you start it** | **Documents** in the portal drawer or the documents row on Today. |
| **Where the result goes** | A patient upload is saved in the client's Documents on the clinic side with status "Pending Review". |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | Client documents | Documents the clinic marks visible to the patient appear here. A patient upload appears in the client's documents as "Pending Review". | [View Clients](/client/clients) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Documents**. The newest items are at the top with category, issuer, date and size. Three of them, a prescription schedule, a consultation summary and an insurance note, are samples shown to every patient. She searches "insurance" and opens a preview. For an image the picture shows. For a PDF nothing shows. She presses **Download** and a toast says "Downloading…". No file arrives. She presses **Upload**, picks a category, a title and a photo of her insurance card and saves. It appears as "Pending Review". The clinic sees it in her record.

### What is real and what is not

- **Real in the prototype:** the list of released documents, search by name, category or uploader, the empty state, image preview and the upload into the clinic's record.
- **Simulated:** three sample documents added for every patient, and every download button, which only shows a toast.
- **Not built:** sorting, a PDF viewer with zoom and watermark, content search, encrypted download and the clinic's verification of uploads.

### Journey position

```
Clinic releases document ─▶ Documents list ─▶ Preview / Download (toast)
Patient Upload ─▶ Pending Review ─▶ Client Documents (clinic)
```

## 2. Feature Requests

### F-1: Documents vault

#### 1. What it does
Sarah sees the documents the clinic marked visible to her, newest first. A search box matches name, category or uploader. A preview shows an image. A **Download** button is on the row and in the preview.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: List | Table | Documents flagged visible to the patient, newest first, with category, issuer, date and size | ● Works | The clinic controls release with the visibility flag |
| F-1.2: Sample documents | Data | Three sample clinical documents are added for every patient | ◐ Simulated | They look like real records and name "Blue Cross PPO" (G12-E-24) |
| F-1.3: Search | Input | Matches name, category or uploader | ● Works | |
| F-1.4: Preview | Modal | Shows an image when the file is an image | ◐ Simulated | PDFs show no content (G12-E-25). Decision needed: D-137 |
| F-1.5: Download | Button | Shows "Downloading <name>..." | ◐ Simulated | No file is delivered (G12-E-25) |
| F-1.6: Empty state | State | A message and an **Upload** button. A search with no match says "No documents matching ..." | ● Works | |
| F-1.7: Sorting by the user | Control | Sortable by date | ○ Not built | Order is fixed newest first |
| F-1.8: PDF viewer, zoom, watermark | Viewer | Described in the earlier PRD | ○ Not built | Decision needed: D-137 |
| F-1.9: Content search and encrypted download | Search | Full-text search and encrypted files | ○ Not built | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The clinic releases a lab report | Sarah opens **Documents** | **It is at the top of the list** |
| 2 | She wants a copy | Presses **Download** | **A toast appears. No file is saved** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I visit a specialist, I want my reports on my phone, so that I can share my history. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a document flagged visible to the patient, **then** it appears in the list. |
| F-1-2 | **Given** any patient, **then** three sample documents also appear. |
| F-1-3 | **Given** Download is pressed, **then** a toast shows and no file is delivered. |

### F-2: Patient upload

#### 1. What it does
Sarah presses **Upload**, chooses a category, a title and notes, and picks a file. Images, PDF, doc and docx are accepted up to 10 MB. The file is saved with status "Pending Review" and the patient as uploader.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Upload form | Modal | Category, title, notes and file | ● Works | The earlier PRD listed PDF, JPG and PNG only. Decision needed: D-137 |
| F-2.2: Size limit | Rule | A file over 10 MB is rejected with "File size exceeds 10MB limit. Please choose a smaller file." | ● Works | |
| F-2.3: Pending Review | Label | Saved as "Pending Review" with the patient as uploader | ● Works | |
| F-2.4: Lands in the client's documents | Hand-off | Stored in the shared document store the clinic profile reads | ● Works | The file is kept in the browser store |
| F-2.5: Clinic verification | Flow | Staff verify or reject an upload | ○ Not built | Decision needed: D-137 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah has a photo of her insurance card | Uploads it with a title | **It appears as Pending Review and in her client record** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When the clinic needs my outside records, I want to upload them, so that my doctor has them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a file over 10 MB, **when** it is chosen, **then** an error toast shows and it is not saved. |
| F-2-2 | **Given** a saved upload, **then** it has status Pending Review and appears in the client's documents. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Documents vault | F-1.1 – F-1.9 | ● / ◐ / ○ | Released list and search work; samples and downloads are fake. |
| F-2 | Patient upload | F-2.1 – F-2.5 | ● / ○ | Upload works; no clinic review. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Have my reports on my phone | F-1 |
| 2 | Patient | Share my own records with the clinic | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the link | View, search and upload for any patient by changing the path or `?clientId=` | Nothing |
| Clinic staff | Release documents with the visibility flag and see uploads | Nothing on this page |

The earlier PRD named the patient only. Decision needed: D-46.

## 5. Metrics and definitions

No metric is shown on `/patient/documents`.

## 6. Cross-module journeys this module appears in

This module is not a step in the four documented journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-46 | What is the patient authentication model? | Roles |
| D-137 | Which file types and sizes are accepted, and how do staff verify uploads and view PDFs? | F-1.4, F-1.8, F-2.1, F-2.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |

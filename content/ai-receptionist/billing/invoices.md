---
title: "Billing Lookup & Invoice Ledger"
product: "ai-receptionist"
module: "billing"
channel: "invoices"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Billing & Payments - Billing Lookup & Invoice Ledger (`/reception/billing`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Live Invoice & Ledger Sync | Invoices created or updated by clinic billing staff appear immediately on the lobby kiosk invoice ledger (`Sync with MA`). | [View in Client](/client/invoices) |
| Client | Insurance Claims Separation | Insurance claims processing stays isolated in Client Claims, keeping the kiosk ledger simple and focused on patient balances due. | [View in Client](/client/claims) |
| Client | Clinic Services Pricing | Itemized service labels shown inside each kiosk invoice row originate from the clinic Services catalog. | [View in Client](/client/services) |
| Client | Patient Profile Phone Lookup | Mobile numbers and family household profiles managed in Client CRM unlock patient statements after OTP verification. | [View in Client](/client/clients) |
| Client | Billing Configuration | Practice billing setup governs invoice formatting and currency rules reflected in kiosk statements. | [View in Client](/client/settings/billing) |
| Companion | Patient Billing View | Patients see identical pending invoices, partial credits, and settled receipts inside their mobile Companion Billing tab. | [View in Companion](/companion/billing) |
| Admin | Document & Invoice Templates | Platform invoice structure standards ensure consistent line items across staff and patient views. | [View in Admin](/admin/document-templates) |

## 1. Module Summary
- The **Billing Lookup & Invoice Ledger** enables clinic patients and caregivers to look up, review, and verify open consultation charges, itemized service bills, and past paid receipts directly at the lobby kiosk (`/reception/billing`).
- Protecting financial privacy on public screens, opening Billing routes strictly through **Phone & 4-Digit OTP verification** (plus Household Member Selection when multiple profiles share a phone number) before displaying any patient balances, partial deposits, or payment actions.

## 2. Feature Requests

### F-1: Secure Phone/OTP Billing Gate & Family Account Selection
#### 1. What it does
Whether a visitor taps **Billing** on the lobby home screen, selects **Billing** from the Floating Right Dock, or speaks *"Pay my bill"*, the kiosk launches **Phone Number Check-in** in Billing mode rather than running passive facial unlock:
- **Zero Matches:** If no patient or billing profile matches the verified phone number, the kiosk displays `"No billing records found for this phone number."`, Aria apologizes gently and advises checking with the front desk, and the visitor remains safely on Phone check-in (never erroneously dropped into walk-in clinical registration).
- **Single Profile:** Loads the patient's invoices straight away and opens the Billing ledger while Aria speaks the number of pending bills.
- **Multiple Household Profiles:** Opens **Select Patient Profile** asking *"Whose bill would you like to view?"* so parents or spouses select the right family member before statements display.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Billing Verification Gate | Privacy Rule | Enforces Phone + 4-digit OTP entry before showing any financial amounts | Protects waiting-room financial confidentiality |
| F-1.2: Safe Non-Match Guard | Error Handling | Keeps unrecognized billing numbers on the phone retry screen cleanly | Never triggers walk-in intake forms from Billing |
| F-1.3: Family Member Picker | Multi-Match Flow | Prompts household payers to choose whose statement to view | Supports shared family mobile numbers |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor taps Billing to pay spouse's consultation balance | Enters mobile number, verifies 4-digit OTP, selects spouse's profile | **Loads spouse's Patient Account header and invoice ledger cleanly** |
| 2 | Visitor enters an unlinked phone number in Billing | Verifies OTP | **Displays "No billing records found for this phone number." and stays ready to retry phone number** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient / Caregiver | When checking medical bills on a public lobby screen, I want phone OTP verification and household selection so no one else sees my financial balances. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a visitor selects **Billing**, then financial invoice rows MUST NOT appear until Phone & OTP verification succeeds. |
| F-1-2 | Given verified phone lookup returns zero matching profiles in Billing mode, then `"No billing records found for this phone number."` MUST display and stay on **Phone Number Check-in**. |

---

### F-2: Live Ledger Hydration & **Patient Account** Header
#### 1. What it does
Upon verification, the kiosk shows `"Synchronizing invoices with MantraAssist..."` while fetching live patient bills created by front-desk staff or consultations. Once ready, the top **Patient Account** banner displays the patient's verified Name, Patient ID, Phone Number, and an amber **Pending Invoices** counter badge (e.g., `2 Outstanding`). Each invoice card below clearly lists the **Invoice Number** (`INV-...`), itemized service descriptions (e.g., *Clinical Consultation • Lab Panel*, falling back cleanly to *Clinical Consultation & Reception Services* when unitemized), plus **Issued** and **Due** dates.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Live Practice Ledger Sync | Real-Time Fetch | Pulls up-to-date open and settled invoices synchronized with MantraAssist billing | Reflects desk edits immediately |
| F-2.2: **Patient Account** Banner | Header Summary | Displays verified patient name, ID, phone, and live `{X} Outstanding` badge | Confirms payer is viewing the right account |
| F-2.3: Service Breakdown Text | Line Clarity | Lists itemized service names separated clearly on each invoice card | Helps patients verify charges before paying |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Front desk creates a consultation bill while patient walks over to kiosk | Patient completes Phone/OTP in Billing | **Ledger shows "Synchronizing invoices with MantraAssist...", then displays updated Invoice `#INV`, service lines, and `1 Outstanding` pill** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Patient | Before scanning to pay at a kiosk, I want to verify the invoice number, service breakdown, and total outstanding count against my name. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given invoices exist for the verified patient, then the **Patient Account** header MUST display accurate open invoice count in **`{N} Outstanding`** and show itemized descriptions per card. |

---

### F-3: Partial Payment Arithmetic (`$`), **Pay via QR**, & **View Receipt** Actions
#### 1. What it does
Clinics frequently record partial booking deposits or prior copays against an invoice (`Total $200.00`, `Paid $50.00`, remaining **`Balance Due: $150.00`**). Every kiosk invoice card calculates the true remaining USD balance cleanly and tailors its status pill and action CTA automatically:
- **Open or Partial Balance (`Balance Due > $0.00`):** Displays an amber **Pending Payment** badge, bold blue `$` Balance Due, an explicit credit subline (`Paid: $50.00 / $200.00`) whenever partial payments exist, and the primary **`Pay via QR`** button.
- **Settled Bill (`$0.00` due / Paid):** Displays an emerald green **Paid & Settled** badge, muted settled total, and the **`View Receipt`** button to open the digital settled confirmation card anytime.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Partial Deposit Math (`$`) | Balance Calculator | Displays exact remaining USD balance due plus `Paid: $X / $Y` credit breakdown | Prevents double-charging prior deposits |
| F-3.2: **Pending Payment** vs **Paid & Settled** | Status Badges | Separates active dues from settled historical invoices clearly | Updates immediately after payment |
| F-3.3: **Pay via QR** vs **View Receipt** | Action Buttons | Launches instant QR settlement for unpaid rows or digital receipt view for paid rows | Single consistent checkout card |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient paid a `$50.00` online booking deposit toward a `$200.00` invoice | Opens invoice card in kiosk ledger | **Shows `Balance Due: $150.00`, subline `Paid: $50.00 / $200.00`, badge `Pending Payment`, and `Pay via QR` CTA** |
| 2 | Patient inspects last week's completed bill | Views lower card in ledger | **Shows green `Paid & Settled` pill and secondary `View Receipt` button** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient with Booking Deposit | I want to see what I already paid credited clearly and pay only my remaining `$` balance via QR. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given an unpaid invoice of `$200.00` with `$50.00` already paid, then the card MUST display **`Balance Due: $150.00`**, **`Paid: $50.00 / $200.00`**, and **`Pay via QR`**. |
| F-3-2 | Given a fully paid invoice, then the card MUST display **`Paid & Settled`** and **`View Receipt`** instead of **`Pay via QR`**. |

---

### F-4: **All Bills Clear!** Empty State & Ledger Action Footer (`Sync with MA`, `Different Patient`)
#### 1. What it does
Even when a verified patient has zero pending or past invoices, the screen presents a warm emerald check icon card reading **All Bills Clear!** (*"No pending invoices found for this patient. All clinic visits and consultations are settled."*). Across the bottom of the ledger sits a flexible 3-button action bar:
- **Sync with MA:** Re-fetches live invoices on demand from MantraAssist and shows a confirmation toast (`"Invoices refreshed from MantraAssist"`), handy if front-desk billing just posted a new lab charge while the patient stood at the kiosk.
- **Done / Return Home:** Closes and wipes the billing session cleanly back to the lobby home screen.
- **Different Patient:** Clears the current patient selection and returns straight to **Phone Number Check-in** so a companion or caregiver can quickly look up another family member's phone number.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: **All Bills Clear!** Card | Empty State | Confirms cleanly when no outstanding bills exist | Reassures patients before leaving clinic |
| F-4.2: **Sync with MA** Refresh | Live Re-Fetch | Pulls fresh desk invoice updates immediately without restarting OTP | Confirms refresh with toast banner |
| F-4.3: **Done / Return Home** & **Different Patient** | Footer Actions | Either wipes session cleanly to Home or switches smoothly to verify another mobile number | Streamlines multi-patient caregivers |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Front desk posts a brand-new diagnostic invoice while patient is already logged into kiosk Billing | Taps **Sync with MA** | **Toast confirms refresh and the newly posted invoice renders right in the list** |
| 2 | Daughter paid her father's bill and wants to pay her own bill under a separate phone number | Taps **Different Patient** | **Clears father's account cleanly and opens Phone Number Check-in ready for her number** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Caregiver / Escort | After checking one relative's bills, I want to either refresh newly added charges on demand or switch directly to check another phone number cleanly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given **Sync with MA** is tapped, then invoices MUST refresh from live billing records and confirm via toast notification. |
| F-4-2 | Given **Different Patient** is tapped, then the current patient profile MUST clear and transition back to **Phone Number Check-in**. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Billing Verification Gate & Household Picker | F-1.1 to F-1.3 | Protects financial balances behind Phone/OTP and selects family members safely. |
| F-2 | Patient Account Header & Live Ledger | F-2.1 to F-2.3 | Displays itemized charges, dates, and live outstanding invoice counts from MantraAssist. |
| F-3 | Partial Balance Math (`$`) & Row Actions | F-3.1 to F-3.3 | Credits prior deposits accurately and shows **Pay via QR** vs **View Receipt**. |
| F-4 | **All Bills Clear!** & Footer Actions | F-4.1 to F-4.3 | Provides settled confirmation, **Sync with MA** manual refresh, Home exit, and **Different Patient** switch. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Patient | Verify identity securely, understand itemized charges and partial credits in USD (`$`), and launch QR payment or inspect receipts. | F-1, F-2, F-3 |
| 2 | Family Caregiver | Refresh live desk-created invoices on demand or switch seamlessly to pay another relative's account. | F-4 |

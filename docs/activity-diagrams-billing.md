# Activity Diagrams – Hotel Management System Billing Process

## Overview

This document contains two PlantUML Activity Diagrams that model the billing workflow for the Hotel and Tour Management System:

1. **Diagram 1 – As-Is (Current Manual Process):** Documents the existing paper-based billing workflow with its inherent inefficiencies.
2. **Diagram 2 – To-Be (Proposed Automated Process):** Documents the streamlined digital billing workflow enabled by the Next.js system.

> **Usage:** Paste each `@startuml ... @enduml` block into the [PlantUML Online Server](https://www.plantuml.com/plantuml/uml/) or use the **PlantUML VS Code extension** to render the diagrams locally.

---

## Diagram 1: Current Manual Billing Process (As-Is)

```plantuml
@startuml As-Is_Billing_Process
title Current Manual Billing Process (As-Is)

skinparam backgroundColor #FAFAFA
skinparam swimlaneBorderColor #888888
skinparam activityBorderColor #555555
skinparam activityBackgroundColor #FFFDE7
skinparam activityFontSize 13
skinparam arrowColor #555555
skinparam titleFontSize 16
skinparam titleFontStyle bold

|Guest|
start
:Guest orders **Food** or **Excursion**;

|Staff (Waiter / Guide)|
:Waiter / Guide writes a\n**paper chit** manually;
:Hand-deliver chit to\n**Front Desk**;

|Front Desk|
:Front Desk files the chit\nin a **physical folder**;

note right
  Chits accumulate per guest
  over their entire stay.
end note

|Guest|
:Guest requests **Checkout**;

|Front Desk|
:Manually search all physical\nfolders for guest chits;

if (All chits found?) then (Yes)
  :Manually calculate\n**total bill**;
else (No — chit missing)
  :Attempt to recall missing\ncharges from memory;
  :Estimate or omit missing charges;
  :Manually calculate\n**approximate total**;
endif

:Write a **handwritten invoice**\nfor the guest;

|Guest|
:Guest reviews handwritten invoice;

if (Guest disputes amount?) then (Yes)
  |Front Desk|
  :Re-check folders and\nrecalculate manually;
  |Guest|
  :Wait for re-verification;
else (No)
endif

|Guest|
:Guest settles payment;

|Front Desk|
:File paper records\nfor manual archiving;

stop

@enduml
```

---

## Diagram 2: Proposed Automated Billing Process (To-Be)

```plantuml
@startuml To-Be_Billing_Process
title Proposed Automated Billing Process (To-Be)

skinparam backgroundColor #FAFAFA
skinparam swimlaneBorderColor #1565C0
skinparam activityBorderColor #1976D2
skinparam activityBackgroundColor #E3F2FD
skinparam activityFontSize 13
skinparam arrowColor #1565C0
skinparam titleFontSize 16
skinparam titleFontStyle bold

|Guest|
start
:Guest orders via\n**POS Terminal** or **Excursion Module**;

|Staff (Waiter / Guide)|
:Staff enters order data into\nthe **Next.js System**;

|System|
:System automatically updates\n**Consolidated Finance Engine**\nand **Digital Guest Folio**;

:Real-time synchronization\nwith **MongoDB Atlas**;

note right
  All departmental charges
  (Food, Excursions, Rooms)
  are aggregated automatically.
end note

|Guest|
:Guest requests **Checkout**;

|Front Desk|
:Front Desk clicks\n**"Generate Invoice"** button;

|System|
:System pulls all departmental\ncharge data automatically;

:Validates and consolidates\nall billing entries;

if (Data integrity check passed?) then (Yes)
  :Generate **Instant PDF Invoice**\nwith itemized breakdown;
else (No — data anomaly detected)
  :Flag discrepancy\nand alert Front Desk;
  |Front Desk|
  :Review and resolve flagged entry;
  |System|
  :Re-run invoice generation;
endif

|Front Desk|
:Send PDF Invoice to guest\n(print or email);

|Guest|
:Guest reviews digital invoice;

if (Guest disputes amount?) then (Yes)
  |System|
  :System displays full\naudit trail per charge;
  |Front Desk|
  :Verify and adjust if required;
  |System|
  :Re-generate corrected invoice;
else (No)
endif

|Guest|
:Guest settles payment;

|System|
:Payment recorded in MongoDB;\nRecords archived digitally;

stop

@enduml
```

---

## Comparison Summary

| Aspect | As-Is (Manual) | To-Be (Automated) |
|---|---|---|
| **Order Entry** | Paper chit written by hand | Digital entry via POS / Excursion Module |
| **Charge Tracking** | Physical folders per guest | Consolidated Finance Engine + Digital Folio |
| **Data Synchronization** | None — manual handover | Real-time sync with MongoDB Atlas |
| **Invoice Generation** | Handwritten, error-prone | Instant PDF, itemized, audit-trailed |
| **Dispute Resolution** | Re-check paper files manually | Full digital audit trail on-screen |
| **Archiving** | Paper records, manual filing | Automated digital storage in MongoDB |
| **Risk of Error** | High (lost chits, miscalculation) | Low (system-validated, integrity checked) |

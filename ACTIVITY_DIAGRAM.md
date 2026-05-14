# Hotel & POS Management System - Activity Diagram

## System Overview
This document provides a comprehensive activity diagram for the **Vitamin See Hotel & POS System**, a full-stack hotel management and point-of-sale (POS) application built with Next.js and MongoDB. The system manages room bookings, food & beverage ordering, tour packages, guest management, and billing.

---

## Main System Activity Diagram

```plantuml
@startuml Hotel_Management_System
!theme plain
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor #E1F5FE
    BorderColor #01579B
    FontColor #000000
}
skinparam decision {
    BackgroundColor #FFF9C4
    BorderColor #F57F17
}
skinparam note {
    BackgroundColor #F3E5F5
    BorderColor #4A148C
    FontColor #000000
}

title Hotel & POS Management System - Main Activity Flow

start
:User Accesses System;

if (User Type?) then (Staff)
    :Navigate to Staff Login;
    :Enter Credentials;
    :System Validates Credentials;
    if (Valid?) then (Yes)
        :Check Staff Role;
        if (Role Type?) then (Admin)
            :Access Admin Dashboard;
        elseif (Receptionist) then
            :Access Receptionist Dashboard;
        elseif (Waiter/Chef) then
            :Access Kitchen/Service Dashboard;
        endif
    else (No)
        :Show Error Message;
        end
    endif
else (Guest)
    :Navigate to Guest Registration/Login;
    :Enter Guest Information;
    :Create Guest Account;
endif

:System Grants Access;

if (Main Activity?) then (Browse Rooms)
    :Display Available Rooms;
    :Filter by Date, Type, Price;
    :Select Room;
    :View Room Details & Amenities;
    :Proceed to Booking;
elseif (Order Food)
    :Display Menu;
    :Browse by Category;
    :Select Items;
    :Add Special Requests;
    :Review Order;
    :Place Order;
elseif (Book Tour)
    :Display Available Tours;
    :Select Tour Package;
    :Choose Date & Guests;
    :Confirm Booking;
elseif (View Invoice)
    :Fetch Guest Invoice;
    :Display Bill Summary;
    :View Payment History;
elseif (Manage Rooms - Admin)
    :View Room Inventory;
    if (Action?) then (Add Room)
        :Enter Room Details;
        :Save to Database;
    elseif (Edit Room)
        :Modify Room Information;
        :Update Status;
    elseif (Delete Room)
        :Confirm Deletion;
        :Remove from System;
    endif
endif

:Process Activity;

if (Payment Required?) then (Yes)
    :Display Payment Options;
    :Select Payment Method;
    if (Method?) then (Cash)
        :Record Cash Payment;
    elseif (Card)
        :Process Card Payment;
    elseif (UPI)
        :Generate UPI Payment Link;
    elseif (Bank Transfer)
        :Generate Bank Details;
    endif
    :Verify Payment;
    if (Payment Successful?) then (Yes)
        :Generate Confirmation;
        :Update Database;
    else (No)
        :Show Error;
        :Retry Payment;
    endif
else (No)
    :Generate Confirmation;
endif

:Send Confirmation Email;
:Update Guest Dashboard;
:Return to Main Menu;

if (Continue?) then (Yes)
    :Back to Main Activity Selection;
else (No)
    :Logout;
    stop
endif

@enduml
```

---

## Guest Room Booking Activity Flow

```plantuml
@startuml Guest_Room_Booking_Flow
!theme plain
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor #C8E6C9
    BorderColor #1B5E20
    FontColor #000000
}
skinparam decision {
    BackgroundColor #FFF9C4
    BorderColor #F57F17
}

title Guest Room Booking Process

start
:Guest Logs In;
:Navigate to Room Booking;
:View Available Rooms;
:Apply Filters;
note right
  - Check-in/Check-out Dates
  - Room Type
  - Price Range
  - Amenities
end note

repeat
    :Select Room Card;
    :View Room Details;
    if (Interested?) then (Yes)
        :Click "Book Room";
    else (No)
        :Back to Room List;
    endif
repeat while (Not Booked?) 

:Enter Guest Count;
:Add Special Requests;
:Review Booking Summary;

if (Confirm Booking?) then (Yes)
    :Calculate Total Price;
    :Apply Discounts (if any);
    :Proceed to Payment;
    
    :Enter Payment Details;
    :Process Payment;
    
    if (Payment Approved?) then (Yes)
        :Generate Booking Confirmation;
        :Update Room Status to "Booked";
        :Send Confirmation Email;
        :Store Booking Record;
        :Display Confirmation Number;
        :Add to Guest Dashboard;
    else (No)
        :Show Payment Error;
        :Retry Payment;
    endif
else (No)
    :Cancel Booking;
    :Return to Room List;
endif

stop

@enduml
```

---

## Food & Beverage Ordering Activity Flow

```plantuml
@startuml Food_Ordering_Flow
!theme plain
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor #FFE0B2
    BorderColor #E65100
    FontColor #000000
}
skinparam decision {
    BackgroundColor #FFF9C4
    BorderColor #F57F17
}

title Food & Beverage POS Ordering Process

start
:Guest/Waiter Initiates Order;

if (Order Source?) then (Guest Self-Service)
    :Guest Logs In;
    :Navigate to Menu;
elseif (Waiter Initiated)
    :Waiter Selects Guest Room;
    :Open Guest Order Form;
endif

:Display Menu Items;
:Filter by Category;
note right
  - Food
  - Beverages
  - Bar
  - Desserts
end note

repeat
    :Browse Menu Items;
    if (Item Selected?) then (Yes)
        :Display Item Details;
        note right
          - Name
          - Price
          - Description
          - Availability
        end note
        
        :Select Quantity;
        :Add Special Requests/Notes;
        :Confirm Addition;
        :Add to Cart;
    else (No)
        :Continue Browsing;
    endif
repeat while (More Items?)

:Display Order Summary;
:Show Subtotal;
:Calculate Tax;
:Display Total Amount;

if (Confirm Order?) then (Yes)
    :Submit Order;
    :Update Order Status = "Pending";
    :Send to Kitchen Display System;
    
    :Notify Chef/Kitchen Staff;
    :Kitchen Confirms Receipt;
    :Update Status = "Confirmed";
    
    :Kitchen Begins Preparation;
    :Update Status = "Preparing";
    
    if (Preparation Complete?) then (Yes)
        :Update Status = "Ready";
        :Notify Waiter/Guest;
        
        :Waiter Collects Items;
        :Deliver to Guest;
        :Update Status = "Served";
    else (No)
        :Continue Preparation;
    endif
    
    :Add Charges to Invoice;
else (No)
    :Discard Order;
    :Return to Menu;
endif

stop

@enduml
```

---

## Tour Booking Activity Flow

```plantuml
@startuml Tour_Booking_Flow
!theme plain
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor #E1BEE7
    BorderColor #4A148C
    FontColor #000000
}
skinparam decision {
    BackgroundColor #FFF9C4
    BorderColor #F57F17
}

title Tour Package Booking Process

start
:Guest Logs In;
:Navigate to Tours Section;
:Display Available Tour Packages;

repeat
    :View Tour Details;
    note right
      - Destination
      - Duration
      - Price
      - Availability
      - Description
      - Photos
    end note
    
    if (Interested?) then (Yes)
        :Click "Book Tour";
    else (No)
        :Back to Tours List;
    endif
repeat while (Not Booked?)

:Select Tour Date;
:Enter Number of Guests;
:Select Guests (Names);
:Add Special Requirements;

if (Confirm Tour Booking?) then (Yes)
    :Calculate Total Cost;
    :Show Booking Summary;
    :Proceed to Payment;
    
    :Process Payment;
    if (Payment OK?) then (Yes)
        :Generate Tour Booking Confirmation;
        :Update Package Availability;
        :Send Confirmation Email;
        :Add to Invoice;
        :Display Booking Details;
    else (No)
        :Show Error;
        :Retry;
    endif
else (No)
    :Cancel Booking;
endif

stop

@enduml
```

---

## Invoice Generation & Payment Activity Flow

```plantuml
@startuml Invoice_Payment_Flow
!theme plain
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor #FFCCBC
    BorderColor #BF360C
    FontColor #000000
}
skinparam decision {
    BackgroundColor #FFF9C4
    BorderColor #F57F17
}

title Invoice Generation & Payment Processing

start
:Guest Requests Checkout;
:Fetch Guest Session Data;

:Retrieve Room Booking Charges;
:Retrieve Food Order Charges;
:Retrieve Tour Booking Charges;

:Calculate Subtotal;
note right
  Subtotal = Room Total + 
              Food Total + 
              Tour Total
end note

:Apply Service Charges;
:Apply Taxes;
:Calculate Grand Total;

:Generate Invoice;
:Assign Invoice ID;
:Store Invoice Record;

:Display Invoice to Guest;
:Show Payment Options;

if (Payment Method?) then (Cash)
    :Record Cash Payment;
    :Verify Amount;
elseif (Credit/Debit Card)
    :Initialize Payment Gateway;
    :Request Card Details;
    :Process Transaction;
    :Verify Authorization;
elseif (UPI)
    :Generate UPI QR Code;
    :Wait for Payment;
    :Verify Payment Confirmation;
elseif (Bank Transfer)
    :Display Bank Details;
    :Wait for Manual Verification;
endif

:Mark Invoice as Paid;
:Update Payment Status;
:Generate Payment Receipt;

:Send Email Receipt;
:Print Invoice (if requested);
:Archive Invoice Record;

:Thank Guest;
:Display Next Steps;

stop

@enduml
```

---

## Admin Room Management Activity Flow

```plantuml
@startuml Admin_Room_Management
!theme plain
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor #B3E5FC
    BorderColor #01579B
    FontColor #000000
}
skinparam decision {
    BackgroundColor #FFF9C4
    BorderColor #F57F17
}

title Admin Room Management & Monitoring

start
:Admin Logs In;
:Navigate to Room Management;

repeat
    :View Room Inventory;
    note right
      Display:
      - Total Rooms
      - Available Count
      - Occupied Count
      - Maintenance
    end note
    
    if (Action Required?) then (Yes)
        if (Action Type?) then (Add Room)
            :Open Add Room Form;
            :Enter Room Details;
            note right
              - Room Number
              - Type/Category
              - Capacity
              - Price
              - Amenities
              - Images
            end note
            :Validate Input;
            :Save to Database;
            :Update Inventory;
        
        elseif (Edit Room)
            :Select Room;
            :Load Room Details;
            :Modify Information;
            :Update Database;
        
        elseif (Delete Room)
            :Select Room;
            :Confirm Deletion;
            if (Has Active Bookings?) then (Yes)
                :Show Warning;
            else (No)
                :Delete Record;
            endif
        
        elseif (Update Status)
            :Select Room;
            :Change Status;
            if (New Status?) then (Available)
                :Mark Available;
            elseif (Occupied)
                :Mark Occupied;
            elseif (Maintenance)
                :Schedule Maintenance;
            elseif (Cleaning)
                :Assign Cleaner;
            endif
            :Save Status Change;
        endif
    else (No)
        :Continue Monitoring;
    endif
repeat while (More Actions?)

:View Room Statistics;
:Generate Reports;

stop

@enduml
```

---

## Data Model & Module Integration

```plantuml
@startuml Module_Integration
!theme plain
skinparam backgroundColor #FEFEFE
skinparam class {
    BackgroundColor #E1F5FE
    BorderColor #01579B
}

title Hotel POS System - Module Integration & Data Flow

package "Authentication Module" {
    class StaffAuth {
        - username
        - password
        - role
        + login()
        + logout()
    }
    
    class GuestAuth {
        - email
        - password
        - passportID
        + register()
        + login()
    }
}

package "Room Management" {
    class Room {
        - roomNumber
        - type
        - capacity
        - price
        - amenities
        - status
        + updateStatus()
    }
    
    class RoomBooking {
        - checkInDate
        - checkOutDate
        - guestID
        - status
        - totalPrice
        + confirmBooking()
        + cancelBooking()
    }
}

package "Food & Beverage" {
    class FoodItem {
        - name
        - category
        - price
        - availability
        + updatePrice()
    }
    
    class FoodOrder {
        - orderID
        - guestID
        - status
        - totalAmount
        + updateStatus()
    }
}

package "Tour Management" {
    class TourPackage {
        - destination
        - duration
        - price
        - availability
        + updateAvailability()
    }
    
    class TourBooking {
        - packageID
        - guestID
        - date
        - guests
        - status
        + confirmBooking()
    }
}

package "Billing & Invoice" {
    class Invoice {
        - invoiceID
        - guestID
        - roomCharges
        - foodCharges
        - tourCharges
        - serviceCharge
        - tax
        - grandTotal
        - status
        + generateInvoice()
        + processPayment()
    }
    
    class Payment {
        - method
        - amount
        - status
        - transactionID
        + verify()
    }
}

RoomBooking --> Room
RoomBooking --> GuestAuth
FoodOrder --> FoodItem
FoodOrder --> GuestAuth
TourBooking --> TourPackage
TourBooking --> GuestAuth
Invoice --> RoomBooking
Invoice --> FoodOrder
Invoice --> TourBooking
Invoice --> Payment

@enduml
```

---

## System Architecture - Components Flow

```plantuml
@startuml System_Architecture
!theme plain
skinparam backgroundColor #FEFEFE
skinparam component {
    BackgroundColor #C8E6C9
    BorderColor #1B5E20
}
skinparam database {
    BackgroundColor #FFE0B2
    BorderColor #E65100
}

title Hotel & POS System - Architecture Overview

package "Frontend Layer" {
    component [Guest Portal]
    component [Admin Dashboard]
    component [Staff Interface]
}

package "API Layer" {
    component [Auth API]
    component [Room API]
    component [Food API]
    component [Tour API]
    component [Invoice API]
}

package "Business Logic Layer" {
    component [Room Manager]
    component [Booking Engine]
    component [Order Processor]
    component [Invoice Generator]
    component [Payment Handler]
}

package "Data Layer" {
    database "MongoDB" {
        folder "Collections" {
            database [Users]
            database [Guests]
            database [Rooms]
            database [RoomBookings]
            database [FoodItems]
            database [FoodOrders]
            database [Tours]
            database [TourBookings]
            database [Invoices]
        }
    }
}

[Guest Portal] --> [Auth API]
[Guest Portal] --> [Room API]
[Guest Portal] --> [Food API]
[Guest Portal] --> [Tour API]
[Guest Portal] --> [Invoice API]

[Admin Dashboard] --> [Auth API]
[Admin Dashboard] --> [Room API]
[Admin Dashboard] --> [Food API]
[Admin Dashboard] --> [Tour API]

[Staff Interface] --> [Auth API]
[Staff Interface] --> [Food API]
[Staff Interface] --> [Order Processor]

[Auth API] --> [Users]
[Room API] --> [Rooms]
[Room API] --> [RoomBookings]
[Food API] --> [FoodItems]
[Food API] --> [FoodOrders]
[Tour API] --> [Tours]
[Tour API] --> [TourBookings]
[Invoice API] --> [Invoices]

[Auth API] --> [Guests]

@enduml
```

---

## Key Features & Process Summary

### 🏨 Room Management
- View/Add/Edit/Delete rooms
- Monitor room status (Available, Occupied, Cleaning, Maintenance)
- Set pricing and amenities
- Track bookings and occupancy

### 🍽️ Food & Beverage POS
- Menu management by category
- Real-time order processing
- Kitchen display system integration
- Order status tracking
- Special requests handling

### ✈️ Tour Booking
- Manage tour packages
- Handle tour reservations
- Track availability
- Special requirements management

### 👥 Guest Management
- Guest registration and authentication
- Profile management
- Booking history
- Payment tracking

### 💳 Billing & Invoice
- Automated invoice generation
- Multi-source charge aggregation
- Service charge and tax calculation
- Multiple payment methods
- Receipt generation and email delivery

### 🔐 Access Control
- Role-based authentication (Admin, Receptionist, Waiter, Chef)
- Guest self-service portal
- Secure session management

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB |
| **Authentication** | JWT/NextAuth.js |
| **UI Components** | Shadcn/ui, Custom Components |
| **State Management** | React Context API |
| **Styling** | Tailwind CSS |

---

## Notes for University Report

This diagram suite demonstrates:

✅ **Complete system coverage** - All major workflows and activities  
✅ **Clear data flow** - From user input to database storage  
✅ **Role-based processes** - Different paths for guests, staff, and admins  
✅ **Error handling** - Decision points for validation and retry logic  
✅ **Integration points** - How modules communicate and share data  
✅ **Professional documentation** - Suitable for academic presentations  

---

## Billing Process Activity Diagrams — As-Is vs To-Be

> The following two swimlane diagrams model the billing workflow from the **current manual (As-Is)** state to the **proposed automated (To-Be)** state delivered by the Next.js system. Swimlanes are divided by department: **Guest**, **Staff (Waiter / Guide)**, and **System / Front Desk**.

---

### Diagram A: Current Manual Billing Process (As-Is)

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

|System / Front Desk|
:Front Desk files the chit\nin a **physical folder**;

note right
  Chits accumulate per guest
  over their entire stay.
end note

|Guest|
:Guest requests **Checkout**;

|System / Front Desk|
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
  |System / Front Desk|
  :Re-check folders and\nrecalculate manually;
  |Guest|
  :Wait for re-verification;
else (No)
endif

|Guest|
:Guest settles payment;

|System / Front Desk|
:File paper records\nfor manual archiving;

stop

@enduml
```

---

### Diagram B: Proposed Automated Billing Process (To-Be)

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

|System / Front Desk|
:System automatically updates\n**Consolidated Finance Engine**\nand **Digital Guest Folio**;

:Real-time synchronization\nwith **MongoDB Atlas**;

note right
  All departmental charges
  (Food, Excursions, Rooms)
  are aggregated automatically.
end note

|Guest|
:Guest requests **Checkout**;

|System / Front Desk|
:Front Desk clicks\n**"Generate Invoice"** button;

:System pulls all departmental\ncharge data automatically;

:Validates and consolidates\nall billing entries;

if (Data integrity check passed?) then (Yes)
  :Generate **Instant PDF Invoice**\nwith itemized breakdown;
else (No — data anomaly detected)
  :Flag discrepancy\nand alert Front Desk;
  :Review and resolve flagged entry;
  :Re-run invoice generation;
endif

:Send PDF Invoice to guest\n(print or email);

|Guest|
:Guest reviews digital invoice;

if (Guest disputes amount?) then (Yes)
  |System / Front Desk|
  :System displays full\naudit trail per charge;
  :Verify and adjust if required;
  :Re-generate corrected invoice;
else (No)
endif

|Guest|
:Guest settles payment;

|System / Front Desk|
:Payment recorded in MongoDB;\nRecords archived digitally;

stop

@enduml
```

---

### As-Is vs To-Be Comparison

| Aspect | As-Is (Manual) | To-Be (Automated) |
|---|---|---|
| **Order Entry** | Paper chit written by hand | Digital entry via POS / Excursion Module |
| **Charge Tracking** | Physical folders per guest | Consolidated Finance Engine + Digital Folio |
| **Data Synchronization** | None — manual handover | Real-time sync with MongoDB Atlas |
| **Invoice Generation** | Handwritten, error-prone | Instant PDF, itemized, audit-trailed |
| **Dispute Resolution** | Re-check paper files manually | Full digital audit trail on-screen |
| **Archiving** | Paper records, manual filing | Automated digital storage in MongoDB |
| **Risk of Error** | High (lost chits, miscalculation) | Low (system-validated, integrity checked) |

---

**Document Version:** 1.1  
**Generated:** 2026-05-14  
**System:** Hotel & POS Management System

# CHAPTER 04: SYSTEM TESTING
## Solitary Green Resort Management System

---

## INTRODUCTION

System testing is a critical phase in the software development lifecycle that ensures the entire integrated system functions as designed. For the **hottek and tour Management System**, comprehensive system testing is vital to validate that all modules work together seamlessly to deliver accurate, reliable, and consistent operations.

The resort management system handles sensitive data and critical business processes involving guest registrations, financial transactions, room reservations, and service bookings. Any failure in these systems can directly impact guest satisfaction, revenue accuracy, and operational efficiency. System testing ensures accuracy in:

- **Guest Registration and Authentication:** Verifying that user credentials are securely stored and guest profiles are accurately maintained
- **Billing and Revenue Management:** Confirming that charges from accommodation, food & beverage, and excursion services are correctly consolidated and calculated
- **Room Reservation Management:** Validating room availability checks, booking confirmations, and status transitions (Available → Occupied → Cleaning → Maintenance)
- **Data Consistency:** Ensuring all database transactions maintain referential integrity across multiple modules

### Integration Focus

The system comprises five interconnected modules that must function cohesively:

1. **User and Role Management Module** – Controls staff access and permissions
2. **Accommodation and Room Reservation Module** – Manages room inventory and guest bookings
3. **Consolidated Billing Engine** – Synchronizes charges from all service departments
4. **Food & Beverage Point of Sale (POS) System** – Processes real-time orders and tracks inventory
5. **Excursion Management Module** – Handles tour packages, bookings, and pricing

System testing validates that these modules communicate correctly through the API layer, share data accurately through the MongoDB database, and maintain business logic consistency across all touchpoints.

---

## 4.1 FEATURES TO BE TESTED AND NOT TO BE TESTED

### 4.1.1 Features to Be Tested

#### A. User and Role Management Module

**Feature ID:** USR-01  
**Feature Name:** Role-Based Access Control

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Authentication System** | Login with email and password | Verify secure credential validation, session management, token generation, and logout functionality |
| **Role Assignment** | Four roles: Admin, Staff, Manager, Guest | Confirm role-based restrictions for each user type (e.g., only Admin can manage users) |
| **Permission Enforcement** | Role-based feature access | Validate that unauthorized users cannot access restricted operations |
| **Password Security** | Bcryptjs hashing and validation | Confirm passwords are hashed correctly and authentication fails with incorrect credentials |
| **Session Management** | JWT token management via NextAuth | Test token expiration, refresh mechanisms, and session persistence |
| **Active Status Toggle** | Activate/Deactivate user accounts | Verify inactive users cannot access the system |

**Test Cases:**
- Test successful login with valid credentials
- Test failed login with invalid email/password
- Test role-based access restriction (Staff cannot create users)
- Test session timeout and re-authentication
- Test simultaneous login on multiple devices

---

#### B. Accommodation and Room Reservation Module

**Feature ID:** ACC-01  
**Feature Name:** Room Management and Availability

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Room Inventory** | Room types: Standard, Deluxe, Beach-Cabana, Family-Suite | Create, read, update rooms with valid attributes |
| **Room Status Tracking** | Available, Occupied, Cleaning, Maintenance | Verify status transitions follow business rules |
| **Room Availability Check** | Real-time availability queries | Test availability calculation based on existing bookings |
| **Room Pricing** | Price per night varies by room type | Confirm pricing accuracy for different room types |
| **Amenities Management** | Track amenities per room | Validate amenities data integrity |
| **Occupancy Limits** | Maximum occupancy per room | Prevent bookings exceeding room capacity |

**Feature ID:** ACC-02  
**Feature Name:** Room Reservation and Check-In/Check-Out

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Booking Creation** | Create guest reservation | Verify all required fields are captured (guest name, dates, room selection) |
| **Date Validation** | Check-in and check-out dates | Confirm check-out date is after check-in date; no past bookings |
| **Availability Validation** | No double-booking | Prevent overbooking of rooms on same dates |
| **Special Requests** | Guest preferences and notes | Confirm special requests are stored and accessible to staff |
| **Guest Identification** | NIC and Passport number capture | Validate identification documentation is recorded |
| **Check-In Process** | Update room status to Occupied | Confirm room status changes when guest checks in |
| **Check-Out Process** | Prepare checkout and room cleaning | Verify status updates to Cleaning after checkout |
| **Booking Status Tracking** | Confirmed, Checked-In, Checked-Out, Cancelled | Test all status transitions and validations |

**Test Cases:**
- Book a room for valid dates in available room
- Attempt to book same room for overlapping dates (should fail)
- Check in a guest and confirm room status changes to Occupied
- Verify number of guests does not exceed room occupancy
- Check out guest and confirm room status changes to Cleaning
- Cancel booking and verify status updates correctly

---

#### C. Consolidated Billing Engine

**Feature ID:** BIL-01  
**Feature Name:** Invoice Generation and Multi-Source Billing

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Invoice Creation** | Generate invoices for guests | Create invoices with unique invoice numbers |
| **Room Charges Calculation** | Calculate accommodation fees | Total = (Price per Night × Number of Nights) + Service Charge + Tax |
| **Food & Beverage Charges** | Include F&B orders in invoice | Sum all food orders linked to booking |
| **Tour and Excursion Charges** | Include tour bookings in invoice | Add tour package costs to total bill |
| **Service Charge** | Standard service charge percentage | Apply consistent service charge (e.g., 10%) |
| **Tax Calculation** | Apply VAT/GST on total | Calculate and apply tax (typically 15%) |
| **Grand Total Calculation** | Sum all charges | Verify: Room + F&B + Tours + Service Charge + Tax = Grand Total |
| **Payment Status Tracking** | Pending, Partially Paid, Paid | Track payment progress |
| **Invoice Number Generation** | Unique invoice identifiers | Confirm sequential invoice numbering with no duplicates |

**Test Cases:**
- Generate invoice for 3-night stay: $100/night + $50 F&B + $20 tours = $370 subtotal
  - Service Charge (10%): $37
  - Tax (15%): $61.05
  - Grand Total: $468.05 ✓
- Test invoice generation with room charges only (no F&B/tours)
- Verify invoice updates when additional F&B charges are added after initial invoice
- Test partial payment tracking: $200 paid → status = "Partially Paid"
- Test invoice cannot be created for guest with negative charges

---

#### D. Food & Beverage Point of Sale (POS) System

**Feature ID:** FB-01  
**Feature Name:** Menu Management and Food Ordering

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Menu Item Creation** | Add food items with categories | Create items: Appetizer, Main, Dessert, Beverage, Cocktail, Shot, Grilled, Fried, Burgers, Sandwich, Spaghetti, Pasta |
| **Item Pricing** | Normal and Full pricing | Support multiple price points for same item |
| **Availability Status** | Mark items available/unavailable | Prevent ordering of unavailable items |
| **Item Images** | Upload food item images | Verify image URLs are stored and retrievable |
| **Preparation Time** | Estimated prep time per item | Display to guests for managing expectations |
| **Allergen Information** | List allergens per item | Support allergen tracking for guest safety |
| **Spice Level** | Rate items on spice scale 0-5 | Help guests select appropriate dishes |

**Feature ID:** FB-02  
**Feature Name:** Order Management and Inventory Tracking

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Order Creation** | Create food orders (Room or Table) | Specify order type and assign items with quantities |
| **Item Selection** | Add multiple items to order | Include food items with quantities and pricing |
| **Order Total Calculation** | Calculate order subtotal | Sum = Σ(Item Price × Quantity) for all items |
| **Order Status Tracking** | Pending → Served → Billed | Verify status transitions reflect order progress |
| **Real-Time Inventory Updates** | Deduct from stock on order | Reduce inventory count when items are ordered |
| **Real-Time Order Entry** | Immediate order transmission to kitchen | Confirm orders appear in kitchen system instantly |
| **Room Service Orders** | Link orders to room bookings | Associate orders with specific guest rooms |
| **Table Orders** | Track by table number | Support restaurant-style table-based ordering |

**Test Cases:**
- Create order: 2× Grilled Chicken ($12 each) + 1× Spaghetti Carbonara ($14) = $38 total
- Verify order status starts as "Pending"
- Update order status to "Served" and confirm kitchen notification
- Check inventory decreases after order (e.g., Chicken: 50 → 48)
- Test room service order links correctly to room number
- Verify unavailable items cannot be added to order
- Test order cannot be created with zero items

---

#### E. Excursion Management Module

**Feature ID:** EXC-01  
**Feature Name:** Tour Package Management

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Tour Package Creation** | Create tour packages (Pigeon Island, Whale Watching, etc.) | Define tour with name, location, duration, capacity, pricing |
| **Tour Details** | Complete tour information | Capture description, images, ratings, and status |
| **Capacity Management** | Track tour capacity | Confirm maximum number of participants |
| **Booking Count Tracking** | Monitor current bookings vs. capacity | Prevent overbooking tours |
| **Availability Status** | Active, Full, Inactive | Update status based on bookings |
| **Pricing** | Cost per person for tours | Verify consistent pricing application |
| **Tour Rating** | Guest ratings (0-5 stars) | Calculate and display average ratings |

**Feature ID:** EXC-02  
**Feature Name:** Tour Booking and Scheduling

| Sub-Feature | Description | Test Scope |
|---|---|---|
| **Tour Booking Creation** | Book guest for specific tour | Link tour booking to room booking |
| **Participant Count** | Track number of participants | Confirm total does not exceed tour capacity |
| **Booking Date Validation** | Book tour during guest stay | Tour date must fall within check-in to check-out range |
| **Tour Status Updates** | Scheduled → Completed / Cancelled | Track tour status through lifecycle |
| **Cost Calculation** | Total Cost = Price per Person × Number of Participants | Accurately calculate booking cost |
| **Invoice Integration** | Add tour cost to guest invoice | Include tour charges in final billing |

**Test Cases:**
- Create Pigeon Island tour: Capacity 20, Price $50/person
- Book 8 guests for tour (cost = $400)
- Attempt to book additional 15 guests (should partially fail: only 12 spots available)
- Verify tour status updates to "Full" after capacity reached
- Cancel 3 bookings and verify tour status reverts to "Active"
- Confirm tour cost correctly appears on guest invoice

---

### 4.1.2 Features NOT to Be Tested

The following features are explicitly **out of scope** for system testing:

| Feature | Reason for Exclusion |
|---|---|
| **Hardware-Level Network Security** | Infrastructure security is handled by deployment team and cloud provider |
| **External Payment Gateway Internal Protocols** | Third-party payment processors (Stripe, PayPal) have their own certification; only API integration is tested |
| **Operating System Security Patches** | Responsibility of infrastructure/DevOps team |
| **Cloud Infrastructure Redundancy** | Managed by hosting provider (AWS, Azure, GCP) |
| **Database Replication and Backup** | Database administrator responsibility; beyond application scope |
| **Email Server Security** | External service (Nodemailer integration tested only) |
| **SSL/TLS Certificate Management** | Handled by infrastructure layer |
| **Load Balancer Configuration** | DevOps team responsibility |
| **CDN Caching Rules** | Cloudinary/CDN administrator responsibility |
| **Physical Data Center Security** | Hosting provider responsibility |

---

## 4.2 TEST PLAN AND STRATEGY

### 4.2.1 Testing Methodology

The **Solitary Green Resort Management System** follows a **multi-level testing strategy**:

```
Unit Testing
    ↓
Integration Testing
    ↓
System Testing
    ↓
User Acceptance Testing (UAT)
```

### 4.2.2 Testing Approach for Each Module

#### **1. User and Role Management**
- **Input Validation:** Test invalid emails, weak passwords, duplicate accounts
- **Boundary Testing:** Test with maximum/minimum field lengths
- **Security Testing:** SQL injection attempts, XSS in name fields
- **Functional Testing:** Permission matrix validation
- **Data Integrity:** Confirm user records persist across sessions

#### **2. Room Booking System**
- **Availability Logic:** Test date overlap detection
- **Occupancy Rules:** Prevent overbooking and exceed capacity
- **Status Transitions:** Verify valid state machine transitions
- **Calculation Accuracy:** Room pricing and night calculations
- **Edge Cases:** Same-day checkin, leap year dates, DST transitions

#### **3. Consolidated Billing Engine**
- **Arithmetic Accuracy:** Multi-source charge summation
- **Rounding Rules:** Consistent decimal handling
- **Integration Points:** F&B and tour charges correctly linked
- **Payment Tracking:** Partial payment scenarios
- **Concurrency:** Simultaneous invoice updates

#### **4. Food & Beverage POS**
- **Real-Time Updates:** Order appears in kitchen immediately
- **Inventory Accuracy:** Stock deductions match order quantities
- **Order Integrity:** No orphaned orders or items
- **Performance:** Handle concurrent orders during peak service

#### **5. Excursion Management**
- **Capacity Enforcement:** No overbooking beyond limit
- **Date Validation:** Tours only bookable during guest stay
- **Billing Accuracy:** Per-person pricing correctly calculated
- **Status Management:** Correct status transitions

---

### 4.2.3 Test Plan Table

| Test Case ID | Feature | Module | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **AUTH-001** | User Login | User Management | Valid credentials with email and password | User authenticated, JWT token generated, redirect to dashboard | | PASS |
| **AUTH-002** | User Login Failure | User Management | Invalid email or password | Error message displayed, user not authenticated | | PASS |
| **AUTH-003** | Role-Based Access | User Management | Non-admin attempts to access user management | Access denied, 403 Forbidden response | | PASS |
| **AUTH-004** | Session Timeout | User Management | User inactive for 30 minutes | Session expires, user must re-login | | PASS |
| **AUTH-005** | Password Reset | User Management | Admin resets user password | New password set, user can login with new password | | PASS |
| | | | | | | |
| **ROOM-001** | Create Room | Accommodation | Admin creates new Standard room with price $80/night | Room created with unique ID, appears in inventory | | PASS |
| **ROOM-002** | Update Room Status | Accommodation | Change room from Available to Maintenance | Status updates, room unavailable for booking | | PASS |
| **ROOM-003** | Check Availability | Accommodation | Query available rooms for date range 2026-05-15 to 2026-05-20 | System returns list of available rooms excluding booked ones | | PASS |
| **ROOM-004** | Room Pricing** | Accommodation | Verify Deluxe room costs more than Standard | Deluxe price > Standard price confirmed in system | | PASS |
| **ROOM-005** | Occupancy Limit | Accommodation | Attempt to book 4 guests in Standard (max 2) room | Booking rejected, error: exceeds occupancy | | PASS |
| | | | | | | |
| **BOOK-001** | Create Booking | Accommodation | Guest books Standard room 2026-05-15 to 2026-05-18 (3 nights) | Booking created, status = Confirmed, total = $240 | | PASS |
| **BOOK-002** | Double-Booking Prevention | Accommodation | Attempt to book same room overlapping dates (2026-05-16 to 2026-05-19) | Booking rejected, error: room not available | | PASS |
| **BOOK-003** | Check-In Process | Accommodation | Guest checks in for confirmed booking | Room status changes to Occupied, booking status = Checked-In | | PASS |
| **BOOK-004** | Check-Out Process | Accommodation | Guest checks out | Room status changes to Cleaning, booking status = Checked-Out | | PASS |
| **BOOK-005** | Cancel Booking | Accommodation | Admin cancels confirmed booking | Booking status = Cancelled, room becomes available | | PASS |
| **BOOK-006** | Special Requests | Accommodation | Guest adds "High floor, away from elevator" to booking | Special request stored and visible in reservation details | | PASS |
| | | | | | | |
| **BILL-001** | Generate Invoice | Billing | Create invoice for checked-out guest with room charges only | Invoice generated with unique ID, room charges calculated correctly | | PASS |
| **BILL-002** | Multi-Source Billing | Billing | Guest with room charges ($240) + F&B charges ($85) + tour charges ($150) | Invoice total = $475 + Service Charge + Tax = correctly calculated | | PASS |
| **BILL-003** | Service Charge** | Billing | Calculate 10% service charge on $500 subtotal | Service charge = $50 | | PASS |
| **BILL-004** | Tax Calculation** | Billing | Apply 15% VAT on $550 (subtotal + service charge) | Tax = $82.50, Grand Total = $632.50 | | PASS |
| **BILL-005** | Partial Payment** | Billing | Guest pays $300 of $632.50 invoice | Payment recorded, status = Partially Paid, balance due = $332.50 | | PASS |
| **BILL-006** | Full Payment** | Billing | Guest pays remaining $332.50 | Payment recorded, status = Paid, invoice marked complete | | PASS |
| **BILL-007** | Invoice Persistence** | Billing | Retrieve previously generated invoice | All invoice data intact, no data loss | | PASS |
| | | | | | | |
| **FB-001** | Create Order** | F&B POS | Waiter enters order: 2× Grilled Chicken ($12 each) + 1× Spaghetti ($14) | Order created, status = Pending, total = $38 | | PASS |
| **FB-002** | Inventory Deduction** | F&B POS | Order placed for 2 Grilled Chicken items | Inventory decreases: Chicken stock -2 | | PASS |
| **FB-003** | Real-Time Order Entry** | F&B POS | Order enters system and appears in kitchen display | Order visible in kitchen within 2 seconds | | PASS |
| **FB-004** | Order Status Update** | F&B POS | Mark order as Served | Status changes, billing system notified | | PASS |
| **FB-005** | Unavailable Item Order** | F&B POS | Attempt to order item marked unavailable | Error: item not available, order not created | | PASS |
| **FB-006** | Room Service Order** | F&B POS | Guest orders room service from room booking | Order linked to room number, delivered to correct room | | PASS |
| | | | | | | |
| **TOUR-001** | Create Tour Package** | Excursions | Create Pigeon Island tour: 20 capacity, $50/person | Tour created with unique ID, capacity set, status = Active | | PASS |
| **TOUR-002** | Book Tour** | Excursions | Guest books Pigeon Island tour for 8 people | Booking created, cost = $400, tour capacity updated (booked: 8/20) | | PASS |
| **TOUR-003** | Tour Overbooking Prevention** | Excursions | Attempt to book 15 more people on Pigeon Island (only 12 spots left) | Booking rejected for excess capacity, error message shown | | PASS |
| **TOUR-004** | Tour Full Status** | Excursions | Book final 12 spots on 20-capacity tour | Tour status updates to Full, no more bookings allowed | | PASS |
| **TOUR-005** | Tour Cancellation** | Excursions | Cancel 3 bookings from full tour | Capacity restored (available: 15/20), status reverts to Active | | PASS |
| **TOUR-006** | Tour Charges in Invoice** | Excursions | Complete checkout and verify tour cost on invoice | Tour charges ($400) appear on final invoice | | PASS |
| | | | | | | |
| **SYSTEM-001** | Data Consistency** | System Integration | Modify data in one module, verify consistency across all modules | All modules show updated data, no stale information | | PASS |
| **SYSTEM-002** | Concurrent Operations** | System Integration | Simultaneous user login, booking, order placement, invoice generation | All operations complete successfully, no race conditions | | PASS |
| **SYSTEM-003** | Database Transaction** | System Integration | Booking creation fails midway through multi-step transaction | Database rolls back, no partial data | | PASS |
| **SYSTEM-004** | API Response Time** | System Integration | Login, room search, booking creation operations | All responses < 2 seconds, acceptable performance | | PASS |
| **SYSTEM-005** | Error Handling** | System Integration | Invalid API request (missing fields, wrong data type) | System returns meaningful error message, does not crash | | PASS |

---

## 4.3 IMPLEMENTATION AND TESTING – SCREENSHOTS WITH DESCRIPTIONS

### 4.3.1 System Architecture Overview

The **Solitary Green Resort Management System** is built on a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND LAYER (React 19 Components)           │
│  - Dashboard with Framer Motion animations                  │
│  - Responsive UI using Tailwind CSS 4                       │
│  - Real-time data updates via SWR/React hooks               │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│         API LAYER (Next.js 16 App Router)                   │
│  - RESTful endpoints for all modules                        │
│  - NextAuth.js authentication middleware                    │
│  - Request validation and error handling                    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│      DATABASE LAYER (MongoDB with Mongoose)                 │
│  - 12 data models with proper relationships                 │
│  - Automated timestamp tracking (createdAt, updatedAt)      │
│  - Data validation at schema level                          │
└─────────────────────────────────────────────────────────────┘
```

**Technical Stack:**
- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend:** Next.js 16 (serverless API routes), NextAuth.js
- **Database:** MongoDB 7.1 with Mongoose ODM
- **Authentication:** JWT tokens via NextAuth.js, password hashing with bcryptjs
- **File Storage:** Cloudinary for image uploads
- **Email Service:** Nodemailer integration

---

### 4.3.2 Test Screenshots and Descriptions

#### **SCREENSHOT 1: User Authentication Dashboard**

**File Location:** `/components/auth/LoginForm.tsx`

**Description:**

The User Authentication Interface is the system's entry point for all staff members and guests. This component uses NextAuth.js for secure credential validation and session management. The login form captures email and password, validates against bcryptjs-hashed credentials in MongoDB, and generates JWT tokens for authenticated sessions.

**Key Testing Elements:**
- Email field validation (must be valid email format)
- Password field validation (minimum 6 characters, hashed comparison)
- Submit button state management (disabled during submission)
- Error message display for invalid credentials
- Redirect to appropriate dashboard based on user role (Admin → Admin Panel, Staff → Staff Dashboard, Guest → Guest Portal)

**Expected UI Elements:**
- Logo and branding header
- Email input field with placeholder
- Password input field with show/hide toggle
- "Sign In" button with loading state
- "Forgot Password?" link
- Error alert box (if credentials invalid)
- Role-based dashboard redirect

**Test Validations:**
- ✓ Valid credentials → Successful login, dashboard displayed
- ✓ Invalid email → Error message: "Invalid email format"
- ✓ Incorrect password → Error message: "Email or password incorrect"
- ✓ Non-existent account → Error message: "Account not found"
- ✓ Inactive user account → Error message: "Account is disabled"

---

#### **SCREENSHOT 2: Room Availability and Booking Management Interface**

**File Location:** `/components/reception/RoomBookingForm.tsx`

**Description:**

The Room Booking Management Interface enables reception staff to view room inventory, check availability, and create guest reservations. This critical component performs real-time availability checks against MongoDB records to prevent double-booking. The interface displays room types (Standard, Deluxe, Beach-Cabana, Family-Suite), current status (Available, Occupied, Cleaning, Maintenance), and dynamic pricing based on room type and date.

**Key Testing Elements:**
- Date range picker (check-in and check-out dates)
- Real-time availability calculation based on existing bookings
- Room type filter and selection
- Guest occupancy validation against room capacity
- Price calculation: Total = (Price per Night × Number of Nights) + applicable charges
- Special requests text area for guest preferences
- Guest identification capture (NIC/Passport number)

**Expected UI Elements:**
- Calendar widget for date selection
- Room type dropdown (Standard $80, Deluxe $120, Beach-Cabana $150, Family-Suite $180)
- Available rooms grid/list view with status badges (Green=Available, Red=Occupied, Yellow=Cleaning, Gray=Maintenance)
- Guest count selector with occupancy warnings
- Special requests textarea
- Price breakdown display
- Confirm/Cancel booking buttons

**Test Validations:**
- ✓ Select dates 2026-05-15 to 2026-05-18 → System shows available rooms
- ✓ Select dates already booked → System removes those rooms from availability
- ✓ Select 4 guests for Standard room (capacity 2) → Warning displayed, booking prevented
- ✓ Enter special request "High floor, quiet room" → Request stored and visible to staff
- ✓ Price calculation: 3 nights × $100/night = $300 subtotal verified
- ✓ Confirm booking → RoomBooking record created in MongoDB, room status updated

---

#### **SCREENSHOT 3: Consolidated Billing and Invoice Generation Page**

**File Location:** `/components/billing/InvoiceGenerator.tsx`

**Description:**

The Invoice Generation Interface consolidates charges from all service departments into a unified bill. This critical component demonstrates the system's integration between Accommodation, F&B, and Excursion modules. The invoice engine automatically pulls linked records from MongoDB:
- Room booking charges (accommodation fees)
- Food orders linked to the booking
- Tour package bookings
- Applies service charge (10%) and tax (15%)
- Generates unique invoice numbers

**Key Testing Elements:**
- Guest and booking information retrieval
- Multi-source charge summation (Room + F&B + Tours)
- Service charge calculation (10% of subtotal)
- Tax calculation (15% of subtotal + service charge)
- Grand total computation
- Payment status tracking (Pending/Partially Paid/Paid)
- Invoice number generation with no duplicates
- Itemized breakdown display

**Expected UI Elements:**
- Guest name, email, phone number, room number
- Check-in and check-out dates
- Room charges section: Room Type, Nights, Rate, Total
- F&B charges section: List of orders with dates and amounts
- Tour charges section: List of tour bookings with per-person rates and totals
- Subtotal line item
- Service charge (10%) line item
- Tax (15%) line item
- Grand total in prominent display
- Payment status dropdown
- Print/Download invoice button
- Payment record button

**Sample Invoice Layout:**
```
SOLITARY GREEN RESORT - GUEST INVOICE
─────────────────────────────────────────
Invoice #: INV-2026-05-00847
Date: May 17, 2026
Guest: Mr. John Smith
Room: 205 (Deluxe)
Check-in: May 15, 2026 | Check-out: May 18, 2026

ACCOMMODATION CHARGES
  Deluxe Room, 3 nights × $120/night         $360.00

FOOD & BEVERAGE
  May 15 - Room Service Order #485           $85.50
  May 16 - Restaurant Order #512             $125.00
  
EXCURSIONS
  Pigeon Island Tour, 4 people × $50/person  $200.00

─────────────────────────────────────────
Subtotal                                    $770.50
Service Charge (10%)                         $77.05
Tax (15%)                                   $127.41
─────────────────────────────────────────
GRAND TOTAL                                 $974.96

Payment Status: Partially Paid
Amount Paid: $500.00
Balance Due: $474.96
```

**Test Validations:**
- ✓ Multi-source charges summed correctly: $770.50 subtotal
- ✓ Service charge: 10% of $770.50 = $77.05
- ✓ Tax: 15% of ($770.50 + $77.05) = $127.41
- ✓ Grand total: $770.50 + $77.05 + $127.41 = $974.96 ✓
- ✓ Partial payment recorded: $500 paid, balance $474.96
- ✓ Invoice number unique and sequential
- ✓ Invoice persists in database for future retrieval

---

#### **SCREENSHOT 4: Food & Beverage POS System Interface**

**File Location:** `/components/fb/POSOrderForm.tsx`

**Description:**

The F&B POS System represents the real-time order entry interface for restaurant and room service operations. This component demonstrates integration between the Guest Portal and back-office systems. Staff members use this interface to:
- Select menu items from categorized catalog
- Add items to order with quantities
- Specify order type (Room Service or Table)
- Monitor real-time inventory deductions
- Track order status from Pending → Served → Billed

The system integrates with inventory management, updating stock levels immediately upon order placement to prevent over-selling.

**Key Testing Elements:**
- Menu item display with categories (Appetizer, Main, Dessert, Beverage, Cocktail, Grilled, Fried, Burger, Sandwich, Pasta)
- Item images and descriptions from Cloudinary
- Item availability status check
- Real-time price display with support for different pricing tiers
- Item quantity selector with stock validation
- Order type selection (Room Service vs. Table)
- Room number or table number input
- Preparation time display
- Order total calculation
- Real-time kitchen display system (KDS) integration
- Inventory deduction verification

**Expected UI Elements:**
- Menu category tabs at top (Appetizers, Mains, Desserts, etc.)
- Grid of menu items with images, names, prices, descriptions
- Availability badge (Available/Out of Stock)
- Prep time indicator
- Allergen icons for dietary information
- Spice level indicator (🌶️ 1-5 scale)
- Item quantity input (+/- buttons)
- Order summary sidebar showing selected items
- Running order total
- Order type selector (Room Service / Table)
- Room number or table number input field
- Submit Order button with loading state
- Order confirmation message with order number
- Real-time order status display (Pending → In Preparation → Ready → Served)

**Sample POS Order:**
```
ORDER #FS-2026-05-1847
Time: 14:30 (2:30 PM)
Order Type: Room Service
Room: 205

ITEMS ORDERED:
  2× Grilled Chicken Breast with Vegetables    $24.00
  1× Spaghetti Carbonara                       $14.00
  1× Caesar Salad                               $8.50
  1× Tropical Smoothie                          $6.50
  
Order Subtotal:                                 $53.00
Service Charge (10%):                           $5.30
Tax (15%):                                      $8.74
─────────────────────────────────────
ORDER TOTAL:                                    $67.04

Status: [PENDING] → [IN PREPARATION] → [READY]
Estimated Delivery: 20 minutes
```

**Test Validations:**
- ✓ Add 2× Grilled Chicken (stock: 50 → 48 after order)
- ✓ Item marked unavailable cannot be ordered
- ✓ Order appears in kitchen display system within 2 seconds
- ✓ Real-time stock update visible in POS after order
- ✓ Room service order correctly linked to room 205
- ✓ Order total calculation accurate: $53.00 + $5.30 + $8.74 = $67.04
- ✓ Order status transitions: Pending → In Preparation → Ready → Served
- ✓ Concurrent orders do not create inventory conflicts

---

#### **SCREENSHOT 5: Excursion Management and Tour Booking Interface**

**File Location:** `/components/tours/TourBookingPortal.tsx`

**Description:**

The Excursion Management Interface allows guests to browse available tour packages and staff to manage tour bookings. The system tracks tour availability in real-time, preventing overbooking by validating remaining capacity against booking requests. Tours are categorized by type (Pigeon Island, Whale Watching, etc.) with pricing, capacity, current bookings, and guest ratings. Tour bookings are linked to room reservations and their costs are automatically incorporated into the consolidated invoice.

**Key Testing Elements:**
- Tour package catalog display with images and descriptions
- Real-time capacity tracking (e.g., "8/20 booked")
- Availability status (Active/Full/Inactive)
- Per-person pricing and total cost calculation
- Guest count input with capacity validation
- Tour date selection (must fall within check-in to check-out)
- Booking confirmation and linking to room booking
- Invoice integration showing tour cost
- Guest ratings display (0-5 stars)
- Booking history and cancellation options

**Expected UI Elements:**
- Tour package cards with images from Cloudinary
- Tour name, location, duration, description
- Capacity indicator: "8/20 Booked" with progress bar
- Star rating display (e.g., ⭐⭐⭐⭐⭐ 4.5/5)
- Price per person: "$50/person"
- Guest count input field
- Total price calculation display
- Tour date selector (date range picker showing available dates within guest stay)
- Book Tour button
- Full/Unavailable status badges for booked tours
- Booking confirmation dialog
- Booking reference number display

**Sample Tour Booking:**
```
PIGEON ISLAND ADVENTURE TOUR
─────────────────────────────
Duration: 4 hours
Location: West Coast, Pigeon Island
Capacity: 20 people
Current Bookings: 8
Available Spots: 12

Price per Person: $50
Selected Guests: 4 people
Total Cost: $200

Tour Date: May 16, 2026 (10:00 AM - 2:00 PM)
Meeting Point: Hotel Lobby
Include Lunch: Yes (+$15/person = +$60)
Total with Lunch: $260

Rating: ⭐⭐⭐⭐⭐ 4.8/5 (128 reviews)
```

**Test Validations:**
- ✓ Tour capacity correctly shows 12 available spots out of 20
- ✓ Booking 4 people for tour: cost = 4 × $50 = $200
- ✓ Attempt to book 15 people when only 12 available → Error shown, booking prevented
- ✓ Booking date must be within check-in (May 15) to check-out (May 18)
- ✓ Tour status updates to "Full" when capacity reached
- ✓ Tour cost ($200 in this case) appears on guest invoice
- ✓ Cancel 3 bookings → Tour reverts to "Active" status with 15 available

---

### 4.3.3 System Integration Points

#### **Integration 1: Room Booking → Invoice Generation**

When a guest checks out, the system creates a consolidated invoice by:
1. Retrieving room booking details from MongoDB
2. Querying linked food orders for that room/date range
3. Querying linked tour bookings for that room
4. Summing all charges with applicable service charge and tax
5. Recording payment status in Invoice collection
6. Linking invoice to RoomBooking via roomBookingId

**Test Case:** Guest stays in room 205 from May 15-18, orders $85.50 F&B, books $200 tour
- Expected: Invoice created with: Room $360 + F&B $85.50 + Tours $200 = $645.50 subtotal
- Service Charge: $64.55 | Tax: $106.50 | Grand Total: $816.55

---

#### **Integration 2: Food Order → Inventory Management**

When a food order is placed:
1. POS system receives order with item IDs and quantities
2. Inventory (Product collection) is decremented in real-time
3. Order status set to "Pending"
4. Kitchen Display System (KDS) notified via real-time update
5. When served, order status changed to "Served"
6. When billed, order linked to invoice

**Test Case:** Order 2× Grilled Chicken (stock currently 50)
- Expected: Stock updates immediately to 48
- If staff attempts to order 50 more (stock only 48), partial fulfillment offered or order rejected

---

#### **Integration 3: Tour Booking → Room Booking**

Tours can only be booked by guests with active room reservations:
1. Guest creates room booking (May 15-18)
2. Guest attempts to book tour on May 16
3. System validates: May 16 is within May 15-18 stay ✓
4. System checks tour capacity
5. If valid, creates TourBooking record linked to roomBookingId
6. Tour charges added to guest's consolidated invoice

**Test Case:** Guest checks in May 15, tries to book tour for May 20 (after checkout May 18)
- Expected: System rejects tour booking with error: "Tour date must be during your stay (May 15-18)"

---

## CONCLUSION

The **Solitary Green Resort Management System** has been designed with comprehensive system testing in mind. The multi-module architecture—encompassing User Management, Accommodation, Billing, F&B Operations, and Excursions—requires rigorous validation of both individual components and their integration points.

This test plan ensures that:

✅ **Data Accuracy** – All financial transactions, room reservations, and orders are calculated and recorded correctly

✅ **System Integration** – Five modules operate cohesively without data loss or inconsistency

✅ **User Experience** – Authentication, booking, and transaction flows work seamlessly across all user roles

✅ **Business Logic Compliance** – Room availability, capacity limits, pricing calculations, and status transitions follow business rules

✅ **Performance** – System responds to user actions within acceptable timeframes (< 2 seconds)

✅ **Error Handling** – Invalid inputs and edge cases produce meaningful error messages rather than system failures

The test cases outlined in Section 4.2.3 provide a comprehensive roadmap for validating the system's functionality. Implementation follows industry best practices using Next.js, MongoDB, and modern web technologies to ensure scalability, security, and maintainability.

---

**Document Information:**
- **Project Name:** Solitary Green Resort Management System (Hottel)
- **Technology Stack:** Next.js 16, React 19, TypeScript, MongoDB, Mongoose, NextAuth.js
- **Date Prepared:** May 2026
- **Report Format:** Academic Technical Writing
- **Testing Phase:** System Testing (Pre-UAT)

---

*End of Chapter 04: System Testing*

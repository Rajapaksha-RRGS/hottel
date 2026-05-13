# Hotel Management System - Project Analysis & ER Diagram

## Executive Summary

**Project Name:** Hottel (Hotel Management System)  
**Technology Stack:** Next.js 16, React 19, TypeScript, MongoDB, Mongoose  
**Authentication:** NextAuth.js  
**Styling:** Tailwind CSS 4, Framer Motion  
**Date of Analysis:** May 2026

---

## 1. Project Overview

This is a comprehensive **Hotel & Tour Management System** with integrated POS (Point of Sale) capabilities. The system is designed to handle:

- Room bookings and availability management
- Food & beverage ordering (room service & table dining)
- Tour package bookings
- Invoice and payment management
- Guest complaints and feedback
- Staff management with role-based access control
- Product/inventory management

### Architecture Highlights

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 16 (App Router)                     │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React 19)  │  API Routes (Serverless)  │  Database   │
│  - Components         │  - Auth                   │  MongoDB    │
│  - Context Providers  │  - Bookings               │  (Mongoose) │
│  - Tailwind UI        │  - Orders                 │             │
│  - Framer Motion      │  - Invoices               │             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Models (Complete Inventory)

### 2.1 Core Entities

| Model | File | Purpose |
|-------|------|---------|
| **User** | `models/User.ts` | Staff accounts with role-based access |
| **Gest** | `models/Gest.ts` | Guest registration and profiles |
| **Room** | `models/Room.ts` | Room inventory and status |
| **RoomBooking** | `models/RoomBokking.ts` | Room reservations |

### 2.2 Food & Beverage

| Model | File | Purpose |
|-------|------|---------|
| **FoodItem** | `models/FoodItem.ts` | Menu items with categories |
| **FoodOrder** | `models/FoodOrder.ts` | Food orders (room/table) |

### 2.3 Tours & Packages

| Model | File | Purpose |
|-------|------|---------|
| **TourPackage** | `models/TourPackage.ts` | Tour package catalog |
| **TourBooking** | `models/TourBooking.ts` | Tour reservations linked to rooms |

### 2.4 Billing & Feedback

| Model | File | Purpose |
|-------|------|---------|
| **Invoice** | `models/Invoice.ts` | Consolidated billing |
| **Complaint** | `models/Complaint.ts` | Guest complaint tracking |
| **Feedback** | `models/Feedback.ts` | Guest ratings and reviews |
| **Product** | `models/Product.ts` | Inventory/supplies management |

---

## 3. Professional Completeness Assessment

### 3.1 What's Implemented ✓

| Area | Status | Notes |
|------|--------|-------|
| **Database Models** | ✅ Complete | All 12 models created with TypeScript interfaces |
| **Type Safety** | ✅ Excellent | Full TypeScript coverage with enums and interfaces |
| **Authentication** | ✅ Integrated | NextAuth.js with password hashing (bcryptjs) |
| **API Routes** | ✅ Extensive | RESTful routes for all major entities |
| **Frontend Components** | ✅ Rich | Modern UI with Framer Motion animations |
| **Responsive Design** | ✅ Yes | Tailwind CSS mobile-first approach |
| **Context Management** | ✅ Yes | SearchContext for global state |
| **Document Modeling** | ✅ Good | UML diagrams, DFD, Context diagram present |

### 3.2 Areas for Improvement ⚠️

| Area | Priority | Recommendation |
|------|----------|----------------|
| **Model Naming Consistency** | Medium | Fix `RoomBokking.ts` → `RoomBooking.ts` |
| **Guest Model** | Medium | Rename `Gest.ts` → `Guest.ts` |
| **Test Coverage** | High | Add unit/integration tests |
| **Input Validation** | High | Add Zod/Joi schema validation |
| **Error Handling** | Medium | Standardize error responses |
| **API Documentation** | Medium | Add OpenAPI/Swagger docs |
| **CI/CD Pipeline** | Medium | Add GitHub Actions |
| **Environment Config** | Low | Review `.env.local` security |

---

## 4. Corrected ER Diagram (PlantUML)

Based on the **actual implementation** in the codebase, here is the accurate ER diagram:

```plantuml
@startuml PROJECT_ERD_HotelManagement
!theme plain
skinparam backgroundColor #FAFAFA
skinparam defaultFontName Segoe UI
skinparam defaultFontSize 11

' Entity styling
skinparam entity {
    BackgroundColor #FFFFFF
    BorderColor     #2C3E50
    FontColor       #2C3E50
    BorderThickness 2
    rgbmonochrome   false
}

skinparam class {
    BackgroundColor     #FFFFFF
    BorderColor         #3498DB
    AttributeFontColor  #555555
    OperationFontColor  #2C3E50
    BorderThickness     2
    ArrowColor          #34495E
}

title Entity Relationship Diagram\nHotel & Tour Management System\n[Production-Ready Schema]

' ════════════════════════════════════════════════════════
' CORE ENTITIES
' ════════════════════════════════════════════════════════

entity "**User**\n[Staff Management]" as User {
    * _id          : ObjectId <<PK>>
    --
    - name         : String      <required>
    - email        : String      <required, unique>
    - password     : String      <required, hashed>
    - role         : UserRole    <Admin|Waiter|Receptionist|Manager>
    - image        : String      (URL)
    - isActive     : Boolean     (default: true)
    --
    + createdAt    : Date
    + updatedAt    : Date
}

entity "**Gest**\n[Guest Profiles]" as Guest {
    * _id          : ObjectId <<PK>>
    --
    - name         : String      <required>
    - email        : String      <required, unique>
    - phone        : String      <required>
    - message      : String
    - password     : String      <hashed>
    - image        : String      (URL)
    - isActive     : Boolean     (default: true)
    --
    + createdAt    : Date
    + updatedAt    : Date
}

entity "**Room**\n[Room Inventory]" as Room {
    * _id          : ObjectId <<PK>>
    --
    - roomNumber   : String      <required, unique>
    - type         : RoomType    <Standard|Deluxe|Beach-Cabana|Family-Suite>
    - status       : RoomStatus  <Available|Occupied|Cleaning|Maintenance>
    - pricePerNight: Number      <min: 0>
    - amenities    : String[]
    - maxOccupancy : Number      (default: 2)
    - description  : String
    - images       : String[]    (URLs)
    - lastCleaned  : Date
    --
    + createdAt    : Date
    + updatedAt    : Date
}

' ════════════════════════════════════════════════════════
' BOOKING ENTITIES
' ════════════════════════════════════════════════════════

entity "**RoomBooking**\n[Reservations]" as RoomBooking {
    * _id           : ObjectId <<PK>>
    --
    - guestName     : String      <required>
    - guestEmail    : String      <required>
    - guestPhone    : String      <required>
    - room          : ObjectId    <<FK → Room>>
    - checkInDate   : Date        <required>
    - checkOutDate  : Date        <required>
    - numberOfGuests: Number      (default: 1)
    - totalAmount   : Number      <min: 0>
    - advancePayment: Number      (default: 0)
    - paymentStatus : PaymentStatus <Pending|Partially-Paid|Paid>
    - status        : BookingStatus <Confirmed|Checked-In|Checked-Out|Cancelled>
    - specialRequests: String
    - nicNumber     : String
    - passportNumber: String
    --
    + createdAt     : Date
    + updatedAt     : Date
}

entity "**TourBooking**\n[Tour Reservations]" as TourBooking {
    * _id           : ObjectId <<PK>>
    --
    - roomBookingId : ObjectId   <<FK → RoomBooking>>
    - tourPackageId : ObjectId   <<FK → TourPackage>>
    - numberOfPeople: Number     <required>
    - bookingDate   : Date       <required>
    - totalCost     : Number     <required>
    - status        : TourStatus <Scheduled|Completed|Cancelled>
    --
    + createdAt     : Date
    + updatedAt     : Date
}

' ════════════════════════════════════════════════════════
' FOOD & BEVERAGE ENTITIES
' ════════════════════════════════════════════════════════

entity "**FoodItem**\n[Menu Items]" as FoodItem {
    * _id          : ObjectId <<PK>>
    --
    - name         : String      <required>
    - category     : FoodCategory <Appetizer|Main|Dessert|Beverage|Cocktail|Shot|Grilled|Fried|Burgers|Sandwich|Spaghetti|Pastha>
    - prices       : {            <nested object>
        normal: Number  <required>
        full: Number    (optional)
    }
    - image        : String      <required, URL>
    - prepTime     : String
    - allergens    : String[]
    - spiceLevel   : Number      (0-5)
    - isAvailable  : Boolean     (default: true)
    - description  : String
}

entity "**FoodOrder**\n[Food Orders]" as FoodOrder {
    * _id          : ObjectId <<PK>>
    --
    - roomBookingId: ObjectId   <<FK → RoomBooking>> (optional for table orders)
    - tableNumber  : String     (optional for in-house orders)
    - orderType    : OrderType  <Room|Table>
    - items        : [{          <embedded array>
        foodItem: ObjectId <<FK → FoodItem>>,
        quantity: Number,
        subTotal: Number
    }]
    - totalBill    : Number     <required>
    - orderStatus  : OrderStatus <Pending|Served|Billed>
    --
    + createdAt    : Date
    + updatedAt    : Date
}

' ════════════════════════════════════════════════════════
' TOUR PACKAGE ENTITY
' ════════════════════════════════════════════════════════

entity "**TourPackage**\n[Tour Catalog]" as TourPackage {
    * _id          : ObjectId <<PK>>
    --
    - name         : String      <required>
    - description  : String      <required>
    - location     : String      <required>
    - duration     : String      <required>
    - capacity     : Number      <required, min: 1>
    - booked       : Number      (default: 0)
    - rating       : Number      (0-5, default: 0)
    - price        : Number      <min: 0>
    - status       : TourStatus  <Active|Full|Inactive>
    - image        : String      (URL)
    --
    + createdAt    : Date
    + updatedAt    : Date
}

' ════════════════════════════════════════════════════════
' BILLING & INVOICE ENTITIES
' ════════════════════════════════════════════════════════

entity "**Invoice**\n[Consolidated Billing]" as Invoice {
    * _id           : ObjectId <<PK>>
    --
    - invoiceNumber : String     <required, unique>
    - roomBookingId : ObjectId   <<FK → RoomBooking>> (optional)
    - tableNumber   : String     (optional)
    - invoiceType   : Type       <Room|Table>
    - roomCharges   : Number     (default: 0)
    - foodCharges   : Number     (default: 0)
    - tourCharges   : Number     (default: 0)
    - serviceCharge : Number     (default: 0)
    - tax           : Number     (default: 0)
    - grandTotal    : Number     <required>
    - isPaid        : Boolean    (default: false)
    --
    + createdAt     : Date
    + updatedAt     : Date
}

' ════════════════════════════════════════════════════════
' FEEDBACK & COMPLAINTS
' ════════════════════════════════════════════════════════

entity "**Complaint**\n[Guest Complaints]" as Complaint {
    * _id          : ObjectId <<PK>>
    --
    - guestEmail   : String     <required>
    - guestName    : String     <required>
    - category     : Category   <Room|Service|Food|Cleanliness|Noise|Other>
    - priority     : Priority   <Low|Medium|High>
    - subject      : String     <required>
    - description  : String     <required>
    - status       : Status     <Open|In-Progress|Resolved>
    --
    + createdAt    : Date
    + updatedAt    : Date
}

entity "**Feedback**\n[Guest Ratings]" as Feedback {
    * _id          : ObjectId <<PK>>
    --
    - guestEmail   : String     <required>
    - guestName    : String     <required>
    - category     : Category   <Room|Service|Food|Overall>
    - rating       : Number     (1-5, required)
    - message      : String     <required>
    - bookingId    : ObjectId   <<FK → RoomBooking>> (optional)
    --
    + createdAt    : Date
    + updatedAt    : Date
}

' ════════════════════════════════════════════════════════
' INVENTORY/PRODUCTS
' ════════════════════════════════════════════════════════

entity "**Product**\n[Inventory Management]" as Product {
    * _id          : ObjectId <<PK>>
    --
    - productId    : String     <required, unique>
    - productName  : String     <required>
    - altName      : String[]
    - description  : String     <required>
    - img          : String[]   (URLs)
    - labelPrice   : Number     <required>
    - Price        : Number     <required>
    - stock        : Number     <required>
    - isAvailable  : Boolean    (default: true)
    --
    + createdAt    : Date
    + updatedAt    : Date
}

' ════════════════════════════════════════════════════════
' ENUMS & TYPES (for reference)
' ════════════════════════════════════════════════════════

notes right of User
  **Enums Defined:**
  • UserRole: Admin|Waiter|Receptionist|Manager
  • RoomStatus: Available|Occupied|Cleaning|Maintenance
  • RoomType: Standard|Deluxe|Beach-Cabana|Family-Suite
  • BookingStatus: Confirmed|Checked-In|Checked-Out|Cancelled
  • PaymentStatus: Pending|Partially-Paid|Paid
  • FoodCategory: 12 categories (Appetizer to Pastha)
  • OrderStatus: Pending|Served|Billed
  • TourStatus: Active|Full|Inactive / Scheduled|Completed|Cancelled
end notes

' ════════════════════════════════════════════════════════
' RELATIONSHIPS
' ════════════════════════════════════════════════════════

' Room relationships
Room ||--o{ RoomBooking : "reserves"

' Booking relationships
RoomBooking ||--o{ FoodOrder   : "places order"
RoomBooking ||--o{ TourBooking : "books tour"
RoomBooking ||--o| Invoice     : "generates invoice"
RoomBooking ||--o{ Feedback    : "receives feedback"

' Food relationships
FoodItem }|--|{ FoodOrder : "included in"

' Tour relationships
TourPackage ||--o{ TourBooking : "is booked as"

' Guest relationships (logical via email, not FK)
Guest ..o{ RoomBooking : "makes"
Guest ..o{ Complaint   : "submits"
Guest ..o{ Feedback    : "provides"

' Styling adjustments
skinparam linetype ortho
skinparam interactionKeywordBorderColor #3498DB
skinparam note {
    BackgroundColor #FFF9E6
    BorderColor     #F39C12
    FontColor       #2C3E50
}

@enduml
```

---

## 5. Entity Relationships Summary

```
                                    ┌──────────────┐
                                    │     User     │ (Staff)
                                    └──────────────┘
                                           │
                                           │ manages
                                           ▼
┌──────────────┐      ┌──────────────┐  ┌──────────────┐
│    Guest     │─────▶│ RoomBooking  │  │     Room     │
└──────────────┘      └──────────────┘  └──────────────┘
       │                     │   │
       │                     │   │
       │                     │   └──────────────────────┐
       │                     ▼                          │
       │              ┌──────────────┐                  │
       │              │  FoodOrder   │                  │
       │              └──────────────┘                  │
       │                     │                          │
       │                     ▼                          │
       │              ┌──────────────┐                  │
       │              │   Invoice    │◀─────────────────┘
       │              └──────────────┘
       │                     │
       │              ┌──────────────┐
       │              │ TourBooking  │
       │              └──────────────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  Complaint   │      │ TourPackage  │
└──────────────┘      └──────────────┘
       ▲
       │
┌──────────────┐
│   Feedback   │
└──────────────┘

┌──────────────┐
│  FoodItem    │ (Menu)
└──────────────┘

┌──────────────┐
│   Product    │ (Inventory)
└──────────────┘
```

---

## 6. API Structure (Current Routes)

```
/app/api/
├── auth/[...nextauth]/          # Authentication (NextAuth)
├── admin/
│   ├── menu/                    # Menu CRUD operations
│   ├── Room/                    # Room management
│   └── stats/                   # Admin analytics
├── booking/
│   ├── check-availability/      # Check room availability
│   └── check-in/                # Guest check-in
├── guest/
│   ├── bookings/                # Guest's bookings
│   ├── complaints/              # Submit complaints
│   ├── feedback/                # Submit feedback
│   ├── payments/                # Payment processing
│   └── profile/                 # Guest profile
├── invoices/                    # Invoice operations
├── orders/
│   └── [id]/                    # Order details
├── products/                    # Product inventory
├── reception/
│   ├── orders/                  # Front desk orders
│   └── stats/                   # Reception statistics
├── rooms/
│   └── available/               # Available rooms
├── staff/                       # Staff management
├── tours/                       # Tour packages
└── upload/                      # File uploads (Cloudinary)
```

---

## 7. Recommendations for Production

### 7.1 Immediate Actions (High Priority)

1. **Rename Files for Consistency**
   ```
   models/RoomBokking.ts → models/RoomBooking.ts
   models/Gest.ts → models/Guest.ts
   ```

2. **Add Input Validation**
   ```typescript
   // Use Zod for runtime validation
   import { z } from 'zod';
   
   const bookingSchema = z.object({
     checkInDate: z.date(),
     checkOutDate: z.date(),
     // ...
   });
   ```

3. **Implement Error Handling Middleware**
   ```typescript
   // lib/errorHandler.ts
   export class AppError extends Error {
     constructor(public statusCode: number, message: string) {
       super(message);
     }
   }
   ```

### 7.2 Medium Priority

1. Add unit tests with Jest
2. Set up CI/CD with GitHub Actions
3. Add rate limiting to API routes
4. Implement logging (winston/morgan)
5. Add data seeding scripts

### 7.3 Low Priority

1. Add GraphQL alternative to REST
2. Implement caching (Redis)
3. Add WebSocket for real-time updates
4. Create admin mobile app

---

## 8. Conclusion

Your **Hottel** project is **professionally structured** with a solid foundation. The codebase demonstrates:

✅ **Good separation of concerns** (models, API, components)  
✅ **Type safety** throughout with TypeScript  
✅ **Modern UI/UX** with Framer Motion  
✅ **Comprehensive data modeling** with all essential entities  
⚠️ **Minor inconsistencies** in naming conventions to address  

The ER diagram above accurately reflects your **current implementation** - not the theoretical design. Update your documentation to match this schema for consistency.

---

*Generated from codebase analysis on May 2026*  
*Project: Hottel - Hotel & Tour Management System*
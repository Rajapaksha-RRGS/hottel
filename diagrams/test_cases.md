# Vitamin Sea Hotel Management System — Test Cases

## Project Overview

| Item | Detail |
|------|--------|
| **Project** | Vitamin Sea Hotel & Hostel Management System |
| **Stack** | Next.js 16, TypeScript, MongoDB/Mongoose, NextAuth, Tailwind CSS |
| **Modules** | Auth, Rooms, Bookings, Food Orders, Tours, Invoices, Staff, Guest Portal, Complaints, Feedback |
| **Roles** | Admin, Manager, Receptionist, Waiter, Guest |

---

## Module 1: Authentication & Authorization

### TC-AUTH-001: Staff Login — Valid Credentials
| Field | Value |
|-------|-------|
| **Precondition** | Staff user exists in DB with hashed password |
| **Steps** | 1. POST to `/api/auth/[...nextauth]` with valid email & password |
| **Test Data** | `{ email: "admin@hotel.com", password: "Admin123" }` |
| **Expected** | 200 OK, JWT token with `role: "Admin"`, session created |

### TC-AUTH-002: Staff Login — Invalid Password
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with valid email but wrong password |
| **Expected** | 401, error: "Invalid Email or Password" |

### TC-AUTH-003: Staff Login — Non-existent User
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with email not in DB |
| **Expected** | 401, error: "Invalid Email or Password" |

### TC-AUTH-004: Guest Google Login — New Guest
| Field | Value |
|-------|-------|
| **Precondition** | No Gest record for the Google email |
| **Steps** | 1. Sign in via Google OAuth |
| **Expected** | New Gest record created, `role: "Guest"` in JWT, session contains guest data |

### TC-AUTH-005: Guest Google Login — Existing Guest
| Field | Value |
|-------|-------|
| **Precondition** | Gest record already exists |
| **Steps** | 1. Sign in via Google OAuth |
| **Expected** | No duplicate created, existing guest linked, `role: "Guest"` in JWT |

### TC-AUTH-006: Role-Based Access — Admin Only Endpoint
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/admin/stats` as Receptionist role |
| **Expected** | 403, error: "Unauthorized: Admin access required" |

### TC-AUTH-007: Role-Based Access — Unauthenticated Request
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/invoices` without session |
| **Expected** | 401, error: "Unauthorized: Please login" |

---

## Module 2: Room Management

### TC-ROOM-001: Get All Rooms
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/rooms` |
| **Expected** | 200, `{ ok: true, rooms: [...], count: N }` |

### TC-ROOM-002: Admin Get Rooms (Sorted)
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/admin/Room` |
| **Expected** | 200, rooms sorted by `createdAt` descending |

### TC-ROOM-003: Create Room — Valid Data
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/admin/Room` with valid body |
| **Test Data** | `{ roomNumber: "301", type: "Deluxe", pricePerNight: 150, maxOccupancy: 3 }` |
| **Expected** | 201, room created, status defaults to "Available" |

### TC-ROOM-004: Create Room — Missing Required Fields
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/admin/Room` without `roomNumber` |
| **Expected** | 400, "Room number, type, and price are required" |

### TC-ROOM-005: Create Room — Duplicate Room Number
| Field | Value |
|-------|-------|
| **Precondition** | Room "301" already exists |
| **Steps** | 1. POST `/api/admin/Room` with `roomNumber: "301"` |
| **Expected** | 409, "Room number already exists" |

### TC-ROOM-006: Room Type Validation
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/admin/Room` with `type: "InvalidType"` |
| **Expected** | 400, Mongoose validation error |

### TC-ROOM-007: Room Status Enum Values
| Field | Value |
|-------|-------|
| **Steps** | Verify statuses: Available, Occupied, Cleaning, Maintenance |
| **Expected** | Only enum values accepted; others rejected |

### TC-ROOM-008: Price Cannot Be Negative
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/admin/Room` with `pricePerNight: -50` |
| **Expected** | 400, "Price cannot be negative" |

---

## Module 3: Room Booking

### TC-BOOK-001: Create Booking — Valid Data
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/booking` with all required fields |
| **Test Data** | `{ roomId, roomName, roomPrice: 100, userId, userName, userEmail, checkInDate, checkOutDate, guests: 2 }` |
| **Expected** | 201, booking created with status "Confirmed", totalAmount = nights × price |

### TC-BOOK-002: Create Booking — Missing Room ID
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/booking` without `roomId` |
| **Expected** | 400, "Missing: Room ID" |

### TC-BOOK-003: Create Booking — Missing Email
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/booking` without `userEmail` |
| **Expected** | 400, "Missing: Guest email" |

### TC-BOOK-004: Create Booking — Invalid Dates
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with `checkInDate: "invalid"` |
| **Expected** | 400, "Invalid date format" |

### TC-BOOK-005: Create Booking — Checkout Before Checkin
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with checkOut date before checkIn date |
| **Expected** | 400, "Check-out must be after check-in" |

### TC-BOOK-006: Total Amount Calculation
| Field | Value |
|-------|-------|
| **Steps** | 1. POST booking: checkIn May 10, checkOut May 13, price $100 |
| **Expected** | `totalAmount = 300` (3 nights × $100) |

### TC-BOOK-007: Get Bookings — No Filter
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/booking` |
| **Expected** | 200, all non-cancelled bookings returned, populated room data |

### TC-BOOK-008: Get Bookings — Year/Month Filter
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/booking?year=2026&month=5` |
| **Expected** | Only bookings overlapping May 2026 returned |

### TC-BOOK-009: Booking Confirmation Email
| Field | Value |
|-------|-------|
| **Precondition** | SMTP configured |
| **Steps** | 1. Create a valid booking |
| **Expected** | Email sent to guest, booking still confirmed even if email fails |

### TC-BOOK-010: Check Availability — Room Available
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `/api/booking/check-availability` with free dates |
| **Expected** | 200, `{ available: true }` |

### TC-BOOK-011: Check Availability — Room Occupied
| Field | Value |
|-------|-------|
| **Precondition** | Room booked May 10–15 |
| **Steps** | 1. POST check-availability: checkIn May 12, checkOut May 14 |
| **Expected** | 200, `{ available: false }`, conflicting dates returned |

### TC-BOOK-012: Check Availability — Missing Room ID
| Field | Value |
|-------|-------|
| **Steps** | 1. POST without `roomId` |
| **Expected** | 400, "Room ID is required" |

### TC-BOOK-013: Check-In Booking
| Field | Value |
|-------|-------|
| **Precondition** | Booking exists with status "Confirmed" |
| **Steps** | 1. PUT `/api/booking/check-in` with `{ bookingId }` |
| **Expected** | 200, status changed to "Checked-In" |

### TC-BOOK-014: Check-In — Invalid Booking ID
| Field | Value |
|-------|-------|
| **Steps** | 1. PUT with non-existent `bookingId` |
| **Expected** | 404, "Booking not found" |

### TC-BOOK-015: Check-In — Missing Booking ID
| Field | Value |
|-------|-------|
| **Steps** | 1. PUT without `bookingId` |
| **Expected** | 400, "Booking ID is required" |

---

## Module 4: Food Menu & Orders

### TC-FOOD-001: Get Menu Items — All
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/admin/menu` |
| **Expected** | 200, array of food items sorted by `createdAt` desc |

### TC-FOOD-002: Get Menu Items — By Category
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/admin/menu?category=Beverage` |
| **Expected** | Only Beverage items returned |

### TC-FOOD-003: Create Food Item — Valid
| Field | Value |
|-------|-------|
| **Test Data** | `{ name: "Caesar Salad", category: "Appetizer", prices: { normal: 12 }, image: "url" }` |
| **Expected** | 201, item created, `isAvailable` defaults to true |

### TC-FOOD-004: Create Food Item — Invalid Category
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with `category: "InvalidCat"` |
| **Expected** | 500 or validation error |

### TC-FOOD-005: Place Room Food Order — Valid
| Field | Value |
|-------|-------|
| **Precondition** | Logged in as Receptionist, valid roomBookingId |
| **Steps** | 1. POST `/api/reception/orders` |
| **Test Data** | `{ orderType: "Room", roomBookingId: "...", items: [...], totalBill: 45 }` |
| **Expected** | 200, order created with `orderStatus: "Pending"` |

### TC-FOOD-006: Place Table Order — Valid
| Field | Value |
|-------|-------|
| **Test Data** | `{ orderType: "Table", tableNumber: "T5", items: [...], totalBill: 30 }` |
| **Expected** | 200, order created |

### TC-FOOD-007: Place Order — Missing Items
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with empty `items` array |
| **Expected** | 400, "Missing required fields" |

### TC-FOOD-008: Place Room Order — Missing roomBookingId
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `orderType: "Room"` without `roomBookingId` |
| **Expected** | 400, "Room orders require roomBookingId" |

### TC-FOOD-009: Place Table Order — Missing tableNumber
| Field | Value |
|-------|-------|
| **Steps** | 1. POST `orderType: "Table"` without `tableNumber` |
| **Expected** | 400, "Table orders require tableNumber" |

### TC-FOOD-010: Place Order — Invalid orderType
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with `orderType: "Bar"` |
| **Expected** | 400, "Invalid orderType" |

### TC-FOOD-011: Place Order — Unauthorized (Waiter)
| Field | Value |
|-------|-------|
| **Steps** | 1. POST as Waiter role |
| **Expected** | 403, "Unauthorized: Reception access required" |

---

## Module 5: Tour Packages

### TC-TOUR-001: Get All Tours
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/tours` |
| **Expected** | 200, `{ ok: true, tours: [...] }` sorted by createdAt desc |

### TC-TOUR-002: Create Tour — Valid
| Field | Value |
|-------|-------|
| **Test Data** | `{ name: "Whale Watching", description: "...", location: "Mirissa", duration: "4h", capacity: 20, price: 85 }` |
| **Expected** | 201, tour created with `status: "Active"`, `booked: 0` |

### TC-TOUR-003: Create Tour — Missing Required Field
| Field | Value |
|-------|-------|
| **Steps** | 1. POST without `name` |
| **Expected** | 400, "name is required" |

### TC-TOUR-004: Tour Auto-Status to "Full"
| Field | Value |
|-------|-------|
| **Steps** | 1. Save tour where `booked >= capacity` |
| **Expected** | Pre-save hook sets `status: "Full"` |

### TC-TOUR-005: Create Tour — Duplicate Name
| Field | Value |
|-------|-------|
| **Precondition** | Tour "Whale Watching" exists |
| **Steps** | 1. POST with same name |
| **Expected** | 400, "A tour with this name already exists" |

### TC-TOUR-006: Tour Rating Bounds
| Field | Value |
|-------|-------|
| **Steps** | 1. Create tour with `rating: 6` |
| **Expected** | Validation error, "Rating cannot exceed 5" |

---

## Module 6: Invoices

### TC-INV-001: Get Invoices — Authorized
| Field | Value |
|-------|-------|
| **Precondition** | Logged in as Admin/Receptionist/Manager |
| **Steps** | 1. GET `/api/invoices` |
| **Expected** | 200, invoices include room guest + walk-in table invoices |

### TC-INV-002: Get Invoices — With Search
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/invoices?search=John` |
| **Expected** | Only invoices matching "John" in guest name returned |

### TC-INV-003: Invoice Grand Total Calculation
| Field | Value |
|-------|-------|
| **Precondition** | Booking with room=$200, food=$50, tour=$80 |
| **Expected** | `grandTotal = 330` |

### TC-INV-004: Update Payment Status — Valid
| Field | Value |
|-------|-------|
| **Steps** | 1. PATCH `/api/invoices` with `{ guestId, paymentStatus: "Paid", guestType: "Room" }` |
| **Expected** | 200, payment status updated |

### TC-INV-005: Update Payment — Missing Fields
| Field | Value |
|-------|-------|
| **Steps** | 1. PATCH without `guestId` |
| **Expected** | 400, "Missing required fields" |

### TC-INV-006: Update Payment — Invalid Status
| Field | Value |
|-------|-------|
| **Steps** | 1. PATCH with `paymentStatus: "Cancelled"` |
| **Expected** | 400, "Invalid payment status" |

### TC-INV-007: Update Payment — External Guest
| Field | Value |
|-------|-------|
| **Steps** | 1. PATCH with `guestType: "External"` |
| **Expected** | Response: "External guest invoices cannot be marked as paid via API" |

### TC-INV-008: Get Invoices — Unauthorized
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/invoices` as Waiter |
| **Expected** | 403 |

---

## Module 7: Staff Management

### TC-STAFF-001: Register Staff — Valid (via /api/staff)
| Field | Value |
|-------|-------|
| **Precondition** | Request has header `user-role: Admin` |
| **Test Data** | `{ name: "Jane", email: "jane@hotel.com", password: "Pass1234", role: "Waiter" }` |
| **Expected** | 201, user created, password hashed |

### TC-STAFF-002: Register Staff — Via Session Auth (/api/register-staff)
| Field | Value |
|-------|-------|
| **Precondition** | Logged in as Admin |
| **Expected** | 201, staff member registered |

### TC-STAFF-003: Register Staff — Duplicate Email
| Field | Value |
|-------|-------|
| **Precondition** | Email already registered |
| **Expected** | 409, "Email already registered in system" |

### TC-STAFF-004: Register Staff — Invalid Email Format
| Field | Value |
|-------|-------|
| **Test Data** | `{ email: "not-an-email" }` |
| **Expected** | 400, "Invalid email format" |

### TC-STAFF-005: Register Staff — Short Password
| Field | Value |
|-------|-------|
| **Test Data** | `{ password: "123" }` |
| **Expected** | 400, "Password must be at least 6 characters" |

### TC-STAFF-006: Register Staff — Invalid Role
| Field | Value |
|-------|-------|
| **Test Data** | `{ role: "SuperAdmin" }` |
| **Expected** | 400, "Invalid role" |

### TC-STAFF-007: Register Staff — Non-Admin Attempt
| Field | Value |
|-------|-------|
| **Steps** | 1. POST as Receptionist |
| **Expected** | 403 |

### TC-STAFF-008: Get All Staff — Admin
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/staff` with `user-role: Admin` header |
| **Expected** | 200, list of active staff (password excluded) |

---

## Module 8: Guest Portal

### TC-GUEST-001: Get Guest Bookings
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/guest/bookings?email=guest@test.com` |
| **Expected** | 200, bookings for that email, populated room data |

### TC-GUEST-002: Get Guest Bookings — Missing Email
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/guest/bookings` (no email param) |
| **Expected** | 400, "Email is required" |

### TC-GUEST-003: Get Guest Bookings — Legacy Fallback
| Field | Value |
|-------|-------|
| **Steps** | 1. GET with `email` and `name` params |
| **Expected** | Also returns bookings with placeholder email matching guest name |

### TC-GUEST-004: Submit Complaint — Valid
| Field | Value |
|-------|-------|
| **Test Data** | `{ email: "g@test.com", name: "Guest", category: "Room", subject: "AC broken", description: "..." }` |
| **Expected** | 201, complaint created with `status: "Open"`, `priority: "Medium"` |

### TC-GUEST-005: Submit Complaint — Missing Fields
| Field | Value |
|-------|-------|
| **Steps** | 1. POST without `subject` |
| **Expected** | 400, "All fields are required" |

### TC-GUEST-006: Get Guest Complaints
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/guest/complaints?email=g@test.com` |
| **Expected** | 200, complaints sorted by createdAt desc |

### TC-GUEST-007: Submit Feedback — Valid
| Field | Value |
|-------|-------|
| **Test Data** | `{ email: "g@test.com", name: "Guest", category: "Food", rating: 5, message: "Excellent!" }` |
| **Expected** | 201, feedback created |

### TC-GUEST-008: Submit Feedback — Missing Fields
| Field | Value |
|-------|-------|
| **Steps** | 1. POST without `rating` |
| **Expected** | 400, "All fields are required" |

### TC-GUEST-009: Feedback Rating Bounds
| Field | Value |
|-------|-------|
| **Steps** | 1. POST with `rating: 0` or `rating: 6` |
| **Expected** | Mongoose validation error (min: 1, max: 5) |

### TC-GUEST-010: Get Guest Feedback
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/guest/feedback?email=g@test.com` |
| **Expected** | 200, feedbacks sorted by createdAt desc |

---

## Module 9: Dashboard & Statistics

### TC-STAT-001: Admin Stats — Authorized
| Field | Value |
|-------|-------|
| **Precondition** | Logged in as Admin |
| **Steps** | 1. GET `/api/admin/stats` |
| **Expected** | 200, includes totalBookings, totalRooms, revenue, occupancyRate, monthly chart data |

### TC-STAT-002: Admin Stats — Occupancy Rate Calculation
| Field | Value |
|-------|-------|
| **Precondition** | 10 rooms, 3 checked-in |
| **Expected** | `occupancyRate: "30.00%"` |

### TC-STAT-003: Reception Stats — Authorized
| Field | Value |
|-------|-------|
| **Precondition** | Logged in as Receptionist |
| **Steps** | 1. GET `/api/reception/stats` |
| **Expected** | 200, includes roomStats, todayCheckIns, todayCheckOuts, pendingFoodOrders |

### TC-STAT-004: Reception Stats — Unauthorized
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/reception/stats` as Guest |
| **Expected** | 403 |

---

## Module 10: Products

### TC-PROD-001: Get Products
| Field | Value |
|-------|-------|
| **Steps** | 1. GET `/api/products` |
| **Expected** | 200, max 20 products returned |

---

## Module 11: Utility Functions

### TC-UTIL-001: parsePrepTime — Range Format
| Field | Value |
|-------|-------|
| **Input** | `"10-15 mins"` |
| **Expected** | Returns `13` (average rounded up) |

### TC-UTIL-002: parsePrepTime — Single Value
| Field | Value |
|-------|-------|
| **Input** | `"20 mins"` |
| **Expected** | Returns `20` |

### TC-UTIL-003: parsePrepTime — Undefined Input
| Field | Value |
|-------|-------|
| **Input** | `undefined` |
| **Expected** | Returns `0` |

### TC-UTIL-004: parsePrepTime — Empty String
| Field | Value |
|-------|-------|
| **Input** | `""` |
| **Expected** | Returns `0` |

### TC-UTIL-005: calculateAveragePrepTime — Multiple Items
| Field | Value |
|-------|-------|
| **Input** | `[{ prepTime: "10 mins" }, { prepTime: "20 mins" }]` |
| **Expected** | Returns `15` |

### TC-UTIL-006: calculateAveragePrepTime — Empty Array
| Field | Value |
|-------|-------|
| **Input** | `[]` |
| **Expected** | Returns `0` |

### TC-UTIL-007: cn() Utility — Merges Classes
| Field | Value |
|-------|-------|
| **Input** | `cn("px-2 py-1", "px-4")` |
| **Expected** | Returns `"py-1 px-4"` (tailwind-merge resolves conflict) |

---

## Module 12: Data Model Validation

### TC-MODEL-001: User Password Hashing
| Field | Value |
|-------|-------|
| **Steps** | 1. Create user with plaintext password |
| **Expected** | Pre-save hook hashes password with bcrypt (10 rounds) |

### TC-MODEL-002: User Password Not Returned by Default
| Field | Value |
|-------|-------|
| **Steps** | 1. `User.findOne({ email })` |
| **Expected** | Password field excluded (`select: false`) |

### TC-MODEL-003: Room — Unique Room Number
| Field | Value |
|-------|-------|
| **Steps** | 1. Create two rooms with same roomNumber |
| **Expected** | Second save throws duplicate key error |

### TC-MODEL-004: User — Email Regex Validation
| Field | Value |
|-------|-------|
| **Test Data** | `email: "bad-email"` |
| **Expected** | Validation error: "Please provide a valid email" |

### TC-MODEL-005: FoodItem — Spice Level Bounds
| Field | Value |
|-------|-------|
| **Steps** | 1. Create FoodItem with `spiceLevel: 6` |
| **Expected** | Validation error (max: 5) |

### TC-MODEL-006: RoomBooking — Default Values
| Field | Value |
|-------|-------|
| **Steps** | 1. Create booking without optional fields |
| **Expected** | `numberOfGuests: 1`, `advancePayment: 0`, `paymentStatus: "Pending"`, `status: "Confirmed"` |

### TC-MODEL-007: Invoice — invoiceType Enum
| Field | Value |
|-------|-------|
| **Steps** | 1. Create invoice with `invoiceType: "Bar"` |
| **Expected** | Validation error (enum: Room, Table) |

### TC-MODEL-008: TourBooking — Required References
| Field | Value |
|-------|-------|
| **Steps** | 1. Create TourBooking without `roomBookingId` |
| **Expected** | Validation error — required field |

---

## Module 13: Email Service

### TC-EMAIL-001: Send Booking Confirmation
| Field | Value |
|-------|-------|
| **Precondition** | SMTP env vars configured |
| **Steps** | 1. Call `sendBookingConfirmationEmail()` with valid data |
| **Expected** | Email sent, HTML includes guest name, booking ref, dates, amount |

### TC-EMAIL-002: Email Failure Does Not Block Booking
| Field | Value |
|-------|-------|
| **Precondition** | SMTP misconfigured |
| **Steps** | 1. Create booking |
| **Expected** | Booking saved (201), email error logged, no 500 returned |

---

## Module 14: Cloudinary Integration

### TC-CLOUD-001: Upload Image
| Field | Value |
|-------|-------|
| **Steps** | 1. Call `uploadToCloudinary(base64, 'tours')` |
| **Expected** | Returns `{ secure_url, public_id, width, height, format }` |

### TC-CLOUD-002: Delete Image
| Field | Value |
|-------|-------|
| **Precondition** | Image uploaded with known `public_id` |
| **Steps** | 1. Call `deleteFromCloudinary(publicId)` |
| **Expected** | Image removed from Cloudinary |

---

## Module 15: Database Connection

### TC-DB-001: Successful Connection
| Field | Value |
|-------|-------|
| **Precondition** | `MONGODB_URI` set in `.env` |
| **Steps** | 1. Call `connectDB()` |
| **Expected** | Mongoose connection established, cached for reuse |

### TC-DB-002: Missing MONGODB_URI
| Field | Value |
|-------|-------|
| **Precondition** | `MONGODB_URI` not set |
| **Steps** | 1. Call `connectDB()` |
| **Expected** | Throws: "Please define the MONGODB_URI environment variable" |

### TC-DB-003: Connection Caching
| Field | Value |
|-------|-------|
| **Steps** | 1. Call `connectDB()` twice |
| **Expected** | Second call returns cached connection (no new connection) |

---

## Summary

| Module | Test Cases | Priority |
|--------|-----------|----------|
| Authentication | 7 | 🔴 Critical |
| Room Management | 8 | 🔴 Critical |
| Room Booking | 15 | 🔴 Critical |
| Food Menu & Orders | 11 | 🟡 High |
| Tour Packages | 6 | 🟡 High |
| Invoices | 8 | 🟡 High |
| Staff Management | 8 | 🔴 Critical |
| Guest Portal | 10 | 🟡 High |
| Dashboard & Stats | 4 | 🟢 Medium |
| Products | 1 | 🟢 Medium |
| Utility Functions | 7 | 🟢 Medium |
| Data Model Validation | 8 | 🟡 High |
| Email Service | 2 | 🟢 Medium |
| Cloudinary | 2 | 🟢 Medium |
| Database Connection | 3 | 🔴 Critical |
| **Total** | **100** | |

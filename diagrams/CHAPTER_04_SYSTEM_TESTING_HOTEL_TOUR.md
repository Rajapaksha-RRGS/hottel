# CHAPTER 04: SYSTEM TESTING

## Introduction

System testing is a crucial phase in the development lifecycle that ensures the Hotel and Tour Management System remains accurate, reliable, and efficient across all operational processes. Since the system is designed to accommodate a wide range of functions and serve multiple user roles including administrators, staff, managers, and guests, comprehensive testing is essential to verify that all modules work together seamlessly and function as intended in real-world operational environments.

The testing process addresses critical business functions including guest registration, room reservation, billing and payment processing, food and beverage order management, tour booking, complaint management, and role-based access control. The system must ensure that every module functions independently while maintaining proper integration with the entire system. This requires rigorous data consistency verification—ensuring that guest profiles automatically update, room availability is correctly reflected in real-time, financial records remain accurate and consistent, and notifications are delivered appropriately when required.

The Hotel and Tour Management System ensures that all operational activities function smoothly and reliably through comprehensive testing approaches. By maintaining the flow of operations without disruptions, the system keeps guests satisfied, provides reliable service quality, reduces errors, and minimizes administrative delays that could impact business operations. The primary objective of system testing is to create a secure, user-friendly platform that reduces manual operations, improves staff efficiency, and ensures precise data management across all departments of the hotel.

---

## 4.1 Features to be Tested / Not to be Tested

### Features to be Tested

The following features represent the core functionality of the Hotel and Tour Management System and must undergo comprehensive testing to ensure operational reliability:

#### • **Staff Authentication and Role-Based Access Control Module**

This module manages system access for all staff members including administrators, receptionists, managers, and waiters. Testing verifies that staff members can securely register with legitimate credentials, log in with correct authentication, and access only the features authorized for their specific role. The system must enforce password strength policies, implement secure session management, prevent unauthorized access attempts, and ensure that role-based access control functions correctly such that each staff member can only perform operations designated for their role. Testing also confirms that users cannot escalate privileges, access others' data, or bypass security restrictions designed to protect sensitive information.

#### • **Guest Registration and Profile Management Module**

This module handles guest account creation and profile information storage. Testing ensures that guests can create accounts with valid information, update their profiles accurately, and retrieve stored data correctly. The system must verify that privacy settings are properly configured, allowing only authorized personnel to access sensitive guest information. Testing confirms that historical guest data remains consistent, is compatible with reservation and billing modules, and cannot be accessed by unauthorized users or guests viewing other profiles.

#### • **Room Management and Inventory Module**

This module manages the hotel's room inventory including room types, status tracking, pricing, and availability. Testing verifies that rooms can be created, updated, and categorized correctly (Standard, Deluxe, Beach-Cabana, Family-Suite). The system must accurately track room status (Available, Occupied, Cleaning, Maintenance) and update status in real-time across all interfaces. Testing ensures that room pricing is correctly applied based on room type and occupancy, that amenities are properly recorded, and that room availability information is consistent throughout the system.

#### • **Room Booking and Reservation Management Module**

This module handles guest reservations and booking lifecycle management. Testing ensures that guests can check room availability for specified dates, create new reservations with valid information, modify existing bookings, and cancel reservations when necessary. The system must validate date ranges to prevent invalid reservations, prevent double-booking of rooms, maintain real-time room availability across all user interfaces, and generate booking confirmations and cancellation notifications promptly. Testing verifies that the system correctly calculates reservation costs, tracks booking status, and prevents conflicting reservations from being created simultaneously.

#### • **Food and Beverage Order Management Module**

This module manages food orders from both in-room guests and walk-in customers. Testing verifies that staff can create new food orders specifying order type (Room service or Table service), add menu items, calculate correct totals, and track order status transitions (Pending → Served → Billed). The system must accurately record which room or table an order belongs to, update inventory appropriately, and generate accurate billing information. Testing ensures that duplicate orders are prevented, order status changes are reflected immediately, and all order information integrates correctly with the invoicing system.

#### • **Tour Package and Booking Management Module**

This module manages tour package offerings and guest tour bookings. Testing ensures that tour packages can be created with complete information including location, duration, capacity, pricing, and description. The system must track tour availability based on capacity limits, prevent overbooking of tours, and automatically update tour status when capacity is reached. Testing verifies that guests can book available tours linked to their room reservations, that tour charges are correctly calculated and added to guest invoices, and that tour completion status is properly tracked for operational and billing purposes.

#### • **Invoice Generation and Payment Processing Module**

This module consolidates all charges for individual guests and tracks payment status. Testing verifies that invoices are generated accurately combining room charges, food service charges, and tour charges. The system must apply service charges and taxes correctly based on applicable policies, support multiple payment methods for recording transactions, prevent duplicate billing, and maintain accurate payment records. Testing ensures that payment status is tracked independently, that invoices can be viewed by authorized personnel, and that the system accurately reflects paid, partially paid, and pending payment states.

#### • **Guest Complaint and Feedback Management Module**

This module allows guests to submit complaints and feedback about their experience. Testing verifies that guests can submit complaints with appropriate categorization (Room, Service, Food, Cleanliness, Noise, Other), set priority levels, and provide detailed descriptions. The system must track complaint status transitions (Open → In-Progress → Resolved), ensure that authorized staff can view and respond to complaints, and generate notifications when complaints are updated. Testing confirms that feedback can be submitted with rating information and that feedback data is stored securely and accessible for analysis.

#### • **Dashboard Analytics and Reporting Module**

This module provides administrators and managers with real-time insights into hotel operations. Testing verifies that dashboards display accurate data including booking statistics, occupancy rates, revenue information, housekeeping status, and complaint metrics. The system must generate reports correctly for specified date ranges, allow filtering by various parameters, and provide visual representations of operational data. Testing ensures that data displayed in dashboards is current, accurate, and consistent with underlying database records, and that reports can be exported in appropriate formats.

#### • **Notification and Communication Module**

This module manages automated email and SMS notifications for bookings, payments, and other important events. Testing verifies that notifications are created and sent promptly with correct content and recipient information. The system must handle communication failures gracefully and implement automatic retry mechanisms where possible. Testing ensures that notifications are delivered appropriately and that the system correctly manages notification delivery without errors or omissions.

### Features Not to be Tested

The following items fall outside the scope of system testing as they represent external dependencies or future enhancements:

#### • **Third-Party Payment Gateway Services**

Although the system integrates with external payment providers such as credit card processing networks or online payment gateways, internal testing will not validate the reliability or security of these third-party systems. Testing focuses only on verifying that the Hotel and Tour Management System correctly formats and transmits transaction data to external payment gateways and receives responses appropriately. The security and operational status of third-party payment processors is the responsibility of those external service providers.

#### • **External Email and SMS Notification Services**

The system integrates with external notification services such as email providers and SMS gateways. Internal testing will not evaluate the uptime or delivery rates of these external services. Testing confirms only that the system correctly prepares notification data and transmits it to external providers. The delivery and reliability of email and SMS messages is the responsibility of the external service providers.

#### • **Cloud Image Storage Services**

The system uses Cloudinary for storing and serving images related to rooms, food items, and tours. Testing will not validate Cloudinary's storage reliability or image processing capabilities. Testing confirms only that the system correctly uploads image files to the cloud service and retrieves image URLs appropriately for display in the user interface.

#### • **Google OAuth Authentication Provider**

Guest users can authenticate using Google OAuth. Testing will not validate Google's authentication service. Testing confirms only that the system correctly integrates with the Google OAuth protocol and properly creates guest accounts based on information provided by Google's authentication service.

#### • **Hardware and Device Integrations**

Testing will not include hardware devices such as printers, card readers, or door access systems. The functionality of creating printable invoices and generating access information will be tested, but the actual printing or hardware device operations are outside the testing scope.

#### • **Multi-Language Support**

The system currently operates in English only. Multi-language compatibility testing is not included in the current testing scope and will be addressed in future system upgrades.

#### • **Cross-Platform and Browser Compatibility**

Testing focuses only on officially supported platforms which are Windows and Linux operating systems, and Chrome or Edge browsers. Compatibility with other operating systems, browsers, or mobile platforms is not included in the current testing scope.

---

## 4.2 Test Plans

The following table provides a detailed breakdown of test plans applied to the Hotel and Tour Management System. Each row specifies the feature being tested, the testing objective, specific test scenarios that will be executed, and the success criteria that must be met for the test to pass.

| **Feature** | **Objective** | **Test Scenarios** | **Success Criteria** |
|---|---|---|---|
| **Staff Authentication and Role-Based Access Control** | Ensure secure staff authentication and proper role-based authorization | **Scenario 1:** Staff member with Admin role logs in with valid credentials and verifies access to admin dashboard, room management, staff management, and financial reports. **Scenario 2:** Staff member with Receptionist role logs in and verifies that only reception-specific features are visible including booking management, guest check-in, food order creation, and invoice management. **Scenario 3:** Attempt to log in with invalid credentials or non-existent email address and verify that login is denied with appropriate error message. **Scenario 4:** Valid staff member attempts to access admin features from receptionist account and verify that unauthorized access is blocked. **Scenario 5:** Test password strength requirements by attempting to create staff account with weak password (less than 8 characters, no special characters) and verify rejection. **Scenario 6:** Verify that passwords are securely hashed using bcryptjs and that passwords stored in database cannot be read directly. **Scenario 7:** Log in with valid credentials, then attempt to change password to ensure password change functionality works correctly. **Scenario 8:** Verify session timeout after extended inactivity and that user must log in again to access system. | All staff can securely log in with valid credentials. Each role can access only authorized features. Unauthorized access attempts are blocked. Password requirements are enforced. Sessions expire appropriately. Password changes are processed correctly. |
| **Guest Registration and Profile Management** | Verify guest account creation and profile information management | **Scenario 1:** New guest creates account with complete valid information (name, email, phone) through guest registration form and verify account is created successfully. **Scenario 2:** Guest logs in with registered email and password and accesses personal dashboard showing their information. **Scenario 3:** Guest updates profile information (name, phone number, preferences) and verify changes are saved and reflected immediately when profile is viewed again. **Scenario 4:** Attempt to register new account with existing email address and verify system prevents duplicate registration with appropriate error message. **Scenario 5:** Attempt to access another guest's profile or booking information and verify that access is denied and each guest can only view their own data. **Scenario 6:** Guest reviews profile showing historical booking records, previous stay information, and saved preferences and verify data is accurate and complete. **Scenario 7:** Verify that sensitive guest information like passport numbers and ID information cannot be viewed by unauthorized staff members. **Scenario 8:** Test guest account deactivation functionality where guest can close their account and verify that the account cannot be used for future login attempts. | Guest accounts are created successfully with all required information. Guests can update their own profiles. Duplicate email registration is prevented. Profile data is securely protected from unauthorized access. Historical data is preserved and accessible. Account deactivation works correctly. |
| **Room Management and Inventory** | Ensure accurate tracking of room inventory, types, and status | **Scenario 1:** Administrator creates new room with complete information (room number, type, price per night, amenities, max occupancy) and verify room is added to system and visible in room list. **Scenario 2:** Administrator updates existing room information (price change, amenities modification) and verify changes are reflected throughout system immediately. **Scenario 3:** Verify that room status correctly transitions from "Available" to "Occupied" when guest checks in and transitions back to "Cleaning" after checkout. **Scenario 4:** When room is marked for cleaning, verify that "Cleaning" status is visible to housekeeping staff and that room is not offered to new booking requests. **Scenario 5:** Verify that room pricing is correctly applied based on room type (Standard rooms at base rate, Deluxe at higher rate, Beach-Cabana at premium rate) when displaying available rooms to guests. **Scenario 6:** Verify that different room types have correct occupancy limits (Standard max 2, Deluxe max 2, Family-Suite max 4) and that booking system enforces these limits. **Scenario 7:** Test that room amenities information is correctly recorded and displayed to guests when browsing available rooms. **Scenario 8:** Verify inventory reports accurately show number of rooms by type, current occupancy, and rooms in maintenance status. | Room inventory is accurately created and updated. Room status transitions are correct. Pricing is applied based on room type. Occupancy limits are enforced. Amenities information is accurate. Reports display correct room inventory data. |
| **Room Booking and Reservation Management** | Verify booking process, availability checking, and reservation management | **Scenario 1:** Guest selects check-in and check-out dates, chooses specific room type, and system displays only available rooms for those dates with correct pricing. **Scenario 2:** Guest completes booking with valid guest information (name, email, phone, number of guests) and system creates reservation showing all booking details. **Scenario 3:** Guest receives booking confirmation email containing reservation details, confirmation number, check-in time, and booking reference. **Scenario 4:** System prevents booking of same room for overlapping dates (e.g., cannot book room 101 for dates that overlap with existing reservation). **Scenario 5:** Guest attempts to modify existing booking by changing dates or room type and system allows modification if new dates have availability, or prevents modification if new dates are not available. **Scenario 6:** Guest attempts to cancel booking and system cancels reservation, updates room availability, and sends cancellation confirmation. **Scenario 7:** When guest checks in on arrival date, receptionist staff selects booking and confirms check-in, which updates booking status to "Checked-In" and room status to "Occupied". **Scenario 8:** When checkout date arrives, system automatically updates room status to "Cleaning" and allows booking to be marked as completed. | Availability is displayed correctly for selected dates. Bookings are created with accurate information. Confirmation emails are sent promptly. Double-booking is prevented. Booking modifications are processed correctly. Cancellations are handled appropriately. Check-in updates booking and room status. |
| **Food and Beverage Order Management** | Verify food order creation, tracking, and billing integration | **Scenario 1:** Staff creates food order for room service specifying room number, guest name, selecting menu items, quantities, and special requests, then system calculates correct order total. **Scenario 2:** Staff creates food order for walk-in customer at specific table number, selects menu items, and system tracks order for table service billing. **Scenario 3:** System displays order in kitchen/preparation area with all details (room number or table, items to prepare, special requests, time received) so kitchen staff knows what to prepare. **Scenario 4:** When food order items are prepared and served, staff marks order as "Served" and system records service time. **Scenario 5:** When order is marked as "Served", system automatically adds order total to guest's invoice if room service order, or records as transaction if table service. **Scenario 6:** Staff attempts to create duplicate order for same room with identical items within short time period and system prevents duplicate order creation. **Scenario 7:** Menu item prices are correctly applied when order is created, including any special pricing or discounts that may apply. **Scenario 8:** System prevents orders from being created for out-of-stock menu items or items marked as unavailable by management. | Orders are created successfully with correct customer information. Order totals are calculated accurately. Orders appear in preparation area with complete details. Order status changes are reflected correctly. Served orders are added to invoices. Duplicate orders are prevented. Menu pricing is applied correctly. Out-of-stock items are unavailable. |
| **Tour Package and Booking Management** | Verify tour offerings, booking capability, and capacity management | **Scenario 1:** Administrator creates tour package with complete information (name, description, location, duration, capacity, price, images) and system displays tour in available tours list. **Scenario 2:** Guest viewing available tours can select tour package, choose date, and specify number of participants without exceeding tour capacity. **Scenario 3:** System links tour booking to guest's room reservation so that tour charges are automatically associated with correct guest and added to their invoice. **Scenario 4:** When tour reaches maximum capacity (e.g., 30 participants booked out of 30 capacity), system prevents additional bookings and displays "Tour Full" status to guests. **Scenario 5:** When tour is fully booked, system automatically updates tour status to "Full" and removes tour from active booking options for new reservations. **Scenario 6:** Tour booking cost is correctly calculated and added to guest's invoice consolidating with room charges and food charges. **Scenario 7:** When tour date arrives and tour is completed, staff marks tour as "Completed" which updates tour booking status for billing and reporting purposes. **Scenario 8:** System prevents overbooking by tracking current participants and preventing bookings that would exceed capacity even if multiple bookings are submitted simultaneously. | Tours are created with complete information. Guests can book available tours. Tour bookings are linked to room reservations. Capacity limits are enforced. Tour status updates correctly when full. Tour charges are added to invoices. Tour completion status is tracked. Overbooking is prevented. |
| **Invoice Generation and Payment Processing** | Verify accurate invoice generation and payment processing | **Scenario 1:** When guest has room charges, food orders, and tour bookings, system consolidates all charges into single invoice showing room charges, food charges, tour charges, service charge, tax, and grand total. **Scenario 2:** Room charges are calculated correctly based on number of nights and room rate (e.g., 3 nights × $100/night = $300). **Scenario 3:** Service charge is applied correctly as percentage of subtotal (e.g., 10% service charge on $500 subtotal = $50). **Scenario 4:** Tax is calculated correctly on applicable amounts according to configured tax rate (e.g., 15% tax on subtotal plus service charge). **Scenario 5:** Staff records payment received from guest indicating payment method (cash, card, online) and amount paid, and system updates payment status to show payment received and amount. **Scenario 6:** System prevents double-billing by ensuring each charge (room night, food order, tour booking) is invoiced only once. **Scenario 7:** Invoice can be marked as paid, partially paid, or pending, and system maintains accurate payment status. **Scenario 8:** System generates accurate reports showing total invoices generated, total revenue, invoices paid, and invoices pending showing financial health of hotel operations. | Invoices consolidate all applicable charges. Calculations for room charges, service charges, and taxes are correct. Payment methods are recorded accurately. Payment status is tracked correctly. Double-billing is prevented. Financial reports display accurate totals. |
| **Guest Complaint and Feedback Management** | Verify complaint submission, tracking, and resolution | **Scenario 1:** Guest submits complaint through guest portal selecting complaint category (Room condition, Service quality, Food issue, Cleanliness, Noise, Other), setting priority (Low, Medium, High), and providing detailed description. **Scenario 2:** System creates complaint record with timestamp, guest information, category, priority, and description, and sends acknowledgment notification to guest. **Scenario 3:** Staff receives complaint notification and can view complaint details including guest contact information so they can follow up with guest. **Scenario 4:** Staff updates complaint status from "Open" to "In-Progress" indicating that management is investigating the issue. **Scenario 5:** When complaint is resolved, staff updates status to "Resolved" and provides resolution details or response to guest. **Scenario 6:** Guest provides feedback including ratings (1-5 scale) for Room quality, Service quality, Food quality, and Overall experience with optional written comments. **Scenario 7:** Feedback is recorded separately from complaints and can be analyzed by management to identify trends and areas for improvement. **Scenario 8:** System prevents guests from submitting multiple identical complaints in short timeframe to avoid duplicate complaint records. | Complaints are submitted with complete information. Acknowledgment notifications are sent. Staff receives complaint notifications. Status updates are tracked. Resolutions are recorded. Feedback ratings are recorded. Data prevents duplicate complaints. |
| **Dashboard Analytics and Reporting** | Verify accurate reporting and data visualization | **Scenario 1:** Administrator views main dashboard displaying total bookings this month, occupancy rate, total revenue this month, number of completed tours, and pending complaints. **Scenario 2:** Manager generates occupancy report for specified date range showing number of occupied rooms, available rooms, and occupancy percentage for each day. **Scenario 3:** Manager generates revenue report showing total revenue from room bookings, food orders, and tour packages for specified period. **Scenario 4:** Receptionist views current status dashboard showing rooms currently occupied, rooms in cleaning status, pending check-ins, and pending check-outs. **Scenario 5:** System displays complaints dashboard showing open complaints by category, average resolution time, and complaint trends over time. **Scenario 6:** Reports can be filtered by date range, room type, or staff member to view specific data subsets. **Scenario 7:** Data displayed in all reports and dashboards is current and matches underlying database records when independently verified. **Scenario 8:** Reports can be exported to common formats and imported into other tools for further analysis. | Dashboards display accurate data. Reports show correct calculations. Filters work properly. Data is current and consistent with database. Exports are formatted correctly. |
| **Notification and Communication** | Verify timely delivery of notifications | **Scenario 1:** When booking is created, guest receives email confirmation containing reservation number, check-in date, room type, and check-in instructions within 2 minutes of booking. **Scenario 2:** When guest completes payment, guest receives email receipt showing invoice details and confirmation of payment received. **Scenario 3:** One day before check-in date, system sends reminder notification to guest with check-in date, time, and location information. **Scenario 4:** When staff processes complaint resolution, guest receives email notification describing resolution provided. **Scenario 5:** When room is ready after cleaning, housekeeping staff marks room as ready and front desk receives notification that room can be assigned to new guests. **Scenario 6:** Staff members receive notifications about pending complaints, inventory alerts, or other important operational events. **Scenario 7:** If email notification fails to send (e.g., email service temporarily unavailable), system records failure and automatically retries sending notification. **Scenario 8:** Notification content is accurate, properly addressed to correct recipient, and contains all necessary information without errors or omissions. | Booking confirmations are sent within 2 minutes. Payment receipts are delivered promptly. Reminders are sent at correct times. Notifications contain accurate information. Failed notifications are retried. |

---

## 4.3 Implementation and Testing – Development Approach and System Architecture

### System Overview and Testing Objectives

The objective of implementing and testing the Hotel and Tour Management System was to develop a comprehensive, secure, and user-friendly digital platform that automates daily hotel operations including room reservations, food service management, tour bookings, and guest services. The system was designed to accommodate multiple user roles—administrators, receptionists, managers, waiters, and guests—each with specific responsibilities and access permissions.

The primary objective of testing was to ensure that all system components function individually and operate harmoniously when integrated together. Testing verifies that guests receive excellent service through accurate bookings and timely communication, that financial transactions remain correct and secure, that staff members are well-coordinated through proper notifications and role-based access, and that the system remains reliable regardless of the number of users accessing it simultaneously.

### Technology Stack and Development Architecture

The Hotel and Tour Management System was developed using a modern technology stack designed for scalability, security, and user experience:

#### **Frontend Development**

The frontend user interface was developed using Next.js 16 (a React framework), React 19 for component development, and TypeScript for type safety. Tailwind CSS 4 provides responsive styling ensuring the interface functions correctly on desktop computers and tablets. Framer Motion provides smooth animations and transitions creating a professional appearance. Radix UI components ensure accessibility for all users including those using screen readers and keyboard navigation.

The frontend includes separate interfaces for different user roles:
- **Admin Dashboard**: Complete system control including user management, room management, staff scheduling, financial reporting, and analytics.
- **Reception Interface**: Tools for managing guest check-in, food orders, invoice management, and guest services.
- **Guest Portal**: Features for booking rooms, viewing reservations, submitting complaints, providing feedback, and viewing payment history.
- **Waiter Interface**: Tools for creating food orders and tracking order status.

#### **Backend Development**

The backend server-side code was developed using Next.js API Routes, which provides serverless API endpoints without requiring separate server management. TypeScript ensures code reliability through type checking. Authentication is implemented using NextAuth.js with secure password hashing using bcryptjs, preventing plaintext password storage.

The backend implements middleware for error handling, input validation to prevent malicious data, and JWT-based session management for user authentication. All API endpoints are protected with role-based access control ensuring only authorized users can access specific endpoints.

#### **Database Development**

The system uses MongoDB as the database management system with Mongoose as the object-relational mapping (ORM) library for simplifying database interactions. The database schema includes 12 primary collections (User, Guest, Room, RoomBooking, FoodItem, FoodOrder, TourPackage, TourBooking, Invoice, Complaint, Feedback, Product) properly normalized to minimize data redundancy and maintain referential integrity.

Each database collection includes appropriate indexes on frequently queried fields to optimize query performance. Database connections implement connection pooling to handle multiple simultaneous requests efficiently. All database operations include proper transaction handling ensuring data consistency even when multiple operations are performed simultaneously.

#### **Development Tools and Environment**

Development was performed using Visual Studio Code (VS Code) as the primary IDE. Version control was managed through Git with GitHub for collaborative development and backup. Testing was performed using Postman for API testing, allowing verification of all API endpoints with various input combinations. Jest and React Testing Library were used for unit and component testing.

The development environment included:
- Node.js runtime for JavaScript execution
- npm for package dependency management
- MongoDB Atlas for cloud database hosting
- Cloudinary for cloud image storage and serving
- Nodemailer for email sending capability

### Testing Methodology and Approach

#### **Functional Testing**

Functional testing verified that each feature works exactly as specified in requirements. For each major feature (booking, food orders, invoicing, etc.), multiple test scenarios were created representing different combinations of user inputs and system states. Each test scenario specified:

1. **Initial Conditions**: The starting state before the test begins
2. **Test Steps**: Specific actions to be performed in sequence
3. **Expected Results**: The specific outcome that should occur if the feature works correctly
4. **Success Criteria**: Measurable conditions that must be true for the test to pass

Test scenarios covered both normal operation paths (where users provide valid data and follow intended workflows) and edge cases (where unusual but possible situations occur, such as attempting to book a room for dates already reserved, or submitting bookings simultaneously from multiple browsers).

#### **Data Consistency Testing**

Data consistency testing verified that information remains accurate and synchronized across all system modules. For example, when a guest books a room, the system must:
- Reduce the available count for that room type on that date
- Create a booking record linked to that guest and room
- Prepare invoice data for the guest
- Queue notification messages to send to the guest

Data consistency testing verified that all these related updates occur together without errors and that the data relationships remain intact.

#### **Integration Testing**

Integration testing verified that different system modules work together correctly. For example, the room booking module must integrate with the invoicing module so that room charges are automatically added to guest invoices. Testing verified that when a booking is created, modified, or cancelled, the invoice is automatically updated accordingly.

#### **Role-Based Access Testing**

Role-based access testing verified that each user role can access only the features they are authorized to use. For example:
- Admin users can create staff accounts and modify system settings
- Receptionists can manage guest check-in and create food orders but cannot create staff accounts
- Guests can view their own bookings but cannot view bookings of other guests
- Waiters can create food orders but cannot access financial information

Testing attempted to access restricted features from different user roles to verify that unauthorized access was properly prevented.

#### **API Endpoint Testing**

All API endpoints were tested using Postman to ensure:
- Endpoints respond with correct HTTP status codes (200 for success, 400 for bad request, 401 for unauthorized, 404 for not found)
- Response data is formatted correctly and contains all required information
- Input validation rejects invalid data with appropriate error messages
- Role-based access control is enforced at API endpoint level

### Test Execution and Results

Testing was performed systematically through test execution phases:

#### **Unit Testing Phase**

Individual functions and components were tested in isolation to verify their basic functionality. For example, the invoice calculation function was tested with various combinations of room charges, food charges, tax rates, and service charges to verify mathematical accuracy.

#### **Integration Testing Phase**

Different modules were tested together to verify proper integration. For example, the booking module and invoicing module were tested together to verify that new bookings automatically create invoice records with accurate pricing.

#### **System Testing Phase**

Complete user workflows were tested from start to finish simulating real hotel operations. For example:
1. Guest uses public website to browse available rooms
2. Guest submits booking with dates, room type, and guest information
3. System confirms booking and sends confirmation email
4. Receptionist receives notification of pending check-in
5. Receptionist processes check-in marking guest as arrived
6. Guest orders food through in-room ordering system
7. Kitchen receives order notification and prepares food
8. Waiter delivers food and marks order as served
9. System automatically adds food charges to guest invoice
10. Guest checks out and pays final bill
11. System marks booking as completed and room as needing cleaning

Each workflow was tested multiple times with different data to verify consistent correct operation.

#### **Performance Testing Considerations**

While formal performance testing was limited in scope, the system was monitored to ensure basic responsiveness:
- API responses are returned within 1-2 seconds under normal load
- Database queries complete within acceptable timeframes
- The system remains responsive when multiple users are accessing it simultaneously
- File uploads for images complete successfully and are served quickly

#### **Security Testing Approach**

While comprehensive security testing was outside the primary scope, basic security checks were performed:
- Passwords are hashed using bcryptjs and cannot be viewed directly
- API endpoints enforce role-based access control
- Input validation prevents common attack vectors
- Session management prevents unauthorized access to user accounts
- SQL injection and similar attacks are prevented through proper ORM usage

### Test Results and System Validation

All major features were tested thoroughly and verified to function correctly:

- **Authentication**: Staff members can log in securely with valid credentials. Role-based access control prevents unauthorized feature access.
- **Booking System**: Guests can search for available rooms, make reservations, modify bookings, and cancel reservations. The system accurately prevents double-booking and maintains real-time availability.
- **Food Service**: Staff can create food orders for room service and walk-in customers. Order status is tracked and charges are accurately added to invoices.
- **Tour Bookings**: Guests can book available tours linked to their room reservations. Capacity limits are enforced and tour charges are added to invoices.
- **Invoicing**: Invoices are generated accurately combining room charges, food charges, and tour charges with correct tax and service charge calculations.
- **Guest Services**: Guests can submit complaints and feedback. Staff can manage complaints and track their resolution.
- **Notifications**: Booking confirmations, payment receipts, and reminder notifications are delivered to guests appropriately.
- **Reports**: Dashboards and reports display accurate operational data helping administrators and managers make informed decisions.

All identified issues during testing were documented, analyzed, and corrected. The system was retested after corrections to verify that issues were properly resolved without introducing new problems in other areas.

---

## 4.4 Development Tools and Environment

The Hotel and Tour Management System development and testing process utilized the following tools and technologies:

### **Integrated Development Environment**

**Visual Studio Code (VS Code)** – A modern, lightweight code editor used for developing both frontend and backend code. VS Code provides syntax highlighting, code completion, debugging capabilities, and integrated terminal access making it ideal for full-stack development of the Hotel and Tour Management System.

### **Version Control and Collaboration**

**Git and GitHub** – Git is used for local version control tracking all code changes. GitHub is used for remote repository storage, enabling team collaboration, backup of code, and tracking of issues and pull requests. Every significant change to the codebase is committed to Git with descriptive messages explaining what was changed and why.

### **Testing Tools**

**Postman** – A comprehensive API testing platform used to test all backend API endpoints. Postman allows creating test collections for systematic testing of all endpoints, verifying correct responses, and testing role-based access control.

**Jest** – A JavaScript testing framework used for unit testing of JavaScript functions and React component testing. Jest enables automated testing of individual components and functions to verify correct behavior.

**React Testing Library** – A testing library focused on testing React components from a user's perspective, verifying that components render correctly and respond appropriately to user interactions.

### **Database Management**

**MongoDB Atlas** – A cloud database service providing MongoDB database hosting. MongoDB Atlas eliminates the need for managing database infrastructure while providing automatic backups and scalability.

**MongoDB Compass** – A graphical interface for viewing and managing MongoDB data, useful for debugging and verifying database contents during development and testing.

### **Cloud Services**

**Cloudinary** – A cloud storage and image processing service used for storing room images, food item images, and tour package images. Cloudinary provides image optimization, responsive image serving, and content delivery network distribution.

**Nodemailer** – A Node.js module enabling email sending from the application. Nodemailer is used to send booking confirmations, payment receipts, reminders, and notifications to guests and staff.

### **Frontend Libraries and Frameworks**

**Next.js 16** – A React framework providing server-side rendering, static site generation, and API route functionality. Next.js simplifies full-stack development by allowing frontend and backend code in the same project.

**React 19** – A JavaScript library for building user interfaces using reusable component architecture. React enables creating interactive user interfaces that respond to user interactions without full page reloads.

**Tailwind CSS 4** – A utility-first CSS framework providing pre-built CSS classes for rapid UI development. Tailwind CSS enables creating responsive layouts that work correctly on different screen sizes.

**Framer Motion** – A library providing smooth animations and transitions. Framer Motion enhances user experience by adding professional animations to interface elements.

**Radix UI** – A library of accessible UI components. Radix UI ensures that components are accessible to users with disabilities using assistive technologies.

**Recharts** – A charting library built on React components for creating interactive data visualizations. Recharts is used in dashboards and reports to display operational data visually.

**Lucide React** – A library of SVG icons used throughout the user interface for visual clarity and professional appearance.

### **Backend Framework and Libraries**

**Node.js** – A JavaScript runtime enabling JavaScript execution on the server-side. Node.js provides the foundation for server-side JavaScript development.

**Next.js API Routes** – Provides serverless API endpoints integrated within the Next.js framework, eliminating the need for separate backend server configuration.

**NextAuth.js** – An authentication library providing user authentication and session management. NextAuth.js simplifies implementing secure authentication for the system.

**Mongoose** – An Object-Document Mapping (ODM) library for MongoDB providing schema validation, query building, and relationship management.

**bcryptjs** – A password hashing library ensuring passwords are securely hashed before storage, preventing plain-text password exposure if database is compromised.

**Jose** – A JWT library for creating and verifying JSON Web Tokens used for session management and API authentication.

### **Dependency Management**

**npm** – The Node Package Manager used for installing, updating, and managing JavaScript project dependencies. npm enables tracking of all project dependencies in package.json file.

### **Environment and Configuration**

Development environment is configured with appropriate environment variables stored in .env.local file for sensitive information like database connection strings and API keys. Different environment configurations are maintained for development, testing, and production environments.

---

## Conclusion

The comprehensive system testing of the Hotel and Tour Management System verified that all major features function correctly both independently and when integrated together. Testing confirmed that the system provides secure access control, accurate room booking and availability management, correct billing calculations, proper notification delivery, and reliable role-based operations for different user types.

The system is designed to operate smoothly and reliably in production hotel environments, reducing manual operations, improving staff efficiency, and ensuring accurate data management. All identified issues during testing were resolved and verified, resulting in a reliable system ready for deployment and daily operational use by hotel staff and guests.

The testing approach employed functional testing of individual features, integration testing of module interactions, role-based access testing to verify authorization, and system-level testing of complete operational workflows. This comprehensive testing approach provides confidence that the system will operate reliably in production while maintaining data accuracy and security across all hotel operations.

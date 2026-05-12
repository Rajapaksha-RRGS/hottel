# Invoice Management Dashboard - Implementation Guide

## Overview
A complete Invoice Management Dashboard for your hotel management system that handles two types of guests:
- **Room Guests**: Billed for Room Charges + Food Orders + Tour Bookings
- **External Guests**: Billed for Food Orders only (by Table Number)

---

## Files Created

### 1. **Backend API Route** - `/app/api/invoices/route.ts`
Consolidated endpoint for fetching and updating invoices.

#### GET Endpoint
Fetches all active invoices with detailed breakdown:

```
GET /api/invoices?search=<query>
```

**Query Parameters:**
- `search` (optional): Filter by guest name, room number, or table number

**Response Structure:**
```typescript
{
  success: true,
  count: number,
  data: [
    {
      _id: string,
      guestId: string,
      guestName: string,
      guestType: "Room" | "External",
      roomNumber?: string,
      tableNumber?: string,
      roomCharge: number,
      foodTotal: number,
      tourTotal: number,
      grandTotal: number,
      paymentStatus: "Paid" | "Pending",
      bookingStatus?: string,
      lastUpdated: Date
    }
  ]
}
```

#### PATCH Endpoint
Updates payment status for room guests:

```
PATCH /api/invoices
```

**Request Body:**
```json
{
  "guestId": "string",
  "paymentStatus": "Paid" | "Pending" | "Partially-Paid",
  "guestType": "Room" | "External"
}
```

**Logic for Room Guests:**
1. Fetches the RoomBooking record by guestId
2. Retrieves all FoodOrder items where:
   - `orderType === "Room"`
   - `orderStatus === "Served"`
   - `roomBookingId` matches the booking
3. Fetches TourBooking items where:
   - `roomBookingId` matches the booking
   - `status === "Completed"`
4. Combines: `Room Price + Food Total + Tour Total = Grand Total`

**Logic for External Guests:**
1. Fetches all FoodOrder items where:
   - `orderType === "Table"`
   - `orderStatus === "Served"`
   - `tableNumber` matches
2. Sums all `totalBill` values

---

### 2. **Frontend Component** - `/components/reception/InvoiceManagement.tsx`

A complete React component with Tailwind CSS featuring:

#### Features
✅ **Searchable Invoice List**
- Real-time search by guest name, room number, or table number
- Shows guest type, amount, and payment status
- Visual indicators for Paid/Pending status

✅ **Detailed Invoice View**
- Shows breakdown for room guests:
  - Room Charges
  - Food & Beverage Total
  - Tour Bookings Total
  - Grand Total
- Shows breakdown for external guests:
  - Food & Beverage Total only
  - Grand Total

✅ **Payment Status Management**
- Toggle between "Pending" and "Paid"
- Real-time updates
- Disabled for external guest invoices (managed at POS)
- Loading states during updates

✅ **Responsive UI**
- Split-panel design (list + detail)
- Smooth animations with Framer Motion
- Error handling with retry option
- Loading states

✅ **Formatting**
- Currency formatting (USD)
- Date formatting
- Professional luxury design matching existing UI

---

## Integration Steps

### 1. Update ReceptionLayout Menu (Already Done ✓)
The component has been integrated into `/components/reception/ReceptionLayout.tsx`:
- Added DollarSign icon import
- Added "invoices" menu item with route
- Added "Invoice Management" to menu titles
- Added rendering logic in `renderContent()`

### 2. Data Flow

```
ReceptionLayout
    ↓
InvoiceManagement Component
    ↓
useEffect → GET /api/invoices
    ↓
API Route
  ├── Query Active Room Bookings
  ├── For each booking:
  │   ├── Fetch Served Food Orders
  │   ├── Fetch Completed Tours
  │   └── Calculate totals
  ├── Query Table Orders (External)
  └── Return consolidated data
    ↓
Frontend displays in two panels:
├── Invoice List (searchable)
└── Invoice Detail (breakdown)
```

---

## Database Collections Used

### RoomBooking
- `_id`: Guest ID
- `guestName`: Name for display
- `totalAmount`: Room price
- `paymentStatus`: "Pending" | "Partially-Paid" | "Paid"
- `status`: "Confirmed" | "Checked-In" | "Checked-Out" | "Cancelled"

### FoodOrder
- `roomBookingId`: Links to RoomBooking (for room guests)
- `tableNumber`: Links to table (for external guests)
- `orderType`: "Room" | "Table"
- `orderStatus`: "Pending" | "Served" | "Billed"
- `totalBill`: Order total

### TourBooking
- `roomBookingId`: Links to RoomBooking
- `totalCost`: Tour cost
- `status`: "Scheduled" | "Completed" | "Cancelled"

---

## Usage

### For Receptionist:
1. Navigate to "Invoices" in the sidebar
2. Search for a guest by name, room number, or table number
3. Click on an invoice to view full breakdown
4. Mark as "Paid" when payment is received
5. View all cost components in the detail panel

### API Usage in Other Components:
```typescript
// Fetch invoices
const response = await fetch('/api/invoices?search=John');
const { data } = await response.json();

// Update payment status
await fetch('/api/invoices', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guestId: invoiceId,
    paymentStatus: 'Paid',
    guestType: 'Room'
  })
});
```

---

## Features Summary

| Feature | Room Guests | External Guests |
|---------|-------------|-----------------|
| Room Charges | ✓ | ✗ |
| Food Orders | ✓ | ✓ |
| Tour Bookings | ✓ | ✗ |
| Search | ✓ | ✓ |
| Payment Status Tracking | ✓ | Read-only |
| Grand Total Calculation | ✓ | ✓ |

---

## Security & Permissions

✅ **Role-based Access Control**
- Only Admin, Receptionist, and Manager roles can access
- Authentication required (NextAuth session)

✅ **Data Integrity**
- External guest invoices cannot be modified via API
- Only FoodOrder items with status "Served" are included
- Only completed tours are included

✅ **Error Handling**
- Comprehensive error messages
- Validation of payment status values
- Try-catch blocks with detailed logging

---

## Future Enhancements

1. **Export Functionality**: Generate PDF invoices
2. **Partial Payments**: Split payment tracking
3. **Invoice History**: Track payment dates and methods
4. **Refunds**: Handle refund scenarios
5. **Batch Operations**: Mark multiple invoices as paid
6. **Print Invoice**: Direct printing from detail view
7. **Email Invoice**: Send invoice to guest email
8. **Payment Methods**: Track payment method (Card, Cash, etc.)

---

## Testing Checklist

- [ ] Search filters work correctly
- [ ] Invoice details display correct totals
- [ ] Payment status updates in real-time
- [ ] API returns 401 for unauthorized users
- [ ] Error messages display properly
- [ ] Loading states show during fetch
- [ ] Room guest invoices show all three components
- [ ] External guest invoices show only food total
- [ ] External guest "Paid" button is disabled
- [ ] Animations are smooth
- [ ] Mobile responsive layout works

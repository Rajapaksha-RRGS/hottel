// --- User Roles ---
export type UserRole = 'Admin' | 'Waiter' | 'Receptionist' | 'Manager';

// --- Room Management ---
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type RoomType = 'Standard' | 'Deluxe' | 'Beach-Cabana' | 'Family-Suite';

// --- Booking & Reservations ---
export type BookingStatus = 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';

// --- Food & Beverage ---
export type FoodCategory = 'Appetizer' | 'Main' | 'Dessert' | 'Beverage' | 'Cocktail' | 'Shot';
export type OrderStatus = 'Pending' | 'Served' | 'Billed' | 'Cancelled';

// --- Excursions (Tours) ---
export type TourStatus = 'Scheduled' | 'Completed' | 'Cancelled';

// --- Financials ---
export type PaymentStatus = 'Pending' | 'Partially-Paid' | 'Paid' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Card' | 'Online-Transfer';

// --- Consolidated Invoice Type (For Frontend/API display) ---
export interface IInvoiceSummary {
  invoiceNumber: string;
  guestName: string;
  roomCharges: number;
  foodCharges: number;
  tourCharges: number;
  grandTotal: number;
  isPaid: boolean;
}
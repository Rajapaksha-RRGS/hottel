export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface InvoiceData {
  _id: string;
  guestId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  guestType: 'Room' | 'External';
  roomNumber?: string;
  tableNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  nights?: number;
  roomCharge: number;
  foodTotal: number;
  tourTotal: number;
  grandTotal: number;
  advancePayment: number;
  balanceDue: number;
  foodItems: InvoiceItem[];
  tourItems: InvoiceItem[];
  paymentStatus: 'Paid' | 'Pending';
  bookingStatus?: string;
  lastUpdated: string | Date;
}

export type StatusFilter = 'Pending' | 'Paid' | 'All';
export type TypeFilter = 'All' | 'Room' | 'External';
export type PaymentMethod = 'Cash' | 'Card' | 'Online Transfer';

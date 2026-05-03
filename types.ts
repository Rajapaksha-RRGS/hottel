/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Reservation {
  id: number;
  guest: string;
  time: string;
  guests: number;
  table: number;
  status: "confirmed" | "pending" | "arrived";
  bookDate: string;
  cancelDate: string;
}

export interface Category {
  id: string;
  label: string;
  count: number;
  icon: string;
  color: string;
  iconColor: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface Table {
  num: number;
  guest: string;
  items: number;
  status: "active" | "process";
}

export interface Staff {
  id: number;
  name: string;
  initial: string;
  color: string;
}

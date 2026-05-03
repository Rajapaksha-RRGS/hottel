/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, MenuItem, Table, OrderItem, Reservation, Staff } from "../../types";

export const NAV = [
  { id: "menu", label: "Menu", icon: "🍽" },
  { id: "reservation", label: "Reservation", icon: "📅" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export const STAFF: Staff[] = [
  { id: 1, name: "John", initial: "J", color: "#ff6b6b" },
  { id: 2, name: "Sarah", initial: "S", color: "#4ecdc4" },
  { id: 3, name: "Mike", initial: "M", color: "#45b7d1" },
  { id: 4, name: "Emma", initial: "E", color: "#f0ad4e" },
  { id: 5, name: "David", initial: "D", color: "#9b59b6" },
];

export const CATEGORIES: Category[] = [
  { id: "maincourse", label: "Main", count: 12, icon: "🍖", color: "#fce4ec", iconColor: "#d81b60" },
  { id: "appetizer", label: "App.", count: 8, icon: "🥗", color: "#c8e6c9", iconColor: "#2e7d32" },
  { id: "beverage", label: "Drink", count: 15, icon: "🍹", color: "#b3e5fc", iconColor: "#0277bd" },
  { id: "dessert", label: "Sweet", count: 10, icon: "🍰", color: "#fff9c4", iconColor: "#f57f17" },
];

export const CAT_ITEMS: Record<string, MenuItem[]> = {
  maincourse: [
    { id: 1, name: "Grilled Steak", price: 28.99 },
    { id: 2, name: "Salmon Fillet", price: 24.99 },
    { id: 3, name: "Chicken Parmesan", price: 19.99 },
    { id: 4, name: "Lamb Chops", price: 32.99 },
    { id: 5, name: "Beef Tenderloin", price: 35.99 },
    { id: 6, name: "Duck Confit", price: 26.99 },
    { id: 7, name: "Pasta Carbonara", price: 16.99 },
    { id: 8, name: "Lobster Tail", price: 42.99 },
    { id: 9, name: "Vegan Buddha Bowl", price: 18.99 },
    { id: 10, name: "Truffle Risotto", price: 22.99 },
    { id: 11, name: "Seafood Paella", price: 28.99 },
    { id: 12, name: "Herb Brined Turkey", price: 25.99 },
  ],
  appetizer: [
    { id: 101, name: "Caesar Salad", price: 11.99 },
    { id: 102, name: "Shrimp Cocktail", price: 14.99 },
    { id: 103, name: "Bruschetta", price: 8.99 },
    { id: 104, name: "Calamari Fritti", price: 12.99 },
    { id: 105, name: "Cheese Board", price: 16.99 },
    { id: 106, name: "Spring Rolls", price: 9.99 },
    { id: 107, name: "Nachos Supreme", price: 10.99 },
    { id: 108, name: "Escargot", price: 13.99 },
  ],
  beverage: [
    { id: 201, name: "Coca Cola", price: 2.99 },
    { id: 202, name: "Fresh Orange Juice", price: 4.99 },
    { id: 203, name: "Iced Tea", price: 3.99 },
    { id: 204, name: "Coffee Espresso", price: 3.49 },
    { id: 205, name: "Red Wine Glass", price: 8.99 },
    { id: 206, name: "White Wine Glass", price: 8.99 },
    { id: 207, name: "Beer (Draft)", price: 5.99 },
    { id: 208, name: "Mojito", price: 9.99 },
    { id: 209, name: "Margarita", price: 10.99 },
    { id: 210, name: "Piña Colada", price: 10.99 },
    { id: 211, name: "Champagne", price: 12.99 },
    { id: 212, name: "Espresso Martini", price: 11.99 },
    { id: 213, name: "Old Fashioned", price: 11.99 },
    { id: 214, name: "Cosmopolitan", price: 10.99 },
    { id: 215, name: "Sparkling Water", price: 2.49 },
  ],
  dessert: [
    { id: 301, name: "Chocolate Cake", price: 7.99 },
    { id: 302, name: "Cheesecake", price: 8.99 },
    { id: 303, name: "Tiramisu", price: 8.99 },
    { id: 304, name: "Crème Brûlée", price: 9.99 },
    { id: 305, name: "Sorbet", price: 6.99 },
    { id: 306, name: "Ice Cream Sundae", price: 7.99 },
    { id: 307, name: "Panna Cotta", price: 8.99 },
    { id: 308, name: "Fruit Tart", price: 7.99 },
    { id: 309, name: "Mousse au Chocolat", price: 8.99 },
    { id: 310, name: "Baklava", price: 6.99 },
  ],
};

export const TABLES: Table[] = [
  { num: 1, guest: "John D.", items: 3, status: "active" },
  { num: 2, guest: "Sarah M.", items: 0, status: "active" },
  { num: 3, guest: "Mike P.", items: 5, status: "process" },
  { num: 4, guest: "Leslie K.", items: 2, status: "active" },
  { num: 5, guest: "Emma W.", items: 0, status: "active" },
  { num: 6, guest: "David R.", items: 4, status: "process" },
  { num: 7, guest: "Lisa T.", items: 1, status: "active" },
  { num: 8, guest: "James H.", items: 0, status: "active" },
];

export const INIT_ORDER: OrderItem[] = [];

export const INIT_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    guest: "John Smith",
    time: "7:00 PM",
    guests: 4,
    table: 1,
    status: "confirmed",
    bookDate: "2024-05-10",
    cancelDate: "",
  },
  {
    id: 2,
    guest: "Sarah Johnson",
    time: "7:30 PM",
    guests: 2,
    table: 2,
    status: "confirmed",
    bookDate: "2024-05-10",
    cancelDate: "",
  },
  {
    id: 3,
    guest: "Michael Brown",
    time: "8:00 PM",
    guests: 6,
    table: 3,
    status: "pending",
    bookDate: "2024-05-10",
    cancelDate: "",
  },
];

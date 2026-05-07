export const mockReceptionOrdersData = {
  success: true,
  data: {
    pendingFoodOrders: [
      {
        _id: "order-001",
        orderStatus: "Pending",
        roomBookingId: {
          _id: "booking-001",
          guestName: "John Doe",
          room: {
            _id: "room-101",
            roomNumber: 101,
          },
        },
        items: [
          {
            quantity: 2,
            foodItem: {
              _id: "food-001",
              name: "Caesar Salad",
              price: 12.99,
              category: "Appetizers",
            },
            subTotal: 25.98,
          },
          {
            quantity: 1,
            foodItem: {
              _id: "food-002",
              name: "Grilled Salmon",
              price: 28.99,
              category: "Main Course",
            },
            subTotal: 28.99,
          },
        ],
        totalBill: 54.97,
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        _id: "order-002",
        orderStatus: "Pending",
        roomBookingId: {
          _id: "booking-002",
          guestName: "Jane Smith",
          room: {
            _id: "room-205",
            roomNumber: 205,
          },
        },
        items: [
          {
            quantity: 1,
            foodItem: {
              _id: "food-003",
              name: "Margherita Pizza",
              price: 16.99,
              category: "Main Course",
            },
            subTotal: 16.99,
          },
          {
            quantity: 2,
            foodItem: {
              _id: "food-004",
              name: "Tiramisu",
              price: 8.99,
              category: "Desserts",
            },
            subTotal: 17.98,
          },
          {
            quantity: 1,
            foodItem: {
              _id: "food-005",
              name: "Fresh Orange Juice",
              price: 4.99,
              category: "Beverages",
            },
            subTotal: 4.99,
          },
        ],
        totalBill: 39.96,
        createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
      },
      {
        _id: "order-003",
        orderStatus: "Pending",
        roomBookingId: {
          _id: "booking-003",
          guestName: "Michael Johnson",
          room: {
            _id: "room-312",
            roomNumber: 312,
          },
        },
        items: [
          {
            quantity: 3,
            foodItem: {
              _id: "food-006",
              name: "Espresso",
              price: 3.99,
              category: "Beverages",
            },
            subTotal: 11.97,
          },
          {
            quantity: 2,
            foodItem: {
              _id: "food-007",
              name: "Croissant",
              price: 5.99,
              category: "Breakfast",
            },
            subTotal: 11.98,
          },
        ],
        totalBill: 23.95,
        createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
      },
      {
        _id: "order-004",
        orderStatus: "Pending",
        roomBookingId: {
          _id: "booking-004",
          guestName: "Emily Williams",
          room: {
            _id: "room-415",
            roomNumber: 415,
          },
        },
        items: [
          {
            quantity: 1,
            foodItem: {
              _id: "food-008",
              name: "Ribeye Steak",
              price: 42.99,
              category: "Main Course",
            },
            subTotal: 42.99,
          },
          {
            quantity: 1,
            foodItem: {
              _id: "food-009",
              name: "Baked Potato with Butter",
              price: 6.99,
              category: "Sides",
            },
            subTotal: 6.99,
          },
          {
            quantity: 1,
            foodItem: {
              _id: "food-010",
              name: "Red Wine Glass",
              price: 12.99,
              category: "Beverages",
            },
            subTotal: 12.99,
          },
        ],
        totalBill: 62.97,
        createdAt: new Date(Date.now() - 1 * 60000).toISOString(),
      },
    ],
  },
};

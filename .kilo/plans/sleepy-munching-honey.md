# Plan: Room Management - Full API Integration

## Context
The `RoomManagement.tsx` component currently uses hardcoded room data. We need to:
1. Create a proper API route for Room CRUD operations
2. Replace hardcoded data with live MongoDB data
3. Add a modal form to create new rooms via POST request

## Files to Modify/Create

### 1. `app/api/admin/room/route.ts` (new, use lowercase `room`)
- **GET** handler: Fetch all rooms from MongoDB using `Room.find({})`
- **POST** handler: Validate and create a new room document
- Use `connectDB()` from `lib/mongoose` (same pattern as `products/route.ts`)
- Return `{ ok, data/message }` JSON responses

### 2. `components/admin/RoomManagement.tsx`
- Replace hardcoded `rooms` array with `useState` + `useEffect` fetch from `/api/admin/room`
- Add a modal dialog (native `<dialog>` element) for the "Add Room" form
- Form fields matching RoomSchema:
  - `roomNumber` - text input (required)
  - `type` - select dropdown (Standard, Deluxe, Beach-Cabana, Family-Suite)
  - `status` - select dropdown (Available, Occupied, Cleaning, Maintenance)
  - `pricePerNight` - number input (required)
  - `maxOccupancy` - number input
  - `amenities` - checkbox group (AC, Free WiFi, TV, Sea View, Mini Bar, Bath)
  - `description` - textarea
- On submit: POST to `/api/admin/room`, close modal, refresh room list
- Map new RoomSchema fields to existing card display (roomNumber -> card id, etc.)
- Add loading state while fetching
- Add `X` close icon from lucide-react

## Implementation Order
1. Implement the API route (GET + POST) at `app/api/admin/room/route.ts`
2. Update RoomManagement.tsx (fetch, form, modal)

export interface Room {
  id: string;
  name: string;
  category: 'Suite' | 'Deluxe' | 'Villa';
  price: number;
  image: string;
  gallery: string[];
  sqft: number;
  bedType: string;
  viewType: string;
  amenities: string[];
  description: string;
  maxGuests: number;
}

export const roomsData: Room[] = [
  {
    id: '1',
    name: 'Ocean View Suite',
    category: 'Suite',
    price: 450,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=80',
      'https://images.unsplash.com/photo-1684359432679-eac58cb4b68b?w=1000&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1000&q=80',
    ],
    sqft: 450,
    bedType: 'King Bed',
    viewType: 'Ocean Front',
    amenities: ['Wifi', 'AC', 'Pool', 'Spa', 'SeaView'],
    description: 'Luxurious ocean-facing suite with private balcony and premium amenities.',
    maxGuests: 2,
  },
  {
    id: '2',
    name: 'Deluxe Beach Villa',
    category: 'Villa',
    price: 750,
    image: 'https://images.unsplash.com/photo-1582719716191-c79c0b6b8cd2?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719716191-c79c0b6b8cd2?w=1000&q=80',
      'https://images.unsplash.com/photo-1591825157149-91e79786e144?w=1000&q=80',
      'https://images.unsplash.com/photo-1566688021443-b4ad4316c57e?w=1000&q=80',
    ],
    sqft: 850,
    bedType: 'King + Guest Beds',
    viewType: 'Direct Beach Access',
    amenities: ['Wifi', 'AC', 'Pool', 'Sauna', 'SeaView', 'Spa'],
    description: 'Exclusive beachfront villa with private pool and direct sand access.',
    maxGuests: 4,
  },
  {
    id: '3',
    name: 'Tropical Deluxe Room',
    category: 'Deluxe',
    price: 320,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80',
      'https://images.unsplash.com/photo-1591825157149-91e79786e144?w=1000&q=80',
      'https://images.unsplash.com/photo-1598394014487-681ba749b12f?w=1000&q=80',
    ],
    sqft: 350,
    bedType: 'Queen Bed',
    viewType: 'Garden View',
    amenities: ['Wifi', 'AC', 'Pool'],
    description: 'Comfortable deluxe room with modern furnishings and garden views.',
    maxGuests: 2,
  },
  {
    id: '4',
    name: 'Premium Penthouse',
    category: 'Suite',
    price: 950,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1000&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=80',
      'https://images.unsplash.com/photo-1584394838336-abadf3c7b1fc?w=1000&q=80',
    ],
    sqft: 1200,
    bedType: 'King Bed + Terrace Lounge',
    viewType: 'Panoramic Ocean',
    amenities: ['Wifi', 'AC', 'Pool', 'Sauna', 'SeaView', 'Spa', 'Gym'],
    description: 'Stunning penthouse with panoramic views and exclusive rooftop access.',
    maxGuests: 3,
  },
  {
    id: '5',
    name: 'Sunset Villa Retreat',
    category: 'Villa',
    price: 680,
    image: 'https://images.unsplash.com/photo-1534612666312-a1a2f81e0d4e?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534612666312-a1a2f81e0d4e?w=1000&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80',
    ],
    sqft: 720,
    bedType: 'King + Twin Beds',
    viewType: 'Sunset View',
    amenities: ['Wifi', 'AC', 'Pool', 'SeaView', 'Spa'],
    description: 'Exclusive villa perfect for sunset views and intimate getaways.',
    maxGuests: 3,
  },
  {
    id: '6',
    name: 'Garden Studio',
    category: 'Deluxe',
    price: 280,
    image: 'https://images.unsplash.com/photo-1595576142207-fd0cf1b8e889?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595576142207-fd0cf1b8e889?w=1000&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1000&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80',
    ],
    sqft: 280,
    bedType: 'Queen Bed',
    viewType: 'Tropical Garden',
    amenities: ['Wifi', 'AC', 'Pool'],
    description: 'Cozy studio with beautiful tropical garden views and modern amenities.',
    maxGuests: 2,
  },
];

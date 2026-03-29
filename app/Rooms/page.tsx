'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";
import FilterBar from "@/app/components/FilterBar";
import RoomCard from "@/app/components/RoomCard";
import QuickViewDrawer from "@/app/components/QuickViewDrawer";
import Navigation from "@/app/components/Herder";
import Footer from "@/app/components/Footer";

interface Room {
  id: string;
  name: string;
  category: string;
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

export default function RoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const { searchData } = useSearch();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<{
    category: string | null;
    maxPrice: number;
  }>({
    category: null,
    maxPrice: 1000,
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRoom = (room: any): Room => {
    const fallbackImage =
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";
    const image = room?.images?.[0] || room?.image || fallbackImage;
    const gallery = room?.images?.length ? room.images : [image];
    return {
      id:
        room._id?.toString?.() ||
        room.id ||
        room.roomNumber ||
        crypto.randomUUID(),
      name: room.name || room.roomNumber || "Luxury Suite",
      category: room.type || room.category || "Suite",
      price: room.pricePerNight || room.price || 0,
      image,
      gallery,
      sqft: room.sqft || 450,
      bedType: room.bedType || "King Bed",
      viewType: room.viewType || "Premium View",
      amenities: room.amenities || ["Wifi", "AC", "Pool"],
      description:
        room.description ||
        "Experience refined comfort with curated amenities and thoughtful details.",
      maxGuests: room.maxOccupancy || room.maxGuests || 2,
    };
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = "/api/rooms";

        if (searchData && searchData.checkIn && searchData.checkOut) {
          console.log("🔍 Using search context data:", searchData);

          endpoint = `/api/rooms/available?checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}`;
        } else {
          console.log("🔍 No search context data, fetching all rooms");
        }
        //api ekata call karamu

        const res = await fetch(endpoint, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load rooms");
        }

        const roomsPayload = data.rooms || data;
        const mappedRooms = Array.isArray(roomsPayload)
          ? roomsPayload.map(mapRoom)
          : [];

        setRooms(mappedRooms);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchData]);

  // Filter rooms based on selected filters
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const categoryMatch =
        !filters.category || room.category === filters.category;
      const priceMatch = room.price <= filters.maxPrice;
      return categoryMatch && priceMatch;
    });
  }, [rooms, filters]);

  const handleFilterChange = (category: string | null, maxPrice: number) => {
    setFilters({ category, maxPrice });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <Navigation />
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Parallax Background */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80")',
              backgroundAttachment: "fixed",
            }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white uppercase text-sm font-light tracking-widest mb-4"
          >
            Luxury Accommodation
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Our Sanctuary
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 }}
            className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            Experience unparalleled luxury and comfort in our exquisitely
            designed rooms and suites, each offering breathtaking views and
            world-class amenities
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-10"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold uppercase tracking-widest hover:shadow-2xl transition-all"
            >
              Explore Suites
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 z-10 text-white text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm uppercase tracking-widest font-light">
              Scroll to explore
            </p>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Rooms Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {filters.category
              ? `Our ${filters.category}s`
              : "All Rooms & Suites"}
          </h2>
          <p className="text-gray-600 text-lg">
            {loading
              ? "Loading rooms..."
              : `${filteredRooms.length} luxurious options available`}
          </p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </motion.div>

        {/* Rooms Grid - Bento Layout */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-lg">Loading available rooms...</p>
          </motion.div>
        ) : filteredRooms.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <RoomCard
                  room={room}
                  onQuickView={setSelectedRoom}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-lg mb-6">
              No rooms available for these dates. Try different dates or clear
              filters.
            </p>
            <button
              onClick={() => router.push("/rooms")}
              className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-purple-900 to-pink-900 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-white text-center mb-12"
          >
            Premium Amenities
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Luxury Bedding",
              "Spa Access",
              "Ocean Views",
              "Fine Dining",
              "24/7 Room Service",
              "Concierge",
              "Fitness Center",
              "Beach Access",
            ].map((amenity, index) => (
              <motion.div
                key={amenity}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center hover:bg-white/20 transition"
              >
                <p className="text-white font-semibold">{amenity}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Drawer */}
      <QuickViewDrawer
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
      <Footer />
    </div>
  );
}
